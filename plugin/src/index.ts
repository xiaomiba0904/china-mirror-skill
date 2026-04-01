/**
 * China Mirror Plugin for OpenClaw
 *
 * 自动检测包下载命令，自动添加国内镜像源参数加速下载
 * 支持 npm、pip、uv、cargo、brew、go 等主流包管理器
 */

import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import type { OpenClawPluginApi, ToolCallEvent } from "openclaw/plugin-sdk/types";

// 镜像源配置（大厂/高校背书）
const MIRROR_SOURCES = {
  npm: {
    name: "淘宝 npmmirror",
    url: "https://registry.npmmirror.com",
    backer: "阿里巴巴",
    paramFlag: "--registry",
    patterns: [/npm\s+(install|i|add|update|ci)\b/, /yarn\s+(install|add)\b/, /pnpm\s+(install|add)\b/],
  },
  pip: {
    name: "清华 PyPI",
    url: "https://pypi.tuna.tsinghua.edu.cn/simple",
    backer: "清华大学",
    paramFlag: "-i",
    patterns: [/pip\s+install\b/, /pip3\s+install\b/],
  },
  uv: {
    name: "清华 PyPI (uv)",
    url: "https://pypi.tuna.tsinghua.edu.cn/simple",
    backer: "清华大学",
    paramFlag: "--index-url",
    patterns: [/uv\s+(pip\s+install|add|sync)\b/],
  },
  cargo: {
    name: "中科大 Cargo",
    url: "https://mirrors.ustc.edu.cn/crates.io-index",
    backer: "中科大",
    paramFlag: null, // cargo 不支持命令行参数，需配置文件
    patterns: [/cargo\s+(install|update|build)\b/],
  },
  rustup: {
    name: "中科大 Rustup",
    url: "https://mirrors.ustc.edu.cn/rust-static",
    backer: "中科大",
    paramFlag: null,
    patterns: [/rustup\s+/],
  },
  go: {
    name: "七牛云 GoProxy",
    url: "https://goproxy.cn",
    backer: "七牛云",
    paramFlag: null, // go 依赖 GOPROXY 环境变量
    patterns: [/go\s+(get|install|mod\s+download)\b/],
  },
  brew: {
    name: "清华 Homebrew",
    url: "https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/",
    backer: "清华大学",
    paramFlag: null,
    patterns: [/brew\s+(install|upgrade|update)\b/],
  },
  docker: {
    name: "中科大 Docker",
    url: "https://docker.mirrors.ustc.edu.cn",
    backer: "中科大",
    paramFlag: null,
    patterns: [/docker\s+(pull|build)\b/],
  },
  maven: {
    name: "阿里云 Maven",
    url: "https://maven.aliyun.com/repository/public",
    backer: "阿里巴巴",
    paramFlag: null,
    patterns: [/mvn\s+/],
  },
};

// 已配置镜像的检测模式
const MIRROR_CONFIGURED_PATTERNS = {
  npm: [/registry\.npmmirror\.com/, /repo\.huaweicloud\.com\/repository\/npm/],
  pip: [/pypi\.tuna\.tsinghua\.edu\.cn/, /mirrors\.aliyun\.com\/pypi/, /pypi\.mirrors\.ustc\.edu\.cn/],
  uv: [/pypi\.tuna\.tsinghua\.edu\.cn/, /mirrors\.aliyun\.com\/pypi/],
  cargo: [/mirrors\.ustc\.edu\.cn\/crates\.io-index/, /rsproxy\.cn/],
  go: [/goproxy\.cn/, /goproxy\.io/, /mirrors\.aliyun\.com\/goproxy/],
};

interface MirrorHint {
  tool: string;
  mirrorName: string;
  mirrorUrl: string;
  backer: string;
  originalCommand: string;
  modifiedCommand: string | null; // null 表示无法通过参数修改
  canModify: boolean;
}

/**
 * 检测命令是否触发包下载
 */
