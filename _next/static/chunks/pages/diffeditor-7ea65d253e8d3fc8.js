(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[201],{44311:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/diffeditor",function(){return a(23467)}])},44022:function(e,t,a){"use strict";a.d(t,{Z:function(){return C}});var s=a(85893),n=a(63764),l=a(77656),i=a(15103),r=a(95495),o=a(45929),c=a(25393);let d=(0,r.O4)("editor",{state:{js:{name:"script.js",language:"javascript",value:c.iA.jsInitialValue},css:{name:"style.css",language:"css",value:c.iA.cssInitialValue},html:{name:"index.html",language:"html",value:c.iA.htmlInitialValue}},selected:"html",previewMode:!1}),u=(0,o.R)(d,e=>e.prop("state")),m=(0,o.R)(d,e=>e.prop("previewMode")),h=(0,o.R)(d,e=>e.prop("selected")),p=(0,i.cn)(e=>{let t=e(h);return e(u)[t]},(e,t,a)=>{let s=e(h),n=e(u);t(u,{...n,[s]:{...n[s],value:a}})}),b=(0,i.cn)(e=>{let{html:t,css:a,js:s}=e(u);return"\n            <html>\n                <body>".concat(t.value,"</body>\n                <style>").concat(a.value,"</style>\n                <script>").concat(s.value,"</script>\n            </html>\n        ")});var v=a(48583);function g(){let[e,t]=(0,v.KO)(h),[a,s]=(0,v.KO)(m),[n,l]=(0,v.KO)(p);return{tabSelected:e,setTabSelected:t,code:n,setCode:l,preview:a,setPreview:s,srcDoc:(0,v.Dv)(b)}}var x=a(72737),j=a(67294),f=a(87771),N=a(45789),w=a(39715),y=a(89833),k=(0,j.memo)(()=>{let{tabSelected:e,setTabSelected:t,setPreview:a}=g(),n=e=>{t(e),a(!1)};return(0,s.jsxs)("header",{className:"flex justify-between",children:[(0,s.jsxs)("div",{className:"tabs",children:[(0,s.jsxs)("button",{className:"tab gap-1 ".concat("html"===e?"tab-active":""),onClick:()=>n("html"),children:[(0,s.jsx)(f.GXm,{})," html"]}),(0,s.jsxs)("button",{className:"tab gap-1 ".concat("css"===e?"tab-active":""),onClick:()=>n("css"),children:[(0,s.jsx)(N.BA4,{})," css"]}),(0,s.jsxs)("button",{className:"tab gap-1 ".concat("js"===e?"tab-active":""),onClick:()=>n("js"),children:[(0,s.jsx)(w.vl3,{})," js"]})]}),(0,s.jsx)("div",{className:"tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]","data-tip":"preview",children:(0,s.jsx)("button",{className:"btn btn-ghost btn-circle normal-case btn-sm",onClick:()=>a(e=>!e),children:(0,s.jsx)(y.$YN,{size:20})})})]})}),E=(0,j.memo)(()=>{let{srcDoc:e}=g();return(0,s.jsxs)("div",{className:"mockup-browser rounded-md border border-base-300",children:[(0,s.jsx)("div",{className:"mockup-browser-toolbar",children:(0,s.jsx)("div",{className:"input border border-base-300",children:window.location.origin})}),(0,s.jsx)("div",{className:"h-[calc(85vh-100px)]",children:(0,s.jsx)("iframe",{srcDoc:e,title:"output",sandbox:"allow-scripts",frameBorder:"0",width:"100%",height:"100%"})})]})}),_=a(77117),C=()=>{let{isDarkMode:e}=(0,l.F)(),t=(0,x.Z)(),{code:a,setCode:i,preview:r}=g(),o=e=>{i(null!=e?e:"")};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(k,{}),r?(0,s.jsx)(E,{}):(0,s.jsx)(n.ZP,{className:"h-[calc(85vh-70px)]",theme:e?"vs-dark":"light",path:a.name,language:a.language,value:a.value,onChange:e=>o(e),loading:(0,s.jsx)(_.Z,{}),options:{minimap:{enabled:!t}}})]})}},77117:function(e,t,a){"use strict";var s=a(85893),n=a(67294);t.Z=(0,n.memo)(()=>(0,s.jsx)("div",{className:"flex justify-center px-4 py-16",children:(0,s.jsx)("span",{className:"loading loading-ring loading-lg"})}))},72737:function(e,t,a){"use strict";a.d(t,{Z:function(){return l}});var s=a(67294);let n=/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;function l(){let[e,t]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{t(!!(void 0===window.navigator?"":navigator.userAgent).match(n))},[]),e}},23467:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return v}});var s=a(85893);a(44022);var n=a(67294),l=a(5152),i=a.n(l),r=a(63764),o=a(55163),c=a(77656),d=a(72737),u=a(77117);let m=i()(()=>a.e(974).then(a.bind(a,76974)),{loadableGenerated:{webpack:()=>[76974]},ssr:!1}),h={value:"plaintext",label:"PLAIN TEXT"};var p=()=>{var e;let[t,a]=(0,n.useState)(h),{isDarkMode:l}=(0,c.F)(),i=(0,d.Z)(),p=(0,r.Ik)(),b=(0,n.useMemo)(()=>o.hd.getDaisyUiPalette(l),[l]),v=(0,n.useMemo)(()=>null==p?void 0:p.languages.getLanguages().map(e=>{let{id:t,aliases:a}=e;return{value:t,label:(a?a[0]:t).toUpperCase()}}),[p]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(m,{defaultValue:t,onChange:e=>a(null!=e?e:h),isSearchable:!0,isClearable:!0,id:"selectbox",instanceId:"selectbox",placeholder:"Select Language",options:v,theme:e=>({...e,borderRadius:5,colors:{...e.colors,primary25:b["primary-content"],primary:b["base-content"],primary50:b["base-200"],neutral0:b["base-100"],neutral80:b["base-content"]}})}),(0,s.jsx)("div",{className:"divider"}),(0,s.jsx)(r.SV,{className:"h-[calc(85vh-100px)]",theme:l?"vs-dark":"light",language:null!==(e=null==t?void 0:t.value)&&void 0!==e?e:h.value,loading:(0,s.jsx)(u.Z,{}),options:{minimap:{enabled:!i},domReadOnly:!1,readOnly:!1,originalEditable:!0}})]})},b=a(2962),v=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(b.PB,{title:"Diff Editor",description:"Explore the changes between two versions of any code or text effortlessly with Diff Editor. Visualize code differences and spot changes"}),(0,s.jsx)(p,{})]})}},function(e){e.O(0,[909,432,764,888,774,179],function(){return e(e.s=44311)}),_N_E=e.O()}]);