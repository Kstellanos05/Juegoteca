function getCanvas(){
	var canvas = document.getElementById('lienzo');
	var ctx = canvas.getContext('2d');
	return ctx;
}

function drawRectangle(ctx, x, y, alto, ancho){
	ctx.strokeStyle = '#0C0';
	ctx.strokeRect(x, y, ancho, alto);
}

function drawFillRectangle(ctx, x, y, alto, ancho, color){
	ctx.fillStyle = color;
	ctx.fillRect(x, y, ancho, alto);
}

function drawCircle(ctx, centrox, centroy, radio, color){
	ctx.beginPath();
	ctx.arc(centrox, centroy, radio, 0, (Math.PI * 2), false);
	ctx.closePath();
	ctx.fillStyle = color;
	ctx.fill();
}

function Cell(cx, cy, calto, cancho, contenido){
	this.cx = cx;
	this.cy = cy;
	this.calto = calto;
	this.cancho = cancho;
	this.contenido = contenido;
}

function Table(){
	this.posx = 50;
	this.posy = 50;
	this.alto = 320;
	this.ancho = 320;
	this.ctx = getCanvas();
	this.cells = new Array();
	this.drawTable = function(){
		drawRectangle(this.ctx, this.posx, this.posy, this.alto, this.ancho);
	}
	this.positionCells = function(){
		var cx = this.posx;
		var cy = this.posy;
		var calto = 40;
		var cancho = 40;
		var contenido = 0;
		for(var i=0; i<8; i++){
			var row = new Array();
			for(var j=0; j<8; j++){
				if((i == 3 && j == 3) || (i == 4 && j == 4)){
					contenido = 1;
				}else if((i == 3 && j == 4) || (i == 4 && j == 3)){
					contenido = 2;
				}else{
					contenido = 0;
				}
				var cell = new Cell(cx, cy, calto, cancho, contenido);
				row.push(cell);
				cx += cancho;
			}
			this.cells.push(row);
			cx = this.posx;
			cy += calto;
		}
	}
	this.drawCells = function(){
		var color = "";
		for(var i=0; i<this.cells.length; i++){
			if(i % 2 == 0)
				color = "#090";
			else
				color = "#0f0";
			for(var j=0; j<this.cells[i].length; j++){
				var cell = this.cells[i][j];
				drawFillRectangle(this.ctx, cell.cx, cell.cy, cell.calto, cell.cancho, color);
				if(color == "#090")
					color = "#0f0";
				else
					color = "#090";
			}
		}
	}
	this.drawPieces = function(){
		for(var i=0; i<this.cells.length; i++){
			for(var j=0; j<this.cells[i].length; j++){
				var cell = this.cells[i][j];
				if(cell.contenido == 1){
					drawCircle(this.ctx, cell.cx+20, cell.cy+20, 18, "#000");
				}else if(cell.contenido == 2){
					drawCircle(this.ctx, cell.cx+20, cell.cy+20, 18, "#fff");
				}
			}
		}
	}
}

$(document).ready(function(){
	var table = new Table();
	table.drawTable();
	table.positionCells();
	table.drawCells();
	table.drawPieces();
});