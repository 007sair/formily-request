import type { XRequest } from "./type";

const getType = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1);

export const is = {
  object: (arg: any): arg is object => getType(arg) === "Object",
};

const parseURL = (url: string, params: XRequest["params"]) => {
  const [prefix, search] = url.split("?");
  const usp = new URLSearchParams(search);
  if (is.object(params)) {
    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === "undefined" || value === null) return;
      usp.has(key) ? usp.set(key, value) : usp.append(key, value);
    });
  }
  const p = usp.toString();
  return p ? [prefix, p].join("?") : prefix;
};

export const simpleFetch = (config: XRequest) => {
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

  return fetch(fullUrl, {
    headers: { "Content-Type": "application/json" },
    ...options,
    method,
  }).then((response) => {
    if (!response.ok) {
      Promise.reject(response);
    }
    return response.json();
  });
};
