import{D as d}from"./index-dd66f1d1.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-82714564.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const q={title:"Example/OnError",component:d,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"接口异常",args:{schema:{type:"object",properties:{basic_select:{type:"string",title:"基础下拉",description:"模拟接口请求错误",default:"经海路","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项"},"x-request":{url:"123",params:{keyword:"{{ $self.initialValue }}"},format:"{{ $beforeFormat((res) => res?.data || []) }}",debug:!0}}}}}},r={name:"requset配置缺失",args:{schema:{type:"object",properties:{basic_select:{type:"string",title:"基础下拉",description:"模拟request配置错误，请打开控制台查看错误信息",default:"经海路","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项"},"x-request":{}}}}}},t={name:"参数异常",args:{schema:{type:"object",properties:{basic_select:{type:"string",title:"基础下拉",description:"模拟参数配置错误，请打开网络查看接口入参",default:"经海路","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项"},"x-request":{url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:"error",format:"{{ (res) => res?.data || [] }}",debug:!0}}}}}};var n,o,s;e.parameters={...e.parameters,docs:{...(n=e.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项"
          },
          "x-request": {
            url: "123",
            params: {
              keyword: "{{ $self.initialValue }}"
            },
            format: "{{ $beforeFormat((res) => res?.data || []) }}",
            debug: true
          }
        }
      }
    }
  }
}`,...(s=(o=e.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};var a,p,c;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项"
          },
          "x-request": {}
        }
      }
    }
  }
}`,...(c=(p=r.parameters)==null?void 0:p.docs)==null?void 0:c.source}}};var m,i,l;t.parameters={...t.parameters,docs:{...(m=t.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项"
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: "error",
            format: "{{ (res) => res?.data || [] }}",
            debug: true
          }
        }
      }
    }
  }
}`,...(l=(i=t.parameters)==null?void 0:i.docs)==null?void 0:l.source}}};const w=["URLError","NoRequest","ParamsError"];export{r as NoRequest,t as ParamsError,e as URLError,w as __namedExportsOrder,q as default};
//# sourceMappingURL=OnError.stories-896d1dcb.js.map
