(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[492],{41127:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/blog/[slug]",function(){return r(88599)}])},77092:function(e,t,r){"use strict";r.d(t,{H:function(){return f},Z:function(){return x}});var n=r(85893),a=r(67294),s=r(75819),l=r(41664),i=r.n(l),o=r(3818),c=r(53854);let d=e=>{let{label:t}=e;return(0,n.jsxs)(i(),{className:"btn btn-ghost btn-sm text-primary",href:{pathname:"/blog",query:{tag:t.name}},passHref:!0,shallow:!0,children:[(0,n.jsx)(c.Ohp,{}),t.name]})},u=e=>{let{post:t}=e;return(0,n.jsx)(i(),{href:"/blog/".concat(t.number),className:"font-medium leading-6 text-primary hover:text-primary/60 transition duration-200","aria-label":'Read "'.concat(t.title,'"'),children:"Read more →"})};var m=e=>{let{post:t}=e,r=t.labels.filter(e=>e.name.toLowerCase()!==s.t.LABELS.DOC),l=(0,a.useMemo)(()=>{let e=o.cQ.extractWords(t.body,40);return"".concat(e,"...")},[t.body]);return(0,n.jsx)("div",{className:"group flex bg-transparent bg-opacity-20 px-2 transition duration-300 hover:scale-105 hover:rounded-md hover:bg-base-300",children:(0,n.jsx)("li",{className:"py-2 w-full",children:(0,n.jsx)("article",{children:(0,n.jsxs)("div",{className:" animate-tilt space-y-2 bg-transparent bg-opacity-20 p-2 transition duration-200 hover:rounded-md xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0",children:[(0,n.jsxs)("dl",{children:[(0,n.jsx)("dt",{className:"sr-only",children:"Published on"}),(0,n.jsx)("dd",{className:"text-sm font-normal leading-6 text-gray-500 dark:text-gray-400",children:(0,n.jsx)("time",{dateTime:t.created_at,children:o.ZP.formatDateEN(t.created_at)})})]}),(0,n.jsx)("div",{className:"space-y-5 xl:col-span-4",children:(0,n.jsxs)("div",{className:"space-y-1",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("h2",{className:"text-2xl font-bold leading-8 tracking-tight",children:(0,n.jsx)(i(),{href:"/blog/".concat(t.number),className:" transition duration-500 ease-in-out hover:text-primary",children:t.title})}),(0,n.jsx)("small",{className:"line-clamp-3",children:l})]}),(0,n.jsxs)("div",{className:"flex flex-col justify-between items-start md:flex-row md:items-center gap-2",children:[(0,n.jsx)("div",{className:"flex flex-wrap",children:r.map(e=>(0,n.jsx)(d,{label:e},e.id))}),(0,n.jsx)(u,{post:t})]})]})})]})})})})},x=e=>{let{posts:t}=e;return(0,n.jsx)("ul",{className:"border border-x-0 mt-5",children:t.map(e=>(0,n.jsx)(m,{post:e},e.id))})},h=r(22003);let g={repo:"".concat(h.Z.owner,"/").concat(h.Z.repo),repoId:"".concat(h.Z.repo_node_id),category:"Blog",categoryId:"DIC_kwDOIwHgl84CTwhC",mapping:"title",reactionsEnabled:"1",emitMetadata:"1",inputPosition:"bottom",lang:"en",loading:"eager"};var p=r(99861),f=()=>(0,n.jsx)("div",{className:"my-8",children:(0,n.jsx)(p.Z,{...g,theme:"transparent_dark"})})},88599:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return p}});var n=r(85893),a=r(67294),s=r(2962),l=r(9980),i=r.n(l),o=r(34138),c=r.n(o),d=r(13052),u=r.n(d),m=r(77092),x=r(41664),h=r.n(x),g=r(5434),p=!0;t.default=e=>{let{content:t,title:r}=e,l=(0,a.useMemo)(()=>i()().use(c()).use(u(),{buttonClass:"btn btn-ghost btn-circle btn-sm",iconClass:"fa fa-solid fa-clone text-neutral-content"}).render(t),[t]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.PB,{title:r,description:"Pasquale Favella Blog - ".concat(r)}),(0,n.jsxs)(h(),{href:"/blog",className:"group fixed top-24 hidden items-center justify-center text-sm font-medium xl:inline-flex",children:[(0,n.jsx)(g.sG8,{className:"h-4 w-4 transition duration-200 group-hover:translate-x-1"}),(0,n.jsx)("span",{children:"See all Posts"})]}),(0,n.jsx)("div",{className:"prose md:prose-lg lg:prose-xl mx-auto  mb-3 lg:mb-5",children:(0,n.jsx)("h1",{className:"text-4xl font-extrabold leading-tight md:text-5xl",children:r})}),(0,n.jsx)("article",{className:"prose md:prose-lg lg:prose-xl mx-auto",dangerouslySetInnerHTML:{__html:l}}),(0,n.jsx)(m.H,{})]})}},68723:function(e,t,r){"use strict";var n=r(22003),a=r(29557),s=r(74201),l=r(84037),i=r(35077);t.Z={formatDateEN:e=>{let t=(0,s.Z)(new Date(e),"MMMM d, yyyy",{locale:i.Z});return t},calculateAge:function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,t=(0,l.Z)(n.Z.dob,"dd/MM/yyyy",e),r=(0,a.Z)(e,t);return r}}},3818:function(e,t,r){"use strict";r.d(t,{Y2:function(){return l},cQ:function(){return s},ZP:function(){return n.Z}});var n=r(68723);let a=async e=>new Promise((t,r)=>{let n=new FileReader;n.readAsDataURL(e),n.onload=function(e){var r;return t(null===(r=e.target)||void 0===r?void 0:r.result)},n.onerror=e=>r(e)});var s={uid:()=>crypto.getRandomValues(new Uint32Array(1)).toString(),returnBase64FromFile:a,extractWords:(e,t)=>{let r=e.trim().split(/\s+/),n=r.slice(0,t).join(" ");return n}},l={initializeGameState:e=>({word:e[Math.floor(Math.random()*e.length)],guesses:Array(6).fill(""),currentGuess:0})}}},function(e){e.O(0,[556,662,376,861,263,774,888,179],function(){return e(e.s=41127)}),_N_E=e.O()}]);