var enderecosNav = [];
var dominio_servidor = "http://127.0.0.1/iaf";
var id_login_conectado = 99999;
var id_cliente_logado = 99999;
var contador_msgs = 0;
var msg_armazenada = "";
var nick_armazenado = "";
var pet_nome = "";
var disponi = false;
var tempo_ultma_msg;
var tempo_contador_descanso;
var modo_de_assistencia = 1;
var avatars = [];
var audioTmp = new Audio();
var falarR = true;

$(document).ready(function() {
						   
	socket.on('iniciaOAplicativo', iniciaOAplicativo);
	socket.on('atualizarListaDeJogadores', fct_atualizarListaDeJogadores);
	socket.on('sucesso_ao_logar_c', sucesso_ao_logar_c);
	socket.on('confirmacaoDaMensagemEnviadaEu', confirmacaoDaMensagemEnviadaEu);
	socket.on('confirmacaoDaMensagemEnviadaEu_pet', confirmacaoDaMensagemEnviadaEu_pet);
	socket.on('confirmacaoDaMensagemEnviada', confirmacaoDaMensagemEnviada);
	
	$("#btn_logar").click(function(){ fct_logar();	});
	
	
	$("#btn_conversar").click(function(){ 
			fct_ch_conversar();
			desativar_m_wiki();
	});
	
	
	$("#btn_wiki").click(function(){ 
			fct_ch_conversar();
			ativar_m_wiki();
	});
	
	
	$("#log_conversa_principal").mCustomScrollbar({
		autoHideScrollbar:true,
		theme:"rounded"
	});
	
	
	
});

function iniciaOAplicativo(){
	$("#principal").fadeIn(1000);
}

function fct_logar(){
	
	var login_env =  $("#cmp_login").val();
	var senha_env = $("#cmp_senha").val();
	socket.emit('logar',{usuarioIns_server: login_env, senhaIns_server: senha_env}); 
	
}



function cbd(sql_query,sql_cmps,sql_recp){
	
	socket.emit('cbd',{sql_query: sql_query, sql_cmps: sql_cmps, sql_recp: sql_recp}); 
	
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
				$("#panelLogado").append("")
				.delay(200)
				.queue(function(next){
					$("#log_conversa_principal").fadeIn(500);
					$("#log_conversa_c").fadeIn(500).css("display","table");
					
					next();
				})
				.delay(200)
				.queue(function(next){
					$("#cmp_msg_c").css("display","table");
					alterar_disponi2();
					
					next();
				});
		});
  });
}




function modelar_resp(cmd){
	
	var mdl = "";
	
	switch(cmd){
		
		case 'fcu1':
		
				mdl = "function funcao_exec_user(){\n\n\n\n}";
				$("#cmp_ajuda").val(mdl).focus();
				
				$("#cmp_ajuda").animate({
					height: "200px"
				}, 1000, function() {
				
					$("#log_conversa_principal").mCustomScrollbar("scrollTo","bottom");
					
				});
				
		break;
		
		case 'msg_per':
		
				if(verificar_cexiste($("#cmp_ajuda").val(),"msg_personalizada") == -1){
		
				alert(unescape("DICA: Troque as duas palavras Usuario pela variavel que representa o rementente."));
				alert("DICA: Troque Mensagem pela mensagem  a ser enviada.");
				
				}
				
				
				$("#cmp_ajuda").insertAtCaret("msg_personalizada(Usuario,\"Mensagem\", verificar_lado_msg(Usuario));");
		break;
	}
}


 




/*Plugin definition*/
jQuery.fn.extend({
insertAtCaret: function(myValue){
  return this.each(function(i) {
    if (document.selection) {
      this.focus();
      sel = document.selection.createRange();
      sel.text = myValue;
      this.focus();
    }
    else if (this.selectionStart || this.selectionStart == '0') {
      var startPos = this.selectionStart;
      var endPos = this.selectionEnd;
      var scrollTop = this.scrollTop;
      this.value = this.value.substring(0, startPos)+myValue+this.value.substring(endPos,this.value.length);
      this.focus();
      this.selectionStart = startPos + myValue.length;
      this.selectionEnd = startPos + myValue.length;
      this.scrollTop = scrollTop;
    } else {
      this.value += myValue;
      this.focus();
    }
  })
}
});




