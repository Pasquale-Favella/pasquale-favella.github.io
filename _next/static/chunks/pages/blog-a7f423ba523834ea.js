(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{7801:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return a(5966)}])},7071:function(e,t,a){"use strict";a.d(t,{Z:function(){return u}});var r=a(5893),n=a(5337),s=a(3854),l=a(5131),i=a(1664),o=a.n(i);let c=e=>{var t;let{post:a}=e;return(0,r.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,r.jsxs)("li",{className:"py-6 w-full",children:[(0,r.jsx)("article",{children:(0,r.jsxs)("div",{className:" animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,r.jsxs)("dl",{children:[(0,r.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,r.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,r.jsx)("time",{dateTime:a.created_at,children:l.Z.formatDateEN(a.created_at)})})]}),(0,r.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,r.jsxs)("div",{className:"space-y-1",children:[(0,r.jsx)("div",{children:(0,r.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,r.jsx)(o(),{href:"/blog/".concat(a.number),className:" transition duration-500 ease-in-out hover:text-primary",children:a.title})})}),(0,r.jsx)("div",{className:"flex flex-wrap",children:(null===(t=a.labels)||void 0===t?void 0:t.length)&&a.labels.filter(e=>e.name.toLowerCase()!==n.t.LABELS.DOC).map(e=>(0,r.jsxs)(o(),{className:"mt-2 mr-3 btn btn-ghost btn-sm text-primary",href:{pathname:"/blog",query:{tag:e.name}},passHref:!0,shallow:!0,children:[(0,r.jsx)(s.Ohp,{}),e.name]},e.id))})]})})]})}),(0,r.jsx)("div",{className:"text-base font-medium leading-6 flex justify-end",children:(0,r.jsx)(o(),{href:"/blog/".concat(a.number),className:"text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(a.title,'"'),children:"Read more →"})})]})})},d=e=>{let{posts:t}=e;return(0,r.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,r.jsx)(c,{post:e},e.id))})};var u=d},2820:function(e,t,a){"use strict";var r=a(7294);t.Z=function(e,t){let[a,n]=(0,r.useState)(e);return(0,r.useEffect)(()=>{let a=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(a)}},[e,t]),a}},5966:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return h},default:function(){return x}});var r=a(5893),n=a(7071),s=a(5337),l=a(1163),i=a(7294),o=a(2820);let c=e=>{var t;let{posts:a,searchTerm:r}=e,n=(0,l.useRouter)(),c=(0,o.Z)(r,300),d=(0,i.useMemo)(()=>Array.from(new Set([s.t.LABELS.ALL,...a.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==s.t.LABELS.DOC)])),[]),u=null===(t=n.query)||void 0===t?void 0:t.tag,m=async e=>await n.push({pathname:n.pathname,query:{tag:e}}),h=(0,i.useMemo)(()=>a.filter(e=>{let t=r.toLowerCase(),a=e.title.toLowerCase(),n=e.body.toLowerCase(),l=a.includes(t)||n.includes(t);return Boolean(u)&&u!==s.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==u?void 0:u.toLowerCase()))&&l:l}),[c,u]);return{filteredPosts:h,tags:d,selectedTag:u,onTagSelect:m}};var d=a(2962),u=a(5434);let m=e=>{let{posts:t}=e,[a,l]=(0,i.useState)(""),{filteredPosts:o,selectedTag:m,tags:h,onTagSelect:x}=c({posts:t,searchTerm:a});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(d.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,r.jsxs)("main",{children:[(0,r.jsx)("div",{className:"form-control",children:(0,r.jsxs)("label",{className:"input-group",children:[(0,r.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs",defaultValue:s.t.LABELS.ALL,value:m,onChange:e=>x(e.target.value),children:h.map(e=>(0,r.jsx)("option",{value:e,children:e},e))}),(0,r.jsx)("input",{type:"text",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary",value:a,onChange:e=>l(e.target.value)})]})}),Boolean(o.length)?(0,r.jsx)(n.Z,{posts:o}):(0,r.jsx)("div",{className:"flex justify-items-center items-center",children:(0,r.jsxs)("span",{className:"group my-8 flex items-center gap-4 text-lg font-medium",children:[(0,r.jsx)(u.v2z,{size:20,className:"transition duration-200 group-hover:scale-125"}),(0,r.jsx)("span",{children:"No post found"})]})})]})]})};var h=!0,x=m},5131:function(e,t,a){"use strict";var r=a(709),n=a(7458),s=a(9557);let l=e=>{let t=new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return t};t.Z={formatDateEN:l,calculateAge:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];let e=(0,n.Z)(r.Z.dob,"dd/MM/yyyy",new Date),t=(0,s.Z)(new Date,e);return t}}}},function(e){e.O(0,[556,228,173,774,888,179],function(){return e(e.s=7801)}),_N_E=e.O()}]);