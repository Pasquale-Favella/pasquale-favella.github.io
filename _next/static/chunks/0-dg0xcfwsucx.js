(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,35074,e=>{"use strict";let t=async e=>new Promise((t,r)=>{let n=new FileReader;n.readAsDataURL(e),n.onload=function(e){return t(e.target?.result)},n.onerror=e=>r(e)}),r=async(e,t=3,n=1e3)=>{try{return await e()}catch(o){if(t>0)return await new Promise(e=>setTimeout(e,n)),r(e,t-1,n);throw o}};e.s(["Utils",0,{uid:()=>crypto.getRandomValues(new Uint32Array(1)).toString(),returnBase64FromFile:t,extractWords:(e,t)=>e.trim().split(/\s+/).slice(0,t).join(" "),extractFirstPhrase:e=>{let t=e.indexOf(".");return(-1!==t?e.substring(0,t):e).trim()},withRetry:r,removeFirstMatchImmutable:function(e,t){let r=e.findIndex(t);return -1===r?[...e]:[...e.slice(0,r),...e.slice(r+1)]}}],35074)},7982,e=>{"use strict";let t,r;var n,o=e.i(91788);let i={data:""},a=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,s=/\/\*[^]*?\*\/|  +/g,l=/\n+/g,c=(e,t)=>{let r="",n="",o="";for(let i in e){let a=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+a+";":n+="f"==i[1]?c(a,i):i+"{"+c(a,"k"==i[1]?"":t)+"}":"object"==typeof a?n+=c(a,t?t.replace(/([^,])+/g,e=>i.replace(/(^:.*)|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=a&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=c.p?c.p(i,a):i+":"+a+";")}return r+(t&&o?t+"{"+o+"}":o)+n},u={},d=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+d(e[r]);return t}return e};function p(e){let t,r,n,o=this||{},p=e.call?e(o.p):e;return((e,t,r,n,o)=>{var i;let p=d(e),f=u[p]||(u[p]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(p));if(!u[f]){let t=p!==e?e:(e=>{let t,r,n=[{}];for(;t=a.exec(e.replace(s,""));)t[4]?n.shift():t[3]?(r=t[3].replace(l," ").trim(),n.unshift(n[0][r]=n[0][r]||{})):n[0][t[1]]=t[2].replace(l," ").trim();return n[0]})(e);u[f]=c(o?{["@keyframes "+f]:t}:t,r?"":"."+f)}let m=r&&u.g?u.g:null;return r&&(u.g=u[f]),i=u[f],m?t.data=t.data.replace(m,i):-1===t.data.indexOf(i)&&(t.data=n?i+t.data:t.data+i),f})(p.unshift?p.raw?(t=[].slice.call(arguments,1),r=o.p,p.reduce((e,n,o)=>{let i=t[o];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":c(e,""):!1===e?"":e}return e+n+(null==i?"":i)},"")):p.reduce((e,t)=>Object.assign(e,t&&t.call?t(o.p):t),{}):p,(n=o.target,"object"==typeof window?((n?n.querySelector("#_goober"):window._goober)||Object.assign((n||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:n||i),o.g,o.o,o.k)}p.bind({g:1});let f,m,h,v=p.bind({k:1});function g(e,t){let r=this||{};return function(){let n=arguments;function o(i,a){let s=Object.assign({},i),l=s.className||o.className;r.p=Object.assign({theme:m&&m()},s),r.o=/ *go\d+/.test(l),s.className=p.apply(r,n)+(l?" "+l:""),t&&(s.ref=a);let c=e;return e[0]&&(c=s.as||e,delete s.as),h&&c[0]&&h(s),f(c,s)}return t?t(o):o}}var y=(e,t)=>"function"==typeof e?e(t):e,b=(t=0,()=>(++t).toString()),x=()=>{if(void 0===r&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");r=!e||e.matches}return r},w=new Map,T=e=>{if(w.has(e))return;let t=setTimeout(()=>{w.delete(e),C({type:4,toastId:e})},1e3);w.set(e,t)},k=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:var r;let n;return t.toast.id&&(r=t.toast.id,(n=w.get(r))&&clearTimeout(n)),{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:o}=t;return e.toasts.find(e=>e.id===o.id)?k(e,{type:1,toast:o}):k(e,{type:0,toast:o});case 3:let{toastId:i}=t;return i?T(i):e.toasts.forEach(e=>{T(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===i||void 0===i?{...e,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},S=[],E={toasts:[],pausedAt:void 0},C=e=>{E=k(E,e),S.forEach(e=>{e(E)})},j={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},_=(e={})=>{let[t,r]=(0,o.useState)(E);(0,o.useEffect)(()=>(S.push(r),()=>{let e=S.indexOf(r);e>-1&&S.splice(e,1)}),[t]);let n=t.toasts.map(t=>{var r,n;return{...e,...e[t.type],...t,duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||j[t.type],style:{...e.style,...null==(n=e[t.type])?void 0:n.style,...t.style}}});return{...t,toasts:n}},O=e=>(t,r)=>{let n=((e,t="blank",r)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||b()}))(t,e,r);return C({type:2,toast:n}),n.id},A=(e,t)=>O("blank")(e,t);A.error=O("error"),A.success=O("success"),A.loading=O("loading"),A.custom=O("custom"),A.dismiss=e=>{C({type:3,toastId:e})},A.remove=e=>C({type:4,toastId:e}),A.promise=(e,t,r)=>{let n=A.loading(t.loading,{...r,...null==r?void 0:r.loading});return e.then(e=>(A.success(y(t.success,e),{id:n,...r,...null==r?void 0:r.success}),e)).catch(e=>{A.error(y(t.error,e),{id:n,...r,...null==r?void 0:r.error})}),e};var z=(e,t)=>{C({type:1,toast:{id:e,height:t}})},N=()=>{C({type:5,time:Date.now()})},D=e=>{let{toasts:t,pausedAt:r}=_(e);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),n=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&A.dismiss(t.id);return}return setTimeout(()=>A.dismiss(t.id),r)});return()=>{n.forEach(e=>e&&clearTimeout(e))}},[t,r]);let n=(0,o.useCallback)(()=>{r&&C({type:6,time:Date.now()})},[r]),i=(0,o.useCallback)((e,r)=>{let{reverseOrder:n=!1,gutter:o=8,defaultPosition:i}=r||{},a=t.filter(t=>(t.position||i)===(e.position||i)&&t.height),s=a.findIndex(t=>t.id===e.id),l=a.filter((e,t)=>t<s&&e.visible).length;return a.filter(e=>e.visible).slice(...n?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+o,0)},[t]);return{toasts:t,handlers:{updateHeight:z,startPause:N,endPause:n,calculateOffset:i}}},L=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=v`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,$=v`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${L} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${$} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,I=v`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,M=g("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${I} 1s linear infinite;
`,R=v`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=v`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=g("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${R} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,q=g("div")`
  position: absolute;
`,U=g("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,V=v`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=g("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${V} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,J=({toast:e})=>{let{icon:t,type:r,iconTheme:n}=e;return void 0!==t?"string"==typeof t?o.createElement(K,null,t):t:"blank"===r?null:o.createElement(U,null,o.createElement(M,{...n}),"loading"!==r&&o.createElement(q,null,"error"===r?o.createElement(B,{...n}):o.createElement(H,{...n})))},W=g("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Y=g("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,Z=o.memo(({toast:e,position:t,style:r,children:n})=>{let i=e.height?((e,t)=>{let r=e.includes("top")?1:-1,[n,o]=x()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*r}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*r}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${v(n)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${v(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},a=o.createElement(J,{toast:e}),s=o.createElement(Y,{...e.ariaProps},y(e.message,e));return o.createElement(W,{className:e.className,style:{...i,...r,...e.style}},"function"==typeof n?n({icon:a,message:s}):o.createElement(o.Fragment,null,a,s))});n=o.createElement,c.p=void 0,f=n,m=void 0,h=void 0;var G=({id:e,className:t,style:r,onHeightUpdate:n,children:i})=>{let a=o.useCallback(t=>{if(t){let r=()=>{n(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,n]);return o.createElement("div",{ref:a,className:t,style:r},i)},Q=p`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;e.s(["CheckmarkIcon",0,H,"ErrorIcon",0,B,"LoaderIcon",0,M,"ToastBar",0,Z,"ToastIcon",0,J,"Toaster",0,({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:n,children:i,containerStyle:a,containerClassName:s})=>{let{toasts:l,handlers:c}=D(r);return o.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:s,onMouseEnter:c.startPause,onMouseLeave:c.endPause},l.map(r=>{let a,s,l=r.position||t,u=c.calculateOffset(r,{reverseOrder:e,gutter:n,defaultPosition:t}),d=(a=l.includes("top"),s=l.includes("center")?{justifyContent:"center"}:l.includes("right")?{justifyContent:"flex-end"}:{},{left:0,right:0,display:"flex",position:"absolute",transition:x()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${u*(a?1:-1)}px)`,...a?{top:0}:{bottom:0},...s});return o.createElement(G,{id:r.id,key:r.id,onHeightUpdate:c.updateHeight,className:r.visible?Q:"",style:d},"custom"===r.type?y(r.message,r):i?i(r):o.createElement(Z,{toast:r,position:l}))}))},"default",0,A,"resolveValue",0,y,"toast",0,A,"useToaster",0,D,"useToasterStore",0,_],7982)},23147,8510,11821,e=>{"use strict";let t,r;var n=e.i(91398),o=e.i(52532),i=e.i(17549);let a=e=>"boolean"==typeof e?`${e}`:0===e?"0":e,s=function(){for(var e,t,r=0,n="",o=arguments.length;r<o;r++)(e=arguments[r])&&(t=function e(t){var r,n,o="";if("string"==typeof t||"number"==typeof t)o+=t;else if("object"==typeof t)if(Array.isArray(t)){var i=t.length;for(r=0;r<i;r++)t[r]&&(n=e(t[r]))&&(o&&(o+=" "),o+=n)}else for(n in t)t[n]&&(o&&(o+=" "),o+=n);return o}(e))&&(n&&(n+=" "),n+=t);return n};e.i(91505);var l=e.i(25963);let c=(t="btn inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",r={variants:{variant:{default:"btn-primary",destructive:"btn-error",outline:"btn-outline",secondary:"btn-secondary",ghost:"btn-ghost",link:"btn-link"},size:{default:"btn-md has-[>svg]:px-3",sm:"btn-sm gap-1.5 has-[>svg]:px-2.5",lg:"btn-lg has-[>svg]:px-4",icon:"btn-square btn-md"}},defaultVariants:{variant:"default",size:"default"}},e=>{var n;if((null==r?void 0:r.variants)==null)return s(t,null==e?void 0:e.class,null==e?void 0:e.className);let{variants:o,defaultVariants:i}=r,l=Object.keys(o).map(t=>{let r=null==e?void 0:e[t],n=null==i?void 0:i[t];if(null===r)return null;let s=a(r)||a(n);return o[t][s]}),c=e&&Object.entries(e).reduce((e,t)=>{let[r,n]=t;return void 0===n||(e[r]=n),e},{});return s(t,l,null==r||null==(n=r.compoundVariants)?void 0:n.reduce((e,t)=>{let{class:r,className:n,...o}=t;return Object.entries(o).every(e=>{let[t,r]=e;return Array.isArray(r)?r.includes({...i,...c}[t]):({...i,...c})[t]===r})?[...e,r,n]:e},[]),null==e?void 0:e.class,null==e?void 0:e.className)});function u({className:e,variant:t,size:r,asChild:o=!1,isLoading:a=!1,children:s,...d}){let p=o?i.Slot:"button";return(0,n.jsxs)(p,{"data-slot":"button",className:(0,l.cn)(c({variant:t,size:r,className:e})),disabled:a||d.disabled,...d,children:[a&&(0,n.jsx)("span",{className:"loading loading-spinner"}),s]})}e.s(["Button",0,u],8510),e.s(["default",0,({message:e,retryConfig:t})=>(0,n.jsxs)("div",{className:"flex w-full flex-1 items-center justify-start rounded-lg border border-error p-4 sm:px-6 mt-2",children:[(0,n.jsx)(o.BiErrorCircle,{size:50,className:"text-error"}),(0,n.jsxs)("div",{className:"px-4 flex-1 flex justify-between items-center",children:[(0,n.jsx)("p",{children:e}),t&&(0,n.jsx)(u,{type:"button",variant:"outline",size:"sm",onClick:t.onRetry,disabled:t.retryDisabled,className:"mt-2 btn-error",children:t.retryMessage??"Retry"})]})]})],11821),e.s([],23147)},32872,e=>{"use strict";var t=e.i(91398),r=e.i(91788);let n={damping:.7,stiffness:.05,mass:1.25},o=1e3/60,i=!1;function a(e,t){let n=(0,r.useCallback)(t=>(n.current=t,e(t)),t);return n}globalThis.document?.addEventListener("mousedown",()=>{i=!0}),globalThis.document?.addEventListener("mouseup",()=>{i=!1}),globalThis.document?.addEventListener("click",()=>{i=!1});let s=new Map;function l(...e){let t={...n},r=!1;for(let n of e){if("instant"===n){r=!0;continue}"object"==typeof n&&(r=!1,t.damping=n.damping??t.damping,t.stiffness=n.stiffness??t.stiffness,t.mass=n.mass??t.mass)}let o=JSON.stringify(t);return s.has(o)||s.set(o,Object.freeze(t)),r?"instant":s.get(o)}let c=(0,r.createContext)(null),u="u">typeof window?r.useLayoutEffect:r.useEffect;function d({instance:e,children:n,resize:s,initial:p,mass:f,damping:m,stiffness:h,targetScrollTop:v,contextRef:g,...y}){let b=(0,r.useRef)(null),x=((e={})=>{let[t,n]=(0,r.useState)(!1),[s,c]=(0,r.useState)(!1!==e.initial),[u,d]=(0,r.useState)(!1),p=(0,r.useRef)(null);p.current=e;let f=(0,r.useCallback)(()=>{if(!i)return!1;let e=window.getSelection();if(!e||!e.rangeCount)return!1;let t=e.getRangeAt(0);return t.commonAncestorContainer.contains(w.current)||w.current?.contains(t.commonAncestorContainer)},[]),m=(0,r.useCallback)(e=>{v.isAtBottom=e,c(e)},[]),h=(0,r.useCallback)(e=>{v.escapedFromLock=e,n(e)},[]),v=(0,r.useMemo)(()=>{let r;return{escapedFromLock:t,isAtBottom:s,resizeDifference:0,accumulated:0,velocity:0,listeners:new Set,get scrollTop(){return w.current?.scrollTop??0},set scrollTop(scrollTop){w.current&&(w.current.scrollTop=scrollTop,v.ignoreScrollToTop=w.current.scrollTop)},get targetScrollTop(){if(!w.current||!T.current)return 0;return w.current.scrollHeight-1-w.current.clientHeight},get calculatedTargetScrollTop(){if(!w.current||!T.current)return 0;let{targetScrollTop:t}=this;if(!e.targetScrollTop)return t;if(r?.targetScrollTop===t)return r.calculatedScrollTop;let n=Math.max(Math.min(e.targetScrollTop(t,{scrollElement:w.current,contentElement:T.current}),t),0);return r={targetScrollTop:t,calculatedScrollTop:n},requestAnimationFrame(()=>{r=void 0}),n},get scrollDifference(){return this.calculatedTargetScrollTop-this.scrollTop},get isNearBottom(){return this.scrollDifference<=70}}},[]),g=(0,r.useCallback)((e={})=>{let t;"string"==typeof e&&(e={animation:e}),e.preserveScrollPosition||m(!0);let r=Date.now()+(Number(e.wait)||0),n=l(p.current,e.animation),{ignoreEscapes:i=!1}=e,a=v.calculatedTargetScrollTop;e.duration instanceof Promise?e.duration.finally(()=>{t=Date.now()}):t=r+(e.duration??0);let s=async()=>{let e=new Promise(requestAnimationFrame).then(()=>{if(!v.isAtBottom)return v.animation=void 0,!1;let{scrollTop:c}=v,u=performance.now(),d=(u-(v.lastTick??u))/o;if(v.animation||(v.animation={behavior:n,promise:e,ignoreEscapes:i}),v.animation.behavior===n&&(v.lastTick=u),f()||r>Date.now())return s();if(c<Math.min(a,v.calculatedTargetScrollTop)){if(v.animation?.behavior===n){if("instant"===n)return v.scrollTop=v.calculatedTargetScrollTop,s();v.velocity=(n.damping*v.velocity+n.stiffness*v.scrollDifference)/n.mass,v.accumulated+=v.velocity*d,v.scrollTop+=v.accumulated,v.scrollTop!==c&&(v.accumulated=0)}return s()}return t>Date.now()?(a=v.calculatedTargetScrollTop,s()):(v.animation=void 0,v.scrollTop<v.calculatedTargetScrollTop)?g({animation:l(p.current,p.current.resize),ignoreEscapes:i,duration:Math.max(0,t-Date.now())||void 0}):v.isAtBottom});return e.then(e=>(requestAnimationFrame(()=>{v.animation||(v.lastTick=void 0,v.velocity=0)}),e))};return(!0!==e.wait&&(v.animation=void 0),v.animation?.behavior===n)?v.animation.promise:s()},[m,f,v]),y=(0,r.useCallback)(()=>{h(!0),m(!1)},[h,m]),b=(0,r.useCallback)(({target:e})=>{if(e!==w.current)return;let{scrollTop:t,ignoreScrollToTop:r}=v,{lastScrollTop:n=t}=v;v.lastScrollTop=t,v.ignoreScrollToTop=void 0,r&&r>t&&(n=r),d(v.isNearBottom),setTimeout(()=>{if(v.resizeDifference||t===r)return;if(f()){h(!0),m(!1);return}let e=t>n,o=t<n;if(v.animation?.ignoreEscapes){v.scrollTop=n;return}o&&(h(!0),m(!1)),e&&h(!1),!v.escapedFromLock&&v.isNearBottom&&m(!0)},1)},[h,m,f,v]),x=(0,r.useCallback)(({target:e,deltaY:t})=>{let r=e;for(;!["scroll","auto"].includes(getComputedStyle(r).overflow);){if(!r.parentElement)return;r=r.parentElement}r===w.current&&t<0&&w.current.scrollHeight>w.current.clientHeight&&!v.animation?.ignoreEscapes&&(h(!0),m(!1))},[h,m,v]),w=a(e=>{w.current?.removeEventListener("scroll",b),w.current?.removeEventListener("wheel",x),e?.addEventListener("scroll",b,{passive:!0}),e?.addEventListener("wheel",x,{passive:!0})},[]),T=a(e=>{let t;v.resizeObserver?.disconnect(),e&&(v.resizeObserver=new ResizeObserver(([e])=>{let{height:r}=e.contentRect,n=r-(t??r);if(v.resizeDifference=n,v.scrollTop>v.targetScrollTop&&(v.scrollTop=v.targetScrollTop),d(v.isNearBottom),n>=0){let e=l(p.current,t?p.current.resize:p.current.initial);g({animation:e,wait:!0,preserveScrollPosition:!0,duration:"instant"===e?void 0:350})}else v.isNearBottom&&(h(!1),m(!0));t=r,requestAnimationFrame(()=>{setTimeout(()=>{v.resizeDifference===n&&(v.resizeDifference=0)},1)})}),v.resizeObserver?.observe(e))},[]);return{contentRef:T,scrollRef:w,scrollToBottom:g,stopScroll:y,isAtBottom:s||u,isNearBottom:u,escapedFromLock:t,state:v}})({mass:f,damping:m,stiffness:h,resize:s,initial:p,targetScrollTop:r.useCallback((e,t)=>{let r=_?.targetScrollTop??v;return r?.(e,t)??e},[v])}),{scrollRef:w,contentRef:T,scrollToBottom:k,stopScroll:S,isAtBottom:E,escapedFromLock:C,state:j}=e??x,_=(0,r.useMemo)(()=>({scrollToBottom:k,stopScroll:S,scrollRef:w,isAtBottom:E,escapedFromLock:C,contentRef:T,state:j,get targetScrollTop(){return b.current},set targetScrollTop(targetScrollTop){b.current=targetScrollTop}}),[k,E,T,w,S,C,j]);return(0,r.useImperativeHandle)(g,()=>_,[_]),u(()=>{w.current&&"visible"===getComputedStyle(w.current).overflow&&(w.current.style.overflow="auto")},[]),(0,t.jsx)(c.Provider,{value:_,children:(0,t.jsx)("div",{...y,children:"function"==typeof n?n(_):n})})}function p(){let e=(0,r.useContext)(c);if(!e)throw Error("use-stick-to-bottom component context must be used within a StickToBottom component");return e}(d||(d={})).Content=function({children:e,...r}){let n=p();return(0,t.jsx)("div",{ref:n.scrollRef,style:{height:"100%",width:"100%"},children:(0,t.jsx)("div",{...r,ref:n.contentRef,children:"function"==typeof e?e(n):e})})},e.s(["StickToBottom",0,d,"useStickToBottomContext",0,p],32872)},18120,e=>{e.q("/_next/static/media/worker.02g03blzzg0t8.ts")},35228,(e,t,r)=>{"use strict";var n=Object.prototype.hasOwnProperty,o="~";function i(){}function a(e,t,r){this.fn=e,this.context=t,this.once=r||!1}function s(e,t,r,n,i){if("function"!=typeof r)throw TypeError("The listener must be a function");var s=new a(r,n||e,i),l=o?o+t:t;return e._events[l]?e._events[l].fn?e._events[l]=[e._events[l],s]:e._events[l].push(s):(e._events[l]=s,e._eventsCount++),e}function l(e,t){0==--e._eventsCount?e._events=new i:delete e._events[t]}function c(){this._events=new i,this._eventsCount=0}Object.create&&(i.prototype=Object.create(null),new i().__proto__||(o=!1)),c.prototype.eventNames=function(){var e,t,r=[];if(0===this._eventsCount)return r;for(t in e=this._events)n.call(e,t)&&r.push(o?t.slice(1):t);return Object.getOwnPropertySymbols?r.concat(Object.getOwnPropertySymbols(e)):r},c.prototype.listeners=function(e){var t=o?o+e:e,r=this._events[t];if(!r)return[];if(r.fn)return[r.fn];for(var n=0,i=r.length,a=Array(i);n<i;n++)a[n]=r[n].fn;return a},c.prototype.listenerCount=function(e){var t=o?o+e:e,r=this._events[t];return r?r.fn?1:r.length:0},c.prototype.emit=function(e,t,r,n,i,a){var s=o?o+e:e;if(!this._events[s])return!1;var l,c,u=this._events[s],d=arguments.length;if(u.fn){switch(u.once&&this.removeListener(e,u.fn,void 0,!0),d){case 1:return u.fn.call(u.context),!0;case 2:return u.fn.call(u.context,t),!0;case 3:return u.fn.call(u.context,t,r),!0;case 4:return u.fn.call(u.context,t,r,n),!0;case 5:return u.fn.call(u.context,t,r,n,i),!0;case 6:return u.fn.call(u.context,t,r,n,i,a),!0}for(c=1,l=Array(d-1);c<d;c++)l[c-1]=arguments[c];u.fn.apply(u.context,l)}else{var p,f=u.length;for(c=0;c<f;c++)switch(u[c].once&&this.removeListener(e,u[c].fn,void 0,!0),d){case 1:u[c].fn.call(u[c].context);break;case 2:u[c].fn.call(u[c].context,t);break;case 3:u[c].fn.call(u[c].context,t,r);break;case 4:u[c].fn.call(u[c].context,t,r,n);break;default:if(!l)for(p=1,l=Array(d-1);p<d;p++)l[p-1]=arguments[p];u[c].fn.apply(u[c].context,l)}}return!0},c.prototype.on=function(e,t,r){return s(this,e,t,r,!1)},c.prototype.once=function(e,t,r){return s(this,e,t,r,!0)},c.prototype.removeListener=function(e,t,r,n){var i=o?o+e:e;if(!this._events[i])return this;if(!t)return l(this,i),this;var a=this._events[i];if(a.fn)a.fn!==t||n&&!a.once||r&&a.context!==r||l(this,i);else{for(var s=0,c=[],u=a.length;s<u;s++)(a[s].fn!==t||n&&!a[s].once||r&&a[s].context!==r)&&c.push(a[s]);c.length?this._events[i]=1===c.length?c[0]:c:l(this,i)}return this},c.prototype.removeAllListeners=function(e){var t;return e?(t=o?o+e:e,this._events[t]&&l(this,t)):(this._events=new i,this._eventsCount=0),this},c.prototype.off=c.prototype.removeListener,c.prototype.addListener=c.prototype.on,c.prefixed=o,c.EventEmitter=c,t.exports=c}]);