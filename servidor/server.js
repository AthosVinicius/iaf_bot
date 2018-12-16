/////////////////////[[ MODULOS DO SERVIDOR PARA FUNCIONAR CORRETAMENTE ]]//////////
var express = require('express');
app = express();


/////////////////////[[ MODULOS DO SERVIDOR PARA FUNCIONAR CORRETAMENTE ]]//////////
var server = require('http').createServer(app)
    , porta = 8000
    , mysql = require('mysql')
    , path = require('path')
    , util = require('util')
    , scriptSever1 = require('./scriptServer.js')
    , io = require('socket.io').listen(server);


/////////////////////[[ INICIA O SERVIDOR E EXIBE A MENSAGEM NO LOG ]]///////////////
server.listen(porta, function () {
    console.log("Servidor iniciado na porta " + porta);
    ;
});


/////////////////////[[ DIRETÓRIO DE RECURSOS PARA HTTP PORTA 8000 ]]///////////////
app.use(express.static(path.join(__dirname, '1.0')));


/////////////////////[[ CASO QUERIA UMA NAVEGAÇÃO ATRAVEZ DA PORTA ]]////////////////
app.get('/', function (req, res) {
});


/////////////////////[[  ARRAY DE CLIENTE LOGADOS ATUALMENTE  ]]/////////////////////
var clientesOnline = [];

var MsgsConversas = [];

var SalasDeDuelos = [];

var PartidasDuelos = [];
/////////////////////[[ ESTIPULA A FILTRAGEM DE LOG QUE VAI SER EXIBIDA ]]///////////
io.set('log level', 2);


/*************************************************************************************
 FUNÇÃO CONEXÃO COM BANCO DE DADOS MYSQL
 **************************************************************************************
 @VARIAVEIS
 * host = servidor
 * user = usuario do banco de dados
 * password = senha do banco de dados
 * database = nome do banco de dados
 * conexaoMysqlPortalYugioh = nome da função que faz a conexão com o banco de dados
 @PARAMETROS
 *
 @FUNÇÕES
 * Faz a conexão com o banco de dados atravez da autenticação.
 ************************************************************************************/
var conexaoMysqlPortalYugioh = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iaf'
});


var conexaoMysqliaf = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'iaf'
});


/*************************************************************************************
 FUNÇÕES DO SERVIDOR SOCKET
 **************************************************************************************
 @VARIAVEIS
 * socket = é o scoket que faz a comunicação entre servidor e clientes.
 * servidor = socket como dito acima.
 * address = dados como ip e porta do cliente
 @PARAMETROS
 *
 @FUNÇÕES
 * connetion, assim que o cliente acessar a pagina dispara a conexão
 ************************************************************************************/

