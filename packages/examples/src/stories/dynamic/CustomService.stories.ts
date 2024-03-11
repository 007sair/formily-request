import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/CustomService",
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
  name: "basic",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
          type: "string",
          title: "Select",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请输入",
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
            customService: "{{ customJsonp }}",
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
          },
        },
      },
    },
  },
};
