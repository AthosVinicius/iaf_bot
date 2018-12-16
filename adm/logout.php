<?php include ("cmd/conexao.php"); 

if(isset($_SESSION[login]) && isset($_SESSION[senha])){
	
	$_SESSION[login] = NULL;
	$_SESSION[senha] = NULL;
}


	
	echo "<script language= \"JavaScript\">
							location.href=\"index.php\"
							</script>";	
?>