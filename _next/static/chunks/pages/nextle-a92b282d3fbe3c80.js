(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[990,501],{77508:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/nextle",function(){return r(16261)}])},16261:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return G},default:function(){return O}});var s=r(85893),a=r(67294),i=r(48583),n=r(86501),o=r(15103),l=r(45929);let d=(0,o.cn)([]),c=(0,o.cn)(e=>new Set(e(d))),u=(0,o.cn)({word:"",guesses:[],currentGuess:0}),f=(0,l.R)(u,e=>e.prop("word")),p=(0,l.R)(u,e=>e.prop("guesses")),m=(0,l.R)(u,e=>e.prop("currentGuess")),h=(0,o.cn)(e=>{let t=e(m),r=e(p),s=e(f);return r[t-1]===s}),g=(0,o.cn)(e=>{let t=e(h),r=e(m);return!t&&6===r}),v=(0,o.cn)(e=>{let t=e(m);return e(p)[t]},(e,t,r)=>{let s=e(c),a=e(m),i=e(p),n=e(h),o=e(g);!n&&!o&&("Enter"===r.type&&s.has(i[a])&&t(m,a+1),("Backspace"===r.type||"⟵"===r.type)&&(i[a]=i[a].slice(0,i[a].length-1),t(p,[...i])),"Add"===r.type&&r.value&&i[a].length<5&&(i[a]=i[a]+r.value.toUpperCase(),t(p,[...i])))}),b=(0,o.cn)(e=>{let t=e(c),r=e(v);return(null==r?void 0:r.length)===5&&!t.has(r)});var y=r(55163);function x(){let e=(0,i.Dv)(d),[t,r]=(0,i.KO)(f),[s,o]=(0,i.KO)(p),[l,c]=(0,i.KO)(m),u=(0,i.Dv)(b),x=(0,i.Dv)(h),w=(0,i.Dv)(g),_=(0,i.b9)(v),j=(0,a.useMemo)(()=>new Set(s.slice(0,l).join("").split("")),[s,l]),F=(0,a.useMemo)(()=>new Set(t.split("").filter((e,t)=>s.slice(0,l).map(e=>e[t]).includes(e))),[s,l]),E=(0,a.useMemo)(()=>new Set(t.split("").filter(e=>j.has(e))),[j]);return{word:t,guesses:s,currentGuessNumber:l,hasWon:x,hasLost:w,handleAction:e=>{let{key:t}=e;return"Enter"===t&&u?n.toast.error("Not in word list"):"Enter"===t||"Backspace"===t||"⟵"===t?_({type:t}):t.match(/^[A-z]$/)?_({type:"Add",value:t}):void 0},exactGuesses:F,inexactGuesses:E,allGuesses:j,restart:()=>{let{currentGuess:t,guesses:s,word:a}=y.Y2.initializeGameState(e);r(a),o(s),c(t)}}}var w=r(90512),_=(0,a.memo)(e=>{let{index:t}=e,{word:r,guesses:a,currentGuessNumber:i,allGuesses:n}=x(),o=a[t],l=t<i;return(0,s.jsx)("div",{className:"grid grid-cols-5 gap-1 md:gap-2",children:[,,,,,].fill(0).map((e,t)=>(0,s.jsx)("div",{className:(0,w.Z)("flex w-14 h-14 md:h-16 md:w-16 items-center justify-center rounded border border-base-300 font-bold uppercase",l?o[t]===r[t]?"bg-primary bg-opacity-50":r.includes(o[t])?"bg-warning bg-opacity-50":n.has(o[t])?"bg-base-300":"bg-base-100":"bg-base-100"),children:o[t]},y.cQ.uid()))})}),j=r(25393),F=(0,a.memo)(()=>{let{handleAction:e,exactGuesses:t,inexactGuesses:r,allGuesses:i}=x();return(0,a.useEffect)(()=>(window.addEventListener("keyup",e),()=>{window.removeEventListener("keyup",e)}),[e]),(0,s.jsx)("div",{className:"w-full flex flex-col justify-center items-center mx-1",children:j.b9.map((a,n)=>(0,s.jsx)("div",{className:"flex justify-center w-full gap-px md:gap-1 my-px md:my-1",children:(2===n?["Enter",...a.split(""),"⟵"]:a.split("")).map(a=>(0,s.jsx)("button",{onClick:()=>e({key:a}),className:(0,w.Z)("kbd font-semibold tracking-wider md:tracking-wide h-12 w-12",t.has(a)?"bg-primary bg-opacity-25":r.has(a)?"bg-warning bg-opacity-25":i.has(a)?"bg-base-300":"bg-base-100","Enter"===a&&"min-w-min"),children:a},y.cQ.uid()))},y.cQ.uid()))})}),E=r(19042),N=r(19151),k=r(71054),T=r(39715),A=()=>{let{hasWon:e,restart:t,currentGuessNumber:r}=x(),i=(0,a.useMemo)(()=>{switch(r){case 1:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(k.VjE,{size:30})," You're a true puzzle master"]});case 2:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(k.ma2,{size:30})," You're a true puzzle Dragon"]});case 3:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(T.wUf,{size:30})," You're a true puzzle Unicorn"]});case 4:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(k.G5n,{size:30})," You're a true puzzle Hero"]});case 5:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(k.vwX,{size:30})," You're a true puzzle Beast"]});default:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(N.wr2,{size:30})," Bravo! You've cracked that puzzle with ease"]})}},[r]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("input",{type:"checkbox",className:"modal-toggle",defaultChecked:e}),(0,s.jsx)("div",{className:"modal modal-bottom sm:modal-middle",children:(0,s.jsxs)("div",{className:"modal-box",children:[(0,s.jsx)("h3",{className:"font-bold text-lg",children:"Great!"}),(0,s.jsx)("p",{className:"py-4",children:"Congratulations, you've successfully solved the Nextle!"}),i,(0,s.jsx)("div",{className:"modal-action",children:(0,s.jsxs)("button",{className:"btn btn-ghost gap-2",onClick:t,children:[(0,s.jsx)(E.bKy,{size:24}),(0,s.jsx)("span",{children:"Play again"})]})})]})})]})},P=()=>{let{hasLost:e,restart:t,word:r}=x();return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("input",{type:"checkbox",className:"modal-toggle",defaultChecked:e}),(0,s.jsx)("div",{className:"modal modal-bottom sm:modal-middle",children:(0,s.jsxs)("div",{className:"modal-box",children:[(0,s.jsx)("h3",{className:"font-bold text-lg",children:"Oh No!"}),(0,s.jsxs)("p",{className:"py-4",children:["The Nextle word was ",(0,s.jsx)("b",{children:r})]}),(0,s.jsx)("div",{className:"modal-action",children:(0,s.jsxs)("button",{className:"btn btn-ghost gap-2",onClick:t,children:[(0,s.jsx)(E.bKy,{size:24}),(0,s.jsx)("span",{children:"Play again"})]})})]})})]})},z=()=>{let{guesses:e,hasWon:t,hasLost:r}=x();return(0,s.jsxs)("section",{className:"min-h-[calc(92vh-5rem)] flex flex-col items-center justify-between w-full mx-auto",children:[(0,s.jsx)("div",{className:"flex justify-center items-center w-full my-auto",children:(0,s.jsx)("div",{className:"grid grid-rows-6 gap-1 md:gap-2 box-border p-2",children:e.map((e,t)=>(0,s.jsx)(_,{index:t},t))})}),(0,s.jsx)(F,{}),t&&(0,s.jsx)(A,{}),r&&(0,s.jsx)(P,{})]})};let S=new WeakMap,I=e=>{let t=S.get(e);return t||(t=new WeakSet,S.set(e,t)),t};var L=r(2962),G=!0,O=e=>{let{words:t}=e;return!function(e,t){let r=(0,i.oR)(t),s=I(r);for(let[a,i]of e)(!s.has(a)||(null==t?void 0:t.dangerouslyForceHydrate))&&(s.add(a),r.set(a,i))}([[d,t],[u,y.Y2.initializeGameState(t)]]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(L.PB,{title:"Nextle",description:"Put your word-solving skills to the test with Nextle, a fun and addictive word puzzle game inspired by Wordle. Guess the hidden word in as few attempts as possible by deciphering the clues. Challenge your vocabulary and logic while having a blast. Play Nextle now and see how sharp your word-guessing skills really are!"}),(0,s.jsx)(z,{})]})}},45929:function(e,t,r){"use strict";r.d(t,{R:function(){return J}});var s=r(15103);let a=e=>e,i=e=>({_tag:"Left",value:e}),n=e=>({_tag:"Right",value:e}),o=(e,t,r)=>"Left"===r._tag?e(r.value):t(r.value),l={dimap:(e,t,r)=>s=>t(r(e(s))),first:e=>([t,r])=>[e(t),r],right:e=>t=>"Left"===t._tag?t:n(e(t.value)),wander:e=>t=>t.map(e)},d={empty:()=>void 0,foldMap:(e,t)=>{for(let r=0;r<t.length;r++){let s=e(t[r]);if(void 0!=s)return s}}},c={empty:()=>[],foldMap:(e,t)=>{let r=[];return t.forEach(t=>{r=r.concat(e(t))}),r}},u=e=>({dimap:(e,t,r)=>t=>r(e(t)),first:e=>([t,r])=>e(t),right:t=>r=>"Left"===r._tag?e.empty():t(r.value),wander:t=>r=>e.foldMap(t,r)}),f={Equivalence:{Equivalence:"Equivalence",Iso:"Iso",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Iso:{Equivalence:"Iso",Iso:"Iso",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Lens:{Equivalence:"Lens",Iso:"Lens",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Prism:{Equivalence:"Prism",Iso:"Prism",Lens:"Prism",Prism:"Prism",Traversal:"Traversal",Getter:"AffineFold",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Traversal:{Equivalence:"Traversal",Iso:"Traversal",Lens:"Traversal",Prism:"Traversal",Traversal:"Traversal",Getter:"Fold",AffineFold:"Fold",Fold:"Fold",Setter:"Setter"},Getter:{Equivalence:"Getter",Iso:"Getter",Lens:"Getter",Prism:"AffineFold",Traversal:"Fold",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:void 0},AffineFold:{Equivalence:"AffineFold",Iso:"AffineFold",Lens:"AffineFold",Prism:"AffineFold",Traversal:"Fold",Getter:"AffineFold",AffineFold:"AffineFold",Fold:"Fold",Setter:void 0},Fold:{Equivalence:"Fold",Iso:"Fold",Lens:"Fold",Prism:"Fold",Traversal:"Fold",Getter:"Fold",AffineFold:"Fold",Fold:"Fold",Setter:void 0},Setter:{Equivalence:void 0,Iso:void 0,Lens:void 0,Prism:void 0,Traversal:void 0,Getter:void 0,AffineFold:void 0,Fold:void 0,Setter:void 0}},p=(e,t)=>(t._tag=e,t),m=e=>(e._removable=!0,e);function h(e,t,r){if(2==arguments.length){let r=(r,s)=>e(r,t(r,s));return r._tag=f[e._tag][t._tag],r._removable=t._removable||!1,r}{let s=f[e._tag][t._tag],a=(s,a)=>e(s,t(s,r(s,a)));return a._tag=f[s][r._tag],a._removable=r._removable||!1,a}}let g=p("Equivalence",(e,t)=>t),v=(e,t)=>p("Iso",(r,s)=>r.dimap(e,t,s)),b=(e,t)=>p("Lens",(r,s)=>r.dimap(t=>[e(t),t],t,r.first(s))),y=(e,t)=>p("Prism",(r,s)=>r.dimap(e,e=>o(a,t,e),r.right(s))),x=p("Traversal",(e,t)=>e.dimap(a,a,e.wander(t))),w=e=>p("Getter",(t,r)=>t.dimap(e,a,r)),_=(e,t,r)=>e(l,t)(r),j=(e,t,r)=>e(l,()=>t)(r),F=(e,t)=>e(u({}),a)(t),E=(e,t)=>e(u(d),a)(t),N=(e,t)=>e(u(c),e=>[e])(t),k=v(e=>e.map((e,t)=>[t,e]),e=>{let t=[...e].sort((e,t)=>e[0]-t[0]),r=[];for(let e=0;e<t.length;++e)(e===t.length-1||t[e][0]!==t[e+1][0])&&r.push(t[e][1]);return r}),T=e=>b(t=>t[e],([t,r])=>Object.assign(Object.assign({},r),{[e]:t})),A=e=>b(t=>{let r={};for(let s of e)r[s]=t[s];return r},([t,r])=>{let s=Object.assign({},r);for(let t of e)delete s[t];return Object.assign(s,t)}),P=e=>b(t=>t[e],([t,r])=>{let s=r.slice();return s[e]=t,s}),z=P(0),S=e=>y(t=>e(t)?n(t):i(t),a),I=Symbol("__no_match__"),L=S(e=>e!==I),G=Symbol("__remove_me__"),O=e=>m(h(b(t=>0<=e&&e<t.length?t[e]:I,([t,r])=>{if(t===I)return r;if(t===G)return"string"==typeof r?r.substring(0,e)+r.substring(e+1):[...r.slice(0,e),...r.slice(e+1)];if("string"==typeof r)return 0===e?t+r.substring(1):e===r.length?r.substring(0,e-1)+t:r.substring(0,e)+t+r.substring(e+1);{let s=r.slice();return s[e]=t,s}}),L)),C=y(e=>void 0===e?i(void 0):n(e),a),$=e=>y(t=>e(t)?n(t):i(t),a),M=e=>m(h(b(t=>{let r=t.findIndex(e);return -1===r?[I,-1]:[t[r],r]},([[e,t],r])=>{if(e===I)return r;if(e===G)return[...r.slice(0,t),...r.slice(t+1)];let s=r.slice();return s[t]=e,s}),z,L)),D=e=>h(b(t=>{let r=t.map((t,r)=>e(t)?r:null).filter(e=>null!=e);return[r.map(e=>t[e]),r]},([[e,t],r])=>{let s=r.length,a=e.length,i=0,n=0,o=0,l=[];for(;i<s;)t[n]===i?(++n,o<a&&(l.push(e[o]),++o)):l.push(r[i]),++i;for(;o<a;)l.push(e[o++]);return l}),z),q=e=>b(t=>void 0===t?e:t,([e,t])=>e),Y=e=>h(b(t=>{let r=N(e,t);return[r,r.length]},([[t,r],s])=>{if(t.length!==r)throw Error("cannot add/remove elements through partsOf");let a=0;return _(e,()=>t[a++],s)}),z),B=e=>b(t=>e(t),([e,t])=>e),H=e=>b(e=>e,([t,r])=>e(t)),R=b(e=>void 0,([e,t])=>void 0===e?t:[e,...t]),K=b(e=>void 0,([e,t])=>void 0===e?t:[...t,e]),U=h(v(e=>e.split(""),e=>e.join("")),x),W=h(v(e=>e.split(/\b/),e=>e.join("")),x,S(e=>!/\s+/.test(e)));class Q{constructor(e){this._ref=e}get _tag(){return this._ref._tag}get _removable(){return this._ref._removable}compose(e){return new Q(h(this._ref,e._ref))}iso(e,t){return new Q(h(this._ref,v(e,t)))}lens(e,t){return new Q(h(this._ref,b(e,([e,r])=>t(r,e))))}indexed(){return new Q(h(this._ref,k))}prop(e){return new Q(h(this._ref,T(e)))}path(...e){return 1===e.length&&(e=e[0].split(".")),new Q(e.reduce((e,t)=>h(e,T(t)),this._ref))}pick(e){return new Q(h(this._ref,A(e)))}nth(e){return new Q(h(this._ref,P(e)))}filter(e){return new Q(h(this._ref,D(e)))}valueOr(e){return new Q(h(this._ref,q(e)))}partsOf(e){let t="function"==typeof e?e(X):e;return new Q(h(this._ref,Y(t._ref)))}reread(e){return new Q(h(this._ref,B(e)))}rewrite(e){return new Q(h(this._ref,H(e)))}optional(){return new Q(h(this._ref,C))}guard_(){return e=>this.guard(e)}guard(e){return new Q(h(this._ref,$(e)))}at(e){return new Q(h(this._ref,O(e)))}head(){return new Q(h(this._ref,O(0)))}index(e){return new Q(h(this._ref,O(e)))}find(e){return new Q(h(this._ref,M(e)))}elems(){return new Q(h(this._ref,x))}to(e){return new Q(h(this._ref,w(e)))}when(e){return new Q(h(this._ref,S(e)))}chars(){return new Q(h(this._ref,U))}words(){return new Q(h(this._ref,W))}prependTo(){return new Q(h(this._ref,R))}appendTo(){return new Q(h(this._ref,K))}}let X=new Q(g),Z=(e,t,r)=>(t.has(r)?t:t.set(r,e())).get(r),V=new WeakMap;function J(e,t){return((r,a,i)=>{let n=Z(()=>new WeakMap,V,a);return Z(()=>{let r=t(X);return(0,s.cn)(t=>{let s=t(e);return s instanceof Promise?s.then(e=>ee(r,e)):ee(r,s)},(t,s,a)=>{let i="function"==typeof a?e=>_(r._ref,a,e):e=>j(r._ref,a,e),n=t(e);return s(e,n instanceof Promise?n.then(i):i(n))})},n,i)})(0,e,t)}let ee=(e,t)=>"Traversal"===e._tag?N(e._ref,t):"Prism"===e._tag?E(e._ref,t):F(e._ref,t)},86501:function(e,t,r){"use strict";let s,a;r.r(t),r.d(t,{CheckmarkIcon:function(){return X},ErrorIcon:function(){return R},LoaderIcon:function(){return U},ToastBar:function(){return eo},ToastIcon:function(){return et},Toaster:function(){return eu},default:function(){return ef},resolveValue:function(){return F},toast:function(){return $},useToaster:function(){return q},useToasterStore:function(){return G}});var i,n=r(67294);let o={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,d=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,f=(e,t)=>{let r="",s="",a="";for(let i in e){let n=e[i];"@"==i[0]?"i"==i[1]?r=i+" "+n+";":s+="f"==i[1]?f(n,i):i+"{"+f(n,"k"==i[1]?"":t)+"}":"object"==typeof n?s+=f(n,t?t.replace(/([^,])+/g,e=>i.replace(/(^:.*)|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=n&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=f.p?f.p(i,n):i+":"+n+";")}return r+(t&&a?t+"{"+a+"}":a)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e},h=(e,t,r,s,a)=>{var i;let n=m(e),o=p[n]||(p[n]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(n));if(!p[o]){let t=n!==e?e:(e=>{let t,r,s=[{}];for(;t=d.exec(e.replace(c,""));)t[4]?s.shift():t[3]?(r=t[3].replace(u," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(u," ").trim();return s[0]})(e);p[o]=f(a?{["@keyframes "+o]:t}:t,r?"":"."+o)}let l=r&&p.g?p.g:null;return r&&(p.g=p[o]),i=p[o],l?t.data=t.data.replace(l,i):-1===t.data.indexOf(i)&&(t.data=s?i+t.data:t.data+i),o},g=(e,t,r)=>e.reduce((e,s,a)=>{let i=t[a];if(i&&i.call){let e=i(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":f(e,""):!1===e?"":e}return e+s+(null==i?"":i)},"");function v(e){let t=this||{},r=e.call?e(t.p):e;return h(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}v.bind({g:1});let b,y,x,w=v.bind({k:1});function _(e,t){let r=this||{};return function(){let s=arguments;function a(i,n){let o=Object.assign({},i),l=o.className||a.className;r.p=Object.assign({theme:y&&y()},o),r.o=/ *go\d+/.test(l),o.className=v.apply(r,s)+(l?" "+l:""),t&&(o.ref=n);let d=e;return e[0]&&(d=o.as||e,delete o.as),x&&d[0]&&x(o),b(d,o)}return t?t(a):a}}var j=e=>"function"==typeof e,F=(e,t)=>j(e)?e(t):e,E=(s=0,()=>(++s).toString()),N=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},k=new Map,T=e=>{if(k.has(e))return;let t=setTimeout(()=>{k.delete(e),I({type:4,toastId:e})},1e3);k.set(e,t)},A=e=>{let t=k.get(e);t&&clearTimeout(t)},P=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return t.toast.id&&A(t.toast.id),{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return e.toasts.find(e=>e.id===r.id)?P(e,{type:1,toast:r}):P(e,{type:0,toast:r});case 3:let{toastId:s}=t;return s?T(s):e.toasts.forEach(e=>{T(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},z=[],S={toasts:[],pausedAt:void 0},I=e=>{S=P(S,e),z.forEach(e=>{e(S)})},L={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},G=(e={})=>{let[t,r]=(0,n.useState)(S);(0,n.useEffect)(()=>(z.push(r),()=>{let e=z.indexOf(r);e>-1&&z.splice(e,1)}),[t]);let s=t.toasts.map(t=>{var r,s;return{...e,...e[t.type],...t,duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||L[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...t,toasts:s}},O=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}),C=e=>(t,r)=>{let s=O(t,e,r);return I({type:2,toast:s}),s.id},$=(e,t)=>C("blank")(e,t);$.error=C("error"),$.success=C("success"),$.loading=C("loading"),$.custom=C("custom"),$.dismiss=e=>{I({type:3,toastId:e})},$.remove=e=>I({type:4,toastId:e}),$.promise=(e,t,r)=>{let s=$.loading(t.loading,{...r,...null==r?void 0:r.loading});return e.then(e=>($.success(F(t.success,e),{id:s,...r,...null==r?void 0:r.success}),e)).catch(e=>{$.error(F(t.error,e),{id:s,...r,...null==r?void 0:r.error})}),e};var M=(e,t)=>{I({type:1,toast:{id:e,height:t}})},D=()=>{I({type:5,time:Date.now()})},q=e=>{let{toasts:t,pausedAt:r}=G(e);(0,n.useEffect)(()=>{if(r)return;let e=Date.now(),s=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&$.dismiss(t.id);return}return setTimeout(()=>$.dismiss(t.id),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[t,r]);let s=(0,n.useCallback)(()=>{r&&I({type:6,time:Date.now()})},[r]),a=(0,n.useCallback)((e,r)=>{let{reverseOrder:s=!1,gutter:a=8,defaultPosition:i}=r||{},n=t.filter(t=>(t.position||i)===(e.position||i)&&t.height),o=n.findIndex(t=>t.id===e.id),l=n.filter((e,t)=>t<o&&e.visible).length;return n.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[t]);return{toasts:t,handlers:{updateHeight:M,startPause:D,endPause:s,calculateOffset:a}}},Y=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,B=w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,H=w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Y} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${B} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${H} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,K=w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,U=_("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${K} 1s linear infinite;
`,W=w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Q=w`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,X=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${W} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Z=_("div")`
  position: absolute;
`,V=_("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,J=w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ee=_("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${J} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,et=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?n.createElement(ee,null,t):t:"blank"===r?null:n.createElement(V,null,n.createElement(U,{...s}),"loading"!==r&&n.createElement(Z,null,"error"===r?n.createElement(R,{...s}):n.createElement(X,{...s})))},er=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,es=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,ea=_("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ei=_("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,en=(e,t)=>{let r=e.includes("top")?1:-1,[s,a]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[er(r),es(r)];return{animation:t?`${w(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},eo=n.memo(({toast:e,position:t,style:r,children:s})=>{let a=e.height?en(e.position||t||"top-center",e.visible):{opacity:0},i=n.createElement(et,{toast:e}),o=n.createElement(ei,{...e.ariaProps},F(e.message,e));return n.createElement(ea,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof s?s({icon:i,message:o}):n.createElement(n.Fragment,null,i,o))});i=n.createElement,f.p=void 0,b=i,y=void 0,x=void 0;var el=({id:e,className:t,style:r,onHeightUpdate:s,children:a})=>{let i=n.useCallback(t=>{if(t){let r=()=>{s(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return n.createElement("div",{ref:i,className:t,style:r},a)},ed=(e,t)=>{let r=e.includes("top"),s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...s}},ec=v`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,eu=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:a,containerStyle:i,containerClassName:o})=>{let{toasts:l,handlers:d}=q(r);return n.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...i},className:o,onMouseEnter:d.startPause,onMouseLeave:d.endPause},l.map(r=>{let i=r.position||t,o=ed(i,d.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}));return n.createElement(el,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?ec:"",style:o},"custom"===r.type?F(r.message,r):a?a(r):n.createElement(eo,{toast:r,position:i}))}))},ef=$}},function(e){e.O(0,[321,127,888,774,179],function(){return e(e.s=77508)}),_N_E=e.O()}]);