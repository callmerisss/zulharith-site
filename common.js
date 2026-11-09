const SUPABASE_URL="https://mesaszwdqcrzlpwnlhzf.supabase.co",SUPABASE_KEY="sb_publishable_ufV3JHtv5IZXw3UqZlLLXw_Qqv_NnME",API="https://zulharith-api.zzzick123.workers.dev";
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY),$=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=b=>b<1048576?Math.max(1,Math.round(b/1024))+" KB":(b/1048576).toFixed(1)+" MB";
document.head.insertAdjacentHTML("beforeend",`<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%235b4fd6'/%3E%3Cpath d='M20 20h24L20 44h24' fill='none' stroke='white' stroke-width='6.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">`);
// Cloudflare Worker (private file storage), sends the Supabase login token
async function api(p,o={}){const {data}=await sb.auth.getSession();return fetch(API+p,{...o,headers:{...o.headers,Authorization:"Bearer "+(data.session?.access_token||"")}})}
const blobs={},errs={};
async function blobUrl(k){if(blobs[k])return blobs[k];try{const r=await api("/file?key="+encodeURIComponent(k));if(!r.ok){errs[k]=r.status;console.warn("File load failed:",r.status,await r.text());return null}return blobs[k]=URL.createObjectURL(await r.blob())}catch(e){errs[k]="blocked or no connection";console.warn("File load error:",e);return null}}
async function upload(f){const r=await api("/upload?name="+encodeURIComponent(f.name),{method:"PUT",headers:{"Content-Type":f.type||"application/octet-stream"},body:f});if(!r.ok)throw new Error(r.status+" "+(await r.text()).slice(0,120));return (await r.json()).path}
async function removeFile(k){try{await api("/file?key="+encodeURIComponent(k),{method:"DELETE"})}catch(e){}if(blobs[k]){URL.revokeObjectURL(blobs[k]);delete blobs[k]}}
async function boot(start){
  const {data}=await sb.auth.getSession();
  if(!data.session){location.replace("/admin");return}
  sb.auth.onAuthStateChange(e=>{if(e==="SIGNED_OUT")location.replace("/admin")});
  const t=document.body.dataset.title;
  if(t)$("bar").innerHTML=`<div><a class="back" href="/adminmain">← Dashboard</a><h1>${esc(t)}</h1></div><button class="btn sm" id="out">Log out</button>`;
  $("out").onclick=()=>sb.auth.signOut();
  $("m").hidden=false;start();
}
