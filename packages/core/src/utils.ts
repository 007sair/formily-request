import type { XRequest } from "./type";

const getType = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1);

const isObject = (obj: any): obj is object => getType(obj) === "Object";

export const getErrorMsg = (error: any) => {
  return error instanceof Error ? error.message : "unknown error";
};

export const stringify = (option: any, fallback?: string) => {
  try {
    return JSON.stringify(option, (_, val) => {
      if (typeof val === "function") {
        return `${val}`;
      }
      if (typeof val === "undefined") {
        return "undefined";
      }
      return val;
    });
  } catch (error) {
    if (fallback) return fallback;
    const msg = getErrorMsg(error);
    return `JSON.stringify error: ${msg}`;
  }
};

const parseURL = (url: string, params: XRequest["params"]) => {
  const [prefix, search] = url.split("?");
  const usp = new URLSearchParams(search);
  if (isObject(params)) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "undefined" || value === null) return;
      usp.has(key) ? usp.set(key, value) : usp.append(key, value);
    });
  }
  const p = usp.toString();
  return p ? [prefix, p].join("?") : prefix;
};

export const simpleFetch = async (config: XRequest) => {
  try {
    const { url, baseURL = "", params, ...options } = config;
    const method = options.method || "GET";
    if (typeof url !== "string" || !url) {
      throw new TypeError("url字段不能为空且必须是字符串类型");
    }
    let fullUrl = /^http(s?):\/\//i.test(url) ? url : baseURL + url;
    if (method.toUpperCase() === "GET") {
      fullUrl = parseURL(fullUrl, params);
    } else {
      options.body = stringify(params, "{}");
    }
    const response = await fetch(fullUrl, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    const msg = getErrorMsg(error);
    throw new Error(`default fetch error, ${msg}`, { cause: error });
  }
};

export const safeParams = (v: unknown) => {
  if (!v) return {};
  if (typeof v !== "object") {
    throw new TypeError(`参数类型错误,需要为对象`);
  }
  return v;
};
