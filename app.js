(() => {
  const SAVE_KEY = "judys-pony-pal-v1";

  const horses = [
    { id:"rosie", name:"Rosie", body:"#f3a7c4", light:"#ffd5e4", mane:"#734c79", mark:"star" },
    { id:"buttercup", name:"Buttercup", body:"#e9be70", light:"#ffe3a9", mane:"#fff1c8", mark:"blaze" },
    { id:"mochi", name:"Mochi", body:"#e6e4e8", light:"#ffffff", mane:"#99909f", mark:"dapples" },
    { id:"cocoa", name:"Cocoa", body:"#a66b58", light:"#d99983", mane:"#493741", mark:"socks" },
    { id:"lavender", name:"Lavender", body:"#c7b2e7", light:"#eadfff", mane:"#775fa4", mark:"star" },
    { id:"pepper", name:"Pepper", body:"#665d68", light:"#968b99", mane:"#312b34", mark:"blaze" }
  ];

  const outfits = [
    { id:"none", icon:"♡", speak:"No outfit" },
    { id:"bow", icon:"🎀", speak:"Pretty bow" },
    { id:"flower", icon:"🌼", speak:"Flower" },
    { id:"halter", icon:"💗", speak:"Pink halter" },
    { id:"blanket", icon:"🩷", speak:"Pony blanket" },
    { id:"crown", icon:"👑", speak:"Princess crown" },
    { id:"wings", icon:"🪽", speak:"Magic wings" }
  ];

  const baseNames = Object.fromEntries(horses.map(h => [h.id, h.name]));
  const baseStyles = Object.fromEntries(horses.map(h => [h.id, { body:h.body, light:h.light, mane:h.mane }]));

  const $ = s => document.querySelector(s);
  const els = {
    horseStrip: $("#horseStrip"), ponyName: $("#ponyName"), pony: $("#ponySvg"),
    world: $("#world"), closet: $("#closet"), closetGrid: $("#closetGrid"),
    parentSheet: $("#parentSheet"), toast: $("#toast"), loveBurst: $("#loveBurst")
  };

  let state = loadState();
  normalize();
  renderAll();
  wire();

  function defaultState(){
    return {
      version:4,
      currentHorse:"rosie",
      horseNames:{...baseNames},
      horseStyles:JSON.parse(JSON.stringify(baseStyles)),
      accessory:"bow",
      scene:"meadow",
      friendship:30,
      lastVisit:Date.now()
    };
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
    }catch{ return defaultState(); }
  }

  function normalize(){
    const d = defaultState();
    if(!horses.some(h => h.id === state.currentHorse)) state.currentHorse = "rosie";
    state.horseNames = { ...d.horseNames, ...(state.horseNames || {}) };
    state.horseStyles = { ...d.horseStyles, ...(state.horseStyles || {}) };
    horses.forEach(h => state.horseStyles[h.id] = { ...d.horseStyles[h.id], ...(state.horseStyles[h.id] || {}) });
    if(!outfits.some(o => o.id === state.accessory)) state.accessory = "bow";
    if(!["meadow","stable","show"].includes(state.scene)) state.scene = "meadow";
    state.friendship = Math.max(0, Math.min(100, Number(state.friendship) || 30));
    state.version = 4;
    save();
  }

  function save(){
    state.lastVisit = Date.now();
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function activeHorse(){ return horses.find(h => h.id === state.currentHorse) || horses[0]; }
  function activeName(){ return state.horseNames?.[state.currentHorse] || activeHorse().name; }
  function activeStyle(){ return state.horseStyles?.[state.currentHorse] || activeHorse(); }

  function renderAll(){
    renderHorseStrip();
    renderHorse();
    renderCloset();
  }

  function renderHorseStrip(){
    els.horseStrip.innerHTML = "";
    horses.forEach(h => {
      const style = state.horseStyles[h.id] || h;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "horse-choice" + (h.id === state.currentHorse ? " active" : "");
      b.setAttribute("aria-label", `Choose ${state.horseNames[h.id] || h.name}`);
      b.style.setProperty("--mini-body", style.body);
      b.style.setProperty("--mini-mane", style.mane);
      b.innerHTML = `<span class="mini-pony" aria-hidden="true"><span class="mini-face"><span class="mini-mane"></span><span class="mini-eye"></span><span class="mini-muzzle"></span></span></span>`;
      b.addEventListener("click", () => {
        state.currentHorse = h.id;
        save();
        renderAll();
        animate("happy");
        hearts(8);
        say(activeName());
      });
      els.horseStrip.appendChild(b);
    });
  }

  function renderHorse(){
    const h = activeHorse();
    const style = activeStyle();
    document.documentElement.style.setProperty("--body-color", style.body);
    document.documentElement.style.setProperty("--body-light", style.light || style.body);
    document.documentElement.style.setProperty("--mane-color", style.mane);
    els.ponyName.textContent = activeName();
    els.pony.setAttribute("aria-label", `${activeName()}, a cute pony`);

    ["Star","Blaze","Dapples","Socks"].forEach(m => $("#mark"+m)?.classList.add("hidden"));
    if(h.mark) $("#mark" + cap(h.mark))?.classList.remove("hidden");

    ["Bow","Flower","Crown","Halter","Blanket","Wings"].forEach(a => $("#acc"+a)?.classList.add("hidden"));
    if(state.accessory !== "none") $("#acc" + cap(state.accessory))?.classList.remove("hidden");

    els.world.className = `world ${state.scene}`;
    document.querySelectorAll("[data-scene]").forEach(b => b.classList.toggle("active", b.dataset.scene === state.scene));
  }

  function renderCloset(){
    els.closetGrid.innerHTML = "";
    outfits.forEach(o => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "closet-item" + (o.id === state.accessory ? " selected" : "");
      b.setAttribute("aria-label", o.speak);
      b.innerHTML = `<span aria-hidden="true">${o.icon}</span>`;
      b.addEventListener("click", () => {
        state.accessory = o.id;
        state.friendship = Math.min(100, state.friendship + 2);
        save();
        renderHorse();
        renderCloset();
        animate("happy");
        hearts(7);
        chime(660);
        say(o.speak);
      });
      els.closetGrid.appendChild(b);
    });
  }

  function wire(){
    document.querySelectorAll(".toy-button").forEach(b => b.addEventListener("click", () => action(b.dataset.action)));
    $("#ponyTap").addEventListener("click", () => {
      animate("happy");
      hearts(10);
      chime(620);
      say(activeName());
    });
    $("#closeCloset").addEventListener("click", () => els.closet.close());
    $("#parentButton").addEventListener("click", () => els.parentSheet.showModal());
    $("#closeParent").addEventListener("click", () => els.parentSheet.close());
    document.querySelectorAll("[data-scene]").forEach(b => b.addEventListener("click", () => {
      state.scene = b.dataset.scene;
      save();
      renderHorse();
      chime(520);
      say(b.dataset.scene === "stable" ? "Stable" : b.dataset.scene === "show" ? "Horse show" : "Flower meadow");
    }));
    $("#exportSave").addEventListener("click", exportSave);
    $("#importSave").addEventListener("change", importSave);
    $("#resetGame").addEventListener("click", () => {
      if(confirm("Start Judy's pony game over?")){
        localStorage.removeItem(SAVE_KEY);
        state = defaultState();
        save();
        renderAll();
        els.parentSheet.close();
      }
    });
  }

  function action(kind){
    if(kind === "dress"){
      renderCloset();
      els.closet.showModal();
      chime(560);
      say("Dress up");
      return;
    }

    const gains = { feed:5, brush:6, ride:7 };
    state.friendship = Math.min(100, state.friendship + (gains[kind] || 1));
    save();

    if(kind === "feed"){
      animate("eat");
      hearts(6, "🍎");
      chime(480);
      say("Apple for " + activeName());
    }
    if(kind === "brush"){
      animate("brushing");
      hearts(6, "✨");
      chime(590);
      say("Brush brush");
    }
    if(kind === "ride"){
      animate("ride");
      hearts(8, "★");
      chime(720);
      say("Let's ride!");
    }
  }

  function animate(cls){
    els.pony.classList.remove("happy","ride","brushing","eat");
    void els.pony.offsetWidth;
    els.pony.classList.add(cls);
    setTimeout(() => els.pony.classList.remove(cls), 1200);
  }

  function hearts(count=8, symbol="♥"){
    els.loveBurst.innerHTML = "";
    const box = els.loveBurst.getBoundingClientRect();
    for(let i=0;i<count;i++){
      const s = document.createElement("i");
      s.textContent = symbol;
      s.style.left = `${36 + Math.random()*30}%`;
      s.style.top = `${43 + Math.random()*28}%`;
      s.style.animationDelay = `${Math.random()*.14}s`;
      if(symbol === "✨") s.style.color = i%2 ? "#fff" : "#ffd759";
      if(symbol === "★") s.style.color = "#ffd759";
      els.loveBurst.appendChild(s);
    }
    setTimeout(() => els.loveBurst.innerHTML = "", 1100);
  }

  function say(text){
    try{
      if(!("speechSynthesis" in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = .88;
      u.pitch = 1.3;
      u.volume = .72;
      speechSynthesis.speak(u);
    }catch{}
  }

  function chime(freq){
    try{
      const A = window.AudioContext || window.webkitAudioContext;
      if(!A) return;
      chime.ctx ||= new A();
      const ctx = chime.ctx;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      o.frequency.exponentialRampToValueAtTime(freq*1.18, ctx.currentTime+.12);
      g.gain.setValueAtTime(.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(.055, ctx.currentTime+.02);
      g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime+.18);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime+.2);
    }catch{}
  }

  function exportSave(){
    const blob = new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "judys-ponies-backup.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importSave(e){
    const file = e.target.files?.[0];
    if(!file) return;
    const r = new FileReader();
    r.onload = () => {
      try{
        state = { ...defaultState(), ...JSON.parse(r.result) };
        normalize();
        renderAll();
        els.parentSheet.close();
        toast("Saved!");
      }catch{ alert("That backup file did not work."); }
      e.target.value = "";
    };
    r.readAsText(file);
  }

  function toast(msg){
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(() => els.toast.classList.remove("show"), 1100);
  }

  function cap(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
})();
