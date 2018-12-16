// JavaScript Document
var clientes = [];


exports.iniciarfuncoesServer = function(socket){

//VARIAVEIS
gameSocket = socket;




		novaConexao(gameSocket);
		gameSocket.on('validacaoDoNick', validarNick);
}







/*************************************************************************
						FUNÇÕES DO CLIENTE
*************************************************************************/


function novaConexao(data){
	
		
		var address = gameSocket.handshake.address;
		var codConexaoVar = gameSocket.id;
		var identificacao = address.address +":"+ address.port;
		
		
		//CRIA USUARIO
		codConexaoVar = {ident: identificacao, codConexao: codConexaoVar}
		//adiciona ao array clientes
		clientes.push(codConexaoVar);
		
		var msgconexao = codConexaoVar.ident + " Acabou entrar na sala de espera.";
		
				gameSocket.broadcast.emit('toClient', msgconexao);
				gameSocket.emit('toClient', msgconexao);
		
		
		



	
}









function validarNick(data){
		var codConexaoVar = gameSocket.id;
		var nickParaValidar = data.nick;
		
		
		if(nickParaValidar == '' || nickParaValidar == ' ' || nickParaValidar == null || nickParaValidar == undefined){
			engrenagem = false;
			var listaDeClientes = '';
			
			gameSocket.emit('retornoDoNick', engrenagem, nickParaValidar, listaDeClientes);
			
			
		}else{
			
			engrenagem = true;
			codConexaoVar.nick = nickParaValidar;
			
			var listaDeClientes = clientes;
			var meuNick = nickParaValidar;
			
			gameSocket.emit('retornoDoNick', engrenagem, meuNick, listaDeClientes);	
		}
}
