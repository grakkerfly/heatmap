// Copy contract
function copyContract() {
  navigator.clipboard.writeText("0x58e609879b19f90b4fdb3151bc24176b4b935b94");
  alert("Contract copied!");
}

// Mouse heatmap effect
document.addEventListener('mousemove', function(e){
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.left = e.pageX + 'px';
  div.style.top = e.pageY + 'px';
  div.style.width = '30px';
  div.style.height = '30px';
  div.style.borderRadius = '50%';
  div.style.background = 'rgba(255,0,0,0.2)';
  div.style.pointerEvents = 'none';
  document.body.appendChild(div);
  setTimeout(()=>div.remove(),300);
});

// PFP Editor
const pfpInput = document.getElementById('pfp-input');
const pfpCanvas = document.getElementById('pfp-canvas');
const ctx = pfpCanvas.getContext('2d');
const filterSelect = document.getElementById('filter-select');
const fileButton = document.getElementById('file-button');
const fileName = document.getElementById('file-name');

let originalImage = null;

const heatmaps = [
  ['#00008B','#0000FF','#800080','#00FF00','#FFFF00','#FF0000','#FFFFFF'],
  ['#FF0000','#FFFF00','#00FF00','#800080','#0000FF','#00008B','#FFFFFF'],
  ['#00FF00','#FF0000','#FFFFFF','#00008B','#0000FF','#800080','#FFFF00'],
  ['#800080','#00008B','#FFFFFF','#FF0000','#FFFF00','#00FF00','#0000FF'],
  ['#FFFFFF','#FF0000','#FFFF00','#00FF00','#0000FF','#00008B','#800080']
];

// Botão visual abre o input real
fileButton.addEventListener('click', () => {
  pfpInput.click();
});

// Atualiza nome do arquivo
pfpInput.addEventListener('change', () => {
  if (pfpInput.files.length > 0) {
    fileName.textContent = pfpInput.files[0].name;
    const file = pfpInput.files[0];
    const reader = new FileReader();
    reader.onload = function(e){
      const img = new Image();
      img.onload = function(){
        originalImage = img;
        // aumentar tamanho do canvas
        pfpCanvas.width = img.width * 1.2;
        pfpCanvas.height = img.height * 1.2;
        ctx.drawImage(img,0,0, pfpCanvas.width, pfpCanvas.height);
        applyFilter();
      }
      img.src = e.target.result;
    }
    reader.readAsDataURL(file);
  } else {
    fileName.textContent = 'No file chosen';
  }
});

filterSelect.addEventListener('change', applyFilter);

function applyFilter() {
  if(!originalImage) return;
  ctx.drawImage(originalImage,0,0, pfpCanvas.width, pfpCanvas.height);
  const imageData = ctx.getImageData(0,0,pfpCanvas.width,pfpCanvas.height);
  const data = imageData.data;
  const colors = heatmaps[filterSelect.value];
  for(let i=0;i<data.length;i+=4){
    const avg = (data[i]+data[i+1]+data[i+2])/3;
    const colorIndex = Math.floor(avg/36) % colors.length;
    const color = hexToRgb(colors[colorIndex]);
    data[i] = color.r;
    data[i+1] = color.g;
    data[i+2] = color.b;
  }
  ctx.putImageData(imageData,0,0);
}

function hexToRgb(hex){
  const bigint = parseInt(hex.replace('#',''),16);
  return {r:(bigint>>16)&255,g:(bigint>>8)&255,b:bigint&255};
}

function savePFP(){
  const link = document.createElement('a');
  link.download = 'pfp.png';
  link.href = pfpCanvas.toDataURL();
  link.click();
}

