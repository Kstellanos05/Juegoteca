$(document).ready(function(){
	
	$('#txtBuscar').focus(function(){
		this.value = "";
	});

	$('#txtBuscar').blur(function(){
		this.value = "Búsqueda...";
	});

	$('.icon-user').hover(function(){
		$('nav p').removeClass('ocultar');
		$('nav p').addClass('mostrar');
	}, function(){
		$('nav p').removeClass('mostrar');
		$('nav p').addClass('ocultar');
	});

});