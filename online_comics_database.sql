DROP DATABASE IF EXISTS `online_comics`;
CREATE DATABASE `online_comics`;
USE `online_comics`;

DROP TABLE IF EXISTS `comics`;
CREATE TABLE `comics`(
	`c_ID` INT NOT NULL AUTO_INCREMENT,
	`c_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `c_Status` INT NOT NULL,
    `c_Views` INT NOT NULL,
    `c_Likes` INT NOT NULL,
    `c_Follows` INT NOT NULL,
    `c_Description` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `a_ID` INT NOT NULL,
    PRIMARY KEY (`c_ID`) USING BTREE,
    KEY `fk_comics_authors` (`a_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `comics` WRITE;
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Views`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`) VALUES('Solo Leveling', -1, 900, 600, 50, 'sung jin-woo from trash to hero!', 1 );
INSERT INTO `comics` VALUES('One piece', 1, 1000, 500, 200, 'luffy et al fuck World gov!', 2);
INSERT INTO `comics` VALUES('Dragon Ball', -1, 2000, 500, 30, 'monkey d goku', 3);
INSERT INTO `comics` VALUES('The Beginning After The End', 1, 1500, 800, 600, 'a king returns in another world!', 4);
INSERT INTO `comics` VALUES('One punch man', 1, 3000, 1000, 800, 'main antagonish - saitama', 5);
INSERT INTO `comics` VALUES('Naruto', -1, 2000, 1000, 100, 'thongassthanchuong', 6);
INSERT INTO `comics` VALUES('Kimetsu no yaiba', -1, 9999, 4999, 1999, 'slash the fricking head', 7);
INSERT INTO `comics` VALUES('Nanatsu no taizai', -1, 3000, 1000, 200, 'king of dark xxx angel of light', 8);
INSERT INTO `comics` VALUES('Sono Bisque Doll Wa Koi Wo Suru', 1, 1500, 888, 696, 'tailor x gyaru', 9);
INSERT INTO `comics` VALUES('Detective Conan', 1, 1000, 500, 800, '1 year or 20 years, lol', 10);
UNLOCK TABLES;

DROP TABLE IF EXISTS `authors`;
CREATE TABLE `authors`(
	`a_ID` INT NOT NULL AUTO_INCREMENT,
    `a_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `a_Description` VARCHAR(255)  CHARACTER SET utf8 COLLATE utf8_unicode_ci,
	PRIMARY KEY (`a_ID`) USING BTREE
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `authors` WRITE;
INSERT INTO `authors`(`a_Name`) VALUES('GEE So-Lyung');
INSERT INTO `authors`(`a_Name`) VALUES('Oda');
INSERT INTO `authors`(`a_Name`) VALUES('Akira Toriyama');
INSERT INTO `authors`(`a_Name`) VALUES('TurtleMe');
INSERT INTO `authors`(`a_Name`) VALUES('Murata Yuusuke');
INSERT INTO `authors`(`a_Name`) VALUES('Kishimoto Masashi');
INSERT INTO `authors`(`a_Name`) VALUES('Gotouge Koyoharu');
INSERT INTO `authors`(`a_Name`) VALUES('Suzuki Nakaba');
INSERT INTO `authors`(`a_Name`) VALUES('Fukuda Shinichi');
INSERT INTO `authors`(`a_Name`) VALUES('Aoyama Gōshō');
UNLOCK TABLES;

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`(
	`t_ID` INT NOT NULL AUTO_INCREMENT,
    `t_Name` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`t_ID`) USING BTREE
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `tags` WRITE;
INSERT INTO `tags` VALUES ('Action');
INSERT INTO `tags` VALUES ('Adventure');
INSERT INTO `tags` VALUES ('Adult');
INSERT INTO `tags` VALUES ('Comedy');
INSERT INTO `tags` VALUES ('Ecchi');
INSERT INTO `tags` VALUES ('Isekai');
INSERT INTO `tags` VALUES ('Magic');
INSERT INTO `tags` VALUES ('Slice of life');
INSERT INTO `tags` VALUES ('Supernatural');
INSERT INTO `tags` VALUES ('Webtoon');
INSERT INTO `tags` VALUES ('Horror');
INSERT INTO `tags` VALUES ('Romance');
INSERT INTO `tags` VALUES ('School life');
INSERT INTO `tags` VALUES ('Shounen');
INSERT INTO `tags` VALUES ('Fantasy');
UNLOCK TABLES;

DROP TABLE IF EXISTS `comic_tag_details`;
CREATE TABLE `comic_tag_details`(
	`ct_ID` INT NOT NULL AUTO_INCREMENT,
    `t_ID` INT NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`ct_ID`) USING BTREE,
    KEY `fk_comic_tag_details_tags` (`t_ID`),
    KEY `fk_comic_tag_details_comics` (`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `comic_tag_details` WRITE;

UNLOCK TABLES;

DROP TABLE IF EXISTS `chapters`;
CREATE TABLE `chapters`(
	`ch_ID` INT NOT NULL AUTO_INCREMENT,
    `ch_No` INT NOT NULL,
    `ch_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `ch_Update` DATE NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`ch_ID`) USING BTREE,
    KEY `fk_chapters_comics` (`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `chapters` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`(
	`u_ID` INT NOT NULL AUTO_INCREMENT,
	`u_Username` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
	`u_Password` VARCHAR(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `u_Email` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `u_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `u_DOB` DATE NOT NULL,
    `u_IsPublisher` BOOLEAN NOT NULL,
    `u_IsActivated` BOOLEAN NOT NULL,
    `u_IsBanned` BOOLEAN NOT NULL,
    `u_BanExp` DATE,
    PRIMARY KEY (`u_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins`(
	`a_ID` INT NOT NULL AUTO_INCREMENT,
	`a_Username` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
	`a_Password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `a_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `a_Email` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    PRIMARY KEY (`a_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;