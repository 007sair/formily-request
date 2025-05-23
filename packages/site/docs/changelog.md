---
nav: { title: 'Changelog', order: 4 }
---

# Changelog

## v1.0.0

`2025-05-12`

此版本包含重大架构升级，引入全新的生命周期机制，提供更强大的调试能力。同时重构了文档站点，提供完整的技术生态体系说明。

### ⚠️ Breaking Changes

- 移除 `updateRequest` 的内置防抖机制
  - 影响：所有使用 `updateRequest` 进行请求更新的场景
  - 迁移：现在需要手动配置 `debounce` 参数来实现防抖
- 全局配置 `onError` 更名为 `onLog`
  - 影响：使用了全局错误处理的应用
  - 迁移：将 `onError` 替换为 `onLog`，支持更全面的日志级别
- 废弃 `staticParams` 配置项
  - 影响：使用 `staticParams` 传递静态参数的场景
  - 迁移：使用新的 `params` 配置项替代，支持动态参数注入

### 🎉 新特性

- **主动请求能力**

  - 新增 `reloadRequest` API
  - 支持在任意时刻主动触发接口请求
  - 提供完整的请求生命周期管理

- **响应式控制**
  - 新增 `disabledReactive` 配置
  - 支持按需禁用响应式更新
  - 优化高频更新场景的性能

### 🔨 优化提升

- **调试体验优化**

  - 增强 `debug` 日志系统
  - 提供更详细的运行时信息
  - 支持插件运行状态实时监控

- **文档系统升级**
  - 全新的技术文档站点
  - 提供完整的 API 参考
  - 丰富的最佳实践示例

### 📋 升级建议

1. 先移除已废弃的 API 使用
2. 更新错误处理配置
3. 按需添加防抖处理
4. 测试所有表单提交流程
