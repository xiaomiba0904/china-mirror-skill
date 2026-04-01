# China Mirror Skill 🇨🇳

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-compatible-green.svg)](https://openclaw.ai)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple.svg)](https://claude.ai/code)

**AI 生成命令时自动添加国内镜像源参数。** 所有镜像源均为大厂/高校背书。

## 安装

```bash
git clone https://github.com/xiaomiba0904/china-mirror-skill.git
mkdir -p ~/.agents/skills && ln -s $(pwd)/china-mirror-skill ~/.agents/skills/china-mirror
```

## 支持范围

**包管理器：** npm/pnpm/yarn/bun, pip/uv/poetry, conda, gem, composer, nuget, cargo, go, docker, brew, maven/gradle...

**版本管理：** pyenv, nvm/fnm/volta, rbenv, gvm, sdkman, tfenv, asdf, julia...

**系统包：** apt, yum/dnf, apk, pacman

## 镜像源背书方

| 类型 | 背书方 |
|------|--------|
| 大厂 | 阿里巴巴、华为云、腾讯云、字节跳动、网易、七牛云 |
| 高校 | 清华大学、中国科学技术大学 |

**禁止使用无背书的不明镜像源。**

## 许可证

[MIT License](./LICENSE)