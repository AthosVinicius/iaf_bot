-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 16-Dez-2018 às 22:26
-- Versão do servidor: 5.7.19
-- PHP Version: 7.1.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iaf`
--
CREATE DATABASE IF NOT EXISTS `iaf` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `iaf`;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cadastro`
--

DROP TABLE IF EXISTS `cadastro`;
CREATE TABLE IF NOT EXISTS `cadastro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nick` varchar(50) NOT NULL,
  `pet_nome` varchar(50) NOT NULL,
  `avatar1` varchar(255) NOT NULL,
  `avatar2` varchar(255) NOT NULL,
  `avatar3` varchar(255) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `cadastro`
--

INSERT INTO `cadastro` (`id`, `nick`, `pet_nome`, `avatar1`, `avatar2`, `avatar3`, `login`, `senha`) VALUES
(1, 'Athos', 'Jéssica', 'avatar1.gif', 'avatar2.gif', 'avatar3.gif', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Estrutura da tabela `frases`
--

DROP TABLE IF EXISTS `frases`;
CREATE TABLE IF NOT EXISTS `frases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `qtd_vx` int(11) NOT NULL DEFAULT '0',
  `frase` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `usuario` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `frases`
--

INSERT INTO `frases` (`id`, `qtd_vx`, `frase`, `status`, `usuario`) VALUES
(1, 11, 'teste', 1, 1),
(2, 1, 'Oi', 2, 1),
(3, 0, 'Horas', 0, 1),
(4, 1, 'Jessica', 3, 1),
(5, 0, ' vários microfone', 0, 1),
(6, 0, ' não acredito', 0, 1),
(7, 0, ' e ele vai me ouvir sem parar', 0, 1),
(8, 0, ' tá poxa', 0, 1),
(9, 0, 'Aracaju', 0, 1),
(10, 3, ' teste', 1, 1),
(11, 1, ' oi', 2, 1),
(12, 3, ' boa noite', 4, 1),
(13, 3, ' hibernar', 5, 1),
(14, 0, ' cancelar', 0, 1),
(15, 1, ' Olá', 0, 1),
(16, 0, ' teste teste teste', 0, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `frases_cadastradas`
--

DROP TABLE IF EXISTS `frases_cadastradas`;
CREATE TABLE IF NOT EXISTS `frases_cadastradas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `frase` varchar(255) NOT NULL,
  `humor` int(11) NOT NULL,
  `data` datetime NOT NULL,
  `pet` int(11) NOT NULL,
  `tags` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `frases_cadastradas`
--

INSERT INTO `frases_cadastradas` (`id`, `frase`, `humor`, `data`, `pet`, `tags`) VALUES
(1, 'Testado!', 0, '2018-12-16 19:02:36', 1, 'teste'),
(2, 'Olá!', 0, '2018-12-16 19:07:35', 1, 'Oi'),
(3, 'function funcao_exec_user(){\n\nalert(\"teste\");\n\n}', 0, '2018-12-16 19:08:41', 1, 'Jessica'),
(4, 'Boa noite!', 0, '2018-12-16 19:16:04', 1, ' boa noite'),
(5, 'function funcao_exec_user(){\n\nalterar_disponi2();\n\n}', 0, '2018-12-16 19:17:39', 1, ' hibernar');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
