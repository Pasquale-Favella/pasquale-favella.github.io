(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{67801:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return a(55086)}])},7596:function(e,t,a){"use strict";a.d(t,{Z:function(){return n}});var r=a(85893),n=e=>{let{body:t,Icon:a}=e;return(0,r.jsx)("div",{className:"flex justify-center items-center",children:(0,r.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,r.jsx)(a,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,r.jsx)("span",{children:t})]})})}},74755:function(e,t,a){"use strict";a.d(t,{HW:function(){return v},Md:function(){return p},ZP:function(){return g}});var r=a(85893),n=a(67294);let s=e=>{let{array:t,pageSize:a}=e,[r,s]=(0,n.useState)(0),i=t.length,l=t.slice(r*a,(r+1)*a);return(0,n.useEffect)(()=>{s(0)},[t]),{pageIndex:r,pageSize:a,paginatedArray:l,totalPages:Math.ceil(i/a),totalItems:i,setPageIndex:s}},i=e=>{(0,n.useEffect)(()=>{e&&window.scrollTo({top:0,behavior:"smooth"})},[e])};var l=a(61738),o=a(41664),c=a.n(o),d=a(55163),u=a(90512),m=a(19042),p=e=>{let{tag:t,className:a,...n}=e;return(0,r.jsxs)(c(),{className:(0,u.W)("badge badge-lg border-base-content hover:border-accent-content hover:opacity-80 no-underline py-4",a),href:{pathname:"/blog",query:{tag:t}},passHref:!0,shallow:!0,...n,children:[(0,r.jsx)(m.Ohp,{}),t]})};let h=e=>{let{post:t}=e;return(0,r.jsx)(c(),{href:"/blog/".concat(t.number),className:"font-medium leading-6 text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(t.title,'"'),children:"Read more →"})};var x=e=>{let{post:t}=e,a=t.labels.filter(e=>e.name.toLowerCase()!==l.t.LABELS.DOC),s=(0,n.useMemo)(()=>{let e=d.cQ.extractWords(t.body,40);return"".concat(e,"...")},[t.body]);return(0,r.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,r.jsx)("li",{className:"py-2 w-full",children:(0,r.jsx)("article",{children:(0,r.jsxs)("div",{className:"animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,r.jsxs)("dl",{children:[(0,r.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,r.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,r.jsx)("time",{dateTime:t.created_at,children:d.ZP.formatDateEN(t.created_at)})})]}),(0,r.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,r.jsxs)("div",{className:"space-y-1",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,r.jsx)(c(),{href:"/blog/".concat(t.number),className:" transition duration-500 ease-in-out hover:text-primary",children:t.title})}),(0,r.jsx)("small",{className:"line-clamp-3",children:s})]}),(0,r.jsxs)("div",{className:"flex flex-col justify-between items-start md:flex-row md:items-center gap-2 pt-1",children:[(0,r.jsx)("div",{className:"flex flex-wrap gap-1",children:a.map(e=>(0,r.jsx)(p,{tag:e.name,className:"!py-3 bg-transparent"},e.id))}),(0,r.jsx)(h,{post:t})]})]})})]})})})})},g=e=>{let{posts:t}=e,{pageIndex:a,paginatedArray:l,totalPages:o,setPageIndex:c}=s({array:t,pageSize:5}),d=(0,n.useRef)(null);return i(!!a),(0,r.jsxs)("div",{className:"grid grid-cols-1 gap-3 mt-3",children:[(0,r.jsx)("ul",{ref:d,children:l.map(e=>(0,r.jsx)(x,{post:e},e.id))}),(0,r.jsxs)("div",{className:"join grid grid-cols-2 m-auto max-w-fit",children:[(0,r.jsx)("button",{className:"join-item btn btn-sm btn-outline btn-primary",onClick:()=>{c(a-1)},disabled:0===a,children:"Previous page"}),(0,r.jsx)("button",{className:"join-item btn btn-sm btn-outline btn-primary",onClick:()=>{c(a+1)},disabled:a===o-1,children:"Next"})]})]})},f=a(51108);let b={repo:"".concat(f.Z.owner,"/").concat(f.Z.repo),repoId:"".concat(f.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var j=a(70024),v=()=>(0,r.jsx)("div",{className:"my-8",children:(0,r.jsx)(j.Z,{...b,theme:"transparent_dark"})})},96714:function(e,t,a){"use strict";var r=a(67294);t.Z=function(e,t){let[a,n]=(0,r.useState)(e);return(0,r.useEffect)(()=>{let a=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(a)}},[e,t]),a}},55086:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return p},default:function(){return h}});var r=a(85893),n=a(7596),s=a(74755),i=a(61738),l=a(11163),o=a(67294),c=a(96714);let d=e=>{var t,a;let{posts:r,searchTerm:n}=e,s=(0,l.useRouter)(),d=(0,c.Z)(n,300),u=(0,o.useMemo)(()=>Array.from(new Set([i.t.LABELS.ALL,...r.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==i.t.LABELS.DOC).sort()])),[]),m=null!==(a=null===(t=s.query)||void 0===t?void 0:t.tag)&&void 0!==a?a:i.t.LABELS.ALL,p=async e=>await s.push({pathname:s.pathname,query:{tag:e}});return{filteredPosts:(0,o.useMemo)(()=>r.filter(e=>{let t=n.toLowerCase(),a=e.title.toLowerCase(),r=e.body.toLowerCase(),s=a.includes(t)||r.includes(t);return m&&m!==i.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==m?void 0:m.toLowerCase()))&&s:s}),[d,m]),tags:u,selectedTag:m,onTagSelect:p}};var u=a(2962),m=a(78633),p=!0,h=e=>{let{posts:t}=e,[a,i]=(0,o.useState)(""),{filteredPosts:l,selectedTag:c,tags:p,onTagSelect:h}=d({posts:t,searchTerm:a});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(u.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,r.jsxs)("main",{children:[(0,r.jsxs)("label",{className:"join w-full",children:[(0,r.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs join-item",id:"select-tag",value:c,onChange:e=>h(e.target.value),children:p.map(e=>(0,r.jsx)("option",{value:e,children:e},e))}),(0,r.jsx)("input",{type:"text",id:"search-article",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary join-item",value:a,onChange:e=>i(e.target.value)})]}),l.length?(0,r.jsx)(s.ZP,{posts:l}):(0,r.jsx)(n.Z,{Icon:m.yls,body:"No post found"})]})]})}},70024:function(e,t,a){"use strict";a.d(t,{Z:function(){return s}});var r=a(85893),n=a(67294);function s({id:e,host:t,repo:s,repoId:i,category:l,categoryId:o,mapping:c,term:d,strict:u,reactionsEnabled:m,emitMetadata:p,inputPosition:h,theme:x,lang:g,loading:f}){let[b,j]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{b||(a.e(355).then(a.bind(a,44355)),j(!0))},[]),b?(0,r.jsx)("giscus-widget",{id:e,host:t,repo:s,repoid:i,category:l,categoryid:o,mapping:c,term:d,strict:u,reactionsenabled:m,emitmetadata:p,inputposition:h,theme:x,lang:g,loading:f}):null}}},function(e){e.O(0,[321,888,774,179],function(){return e(e.s=67801)}),_N_E=e.O()}]);