import type { Meta, StoryObj } from "@storybook/react";

import DynamicSelect from ".";

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta = {
  title: "Example/Basic(JSONP)",
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
        basic_select: {
          type: "string",
          title: "基础下拉",
          description: "根据回填数据查询下拉项",
          default: "经海路",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id",
            },
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "{{ $self.initialValue }}",
            },
            format: "{{ (res) => res?.data || [] }}",
            customService: "{{ customJsonp }}",
          },
        },
      },
    },
  },
};

export const Default: Story = {
  name: "firstData",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
          type: "string",
          title: "基础下拉",
          description: "默认展示第0个下拉项",
          default:
            "{{ $self.value ?? ($self.dataSource && $self.dataSource[0] ? $self.dataSource[0].id : null) }}",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id",
            },
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: "经海路",
            },
            format: "{{ (res) => res?.data || [] }}",
            customService: "{{ customJsonp }}",
          },
        },
      },
    },
  },
};

export const Search: Story = {
  name: "search",
  args: {
    schema: {
      type: "object",
      properties: {
        search_select: {
          type: "string",
          title: "搜索下拉",
          "x-decorator": "FormItem",
          "x-component": "Select",
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
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false,
            customService: "{{ customJsonp }}",
            onSuccess:
              '{{ (res, request) => console.log("onSuccess:", res, request, $self.dataSource) }}',
          },
        },
      },
    },
  },
};

export const Dropdown: Story = {
  name: "onDropdownVisibleChange",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
          type: "string",
          title: "下拉加载",
          default: "经海路",
          description: "下拉项open时请求数据",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: { width: 300 },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id",
            },
            onDropdownVisibleChange:
              "{{ open => { if(open){$self.invoke('updateRequest', request => request.params.keyword = $self.initialValue)} } }}",
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "",
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false,
            customService: "{{ customJsonp }}",
          },
        },
      },
    },
  },
};
