$(document).ready(function(){
						   
						   

});


function modo_wiki_ativo(){
	$("body").append("<div id=\"resultado_oc\" style=\"display:inline;\"></div>");
	$("#char_assistente").html("<div id='wiki_ch'><img style='  margin-top: -33px; padding-left: 1px; width: 40px' src='https://social.stoa.usp.br/articles/0028/9002/formatura.png'></div>");
}




function busca_sugestiva(busca_msg){
	
	busca_msg = $(busca_msg).attr("title");
	
	var tmp_resp = (((Math.floor(Math.random() * 10 + 1))*100)+500);
	
	$("#char_assistente").css('background-image','url('+avatars[1]+')')
	.delay(tmp_resp).queue(function(next){
	
		buscar(busca_msg);	
		next();
	});
					
	
}







function buscar(busca_msg){
	
	msg_personalizada(nick_armazenado,busca_msg, verificar_lado_msg(nick_armazenado));
	
	var ctd_buscar = busca_msg;
	ctd_buscar = remover_char_str_all(ctd_buscar,' ','_');
	
	
	msg_personalizada(pet_nome,"procurando...", verificar_lado_msg(pet_nome));
	$("#input_cmp_msg").val("");

	$.post("wiki_b.php", { 
			busca_wiki: ctd_buscar
		},		
		function(data) {

			retirar_valor(data);
		
		}
	);
}


function retirar_valor(data){

	return;
	$('#resultado_oc').html(data);

	console.log(data);

	if($('#resultado_oc').html()== 'offline'){
		var valor = nick_armazenado+", n&#227;o encontrei nada relacionado em minhas pesquisas, podemos tentar outra coisa?";
	}else{

		var valor = $('#resultado_oc #mw-content-text p:eq(0)').text();

		if(verificar_cexiste($('#resultado_oc').html(),'pode referir-se a') != -1){
			
			$('#resultado_oc #mw-content-text ul li a').removeAttr("href").attr("onclick","busca_sugestiva(this);").css('cursor','pointer');
			
			valor = valor+"</br>"+$('#resultado_oc #mw-content-text ul:eq(0)').html();
			valor = valor+"</br>"+$('#resultado_oc #mw-content-text ul:eq(1)').html();
		}
		

		var j = 1;
		var novo_p;
		var ct_pulos = 0;
		var br_quebra;
		
		for(var i = 0; i < 99999999; j++){
			
			br_quebra = "</br></br>";
			novo_p = $('#resultado_oc #mw-content-text p:eq('+j+')').text();
			
			if(novo_p == ""){
				ct_pulos += 1;
				br_quebra = "";
			}
			
			valor = valor+br_quebra+novo_p;

			valor = valor.replace("Ou ainda:","");


			if(valor.length > 500)
			  i = 999999999;
			 
			if(ct_pulos > 20)
			  i = 999999999;
		}
		
		
		
	}
	
	
	msg_personalizada(pet_nome,valor, verificar_lado_msg(pet_nome));
	$("#char_assistente").css("background-image","url('"+avatars[0]+"')");
	$('#resultado_oc').html("");
	
}
