import{D as u}from"./index-380d6ecd.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-ab15b175.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const h={title:"Example/Reaction",component:u,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"省市区",args:{schema:{type:"object",properties:{province:{type:"string",title:"省","x-decorator":"FormItem","x-component":"Select","x-component-props":{fieldNames:{label:"name",value:"id"}},"x-request":{url:"/ws/district/v1/list",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ"},format:"{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"},"x-reactions":[{target:"city",when:"{{ !!$values.city }}",fulfill:{run:"$form.setFieldState('city',state=>{state.value = ''})"}}]},city:{type:"string",title:"市","x-decorator":"FormItem","x-component":"Select","x-component-props":{fieldNames:{label:"name",value:"id"}},"x-request":{url:"/ws/district/v1/getchildren",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",id:"{{ $values.province || '' }}"},format:"{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"},"x-reactions":[{target:"district",when:"{{ !!$values.district }}",fulfill:{run:"$form.setFieldState('district',state=>{state.value = ''})"}}]},district:{type:"string",title:"区","x-decorator":"FormItem","x-component":"Select","x-component-props":{fieldNames:{label:"fullname",value:"id"}},"x-request":{url:"/ws/district/v1/getchildren",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",id:"{{ $values.city || '' }}"},format:"{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"}}}}}},t={name:"multiple",args:{schema:{type:"object",properties:{keyword:{type:"string",title:"关键字","x-decorator":"FormItem","x-component":"Input"},selectValue:{type:"string",title:"Select",description:"下拉项数据依赖上方关键字","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"address"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{url:"/ws/place/v1/suggestion",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",keyword:"{{ $values.keyword || '' }}"},format:"{{ (res) => res?.data || [] }}",mountLoad:!1}},radioValue:{type:"string",title:"Radio",description:"数据依赖select","x-decorator":"FormItem","x-component":"Radio.Group","x-request":{service:"{{ queryAddress }}",params:"{{ $values.selectValue }}",mountLoad:!1}},checkboxValue:{type:"string",title:"Checkbox",description:"数据依赖select","x-decorator":"FormItem","x-component":"Checkbox.Group","x-request":{service:"{{ queryAddress }}",params:"{{ $values.selectValue }}",mountLoad:!1}}}}}},r={name:"受控",args:{schema:{type:"object",properties:{keyword:{type:"string",title:"关键字","x-decorator":"FormItem","x-component":"Input","x-reactions":{target:"selectValue_control",effects:["onFieldValueChange"],fulfill:{run:"{{ $target.invoke('updateRequest', r => r.params.keyword = $self.value) }}"}}},selectValue_control:{type:"string",title:"Select受控",description:"下拉项数据依赖上方关键字","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"address"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{url:"/ws/place/v1/suggestion",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",keyword:""},format:"{{ (res) => res?.data || [] }}"},"x-reactions":{dependencies:[".keyword"],fulfill:{state:{value:"{{ $deps[0] || '' }}"}}}}}}}};var s,a,o;e.parameters={...e.parameters,docs:{...(s=e.parameters)==null?void 0:s.docs,source:{originalSource:`{
  name: "省市区",
  args: {
    schema: {
      type: "object",
      properties: {
        province: {
          type: "string",
          title: "省",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            fieldNames: {
              label: "name",
              value: "id"
            }
          },
          "x-request": {
            url: "/ws/district/v1/list",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ"
            },
            format: "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"
          },
          "x-reactions": [{
            target: "city",
            when: "{{ !!$values.city }}",
            fulfill: {
              run: "$form.setFieldState('city',state=>{state.value = ''})"
            }
          }]
        },
        city: {
          type: "string",
          title: "市",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            fieldNames: {
              label: "name",
              value: "id"
            }
          },
          "x-request": {
            url: "/ws/district/v1/getchildren",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              id: "{{ $values.province || '' }}"
            },
            format: "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"
          },
          "x-reactions": [{
            target: "district",
            when: "{{ !!$values.district }}",
            fulfill: {
              run: "$form.setFieldState('district',state=>{state.value = ''})"
            }
          }]
        },
        district: {
          type: "string",
          title: "区",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            fieldNames: {
              label: "fullname",
              value: "id"
            }
          },
          "x-request": {
            url: "/ws/district/v1/getchildren",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              id: "{{ $values.city || '' }}"
            },
            format: "{{ (res) => Array.isArray(res?.result) ? res.result[0] : [] }}"
          }
        }
      }
    }
  }
}`,...(o=(a=e.parameters)==null?void 0:a.docs)==null?void 0:o.source}}};var l,i,c;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  name: "multiple",
  args: {
    schema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          title: "关键字",
          "x-decorator": "FormItem",
          "x-component": "Input"
        },
        selectValue: {
          type: "string",
          title: "Select",
          description: "下拉项数据依赖上方关键字",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "address"
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: "{{ $values.keyword || '' }}"
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false
          }
        },
        radioValue: {
          type: "string",
          title: "Radio",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Radio.Group",
          "x-request": {
            service: "{{ queryAddress }}",
            params: "{{ $values.selectValue }}",
            mountLoad: false
          }
        },
        checkboxValue: {
          type: "string",
          title: "Checkbox",
          description: "数据依赖select",
          "x-decorator": "FormItem",
          "x-component": "Checkbox.Group",
          "x-request": {
            service: "{{ queryAddress }}",
            params: "{{ $values.selectValue }}",
            mountLoad: false
          }
        }
      }
    }
  }
}`,...(c=(i=t.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var n,p,m;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  name: "受控",
  args: {
    schema: {
      type: "object",
      properties: {
        keyword: {
          type: "string",
          title: "关键字",
          "x-decorator": "FormItem",
          "x-component": "Input",
          "x-reactions": {
            target: "selectValue_control",
            effects: ["onFieldValueChange"],
            fulfill: {
              run: "{{ $target.invoke('updateRequest', r => r.params.keyword = $self.value) }}"
            }
          }
        },
        selectValue_control: {
          type: "string",
          title: "Select受控",
          description: "下拉项数据依赖上方关键字",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "address"
            },
            showSearch: true,
            filterOption: false,
            onSearch: "{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"
          },
          "x-request": {
            url: "/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}"
          },
          "x-reactions": {
            dependencies: [".keyword"],
            fulfill: {
              state: {
                value: "{{ $deps[0] || '' }}"
              }
            }
          }
        }
      }
    }
  }
}`,...(m=(p=r.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const k=["Basic","Multiple","Control"];export{e as Basic,r as Control,t as Multiple,k as __namedExportsOrder,h as default};
//# sourceMappingURL=Reaction.stories-b577faff.js.map
