import{D as l}from"./index-380d6ecd.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-ab15b175.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const w={title:"Example/Ready",component:l,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"值类型",args:{schema:{type:"object",properties:{ready:{type:"string",title:"ready","x-decorator":"FormItem","x-component":"Switch"},search_select:{type:"string",title:"搜索下拉","x-decorator":"FormItem","x-component":"Select",description:"ready开启时才会发起请求获取下拉项数据","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{url:"/ws/place/v1/suggestion",params:{keyword:""},format:"{{ (res) => res?.data || [] }}",ready:"{{ $values.ready }}"}}}}}},r={name:"函数类型",args:{schema:{type:"object",properties:{search_select:{type:"string",title:"搜索下拉","x-decorator":"FormItem","x-component":"Select",description:"当输入框的值变化时会发起请求","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{url:"/ws/place/v1/suggestion",params:{keyword:""},format:"{{ (res) => res?.data || [] }}",ready:"{{ (request) => !!request.params.keyword }}"}}}}}};var t,s,a;e.parameters={...e.parameters,docs:{...(t=e.parameters)==null?void 0:t.docs,source:{originalSource:`{
  name: "值类型",
  args: {
    schema: {
      type: "object",
      properties: {
        ready: {
          type: "string",
          title: "ready",
          "x-decorator": "FormItem",
          "x-component": "Switch"
        },
        search_select: {
          type: "string",
          title: "搜索下拉",
          "x-decorator": "FormItem",
          "x-component": "Select",
          description: "ready开启时才会发起请求获取下拉项数据",
          "x-component-props": {
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id"
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}",
            ready: "{{ $values.ready }}"
          }
        }
      }
    }
  }
}`,...(a=(s=e.parameters)==null?void 0:s.docs)==null?void 0:a.source}}};var o,p,c;r.parameters={...r.parameters,docs:{...(o=r.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id"
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}",
            ready: "{{ (request) => !!request.params.keyword }}"
          }
        }
      }
    }
  }
}`,...(c=(p=r.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};const x=["Ready1","Ready2"];export{e as Ready1,r as Ready2,x as __namedExportsOrder,w as default};
//# sourceMappingURL=Ready.stories-bdb29edf.js.map
