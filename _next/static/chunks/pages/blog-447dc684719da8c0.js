(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[195],{67801:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog",function(){return r(66629)}])},1096:function(e,t,r){"use strict";r.d(t,{Z:function(){return n}});var a=r(85893),n=e=>{let{body:t,Icon:r}=e;return(0,a.jsx)("div",{className:"flex justify-center items-center",children:(0,a.jsxs)("span",{className:"group my-8 flex items-center gap-2 text-lg font-medium",children:[(0,a.jsx)(r,{size:25,className:"transition duration-200 group-hover:scale-125"}),(0,a.jsx)("span",{children:t})]})})}},11459:function(e,t,r){"use strict";r.d(t,{HW:function(){return y},Md:function(){return u},ZP:function(){return p}});var a=r(85893),n=r(67294),s=r(75819),i=r(41664),l=r.n(i),o=r(3222),c=r(90512),d=r(53854),u=e=>{let{tag:t,className:r,...n}=e;return(0,a.jsxs)(l(),{className:(0,c.W)("badge badge-lg border-base-content hover:border-accent-content hover:opacity-80 no-underline py-4",r),href:{pathname:"/blog",query:{tag:t}},passHref:!0,shallow:!0,...n,children:[(0,a.jsx)(d.Ohp,{}),t]})};let m=e=>{let{post:t}=e;return(0,a.jsx)(l(),{href:"/blog/".concat(t.number),className:"font-medium leading-6 text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(t.title,'"'),children:"Read more →"})};var h=e=>{let{post:t}=e,r=t.labels.filter(e=>e.name.toLowerCase()!==s.t.LABELS.DOC),i=(0,n.useMemo)(()=>{let e=o.cQ.extractWords(t.body,40);return"".concat(e,"...")},[t.body]);return(0,a.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,a.jsx)("li",{className:"py-2 w-full",children:(0,a.jsx)("article",{children:(0,a.jsxs)("div",{className:"animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,a.jsxs)("dl",{children:[(0,a.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,a.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,a.jsx)("time",{dateTime:t.created_at,children:o.ZP.formatDateEN(t.created_at)})})]}),(0,a.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,a.jsxs)("div",{className:"space-y-1",children:[(0,a.jsxs)("div",{children:[(0,a.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,a.jsx)(l(),{href:"/blog/".concat(t.number),className:" transition duration-500 ease-in-out hover:text-primary",children:t.title})}),(0,a.jsx)("small",{className:"line-clamp-3",children:i})]}),(0,a.jsxs)("div",{className:"flex flex-col justify-between items-start md:flex-row md:items-center gap-2 pt-1",children:[(0,a.jsx)("div",{className:"flex flex-wrap gap-1",children:r.map(e=>(0,a.jsx)(u,{tag:e.name,className:"!py-3 bg-transparent"},e.id))}),(0,a.jsx)(m,{post:t})]})]})})]})})})})},p=e=>{let{posts:t}=e;return(0,a.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,a.jsx)(h,{post:e},e.id))})},x=r(22003);let f={repo:"".concat(x.Z.owner,"/").concat(x.Z.repo),repoId:"".concat(x.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var g=r(99861),y=()=>(0,a.jsx)("div",{className:"my-8",children:(0,a.jsx)(g.Z,{...f,theme:"transparent_dark"})})},99684:function(e,t,r){"use strict";var a=r(67294);t.Z=function(e,t){let[r,n]=(0,a.useState)(e);return(0,a.useEffect)(()=>{let r=setTimeout(()=>n(e),t||500);return()=>{clearTimeout(r)}},[e,t]),r}},66629:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return h},default:function(){return p}});var a=r(85893),n=r(1096),s=r(11459),i=r(75819),l=r(11163),o=r(67294),c=r(99684);let d=e=>{var t,r;let{posts:a,searchTerm:n}=e,s=(0,l.useRouter)(),d=(0,c.Z)(n,300),u=(0,o.useMemo)(()=>Array.from(new Set([i.t.LABELS.ALL,...a.map(e=>e.labels.map(e=>e.name)).flat().filter(e=>e!==i.t.LABELS.DOC).sort()])),[]),m=null!==(r=null===(t=s.query)||void 0===t?void 0:t.tag)&&void 0!==r?r:i.t.LABELS.ALL,h=async e=>await s.push({pathname:s.pathname,query:{tag:e}}),p=(0,o.useMemo)(()=>a.filter(e=>{let t=n.toLowerCase(),r=e.title.toLowerCase(),a=e.body.toLowerCase(),s=r.includes(t)||a.includes(t);return m&&m!==i.t.LABELS.ALL?e.labels.some(e=>e.name.toLowerCase()===(null==m?void 0:m.toLowerCase()))&&s:s}),[d,m]);return{filteredPosts:p,tags:u,selectedTag:m,onTagSelect:h}};var u=r(2962),m=r(63750),h=!0,p=e=>{let{posts:t}=e,[r,i]=(0,o.useState)(""),{filteredPosts:l,selectedTag:c,tags:h,onTagSelect:p}=d({posts:t,searchTerm:r});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(u.PB,{title:"Blog",description:"Pasquale Favella Blog"}),(0,a.jsxs)("main",{children:[(0,a.jsxs)("label",{className:"join w-full",children:[(0,a.jsx)("select",{className:"select select-bordered focus:outline-none focus:border-primary max-w-xs join-item",id:"select-tag",value:c,onChange:e=>p(e.target.value),children:h.map(e=>(0,a.jsx)("option",{value:e,children:e},e))}),(0,a.jsx)("input",{type:"text",id:"search-article",placeholder:"Search articles","aria-label":"Search articles",className:"input input-bordered w-full focus:outline-none focus:border-primary join-item",value:r,onChange:e=>i(e.target.value)})]}),l.length?(0,a.jsx)(s.ZP,{posts:l}):(0,a.jsx)(n.Z,{Icon:m.yls,body:"No post found"})]})]})}},62987:function(e,t,r){"use strict";e.exports={content:["./pages/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],theme:{extend:{minHeight:{layout:"92vh"},typography:{DEFAULT:{css:{pre:{"background-color":"#282c34"}}}}}},plugins:[r(43507),r(54863),r(64221)],daisyui:{themes:[{dark:{...r(93371)["[data-theme=dark]"],primary:"#5abf4e",secondary:"#1FD65F",accent:"#D99330",neutral:"#110E0E","base-100":"#171212","base-300":"#1E1E1E","primary-content":"rgb(166, 173, 186,0.1)"},light:{...r(93371)["[data-theme=light]"],primary:"#269926",warning:"#f2920a","primary-content":"whitesmoke"}}]}}},68723:function(e,t,r){"use strict";var a=r(22003),n=r(29557),s=r(74201),i=r(38770),l=r(35077);t.Z={formatDateEN:e=>{let t=(0,s.Z)(new Date(e),"MMMM d, yyyy",{locale:l.Z});return t},calculateAge:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,t=(0,i.Z)(a.Z.dob,"dd/MM/yyyy",e),r=(0,n.Z)(e,t);return r}}},3222:function(e,t,r){"use strict";r.d(t,{Y2:function(){return i},hd:function(){return h},cQ:function(){return s},ZP:function(){return a.Z}});var a=r(68723);let n=async e=>new Promise((t,r)=>{let a=new FileReader;a.readAsDataURL(e),a.onload=function(e){var r;return t(null===(r=e.target)||void 0===r?void 0:r.result)},a.onerror=e=>r(e)});var s={uid:()=>crypto.getRandomValues(new Uint32Array(1)).toString(),returnBase64FromFile:n,extractWords:(e,t)=>{let r=e.trim().split(/\s+/),a=r.slice(0,t).join(" ");return a},extractFirstPhrase:e=>{let t=e.indexOf("."),r=-1!==t?e.substring(0,t):e,a=r.trim();return a}},i={initializeGameState:e=>({word:e[Math.floor(Math.random()*e.length)],guesses:Array(6).fill(""),currentGuess:0})},l=r(86926),o=r.n(l),c=r(62987),d=r.n(c);let u=()=>o()(d()),m=u().daisyui;var h={tailwindConfigs:u,getDaisyUiPalette:e=>m.themes[0][e?"dark":"light"]}},22868:function(){},14777:function(){},99830:function(){},70209:function(){}},function(e){e.O(0,[556,769,861,774,888,179],function(){return e(e.s=67801)}),_N_E=e.O()}]);