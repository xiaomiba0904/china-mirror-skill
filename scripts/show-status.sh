#!/bin/bash
# 显示当前镜像源配置状态

echo "=========================================="
echo "    当前镜像源配置状态"
echo "=========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_status() {
    local tool="$1"
    local status="$2"
    echo -e "${BLUE}[$tool]${NC}"
    echo "$status"
    echo ""
}

# npm
if command -v npm &> /dev/null; then
    NPM_REG=$(npm config get registry)
    show_status "npm" "当前源: $NPM_REG"
else
    show_status "npm" "未安装"
fi

# pip
if command -v pip &> /dev/null || command -v pip3 &> /dev/null; then
    PIP_CMD="pip"
    command -v pip &> /dev/null || PIP_CMD="pip3"
    PIP_INDEX=$(pip config list 2>/dev/null | grep index-url || echo "未配置")
    show_status "pip" "$PIP_INDEX"
else
    show_status "pip" "未安装"
fi

# uv (新一代 Python 包管理器)
if command -v uv &> /dev/null; then
    UV_INDEX=$(echo $UV_INDEX_URL || echo "未配置")
    UV_EXTRA=$(echo $UV_EXTRA_INDEX_URL || echo "未配置")
    show_status "uv" "主镜像: $UV_INDEX\n备用镜像: $UV_EXTRA"
else
    show_status "uv" "未安装 (推荐安装: curl -LsSf https://astral.sh/uv/install.sh | sh)"
fi

# Docker
if command -v docker &> /dev/null; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        DOCKER_CONF="$HOME/.docker/daemon.json"
    else
        DOCKER_CONF="/etc/docker/daemon.json"
    fi

    if [[ -f "$DOCKER_CONF" ]]; then
        DOCKER_MIRRORS=$(cat "$DOCKER_CONF" | python3 -c "import json,sys; d=json.load(sys.stdin); print('\n'.join(d.get('registry-mirrors', ['未配置'])))" 2>/dev/null || cat "$DOCKER_CONF")
        show_status "Docker" "镜像源:\n$DOCKER_MIRRORS"
    else
        show_status "Docker" "配置文件不存在"
    fi
else
    show_status "Docker" "未安装"
fi

# Homebrew (仅 macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &> /dev/null; then
        BREW_API=$(echo $HOMEBREW_API_DOMAIN || echo "未配置")
        BREW_CORE=$(echo $HOMEBREWREW_CORE_GIT_REMOTE || echo "未配置")
        show_status "Homebrew" "API Domain: $BREW_API\nCore Git: $BREW_CORE"
    else
        show_status "Homebrew" "未安装"
    fi
fi

# Maven
if command -v mvn &> /dev/null; then
    if [[ -f ~/.m2/settings.xml ]]; then
        MAVEN_MIRROR=$(grep -A 3 "<url>" ~/.m2/settings.xml | head -4 || echo "未配置")
        show_status "Maven" "$MAVEN_MIRROR"
    else
        show_status "Maven" "settings.xml 不存在"
    fi
else
    show_status "Maven" "未安装"
fi

# Gradle
if command -v gradle &> /dev/null; then
    if [[ -f ~/.gradle/init.gradle ]]; then
        show_status "Gradle" "init.gradle 已配置 (阿里云镜像)"
    else
        show_status "Gradle" "init.gradle 不存在"
    fi
else
    show_status "Gradle" "未安装"
fi

# Go
if command -v go &> /dev/null; then
    GO_PROXY=$(go env GOPROXY)
    show_status "Go" "GOPROXY: $GO_PROXY"
else
    show_status "Go" "未安装"
fi

# NuGet
if command -v dotnet &> /dev/null; then
    NUGET_SOURCES=$(dotnet nuget list source 2>/dev/null || echo "未配置")
    show_status "NuGet" "$NUGET_SOURCES"
else
    show_status "NuGet" "未安装"
fi

# Cargo (Rust)
if command -v cargo &> /dev/null; then
    if [[ -f ~/.cargo/config.toml ]]; then
        CARGO_SOURCE=$(grep -A 1 "source.ustc" ~/.cargo/config.toml 2>/dev/null | head -2 || echo "未配置")
        show_status "Cargo" "配置文件: ~/.cargo/config.toml\n$CARGO_SOURCE"
    elif [[ -f ~/.cargo/config ]]; then
        CARGO_SOURCE=$(grep -A 1 "source.ustc" ~/.cargo/config 2>/dev/null | head -2 || echo "未配置")
        show_status "Cargo" "配置文件: ~/.cargo/config\n$CARGO_SOURCE"
    else
        show_status "Cargo" "配置文件不存在"
    fi
else
    show_status "Cargo" "未安装 (Rust 包管理器)"
fi

# Rustup (Rust 工具链管理器)
if command -v rustup &> /dev/null || command -v cargo &> /dev/null; then
    RUSTUP_DIST=$(echo $RUSTUP_DIST_SERVER || echo "未配置")
    show_status "Rustup" "RUSTUP_DIST_SERVER: $RUSTUP_DIST"
else
    show_status "Rustup" "未安装 (Rust 工具链管理器)"
fi

echo "=========================================="