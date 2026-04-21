(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,89129,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var s={DecodeError:function(){return p},MiddlewareNotFoundError:function(){return N},MissingStaticPage:function(){return j},NormalizeError:function(){return g},PageNotFoundError:function(){return v},SP:function(){return b},ST:function(){return x},WEB_VITALS:function(){return o},execOnce:function(){return a},getDisplayName:function(){return u},getLocationOrigin:function(){return c},getURL:function(){return d},isAbsoluteUrl:function(){return i},isResSent:function(){return m},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return f},stringifyError:function(){return y}};for(var n in s)Object.defineProperty(r,n,{enumerable:!0,get:s[n]});let o=["CLS","FCP","FID","INP","LCP","TTFB"];function a(e){let t,r=!1;return(...s)=>(r||(r=!0,t=e(...s)),t)}let l=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,i=e=>l.test(e);function c(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function d(){let{href:e}=window.location,t=c();return e.substring(t.length)}function u(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function m(e){return e.finished||e.headersSent}function f(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let s=await e.getInitialProps(t);if(r&&m(r))return s;if(!s)throw Object.defineProperty(Error(`"${u(e)}.getInitialProps()" should resolve to an object. But found "${s}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return s}let b="u">typeof performance,x=b&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class p extends Error{}class g extends Error{}class v extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class j extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class N extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function y(e){return JSON.stringify({message:e.message,stack:e.stack})}},77833,e=>{"use strict";var t=e.i(91788);let r=/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;e.s(["default",0,function(){let[e,s]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{s(!!(void 0===window.navigator?"":navigator.userAgent).match(r))},[]),e}])},56947,e=>{"use strict";var t=e.i(91398),r=e.i(8002),s=e.i(41875);let n={htmlInitialValue:`<div class="hello">Hello, world!</div>
<button id="color-button">Change Color</button>`,cssInitialValue:`.hello {
  font-size: 5rem;
  font-weight: bold;
  text-align: center;
  color: white;
  background-color: blue;
  border-radius: 0.5rem;
  padding: 1rem;
  position: relative;
  animation: slidein 1s ease-out forwards;
}

@keyframes slidein {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

button {
  display: block;
  margin: 1rem auto;
  padding: 1rem;
  font-size: 1rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 0.5rem;
  cursor: pointer;
}`,jsInitialValue:`const hello = document.querySelector('.hello');
const colorButton = document.querySelector('#color-button');
colorButton.addEventListener('click', () => {
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  const color = "rgb(" + red + "," + green + "," + blue + ")";
  hello.style.backgroundColor = color;
});`},o=(0,s.atomWithStorage)("editor",{state:{js:{name:"script.js",language:"javascript",value:n.jsInitialValue},css:{name:"style.css",language:"css",value:n.cssInitialValue},html:{name:"index.html",language:"html",value:n.htmlInitialValue}},selected:"html",previewMode:!1,sidebarCollapsed:!1}),a=(0,r.atom)(e=>e(o).state,(e,t,r)=>t(o,{...e(o),state:r})),l=(0,r.atom)(e=>e(o).previewMode,(e,t,r)=>t(o,{...e(o),previewMode:r})),i=(0,r.atom)(e=>e(o).selected,(e,t,r)=>t(o,{...e(o),selected:r})),c=(0,r.atom)(e=>e(o).sidebarCollapsed,(e,t,r)=>t(o,{...e(o),sidebarCollapsed:r})),d=(0,r.atom)(e=>{let t=e(i);return e(a)[t]},(e,t,r)=>{let s=e(i),n=e(a);t(a,{...n,[s]:{...n[s],value:r}})}),u=(0,r.atom)(e=>{let{html:t,css:r,js:s}=e(a);return`
    <html>
      <body>${t.value}</body>
      <style>${r.value}</style>
      <script>${s.value}</script>
    </html>
  `});var m=e.i(98373);function f(){let[e,t]=(0,m.useAtom)(i),[r,s]=(0,m.useAtom)(l),[n,o]=(0,m.useAtom)(c),f=(0,m.useAtomValue)(a),h=(0,m.useAtomValue)(d);return{tabSelected:e,setTabSelected:t,isPreview:r,setIsPreview:s,isCollapsed:n,setIsCollapsed:o,editorState:f,code:h,setCode:(0,m.useSetAtom)(d),srcDoc:(0,m.useAtomValue)(u)}}var h=e.i(91788);let b=(0,h.memo)(()=>{let{srcDoc:e}=f();return(0,t.jsx)("div",{className:"h-full bg-base-100 overflow-auto",children:(0,t.jsxs)("div",{className:"mockup-browser border-base-300 border rounded-none h-full",children:[(0,t.jsx)("div",{className:"mockup-browser-toolbar",children:(0,t.jsx)("div",{className:"input border-base-300 border",children:window.location.origin})}),(0,t.jsx)("div",{className:"border-base-300 border-t bg-white h-[calc(100%-3rem)]",children:(0,t.jsx)("iframe",{srcDoc:e,title:"output",sandbox:"allow-scripts",frameBorder:"0",className:"w-full h-full"})})]})})});var x=e.i(87405),p=e.i(26048);let g=(0,h.memo)(()=>{let{isPreview:e,setIsPreview:r,code:s}=f();return(0,t.jsxs)("div",{className:"navbar bg-base-200 border-b border-base-300 min-h-0 h-12 px-4",children:[(0,t.jsx)("div",{className:"flex-1",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)(x.FiCode,{className:"text-lg"}),(0,t.jsx)("span",{className:"font-bold text-sm",children:"Code Editor"}),!e&&(0,t.jsx)("div",{className:"ml-4 text-xs text-base-content/70",children:(0,t.jsx)("span",{className:"font-mono",children:s.name})})]})}),(0,t.jsx)("div",{className:"flex-none gap-2",children:(0,t.jsxs)("button",{className:`btn btn-sm gap-2 ${e?"btn-primary":"btn-ghost"}`,onClick:()=>r(!e),children:[(0,t.jsx)(p.VscPreview,{}),e?"Code":"Preview"]})})]})});var v=e.i(45371),j=e.i(5494),N=e.i(25374),y=e.i(78487);let w=(0,h.memo)(()=>{let{tabSelected:e,setTabSelected:r,isPreview:s,setIsPreview:n,isCollapsed:o,setIsCollapsed:a,editorState:l}=f(),i=[{key:"html",icon:v.AiFillHtml5,color:"text-orange-500",data:l.html},{key:"css",icon:j.DiCss3,color:"text-blue-500",data:l.css},{key:"js",icon:N.SiJavascript,color:"text-yellow-500",data:l.js}];return(0,t.jsxs)("div",{className:`bg-base-200 border-r border-base-300 flex flex-col transition-all duration-300 ${o?"w-12":"w-56"}`,children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-2 border-b border-base-300",children:[!o&&(0,t.jsxs)("div",{className:"flex items-center gap-2 text-xs font-semibold text-base-content px-2",children:[(0,t.jsx)(p.VscFiles,{className:"text-base"}),(0,t.jsx)("span",{children:"Files"})]}),(0,t.jsx)("button",{onClick:()=>a(!o),className:"btn btn-ghost btn-xs btn-square",title:o?"Expand sidebar":"Collapse sidebar",children:o?(0,t.jsx)(y.HiChevronRight,{className:"text-base"}):(0,t.jsx)(y.HiChevronLeft,{className:"text-base"})})]}),(0,t.jsx)("div",{className:"flex-1 p-2 overflow-y-auto",children:(0,t.jsx)("div",{className:"space-y-1",children:i.map(({key:a,icon:l,color:i,data:c})=>(0,t.jsxs)("button",{onClick:()=>{r(a),n(!1)},className:`
                w-full flex items-center gap-2 px-2 py-2 rounded text-sm
                transition-all duration-200
                ${e===a&&!s?"bg-primary text-primary-content":"hover:bg-base-300 text-base-content"}
              `,title:o?c.name:"",children:[(0,t.jsx)(l,{className:`text-lg flex-shrink-0 ${e===a&&!s?"text-primary-content":i}`}),!o&&(0,t.jsx)("span",{className:"flex-1 text-left font-mono text-xs truncate",children:c.name})]},a))})})]})});var E=e.i(77833),C=e.i(51154),P=e.i(47723),k=e.i(20487);let S=(0,h.memo)(()=>{let{isDarkMode:e}=(0,C.useTheme)(),{code:r,setCode:s}=f(),n=(0,E.default)();return(0,t.jsx)("div",{className:"h-full flex flex-col bg-base-100",children:(0,t.jsx)("div",{className:"flex-1",children:(0,t.jsx)(P.Editor,{height:"100%",language:r.language,value:r.value,loading:(0,t.jsx)(k.default,{}),onChange:e=>s(e||""),theme:e?"vs-dark":"vs-light",options:{minimap:{enabled:!n},lineNumbers:n?"off":"on",scrollBeyondLastLine:!1,automaticLayout:!0}})})})});e.s(["default",0,()=>{let{isPreview:e}=f();return(0,t.jsxs)("div",{className:"h-[calc(90dvh)] flex flex-col bg-base-100",children:[(0,t.jsx)(g,{}),(0,t.jsxs)("div",{className:"flex-1 flex overflow-hidden",children:[!e&&(0,t.jsx)(w,{}),(0,t.jsx)("div",{className:"flex-1 overflow-hidden border-base-300 border",children:e?(0,t.jsx)(b,{}):(0,t.jsx)(S,{})})]})]})}],56947)},12030,e=>{"use strict";var t=e.i(91398),r=e.i(56947),s=e.i(76025);e.s(["default",0,()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(s.NextSeo,{title:"Editor",description:"Create, edit, and preview your web projects in real-time with our HTML, CSS, and JS editor. Write and test HTML, CSS, and JavaScript code effortlessly. Visualize your changes instantly."}),(0,t.jsx)(r.default,{})]})])},410,(e,t,r)=>{let s="/editor";(window.__NEXT_P=window.__NEXT_P||[]).push([s,()=>e.r(12030)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push([s])})},48761,e=>{e.v(t=>Promise.all(["static/chunks/0ey~yy8oeyp~5.js"].map(t=>e.l(t))).then(()=>t(93594)))},28805,e=>{e.v(t=>Promise.all(["static/chunks/0599p99vu8fk5.js"].map(t=>e.l(t))).then(()=>t(79466)))}]);