---
name: china-mirror
description: "自动配置国内镜像源加速工具，支持 npm/pip/uv/docker/homebrew/maven/gradle/nuget/go/cargo/rustup 等主流包管理器。触发条件：用户提到镜像、国内源、加速下载、npm慢、pip慢、uv慢、cargo慢等关键词。"
version: 1.0.0
metadata:
  {
    "openclaw":
      {
        "requires": { "bins": ["npm", "pip"], "env": ["UV_INDEX_URL"], "anyBins": ["npm", "pip", "uv", "cargo", "go", "brew"] },
        "emoji": "🌐",
        "homepage": "https://github.com/xiaomiba0904/china-mirror-skill",
        "os": ["darwin", "linux"]
      }
  }
---

# China Mirror — 国内镜像源自动配置

## 能力说明

一键配置国内镜像源，解决国内下载慢的问题：
- **npm** - 淘宝 npmmirror
- **pip/pypi** - 清华/阿里云镜像
- **uv** - 清华镜像（新一代 Python 包管理器）
- **cargo** - 中科大/字节跳动镜像（Rust 包管理器）
- **rustup** - 中科大镜像（Rust 工具链管理器）
- **docker** - 中科大/阿里云镜像加速
- **homebrew** - 清华镜像
- **maven** - 阿里云镜像
- **gradle** - 阿里云镜像
- **nuget** - 华为云镜像
- **go** - 七牛云镜像

## 镜像源列表

### npm (Node.js)
| 源 | 地址 | 备注 |
|---|---|---|
| 淘宝 | https://registry.npmmirror.com | 最推荐，稳定快速 |
| 华为云 | https://repo.huaweicloud.com/repository/npm/ | 备选 |

### pip (Python)
| 源 | 地址 | 备注 |
|---|---|---|
| 清华 | https://pypi.tuna.tsinghua.edu.cn/simple | 最推荐 |
| 阿里云 | https://mirrors.aliyun.com/pypi/simple/ | 备选 |
| 中科大 | https://pypi.mirrors.ustc.edu.cn/simple/ | 备选 |

### uv (Python - 新一代快速包管理器)
| 源 | 地址 | 备注 |
|---|---|---|
| 清华 | https://pypi.tuna.tsinghua.edu.cn/simple | 最推荐，速度极快 |
| 阿里云 | https://mirrors.aliyun.com/pypi/simple/ | 备选 |

> **uv** 是 Astral 开发的新一代 Python 包管理器，比 pip 快 10-100 倍，强烈推荐使用！

### Cargo (Rust 包管理器)
| 源 | 地址 | 备注 |
|---|---|---|
| 中科大 | https://mirrors.ustc.edu.cn/crates.io-index/ | 推荐，稳定 |
| 字节跳动 | https://rsproxy.cn/ | 速度快 |
| 清华 | https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git | 备选 |
| 上交大 | https://mirrors.sjtug.sjtu.edu.cn/git/crates.io-index/ | 备选 |

### Rustup (Rust 工具链管理器)
| 源 | 地址 | 备注 |
|---|---|---|
| 中科大 | https://mirrors.ustc.edu.cn/rust-static | 推荐 |

### Docker
| 源 | 地址 | 备注 |
|---|---|---|
| 中科大 | https://docker.mirrors.ustc.edu.cn | 推荐 |
| 阿里云 | https://<你的ID>.mirror.aliyuncs.com | 需登录获取专属地址 |
| 网易 | https://hub-mirror.c.163.com | 备选 |

### Homebrew (macOS)
| 源 | 地址 | 备注 |
|---|---|---|
| 清华 | https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/ | brew/bottles/core |

### Maven (Java)
| 源 | 地址 | 备注 |
|---|---|---|
| 阿里云 | https://maven.aliyun.com/repository/public | 最推荐 |

### Gradle (Java/Kotlin)
| 源 | 地址 | 备注 |
|---|---|---|
| 阿里云 | https://maven.aliyun.com/repository/public | 与 Maven 同地址 |

### Go
| 源 | 地址 | 备注 |
|---|---|---|
| 七牛云 | https://goproxy.cn | 最推荐 |
| 阿里云 | https://mirrors.aliyun.com/goproxy/ | 备选 |

