/**
 * Basic
 */

import type { Story } from "../Dynamic.stories";

export const story_6: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        basic_select: {
          type: "string",
          title: "基础下拉",
          "x-decorator": "FormItem",
          "x-component": "Cascader",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            request: {
              service: "{{ queryCascader }}",
              silent: false,
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};
