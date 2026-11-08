// ============================================================
//  Xoriguer · TEXTOS EN 6 IDIOMES
//  Ordre de cada fila: [català, castellà, anglès, francès, portuguès, italià]
//  {n}, {v}, {list}… es substitueixen. Les claus acabades en _1 són el singular.
// ============================================================
const LANGS = [
  {id:"ca", name:"Català"}, {id:"es", name:"Español"}, {id:"en", name:"English"},
  {id:"fr", name:"Français"}, {id:"pt", name:"Português"}, {id:"it", name:"Italiano"}
];
const LI = {ca:0, es:1, en:2, fr:3, pt:4, it:5};

const TX = {
  // ---------- General ----------
  app_sub:        ["Menjar més sa","Comer más sano","Eat healthier","Manger plus sain","Comer mais saudável","Mangiare più sano"],
  loading:        ["Buscant producte…","Buscando producto…","Looking up product…","Recherche du produit…","A procurar o produto…","Cerco il prodotto…"],
  back:           ["Tornar","Volver","Back","Retour","Voltar","Indietro"],
  close:          ["Tancar","Cerrar","Close","Fermer","Fechar","Chiudi"],
  unnamed:        ["Producte sense nom","Producto sin nombre","Unnamed product","Produit sans nom","Produto sem nome","Prodotto senza nome"],

  // ---------- Pestanyes ----------
  tab_scan:       ["Escanejar","Escanear","Scan","Scanner","Digitalizar","Scansiona"],
  tab_hist:       ["Historial","Historial","History","Historique","Histórico","Cronologia"],
  tab_profile:    ["Perfil","Perfil","Profile","Profil","Perfil","Profilo"],

  // ---------- Inici ----------
  scan_title:     ["Escaneja un producte","Escanea un producto","Scan a product","Scannez un produit","Digitalize um produto","Scansiona un prodotto"],
  scan_sub:       ["Codi de barres o codi QR","Código de barras o código QR","Barcode or QR code","Code-barres ou code QR","Código de barras ou código QR","Codice a barre o codice QR"],
  manual_ph:      ["O escriu el codi de barres","O escribe el código de barras","Or type the barcode","Ou saisissez le code-barres","Ou escreva o código de barras","Oppure scrivi il codice a barre"],
  search:         ["Buscar","Buscar","Search","Rechercher","Procurar","Cerca"],
  recent_title:   ["Últims escanejats","Últimos escaneados","Recently scanned","Derniers scannés","Últimos digitalizados","Ultimi scansionati"],
  pb_title:       ["Valorant per a: {names}","Valorando para: {names}","Rating for: {names}","Évaluation pour : {names}","A avaliar para: {names}","Valutazione per: {names}"],
  pb_sub:         ["Toca per canviar el teu perfil","Toca para cambiar tu perfil","Tap to change your profile","Touchez pour modifier votre profil","Toque para mudar o seu perfil","Tocca per cambiare il tuo profilo"],

  // ---------- Historial ----------
  hist_title:     ["Historial","Historial","History","Historique","Histórico","Cronologia"],
  hist_count:     ["{n} productes","{n} productos","{n} products","{n} produits","{n} produtos","{n} prodotti"],
  hist_count_1:   ["1 producte","1 producto","1 product","1 produit","1 produto","1 prodotto"],
  hist_empty:     ["Encara no has escanejat res","Aún no has escaneado nada","You haven't scanned anything yet","Vous n'avez encore rien scanné","Ainda não digitalizou nada","Non hai ancora scansionato nulla"],
  hist_clear:     ["Esborrar historial","Borrar historial","Clear history","Effacer l'historique","Apagar histórico","Cancella cronologia"],
  hist_confirm:   ["Esborrar tot l'historial?","¿Borrar todo el historial?","Clear all history?","Effacer tout l'historique ?","Apagar todo o histórico?","Cancellare tutta la cronologia?"],
  cmp_toggle:     ["Comparar dos productes","Comparar dos productos","Compare two products","Comparer deux produits","Comparar dois produtos","Confronta due prodotti"],
  cmp_toggle_on:  ["Tria dos productes · Cancel·lar","Elige dos productos · Cancelar","Pick two products · Cancel","Choisissez deux produits · Annuler","Escolha dois produtos · Cancelar","Scegli due prodotti · Annulla"],
  backup_title:   ["Còpia de seguretat","Copia de seguridad","Backup","Sauvegarde","Cópia de segurança","Backup"],
  export:         ["Exportar","Exportar","Export","Exporter","Exportar","Esporta"],
  import:         ["Importar","Importar","Import","Importer","Importar","Importa"],
  backup_note:    ["Guarda l'historial, els teus productes, els ingredients que has afegit, el perfil i els avisos en un fitxer. Serveix per canviar de mòbil o si esborres el navegador.",
                   "Guarda el historial, tus productos, los ingredientes que has añadido, tu perfil y los avisos en un archivo. Sirve para cambiar de móvil o si borras el navegador.",
                   "Saves your history, your products, the ingredients you added, your profile and alerts to a file. Useful if you change phone or clear the browser.",
                   "Enregistre l'historique, vos produits, les ingrédients ajoutés, votre profil et vos alertes dans un fichier. Utile si vous changez de téléphone ou videz le navigateur.",
                   "Guarda o histórico, os seus produtos, os ingredientes que adicionou, o seu perfil e os avisos num ficheiro. Útil se mudar de telemóvel ou limpar o navegador.",
                   "Salva cronologia, i tuoi prodotti, gli ingredienti aggiunti, il profilo e gli avvisi in un file. Utile se cambi telefono o cancelli il browser."],
  imp_done:       ["Importat: {h} productes de l'historial i {c} amb dades teves.","Importado: {h} productos del historial y {c} con datos tuyos.","Imported: {h} history items and {c} with your own data.","Importé : {h} produits de l'historique et {c} avec vos données.","Importado: {h} produtos do histórico e {c} com dados seus.","Importati: {h} prodotti della cronologia e {c} con i tuoi dati."],
  imp_bad:        ["Aquest fitxer no és una còpia de Xoriguer.","Este archivo no es una copia de Xoriguer.","This file is not a Xoriguer backup.","Ce fichier n'est pas une sauvegarde Xoriguer.","Este ficheiro não é uma cópia do Xoriguer.","Questo file non è un backup di Xoriguer."],

  // ---------- Perfil ----------
  profile_title:  ["El meu perfil","Mi perfil","My profile","Mon profil","O meu perfil","Il mio profilo"],
  profile_sub:    ["L'app valora els aliments segons el que marquis","La app valora los alimentos según lo que marques","The app rates foods based on what you select","L'appli évalue les aliments selon vos choix","A app avalia os alimentos conforme o que marcar","L'app valuta gli alimenti in base a ciò che selezioni"],
  lang_title:     ["Idioma","Idioma","Language","Langue","Idioma","Lingua"],
  health_title:   ["La meva salut","Mi salud","My health","Ma santé","A minha saúde","La mia salute"],
  health_note:    ["Pots marcar-ne més d'una. Només es valora el que tinguis marcat; si en marques diverses, mana la pitjor nota. És una ajuda per triar, no substitueix el consell del teu metge.",
                   "Puedes marcar más de una. Solo se valora lo que tengas marcado; si marcas varias, manda la peor nota. Es una ayuda para elegir, no sustituye el consejo de tu médico.",
                   "You can select more than one. Only what you select is rated; if you select several, the worst rating wins. It's a shopping aid, not a substitute for your doctor's advice.",
                   "Vous pouvez en cocher plusieurs. Seul ce qui est coché est évalué ; s'il y en a plusieurs, la pire note l'emporte. C'est une aide au choix, pas un avis médical.",
                   "Pode marcar mais do que uma. Só é avaliado o que marcar; se marcar várias, prevalece a pior nota. É uma ajuda para escolher, não substitui o conselho do seu médico.",
                   "Puoi selezionarne più di una. Viene valutato solo ciò che selezioni; se ne scegli diverse, vale il voto peggiore. È un aiuto nella scelta, non sostituisce il parere del medico."],
  alerts_title:   ["Avisos d'ingredients","Avisos de ingredientes","Ingredient alerts","Alertes ingrédients","Avisos de ingredientes","Avvisi sugli ingredienti"],
  alerts_note:    ["Es detecta a partir dels al·lèrgens declarats i de la llista d'ingredients. Si tens una al·lèrgia greu, revisa sempre l'etiqueta: les dades poden estar incompletes.",
                   "Se detecta a partir de los alérgenos declarados y de la lista de ingredientes. Si tienes una alergia grave, revisa siempre la etiqueta: los datos pueden estar incompletos.",
                   "Detected from declared allergens and the ingredient list. If you have a severe allergy, always check the label: data may be incomplete.",
                   "Détecté à partir des allergènes déclarés et de la liste d'ingrédients. En cas d'allergie grave, vérifiez toujours l'étiquette : les données peuvent être incomplètes.",
                   "Detetado a partir dos alergénios declarados e da lista de ingredientes. Se tem uma alergia grave, confirme sempre o rótulo: os dados podem estar incompletos.",
                   "Rilevato dagli allergeni dichiarati e dalla lista ingredienti. Se hai un'allergia grave, controlla sempre l'etichetta: i dati possono essere incompleti."],
  p_diab:         ["Soc diabètic","Soy diabético","I have diabetes","Je suis diabétique","Sou diabético","Sono diabetico"],
  p_hta:          ["Soc hipertens","Soy hipertenso","I have high blood pressure","Je suis hypertendu","Sou hipertenso","Sono iperteso"],
  p_cor:          ["He tingut un atac de cor","He tenido un infarto","I've had a heart attack","J'ai eu un infarctus","Tive um enfarte","Ho avuto un infarto"],
  p_col:          ["Tinc colesterol","Tengo colesterol","I have high cholesterol","J'ai du cholestérol","Tenho colesterol","Ho il colesterolo alto"],
  p_sa:           ["Vull menjar sa","Quiero comer sano","I want to eat healthy","Je veux manger sain","Quero comer saudável","Voglio mangiare sano"],
  ps_diab:        ["Diabetis","Diabetes","Diabetes","Diabète","Diabetes","Diabete"],
  ps_hta:         ["Hipertensió","Hipertensión","Blood pressure","Hypertension","Hipertensão","Ipertensione"],
  ps_cor:         ["Cor","Corazón","Heart","Cœur","Coração","Cuore"],
  ps_col:         ["Colesterol","Colesterol","Cholesterol","Cholestérol","Colesterol","Colesterolo"],
  ps_sa:          ["Menjar sa","Comer sano","Eat healthy","Manger sain","Comer saudável","Mangiare sano"],
  pf_gluten:      ["Gluten","Gluten","Gluten","Gluten","Glúten","Glutine"],
  pf_milk:        ["Lactosa / llet","Lactosa / leche","Lactose / milk","Lactose / lait","Lactose / leite","Lattosio / latte"],
  pf_egg:         ["Ou","Huevo","Egg","Œuf","Ovo","Uovo"],
  pf_nuts:        ["Fruits secs","Frutos secos","Tree nuts","Fruits à coque","Frutos de casca rija","Frutta a guscio"],
  pf_peanut:      ["Cacauet","Cacahuete","Peanut","Arachide","Amendoim","Arachidi"],
  pf_soy:         ["Soja","Soja","Soy","Soja","Soja","Soia"],
  pf_fish:        ["Peix i marisc","Pescado y marisco","Fish and seafood","Poisson et fruits de mer","Peixe e marisco","Pesce e frutti di mare"],
  pf_sesame:      ["Sèsam","Sésamo","Sesame","Sésame","Sésamo","Sesamo"],
  pf_mustard:     ["Mostassa","Mostaza","Mustard","Moutarde","Mostarda","Senape"],
  pf_sulph:       ["Sulfits","Sulfitos","Sulphites","Sulfites","Sulfitos","Solfiti"],
  pf_sweet:       ["Edulcorants","Edulcorantes","Sweeteners","Édulcorants","Edulcorantes","Dolcificanti"],
  pf_palm:        ["Oli de palma","Aceite de palma","Palm oil","Huile de palme","Óleo de palma","Olio di palma"],
  pf_pork:        ["Porc","Cerdo","Pork","Porc","Porco","Maiale"],
  pf_alcohol:     ["Alcohol","Alcohol","Alcohol","Alcool","Álcool","Alcol"],

  // ---------- Mida del text i Els meus productes ----------
  text_size:      ["Mida del text","Tamaño del texto","Text size","Taille du texte","Tamanho do texto","Dimensione del testo"],
  ts_1:           ["Normal","Normal","Normal","Normale","Normal","Normale"],
  ts_2:           ["Gran","Grande","Large","Grande","Grande","Grande"],
  ts_3:           ["Molt gran","Muy grande","Extra large","Très grande","Muito grande","Molto grande"],
  fav_title:      ["Els meus productes","Mis productos","My products","Mes produits","Os meus produtos","I miei prodotti"],
  fav_add:        ["Afegir a Els meus productes","Añadir a Mis productos","Add to My products","Ajouter à Mes produits","Adicionar a Os meus produtos","Aggiungi ai miei prodotti"],
  fav_remove:     ["Treure d'Els meus productes","Quitar de Mis productos","Remove from My products","Retirer de Mes produits","Remover de Os meus produtos","Rimuovi dai miei prodotti"],
  fav_none:       ["Encara no n'has marcat cap. Toca l'estrella d'un resultat per afegir-lo.","Aún no has marcado ninguno. Toca la estrella de un resultado para añadirlo.","None yet. Tap the star on a result to add it.","Aucun pour l'instant. Touchez l'étoile d'un résultat pour l'ajouter.","Ainda não marcou nenhum. Toque na estrela de um resultado para o adicionar.","Nessuno per ora. Tocca la stella di un risultato per aggiungerlo."],
  filter_all:     ["Tots","Todos","All","Tous","Todos","Tutti"],
  filter_favs:    ["Els meus","Mis productos","Mine","Les miens","Os meus","I miei"],
  fav_count:      ["{n} productes","{n} productos","{n} products","{n} produits","{n} produtos","{n} prodotti"],
  fav_count_1:    ["1 producte","1 producto","1 product","1 produit","1 produto","1 prodotto"],

  // ---------- Escàner ----------
  scanning:       ["Escanejant","Escaneando","Scanning","Scan en cours","A digitalizar","Scansione"],
  scan_hint:      ["Apunta al codi de barres o al QR","Apunta al código de barras o al QR","Point at the barcode or QR code","Visez le code-barres ou le QR","Aponte para o código de barras ou QR","Inquadra il codice a barre o il QR"],
  scan_hint2:     ["Es llegeix sol, no cal fer foto","Se lee solo, no hace falta hacer foto","It reads automatically, no photo needed","Lecture automatique, pas besoin de photo","Lê sozinho, não é preciso tirar foto","Si legge da solo, non serve la foto"],
  torch:          ["Llanterna","Linterna","Torch","Lampe","Lanterna","Torcia"],
  torch_na:       ["La llanterna no està disponible en aquest mòbil.","La linterna no está disponible en este móvil.","The torch isn't available on this phone.","La lampe n'est pas disponible sur ce téléphone.","A lanterna não está disponível neste telemóvel.","La torcia non è disponibile su questo telefono."],
  cmp_banner:     ["Comparant amb: {name} · escaneja el segon","Comparando con: {name} · escanea el segundo","Comparing with: {name} · scan the second one","Comparaison avec : {name} · scannez le second","A comparar com: {name} · digitalize o segundo","Confronto con: {name} · scansiona il secondo"],
  msg_scanner_t:  ["Escàner no disponible","Escáner no disponible","Scanner unavailable","Scanner indisponible","Leitor indisponível","Scanner non disponibile"],
  msg_scanner_d:  ["No s'ha pogut iniciar l'escàner. Escriu el codi a mà","No se ha podido iniciar el escáner. Escribe el código a mano","The scanner couldn't start. Type the code instead","Impossible de lancer le scanner. Saisissez le code","Não foi possível iniciar o leitor. Escreva o código","Impossibile avviare lo scanner. Scrivi il codice a mano"],
  msg_camera_t:   ["Sense càmera","Sin cámara","No camera","Pas de caméra","Sem câmara","Nessuna fotocamera"],
  msg_camera_d:   ["Cal obrir l'app amb https:// i donar permís de càmera","Hay que abrir la app con https:// y dar permiso de cámara","Open the app over https:// and allow camera access","Ouvrez l'appli en https:// et autorisez la caméra","Abra a app com https:// e dê permissão à câmara","Apri l'app con https:// e consenti l'accesso alla fotocamera"],

  // ---------- Valoració ----------
  lab_real_t:     ["Realfood","Realfood","Real food","Vrai aliment","Comida real","Cibo vero"],
  lab_real_d:     ["Aliment real. Endavant!","Comida real. ¡Adelante!","Real food. Go for it!","Un vrai aliment. Allez-y !","Comida real. Força!","Cibo vero. Vai tranquillo!"],
  lab_bo_t:       ["Bon processat","Buen procesado","Good processed","Bon transformé","Bom processado","Buon trasformato"],
  lab_bo_d:       ["Pots menjar-ne amb normalitat","Puedes comerlo con normalidad","Fine to eat normally","Vous pouvez en manger normalement","Pode comer normalmente","Puoi mangiarlo normalmente"],
  lab_ultra_t:    ["Ultraprocessat","Ultraprocesado","Ultra-processed","Ultra-transformé","Ultraprocessado","Ultra-processato"],
  lab_ultra_d:    ["Millor evitar-lo o menjar-ne poc","Mejor evitarlo o comer poco","Best avoided or eaten rarely","Mieux vaut l'éviter ou en manger peu","Melhor evitar ou comer pouco","Meglio evitarlo o mangiarne poco"],
  lab_nd_t:       ["Sense dades","Sin datos","No data","Pas de données","Sem dados","Nessun dato"],
  lab_nd_d:       ["Falten els ingredients del producte","Faltan los ingredientes del producto","The product's ingredients are missing","Les ingrédients du produit manquent","Faltam os ingredientes do produto","Mancano gli ingredienti del prodotto"],
  lv_ok_t:        ["Bona opció","Buena opción","Good choice","Bon choix","Boa opção","Buona scelta"],
  lv_ok_d:        ["Encaixa amb el teu perfil","Encaja con tu perfil","Fits your profile","Convient à votre profil","Adequa-se ao seu perfil","Adatto al tuo profilo"],
  lv_mid_t:       ["Amb moderació","Con moderación","In moderation","Avec modération","Com moderação","Con moderazione"],
  lv_mid_d:       ["Pots menjar-ne, però poc i de tant en tant","Puedes comerlo, pero poco y de vez en cuando","OK now and then, in small amounts","Possible, mais peu et de temps en temps","Pode comer, mas pouco e de vez em quando","Puoi mangiarlo, ma poco e ogni tanto"],
  lv_bad_t:       ["Millor evitar-lo","Mejor evitarlo","Best avoided","À éviter","Melhor evitar","Meglio evitarlo"],
  lv_bad_d:       ["No és recomanable per al teu perfil","No es recomendable para tu perfil","Not recommended for your profile","Déconseillé pour votre profil","Não é recomendado para o seu perfil","Non consigliato per il tuo profilo"],
  lv_nd_t:        ["Sense dades","Sin datos","No data","Pas de données","Sem dados","Nessun dato"],
  lv_nd_d:        ["Falten dades per valorar-lo per a tu","Faltan datos para valorarlo para ti","Not enough data to rate it for you","Données insuffisantes pour vous","Faltam dados para o avaliar para si","Dati insufficienti per valutarlo per te"],
  lvs_ok:         ["BÉ","BIEN","OK","OK","BOM","OK"],
  lvs_mid:        ["POC","POCO","LIMIT","PEU","POUCO","POCO"],
  lvs_bad:        ["EVITAR","EVITAR","AVOID","ÉVITER","EVITAR","EVITARE"],
  lvs_nd:         ["?","?","?","?","?","?"],
  no_problem:     ["Cap problema detectat","Ningún problema detectado","No issues found","Aucun problème détecté","Nenhum problema detetado","Nessun problema rilevato"],

  // ---------- Resultat ----------
  offline_badge:  ["Sense cobertura · dades guardades","Sin cobertura · datos guardados","Offline · saved data","Hors ligne · données enregistrées","Sem rede · dados guardados","Offline · dati salvati"],
  custom_pill:    ["Dades teves","Datos tuyos","Your data","Vos données","Dados seus","Dati tuoi"],
  usda_pill:      ["Dades: USDA (EUA)","Datos: USDA (EE. UU.)","Data: USDA (US)","Données : USDA (É.-U.)","Dados: USDA (EUA)","Dati: USDA (USA)"],
  see_all:        ["Veure tots els detalls","Ver todos los detalles","See all details","Voir tous les détails","Ver todos os detalhes","Vedi tutti i dettagli"],
  ingredients:    ["Ingredients","Ingredientes","Ingredients","Ingrédients","Ingredientes","Ingredienti"],
  portion_title:  ["Per ració ({g})","Por ración ({g})","Per serving ({g})","Par portion ({g})","Por porção ({g})","Per porzione ({g})"],
  portion_sugar:  ["Sucres","Azúcares","Sugars","Sucres","Açúcares","Zuccheri"],
  portion_salt:   ["Sal","Sal","Salt","Sel","Sal","Sale"],
  portion_sat:    ["Gr. saturats","Gr. saturadas","Sat. fat","Gr. saturées","Gord. saturada","Gr. saturi"],
  alt_btn:        ["Buscar alternatives més sanes","Buscar alternativas más sanas","Find healthier alternatives","Trouver des alternatives plus saines","Procurar alternativas mais saudáveis","Cerca alternative più sane"],
  alt_title:      ["Alternatives més sanes","Alternativas más sanas","Healthier alternatives","Alternatives plus saines","Alternativas mais saudáveis","Alternative più sane"],
  alt_searching:  ["Buscant a la mateixa categoria…","Buscando en la misma categoría…","Searching the same category…","Recherche dans la même catégorie…","A procurar na mesma categoria…","Cerco nella stessa categoria…"],
  alt_offline:    ["Cal cobertura per buscar alternatives.","Hace falta cobertura para buscar alternativas.","You need a connection to find alternatives.","Une connexion est nécessaire.","É preciso rede para procurar alternativas.","Serve una connessione per cercare alternative."],
  alt_none:       ["No n'he trobat cap de millor en aquesta categoria.","No he encontrado ninguno mejor en esta categoría.","No better option found in this category.","Aucune meilleure option dans cette catégorie.","Não encontrei nenhum melhor nesta categoria.","Nessuna opzione migliore in questa categoria."],
  again:          ["Escanejar un altre","Escanear otro","Scan another","Scanner un autre","Digitalizar outro","Scansiona un altro"],
  compare_btn:    ["Comparar amb un altre","Comparar con otro","Compare with another","Comparer avec un autre","Comparar com outro","Confronta con un altro"],
  add_ingr:       ["Afegir ingredients","Añadir ingredientes","Add ingredients","Ajouter les ingrédients","Adicionar ingredientes","Aggiungi ingredienti"],
  add_nutri:      ["Afegir dades nutricionals","Añadir datos nutricionales","Add nutrition data","Ajouter les valeurs nutritionnelles","Adicionar dados nutricionais","Aggiungi valori nutrizionali"],
  edit_mine:      ["Editar les meves dades","Editar mis datos","Edit my data","Modifier mes données","Editar os meus dados","Modifica i miei dati"],
  add_off:        ["Afegir-lo a Open Food Facts","Añadirlo a Open Food Facts","Add it to Open Food Facts","L'ajouter à Open Food Facts","Adicioná-lo ao Open Food Facts","Aggiungilo a Open Food Facts"],
  add_off_note:   ["Així el tindrà tothom la propera vegada.","Así lo tendrá todo el mundo la próxima vez.","So everyone has it next time.","Ainsi tout le monde l'aura la prochaine fois.","Assim todos o terão da próxima vez.","Così la prossima volta ce l'avranno tutti."],
  al_contains:    ["Conté: {list}","Contiene: {list}","Contains: {list}","Contient : {list}","Contém: {list}","Contiene: {list}"],
  al_marked:      ["Ho tens marcat al teu perfil.","Lo tienes marcado en tu perfil.","You flagged this in your profile.","Vous l'avez coché dans votre profil.","Marcou isto no seu perfil.","L'hai segnato nel tuo profilo."],
  al_traces:      ["Pot contenir traces de: {list}","Puede contener trazas de: {list}","May contain traces of: {list}","Peut contenir des traces de : {list}","Pode conter vestígios de: {list}","Può contenere tracce di: {list}"],
  nf_title:       ["No trobat","No encontrado","Not found","Introuvable","Não encontrado","Non trovato"],
  nf_sub:         ["Aquest producte no és a la base de dades","Este producto no está en la base de datos","This product isn't in the database","Ce produit n'est pas dans la base de données","Este produto não está na base de dados","Questo prodotto non è nel database"],
  nf_code:        ["Codi {code}","Código {code}","Code {code}","Code {code}","Código {code}","Codice {code}"],
  nf_good:        ["Mira l'etiqueta: si té 1 a 5 ingredients i els reconeixes tots, probablement és bo.","Mira la etiqueta: si tiene 1 a 5 ingredientes y los reconoces todos, probablemente es bueno.","Check the label: if it has 1 to 5 ingredients you recognise, it's probably good.","Regardez l'étiquette : 1 à 5 ingrédients que vous reconnaissez, c'est sans doute bon.","Veja o rótulo: se tiver 1 a 5 ingredientes que reconhece, provavelmente é bom.","Guarda l'etichetta: se ha da 1 a 5 ingredienti che riconosci, probabilmente è buono."],
  nf_bad:         ["Si hi veus xarops, aromes, oli de palma o molts E-, és ultraprocessat.","Si ves jarabes, aromas, aceite de palma o muchos E-, es ultraprocesado.","Syrups, flavourings, palm oil or many E-numbers mean ultra-processed.","Sirops, arômes, huile de palme ou beaucoup d'E- : ultra-transformé.","Xaropes, aromas, óleo de palma ou muitos E-: é ultraprocessado.","Sciroppi, aromi, olio di palma o molti E-: è ultra-processato."],
  msg_offline_t:  ["Sense connexió","Sin conexión","No connection","Pas de connexion","Sem ligação","Nessuna connessione"],
  msg_offline_d:  ["Aquest producte no l'havies consultat abans. Torna-ho a provar quan tinguis cobertura.","No habías consultado este producto antes. Vuelve a intentarlo cuando tengas cobertura.","You hadn't looked up this product before. Try again when you're online.","Vous n'aviez jamais consulté ce produit. Réessayez une fois connecté.","Não tinha consultado este produto antes. Tente de novo quando tiver rede.","Non avevi mai consultato questo prodotto. Riprova quando sei online."],
  qr_t:           ["QR sense producte","QR sin producto","QR without product","QR sans produit","QR sem produto","QR senza prodotto"],
  qr_d:           ["Aquest QR no porta el codi de l'aliment","Este QR no lleva el código del alimento","This QR code doesn't contain the product code","Ce QR ne contient pas le code du produit","Este QR não tem o código do produto","Questo QR non contiene il codice del prodotto"],
  qr_tip:         ["Prova d'escanejar el codi de barres de l'envàs.","Prueba a escanear el código de barras del envase.","Try scanning the barcode on the pack.","Essayez de scanner le code-barres de l'emballage.","Experimente digitalizar o código de barras da embalagem.","Prova a scansionare il codice a barre della confezione."],
  qr_link:        ["El QR porta a:","El QR lleva a:","The QR code links to:","Le QR mène à :","O QR leva a:","Il QR porta a:"],

  // ---------- Comparar ----------
  cmp_title:      ["Comparació","Comparación","Comparison","Comparaison","Comparação","Confronto"],
  cmp_sub:        ["Toca un producte per veure'l sencer","Toca un producto para verlo entero","Tap a product to see it in full","Touchez un produit pour le voir en entier","Toque num produto para o ver completo","Tocca un prodotto per vederlo per intero"],
  cmp_best_badge: ["MILLOR OPCIÓ","MEJOR OPCIÓN","BEST CHOICE","MEILLEUR CHOIX","MELHOR OPÇÃO","SCELTA MIGLIORE"],
  cmp_similar:    ["Són força semblants","Son bastante parecidos","They're quite similar","Ils sont assez similaires","São bastante parecidos","Sono piuttosto simili"],
  cmp_best:       ["Millor: {name}","Mejor: {name}","Better: {name}","Meilleur : {name}","Melhor: {name}","Migliore: {name}"],
  row_class:      ["Classificació","Clasificación","Rating","Classement","Classificação","Classificazione"],
  row_profile:    ["Per al teu perfil","Para tu perfil","For your profile","Pour votre profil","Para o seu perfil","Per il tuo profilo"],
  row_alerts:     ["Avisos teus","Tus avisos","Your alerts","Vos alertes","Os seus avisos","I tuoi avvisi"],
  row_sugar:      ["Sucres / 100 g","Azúcares / 100 g","Sugars / 100 g","Sucres / 100 g","Açúcares / 100 g","Zuccheri / 100 g"],
  row_salt:       ["Sal / 100 g","Sal / 100 g","Salt / 100 g","Sel / 100 g","Sal / 100 g","Sale / 100 g"],
  row_sat:        ["Greix saturat / 100 g","Grasa saturada / 100 g","Saturated fat / 100 g","Graisses saturées / 100 g","Gordura saturada / 100 g","Grassi saturi / 100 g"],
  row_adds:       ["Additius","Aditivos","Additives","Additifs","Aditivos","Additivi"],
  row_ingr:       ["Ingredients","Ingredientes","Ingredients","Ingrédients","Ingredientes","Ingredienti"],
  cmp_fail:       ["No s'han pogut carregar els dos productes. Revisa la connexió.","No se han podido cargar los dos productos. Revisa la conexión.","Couldn't load both products. Check your connection.","Impossible de charger les deux produits. Vérifiez la connexion.","Não foi possível carregar os dois produtos. Verifique a ligação.","Impossibile caricare i due prodotti. Controlla la connessione."],

  // ---------- Formulari ----------
  ed_title:       ["Afegir ingredients","Añadir ingredientes","Add ingredients","Ajouter les ingrédients","Adicionar ingredientes","Aggiungi ingredienti"],
  ed_photo:       ["Fer foto dels ingredients","Hacer foto de los ingredientes","Take a photo of the ingredients","Photographier les ingrédients","Fotografar os ingredientes","Fotografa gli ingredienti"],
  ed_photo_tip:   ["Foto plana, ben enfocada i amb bona llum","Foto plana, bien enfocada y con buena luz","Flat, in focus and well lit","Photo à plat, nette et bien éclairée","Foto plana, focada e com boa luz","Foto piatta, a fuoco e ben illuminata"],
  ed_name:        ["Nom del producte","Nombre del producto","Product name","Nom du produit","Nome do produto","Nome del prodotto"],
  ed_name_ph:     ["Iogurt natural","Yogur natural","Plain yogurt","Yaourt nature","Iogurte natural","Yogurt bianco"],
  ed_ingr_ph:     ["Llet pasteuritzada, ferments làctics","Leche pasteurizada, fermentos lácticos","Pasteurised milk, live cultures","Lait pasteurisé, ferments lactiques","Leite pasteurizado, fermentos lácticos","Latte pastorizzato, fermenti lattici"],
  ed_err:         ["Escriu els ingredients o fes-ne una foto","Escribe los ingredientes o hazles una foto","Type the ingredients or take a photo","Saisissez les ingrédients ou prenez une photo","Escreva os ingredientes ou tire uma foto","Scrivi gli ingredienti o fai una foto"],
  ed_tip:         ["Opcional: mira la taula nutricional, a la columna <b>per 100 g</b>.","Opcional: mira la tabla nutricional, en la columna <b>por 100 g</b>.","Optional: check the nutrition table, <b>per 100 g</b> column.","Facultatif : tableau nutritionnel, colonne <b>pour 100 g</b>.","Opcional: veja a tabela nutricional, coluna <b>por 100 g</b>.","Facoltativo: tabella nutrizionale, colonna <b>per 100 g</b>."],
  ed_sugar:       ["Sucres (g)","Azúcares (g)","Sugars (g)","Sucres (g)","Açúcares (g)","Zuccheri (g)"],
  ed_salt:        ["Sal (g)","Sal (g)","Salt (g)","Sel (g)","Sal (g)","Sale (g)"],
  ed_sat:         ["Gr. saturats","Gr. saturadas","Sat. fat","Gr. saturées","Gord. saturada","Gr. saturi"],
  ed_save:        ["Valorar producte","Valorar producto","Rate product","Évaluer le produit","Avaliar produto","Valuta il prodotto"],
  ed_delete:      ["Esborrar les meves dades","Borrar mis datos","Delete my data","Supprimer mes données","Apagar os meus dados","Elimina i miei dati"],
  ed_confirm:     ["Esborrar les dades que has afegit d'aquest producte?","¿Borrar los datos que has añadido de este producto?","Delete the data you added for this product?","Supprimer les données ajoutées pour ce produit ?","Apagar os dados que adicionou a este produto?","Eliminare i dati aggiunti per questo prodotto?"],
  ocr_loading:    ["Carregant el lector (només la primera vegada)…","Cargando el lector (solo la primera vez)…","Loading the reader (first time only)…","Chargement du lecteur (la première fois)…","A carregar o leitor (só da primeira vez)…","Carico il lettore (solo la prima volta)…"],
  ocr_preparing:  ["Preparant el lector…","Preparando el lector…","Preparing the reader…","Préparation du lecteur…","A preparar o leitor…","Preparo il lettore…"],
  ocr_reading:    ["Llegint el text… {p}%","Leyendo el texto… {p}%","Reading text… {p}%","Lecture du texte… {p} %","A ler o texto… {p}%","Leggo il testo… {p}%"],
  ocr_fail:       ["No he pogut llegir bé el text. Prova una altra foto més a prop o escriu-los a mà.","No he podido leer bien el texto. Prueba otra foto más cerca o escríbelos a mano.","Couldn't read the text well. Try a closer photo or type them in.","Texte mal lu. Essayez une photo plus proche ou saisissez-les.","Não consegui ler bem o texto. Tente outra foto mais perto ou escreva-os.","Non riesco a leggere bene il testo. Prova una foto più vicina o scrivili a mano."],
  ocr_done:       ["Fet! Revisa el text i corregeix el que calgui.","¡Hecho! Revisa el texto y corrige lo que haga falta.","Done! Check the text and fix anything wrong.","C'est fait ! Vérifiez et corrigez le texte.","Feito! Reveja o texto e corrija o que for preciso.","Fatto! Controlla il testo e correggi se serve."],
  ocr_err:        ["No s'ha pogut llegir la foto. Escriu els ingredients a mà.","No se ha podido leer la foto. Escribe los ingredientes a mano.","Couldn't read the photo. Type the ingredients in.","Impossible de lire la photo. Saisissez les ingrédients.","Não foi possível ler a foto. Escreva os ingredientes.","Impossibile leggere la foto. Scrivi gli ingredienti a mano."],

  // ---------- Motius ----------
  r_ultra:        ["Ingredients ultraprocessats: {list}","Ingredientes ultraprocesados: {list}","Ultra-processed ingredients: {list}","Ingrédients ultra-transformés : {list}","Ingredientes ultraprocessados: {list}","Ingredienti ultra-processati: {list}"],
  r_sugar_top:    ["Sucre afegit entre els primers ingredients","Azúcar añadido entre los primeros ingredientes","Added sugar among the first ingredients","Sucre ajouté parmi les premiers ingrédients","Açúcar adicionado entre os primeiros ingredientes","Zucchero aggiunto tra i primi ingredienti"],
  r_sugar_added:  ["Conté sucre afegit","Contiene azúcar añadido","Contains added sugar","Contient du sucre ajouté","Contém açúcar adicionado","Contiene zucchero aggiunto"],
  r_flour_refined:["Farina refinada (no integral)","Harina refinada (no integral)","Refined flour (not wholegrain)","Farine raffinée (pas complète)","Farinha refinada (não integral)","Farina raffinata (non integrale)"],
  r_semola_refined:["Sèmola refinada (no integral)","Sémola refinada (no integral)","Refined semolina (not wholegrain)","Semoule raffinée (pas complète)","Sêmola refinada (não integral)","Semola raffinata (non integrale)"],
  r_additives_e:  ["{n} additius: {list}","{n} aditivos: {list}","{n} additives: {list}","{n} additifs : {list}","{n} aditivos: {list}","{n} additivi: {list}"],
  r_additives_e_1:["1 additiu: {list}","1 aditivo: {list}","1 additive: {list}","1 additif : {list}","1 aditivo: {list}","1 additivo: {list}"],
  r_additives_cls:["Conté additius: {list}","Contiene aditivos: {list}","Contains additives: {list}","Contient des additifs : {list}","Contém aditivos: {list}","Contiene additivi: {list}"],
  r_oils:         ["Olis refinats: {list}","Aceites refinados: {list}","Refined oils: {list}","Huiles raffinées : {list}","Óleos refinados: {list}","Oli raffinati: {list}"],
  r_sugar_low:    ["Poc sucre: {v} g/100 g","Poco azúcar: {v} g/100 g","Low sugar: {v} g/100 g","Peu de sucre : {v} g/100 g","Pouco açúcar: {v} g/100 g","Pochi zuccheri: {v} g/100 g"],
  r_sugar_mid:    ["Sucre moderat: {v} g/100 g","Azúcar moderado: {v} g/100 g","Medium sugar: {v} g/100 g","Sucre modéré : {v} g/100 g","Açúcar moderado: {v} g/100 g","Zuccheri moderati: {v} g/100 g"],
  r_sugar_high:   ["Molt de sucre: {v} g/100 g","Mucho azúcar: {v} g/100 g","High sugar: {v} g/100 g","Beaucoup de sucre : {v} g/100 g","Muito açúcar: {v} g/100 g","Molti zuccheri: {v} g/100 g"],
  r_salt_low:     ["Poca sal: {v} g/100 g","Poca sal: {v} g/100 g","Low salt: {v} g/100 g","Peu de sel : {v} g/100 g","Pouco sal: {v} g/100 g","Poco sale: {v} g/100 g"],
  r_salt_mid:     ["Sal moderada: {v} g/100 g","Sal moderada: {v} g/100 g","Medium salt: {v} g/100 g","Sel modéré : {v} g/100 g","Sal moderado: {v} g/100 g","Sale moderato: {v} g/100 g"],
  r_salt_high:    ["Molta sal: {v} g/100 g","Mucha sal: {v} g/100 g","High salt: {v} g/100 g","Beaucoup de sel : {v} g/100 g","Muito sal: {v} g/100 g","Molto sale: {v} g/100 g"],
  r_sat_low:      ["Pocs greixos saturats: {v} g/100 g","Pocas grasas saturadas: {v} g/100 g","Low saturated fat: {v} g/100 g","Peu de graisses saturées : {v} g/100 g","Pouca gordura saturada: {v} g/100 g","Pochi grassi saturi: {v} g/100 g"],
  r_sat_mid:      ["Greixos saturats moderats: {v} g/100 g","Grasas saturadas moderadas: {v} g/100 g","Medium saturated fat: {v} g/100 g","Graisses saturées modérées : {v} g/100 g","Gordura saturada moderada: {v} g/100 g","Grassi saturi moderati: {v} g/100 g"],
  r_sat_high:     ["Molts greixos saturats: {v} g/100 g","Muchas grasas saturadas: {v} g/100 g","High saturated fat: {v} g/100 g","Beaucoup de graisses saturées : {v} g/100 g","Muita gordura saturada: {v} g/100 g","Molti grassi saturi: {v} g/100 g"],
  r_evoo:         ["Oli d'oliva verge","Aceite de oliva virgen","Virgin olive oil","Huile d'olive vierge","Azeite virgem","Olio d'oliva vergine"],
  r_whole:        ["Cereal integral","Cereal integral","Wholegrain","Céréale complète","Cereal integral","Cereale integrale"],
  r_no_additives: ["Sense additius","Sin aditivos","No additives","Sans additifs","Sem aditivos","Senza additivi"],
  r_few_ingr:     ["Només {n} ingredients","Solo {n} ingredientes","Only {n} ingredients","Seulement {n} ingrédients","Só {n} ingredientes","Solo {n} ingredienti"],
  r_few_ingr_1:   ["Un sol ingredient","Un solo ingrediente","Single ingredient","Un seul ingrédient","Um só ingrediente","Un solo ingrediente"],
  r_nodata:       ["El producte no té ingredients ni taula nutricional","El producto no tiene ingredientes ni tabla nutricional","No ingredients or nutrition table","Ni ingrédients ni tableau nutritionnel","O produto não tem ingredientes nem tabela nutricional","Nessun ingrediente né tabella nutrizionale"],
  r_syrup_small:  ["Conté xarop o dextrosa, però en poca quantitat","Contiene jarabe o dextrosa, pero en poca cantidad","Contains syrup or dextrose, but only a little","Contient du sirop ou du dextrose, en petite quantité","Contém xarope ou dextrose, mas pouco","Contiene sciroppo o destrosio, ma poco"],
  r_syrup:        ["Xarops o glucosa (pugen molt el sucre en sang)","Jarabes o glucosa (suben mucho el azúcar en sangre)","Syrups or glucose (spike blood sugar)","Sirops ou glucose (font monter la glycémie)","Xaropes ou glicose (sobem muito o açúcar no sangue)","Sciroppi o glucosio (alzano molto la glicemia)"],
  r_flour_fast:   ["Farina refinada (hidrats ràpids)","Harina refinada (hidratos rápidos)","Refined flour (fast carbs)","Farine raffinée (glucides rapides)","Farinha refinada (hidratos rápidos)","Farina raffinata (carboidrati rapidi)"],
  r_carbs:        ["Molts hidrats: {v} g/100 g","Muchos hidratos: {v} g/100 g","High carbs: {v} g/100 g","Beaucoup de glucides : {v} g/100 g","Muitos hidratos: {v} g/100 g","Molti carboidrati: {v} g/100 g"],
  r_fiber:        ["Ric en fibra: {v} g/100 g","Rico en fibra: {v} g/100 g","High fibre: {v} g/100 g","Riche en fibres : {v} g/100 g","Rico em fibra: {v} g/100 g","Ricco di fibre: {v} g/100 g"],
  r_nosugar_data: ["Sense dada de sucres: valorat només pels ingredients","Sin dato de azúcares: valorado solo por los ingredientes","No sugar data: rated on ingredients only","Pas de donnée sur les sucres : évalué sur les ingrédients","Sem dado de açúcares: avaliado só pelos ingredientes","Nessun dato sugli zuccheri: valutato solo dagli ingredienti"],
  r_sodium_adds:  ["Additius amb sodi: {list}","Aditivos con sodio: {list}","Sodium additives: {list}","Additifs sodés : {list}","Aditivos com sódio: {list}","Additivi con sodio: {list}"],
  r_procmeat_sodium:["Embotit o carn processada (molt de sodi)","Embutido o carne procesada (mucho sodio)","Processed meat (high sodium)","Charcuterie ou viande transformée (très salée)","Enchido ou carne processada (muito sódio)","Salume o carne lavorata (molto sodio)"],
  r_salt_top:     ["La sal surt entre els primers ingredients","La sal aparece entre los primeros ingredientes","Salt is among the first ingredients","Le sel figure parmi les premiers ingrédients","O sal está entre os primeiros ingredientes","Il sale è tra i primi ingredienti"],
  r_nosalt_data:  ["Sense dada de sal: valorat només pels ingredients","Sin dato de sal: valorado solo por los ingredientes","No salt data: rated on ingredients only","Pas de donnée sur le sel : évalué sur les ingrédients","Sem dado de sal: avaliado só pelos ingredientes","Nessun dato sul sale: valutato solo dagli ingredienti"],
  r_healthy_fat:  ["Greixos saludables (oli d'oliva, fruits secs, peix…)","Grasas saludables (aceite de oliva, frutos secos, pescado…)","Healthy fats (olive oil, nuts, oily fish…)","Bonnes graisses (huile d'olive, fruits à coque, poisson…)","Gorduras saudáveis (azeite, frutos secos, peixe…)","Grassi sani (olio d'oliva, frutta secca, pesce…)"],
  r_hydro:        ["Greixos hidrogenats o trans","Grasas hidrogenadas o trans","Hydrogenated or trans fats","Graisses hydrogénées ou trans","Gorduras hidrogenadas ou trans","Grassi idrogenati o trans"],
  r_palm:         ["Oli de palma (greix saturat)","Aceite de palma (grasa saturada)","Palm oil (saturated fat)","Huile de palme (graisse saturée)","Óleo de palma (gordura saturada)","Olio di palma (grasso saturo)"],
  r_coco:         ["Oli de coco (greix saturat)","Aceite de coco (grasa saturada)","Coconut oil (saturated fat)","Huile de coco (graisse saturée)","Óleo de coco (gordura saturada)","Olio di cocco (grasso saturo)"],
  r_procmeat:     ["Embotit o carn processada","Embutido o carne procesada","Processed meat","Charcuterie ou viande transformée","Enchido ou carne processada","Salume o carne lavorata"],
  r_fiber_col:    ["Ric en fibra (ajuda a baixar el colesterol): {v} g/100 g","Rico en fibra (ayuda a bajar el colesterol): {v} g/100 g","High fibre (helps lower cholesterol): {v} g/100 g","Riche en fibres (aide à baisser le cholestérol) : {v} g/100 g","Rico em fibra (ajuda a baixar o colesterol): {v} g/100 g","Ricco di fibre (aiuta ad abbassare il colesterolo): {v} g/100 g"],
  r_oats:         ["Conté civada (betaglucans)","Contiene avena (betaglucanos)","Contains oats (beta-glucans)","Contient de l'avoine (bêta-glucanes)","Contém aveia (betaglucanos)","Contiene avena (beta-glucani)"],
  r_nosat_data:   ["Sense dada de greixos saturats: valorat pels ingredients","Sin dato de grasas saturadas: valorado por los ingredientes","No saturated-fat data: rated on ingredients","Pas de donnée sur les graisses saturées : évalué sur les ingrédients","Sem dado de gordura saturada: avaliado pelos ingredientes","Nessun dato sui grassi saturi: valutato dagli ingredienti"],
  r_portion_sugar:["Ració petita ({g} g): només {v} g de sucre per ració","Ración pequeña ({g} g): solo {v} g de azúcar por ración","Small serving ({g} g): only {v} g sugar per serving","Petite portion ({g} g) : seulement {v} g de sucre","Porção pequena ({g} g): só {v} g de açúcar por porção","Porzione piccola ({g} g): solo {v} g di zuccheri"],
  r_portion_salt: ["Ració petita ({g} g): només {v} g de sal per ració","Ración pequeña ({g} g): solo {v} g de sal por ración","Small serving ({g} g): only {v} g salt per serving","Petite portion ({g} g) : seulement {v} g de sel","Porção pequena ({g} g): só {v} g de sal por porção","Porzione piccola ({g} g): solo {v} g di sale"],
  r_portion_sat:  ["Ració petita ({g} g): només {v} g de greix saturat per ració","Ración pequeña ({g} g): solo {v} g de grasa saturada por ración","Small serving ({g} g): only {v} g saturated fat per serving","Petite portion ({g} g) : seulement {v} g de graisses saturées","Porção pequena ({g} g): só {v} g de gordura saturada","Porzione piccola ({g} g): solo {v} g di grassi saturi"]
};

