(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{67801:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return r(66629)}])},1096:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});var a=r(85893),n=e=>{let{body:t,Icon:r}=e;return(0,a.jsx)("div",{className:"flex justify-center items-center",children:(0,a.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,a.jsx)(r,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,a.jsx)("span",{children:t})]})})}},77092:function(e,t,r){"use strict";r.d(t,{H:function(){return g},Z:function(){return x}});var a=r(85893),n=r(67294),s=r(75819),l=r(41664),i=r.n(l),o=r(3818),c=r(53854);let u=e=>{let{label:t}=e;return(0,a.jsxs)(i(),{className:"btn btn-ghost btn-sm text-primary",href:{pathname:"/blog",query:{tag:t.name}},passHref:!0,shallow:!0,children:[(0,a.jsx)(c.Ohp,{}),t.name]})},d=e=>{let{post:t}=e;return(0,a.jsx)(i(),{href:"/blog/".concat(t.number),className:"font-medium leading-6 text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(t.title,'"'),children:"Read more →"})};var m=e=>{let{post:t}=e,r=t.labels.filter(e=>e.name.toLowerCase()!==s.t.LABELS.DOC),l=(0,n.useMemo)(()=>{let e=o.cQ.extractWords(t.body,40);return"".concat(e,"...")},[]);return(0,a.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,a.jsx)("li",{className:"py-2 w-full",children:(0,a.jsx)("article",{children:(0,a.jsxs)("div",{className:" animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,a.jsxs)("dl",{children:[(0,a.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,a.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,a.jsx)("time",{dateTime:t.created_at,children:o.ZP.formatDateEN(t.created_at)})})]}),(0,a.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,a.jsx)(i(),{href:"/blog/".concat(t.number),className:" transition duration-500 ease-in-out hover:text-primary",children:t.title})}),(0,a.jsx)("small",{children:l})]}),(0,a.jsxs)("div",{className:"flex flex-col justify-between items-start md:flex-row md:items-center gap-2",children:[(0,a.jsx)("div",{className:"flex flex-wrap",children:r.map(e=>(0,a.jsx)(u,{label:e},e.id))}),(0,a.jsx)(d,{post:t})]})]})})]})})})})},x=e=>{let{posts:t}=e;return(0,a.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,a.jsx)(m,{post:e},e.id))})},h=r(22003);let f={repo:"".concat(h.Z.owner,"/").concat(h.Z.repo),repoId:"".concat(h.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var p=r(99861),g=()=>(0,a.jsx)("div",{className:"my-8",children:(0,a.jsx)(p.Z,{...f,theme:"transparent_dark"})})},99684:function(e,t,r){"use strict";var a=r(67294);t.Z=function(e,t){let[r,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let r=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(r)}},[e,t]),r}},66629:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return x},default:function(){return h}});var a=r(85893),n=r(1096),s=r(77092),l=r(75819),i=r(11163),o=r(67294),c=r(99684);let u=e=>{var t;let{posts:r,searchTerm:a}=e,n=(0,i.useRouter)(),s=(0,c.Z)(a,300),u=(0,o.useMemo)(()=>Array.from(new Set([l.t.LABELS.ALL,...r.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==l.t.LABELS.DOC)])),[]),d=null===(t=n.query)||void 0===t?void 0:t.tag,m=async e=>await n.push({pathname:n.pathname,query:{tag:e}}),x=(0,o.useMemo)(()=>r.filter(e=>{let t=a.toLowerCase(),r=e.title.toLowerCase(),n=e.body.toLowerCase(),s=r.includes(t)||n.includes(t);return d&&d!==l.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==d?void 0:d.toLowerCase()))&&s:s}),[s,d]);return{filteredPosts:x,tags:u,selectedTag:d,onTagSelect:m}};var d=r(2962),m=r(63750),x=!0,h=e=>{let{posts:t}=e,[r,i]=(0,o.useState)(""),{filteredPosts:c,selectedTag:x,tags:h,onTagSelect:f}=u({posts:t,searchTerm:r});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(d.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,a.jsxs)("main",{children:[(0,a.jsxs)("label",{className:"join w-full",children:[(0,a.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs join-item",defaultValue:l.t.LABELS.ALL,value:x,onChange:e=>f(e.target.value),children:h.map(e=>(0,a.jsx)("option",{value:e,children:e},e))}),(0,a.jsx)("input",{type:"text",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary join-item",value:r,onChange:e=>i(e.target.value)})]}),c.length?(0,a.jsx)(s.Z,{posts:c}):(0,a.jsx)(n.Z,{Icon:m.yls,body:"No post found"})]})]})}},68723:function(e,t,r){"use strict";var a=r(22003),n=r(74201),s=r(84037),l=r(29557),i=r(35077);t.Z={formatDateEN:e=>{let t=(0,n.Z)(new Date(e),"MMMM d, yyyy",{locale:i.Z});return t},calculateAge:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,t=(0,s.Z)(a.Z.dob,"dd/MM/yyyy",e),r=(0,l.Z)(e,t);return r}}},3818:function(e,t,r){"use strict";r.d(t,{Y2:function(){return l},cQ:function(){return s},ZP:function(){return a.Z}});var a=r(68723);let n=async e=>new Promise((t,r)=>{let a=new FileReader;a.readAsDataURL(e),a.onload=function(e){var r;return t(null===(r=e.target)||void 0===r?void 0:r.result)},a.onerror=e=>r(e)});var s={uid:()=>crypto.getRandomValues(new Uint32Array(1)).toString(),returnBase64FromFile:n,extractWords:(e,t)=>{let r=e.trim().split(/\s+/),a=r.slice(0,t).join(" ");return a}},l={initializeGameState:e=>({word:e[Math.floor(Math.random()*e.length)],guesses:Array(6).fill(""),currentGuess:0})}}},function(e){e.O(0,[556,376,861,774,888,179],function(){return e(e.s=67801)}),_N_E=e.O()}]);