import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";
import { story_1 } from "./demos/1";
import { story_2 } from "./demos/2";
import { story_3 } from "./demos/3";
import { story_4 } from "./demos/4";
import { story_5 } from "./demos/5";
import { story_6 } from "./demos/6";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Dynamic",
  component: DynamicSelect,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/react/configure/story-layout
    // layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    schema: { control: "object" },
  },
} satisfies Meta<typeof DynamicSelect>;

export default meta;

export type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Basic: Story = {
  ...story_1,
  name: "basic",
};

export const ServiceFunction: Story = {
  ...story_2,
  name: "function",
};

export const Liandong: Story = {
  ...story_3,
  name: "省市区联动",
};

export const Reactions: Story = {
  ...story_4,
  name: "reactions",
};

export const Control: Story = {
  ...story_5,
  name: "受控",
};

export const Cascader: Story = {
  ...story_6,
  name: "级联选择",
};
