(function(){
 const menu=document.querySelector('.menu-button'),nav=document.querySelector('.nav');
 if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));}
 const initial={manufactured:100,sold:0,stock:100,distributors:1,customers:0,orders:0};
 let stats={...initial};try{const saved=JSON.parse(localStorage.getItem('primesun_public_stats')||'null');if(saved&&typeof saved==='object')stats={...initial,...saved};}catch(e){}
 document.querySelectorAll('[data-stat]').forEach(el=>{const key=el.dataset.stat;if(key==='stock-label')el.textContent=Number(stats.stock).toLocaleString('en-IN')+' units';else if(Number.isFinite(Number(stats[key])))el.textContent=Number(stats[key]).toLocaleString('en-IN');});
 const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
 const revealEls=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.12});revealEls.forEach(el=>observer.observe(el));}else revealEls.forEach(el=>el.classList.add('visible'));

 const defaults={categories:[{id:'home-care',name:'PRIMESUN HOME CARE',description:'Cleaning, freshness and everyday care essentials.'},{id:'fresoul',name:'PRIMESUN FRESOUL',description:'Fragrance-led products and fresh living experiences.'}],products:[{id:'colizon-glass-cleaner',name:'COLIZON Glass Cleaner',categoryId:'home-care',size:'500 ml',description:'Glass cleaner from the COLIZON range.',image:'assets/colizon-glass-cleaner-500ml.png'},{id:'freshsoul-room-freshener',name:'FreshSoul Room Freshener',categoryId:'fresoul',size:'100 ml / 250 ml / 350 ml',description:'Room freshener from the FreshSoul range.',image:'assets/freshsoul-rose-250ml.png'}]};
 let catalogue;try{catalogue=JSON.parse(localStorage.getItem('primesun_catalogue')||'null')}catch(e){}
 if(!catalogue||!Array.isArray(catalogue.categories)||!Array.isArray(catalogue.products))catalogue=defaults;
 const filters=document.getElementById('categoryFilters'),content=document.getElementById('catalogContent');
 if(filters&&content){
  let active='all';
  const render=()=>{
   filters.innerHTML='';const all=document.createElement('button');all.className='catalog-filter'+(active==='all'?' active':'');all.textContent='ALL CATEGORIES';all.onclick=()=>{active='all';render()};filters.append(all);
   catalogue.categories.forEach(c=>{const b=document.createElement('button');b.className='catalog-filter'+(active===c.id?' active':'');b.textContent=c.name;b.onclick=()=>{active=c.id;render()};filters.append(b)});
   content.innerHTML='';
   const cats=catalogue.categories.filter(c=>active==='all'||active===c.id);
   cats.forEach(c=>{
    const section=document.createElement('section');section.className='catalog-section';section.id=c.id;
    const head=document.createElement('div');head.className='catalog-section-head';const title=document.createElement('div');const label=document.createElement('div');label.className='micro-label';label.textContent='PRIMESUN / CATEGORY';const h=document.createElement('h2');h.textContent=c.name;title.append(label,h);const desc=document.createElement('p');desc.textContent=c.description||'Explore products in this category.';head.append(title,desc);section.append(head);
    const grid=document.createElement('div');grid.className='product-grid';const items=catalogue.products.filter(p=>p.categoryId===c.id);
    if(!items.length){const empty=document.createElement('div');empty.className='catalog-empty';empty.textContent='New products in this category will be listed here.';grid.append(empty)}
    items.forEach(p=>{const card=document.createElement('article');card.className='product-card';const image=document.createElement('div');image.className='product-image';if(p.image){const img=document.createElement('img');img.src=p.image;img.alt=p.name;img.onerror=()=>{img.remove();const ph=document.createElement('div');ph.className='product-placeholder';ph.textContent='✳';image.append(ph)};image.append(img)}else{const ph=document.createElement('div');ph.className='product-placeholder';ph.textContent='✳';image.append(ph)}
     const meta=document.createElement('div');meta.className='product-meta';meta.textContent=c.name;const name=document.createElement('h3');name.textContent=p.name;const description=document.createElement('p');description.textContent=p.description||'Product details will be updated soon.';const size=document.createElement('div');size.className='product-size';size.textContent=p.size||'Size details coming soon';card.append(image,meta,name,description,size);
     card.style.cursor='pointer';card.tabIndex=0;card.setAttribute('role','button');const open=()=>{const modal=document.getElementById('productDetail');if(!modal)return;document.getElementById('detailCategory').textContent=c.name;document.getElementById('detailName').textContent=p.name;document.getElementById('detailDescription').textContent=p.description||'Product details will be updated soon.';document.getElementById('detailSizes').textContent=p.size||'';modal.classList.add('open')};card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}});grid.append(card)});
    section.append(grid);content.append(section);
   });
  };
  render();
  const close=document.getElementById('detailClose'),modal=document.getElementById('productDetail');if(close&&modal){close.onclick=()=>modal.classList.remove('open');modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('open')})}
 }
})();