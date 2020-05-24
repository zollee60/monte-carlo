import Canvas from './Canvas.js';
import Editor from './Editor.js';
import {loadAreaResults, resetResults} from './ResultLoader.js'

let imgCanvas = new Canvas('image-layer');
let drawCanvas = new Canvas('draw-layer');
let editor = new Editor(imgCanvas, drawCanvas);

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

document.getElementById('circle').addEventListener("click", () => {
    console.log("activeTool is circle")
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