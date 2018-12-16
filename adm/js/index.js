/*******************************************************************************
                     FUNÇÕES CARREGADAS DEPOIS DA PAGINAS
/*******************************************************************************/

$(document).ready(function() {
	//CHAMA PAGINA LOGIN
	
    $("#cd_fala").click(function(){ cd_fala(); });
    $("#sl_fala").click(function(){ sl_fala(); });
	
	
	
	
});



function sl_fala(){
	
	$.post("cmd/funcoes.php", { 
		funcao_ch: 3,
		param1: $("#frase_recebida").val(),
		param2: $("#frase_resposta").val(),
		param3: $("#n_frase_sel").val()
		},
					
		function(data) {
			
			$("#operacoes").html(data)
			.fadeIn(500)
			.delay(1000)
			.queue(function(next){
					$("#operacoes").fadeOut(500);
			
				next();
			});
			
		}
	);
	
	
}




function del_fala(id_fala,id_pet){
	
    var r = confirm("Deseja realmente remover o registro?");
    if (r == true) {
		
		$("#box_falas")
		.fadeOut(500)
		.delay(1000)
		.queue(function(next){
						
			$.post("cmd/funcoes.php", { 
				funcao_ch: 4,
				param1: id_fala
				},
							
				function(data) {
					
					atualizar_registros(id_pet);
				}
			);
		
			next();
		})
		.delay(1000)
		.fadeIn(500);
		
		
	
	}
	
}


function modelar_resp(cmd){
	
	var mdl = "";
	
	switch(cmd){
		
		case 'fcu1':
		
				mdl = "function funcao_exec_user(){\n\n\n\n}";
				$("#frase_recebida").val(mdl).focus();
				
		break;
		
		case 'msg_per':
		
				if(verificar_cexiste($("#frase_recebida").val(),"msg_personalizada") == -1){
		
				alert("DICA: Troque as duas palavras Usuário pela variavél que representa o rementente.");
				alert("DICA: Troque Mensagem pela mensagem  a ser enviada.");
				
				}
				
				
				$("#frase_recebida").insertAtCaret("msg_personalizada(Usuário,Mensagem, verificar_lado_msg(Usuário));");
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



function cd_fala(id_registro){
	
	$("#cd_fala").attr("disabled","disabled");
	
	$.post("cmd/funcoes.php", { 
		funcao_ch: 1,
		param1: $("#frase_recebida").val(),
		param2: $("#frase_resposta").val(),
		param3: $("#id_pet").val()
		},
					
		function(data) {
			
			$("#operacoes").html(data)
			.fadeIn(500)
			.delay(1000)
			.queue(function(next){
							
					$("#frase_recebida").val("");
					$("#frase_resposta").val("");
					$("#operacoes").fadeOut(500);
			
				next();
			})
			.delay(500)
			.queue(function(next){
							
				atualizar_registros($("#id_pet").val());
				$("#cd_fala").removeAttr("disabled");
			
				next();
			});
			
			
			
		}
	);
	
	
}





function verificar_cexiste(string, palavra){
	return string.indexOf(palavra);
}




function atualizar_registros(id_pet){
	
	$.post("cmd/funcoes.php", { 
				funcao_ch: 2,
				param1: id_pet
				},
				function(data) {
					$("#box_falas").html("");
					$("#box_falas").html(data);
			});
}
