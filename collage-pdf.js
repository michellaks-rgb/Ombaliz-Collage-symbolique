async function makeCollagePdf(figures, contact) {
  const {PDFDocument, StandardFonts, rgb} = PDFLib;
  const doc = await PDFDocument.create();
  doc.setTitle('Mon collage symbolique');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ink = rgb(.08,.23,.27), wine = rgb(.50,.22,.31), cream = rgb(.97,.94,.90);
  const logoResponse = await fetch('./ombaliz-logo.png');
  if (!logoResponse.ok) throw new Error('Logo indisponible');
  const logo = await doc.embedPng(await logoResponse.arrayBuffer());
  let page, y;
  function newPage() {
    page = doc.addPage([595.28,841.89]);
    const mark = logo.scaleToFit(155,58);
    page.drawImage(logo,{x:42,y:796-mark.height,width:mark.width,height:mark.height});
    page.drawLine({start:{x:42,y:724},end:{x:553,y:724},color:wine,thickness:1});
    page.drawText(String(doc.getPageCount()),{x:542,y:27,font:regular,size:10,color:ink});
    y=702;
  }
  function safe(value,font) {
    return [...String(value??'').normalize('NFC')].map(char=>{
      if(char==='\n')return char;
      try{font.encodeText(char);return char}catch{return '?'}
    }).join('');
  }
  function lines(value,font,size,width) {
    return safe(value,font).split('\n').flatMap(paragraph=>{
      const result=[]; let line='';
      for(const word of paragraph.split(/\s+/)){
        const candidate=line?line+' '+word:word;
        if(font.widthOfTextAtSize(candidate,size)<=width){line=candidate;continue}
        if(line)result.push(line);
        line=word;
      }
      result.push(line);
      return result;
    });
  }
  function text(value,{font=regular,size=12,color=ink,x=42,width=511}={}) {
    for(const line of lines(value,font,size,width)){
      if(y<56)newPage();
      const lineWidth=font.widthOfTextAtSize(line,size);
      const lineSize=lineWidth>width?size*width/lineWidth:size;
      page.drawText(line,{x,y,size:lineSize,font,color});
      y-=size+5;
    }
  }
  function section(label,value) {
    if(!String(value??'').trim())return;
    if(y<90)newPage();
    text(label,{font:bold,color:wine,size:11});
    text(value);
    y-=8;
  }
  newPage();
  text('Mon collage symbolique',{font:bold,size:28});
  y-=9;
  text(contact.firstName+'  ·  '+contact.email+'  ·  '+contact.phone);
  text(new Intl.DateTimeFormat('fr-FR',{dateStyle:'long'}).format(new Date()));
  y-=16;
  const images = [];
  for(const f of figures){
    const artwork=[];
    images.push(artwork);
    if(f.image)artwork.push(await doc.embedJpg(f.image));
    for(const id of selectedSymbols(f)){
      const symbol=symbolsById.get(id);
      const url=URL.createObjectURL(new Blob([symbolDrawing(symbol)],{type:'image/svg+xml'}));
      try{
        const drawing=new Image();drawing.src=url;await drawing.decode();
        const canvas=document.createElement('canvas');canvas.width=240;canvas.height=288;
        canvas.getContext('2d').drawImage(drawing,0,0,240,288);
        artwork.push(await doc.embedPng(canvas.toDataURL('image/png')));
      }finally{URL.revokeObjectURL(url)}
    }
    if(!artwork.length&&f.icon && typeof document!=='undefined'){
      const canvas=document.createElement('canvas');
      canvas.width=canvas.height=160;
      const ctx=canvas.getContext('2d');
      ctx.font='88px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillStyle='#80384f';ctx.fillText(f.icon,80,86);
      artwork.push(await doc.embedPng(canvas.toDataURL('image/png')));
    }
  }
  for(let i=0;i<figures.length;i++){
    if(y<225)newPage();
    const f=figures[i], artwork=images[i], ids=selectedSymbols(f);
    const wide=ids.length===3;
    const panelHeight=wide?90:146, panelWidth=wide?511:146;
    page.drawRectangle({x:42,y:y+14-panelHeight,width:panelWidth,height:panelHeight,color:cream});
    if(artwork.length){
      artwork.forEach((image,index)=>{
        const columns=wide?artwork.length:artwork.length===1?1:2;
        const rows=Math.ceil(artwork.length/columns);
        const cellWidth=panelWidth/columns, cellHeight=panelHeight/rows;
        const {width,height}=image.scaleToFit(cellWidth-6,cellHeight-6);
        page.drawImage(image,{x:42+(index%columns)*cellWidth+(cellWidth-width)/2,y:y+14-(Math.floor(index/columns)+1)*cellHeight+(cellHeight-height)/2,width,height});
      });
    }else{
      const centerY=y-59;
      page.drawSvgPath('M 0 -25 L 22 0 L 0 25 L -22 0 Z',{x:115,y:centerY,color:wine});
    }
    const bottom=y+14-panelHeight-17, figurePage=page;
    const layout=wide?{x:42,width:511}:{x:208,width:345};
    if(wide)y=bottom;
    text('FIGURE '+(i+1),{...layout,font:bold,color:wine,size:10});
    text(f.name,{...layout,font:bold,size:18});
    for(const id of ids){
      const symbol=symbolsById.get(id);
      text(symbol[1]+' · '+symbol[2],{...layout,color:wine});
    }
    if(f.q?.length)text('Qualités · '+f.q.join(', '),{...layout});
    if(f.v?.length)text('Valeurs · '+f.v.join(', '),{...layout});
    y=page===figurePage?Math.min(y-10,bottom):y-10;
    section('Ce qui me touche',f.why);
    section('Ce que je retiens',f.found);
    section('Sa phrase de soutien',f.message);
    section('Mon petit pas',f.action);
    y-=15;
  }
  return new File([await doc.save()],'Mon-collage-symbolique.pdf',{type:'application/pdf'});
}