function sucesso_ao_logar_c(data){
	
	
	id_cliente_logado = data.id_cliente_logado;
	nick_armazenado = data.nick_cliente_logado;
	pet_nome = data.pet_nome;
	avatars[0] = dominio_servidor+"/img/avatars/"+data.pet_avatar1;
	avatars[1] = dominio_servidor+"/img/avatars/"+data.pet_avatar2;
	avatars[2] = dominio_servidor+"/img/avatars/"+data.pet_avatar3;
	/*
	alert(data.pet_nome);
	alert(data.nick_cliente_logado);
	alert(data.pet_avatar2);
	*/
	
	$("#char_assistente").css("background-image","url('"+avatars[0]+"')");
	
	
	$("#panelLogin").fadeOut(1000)
	.delay(200)
	.queue(function(next){
		$("#panelsubPrincipal").fadeIn(1000);
		next();
	});
	
}



function fct_enviar_msg_chat(fala_passada){
	 var cmp_msg = fala_passada;
		
	
	
	if(!disponi){
		
		
		
			
		//* Verifica se o nome do pet n�o esta sendo chamado para 
		//encerrar a fun��o depois de listar e ignorar a fala.
		
		if(verificar_cexiste(cmp_msg,pet_nome) == -1){
				
				$("#ouvindo_char").remove();
				msg_personalizada(nick_armazenado,cmp_msg, verificar_lado_msg(nick_armazenado));
				$("#input_cmp_msg").val("");
				
				return;
		}
		
		
		
		if(remover_char_str_all(cmp_msg," ","").toUpperCase() == pet_nome.toUpperCase()){
			alterar_disponi();
			msg_personalizada(pet_nome,"oque deseja "+nick_armazenado+"?", verificar_lado_msg(pet_nome));
			//cmp_msg = cmp_msg.replace(pet_nome,"");
		}
		
		cmp_msg = "";
	}
	
	
	if(cmp_msg != ""  && cmp_msg != " "){
		
		
		
		switch(modo_de_assistencia){
			case 1:
		
				tempo_ultma_msg = pegar_hora_minuto_atual();
				socket.emit('enviarMensagemDoChat',{msgCmp: cmp_msg}); 
				break;
			case 2:
				
				if(verificar_cexiste(cmp_msg,'alterar para modo livre') != -1){
					
					msg_personalizada(nick_armazenado, cmp_msg, verificar_lado_msg(nick_armazenado));
					desativar_m_wiki();
					$("#input_cmp_msg").val("");
					
					return;
				}
				
				
				
				var tmp_resp = (((Math.floor(Math.random() * 10 + 1))*100)+500);
				$("#char_assistente").css('background-image','url('+avatars[1]+')')
				.delay(tmp_resp).queue(function(next){
					
					buscar(cmp_msg);
					
					next();
				});
					
					
				break;
		}
	}else{
		$("#input_cmp_msg").val("");
	}
	
}


function remover_espacos_str(string,deste,para){
	
	return string.replace(deste,para);
	
}

function remover_char_str_all(string,deste,para){
	var nString = "";
	
	for(var i=0; i<string.length;i++){
		if(string[i] != deste)
			nString += string[i];
		else
			nString += para;
	}

	return nString;
	
}


function confirmacaoDaMensagemEnviada(data){
	$("#input_cmp_msg").val("");
	
	
	var array_msgs = data.msgRt;
	
	$("#log_conversa_c").html("");
	
	for(var i = 0; i< array_msgs.length; i++){
		if(array_msgs[i].idCliente == id_cliente_logado){
		$("#log_conversa_c").append('<div class="msg_md_c" n_msg="'+i+'"><b>'+array_msgs[i].nCliente+'</b> disse: '+array_msgs[i].cmsg+' ['+array_msgs[i].idCliente+' - '+id_cliente_logado+']sss </div>');
		}
	}
	
	
	$("#log_conversa_principal").mCustomScrollbar("scrollTo","bottom");
}



function confirmacaoDaMensagemEnviadaEu(data){
	$("#input_cmp_msg").val("");
	$("#ouvindo_char").remove();
	
	/*
	if(verificar_cexiste(data.msgRt,'chfun') == -1){
		atualizar_log_msg(data.msgRt, 0);
	}*/
	
		atualizar_log_msg(data.msgRt, 0);
	
	
}



function verificar_lado_msg(user){

		if(user == nick_armazenado)
			return lado_msg = "mmsg1";
		else
			return lado_msg = "mmsg2";
}


function falar_mensagem(msg){
	if(!falarR){
		return false;
	}

	falarR = false;

	var conf = {
		KC: "04ab5a0985f64c898ce208be232a287c",
		aF: "ulaw_44khz_stereo",
		lg: "pt-br",
		frm: "MP3",
		url: "http://api.voicerss.org"
	};



	audioTmp.src = conf.url + '/?key=' + conf.KC + '&c=' + conf.frm + '&f=' + conf.aF + '&hl=' + conf.lg + '&src=' + msg;
	audioTmp.play();
	audioTmp.addEventListener('ended',function(){
		falarR = true;
	});
}

