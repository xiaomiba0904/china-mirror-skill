#!/bin/bash
# 一键配置国内镜像源

set -e

echo "=========================================="
echo "    国内镜像源一键配置工具"
echo "=========================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

success() {
    echo "${GREEN}[✓]${NC} $1"
}

info() {
    echo "${YELLOW}[→]${NC} $1"
}

error() {
    echo "${RED}[✗]${NC} $1"
}

# 1. 配置 npm
configure_npm() {
    info "配置 npm 镜像..."
    if command -v npm &> /dev/null; then
        npm config set registry https://registry.npmmirror.com
        success "npm 镜像已配置为淘宝源: https://registry.npmmirror.com"
    else
        info "npm 未安装，跳过"
    fi
}

# 2. 配置 pip
configure_pip() {
    info "配置 pip 镜像..."
    if command -v pip &> /dev/null || command -v pip3 &> /dev/null; then
        PIP_CMD=""
        if command -v pip &> /dev/null; then
            PIP_CMD="pip"
        elif command -v pip3 &> /dev/null; then
            PIP_CMD="pip3"
        fi

        # 创建配置目录
        mkdir -p ~/.pip

        # 写入配置文件
        cat > ~/.pip/pip.conf << 'EOF'
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host = pypi.tuna.tsinghua.edu.cn

[install]
trusted-host = pypi.tuna.tsinghua.edu.cn
EOF

        # macOS 也需要 ~/.config/pip/pip.conf
        mkdir -p ~/.config/pip
        cp ~/.pip/pip.conf ~/.config/pip/pip.conf

        success "pip 镜像已配置为清华源: https://pypi.tuna.tsinghua.edu.cn/simple"
    else
        info "pip 未安装，跳过"
    fi
}

# 2.1 配置 uv (新一代 Python 包管理器)
configure_uv() {
    info "配置 uv 镜像..."
    if command -v uv &> /dev/null; then
        # 设置环境变量
        export UV_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
        export UV_EXTRA_INDEX_URL="https://mirrors.aliyun.com/pypi/simple/"

        # 写入 shell 配置文件
        UV_CONFIG='
# uv 清华镜像配置 (新一代 Python 包管理器)
export UV_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
export UV_EXTRA_INDEX_URL="https://mirrors.aliyun.com/pypi/simple/"
'

        # 添加到 ~/.zshrc 或 ~/.bashrc
        if [[ -f ~/.zshrc ]]; then
            grep -q "UV_INDEX_URL" ~/.zshrc || echo "$UV_CONFIG" >> ~/.zshrc
        elif [[ -f ~/.bashrc ]]; then
            grep -q "UV_INDEX_URL" ~/.bashrc || echo "$UV_CONFIG" >> ~/.bashrc
        fi

        success "uv 镜像已配置为清华源: https://pypi.tuna.tsinghua.edu.cn/simple"
        info "请运行 'source ~/.zshrc' 或重新打开终端使配置生效"
    else
        info "uv 未安装，跳过 (推荐安装: curl -LsSf https://astral.sh/uv/install.sh | sh)"
    fi
}

# 3. 配置 Docker
configure_docker() {
    info "配置 Docker 镜像..."
    if command -v docker &> /dev/null; then
        DAEMON_FILE=""

        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            mkdir -p ~/.docker
            DAEMON_FILE="$HOME/.docker/daemon.json"
        else
            # Linux
            DAEMON_FILE="/etc/docker/daemon.json"
        fi

        # 写入配置
        cat > "$DAEMON_FILE" << 'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

        success "Docker 镜像已配置"
        info "请重启 Docker 服务使配置生效:"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            echo "      在 Docker Desktop 中重启，或运行: killall Docker && open /Applications/Docker.app"
        else
            echo "      sudo systemctl restart docker"
        fi
    else
        info "Docker 未安装，跳过"
    fi
}

# 4. 配置 Homebrew (仅 macOS)
configure_homebrew() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        info "配置 Homebrew 镜像..."
        if command -v brew &> /dev/null; then
            # 设置环境变量
            export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-bottles-api.git"
            export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-bottles.git"
            export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew.git"
            export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
            export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"

            # 写入 shell 配置文件
            BREW_CONFIG='
# Homebrew 清华镜像配置
export HOMEBREW_API_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-bottles-api.git"
export HOMEBREW_BOTTLE_DOMAIN="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-bottles.git"
export HOMEBREW_BREW_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew.git"
export HOMEBREW_CORE_GIT_REMOTE="https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git"
export HOMEBREW_PIP_INDEX_URL="https://pypi.tuna.tsinghua.edu.cn/simple"
'

            # 添加到 ~/.zshrc 或 ~/.bashrc
            if [[ -f ~/.zshrc ]]; then
                grep -q "HOMEBREW_API_DOMAIN" ~/.zshrc || echo "$BREW_CONFIG" >> ~/.zshrc
            elif [[ -f ~/.bashrc ]]; then
                grep -q "HOMEBREW_API_DOMAIN" ~/.bashrc || echo "$BREW_CONFIG" >> ~/.bashrc
            fi

            success "Homebrew 镜像已配置为清华源"
            info "请运行 'source ~/.zshrc' 或重新打开终端使配置生效"
        else
            info "Homebrew 未安装，跳过"
        fi
    fi
}

