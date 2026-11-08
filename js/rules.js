// ============================================================
//  Xoriguer · REGLES DE VALORACIÓ
//  Paraules clau en català, castellà, anglès, francès, portuguès i italià.
//  Tot el text es compara "normalitzat": minúscules i sense accents.
//  Els motius es retornen com a {k, id, v}: k = good|mid|bad, id = clau de traducció.
// ============================================================

const norm = s => (s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’`´]/g, "'");
const r1 = v => Math.round(v * 10) / 10;
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordRe = list => new RegExp("\\b(" + list.map(w => escRe(norm(w))).join("|") + ")\\b");

// ---------- Idioma de les dades del producte ----------
const LANG_ORDER = { ca:["ca","es","en","fr","pt","it"], es:["es","ca","en","fr","pt","it"], en:["en","es","ca","fr","pt","it"],
                     fr:["fr","en","es","ca","it","pt"], pt:["pt","es","en","fr","it","ca"], it:["it","en","es","fr","ca","pt"] };
const curLang = () => (typeof window !== "undefined" && window.XLANG) || "ca";
// Ordre: idioma de l'app → text principal del producte → la resta d'idiomes
function pickField(p, base){
  if (!p) return "";
  const order = LANG_ORDER[curLang()] || LANG_ORDER.ca;
  return p[base + "_" + order[0]] || p[base] || order.slice(1).map(l => p[base + "_" + l]).find(Boolean) || "";
}
const pickIngr = p => pickField(p, "ingredients_text");
const pickName = p => pickField(p, "product_name");
const hasIngr = p => !!pickIngr(p);

// ---------- Paraules clau ----------
// Ingredients que delaten un ultraprocessat
const ULTRA = [
  // ca / es
  "jarabe de glucosa","jarabe de fructosa","xarop de glucosa","xarop de fructosa","dextrosa","maltodextrina","azucar invertido","sucre invertit",
  "aceite de palma","oli de palma","palmiste","grasa vegetal","grasas vegetales","greix vegetal","greixos vegetals","hidrogenad",
  "potenciador del sabor","potenciador de sabor","potenciador del gust","glutamato","glutamat","aroma","edulcorant","sucralosa","aspartam","acesulfam",
  "sacarina","ciclamat","almidon modificado","mido modificat","proteina de soja aislada","emulsionante","emulgent","colorante","colorant","jarabe","xarop","sirope",
  // en
  "glucose syrup","fructose syrup","glucose-fructose","dextrose","maltodextrin","invert sugar","palm oil","palm kernel","vegetable fat","hydrogenated",
  "flavour enhancer","flavor enhancer","glutamate","flavouring","flavoring","sweetener","sucralose","modified starch","soy protein isolate","emulsifier","syrup",
  // fr
  "sirop de glucose","sirop de fructose","maltodextrine","sucre inverti","huile de palme","graisse vegetale","matiere grasse vegetale","hydrogene",
  "exhausteur de gout","arome","emulsifiant","amidon modifie","proteine de soja isolee","sirop",
  // pt
  "xarope de glucose","xarope de frutose","xarope de glicose","acucar invertido","oleo de palma","gordura vegetal","intensificador de sabor",
  "corante","amido modificado","proteina de soja isolada","xarope",
  // it
  "sciroppo di glucosio","sciroppo di fruttosio","destrosio","maltodestrin","zucchero invertito","olio di palma","grasso vegetale","grassi vegetali",
  "idrogenat","esaltatore di sapidita","glutammato","aromi","dolcificante","amido modificato","proteine di soia isolate","sciroppo"
];
const REFINED_OIL = [
  "aceite de girasol","oli de gira-sol","oli de girasol","aceite de colza","oli de colza","aceite de soja","oli de soja","aceites vegetales","olis vegetals",
  "sunflower oil","rapeseed oil","soybean oil","vegetable oil",
  "huile de tournesol","huile de colza","huile de soja","huiles vegetales","huile vegetale",
  "oleo de girassol","oleo de colza","oleo de soja","oleos vegetais","oleo vegetal",
  "olio di girasole","olio di semi","olio di colza","olio di soia","oli vegetali"
];
// Paraules que indiquen un additiu encara que no porti número E
const ADDITIVE_CLASS = [
  "emulgent","conservant","antioxidant","estabilitzant","espessant","gelificant","acidulant","corrector d'acidesa","regulador d'acidesa","gasificant","humectant","antiaglomerant",
  "emulgente","emulsionante","conservador","conservante","antioxidante","colorante","estabilizante","espesante","gelificante","acidulante","corrector de acidez","regulador de acidez","gasificante","humectante","antiaglomerante",
  "emulsifier","preservative","antioxidant","stabiliser","stabilizer","thickener","gelling agent","acidity regulator","acidifier","raising agent","anti-caking agent",
  "emulsifiant","conservateur","antioxydant","stabilisant","epaississant","gelifiant","acidifiant","correcteur d'acidite","affermissant","antiagglomerant","poudre a lever",
  "corante","espessante","acidificante","regulador de acidez","corretor de acidez","humidificante",
  "emulsionanti","antiossidante","stabilizzante","addensante","correttore di acidita","regolatore di acidita","umidificante","agente lievitante","antiagglomerante",
  "colorant","edulcorant","edulcorante","sweetener","dolcificante","levedante","agenti lievitanti","agente levedante"
];
const LECITHIN_RE = /\b(lecitina|lecithin|lecithine)\w*/;
const SUGAR_RE = /\b(azucar(es)?( moreno| de cana)?|sucre( more| de canya| de canne)?|sucres|sugar|sacarosa|sucrose|saccharose|sacarose|saccarosio|panela|melaza|melassa|melasse|melaco|fructosa|fructose|frutose|fruttosio|acucar( mascavado)?|zucchero( di canna)?|cassonade)\b/;
const FLOUR_RE = /\b(harina|farina|flour|farine|farinha)\b/;
const SEMOLA_RE = /\b(semola|semolina|semoule)\b/;
const WHOLE_RE = /\b(integral|integrals|integrales|integrais|integrale|integrali|wholemeal|wholegrain|wholewheat|whole|completa|complete|completes|complet)\b/;
const GRAIN_RE = /\b(arroz|arros|avena|civada|trigo|blat|espelta|centeno|segol|oat|oats|wheat|rice|avoine|ble|riz|aveia|centeio|frumento|riso|farro)\b/;
const EVOO_RE = /(aceite de oliva virgen|oli d'oliva verge|oli d oliva verge|oli de oliva verge|virgin olive oil|\baove\b|huile d'olive vierge|azeite virgem|azeite|olio extra ?vergine|olio di oliva vergine|olio extravergine)/;
const NEG_RE = /(?:\b(?:sin|sense|libre de|lliure de|exento de|no contiene|no conte|free from|without|sans|sem|isento de|nao contem|senza|privo di|non contiene)\b|\b0\s?%)[^,.;()]*/g;
const TRACES_RE = /\b(puede contener|pot contenir|may contain|peut contenir|pode conter|puo contenere|contiene trazas|trazas de|traces de|traces of|tracce di|vestigios de)\b.*$/;
const SYRUP_RE = /\b(jarabe|xarop|syrup|sirope|sirop|xarope|sciroppo|dextrosa|dextrose|destrosio|maltodextrin\w*|maltodestrin\w*|glucosa|glucose|glicose|glucosio)\b/;
const HYDRO_RE = /hidrogenad|hydrogen|idrogenat/;
const PALM_RE = /\b(palma|palmiste|palm|palme)\b/;
const COCO_RE = /\b(aceite de coco|oli de coco|coconut oil|grasa de coco|huile de coco|oleo de coco|olio di cocco)\b/;
const OATS_RE = /\b(avena|civada|oat|oats|avoine|aveia)\b/;
const SALT_FIRST_RE = /^(sal|salt|sel|sale)\b/;
const SODIUM_E = ["E621","E250","E251","E211","E331","E339"];
const HEALTHY_FAT_FIRST = /^(aceite de oliva|oli d'?oliva|oli de oliva|olive oil|huile d'olive|azeite|olio (extra|di oliva)|almendra|ametlla|amande|amendoa|mandorl|nuez|nueces|nous|noix|nozes|noci|avellana|noisette|avela|nocciol|cacahuete|cacauet|arachide|amendoim|pistach|pistatxo|pistacchi|anacard|cajou|caju|aguacate|alvocat|avocat|abacate|avocado|salmon|saumon|salmao|salmone|sardin|caballa|verat|maquereau|cavala|sgombro|atun|tonyina|thon|atum|tonno|anchoa|anxova|semillas|llavors|chia|lino|lli|aceitunas|olives|azeitonas)/;
const PROCESSED_MEAT = /\b(embutido|chorizo|xorico|salchicha|salsitxa|frankfurt|bacon|beicon|panceta|salami|salame|mortadela|mortadella|fuet|longaniza|llonganissa|sobrasada|saucisson|saucisse|lardons|chourico|salsicha|fiambre|enchido|salsiccia|wurstel|nitrito|nitrit|nitrite)\b/;

// ---------- Utilitats ----------
function stripNegations(t){ return t.replace(NEG_RE, " "); }
// Separa ingredients per comes i punts i comes, però NO dins de parèntesis: "emulgent (lecitina, E471)" és UN ingredient
function splitTop(t){
  const out = []; let depth = 0, cur = "";
  for (const ch of t){
    if ("([{".includes(ch)) depth++;
    else if (")]}".includes(ch)) depth = Math.max(0, depth - 1);
    if ((ch === "," || ch === ";") && depth === 0){ out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out.map(x => x.replace(/[.\s]+$/, "").trim()).filter(x => x.length > 1);
}
function prepIngr(p){
  return stripNegations(norm(pickIngr(p))).replace(TRACES_RE, " ");
}
function eNumbers(p, ingr){
  let adds = (p.additives_tags || []).map(a => a.replace(/^en:/, "").toUpperCase());
  if (!adds.length && ingr){
    adds = [...new Set((ingr.match(/\be[\s-]?(\d{3,4}[a-z]?)\b/g) || []).map(x => "E" + x.replace(/\D*(\d{3,4}[a-z]?)$/, "$1").toUpperCase()))];
  }
  return adds;
}
// Accepta plurals i variants: "conservant" troba "conservants", "conservante", "conservantes"…
const ADDCLASS_RE = new RegExp("\\b(" + ADDITIVE_CLASS.map(w => escRe(norm(w))).join("|") + ")[a-z]*", "g");
// Retorna la paraula tal com surt al text ("emulgente", no "emulgent")
function asWritten(text, w){
  const m = text.match(new RegExp(escRe(norm(w)) + "[a-z'-]*"));
  return m ? m[0] : w;
}

// ---------- Classificació "menjar sa" (estil Realfood) ----------
function classify(p){
  const ingrRaw = pickIngr(p);
  const ingr = prepIngr(p);
  const n = p.nutriments || {};
  const nova = p.nova_group;
  let found = [...new Set(ULTRA.filter(w => ingr.includes(norm(w))))];
  found = found.filter(w => !found.some(o => o !== w && norm(o).includes(norm(w)))); // "xarop" sobra si ja hi ha "xarop de glucosa"
  found = [...new Set(found.map(w => asWritten(ingr, w)))];
  const oils = [...new Set(REFINED_OIL.filter(w => ingr.includes(norm(w))))];
  const adds = eNumbers(p, ingr);
  let addClass = [...new Set(ingr.match(ADDCLASS_RE) || [])];
  if (!addClass.length && LECITHIN_RE.test(ingr)) addClass = [ingr.match(LECITHIN_RE)[0]];
  const addCount = Math.max(adds.length, addClass.length);
  const segs = ingr ? splitTop(ingr) : [];
  const count = segs.length;

  const sugarPos = segs.findIndex(x => SUGAR_RE.test(x));
  const addedSugar = sugarPos >= 0;
  const sugarTop = addedSugar && sugarPos < 3 && count > 1;
  const refinedFlour = segs.some(x => FLOUR_RE.test(x) && !WHOLE_RE.test(x));
  const refinedSemola = segs.some(x => SEMOLA_RE.test(x) && !WHOLE_RE.test(x));
  const wholeGrain = segs.some(x => (FLOUR_RE.test(x) || SEMOLA_RE.test(x) || GRAIN_RE.test(x)) && WHOLE_RE.test(x));
  const evoo = EVOO_RE.test(ingr);

  const R = [];
  const sugar = n.sugars_100g, salt = n.salt_100g, sat = n["saturated-fat_100g"];
  if (found.length) R.push({k:"bad", id:"r_ultra", v:{list: found.slice(0,5).join(", ")}});
  if (sugarTop) R.push({k:"bad", id:"r_sugar_top"});
  else if (addedSugar) R.push({k:"mid", id:"r_sugar_added"});
  if (refinedFlour) R.push({k:"bad", id:"r_flour_refined"});
  else if (refinedSemola) R.push({k:"mid", id:"r_semola_refined"});
  if (adds.length) R.push({k: adds.length >= 3 ? "bad" : "mid", id:"r_additives_e", v:{n: adds.length, list: adds.slice(0,6).join(", ") + (adds.length > 6 ? "…" : "")}});
  else if (addClass.length) R.push({k: addClass.length >= 3 ? "bad" : "mid", id:"r_additives_cls", v:{list: addClass.slice(0,5).join(", ")}});
  if (oils.length) R.push({k:"mid", id:"r_oils", v:{list: oils.join(", ")}});
  if (sugar > 15) R.push({k:"bad", id:"r_sugar_high", v:{v: sugar}});
  else if (sugar > 5) R.push({k:"mid", id:"r_sugar_mid", v:{v: sugar}});
  if (salt > 1.5) R.push({k:"mid", id:"r_salt_high", v:{v: salt}});
  if (sat > 5) R.push({k:"mid", id:"r_sat_high", v:{v: sat}});

  if (evoo) R.push({k:"good", id:"r_evoo"});
  if (wholeGrain) R.push({k:"good", id:"r_whole"});
  if (ingr && !addCount) R.push({k:"good", id:"r_no_additives"});
  if (count && count <= 5) R.push({k:"good", id:"r_few_ingr", v:{n: count}});
  if (sugar !== undefined && sugar !== null && sugar <= 5) R.push({k:"good", id:"r_sugar_low", v:{v: sugar}});

  let cat;
  if (nova === 4 || found.length >= 1 || addCount >= 4 || sugarTop || refinedFlour) cat = "ultra";
  else if (nova === 1 && !addedSugar && !refinedSemola && !addCount) cat = "real";
  else if (!ingr && !nova) cat = "nd";
  else {
    const c = count || 99;
    cat = (c <= 2 && !oils.length && !(sugar > 5) && !addCount && !addedSugar && !refinedSemola) ? "real" : "bo";
    if (cat === "bo" && ((sugar > 15 && addedSugar) || oils.length)) cat = "ultra"; // la sal no fa ultraprocessat
  }
  sortReasons(R);
  return {cat, reasons:R, nova, ingrRaw, adds, addCount, count};
}
function sortReasons(R){ const o = {bad:0, mid:1, good:2}; R.sort((a,b) => o[a.k] - o[b.k]); return R; }

// ---------- Perfil de salut ----------
const PROFILE_IDS = ["diab","hta","cor","col","sa"];
const LV_RANK = {ok:0, mid:1, bad:2, nd:3};
const CAT2LV = {real:"ok", bo:"mid", ultra:"bad", nd:"nd"};
const isDrink = p => (p.categories_tags || []).some(c => /beverages|bebidas|begudes|drinks|boissons|bebidas|bevande/.test(c));
// Llindars del semàfor nutricional europeu (per 100 g o 100 ml)
const TH = {
  food:  {sugar:[5,22.5],   salt:[0.3,1.5],  sat:[1.5,5]},
  drink: {sugar:[2.5,11.25], salt:[0.3,0.75], sat:[0.75,2.5]}
};
// Si la ració és petita (salses, condiments…) i per ració hi ha poca quantitat, es rebaixa un nivell
const PORTION_OK = {sugar:5, salt:0.5, sat:2};
const lvBy = (v, [lo,hi]) => v === undefined || v === null || isNaN(v) ? null : v <= lo ? "ok" : v <= hi ? "mid" : "bad";
const worst = (...l) => l.filter(Boolean).sort((a,b) => LV_RANK[b] - LV_RANK[a])[0] || null;
const kOf = l => l === "ok" ? "good" : l === "mid" ? "mid" : "bad";

function servingG(p){
  const q = parseFloat(p.serving_quantity);
  return q > 0 && q < 1000 ? q : null;
}

function evalProfiles(p, selected){
  const cls = classify(p);
  const n = p.nutriments || {};
  const th = isDrink(p) ? TH.drink : TH.food;
  const sugar = n.sugars_100g;
  const salt = n.salt_100g ?? (n.sodium_100g !== undefined ? n.sodium_100g * 2.5 : undefined);
  const sat = n["saturated-fat_100g"];
  const fiber = n.fiber_100g, carbs = n.carbohydrates_100g, trans = n["trans-fat_100g"];
  const ingr = prepIngr(p);
  const segs = ingr ? splitTop(ingr) : [];
  const sugarPos = segs.findIndex(x => SUGAR_RE.test(x));
  const sugarTop = sugarPos >= 0 && sugarPos < 3 && segs.length > 1;
  const syrup = SYRUP_RE.test(ingr);
  const refinedFlour = segs.some(x => FLOUR_RE.test(x) && !WHOLE_RE.test(x));
  const wholeGrain = segs.some(x => (FLOUR_RE.test(x) || SEMOLA_RE.test(x) || GRAIN_RE.test(x)) && WHOLE_RE.test(x));
  const hydro = HYDRO_RE.test(ingr) || trans > 0.2;
  const palm = PALM_RE.test(ingr);
  const coco = COCO_RE.test(ingr);
  const healthyFat = segs.length && HEALTHY_FAT_FIRST.test(segs[0]);
  const procMeat = PROCESSED_MEAT.test(ingr);
  const sodiumAdds = cls.adds.filter(a => SODIUM_E.includes(a.slice(0,4)));
  const saltTop = segs.slice(0,3).some(x => SALT_FIRST_RE.test(x));
  const noData = !ingr && sugar === undefined && salt === undefined && sat === undefined;
  const sg = servingG(p);

  // Valora un nutrient i aplica la rebaixa per ració petita
  function nutrient(val, thr, key, R){
    let l = lvBy(val, thr);
    if (!l) return null;
    R.push({k: kOf(l), id: `r_${key}_${l === "ok" ? "low" : l === "mid" ? "mid" : "high"}`, v:{v: val}});
    if (l === "bad" && sg && sg <= 20){
      const per = val * sg / 100;
      if (per <= PORTION_OK[key]){ l = "mid"; R.push({k:"mid", id:`r_portion_${key}`, v:{g: sg, v: per}}); }
    }
    return l;
  }

  const out = {};
  const sel = selected && selected.length ? selected : ["sa"];
  for (const id of PROFILE_IDS.filter(x => sel.includes(x))){
    const R = []; let lv = null;
    if (id === "sa"){ out[id] = {lv: CAT2LV[cls.cat], reasons: cls.reasons}; continue; }
    if (noData){ out[id] = {lv:"nd", reasons:[{k:"mid", id:"r_nodata"}]}; continue; }

    if (id === "diab"){
      lv = worst(nutrient(sugar, th.sugar, "sugar", R));
      if (sugarTop){ R.push({k:"bad", id:"r_sugar_top"}); lv = worst(lv,"bad"); }
      else if (sugarPos >= 0){ R.push({k:"mid", id:"r_sugar_added"}); lv = worst(lv,"mid"); }
      if (syrup){
        if (sugar !== undefined && sugar <= th.sugar[0]) R.push({k:"mid", id:"r_syrup_small"});
        else { R.push({k:"bad", id:"r_syrup"}); lv = worst(lv,"bad"); }
      }
      if (refinedFlour){ R.push({k:"mid", id:"r_flour_fast"}); lv = worst(lv,"mid"); }
      if (carbs >= 50 && !(fiber >= 6) && !wholeGrain){ R.push({k:"mid", id:"r_carbs", v:{v: carbs}}); lv = worst(lv,"mid"); }
      if (wholeGrain) R.push({k:"good", id:"r_whole"});
      if (fiber >= 6) R.push({k:"good", id:"r_fiber", v:{v: fiber}});
      if (!lv) lv = segs.length ? "ok" : "nd";
      if ((sugar === undefined || sugar === null) && lv === "ok") R.push({k:"mid", id:"r_nosugar_data"});
    }
    if (id === "hta"){
      lv = worst(nutrient(salt, th.salt, "salt", R));
      if (sodiumAdds.length){ R.push({k:"mid", id:"r_sodium_adds", v:{list: sodiumAdds.join(", ")}}); lv = worst(lv,"mid"); }
      if (procMeat){ R.push({k:"bad", id:"r_procmeat_sodium"}); lv = worst(lv,"bad"); }
      if (salt === undefined || salt === null){
        if (saltTop){ R.push({k:"mid", id:"r_salt_top"}); lv = worst(lv,"mid"); }
        else if (segs.length) R.push({k:"mid", id:"r_nosalt_data"});
        if (!lv) lv = segs.length ? (segs.some(x => SALT_FIRST_RE.test(x)) ? "mid" : "ok") : "nd";
      }
    }
    if (id === "cor" || id === "col"){
      let l = lvBy(sat, th.sat);
      if (l && l !== "ok" && healthyFat){ R.push({k:"good", id:"r_healthy_fat"}); l = "ok"; }
      else if (l) l = nutrient(sat, th.sat, "sat", R);
      lv = worst(l);
      if (hydro){ R.push({k:"bad", id:"r_hydro"}); lv = worst(lv,"bad"); }
      if (palm || coco){ R.push({k:"mid", id: palm ? "r_palm" : "r_coco"}); lv = worst(lv,"mid"); }
      if (procMeat){ const k = id === "cor" ? "bad" : "mid"; R.push({k, id:"r_procmeat"}); lv = worst(lv,k); }
      if (id === "cor"){
        if (lvBy(salt, th.salt) === "bad"){ R.push({k:"mid", id:"r_salt_high", v:{v: salt}}); lv = worst(lv,"mid"); }
        if (sugar > th.sugar[1]){ R.push({k:"mid", id:"r_sugar_high", v:{v: sugar}}); lv = worst(lv,"mid"); }
      }
      if (id === "col"){
        if (fiber >= 6) R.push({k:"good", id:"r_fiber_col", v:{v: fiber}});
        if (OATS_RE.test(ingr)) R.push({k:"good", id:"r_oats"});
      }
      if (healthyFat && !R.some(r => r.id === "r_healthy_fat")) R.push({k:"good", id:"r_healthy_fat"});
      if (!lv) lv = segs.length ? (palm || coco || hydro ? "mid" : "ok") : "nd";
      if ((sat === undefined || sat === null) && segs.length) R.push({k:"mid", id:"r_nosat_data"});
    }
    out[id] = {lv, reasons: sortReasons(R)};
  }
  const known = Object.values(out).map(o => o.lv).filter(l => l !== "nd");
  const level = known.length ? worst(...known) : "nd";
  return {level, per: out, cls};
}

// ---------- Avisos d'ingredients (al·lèrgens i preferències) ----------
const PREFS = [
  {id:"gluten",  i:"ti-bread",       tags:["en:gluten"], kw:["gluten","trigo","blat","cebada","ordi","centeno","segol","espelta","avena","civada","wheat","barley","rye","malta","malt","seitan","ble","orge","seigle","epeautre","avoine","cevada","centeio","aveia","grano","frumento","orzo","segale","farro"]},
  {id:"milk",    i:"ti-milk",        tags:["en:milk"],   kw:["leche","llet","lactosa","lactose","milk","nata","mantequilla","mantega","queso","formatge","suero","serum de llet","lactosuero","yogur","iogurt","caseina","caseinat","caseinate","lactoalbumina","lait","creme","beurre","fromage","lactoserum","leite","manteiga","queijo","soro de leite","latte","panna","burro","formaggio","siero di latte","lattosio"]},
  {id:"egg",     i:"ti-egg",         tags:["en:eggs"],   kw:["huevo","huevos","ous","ou en pols","ou liquid","ou pasteuritzat","clara d'ou","rovell d'ou","d'ou","egg","eggs","albumina","yema","rovell","oeuf","oeufs","œuf","œufs","ovo","ovos","uovo","uova"]},
  {id:"nuts",    i:"ti-plant",       tags:["en:nuts"],   kw:["almendra","almendras","ametlla","ametlles","avellana","avellanes","avellanas","nuez","nueces","nous","anacardo","anacard","pistacho","pistatxo","macadamia","pecana","walnut","hazelnut","almond","cashew","pistachio","amande","amandes","noisette","noisettes","noix","cajou","pistache","amendoa","amendoas","avela","avelas","noz","nozes","caju","pistacio","mandorla","mandorle","nocciola","nocciole","noce","noci","anacardi","pistacchio","pistacchi"]},
  {id:"peanut",  i:"ti-plant-2",     tags:["en:peanuts"],kw:["cacahuete","cacahuetes","cacauet","cacauets","mani","peanut","peanuts","arachide","arachides","amendoim","arachidi"]},
  {id:"soy",     i:"ti-plant-off",   tags:["en:soybeans"],kw:["soja","soy","soya","edamame","tofu","soia"]},
  {id:"fish",    i:"ti-fish",        tags:["en:fish","en:crustaceans","en:molluscs"], kw:["pescado","peix","atun","tonyina","salmon","bacalao","bacalla","anchoa","anxova","sardina","merluza","lluc","gamba","gambes","langostino","llagosti","mejillon","musclo","calamar","sepia","pulpo","pop","fish","shrimp","surimi","poisson","thon","saumon","crevette","crevettes","moule","moules","peixe","atum","salmao","camarao","mexilhao","pesce","tonno","salmone","gamberi","cozze"]},
  {id:"sesame",  i:"ti-grain",       tags:["en:sesame-seeds"], kw:["sesamo","sesam","sesame","tahini","tahin","gergelim"]},
  {id:"mustard", i:"ti-bottle",      tags:["en:mustard"],kw:["mostaza","mostassa","mustard","moutarde","mostarda","senape"]},
  {id:"sulph",   i:"ti-flask",       tags:["en:sulphur-dioxide-and-sulphites"], kw:["sulfito","sulfitos","sulfit","sulfits","bisulfito","metabisulfito","disulfito","anhidrido sulfuroso","sulphite","sulphites","sulfite","sulfites","anhydride sulfureux","solfiti","anidride solforosa"], E:["E220","E221","E222","E223","E224","E225","E226","E227","E228"]},
  {id:"sweet",   i:"ti-candy-off",   tags:[], kw:["edulcorant","edulcorants","edulcorante","edulcorantes","sweetener","sweeteners","dolcificante","dolcificanti","sucralosa","sucralose","aspartamo","aspartam","aspartame","acesulfamo","acesulfam","acesulfame","sacarina","saccharin","saccharine","ciclamato","ciclamat","cyclamate","estevia","stevia","esteviol","steviol","eritritol","erythritol","maltitol","sorbitol","xilitol","xylitol"], E:["E420","E421","E950","E951","E952","E953","E954","E955","E957","E959","E960","E961","E962","E965","E966","E967","E968","E969"]},
  {id:"palm",    i:"ti-droplet-off", tags:[], kw:["palma","palmiste","palm","palmist","palme"]},
  {id:"pork",    i:"ti-meat",        tags:[], kw:["cerdo","porc","pork","llard","manteca de cerdo","bacon","panceta","jamon","pernil","chorizo","xorico","sobrasada","gelatina","gelatine","lard","saindoux","jambon","porco","banha","toucinho","presunto","maiale","suino","strutto","lardo","prosciutto","pancetta","guanciale"]},
  {id:"alcohol", i:"ti-glass",       tags:[], kw:["alcohol","vino","vi","brandy","ron","licor","cerveza","cervesa","whisky","conac","vin","biere","alcool","rhum","vinho","cerveja","birra","alcol","rum"]}
];
const PREF_RE = Object.fromEntries(PREFS.map(x => [x.id, wordRe(x.kw)]));
// Falsos positius habituals (llet de coco, blat sarraí, mantega de cacau, nou de coco…)
function stripFalsePositives(t){
  return t.replace(/\b(trigo sarraceno|blat sarrai|fajol|sarrasin|trigo mourisco|grano saraceno)\b/g, " ")
    .replace(/\b(leche|llet|bebida|beguda|lait|boisson|leite|bebida|latte|bevanda|milk|drink) (de |d'|di |of )?(coco|cocco|coconut|almendra|almendras|ametlla|amande|amendoa|mandorla|almond|soja|soia|soy|avena|civada|avoine|aveia|oat|arroz|arros|riz|riso|rice)\b/g, " ")
    .replace(/\b(manteca de cacao|mantega de cacau|beurre de cacao|manteiga de cacau|burro di cacao|cocoa butter)\b/g, " ")
    .replace(/\b(noix de coco|noz de coco|noce di cocco|nuez de coco)\b/g, " ")
    .replace(TRACES_RE, " ");
}
function checkPrefs(p, active){
  const out = {contains:[], traces:[]};
  if (!active || !active.length) return out;
  const t = stripFalsePositives(stripNegations(norm(pickIngr(p))));
  const allergens = p.allergens_tags || [], traces = p.traces_tags || [];
  const adds = (p.additives_tags || []).map(a => a.replace(/^en:/, "").toUpperCase().replace(/[^E0-9]/g, "").slice(0,4));
  const textE = (t.match(/\be[\s-]?(\d{3})/g) || []).map(x => "E" + x.replace(/\D/g, ""));
  for (const x of PREFS.filter(x => active.includes(x.id))){
    const hit = x.tags.some(g => allergens.includes(g)) || (t && PREF_RE[x.id].test(t)) || (x.E || []).some(e => adds.includes(e) || textE.includes(e));
    if (hit) out.contains.push(x.id);
    else if (x.tags.some(g => traces.includes(g))) out.traces.push(x.id);
  }
  return out;
}

// ---------- Codis de barres ----------
// Comprova el dígit de control (EAN-8, UPC-A, EAN-13, GTIN-14): evita lectures errònies
function validGtin(code){
  if (!/^\d{8}$|^\d{12,14}$/.test(code)) return false;
  const d = code.split("").map(Number), check = d.pop();
  const sum = d.reverse().reduce((s, x, i) => s + x * (i % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}
// Retorna el codi del producte (de codi de barres o QR GS1), o null
function extractCode(text){
  const t = (text || "").trim();
  let code = null;
  if (/^\d{8,14}$/.test(t)) code = t;
  else {
    let m = t.match(/\/01\/(\d{8,14})/) || t.match(/\(01\)(\d{14})/) || t.match(/^01(\d{14})/);
    if (m) code = m[1];
  }
  if (!code) return null;
  if (code.length === 14 && code.startsWith("0")) code = code.slice(1);
  return code;
}

if (typeof module !== "undefined") module.exports = {norm, r1, classify, evalProfiles, checkPrefs, splitTop, validGtin, extractCode, pickIngr, pickName, PREFS, PROFILE_IDS, LV_RANK};
