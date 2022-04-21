import{w as C}from"./index-17b744fc.js";import{a3 as M,a4 as E}from"./index-e7b89a6c.js";function A(s){return Object.prototype.toString.call(s)==="[object Date]"}function k(s,a,t,r){if(typeof t=="number"||A(t)){const n=r-t,e=(t-a)/(s.dt||1/60),f=s.opts.stiffness*n,o=s.opts.damping*e,d=(f-o)*s.inv_mass,i=(e+d)*s.dt;return Math.abs(i)<s.opts.precision&&Math.abs(n)<s.opts.precision?r:(s.settled=!1,A(t)?new Date(t.getTime()+i):t+i)}else{if(Array.isArray(t))return t.map((n,e)=>k(s,a[e],t[e],r[e]));if(typeof t=="object"){const n={};for(const e in t)n[e]=k(s,a[e],t[e],r[e]);return n}else throw new Error(`Cannot spring ${typeof t} values`)}}function T(s,a={}){const t=C(s),{stiffness:r=.15,damping:n=.8,precision:e=.01}=a;let f,o,d,i=s,c=s,l=1,w=0,b=!1;function j(y,p={}){c=y;const D=d={};if(s==null||p.hard||g.stiffness>=1&&g.damping>=1)return b=!0,f=M(),i=y,t.set(s=c),Promise.resolve();if(p.soft){const m=p.soft===!0?.5:+p.soft;w=1/(m*60),l=0}return o||(f=M(),b=!1,o=E(m=>{if(b)return b=!1,o=null,!1;l=Math.min(l+w,1);const h={inv_mass:l,opts:g,settled:!0,dt:(m-f)*60/1e3},P=k(h,i,s,c);return f=m,i=s,t.set(s=P),h.settled&&(o=null),!h.settled})),new Promise(m=>{o.promise.then(()=>{D===d&&m()})})}const g={set:j,update:(y,p)=>j(y(c,s),p),subscribe:t.subscribe,stiffness:r,damping:n,precision:e};return g}export{T as s};
