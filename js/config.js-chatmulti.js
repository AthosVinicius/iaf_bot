var enderecosNav = [];

$(document).ready(function() {
	
	socket.on('iniciaOAplicativo', iniciaOAplicativo);
	socket.on('atualizarListaDeJogadores', fct_atualizarListaDeJogadores);
	socket.on('sucesso_ao_logar_c', sucesso_ao_logar_c);
	socket.on('confirmacaoDaMensagemEnviadaEu', confirmacaoDaMensagemEnviadaEu);
	socket.on('confirmacaoDaMensagemEnviada', confirmacaoDaMensagemEnviada);
	
	$("#btn_logar").click(function(){ fct_logar();	});
	
	
	$("#btn_conversar").click(function(){ fct_ch_conversar();	});
	
});


function iniciaOAplicativo(){
	$("#principal").fadeIn(1000);
}

function fct_logar(){
	
	var login_env =  $("#cmp_login").val();
	var senha_env = $("#cmp_senha").val();
	socket.emit('logar',{usuarioIns_server: login_env, senhaIns_server: senha_env}); 
	
	
}

function fct_atualizarListaDeJogadores(data){
	
	$("#lista_de_clientes_online").html("");
	
	for(var i = 0; i<data.listClientes.length; i++){
		$("#lista_de_clientes_online").append(data.listClientes[i].nome + "</br>");
	}
	
}



function fct_ch_conversar(){
	$("#char_assistente").animate({
		height: 80,
		width: 100,
		marginLeft: "5px"
	}, 1000, function() {
		
        $("#panelLogado").animate({
			paddingTop: "10px"
		}, 300, function(){
				$("#panelLogado").append("<div id='log_conversa_c'></div><div id='cmp_msg_c'><textarea id='input_cmp_msg' onkeypress='env_com_enter()'></textarea><button id='btn_enviar_msg_c' onclick='fct_enviar_msg_chat();'>Enviar</button></div>")
				.delay(200)
				.queue(function(next){
					$("#log_conversa_c").fadeIn(500);
					next();
				})
				.delay(200)
				.queue(function(next){
					$("#cmp_msg_c").css("display","table");
					next();
				});
		});
  });
}





function sucesso_ao_logar_c(){
	
	$("#panelLogin").fadeOut(1000)
	.delay(200)
	.queue(function(next){
		$("#panelsubPrincipal").fadeIn(1000);
		next();
	});
	
}



function fct_enviar_msg_chat(){
	var cmp_msg = $("#input_cmp_msg").val();
	socket.emit('enviarMensagemDoChat',{msgCmp: cmp_msg}); 
}





function confirmacaoDaMensagemEnviada(data){
	$("#input_cmp_msg").val("");
	
	
	var array_msgs = data.msgRt;
	
	$("#log_conversa_c").html("");
	
	for(var i = 0; i< array_msgs.length; i++){
		$("#log_conversa_c").append('<div class="msg_md_c" n_msg="'+i+'">'+array_msgs[i].nCliente+' disse: '+array_msgs[i].cmsg+'</div>');
	}
	
	
	$("#log_conversa_c").scrollTop(100000000);
}



function confirmacaoDaMensagemEnviadaEu(data){
	$("#input_cmp_msg").val("");
	
	
	var array_msgs = data.msgRt;
	
	$("#log_conversa_c").html("");
	
	for(var i = 0; i< array_msgs.length; i++){
		$("#log_conversa_c").append('<div class="msg_md_c" n_msg="'+i+'">'+array_msgs[i].nCliente+' disse: '+array_msgs[i].cmsg+'</div>');
	}
	
	
	$("#log_conversa_c").scrollTop(100000000);
}


function env_com_enter(e){
	
	var keycode = window.event.keyCode;
	if (keycode == 13){fct_enviar_msg_chat();}
	
}

function testes(){
	//alert($("#log_conversa_c").scrollTop());
}