// Eventos do Socket.IO
io.sockets.on('connection', function (socket) {

    var servidor = socket;
    var address = socket.handshake.address;
    iniciaOAplicativo(servidor);


/////////////////////[[ FUNÇÕES OUVINTES, QUE VEM DOS CLIENTES ]]/////////////////////
    servidor.on('logar', logar);
    servidor.on('logarComSessao', logarComSessao);
    socket.on('disconnect', desconectarCliente);
    socket.on('enviarMensagemDoChat', enviarMensagemDoChat);
    socket.on('listarMensagensDoChat', listarMensagensDoChat);
    socket.on('listarClientesConectados', listarClientesConectados);
    socket.on('criarSalaDeDuelo', criarSalaDeDuelo);
    socket.on('buscarSalas', buscarSalas);
    socket.on('entrarEmSala', entrarEmSala);
    socket.on('consultarCartasPorId', consultarCartasPorId);
    socket.on('buscarInformacoesDoJogo', buscarInformacoesDoJogo);
    socket.on('cbd', cbd);

    /*************************************************************************************
     FUNÇÃO INICIAR APLICATIVO
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * servidor = tem o valor da variavel socket dita acima.
     @FUNÇÕES
     * assim que o jogador se conectar exibe a mensagem de log no console
     * aciona a função que inicia o aplicativo do lado do cliente
     ************************************************************************************/
    function iniciaOAplicativo(servidor) {


        util.log("Um novo jogador se conectou ao servidor!");
        servidor.emit('iniciaOAplicativo', 'iniciaOAplicativo');
        listarClientesConectados();
    }

    /*************************************************************************************
     FUNÇÃO PARA FAZER LOGIN
     **************************************************************************************
     @VARIAVEIS
     * login_cliente = login recebida atravéz do formulario pelo cliente.
     * senha_cliente = senha recebida atravéz do formulario pelo cliente
     * consulta = sql de consulta no banco de dados
     @PARAMETROS
     * data = carrega os valores de todos os atributos passados atravéz da função ex: data.nome, data.idade
     @FUNÇÕES
     * exibe o login e a senha do cliente (Para testes)
     * executa a função de conexão com o banco de dados
     * se existir algum erro "err", vai exibilo no console
     * caso não exista erro vai verificar se existe um cliente com o login e a senha cadastrados
     * caso não exista vai chama a função que vai liberar os campos novamente para outra tentativa de login
     * se existir vai acessar o sistema
     ************************************************************************************/

    function logar(data) {


        var login_cliente = validarString(data.usuarioIns_server) == true ? data.usuarioIns_server : '0';
        var senha_cliente = validarString(data.senhaIns_server) == true ? data.senhaIns_server : '0';

        util.log('Login: ' + login_cliente + ' e Senha: ' + senha_cliente);


        var consulta = 'SELECT count(id) AS validarAcesso, id, nick, pet_nome, avatar1, avatar2, avatar3 FROM cadastro WHERE login = ? and senha = ?'; // SQL


        conexaoMysqlPortalYugioh.query(consulta, [login_cliente, senha_cliente], function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {

                if (rows[0].validarAcesso > 0) {


                    var cliente = {
                        nome: rows[0].nick,
                        idSocket: servidor.id,
                        id: rows[0].id,
                        petN: rows[0].pet_nome,
                        pet_avatar1: rows[0].avatar1,
                        pet_avatar2: rows[0].avatar2,
                        pet_avatar3: rows[0].avatar3
                    }


                    console.log('login válido!');
                    clientesOnline.push(cliente);
                    listarClientesConectados();
                    sucesso_ao_logar();


                } else {
                    console.log('Acesso negado!!');
                    servidor.emit('aguardarLogar', 2);
                }
            } // fim da condição de acesso
        }); // fim da consulta mysql
    }// Fim da função Logar

    /*************************************************************************************
     FUNÇÃO VALIDAR STRINGS
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * string = valor a ser validado
     @FUNÇÕES
     * vai verificar se a strin tem algum valor, se tem apenas um espaço, nula ou indefinida
     ************************************************************************************/
    function validarString(string) {
        if ((string == '') || (string == ' ') || (string == null) || (string == undefined)) {
            return false;
        } else {
            return true;
        }
    }

    function sucesso_ao_logar() {

        var clienteDesconectado = servidor.id;
        var nClienteDesconectado = identificarCliente(clienteDesconectado);
        var id_cliente_logado = clientesOnline[nClienteDesconectado].id;
        var nick_cliente_logado = clientesOnline[nClienteDesconectado].nome;
        var pet_nome = clientesOnline[nClienteDesconectado].petN;
        var pet_avatar1 = clientesOnline[nClienteDesconectado].pet_avatar1;
        var pet_avatar2 = clientesOnline[nClienteDesconectado].pet_avatar2;
        var pet_avatar3 = clientesOnline[nClienteDesconectado].pet_avatar3;

        servidor.emit('sucesso_ao_logar_c', {
            id_cliente_logado: id_cliente_logado,
            nick_cliente_logado: nick_cliente_logado,
            pet_nome: pet_nome,
            pet_avatar1: pet_avatar1,
            pet_avatar2: pet_avatar2,
            pet_avatar3: pet_avatar3
        });
    }

    function string_number(n) {
        if (!isNaN(parseFloat(n)) && isFinite(n)) {
            console.log("é numero");
            return n;
        } else {
            console.log("é string");
            return '"' + n + '"';
        }
    }

    function cbd(data) {
        var consulta = data.sql_query;
        console.log(consulta + " <<Consulta aqui");
        var consulta_cmps = data.sql_cmps; //campos e condições
        var consulta_recp = data.sql_recp;//campos retornados
        var validar_injection = "";
        var recuperar_cmps = "";
        var resultador_a_retornar = [];


        consulta_cmps = consulta_cmps.split(',');

        for (var i = 0; i < consulta_cmps.length; i++) {
            if (i == (consulta_cmps.length - 1)) {
                validar_injection += consulta_cmps[i];
            } else {
                validar_injection += consulta_cmps[i] + ",";
            }
        }


        console.log("Valores da interrogação: " + validar_injection);

        conexaoMysqliaf.query(consulta, [validar_injection], function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {

                if (rows.length > 0) {


                    consulta_recp = consulta_recp.split(',');


                    for (var n = 0; n < rows.length; n++) {

                        for (var z = 1; z < consulta_recp.length; z++) {

                            //recuperar_cmps += consulta_cmps[z] + " : "+rows[n].consulta_recp[z];

                            console.log(rows[n].consulta_recp[z]);
                        }

                        //var objss = {consulta_cmps: "asd"}

                    }


                }

            }
        });

    }

    function consultarCartasPorId(data) {
        var sujeito = data.clienteDeck;
        var cartaRecebida = data.cartaEnviar;
        var hostGuest = data.hostGuest;

        var consulta = 'SELECT * FROM cartas WHERE id = ' + cartaRecebida; // SQL

        conexaoMysqlGameYugioh.query(consulta, function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {
                util.log('verificando se jogador ' + sujeito + ' tem a carta ' + cartaRecebida);
                if (rows.length > 0) {

                    cartaRetornar = {
                        nome: rows[0].nome,
                        atak: rows[0].atk,
                        def: rows[0].def,
                        imagem: rows[0].imagem,
                        idCarta: cartaRecebida
                    }
                    socket.broadcast.emit('retonrarConsultarCarta', {
                        cartaRetonada: cartaRetornar,
                        hostGuest: hostGuest
                    });
                } else {
                    util.log('Deck não tem essa carta!');
                }// condição validar deck

            }// erro mysql

        });// consulta Mysql

    }

    /*************************************************************************************
     FUNÇÃO PARA FAZER LOGIN
     **************************************************************************************
     @VARIAVEIS
     * login_cliente = login recebida atravéz do formulario pelo cliente.
     * senha_cliente = senha recebida atravéz do formulario pelo cliente
     * consulta = sql de consulta no banco de dados
     @PARAMETROS
     * data = carrega os valores de todos os atributos passados atravéz da função ex: data.nome, data.idade
     @FUNÇÕES
     * exibe o login e a senha do cliente (Para testes)
     * executa a função de conexão com o banco de dados
     * se existir algum erro "err", vai exibilo no console
     * caso não exista erro vai verificar se existe um cliente com o id que esta logado no portal yugioh
     * se existir vai verificar se o cliente ja esta logado
     * se existir vai remover o cliente
     * vai criar um cliente
     * vai adicionar o cliente a lista de clientes online
     * vai enviar e atualizar as lista de clientes para todos os clientes.
     *
     * caso não exista vai redirecionar para a pagina de login.
     ************************************************************************************/

    function logarComSessao(data) {


        var login_cliente = validarString(data.usuarioIns_server) == true ? data.usuarioIns_server : '0';

        util.log('Login: ' + login_cliente + ' valor da sessao: ' + data.usuarioIns_server);

        var consulta = 'SELECT count(id) AS validarAcesso, id, nick, avatar, idFacebook FROM cadastro WHERE id = ' + login_cliente; // SQL


        conexaoMysqlPortalYugioh.query(consulta, function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {

                if (rows[0].validarAcesso > 0) {


                    if (verificarSeClienteEstaOnline(rows[0].id)) {
                        console.log("Jogador ja conectado!");
                        socket.emit('chamarPaginaServer', {pagina: "http://portalyugioh.com.br/#Ja Esta Logado"});
                    } else {
                        var corCliente = numeroAleatorio(1, 255) + "," + numeroAleatorio(1, 255) + "," + numeroAleatorio(1, 255);

                        var cliente = {
                            nome: rows[0].nick,
                            idSocket: servidor.id,
                            id: rows[0].id,
                            cor: corCliente,
                            avatar: rows[0].avatar,
                            idFacebook: rows[0].idFacebook
                        }
                        console.log(cliente.cor + "esta é a cor");
                        clientesOnline.push(cliente);
                        notificarWebChat(rows[0].nick + " acaba de entrar!");
                        listarClientesConectados();
                    }


                } else {
                    console.log('Acesso negado!!');
                    servidor.emit('redirecionarParaLogin');
                }
            } // fim da condição de acesso
        }); // fim da consulta mysql
    }// Fim da função Logar

    function notificarWebChat(mensagem) {

        var msgRegistrar = {nCliente: '---', cmsg: mensagem};

        console.log("---: " + mensagem);
        MsgsConversas.push(msgRegistrar);

        //socket.emit('confirmacaoDaMensagemEnviada',{msgRt: MsgsConversas});
        socket.broadcast.emit('confirmacaoDaMensagemEnviada', {msgRt: MsgsConversas});
    }

    /*************************************************************************************
     FUNÇÃO VERIFICAR SE O CLIENTE ESTA ONLINE
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * sujeito = contem o id do cliente
     @FUNÇÕES
     * verifica se o cliente esta entre os cliente online.
     ************************************************************************************/
    function verificarSeClienteEstaOnline(sujeito) {
        for (var i = 0; i < clientesOnline.length; i++) {
            if (sujeito == clientesOnline[i].id) {
                return true;
            } else {
                return false;
            }
        }
    }

    /*************************************************************************************
     FUNÇÃO REMOVE O CLIENTE
     **************************************************************************************
     @VARIAVEIS
     * clienteASerDesconectado = tem o valor do sujeito
     * nClienteASerDesconectado = tem o valor da função
     @PARAMETROS
     * sujeito = contem o id do cliente
     @FUNÇÕES
     * pega a posição do cliente no array de clientes
     * verifica se a posição foi definida
     * verifica se o numero do cliente é maior que -1 (que significa que ele existe no array)
     * se existir no array remove o cliente do array
     ************************************************************************************/
    function removerClienteOnline(sujeito) {
        var clienteASerDesconectado = sujeito;
        var nClienteASerDesconectado = identificarClientePorID(clienteASerDesconectado);

        if (nClienteASerDesconectado != undefined) {

            if (nClienteASerDesconectado > -1) {
                clientesOnline.splice(nClienteASerDesconectado, 1);
            }

        }
    }

    /*************************************************************************************
     FUNÇÃO PEGAR A POSIÇÃO DO CLIENTE PELO ID
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * sujeito = contem o id do cliente
     @FUNÇÕES
     * verifica se o cliente esta entre os cliente online.
     * retorna a posição do cliente no array
     ************************************************************************************/
    function identificarClientePorID(sujeito) {
        for (var i = 0; i < clientesOnline.length; i++) {
            if (sujeito == clientesOnline[i].id) {
                return i;
            }
        }
    }

    /*************************************************************************************
     FUNÇÃO LISTAR CLIENTES CONECTADOS
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * clientesOnline = é o array de usuario que estão logados
     @FUNÇÕES
     * vai enviar a lista de usuario logados para o cliente
     ************************************************************************************/
    function listarClientesConectados() {
        servidor.emit('atualizarListaDeJogadores', {listClientes: clientesOnline});
        servidor.broadcast.emit('atualizarListaDeJogadores', {listClientes: clientesOnline});
    }

    /*************************************************************************************
     FUNÇÃO ENVIAR MENSAGEM NO CHAT
     **************************************************************************************
     @VARIAVEIS
     * msg = tem o conteudo da mensagem a ser enviada
     * clienteDesconectado = id da conexão do jogador socket
     * nClienteDesconectado = posição do cliente
     * nomeDoCliente = Nome do cliente que enviou a mensagem
     * msgRegistrar = objeto, com jogador e mensagem
     @PARAMETROS
     * data = contém todos os valores passados através da função pelo cliente.
     @FUNÇÕES
     * Verifica se a posição do cliente foi definida
     * se for definida pega o nome do cliente dessa posição
     * se não for fica como desconhecido o nome.
     * cria uma mensagem pra ser adicionada ao array de mensagens
     * adicionar a mensagem a lista de mensagens
     * retorna as mensagens para o cliente
     ************************************************************************************/
    function enviarMensagemDoChat(data) {

        var msg = data.msgCmp;
        var clienteDesconectado = servidor.id;
        var nClienteDesconectado = identificarCliente(clienteDesconectado);


        if (nClienteDesconectado != undefined) {
            var nomeDoCliente = clientesOnline[nClienteDesconectado].nome;
            var idDoCliente = clientesOnline[nClienteDesconectado].id;
            var corDoCliente = clientesOnline[nClienteDesconectado].cor;
            var avatarDoCliente = clientesOnline[nClienteDesconectado].avatar;
            var idfacebook = clientesOnline[nClienteDesconectado].idFacebook
        } else {
            var nomeDoCliente = 'Visitante';
            var idDoCliente = 0;
            var corDoCliente = "100,102,50";
            var avatarDoCliente = 'no-image.jpg';
            var idfacebook = 0;
        }

        var msgRegistrar = {
            nCliente: nomeDoCliente,
            cmsg: msg,
            idCliente: idDoCliente,
            corDoCliente: corDoCliente,
            avatarDoCliente: avatarDoCliente,
            idfacebook: idfacebook
        };

        console.log(nomeDoCliente + ": " + msg);
        MsgsConversas.push(msgRegistrar);

        socket.emit('confirmacaoDaMensagemEnviadaEu', {msgRt: msgRegistrar});

        adicionar_conhecimento(nClienteDesconectado, idDoCliente, msg);
        //consultar_resposta_pet(idDoCliente, msg);

    }

    function numeroAleatorio(vIni, Vfin) {
        return Math.floor((Math.random() * Vfin) + vIni);
    }

    /*************************************************************************************
     FUNÇÃO LISTAR MENSAGENS NO CHAT
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * clientesOnline = é o array de usuario que estão logados
     @FUNÇÕES
     * retorna as mensagens para o cliente
     * Chama a função de listar clientes conectados
     ************************************************************************************/
    function listarMensagensDoChat() {
        socket.emit('confirmacaoDaMensagemEnviada', {msgRt: MsgsConversas});
        socket.broadcast.emit('confirmacaoDaMensagemEnviada', {msgRt: MsgsConversas});
        listarClientesConectados();
    }

    /*************************************************************************************
     FUNÇÃO PEGAR A POSIÇÃO DO CLIENTE PELA CONEXÃO
     **************************************************************************************
     @VARIAVEIS
     *
     @PARAMETROS
     * sujeito = contem o id do cliente
     @FUNÇÕES
     * verifica se o cliente esta entre os cliente online.
     * retorna a posição do cliente no array
     ************************************************************************************/
    function identificarCliente(sujeito) {
        for (var i = 0; i < clientesOnline.length; i++) {
            if (sujeito == clientesOnline[i].idSocket) {
                return i;
            }
        }
    }

    function adicionar_conhecimento(nClienteDesconectado, usuario_id, msg_conteudo) {
        var sep_msg_conteudo = msg_conteudo.split(" ");

        var consulta5 = 'SELECT count(id) as validar_fr2, id, qtd_vx FROM  `frases` WHERE  `frase` LIKE ? and usuario = ?'; // SQL


        conexaoMysqliaf.query(consulta5, [msg_conteudo, usuario_id], function (err, rows, fields) {
            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {


                var prox_increment_frases = 0;
                var prox_increment_pego = 0;


                if (rows[0].validar_fr2 >= 1) {
                    var qtd_atual = parseInt(rows[0].qtd_vx);
                    qtd_atual = qtd_atual + 1;

                    var consulta = 'UPDATE frases SET qtd_vx = ' + qtd_atual + ' WHERE id =' + rows[0].id; // SQL
                    prox_increment_frases = rows[0].id;
                } else {
                    var consulta = 'INSERT INTO frases (frase, usuario)VALUES(?,?)'; // SQL
                    prox_increment_pego = 1;

                }


                conexaoMysqliaf.query(consulta, [msg_conteudo, usuario_id], function (err, rows, fields) {
                    if (err) {
                        throw err;
                        console.log('Aconteceu o seguinte erro: ' + err);

                    } else {


                        var consulta7 = "SHOW TABLE STATUS LIKE 'frases'";
                        conexaoMysqliaf.query(consulta7, function (err, rows, fields) {
                            if (err) {
                                throw err;
                                console.log('Aconteceu o seguinte erro: ' + err);

                            } else {

                                if (prox_increment_pego != 0) {
                                    prox_increment_frases = (rows[0].Auto_increment - 1);
                                }

                                consultar_resposta_pet(nClienteDesconectado, usuario_id, msg_conteudo, prox_increment_frases);

                            }
                        });


                    } // fim de erro mysql

                });


            }// fim de erro mysql

        });// fim da consulta Mysql
    }

    function consultar_resposta_pet(nClienteDesconectado, id_cliente, msg_cliente, prox_increment_frases) {


        if (verificar_cexiste(msg_cliente, '((valores=') != -1) {
            var parametros_msg = msg_cliente.split("((valores=");
            msg_cliente = parametros_msg[0];
        }


        console.log("proximo: " + prox_increment_frases);
        var msg_resp = "";
        var qtd_resp = 0;
        var consulta = 'SELECT count(id) AS validarFrase, frase, id FROM frases_cadastradas WHERE SOUNDEX(tags) = SOUNDEX(?) and (pet = ? or pet = 0)'; // SQL


        conexaoMysqliaf.query(consulta, [msg_cliente, id_cliente], function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {


                if (rows[0].validarFrase > 0) {
                    msg_resp = rows[0].frase;
                    qtd_resp = rows[0].validarFrase;

                    var consulta_resp = 'UPDATE frases SET status = ' + rows[0].id + ' WHERE id =' + prox_increment_frases; // SQL

                    conexaoMysqliaf.query(consulta_resp, function (err, rows, fields) {

                        if (err) {
                            throw err;
                            console.log('Aconteceu o seguinte erro: ' + err);

                        } else {
                            console.log('Respondido!');
                        }


                    });


                } else {

                    msg_resp = " #[ajuda-me] " + clientesOnline[nClienteDesconectado].nome + " estou aprendendo bastante coisas, porém me falta conhecimento sobre esse assunto, poderia me instruir oque dizer neste caso?.";
                    qtd_resp = 0;

                }


            } // fim da condição de erro


            console.log(clientesOnline[nClienteDesconectado].petN + " " + msg_resp + "[ " + qtd_resp + " ]");

            var msgRegistrar_ret = {
                nCliente: clientesOnline[nClienteDesconectado].petN + " ",
                cmsg: msg_resp,
                idCliente: clientesOnline[nClienteDesconectado].id,
                corDoCliente: "#ffffff",
                avatarDoCliente: "avatar",
                idfacebook: "123"
            };
            MsgsConversas.push(msgRegistrar_ret);
            socket.emit('confirmacaoDaMensagemEnviadaEu_pet', {msgRt: msgRegistrar_ret});


        }); // fim da consulta mysql
    }

    function verificar_cexiste(string, palavra) {
        return string.indexOf(palavra);
    }

    function buscarSalas(data) {
        if (validarString(data.clienteIdent)) {

            var consulta = 'SELECT count(id) AS validarAcesso, id, nick, avatar, idFacebook FROM cadastro WHERE id = ' + data.clienteIdent; // SQL


            conexaoMysqlPortalYugioh.query(consulta, function (err, rows, fields) {

                if (err) {
                    throw err;
                    console.log('Aconteceu o seguinte erro: ' + err);

                } else {

                    if (rows[0].validarAcesso > 0) {

                        console.log("Iniciou a busca de Salas");
                        servidor.emit('retornarSalasDeDuelos', {
                            SalasDeDueloss: SalasDeDuelos,
                            idFacebook: rows[0].idFacebook
                        });
                        console.log("Retornou salas " + SalasDeDuelos.length);

                    } else {
                        console.log('Acesso negado!!');
                        servidor.emit('redirecionarParaLogin');
                    } // fim se existe no banco de dados
                } // fim de erro mysql
            }); // fim da consulta Mysql
        } // fim da validacao de login
    }

    function entrarEmSala(data) {

        //console.log('Cliente '+data.clienteGuest+' Entrando na sala '+data.sala);

        var idClienteGuest = data.clienteGuest;
        var idDaSalaPraEntrar = data.sala;
        var SalaSelecionada = SalasDeDuelos[idDaSalaPraEntrar];
        var idClienteHost = SalaSelecionada.clienteHost;


        if (validarString(idClienteGuest)) {

            var consulta = 'SELECT count(id) AS validarAcesso, id, nick, avatar, idFacebook FROM cadastro WHERE id = ' + idClienteGuest; // SQL


            conexaoMysqlPortalYugioh.query(consulta, function (err, rows1, fields) {

                if (err) {
                    throw err;
                    console.log('Aconteceu o seguinte erro: ' + err);

                } else {


                    var consulta2 = 'SELECT count(id) AS validarAcesso2, id, nick, avatar, idFacebook FROM cadastro WHERE id = ' + idClienteHost; // SQL

                    conexaoMysqlPortalYugioh.query(consulta2, function (err2, rows2, fields2) {


                        if (err2) {
                            throw err2;

                            console.log('Aconteceu o seguinte erro: ' + err2);

                        } else {


                            if (rows2[0].validarAcesso2 > 0) {

                                if (rows1[0].validarAcesso > 0) {


                                    console.log('Cliente ' + rows1[0].nick + ' Entrando na sala ' + SalaSelecionada.nomeDSala);
                                    SalaSelecionada.clienteGuest = idClienteGuest;
                                    SalaSelecionada.status = 1;

                                    console.log('Cliente ' + rows1[0].nick + ' Acaba de entrar na sala ' + SalaSelecionada.nomeDSala);

                                    var nomeDoClienteGuest = SalaSelecionada.clienteGuest;
                                    var nomeDoClienteHost = SalaSelecionada.clienteHost;


                                    inciarGame(idDaSalaPraEntrar);


                                    console.log('finalizar funcao');


                                } else {
                                    console.log('Acesso negado!!');
                                    servidor.emit('redirecionarParaLogin');
                                } // fim se existe no banco de dados
                            } // fim se existe no banco de dados 2
                        } // fim de erro mysql 2
                    }); // fim da consulta Mysql 2
                } // fim de erro mysql
            }); // fim da consulta Mysql
        } // fim da validacao de login
    }

    function criarSalaDeDuelo(data) {

        if (validarString(data.duelistaHost)) {

            var numeroDaSala = SalasDeDuelos.length + 1;
            var clienteHost = data.duelistaHost;
            var nomeDaSala = data.nomeDaSala;


            var consulta = 'SELECT count(id) AS validarAcesso, id, nick, avatar, idFacebook FROM cadastro WHERE id = ' + clienteHost; // SQL


            conexaoMysqlPortalYugioh.query(consulta, function (err, rows, fields) {

                if (err) {
                    throw err;
                    console.log('Aconteceu o seguinte erro: ' + err);

                } else {

                    if (rows[0].validarAcesso > 0) {

                        if (rows[0].idFacebook != '') {
                            var avatarDoCliente = "https://graph.facebook.com/" + rows[0].idFacebook + "/picture?type=large";
                        } else {
                            var avatarDoCliente = "http://portalyugioh.com.br/images/avatars/" + rows[0].avatar;
                        }


                        console.log('Sala de numero ' + numeroDaSala);
                        var salaDeDuelo = {
                            id: numeroDaSala,
                            nomeDSala: nomeDaSala,
                            clienteHost: clienteHost,
                            avatarHost: avatarDoCliente,
                            clienteGuest: 0,
                            pontosIni: 8000,
                            modalidade: 1,
                            status: 0
                        };

                        console.log('Sala de Duelos ' + salaDeDuelo.nomeDSala + ' criada!');
                        SalasDeDuelos.push(salaDeDuelo);
                        console.log('Sala adicionada ao array de salas');


                        if ((rows[0].idFacebook == '') || (rows[0].idFacebook == 'undefined')) {
                            var avatarDoCliente = "http://portalyugioh.com.br/images/avatars/" + rows[0].avatar;
                        } else {
                            var avatarDoCliente = "https://graph.facebook.com/" + rows[0].idFacebook + "/picture?type=large";
                        }

                        servidor.emit('salaDeDueloCriada', {
                            avatarDoCliente: avatarDoCliente,
                            nome: rows[0].nick,
                            numerDaSala: numeroDaSala,
                            nomeDaSala: nomeDaSala
                        });


                    } else {
                        console.log('Acesso negado!!');
                        servidor.emit('redirecionarParaLogin');
                    }
                } // fim da condição de acesso
            }); // fim da consulta Mysql
        } // fim da validacao de login
    }

    function identificarSalaDoCliente(sujeito) {
        for (var i = 0; i < SalasDeDuelos.length; i++) {
            if ((sujeito == SalasDeDuelos[i].clienteHost) || (sujeito == SalasDeDuelos[i].clienteGuest)) {
                return i;
            }
        }
    }

    function identificarPartidaDoCliente(sujeito) {
        for (var i = 0; i < PartidasDuelos.length; i++) {
            if ((sujeito == PartidasDuelos[i].clienteHost) || (sujeito == PartidasDuelos[i].clienteGuest)) {
                return i;
            }
        }
    }

    function montarDeck(sujeito) {
        var deckCliente = [];

        var consulta = 'SELECT carta FROM decks WHERE dono = ' + sujeito; // SQL

        conexaoMysqlGameYugioh.query(consulta, function (err, rows, fields) {

            if (err) {
                throw err;
                console.log('Aconteceu o seguinte erro: ' + err);

            } else {
                util.log('Iniciando montagem deck para jogador ' + sujeito);
                if (rows.length > 0) {

                    util.log('Iniciar listagem de cartas');
                    for (var i = 0; i < rows.length; i++) {
                        console.log('carta ' + rows[i].carta);
                        deckCliente.push(rows[i].carta);
                        console.log('Adicionada ao Array');
                    }

                    var numeroDaPartida = identificarPartidaDoCliente(sujeito);

                    if (numeroDaPartida != undefined) {

                        util.log('Partida identificada! numero ' + numeroDaPartida);

                        if (PartidasDuelos[numeroDaPartida].clienteHost == sujeito) {

                            util.log('Montando Deck Cliente Host!');
                            deckCliente.sort(randOrd);
                            var deckClienteString = deckCliente.toString();
                            PartidasDuelos[numeroDaPartida].deckHost = deckClienteString;

                            util.log('Status da partida e ' + PartidasDuelos[numeroDaPartida].status);
                            PartidasDuelos[numeroDaPartida].status += 1;
                            util.log('Novo Status da partida e ' + PartidasDuelos[numeroDaPartida].status);

                            util.log('Deck Gerado Host!');
                            util.log('Deck Adicionado a partida!');
                            console.log(PartidasDuelos[numeroDaPartida].deckHost);
                            console.log('fim da geracao de decks');

                        } else {
                            util.log('Montando Deck Cliente Guest!');
                            deckCliente.sort(randOrd);
                            var deckClienteString = deckCliente.toString();
                            PartidasDuelos[numeroDaPartida].deckGuest = deckClienteString;

                            util.log('Status da partida e ' + PartidasDuelos[numeroDaPartida].status);
                            PartidasDuelos[numeroDaPartida].status += 1;
                            util.log('Novo Status da partida e ' + PartidasDuelos[numeroDaPartida].status);

                            util.log('Deck Gerado Guest!');
                            util.log('Deck Adicionado a partida!');
                            console.log(PartidasDuelos[numeroDaPartida].deckGuest);
                            console.log('fim da geracao de decks');
                        }


                        if (PartidasDuelos[numeroDaPartida].status == 5) {
                            var clienteHost = PartidasDuelos[numeroDaPartida].clienteHost;
                            var clienteGuest = PartidasDuelos[numeroDaPartida].clienteGuest;

                            servidor.emit('retornarInicioDoDuelo', {
                                clienteHost: clienteHost,
                                clienteGuest: clienteGuest,
                                Npartida: numeroDaPartida
                            });
                            servidor.broadcast.emit('retornarInicioDoDuelo', {
                                clienteHost: clienteHost,
                                clienteGuest: clienteGuest,
                                Npartida: numeroDaPartida
                            });

                            console.log('Iniciando Duelo ' + clienteHost + ' contra ' + clienteGuest);


                        } else {
                            console.log("estatus insuficiente [" + PartidasDuelos[numeroDaPartida].status + "]");
                        }


                    }


                } else {
                    util.log('Deck não tem nenhuma carta!');
                }// condição validar deck

            }// erro mysql

        });// consulta Mysql

    }// fim da função

    function randOrd() {
        return (Math.round(Math.random()) - 0.5);
    }

    function buscarInformacoesDoJogo(data) {
        var sujeito = data.cliente;
        var numero_da_sala = data.Nsala;
        var clienteHost = PartidasDuelos[numero_da_sala].clienteHost;

        PartidasDuelos[numero_da_sala].status += 1;

        if (clienteHost == sujeito) {
            util.log(sujeito + ' da partida ' + numero_da_sala + ' buscou informações das partidas');
            socket.emit('retornoDoGameIniciadoEtapa1', {partidas: PartidasDuelos});
            socket.broadcast.emit('retornoDoGameIniciadoEtapa1', {partidas: PartidasDuelos});
            util.log('chamou Função do Cliente e status e igual a ' + PartidasDuelos[numero_da_sala].status);
        } else {
            util.log('cliente Guest fez a confirmação de inicio de duelo...');
        }

    }

    function inciarGame(idDaSala) {

        if (idDaSala != undefined) {
            var pontosIniciais = SalasDeDuelos[idDaSala].pontosIni;
            var modalidade = SalasDeDuelos[idDaSala].modalidade;
            var clienteGuest = SalasDeDuelos[idDaSala].clienteGuest;
            var clienteHost = SalasDeDuelos[idDaSala].clienteHost;
            var numeroDaPartida = (PartidasDuelos.length + 1);

            console.log('cliente numero ' + clienteHost + ' e cliente numero ' + clienteGuest + ' da sala numero ' + idDaSala);

            util.log('atributos da sala recuperados para passar para a partida!');

            var partida = {
                id: numeroDaPartida,
                lps: pontosIniciais,
                modalidade: modalidade,
                status: 3,
                deckHost: 0,
                deckGuest: 0,
                clienteGuest: clienteGuest,
                clienteHost: clienteHost
            }

            util.log('Partida criada!!');

            PartidasDuelos.push(partida);

            util.log('Partida inserida no array de partidas');

            util.log('Sala ' + idDaSala + ' sendo removida...');
            SalasDeDuelos.splice(idDaSala, 1);

            util.log('Sala removida!!!');


            if (identificarPartidaDoCliente(clienteHost) != undefined) {

                util.log('Você entrou na partida ' + identificarPartidaDoCliente(clienteHost) + ', a sala ja não existe mais.');

                montarDeck(clienteGuest);
                montarDeck(clienteHost);
            }

        }

    }

    /*************************************************************************************
     FUNÇÃO DESCONNECÇÃO DO CLIENTE
     **************************************************************************************
     @VARIAVEIS
     * clienteDesconectado = id da conexão do jogador socket
     * nClienteDesconectado = posição do cliente
     * nomeDoCliente = mensagem de desconecção do cliente
     @PARAMETROS
     * data = contém todos os valores passados através da função pelo cliente.
     @FUNÇÕES
     * verifica se a posição do cliente foi definida
     * se foi definida atribui a mensagem ao cliente desconectado!
     * se não foi atribuida atribui uma mensagem de desconhecido.
     * remove o cliente do array de clientes
     * atualiza a lista de clientes conectados
     ************************************************************************************/
    function desconectarCliente(data) {

        var clienteDesconectado = servidor.id;
        var nClienteDesconectado = identificarCliente(clienteDesconectado);


        if (nClienteDesconectado != undefined) {
            var nomeDoCliente = clientesOnline[nClienteDesconectado].nome;
            var idDoCliente = clientesOnline[nClienteDesconectado].id;


            var nDaSala = identificarSalaDoCliente(idDoCliente);
            var nDaPartida = identificarPartidaDoCliente(idDoCliente);

            if (nDaSala != undefined) {


                var statusDaSala = SalasDeDuelos[nDaSala].status;
                var nomeDaSala = SalasDeDuelos[nDaSala].nomeDSala;
                var ClienteHostDaSala = SalasDeDuelos[nDaSala].clienteHost;
                var ClienteGuestDaSala = SalasDeDuelos[nDaSala].clienteGuest;


                console.log("Sala de numero " + nDaSala);

                if (statusDaSala == 0) {

                    if (idDoCliente == ClienteHostDaSala) {
                        SalasDeDuelos.splice(nDaSala, 1);
                        console.log("Sala removida");
                    } else {
                        ClienteGuestDaSala = 0;
                        console.log("Cliente Guest Saiu da sala " + nomeDaSala);
                    }

                } else if (statusDaSala == 1) {

                    if ((idDoCliente == ClienteHostDaSala) || (idDoCliente == ClienteGuestDaSala)) {
                        SalasDeDuelos.splice(nDaSala, 1);
                        console.log("Sala removida");

                        if (idDoCliente == ClienteHostDaSala) {
                            var sujeitoRedirecionado = ClienteGuestDaSala;
                            console.log("Guest redirecionado da sala");
                        } else if (idDoCliente == ClienteGuestDaSala) {
                            var sujeitoRedirecionado = ClienteHostDaSala;
                            console.log("Host redirecionado da sala");
                        }


                        servidor.broadcast.emit('rediceionarPorDeconexaoDeSala', {
                            pagina: 'http://portalyugioh.com.br/conta/home/salas',
                            oponente: sujeitoRedirecionado
                        })
                    }

                }

            } else {
                util.log("Não esta em nenhuma sala");
                if (nDaPartida != undefined) {
                    var statusDaPartida = PartidasDuelos[nDaPartida].status;
                    var ClienteHostDaPartida = PartidasDuelos[nDaPartida].clienteHost;
                    var ClienteGuestDaPartida = PartidasDuelos[nDaPartida].clienteGuest;


                    if (statusDaPartida == 7) {

                        PartidasDuelos.splice(nDaPartida, 1);
                        util.log("Partida de Duelo Removida");


                        if (idDoCliente == ClienteHostDaPartida) {
                            var sujeitoRedirecionado = ClienteGuestDaPartida;
                            console.log("Guest redirecionado da sala");
                        } else if (idDoCliente == ClienteGuestDaPartida) {
                            var sujeitoRedirecionado = ClienteHostDaPartida;
                            console.log("Host redirecionado da sala");
                        }


                        servidor.broadcast.emit('rediceionarPorDeconexaoDeSala', {
                            pagina: 'http://portalyugioh.com.br/jogo/1.0/conta.php?pagina=salas',
                            oponente: sujeitoRedirecionado
                        });


                    } else {

                        util.log("Partida com status insuficiente " + statusDaPartida);

                    }

                } else {
                    util.log("também não esta em um duelo ou partida.");
                }
            }


            limpar_conversa();
            console.log(nomeDoCliente + " se desconectou! [" + idDoCliente + "]");
            if (nClienteDesconectado > -1) {
                clientesOnline.splice(nClienteDesconectado, 1);
            }
            notificarWebChat(nomeDoCliente + " se desconectou!");
            listarClientesConectados();

        } else {
            console.log("Visitante se desconectou!");
        }

    }

    function limpar_conversa() {

        var clienteLimparLog = servidor.id;
        var nClienteLimparLog = identificarCliente(clienteLimparLog);

        for (var i = 0; i < MsgsConversas.length; i++) {
            if (MsgsConversas[i].idCliente == clientesOnline[nClienteLimparLog].id) {
                //MsgsConversas.splice(i, 1);
                MsgsConversas.length = 0;
            }
        }


    }


});