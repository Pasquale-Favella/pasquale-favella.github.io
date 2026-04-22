(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,32872,e=>{"use strict";var t=e.i(91398),r=e.i(91788);let n={damping:.7,stiffness:.05,mass:1.25},o=1e3/60,a=!1;function s(e,t){let n=(0,r.useCallback)(t=>(n.current=t,e(t)),t);return n}globalThis.document?.addEventListener("mousedown",()=>{a=!0}),globalThis.document?.addEventListener("mouseup",()=>{a=!1}),globalThis.document?.addEventListener("click",()=>{a=!1});let i=new Map;function l(...e){let t={...n},r=!1;for(let n of e){if("instant"===n){r=!0;continue}"object"==typeof n&&(r=!1,t.damping=n.damping??t.damping,t.stiffness=n.stiffness??t.stiffness,t.mass=n.mass??t.mass)}let o=JSON.stringify(t);return i.has(o)||i.set(o,Object.freeze(t)),r?"instant":i.get(o)}let c=(0,r.createContext)(null),u="u">typeof window?r.useLayoutEffect:r.useEffect;function d({instance:e,children:n,resize:i,initial:m,mass:p,damping:f,stiffness:g,targetScrollTop:h,contextRef:v,...b}){let T=(0,r.useRef)(null),x=((e={})=>{let[t,n]=(0,r.useState)(!1),[i,c]=(0,r.useState)(!1!==e.initial),[u,d]=(0,r.useState)(!1),m=(0,r.useRef)(null);m.current=e;let p=(0,r.useCallback)(()=>{if(!a)return!1;let e=window.getSelection();if(!e||!e.rangeCount)return!1;let t=e.getRangeAt(0);return t.commonAncestorContainer.contains(w.current)||w.current?.contains(t.commonAncestorContainer)},[]),f=(0,r.useCallback)(e=>{h.isAtBottom=e,c(e)},[]),g=(0,r.useCallback)(e=>{h.escapedFromLock=e,n(e)},[]),h=(0,r.useMemo)(()=>{let r;return{escapedFromLock:t,isAtBottom:i,resizeDifference:0,accumulated:0,velocity:0,listeners:new Set,get scrollTop(){return w.current?.scrollTop??0},set scrollTop(scrollTop){w.current&&(w.current.scrollTop=scrollTop,h.ignoreScrollToTop=w.current.scrollTop)},get targetScrollTop(){if(!w.current||!y.current)return 0;return w.current.scrollHeight-1-w.current.clientHeight},get calculatedTargetScrollTop(){if(!w.current||!y.current)return 0;let{targetScrollTop:t}=this;if(!e.targetScrollTop)return t;if(r?.targetScrollTop===t)return r.calculatedScrollTop;let n=Math.max(Math.min(e.targetScrollTop(t,{scrollElement:w.current,contentElement:y.current}),t),0);return r={targetScrollTop:t,calculatedScrollTop:n},requestAnimationFrame(()=>{r=void 0}),n},get scrollDifference(){return this.calculatedTargetScrollTop-this.scrollTop},get isNearBottom(){return this.scrollDifference<=70}}},[]),v=(0,r.useCallback)((e={})=>{let t;"string"==typeof e&&(e={animation:e}),e.preserveScrollPosition||f(!0);let r=Date.now()+(Number(e.wait)||0),n=l(m.current,e.animation),{ignoreEscapes:a=!1}=e,s=h.calculatedTargetScrollTop;e.duration instanceof Promise?e.duration.finally(()=>{t=Date.now()}):t=r+(e.duration??0);let i=async()=>{let e=new Promise(requestAnimationFrame).then(()=>{if(!h.isAtBottom)return h.animation=void 0,!1;let{scrollTop:c}=h,u=performance.now(),d=(u-(h.lastTick??u))/o;if(h.animation||(h.animation={behavior:n,promise:e,ignoreEscapes:a}),h.animation.behavior===n&&(h.lastTick=u),p()||r>Date.now())return i();if(c<Math.min(s,h.calculatedTargetScrollTop)){if(h.animation?.behavior===n){if("instant"===n)return h.scrollTop=h.calculatedTargetScrollTop,i();h.velocity=(n.damping*h.velocity+n.stiffness*h.scrollDifference)/n.mass,h.accumulated+=h.velocity*d,h.scrollTop+=h.accumulated,h.scrollTop!==c&&(h.accumulated=0)}return i()}return t>Date.now()?(s=h.calculatedTargetScrollTop,i()):(h.animation=void 0,h.scrollTop<h.calculatedTargetScrollTop)?v({animation:l(m.current,m.current.resize),ignoreEscapes:a,duration:Math.max(0,t-Date.now())||void 0}):h.isAtBottom});return e.then(e=>(requestAnimationFrame(()=>{h.animation||(h.lastTick=void 0,h.velocity=0)}),e))};return(!0!==e.wait&&(h.animation=void 0),h.animation?.behavior===n)?h.animation.promise:i()},[f,p,h]),b=(0,r.useCallback)(()=>{g(!0),f(!1)},[g,f]),T=(0,r.useCallback)(({target:e})=>{if(e!==w.current)return;let{scrollTop:t,ignoreScrollToTop:r}=h,{lastScrollTop:n=t}=h;h.lastScrollTop=t,h.ignoreScrollToTop=void 0,r&&r>t&&(n=r),d(h.isNearBottom),setTimeout(()=>{if(h.resizeDifference||t===r)return;if(p()){g(!0),f(!1);return}let e=t>n,o=t<n;if(h.animation?.ignoreEscapes){h.scrollTop=n;return}o&&(g(!0),f(!1)),e&&g(!1),!h.escapedFromLock&&h.isNearBottom&&f(!0)},1)},[g,f,p,h]),x=(0,r.useCallback)(({target:e,deltaY:t})=>{let r=e;for(;!["scroll","auto"].includes(getComputedStyle(r).overflow);){if(!r.parentElement)return;r=r.parentElement}r===w.current&&t<0&&w.current.scrollHeight>w.current.clientHeight&&!h.animation?.ignoreEscapes&&(g(!0),f(!1))},[g,f,h]),w=s(e=>{w.current?.removeEventListener("scroll",T),w.current?.removeEventListener("wheel",x),e?.addEventListener("scroll",T,{passive:!0}),e?.addEventListener("wheel",x,{passive:!0})},[]),y=s(e=>{let t;h.resizeObserver?.disconnect(),e&&(h.resizeObserver=new ResizeObserver(([e])=>{let{height:r}=e.contentRect,n=r-(t??r);if(h.resizeDifference=n,h.scrollTop>h.targetScrollTop&&(h.scrollTop=h.targetScrollTop),d(h.isNearBottom),n>=0){let e=l(m.current,t?m.current.resize:m.current.initial);v({animation:e,wait:!0,preserveScrollPosition:!0,duration:"instant"===e?void 0:350})}else h.isNearBottom&&(g(!1),f(!0));t=r,requestAnimationFrame(()=>{setTimeout(()=>{h.resizeDifference===n&&(h.resizeDifference=0)},1)})}),h.resizeObserver?.observe(e))},[]);return{contentRef:y,scrollRef:w,scrollToBottom:v,stopScroll:b,isAtBottom:i||u,isNearBottom:u,escapedFromLock:t,state:h}})({mass:p,damping:f,stiffness:g,resize:i,initial:m,targetScrollTop:r.useCallback((e,t)=>{let r=k?.targetScrollTop??h;return r?.(e,t)??e},[h])}),{scrollRef:w,contentRef:y,scrollToBottom:N,stopScroll:P,isAtBottom:E,escapedFromLock:S,state:C}=e??x,k=(0,r.useMemo)(()=>({scrollToBottom:N,stopScroll:P,scrollRef:w,isAtBottom:E,escapedFromLock:S,contentRef:y,state:C,get targetScrollTop(){return T.current},set targetScrollTop(targetScrollTop){T.current=targetScrollTop}}),[N,E,y,w,P,S,C]);return(0,r.useImperativeHandle)(v,()=>k,[k]),u(()=>{w.current&&"visible"===getComputedStyle(w.current).overflow&&(w.current.style.overflow="auto")},[]),(0,t.jsx)(c.Provider,{value:k,children:(0,t.jsx)("div",{...b,children:"function"==typeof n?n(k):n})})}function m(){let e=(0,r.useContext)(c);if(!e)throw Error("use-stick-to-bottom component context must be used within a StickToBottom component");return e}(d||(d={})).Content=function({children:e,...r}){let n=m();return(0,t.jsx)("div",{ref:n.scrollRef,style:{height:"100%",width:"100%"},children:(0,t.jsx)("div",{...r,ref:n.contentRef,children:"function"==typeof e?e(n):e})})},e.s(["StickToBottom",0,d,"useStickToBottomContext",0,m],32872)},93953,e=>{"use strict";var t=e.i(91788),r=e.i(30943),n=e.i(57006),o=e.i(76833);let a=e=>{let{present:a,children:i}=e,l=function(e){var n,a;let[i,l]=(0,t.useState)(),c=(0,t.useRef)({}),u=(0,t.useRef)(e),d=(0,t.useRef)("none"),[m,p]=(n=e?"mounted":"unmounted",a={mounted:{UNMOUNT:"unmounted",ANIMATION_OUT:"unmountSuspended"},unmountSuspended:{MOUNT:"mounted",ANIMATION_END:"unmounted"},unmounted:{MOUNT:"mounted"}},(0,t.useReducer)((e,t)=>{let r=a[e][t];return null!=r?r:e},n));return(0,t.useEffect)(()=>{let e=s(c.current);d.current="mounted"===m?e:"none"},[m]),(0,o.useLayoutEffect)(()=>{let t=c.current,r=u.current;if(r!==e){let n=d.current,o=s(t);e?p("MOUNT"):"none"===o||(null==t?void 0:t.display)==="none"?p("UNMOUNT"):r&&n!==o?p("ANIMATION_OUT"):p("UNMOUNT"),u.current=e}},[e,p]),(0,o.useLayoutEffect)(()=>{if(i){let e=e=>{let t=s(c.current).includes(e.animationName);e.target===i&&t&&(0,r.flushSync)(()=>p("ANIMATION_END"))},t=e=>{e.target===i&&(d.current=s(c.current))};return i.addEventListener("animationstart",t),i.addEventListener("animationcancel",e),i.addEventListener("animationend",e),()=>{i.removeEventListener("animationstart",t),i.removeEventListener("animationcancel",e),i.removeEventListener("animationend",e)}}p("ANIMATION_END")},[i,p]),{isPresent:["mounted","unmountSuspended"].includes(m),ref:(0,t.useCallback)(e=>{e&&(c.current=getComputedStyle(e)),l(e)},[])}}(a),c="function"==typeof i?i({present:l.isPresent}):t.Children.only(i),u=(0,n.useComposedRefs)(l.ref,c.ref);return"function"==typeof i||l.isPresent?(0,t.cloneElement)(c,{ref:u}):null};function s(e){return(null==e?void 0:e.animationName)||"none"}a.displayName="Presence",e.s(["Presence",0,a])},97794,e=>{"use strict";var t=e.i(91398),r=e.i(91788),n=e.i(75907),o=e.i(71185),a=e.i(57006),s=e.i(79293),i=e.i(64899),l=e.i(8525),c=e.i(92893),u=e.i(64592),d=e.i(46359),m=e.i(37767),p=e.i(93953),f=e.i(74534),g=e.i(17549),h=e.i(55037),v=e.i(69131),b=e.i(65823);let T="Popover",[x,w]=(0,s.createContextScope)(T,[d.createPopperScope]),y=(0,d.createPopperScope)(),[N,P]=x(T),E=(0,r.forwardRef)((e,t)=>{let{__scopePopover:s,...i}=e,l=P("PopoverTrigger",s),c=y(s),u=(0,a.useComposedRefs)(t,l.triggerRef),m=(0,r.createElement)(f.Primitive.button,(0,n.default)({type:"button","aria-haspopup":"dialog","aria-expanded":l.open,"aria-controls":l.contentId,"data-state":I(l.open)},i,{ref:u,onClick:(0,o.composeEventHandlers)(e.onClick,l.onOpenToggle)}));return l.hasCustomAnchor?m:(0,r.createElement)(d.Anchor,(0,n.default)({asChild:!0},c),m)}),S="PopoverPortal",[C,k]=x(S,{forceMount:void 0}),j="PopoverContent",R=(0,r.forwardRef)((e,t)=>{let o=k(j,e.__scopePopover),{forceMount:a=o.forceMount,...s}=e,i=P(j,e.__scopePopover);return(0,r.createElement)(p.Presence,{present:a||i.open},i.modal?(0,r.createElement)(O,(0,n.default)({},s,{ref:t})):(0,r.createElement)(A,(0,n.default)({},s,{ref:t})))}),O=(0,r.forwardRef)((e,t)=>{let s=P(j,e.__scopePopover),i=(0,r.useRef)(null),l=(0,a.useComposedRefs)(t,i),c=(0,r.useRef)(!1);return(0,r.useEffect)(()=>{let e=i.current;if(e)return(0,v.hideOthers)(e)},[]),(0,r.createElement)(b.RemoveScroll,{as:g.Slot,allowPinchZoom:!0},(0,r.createElement)(M,(0,n.default)({},e,{ref:l,trapFocus:s.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,o.composeEventHandlers)(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),c.current||null==(t=s.triggerRef.current)||t.focus()}),onPointerDownOutside:(0,o.composeEventHandlers)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,r=0===t.button&&!0===t.ctrlKey;c.current=2===t.button||r},{checkForDefaultPrevented:!1}),onFocusOutside:(0,o.composeEventHandlers)(e.onFocusOutside,e=>e.preventDefault(),{checkForDefaultPrevented:!1})})))}),A=(0,r.forwardRef)((e,t)=>{let o=P(j,e.__scopePopover),a=(0,r.useRef)(!1),s=(0,r.useRef)(!1);return(0,r.createElement)(M,(0,n.default)({},e,{ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var r,n;null==(r=e.onCloseAutoFocus)||r.call(e,t),t.defaultPrevented||(a.current||null==(n=o.triggerRef.current)||n.focus(),t.preventDefault()),a.current=!1,s.current=!1},onInteractOutside:t=>{var r,n;null==(r=e.onInteractOutside)||r.call(e,t),t.defaultPrevented||(a.current=!0,"pointerdown"===t.detail.originalEvent.type&&(s.current=!0));let i=t.target;(null==(n=o.triggerRef.current)?void 0:n.contains(i))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&s.current&&t.preventDefault()}}))}),M=(0,r.forwardRef)((e,t)=>{let{__scopePopover:o,trapFocus:a,onOpenAutoFocus:s,onCloseAutoFocus:u,disableOutsidePointerEvents:m,onEscapeKeyDown:p,onPointerDownOutside:f,onFocusOutside:g,onInteractOutside:h,...v}=e,b=P(j,o),T=y(o);return(0,l.useFocusGuards)(),(0,r.createElement)(c.FocusScope,{asChild:!0,loop:!0,trapped:a,onMountAutoFocus:s,onUnmountAutoFocus:u},(0,r.createElement)(i.DismissableLayer,{asChild:!0,disableOutsidePointerEvents:m,onInteractOutside:h,onEscapeKeyDown:p,onPointerDownOutside:f,onFocusOutside:g,onDismiss:()=>b.onOpenChange(!1)},(0,r.createElement)(d.Content,(0,n.default)({"data-state":I(b.open),role:"dialog",id:b.contentId},T,v,{ref:t,style:{...v.style,"--radix-popover-content-transform-origin":"var(--radix-popper-transform-origin)","--radix-popover-content-available-width":"var(--radix-popper-available-width)","--radix-popover-content-available-height":"var(--radix-popper-available-height)","--radix-popover-trigger-width":"var(--radix-popper-anchor-width)","--radix-popover-trigger-height":"var(--radix-popper-anchor-height)"}}))))});function I(e){return e?"open":"closed"}let D=e=>{let{__scopePopover:t,forceMount:n,children:o,container:a}=e,s=P(S,t);return(0,r.createElement)(C,{scope:t,forceMount:n},(0,r.createElement)(p.Presence,{present:n||s.open},(0,r.createElement)(m.Portal,{asChild:!0,container:a},o)))};e.i(91505);var F=e.i(25963);let z=r.forwardRef(({className:e,align:r="center",sideOffset:n=4,...o},a)=>(0,t.jsx)(D,{children:(0,t.jsx)(R,{ref:a,align:r,sideOffset:n,className:(0,F.cn)("z-50 w-72 rounded-md border bg-base-100 p-4 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",e),...o})}));z.displayName=R.displayName,e.s(["Popover",0,e=>{let{__scopePopover:t,children:n,open:o,defaultOpen:a,onOpenChange:s,modal:i=!1}=e,l=y(t),c=(0,r.useRef)(null),[m,p]=(0,r.useState)(!1),[f=!1,g]=(0,h.useControllableState)({prop:o,defaultProp:a,onChange:s});return(0,r.createElement)(d.Root,l,(0,r.createElement)(N,{scope:t,contentId:(0,u.useId)(),triggerRef:c,open:f,onOpenChange:g,onOpenToggle:(0,r.useCallback)(()=>g(e=>!e),[g]),hasCustomAnchor:m,onCustomAnchorAdd:(0,r.useCallback)(()=>p(!0),[]),onCustomAnchorRemove:(0,r.useCallback)(()=>p(!1),[]),modal:i},n))},"PopoverContent",0,z,"PopoverTrigger",0,E],97794)},25985,e=>{e.q("/_next/static/media/worker.0g06typtqopfz.ts")},19803,e=>{e.v(function(t,r){return e.b(t,"static/chunks/turbopack-worker-0sjn--fhq~1cg.js",["static/chunks/0g3ii9qqb32u-.js","static/chunks/0l~7_.54j9zck.js","static/chunks/turbopack-05p6ylkx69l~e.js"],r)})},85901,e=>{"use strict";var t=e.i(91398),r=e.i(52644),n=e.i(61460),o=e.i(36160),a=e.i(29433),s=e.i(14497),i=e.i(58021),l=e.i(15363),c=e.i(40733);e.i(91505);var u=e.i(25963),d=e.i(91788),m=e.i(12555),p=e.i(19237),f=e.i(57454);class g{model;systemPrompt;constructor(e,t){this.model=e,this.systemPrompt=t.systemPrompt}async sendMessages(e){let{messages:t,abortSignal:r}=e,n=await (0,f.convertToModelMessages)(t),o=this.model;return(0,f.createUIMessageStream)({execute:async({writer:e})=>{let t;"available"!==await o.availability()&&await o.createSessionWithProgress(r=>{let n=Math.round(100*r);if(r>=1){t&&e.write({type:"data-modelDownloadProgress",id:t,data:{status:"complete",progress:100,message:"Model ready!"}});return}t||(t=`download-${Date.now()}`),e.write({type:"data-modelDownloadProgress",id:t,data:{status:"downloading",progress:n,message:`Downloading AI model... ${n}%`},transient:!t})});let a=(0,f.streamText)({model:(0,f.wrapLanguageModel)({model:o,middleware:(0,f.extractReasoningMiddleware)({tagName:"think"})}),system:this.systemPrompt,messages:n,abortSignal:r,onChunk:r=>{"text-delta"===r.chunk.type&&t&&(e.write({type:"data-modelDownloadProgress",id:t,data:{status:"complete",progress:100,message:""}}),t=void 0)}});e.merge(a.toUIMessageStream({sendStart:!1}))}})}async reconnectToStream(e){return null}}var h=e.i(91422);let v=`
You are Pakybot, the AI assistant on Pasquale Favella’s portfolio.

Your goal is to:
- Clearly explain who Pasquale is and what he does
- Highlight his real-world impact, not just skills
- Help recruiters, managers, and collaborators quickly see his value
- Act as a smart guide through his work, mindset, and projects

COMMUNICATION STYLE:
- Concise, direct, and conversational
- Prefer short paragraphs or bullet points
- Avoid generic or vague statements
- Be confident but not exaggerated

STRICT RULES:
- Do NOT invent information
- If something is unknown, say it clearly
- Prioritize clarity over completeness
- Always optimize for usefulness

---

CORE PROFILE:

Pasquale Favella is a senior software engineer from Naples (1991) with a background in chemical engineering.

He combines:
- strong system thinking (engineering mindset)
- product intuition (UX and frontend focus)
- leadership and mentoring ability

---

REAL STRENGTH (IMPORTANT):

Pasquale is not just a developer.

He acts as:
- Software Architect
- Team Leader
- Project Manager
- Mentor

He often takes ownership beyond his role and turns unclear situations into structured, working solutions.

---

EXPERIENCE:

- ${h.default.get_years_of_experience()}+ years in software development
- Domains: banking, energy, maritime logistics, public administration
- Built:
  - microservices architectures
  - big data pipelines (Kafka, Flink)
  - frontend platforms (Angular, React, Next.js)

Worked on complex systems for large organizations, including banking environments.

---

TECH STACK:

Backend:
- Java, Spring Boot

Frontend:
- Angular, React, Next.js

Data & Systems:
- MongoDB, Oracle, PostgresSQL
- Apache Kafka, Apache Flink

---

IMPACT (VERY IMPORTANT):

Pasquale consistently:
- simplifies complex systems
- improves team performance
- mentors developers (junior and senior)
- transforms ideas into real products

Examples:
- Reduced team workload dramatically through automation tools
- Trained teams from zero knowledge to delivering real applications
- Built internal tools that became product candidates
- Bridges gap between technical and non-technical people

---

MENTORING & LEADERSHIP:

- Strong focus on active listening
- Helps people understand their own value
- Known for improving team confidence and cohesion
- Has mentored multiple developers who continued to seek his guidance

---

PRODUCT & INNOVATION MINDSET:

Pasquale builds with a strong focus on:
- user experience (UX)
- simplicity and clarity
- practical impact

He experiments with:
- AI-driven interfaces
- local-first applications
- tools that reduce friction between design and development

---

CONTACT INFOS:
- GitHub: ${h.default.git_url}
- LinkedIn: ${h.default.linkedin_url}
- Email: ${h.default.contact_mail}

---

HOW TO ANSWER:

- If asked “why hire Pasquale”:
  Give a structured, impact-driven answer (not generic traits)

- If asked technical questions:
  Answer like a senior engineer with practical reasoning

- If asked about projects:
  Focus on *why they matter*, not just what they are

- If the question is unrelated:
  Briefly answer, then reconnect to Pasquale when possible

---

TONE ADAPTATION:

- Recruiter → emphasize impact, ownership, reliability
- Developer → go deeper on architecture and decisions
- Casual user → keep it simple and engaging

---

IMPORTANT:

Your purpose is not just to inform.

Your purpose is to make people understand why Pasquale is valuable.
`;var b=e.i(97794),T=e.i(29698),x=e.i(10941),w=e.i(55613),y=e.i(66874);let N=c.z.object({message:c.z.string().trim().min(1)});e.s([],58994),e.i(58994),e.s(["default",0,()=>{let{messages:c,status:f,isBotLoadingResponse:h,sendMessage:P,supportsTransformerJs:E,error:S,regenerate:C}=function(){let t=(0,d.useMemo)(()=>(0,p.doesBrowserSupportTransformersJS)(),[]),r=(0,d.useMemo)(()=>t?new g((0,p.transformersJS)("onnx-community/granite-4.0-350m-ONNX-web",{device:"webgpu",dtype:"fp16",worker:e.r(19803)(Worker,{type:"module"})}),{systemPrompt:v}):null,[t]),{error:n,status:o,messages:a,setMessages:s,sendMessage:i,stop:l,regenerate:c}=(0,m.useChat)({transport:r,onError(e){console.error(e.message)},experimental_throttle:50,id:"chatbot-pakybot"});return{supportsTransformerJs:t,error:n,status:o,messages:a,setMessages:s,isBotLoadingResponse:"submitted"===o||"streaming"===o,sendMessage:e=>{i({text:e})},stop:l,regenerate:c}}(),{register:k,handleSubmit:j,reset:R,formState:{isValid:O}}=(0,i.useForm)({resolver:(0,l.zodResolver)(N),defaultValues:{message:""}}),A=h||!!S,M=j(({message:e})=>{R(),P(e)});return E?(0,t.jsxs)(b.Popover,{children:[(0,t.jsx)(b.PopoverTrigger,{asChild:!0,className:"fixed bottom-4 right-1 sm:bottom-10 sm:right-6 z-50",children:(0,t.jsx)("div",{className:"tooltip tooltip-left before:text-xs before:content-[attr(data-tip)]","data-tip":"ask a question",children:(0,t.jsx)("button",{className:"btn btn-ghost btn-circle ",children:(0,t.jsx)(r.BsFillChatQuoteFill,{size:40})})})}),(0,t.jsx)(b.PopoverContent,{className:"w-96",children:(0,t.jsxs)("div",{className:"grid gap-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("h4",{className:"font-medium leading-none",children:"Pakybot"}),(0,t.jsx)("p",{className:"text-sm text-base-content",children:"Ask some question about me"})]}),(0,t.jsxs)(y.Conversation,{className:"h-[200px] no-scrollbar",children:[(0,t.jsxs)(y.ConversationContent,{children:[0===c.length&&(0,t.jsxs)("div",{className:(0,u.cn)("chat chat-start"),children:[(0,t.jsx)("div",{className:"chat-image avatar",children:(0,t.jsx)(o.RiRobot2Line,{size:30})}),(0,t.jsx)("div",{className:"chat-bubble bg-base-300 text-base-content",children:"Ask me something!"})]}),c.map(e=>{let r="assistant"===e.role||"system"===e.role,n=r?o.RiRobot2Line:o.RiUser3Fill;return(0,t.jsxs)("div",{className:(0,u.cn)("chat",r?"chat-start":"chat-end"),children:[(0,t.jsx)("div",{className:"chat-image avatar",children:(0,t.jsx)(n,{size:30})}),(0,t.jsxs)("div",{className:"chat-bubble bg-base-300 text-base-content",children:[e.parts.filter(e=>"data-modelDownloadProgress"===e.type).map((e,r)=>e.data.message&&"ready"!==f?(0,t.jsxs)("div",{children:[(0,t.jsxs)("div",{className:"flex items-center gap-1 mb-1",children:[(0,t.jsx)(x.Loader,{className:"size-3"}),(0,t.jsx)("span",{className:"text-xs",children:e.data.message})]}),"downloading"===e.data.status&&void 0!==e.data.progress&&(0,t.jsx)(w.Progress,{value:e.data.progress})]},r):null),e.parts.filter(e=>"text"===e.type).map((e,r)=>(0,t.jsx)(T.Response,{responseText:e.text,className:"text-sm "},r)),"user"===e.role&&0===e.parts.filter(e=>"text"===e.type).length&&(0,t.jsx)(t.Fragment,{children:e.content})]})]},e.id)}),"submitted"===f&&(0,t.jsxs)("div",{className:(0,u.cn)("chat chat-start"),children:[(0,t.jsx)("div",{className:"chat-image avatar",children:(0,t.jsx)(o.RiRobot2Line,{size:30})}),(0,t.jsx)("div",{className:"chat-bubble bg-base-300 text-base-content",children:(0,t.jsx)(a.TbWriting,{size:20,className:"animate-bounce"})})]}),S&&(0,t.jsxs)("div",{className:(0,u.cn)("chat chat-start"),children:[(0,t.jsx)("div",{className:"chat-image avatar",children:(0,t.jsx)(o.RiRobot2Line,{size:30})}),(0,t.jsxs)("div",{className:"chat-bubble chat-bubble-error",children:[(0,t.jsx)("p",{className:"text-sm",children:"Something went wrong."}),(0,t.jsxs)("button",{type:"button",className:"btn btn-ghost btn-xs mt-1 gap-1",onClick:()=>C(),children:[(0,t.jsx)(s.MdRefresh,{size:14}),"Retry"]})]})]})]}),(0,t.jsx)(y.ConversationScrollButton,{className:"btn-sm animate-bounce"})]}),(0,t.jsxs)("form",{className:"flex items-center justify-center w-full space-x-2",onSubmit:M,children:[(0,t.jsx)("input",{type:"text",placeholder:"Type your question",autoComplete:"off",className:"input input-bordered w-full max-w-xs",disabled:A,...k("message")}),(0,t.jsx)("button",{className:"btn btn-neutral btn-square",type:"submit",disabled:A||!O,children:(0,t.jsx)(n.IoSendSharp,{})})]})]})})]}):null}],85901)},66897,e=>{e.n(e.i(85901))}]);