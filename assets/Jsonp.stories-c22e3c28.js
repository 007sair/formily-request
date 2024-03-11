import{D as g}from"./index-380d6ecd.js";import"./jsx-runtime-f7703cfb.js";import"./index-2d6a15d9.js";import"./_commonjsHelpers-de833af9.js";import"./iframe-ab15b175.js";import"../sb-preview/runtime.js";import"./isNativeReflectConstruct-8ef081c8.js";const k={title:"Example/Basic(JSONP)",component:g,parameters:{},argTypes:{schema:{control:"object"}}},e={name:"basic",args:{schema:{type:"object",properties:{basic_select:{type:"string",title:"基础下拉",description:"根据回填数据查询下拉项",default:"经海路","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"}},"x-request":{url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:"{{ $self.initialValue }}"},format:"{{ (res) => res?.data || [] }}",customService:"{{ customJsonp }}"}}}}}},t={name:"firstData",args:{schema:{type:"object",properties:{select:{type:"string",title:"基础下拉",description:"默认展示第0个下拉项",default:"{{ $self.value ?? ($self.dataSource && $self.dataSource[0] ? $self.dataSource[0].id : null) }}","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"}},"x-request":{url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{key:"L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",keyword:"经海路"},format:"{{ (res) => res?.data || [] }}",customService:"{{ customJsonp }}"}}}}}},s={name:"search",args:{schema:{type:"object",properties:{search_select:{type:"string",title:"搜索下拉","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"},showSearch:!0,filterOption:!1,onSearch:"{{ str => $self.invoke('updateRequest', request => request.params.keyword = str) }}"},"x-request":{url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:""},format:"{{ (res) => res?.data || [] }}",mountLoad:!1,customService:"{{ customJsonp }}",onSuccess:'{{ (res, request) => console.log("onSuccess:", res, request, $self.dataSource) }}'}}}}}},r={name:"onDropdownVisibleChange",args:{schema:{type:"object",properties:{select:{type:"string",title:"下拉加载",default:"经海路",description:"下拉项open时请求数据","x-decorator":"FormItem","x-component":"Select","x-component-props":{style:{width:300},placeholder:"请选择下拉项",fieldNames:{label:"title",value:"id"},onDropdownVisibleChange:"{{ open => { if(open){$self.invoke('updateRequest', request => request.params.keyword = $self.initialValue)} } }}"},"x-request":{url:"https://apis.map.qq.com/ws/place/v1/suggestion",params:{keyword:""},format:"{{ (res) => res?.data || [] }}",mountLoad:!1,customService:"{{ customJsonp }}"}}}}}};var o,a,n;e.parameters={...e.parameters,docs:{...(o=e.parameters)==null?void 0:o.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id"
            }
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: "{{ $self.initialValue }}"
            },
            format: "{{ (res) => res?.data || [] }}",
            customService: "{{ customJsonp }}"
          }
        }
      }
    }
  }
}`,...(n=(a=e.parameters)==null?void 0:a.docs)==null?void 0:n.source}}};var c,p,l;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  name: "firstData",
  args: {
    schema: {
      type: "object",
      properties: {
        select: {
          type: "string",
          title: "基础下拉",
          description: "默认展示第0个下拉项",
          default: "{{ $self.value ?? ($self.dataSource && $self.dataSource[0] ? $self.dataSource[0].id : null) }}",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id"
            }
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              key: "L6QBZ-UDFCQ-G6T5R-4D5KA-MV6BV-THFZJ",
              keyword: "经海路"
            },
            format: "{{ (res) => res?.data || [] }}",
            customService: "{{ customJsonp }}"
          }
        }
      }
    }
  }
}`,...(l=(p=t.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var i,m,u;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
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
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false,
            customService: "{{ customJsonp }}",
            onSuccess: '{{ (res, request) => console.log("onSuccess:", res, request, $self.dataSource) }}'
          }
        }
      }
    }
  }
}`,...(u=(m=s.parameters)==null?void 0:m.docs)==null?void 0:u.source}}};var d,f,h;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
            style: {
              width: 300
            },
            placeholder: "请选择下拉项",
            fieldNames: {
              label: "title",
              value: "id"
            },
            onDropdownVisibleChange: "{{ open => { if(open){$self.invoke('updateRequest', request => request.params.keyword = $self.initialValue)} } }}"
          },
          "x-request": {
            url: "https://apis.map.qq.com/ws/place/v1/suggestion",
            params: {
              keyword: ""
            },
            format: "{{ (res) => res?.data || [] }}",
            mountLoad: false,
            customService: "{{ customJsonp }}"
          }
        }
      }
    }
  }
}`,...(h=(f=r.parameters)==null?void 0:f.docs)==null?void 0:h.source}}};const $=["Basic","Default","Search","Dropdown"];export{e as Basic,t as Default,r as Dropdown,s as Search,$ as __namedExportsOrder,k as default};
//# sourceMappingURL=Jsonp.stories-c22e3c28.js.map
