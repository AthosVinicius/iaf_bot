<?php 	ob_start();	session_start();?>
<?php 
	//CONEXÕES COM BANCO DE DADOS

	$db = 'iaf'; // Nome do Banco de Dados;
	$dbuser = "root"; // Usuário do Banco de Dados
	$dbpass = ""; // Senha do Banco de Dados
	$dbhost = "localhost";  //  MySQL hostname


	$conn = mysqli_connect($dbhost,$dbuser,$dbpass);
	mysqli_select_db($conn,$db);



	date_default_timezone_set('Brazil/East');
	$hoje_completo = date("Y-m-d H:i:s");
	if(isset($_SESSION['id'])) {
        $user_id_agp = (int)$_SESSION['id'];
    }else{
        $user_id_agp = 0;
    }
	
	
	//$load_config_central = mysqli_fetch_assoc(mysqli_query($conn,"SELECT * FROM cadastro WHERE id = 1 and user = ".$user_id_agp));
	
	//ARRAY DE DATAS
	
						  $ano_atual = date('Y');
						  $mes_array[1] ='Janeiro';
						  $mes_array[2] ='Fevereiro';
						  $mes_array[3] ='Março';
						  $mes_array[4] ='Abril';
						  $mes_array[5] ='Maio';
						  $mes_array[6] ='Junho';
						  $mes_array[7] ='Julho';
						  $mes_array[8] ='Agosto';
						  $mes_array[9] ='Setembro';
						  $mes_array[10]='Outubro';
						  $mes_array[11]='Novembro';
						  $mes_array[12]='Dezembro';
						  $semana_array[0] = 'Domingo';
						  $semana_array[1] = 'Segunda-Feira';
						  $semana_array[2] = 'Terça-Feira';
						  $semana_array[3] = 'Quarta-Feira';
						  $semana_array[4] = 'Quinta-Feira';
						  $semana_array[5] = 'Sexta-Feira';
						  $semana_array[6] = 'Sádado';
	
	
?>