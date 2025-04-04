// @ts-nocheck dumi needs React import for real-time editing
import React from 'react';
import { type Option } from './types';
import { mockApiBaseURL } from '@site/constant/index';

const baseURL = mockApiBaseURL;

const obj2str = (obj: any) =>
  Object.keys(obj)
    .map((key: any) => key + '=' + obj[key])
    .join('&');

interface LevelParams {
  type: 'provinces' | 'cities' | 'districts';
  provinceId?: string | number;
  cityId?: string | number;
}

class CascaderDataManager {
  private cache: Map<string, Option[]>;

  constructor() {
    this.cache = new Map();
  }

  private getCacheKey(params: LevelParams): string {
    return obj2str(params);
  }

  private async fetchData(params: LevelParams): Promise<Option[]> {
    const _params = obj2str(params);
    const res = await fetch(`${baseURL}/api/area?${_params}`).then((res) =>
      res.json(),
    );
    return res?.data?.map((it: any) => ({
      ...it,
      type: params.type,
      isLeaf: params.type === 'districts', // 为“区”时表示w叶子节点
    }));
  }

  async getData(params: LevelParams): Promise<Option[]> {
    const cacheKey = this.getCacheKey(params);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const data = await this.fetchData(params);
    this.cache.set(cacheKey, data);
    return data;
  }

  updateNodeChildren(
    data: Option[],
    targetId: string | number | null | undefined,
    children: Option[],
  ): Option[] {
    return data.map((item) => {
      if (item.id === targetId) {
        return { ...item, children };
      }
      if (item.children) {
        return {
          ...item,
          children: this.updateNodeChildren(item.children, targetId, children),
        };
      }
      return item;
    });
  }

  findNode(data: Option[], targetId: string | number | null): Option | null {
    for (const item of data) {
      if (item.id === targetId) {
        return item;
      }
      if (item.children) {
        const found = this.findNode(item.children, targetId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}

export default CascaderDataManager;
