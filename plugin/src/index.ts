/**
 * China Mirror Plugin for OpenClaw
 *
 * 自动检测包下载命令，提示配置国内镜像源加速
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
    checkCmd: "npm config get registry",
    setCmd: "npm config set registry https://registry.npmmirror.com",
    patterns: [/npm\s+(install|i|add|update)\b/, /yarn\s+(install|add)\b/, /pnpm\s+(install|add)\b/],
  },
  pip: {
    name: "清华 PyPI",
    url: "https://pypi.tuna.tsinghua.edu.cn/simple",
    backer: "清华大学",
    checkCmd: "pip config list",
    setCmd: "pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple",
    patterns: [/pip\s+install\b/, /pip3\s+install\b/],
  },
  uv: {
    name: "清华 PyPI (uv)",
    url: "https://pypi.tuna.tsinghua.edu.cn/simple",
    backer: "清华大学",
    checkCmd: "echo $UV_INDEX_URL",
    setCmd: "export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple",
    patterns: [/uv\s+(pip\s+install|add|sync|tool\s+install)\b/, /uv\s+run\b/],
  },
  cargo: {
    name: "中科大 Cargo",
    url: "https://mirrors.ustc.edu.cn/crates.io-index",
    backer: "中科大",
    checkCmd: "cat ~/.cargo/config.toml 2>/dev/null || echo 'not configured'",
    setCmd: "echo '[source.crates-io]\nreplace-with = \"ustc\"\n[source.ustc]\nregistry = \"https://mirrors.ustc.edu.cn/crates.io-index\"' > ~/.cargo/config.toml",
    patterns: [/cargo\s+(install|update|build)\b/],
  },
  rustup: {
    name: "中科大 Rustup",
    url: "https://mirrors.ustc.edu.cn/rust-static",
    backer: "中科大",
    checkCmd: "echo $RUSTUP_DIST_SERVER",
    setCmd: "export RUSTUP_DIST_SERVER=https://mirrors.ustc.edu.cn/rust-static && export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup",
    patterns: [/rustup\s+/],
  },
  go: {
    name: "七牛云 GoProxy",
    url: "https://goproxy.cn",
    backer: "七牛云",
    checkCmd: "go env GOPROXY",
    setCmd: "go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct",
    patterns: [/go\s+(get|install|mod\s+download)\b/],
  },
  brew: {
    name: "清华 Homebrew",
    url: "https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/",
    backer: "清华大学",
    checkCmd: "brew config | grep HOMEBREW_API_DOMAIN",
    setCmd: "# 参见 SKILL.md 中的完整配置脚本",
    patterns: [/brew\s+(install|upgrade|update)\b/],
  },
  docker: {
    name: "中科大 Docker",
    url: "https://docker.mirrors.ustc.edu.cn",
    backer: "中科大",
    checkCmd: "cat /etc/docker/daemon.json 2>/dev/null || cat ~/.docker/daemon.json 2>/dev/null || echo 'not configured'",
    setCmd: "# 需编辑 /etc/docker/daemon.json 或 ~/.docker/daemon.json",
    patterns: [/docker\s+(pull|build)\b/],
  },
  maven: {
    name: "阿里云 Maven",
    url: "https://maven.aliyun.com/repository/public",
    backer: "阿里巴巴",
    checkCmd: "cat ~/.m2/settings.xml 2>/dev/null | grep -A5 '<mirror>' || echo 'not configured'",
    setCmd: "# 需编辑 ~/.m2/settings.xml",
    patterns: [/mvn\s+/],
  },
};

// 已配置镜像的检测模式
const MIRROR_CONFIGURED_PATTERNS = {
  npm: [/registry\.npmmirror\.com/, /repo\.huaweicloud\.com\/repository\/npm/],
  pip: [/pypi\.tuna\.tsinghua\.edu\.cn/, /mirrors\.aliyun\.com\/pypi/, /pypi\.mirrors\.ustc\.edu\.cn/],
  uv: [/pypi\.tuna\.tsinghua\.edu\.cn/, /mirrors\.aliyun\.com\/pypi/, /UV_INDEX_URL=/],
  cargo: [/mirrors\.ustc\.edu\.cn\/crates\.io-index/, /rsproxy\.cn/],
  go: [/goproxy\.cn/, /goproxy\.io/, /mirrors\.aliyun\.com\/goproxy/],
};

interface MirrorHint {
  tool: string;
  mirrorName: string;
  mirrorUrl: string;
  backer: string;
  setCmd: string;
  alreadyConfigured: boolean;
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
          return null; // 已指定镜像，不需要提示
        }

        // 检查是否已配置全局镜像
        const alreadyConfigured = checkGlobalMirrorConfig(command, tool);

        return {
          tool,
          mirrorName: config.name,
          mirrorUrl: config.url,
          backer: config.backer,
          setCmd: config.setCmd,
          alreadyConfigured,
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
      return command.includes("-i ") || command.includes("--index-url ");
    case "uv":
      return command.includes("--index-url ") || command.includes("--extra-index-url ");
    case "cargo":
      return false; // cargo 不支持命令行指定镜像
    case "go":
      return command.includes("GOPROXY=");
    default:
      return false;
  }
}

/**
 * 检查是否已配置全局镜像（通过命令参数推断）
 */
