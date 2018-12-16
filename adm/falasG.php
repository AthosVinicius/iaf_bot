<?php 

mysqli_query($conn,"SET NAMES 'utf8'");
mysqli_query($conn,'SET character_set_connection=utf8');
mysqli_query($conn,'SET character_set_client=utf8');
mysqli_query($conn,'SET character_set_results=utf8');

$_pagi_sql = "SELECT * FROM frases_cadastradas order by id desc";
$rpp = 10;
include("paginacao.php"); //incluindo o script de paginação PAGINATOR
?>


<style>
#box_falas{
	min-height:600px;
}
</style>

<table width="800" border="0" align="center" cellpadding="0" cellspacing="0">
	<tr>
		<td colspan="3" align="center" height="25"><div style="display:none;" id="operacoes">////////////</div></td>
	</tr>
	<tr>
		<td align="center">Fala:<br /> 
		  <textarea id="frase_resposta" style="width:400px; height:50px;"></textarea>
	      <br /></td>
	</tr>
	<tr>
		<td align="center">Resposta:<br /> 
	    <textarea id="frase_recebida" style="width:400px; height:100px;" name="textarea"></textarea></td>
    <tr>
		<td colspan="3" align="center"><button style="cursor:pointer;" id="cd_fala">Cadastrar Fala</button></td>
	</tr>
	<tr>
		<td colspan="3" align="center" height="25"><div style="display:none;" id="operacoes">////////////</div></td>
	</tr>
	<tr>
		<td colspan="3" align="center">Lista de Falas</td>
	</tr>
	<tr>
		<td colspan="3" align="left">
		
		<div id="box_falas">
			<?php
			while($frase = mysqli_fetch_assoc($c_res)){?>
				<div class="li_falas">
				 <table border="2" width="90%">
				 	<tr>
						<td width="50%" bgcolor="#006699">
							<?php echo $frase['tags'];?>						</td>
						<td width="50%" bgcolor="#009933">
							<?php echo $frase['frase'];?>						</td>
					</tr>
					<tr>
						<td colspan="2" align="center">
							<?php echo date('d/m/Y H:i:s', strtotime($frase['data']));?> <a href="?pg=alterar_frase&frase=<?php echo $frase['id'];?>">Alterar</a> - <a href="#" onclick="del_fala(<?php echo $frase['id'];?>);">Deletar</a> </td>
					</tr>
				</table>
				<br /><br />
				</div>
			<?php }	?>
		</div>		</td>
	</tr>
	<tr class="gridBody">
		<td colspan="3" align='center' valign="bottom">
			<?php echo $nav_c_res;?>		</td>
	</tr>  
</table>

