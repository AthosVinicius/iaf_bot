//var socket = io.connect('http://191.96.6.3:8000');

var cliente = {id: 1};
var musicas = [];
var segundosContagem = 0;
var minutosContagem = 0;

/*var musica1 = {
	 titulo: "Familia Na rua só até as 10",
	 local: "A Familia-Na Rua Só Até Às 10",
 	 formato:"mp3"
  }
  
var musica2 = {
	 titulo: "Musica inicial",
	 local: "juicy",
 	 formato:"mp3"
}

var musica3 = {
	 titulo: "Ao Cubo Cinderela",
	 local: "Ao Cubo Cinderela",
 	 formato:"mp3"
}

musicas.push(musica2, musica1, musica3);
 */ 
 

$(document).ready(function() {
 	
	//CARREGA ARQUIVOS NA PLYLISTS
	//montarPlaylist();
	$("#listMusic").niceScroll().hide();
	
	
    $("#statuPlayer").html('Não esta executando');
	var player = $("#player");
	
	
	$("#btnPlay").click(function(){ inciarMusica(); });
	$("#btnAdiantar").click(function(){ adiantar(); });
	$("#btnRetroceder").click(function(){ retroceder(); });
	$("#btnAumentarVol").click(function(){ aumentarVol(); });
	$("#btnDiminuirVol").click(function(){ diminuirVol(); });
	$("#btnReiniciarM").click(function(){ reiniciarMusica(); });
	$("#btnStop").click(function(){ stopInicio(); });
	$("#btnPause").click(function(){ pause(); });
	$("#btnProximaM").click(function(){ proximaMusica(); });
	$("#btnVoltarM").click(function(){ voltarMusica(); });
	
	
});



function abrirDiv(){
	
	$("#listMusic").slideToggle(1000);
}

function proximaMusica(){
		musicas.push(musicas[0]);
		musicas.splice(0, 1);
		montarPlaylist("trocarM");
}

function voltarMusica(){
	var ultimaMusica = musicas.length-1;
	musicas.unshift(musicas[ultimaMusica]);
	
	var ultimaMusica = musicas.length-1;
	musicas.splice(ultimaMusica, 1);
	montarPlaylist("trocarM");
}











function verificacao(){
	var segundos = player.currentTime;
	
	var minutos = arredondarNum(segundos /60+"");
	segundosContagem = Math.floor(player.currentTime);
	minutosContagem = minutos;
	
	var horas =  arredondarNum(minutos /60+"");
	
	if(minutosContagem != 1){
		var plural1 = "s";
	}else{
		var plural1 = "";
	}
	
	if(player.ended == true){
		
		
   		proximaMusica();
		montarPlaylist("trocarM");
	}
	
	
	$("#duracao").html(converterTempo(horas)+":"+converterTempo(minutosContagem)+":"+converterTempo(segundosContagem));
	
	if(player.duration < player.currentTime){
		if(segundosContagem == 58){

			
		}else{
			segundosContagem -=1;
		}
	}else{
	 //clearInterval(contadorDeTempo)
	}
}




function arredondarNum(valor){
	var valor = Math.floor(valor);
	return valor;
}

function converterTempo(valor){
	if(valor < 10){
		return 0+""+valor;
	}else{
		return valor;
	}
}






function montarPlaylist(comando){
	$("#player").html('');
	
	$("#listMusic").html('');
	
	for(var i=0; i<musicas.length; i++){
		$("#listMusic").append(musicas[i].titulo+"<br>");
   		 $("#tituloM").html(musicas[0].titulo);
		$("#player").append("<source src='musicas/"+musicas[i].local+"."+musicas[i].formato+"' type='audio/ogg'>");
		
	}
	
	$("#player").load();
	
	$("#player").append("Seu navegador não suporta audio em HTML5, atualize-o.");
	
	if(comando == "trocarM"){inciarMusica();}
	
}



function inciarMusica(){
	
	setInterval(verificacao, 1000);
	
	player.play();
    $("#statuPlayer").html('Executando audio');
	$("#btnPlay").attr('disabled','disabled');
	$("#btnPause").removeAttr('disabled');
	$("#btnStop").removeAttr('disabled');
	$("#btnAdiantar").removeAttr('disabled');
	$("#btnRetroceder").removeAttr('disabled');
}

function aumentarVol(){
	player.volume +=0.1;
}

function retroceder(){
	player.currentTime -=1;
}

function adiantar(){
	player.currentTime +=1;
}


function diminuirVol(){
	player.volume -=0.1;
}


function reiniciarMusica(){
	player.currentTime = 0;
}


function stopInicio(){
	player.pause();
	player.currentTime = 0;
	$("#btnPlay").removeAttr('disabled');
    $("#statuPlayer").html('Player Parado');
	$("#btnAdiantar").attr('disabled','disabled');
	$("#btnRetroceder").attr('disabled','disabled');
}



function pause(){
	
	player.pause();
	$("#btnPlay").removeAttr('disabled');
    $("#statuPlayer").html('Player pausado');
	$("#btnAdiantar").attr('disabled','disabled');
	$("#btnRetroceder").attr('disabled','disabled');
}
