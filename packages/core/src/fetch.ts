import type { ObjectParam, RequestConfig } from "./type";

function params2str(obj: ObjectParam) {
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "undefined" || value === null) return;
    params.append(key, value);
  });
  return params.toString();
}

export const simpleFetch = (
  config: RequestConfig & { params: ObjectParam }
) => {
  const { url, baseURL = "", params, ...options } = config;
  const method = options.method || "GET";

  if (typeof url !== "string" || !url) {
    throw new TypeError("url must be required and of string type");
  }

  let fullUrl = /^http(s?):\/\//i.test(url) ? url : baseURL + url;

  if (method.toUpperCase() === "GET") {
    fullUrl += `?${params2str(params)}`;
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
