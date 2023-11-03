import { transformAddress } from "./transformAddress";
import jsonp from "fetch-jsonp";
import qs from "query-string";
import type { RequestConfig } from "formily-request";

/**
 * 腾讯地图搜素（jsonp）
 */
type TencentRes = {
  data?: Array<{ address: string; id: string }>;
};

export const queryAddress = (keyword: string) => {
  const str = qs.stringify({
    code: "utf-8",
    key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
    keyword,
    output: "jsonp",
  });
  return jsonp(`https://apis.map.qq.com/ws/place/v1/suggestion?${str}`)
    .then((res) => res.json())
    .then((res: TencentRes) =>
      res.data?.map(({ address, id }) => ({ label: address, value: id }))
    );
};

/**
 * 级联下拉
 */
export const queryCascader = () => {
  return fetch("https://unpkg.com/china-location@2.1.0/dist/location.json")
    .then((res) => res.json())
    .then((data) => transformAddress(data));
};

/**
 * 自定义的jsonp请求，用于演示`customService`配置项的用途
 * 场景：当我们希望使用 request 的 url、params 配置，又不想使用内置的 simpleFetch 时
 * 可以给 customService 传入这个函数，自定义实现
 */
export const customJsonp = (request: RequestConfig) => {
  const params = typeof request.params === "object" ? request.params : {};
  const str = qs.stringify({
    key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
    output: "jsonp",
    ...params,
  });
  return jsonp(`${request.url}?${str}`).then((res) => res.json());
};
