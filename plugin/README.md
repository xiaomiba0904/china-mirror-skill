# China Mirror OpenClaw Plugin

本目录包含 OpenClaw 插件实现，用于自动检测包下载命令并提供镜像源配置提示。

## 功能

- **Hook 检测**: 在执行 `exec`/`system.run` 工具前自动检测包下载命令
- **智能提示**: 检测到下载命令时，提示推荐的国内镜像源
- **Slash 命令**: `/mirror` 命令查看和配置镜像源
- **安全可信**: 镜像源均为大厂/高校背书

## 与 Claude Code 版本的兼容

本插件与根目录的 `SKILL.md` 共享相同的镜像源配置，确保两个平台使用一致的镜像推荐：

| 工具 | 镜像源 | 背书方 |
|------|--------|--------|
| npm | 淘宝 npmmirror | 阿里巴巴 |
| pip | 清华 PyPI | 清华大学 |
| uv | 清华 PyPI | 清华大学 |
| cargo | 中科大 Cargo | 中科大 |
| rustup | 中科大 Rustup | 中科大 |
| go | 七牛云 GoProxy | 七牛云 |
| brew | 清华 Homebrew | 清华大学 |
| docker | 中科大 Docker | 中科大 |
| maven | 阿里云 Maven | 阿里巴巴 |

## 安装

### 通过 ClawHub 安装

```bash
# 从 ClawHub 安装
openclaw plugins install @xiaomiba0904/openclaw-china-mirror

# 或使用 clawhub CLI
clawhub install gehanbin/china-mirror
```

### 手动安装

```bash
# 克隆仓库
git clone https://github.com/xiaomiba0904/china-mirror-skill.git

# 构建插件
cd china-mirror-skill/plugin
npm install
npm run build

# 安装到 OpenClaw
mkdir -p ~/.openclaw/plugins
cp -r dist ~/.openclaw/plugins/china-mirror
cp openclaw.plugin.json ~/.openclaw/plugins/china-mirror/
```

## 配置

在 `openclaw.json` 中配置：

```json5
{
  plugins: {
    entries: {
      "china-mirror": {
        enabled: true,
        config: {
          showHint: true,   // 显示镜像提示
          silent: false,    // 非静默模式
        },
      },
    },
  },
}
```

## 使用

### 自动检测

当执行包下载命令时，插件自动检测并提示：

```
💡 检测到 npm 包下载命令

推荐配置国内镜像源加速下载：
- 镜像源: 淘宝 npmmirror (https://registry.npmmirror.com)
- 背书方: 阿里巴巴 ✅ 可信

配置命令:
npm config set registry https://registry.npmmirror.com
```

### Slash 命令

```bash
# 查看镜像状态
/mirror status

# 配置镜像
/mirror setup

# 恢复默认
/mirror restore
```

## Hook 行为

| 场景 | 行为 |
|------|------|
| 检测到下载命令 | 显示镜像提示，继续执行 |
| 已指定镜像参数 | 不提示，继续执行 |
| 已配置全局镜像 | 显示确认信息，继续执行 |
| 静默模式 | 仅记录日志，继续执行 |

**说明**: 所有镜像源均为大厂/高校背书，安全可信。Hook 仅提供友好提示。

## 开发

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 测试
npm test

# 发布
clawhub package publish gehanbin/china-mirror
```

## 文件结构

```
plugin/
├── openclaw.plugin.json  # 插件 manifest
├── package.json          # npm 包配置
├── tsconfig.json         # TypeScript 配置
├── src/
│   ├── index.ts          # 插件入口
│   └── types.ts          # 类型定义
└── README.md             # 本文档
```

## 相关链接

- [OpenClaw 文档](https://docs.openclaw.ai)
- [ClawHub](https://clawhub.ai)
- [插件开发指南](https://docs.openclaw.ai/plugins/building-plugins)