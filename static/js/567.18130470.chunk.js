"use strict";(self.webpackChunkmeet=self.webpackChunkmeet||[]).push([[567],{1567:(t,e,r)=>{r.r(e),r.d(e,{default:()=>y});var a=r(5043),s=r(108),n=r(2336),o=r(7734),l=r(2185),c=r(6026),i=r(6150),u=r(7943),d=r(3005),h=r(579);const y=t=>{let{events:e,allLocations:r}=t;const{isDarkMode:y}=(0,a.useContext)(d.D),[f,m]=(0,a.useState)([]),E=(0,a.useMemo)((()=>{if(!Array.isArray(r)||!Array.isArray(e)||0===r.length||0===e.length)return[];return r.map((t=>{const r=e.filter((e=>e.location===t)).length;return{city:t.split(/, | - /)[0],count:r}}))}),[r,e]);return(0,a.useEffect)((()=>{m(E)}),[E]),0===f.length?(0,h.jsx)("div",{children:"No data available for chart"}):(0,h.jsx)(s.u,{width:"99%",height:400,children:(0,h.jsxs)(n.t,{style:{backgroundColor:y?"#4A6987":"#FFEEE6"},margin:{top:20,right:20,bottom:65,left:-30},children:[(0,h.jsx)(o.d,{stroke:y?"#495670":"#ccc"}),(0,h.jsx)(l.W,{type:"category",dataKey:"city",name:"City",angle:45,interval:0,tick:{dy:2,textAnchor:"start",transform:"translate(10, 0)"},stroke:y?"#ECF0F1":"#333"}),(0,h.jsx)(c.h,{type:"number",dataKey:"count",name:"Number of Events",allowDecimals:!1,stroke:y?"#ECF0F1":"#333",label:{value:"Number of Events",angle:-90,position:"insideLeft"}}),(0,h.jsx)(i.m,{cursor:{strokeDasharray:"3 3"},contentStyle:{backgroundColor:y?"#FFEEE6":"#fff",color:y?"#ECF0F1":"#333",border:"1px solid "+(y?"#ECF0F1":"#ccc")}}),(0,h.jsx)(u.X,{name:"Events by City",data:f,fill:y?"#ECF0F1":"#0F4BB8"})]})})}}}]);
//# sourceMappingURL=567.18130470.chunk.js.map