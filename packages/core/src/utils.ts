import type { RequestObject } from "./type";

const getType = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1);

export function isArray(obj: any): obj is any[] {
  return getType(obj) === "Array";
}

export function isObject(obj: any): obj is { [key: string]: any } {
  return getType(obj) === "Object";
}

export function isString(obj: any): obj is string {
  return getType(obj) === "String";
}

export function isNumber(obj: any): obj is number {
  return getType(obj) === "Number" && obj === obj;
}

export function isFunction(obj: any): obj is (...args: any[]) => any {
  return typeof obj === "function";
}

const parseURL = (url: string, params: RequestObject["params"]) => {
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

export const simpleFetch = (config: RequestObject) => {
  const { url, baseURL = "", params, ...options } = config;
  const method = options.method || "GET";

  if (typeof url !== "string" || !url) {
    throw new TypeError("url must be required and of string type");
  }

  let fullUrl = /^http(s?):\/\//i.test(url) ? url : baseURL + url;

  if (method.toUpperCase() === "GET") {
    fullUrl = parseURL(fullUrl, params);
  } else {
    options.body = JSON.stringify(params);
  }

  return fetch(fullUrl, { ...options, method }).then((response) => {
    if (!response.ok) {
      Promise.reject(response);
    }
    return response.json();
  });
};
