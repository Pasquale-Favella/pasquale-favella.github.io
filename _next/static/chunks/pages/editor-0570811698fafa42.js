(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[154],{96281:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/editor",function(){return a(16034)}])},44022:function(e,t,a){"use strict";a.d(t,{Z:function(){return E}});var s=a(85893),n=a(63764),i=a(61042),r=a(15103),l=a(95495),c=a(45929),o=a(25393);let d=(0,l.O4)("editor",{state:{js:{name:"script.js",language:"javascript",value:o.iA.jsInitialValue},css:{name:"style.css",language:"css",value:o.iA.cssInitialValue},html:{name:"index.html",language:"html",value:o.iA.htmlInitialValue}},selected:"html",previewMode:!1}),u=(0,c.R)(d,e=>e.prop("state")),m=(0,c.R)(d,e=>e.prop("previewMode")),h=(0,c.R)(d,e=>e.prop("selected")),p=(0,r.cn)(e=>{let t=e(h);return e(u)[t]},(e,t,a)=>{let s=e(h),n=e(u);t(u,{...n,[s]:{...n[s],value:a}})}),v=(0,r.cn)(e=>{let{html:t,css:a,js:s}=e(u);return"\n            <html>\n                <body>".concat(t.value,"</body>\n                <style>").concat(a.value,"</style>\n                <script>").concat(s.value,"</script>\n            </html>\n        ")});var b=a(48583);function j(){let[e,t]=(0,b.KO)(h),[a,s]=(0,b.KO)(m),[n,i]=(0,b.KO)(p);return{tabSelected:e,setTabSelected:t,code:n,setCode:i,preview:a,setPreview:s,srcDoc:(0,b.Dv)(v)}}var x=a(72737),g=a(67294),f=a(87771),w=a(45789),N=a(39715),k=a(89833),y=(0,g.memo)(()=>{let{tabSelected:e,setTabSelected:t,setPreview:a}=j(),n=e=>{t(e),a(!1)};return(0,s.jsxs)("header",{className:"flex justify-between",children:[(0,s.jsxs)("div",{className:"tabs",children:[(0,s.jsxs)("button",{className:"tab gap-1 ".concat("html"===e?"tab-active":""),onClick:()=>n("html"),children:[(0,s.jsx)(f.GXm,{})," html"]}),(0,s.jsxs)("button",{className:"tab gap-1 ".concat("css"===e?"tab-active":""),onClick:()=>n("css"),children:[(0,s.jsx)(w.BA4,{})," css"]}),(0,s.jsxs)("button",{className:"tab gap-1 ".concat("js"===e?"tab-active":""),onClick:()=>n("js"),children:[(0,s.jsx)(N.vl3,{})," js"]})]}),(0,s.jsx)("div",{className:"tooltip tooltip-bottom before:text-xs before:content-[attr(data-tip)]","data-tip":"preview",children:(0,s.jsx)("button",{className:"btn btn-ghost btn-circle normal-case btn-sm",onClick:()=>a(e=>!e),children:(0,s.jsx)(k.$YN,{size:20})})})]})}),_=(0,g.memo)(()=>{let{srcDoc:e}=j();return(0,s.jsxs)("div",{className:"mockup-browser rounded-md border border-base-300",children:[(0,s.jsx)("div",{className:"mockup-browser-toolbar",children:(0,s.jsx)("div",{className:"input border border-base-300",children:window.location.origin})}),(0,s.jsx)("div",{className:"h-[calc(85vh-100px)]",children:(0,s.jsx)("iframe",{srcDoc:e,title:"output",sandbox:"allow-scripts",frameBorder:"0",width:"100%",height:"100%"})})]})}),C=a(77117),E=()=>{let{isDarkMode:e}=(0,i.F)(),t=(0,x.Z)(),{code:a,setCode:r,preview:l}=j(),c=e=>{r(null!=e?e:"")};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(y,{}),l?(0,s.jsx)(_,{}):(0,s.jsx)(n.ZP,{className:"h-[calc(85vh-70px)]",theme:e?"vs-dark":"light",path:a.name,language:a.language,value:a.value,onChange:e=>c(e),loading:(0,s.jsx)(C.Z,{}),options:{minimap:{enabled:!t}}})]})}},77117:function(e,t,a){"use strict";var s=a(85893),n=a(67294);t.Z=(0,n.memo)(()=>(0,s.jsx)("div",{className:"flex justify-center px-4 py-16",children:(0,s.jsx)("span",{className:"loading loading-ring loading-lg"})}))},72737:function(e,t,a){"use strict";a.d(t,{Z:function(){return i}});var s=a(67294);let n=/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;function i(){let[e,t]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{t(!!(void 0===window.navigator?"":navigator.userAgent).match(n))},[]),e}},16034:function(e,t,a){"use strict";a.r(t);var s=a(85893),n=a(44022),i=a(2962);t.default=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(i.PB,{title:"Editor",description:"Create, edit, and preview your web projects in real-time with our HTML, CSS, and JS editor. Write and test HTML, CSS, and JavaScript code effortlessly. Visualize your changes instantly."}),(0,s.jsx)(n.Z,{})]})}},function(e){e.O(0,[909,900,764,888,774,179],function(){return e(e.s=96281)}),_N_E=e.O()}]);