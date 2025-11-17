const fileInput=document.getElementById('fileInput');
const playlist=document.getElementById('playlist');
const audio=document.getElementById('audio');
fileInput.onchange=()=>{
 playlist.innerHTML='';
 [...fileInput.files].forEach(f=>{
  const li=document.createElement('li');
  li.textContent=f.name;
  li.onclick=()=>audio.src=URL.createObjectURL(f);
  playlist.appendChild(li);
 });
};
function addEmbed(){
 const url=document.getElementById('embedUrl').value;
 if(!url)return;
 const div=document.createElement('div');
 if(url.includes("youtube")){
  let id=url.split("v=")[1]?.split("&")[0];
  div.innerHTML=`<iframe width="300" height="200" src="https://www.youtube.com/embed/${id}"></iframe>`;
 }else if(url.includes("soundcloud")){
  div.innerHTML=`<iframe width="300" height="200" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}"></iframe>`;
 }
 document.getElementById('embeds').appendChild(div);
}