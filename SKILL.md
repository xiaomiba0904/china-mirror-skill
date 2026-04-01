---
name: china-mirror
description: "国内镜像源加速。生成包下载命令时自动添加大厂/高校背书的可信镜像参数。触发：安装包、下载依赖、npm/pip/uv/cargo/go 等包管理操作。"
version: 2.0.0
---

# China Mirror — 国内镜像源自动添加

## 核心规则（必须遵循）

**生成任何包下载命令时，必须自动添加国内镜像源参数。**

**只使用以下大厂/高校背书的可信镜像源：**

| 工具 | 自动添加参数 | 镜像源 | 背书方 |
|------|-------------|--------|--------|
| npm | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| pnpm | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| yarn | `--registry=https://registry.npmmirror.com` | 淘宝 npmmirror | 阿里巴巴 ✅ |
| pip | `-i https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| pip3 | `-i https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |
| uv | `--index-url https://pypi.tuna.tsinghua.edu.cn/simple` | 清华 PyPI | 清华大学 ✅ |

## 示例

| 用户请求 | 正确生成的命令 |
|----------|---------------|
| 安装 lodash | `npm install lodash --registry=https://registry.npmmirror.com` |
| 安装 requests | `pip install requests -i https://pypi.tuna.tsinghua.edu.cn/simple` |
| 安装 axios | `npm install axios --registry=https://registry.npmmirror.com` |
| uv 安装 pandas | `uv pip install pandas --index-url https://pypi.tuna.tsinghua.edu.cn/simple` |

## 例外情况

**不添加参数的情况：**
- 命令中已包含 `--registry`、`-i`、`--index-url` 等镜像参数
- 用户明确指定了其他镜像源

**不支持命令行参数的工具：**

这些工具需要配置文件，提示用户运行配置命令：

| 工具 | 配置方式 |
|------|----------|
| cargo/rustup | `echo '[source.crates-io]\nreplace-with = "ustc"\n[source.ustc]\nregistry = "https://mirrors.ustc.edu.cn/crates.io-index"' >> ~/.cargo/config.toml` |
| go | `go env -w GOPROXY=https://goproxy.cn,https://goproxy.io,direct` |
| brew | 详见清华 Homebrew 镜像文档 |
| docker | 配置 `/etc/docker/daemon.json` |

## 备选镜像源

如果主镜像不可用，可使用以下备选：

| 工具 | 备选镜像 | 背书方 |
|------|----------|--------|
| npm | `https://repo.huaweicloud.com/repository/npm/` | 华为云 ✅ |
| pip | `https://mirrors.aliyun.com/pypi/simple/` | 阿里云 ✅ |
| pip | `https://pypi.mirrors.ustc.edu.cn/simple/` | 中科大 ✅ |

## 安全声明

所有列出的镜像源均为**大厂或高校背书**，安全可信：
- 阿里巴巴、华为云、阿里云 — 大厂背书
- 清华大学、中国科学技术大学 — 高校背书

**禁止使用无背书的不明镜像源。**