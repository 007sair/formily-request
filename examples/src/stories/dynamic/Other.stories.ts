import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Other",
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
export const Radio: Story = {
  name: "radio",
  args: {
    schema: {
      type: "object",
      properties: {
        radio: {
          type: "string",
          title: "Radio",
          "x-decorator": "FormItem",
          "x-component": "Radio.Group",
          "x-component-props": {
            request: {
              customService: "{{ customJsonp }}",
              url: "https://apis.map.qq.com/ws/place/v1/suggestion",
              params: {
                keyword: "经海路",
              },
              format:
                "{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}",
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};

export const Checkbox: Story = {
  name: "checkbox",
  args: {
    schema: {
      type: "object",
      properties: {
        radio: {
          type: "string",
          title: "Radio",
          "x-decorator": "FormItem",
          "x-component": "Checkbox.Group",
          "x-component-props": {
            request: {
              customService: "{{ customJsonp }}",
              url: "https://apis.map.qq.com/ws/place/v1/suggestion",
              params: {
                keyword: "经海路",
              },
              format:
                "{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}",
            },
          },
          "x-reactions": "{{ useAsyncDataSource }}",
        },
      },
    },
  },
};

export const Cascader: Story = {
  name: "cascader",
  args: {
    schema: {
      type: "object",
      properties: {
        cascader: {
          type: "string",
          title: "级联下拉",
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
