function k(){}const Z=t=>t;function yt(t,e){for(const n in e)t[n]=e[n];return t}function tt(t){return t()}function X(){return Object.create(null)}function C(t){t.forEach(tt)}function Q(t){return typeof t=="function"}function Wt(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let B;function Gt(t,e){return B||(B=document.createElement("a")),B.href=e,t===B.href}function gt(t){return Object.keys(t).length===0}function et(t,...e){if(t==null)return k;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function Jt(t){let e;return et(t,n=>e=n)(),e}function Kt(t,e,n){t.$$.on_destroy.push(et(e,n))}function Qt(t,e,n,s){if(t){const r=nt(t,e,n,s);return t[0](r)}}function nt(t,e,n,s){return t[1]&&s?yt(n.ctx.slice(),t[1](s(e))):n.ctx}function Ut(t,e,n,s){if(t[2]&&s){const r=t[2](s(n));if(e.dirty===void 0)return r;if(typeof r=="object"){const c=[],i=Math.max(e.dirty.length,r.length);for(let l=0;l<i;l+=1)c[l]=e.dirty[l]|r[l];return c}return e.dirty|r}return e.dirty}function Vt(t,e,n,s,r,c){if(r){const i=nt(e,n,s,c);t.p(i,r)}}function Xt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let s=0;s<n;s++)e[s]=-1;return e}return-1}function Yt(t,e,n){return t.set(n),e}function Zt(t){return t&&Q(t.destroy)?t.destroy:k}const it=typeof window!="undefined";let st=it?()=>window.performance.now():()=>Date.now(),U=it?t=>requestAnimationFrame(t):k;const E=new Set;function rt(t){E.forEach(e=>{e.c(t)||(E.delete(e),e.f())}),E.size!==0&&U(rt)}function ot(t){let e;return E.size===0&&U(rt),{promise:new Promise(n=>{E.add(e={c:t,f:n})}),abort(){E.delete(e)}}}let F=!1;function bt(){F=!0}function $t(){F=!1}function xt(t,e,n,s){for(;t<e;){const r=t+(e-t>>1);n(r)<=s?t=r+1:e=r}return t}function wt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const d=e[a];d.claim_order!==void 0&&o.push(d)}e=o}const n=new Int32Array(e.length+1),s=new Int32Array(e.length);n[0]=-1;let r=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,d=(r>0&&e[n[r]].claim_order<=a?r+1:xt(1,r,u=>e[n[u]].claim_order,a))-1;s[o]=n[d]+1;const f=d+1;n[f]=o,r=Math.max(f,r)}const c=[],i=[];let l=e.length-1;for(let o=n[r]+1;o!=0;o=s[o-1]){for(c.push(e[o-1]);l>=o;l--)i.push(e[l]);l--}for(;l>=0;l--)i.push(e[l]);c.reverse(),i.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<i.length;o++){for(;a<c.length&&i[o].claim_order>=c[a].claim_order;)a++;const d=a<c.length?c[a]:null;t.insertBefore(i[o],d)}}function vt(t,e){t.appendChild(e)}function ct(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function kt(t){const e=lt("style");return Et(ct(t),e),e.sheet}function Et(t,e){vt(t.head||t,e)}function Ct(t,e){if(F){for(wt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function te(t,e,n){F&&!n?Ct(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function St(t){t.parentNode.removeChild(t)}function lt(t){return document.createElement(t)}function At(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function V(t){return document.createTextNode(t)}function ee(){return V(" ")}function ne(){return V("")}function ie(t,e,n,s){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}function se(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Nt(t){return Array.from(t.childNodes)}function jt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function at(t,e,n,s,r=!1){jt(t);const c=(()=>{for(let i=t.claim_info.last_index;i<t.length;i++){const l=t[i];if(e(l)){const o=n(l);return o===void 0?t.splice(i,1):t[i]=o,r||(t.claim_info.last_index=i),l}}for(let i=t.claim_info.last_index-1;i>=0;i--){const l=t[i];if(e(l)){const o=n(l);return o===void 0?t.splice(i,1):t[i]=o,r?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=i,l}}return s()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function ut(t,e,n,s){return at(t,r=>r.nodeName===e,r=>{const c=[];for(let i=0;i<r.attributes.length;i++){const l=r.attributes[i];n[l.name]||c.push(l.name)}c.forEach(i=>r.removeAttribute(i))},()=>s(e))}function re(t,e,n){return ut(t,e,n,lt)}function oe(t,e,n){return ut(t,e,n,At)}function Mt(t,e){return at(t,n=>n.nodeType===3,n=>{const s=""+e;if(n.data.startsWith(s)){if(n.data.length!==s.length)return n.splitText(s.length)}else n.data=s},()=>V(e),!0)}function ce(t){return Mt(t," ")}function le(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function ae(t,e,n,s){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,s?"important":"")}function ue(t,e,n){t.classList[n?"add":"remove"](e)}function ft(t,e,n=!1){const s=document.createEvent("CustomEvent");return s.initCustomEvent(t,n,!1,e),s}function fe(t,e=document.body){return Array.from(e.querySelectorAll(t))}const L=new Map;let T=0;function Rt(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function qt(t,e){const n={stylesheet:kt(e),rules:{}};return L.set(t,n),n}function G(t,e,n,s,r,c,i,l=0){const o=16.666/s;let a=`{
`;for(let p=0;p<=1;p+=o){const y=e+(n-e)*c(p);a+=p*100+`%{${i(y,1-y)}}
`}const d=a+`100% {${i(n,1-n)}}
}`,f=`__svelte_${Rt(d)}_${l}`,u=ct(t),{stylesheet:_,rules:h}=L.get(u)||qt(u,t);h[f]||(h[f]=!0,_.insertRule(`@keyframes ${f} ${d}`,_.cssRules.length));const g=t.style.animation||"";return t.style.animation=`${g?`${g}, `:""}${f} ${s}ms linear ${r}ms 1 both`,T+=1,f}function _t(t,e){const n=(t.style.animation||"").split(", "),s=n.filter(e?c=>c.indexOf(e)<0:c=>c.indexOf("__svelte")===-1),r=n.length-s.length;r&&(t.style.animation=s.join(", "),T-=r,T||Bt())}function Bt(){U(()=>{T||(L.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),L.clear())})}function _e(t,e,n,s){if(!e)return k;const r=t.getBoundingClientRect();if(e.left===r.left&&e.right===r.right&&e.top===r.top&&e.bottom===r.bottom)return k;const{delay:c=0,duration:i=300,easing:l=Z,start:o=st()+c,end:a=o+i,tick:d=k,css:f}=n(t,{from:e,to:r},s);let u=!0,_=!1,h;function g(){f&&(h=G(t,0,1,i,c,l,f)),c||(_=!0)}function p(){f&&_t(t,h),u=!1}return ot(y=>{if(!_&&y>=o&&(_=!0),_&&y>=a&&(d(1,0),p()),!u)return!1;if(_){const w=y-o,b=0+1*l(w/i);d(b,1-b)}return!0}),g(),d(0,1),p}function de(t){const e=getComputedStyle(t);if(e.position!=="absolute"&&e.position!=="fixed"){const{width:n,height:s}=e,r=t.getBoundingClientRect();t.style.position="absolute",t.style.width=n,t.style.height=s,Dt(t,r)}}function Dt(t,e){const n=t.getBoundingClientRect();if(e.left!==n.left||e.top!==n.top){const s=getComputedStyle(t),r=s.transform==="none"?"":s.transform;t.style.transform=`${r} translate(${e.left-n.left}px, ${e.top-n.top}px)`}}let M;function j(t){M=t}function S(){if(!M)throw new Error("Function called outside component initialization");return M}function he(t){S().$$.on_mount.push(t)}function me(t){S().$$.after_update.push(t)}function pe(t){S().$$.on_destroy.push(t)}function ye(){const t=S();return(e,n)=>{const s=t.$$.callbacks[e];if(s){const r=ft(e,n);s.slice().forEach(c=>{c.call(t,r)})}}}function ge(t,e){S().$$.context.set(t,e)}function be(t){return S().$$.context.get(t)}function $e(t,e){const n=t.$$.callbacks[e.type];n&&n.slice().forEach(s=>s.call(this,e))}const N=[],Y=[],O=[],J=[],dt=Promise.resolve();let K=!1;function ht(){K||(K=!0,dt.then(mt))}function xe(){return ht(),dt}function z(t){O.push(t)}function we(t){J.push(t)}const I=new Set;let D=0;function mt(){const t=M;do{for(;D<N.length;){const e=N[D];D++,j(e),Ot(e.$$)}for(j(null),N.length=0,D=0;Y.length;)Y.pop()();for(let e=0;e<O.length;e+=1){const n=O[e];I.has(n)||(I.add(n),n())}O.length=0}while(N.length);for(;J.length;)J.pop()();K=!1,I.clear(),j(t)}function Ot(t){if(t.fragment!==null){t.update(),C(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(z)}}let A;function Pt(){return A||(A=Promise.resolve(),A.then(()=>{A=null})),A}function W(t,e,n){t.dispatchEvent(ft(`${e?"intro":"outro"}${n}`))}const P=new Set;let v;function ve(){v={r:0,c:[],p:v}}function ke(){v.r||C(v.c),v=v.p}function pt(t,e){t&&t.i&&(P.delete(t),t.i(e))}function Lt(t,e,n,s){if(t&&t.o){if(P.has(t))return;P.add(t),v.c.push(()=>{P.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}const Tt={duration:0};function Ee(t,e,n,s){let r=e(t,n),c=s?0:1,i=null,l=null,o=null;function a(){o&&_t(t,o)}function d(u,_){const h=u.b-c;return _*=Math.abs(h),{a:c,b:u.b,d:h,duration:_,start:u.start,end:u.start+_,group:u.group}}function f(u){const{delay:_=0,duration:h=300,easing:g=Z,tick:p=k,css:y}=r||Tt,w={start:st()+_,b:u};u||(w.group=v,v.r+=1),i||l?l=w:(y&&(a(),o=G(t,c,u,h,_,g,y)),u&&p(0,1),i=d(w,h),z(()=>W(t,u,"start")),ot(b=>{if(l&&b>l.start&&(i=d(l,h),l=null,W(t,i.b,"start"),y&&(a(),o=G(t,c,i.b,i.duration,0,g,r.css))),i){if(b>=i.end)p(c=i.b,1-c),W(t,i.b,"end"),l||(i.b?a():--i.group.r||C(i.group.c)),i=null;else if(b>=i.start){const R=b-i.start;c=i.a+i.d*g(R/i.duration),p(c,1-c)}}return!!(i||l)}))}return{run(u){Q(r)?Pt().then(()=>{r=r(),f(u)}):f(u)},end(){a(),i=l=null}}}function zt(t,e){Lt(t,1,1,()=>{e.delete(t.key)})}function Ce(t,e){t.f(),zt(t,e)}function Se(t,e,n,s,r,c,i,l,o,a,d,f){let u=t.length,_=c.length,h=u;const g={};for(;h--;)g[t[h].key]=h;const p=[],y=new Map,w=new Map;for(h=_;h--;){const m=f(r,c,h),$=n(m);let x=i.get($);x?s&&x.p(m,e):(x=a($,m),x.c()),y.set($,p[h]=x),$ in g&&w.set($,Math.abs(h-g[$]))}const b=new Set,R=new Set;function H(m){pt(m,1),m.m(l,d),i.set(m.key,m),d=m.first,_--}for(;u&&_;){const m=p[_-1],$=t[u-1],x=m.key,q=$.key;m===$?(d=m.first,u--,_--):y.has(q)?!i.has(x)||b.has(x)?H(m):R.has(q)?u--:w.get(x)>w.get(q)?(R.add(x),H(m)):(b.add(q),u--):(o($,i),u--)}for(;u--;){const m=t[u];y.has(m.key)||o(m,i)}for(;_;)H(p[_-1]);return p}function Ae(t,e){const n={},s={},r={$$scope:1};let c=t.length;for(;c--;){const i=t[c],l=e[c];if(l){for(const o in i)o in l||(s[o]=1);for(const o in l)r[o]||(n[o]=l[o],r[o]=1);t[c]=l}else for(const o in i)r[o]=1}for(const i in s)i in n||(n[i]=void 0);return n}function Ne(t){return typeof t=="object"&&t!==null?t:{}}function je(t,e,n){const s=t.$$.props[e];s!==void 0&&(t.$$.bound[s]=n,n(t.$$.ctx[s]))}function Me(t){t&&t.c()}function Re(t,e){t&&t.l(e)}function Ft(t,e,n,s){const{fragment:r,on_mount:c,on_destroy:i,after_update:l}=t.$$;r&&r.m(e,n),s||z(()=>{const o=c.map(tt).filter(Q);i?i.push(...o):C(o),t.$$.on_mount=[]}),l.forEach(z)}function Ht(t,e){const n=t.$$;n.fragment!==null&&(C(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function It(t,e){t.$$.dirty[0]===-1&&(N.push(t),ht(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function qe(t,e,n,s,r,c,i,l=[-1]){const o=M;j(t);const a=t.$$={fragment:null,ctx:null,props:c,update:k,not_equal:r,bound:X(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:X(),dirty:l,skip_bound:!1,root:e.target||o.$$.root};i&&i(a.root);let d=!1;if(a.ctx=n?n(t,e.props||{},(f,u,..._)=>{const h=_.length?_[0]:u;return a.ctx&&r(a.ctx[f],a.ctx[f]=h)&&(!a.skip_bound&&a.bound[f]&&a.bound[f](h),d&&It(t,f)),u}):[],a.update(),d=!0,C(a.before_update),a.fragment=s?s(a.ctx):!1,e.target){if(e.hydrate){bt();const f=Nt(e.target);a.fragment&&a.fragment.l(f),f.forEach(St)}else a.fragment&&a.fragment.c();e.intro&&pt(t.$$.fragment),Ft(t,e.target,e.anchor,e.customElement),$t(),mt()}j(o)}class Be{$destroy(){Ht(this,1),this.$destroy=k}$on(e,n){const s=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return s.push(n),()=>{const r=s.indexOf(n);r!==-1&&s.splice(r,1)}}$set(e){this.$$set&&!gt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{ye as $,Ne as A,Ht as B,yt as C,xe as D,k as E,et as F,C as G,Q as H,be as I,At as J,oe as K,Gt as L,ue as M,Ct as N,Kt as O,Qt as P,Vt as Q,Xt as R,Be as S,Ut as T,fe as U,ie as V,Y as W,Jt as X,pe as Y,Zt as Z,Yt as _,Nt as a,je as a0,we as a1,$e as a2,st as a3,ot as a4,de as a5,Dt as a6,_e as a7,z as a8,Ee as a9,Se as aa,Ce as ab,se as b,re as c,St as d,lt as e,ae as f,te as g,Mt as h,qe as i,le as j,ee as k,ne as l,ce as m,ve as n,Lt as o,ke as p,pt as q,ge as r,Wt as s,V as t,me as u,he as v,Me as w,Re as x,Ft as y,Ae as z};
