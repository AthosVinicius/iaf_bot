<?php
if(!isset($_SESSION[login]) && (!isset($_SESSION[senha]))){
	/*echo "<script>alert('Voc� precisa estar logado para continuar.');</script>";*/
						echo "<script language= \"JavaScript\">
							location.href=\"login.php\"
							</script>";	
}
?>