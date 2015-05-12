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
				}else if(cell.contenido == 3){
					if(this.turn == 1)
						var color = "#fff";
					else
						var color = "#000";
					drawCircle(this.ctx, cell.cx+20, cell.cy+20, 18, color);
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
			drawText(this.ctx, "Player 2", 490, 320, "#000");
		}
	}
	this.getPosition = function(cx, cy){
		var px = 0;
		var py = 0;
		for(var i=0; i<this.cells.length; i++){
			for(var j=0; j<this.cells[i].length; j++){
				var cell = this.cells[i][j];
				if(cell.cx == cx && cell.cy == cy){
					px = i;
					py = j;
				}
			}
		}
		return [px, py];
	}
	this.validatePosition = function(actualX, actualY, movX, movY){
		if(this.cells[actualX][actualY].contenido == 0 || this.cells[actualX][actualY].contenido == 3){
			actualX += movX;
			actualY += movY;
			var enter = false;
			if(this.turn == 1)
				var contrario = 2;
			else
				var contrario = 1;
			while(actualX>=0 && actualX<=7 && actualY>=0 && actualY<=7 && this.cells[actualX][actualY].contenido == contrario){
				actualX += movX;
				actualY += movY;
				enter = true;
			}
			if(actualX>=0 && actualX<=7 && actualY>=0 && actualY<=7 && this.cells[actualX][actualY].contenido == 0)
				enter = false;
			if(actualX<0 || actualX>7 || actualY<0 || actualY>7)
				enter = false;
			return [enter, actualX, actualY];
		}else{
			return [false, actualX, actualY];
		}
	}
	this.validateMove = function(cx, cy){
		var position = this.getPosition(cx, cy);
		var up = this.validatePosition(position[0], position[1], -1, 0);		//Arriba.
		var down = this.validatePosition(position[0], position[1], 1, 0);		//Abajo.
		var left = this.validatePosition(position[0], position[1], 0, -1);		//Izq.
		var right = this.validatePosition(position[0], position[1], 0, 1);		//Der.
		var ne = this.validatePosition(position[0], position[1], -1, 1);		//NorthEast.
		var nw = this.validatePosition(position[0], position[1], -1, -1);		//NorthWest.
		var se = this.validatePosition(position[0], position[1], 1, 1);			//SouthEast.
		var sw = this.validatePosition(position[0], position[1], 1, -1);		//SouthWest.
		var addresses = [up, down, left, right, ne, nw, se, sw];
		return addresses;
	}
	this.deleteOption = function(){
		for(var i=0; i<this.cells.length; i++){
			for(var j=0; j<this.cells[i].length; j++){
				if(this.cells[i][j].contenido == 3)
					this.cells[i][j].contenido = 0;
			}
		}
		this.drawCells();
		this.drawPieces();
	}
	this.validateOption = function(cx, cy, cell){
		this.deleteOption();
		var posibility = this.validateMove(cx, cy);
		var can = false;
		for(var i=0; i<posibility.length; i++){
			if(posibility[i][0])
				can = true;
		}
		if(can){
			for(var i=0; i<this.cells.length; i++){
				for(var j=0; j<this.cells[i].length; j++){
					if(cell == this.cells[i][j]){
						this.cells[i][j].contenido = 3;
						this.drawPieces();
					}
				}
			}
		}
	}
	this.countPoints = function(){
		this.puntos1 = 0;
		this.puntos2 = 0;
		for(var i=0; i<this.cells.length; i++){
			for(var j=0; j<this.cells[i].length; j++){
				if(this.cells[i][j].contenido == 1)
					this.puntos1++;
				else if(this.cells[i][j].contenido == 2)
					this.puntos2++;
			}
		}
	}
	this.endMovement = function(){
		var end = false;
		for(var i=0; i<this.cells.length; i++){
			for(var j=0; j<this.cells[i].length; j++){
				var opciones = this.validateMove(this.cells[i][j].cx, this.cells[i][j].cy);
				for(var k=0; k<opciones.length; k++){
					if(opciones[k][0]){
						end = true;
					}
				}
			}
		}
		return end;
	}
	this.endPlay = function(){
		var end = this.endMovement();
		if(!end){
			if(this.turn == 1)
				this.turn = 2;
			else
				this.turn = 1;
			var endcompleted = this.endMovement();
			if(!endcompleted){
				document.getElementById("fin").play();
				var resultado = "";
				if(this.puntos1 > this.puntos2)
					resultado = "Winner: Player 1";
				else if(this.puntos1 < this.puntos2)
					resultado ="Winner: Player 2";
				else
					resultado = "Equal";
				alert("¡Fin del Juego!");
				alert(resultado);
				document.location.reload();
			}else{
				alert("No tienes opciones de juego, El turno es de Player " + this.turn);
				this.drawTurn();
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
	table.drawPoints();
	table.drawTurn();

	$("#lienzo").bind("click mousemove", function(ev){
		var pos = $(this).offset();
		var mx = ev.pageX - pos.left;
		var my = ev.pageY - pos.top;
		var cell = null;
		for(var i=0; i<table.cells.length; i++){
			for(var j=0; j<table.cells[i].length; j++){
				var aux = table.cells[i][j];
				if(mx >= 50 && mx <= 370 && my >= 50 && my <= 370)
					if(mx >= aux.cx && mx <= aux.cx+40 && my >= aux.cy && my <= aux.cy+40)
						cell = aux;
			}
		}
		if(cell != null){
			if(ev.type == "mousemove"){
				table.validateOption(cell.cx, cell.cy, cell);
			}else if(ev.type == "click"){
				var opciones = table.validateMove(cell.cx, cell.cy);
				var position = table.getPosition(cell.cx, cell.cy);
				var yesTurn = false;
				for(var i=0; i<opciones.length; i++){
					if(opciones[i][0]){//Arriba.
						if(position[0] > opciones[i][1] && position[1] == opciones[i][2]){
							var j = (position[0]-1);
							while(j>opciones[i][1]){
								table.cells[j][position[1]].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								j--;
							}
						}//abajo.
						if(position[0] < opciones[i][1] && position[1] == opciones[i][2]){
							var j = (position[0]+1);
							while(j<opciones[i][1]){
								table.cells[j][position[1]].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								j++;
							}
						}//izq.
						if(position[1] > opciones[i][2] && position[0] == opciones[i][1]){
							var j = (position[1]-1);
							while(j>opciones[i][2]){
								table.cells[position[0]][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								j--;
							}
						}//der
						if(position[1] < opciones[i][2] && position[0] == opciones[i][1]){
							var j = (position[1]+1);
							while(j<opciones[i][2]){
								table.cells[position[0]][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								console.log("der"+position[0]+" "+position[1]+" "+table.turn);
								j++;
							}
						}//diag-der-arriba
						if(position[1] < opciones[i][2] && position[0] > opciones[i][1]){
							var k = (position[0]-1);
							var j = (position[1]+1);
							while(j<opciones[i][2] && k>opciones[i][1]){
								table.cells[k][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								console.log("diag"+position[0]+" "+position[1]+" "+table.turn);
								k--;
								j++;
							}
						}//diag-izq-arriba
						if(position[1] > opciones[i][2] && position[0] > opciones[i][1]){
							var k = (position[0]-1);
							var j = (position[1]-1);
							while(j>opciones[i][2] && k>opciones[i][1]){
								console.log(k +" "+j);
								table.cells[k][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								k--;
								j--;
							}
						}//diag-der-abajo
						if(position[1] < opciones[i][2] && position[0] < opciones[i][1]){
							var k = (position[0]+1);
							var j = (position[1]+1);
							while(j<opciones[i][2] && k<opciones[i][1]){
								console.log(k +" "+j);
								table.cells[k][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								k++;
								j++;
							}
						}//diag-izq-abajo
						if(position[1] > opciones[i][2] && position[0] < opciones[i][1]){
							var k = (position[0]+1);
							var j = (position[1]-1);
							while(j>opciones[i][2] && k<opciones[i][1]){
								console.log(k +" "+j);
								table.cells[k][j].contenido = table.turn;
								table.cells[position[0]][position[1]].contenido = table.turn;
								k++;
								j--;
							}
						}
						yesTurn = true;
					}
				}
				if(yesTurn){
					document.getElementById("soltar").play();
					if(table.turn == 1)
						table.turn = 2;
					else
						table.turn = 1;
					table.drawTurn();
					table.countPoints();
					table.drawPoints();
					table.endPlay();
				}
			}
		}
	});
});