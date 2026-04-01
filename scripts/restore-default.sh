#!/bin/bash
# 恢复所有镜像源为默认配置

set -e

echo "=========================================="
echo "    恢复默认镜像源配置"
echo "=========================================="
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() {
    echo "${GREEN}[✓]${NC} $1"
}

info() {
    echo "${YELLOW}[→]${NC} $1"
}

# npm
restore_npm() {
    info "恢复 npm 默认配置..."
    if command -v npm &> /dev/null; then
        npm config set registry https://registry.npmjs.org
        success "npm 已恢复默认"
    fi
}

# pip
restore_pip() {
    info "恢复 pip 默认配置..."
    if command -v pip &> /dev/null || command -v pip3 &> /dev/null; then
        pip config unset global.index-url 2>/dev/null || true
        rm -f ~/.pip/pip.conf ~/.config/pip/pip.conf
        success "pip 已恢复默认"
    fi
}

# uv
restore_uv() {
    info "恢复 uv 默认配置..."
    # 从配置文件中删除
    if [[ -f ~/.zshrc ]]; then
        sed -i '' '/UV_INDEX_URL/d' ~/.zshrc
        sed -i '' '/UV_EXTRA_INDEX_URL/d' ~/.zshrc
        sed -i '' '/# uv 清华镜像配置/d' ~/.zshrc
    fi

    if [[ -f ~/.bashrc ]]; then
        sed -i '/UV_INDEX_URL/d' ~/.bashrc
        sed -i '/UV_EXTRA_INDEX_URL/d' ~/.bashrc
        sed -i '/# uv 清华镜像配置/d' ~/.bashrc
    fi

    # 清除当前环境变量
    unset UV_INDEX_URL
    unset UV_EXTRA_INDEX_URL

    success "uv 已恢复默认"
}

# Docker
restore_docker() {
    info "恢复 Docker 默认配置..."
    if command -v docker &> /dev/null; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            DAEMON_FILE="$HOME/.docker/daemon.json"
        else
            DAEMON_FILE="/etc/docker/daemon.json"
        fi

        cat > "$DAEMON_FILE" << 'EOF'
{
  "registry-mirrors": []
}
EOF
        success "Docker 已恢复默认"
        info "请重启 Docker 服务使配置生效"
    fi
}

# Homebrew
restore_homebrew() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        info "恢复 Homebrew 默认配置..."

        # 从配置文件中删除
        if [[ -f ~/.zshrc ]]; then
            sed -i '' '/HOMEBREW_API_DOMAIN/d' ~/.zshrc
            sed -i '' '/HOMEBREW_BOTTLE_DOMAIN/d' ~/.zshrc
            sed -i '' '/HOMEBREW_BREW_GIT_REMOTE/d' ~/.zshrc
            sed -i '' '/HOMEBREW_CORE_GIT_REMOTE/d' ~/.zshrc
            sed -i '' '/HOMEBREW_PIP_INDEX_URL/d' ~/.zshrc
            sed -i '' '/# Homebrew 清华镜像配置/d' ~/.zshrc
        fi

        if [[ -f ~/.bashrc ]]; then
            sed -i '/HOMEBREW_API_DOMAIN/d' ~/.bashrc
            sed -i '/HOMEBREW_BOTTLE_DOMAIN/d' ~/.bashrc
            sed -i '/HOMEBREW_BREW_GIT_REMOTE/d' ~/.bashrc
            sed -i '/HOMEBREW_CORE_GIT_REMOTE/d' ~/.bashrc
            sed -i '/HOMEBREW_PIP_INDEX_URL/d' ~/.bashrc
            sed -i '/# Homebrew 清华镜像配置/d' ~/.bashrc
        fi

        success "Homebrew 已恢复默认"
    fi
}

# Maven
restore_maven() {
    info "恢复 Maven 默认配置..."
    rm -f ~/.m2/settings.xml
    success "Maven 已恢复默认"
}

# Gradle
restore_gradle() {
    info "恢复 Gradle 默认配置..."
    rm -f ~/.gradle/init.gradle
    success "Gradle 已恢复默认"
}

# Go
restore_go() {
    info "恢复 Go 默认配置..."
    if command -v go &> /dev/null; then
        go env -w GOPROXY=https://proxy.golang.org,direct
        go env -w GOSUMDB=sum.golang.org
        success "Go 已恢复默认"
    fi
}

# NuGet
restore_nuget() {
    info "恢复 NuGet 默认配置..."
    if command -v dotnet &> /dev/null; then
        dotnet nuget remove source huaweicloud 2>/dev/null || true
        success "NuGet 已恢复默认"
    fi
}

# Cargo (Rust)
restore_cargo() {
    info "恢复 Cargo 默认配置..."
    rm -f ~/.cargo/config.toml ~/.cargo/config
    success "Cargo 已恢复默认"
}

# Rustup (Rust 工具链管理器)
restore_rustup() {
    info "恢复 Rustup 默认配置..."

    # 从配置文件中删除
    if [[ -f ~/.zshrc ]]; then
        sed -i '' '/RUSTUP_DIST_SERVER/d' ~/.zshrc
        sed -i '' '/RUSTUP_UPDATE_ROOT/d' ~/.zshrc
        sed -i '' '/# Rustup 中科大镜像配置/d' ~/.zshrc
    fi

    if [[ -f ~/.bashrc ]]; then
        sed -i '/RUSTUP_DIST_SERVER/d' ~/.bashrc
        sed -i '/RUSTUP_UPDATE_ROOT/d' ~/.bashrc
        sed -i '/# Rustup 中科大镜像配置/d' ~/.bashrc
    fi

    # 清除当前环境变量
    unset RUSTUP_DIST_SERVER
    unset RUSTUP_UPDATE_ROOT

    success "Rustup 已恢复默认"
}

echo ""
restore_npm
restore_pip
restore_uv
restore_docker
restore_homebrew
restore_maven
restore_gradle
restore_go
restore_nuget
restore_cargo
restore_rustup

echo ""
echo "=========================================="
echo "    恢复完成！"
echo "=========================================="