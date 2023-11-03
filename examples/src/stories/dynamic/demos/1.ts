/**
 * Basic
 */

import type { Story } from "../Dynamic.stories";

export const story_1: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        basic_select: {
          type: "string",
          title: "基础下拉",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              url: "/ws/place/v1/suggestion",
              params: {
                keyword: "{{ $self.initialValue }}",
              },
              format: "{{ (res) => res?.data || [] }}",
            },
            fieldNames: {
              label: "title",
              value: "id",
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        basic_select_default: {
          type: "string",
          title: "基础下拉",
          description: "value初次默认展示下拉项第0项",
          default:
            "{{ $self.value ?? ($self.dataSource && $self.dataSource[0] ? $self.dataSource[0].id : null) }}",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              url: "/ws/place/v1/suggestion",
              params: {
                key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
                keyword: "经海路",
              },
              format: "{{ (res) => res?.data || [] }}",
            },
            fieldNames: {
              label: "title",
              value: "id",
            },
          },
          "x-reactions": ["{{ useAsyncDataSource }}"],
        },
        search_select: {
          type: "string",
          title: "搜索下拉",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              url: "/ws/place/v1/suggestion",
              params: {
                keyword: "",
              },
              format: "{{ (res) => res?.data || [] }}",
              mountLoad: false,
            },
            fieldNames: {
              label: "title",
              value: "id",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.componentProps.request.params.keyword = str }}",
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        dropdown_select: {
          type: "string",
          title: "下拉加载",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              url: "/ws/place/v1/suggestion",
              params: {
                keyword: "",
              },
              format: "{{ (res) => res?.data || [] }}",
              mountLoad: false,
            },
            fieldNames: {
              label: "title",
              value: "id",
            },
            onDropdownVisibleChange:
              "{{ open => { if(open){$self.componentProps.request.params.keyword = $self.initialValue} } }}",
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};
