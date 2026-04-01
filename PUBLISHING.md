# 发布指南

## 概述

Claude Code 有两种扩展方式：

| 类型 | 复杂度 | 用途 |
|------|--------|------|
| **Skill** | 简单 | 单一功能技能，通过 SKILL.md 定义 |
| **Plugin** | 复杂 | 完整插件，可包含多个 skills、agents、commands、hooks |

## 方式一：作为 Skill 分享（推荐）

### 1. 上传到 GitHub

```bash
# 创建 GitHub 仓库
cd /Users/gehanbin/Work/skill-mirror/china-mirror
git init
git add .
git commit -m "Initial commit: China Mirror Skill"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/china-mirror-skill.git
git push -u origin main
```

### 2. 用户安装方式

用户可以通过以下方式安装：

```bash
# 方式一：克隆到 skills 目录
git clone https://github.com/YOUR_USERNAME/china-mirror-skill.git ~/.agents/skills/china-mirror
ln -s ~/.agents/skills/china-mirror ~/.claude/skills/china-mirror

# 方式二：添加到项目的 CLAUDE.md
# 在 CLAUDE.md 中添加：
# - Skills: https://github.com/YOUR_USERNAME/china-mirror-skill
```

### 3. 在 README 中说明安装方法

已在 README.md 中包含详细的安装说明。

---

## 方式二：作为 Plugin 发布到官方 Marketplace

### 1. 插件目录结构

```
china-mirror/
├── .claude-plugin/
│   └── plugin.json        # 插件元数据
├── skills/
│   └── china-mirror/
│       └── SKILL.md       # Skill 定义
├── commands/              # 可选：自定义命令
├── agents/                # 可选：自定义 agents
├── README.md
└── LICENSE
```

### 2. 创建插件配置

```bash
mkdir -p china-mirror/.claude-plugin
mkdir -p china-mirror/skills/china-mirror
```

### 3. 提交到官方 Marketplace

1. Fork [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official)
2. 在 `plugins/` 目录下创建你的插件目录
3. 更新根目录的 `marketplace.json`，添加你的插件
4. 提交 Pull Request

### 4. 官方 Marketplace 插件格式

在 `marketplace.json` 中添加：

```json
{
  "name": "china-mirror",
  "description": "一键配置国内镜像源，支持 npm、pip、cargo、docker 等 11 种包管理器",
  "category": "development",
  "source": {
    "source": "url",
    "url": "https://github.com/YOUR_USERNAME/china-mirror-skill.git",
    "sha": "your-commit-sha"
  },
  "homepage": "https://github.com/YOUR_USERNAME/china-mirror-skill"
}
```

---

## 方式三：创建自己的 Marketplace

### 1. 创建 Marketplace 仓库

创建一个 GitHub 仓库，包含 `.claude-plugin/marketplace.json`：

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "your-marketplace",
  "description": "你的 Skill/Plugin 市场",
  "owner": {
    "name": "Your Name",
    "email": "your@email.com"
  },
  "plugins": [
    {
      "name": "china-mirror",
      "description": "一键配置国内镜像源",
      "source": {
        "source": "github",
        "repo": "YOUR_USERNAME/china-mirror-skill"
      }
    }
  ]
}
```

### 2. 用户添加你的 Marketplace

用户在 `settings.json` 中添加：

```json
{
  "extraKnownMarketplaces": {
    "your-marketplace": {
      "source": {
        "source": "github",
        "repo": "YOUR_USERNAME/your-marketplace-repo"
      }
    }
  }
}
```

---

## 推荐：最简单的分享方式

对于这个 Skill，推荐使用 **方式一**：

1. ✅ 简单直接
2. ✅ 用户安装方便
3. ✅ 易于维护更新
4. ✅ 不需要审核流程

### 完整的分享步骤

```bash
# 1. 初始化 Git 仓库
cd ~/.agents/skills/china-mirror
git init
git add .
git commit -m "Initial commit: China Mirror Skill v1.0.0"

# 2. 创建 GitHub 仓库后推送
git remote add origin https://github.com/YOUR_USERNAME/china-mirror-skill.git
git branch -M main
git push -u origin main

# 3. 在 README 中添加安装说明（已完成）
# 4. 添加 GitHub Topics: claude-code, skill, mirror, china
```

### 用户安装命令

```bash
# 一键安装
mkdir -p ~/.agents/skills && \
git clone https://github.com/YOUR_USERNAME/china-mirror-skill.git ~/.agents/skills/china-mirror && \
mkdir -p ~/.claude/skills && \
ln -s ~/.agents/skills/china-mirror ~/.claude/skills/china-mirror
```

---

## 相关链接

- [Claude Code 官方文档](https://docs.anthropic.com/claude-code)
- [官方 Plugin Marketplace](https://github.com/anthropics/claude-plugins-official)
- [Marketplace Schema](https://anthropic.com/claude-code/marketplace.schema.json)