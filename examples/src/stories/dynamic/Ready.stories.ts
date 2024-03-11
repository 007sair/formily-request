import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Ready",
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

export const Ready1: Story = {
  name: "值类型",
  args: {
    schema: {
      type: "object",
      properties: {
        ready: {
          type: "string",
          title: "ready",
          "x-decorator": "FormItem",
          "x-component": "Switch",
        },
        search_select: {
          type: "string",
          title: "搜索下拉",
          "x-decorator": "FormItem",
          "x-component": "Select",
          description: "ready开启时才会发起请求获取下拉项数据",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}",
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
            ready: "{{ $values.ready }}",
          },
        },
      },
    },
  },
};

export const Ready2: Story = {
  name: "函数类型",
  args: {
    schema: {
      type: "object",
      properties: {
        search_select: {
          type: "string",
          title: "搜索下拉",
          "x-decorator": "FormItem",
          "x-component": "Select",
          description: "当输入框的值变化时会发起请求",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id",
            },
            showSearch: true,
            filterOption: false,
            onSearch:
              "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}",
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
            ready: "{{ (request) => !!request.params.keyword }}",
          },
        },
      },
    },
  },
};
