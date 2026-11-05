const filters=[...document.querySelectorAll('.filters button')];
const projects=[...document.querySelectorAll('.project')];
const mediaBase=(window.MEDIA_BASE_URL||'').replace(/\/$/,'');
if(mediaBase){document.querySelectorAll('video[src^="media/"]').forEach(video=>{video.dataset.localSrc=video.getAttribute('src');video.src=`${mediaBase}/${encodeURI(video.dataset.localSrc.slice(6))}`;});}
const folderItems={all:['宣传片','影视混剪','讲解视频','AI视频']};
const categoryMap={'宣传片':'film','影视混剪':'edit','讲解视频':'drone','AI视频':'ai'};
if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
  }),{threshold:.18,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.work-head,.folder-float').forEach(element=>revealObserver.observe(element));
}else document.querySelectorAll('.work-head,.folder-float').forEach(element=>element.classList.add('is-visible'));
projects.forEach(project=>project.hidden=true);
const folder=document.querySelector('.folder-float');
const preview=document.createElement('div');
preview.className='folder-preview';
preview.innerHTML='<button class="folder-preview__close" aria-label="关闭预览">×</button><div class="folder-preview__videos"></div>';
folder.append(preview);
const previewVideos=preview.querySelector('.folder-preview__videos');
function retractPreview(){
  if(!folder.hasAttribute('data-preview')||folder.hasAttribute('data-retracting'))return;
  folder.setAttribute('data-retracting','');
  previewVideos.querySelectorAll('video').forEach(video=>video.pause());
  window.setTimeout(()=>{previewVideos.replaceChildren();folder.removeAttribute('data-preview');folder.removeAttribute('data-retracting');folder.setAttribute('data-open','');folder.querySelector('.folder-float__trigger').setAttribute('aria-expanded','true');},650);
}
document.querySelectorAll('.folder-float').forEach(folder=>{
  const items=folderItems[folder.dataset.folder],container=folder.querySelector('.folder-float__items');
  items.forEach((label,index)=>{const button=document.createElement('button');button.className='folder-float__item';button.textContent=label;button.style.setProperty('--x',`${index%2===0?-82:82}px`);button.style.setProperty('--y',`${index<2?-66:-20}px`);button.style.setProperty('--r',`${index%2===0?-5:5}deg`);button.addEventListener('click',()=>{const matches=projects.filter(project=>project.dataset.category===categoryMap[label]);if(!matches.length)return;previewVideos.replaceChildren(...matches.map((project,videoIndex)=>{const card=document.createElement('article');card.className='folder-preview__card';const video=document.createElement('video');video.src=project.querySelector('video').src;video.preload='none';video.controls=true;video.playsInline=true;const title=document.createElement('p');title.textContent=`${label} ${videoIndex+1}`;card.append(video,title);return card;}));folder.setAttribute('data-preview','');});container.append(button);});
  folder.querySelector('.folder-float__trigger').addEventListener('click',()=>{if(folder.hasAttribute('data-preview')){retractPreview();return;}if(folder.hasAttribute('data-retracting'))return;const open=!folder.hasAttribute('data-open');document.querySelectorAll('.folder-float').forEach(other=>{other.removeAttribute('data-open');other.querySelector('.folder-float__trigger').setAttribute('aria-expanded','false');});if(open){folder.setAttribute('data-open','');folder.querySelector('.folder-float__trigger').setAttribute('aria-expanded','true');}});
});
preview.querySelector('.folder-preview__close').addEventListener('click',retractPreview);
document.querySelectorAll('.media').forEach(media=>media.addEventListener('click',async()=>{
  const video=media.querySelector('video');
  if(video.paused){document.querySelectorAll('.media video').forEach(other=>{if(other!==video){other.pause();other.closest('.media').classList.remove('is-playing');}});video.muted=false;try{await video.play();media.classList.add('is-playing');}catch{}}
  else{video.pause();media.classList.remove('is-playing');}
}));
document.querySelectorAll('.media video').forEach(video=>video.addEventListener('ended',()=>video.closest('.media').classList.remove('is-playing')));

document.addEventListener('pointermove',event=>{
  const card=event.target.closest('.folder-float__folder,.folder-preview__card');
  if(!card)return;
  const rect=card.getBoundingClientRect();
  const x=(event.clientX-rect.left)/rect.width;
  const y=(event.clientY-rect.top)/rect.height;
  card.style.setProperty('--tilt-x',`${(0.5-y)*16}deg`);
  card.style.setProperty('--tilt-y',`${(x-0.5)*18}deg`);
  card.style.setProperty('--shine-x',`${x*100}%`);
  card.style.setProperty('--shine-y',`${y*100}%`);
});
document.addEventListener('pointerout',event=>{
  const card=event.target.closest('.folder-float__folder,.folder-preview__card');
  if(card&&!card.contains(event.relatedTarget)){card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');}
});
const heroCopy=document.querySelector('.opening-title');
if(heroCopy){
  heroCopy.addEventListener('pointermove',event=>{
    const rect=heroCopy.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    heroCopy.style.setProperty('--hero-rx',`${-y*5}deg`);
    heroCopy.style.setProperty('--hero-ry',`${x*6}deg`);
  });
  heroCopy.addEventListener('pointerleave',()=>{heroCopy.style.setProperty('--hero-rx','0deg');heroCopy.style.setProperty('--hero-ry','0deg');});
}
