var recognition;

$(document).ready(function(){
						   
	$("#rect").click(function(){
		ligar_falas();
	});



	if (!('webkitSpeechRecognition' in window)) {
			$("#suport_api").fadeIn();
		}

	
	
	recognition = new webkitSpeechRecognition();
	
	recognition.continuous = true;
	recognition.interimResults = true;
	recognition.lang = 'pt-BR';
		
	
	
	recognition.onresult = function(event) {
		
 	$("#char_assistente").html("<div id='ouvindo_char'><img style='padding-top: 88px; padding-left: 35px;' src='img/audio.gif'></div>");
		var resultadoFinal;
		
		for (var i = event.resultIndex; i < event.results.length; ++i) {
	 
		  if (event.results[i].isFinal) {
	 
			// Resultado final
			resultadoFinal = event.results[i][0].transcript;
			fct_enviar_msg_chat(resultadoFinal);
	 
		  } else {
			 
			// Resultado provisório
			$("#input_cmp_msg").val(event.results[i][0].transcript);
			
		  }
		}
		
		$("#input_cmp_msg").val("");
		
	 };
	 
	 recognition.onend = function() {
    	recognition.start();
	 };
	
	
});



function ligar_falas(){
	try {
		recognition.start();
	} catch(ex) {
		recognition.stop();
	}
}


