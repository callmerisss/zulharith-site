const SUPABASE_URL="https://mesaszwdqcrzlpwnlhzf.supabase.co",SUPABASE_KEY="sb_publishable_ufV3JHtv5IZXw3UqZlLLXw_Qqv_NnME",API="https://zulharith-api.zzzick123.workers.dev";
const sb=supabase.createClient(SUPABASE_URL,SUPABASE_KEY),$=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const fmt=b=>b<1048576?Math.max(1,Math.round(b/1024))+" KB":(b/1048576).toFixed(1)+" MB";
document.head.insertAdjacentHTML("beforeend",`<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%235b4fd6'/%3E%3Cpath d='M20 20h24L20 44h24' fill='none' stroke='white' stroke-width='6.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E">`);

// ---- session handling ----
const IDLE_MS=30*60*1000,LAST="lastActive";
const touch=()=>{try{localStorage.setItem(LAST,String(Date.now()))}catch(e){}};
const isIdle=()=>{try{const t=+localStorage.getItem(LAST);return !!t&&Date.now()-t>IDLE_MS}catch(e){return false}};

// Logs out THIS device only, and never waits on the Supabase library (which can hang on its internal lock):
// 1) wipe the saved login from this browser, 2) tell Supabase to end just this session (best effort), 3) go to login.
function logout(){
  const keys=Object.keys(localStorage).filter(k=>/^sb-.*-auth-token/.test(k));
  let tok=null;
  try{tok=JSON.parse(localStorage.getItem(keys[0])||"null")?.access_token||null}catch(e){}
  keys.forEach(k=>localStorage.removeItem(k));
  try{localStorage.removeItem(LAST)}catch(e){}
  if(tok)fetch(SUPABASE_URL+"/auth/v1/logout?scope=local",{method:"POST",keepalive:true,headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+tok}}).catch(()=>{});
  location.replace("/admin");
}

// Cloudflare Worker (private file storage), sends the Supabase login token
async function api(p,o={}){
  const {data}=await sb.auth.getSession();
  const r=await fetch(API+p,{...o,headers:{...o.headers,Authorization:"Bearer "+(data.session?.access_token||"")}});
  if(r.status===401)logout(); // session no longer valid: back to login
  return r;
}
const blobs={},errs={};
async function blobUrl(k){if(blobs[k])return blobs[k];try{const r=await api("/file?key="+encodeURIComponent(k));if(!r.ok){errs[k]=r.status;console.warn("File load failed:",r.status,await r.text());return null}return blobs[k]=URL.createObjectURL(await r.blob())}catch(e){errs[k]="blocked or no connection";console.warn("File load error:",e);return null}}
async function upload(f){const r=await api("/upload?name="+encodeURIComponent(f.name),{method:"PUT",headers:{"Content-Type":f.type||"application/octet-stream"},body:f});if(!r.ok)throw new Error(r.status+" "+(await r.text()).slice(0,120));return (await r.json()).path}
async function removeFile(k){try{await api("/file?key="+encodeURIComponent(k),{method:"DELETE"})}catch(e){}if(blobs[k]){URL.revokeObjectURL(blobs[k]);delete blobs[k]}}

async function boot(start){
  const {data}=await sb.auth.getSession();
  if(!data.session){location.replace("/admin");return}
  if((data.session.user.email||"").toLowerCase()!=="zzzick123@gmail.com"){location.replace("/tools");return}
  // Away for more than 30 minutes? Log out.
  if(isIdle()){logout();return}
  touch();
  sb.auth.onAuthStateChange(e=>{if(e==="SIGNED_OUT")location.replace("/admin")});

  // Any activity on this device resets the 30-minute timer
  let last=0;
  const act=()=>{const n=Date.now();if(n-last>10000){last=n;touch()}};
  ["pointerdown","keydown","scroll","touchstart","mousemove"].forEach(ev=>addEventListener(ev,act,{passive:true}));
  const check=()=>{if(isIdle())logout()};
  setInterval(check,30000);
  document.addEventListener("visibilitychange",()=>{if(!document.hidden)check()});

  const t=document.body.dataset.title;
  if(t)$("bar").innerHTML=`<div><a class="back" href="/adminmain">← Dashboard</a><h1>${esc(t)}</h1></div><button class="btn sm" id="out">Log out</button>`;
  $("out").onclick=logout;
  $("m").hidden=false;start();
}

// Re-run fn whenever the table changes (waits 250ms so bursts, like uploading 5 photos, cause one refresh)
function live(table,fn){
  let t;
  sb.channel(table+"-live").on("postgres_changes",{event:"*",schema:"public",table},()=>{clearTimeout(t);t=setTimeout(fn,250)}).subscribe();
}