// ---------- Motor ----------
function detectLang(){
  try{ const s = localStorage.getItem("rf_lang"); if (s && LI[s] !== undefined) return s; }catch{}
  const nav = (navigator.languages || [navigator.language || "ca"]).map(l => l.slice(0,2).toLowerCase());
  return nav.find(l => LI[l] !== undefined) || "ca";
}
window.XLANG = detectLang();
function setLang(l){ window.XLANG = l; try{ localStorage.setItem("rf_lang", l); }catch{} document.documentElement.lang = l; }
const fmtNum = v => new Intl.NumberFormat(window.XLANG === "ca" ? "ca-ES" : window.XLANG, {maximumFractionDigits: 1}).format(v);
function t(key, vars){
  const v = vars || {};
  const k = (v.n === 1 && TX[key + "_1"]) ? key + "_1" : key;
  const row = TX[k];
  if (!row) return key;
  let s = row[LI[window.XLANG]] || row[0];
  return s.replace(/\{(\w+)\}/g, (_, name) => {
    const x = v[name];
    return x === undefined || x === null ? "" : (typeof x === "number" ? fmtNum(x) : String(x));
  });
}
// Tradueix els elements fixos de la pàgina: data-i18n (text), data-i18n-html, data-i18n-ph (placeholder), data-i18n-aria
function applyI18n(root){
  const r = root || document;
  r.querySelectorAll("[data-i18n]").forEach(el => el.textContent = t(el.dataset.i18n));
  r.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
  r.querySelectorAll("[data-i18n-ph]").forEach(el => el.placeholder = t(el.dataset.i18nPh));
  r.querySelectorAll("[data-i18n-aria]").forEach(el => el.setAttribute("aria-label", t(el.dataset.i18nAria)));
  document.documentElement.lang = window.XLANG;
}
