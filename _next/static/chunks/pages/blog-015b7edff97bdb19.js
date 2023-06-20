(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{67801:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return a(66629)}])},1096:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});var n=a(85893),r=e=>{let{body:t,Icon:a}=e;return(0,n.jsx)("div",{className:"flex justify-center items-center",children:(0,n.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,n.jsx)(a,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,n.jsx)("span",{children:t})]})})}},77092:function(e,t,a){"use strict";a.d(t,{H:function(){return x},Z:function(){return d}});var n=a(85893),r=a(75819),s=a(53854),l=a(68723),i=a(41664),o=a.n(i),c=e=>{var t;let{post:a}=e;return(0,n.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,n.jsxs)("li",{className:"py-6 w-full",children:[(0,n.jsx)("article",{children:(0,n.jsxs)("div",{className:" animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,n.jsxs)("dl",{children:[(0,n.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,n.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,n.jsx)("time",{dateTime:a.created_at,children:l.Z.formatDateEN(a.created_at)})})]}),(0,n.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,n.jsxs)("div",{className:"space-y-1",children:[(0,n.jsx)("div",{children:(0,n.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,n.jsx)(o(),{href:"/blog/".concat(a.number),className:" transition duration-500 ease-in-out hover:text-primary",children:a.title})})}),(0,n.jsx)("div",{className:"flex flex-wrap",children:(null===(t=a.labels)||void 0===t?void 0:t.length)&&a.labels.filter(e=>e.name.toLowerCase()!==r.t.LABELS.DOC).map(e=>(0,n.jsxs)(o(),{className:"mt-2 mr-3 btn btn-ghost btn-sm text-primary",href:{pathname:"/blog",query:{tag:e.name}},passHref:!0,shallow:!0,children:[(0,n.jsx)(s.Ohp,{}),e.name]},e.id))})]})})]})}),(0,n.jsx)("div",{className:"text-base font-medium leading-6 flex justify-end",children:(0,n.jsx)(o(),{href:"/blog/".concat(a.number),className:"text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(a.title,'"'),children:"Read more →"})})]})})},d=e=>{let{posts:t}=e;return(0,n.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,n.jsx)(c,{post:e},e.id))})},u=a(22003);let m={repo:"".concat(u.Z.owner,"/").concat(u.Z.repo),repoId:"".concat(u.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var h=a(99861),x=()=>(0,n.jsx)("div",{className:"my-8",children:(0,n.jsx)(h.Z,{...m,theme:"transparent_dark"})})},99684:function(e,t,a){"use strict";var n=a(67294);t.Z=function(e,t){let[a,r]=(0,n.useState)(e);return(0,n.useEffect)(()=>{let a=setTimeout(()=>r(e),t||500);return()=>{clearTimeout(a)}},[e,t]),a}},66629:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return h},default:function(){return x}});var n=a(85893),r=a(1096),s=a(77092),l=a(75819),i=a(11163),o=a(67294),c=a(99684);let d=e=>{var t;let{posts:a,searchTerm:n}=e,r=(0,i.useRouter)(),s=(0,c.Z)(n,300),d=(0,o.useMemo)(()=>Array.from(new Set([l.t.LABELS.ALL,...a.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==l.t.LABELS.DOC)])),[]),u=null===(t=r.query)||void 0===t?void 0:t.tag,m=async e=>await r.push({pathname:r.pathname,query:{tag:e}}),h=(0,o.useMemo)(()=>a.filter(e=>{let t=n.toLowerCase(),a=e.title.toLowerCase(),r=e.body.toLowerCase(),s=a.includes(t)||r.includes(t);return u&&u!==l.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==u?void 0:u.toLowerCase()))&&s:s}),[s,u]);return{filteredPosts:h,tags:d,selectedTag:u,onTagSelect:m}};var u=a(2962),m=a(63750),h=!0,x=e=>{let{posts:t}=e,[a,i]=(0,o.useState)(""),{filteredPosts:c,selectedTag:h,tags:x,onTagSelect:p}=d({posts:t,searchTerm:a});return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(u.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,n.jsxs)("main",{children:[(0,n.jsxs)("label",{className:"join w-full",children:[(0,n.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs join-item",defaultValue:l.t.LABELS.ALL,value:h,onChange:e=>p(e.target.value),children:x.map(e=>(0,n.jsx)("option",{value:e,children:e},e))}),(0,n.jsx)("input",{type:"text",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary join-item",value:a,onChange:e=>i(e.target.value)})]}),c.length?(0,n.jsx)(s.Z,{posts:c}):(0,n.jsx)(r.Z,{Icon:m.yls,body:"No post found"})]})]})}},68723:function(e,t,a){"use strict";var n=a(22003),r=a(83097),s=a(29557);t.Z={formatDateEN:e=>{let t=new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return t},calculateAge:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];let e=(0,r.Z)(n.Z.dob,"dd/MM/yyyy",new Date),t=(0,s.Z)(new Date,e);return t}}}},function(e){e.O(0,[556,654,861,774,888,179],function(){return e(e.s=67801)}),_N_E=e.O()}]);