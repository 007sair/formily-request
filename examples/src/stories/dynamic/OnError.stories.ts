import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/OnError",
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
export const URLError: Story = {
  name: "接口异常",
  args: {
    schema: {
      type: "object",
      properties: {
        basic_select: {
          type: "string",
          title: "基础下拉",
          description: "模拟接口请求错误",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
          },
          "x-request": {
            url: "123",
            params: {
              keyword: "{{ $self.initialValue }}",
            },
            format: "{{ $beforeFormat((res) => res?.data || []) }}",
            debug: true,
          },
        },
      },
    },
  },
};

export const NoRequest: Story = {
  name: "requset配置缺失",
  args: {
    schema: {
      type: "object",
      properties: {
        basic_select: {
          type: "string",
          title: "基础下拉",
          description: "模拟request配置错误，请打开控制台查看错误信息",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
          },
          "x-request": {},
        },
      },
    },
  },
};

export const ParamsError: Story = {
  name: "参数异常",
  args: {
    schema: {
      type: "object",
      properties: {
        basic_select: {
          type: "string",
          title: "基础下拉",
          description: "模拟参数配置错误，请打开网络查看接口入参",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: "error",
            format: "{{ (res) => res?.data || [] }}",
            debug: true,
          },
        },
      },
    },
  },
};
