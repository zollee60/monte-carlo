export default class Editor {

    constructor(imgCanvas, drawCanvas, scaleCanvas) {
        this.numOfDraws = parseFloat(document.getElementById('D').value);
        this.numOfPoints = parseFloat(document.getElementById('N').value);
        this.drawCanvas = drawCanvas;
        this.imgCanvas = imgCanvas;
        this.scaleCanvas = scaleCanvas
        this.drawCanvas.ctx.lineJoin = 'round';
        this.img = null;
        this.drawnImg = null;
        this.scaleImg = null;
        this.activeTool = null;
        this.autoFill = false;
        this.scale = 1;
        this.scaleStep = 0.01;
        this.bounds = imgCanvas.canvas.getBoundingClientRect();
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
            shiftDown: false,
            isDrawn: false,
            isDrawing: false,
            currX: 0,
            currY: 0,
            lastX: 0,
            lastY: 0,
            path: null,
            maxX: 0,
            maxY: 0,
        };
        this.scaleInfo = {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            isDrawn: false
        };
        this.imgInfo = {
            width: 0,
            height: 0
        };
        this.burshSize = 5;
        this.drawCanvas.ctx.strokeStyle = 'rgb(255,0,0)';
        this.drawCanvas.ctx.fillStyle = 'rgb(255,0,0)';
        this.scaleCanvas.ctx.strokeStyle = 'rgb(0,0,255)';
        this.scaleCanvas.ctx.fillStyle = 'rgb(0,0,255)';
        document.getElementById('bsSlider').value = this.burshSize;
        this.scaleCanvas.canvas.addEventListener('mousedown', this.triggerEvent.bind(this));
        this.scaleCanvas.canvas.addEventListener('mousemove', this.triggerEvent.bind(this));
        this.scaleCanvas.canvas.addEventListener('mouseup', this.triggerEvent.bind(this));
        this.scaleCanvas.canvas.addEventListener('wheel', this.resize.bind(this));
        document.addEventListener('keydown', this.handleShift.bind(this));
        document.addEventListener('keyup', this.handleShift.bind(this));
    }

    triggerEvent(event) {
        if (event.type === "mousedown") {
            if (this.activeTool === "move") {
                this.dragStart(event);
            } else if (this.activeTool === "select") {
                this.drawStart(event);
            } else if (this.activeTool === "square") {
                this.drawSquareStart(event);
            } else if (this.activeTool === "circle") {
                this.drawCircleStart(event);
            } else if (this.activeTool === "scale") {
                this.drawScaleStart(event);
            }
        } else if (event.type === "mousemove") {
            if (this.activeTool === "move") {
                this.drag(event);
            } else if (this.activeTool === "select") {
                this.draw(event);
            } else if (this.activeTool === "square") {
                this.drawSquare(event);
            } else if (this.activeTool === "circle") {
                this.drawCircle(event);
            } else if (this.activeTool === "scale") {
                this.drawScale(event);
            }
        } else if (event.type === "mouseup") {
            if (this.activeTool === "move") {
                this.dragEnd(event);
            } else if (this.activeTool === "select") {
                this.drawEnd(event);
            } else if (this.activeTool === "square") {
                this.drawSquareEnd(event);
            } else if (this.activeTool === "circle") {
                this.drawCircleEnd(event);
            } else if (this.activeTool === "scale") {
                this.drawScaleEnd();
            }
        }
    }

    handleShift(e){
        if(e.key === "Shift") this.drawInfo.shiftDown = !this.drawInfo.shiftDown;
    }

    loadImage() {
        this.drawCanvas.resetCanvas();
        this.imgCanvas.resetCanvas();
        let fr = new FileReader();
        fr.onload = (e) => {
            let img = new Image();
            img.onload = () => {
                this.scale = this.imgCanvas.canvas.width / img.width;
                let w = img.width * this.scale;
                let h = img.height * this.scale;
                //console.log((this.imgCanvas.canvas.height / 2) + (img.height / 2));
                let sy = (this.imgCanvas.canvas.height / 2) - (h / 2);
                this.imgCanvas.ctx.drawImage(img, 0, sy, w, h);
                this.img = img;
                //console.log(this.img);
                this.imgInfo.width = w;
                this.imgInfo.height = h;
                //console.log("width: " + this.imgInfo.width + " height: " + this.imgInfo.height);

                this.dragInfo.canvasY = sy;
            }
            img.src = e.target.result;
        }
        fr.readAsDataURL(document.getElementById('img').files[0]);
        this.drawInfo.isDrawn = false;
    }

    getLengthOfScale(){
        return Math.sqrt(Math.pow(this.scaleInfo.endX - this.scaleInfo.startX,2) + Math.pow(this.scaleInfo.endY - this.scaleInfo.startY,2));
    }

    calculateScale(dist){
        //console.log(this.getLengthOfScale());
        return this.getLengthOfScale() / dist;
    }

    setActiveTool(tool) {
        this.activeTool = tool;
    }

    
    redraw() {
        this.imgCanvas.ctx.clearRect(0, 0, this.imgCanvas.canvas.width, this.imgCanvas.canvas.height);
        this.drawCanvas.ctx.clearRect(0, 0, this.drawCanvas.canvas.width, this.drawCanvas.canvas.height);
        this.scaleCanvas.ctx.clearRect(0,0,this.scaleCanvas.canvas.width,this.scaleCanvas.canvas.height);
        if (this.drawInfo.isDrawn) {
            this.drawCanvas.ctx.drawImage(this.drawnImg, this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height);  
        } 
        if (this.scaleInfo.isDrawn){
            this.scaleCanvas.ctx.drawImage(this.scaleImg, this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height)
        }
        this.imgCanvas.ctx.drawImage(this.img, this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height);
    }

    setFixedSizedOSCanvasImage(sourceCanvas){
        sourceCanvas.startingImgData = sourceCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height);        
    }

    resize(e) {
        if (e.deltaY < 0) 
            this.scale += this.scaleStep;
         else if (e.deltaY > 0)
            this.scale -= this.scaleStep;
        this.imgInfo.width = this.img.width * this.scale;
        this.imgInfo.height = this.img.height * this.scale;
        //console.log("width: " + this.imgInfo.width + " height: " + this.imgInfo.height);

        this.redraw();
    }

    dragStart(e) {
        this.dragInfo.isDragging = true;
        this.dragInfo.startX = e.clientX;
        this.dragInfo.startY = e.clientY;
    }

    drag(e) {
        let mousePos = this.calcMouseCoords(e);
        if (this.img !== null && this.activeTool === 'move' && this.dragInfo.isDragging) {
            this.dragInfo.diffX = (e.clientX - this.dragInfo.startX) / this.scale;
            this.dragInfo.diffY = (e.clientY - this.dragInfo.startY) / this.scale;
            this.dragInfo.canvasX += this.dragInfo.diffX;
            this.dragInfo.canvasY += this.dragInfo.diffY;
            this.dragInfo.startX = e.clientX;
            this.dragInfo.startY = e.clientY;
            this.redraw();
        }
    }

    dragEnd(e) {
        this.dragInfo.isDragging = false;
    }

    calcMouseCoords(e) {
        return {
            x: ((e.pageX - this.bounds.left - scrollX) / this.bounds.width) * this.imgCanvas.canvas.width,
            y: ((e.pageY - this.bounds.top - scrollY) / this.bounds.height) * this.imgCanvas.canvas.height
        }
    }

    drawStart(e) {
        this.drawCanvas.ctx.lineWidth = this.burshSize;
        this.drawInfo.isDrawing = true;
        let mousePos = this.calcMouseCoords(e);
        this.drawInfo.lastX = mousePos.x;
        this.drawInfo.lastY = mousePos.y;
        if (this.autoFill) {
            this.drawInfo.path = new Path2D();
            this.drawInfo.path.moveTo(this.drawInfo.lastX, this.drawInfo.lastY);
        }

    }

    draw(e) {
        if (this.img !== null && this.activeTool === 'select' && this.drawInfo.isDrawing) {
            let mousePos = this.calcMouseCoords(e);
            this.drawInfo.currX = mousePos.x;
            this.drawInfo.currY = mousePos.y;
            this.drawCanvas.ctx.beginPath();
            this.drawCanvas.ctx.moveTo(this.drawInfo.lastX, this.drawInfo.lastY);
            this.drawCanvas.ctx.lineTo(this.drawInfo.currX, this.drawInfo.currY);
            if (this.autoFill) {
                this.drawInfo.path.lineTo(this.drawInfo.currX, this.drawInfo.currY);
            }
            this.drawCanvas.ctx.closePath();
            this.drawCanvas.ctx.stroke();
            this.drawInfo.lastX = this.drawInfo.currX;
            this.drawInfo.lastY = this.drawInfo.currY;
        }
    }

    drawEnd(e) {
        if (this.activeTool === 'select') {
            this.drawInfo.isDrawing = false;
            this.drawInfo.isDrawn = true;
            //console.log(this.autoFill);
            if (this.autoFill) {
                this.drawInfo.path.closePath();
                this.drawCanvas.ctx.fillStyle = 'rgb(255,0,0)';
                this.drawCanvas.ctx.fill(this.drawInfo.path);
            }
            //console.log(this.drawCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height))
            let bitmapPromise = createImageBitmap(this.drawCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height));
            bitmapPromise.then((value) => this.drawnImg = value);
        }

    }

    clearArea(canvas,shape,e,x,y) {
        let w = Math.abs(x - this.drawInfo.lastX);
        let h = Math.abs(y - this.drawInfo.lastY);
        let plus = Math.ceil(this.burshSize / 2);
        if (x < this.drawInfo.currX) {
            w = this.drawInfo.maxX - this.drawInfo.lastX;
            this.drawInfo.maxX = this.drawInfo.currX;
        }
        if (y < this.drawInfo.currY) {
            h = this.drawInfo.maxY - this.drawInfo.lastY;
            this.drawInfo.maxY = this.drawInfo.currY;
        }
        this.drawInfo.currX = x;
        this.drawInfo.currY = y;
        if(shape === "square"){
            if (x < this.drawInfo.maxX || y < this.drawInfo.maxY) {
                if (this.drawInfo.shiftDown){
                    canvas.ctx.clearRect(this.drawInfo.lastX - plus, this.drawInfo.lastY - plus, w + (plus * 2), w + (plus * 2));
                }else{
                    canvas.ctx.clearRect(this.drawInfo.lastX - plus, this.drawInfo.lastY - plus, w + (plus * 2), h + (plus * 2));
                }
            } else {
                if (this.drawInfo.shiftDown){
                    canvas.ctx.clearRect(this.drawInfo.lastX, this.drawInfo.lastY, w, w);
                }else{
                    canvas.ctx.clearRect(this.drawInfo.lastX, this.drawInfo.lastY, w, h);
                }
            }
        }
        else if(shape === "circle"){
            canvas.ctx.clearRect(this.drawInfo.lastX - plus, this.drawInfo.lastY - plus, w + (plus * 2), h + (plus * 2));
        }
    }

    drawSquareStart(e) {
        this.drawCanvas.ctx.lineWidth = this.burshSize;
        let mousePos = this.calcMouseCoords(e);
        this.drawInfo.lastX = mousePos.x;
        this.drawInfo.lastY = mousePos.y;
        this.drawInfo.isDrawing = true;
    }

    drawSquare(e) {
        if (this.img !== null && this.activeTool === 'square' && this.drawInfo.isDrawing) {
            let mousePos = this.calcMouseCoords(e);
            this.clearArea(this.drawCanvas,"square",e,mousePos.x,mousePos.y);
            this.drawCanvas.ctx.beginPath();
            this.drawCanvas.ctx.drawImage(this.drawnImg, this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height);
            let w = Math.abs(mousePos.x - this.drawInfo.lastX);
            let h = Math.abs(mousePos.y - this.drawInfo.lastY);
            if(this.drawInfo.shiftDown){
                this.drawCanvas.ctx.rect(this.drawInfo.lastX, this.drawInfo.lastY, w, w);
            }
            else{
                this.drawCanvas.ctx.rect(this.drawInfo.lastX, this.drawInfo.lastY, w, h);
            }
            if (this.autoFill) 
                this.drawCanvas.ctx.fill();
            else 
                this.drawCanvas.ctx.stroke();
        }
    }

    drawSquareEnd(e) {
        let bitmapPromise = createImageBitmap(this.drawCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height));
        bitmapPromise.then((value) => this.drawnImg = value)
        this.drawInfo.isDrawing = false;
    }

    drawCircleStart(e) {

        this.drawCanvas.ctx.lineWidth = this.burshSize;
        let mousePos = this.calcMouseCoords(e);
        this.drawInfo.lastX = mousePos.x;
        this.drawInfo.lastY = mousePos.y;
        this.drawInfo.isDrawing = true;
    }

    drawCircle(e) {
        if (this.img !== null && this.activeTool === 'circle' && this.drawInfo.isDrawing) {
            let mousePos = this.calcMouseCoords(e);
            this.clearArea(this.drawCanvas,"circle",e,mousePos.x,mousePos.y);
            this.drawCanvas.ctx.beginPath();
            this.drawCanvas.ctx.drawImage(this.drawnImg, this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height);
            let ox = this.drawInfo.lastX + Math.floor((this.drawInfo.currX - this.drawInfo.lastX) / 2);
            let oy = this.drawInfo.lastY + Math.floor((this.drawInfo.currY - this.drawInfo.lastY) / 2);
            if(this.drawInfo.shiftDown){
                oy = this.drawInfo.lastY + Math.floor((this.drawInfo.currX - this.drawInfo.lastX) / 2);
                this.drawCanvas.ctx.ellipse(ox, oy, Math.floor((this.drawInfo.currX - this.drawInfo.lastX) / 2), Math.floor((this.drawInfo.currX - this.drawInfo.lastX) / 2), 0, 0, Math.PI * 2);
            }
            else{
                this.drawCanvas.ctx.ellipse(ox, oy, Math.floor((this.drawInfo.currX - this.drawInfo.lastX) / 2), Math.floor((this.drawInfo.currY - this.drawInfo.lastY) / 2), 0, 0, Math.PI * 2);
            }

            if (this.autoFill)
                this.drawCanvas.ctx.fill();
            else
                this.drawCanvas.ctx.stroke();
        }
    }

    drawCircleEnd(e) {
        let bitmapPromise = createImageBitmap(this.drawCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height));
        bitmapPromise.then((value) => this.drawnImg = value)
        this.drawInfo.isDrawing = false;
    }

    drawScaleStart(e){
        this.scaleCanvas.ctx.clearRect(0,0,this.scaleCanvas.canvas.width,this.scaleCanvas.canvas.height);
        this.scaleCanvas.ctx.lineWidth = this.burshSize;
        let mousePos = this.calcMouseCoords(e);
        this.scaleInfo.startX = mousePos.x;
        this.scaleInfo.startY = mousePos.y;
        this.drawInfo.isDrawing = true;
        //console.log("drawScaleStart() is called");
    }

    drawScale(e){
        if (this.img !== null && this.activeTool === 'scale' && this.drawInfo.isDrawing){
            let mousePos = this.calcMouseCoords(e);
            this.scaleCanvas.ctx.clearRect(0,0,this.scaleCanvas.canvas.width,this.scaleCanvas.canvas.height);
            this.scaleCanvas.ctx.beginPath();
            this.scaleCanvas.ctx.moveTo(this.scaleInfo.startX,this.scaleInfo.startY);
            this.scaleCanvas.ctx.lineTo(mousePos.x,mousePos.y);
            this.scaleCanvas.ctx.stroke();
            this.scaleInfo.endX = mousePos.x;
            this.scaleInfo.endY = mousePos.y;
        }
    }

    drawScaleEnd(){
        let bitmapPromise = createImageBitmap(this.scaleCanvas.ctx.getImageData(this.dragInfo.canvasX, this.dragInfo.canvasY, this.imgInfo.width, this.imgInfo.height));
        bitmapPromise.then((value) => this.scaleImg = value)
        this.drawInfo.isDrawing = false;
    }
}
