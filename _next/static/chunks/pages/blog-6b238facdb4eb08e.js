(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{67801:function(e,t,a){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return a(55086)}])},7596:function(e,t,a){"use strict";a.d(t,{Z:function(){return n}});var r=a(85893),n=e=>{let{body:t,Icon:a}=e;return(0,r.jsx)("div",{className:"flex justify-center items-center",children:(0,r.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,r.jsx)(a,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,r.jsx)("span",{children:t})]})})}},78315:function(e,t,a){"use strict";a.d(t,{HW:function(){return b},Md:function(){return u},ZP:function(){return h}});var r=a(85893),n=a(67294),s=a(61738),l=a(41664),i=a.n(l),o=a(55163),c=a(90512),d=a(19042),u=e=>{let{tag:t,className:a,...n}=e;return(0,r.jsxs)(i(),{className:(0,c.W)("badge badge-lg border-base-content hover:border-accent-content hover:opacity-80 no-underline py-4",a),href:{pathname:"/blog",query:{tag:t}},passHref:!0,shallow:!0,...n,children:[(0,r.jsx)(d.Ohp,{}),t]})};let m=e=>{let{post:t}=e;return(0,r.jsx)(i(),{href:"/blog/".concat(t.number),className:"font-medium leading-6 text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(t.title,'"'),children:"Read more →"})};var p=e=>{let{post:t}=e,a=t.labels.filter(e=>e.name.toLowerCase()!==s.t.LABELS.DOC),l=(0,n.useMemo)(()=>{let e=o.cQ.extractWords(t.body,40);return"".concat(e,"...")},[t.body]);return(0,r.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,r.jsx)("li",{className:"py-2 w-full",children:(0,r.jsx)("article",{children:(0,r.jsxs)("div",{className:"animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,r.jsxs)("dl",{children:[(0,r.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,r.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,r.jsx)("time",{dateTime:t.created_at,children:o.ZP.formatDateEN(t.created_at)})})]}),(0,r.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,r.jsxs)("div",{className:"space-y-1",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,r.jsx)(i(),{href:"/blog/".concat(t.number),className:" transition duration-500 ease-in-out hover:text-primary",children:t.title})}),(0,r.jsx)("small",{className:"line-clamp-3",children:l})]}),(0,r.jsxs)("div",{className:"flex flex-col justify-between items-start md:flex-row md:items-center gap-2 pt-1",children:[(0,r.jsx)("div",{className:"flex flex-wrap gap-1",children:a.map(e=>(0,r.jsx)(u,{tag:e.name,className:"!py-3 bg-transparent"},e.id))}),(0,r.jsx)(m,{post:t})]})]})})]})})})})},h=e=>{let{posts:t}=e;return(0,r.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,r.jsx)(p,{post:e},e.id))})},x=a(51108);let g={repo:"".concat(x.Z.owner,"/").concat(x.Z.repo),repoId:"".concat(x.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var f=a(70024),b=()=>(0,r.jsx)("div",{className:"my-8",children:(0,r.jsx)(f.Z,{...g,theme:"transparent_dark"})})},96714:function(e,t,a){"use strict";var r=a(67294);t.Z=function(e,t){let[a,n]=(0,r.useState)(e);return(0,r.useEffect)(()=>{let a=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(a)}},[e,t]),a}},55086:function(e,t,a){"use strict";a.r(t),a.d(t,{__N_SSG:function(){return p},default:function(){return h}});var r=a(85893),n=a(7596),s=a(78315),l=a(61738),i=a(11163),o=a(67294),c=a(96714);let d=e=>{var t,a;let{posts:r,searchTerm:n}=e,s=(0,i.useRouter)(),d=(0,c.Z)(n,300),u=(0,o.useMemo)(()=>Array.from(new Set([l.t.LABELS.ALL,...r.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==l.t.LABELS.DOC).sort()])),[]),m=null!==(a=null===(t=s.query)||void 0===t?void 0:t.tag)&&void 0!==a?a:l.t.LABELS.ALL,p=async e=>await s.push({pathname:s.pathname,query:{tag:e}});return{filteredPosts:(0,o.useMemo)(()=>r.filter(e=>{let t=n.toLowerCase(),a=e.title.toLowerCase(),r=e.body.toLowerCase(),s=a.includes(t)||r.includes(t);return m&&m!==l.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==m?void 0:m.toLowerCase()))&&s:s}),[d,m]),tags:u,selectedTag:m,onTagSelect:p}};var u=a(2962),m=a(78633),p=!0,h=e=>{let{posts:t}=e,[a,l]=(0,o.useState)(""),{filteredPosts:i,selectedTag:c,tags:p,onTagSelect:h}=d({posts:t,searchTerm:a});return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(u.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,r.jsxs)("main",{children:[(0,r.jsxs)("label",{className:"join w-full",children:[(0,r.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs join-item",id:"select-tag",value:c,onChange:e=>h(e.target.value),children:p.map(e=>(0,r.jsx)("option",{value:e,children:e},e))}),(0,r.jsx)("input",{type:"text",id:"search-article",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary join-item",value:a,onChange:e=>l(e.target.value)})]}),i.length?(0,r.jsx)(s.ZP,{posts:i}):(0,r.jsx)(n.Z,{Icon:m.yls,body:"No post found"})]})]})}},70024:function(e,t,a){"use strict";a.d(t,{Z:function(){return s}});var r=a(85893),n=a(67294);function s({id:e,host:t,repo:s,repoId:l,category:i,categoryId:o,mapping:c,term:d,strict:u,reactionsEnabled:m,emitMetadata:p,inputPosition:h,theme:x,lang:g,loading:f}){let[b,j]=(0,n.useState)(!1);return(0,n.useEffect)(()=>{b||(a.e(355).then(a.bind(a,44355)),j(!0))},[]),b?(0,r.jsx)("giscus-widget",{id:e,host:t,repo:s,repoid:l,category:i,categoryid:o,mapping:c,term:d,strict:u,reactionsenabled:m,emitmetadata:p,inputposition:h,theme:x,lang:g,loading:f}):null}}},function(e){e.O(0,[321,888,774,179],function(){return e(e.s=67801)}),_N_E=e.O()}]);