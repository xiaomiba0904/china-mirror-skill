---
name: china-mirror
description: "国内镜像源加速。生成包下载命令时自动添加大厂/高校背书的可信镜像参数。触发：安装包、下载依赖、npm/pip/uv/cargo/go/docker/maven/nuget/pyenv/nvm 等包管理/版本管理操作。"
version: 2.2.0
---

# China Mirror — 国内镜像源自动添加

## 核心规则（必须遵循）

**生成任何包下载命令时，必须自动添加国内镜像源参数。**

**只使用以下大厂/高校背书的可信镜像源：**

## 支持命令行参数的工具

| 工具 | 自动添加参数 | 镜像源 | 背书方 |
|------|-------------|--------|--------|
| npm | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| pnpm | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| yarn | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| yarn2 | `--registry https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| bun | `--registry https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| pip | `-i https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| pip3 | `-i https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| uv | `--index-url https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| poetry | `-i https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| pipenv | `--pypi-mirror https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| conda | `-c https://mirrors.tuna.tsinghua.edu.cn/anaconda` | 清华 Anaconda | 清华大学 ✅ |
| mamba | `-c https://mirrors.tuna.tsinghua.edu.cn/anaconda` | 清华 Anaconda | 清华大学 ✅ |
| gem | `--source https://mirrors.tuna.tsinghua.edu.cn/rubygems/` | 清华 RubyGems | 清华大学 ✅ |
| bundle | `--source https://mirrors.tuna.tsinghua.edu.cn/rubygems/` | 清华 RubyGems | 清华大学 ✅ |
| flutter pub | `--server=https://pub.flutter-io.cn` | Flutter CN | Flutter 社区 ✅ |
| dart pub | `--server=https://pub.flutter-io.cn` | Flutter CN | Flutter 社区 ✅ |
| composer | `--repository-url=https://mirrors.aliyun.com/composer/` | 阿里云 Composer | 阿里云 ✅ |
| nuget | `-Source https://repo.huaweicloud.com/repository/nuget/v3/index.json` | 华为云 NuGet | 华为云 ✅ |
| dotnet | `--source https://repo.huaweicloud.com/repository/nuget/v3/index.json` | 华为云 NuGet | 华为云 ✅ |

## 需要配置文件的工具

这些工具不支持命令行参数，需配置文件。AI 应提示用户运行配置命令：

### Rust (Cargo/Rustup)

```bash
# Cargo 镜像配置
mkdir -p ~/.cargo
cat > ~/.cargo/config.toml << 'EOF'
[source.crates-io]
replace-with = "ustc"

[source.ustc]
registry = "https://mirrors.ustc.edu.cn/crates.io-index"
EOF

# Rustup 镜像配置（添加到 ~/.bashrc 或 ~/.zshrc）
export RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
export RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"
```

### Go

```bash
go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct
```

### Docker

```bash
# Linux: 编辑 /etc/docker/daemon.json
# macOS: 编辑 ~/.docker/daemon.json
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.ccs.tencentyun.com"
  ]
}
# 重启 Docker 服务
```

### Homebrew

```bash
# 设置环境变量
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles/api"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/homebrew-bottles"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
```

### Maven

```xml
<!-- 编辑 ~/.m2/settings.xml -->
<mirror>
  <id>aliyun</id>
  <mirrorOf>central</mirrorOf>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

### Gradle

```groovy
// 编辑 ~/.gradle/init.gradle
allprojects {
  repositories {
    maven { url 'https://maven.aliyun.com/repository/public/' }
  }
}
```

### Anaconda/Miniconda

```bash
# 编辑 ~/.condarc
channels:
  - defaults
show_channel_urls: true
default_channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/r
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/msys2
custom_channels:
  conda-forge: https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud
```

### Julia

```bash
# 编辑 ~/.julia/config/startup.jl
ENV["JULIA_PKG_SERVER"] = "https://mirrors.ustc.edu.cn/julia/"
```

### R (CRAN)

```r
# 在 R 中执行
options(repos = c(CRAN = "https://mirrors.tuna.tsinghua.edu.cn/CRAN/"))
```

### Helm

```bash
helm repo add stable https://mirror.azure.cn/kubernetes/charts/
helm repo add incubator https://mirror.azure.cn/kubernetes/charts-incubator/
```

### Ubuntu/Debian (apt)

```bash
# 编辑 /etc/apt/sources.list，替换为阿里云镜像
deb https://mirrors.aliyun.com/ubuntu/ jammy main restricted universe multiverse
deb https://mirrors.aliyun.com/ubuntu/ jammy-updates main restricted universe multiverse
```

### CentOS/RHEL (yum/dnf)

```bash
# CentOS Stream 9
sed -e 's|^mirrorlist=|#mirrorlist=|g' \
    -e 's|^#baseurl=http://mirror.centos.org|baseurl=https://mirrors.aliyun.com|g' \
    -i.bak /etc/yum.repos.d/centos*.repo
