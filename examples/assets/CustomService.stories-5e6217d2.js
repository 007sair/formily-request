import{D as o}from"./index-dd66f1d1.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-82714564.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const u={title:"Example/CustomService",component:o,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"basic",args:{schema:{type:"object",properties:{select:{type:"string",title:"Select","x-decorator":"FormItem","x-component":"Select","x-component-props":{placeholder:"请输入",fieldNames:{label:"title",value:"id"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{customService:"{{ customJsonp }}",url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:""},format:"{{ (res) => res?.data || [] }}"}}}}}};var t,r,s;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
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
              value: "id"
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"
          },
          "x-request": {
            customService: "{{ customJsonp }}",
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}"
          }
        }
      }
    }
  }
}`,...(s=(r=e.parameters)==null?void 0:r.docs)==null?void 0:s.source}}};const d=["Basic"];export{e as Basic,d as __namedExportsOrder,u as default};
//# sourceMappingURL=CustomService.stories-5e6217d2.js.map
