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

function drawText(ctx, text, x, y, color){
	ctx.font = "italic bold 20px Arial";
	ctx.fillStyle = color;
	ctx.fillText(text, x, y);
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
	this.puntos1 = 2;
	this.puntos2 = 2;
	this.turn = 1;
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
					drawCircle(this.ctx, cell.cx+20, cell.cy+20, 18, "#fff");
				}else if(cell.contenido == 2){
					drawCircle(this.ctx, cell.cx+20, cell.cy+20, 18, "#000");
				}
			}
		}
	}
	this.drawPoints = function(){
		drawFillRectangle(this.ctx, 450, 50, 200, 200, "hsl(120, 100%, 40%)");
		drawText(this.ctx, "Player 1", 465, 80, "#fff");
		drawCircle(this.ctx, 490, 110, 15, "#fff");
		drawText(this.ctx, "x" , 515, 117, "#fff");
		drawText(this.ctx, String(this.puntos1), 535, 119, "#fff");
		drawText(this.ctx, "Player 2", 465, 170, "#000");
		drawCircle(this.ctx, 490, 200, 15, "#000");
		drawText(this.ctx, "x" , 515, 207, "#000");
		drawText(this.ctx, String(this.puntos2), 535, 209, "#000");
	}
	this.drawTurn = function(){
		drawFillRectangle(this.ctx, 450, 260, 100, 200, "hsl(120, 100%, 30%)");
		if(this.turn == 1){
			drawText(this.ctx, "Turn:", 465, 290, "#fff");
			drawText(this.ctx, "Player 1", 490, 320, "#fff");
		}else if(this.turn == 2){
			drawText(this.ctx, "Turn:", 465, 290, "#000");
			drawText(this.ctx, "Player 2", 490, 320, "#fff");
		}
	}
}

$(document).ready(function(){
	var table = new Table();
	table.drawTable();
	table.positionCells();
	table.drawCells();
	table.drawPieces();
	table.drawPoints();
	table.drawTurn();
});