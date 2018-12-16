<style>

.gridBody #paginacao p a{
	font-size: 12px;
	font-family: Arial;
	padding: 2px 4px 2px;
	text-decoration: none;
	margin-top: 10px;
	margin-bottom: 10px;
	color:#000000;
	background-color:#999999;
	border:#000000 solid 1px;
	margin: 2px 0px 2px 0px;
}

.gridBody #paginacao p a:hover{
	color:#FFFF00;
}

.gridBody #paginacao{
  margin: 5px;
  text-align: center;
  width: 100%;
}

</style>
<?php
    //verifica a página atual caso seja informada na URL, senão atribui como 1ª página
        $pagina = (isset($_GET['pagina']))? $_GET['pagina'] : 1;
 
    //seleciona todos os itens da tabela
        $cmd = $_pagi_sql;
        $produtos = mysqli_query($conn,$cmd);
   
    //conta o total de itens
        $total = mysqli_num_rows($produtos);
   
    //seta a quantidade de itens por página, neste caso, 2 itens
        $registros = (int)$rpp;
   
    //calcula o número de páginas arredondando o resultado para cima
        $numPaginas = ceil($total/$registros);
   
    //variavel para calcular o início da visualização com base na página atual
        $inicio = ($registros*$pagina)-$registros;
 
    //seleciona os itens por página
        $cmd = $cmd." limit $inicio,$registros";
        $c_res = mysqli_query($conn,$cmd);
        $total = mysqli_num_rows($c_res);
		
		
		$min_apg = ($pagina - 5);
		$max_apg = ($pagina + 5);
		
		
		if($pagina <= 5){
			$max_apg = 11;
			$min_apg = 1;
		}
		
		
		if($max_apg > $numPaginas){
		    $max_apg = $numPaginas;
			$min_apg = ($max_apg - 10);
		}
		
		if($max_apg <10){
		    $max_apg = $numPaginas+1;
			$min_apg = 1;
		}
		
		$nav_c_res = "";
		
		for($i = $min_apg; $i < $max_apg; $i++) {
				 $nav_c_res = $nav_c_res."<a href='?pg=".$_GET['pg']."&&pagina=$i'>".$i."</a>";
			}
			
			
		$nav_c_res = "
    	<div id='paginacao'><p>
		<a href='?pg=".$_GET['pg']."&&pagina=1'> <[Primeira]> </a>".$nav_c_res."
		<a href='?pg=".$_GET['pg']."&&pagina=".$numPaginas."'><[Ultima]></a>
		</p></div>";
 
  
?>