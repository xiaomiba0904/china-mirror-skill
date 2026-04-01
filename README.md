# China Mirror Skill 🇨🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-green.svg)](https://openclaw.ai)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple.svg)](https://claude.ai/code)

**AI 生成包下载命令时，自动添加国内镜像源参数。**

所有镜像源均为**大厂/高校背书**，安全可信：阿里巴巴、华为云、清华大学、中国科学技术大学。

## 安装

### Claude Code

```bash
# 克隆仓库
git clone https://github.com/xiaomiba0904/china-mirror-skill.git

# 安装到 Claude Code skills 目录
mkdir -p ~/.agents/skills
ln -s $(pwd)/china-mirror-skill ~/.agents/skills/china-mirror

# 可选：创建符号链接到 .claude/skills
mkdir -p ~/.claude/skills
ln -s ~/.agents/skills/china-mirror ~/.claude/skills/china-mirror
```

### OpenClaw

```bash
# 安装到 OpenClaw skills 目录
mkdir -p ~/.openclaw/skills
ln -s $(pwd)/china-mirror-skill ~/.openclaw/skills/china-mirror
```

## 使用

安装后，AI 会在生成包下载命令时自动添加镜像参数：

| 工具 | 自动添加的参数 |
|------|---------------|
| npm/pnpm/yarn | `--registry=https://registry.npmmirror.com` |
| pip/pip3 | `-i https://pypi.tuna.tsinghua.edu.cn/simple` |
| uv | `--index-url https://pypi.tuna.tsinghua.edu.cn/simple` |

**示例：**
- 用户：安装 lodash
- AI 生成：`npm install lodash --registry=https://registry.npmmirror.com`

## 支持的镜像源

| 镜像源 | 背书方 |
|--------|--------|
| 淘宝 npmmirror | 阿里巴巴 ✅ |
| 清华 PyPI | 清华大学 ✅ |
| 中科大 Cargo | 中国科学技术大学 ✅ |
| 七牛云 GoProxy | 七牛云 ✅ |
| 华为云 npm | 华为云 ✅ |
| 阿里云 PyPI | 阿里云 ✅ |

## 目录结构

```
china-mirror/
├── SKILL.md        # Skill 定义（核心文件）
├── README.md       # 本文档
├── LICENSE         # MIT 许可证
└── marketplace.json # 市场配置（可选）
```

## 许可证

[MIT License](./LICENSE)