<?php header('Content-Type: text/html; charset=UTF-8');?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link type="text/css" rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" href="css/jquery.mCustomScrollbar.css">

<script charset="utf-8" src="http://127.0.0.1:8000/socket.io/socket.io.js"></script>
<script type="text/javascript" src="js/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="js/config.js"></script>
<script type="text/javascript" src="js/wiki.js"></script>
<script type="text/javascript" src="js/scrpt_if.js"></script>
<script src="js/jquery.mCustomScrollbar.concat.min.js"></script>
	
<script>
	var socket = io.connect('http://127.0.0.1:8000');
</script>

<title>DNT</title>
</head>

<body>

<input value="" type="hidden" id="msg_armm" style="width:100%;" />
<div id="ch_funcoes"></div>
<div id="teste_fala"></div>
<div id="descanso_cont"></div>
<div id="principal">

<div id="panelsubPrincipal">
		<table bgcolor="#006699" border="0" width="100%">
			<tr>
				<td valign="top">
					<div id="lista_de_clientes_online" style="color:#FFF;"></div>
				</td>
				<td valign="top">
					<div id="panelLogado">				
					
						<div id="char_assistente"></div>
						
						
						<div id="log_conversa_principal">
							<div id='log_conversa_c'></div>
						</div>
							<div id='cmp_msg_c'>
								<input type='text' id='input_cmp_msg' onkeypress='env_com_enter()' />
								<button id='btn_enviar_msg_c' onclick='fct_enviar_msg_chat($("#input_cmp_msg").val());'>Enviar</button>
							</div>
					
					</div>
				</td>
				<td valign="top">
					<div id="lista_de_comandos" style="color:#FFF;">
					<img src="http://ub.gdigital.com.br/wp-content/uploads/sites/662/2015/01/imessage_flat_by_packrobottom-d6dy6qy.png" class="btn_cmd_ini" id="btn_conversar"/>	
					<img src="https://social.stoa.usp.br/articles/0028/9002/formatura.png" class="btn_cmd_ini" id="btn_wiki"/>	
					<img src="https://png.pngtree.com/element_our/md/20180620/md_5b29c1bea1325.png" class="btn_cmd_ini" id="rect" />
					</div>
				</td>
			</tr>
			<tr>
				<td colspan="3">
				</td>
			</tr>
		</table>
</div>


	<div id="panelLogin">
	<table width="200" bgcolor="#CCCCCC" align="center">
		<tr>
			<td align="center">
				<h2>LOGIN - IAF</h2>
			</td>
		</tr>
		<tr>
			<td align="center">
				<input id="cmp_login" type="text" value="" /><br /><br />
			</td>
		</tr>
		<tr>
			<td align="center">
				<input id="cmp_senha" type="password" value="123" /><br /><br />
			</td>
		</tr>
		<tr>
			<td align="center">
				<button id="btn_logar">Login</button>
			</td>
		</tr>
	</table>
	</div>


</div>
<!--<br />
<br />
<button onclick="testes();">testar</button>
<button onclick="testes2();">testar2</button>
-->
</body>
</html>
