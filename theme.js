/* Dark mode toggle + "Other" menu on every page. Add <script src="theme.js"></script> in each page's <head>. */
(function(){
  var HOME=/^\/(index(\.html)?)?$/.test(location.pathname);
  var BK={"/tools":"/","/login":"/","/admin":"/","/adminmain":"/","/notegen":"/tools","/timetable":"/tools","/projects":"/tools"};
  var PATH=location.pathname.replace(/\.html$/,"").replace(/\/$/,"")||"/";
  var KEY="theme",root=document.documentElement;
  function saved(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function current(){return saved()||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")}
  function apply(t){
    root.setAttribute("data-theme",t);
    var m=document.querySelector('meta[name="theme-color"]');
    if(m)m.setAttribute("content",t==="dark"?"#14132b":"#f6f5ff");
  }
  apply(current());

  var D="html[data-theme=dark] ";
  var css=
D.slice(0,-1)+"{--bg:#14132b;--ink:#ecebff;--muted:#a9a8c9;--lilac:#383266;--mint:#1f4a3a;--sky:#1f3b5c;--peach:#5a3434;--butter:#554a1e;--rose:#582f49;--accent:#7b6ff2;color-scheme:dark}"+
D+"body{background:linear-gradient(160deg,#14132b,#10201b 60%,#241615) fixed;color:var(--ink)}"+
D+".bgl::after{content:'';position:absolute;inset:0;background:#15142b;opacity:.88}"+
D+".card,"+D+".box,"+D+".trend{background:rgba(32,31,62,.82)}"+
D+".d,"+D+".u div,"+D+".step li{background:rgba(255,255,255,.09)}"+
D+".drop{background:rgba(255,255,255,.05)}"+
D+"input,"+D+"textarea,"+D+"select{background:#1b1a35;border-color:#3c3a66;color:var(--ink)}"+
D+".btn.alt,"+D+".pk button{background:#24234a;color:var(--ink)}"+
D+".d:hover{background:var(--lilac)}"+
D+".del,"+D+".box .msg{color:#ff8a80}"+
D+".ev{border-bottom-color:rgba(255,255,255,.14)}"+
D+".tile::after{background:radial-gradient(220px circle at var(--x,50%) var(--y,50%),rgba(255,255,255,.16),transparent 70%)}"+
"html.theme-anim *{transition:background-color .35s,color .35s,border-color .35s!important}"+
"#fab{position:fixed;top:12px;right:12px;z-index:50;display:flex;gap:10px;align-items:flex-start}"+
"#fab .fb{display:inline-flex;align-items:center;height:40px;padding:0 11px;border:0;border-radius:999px;font:500 14px 'DM Sans',system-ui,sans-serif;color:#27264a;background:rgba(255,255,255,.9);box-shadow:0 4px 14px -4px rgba(39,38,74,.35),inset 0 0 0 1.5px #27264a;cursor:pointer;transition:transform .2s}"+
"#fab .fb:hover{transform:translateY(-2px)}"+
"#fab .t{max-width:0;overflow:hidden;white-space:nowrap;opacity:0;transition:max-width .3s,opacity .3s,margin .3s}"+
"#fab .fb:hover .t,#fab .fb:focus-visible .t,#more.open .t{max-width:100px;opacity:1;margin-right:8px}"+
"#fab .i{position:relative;width:18px;height:18px;flex:none}"+
"#fab svg{position:absolute;inset:0;width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .45s cubic-bezier(.3,1.4,.5,1),opacity .3s}"+
"#themeBtn .sun{opacity:0;transform:rotate(-90deg) scale(.5)}"+
D+"#fab .fb{color:#ecebff;background:rgba(36,35,74,.92);box-shadow:0 4px 14px -4px rgba(0,0,0,.6),inset 0 0 0 1.5px #ecebff}"+
D+"#themeBtn .moon{opacity:0;transform:rotate(90deg) scale(.5)}"+
D+"#themeBtn .sun{opacity:1;transform:none}"+
"#moreBtn:hover svg,#more.open svg{transform:rotate(90deg)}"+
"#moreMenu{position:fixed;top:52px;right:12px;padding-top:8px;width:min(290px,calc(100vw - 24px));visibility:hidden;opacity:0;pointer-events:none;transform:translateY(-8px) scale(.96);transform-origin:top right;transition:opacity .25s,transform .35s cubic-bezier(.3,1.3,.5,1),visibility .25s}"+
"#more:hover #moreMenu,#more.open #moreMenu,#more:focus-within #moreMenu{visibility:visible;opacity:1;pointer-events:auto;transform:none}"+
"#moreMenu .p{background:rgba(255,255,255,.96);border-radius:22px;padding:8px;box-shadow:0 18px 40px -14px rgba(39,38,74,.45),inset 0 0 0 1.5px #27264a}"+
"#moreMenu a{display:flex;flex-direction:row;gap:8px;padding:10px 14px;border-radius:14px;text-decoration:none;color:#27264a;font:500 15px 'DM Sans',system-ui,sans-serif;transition:background .2s,transform .2s}"+
"#moreMenu a span{display:flex;flex-direction:column}"+
"#moreMenu a:hover,#moreMenu a:focus-visible{background:#e4defa;transform:translateX(-4px)}"+
"#moreMenu a small{color:#6b6a8c;font-weight:400;font-size:12.5px}"+
"#moreMenu hr{border:0;height:1.5px;background:rgba(39,38,74,.15);margin:6px 8px}"+
"#moreMenu a.lg{background:#5b4fd6;color:#fff;justify-content:center;margin-top:2px}"+
"#moreMenu a.lg:hover{background:#4a3fc0;transform:none}"+
D+"#moreMenu .p{background:rgba(32,31,62,.97);box-shadow:0 18px 40px -14px rgba(0,0,0,.7),inset 0 0 0 1.5px #ecebff}"+
D+"#moreMenu a{color:#ecebff}"+D+"#moreMenu a:hover,"+D+"#moreMenu a:focus-visible{background:#383266}"+
D+"#moreMenu a small{color:#a9a8c9}"+D+"#moreMenu hr{background:rgba(255,255,255,.16)}"+
D+"#moreMenu a.lg{background:#7b6ff2;color:#fff}"+
"@media (max-width:1100px){html #m.wrap{padding-top:66px}}"+
"#fab a.fb{text-decoration:none}#backBtn:hover svg{transform:translateX(-3px)}"+
"@media (prefers-reduced-motion:reduce){#fab *,#moreMenu{transition:none!important}}";
  var st=document.createElement("style");st.textContent=css;document.head.appendChild(st);

  function build(){
    var f=document.createElement("div");f.id="fab";
    f.innerHTML=
'<div id="more"><button class="fb" id="moreBtn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Other tools and login"><span class="t">Other</span><span class="i" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></svg></span></button>'+
'<div id="moreMenu"><div class="p">'+
'<a href="/tools">🧰 <span>All tools<small>Pick from the tool wheel</small></span></a>'+
'<a href="/notegen">📝 <span>Note generator<small>AI notes from photos or text</small></span></a>'+
'<a href="/timetable">🗓️ <span>Timetable<small>Plan your week your way</small></span></a>'+
'<a href="/projects">📌 <span>Project manager<small>Deadlines, reminders, teammates</small></span></a>'+
'<hr><a class="lg" href="/login?next=/tools">Login / Register</a></div></div></div>'+
'<button class="fb" id="themeBtn" type="button"><span class="t"></span><span class="i" aria-hidden="true"><svg class="moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg></span></button>';
    document.body.appendChild(f);
    if(!HOME){f.querySelector("#more").outerHTML='<a class="fb" id="backBtn" href="'+(BK[PATH]||"/adminmain")+'" aria-label="Go back"><span class="t">Back</span><span class="i" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></span></a>'}
    var b=document.getElementById("themeBtn"),mb=document.getElementById("moreBtn"),more=document.getElementById("more");
    function label(){
      var dark=root.getAttribute("data-theme")==="dark";
      b.querySelector(".t").textContent=dark?"Light mode":"Dark mode";
      b.setAttribute("aria-label",dark?"Switch to light mode":"Switch to dark mode");
      b.title=dark?"Light mode":"Dark mode";
    }
    label();
    b.onclick=function(){
      var next=root.getAttribute("data-theme")==="dark"?"light":"dark";
      root.classList.add("theme-anim");apply(next);label();
      try{localStorage.setItem(KEY,next)}catch(e){}
      setTimeout(function(){root.classList.remove("theme-anim")},450);
    };
    if(mb)mb.onclick=function(e){e.stopPropagation();var o=more.classList.toggle("open");mb.setAttribute("aria-expanded",o)};
    document.addEventListener("click",function(e){if(more&&!more.contains(e.target)){more.classList.remove("open");mb.setAttribute("aria-expanded","false")}});
    addEventListener("storage",function(e){if(e.key===KEY&&e.newValue){apply(e.newValue);label()}});
  }
  if(document.body)build();else document.addEventListener("DOMContentLoaded",build);
})();
