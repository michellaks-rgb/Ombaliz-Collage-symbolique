const symbolGroups = [
  ['M’appuyer sur moi', [
    ['lighthouse','Le phare','Discernement','Retrouver un repère quand tout semble flou.','M12 23h16l4 31H8z M10 23v-8h20v8 M10 15l10-8 10 8 M17 54V43h6v11 M4 18H0m40 0h4 M12 32h16'],
    ['door','La porte entrouverte','Courage','Oser un premier pas malgré l’appréhension.','M9 54V9h28v45 M9 9l20 7v42L9 54 M22 37h1 M42 28h10m-5-5 5 5-5 5'],
    ['shield','Le bouclier souple','Poser ses limites','Dire non calmement et protéger son énergie.','M25 8c6 5 11 6 17 7v15c0 11-7 20-17 25C15 50 8 41 8 30V15c6-1 11-2 17-7z M18 31h14'],
    ['anchor','L’ancre','Stabilité','Revenir à un repère familier quand ça tangue.','M25 20v32 M15 27h20 M6 39c1 8 8 13 19 13s18-5 19-13 M6 46v-7h7 M37 39h7v7 M25 20a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'],
    ['hourglass','Le sablier','Patience','Laisser le temps agir sans forcer.','M13 10h24 M13 54h24 M15 10c0 13 3 17 10 22-7 5-10 9-10 22 M35 10c0 13-3 17-10 22 7 5 10 9 10 22 M19 49l6-5 6 5']
  ]],
  ['Créer du lien', [
    ['bridge','Le pont','Dialogue','Faire le premier geste pour reprendre contact.','M3 43h44 M7 43c5-21 31-21 36 0 M8 43v10m34-10v10 M12 35v8m13-14v14m13-8v8'],
    ['cup','La tasse chaude','Bienveillance','Accueillir une difficulté avec douceur.','M10 29h27v9c0 8-5 13-13 13S10 46 10 38z M37 32h5a5 5 0 0 1 0 10h-6 M6 55h36 M17 22c-6-6 6-7 0-13 M28 22c-6-6 6-7 0-13'],
    ['shell','Le coquillage','Écoute','Faire de la place à ce que l’autre veut dire.','M25 53C15 50 4 37 4 25c0-9 8-15 14-11 4-7 11-7 15 0 6-4 13 3 13 11 0 12-11 25-21 28z M25 47V15 M21 46 13 22m16 24 8-24'],
    ['bench','Le banc à deux places','Présence','Rester auprès de quelqu’un sans chercher à tout résoudre.','M7 24h36v13H7z M5 42h40v7H5z M11 49v8m28-8v8 M12 37v5m26-5v5'],
    ['knots','Les deux nœuds','Coopération','Répartir l’effort et demander un coup de main.','M4 28h9c4 0 4-8 10-8s7 7 2 11l-7 6c-4 4-1 10 4 10 7 0 10-10 16-10h8 M4 37h8m24-9h10']
  ]],
  ['Apprendre et avancer', [
    ['compass','La boussole','Prise de décision','Choisir une direction en fonction de ce qui compte.','M25 53a21 21 0 1 0 0-42 21 21 0 0 0 0 42z M17 41l5-13 11-6-5 13z M25 6v5'],
    ['stairs','Les marches','Persévérance','Reprendre par un petit pas après un revers.','M5 53h12V42h11V31h11V20h8 M38 11h9v9'],
    ['kite','Le cerf-volant','Souplesse','Ajuster sa manière de faire quand les conditions changent.','M28 9l16 15-16 19L12 24z M28 9v34 M12 24h32 M28 43c-10 3 5 9-8 14'],
    ['lens','La loupe','Curiosité','Poser une question avant de tirer une conclusion.','M23 42a15 15 0 1 0 0-30 15 15 0 0 0 0 30z M34 39l12 14 M15 26c0-5 4-8 8-8'],
    ['pencil','Le crayon','Créativité','Imaginer une autre façon de s’y prendre.','M8 48l4-13 22-22 9 9-22 22z M12 35l9 9 M30 17l9 9 M7 55h36 M7 20h10m-5-5v10']
  ]]
];
const symbolsById = new Map(symbolGroups.flatMap(([,symbols])=>symbols.map(symbol=>[symbol[0],symbol])));
function symbolDrawing(symbol) {
  return '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="96" viewBox="-3 0 58 64" aria-hidden="true"><rect x="-2" y="2" width="56" height="60" rx="16" fill="#f6e7d1"/><circle cx="38" cy="22" r="12" fill="#dfb3bc" opacity=".6"/><path d="'+symbol[4]+'" fill="none" stroke="#174650" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
const symbolLimit=3;
function selectedSymbols(figure){
  return [...new Set(figure.symbolIds??[figure.symbolId])].filter(id=>symbolsById.has(id)).slice(0,symbolLimit);
}
function symbolCount(ids){return ids.length+' / '+symbolLimit+' symboles sélectionnés.'}
function symbolPalette(figure) {
  const selected=selectedSymbols(figure);
  return '<section class="symbol-palette"><h3>Quels symboles racontent ses forces ?</h3><p class="hint">Choisissez jusqu’à trois dessins. Touchez un dessin sélectionné pour le retirer.</p>'+
    symbolGroups.map(([group,symbols],i)=>'<details '+(i===0||symbols.some(([id])=>selected.includes(id))?'open':'')+'><summary>'+group+'</summary><div class="symbol-grid">'+symbols.map(symbol=>'<button type="button" data-symbol="'+symbol[0]+'" aria-pressed="'+(selected.includes(symbol[0]))+'">'+symbolDrawing(symbol)+'<strong>'+symbol[1]+'</strong><span>'+symbol[2]+'</span><small>'+symbol[3]+'</small></button>').join('')+'</div></details>').join('')+
    '<p id="symbol-count" class="hint" role="status">'+symbolCount(selected)+'</p></section>';
}
