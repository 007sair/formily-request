import{D as p}from"./index-380d6ecd.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-ab15b175.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const h={title:"Example/Service",component:p,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"function1",args:{schema:{type:"object",properties:{select:{type:"string",title:"Select",default:"经海路",description:"service指定函数名，params独立配置","x-decorator":"FormItem","x-component":"Select","x-component-props":{placeholder:"请选择下拉项"},"x-request":{service:"{{ () => queryAddress($self.initialValue) }}"}}}}}},r={name:"function2",args:{schema:{type:"object",properties:{select:{type:"string",title:"Select",description:"service指定函数名，params独立配置，支持搜索","x-decorator":"FormItem","x-component":"Select","x-component-props":{placeholder:"请选择下拉项",showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params = str) }}"},"x-request":{service:"{{ queryAddress }}",params:""}}}}}};var t,s,o;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
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
            placeholder: "请选择下拉项"
          },
          "x-request": {
            service: "{{ () => queryAddress($self.initialValue) }}"
          }
        }
      }
    }
  }
}`,...(o=(s=e.parameters)==null?void 0:s.docs)==null?void 0:o.source}}};var a,c,n;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params = str) }}"
          },
          "x-request": {
            service: "{{ queryAddress }}",
            params: ""
          }
        }
      }
    }
  }
}`,...(n=(c=r.parameters)==null?void 0:c.docs)==null?void 0:n.source}}};const S=["Basic","Default"];export{e as Basic,r as Default,S as __namedExportsOrder,h as default};
//# sourceMappingURL=Service.stories-64d9e329.js.map