function msg_personalizada(remetente, msg, lado_msg){

				if(lado_msg == 'mmsg2')
					falar_mensagem(msg);

				$("#log_conversa_c").append('<div class="msg_md_c '+lado_msg+'" n_msg="'+(contador_msgs++)+'"><b>'+remetente+'</b> disse: '+msg);
				$("#log_conversa_principal").mCustomScrollbar("scrollTo","bottom");
				
		atualizar_ultima_msg_guardada(msg);
}



function confirmacaoDaMensagemEnviadaEu_pet(data){
	var tmp_resp = (((Math.floor(Math.random() * 10 + 1))*100)+500);
	
	$("#char_assistente").css('background-image','url('+avatars[1]+')')
	.delay(tmp_resp).queue(function(next){
	atualizar_log_msg(data.msgRt, tmp_resp);
	
	$("#char_assistente").css("background-image","url('"+avatars[0]+"')");
		
		
		next();
	});
}




function atualizar_log_msg(array_msgs, tmp_resp){
	
	var cmp_ensinar = "";
	var lado_msg = "";
	var sum_param = "";
	
	if(verificar_cexiste(array_msgs.cmsg,'funcao_exec_user') != -1){
		
		
		if(verificar_cexiste(msg_armazenada,'((valores=') != -1){
												
			var parametros_msg = msg_armazenada.split("((valores=");
			var var_insert;											 
														 
			parametros_msg = parametros_msg[1].split("|");
			
			for(var i = 1; i< parametros_msg.length; i++){
				
				if(!eNumero(parametros_msg[i])){
				
					var_insert = '"'+parametros_msg[i]+'"';
				
				}else{ var_insert = parametros_msg[i]; }
				
				
				sum_param += "var param_cv"+i+" = "+var_insert+";\n";
			}
			
		}
		
		$("#ch_funcoes").html("<script>"+sum_param+array_msgs.cmsg+"</script>");
		
		
		 try{
			 funcao_exec_user();
		  }
		  catch(e){
			  
			  msg_personalizada(pet_nome,"Esta fun&#231;&#227;o que me foi passada esta com erro "+nick_armazenado+".</br>["+e.message+"]", verificar_lado_msg(pet_nome));
		  }
		  
		//$("#ch_funcoes").html("");
		return;
		
		
	}else{
		if(verificar_cexiste(array_msgs.cmsg,'#[ajuda-me]') != -1){
			
			
			desativar_cmps_msg();
			cmp_ensinar = "<div id='dv_cd_ajuda'><input type='hidden' id='cmp_ref_ajuda' value='"+msg_armazenada+"'/><textarea id='cmp_ajuda' style='width:90%; height:50px;'></textarea><br /><br /><button id='btn_cmp_ajuda' onClick='cd_ajuda("+id_cliente_logado+");'>Ensinar</button><button style=\"cursor:pointer;\" id=\"cd_funcao\" onclick=\"modelar_resp('fcu1');\">Fun&#231;&#227;o User</button><button style=\"cursor:pointer;\" id=\"cd_funcao\" onclick=\"modelar_resp('msg_per');\">Mensagem</button><button id='btn_cmp_ajuda' onClick='cd_najuda("+id_cliente_logado+");'>Mais tarde.</button></div></div>";
			
			
		}else{
			cmp_ensinar = "";
		}
	}
	
	
	

	if(array_msgs.idCliente == id_cliente_logado){
		
		if(cmp_ensinar != ""){
			
			if($("#dv_cd_ajuda").length){
				
				msg_personalizada(pet_nome,"Uma coisa de cada vez, vai me ensinar o'que pedi antes?", verificar_lado_msg(pet_nome));
				
			}else{
			
				msg_personalizada(array_msgs.nCliente,array_msgs.cmsg + cmp_ensinar, verificar_lado_msg(array_msgs.nCliente));
				
			}
				
		}else{
			
				msg_personalizada(array_msgs.nCliente,array_msgs.cmsg + cmp_ensinar, verificar_lado_msg(array_msgs.nCliente));
		}
		
		
			
	}
	
	
}



function eNumero(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}



function a(b) {
 	 var c= '';
 	 for(i=0; i<b.length; i++){
 	 
	 	if(b.charCodeAt(i)>127){ c += '&#' + b.charCodeAt(i) + ';'; }else{ c += b.charAt(i); }
	
	}
	
	return c;
		 
}


function atualizar_ultima_msg_guardada(msg){
	
		msg_armazenada = msg;
		$("#msg_armm").val(msg_armazenada);
}



function env_com_enter(e){
	
	var keycode = window.event.keyCode;
	if (keycode == 13){fct_enviar_msg_chat($("#input_cmp_msg").val());}
	
}



