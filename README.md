# China Mirror Skill 🇨🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-green.svg)](https://openclaw.ai)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple.svg)](https://claude.ai/code)

**AI 生成包下载命令时，自动添加国内镜像源参数。**

所有镜像源均为**大厂/高校背书**，安全可信。

## 支持的包管理器

### 支持命令行参数（自动添加）

| 工具 | 镜像源 | 背书方 |
|------|--------|--------|
| npm/pnpm/yarn/bun | 淘宝 npmmirror | 阿里巴巴 ✅ |
| pip/pip3/uv/poetry | 清华 PyPI | 清华大学 ✅ |
| conda/mamba | 清华 Anaconda | 清华大学 ✅ |
| gem/bundle | 清华 RubyGems | 清华大学 ✅ |
| flutter pub/dart pub | Flutter CN | Flutter 社区 ✅ |
| composer | 阿里云 | 阿里云 ✅ |
| nuget/dotnet | 华为云 | 华为云 ✅ |

### 需要配置文件

| 工具 | 镜像源 | 背书方 |
|------|--------|--------|
| cargo/rustup | 中科大 | 中国科学技术大学 ✅ |
| go | 七牛云 | 七牛云 ✅ |
| docker | 中科大/腾讯云 | 高校/大厂 ✅ |
| brew | 清华 | 清华大学 ✅ |
| maven/gradle | 阿里云 | 阿里云 ✅ |
| julia | 中科大 | 中国科学技术大学 ✅ |
| R (CRAN) | 清华 | 清华大学 ✅ |
| helm | Azure China | 微软 ✅ |
| apt (Ubuntu/Debian) | 阿里云 | 阿里云 ✅ |
| yum/dnf (CentOS) | 阿里云 | 阿里云 ✅ |
| apk (Alpine) | 阿里云 | 阿里云 ✅ |
| pacman (Arch) | 清华/中科大 | 高校 ✅ |

## 安装

### Claude Code

```bash
git clone https://github.com/xiaomiba0904/china-mirror-skill.git
mkdir -p ~/.agents/skills
ln -s $(pwd)/china-mirror-skill ~/.agents/skills/china-mirror
```

### OpenClaw

```bash
mkdir -p ~/.openclaw/skills
ln -s $(pwd)/china-mirror-skill ~/.openclaw/skills/china-mirror
```

## 使用示例

| 用户请求 | AI 生成的命令 |
|----------|--------------|
| 安装 lodash | `npm install lodash --registry=https://registry.npmmirror.com` |
| 安装 requests | `pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple` |
| 安装 rails | `gem install rails --source https://mirrors.tuna.tsinghua.edu.cn/rubygems/` |

## 安全声明

**背书方列表：**
- 大厂：阿里巴巴、华为云、腾讯云、字节跳动、网易、七牛云
- 高校：清华大学、中国科学技术大学、上海交通大学

**禁止使用无背书的不明镜像源。**

## 许可证

[MIT License](./LICENSE)