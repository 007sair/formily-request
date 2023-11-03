import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Service",
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
  name: "function1",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
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
      },
    },
  },
};

export const Default: Story = {
  name: "function2",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
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
      },
    },
  },
};
