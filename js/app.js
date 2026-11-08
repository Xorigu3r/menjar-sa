// ============================================================
//  Xoriguer · APP (pantalles, dades, escàner)
//  Depèn de: i18n.js (t, applyI18n…) i rules.js (classify, evalProfiles…)
// ============================================================
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const store = {
  get(k, def){ try{ const v = localStorage.getItem(k); return v === null ? def : JSON.parse(v); }catch{ return def; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }
};
const BRAND = "#16a34a";

// ---------- Etiquetes (colors i icones fixos, textos traduïts) ----------
const CAT_STYLE = {real:{c:"#16a34a", i:"ti-mood-happy"}, bo:{c:"#e08a0b", i:"ti-mood-smile"}, ultra:{c:"#dc2626", i:"ti-mood-sad"}, nd:{c:"#6b7280", i:"ti-help-circle"}};
const LV_STYLE  = {ok:{c:"#16a34a", i:"ti-mood-happy"}, mid:{c:"#e08a0b", i:"ti-mood-neutral"}, bad:{c:"#dc2626", i:"ti-mood-sad"}, nd:{c:"#6b7280", i:"ti-help-circle"}};
const LAB = cat => ({...CAT_STYLE[cat], t: t(`lab_${cat}_t`), d: t(`lab_${cat}_d`)});
const LEV = lv  => ({...LV_STYLE[lv],   t: t(`lv_${lv}_t`),   d: t(`lv_${lv}_d`)});
const REASON_ICON = {good:"ti-circle-check", mid:"ti-alert-circle", bad:"ti-circle-x"};
const PROFILE_ICON = {diab:"ti-droplet-half-2", hta:"ti-activity-heartbeat", cor:"ti-heart-rate-monitor", col:"ti-heart", sa:"ti-leaf"};
const reasonText = r => t(r.id, r.v);
const pName = p => pickName(p) || t("unnamed");

// ---------- Perfil i avisos ----------
const getProfile = () => { const a = store.get("rf_profile", null); return Array.isArray(a) && a.length ? a : ["sa"]; };
const setProfile = a => store.set("rf_profile", a);
const onlyHealthy = () => { const a = getProfile(); return a.length === 1 && a[0] === "sa"; };
const getPrefs = () => store.get("rf_prefs", []);
const setPrefs = a => store.set("rf_prefs", a);
const prefsFor = p => checkPrefs(p, getPrefs());

function verdict(p){
  const e = evalProfiles(p, getProfile());
  return {...e, lab: onlyHealthy() ? LAB(e.cls.cat) : LEV(e.level), mode: onlyHealthy() ? "sa" : "prof"};
}

// ---------- Dades afegides per tu ----------
const getCustom = () => store.get("rf_custom", {});
const setCustom = c => store.set("rf_custom", c);
function applyCustom(base, c){
  const p = Object.assign({}, base || {});
  p.product_name = c.name || pickName(p);
  for (const l of ["ca","es","en","fr","pt","it"]){ delete p["ingredients_text_" + l]; if (c.name) delete p["product_name_" + l]; }
  p.ingredients_text = c.ingredients;
  p.additives_tags = []; p.nova_group = undefined;
  p.nutriments = Object.assign({}, p.nutriments || {});
  if (c.sugar != null) p.nutriments.sugars_100g = c.sugar;
  if (c.salt  != null) p.nutriments.salt_100g  = c.salt;
  if (c.sat   != null) p.nutriments["saturated-fat_100g"] = c.sat;
  p._custom = true;
  return p;
}

// ---------- Els meus productes (preferits) ----------
const getFavs = () => store.get("rf_favs", {});
const setFavs = f => store.set("rf_favs", f);
const isFav = code => !!getFavs()[code];
function toggleFav(code, p){
  const f = getFavs();
  if (f[code]) delete f[code]; else { f[code] = {name: pName(p), at: Date.now()}; putCache(code, p._custom ? baseCache[code] || p : p); }
  setFavs(f); drawFavs(); drawHist();
  if (navigator.vibrate) navigator.vibrate(30);
  return !!f[code];
}

// ---------- Memòria de productes (per quan no hi ha cobertura) ----------
const getCache = () => store.get("rf_cache", {});
function putCache(code, p){
  const c = getCache();
  c[code] = Object.assign({}, p, {_t: Date.now()});
  const keys = Object.keys(c);
  const favs = getFavs();
  const old = keys.filter(k => !favs[k]);   // els preferits no s'esborren mai
  if (old.length > 150) old.sort((a,b) => c[a]._t - c[b]._t).slice(0, old.length - 150).forEach(k => delete c[k]);
  store.set("rf_cache", c);
}

// ---------- Fonts de dades ----------
const L6 = ["ca","es","en","fr","pt","it"];
const FIELDS = ["code","product_name","brands","nova_group","nutriscore_grade","ingredients_text","additives_tags","allergens_tags","traces_tags",
  "categories_tags","image_front_small_url","nutriments","serving_size","serving_quantity",
  ...L6.map(l => "product_name_" + l), ...L6.map(l => "ingredients_text_" + l)].join(",");
const baseCache = {};

async function fetchOFF(code){
  const r = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=${FIELDS}`);
  const j = await r.json();
  return j.status === 1 && j.product ? j.product : null;
}

// USDA FoodData Central (EUA): segona font, útil per a productes d'importació americans.
// Clau gratuïta de demostració (limitada). Es pot canviar per una pròpia gratuïta a api.data.gov.
const USDA_KEY = "DEMO_KEY";
const looksAmerican = code => { const c13 = code.padStart(13, "0"); return c13[0] === "0" || c13.startsWith("1"); };
async function fetchUSDA(code){
  const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}&dataType=Branded&pageSize=5&query=${code.replace(/^0+/, "")}`;
  const j = await (await fetch(url)).json();
  const strip = s => String(s || "").replace(/^0+/, "");
  const f = (j.foods || []).find(x => strip(x.gtinUpc) === strip(code));
  if (!f) return null;
  const nut = num => { const x = (f.foodNutrients || []).find(n => String(n.nutrientNumber) === num); return x ? x.value : undefined; };
  const sodium = nut("307");
  const p = {
    code, product_name: (f.description || "").replace(/\b\w/g, c => c.toUpperCase()).replace(/\B\w/g, c => c.toLowerCase()),
    brands: f.brandName || f.brandOwner || "", ingredients_text_en: (f.ingredients || "").toLowerCase(),
    nutriments: {sugars_100g: nut("269"), salt_100g: sodium !== undefined ? sodium / 1000 * 2.5 : undefined,
                 "saturated-fat_100g": nut("606"), fiber_100g: nut("291"), carbohydrates_100g: nut("205"), "trans-fat_100g": nut("605")},
    _src: "usda"
  };
  if (f.servingSize && /^(g|ml|grm|mlt)$/i.test(f.servingSizeUnit || "")){ p.serving_quantity = f.servingSize; p.serving_size = `${Math.round(f.servingSize)} ${/^m/i.test(f.servingSizeUnit) ? "ml" : "g"}`; }
  return p;
}

// Retorna {p, fromCache} · {notFound:true} · {offline:true}
async function getProduct(code){
  const custom = getCustom()[code];
  let base = null, offline = false;
  try{ base = await fetchOFF(code); }catch{ offline = true; }
  const thin = !base || (!hasIngr(base) && !Object.keys(base.nutriments || {}).length);
  if (!offline && thin && looksAmerican(code)){
    try{ const u = await fetchUSDA(code); if (u) base = Object.assign({}, base || {}, u); }catch{}
  }
  let fromCache = false;
  if (base) putCache(code, base);
  else if (offline){ base = getCache()[code] || null; fromCache = !!base; }
  baseCache[code] = base;
  if (custom && !hasIngr(base)) return {p: applyCustom(base, custom), fromCache};
  if (base) return {p: base, fromCache};
  return offline ? {offline:true} : {notFound:true};
}

async function lookup(code){
  code = (code || "").replace(/\D/g, "");
  if (!code) return;
  $("loading").classList.remove("hidden");
  const res = await getProduct(code);
  $("loading").classList.add("hidden");
  if (cmpA && res.p && cmpA.code !== code){
    const a = cmpA; cmpA = null; $("scanCmp").classList.add("hidden");
    histSave(code, res.p);
    return showCompare(a, {code, p: res.p});
  }
  if (res.p) return showResult(code, res.p, res.fromCache);
  if (res.offline) return showMessage("ti-wifi-off", t("msg_offline_t"), t("msg_offline_d"));
  showNotFound(code);
}

// ---------- Pantalla de resultat ----------
function openResult(color, html){
  const el = $("result");
  el.style.setProperty("--vcol", color);
  el.innerHTML = html;
  el.classList.remove("hidden");
  $("themeColor").setAttribute("content", color);
  el.querySelectorAll("[data-again]").forEach(b => b.onclick = () => { closeResult(); startScan(); });
  el.querySelectorAll("[data-close]").forEach(b => b.onclick = closeResult);
  el.querySelectorAll("[data-edit]").forEach(b => b.onclick = () => openEditor(b.dataset.edit));
  el.querySelectorAll("[data-cmp]").forEach(b => b.onclick = () => startCompare(b.dataset.cmp));
  el.querySelectorAll("[data-alt]").forEach(b => b.onclick = () => findAlternatives(b.dataset.alt));
  el.querySelectorAll("[data-fav]").forEach(b => b.onclick = () => {
    if (!lastShown || lastShown.code !== b.dataset.fav) return;
    const on = toggleFav(b.dataset.fav, lastShown.p);
    b.classList.toggle("on", on); b.setAttribute("aria-label", t(on ? "fav_remove" : "fav_add"));
  });
}
function closeResult(){ $("result").classList.add("hidden"); $("themeColor").setAttribute("content", BRAND); }
const topBar = () => `<div class="resTop"><button class="round" data-close aria-label="${esc(t("back"))}"><i class="ti ti-arrow-left"></i></button><span style="font-weight:700">Xoriguer</span><span style="width:44px"></span></div>`;
const againBtn = (cls = "again") => `<button class="${cls}" data-again><i class="ti ti-scan"></i>${esc(t("again"))}</button>`;
const editBtn = (code, key, icon = "ti-pencil-plus") => `<button class="again alt" data-edit="${code}"><i class="ti ${icon}"></i>${esc(t(key))}</button>`;
const offBtn = code => `<a class="offBtn" href="https://world.openfoodfacts.org/product/${code}" target="_blank" rel="noopener"><i class="ti ti-world-upload"></i>${esc(t("add_off"))}</a><p class="offNote">${esc(t("add_off_note"))}</p>`;
const imgHtml = (url, cls = "ph", icon = "ti-package") => url
  ? `<img src="${esc(url)}" alt="" loading="lazy" onerror="this.outerHTML='<div class=&quot;${cls}&quot;><i class=&quot;ti ${icon}&quot;></i></div>'">`
  : `<div class="${cls}"><i class="ti ${icon}"></i></div>`;

function alertsHtml(w){
  const names = ids => ids.map(id => t("pf_" + id)).join(", ");
  let h = "";
  if (w.contains.length) h += `<div class="alertBox red"><i class="ti ti-alert-triangle"></i><div><b>${esc(t("al_contains", {list: names(w.contains)}))}</b><span>${esc(t("al_marked"))}</span></div></div>`;
  if (w.traces.length) h += `<div class="alertBox amber"><i class="ti ti-alert-circle"></i><div><b>${esc(t("al_traces", {list: names(w.traces)}))}</b></div></div>`;
  return h;
}
function profilesHtml(V){
  if (onlyHealthy()) return "";
  return `<div class="profs">${Object.entries(V.per).map(([id, o]) => {
    const L = LEV(o.lv);
    const bad = o.reasons.filter(r => r.k !== "good").slice(0, 2).map(reasonText);
    const txt = bad.length ? bad.join(" · ") : (o.reasons.find(r => r.k === "good") ? reasonText(o.reasons.find(r => r.k === "good")) : t("no_problem"));
    return `<div class="prow"><span class="pic" style="background:${L.c}"><i class="ti ${PROFILE_ICON[id]}"></i></span>
      <span class="ptx"><b>${esc(t("ps_" + id))}</b><span>${esc(txt)}</span></span>
      <span class="plv" style="background:${L.c}">${esc(t("lvs_" + o.lv))}</span></div>`;
  }).join("")}</div>`;
}
function portionHtml(p){
  const q = parseFloat(p.serving_quantity);
  const n = p.nutriments || {};
  if (!(q > 0 && q < 1000)) return "";
  const vals = [["sugars_100g","portion_sugar"],["salt_100g","portion_salt"],["saturated-fat_100g","portion_sat"]]
    .filter(([k]) => n[k] !== undefined && n[k] !== null && !isNaN(n[k]))
    .map(([k, lbl]) => `<div><b>${esc(fmtNum(n[k] * q / 100))} g</b><span>${esc(t(lbl))}</span></div>`);
  if (!vals.length) return "";
  const g = p.serving_size || `${fmtNum(q)} g`;
  return `<div class="portion"><div class="ph1">${esc(t("portion_title", {g}))}</div><div class="pg">${vals.join("")}</div></div>`;
}
function reasonsList(rs){
  return `<ul class="reasons">${rs.map(r => `<li class="${r.k}"><i class="ti ${REASON_ICON[r.k]}"></i><span>${esc(reasonText(r))}</span></li>`).join("")}</ul>`;
}

let lastShown = null;
function showResult(code, p, fromCache = false){
  const V = verdict(p);
  const {cat, reasons, nova, ingrRaw} = V.cls;
  const L = V.lab, lvl = V.level;
  const warn = prefsFor(p);
  lastShown = {code, p};
  const ns = (p.nutriscore_grade || "").toUpperCase();
  let rs = onlyHealthy() ? reasons : [].concat(...Object.values(V.per).map(o => o.reasons));
  rs = rs.filter((r, i, a) => a.findIndex(z => reasonText(z) === reasonText(r)) === i);
  const detail = rs.length ? (onlyHealthy() ? reasonsList(rs) : `<details><summary>${esc(t("see_all"))} <i class="ti ti-chevron-down"></i></summary>${reasonsList(rs)}</details>`) : "";
  const needData = cat === "nd" || lvl === "nd";
  openResult(L.c, `
    ${topBar()}
    <div class="verdict"><i class="ti ${L.i}"></i><h2>${esc(L.t)}</h2><p>${esc(L.d)}</p>${fromCache ? `<span class="offline"><i class="ti ti-wifi-off"></i> ${esc(t("offline_badge"))}</span>` : ""}</div>
    <div class="sheet">
      <div class="grab"></div>
      <div class="prod">${imgHtml(p.image_front_small_url)}<div class="t2"><div class="n">${esc(pName(p))}</div><div class="b">${esc(p.brands || "")}${p.brands ? " · " : ""}${code}</div></div>
        ${lvl !== "nd" || cat !== "nd" ? `<button class="favBtn ${isFav(code) ? "on" : ""}" data-fav="${code}" aria-label="${esc(t(isFav(code) ? "fav_remove" : "fav_add"))}"><i class="ti ti-star"></i></button>` : ""}</div>
      <div class="pills">
        ${nova ? `<span class="pill">NOVA ${nova}</span>` : ""}
        ${ns && "ABCDE".includes(ns) && !p._custom ? `<span class="pill">Nutri-Score ${ns}</span>` : ""}
        ${p._custom ? `<span class="pill"><i class="ti ti-user"></i> ${esc(t("custom_pill"))}</span>` : ""}
        ${p._src === "usda" ? `<span class="pill">${esc(t("usda_pill"))}</span>` : ""}
      </div>
      ${alertsHtml(warn)}
      ${profilesHtml(V)}
      ${portionHtml(p)}
      ${detail}
      ${ingrRaw ? `<details><summary>${esc(t("ingredients"))} <i class="ti ti-chevron-down"></i></summary><p>${esc(ingrRaw)}</p></details>` : ""}
      ${(lvl === "bad" || lvl === "mid") && (p.categories_tags || []).length ? `<div class="altSec" id="altSec"><button class="altBtn" data-alt="${code}"><i class="ti ti-leaf"></i>${esc(t("alt_btn"))}</button></div>` : ""}
      ${againBtn()}
      ${lvl !== "nd" ? `<button class="again alt" data-cmp="${code}"><i class="ti ti-arrows-left-right"></i>${esc(t("compare_btn"))}</button>` : ""}
      ${needData ? editBtn(code, cat === "nd" ? "add_ingr" : "add_nutri") : p._custom ? editBtn(code, "edit_mine", "ti-pencil") : ""}
      ${needData && !p._custom ? offBtn(code) : ""}
    </div>`);
  histSave(code, p, V);
  if (navigator.vibrate) navigator.vibrate(warn.contains.length ? [200,80,200] : lvl === "bad" ? [60,60,60] : 40);
}

function showNotFound(code){
  openResult(CAT_STYLE.nd.c, `
    ${topBar()}
    <div class="verdict"><i class="ti ti-search-off"></i><h2>${esc(t("nf_title"))}</h2><p>${esc(t("nf_sub"))}</p></div>
    <div class="sheet"><div class="grab"></div>
      <div class="prod"><div class="ph"><i class="ti ti-barcode"></i></div><div><div class="n">${esc(t("nf_code", {code}))}</div><div class="b">Open Food Facts</div></div></div>
      <ul class="reasons">
        <li class="good"><i class="ti ti-circle-check"></i><span>${esc(t("nf_good"))}</span></li>
        <li class="bad"><i class="ti ti-circle-x"></i><span>${esc(t("nf_bad"))}</span></li>
      </ul>
      <button class="primaryBtn" style="margin-top:18px" data-edit="${code}"><i class="ti ti-camera"></i>${esc(t("add_ingr"))}</button>
      ${offBtn(code)}
      ${againBtn("again alt")}
    </div>`);
}
function showMessage(icon, title, text, extra = ""){
  openResult(CAT_STYLE.nd.c, `${topBar()}
    <div class="verdict"><i class="ti ${icon}"></i><h2>${esc(title)}</h2><p>${esc(text)}</p></div>
    <div class="sheet"><div class="grab"></div>${extra}${againBtn()}</div>`);
}
function showQrNoProduct(text){
  const isUrl = /^https?:\/\//i.test(text);
  showMessage("ti-qrcode", t("qr_t"), t("qr_d"),
    `<p style="margin:0;font-size:14px;color:var(--muted)">${esc(t("qr_tip"))}</p>
     <div class="linkBox">${isUrl ? `${esc(t("qr_link"))} <a href="${esc(text)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text)}</div>`);
}

// ---------- Formulari d'ingredients ----------
let edCode = null;
function openEditor(code){
  edCode = code;
  const c = getCustom()[code] || {};
  const base = baseCache[code];
  $("edCode").textContent = t("nf_code", {code});
  $("edName").value = c.name || (base ? pickName(base) : "") || "";
  $("edIngr").value = c.ingredients || "";
  $("edSugar").value = c.sugar ?? ""; $("edSalt").value = c.salt ?? ""; $("edSat").value = c.sat ?? "";
  $("edDelete").classList.toggle("hidden", !getCustom()[code]);
  ["edPreview","edOcr","edErr"].forEach(id => $(id).classList.add("hidden"));
  $("editor").classList.remove("hidden"); $("editor").scrollTop = 0;
}
const closeEditor = () => $("editor").classList.add("hidden");
const numOrNull = v => { const n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? null : n; };
$("edSave").onclick = () => {
  const ingredients = $("edIngr").value.trim();
  if (!ingredients){ $("edErr").classList.remove("hidden"); $("edIngr").focus(); return; }
  const c = getCustom();
  c[edCode] = {name: $("edName").value.trim(), ingredients, sugar: numOrNull($("edSugar").value), salt: numOrNull($("edSalt").value), sat: numOrNull($("edSat").value)};
  setCustom(c); closeEditor();
  showResult(edCode, applyCustom(baseCache[edCode], c[edCode]));
};
$("edDelete").onclick = () => {
  if (!confirm(t("ed_confirm"))) return;
  const c = getCustom(); delete c[edCode]; setCustom(c);
  closeEditor(); closeResult();
  setHist(getHist().filter(x => x.code !== edCode)); drawHist();
};
$("edClose").onclick = closeEditor;
$("edIngr").addEventListener("input", () => $("edErr").classList.add("hidden"));

// ---------- Llegir text de la foto (OCR dins del mòbil) ----------
// Versions fixades: no poden canviar sense que ho decidim nosaltres
const TESS = {js:"https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js",
              worker:"https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
              core:"https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1",
              lang:"https://tessdata.projectnaptha.com/4.0.0"};
const OCR_LANGS = {ca:["cat","spa"], es:["spa","cat"], en:["eng","spa"], fr:["fra","spa"], pt:["por","spa"], it:["ita","spa"]};
const loadScript = (src, test) => test() ? Promise.resolve() : new Promise((ok, ko) => {
  const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => ko(new Error("load")); document.head.appendChild(s);
});
function prepareImage(file){
  return new Promise((ok, ko) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, 1800 / Math.max(img.width, img.height));
      const cv = document.createElement("canvas");
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
      const ctx = cv.getContext("2d"); ctx.filter = "grayscale(1) contrast(1.4)";
      ctx.drawImage(img, 0, 0, cv.width, cv.height); URL.revokeObjectURL(img.src); ok(cv);
    };
    img.onerror = () => ko(new Error("img"));
    img.src = URL.createObjectURL(file);
  });
}
function cleanOcr(text){
  let s = text.replace(/\r/g, "").replace(/-\n/g, "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
  const start = norm(s).search(/ingredient[a-z]*\s*[:.;]?/);
  if (start >= 0){ s = s.slice(start).replace(/^\S*\s*[:.;]?\s*/, ""); }
  const end = norm(s).search(/(informacion nutricional|informacio nutricional|valor energetic|valores medios|valors mitjans|nutrition|valeurs nutritionnelles|informations nutritionnelles|informacao nutricional|declaracao nutricional|valori nutrizionali|dichiarazione nutrizionale|conservar en|conservese|a conserver|conservare|consumir preferent|best before|a consommer de preference|consumir de preferencia|da consumarsi|puede contener|pot contenir|may contain|peut contenir|pode conter|puo contenere)/);
  if (end > 20) s = s.slice(0, end);
  return s.replace(/[|_~*]/g, "").trim().replace(/[.,;\s]+$/, "");
}
$("edPhoto").onchange = async e => {
  const file = e.target.files && e.target.files[0]; e.target.value = "";
  if (!file) return;
  $("edPreview").src = URL.createObjectURL(file); $("edPreview").classList.remove("hidden");
  $("edOcr").classList.remove("hidden");
  const bar = $("edBar"), st = $("edStatus");
  bar.style.width = "5%"; st.textContent = t("ocr_loading");
  let worker;
  try{
    await loadScript(TESS.js, () => !!window.Tesseract);
    const canvas = await prepareImage(file);
    worker = await Tesseract.createWorker(OCR_LANGS[window.XLANG] || OCR_LANGS.ca, 1, {
      workerPath: TESS.worker, corePath: TESS.core, langPath: TESS.lang,
      logger: m => {
        if (m.status === "recognizing text"){ bar.style.width = (20 + m.progress * 80) + "%"; st.textContent = t("ocr_reading", {p: Math.round(m.progress * 100)}); }
        else if (/load|initializ/.test(m.status)){ bar.style.width = "15%"; st.textContent = t("ocr_preparing"); }
      }
    });
    const {data} = await worker.recognize(canvas);
    const txt = cleanOcr(data.text || "");
    bar.style.width = "100%";
    if (txt.length < 5) st.textContent = t("ocr_fail");
    else { $("edIngr").value = txt; $("edErr").classList.add("hidden"); st.textContent = t("ocr_done"); }
  }catch{ st.textContent = t("ocr_err"); }
  finally{ if (worker) worker.terminate(); }
};

// ---------- Mida del text ----------
const ZOOM = {1: 1, 2: 1.15, 3: 1.3};
const getZoom = () => { const z = store.get("rf_zoom", 1); return ZOOM[z] ? z : 1; };
function applyZoom(){ document.documentElement.style.setProperty("--zoom", ZOOM[getZoom()]); }
function drawSize(){ document.querySelectorAll("#sizeSel button").forEach(b => b.classList.toggle("on", +b.dataset.z === getZoom())); }
document.querySelectorAll("#sizeSel button").forEach(b => b.onclick = () => { store.set("rf_zoom", +b.dataset.z); applyZoom(); drawSize(); });
applyZoom();

// ---------- Pantalla de perfil ----------
function drawLangSel(){
  $("langSel").innerHTML = LANGS.map(l => `<option value="${l.id}" ${l.id === window.XLANG ? "selected" : ""}>${l.name}</option>`).join("");
}
$("langSel").onchange = e => { setLang(e.target.value); refreshAll(); };
function toggleRow(listId, items, active, onToggle){
  $(listId).innerHTML = items.map(x => `<div class="pref ${active.has(x.id) ? "on" : ""}" data-id="${x.id}" role="switch" aria-checked="${active.has(x.id)}">
    <span class="pi"><i class="ti ${x.i}"></i></span><span class="pt">${esc(x.t)}</span><span class="sw"></span></div>`).join("");
  $(listId).querySelectorAll(".pref").forEach(el => el.onclick = () => onToggle(el.dataset.id));
}
function drawProfile(){
  toggleRow("profList", PROFILE_IDS.map(id => ({id, i: PROFILE_ICON[id], t: t("p_" + id)})), new Set(getProfile()), id => {
    const a = new Set(getProfile()); a.has(id) ? a.delete(id) : a.add(id); setProfile([...a]); drawProfile(); drawLegend(); drawFavs(); drawHist();
  });
}
function drawPrefs(){
  toggleRow("prefList", PREFS.map(x => ({id: x.id, i: x.i, t: t("pf_" + x.id)})), new Set(getPrefs()), id => {
    const a = new Set(getPrefs()); a.has(id) ? a.delete(id) : a.add(id); setPrefs([...a]); drawPrefs(); drawFavs(); drawHist();
  });
}
function drawLegend(){
  const L = onlyHealthy() ? ["real","bo","ultra"].map(LAB) : ["ok","mid","bad"].map(LEV);
  $("legend").innerHTML = L.map(x => `<div><i class="ti ${x.i}" style="color:${x.c}"></i>${esc(x.t)}</div>`).join("");
  const names = getProfile().map(id => t("ps_" + id)).join(" · ");
  $("profBar").innerHTML = `<i class="ti ti-user-heart"></i><div><b>${esc(t("pb_title", {names}))}</b><span>${esc(t("pb_sub"))}</span></div><i class="ti ti-chevron-right go"></i>`;
}
$("profBar").onclick = () => document.querySelector('[data-tab="prefs"]').click();

// ---------- Alternatives més sanes ----------
async function findAlternatives(code){
  const box = $("altSec"); if (!box) return;
  const base = (lastShown && lastShown.code === code) ? lastShown.p : baseCache[code];
  const curLv = LV_RANK[verdict(base).level];
  const cats = (base.categories_tags || []).slice(-2).reverse();
  const head = `<h3><i class="ti ti-leaf" style="color:var(--real)"></i>${esc(t("alt_title"))}</h3>`;
  box.innerHTML = `${head}<div class="altMsg"><div class="spin" style="margin:6px auto 8px;width:34px;height:34px;border-width:4px"></div>${esc(t("alt_searching"))}</div>`;
  let found = [];
  try{
    for (const tag of cats){
      const url = `https://world.openfoodfacts.org/api/v2/search?categories_tags=${encodeURIComponent(tag)}&countries_tags=en:spain&fields=${FIELDS}&page_size=60&sort_by=popularity_key`;
      const j = await (await fetch(url)).json();
      const list = (j.products || []).filter(x => x.code && x.code !== code && hasIngr(x))
        .map(x => ({x, v: verdict(x)}))
        .filter(o => o.v.level !== "nd" && LV_RANK[o.v.level] < curLv && !prefsFor(o.x).contains.length);
      list.sort((a, b) => LV_RANK[a.v.level] - LV_RANK[b.v.level]);
      found = list.slice(0, 6);
      if (found.length) break;
    }
  }catch{ box.innerHTML = `<div class="altMsg"><i class="ti ti-wifi-off"></i> ${esc(t("alt_offline"))}</div>`; return; }
  if (!found.length){ box.innerHTML = `${head}<div class="altMsg">${esc(t("alt_none"))}</div>`; return; }
  box.innerHTML = `${head}<div>${found.map(({x, v}) => `
    <button class="alt" data-code="${esc(x.code)}">${imgHtml(x.image_front_small_url)}
      <span class="t"><div class="n">${esc(pName(x))}</div><div class="c">${esc(x.brands || "")}</div></span>
      <span class="tag" style="background:${v.lab.c}">${esc(v.lab.t)}</span></button>`).join("")}</div>`;
  box.querySelectorAll(".alt").forEach(b => b.onclick = () => {
    const o = found.find(f => f.x.code === b.dataset.code); if (o) putCache(o.x.code, o.x);
    lookup(b.dataset.code);
  });
}

// ---------- Comparar dos productes ----------
let cmpA = null;
function startCompare(code){
  if (!lastShown || lastShown.code !== code) return;
  cmpA = {code, p: lastShown.p};
  closeResult();
  $("scanCmp").textContent = t("cmp_banner", {name: pName(cmpA.p)});
  $("scanCmp").classList.remove("hidden");
  startScan();
}
function cmpData(o){
  const V = verdict(o.p), c = V.cls, n = o.p.nutriments || {};
  return {code: o.code, p: o.p, name: pName(o.p), lv: V.level, lab: V.lab,
    sugar: n.sugars_100g, salt: n.salt_100g, sat: n["saturated-fat_100g"],
    adds: c.addCount, count: c.count || undefined, warn: prefsFor(o.p).contains.length,
    bad: c.reasons.filter(r => r.k === "bad").length};
}
function showCompare(a, b){
  const A = cmpData(a), B = cmpData(b);
  const score = d => LV_RANK[d.lv] * 100 + d.warn * 50 + d.bad * 10 + (d.adds || 0) + (d.sugar || 0) / 10;
  const sa = score(A), sb = score(B);
  const win = Math.abs(sa - sb) < 0.5 ? -1 : (sa < sb ? 0 : 1);
  const fmt = (v, u = "") => v === undefined || v === null || isNaN(v) ? "–" : `${fmtNum(v)}${u}`;
  const row = (lbl, va, vb, u = "", show = null) => {
    let ba = "", bb = "";
    if (va != null && vb != null && va !== vb) (va < vb) ? ba = "best" : bb = "best";
    const [ta, tb] = show || [fmt(va, u), fmt(vb, u)];
    return `<div class="cmpRow"><div class="lbl">${esc(lbl)}</div><div class="cell ${ba}">${esc(ta)}</div><div class="cell ${bb}">${esc(tb)}</div></div>`;
  };
  const card = (d, i) => `<div class="cmpCard ${win === i ? "win" : ""}" data-i="${i}">${win === i ? `<span class="crown">${esc(t("cmp_best_badge"))}</span>` : ""}
      ${imgHtml(d.p.image_front_small_url)}<div class="n">${esc(d.name)}</div><div class="v" style="background:${d.lab.c}"><i class="ti ${d.lab.i}"></i>${esc(d.lab.t)}</div></div>`;
  const el = $("compare");
  el.innerHTML = `<div class="cmpWrap">
    <div class="edTop"><button class="round" id="cmpClose" aria-label="${esc(t("close"))}"><i class="ti ti-arrow-left"></i></button><div><h2>${esc(t("cmp_title"))}</h2><p>${esc(t("cmp_sub"))}</p></div></div>
    <div class="cmpHead">${card(A, 0)}${card(B, 1)}</div>
    <div class="cmpVerdict">${esc(win === -1 ? t("cmp_similar") : t("cmp_best", {name: (win === 0 ? A : B).name}))}</div>
    <div class="cmpTable" style="margin-top:12px">
      ${row(t(onlyHealthy() ? "row_class" : "row_profile"), LV_RANK[A.lv], LV_RANK[B.lv], "", [A.lab.t, B.lab.t])}
      ${getPrefs().length ? row(t("row_alerts"), A.warn, B.warn) : ""}
      ${row(t("row_sugar"), A.sugar, B.sugar, " g")}
      ${row(t("row_salt"), A.salt, B.salt, " g")}
      ${row(t("row_sat"), A.sat, B.sat, " g")}
      ${row(t("row_adds"), A.adds, B.adds)}
      ${row(t("row_ingr"), A.count, B.count)}
    </div>
    ${againBtn().replace("data-again", 'id="cmpAgain"')}
  </div>`;
  el.classList.remove("hidden"); el.scrollTop = 0;
  $("themeColor").setAttribute("content", BRAND);
  $("cmpClose").onclick = () => el.classList.add("hidden");
  $("cmpAgain").onclick = () => { el.classList.add("hidden"); startScan(); };
  el.querySelectorAll(".cmpCard").forEach(c => c.onclick = () => { const d = c.dataset.i === "0" ? A : B; el.classList.add("hidden"); showResult(d.code, d.p); });
  if (navigator.vibrate) navigator.vibrate(40);
}
let cmpMode = false, cmpSel = [];
function setCmpMode(on){
  cmpMode = on; cmpSel = [];
  $("btnCmpMode").classList.toggle("on", on);
  $("btnCmpMode").querySelector("span").textContent = t(on ? "cmp_toggle_on" : "cmp_toggle");
  drawHist();
}
async function histClick(code){
  if (!cmpMode) return lookup(code);
  cmpSel = cmpSel.includes(code) ? cmpSel.filter(c => c !== code) : [...cmpSel, code].slice(-2);
  drawHist();
  if (cmpSel.length === 2){
    $("loading").classList.remove("hidden");
    const [ra, rb] = await Promise.all(cmpSel.map(getProduct));
    $("loading").classList.add("hidden");
    const sel = cmpSel.slice(); setCmpMode(false);
    if (ra.p && rb.p) showCompare({code: sel[0], p: ra.p}, {code: sel[1], p: rb.p});
    else alert(t("cmp_fail"));
  }
}

// ---------- Historial ----------
const getHist = () => store.get("rf_hist", []);
const setHist = h => store.set("rf_hist", h);
function histSave(code, p, V){
  V = V || verdict(p);
  const h = getHist().filter(x => x.code !== code);
  h.unshift({code, name: pName(p), cat: V.cls.cat, lv: V.level, mode: V.mode, at: Date.now()});
  setHist(h.slice(0, 50)); drawHist();
}
// L'etiqueta es calcula en l'idioma actual (les entrades antigues guarden la seva)
// Valoració amb el perfil actual a partir de les dades guardades; si no n'hi ha, la que es va guardar
function labelFor(code){
  let p = getCache()[code] || null; const c = getCustom()[code];
  if (c && !(p && hasIngr(p))) p = applyCustom(p, c);
  return p ? verdict(p) : null;
}
const histLabel = x => { const V = labelFor(x.code); if (V) return V.lab;
  return x.mode === "prof" ? LEV(x.lv) : x.mode === "sa" ? LAB(x.cat) : (x.v || LAB(x.cat || "nd")); };
function itemHtml(x, selectable = false, label = null){
  const L = label || histLabel(x);
  const sel = selectable && cmpSel.includes(x.code);
  return `<button class="item ${sel ? "sel" : ""}" data-c="${x.code}">
    <span class="badge" style="background:${L.c}"><i class="ti ${L.i}"></i></span>
    <span class="t"><div class="n">${isFav(x.code) ? '<i class="ti ti-star star"></i> ' : ""}${esc(x.name)}</div><div class="c">${esc(L.t)}</div></span>
    ${selectable ? `<span class="chk">${sel ? '<i class="ti ti-check"></i>' : ""}</span>` : `<i class="ti ti-chevron-right chev"></i>`}</button>`;
}
// Els preferits es valoren de nou amb el perfil actual (a partir de les dades guardades)
function favItems(){
  const f = getFavs(), cache = getCache(), custom = getCustom();
  return Object.entries(f).map(([code, x]) => {
    let p = cache[code] || null;
    if (custom[code] && !(p && hasIngr(p))) p = applyCustom(p, custom[code]);
    const V = p ? verdict(p) : null;
    const rank = V ? (onlyHealthy() ? LV_RANK[CAT2LV[V.cls.cat]] : LV_RANK[V.level]) : 9;
    return {code, name: p ? pName(p) : x.name, L: V ? V.lab : LAB("nd"), rank};
  }).sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name));
}
function drawFavs(){
  const items = favItems();
  $("favWrap").classList.toggle("hidden", !items.length);
  $("favList").innerHTML = items.map(x => itemHtml(x, false, x.L)).join("");
  $("favList").querySelectorAll(".item").forEach(el => el.onclick = () => lookup(el.dataset.c));
}
let histFilter = "all";
document.querySelectorAll("#histFilter button").forEach(b => b.onclick = () => {
  histFilter = b.dataset.f;
  document.querySelectorAll("#histFilter button").forEach(x => x.classList.toggle("on", x === b));
  if (cmpMode) setCmpMode(false); else drawHist();
});
function drawHist(){
  if (histFilter === "favs"){
    const items = favItems();
    $("recentWrap").classList.toggle("hidden", !getHist().length);
    $("recent").innerHTML = getHist().slice(0, 4).map(x => itemHtml(x)).join("");
    $("recent").querySelectorAll(".item").forEach(el => el.onclick = () => lookup(el.dataset.c));
    $("histCount").textContent = t("fav_count", {n: items.length});
    $("btnCmpMode").classList.toggle("hidden", items.length < 2);
    $("btnCmpMode").querySelector("span").textContent = t(cmpMode ? "cmp_toggle_on" : "cmp_toggle");
    $("histList").innerHTML = items.length ? items.map(x => itemHtml(x, cmpMode, x.L)).join("") : `<div class="empty"><i class="ti ti-star"></i>${esc(t("fav_none"))}</div>`;
    $("btnClear").classList.add("hidden");
    $("histList").querySelectorAll(".item").forEach(el => el.onclick = () => histClick(el.dataset.c));
    return;
  }
  const h = getHist();
  $("recentWrap").classList.toggle("hidden", !h.length);
  $("recent").innerHTML = h.slice(0, 4).map(x => itemHtml(x)).join("");
  $("histCount").textContent = t("hist_count", {n: h.length});
  $("btnCmpMode").classList.toggle("hidden", h.length < 2);
  $("btnCmpMode").querySelector("span").textContent = t(cmpMode ? "cmp_toggle_on" : "cmp_toggle");
  $("histList").innerHTML = h.length ? h.map(x => itemHtml(x, cmpMode)).join("") : `<div class="empty"><i class="ti ti-basket"></i>${esc(t("hist_empty"))}</div>`;
  $("btnClear").classList.toggle("hidden", !h.length);
  $("recent").querySelectorAll(".item").forEach(el => el.onclick = () => lookup(el.dataset.c));
  $("histList").querySelectorAll(".item").forEach(el => el.onclick = () => histClick(el.dataset.c));
}
$("btnClear").onclick = () => { if (confirm(t("hist_confirm"))){ setHist([]); drawHist(); } };
$("btnCmpMode").onclick = () => setCmpMode(!cmpMode);

