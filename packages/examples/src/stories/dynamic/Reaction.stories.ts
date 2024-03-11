import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Reaction",
  component: DynamicSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    schema: { control: "object" },
  },
} satisfies Meta<typeof DynamicSelect>;

export default meta;

export type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic: Story = {
  name: "省市区",
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
            fieldNames: {
              label: "name",
              value: "id",
            },
          },
          "x-request": {
            url: "/ws/district/v1/list",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
            },
            format:
              "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
          },
          "x-reactions": [
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
            fieldNames: {
              label: "name",
              value: "id",
            },
          },
          "x-request": {
            url: "/ws/district/v1/getchildren",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              id: "{{ $values.province || '' }}",
            },
            format:
              "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
          },
          "x-reactions": [
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
            fieldNames: {
              label: "fullname",
              value: "id",
            },
          },
          "x-request": {
            url: "/ws/district/v1/getchildren",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              id: "{{ $values.city || '' }}",
            },
            format:
              "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}",
          },
        },
      },
    },
  },
};

export const Multiple: Story = {
  name: "multiple",
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
            fieldNames: {
              label: "title",
              value: "address",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}",
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: "{{ $values.keyword || '' }}",
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false,
          },
        },
        radioValue: {
          type: "string",
          title: "Radio",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Radio.Group",
          "x-request": {
            service: "{{ queryAddress }}",
            params: "{{ $values.selectValue }}",
            mountLoad: false,
          },
        },
        checkboxValue: {
          type: "string",
          title: "Checkbox",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Checkbox.Group",
          "x-request": {
            service: "{{ queryAddress }}",
            params: "{{ $values.selectValue }}",
            mountLoad: false,
          },
        },
      },
    },
  },
};

export const Control: Story = {
  name: "受控",
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
              run: "{{ $target.invoke('updateRequest', r => r.params.keyword = $self.value) }}",
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
            fieldNames: {
              label: "title",
              value: "address",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}",
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
          },
          "x-reactions": {
            dependencies: [".keyword"],
            fulfill: {
              state: {
                value: "{{ $deps[0] || '' }}",
              },
            },
          },
        },
      },
    },
  },
};
