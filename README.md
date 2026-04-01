# China Mirror Skill 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux-blue.svg)](https://github.com/xiaomiba0904/china-mirror-skill)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-green.svg)](https://openclaw.ai)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple.svg)](https://claude.ai/code)

一键配置国内镜像源，解决国内下载慢的问题。支持 11 种主流包管理器，所有镜像源均为**大厂/高校背书**，安全可靠。

**支持平台：** OpenClaw + Claude Code 双平台兼容

## ✨ 特性

- 🎯 **一键配置** - 一条命令配置所有镜像源
- 🔒 **安全可靠** - 所有镜像源均为大厂/高校背书
- 📦 **全面覆盖** - 支持 11 种主流包管理器
- 🔄 **自动检测** - Hook 自动检测下载命令并提醒配置镜像

## 📦 支持的工具

| 工具 | 镜像源 | 背书方 |
|------|--------|--------|
| npm | 淘宝 npmmirror | 阿里巴巴 |
| pip | 清华/阿里云/中科大 | 清华大学/阿里巴巴/中科大 |
| uv | 清华/阿里云 | 清华大学/阿里巴巴 |
| cargo | 中科大/字节跳动/清华 | 高校/字节跳动 |
| rustup | 中科大 | 中科大 |
| docker | 中科大/阿里云/网易/百度 | 高校/大厂 |
| homebrew | 清华 | 清华大学 |
| maven | 阿里云 | 阿里巴巴 |
| gradle | 阿里云 | 阿里巴巴 |
| go | 七牛云/阿里云 | 七牛云/阿里巴巴 |
| nuget | 华为云 | 华为 |

## 🚀 快速开始

### Claude Code 安装

```bash
# 克隆仓库
git clone https://github.com/xiaomiba0904/china-mirror-skill.git

# 安装到 Claude Code
mkdir -p ~/.agents/skills
ln -s $(pwd)/china-mirror-skill ~/.agents/skills/china-mirror

# 创建符号链接到 Claude skills 目录
mkdir -p ~/.claude/skills
ln -s ~/.agents/skills/china-mirror ~/.claude/skills/china-mirror
```

### OpenClaw 安装

**方式一：通过 ClawHub 安装**

```bash
openclaw skills install china-mirror
```

**方式二：手动安装**

```bash
# 克隆仓库
git clone https://github.com/xiaomiba0904/china-mirror-skill.git

# 安装 Skill
mkdir -p ~/.openclaw/skills
ln -s $(pwd)/china-mirror-skill ~/.openclaw/skills/china-mirror

# 安装 Plugin（可选，提供 Hook 功能）
cd china-mirror-skill/plugin
npm install
npm run build
mkdir -p ~/.openclaw/plugins
cp -r dist ~/.openclaw/plugins/china-mirror
cp openclaw.plugin.json ~/.openclaw/plugins/china-mirror/
```

### 使用

```bash
# 一键配置所有镜像
~/.agents/skills/china-mirror/scripts/setup-all.sh

# 查看当前配置状态
~/.agents/skills/china-mirror/scripts/show-status.sh

# 恢复默认配置
~/.agents/skills/china-mirror/scripts/restore-default.sh
```

### 配置 Hook（自动提醒）

#### Claude Code Hook

在 `~/.claude/settings.json` 中添加：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "检测命令是否触发包下载，提醒用户配置镜像..."
          }
        ]
      }
    ]
  }
}
```

#### OpenClaw Hook

OpenClaw 使用 Plugin SDK 实现 Hook，无需额外配置。安装 Plugin 后自动生效：

- **Hook 类型**: `before_tool_call`
- **检测工具**: `exec`, `process`
- **行为**: 检测到包下载命令时显示镜像提示，继续执行

详见 [plugin/README.md](./plugin/README.md)

## 📖 详细文档

- [SKILL.md](./SKILL.md) - 完整的 Skill 定义和使用文档
- [plugin/README.md](./plugin/README.md) - OpenClaw Plugin 文档
- [README.md](./README.md) - 本文档

## 🔧 目录结构

```
china-mirror/
├── SKILL.md              # Skill 定义文件（双平台兼容）
├── README.md             # 使用说明
├── marketplace.json      # 市场配置文件
├── plugin/               # OpenClaw Plugin（可选）
│   ├── openclaw.plugin.json  # Plugin manifest
│   ├── package.json          # npm 包配置
│   ├── src/
│   │   ├── index.ts          # Plugin 入口（Hook 实现）
│   │   └── types.ts          # 类型定义
│   └── README.md             # Plugin 文档
└── scripts/
    ├── setup-all.sh      # 一键配置所有镜像
    ├── show-status.sh    # 查看当前配置状态
    └── restore-default.sh # 恢复默认配置
```

## 📋 平台兼容性

| 功能 | Claude Code | OpenClaw |
|------|-------------|----------|
| Skill 文件 | ✅ SKILL.md | ✅ SKILL.md |
| Hook 自动检测 | ✅ PreToolUse | ✅ Plugin Hook |
| Slash 命令 | ❌ | ✅ `/mirror` |
| 一键配置脚本 | ✅ | ✅ |

## ⚠️ 不支持的场景

| 场景 | 原因 |
|------|------|
| GitHub 克隆加速 | 无大厂背书的镜像源 |
| PyPI 私有包 | 需要私有源配置 |
| 企业内部源 | 需要企业自定义配置 |

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT License](./LICENSE)

## 🙏 鸣谢

感谢以下机构提供镜像服务：
- 清华大学 TUNA 协会
- 中国科学技术大学
- 阿里巴巴
- 字节跳动
- 华为云
- 七牛云
- 网易
- 百度