### NuGet (.NET)
| 源 | 地址 | 备注 |
|---|---|---|
| 华为云 | https://repo.huaweicloud.com/repository/nuget/ | 推荐 |

## 使用方式

### 一键配置全部镜像

```bash
# 配置所有支持的镜像源
~/.agents/skills/china-mirror/scripts/setup-all.sh
```

### 单独配置某个镜像

```bash
# npm
npm config set registry https://registry.npmmirror.com

# pip (临时使用)
pip install package -i https://pypi.tuna.tsinghua.edu.cn/simple

# pip (永久配置)
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# uv (临时使用)
uv pip install package --index-url https://pypi.tuna.tsinghua.edu.cn/simple

# uv (永久配置 - 环境变量)
export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple

# uv (永久配置 - pyproject.toml)
[[tool.uv.index]]
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
default = true

# docker (需重启 docker 服务)
# 编辑 /etc/docker/daemon.json 或 ~/.docker/daemon.json

# homebrew
~/.agents/skills/china-mirror/scripts/setup-homebrew.sh

# maven
~/.agents/skills/china-mirror/scripts/setup-maven.sh

# go
go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct
```

### 恢复默认配置

```bash
# npm
npm config set registry https://registry.npmjs.org

# pip
pip config unset global.index-url

# uv
unset UV_INDEX_URL
# 或删除 pyproject.toml 中的 [[tool.uv.index]] 配置

# go
go env -w GOPROXY=https://proxy.golang.org,direct
```

## 配置文件位置

| 工具 | 配置文件/方式 |
|---|---|
| npm | ~/.npmrc |
| pip | ~/.pip/pip.conf 或 ~/.config/pip/pip.conf |
| uv | 环境变量 UV_INDEX_URL 或 pyproject.toml |
| docker | /etc/docker/daemon.json (Linux) 或 ~/.docker/daemon.json (macOS) |
| homebrew | 环境变量 |
| maven | ~/.m2/settings.xml |
| gradle | ~/.gradle/init.gradle |
| go | go env |

## 检测当前配置

```bash
# 查看 npm 当前源
npm config get registry

# 查看 pip 当前源
pip config list

# 查看 uv 当前源
echo $UV_INDEX_URL
# 或查看 pyproject.toml 中的配置

# 查看 docker 配置
cat /etc/docker/daemon.json  # Linux
cat ~/.docker/daemon.json    # macOS

# 查看 go 配置
go env GOPROXY
```

## uv 特别说明

**uv** 是 Astral 开发的超快速 Python 包管理器，特点：
- 🚀 比 pip 快 10-100 倍
- 🔧 兼容 pip 命令（uv pip install）
- 📦 支持虚拟环境管理
- ⚡ 并行下载，缓存高效

**安装 uv：**
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# 或通过 pip
pip install uv

# 或通过 homebrew
brew install uv
```

**配置 uv 镜像的三种方式：**

1. **环境变量（推荐）**：
```bash
export UV_INDEX_URL=https://pypi.tuna.tsinghua.edu.cn/simple
export UV_EXTRA_INDEX_URL=https://mirrors.aliyun.com/pypi/simple/
```

2. **命令行参数**：
```bash
uv pip install package --index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

3. **pyproject.toml 配置**：
```toml
[[tool.uv.index]]
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
default = true

[[tool.uv.index]]
url = "https://mirrors.aliyun.com/pypi/simple/"
extra = true
```

## Rust 特别说明

**Cargo** 是 Rust 的官方包管理器，**Rustup** 是 Rust 工具链管理器。

### 安装 Rust（使用镜像加速）

