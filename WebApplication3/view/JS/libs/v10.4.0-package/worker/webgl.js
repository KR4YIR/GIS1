
        export function create() {
          const source = "const t=\"GENERATE_POLYGON_BUFFERS\",e=\"GENERATE_POINT_BUFFERS\",n=\"GENERATE_LINE_STRING_BUFFERS\";function r(t,e,n=2){const r=e&&e.length,o=r?e[0]*n:t.length;let u=x(t,0,o,n,!0);const f=[];if(!u||u.next===u.prev)return f;let s,l,h;if(r&&(u=function(t,e,n,r){const o=[];for(let n=0,i=e.length;n<i;n++){const u=x(t,e[n]*r,n<i-1?e[n+1]*r:t.length,r,!1);u===u.next&&(u.steiner=!0),o.push(p(u))}o.sort(c);for(let t=0;t<o.length;t++)n=a(o[t],n);return n}(t,e,u,n)),t.length>80*n){s=1/0,l=1/0;let e=-1/0,r=-1/0;for(let x=n;x<o;x+=n){const n=t[x],o=t[x+1];n<s&&(s=n),o<l&&(l=o),n>e&&(e=n),o>r&&(r=o)}h=Math.max(e-s,r-l),h=0!==h?32767/h:0}return i(u,f,n,s,l,h,0),f}function x(t,e,n,r,x){let o;if(x===function(t,e,n,r){let x=0;for(let o=e,i=n-r;o<n;o+=r)x+=(t[i]-t[o])*(t[o+1]+t[i+1]),i=o;return x}(t,e,n,r)>0)for(let x=e;x<n;x+=r)o=I(x/r|0,t[x],t[x+1],o);else for(let x=n-r;x>=e;x-=r)o=I(x/r|0,t[x],t[x+1],o);return o&&m(o,o.next)&&(z(o),o=o.next),o}function o(t,e){if(!t)return t;e||(e=t);let n,r=t;do{if(n=!1,r.steiner||!m(r,r.next)&&0!==M(r.prev,r,r.next))r=r.next;else{if(z(r),r=e=r.prev,r===r.next)break;n=!0}}while(n||r!==e);return e}function i(t,e,n,r,x,c,a){if(!t)return;!a&&c&&function(t,e,n,r){let x=t;do{0===x.z&&(x.z=y(x.x,x.y,e,n,r)),x.prevZ=x.prev,x.nextZ=x.next,x=x.next}while(x!==t);x.prevZ.nextZ=null,x.prevZ=null,function(t){let e,n=1;do{let r,x=t;t=null;let o=null;for(e=0;x;){e++;let i=x,u=0;for(let t=0;t<n&&(u++,i=i.nextZ,i);t++);let f=n;for(;u>0||f>0&&i;)0!==u&&(0===f||!i||x.z<=i.z)?(r=x,x=x.nextZ,u--):(r=i,i=i.nextZ,f--),o?o.nextZ=r:t=r,r.prevZ=o,o=r;x=i}o.nextZ=null,n*=2}while(e>1)}(x)}(t,r,x,c);let h=t;for(;t.prev!==t.next;){const y=t.prev,p=t.next;if(c?f(t,r,x,c):u(t))e.push(y.i,t.i,p.i),z(t),t=p.next,h=p.next;else if((t=p)===h){a?1===a?i(t=s(o(t),e),e,n,r,x,c,2):2===a&&l(t,e,n,r,x,c):i(o(t),e,n,r,x,c,1);break}}}function u(t){const e=t.prev,n=t,r=t.next;if(M(e,n,r)>=0)return!1;const x=e.x,o=n.x,i=r.x,u=e.y,f=n.y,s=r.y,l=Math.min(x,o,i),c=Math.min(u,f,s),a=Math.max(x,o,i),h=Math.max(u,f,s);let y=r.next;for(;y!==e;){if(y.x>=l&&y.x<=a&&y.y>=c&&y.y<=h&&g(x,u,o,f,i,s,y.x,y.y)&&M(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function f(t,e,n,r){const x=t.prev,o=t,i=t.next;if(M(x,o,i)>=0)return!1;const u=x.x,f=o.x,s=i.x,l=x.y,c=o.y,a=i.y,h=Math.min(u,f,s),p=Math.min(l,c,a),v=Math.max(u,f,s),b=Math.max(l,c,a),m=y(h,p,e,n,r),Z=y(v,b,e,n,r);let d=t.prevZ,w=t.nextZ;for(;d&&d.z>=m&&w&&w.z<=Z;){if(d.x>=h&&d.x<=v&&d.y>=p&&d.y<=b&&d!==x&&d!==i&&g(u,l,f,c,s,a,d.x,d.y)&&M(d.prev,d,d.next)>=0)return!1;if(d=d.prevZ,w.x>=h&&w.x<=v&&w.y>=p&&w.y<=b&&w!==x&&w!==i&&g(u,l,f,c,s,a,w.x,w.y)&&M(w.prev,w,w.next)>=0)return!1;w=w.nextZ}for(;d&&d.z>=m;){if(d.x>=h&&d.x<=v&&d.y>=p&&d.y<=b&&d!==x&&d!==i&&g(u,l,f,c,s,a,d.x,d.y)&&M(d.prev,d,d.next)>=0)return!1;d=d.prevZ}for(;w&&w.z<=Z;){if(w.x>=h&&w.x<=v&&w.y>=p&&w.y<=b&&w!==x&&w!==i&&g(u,l,f,c,s,a,w.x,w.y)&&M(w.prev,w,w.next)>=0)return!1;w=w.nextZ}return!0}function s(t,e){let n=t;do{const r=n.prev,x=n.next.next;!m(r,x)&&Z(r,n,n.next,x)&&A(r,x)&&A(x,r)&&(e.push(r.i,n.i,x.i),z(n),z(n.next),n=t=x),n=n.next}while(n!==t);return o(n)}function l(t,e,n,r,x,u){let f=t;do{let t=f.next.next;for(;t!==f.prev;){if(f.i!==t.i&&b(f,t)){let s=E(f,t);return f=o(f,f.next),s=o(s,s.next),i(f,e,n,r,x,u,0),void i(s,e,n,r,x,u,0)}t=t.next}f=f.next}while(f!==t)}function c(t,e){let n=t.x-e.x;if(0===n&&(n=t.y-e.y,0===n)){n=(t.next.y-t.y)/(t.next.x-t.x)-(e.next.y-e.y)/(e.next.x-e.x)}return n}function a(t,e){const n=function(t,e){let n=e;const r=t.x,x=t.y;let o,i=-1/0;if(m(t,n))return n;do{if(m(t,n.next))return n.next;if(x<=n.y&&x>=n.next.y&&n.next.y!==n.y){const t=n.x+(x-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(t<=r&&t>i&&(i=t,o=n.x<n.next.x?n:n.next,t===r))return o}n=n.next}while(n!==e);if(!o)return null;const u=o,f=o.x,s=o.y;let l=1/0;n=o;do{if(r>=n.x&&n.x>=f&&r!==n.x&&v(x<s?r:i,x,f,s,x<s?i:r,x,n.x,n.y)){const e=Math.abs(x-n.y)/(r-n.x);A(n,t)&&(e<l||e===l&&(n.x>o.x||n.x===o.x&&h(o,n)))&&(o=n,l=e)}n=n.next}while(n!==u);return o}(t,e);if(!n)return e;const r=E(n,t);return o(r,r.next),o(n,n.next)}function h(t,e){return M(t.prev,t,e.prev)<0&&M(e.next,t,t.next)<0}function y(t,e,n,r,x){return(t=1431655765&((t=858993459&((t=252645135&((t=16711935&((t=(t-n)*x|0)|t<<8))|t<<4))|t<<2))|t<<1))|(e=1431655765&((e=858993459&((e=252645135&((e=16711935&((e=(e-r)*x|0)|e<<8))|e<<4))|e<<2))|e<<1))<<1}function p(t){let e=t,n=t;do{(e.x<n.x||e.x===n.x&&e.y<n.y)&&(n=e),e=e.next}while(e!==t);return n}function v(t,e,n,r,x,o,i,u){return(x-i)*(e-u)>=(t-i)*(o-u)&&(t-i)*(r-u)>=(n-i)*(e-u)&&(n-i)*(o-u)>=(x-i)*(r-u)}function g(t,e,n,r,x,o,i,u){return!(t===i&&e===u)&&v(t,e,n,r,x,o,i,u)}function b(t,e){return t.next.i!==e.i&&t.prev.i!==e.i&&!function(t,e){let n=t;do{if(n.i!==t.i&&n.next.i!==t.i&&n.i!==e.i&&n.next.i!==e.i&&Z(n,n.next,t,e))return!0;n=n.next}while(n!==t);return!1}(t,e)&&(A(t,e)&&A(e,t)&&function(t,e){let n=t,r=!1;const x=(t.x+e.x)/2,o=(t.y+e.y)/2;do{n.y>o!=n.next.y>o&&n.next.y!==n.y&&x<(n.next.x-n.x)*(o-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next}while(n!==t);return r}(t,e)&&(M(t.prev,t,e.prev)||M(t,e.prev,e))||m(t,e)&&M(t.prev,t,t.next)>0&&M(e.prev,e,e.next)>0)}function M(t,e,n){return(e.y-t.y)*(n.x-e.x)-(e.x-t.x)*(n.y-e.y)}function m(t,e){return t.x===e.x&&t.y===e.y}function Z(t,e,n,r){const x=w(M(t,e,n)),o=w(M(t,e,r)),i=w(M(n,r,t)),u=w(M(n,r,e));return x!==o&&i!==u||(!(0!==x||!d(t,n,e))||(!(0!==o||!d(t,r,e))||(!(0!==i||!d(n,t,r))||!(0!==u||!d(n,e,r)))))}function d(t,e,n){return e.x<=Math.max(t.x,n.x)&&e.x>=Math.min(t.x,n.x)&&e.y<=Math.max(t.y,n.y)&&e.y>=Math.min(t.y,n.y)}function w(t){return t>0?1:t<0?-1:0}function A(t,e){return M(t.prev,t,t.next)<0?M(t,e,t.next)>=0&&M(t,t.prev,e)>=0:M(t,e,t.prev)<0||M(t,t.next,e)<0}function E(t,e){const n=F(t.i,t.x,t.y),r=F(e.i,e.x,e.y),x=t.next,o=e.prev;return t.next=e,e.prev=t,n.next=x,x.prev=n,r.next=n,n.prev=r,o.next=r,r.prev=o,r}function I(t,e,n,r){const x=F(t,e,n);return r?(x.next=r.next,x.prev=r,r.next.prev=x,r.next=x):(x.prev=x,x.next=x),x}function z(t){t.next.prev=t.prev,t.prev.next=t.next,t.prevZ&&(t.prevZ.nextZ=t.nextZ),t.nextZ&&(t.nextZ.prevZ=t.prevZ)}function F(t,e,n){return{i:t,x:e,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function P(t,e){const n=e[0],r=e[1];return e[0]=t[0]*n+t[2]*r+t[4],e[1]=t[1]*n+t[3]*r+t[5],e}function B(t,e){const n=(r=e)[0]*r[3]-r[1]*r[2];var r;!function(t,e){if(!t)throw new Error(e)}(0!==n,\"Transformation matrix cannot be inverted\");const x=e[0],o=e[1],i=e[2],u=e[3],f=e[4],s=e[5];return t[0]=u/n,t[1]=-o/n,t[2]=-i/n,t[3]=x/n,t[4]=(i*s-u*f)/n,t[5]=-(x*s-o*f)/n,t}new Array(6);const N=[],R={vertexPosition:0,indexPosition:0};function S(t,e,n,r,x){t[e+0]=n,t[e+1]=r,t[e+2]=x}function T(t,e,n,r,x,o){const i=3+x,u=t[e+0],f=t[e+1],s=N;s.length=x;for(let n=0;n<s.length;n++)s[n]=t[e+2+n];let l=o?o.vertexPosition:0,c=o?o.indexPosition:0;const a=l/i;return S(n,l,u,f,0),s.length&&n.set(s,l+3),l+=i,S(n,l,u,f,1),s.length&&n.set(s,l+3),l+=i,S(n,l,u,f,2),s.length&&n.set(s,l+3),l+=i,S(n,l,u,f,3),s.length&&n.set(s,l+3),l+=i,r[c++]=a,r[c++]=a+1,r[c++]=a+3,r[c++]=a+1,r[c++]=a+2,r[c++]=a+3,R.vertexPosition=l,R.indexPosition=c,R}function _(t,e,n,r,x,o,i,u,f,s,l){const c=10+u.length,a=o.length/c,h=[t[e+0],t[e+1]],y=[t[n],t[n+1]],p=t[e+2],v=t[n+2],g=P(f,[...h]),b=P(f,[...y]);function M(t,e,n){const r=Math.sqrt((e[0]-t[0])*(e[0]-t[0])+(e[1]-t[1])*(e[1]-t[1])),x=[(e[0]-t[0])/r,(e[1]-t[1])/r],o=[-x[1],x[0]],i=Math.sqrt((n[0]-t[0])*(n[0]-t[0])+(n[1]-t[1])*(n[1]-t[1])),u=[(n[0]-t[0])/i,(n[1]-t[1])/i],f=0===r||0===i?0:Math.acos((s=u[0]*x[0]+u[1]*x[1],l=-1,c=1,Math.min(Math.max(s,l),c)));var s,l,c;return u[0]*o[0]+u[1]*o[1]>0?f:2*Math.PI-f}let m=-1,Z=-1,d=l;const w=null!==x;if(null!==r){m=M(g,b,P(f,[...[t[r],t[r+1]]])),Math.cos(m)<=.985&&(d+=Math.tan((m-Math.PI)/2))}if(w){Z=M(b,g,P(f,[...[t[x],t[x+1]]])),Math.cos(Z)<=.985&&(d+=Math.tan((Math.PI-Z)/2))}function A(t,e){return 0===e?1e4*t:Math.sign(e)*(1e4*t+Math.abs(e))}return o.push(h[0],h[1],p,y[0],y[1],v,m,Z,s,A(0,l)),o.push(...u),o.push(h[0],h[1],p,y[0],y[1],v,m,Z,s,A(1,l)),o.push(...u),o.push(h[0],h[1],p,y[0],y[1],v,m,Z,s,A(2,l)),o.push(...u),o.push(h[0],h[1],p,y[0],y[1],v,m,Z,s,A(3,l)),o.push(...u),i.push(a,a+1,a+2,a+1,a+3,a+2),{length:s+Math.sqrt((b[0]-g[0])*(b[0]-g[0])+(b[1]-g[1])*(b[1]-g[1])),angle:d}}function O(t,e,n,x,o){const i=2+o;let u=e;const f=t.slice(u,u+o);u+=o;const s=t[u++];let l=0;const c=new Array(s-1);for(let e=0;e<s;e++)l+=t[u++],e<s-1&&(c[e]=l);const a=t.slice(u,u+2*l),h=r(a,c,2);for(let t=0;t<h.length;t++)x.push(h[t]+n.length/i);for(let t=0;t<a.length;t+=2)n.push(a[t],a[t+1],...f);return u+2*l}const U=self;U.onmessage=r=>{const x=r.data;switch(x.type){case e:{const t=3,e=2,n=x.customAttributesSize,r=e+n,o=new Float32Array(x.renderInstructions),i=o.length/r,u=4*i*(n+t),f=new Uint32Array(6*i),s=new Float32Array(u);let l;for(let t=0;t<o.length;t+=r)l=T(o,t,s,f,n,l);const c=Object.assign({vertexBuffer:s.buffer,indexBuffer:f.buffer,renderInstructions:o.buffer},x);U.postMessage(c,[s.buffer,f.buffer,o.buffer]);break}case n:{const t=[],e=[],n=x.customAttributesSize,r=3,o=new Float32Array(x.renderInstructions);let i=0;const u=[1,0,0,1,0,0];let f,s;for(B(u,x.renderInstructionsTransform);i<o.length;){s=Array.from(o.slice(i,i+n)),i+=n,f=o[i++];const x=i,l=i+(f-1)*r,c=o[x]===o[l]&&o[x+1]===o[l+1];let a=0,h=0;for(let n=0;n<f-1;n++){let y=null;n>0?y=i+(n-1)*r:c&&(y=l-r);let p=null;n<f-2?p=i+(n+2)*r:c&&(p=x+r);const v=_(o,i+n*r,i+(n+1)*r,y,p,t,e,s,u,a,h);a=v.length,h=v.angle}i+=f*r}const l=Uint32Array.from(e),c=Float32Array.from(t),a=Object.assign({vertexBuffer:c.buffer,indexBuffer:l.buffer,renderInstructions:o.buffer},x);U.postMessage(a,[c.buffer,l.buffer,o.buffer]);break}case t:{const t=[],e=[],n=x.customAttributesSize,r=new Float32Array(x.renderInstructions);let o=0;for(;o<r.length;)o=O(r,o,t,e,n);const i=Uint32Array.from(e),u=Float32Array.from(t),f=Object.assign({vertexBuffer:u.buffer,indexBuffer:i.buffer,renderInstructions:r.buffer},x);U.postMessage(f,[u.buffer,i.buffer,r.buffer]);break}}};";
          return new Worker(typeof Blob === 'undefined'
            ? 'data:application/javascript;base64,' + Buffer.from(source, 'binary').toString('base64')
            : URL.createObjectURL(new Blob([source], {type: 'application/javascript'})));
        }
      