// ---------- Còpia de seguretat ----------
$("btnExport").onclick = async () => {
  const data = {app:"xoriguer", version:2, date:new Date().toISOString(), hist:getHist(), custom:getCustom(), prefs:getPrefs(), profile:getProfile(), lang:window.XLANG, favs:getFavs(), favData:Object.fromEntries(Object.keys(getFavs()).map(k => [k, getCache()[k]]).filter(([,v]) => v)), zoom:getZoom()};
  const name = `xoriguer-${new Date().toISOString().slice(0,10)}.json`;
  const blob = new Blob([JSON.stringify(data, null, 1)], {type:"application/json"});
  const file = new File([blob], name, {type:"application/json"});
  try{ if (navigator.canShare && navigator.canShare({files:[file]})){ await navigator.share({files:[file], title:"Xoriguer"}); return; } }
  catch(e){ if (e && e.name === "AbortError") return; }
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};
$("importFile").onchange = async e => {
  const f = e.target.files && e.target.files[0]; e.target.value = "";
  if (!f) return;
  try{
    const d = JSON.parse(await f.text());
    if (d.app !== "xoriguer") throw 0;
    setCustom(Object.assign(getCustom(), d.custom || {}));
    if (Array.isArray(d.profile) && d.profile.length) setProfile(d.profile);
    if (Array.isArray(d.prefs)) setPrefs([...new Set([...getPrefs(), ...d.prefs])]);
    if (d.favs) setFavs(Object.assign(getFavs(), d.favs));
    if (d.favData) Object.entries(d.favData).forEach(([k, v]) => { if (!getCache()[k]) putCache(k, v); });
    if (d.zoom) { store.set("rf_zoom", d.zoom); applyZoom(); }
    const seen = new Set(), merged = [];
    [...getHist(), ...(d.hist || [])].sort((a, b) => (b.at || 0) - (a.at || 0)).forEach(x => { if (!seen.has(x.code)){ seen.add(x.code); merged.push(x); } });
    setHist(merged.slice(0, 50));
    refreshAll();
    alert(t("imp_done", {h: (d.hist || []).length, c: Object.keys(d.custom || {}).length}));
  }catch{ alert(t("imp_bad")); }
};

