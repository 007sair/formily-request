/**
 * 复杂联动效果
 */

import type { Story } from "../Dynamic.stories";

export const story_5: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          title: "关键字",
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-reactions": {
            target: "selectValue_control",
            effects: ["onFieldValueChange"],
            fulfill: {
              run: "{{ $target.componentProps.request.params.keyword = $self.value }}",
            },
          },
        },
        selectValue_control: {
          type: "string",
          title: "Select受控",
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
                keyword: "",
              },
              format: "{{ (res) => res?.data || [] }}",
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
          "x-reactions": [
            "{{ useAsyncDataSource }}",
            {
              dependencies: [".keyword"],
              fulfill: {
                state: {
                  value: "{{ $deps[0] || '' }}",
                },
              },
            },
          ],
        },
      },
    },
  },
};
