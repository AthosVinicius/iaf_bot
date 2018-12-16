<?php
mysqli_query($conn,"SET NAMES 'utf8'");
mysqli_query($conn,'SET character_set_connection=utf8');
mysqli_query($conn,'SET character_set_client=utf8');
mysqli_query($conn,'SET character_set_results=utf8');

$frase_n = (int)$_GET['frase'];
$_pagi_sql = mysqli_fetch_assoc(mysqli_query($conn,"SELECT frase, tags FROM frases_cadastradas WHERE  pet = ".$_SESSION['id']." and id = ".$frase_n));
?>

<table width="800" border="0" align="center">
	<tr>
		<td colspan="4" align="center">Dados da Resposta </td>
	</tr>
	<tr>
		<td colspan="4" align="center" height="25"><div style="display:none;" id="operacoes">////////////</div></td>
	</tr>
	<tr>
		<td>Fala: </td>
		<td>
		<input type="hidden" value="<?php echo $frase_n;?>" id="n_frase_sel" />
		<textarea id="frase_resposta" style="width:400px; height:50px;"><?php echo $_pagi_sql['tags'];?></textarea>
		</td>
	</tr>
	<tr>
		<td valign="top">Resposta: </td>
		<td><textarea id="frase_recebida" style="width:400px; height:200px;" name="textarea"><?php echo $_pagi_sql['frase'];?></textarea></td>
	<tr>
		<td colspan="4" align="center" style="padding-right:40px;">
		<button style="cursor:pointer;" id="sl_fala">Salvar alteração</button>
		<button style="cursor:pointer;" onClick="history.go(-1);">Voltar</button>
		<button style="cursor:pointer;" id="cd_funcao" onclick="modelar_resp('fcu1');">Função User</button>
		</td>
	</tr>
	<tr>
		<td colspan="4" align="center" height="25"><div style="display:none;" id="operacoes">////////////</div></td>
	</tr>
</table>