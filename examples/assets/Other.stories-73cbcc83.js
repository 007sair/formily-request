import{D as l}from"./index-dd66f1d1.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-82714564.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const v={title:"Example/Other",component:l,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"radio",args:{schema:{type:"object",properties:{radio:{type:"string",title:"Radio","x-decorator":"FormItem","x-component":"Radio.Group","x-request":{customService:"{{ customJsonp }}",url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:"经海路"},format:"{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}"}}}}}},r={name:"checkbox",args:{schema:{type:"object",properties:{radio:{type:"string",title:"Radio","x-decorator":"FormItem","x-component":"Checkbox.Group","x-request":{customService:"{{ customJsonp }}",url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:"经海路"},format:"{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}"}}}}}},t={name:"cascader",args:{schema:{type:"object",properties:{cascader:{type:"string",title:"级联下拉","x-decorator":"FormItem","x-component":"Cascader","x-component-props":{style:{width:300},placeholder:"请选择下拉项"},"x-request":{service:"{{ queryCascader }}",silent:!1}}}}}};var o,a,s;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
          "x-request": {
            customService: "{{ customJsonp }}",
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "经海路"
            },
            format: "{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}"
          }
        }
      }
    }
  }
}`,...(s=(a=e.parameters)==null?void 0:a.docs)==null?void 0:s.source}}};var n,c,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
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
          "x-request": {
            customService: "{{ customJsonp }}",
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "经海路"
            },
            format: "{{ (res) => res?.data.map(item => ({label: item.title, value: item.id})) || [] }}"
          }
        }
      }
    }
  }
}`,...(m=(c=r.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var p,i,d;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项"
          },
          "x-request": {
            service: "{{ queryCascader }}",
            silent: false
          }
        }
      }
    }
  }
}`,...(d=(i=t.parameters)==null?void 0:i.docs)==null?void 0:d.source}}};const k=["Radio","Checkbox","Cascader"];export{t as Cascader,r as Checkbox,e as Radio,k as __namedExportsOrder,v as default};
//# sourceMappingURL=Other.stories-73cbcc83.js.map
