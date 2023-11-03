import type { Field } from "@formily/core";
import type { DataChange, IAction } from "@formily/reactive";

export type ObjectParam = Record<string, any>;

export interface RequestConfig extends RequestInit {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  params?: string | number | ObjectParam;
  format?: (data: unknown) => [];
  baseURL?: string;
  staticParams?: string | number | ObjectParam;
  service?: (params: unknown) => Promise<unknown>;
  mountLoad?: boolean;
  customService?: (config: RequestConfig) => Promise<unknown>;
  debug?: boolean;
}

export type StaticReactive = {
  action: IAction;
  observe: (
    target: object,
    observer?: (change: DataChange) => void,
    deep?: boolean
  ) => () => void;
} | null;

export interface FormilyRequest {
  reactive: StaticReactive;
  (baseConfig: Partial<RequestConfig>): (field: Field) => void;
}
