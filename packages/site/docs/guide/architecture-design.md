---
nav: { title: '指南', order: 1 }
group: { title: '进阶', order: 3 }
title: 架构设计
order: 2
toc: content
---

# 架构设计

## 1. 整体架构

formily-request 采用单例模式和插件化设计，通过扩展 JSON Schema 实现异步数据请求的配置能力。整体架构如下：

![https://mermaid.live/edit#pako:eNptkkFPE0EUx7_KZE6SlBLU0xw4FRISqcbCxezlMftaJtnu1NnZRkK4GCUeaKSIcChJQ-KhBwUJGiOVjzO7-C2czmxb47qnt29_7z__-e_bo1yGSBlN8GWKMceagJaCdhAT-3RAacFFB2JNGnwH20AgKarsZmQODsvccwSuRRcnpPnQM7cn5tf7_Gacj4dl-IloIt_lkaPzk6Hp35n-KDsf_k_XGkz0BLy_-pFdvzaf3uRHB2VwTWAUOuxiZHofzZez7PJ7EHvQe19cWZnaZGS5SvxdXi0qf8bvt7387tIP1KVGIruoilFGFLZEolE9A207icemclZ5didGHlaJeTcw49tZEObq5_31xb_SczNyO0HVhe0IHxRmFjw8U3Xe3RdGHlVJPuibo8_l6Obif_lZr69vLm083apvrtaWtuqumvp3klbcxcfIY2vdBVyEfXyYDb5lp1_L1gsvkOzGvIG6BhoaMlUcaYW2UbVBhHa_9iaDAdU2Qwwos2WITUgjHdAg3rcopFo2rARlWqVYoWknBD1dR8qaECW2i6HQUm34nXWrW6H2r7-Qcs4ombZ2Zm9eZ9XNFc39P28nMIo](https://mermaid.ink/svg/pako:eNptkkFPE0EUx7_KZE6SlBLU0xw4FRISqcbCxezlMftaJtnu1NnZRkK4GCUeaKSIcChJQ-KhBwUJGiOVjzO7-C2czmxb47qnt29_7z__-e_bo1yGSBlN8GWKMceagJaCdhAT-3RAacFFB2JNGnwH20AgKarsZmQODsvccwSuRRcnpPnQM7cn5tf7_Gacj4dl-IloIt_lkaPzk6Hp35n-KDsf_k_XGkz0BLy_-pFdvzaf3uRHB2VwTWAUOuxiZHofzZez7PJ7EHvQe19cWZnaZGS5SvxdXi0qf8bvt7387tIP1KVGIruoilFGFLZEolE9A207icemclZ5didGHlaJeTcw49tZEObq5_31xb_SczNyO0HVhe0IHxRmFjw8U3Xe3RdGHlVJPuibo8_l6Obif_lZr69vLm083apvrtaWtuqumvp3klbcxcfIY2vdBVyEfXyYDb5lp1_L1gsvkOzGvIG6BhoaMlUcaYW2UbVBhHa_9iaDAdU2Qwwos2WITUgjHdAg3rcopFo2rARlWqVYoWknBD1dR8qaECW2i6HQUm34nXWrW6H2r7-Qcs4ombZ2Zm9eZ9XNFc39P28nMIo)

## 2. 核心模块

### 2.1 Schema 注册

formily-request 通过 `registerPatches` 方法扩展 JSON Schema，将 `x-request` 配置转换为响应式对象。注册过程包含以下步骤：

1. 检查字段配置中是否存在 `x-request`
2. 创建响应式对象和生命周期缓存
3. 注册字段反应器（reaction）
4. 标记注册状态，避免重复注册

```typescript
Schema.registerPatches((schema) => {
  const x_request = schema[this.key];
  if (typeof x_request === 'object' && !schema[flag]) {
    const caches = { lifecycle: Lifecycle.INIT, dispose: null };
    const reaction = this.createReaction(x_request, globalConfig, caches);
    schema['x-reactions'] = [reaction];
    schema[flag] = true;
  }
  return schema;
});
```

### 2.2 响应式更新

插件使用 `@formily/reactive` 实现响应式更新机制，主要包含三个核心操作：

1. **创建响应式对象**：使用 `observable` 将请求配置转换为可观察对象
2. **监听配置变化**：通过 `observe` 监听配置变更并触发请求
3. **注入更新方法**：为字段注入 `updateRequest` 和 `reloadRequest` 方法

```typescript
// 创建响应式对象
const obs = observable(request);

// 监听配置变化
caches.dispose = observe(obs, () => {
  asyncSetDataSource();
});

// 注入更新方法
field.inject({
  updateRequest: (fn) => fn(obs),
  reloadRequest: () => asyncSetDataSource(),
});
```

### 2.3 生命周期管理

插件通过生命周期枚举和缓存机制管理组件状态：

```typescript
enum Lifecycle {
  INIT, // 初始化阶段
  MOUNTED, // 组件已挂载
  UNMOUNT, // 组件已卸载
}

// 生命周期处理
if (field.mounted) {
  // 配置变更触发请求
  if (caches.lifecycle > Lifecycle.MOUNTED && !disabledReactive) {
    asyncSetDataSource();
  }
  // 首次挂载处理
  if (caches.lifecycle < Lifecycle.MOUNTED) {
    caches.lifecycle = Lifecycle.MOUNTED;
    if (mountLoad) {
      asyncSetDataSource();
    }
  }
}
```

## 3. 扩展点设计

formily-request 提供了多个扩展点，允许开发者自定义请求行为：

### 3.1 请求服务定制

- **service**：自定义请求服务，用于处理特定的请求逻辑

  ```typescript
  'x-request': {
    service: (params) => fetch('/api/data', { params })
  }
  ```

- **customService**：完全自定义请求逻辑，可以访问完整的请求配置
  ```typescript
  'x-request': {
    customService: (request, globalConfig) => {
      // 完全自定义的请求逻辑
      return Promise.resolve(data);
    }
  }
  ```

### 3.2 数据处理

- **format**：自定义数据格式化，支持对请求结果进行转换
  ```typescript
  'x-request': {
    format: (data) => data.map(item => ({
      label: item.name,
      value: item.id
    }))
  }
  ```

### 3.3 生命周期钩子

插件提供了多个生命周期钩子，用于控制请求行为和处理结果：

- **ready**：控制请求触发条件
- **mountLoad**：控制组件挂载时是否自动请求
- **onSuccess**：请求成功的回调处理
- **onError**：请求失败的错误处理

```typescript
'x-request': {
  ready: (request) => !!request.params.parentId,
  mountLoad: true,
  onSuccess: (result) => console.log('请求成功', result),
  onError: (error) => console.error('请求失败', error)
}
```

## 4. 数据流转过程

![https://mermaid.live/edit#pako:eNp9k01P2zAYx7-K5XMn7jlwYjttO6y3KRfLeQqR0rhzHKQKIUHFpgk1gkqFHWDruje4UF422mml2pfBTvct5sReQomGT375Pf_Hz99-NjBlHmAHR_AqhpDCik9WOWm6IdKjRbjwqd8ioUBPfAg8RCI0H57K5ECevVOj6yr21G8AbdMAMjTtD2RvJnun6nhQRV9kKSORa55P1GVHftlJ999UwTrwdZ_miuo4kbtDedmpUitEkDqLuQUPLlQyUr_23dCgz5kAxNaBm0ocZCpQ3c58Nlv68zpJZyN19EMdXhg-px4tLxcFOUh93lKDr3eLSnfHamvbBJBAoHS6czsdy8mVkTUH2ShUtKKt20Hzk29yr1etPRsWuoub9ByI11bvhzpPSWe51XQ4H383avfPFxWtn9oCnf16YkIWYYss3PZ3Xx59ML7-T7m868cbebMnu4cP8-Wb6ZDcfK_YWYwpSR1mX9D4x8J6TClEURkAQQTo9mdiLHnYDKuVTt-qs0_3rYDQM4tiUvlGqn-uuttxS18crOoSh4ARz65wDTeBN4nv6TbbyFRcLNagCS529NSDBokD4WI33NQoiQWrt0OKHcFjqGEjbLvy3yZ4vmD8mencvIFrWPfAS8Y00iC6-hrmLF5dK1ZG5nEeZzc3_wIVz6Z-](https://mermaid.ink/svg/pako:eNp9k89P2zAUx_8Vy-dO3HPgxHbadlhvUy6W8wqR0rhzHKQKIUHFpgk1gkqFHWDryjbgQoFttNNKtX8GO91_MSe2Eko0fPKPz_s-v6_9NjBlHmAHR_AmhpDCik9WOWm6IdKjRbjwqd8ioUDPfAg8RCI0H57L5EBefFCjmyr23G8AbdMAMjTtD2RvJnvn6nhQRV9lKSORa15O1HVHft1J999VwTrwdZ_miuo4kbtDed2pUitEkDqLuQUPrlQyUr_33dCgL5kAxNaBm0ocZCpQ3c58Nlv6-zZJZyN19FMdXhk-p54sLxcFOUh92VKDb_eLSnfHamvbBJBAoHS6czcdy8l3I2sOslGoaEVbt4PmZ6dyr1etPRsWuo-b9ByI11YfhzpPSWe51XQ4H_8wag_PFxWtn9oCnf1mYkIWYYss3PZPXx59Mr7-T7m86-dbebsnu4eP8-Wb6ZDcfK_YWYwpSR1mX9D4x8J6TClEURkAQQTo7ldiLHncDKuVTt-ri5OHVkDomUUxqXwj1b9U3e24pS8OVnWJQ8CIZ1e4hpvAm8T3dJttZCouFmvQBBc7eupBg8SBcLEbbmqUxILV2yHFjuAx1LARtl2JnQbRpdUweL5g_IVp3byDa1g3wWvGSoazeHWtWBmdp3mc3dz8B7gdpsk)

这个流程完整展示了从字段配置到数据更新的处理过程，包括：

1. 生命周期状态检查
2. 请求条件验证
3. 数据请求和格式化
4. 字段状态更新
5. 回调函数处理

通过这种设计，formily-request 实现了灵活的异步数据处理能力，同时保证了数据流转的可靠性和可扩展性。