function detectPackageDownload(command: string): MirrorHint | null {
  for (const [tool, config] of Object.entries(MIRROR_SOURCES)) {
    for (const pattern of config.patterns) {
      if (pattern.test(command)) {
        // 检查是否已指定镜像参数
        if (isMirrorSpecified(command, tool)) {
          return null; // 已指定镜像，不需要处理
        }

        // 生成带镜像参数的命令
        const modifiedCommand = generateCommandWithMirror(command, tool, config.url, config.paramFlag);

        return {
          tool,
          mirrorName: config.name,
          mirrorUrl: config.url,
          backer: config.backer,
          originalCommand: command,
          modifiedCommand,
          canModify: config.paramFlag !== null,
        };
      }
    }
  }
  return null;
}

/**
 * 检查命令是否已指定镜像参数
 */
function isMirrorSpecified(command: string, tool: string): boolean {
  switch (tool) {
    case "npm":
      return command.includes("--registry=") || command.includes("--registry ");
    case "pip":
      return command.includes("-i ") || command.includes("--index-url ") || command.includes("--index-url=");
    case "uv":
      return command.includes("--index-url ") || command.includes("--index-url=") || command.includes("--extra-index-url ");
    case "cargo":
    case "rustup":
    case "go":
    case "brew":
    case "docker":
    case "maven":
      return false; // 这些工具不支持命令行镜像参数
    default:
      return false;
  }
}

/**
 * 生成带镜像参数的命令
 */
function generateCommandWithMirror(
  command: string,
  tool: string,
  mirrorUrl: string,
  paramFlag: string | null
): string | null {
  if (!paramFlag) {
    return null; // 不支持命令行参数
  }

  // 根据工具类型添加参数
  switch (tool) {
    case "npm":
      // npm/pnpm/yarn 使用 --registry
      return `${command} --registry=${mirrorUrl}`;
    case "pip":
      // pip 使用 -i
      return `${command} -i ${mirrorUrl}`;
    case "uv":
      // uv 使用 --index-url
      return `${command} --index-url ${mirrorUrl}`;
    default:
      return null;
  }
}

/**
 * 生成镜像提示消息
 */
function generateMirrorHint(hint: MirrorHint): string {
  if (hint.canModify && hint.modifiedCommand) {
    // 可以自动添加镜像参数
    return [
      `🔄 已自动添加国内镜像源参数加速下载：`,
      ``,
      `**原命令：**`,
      `\`\`\`bash`,
      hint.originalCommand,
      `\`\`\``,
      ``,
      `**修改后：**`,
      `\`\`\`bash`,
      hint.modifiedCommand,
      `\`\`\``,
      ``,
      `**镜像源：** ${hint.mirrorName}（${hint.backer}背书 ✅）`,
      ``,
      `请使用修改后的命令执行。`,
    ].join("\n");
  } else {
    // 需要配置文件
    return [
      `💡 此命令需要下载，建议先配置镜像源：`,
      ``,
      `**工具：** ${hint.tool}`,
      `**推荐镜像：** ${hint.mirrorName}（${hint.backer}背书 ✅）`,
      ``,
      `运行一键配置脚本：`,
      `\`\`\`bash`,
      `~/.agents/skills/china-mirror/scripts/setup-all.sh`,
      `\`\`\``,
    ].join("\n");
  }
}

/**
 * 插件主入口
 */
