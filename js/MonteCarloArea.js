import Canvas from './Canvas.js';
import Editor from './Editor.js';
import {loadAreaResults, resetResults} from './ResultLoader.js'

let canvas = new Canvas('canvas');
let editor = new Editor(canvas);

document.getElementById('upload').addEventListener("click", () => {
    editor.loadImage();
});

document.getElementById('move').addEventListener("click", () => {
    editor.setActiveTool('move');
})