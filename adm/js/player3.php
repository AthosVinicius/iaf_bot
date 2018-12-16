<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Player 3</title>

<link type="text/css" rel="stylesheet" href="css/P3.css" />
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>

<!--<script src="http://191.96.6.3:8000/socket.io/socket.io.js"></script>-->


<script type="text/javascript" src="js/scriptP3.js"></script>


</head>

<body>

    <audio id="player" controls onpause="alertaPausa()">
    <source src="musicas/juicy.mp3" type="audio/ogg">
    <source src="musicas/Impossible - Maddi Jane - Maddi Jane - Letras.mus.br.mp3" type="audio/ogg">
    Seu navegador não suporta audio em HTML5, atualize-o.
    </audio>
    
    <div id="controlePlayer">
    	<input type="text" id="ident" /><button id="autenticar">Entrar</button><br />
        <button id="btnRetroceder" disabled="disabled">&#9664;&#9664;</button>
        <button id="btnPlay">Play</button>
        <button id="btnPause" disabled="disabled">||</button>
        <button id="btnStop" disabled="disabled">stop</button>
        <button id="btnReiniciarM" disabled="disabled">Reiniciar</button>
        <button id="btnAumentarVol">+</button>
        <button id="btnDiminuirVol">-</button>
        <button id="btnAdiantar" disabled="disabled">&#9654;&#9654;</button>
        <input type="text" id="irpara" style="background-color:#000; color:#F00;" placeholder="Ir para" value="" maxlength="4" />
        <input type="text" id="duracao" style="background-color:#000; color:#FFF;" value="duração" />
    </div> 
    <div id='tempo'>Aguardando...</div>

	<div id="boxPlayer">
    	<table>
        	<tr>
            	<td></td>
            	<td></td>
            </tr>
        	<tr>
            	<td></td>
            	<td></td>
            </tr>
        </table>
    </div>
</body>
</html> 



  