function checkGlobalMirrorConfig(command: string, tool: string): boolean {
  const patterns = MIRROR_CONFIGURED_PATTERNS[tool as keyof typeof MIRROR_CONFIGURED_PATTERNS];
  if (!patterns) return false;

  for (const pattern of patterns) {
    if (pattern.test(command)) {
      return true;
    }
  }
  return false;
}

/**
 * 生成镜像提示消息
 */
function generateMirrorHint(hint: MirrorHint): string {
  if (hint.alreadyConfigured) {
    return `✅ 检测到 ${hint.tool} 已配置 ${hint.mirrorName} 镜像源 (${hint.backer}背书)`;
  }

  const hintLines = [
    `💡 检测到 ${hint.tool} 包下载命令`,
    ``,
    `推荐配置国内镜像源加速下载：`,
    `- 镜像源: ${hint.mirrorName} (${hint.mirrorUrl})`,
    `- 背书方: ${hint.backer} ✅ 可信`,
    ``,
    `配置命令:`,
    `\`\`\`bash`,
    hint.setCmd,
    `\`\`\``,
    ``,
    `或运行一键配置脚本:`,
    `\`\`\`bash`,
    `~/.agents/skills/china-mirror/scripts/setup-all.sh`,
    `\`\`\``,
  ];

  return hintLines.join("\n");
}

/**
 * 插件主入口
 */
export default definePluginEntry({
  id: "china-mirror",
  name: "China Mirror",
  description: "自动检测包下载命令，提示配置国内镜像源加速",

  configSchema: {
    type: "object",
    properties: {
      enabled: {
        type: "boolean",
        default: true,
        description: "启用镜像源检测",
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
    const config = api.pluginConfig as { enabled?: boolean; showHint?: boolean; silent?: boolean };
    const enabled = config.enabled !== false;
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

        const message = generateMirrorHint(hint);

        if (silent) {
          api.logger.info(`[China Mirror] ${hint.tool} download detected: ${hint.mirrorName}`);
          return {}; // 静默模式，继续执行
        }

        if (showHint) {
          // 返回提示消息，继续执行
          return {
            message,
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
                  text: `运行一键配置脚本:\n\`\`\`bash\n~/.agents/skills/china-mirror/scripts/setup-all.sh\n\`\`\``,
                },
              ],
            };
          case "restore":
            return {
              content: [
                {
                  type: "text",
                  text: `恢复默认配置:\n\`\`\`bash\n~/.agents/skills/china-mirror/scripts/restore-default.sh\n\`\`\``,
                },
              ],
            };
          default:
            return {
              content: [
                {
                  type: "text",
                  text: `用法: /mirror [status|setup|restore]\n- status: 查看当前镜像配置\n- setup: 配置国内镜像源\n- restore: 恢复默认配置`,
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
    "# 镜像源配置状态",
    "",
    "支持的镜像源（均为大厂/高校背书）:",
    "",
    "| 工具 | 镜像源 | 背书方 |",
    "|------|--------|--------|",
  ];

  for (const [tool, config] of Object.entries(MIRROR_SOURCES)) {
    lines.push(`| ${tool} | ${config.name} | ${config.backer} |`);
  }

  lines.push("");
  lines.push("查看当前配置:");
  lines.push("```bash");
  lines.push("~/.agents/skills/china-mirror/scripts/show-status.sh");
  lines.push("```");

  return lines.join("\n");
}