(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[990,501],{42545:function(e,t,r){"use strict";r.d(t,{R:function(){return J}});var s=r(15103);let n=e=>e,a=e=>({_tag:"Left",value:e}),i=e=>({_tag:"Right",value:e}),o=(e,t,r)=>"Left"===r._tag?e(r.value):t(r.value),l={dimap:(e,t,r)=>s=>t(r(e(s))),first:e=>([t,r])=>[e(t),r],right:e=>t=>"Left"===t._tag?t:i(e(t.value)),wander:e=>t=>t.map(e)},d={empty:()=>void 0,foldMap:(e,t)=>{for(let r=0;r<t.length;r++){let s=e(t[r]);if(void 0!=s)return s}}},c={empty:()=>[],foldMap:(e,t)=>{let r=[];return t.forEach(t=>{r=r.concat(e(t))}),r}},u=e=>({dimap:(e,t,r)=>t=>r(e(t)),first:e=>([t,r])=>e(t),right:t=>r=>"Left"===r._tag?e.empty():t(r.value),wander:t=>r=>e.foldMap(t,r)}),f={Equivalence:{Equivalence:"Equivalence",Iso:"Iso",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Iso:{Equivalence:"Iso",Iso:"Iso",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Lens:{Equivalence:"Lens",Iso:"Lens",Lens:"Lens",Prism:"Prism",Traversal:"Traversal",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Prism:{Equivalence:"Prism",Iso:"Prism",Lens:"Prism",Prism:"Prism",Traversal:"Traversal",Getter:"AffineFold",AffineFold:"AffineFold",Fold:"Fold",Setter:"Setter"},Traversal:{Equivalence:"Traversal",Iso:"Traversal",Lens:"Traversal",Prism:"Traversal",Traversal:"Traversal",Getter:"Fold",AffineFold:"Fold",Fold:"Fold",Setter:"Setter"},Getter:{Equivalence:"Getter",Iso:"Getter",Lens:"Getter",Prism:"AffineFold",Traversal:"Fold",Getter:"Getter",AffineFold:"AffineFold",Fold:"Fold",Setter:void 0},AffineFold:{Equivalence:"AffineFold",Iso:"AffineFold",Lens:"AffineFold",Prism:"AffineFold",Traversal:"Fold",Getter:"AffineFold",AffineFold:"AffineFold",Fold:"Fold",Setter:void 0},Fold:{Equivalence:"Fold",Iso:"Fold",Lens:"Fold",Prism:"Fold",Traversal:"Fold",Getter:"Fold",AffineFold:"Fold",Fold:"Fold",Setter:void 0},Setter:{Equivalence:void 0,Iso:void 0,Lens:void 0,Prism:void 0,Traversal:void 0,Getter:void 0,AffineFold:void 0,Fold:void 0,Setter:void 0}},p=(e,t)=>{let r=t;return r._tag=e,r},m=e=>(e._removable=!0,e);function h(e,t,r){if(2==arguments.length){let r=(r,s)=>e(r,t(r,s));return r._tag=f[e._tag][t._tag],r._removable=t._removable||!1,r}{let s=f[e._tag][t._tag],n=(s,n)=>e(s,t(s,r(s,n)));return n._tag=f[s][r._tag],n._removable=r._removable||!1,n}}let g=p("Equivalence",(e,t)=>t),v=(e,t)=>p("Iso",(r,s)=>r.dimap(e,t,s)),b=(e,t)=>p("Lens",(r,s)=>r.dimap(t=>[e(t),t],t,r.first(s))),y=(e,t)=>p("Prism",(r,s)=>r.dimap(e,e=>o(n,t,e),r.right(s))),x=p("Traversal",(e,t)=>e.dimap(n,n,e.wander(t))),w=e=>p("Getter",(t,r)=>t.dimap(e,n,r)),_=(e,t,r)=>e(l,t)(r),j=(e,t,r)=>e(l,()=>t)(r),F=(e,t)=>e(u({}),n)(t),E=(e,t)=>e(u(d),n)(t),N=(e,t)=>e(u(c),e=>[e])(t),k=v(e=>e.map((e,t)=>[t,e]),e=>{let t=[...e].sort((e,t)=>e[0]-t[0]),r=[];for(let e=0;e<t.length;++e)(e===t.length-1||t[e][0]!==t[e+1][0])&&r.push(t[e][1]);return r}),A=e=>b(t=>t[e],([t,r])=>Object.assign(Object.assign({},r),{[e]:t})),P=e=>b(t=>{let r={};for(let s of e)r[s]=t[s];return r},([t,r])=>{let s=Object.assign({},r);for(let t of e)delete s[t];return Object.assign(s,t)}),T=e=>b(t=>t[e],([t,r])=>{let s=r.slice();return s[e]=t,s}),S=T(0),z=e=>y(t=>e(t)?i(t):a(t),n),I=Symbol("__no_match__"),L=z(e=>e!==I),O=Symbol("__remove_me__"),G=e=>m(h(b(t=>0<=e&&e<t.length?t[e]:I,([t,r])=>{if(t===I)return r;if(t===O)return"string"==typeof r?r.substring(0,e)+r.substring(e+1):[...r.slice(0,e),...r.slice(e+1)];if("string"==typeof r)return 0===e?t+r.substring(1):e===r.length?r.substring(0,e-1)+t:r.substring(0,e)+t+r.substring(e+1);{let s=r.slice();return s[e]=t,s}}),L)),M=y(e=>void 0===e?a(void 0):i(e),n),C=e=>y(t=>e(t)?i(t):a(t),n),$=e=>m(h(b(t=>{let r=t.findIndex(e);return -1===r?[I,-1]:[t[r],r]},([[e,t],r])=>{if(e===I)return r;if(e===O)return[...r.slice(0,t),...r.slice(t+1)];let s=r.slice();return s[t]=e,s}),S,L)),D=e=>h(b(t=>{let r=t.map((t,r)=>e(t)?r:null).filter(e=>null!=e);return[r.map(e=>t[e]),r]},([[e,t],r])=>{let s=r.length,n=e.length,a=0,i=0,o=0,l=[];for(;a<s;)t[i]===a?(++i,o<n&&(l.push(e[o]),++o)):l.push(r[a]),++a;for(;o<n;)l.push(e[o++]);return l}),S),q=e=>b(t=>void 0===t?e:t,([e,t])=>e),Y=e=>h(b(t=>{let r=N(e,t);return[r,r.length]},([[t,r],s])=>{if(t.length!==r)throw Error("cannot add/remove elements through partsOf");let n=0;return _(e,()=>t[n++],s)}),S),Z=e=>b(t=>e(t),([e,t])=>e),B=e=>b(e=>e,([t,r])=>e(t)),R=b(e=>void 0,([e,t])=>void 0===e?t:[e,...t]),U=b(e=>void 0,([e,t])=>void 0===e?t:[...t,e]),H=h(v(e=>e.split(""),e=>e.join("")),x),K=h(v(e=>e.split(/\b/),e=>e.join("")),x,z(e=>!/\s+/.test(e)));class W{constructor(e){this._ref=e}get _tag(){return this._ref._tag}get _removable(){return this._ref._removable}compose(e){return new W(h(this._ref,e._ref))}iso(e,t){return new W(h(this._ref,v(e,t)))}lens(e,t){return new W(h(this._ref,b(e,([e,r])=>t(r,e))))}indexed(){return new W(h(this._ref,k))}prop(e){return new W(h(this._ref,A(e)))}path(...e){return 1===e.length&&(e=e[0].split(".")),new W(e.reduce((e,t)=>h(e,A(t)),this._ref))}pick(e){return new W(h(this._ref,P(e)))}nth(e){return new W(h(this._ref,T(e)))}filter(e){return new W(h(this._ref,D(e)))}valueOr(e){return new W(h(this._ref,q(e)))}partsOf(e){let t="function"==typeof e?e(Q):e;return new W(h(this._ref,Y(t._ref)))}reread(e){return new W(h(this._ref,Z(e)))}rewrite(e){return new W(h(this._ref,B(e)))}optional(){return new W(h(this._ref,M))}guard_(){return e=>this.guard(e)}guard(e){return new W(h(this._ref,C(e)))}at(e){return new W(h(this._ref,G(e)))}head(){return new W(h(this._ref,G(0)))}index(e){return new W(h(this._ref,G(e)))}find(e){return new W(h(this._ref,$(e)))}elems(){return new W(h(this._ref,x))}to(e){return new W(h(this._ref,w(e)))}when(e){return new W(h(this._ref,z(e)))}chars(){return new W(h(this._ref,H))}words(){return new W(h(this._ref,K))}prependTo(){return new W(h(this._ref,R))}appendTo(){return new W(h(this._ref,U))}}let Q=new W(g),V=(e,t,r)=>(t.has(r)?t:t.set(r,e())).get(r),X=new WeakMap;function J(e,t){return((r,n,a)=>{let i=V(()=>new WeakMap,X,n);return V(()=>{let r=t(Q);return(0,s.cn)(t=>{let s=t(e);return s instanceof Promise?s.then(e=>ee(r,e)):ee(r,s)},(t,s,n)=>{let a="function"==typeof n?e=>_(r._ref,n,e):e=>j(r._ref,n,e),i=t(e);return s(e,i instanceof Promise?i.then(a):a(i))})},i,a)})(0,e,t)}let ee=(e,t)=>"Traversal"===e._tag?N(e._ref,t):"Prism"===e._tag?E(e._ref,t):F(e._ref,t)},77508:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/nextle",function(){return r(35356)}])},26792:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});var s=r(67294);let n=/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;function a(){let[e,t]=(0,s.useState)(!1);return(0,s.useEffect)(()=>{let e=void 0===window.navigator?"":navigator.userAgent,r=!!e.match(n);t(r)},[]),e}},35356:function(e,t,r){"use strict";r.r(t),r.d(t,{__N_SSG:function(){return C},default:function(){return $}});var s=r(85893),n=r(67294),a=r(48583),i=r(86501),o=r(15103),l=r(42545);let d=(0,o.cn)([]),c=(0,o.cn)({word:"",guesses:[],currentGuess:0}),u=(0,l.R)(c,e=>e.prop("word")),f=(0,l.R)(c,e=>e.prop("guesses")),p=(0,l.R)(c,e=>e.prop("currentGuess")),m=(0,o.cn)(e=>{let t=e(p),r=e(f),s=e(u);return r[t-1]===s}),h=(0,o.cn)(e=>{let t=e(m),r=e(p);return!t&&6===r}),g=(0,o.cn)(e=>{let t=e(p),r=e(f);return r[t]},(e,t,r)=>{let s=e(d),n=e(p),a=e(f),i=e(m),o=e(h);!i&&!o&&("Enter"===r.type&&s.includes(a[n])&&t(p,n+1),("Backspace"===r.type||"⟵"===r.type)&&(a[n]=a[n].slice(0,a[n].length-1),t(f,[...a])),"Add"===r.type&&r.value&&a[n].length<5&&(a[n]=a[n]+r.value.toUpperCase(),t(f,[...a])))}),v=(0,o.cn)(e=>{let t=e(d),r=e(g);return(null==r?void 0:r.length)===5&&!t.includes(r)});var b=r(3818);function y(){let e=(0,a.Dv)(d),[t,r]=(0,a.KO)(u),[s,o]=(0,a.KO)(f),[l,c]=(0,a.KO)(p),y=(0,a.Dv)(v),x=(0,a.Dv)(m),w=(0,a.Dv)(h),_=(0,a.b9)(g),j=(0,n.useMemo)(()=>s.slice(0,l).join("").split(""),[s,l]),F=(0,n.useMemo)(()=>t.split("").filter((e,t)=>s.slice(0,l).map(e=>e[t]).includes(e)),[s,l]),E=(0,n.useMemo)(()=>t.split("").filter(e=>j.includes(e)),[j]),N=e=>{let{key:t}=e;return"Enter"===t&&y?i.toast.error("Not in word list"):"Enter"===t||"Backspace"===t||"⟵"===t?_({type:t}):t.match(/^[A-z]$/)?_({type:"Add",value:t}):void 0},k=()=>{let{currentGuess:t,guesses:s,word:n}=b.Y2.initializeGameState(e);r(n),o(s),c(t)};return{word:t,guesses:s,currentGuessNumber:l,hasWon:x,hasLost:w,handleAction:N,exactGuesses:F,inexactGuesses:E,allGuesses:j,restart:k}}var x=r(86010),w=r(26792);let _=e=>{let{index:t}=e,{word:r,guesses:n,currentGuessNumber:a}=y();(0,w.Z)();let i=n[t],o=t<a;return(0,s.jsx)("div",{className:"grid grid-cols-5 gap-1 md:gap-2",children:[,,,,,].fill(0).map((e,t)=>(0,s.jsx)("div",{className:(0,x.Z)("flex w-14 h-14 md:h-16 md:w-16 items-center justify-center rounded border border-base-300 font-bold uppercase",o?i[t]===r[t]?"bg-primary bg-opacity-50":r.includes(i[t])?"bg-warning bg-opacity-50":"bg-base-100":"bg-base-100"),children:i[t]},b.cQ.uid()))})};var j=(0,n.memo)(_),F=r(49019);let E=()=>{let{handleAction:e,exactGuesses:t,inexactGuesses:r,allGuesses:a}=y();return(0,n.useEffect)(()=>(window.addEventListener("keyup",e),()=>{window.removeEventListener("keyup",e)}),[e]),(0,s.jsx)("div",{className:"w-full flex flex-col justify-center items-center mx-1",children:F.b9.map((n,i)=>(0,s.jsx)("div",{className:"flex justify-center w-full gap-px md:gap-1 my-px md:my-1",children:(2===i?["Enter",...n.split(""),"⟵"]:n.split("")).map(n=>(0,s.jsx)("button",{onClick:()=>e({key:n}),className:(0,x.Z)("kbd font-semibold tracking-wider md:tracking-wide h-12 w-12",t.includes(n)?"bg-primary bg-opacity-25":r.includes(n)?"bg-warning bg-opacity-25":a.includes(n)?"bg-base-300":"bg-base-100","Enter"===n&&"min-w-min"),children:n},b.cQ.uid()))},b.cQ.uid()))})};var N=(0,n.memo)(E),k=r(53854),A=r(37106),P=r(2585),T=r(97735);let S=()=>{let{hasWon:e,restart:t,currentGuessNumber:r}=y(),a=(0,n.useMemo)(()=>{switch(r){case 1:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(P.VjE,{size:30})," You're a true puzzle master"]});case 2:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(P.ma2,{size:30})," You're a true puzzle Dragon"]});case 3:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(T.wUf,{size:30})," You're a true puzzle Unicorn"]});case 4:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(P.G5n,{size:30})," You're a true puzzle Hero"]});default:return(0,s.jsxs)("p",{className:"flex gap-2 justify-start items-center",children:[(0,s.jsx)(A.wr2,{size:30})," Bravo! You've cracked that puzzle with ease"]})}},[r]);return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("input",{type:"checkbox",className:"modal-toggle",defaultChecked:e}),(0,s.jsx)("div",{className:"modal modal-bottom sm:modal-middle",children:(0,s.jsxs)("div",{className:"modal-box",children:[(0,s.jsx)("h3",{className:"font-bold text-lg",children:"Great!"}),(0,s.jsx)("p",{className:"py-4",children:"Congratulations, you've successfully solved the Nextle!"}),a,(0,s.jsx)("div",{className:"modal-action",children:(0,s.jsxs)("button",{className:"btn btn-ghost gap-2",onClick:t,children:[(0,s.jsx)(k.bKy,{size:24}),(0,s.jsx)("span",{children:"Play again"})]})})]})})]})},z=()=>{let{hasLost:e,restart:t,word:r}=y();return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("input",{type:"checkbox",className:"modal-toggle",defaultChecked:e}),(0,s.jsx)("div",{className:"modal modal-bottom sm:modal-middle",children:(0,s.jsxs)("div",{className:"modal-box",children:[(0,s.jsx)("h3",{className:"font-bold text-lg",children:"Oh No!"}),(0,s.jsxs)("p",{className:"py-4",children:["The Nextle word was ",(0,s.jsx)("b",{children:r})]}),(0,s.jsx)("div",{className:"modal-action",children:(0,s.jsxs)("button",{className:"btn btn-ghost gap-2",onClick:t,children:[(0,s.jsx)(k.bKy,{size:24}),(0,s.jsx)("span",{children:"Play again"})]})})]})})]})},I=()=>{let{guesses:e,hasWon:t,hasLost:r}=y();return(0,s.jsxs)("section",{className:"h-[calc(96vh-70px)] md:h-full flex flex-col items-center justify-between w-full mx-auto",children:[(0,s.jsx)("div",{className:"flex justify-center items-center w-full my-auto md:grow",children:(0,s.jsx)("div",{className:"grid grid-rows-6 gap-1 md:gap-2 box-border p-2",children:e.map((e,t)=>(0,s.jsx)(j,{index:t},t))})}),(0,s.jsx)(N,{}),t&&(0,s.jsx)(S,{}),r&&(0,s.jsx)(z,{})]})},L=new WeakMap,O=e=>{let t=L.get(e);return t||(t=new WeakSet,L.set(e,t)),t};var G=r(2962);let M=e=>{let{words:t}=e;return!function(e,t){let r=(0,a.oR)(void 0),s=O(r);for(let[t,n]of e)s.has(t)||(s.add(t),r.set(t,n))}([[d,t],[c,b.Y2.initializeGameState(t)]]),(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(G.PB,{title:"Nextle",description:"Pasquale Favella , guess the hidden word in 6 tries."}),(0,s.jsx)(I,{})]})};var C=!0,$=M},68723:function(e,t,r){"use strict";var s=r(22003),n=r(83097),a=r(29557);let i=e=>{let t=new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});return t};t.Z={formatDateEN:i,calculateAge:function(){arguments.length>0&&void 0!==arguments[0]&&arguments[0];let e=(0,n.Z)(s.Z.dob,"dd/MM/yyyy",new Date),t=(0,a.Z)(new Date,e);return t}}},3818:function(e,t,r){"use strict";r.d(t,{Y2:function(){return i},cQ:function(){return n}}),r(68723);let s=()=>crypto.getRandomValues(new Uint32Array(1)).toString();var n={uid:s};let a=e=>({word:e[Math.floor(Math.random()*e.length)],guesses:Array(6).fill(""),currentGuess:0});var i={initializeGameState:a}},86501:function(e,t,r){"use strict";let s,n;r.r(t),r.d(t,{CheckmarkIcon:function(){return B},ErrorIcon:function(){return Y},LoaderIcon:function(){return Z},ToastBar:function(){return ee},ToastIcon:function(){return K},Toaster:function(){return en},default:function(){return ea},resolveValue:function(){return F},toast:function(){return C},useToaster:function(){return q},useToasterStore:function(){return O}});var a,i=r(67294);let o={data:""},l=e=>"object"==typeof window?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||o,d=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,c=/\/\*[^]*?\*\/|  +/g,u=/\n+/g,f=(e,t)=>{let r="",s="",n="";for(let a in e){let i=e[a];"@"==a[0]?"i"==a[1]?r=a+" "+i+";":s+="f"==a[1]?f(i,a):a+"{"+f(i,"k"==a[1]?"":t)+"}":"object"==typeof i?s+=f(i,t?t.replace(/([^,])+/g,e=>a.replace(/(^:.*)|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):a):null!=i&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=f.p?f.p(a,i):a+":"+i+";")}return r+(t&&n?t+"{"+n+"}":n)+s},p={},m=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+m(e[r]);return t}return e},h=(e,t,r,s,n)=>{var a,i;let o=m(e),l=p[o]||(p[o]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(o));if(!p[l]){let t=o!==e?e:(e=>{let t,r,s=[{}];for(;t=d.exec(e.replace(c,""));)t[4]?s.shift():t[3]?(r=t[3].replace(u," ").trim(),s.unshift(s[0][r]=s[0][r]||{})):s[0][t[1]]=t[2].replace(u," ").trim();return s[0]})(e);p[l]=f(n?{["@keyframes "+l]:t}:t,r?"":"."+l)}let h=r&&p.g?p.g:null;return r&&(p.g=p[l]),a=p[l],i=t,h?i.data=i.data.replace(h,a):-1===i.data.indexOf(a)&&(i.data=s?a+i.data:i.data+a),l},g=(e,t,r)=>e.reduce((e,s,n)=>{let a=t[n];if(a&&a.call){let e=a(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;a=t?"."+t:e&&"object"==typeof e?e.props?"":f(e,""):!1===e?"":e}return e+s+(null==a?"":a)},"");function v(e){let t=this||{},r=e.call?e(t.p):e;return h(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,l(t.target),t.g,t.o,t.k)}v.bind({g:1});let b,y,x,w=v.bind({k:1});function _(e,t){let r=this||{};return function(){let s=arguments;function n(a,i){let o=Object.assign({},a),l=o.className||n.className;r.p=Object.assign({theme:y&&y()},o),r.o=/ *go\d+/.test(l),o.className=v.apply(r,s)+(l?" "+l:""),t&&(o.ref=i);let d=e;return e[0]&&(d=o.as||e,delete o.as),x&&d[0]&&x(o),b(d,o)}return t?t(n):n}}var j=e=>"function"==typeof e,F=(e,t)=>j(e)?e(t):e,E=(s=0,()=>(++s).toString()),N=()=>{if(void 0===n&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");n=!e||e.matches}return n},k=new Map,A=e=>{if(k.has(e))return;let t=setTimeout(()=>{k.delete(e),I({type:4,toastId:e})},1e3);k.set(e,t)},P=e=>{let t=k.get(e);t&&clearTimeout(t)},T=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,20)};case 1:return t.toast.id&&P(t.toast.id),{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return e.toasts.find(e=>e.id===r.id)?T(e,{type:1,toast:r}):T(e,{type:0,toast:r});case 3:let{toastId:s}=t;return s?A(s):e.toasts.forEach(e=>{A(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===s||void 0===s?{...e,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},S=[],z={toasts:[],pausedAt:void 0},I=e=>{z=T(z,e),S.forEach(e=>{e(z)})},L={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},O=(e={})=>{let[t,r]=(0,i.useState)(z);(0,i.useEffect)(()=>(S.push(r),()=>{let e=S.indexOf(r);e>-1&&S.splice(e,1)}),[t]);let s=t.toasts.map(t=>{var r,s;return{...e,...e[t.type],...t,duration:t.duration||(null==(r=e[t.type])?void 0:r.duration)||(null==e?void 0:e.duration)||L[t.type],style:{...e.style,...null==(s=e[t.type])?void 0:s.style,...t.style}}});return{...t,toasts:s}},G=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||E()}),M=e=>(t,r)=>{let s=G(t,e,r);return I({type:2,toast:s}),s.id},C=(e,t)=>M("blank")(e,t);C.error=M("error"),C.success=M("success"),C.loading=M("loading"),C.custom=M("custom"),C.dismiss=e=>{I({type:3,toastId:e})},C.remove=e=>I({type:4,toastId:e}),C.promise=(e,t,r)=>{let s=C.loading(t.loading,{...r,...null==r?void 0:r.loading});return e.then(e=>(C.success(F(t.success,e),{id:s,...r,...null==r?void 0:r.success}),e)).catch(e=>{C.error(F(t.error,e),{id:s,...r,...null==r?void 0:r.error})}),e};var $=(e,t)=>{I({type:1,toast:{id:e,height:t}})},D=()=>{I({type:5,time:Date.now()})},q=e=>{let{toasts:t,pausedAt:r}=O(e);(0,i.useEffect)(()=>{if(r)return;let e=Date.now(),s=t.map(t=>{if(t.duration===1/0)return;let r=(t.duration||0)+t.pauseDuration-(e-t.createdAt);if(r<0){t.visible&&C.dismiss(t.id);return}return setTimeout(()=>C.dismiss(t.id),r)});return()=>{s.forEach(e=>e&&clearTimeout(e))}},[t,r]);let s=(0,i.useCallback)(()=>{r&&I({type:6,time:Date.now()})},[r]),n=(0,i.useCallback)((e,r)=>{let{reverseOrder:s=!1,gutter:n=8,defaultPosition:a}=r||{},i=t.filter(t=>(t.position||a)===(e.position||a)&&t.height),o=i.findIndex(t=>t.id===e.id),l=i.filter((e,t)=>t<o&&e.visible).length;return i.filter(e=>e.visible).slice(...s?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+n,0)},[t]);return{toasts:t,handlers:{updateHeight:$,startPause:D,endPause:s,calculateOffset:n}}},Y=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${w`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.15s ease-out forwards;
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
    animation: ${w`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Z=_("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${w`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`} 1s linear infinite;
`,B=_("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${w`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${w`
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
}`} 0.2s ease-out forwards;
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
`,R=_("div")`
  position: absolute;
`,U=_("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,H=_("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${w`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,K=({toast:e})=>{let{icon:t,type:r,iconTheme:s}=e;return void 0!==t?"string"==typeof t?i.createElement(H,null,t):t:"blank"===r?null:i.createElement(U,null,i.createElement(Z,{...s}),"loading"!==r&&i.createElement(R,null,"error"===r?i.createElement(Y,{...s}):i.createElement(B,{...s})))},W=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,Q=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,V=_("div")`
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
`,X=_("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=(e,t)=>{let r=e.includes("top")?1:-1,[s,n]=N()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[W(r),Q(r)];return{animation:t?`${w(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${w(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ee=i.memo(({toast:e,position:t,style:r,children:s})=>{let n=e.height?J(e.position||t||"top-center",e.visible):{opacity:0},a=i.createElement(K,{toast:e}),o=i.createElement(X,{...e.ariaProps},F(e.message,e));return i.createElement(V,{className:e.className,style:{...n,...r,...e.style}},"function"==typeof s?s({icon:a,message:o}):i.createElement(i.Fragment,null,a,o))});a=i.createElement,f.p=void 0,b=a,y=void 0,x=void 0;var et=({id:e,className:t,style:r,onHeightUpdate:s,children:n})=>{let a=i.useCallback(t=>{if(t){let r=()=>{s(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return i.createElement("div",{ref:a,className:t,style:r},n)},er=(e,t)=>{let r=e.includes("top"),s=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:N()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...s}},es=v`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,en=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:s,children:n,containerStyle:a,containerClassName:o})=>{let{toasts:l,handlers:d}=q(r);return i.createElement("div",{style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...a},className:o,onMouseEnter:d.startPause,onMouseLeave:d.endPause},l.map(r=>{let a=r.position||t,o=er(a,d.calculateOffset(r,{reverseOrder:e,gutter:s,defaultPosition:t}));return i.createElement(et,{id:r.id,key:r.id,onHeightUpdate:d.updateHeight,className:r.visible?es:"",style:o},"custom"===r.type?F(r.message,r):n?n(r):i.createElement(ee,{toast:r,position:a}))}))},ea=C}},function(e){e.O(0,[556,907,980,654,774,888,179],function(){return e(e.s=77508)}),_N_E=e.O()}]);