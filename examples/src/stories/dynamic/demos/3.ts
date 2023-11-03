/**
 * 省市区联动
 */

import type { Story } from "../Dynamic.stories";

export const story_3: Story = {
  args: {
    schema: {
      type: "object",
      properties: {
        province: {
          type: "string",
          title: "省",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            request: {
              url: "/ws/district/v1/list",
              params: {
                key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              },
              format:
                "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
            },
            fieldNames: {
              label: "name",
              value: "id",
            },
          },
          "x-reactions": [
            "{{ useAsyncDataSource }}",
            {
              target: "city",
              when: "{{ !!$values.city }}",
              fulfill: {
                run: "$form.setFieldState('city',state=>{state.value = ''})",
              },
            },
          ],
        },
        city: {
          type: "string",
          title: "市",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            request: {
              url: "/ws/district/v1/getchildren",
              params: {
                key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
                id: "{{ $values.province || '' }}",
              },
              format:
                "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
            },
            fieldNames: {
              label: "name",
              value: "id",
            },
          },
          "x-reactions": [
            "{{ useAsyncDataSource }}",
            {
              target: "district",
              when: "{{ !!$values.district }}",
              fulfill: {
                run: "$form.setFieldState('district',state=>{state.value = ''})",
              },
            },
          ],
        },
        district: {
          type: "string",
          title: "区",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            request: {
              url: "/ws/district/v1/getchildren",
              params: {
                key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
                id: "{{ $values.city || '' }}",
              },
              format:
                "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
            },
            fieldNames: {
              label: "fullname",
              value: "id",
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};
