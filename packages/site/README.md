# Formily Request Documentation Site

基于 [dumi](https://d.umijs.org) 构建的 formily-request 文档站点。

## 项目介绍

本项目是 formily-request 的官方文档站点，提供了以下功能：

- 详细的 API 文档和使用指南
- 丰富的示例代码和在线演示
- 完整的更新日志
- 基于 Formily + Ant Design 的实际应用案例

## 技术栈

- 文档框架：dumi v2
- UI 组件：
  - @formily/antd-v5
  - antd v5
- 核心依赖：
  - @formily/core
  - @formily/react
  - formily-request

## 开发指南

### 环境要求

- Node.js >= 14
- pnpm >= 7

### 本地开发

```bash
# 安装依赖
$ pnpm install

# 启动开发服务器
$ pnpm start

# 构建文档
$ pnpm run build

# 本地预览生产构建
$ pnpm run preview
```

### Netlify Function 服务

本项目使用了 Netlify 的 Function 服务来支持一些在线演示功能。在本地开发时，需要同时启动本地的 Function 服务。

在开发环境下，mock API 服务运行在 `http://localhost:8888`，生产环境下使用 `https://chan-mock-api.netlify.app` 作为 API 服务地址。配置如下：

```typescript
// /packages/site/constant/index.ts
export const mockApiBaseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://chan-mock-api.netlify.app'
    : 'http://localhost:8888';
```

#### 配置步骤

1. 在项目根目录创建 `.env` 文件
2. 添加必要的环境变量（具体变量请参考项目文档）
3. 启动开发服务器时会自动启动 Function 服务

## 目录结构

```
├── docs/               # 文档目录
│   ├── api/           # API 文档
│   ├── guide/         # 使用指南
│   └── demo/          # 示例代码
├── .dumi/             # dumi 配置目录
├── public/            # 静态资源
└── assets/            # 文档资源
```
