<?php 
if($_SESSION['id'] == "" || empty($_SESSION['id'])){
	header("Location: http://nexpy.com.br/login");		
}