export default definePluginEntry({
  id: "china-mirror",
  name: "China Mirror",
  description: "自动检测包下载命令，自动添加国内镜像源参数",

  configSchema: {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        default: true,
        description: "启用镜像源检测",
      },
      autoModify: {
        type: "boolean",
        default: true,
        description: "自动添加镜像参数到命令",
      },
      showHint: {
        type: "boolean",
        default: true,
        description: "显示镜像源配置提示",
      },
      silent: {
        type: "boolean",
        default: false,
        description: "静默模式，仅在日志中记录",
      },
    },
    additionalProperties: false,
  },

  register(api: OpenClawPluginApi) {
    const config = api.pluginConfig as {
      enabled?: boolean;
      autoModify?: boolean;
      showHint?: boolean;
      silent?: boolean;
    };
    const enabled = config.enabled !== false;
    const autoModify = config.autoModify !== false;
    const showHint = config.showHint !== false;
    const silent = config.silent === true;

    if (!enabled) {
      api.logger.info("China mirror detection is disabled");
      return;
    }

    // 注册 before_tool_call hook
    api.registerHook(
      ["before_tool_call"],
      async (event: ToolCallEvent) => {
        // 只检查 exec/process 相关工具
        const toolName = event.toolName;
        if (toolName !== "exec" && toolName !== "process") {
          return {}; // 不干预其他工具
        }

        // 获取命令内容
        const params = event.params as { command?: string; args?: string[] };
        const command = params.command || (params.args?.join(" ") || "");

        if (!command) {
          return {};
        }

        // 检测包下载
        const hint = detectPackageDownload(command);

        if (!hint) {
          return {}; // 不是包下载命令，继续执行
        }

        if (silent) {
          api.logger.info(`[China Mirror] ${hint.tool} download detected: ${hint.mirrorName}`);
          return {}; // 静默模式，继续执行
        }

        if (autoModify && hint.canModify && hint.modifiedCommand) {
          // 自动修改命令
          api.logger.info(`[China Mirror] Auto-modifying command with mirror: ${hint.tool} -> ${hint.mirrorName}`);

          // 返回提示消息，让 AI 使用修改后的命令
          return {
            message: generateMirrorHint(hint),
          };
        }

        if (showHint) {
          // 显示提示
          return {
            message: generateMirrorHint(hint),
          };
        }

        return {};
      },
      { priority: 100 } // 高优先级，先执行
    );

    // 注册 slash command
    api.registerCommand({
      name: "/mirror",
      description: "查看或配置镜像源",
      handler: async (context) => {
        const { args } = context;
        const subCommand = args?.trim() || "status";

        switch (subCommand) {
          case "status":
            return {
              content: [
                {
                  type: "text",
                  text: generateStatusReport(),
                },
              ],
            };
          case "setup":
            return {
              content: [
                {
                  type: "text",
                  text: [
                    `# 配置国内镜像源`,
                    ``,
                    `运行一键配置脚本：`,
                    `\`\`\`bash`,
                    `~/.agents/skills/china-mirror/scripts/setup-all.sh`,
                    `\`\`\``,
                  ].join("\n"),
                },
              ],
            };
          case "restore":
            return {
              content: [
                {
                  type: "text",
                  text: [
                    `# 恢复默认配置`,
                    ``,
                    `运行恢复脚本：`,
                    `\`\`\`bash`,
                    `~/.agents/skills/china-mirror/scripts/restore-default.sh`,
                    `\`\`\``,
                  ].join("\n"),
                },
              ],
            };
          default:
            return {
              content: [
                {
                  type: "text",
                  text: [
                    `# /mirror 命令`,
                    ``,
                    `用法: \`/mirror [status|setup|restore]\``,
                    ``,
                    `- \`status\` - 查看当前镜像配置`,
                    `- \`setup\` - 配置国内镜像源`,
                    `- \`restore\` - 恢复默认配置`,
                  ].join("\n"),
                },
              ],
            };
        }
      },
    });

    api.logger.info("China Mirror plugin registered successfully");
  },
});

/**
 * 生成镜像状态报告
 */
function generateStatusReport(): string {
  const lines = [
    `# 镜像源配置状态`,
    ``,
    `支持的镜像源（均为大厂/高校背书）：`,
    ``,
    `| 工具 | 镜像源 | 背书方 | 支持命令行参数 |`,
    `|------|--------|--------|----------------|`,
  ];

  for (const [tool, config] of Object.entries(MIRROR_SOURCES)) {
    const canModify = config.paramFlag !== null ? "✅" : "❌";
    lines.push(`| ${tool} | ${config.name} | ${config.backer} | ${canModify} |`);
  }

  lines.push("");
  lines.push("**说明：**");
  lines.push("- ✅ 支持命令行参数：执行命令时自动添加镜像参数");
  lines.push("- ❌ 需配置文件：运行 `~/.agents/skills/china-mirror/scripts/setup-all.sh` 一键配置");
  lines.push("");
  lines.push("查看当前配置：");
  lines.push("```bash");
  lines.push("~/.agents/skills/china-mirror/scripts/show-status.sh");
  lines.push("```");

  return lines.join("\n");
}