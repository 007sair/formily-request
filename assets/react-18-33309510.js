import{b as c,a as m,r as n}from"./index-2d6a15d9.js";var a={},s=c;a.createRoot=s.createRoot,a.hydrateRoot=s.hydrateRoot;var o=new Map,R=({callback:e,children:t})=>{let r=n.useRef();return n.useLayoutEffect(()=>{r.current!==e&&(r.current=e,e())},[e]),t},i=async(e,t)=>{let r=await d(t);return new Promise(u=>{r.render(m.createElement(R,{callback:()=>u(null)},e))})},p=(e,t)=>{let r=o.get(e);r&&(r.unmount(),o.delete(e))},d=async e=>{let t=o.get(e);return t||(t=a.createRoot(e),o.set(e,t)),t};export{i as r,p as u};
//# sourceMappingURL=react-18-33309510.js.map