```

### Alpine (apk)

```bash
# 编辑 /etc/apk/repositories
https://mirrors.aliyun.com/alpine/v3.19/main
https://mirrors.aliyun.com/alpine/v3.19/community
```

### Arch Linux (pacman)

```bash
# 编辑 /etc/pacman.d/mirrorlist
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
```

## 版本管理工具镜像配置

这些工具用于安装语言/工具的特定版本，下载速度慢，需要配置镜像环境变量。

### pyenv (Python 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export PYTHON_BUILD_MIRROR_URL="https://mirrors.tuna.tsinghua.edu.cn/python-build/"
# 或使用中科大镜像
export PYTHON_BUILD_MIRROR_URL="https://mirrors.ustc.edu.cn/python-build/"
```

### nvm (Node.js 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node/
export NVM_IOJS_ORG_MIRROR=https://npmmirror.com/mirrors/iojs/
```

### fnm (Node.js 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export FNM_NODE_DIST_MIRROR=https://npmmirror.com/mirrors/node/
```

### volta (Node.js 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export VOLTA_NODE_MIRROR=https://npmmirror.com/mirrors/node/
```

### rbenv/ruby-build (Ruby 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export RUBY_BUILD_MIRROR_URL="https://mirrors.tuna.tsinghua.edu.cn/ruby-build/"
```

### gvm (Go 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export GO_BINARY_BASE_URL="https://mirrors.ustc.edu.cn/golang/"
```

### sdkman (多语言版本管理)

```bash
# 编辑 ~/.sdkman/etc/config
sdkman_candidates_mirror=https://mirrors.tuna.tsinghua.edu.cn/sdkman/
```

### tfenv (Terraform 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export TFENV_TERRAFORM_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/terraform/
```

### tgenv (Terragrunt 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export TGENV_TERRAGRUNT_MIRROR=https://mirrors.tuna.tsinghua.edu.cn/terragrunt/
```

### asdf (多语言版本管理)

```bash
# Node.js 插件
export ASDF_NODEJS_NODE_ORG_MIRROR=https://npmmirror.com/mirrors/node/

# Python 插件
export ASDF_PYTHON_MIRROR_URL="https://mirrors.tuna.tsinghua.edu.cn/python-build/"

# Go 插件
export ASDF_GOLANG_MIRROR_URL="https://mirrors.ustc.edu.cn/golang/"
```

### jenv (Java 版本管理)

jenv 不直接下载 JDK，需配合 SDKMAN 或手动配置：
```bash
# 使用 sdkman 安装 Java
sdk install java 17.0.1-tem
```

### coursier (Scala/Java 版本管理)

```bash
# 添加到 ~/.bashrc 或 ~/.zshrc
export COURSIER_REPOSITORIES="https://maven.aliyun.com/repository/public|central"
```

## 示例

| 用户请求 | 正确生成的命令 |
|----------|---------------|
| 安装 lodash | `npm install lodash --registry=https://registry.npmmirror.com` |
| 安装 requests | `pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple` |
| 安装 axios | `npm install axios --registry=https://registry.npmmirror.com` |
| uv 安装 pandas | `uv pip install pandas --index-url https://pypi.tuna.tsinghua.edu.cn/simple` |
| 安装 numpy（conda）| `conda install numpy -c https://mirrors.tuna.tsinghua.edu.cn/anaconda` |
| 安装 rails | `gem install rails --source https://mirrors.tuna.tsinghua.edu.cn/rubygems/` |
| 安装 laravel | `composer require laravel/framework --repository-url=https://mirrors.aliyun.com/composer/` |
| 安装 newtonsoft.json | `dotnet add package Newtonsoft.Json --source https://repo.huaweicloud.com/repository/nuget/v3/index.json` |

## 备选镜像源

| 工具 | 备选镜像 | 背书方 |
|------|----------|--------|
| npm | `https://repo.huaweicloud.com/repository/npm/` | 华为云 ✅ |
| pip | `https://mirrors.aliyun.com/pypi/simple/` | 阿里云 ✅ |
| pip | `https://pypi.mirrors.ustc.edu.cn/simple/` | 中科大 ✅ |
| pip | `https://repo.huaweicloud.com/repository/pypi/simple/` | 华为云 ✅ |
| cargo | `https://rsproxy.cn/` | 字节跳动 ✅ |
| cargo | `https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git` | 清华大学 ✅ |
| go | `https://mirrors.aliyun.com/goproxy/` | 阿里云 ✅ |
| go | `https://goproxy.io/` | 社区 ✅ |
| docker | `https://mirror.ccs.tencentyun.com` | 腾讯云 ✅ |
| docker | `https://hub-mirror.c.163.com` | 网易 ✅ |

## 安全声明

所有列出的镜像源均为**大厂或高校背书**，安全可信：

**大厂背书：**
- 阿里巴巴（淘宝、阿里云）
- 华为云
- 腾讯云
- 字节跳动
- 网易
- 七牛云

**高校背书：**
- 清华大学 TUNA
- 中国科学技术大学
- 上海交通大学

**禁止使用无背书的不明镜像源。**