(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[130],{33609:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/ocr",function(){return r(5072)}])},5072:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return x}});var l=r(85893),a=r(2962),s=r(67294),i=function(e){let t=e.getContext("2d"),r=t.getImageData(0,0,e.width,e.height);return function(e){for(var t=0;t<e.length;t+=4)e[t]=255^e[t],e[t+1]=255^e[t+1],e[t+2]=255^e[t+2]}(r.data),function(e,t){void 0===t&&(t=.5);let r=Math.floor(255*t);for(let t=0;t<e.length;t+=4){let l;let a=e[t],s=e[t+1],i=e[t+2],n=.2126*a+.7152*s+.0722*i;l=n>=r?255:0,e[t]=e[t+1]=e[t+2]=l}}(r.data,.5),r},n=r(7320),c=r.n(n);let o=e=>{let t=async t=>{var r,l;let a=null!==(r=null==t?void 0:t.image)&&void 0!==r?r:null==e?void 0:e.image,s=null!==(l=null==t?void 0:t.langs)&&void 0!==l?l:null==e?void 0:e.langs;if(!a)throw Error("Tesseract image is required");let i=await c().createWorker();return await i.loadLanguage(s),await i.initialize(s),await i.recognize(a)};return{recognize:t=>{var r,l,a;let s=null!==(r=null==t?void 0:t.image)&&void 0!==r?r:null==e?void 0:e.image,i=null!==(l=null==t?void 0:t.langs)&&void 0!==l?l:null==e?void 0:e.langs;if(!s)throw Error("Tesseract image is required");return c().recognize(s,i,null!==(a=null==t?void 0:t.options)&&void 0!==a?a:{logger:e=>console.log({m:e})})},recognizeWorker:t,imagePreprocess:i}},d=e=>(0,s.useReducer)((e,t)=>({...e,...t}),e);var u=r(47516),g=r(55788);let h={hasError:!1,searchUrl:"",textResult:"",isLoading:!1,isSearchFromUrl:!1,confidence:0,imgSrc:""};var m=()=>{let[e,t]=d(h),r=(0,s.useRef)(null),a=(0,s.useRef)(null),{recognizeWorker:i,imagePreprocess:n}=o(),c=e.isSearchFromUrl&&!e.searchUrl,m=!e.isSearchFromUrl&&!e.imgSrc,x=e.isLoading||c||m,f=()=>{let e=r.current,t=a.current;e.width=t.width,e.height=t.height;let l=e.getContext("2d");null==l||l.drawImage(t,0,0),null==l||l.putImageData(n(e),0,0);let s=e.toDataURL("image/jpeg");return s},p=async()=>{await navigator.clipboard.writeText(e.textResult)};return(0,l.jsxs)("section",{className:"flex flex-col items-center justify-start mx-auto prose md:prose-lg lg:prose-xl",children:[(0,l.jsx)("img",{ref:a,src:e.imgSrc,hidden:!0}),(0,l.jsx)("canvas",{ref:r,hidden:!0}),(0,l.jsxs)("div",{className:"flex flex-col gap-2 w-full md:w-1/2 max-w-80",children:[(0,l.jsx)("input",{hidden:!e.isSearchFromUrl,type:"url",placeholder:"Type image url here",className:"input input-bordered w-full",value:e.searchUrl,onChange:e=>t({searchUrl:e.target.value})}),!e.isSearchFromUrl&&(0,l.jsx)("input",{type:"file",accept:"image/*",className:"file-input file-input-bordered w-full",onChange:e=>{let{target:{files:r}}=e;r&&r[0]&&t({imgSrc:URL.createObjectURL(r[0])})}}),(0,l.jsxs)("div",{className:"w-full flex justify-between items-center gap-5",children:[(0,l.jsx)("div",{className:"form-control",children:(0,l.jsxs)("label",{className:"label cursor-pointer justify-start gap-3",children:[(0,l.jsx)("input",{type:"checkbox",className:"toggle",checked:e.isSearchFromUrl,onChange:e=>t({...h,isSearchFromUrl:e.target.checked})}),(0,l.jsx)("span",{className:"label-text",children:"convert from url"})]})}),(0,l.jsxs)("button",{className:"btn",onClick:()=>{let r=e.isSearchFromUrl?e.searchUrl:f();t({isLoading:!0,hasError:!1,textResult:""}),i({image:r}).catch(e=>t({hasError:!0})).then(e=>{e&&t({textResult:e.data.text,confidence:e.data.confidence})}).finally(()=>t({isLoading:!1}))},disabled:x,children:[e.isLoading&&(0,l.jsx)("span",{className:"loading loading-spinner"}),"Convert"]})]})]}),e.textResult&&(0,l.jsx)("div",{className:"card w-full mt-2 bg-base-200 shadow-xl",children:(0,l.jsxs)("div",{className:"card-body",children:[(0,l.jsxs)("div",{className:"card-actions justify-between items-center",children:[(0,l.jsxs)("div",{className:"badge badge-outline",children:["confidence ",e.confidence,"%"]}),(0,l.jsx)("div",{className:"tooltip tooltip-left before:text-xs before:content-[attr(data-tip)]","data-tip":"copy",children:(0,l.jsx)("button",{className:"btn btn-ghost btn-circle btn-sm",onClick:p,children:(0,l.jsx)(g.m54,{size:20})})})]}),(0,l.jsx)("p",{dangerouslySetInnerHTML:{__html:e.textResult}})]})}),e.hasError&&(0,l.jsxs)("div",{className:"flex w-full flex-1 items-center justify-start rounded-lg border border-error p-4 sm:px-6 mt-2",children:[(0,l.jsx)(u.Cw1,{size:50,className:"text-error"}),(0,l.jsx)("div",{className:"px-4",children:(0,l.jsx)("p",{children:"An issue occurred. Please make another attempt or consider altering the image."})})]})]})},x=()=>(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(a.PB,{title:"OCR",description:"Pasquale Favella , image to text"}),(0,l.jsx)(m,{})]})}},function(e){e.O(0,[57,320,774,888,179],function(){return e(e.s=33609)}),_N_E=e.O()}]);