# 5. 配置 Maven
configure_maven() {
    info "配置 Maven 镜像..."
    if command -v mvn &> /dev/null; then
        mkdir -p ~/.m2

        cat > ~/.m2/settings.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<settings xmlns="http://maven.apache.org/SETTINGS/1.0.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.0.0
                              http://maven.apache.org/xsd/settings-1.0.0.xsd">

  <mirrors>
    <mirror>
      <id>aliyunmaven</id>
      <mirrorOf>*</mirrorOf>
      <name>阿里云公共仓库</name>
      <url>https://maven.aliyun.com/repository/public</url>
    </mirror>
    <mirror>
      <id>aliyunmaven-spring</id>
      <mirrorOf>spring</mirrorOf>
      <name>阿里云Spring仓库</name>
      <url>https://maven.aliyun.com/repository/spring</url>
    </mirror>
  </mirrors>

</settings>
EOF

        success "Maven 镜像已配置为阿里云源"
    else
        info "Maven 未安装，跳过"
    fi
}

# 6. 配置 Gradle
configure_gradle() {
    info "配置 Gradle 镜像..."
    if command -v gradle &> /dev/null; then
        mkdir -p ~/.gradle

        cat > ~/.gradle/init.gradle << 'EOF'
gradle.projectsLoaded {
    rootProject.allprojects {
        buildscript {
            repositories {
                all { ArtifactRepository repo ->
                    if (repo instanceof MavenArtifactRepository) {
                        def url = repo.url.toString()
                        if (url.contains('repo1.maven.org') || url.contains('jcenter')) {
                            remove repo
                        }
                    }
                }
                maven { url 'https://maven.aliyun.com/repository/public' }
                maven { url 'https://maven.aliyun.com/repository/google' }
                maven { url 'https://maven.aliyun.com/repository/gradle-plugin' }
            }
        }

        repositories {
            all { ArtifactRepository repo ->
                if (repo instanceof MavenArtifactRepository) {
                    def url = repo.url.toString()
                    if (url.contains('repo1.maven.org') || url.contains('jcenter')) {
                        remove repo
                    }
                }
            }
            maven { url 'https://maven.aliyun.com/repository/public' }
            maven { url 'https://maven.aliyun.com/repository/google' }
        }
    }
}
EOF

        success "Gradle 镜像已配置为阿里云源"
    else
        info "Gradle 未安装，跳过"
    fi
}

# 7. 配置 Go
configure_go() {
    info "配置 Go 镜像..."
    if command -v go &> /dev/null; then
        go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct
        go env -w GOSUMDB=sum.golang.google.cn
        success "Go 镜像已配置为七牛云源: https://goproxy.cn"
    else
        info "Go 未安装，跳过"
    fi
}

# 8. 配置 NuGet (.NET)
configure_nuget() {
    info "配置 NuGet 镜像..."
    if command -v dotnet &> /dev/null; then
        dotnet nuget add source https://repo.huaweicloud.com/repository/nuget/ -n huaweicloud
        success "NuGet 镜像已配置为华为云源"
    else
        info "dotnet 未安装，跳过"
    fi
}

# 9. 配置 Cargo (Rust 包管理器)
configure_cargo() {
    info "配置 Cargo 镜像..."
    if command -v cargo &> /dev/null; then
        mkdir -p ~/.cargo

        cat > ~/.cargo/config.toml << 'EOF'
# Cargo 国内镜像配置

[source.crates-io]
replace-with = 'ustc'

[source.ustc]
registry = "https://mirrors.ustc.edu.cn/crates.io-index"

[source.rsproxy]
registry = "https://rsproxy.cn/crates.io-index"

[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"

[registries.ustc]
index = "https://mirrors.ustc.edu.cn/crates.io-index"

[net]
git-fetch-with-cli = true
EOF

        success "Cargo 镜像已配置为中科大源: https://mirrors.ustc.edu.cn/crates.io-index"
    else
        info "Cargo 未安装，跳过"
    fi
}

# 10. 配置 Rustup (Rust 工具链管理器)
configure_rustup() {
    info "配置 Rustup 镜像..."
    if command -v rustup &> /dev/null || command -v cargo &> /dev/null; then
        # 写入 shell 配置文件
        RUSTUP_CONFIG='
# Rustup 中科大镜像配置
export RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
export RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"
'

        # 添加到 ~/.zshrc 或 ~/.bashrc
        if [[ -f ~/.zshrc ]]; then
            grep -q "RUSTUP_DIST_SERVER" ~/.zshrc || echo "$RUSTUP_CONFIG" >> ~/.zshrc
        elif [[ -f ~/.bashrc ]]; then
            grep -q "RUSTUP_DIST_SERVER" ~/.bashrc || echo "$RUSTUP_CONFIG" >> ~/.bashrc
        fi

        # 设置当前环境变量
        export RUSTUP_DIST_SERVER="https://mirrors.ustc.edu.cn/rust-static"
        export RUSTUP_UPDATE_ROOT="https://mirrors.ustc.edu.cn/rust-static/rustup"

        success "Rustup 镜像已配置为中科大源"
        info "请运行 'source ~/.zshrc' 或重新打开终端使配置生效"
    else
        info "Rustup 未安装，跳过"
    fi
}

# 执行所有配置
echo ""
echo "开始配置镜像源..."
echo ""

configure_npm
configure_pip
configure_uv
configure_docker
configure_homebrew
configure_maven
configure_gradle
configure_go
configure_nuget
configure_cargo
configure_rustup

echo ""
echo "=========================================="
echo "    配置完成！"
echo "=========================================="
echo ""
echo "提示:"
echo "  - Docker 需要重启服务才能生效"
echo "  - Homebrew 需要重新打开终端或 source 配置文件"
echo "  - 运行 ~/.agents/skills/china-mirror/scripts/show-status.sh 查看当前配置"
echo ""