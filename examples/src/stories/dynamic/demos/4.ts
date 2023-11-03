/**
 * 复杂联动效果
 */

import type { Story } from "../Dynamic.stories";

export const story_4: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          title: "关键字",
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
        selectValue: {
          type: "string",
          title: "Select",
          description: "下拉项数据依赖上方关键字",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              url: "/ws/place/v1/suggestion",
              params: {
                key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
                keyword: "{{ $values.keyword }}",
              },
              format: "{{ (res) => res?.data || [] }}",
              mountLoad: false,
            },
            fieldNames: {
              label: "title",
              value: "address",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.componentProps.request.params.keyword = str }}",
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        radioValue: {
          type: "string",
          title: "Radio",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Radio.Group",
          "x-component-props": {
            request: {
              service: "{{ queryAddress }}",
              params: "{{ $values.selectValue }}",
              mountLoad: false,
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
        checkboxValue: {
          type: "string",
          title: "Checkbox",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Checkbox.Group",
          "x-component-props": {
            request: {
              service: "{{ queryAddress }}",
              params: "{{ $values.selectValue }}",
              mountLoad: false,
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};