```bash
# 先设置镜像环境变量
export RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
export RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"

# 然后安装
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Cargo 镜像配置

**配置文件位置**: `~/.cargo/config.toml`

**手动配置**：
```toml
[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "https://mirrors.ustc.edu.cn/crates.io-index"

# 备用镜像
[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"

[net]
git-fetch-with-cli = true
```

### Rustup 镜像配置

**环境变量方式**（推荐）：
```bash
export RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
export RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"
```

### 常用命令

```bash
# 更新 Rust 工具链
rustup update

# 安装包
cargo install ripgrep

# 构建项目
cargo build

# 添加依赖
cargo add serde
```

## 注意事项

1. **Docker 镜像**：配置后需要重启 Docker 服务
   - Linux: `sudo systemctl restart docker`
   - macOS: 在 Docker Desktop 中重启

2. **pip 镜像**：清华源最稳定，建议优先使用

3. **阿里云 Docker 镜像**：需要登录阿里云获取专属加速地址
   - 访问: https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors

4. **临时使用镜像**：大多数工具支持单次命令指定镜像源

## 自动镜像检查（Hook 功能）

本 skill 提供两种平台的 Hook 实现，**AI 自动判断并添加镜像源参数**，无需手动配置。

### 工作原理

1. **AI 判断**：执行命令前，AI 分析命令是否触发包下载
2. **自动添加参数**：对于 npm/pip/uv 等工具，AI 自动在命令中添加镜像参数
3. **配置提示**：对于 cargo/brew/docker 等需配置文件的工具，提示运行一键配置脚本

### 支持命令行参数的工具

| 工具 | 镜像参数 | 示例 |
|------|----------|------|
| npm/pnpm/yarn | `--registry=URL` | `npm install lodash --registry=https://registry.npmmirror.com` |
| pip/pip3 | `-i URL` | `pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple` |
| uv | `--index-url URL` | `uv pip install requests --index-url https://pypi.tuna.tsinghua.edu.cn/simple` |

### 需配置文件的工具

这些工具不支持命令行参数，需运行一键配置脚本：

| 工具 | 配置文件 |
|------|----------|
| cargo/rustup | `~/.cargo/config.toml` + 环境变量 |
| brew | 环境变量 |
| docker | `/etc/docker/daemon.json` |
| go | `go env GOPROXY` |
| maven | `~/.m2/settings.xml` |

### Claude Code Hook (PreToolUse)

在 `~/.claude/settings.json` 中配置，AI 自动分析命令并添加镜像参数：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "分析命令是否触发包下载，自动添加国内镜像源参数..."
          }
        ]
      }
    ]
  }
}
```

### OpenClaw Hook (before_tool_call)

OpenClaw 使用 Plugin SDK 实现 Hook，位于 `plugin/` 目录：

```typescript
// plugin/src/index.ts
api.registerHook(["before_tool_call"], async (event) => {
  if (event.toolName === "exec" || event.toolName === "process") {
    // 检测包下载命令
    // 自动生成带镜像参数的命令
    // 返回提示：原命令 vs 修改后命令
  }
});
```

### Hook 行为对比

| 平台 | Hook 类型 | 行为 |
|------|-----------|------|
| Claude Code | PreToolUse | AI 分析命令，提示修改后的命令 |
| OpenClaw | before_tool_call | Plugin 检测，返回原命令和修改后命令对比 |

**设计原则：** 所有镜像源均为大厂/高校背书（阿里巴巴、清华大学、中科大、七牛云等），安全可信。

### 会触发镜像提醒的命令

**直接下载命令：**
| 工具 | 命令示例 |
|------|----------|
| npm | `npm install`, `npm i`, `npm add`, `npm update` |
| yarn | `yarn install`, `yarn add` |
| pnpm | `pnpm install`, `pnpm add` |
| pip | `pip install`, `pip3 install` |
| uv | `uv pip install`, `uv add`, `uv sync`, `uv tool install` |
| brew | `brew install`, `brew upgrade` |
| go | `go get`, `go install`, `go mod download` |
| docker | `docker pull`, `docker build` |
| apt | `apt install`, `apt-get install` |
| cargo | `cargo install`, `cargo update` |

**间接触发下载的命令：**
| 工具 | 命令示例 | 说明 |
|------|----------|------|
| npm | `npm run`, `npm start`, `npm test`, `npm build` | 依赖缺失时自动下载 |
| npx | `npx xxx` | 临时下载执行包 |
| yarn | `yarn run`, `yarn start`, `yarn test` | 同 npm |
| pnpm | `pnpm run`, `pnpm start`, `pnpm test` | 同 npm |
| uv | `uv run` | 自动安装依赖并运行 |

### 不会触发提醒的情况

1. 命令中已指定镜像参数：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package
   uv pip install --index-url https://pypi.tuna.tsinghua.edu.cn/simple package
   ```

2. 已配置全局镜像（Hook 会假定已配置）

3. 不涉及包下载的命令