function cd_ajuda(id_do_cliente){
	$.post("adm/cmd/funcoes.php", { 
		funcao_ch: 5,
		param1: $("#cmp_ajuda").val(),
		param2: $("#cmp_ref_ajuda").val(),
		param3: id_do_cliente
		},
					
		function(data) {
			
			$("#dv_cd_ajuda").fadeOut(500)
			.delay(500)
			.queue(function(next){
				
				$("#log_conversa_c").append(data);
				
				next();
			})
			.delay(500)
			.queue(function(next){
							
				$("#dv_cd_ajuda").remove();
				
				next();
			});
			
			ativar_cmps_msg();
			
			
		}
	);
}




function cd_najuda(id_do_cliente){
					
			
			$("#dv_cd_ajuda").fadeOut(500)
			.delay(500)
			.queue(function(next){
				
				var msg_temp = 'Tudo bem, sei que voc&#234; esta ocupado.';
				msg_personalizada(pet_nome, msg_temp, verificar_lado_msg(pet_nome));
				
				next();
			})
			.delay(500)
			.queue(function(next){
							
				$("#dv_cd_ajuda").remove();
				ativar_cmps_msg();
				
				next();
			});
			
			
		
}


function pegar_hora_minuto_atual(){
	 
	 var data = new Date();
	 var data_g = data.getHours()+":"+data.getMinutes();
	 return data_g;
															
}


function alterar_disponi(){
	
	disponi = true;
	tempo_ultma_msg = pegar_hora_minuto_atual();
	
	
	$("#char_assistente").css("background-image","url('"+avatars[0]+"')");
	 $("#dormindo_ch").remove();
	 
	tempo_contador_descanso = setInterval(function(){ contador_de_descanso(ver_diferenca_d_minutos(tempo_ultma_msg,pegar_hora_minuto_atual())) }, 10000);
	 
															
}



function contador_de_descanso(restante){
	
	/*
	$("#descanso_cont").html("");
	$("#descanso_cont").append("Pet: "+pet_nome+"</br>");
	$("#descanso_cont").append("Ultima fala: "+tempo_ultma_msg);
	*/
	
	var limit = 2;
	limit = (limit-restante);
	
	if(limit <= 0){
		clearInterval(tempo_contador_descanso);
		alterar_disponi2();
	}
}






function ver_diferenca_d_minutos(hora_registrada,hora_atual){
	
	var data_r = hora_registrada.split(":");
	var horas_r = data_r[0];
	var minutos_r = data_r[1];
	
	var data_a = hora_atual.split(":");
	var horas_a = data_a[0];
	var minutos_a = data_a[1];
	
	var n_result_r;
	var n_result_a;
	var n_result_f;
	
	n_result_r = (horas_r * 60);
	n_result_r = (n_result_r + minutos_r);
	
	n_result_a = (horas_a * 60);
	n_result_a = (n_result_a + minutos_a);
	
	n_result_f = n_result_a - n_result_r;
	
	return n_result_f;
	
}


function alterar_disponi2(){
	 disponi = false;
	 
	 msg_personalizada(pet_nome, "Vou hibernar at&#233; que voc&#234; precise de mim&#46;", verificar_lado_msg(pet_nome));
	 
	 
	$("#char_assistente").css("background-image","url('"+avatars[2]+"')");
	$("#char_assistente").append("<div id='dormindo_ch'><img style='  margin-top: -23px; padding-left: 77px;' src='http://1.bp.blogspot.com/-2cix9W9uDLg/UZJzc2K5lJI/AAAAAAAADrQ/1kNNdztz890/s1600/zzz-facebook-symbol.png'></div>");
}


function verificar_cexiste(string, palavra){
	return string.indexOf(palavra);
}


function desativar_cmps_msg(){
	$("#input_cmp_msg").attr("disabled","disabled");
	$("#btn_enviar_msg_c").attr("disabled","disabled");
}


function ativar_cmps_msg(){
	$("#input_cmp_msg").removeAttr("disabled");
	$("#btn_enviar_msg_c").removeAttr("disabled");
}

function ativar_m_wiki(){
	modo_de_assistencia = 2;
  	modo_wiki_ativo();
	msg_personalizada(pet_nome,"Modo Wiki ativado, aguardo seus comando, "+nick_armazenado, verificar_lado_msg(pet_nome));
}

function desativar_m_wiki(){					
	modo_de_assistencia = 1;
	$("#wiki_ch").remove();
	msg_personalizada(pet_nome,"O modo assistencia livre foi ativado , "+nick_armazenado+".", verificar_lado_msg(pet_nome));
}

function testes(){
	//$("head script:eq(2)").attr('src','js/teste.js');
}