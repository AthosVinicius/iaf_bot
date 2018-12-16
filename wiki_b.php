<?php 
$consulta = $_POST['busca_wiki'];


$Url_check = ('http://pt.wikipedia.org/wiki/'.$consulta);

@$ChecarUrl = fopen($Url_check,"r");

if($ChecarUrl){//Se verificado e existente

	
	$url = file_get_contents('http://pt.wikipedia.org/wiki/'.$consulta);

	echo $url;
	
	
	$UrlChecada = "ativa";


}else{//Se n�o conseguir verificar ou n�o existir

	$UrlChecada = "offline";
};

echo $UrlChecada;
?>