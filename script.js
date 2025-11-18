
const fileInput=document.getElementById('fileInput');
const playlist=document.getElementById('playlist');
const audio=document.getElementById('audio');
const canvas=document.getElementById('visualizer');
const ctx=canvas.getContext('2d');
let currentList=[];
let audioCtx, analyser;

function startVisualizer(){
 audioCtx=new(window.AudioContext||window.webkitAudioContext)();
 const src=audioCtx.createMediaElementSource(audio);
 analyser=audioCtx.createAnalyser();
 src.connect(analyser);
 analyser.connect(audioCtx.destination);
 analyser.fftSize=256;
 let bufferLength=analyser.frequencyBinCount;
 let dataArray=new Uint8Array(bufferLength);

 function animate(){
  requestAnimationFrame(animate);
  analyser.getByteFrequencyData(dataArray);
  ctx.fillStyle='#000';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  let barWidth=(canvas.width/bufferLength)*2.5;
  let x=0;
  for(let i=0;i<bufferLength;i++){
   let barHeight=dataArray[i];
   ctx.fillStyle='rgb('+(barHeight+100)+',50,200)';
   ctx.fillRect(x,canvas.height-barHeight,barWidth,barHeight);
   x+=barWidth+1;
  }
 }
 animate();
}

audio.onplay=()=>{ if(!audioCtx) startVisualizer(); };

fileInput.onchange=()=>{
 playlist.innerHTML='';
 currentList=[];
 [...fileInput.files].forEach(f=>{
  const url=URL.createObjectURL(f);
  currentList.push({name:f.name, url:url});
  const li=document.createElement('li');
  li.textContent=f.name;
  li.onclick=()=>audio.src=url;
  playlist.appendChild(li);
 });
 saveLocal();
};

function addEmbed(){
 const url=document.getElementById('embedUrl').value;
 if(!url) return;
 let code="";
 if(url.includes("youtube")){
  let id=url.split("v=")[1]?.split("&")[0];
  code=`<iframe width='360' height='220' src='https://www.youtube.com/embed/${id}'></iframe>`;
 } else if(url.includes("soundcloud")){
  code=`<iframe width='360' height='220' src='https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}'></iframe>`;
 }
 document.getElementById('embeds').innerHTML += code;
}

function saveLocal(){ localStorage.setItem("musicworld", JSON.stringify(currentList)); }
function savePlaylist(){ saveLocal(); document.getElementById("status").innerText="Playlist Saved!"; }

function loadPlaylist(){
 let data=localStorage.getItem("musicworld");
 if(!data){document.getElementById("status").innerText="No saved playlist found";return;}
 playlist.innerHTML='';
 currentList=JSON.parse(data);
 currentList.forEach(t=>{
  const li=document.createElement('li');
  li.textContent=t.name;
  li.onclick=()=>audio.src=t.url;
  playlist.appendChild(li);
 });
 document.getElementById("status").innerText="Playlist Loaded!";
}
