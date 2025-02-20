import{bisector as re,tickStep as K}from"../d3-array@3.2.4/index.js";const w=new Date,k=new Date;function o(e,t,n,F){function u(s){return e(s=arguments.length===0?new Date:new Date(+s)),s}return u.floor=s=>(e(s=new Date(+s)),s),u.ceil=s=>(e(s=new Date(s-1)),t(s,1),e(s),s),u.round=s=>{const a=u(s),i=u.ceil(s);return s-a<i-s?a:i},u.offset=(s,a)=>(t(s=new Date(+s),a==null?1:Math.floor(a)),s),u.range=(s,a,i)=>{const h=[];if(s=u.ceil(s),i=i==null?1:Math.floor(i),!(s<a)||!(i>0))return h;let r;do h.push(r=new Date(+s)),t(s,i),e(s);while(r<s&&s<a);return h},u.filter=s=>o(a=>{if(a>=a)for(;e(a),!s(a);)a.setTime(a-1)},(a,i)=>{if(a>=a)if(i<0)for(;++i<=0;)for(;t(a,-1),!s(a););else for(;--i>=0;)for(;t(a,1),!s(a););}),n&&(u.count=(s,a)=>(w.setTime(+s),k.setTime(+a),e(w),e(k),Math.floor(n(w,k))),u.every=s=>(s=Math.floor(s),!isFinite(s)||!(s>0)?null:s>1?u.filter(F?a=>F(a)%s===0:a=>u.count(0,a)%s===0):u)),u}const U=o(()=>{},(e,t)=>{e.setTime(+e+t)},(e,t)=>t-e);U.every=e=>(e=Math.floor(e),!isFinite(e)||!(e>0)?null:e>1?o(t=>{t.setTime(Math.floor(t/e)*e)},(t,n)=>{t.setTime(+t+n*e)},(t,n)=>(n-t)/e):U);const L=U.range,m=1e3,l=6e4,M=36e5,D=864e5,W=6048e5,N=2592e6,x=31536e6,d=o(e=>{e.setTime(e-e.getMilliseconds())},(e,t)=>{e.setTime(+e+t*m)},(e,t)=>(t-e)/m,e=>e.getUTCSeconds()),B=d.range,O=o(e=>{e.setTime(e-e.getMilliseconds()-e.getSeconds()*m)},(e,t)=>{e.setTime(+e+t*l)},(e,t)=>(t-e)/l,e=>e.getMinutes()),le=O.range,p=o(e=>{e.setUTCSeconds(0,0)},(e,t)=>{e.setTime(+e+t*l)},(e,t)=>(t-e)/l,e=>e.getUTCMinutes()),ge=p.range,z=o(e=>{e.setTime(e-e.getMilliseconds()-e.getSeconds()*m-e.getMinutes()*l)},(e,t)=>{e.setTime(+e+t*M)},(e,t)=>(t-e)/M,e=>e.getHours()),ce=z.range,I=o(e=>{e.setUTCMinutes(0,0,0)},(e,t)=>{e.setTime(+e+t*M)},(e,t)=>(t-e)/M,e=>e.getUTCHours()),Te=I.range,b=o(e=>e.setHours(0,0,0,0),(e,t)=>e.setDate(e.getDate()+t),(e,t)=>(t-e-(t.getTimezoneOffset()-e.getTimezoneOffset())*l)/D,e=>e.getDate()-1),me=b.range,E=o(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/D,e=>e.getUTCDate()-1),Me=E.range,j=o(e=>{e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCDate(e.getUTCDate()+t)},(e,t)=>(t-e)/D,e=>Math.floor(e/D)),de=j.range;function f(e){return o(t=>{t.setDate(t.getDate()-(t.getDay()+7-e)%7),t.setHours(0,0,0,0)},(t,n)=>{t.setDate(t.getDate()+n*7)},(t,n)=>(n-t-(n.getTimezoneOffset()-t.getTimezoneOffset())*l)/W)}const Y=f(0),G=f(1),J=f(2),P=f(3),Q=f(4),R=f(5),V=f(6),X=Y.range,fe=G.range,ye=J.range,he=P.range,Ce=Q.range,Ue=R.range,De=V.range;function y(e){return o(t=>{t.setUTCDate(t.getUTCDate()-(t.getUTCDay()+7-e)%7),t.setUTCHours(0,0,0,0)},(t,n)=>{t.setUTCDate(t.getUTCDate()+n*7)},(t,n)=>(n-t)/W)}const H=y(0),Z=y(1),_=y(2),ee=y(3),te=y(4),se=y(5),ae=y(6),ne=H.range,Fe=Z.range,$e=_.range,Ye=ee.range,He=te.range,Se=se.range,ve=ae.range,q=o(e=>{e.setDate(1),e.setHours(0,0,0,0)},(e,t)=>{e.setMonth(e.getMonth()+t)},(e,t)=>t.getMonth()-e.getMonth()+(t.getFullYear()-e.getFullYear())*12,e=>e.getMonth()),we=q.range,A=o(e=>{e.setUTCDate(1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCMonth(e.getUTCMonth()+t)},(e,t)=>t.getUTCMonth()-e.getUTCMonth()+(t.getUTCFullYear()-e.getUTCFullYear())*12,e=>e.getUTCMonth()),ke=A.range,S=o(e=>{e.setMonth(0,1),e.setHours(0,0,0,0)},(e,t)=>{e.setFullYear(e.getFullYear()+t)},(e,t)=>t.getFullYear()-e.getFullYear(),e=>e.getFullYear());S.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:o(t=>{t.setFullYear(Math.floor(t.getFullYear()/e)*e),t.setMonth(0,1),t.setHours(0,0,0,0)},(t,n)=>{t.setFullYear(t.getFullYear()+n*e)});const We=S.range,v=o(e=>{e.setUTCMonth(0,1),e.setUTCHours(0,0,0,0)},(e,t)=>{e.setUTCFullYear(e.getUTCFullYear()+t)},(e,t)=>t.getUTCFullYear()-e.getUTCFullYear(),e=>e.getUTCFullYear());v.every=e=>!isFinite(e=Math.floor(e))||!(e>0)?null:o(t=>{t.setUTCFullYear(Math.floor(t.getUTCFullYear()/e)*e),t.setUTCMonth(0,1),t.setUTCHours(0,0,0,0)},(t,n)=>{t.setUTCFullYear(t.getUTCFullYear()+n*e)});const xe=v.range;function ue(e,t,n,F,u,s){const a=[[d,1,m],[d,5,5*m],[d,15,15*m],[d,30,30*m],[s,1,l],[s,5,5*l],[s,15,15*l],[s,30,30*l],[u,1,M],[u,3,3*M],[u,6,6*M],[u,12,12*M],[F,1,D],[F,2,2*D],[n,1,W],[t,1,N],[t,3,3*N],[e,1,x]];function i(r,g,T){const C=g<r;C&&([r,g]=[g,r]);const c=T&&typeof T.range=="function"?T:h(r,g,T),$=c?c.range(r,+g+1):[];return C?$.reverse():$}function h(r,g,T){const C=Math.abs(g-r)/T,c=re(([,,ie])=>ie).right(a,C);if(c===a.length)return e.every(K(r/x,g/x,T));if(c===0)return U.every(Math.max(K(r,g,T),1));const[$,oe]=a[C/a[c-1][2]<a[c][2]/C?c-1:c];return $.every(oe)}return[i,h]}const[Oe,pe]=ue(v,A,H,j,I,p),[ze,Ie]=ue(S,q,Y,b,z,O);export{b as timeDay,me as timeDays,R as timeFriday,Ue as timeFridays,z as timeHour,ce as timeHours,o as timeInterval,U as timeMillisecond,L as timeMilliseconds,O as timeMinute,le as timeMinutes,G as timeMonday,fe as timeMondays,q as timeMonth,we as timeMonths,V as timeSaturday,De as timeSaturdays,d as timeSecond,B as timeSeconds,Y as timeSunday,X as timeSundays,Q as timeThursday,Ce as timeThursdays,Ie as timeTickInterval,ze as timeTicks,J as timeTuesday,ye as timeTuesdays,P as timeWednesday,he as timeWednesdays,Y as timeWeek,X as timeWeeks,S as timeYear,We as timeYears,j as unixDay,de as unixDays,E as utcDay,Me as utcDays,se as utcFriday,Se as utcFridays,I as utcHour,Te as utcHours,U as utcMillisecond,L as utcMilliseconds,p as utcMinute,ge as utcMinutes,Z as utcMonday,Fe as utcMondays,A as utcMonth,ke as utcMonths,ae as utcSaturday,ve as utcSaturdays,d as utcSecond,B as utcSeconds,H as utcSunday,ne as utcSundays,te as utcThursday,He as utcThursdays,pe as utcTickInterval,Oe as utcTicks,_ as utcTuesday,$e as utcTuesdays,ee as utcWednesday,Ye as utcWednesdays,H as utcWeek,ne as utcWeeks,v as utcYear,xe as utcYears};
