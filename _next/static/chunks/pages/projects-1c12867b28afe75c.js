(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[327],{96192:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/projects",function(){return r(21629)}])},44159:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var s=r(85893),n=r(97735);let a=e=>{let{topic:t}=e;return(0,s.jsx)("a",{href:"https://github.com/topics/".concat(t),target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 transition duration-100 hover:scale-105 hover:text-primary",children:(0,s.jsx)("small",{className:"",children:t},t)})},l=e=>{let{project:t}=e;return(0,s.jsx)("div",{className:"tooltip tooltip-right tooltip-primary before:text-xs before:content-[attr(data-tip)]","data-tip":"view ".concat(t.name," repo"),children:(0,s.jsx)("a",{className:"btn btn-ghost btn-circle normal-case btn-sm",href:"".concat(t.html_url),target:"_blank",rel:"noopener noreferrer",children:(0,s.jsx)(n.pZu,{size:30})})})};var o=e=>{let{project:t}=e,r=t.topics;return(0,s.jsxs)("div",{className:"flex w-full flex-1 items-center justify-start rounded-lg border  p-4 transition-all duration-300 hover:scale-105 sm:px-6",children:[(0,s.jsx)(l,{project:t}),(0,s.jsxs)("div",{className:"px-4",children:[(0,s.jsx)("a",{href:"".concat(t.html_url),target:"_blank",rel:"noopener noreferrer",className:"text-2xl text-primary font-bold transition-all duration-300 hover:text-primary/80",children:t.name}),(0,s.jsx)("p",{children:t.description}),!!r.length&&(0,s.jsx)("div",{className:"flex gap-x-2 flex-wrap",children:r.map(e=>(0,s.jsx)(a,{topic:e},e))})]})]})},i=e=>{let{projects:t}=e;return(0,s.jsx)("div",{className:" flex flex-col",children:(0,s.jsx)("div",{className:"flex flex-col gap-8",children:t.map(e=>(0,s.jsx)(o,{project:e},e.id))})})}},99684:function(e,t,r){"use strict";var s=r(67294);t.Z=function(e,t){let[r,n]=(0,s.useState)(e);return(0,s.useEffect)(()=>{let r=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(r)}},[e,t]),r}},21629:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return d},default:function(){return p}});var s=r(85893),n=r(67294),a=r(2962),l=r(44159),o=r(38138),i=r(99684);let c=e=>{let{projects:t,searchTerm:r}=e,s=(0,i.Z)(r,300),a=(0,n.useMemo)(()=>t.filter(e=>{var t;let s=r.toLowerCase(),n=e.name.toLowerCase(),a=null===(t=e.description)||void 0===t?void 0:t.toLowerCase(),l=e.topics.some(e=>e.toLowerCase().includes(s)),o=n.includes(s)||(null==a?void 0:a.includes(s))||l;return o}),[s]);return{filteredProjects:a}};var u=r(5434),d=!0,p=e=>{let{projects:t}=e,[r,i]=(0,n.useState)(""),{filteredProjects:d}=c({projects:t,searchTerm:r});return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(a.PB,{title:"Projects",description:"Pasquale Favella Projects"}),(0,s.jsxs)("main",{children:[(0,s.jsxs)("div",{className:"relative mb-5",children:[(0,s.jsx)("input",{type:"text",value:r,onChange:e=>i(e.target.value),placeholder:"Search project","aria-label":"Search project",className:"w-full rounded-md border bg-base-100 border py-2 px-3 pl-12 transition-colors duration-200 ease-linear focus:border-primary focus:outline-none",id:"search"}),(0,s.jsx)("label",{htmlFor:"search",children:(0,s.jsx)(o.w75,{className:"absolute top-1/2 left-4 -translate-y-1/2",size:20})})]}),d.length?(0,s.jsx)(l.Z,{projects:d}):(0,s.jsx)("div",{className:"flex justify-items-center items-center",children:(0,s.jsxs)("span",{className:"group my-8 flex items-center gap-4 text-lg font-medium",children:[(0,s.jsx)(u.v2z,{size:20,className:"transition duration-200 group-hover:scale-125"}),(0,s.jsx)("span",{children:"No projects found"})]})})]})]})}}},function(e){e.O(0,[401,774,888,179],function(){return e(e.s=96192)}),_N_E=e.O()}]);