<?php include ("cmd/conexao.php"); ?>
<?php include ("usuario_logado.php"); ?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Administa&ccedil;&atilde;o</title>



<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" charset="utf-8" src="js/index.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

<style>
body{
	background-color:#A1A9AD;
	color:#FFFFFF;
}

textarea{
	border:3px solid #3B585A;
	border-radius: 7px;
}

#box_falas{
	min-height:600px;
}

#box_falas table tr td{
	padding:4px;
}

.cmd_frase{
	background-color:#FFFFFF;
	color:#000000;
}
</style>




</head>

<body>

<div>[Bem Vindo(a) <?php echo $_SESSION['nick'];?> ][<a href="logout.php">Logout</a>]</div>


<?php
$pagina = "falas";
$pagina_get = $_GET['pg'];


if($pagina_get != "" && !empty($pagina_get) && isset($pagina_get) && $pagina_get != " "){
   if(file_exists($pagina_get.".php")){
	 $pagina = $pagina_get;
	}
}

include($pagina.".php");?>
</body>
</html>
