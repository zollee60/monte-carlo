export default class Editor {

    constructor(canvas) {
        this.numOfDraws = parseFloat(document.getElementById('D').value);
        this.numOfPoints = parseFloat(document.getElementById('N').value);
        this.canvas = canvas;
        this.canvas.ctx.lineJoin = 'round';
        this.img = null;
        this.imgEdited = null;
        this.activeTool = null;
        this.scale = 1;
        this.scaleStep = 0.01;
        this.bounds = this.canvas.canvas.getBoundingClientRect();
        this.dragInfo = {
            isDragging: false,
            startX: 0,
            startY: 0,
            diffX: 0,
            diffY: 0,
            canvasX: 0,
            canvasY: 0
        };
        this.drawInfo = {
            isDrawn: false,
            isDrawing: false,
            currX: 0,
            currY: 0,
            lastX: 0,
            lastY: 0
        }
        this.imgInfo = {
            width: 0,
            height: 0
        }
        this.burshSize = 5;
        document.getElementById('bsSlider').value = this.burshSize;
        this.canvas.canvas.addEventListener('mousedown', this.dragStart.bind(this));
        this.canvas.canvas.addEventListener('mousedown', this.drawStart.bind(this));
        this.canvas.canvas.addEventListener('mousemove', this.drag.bind(this));
        this.canvas.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.canvas.addEventListener('mouseup', this.dragEnd.bind(this));
        this.canvas.canvas.addEventListener('mouseup', this.drawEnd.bind(this));

        this.canvas.canvas.addEventListener('wheel', (e) => {
            if (e.deltaY < 0) 
                this.scale += this.scaleStep;
             else if (e.deltaY > 0) 
                this.scale -= this.scaleStep;
            
            if(this.drawInfo.isDrawn){
                this.imgInfo.width = this.imgEdited.width * this.scale;
                this.imgInfo.height = this.imgEdited.height * (this.scale);
            } else {
                this.imgInfo.width = img.width * this.scale;
                this.imgInfo.height = img.height * (this.scale);
            }
            
            this.redraw();
        });
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
                
                this.imgInfo.width = w;
                this.imgInfo.height = h;
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
        if(this.drawInfo.isDrawn){
            this.canvas.ctx.putImageData(this.imgEdited, this.dragInfo.diffX, this.dragInfo.diffY);
        } else{
            this.canvas.ctx.drawImage(this.img, this.dragInfo.diffX, this.dragInfo.diffY);
        }
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

    calcMouseCoords(e) {
        let mousePos = {
            x: 0,
            y: 0
        }
        mousePos.x = ((e.pageX - this.bounds.left - scrollX) / this.bounds.width) * this.canvas.canvas.width;
        mousePos.y = ((e.pageY - this.bounds.top - scrollY) / this.bounds.height) * this.canvas.canvas.height;
        return mousePos;
    }

    drawStart(e) {
        this.canvas.ctx.strokeStyle = 'rgb(255,0,0)';
        this.canvas.ctx.lineWidth = this.burshSize;
        this.drawInfo.isDrawing = true;
        let mousePos = this.calcMouseCoords(e);
        this.drawInfo.lastX = mousePos.x;
        this.drawInfo.lastY = mousePos.y;
    }
    draw(e) {
        if (this.img !== null && this.activeTool === 'select' && this.drawInfo.isDrawing) {
            let mousePos = this.calcMouseCoords(e);
            this.drawInfo.currX = mousePos.x;
            this.drawInfo.currY = mousePos.y;
            this.canvas.ctx.beginPath();
            this.canvas.ctx.moveTo(this.drawInfo.lastX, this.drawInfo.lastY)
            this.canvas.ctx.lineTo(this.drawInfo.currX, this.drawInfo.currY);
            this.canvas.ctx.closePath();
            this.canvas.ctx.stroke();
            this.drawInfo.lastX = this.drawInfo.currX;
            this.drawInfo.lastY = this.drawInfo.currY;
        }
    }
    drawEnd(e) {
        if (this.activeTool === 'select') {
            this.drawInfo.isDrawing = false;
            this.drawInfo.isDrawn = true;
            this.imgEdited = this.canvas.ctx.getImageData(this.dragInfo.diffX,this.dragInfo.diffY,this.imgInfo.width,this.imgInfo.height);
        }

    }

}
