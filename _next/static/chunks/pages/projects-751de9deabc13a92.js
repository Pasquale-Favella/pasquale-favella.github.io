(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[327],{96192:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/projects",function(){return r(21629)}])},1096:function(e,t,r){"use strict";r.d(t,{Z:function(){return s}});var n=r(85893),s=e=>{let{body:t,Icon:r}=e;return(0,n.jsx)("div",{className:"flex justify-center items-center",children:(0,n.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,n.jsx)(r,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,n.jsx)("span",{children:t})]})})}},44159:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});var n=r(85893),s=r(97735);let a=e=>{let{topic:t}=e;return(0,n.jsx)("a",{href:"https://github.com/topics/".concat(t),target:"_blank",rel:"noopener noreferrer",className:"text-gray-500 transition duration-100 hover:scale-105 hover:text-primary",children:(0,n.jsx)("small",{className:"",children:t},t)})},l=e=>{let{project:t}=e;return(0,n.jsx)("div",{className:"tooltip tooltip-right before:text-xs before:content-[attr(data-tip)]","data-tip":"view ".concat(t.name," repo"),children:(0,n.jsx)("a",{className:"btn btn-ghost btn-circle normal-case btn-sm",href:"".concat(t.html_url),target:"_blank",rel:"noopener noreferrer",children:(0,n.jsx)(s.pZu,{size:30})})})};var i=e=>{let{project:t}=e,r=t.topics;return(0,n.jsxs)("div",{className:"flex w-full flex-1 items-center justify-start rounded-lg border  p-4 transition-all duration-300 hover:scale-105 sm:px-6",children:[(0,n.jsx)(l,{project:t}),(0,n.jsxs)("div",{className:"px-4",children:[(0,n.jsx)("a",{href:"".concat(t.html_url),target:"_blank",rel:"noopener noreferrer",className:"text-2xl text-primary font-bold transition-all duration-300 hover:text-primary/80",children:t.name}),(0,n.jsx)("p",{children:t.description}),!!r.length&&(0,n.jsx)("div",{className:"flex gap-x-2 flex-wrap",children:r.map(e=>(0,n.jsx)(a,{topic:e},e))})]})]})},o=e=>{let{projects:t}=e;return(0,n.jsx)("div",{className:" flex flex-col",children:(0,n.jsx)("div",{className:"flex flex-col gap-8",children:t.map(e=>(0,n.jsx)(i,{project:e},e.id))})})}},99684:function(e,t,r){"use strict";var n=r(67294);t.Z=function(e,t){let[r,s]=(0,n.useState)(e);return(0,n.useEffect)(()=>{let r=setTimeout(()=>s(e),t||500);return()=>{clearTimeout(r)}},[e,t]),r}},21629:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return p},default:function(){return x}});var n=r(85893),s=r(67294),a=r(2962),l=r(44159),i=r(1096),o=r(38138),c=r(99684);let u=e=>{let{projects:t,searchTerm:r}=e,n=(0,c.Z)(r,300),a=(0,s.useMemo)(()=>t.filter(e=>{var t;let n=r.toLowerCase(),s=e.name.toLowerCase(),a=null===(t=e.description)||void 0===t?void 0:t.toLowerCase(),l=e.topics.some(e=>e.toLowerCase().includes(n)),i=s.includes(n)||(null==a?void 0:a.includes(n))||l;return i}),[n]);return{filteredProjects:a}};var d=r(8193),p=!0,x=e=>{let{projects:t}=e,[r,c]=(0,s.useState)(""),{filteredProjects:p}=u({projects:t,searchTerm:r});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(a.PB,{title:"Projects",description:"Pasquale Favella Projects"}),(0,n.jsxs)("main",{children:[(0,n.jsxs)("div",{className:"relative mb-5",children:[(0,n.jsx)("input",{type:"text",value:r,onChange:e=>c(e.target.value),placeholder:"Search project","aria-label":"Search project",className:"w-full input input-bordered  pl-12 transition-colors duration-200 ease-linear focus:border-primary focus:outline-none",id:"search"}),(0,n.jsx)("label",{htmlFor:"search",children:(0,n.jsx)(o.w75,{className:"absolute top-1/2 left-4 -translate-y-1/2",size:20})})]}),p.length?(0,n.jsx)(l.Z,{projects:p}):(0,n.jsx)(i.Z,{Icon:d.Tk2,body:"No projects found"})]})]})}}},function(e){e.O(0,[401,774,888,179],function(){return e(e.s=96192)}),_N_E=e.O()}]);