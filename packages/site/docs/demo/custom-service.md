---
order: 3
toc: content
---

# 自定义请求

## service 配置

使用 `service` 配置，可以自定义请求的方式，比较适合有自定义需求的场景。api 介绍见：[service](/configuration#service)

### 基本用法

<code src="./components/custom-service/BasicService.tsx"></code>

### 参数传递

<code src="./components/custom-service/ParamsService.tsx"></code>

## customService 配置

使用 `customService` 配置，可以自定义请求的方式，比较适合有自定义需求的场景。api 介绍见：[customService](/configuration#customservice)。

与 `service` 不同的是，通过 customService 配置的请求，内部使用的都是 `x-request` 的配置。当你既要自定义请求，又要使用 `x-request` 配置时，可以使用该配置。

<code src="./components/custom-service/CustomService.tsx"></code>
