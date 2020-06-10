import Canvas from './Canvas.js';
import Editor from './Editor.js';
import CustomChart from './CustomChart.js';
import {loadAreaResults, resetResults} from './ResultLoader.js'

let imgCanvas = new Canvas('image-layer');
let drawCanvas = new Canvas('draw-layer');
let scaleCanvas = new Canvas('scale-layer');
let editor = new Editor(imgCanvas, drawCanvas, scaleCanvas);
let cc = new CustomChart('chart');

document.getElementById('upload').addEventListener("click", () => {
    editor.loadImage();
});

document.getElementById('move').addEventListener("click", () => {
    editor.setActiveTool('move');
})

document.getElementById('select').addEventListener("click", () => {
    editor.setActiveTool('select');
});

document.getElementById('square').addEventListener("click", () => {
    editor.setActiveTool('square');
});

document.getElementById('scale').addEventListener("click", () => {
    editor.setActiveTool('scale');
});

document.getElementById('circle').addEventListener("click", () => {
    editor.setActiveTool('circle');
});

document.getElementById('autofill').addEventListener("change", (e) => {
    editor.autoFill = e.target.checked;
});

document.getElementById('bsSlider').addEventListener("input", (e) => {
    let value = parseFloat(e.target.value)
    let span = document.getElementById('bssValue');
    editor.burshSize = value;
    span.style.left = value + "%";
});

document.getElementById('calc').addEventListener("click", () =>{
    if(editor.img !== null){
        const W = editor.img.width;
        const H = editor.img.height;
        const D = parseFloat(document.getElementById('D').value);
        const N = parseFloat(document.getElementById('N').value);

        editor.drawCanvas.resetCanvas();
        cc.show();
        editor.drawCanvas.subscribe(cc);
        editor.setFixedSizedOSCanvasImage(editor.drawCanvas, W, H);
        editor.drawCanvas.genNewRandom(D,N,W,H);
    }
    
});