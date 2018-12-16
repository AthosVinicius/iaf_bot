<?php require_once('conexao.php');


mysqli_query($conn, "SET NAMES 'utf8'");
mysqli_query($conn, 'SET character_set_connection=utf8');
mysqli_query($conn, 'SET character_set_client=utf8');
mysqli_query($conn, 'SET character_set_results=utf8');

$funcao_res = (int)$_POST['funcao_ch'];

if (isset($_POST['pagina'])) {
    $pagina_res = addslashes($_POST['pagina']);
} else {
    $pagina_res = "";
}
if (isset($_POST['param1'])) {
    $parametro1 = addslashes($_POST['param1']);
} else {
    $parametro1 = "";
}
if (isset($_POST['param2'])) {
    $parametro2 = addslashes($_POST['param2']);
} else {
    $parametro2 = "";
}
if (isset($_POST['param3'])) {
    $parametro3 = addslashes($_POST['param3']);
} else {
    $parametro3 = "";
}
if (isset($_POST['param4'])) {
    $parametro4 = addslashes($_POST['param4']);
}else {
    $parametro4 = "";
}
if (isset($_POST['param5'])) {
    $parametro5 = addslashes($_POST['param5']);
}else {
    $parametro5 = "";
}
if (isset($_POST['param6'])) {
    $parametro6 = addslashes($_POST['param6']);
}else {
    $parametro6 = "";
}

switch ($funcao_res) {
    case 1:
        //mysqli_set_charset($conn,'utf8');
        $inserir_regs = mysqli_query($conn, "INSERT INTO frases_cadastradas (frase, tags, humor, data, pet)VALUES('" . $parametro1 . "','" . $parametro2 . "', 0, '" . $hoje_completo . "', '" . $parametro3 . "')") or die (mysqli_error($conn));

        if ($inserir_regs) {
            ?>
            Incluindo...<br/>
            <img src="http://www.cds-software.com.br/wp-content/themes/twentytwelve/img/loading.gif"/>

        <?php } else {

            echo "Erro ao incluir registro.";

        }


        break;

    case 2:

        $lista_de_falas = mysqli_query($conn, "SELECT * FROM frases_cadastradas WHERE  pet = '" . $parametro1 . "' order by id desc LIMIT 10") or die (mysqli_error($conn));
        ?>

        <div id="box_falas">
            <?php
            while ($frase = mysqli_fetch_assoc($lista_de_falas)) {
                ?>
                <div class="li_falas">
                    <table border="2" width="90%">
                        <tr>
                            <td width="50%" bgcolor="#006699">
                                <?php echo $frase['tags']; ?>                        </td>
                            <td width="50%" bgcolor="#009933">
                                <?php echo $frase['frase']; ?>                        </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="cmd_frase" align="center">
                                <?php echo date('d/m/Y H:i:s', strtotime($frase['data'])); ?> <a
                                        href="?pg=alterar_frase&frase=<?php echo $frase['id']; ?>">Alterar</a> - - <a
                                        href="#"
                                        onclick="del_fala(<?php echo $frase['id']; ?>,<?php echo $parametro1; ?>);">Deletar</a>
                            </td>
                        </tr>
                    </table>
                    <br/><br/>
                </div>
            <?php } ?>
        </div>


        <?php
        break;

    case 3:
        //mysqli_set_charset($conn,'utf8');
        $atualizar_regs = mysqli_query($conn, "UPDATE `frases_cadastradas` SET  `tags` = '" . $parametro2 . "', frase = '" . $parametro1 . "' WHERE  `id` =" . $parametro3 . "") or die (mysqli_error($conn));

        if ($atualizar_regs) {
            ?>
            Alterando...<br/>
            <img src="http://www.cds-software.com.br/wp-content/themes/twentytwelve/img/loading.gif"/>

        <?php } else {

            echo "Erro ao alterar registro.";

        }


        break;

    case 4:
        //mysqli_set_charset($conn,'utf8');
        $del_regs = mysqli_query($conn, "DELETE FROM `frases_cadastradas` WHERE `id` =" . $parametro1 . "") or die (mysqli_error($conn));

        if ($del_regs) {
            ?>
            Deletando...<br/>
            <img src="http://www.cds-software.com.br/wp-content/themes/twentytwelve/img/loading.gif"/>

        <?php } else {

            echo "Erro ao deletar registro.";

        }


        break;

    case 5:
        //mysqli_set_charset($conn,'utf8');
        $inserir_regs = mysqli_query($conn, "INSERT INTO frases_cadastradas (frase, tags, humor, data, pet)VALUES('" . $parametro1 . "','" . $parametro2 . "', 0, '" . $hoje_completo . "', '" . $parametro3 . "')") or die (mysqli_error($conn));

        if ($inserir_regs) {
            ?>
            <script>

                var msg_temp = 'Obrigado por me ensinar, agora quando me perguntar saberei oque responder! \n\n\n <img src="https://assets.github.com/images/icons/emoji/smile.png" width="30" />';

                msg_personalizada(pet_nome, msg_temp);

            </script>

        <?php } else {

            echo "Erro ao ensinar.";

        }


        break;

    case 6:

        if (isset($parametro1)) {

            if ($parametro1 != "" || !empty($parametro1)) {

                if ($parametro2 != "" || !empty($parametro2)) {

                    $validar_login = mysqli_query($conn, "SELECT count(id) AS validarAcesso, id, nick, login, senha FROM cadastro WHERE login = '" . $parametro1 . "' and senha = '" . $parametro2 . "'") or die (mysqli_error($conn));

                    $validar_login = mysqli_fetch_assoc($validar_login);

                } else {
                    echo "Login invalido";
                }

            } else {
                echo "Login invalido";
            }


            if ($validar_login[validarAcesso] > 0) {

                $_SESSION['login'] = $validar_login['login'];
                $_SESSION['senha'] = $validar_login['senha'];
                $_SESSION['id'] = $validar_login['id'];
                $_SESSION['nick'] = $validar_login['nick'];

                echo "<script language= \"JavaScript\">
										location.href=\"index.php\"
										</script>";
            } else {
                echo "Login inValido!";
            }
        }


        break;


}

?>