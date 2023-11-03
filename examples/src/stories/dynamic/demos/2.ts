/**
 * service function
 */

import type { Story } from "../Dynamic.stories";

export const story_2: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        selectValue: {
          type: "string",
          title: "Select",
          default: "经海路",
          description: "service指定函数名，params独立配置",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请选择下拉项",
            request: {
              service: "{{ () => queryAddress($self.initialValue) }}",
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        selectValue2: {
          type: "string",
          title: "Select",
          description: "service指定函数名，params独立配置，支持搜索",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请选择下拉项",
            request: {
              service: "{{ queryAddress }}",
              params: "",
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.componentProps.request.params = str }}",
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        selectValue3: {
          type: "string",
          title: "Select",
          description: "service指定函数名，params独立配置，支持搜索",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请选择下拉项",
            request: {
              customService: "{{ customJsonp }}",
              url: "https://apis.map.qq.com/ws/place/v1/suggestion",
              params: {
                keyword: "",
              },
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.componentProps.request.params.keyword = str }}",
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};
