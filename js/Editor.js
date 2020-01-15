export default class Editor {

    constructor(canvas) {
        this.numOfDraws = parseFloat(document.getElementById('D').value);
        this.numOfPoints = parseFloat(document.getElementById('N').value);
        this.canvas = canvas;
        this.img = null;
        this.activeTool = null;
        this.scale = 1;
        this.scaleStep = 0.25;
        this.dragInfo = {
            isDragging: false,
            startX: 0,
            startY: 0,
            diffX: 0,
            diffY: 0,
            canvasX: 0,
            canvasY: 0
        };

        this.canvas.canvas.addEventListener('mousedown', this.dragStart.bind(this));
        this.canvas.canvas.addEventListener('mousemove', this.drag.bind(this));
        this.canvas.canvas.addEventListener('mouseup', this.dragEnd.bind(this));
    }

    loadImage() {
        this.canvas.resetCanvas();
        let fr = new FileReader();
        fr.onload = (e) => {
            let img = new Image();
            img.onload = () => {
                this.scale = this.canvas.canvas.width / img.width;
                let w = img.width * this.scale;
                let h = img.height * (this.scale);
                console.log((this.canvas.canvas.height / 2) + (img.height / 2));
                let sy = (this.canvas.canvas.height / 2) - (h / 2);
                this.canvas.ctx.drawImage(img, 0, sy, w, h);
                this.img = img;
            }
            img.src = e.target.result;
        }
        fr.readAsDataURL(document.getElementById('img').files[0]);
    }

    setActiveTool(tool) {
        this.activeTool = tool;
    }

    redraw() {
        this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
        this.canvas.ctx.scale(this.scale, this.scale);
        this.canvas.ctx.drawImage(this.img, this.dragInfo.diffX, this.dragInfo.diffY);
        this.canvas.ctx.scale(1 / this.scale, 1 / this.scale);
    }

    dragStart(e) {
        this.dragInfo.isDragging = true;
        this.dragInfo.startX = e.clientX;
        this.dragInfo.startY = e.clientY;
    }

    drag(e) {
        if (this.img !== null && this.activeTool === 'move' && this.dragInfo.isDragging) {
            this.dragInfo.diffX = this.dragInfo.canvasX + (e.clientX - this.dragInfo.startX) / this.scale;
            this.dragInfo.diffY = this.dragInfo.canvasY + (e.clientY - this.dragInfo.startY) / this.scale;
            this.redraw();
        }
    }

    dragEnd(e) {
        this.dragInfo.isDragging = false;
        this.dragInfo.canvasX = this.dragInfo.diffX;
        this.dragInfo.canvasY = this.dragInfo.diffY;
    }
}