// ---------- Escàner ----------
// 1) Lector integrat del navegador (Android/Chrome): més ràpid i fiable.
// 2) Si no n'hi ha (iPhone, navegadors antics): llibreria html5-qrcode, inclosa dins l'app.
const WANT = ["ean_13","ean_8","upc_a","upc_e","qr_code"];
let scan = null; // {mode, stream, track, raf, h5}
let lastRead = {code:"", n:0};
async function nativeFormats(){
  if (!("BarcodeDetector" in window)) return [];
  try{ const f = await BarcodeDetector.getSupportedFormats(); return WANT.filter(x => f.includes(x)); }catch{ return []; }
}
function onRead(text){
  if (!scan || scan.done) return true;                                 // ja s'ha llegit un codi
  const code = extractCode(text);
  if (code && /^\d{12,13}$/.test(code) && !validGtin(code)) return false;   // dígit de control incorrecte: lectura dolenta (els UPC-E de 8 xifres es calculen diferent)
  scan.done = true;
  if (navigator.vibrate) navigator.vibrate(60);
  stopScan().then(() => code ? lookup(code) : showQrNoProduct(text));
  return true;
}
async function startScan(){
  if (scan) return;
  $("scanner").classList.remove("hidden");
  $("themeColor").setAttribute("content", "#000000");
  $("btnTorch").classList.add("hidden");
  const formats = await nativeFormats();
  try{
    if (formats.includes("ean_13")) await startNative(formats);
    else await startFallback();
  }catch(e){
    await stopScan();
    const camErr = e && /NotAllowed|NotFound|Security|Permission/i.test(e.name || e.message || String(e));
    showMessage(camErr ? "ti-camera-off" : "ti-alert-circle", t(camErr ? "msg_camera_t" : "msg_scanner_t"), t(camErr ? "msg_camera_d" : "msg_scanner_d"));
  }
}
async function startNative(formats){
  const stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:"environment"}, width:{ideal:1920}, height:{ideal:1080}}});
  const video = document.createElement("video");
  video.setAttribute("playsinline", ""); video.muted = true; video.srcObject = stream;
  $("reader").innerHTML = ""; $("reader").appendChild(video);
  await video.play();
  const track = stream.getVideoTracks()[0];
  try{ await track.applyConstraints({advanced:[{focusMode:"continuous"}]}); }catch{}
  const caps = track.getCapabilities ? track.getCapabilities() : {};
  if (caps.torch) $("btnTorch").classList.remove("hidden");
  const det = new BarcodeDetector({formats});
  scan = {mode:"native", stream, track, raf:0, busy:false, torch:false};
  let last = 0;
  const loop = async ts => {
    if (!scan || scan.mode !== "native") return;
    if (!scan.busy && ts - last > 110 && video.readyState >= 2){
      last = ts; scan.busy = true;
      try{
        const codes = await det.detect(video);
        if (codes.length && onRead(codes[0].rawValue)) return;
      }catch{}
      if (scan) scan.busy = false;
    }
    if (scan) scan.raf = requestAnimationFrame(loop);
  };
  scan.raf = requestAnimationFrame(loop);
}
async function startFallback(){
  await loadScript("vendor/html5-qrcode.min.js", () => typeof Html5Qrcode !== "undefined");
  $("reader").innerHTML = "";
  const h5 = new Html5Qrcode("reader", {verbose:false, formatsToSupport:[
    Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8, Html5QrcodeSupportedFormats.UPC_A,
    Html5QrcodeSupportedFormats.UPC_E, Html5QrcodeSupportedFormats.QR_CODE]});
  scan = {mode:"h5", h5, torch:false};
  await h5.start({facingMode:"environment"}, {fps:12, qrbox:(w, h) => { const s = Math.floor(Math.min(w, h) * 0.72); return {width:s, height:s}; }}, text => onRead(text));
  try{ const caps = h5.getRunningTrackCameraCapabilities(); if (caps.torchFeature().isSupported()) $("btnTorch").classList.remove("hidden"); }catch{}
}
async function stopScan(){
  const s = scan; scan = null;
  if (s){
    if (s.mode === "native"){ cancelAnimationFrame(s.raf); s.stream.getTracks().forEach(tr => tr.stop()); }
    if (s.mode === "h5"){ try{ await s.h5.stop(); }catch{} try{ s.h5.clear(); }catch{} }
  }
  $("reader").innerHTML = "";
  $("btnTorch").innerHTML = '<i class="ti ti-bulb"></i>';
  $("scanner").classList.add("hidden");
  $("themeColor").setAttribute("content", BRAND);
}
async function toggleTorch(){
  if (!scan) return;
  try{
    scan.torch = !scan.torch;
    if (scan.mode === "native") await scan.track.applyConstraints({advanced:[{torch: scan.torch}]});
    else await scan.h5.applyVideoConstraints({advanced:[{torch: scan.torch}]});
    $("btnTorch").innerHTML = `<i class="ti ${scan.torch ? "ti-bulb-off" : "ti-bulb"}"></i>`;
  }catch{ scan.torch = false; alert(t("torch_na")); }
}
$("btnScan").onclick = startScan;
$("btnClose").onclick = () => { cmpA = null; $("scanCmp").classList.add("hidden"); stopScan(); };
$("btnTorch").onclick = toggleTorch;
$("btnManual").onclick = () => lookup($("manual").value);
$("manual").addEventListener("keydown", e => { if (e.key === "Enter"){ e.target.blur(); lookup(e.target.value); } });

// ---------- Pestanyes ----------
document.querySelectorAll(".tab").forEach(tb => tb.onclick = () => {
  document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === tb));
  ["home","history","prefs"].forEach(id => $(id).classList.toggle("hidden", tb.dataset.tab !== id));
  if (tb.dataset.tab !== "history" && cmpMode) setCmpMode(false);
  window.scrollTo(0, 0);
});

// ---------- Inici ----------
function refreshAll(){
  applyI18n();
  drawLangSel(); drawSize(); drawLegend(); drawProfile(); drawPrefs(); drawFavs(); drawHist();
}
refreshAll();
if ("serviceWorker" in navigator && location.protocol === "https:"){
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
// Drecera "Escanejar" de la icona: obre la càmera directament
if (new URLSearchParams(location.search).has("scan")) startScan();
