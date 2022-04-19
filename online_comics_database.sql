DROP DATABASE IF EXISTS `online_comics`;
CREATE DATABASE `online_comics`;
USE `online_comics`;

DROP TABLE IF EXISTS `comics`;
CREATE TABLE `comics`(
	`c_ID` INT NOT NULL AUTO_INCREMENT,
	`c_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    `c_Status` INT NOT NULL,
	`c_UploadDate` DATETIME NOT NULL,
    `c_Likes` INT NOT NULL,
    `c_Follows` INT NOT NULL,
    `c_Description` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `a_ID` INT NOT NULL,
    PRIMARY KEY (`c_ID`) USING BTREE,
    FOREIGN KEY (`a_ID`) REFERENCES `authors`(`a_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `comics` WRITE;
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`, `c_UploadDate`)
 VALUES('Solo Leveling', -1, 600, 50, 'sung jin-woo from trash to hero!', 1, "2022-04-10" );
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('One Piece', 1, 500, 200, 'luffy et al fuck World gov!', 2, "2022-04-09");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`)
 VALUES('Dragon Ball', -1, 500, 30, 'monkey d goku', 3, "2022-04-08");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('The Beginning After The End', 1, 800, 600, 'a king returns in another world!', 4, "2022-04-07");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('One Punch Man', 1, 1000, 800, 'main antagonish - saitama', 5, "2022-04-06");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('Naruto', -1, 1000, 100, 'thongassthanchuong', 6, "2022-04-05");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`)
 VALUES('Kimetsu No Yaiba', -1, 4999, 1999, 'slash the fricking head', 7, "2022-04-04");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('Nanatsu No Taizai', -1, 1000, 200, 'king of dark xxx angel of light', 8, "2022-04-03");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`)
 VALUES('Sono Bisque Doll Wa Koi Wo Suru', 1, 888, 696, 'tailor x gyaru', 9, "2022-04-02");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('Detective Conan', 1, 500, 800, '1 year or 20 years, lol', 10, "2022-04-01");
INSERT INTO `comics`(`c_Name`, `c_Status`, `c_Likes`, `c_Follows`, `c_Description`, `a_ID`,`c_UploadDate`) 
VALUES('Attack On Titan', 1, 100, 2000, 'big bois in coming', 11, "2022-04-10");
UNLOCK TABLES;

DROP TABLE IF EXISTS `comic_suffixes`;
CREATE TABLE `comic_suffixes`(
	`cs_ID` INT NOT NULL AUTO_INCREMENT,
    `c_ID` INT NOT NULL,
    `cs_Suffix` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`cs_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
CREATE INDEX `cs_Suffix_idx` ON `comic_suffixes`(`cs_Suffix`);

DROP PROCEDURE IF EXISTS insert_suffixes;
DELIMITER ;;
CREATE PROCEDURE insert_suffixes()
BEGIN
  DECLARE comic_id INT DEFAULT 0;
  DECLARE n INT DEFAULT 0;
  DECLARE comic_name_length INT DEFAULT 0;
  DECLARE iterator INT DEFAULT 0;
  DECLARE substr VARCHAR(64);
  DECLARE comic_name VARCHAR(64);
  SELECT COUNT(*) FROM `comics` INTO n;
  SET comic_id = 1;
  
  WHILE comic_id <= n DO
	SELECT LENGTH(`c_Name`) FROM `comics` WHERE `c_ID` = comic_id INTO comic_name_length;
    SELECT `c_Name` FROM `comics` WHERE `c_ID` = comic_id INTO comic_name;
    SET iterator = 1;
    WHILE iterator <= comic_name_length DO
		SET substr = SUBSTRING(comic_name, iterator, comic_name_length - iterator + 1);
		INSERT INTO `comic_suffixes`(`c_ID`,`cs_Suffix`) VALUES(comic_id, substr);
        SET iterator = iterator + 1;
	END WHILE;
    SET comic_id = comic_id + 1;
  END WHILE;
END;
;;
DELIMITER ;

CALL insert_suffixes();

DROP TABLE IF EXISTS `views`;
CREATE TABLE `views`(
	`v_ID` INT NOT NULL AUTO_INCREMENT,
    `v_Date` DATE NOT NULL,
    `c_ID` INT NOT NULL,
    `v_Views` INT NOT NULL,
    PRIMARY KEY (`v_ID`) USING BTREE,
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `views` WRITE;
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 1, 1000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 2, 2000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 3, 3000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 4, 500);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 5, 6700);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 6, 7000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 7, 2000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 8, 1000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 9, 800);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 10, 99000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(SUBDATE(CURDATE(), 1), 1, 3000);
INSERT INTO `views`(`v_Date`, `c_ID`, `v_Views`) VALUES(CURDATE(), 11, 2000);
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
INSERT INTO `authors`(`a_Name`) VALUES('Hajime Isayama');
UNLOCK TABLES;

DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags`(
	`t_ID` INT NOT NULL AUTO_INCREMENT,
    `t_Name` VARCHAR(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
    PRIMARY KEY (`t_ID`) USING BTREE
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `tags` WRITE;
INSERT INTO `tags`(`t_Name`) VALUES ('Action');
INSERT INTO `tags`(`t_Name`) VALUES ('Adventure');
INSERT INTO `tags`(`t_Name`) VALUES ('Adult');
INSERT INTO `tags`(`t_Name`) VALUES ('Comedy');
INSERT INTO `tags`(`t_Name`) VALUES ('Ecchi');
INSERT INTO `tags`(`t_Name`) VALUES ('Isekai');
INSERT INTO `tags`(`t_Name`) VALUES ('Magic');
INSERT INTO `tags`(`t_Name`) VALUES ('Slice of life');
INSERT INTO `tags`(`t_Name`) VALUES ('Supernatural');
INSERT INTO `tags`(`t_Name`) VALUES ('Webtoon');
INSERT INTO `tags`(`t_Name`) VALUES ('Horror');
INSERT INTO `tags`(`t_Name`) VALUES ('Romance');
INSERT INTO `tags`(`t_Name`) VALUES ('School life');
INSERT INTO `tags`(`t_Name`) VALUES ('Shounen');
INSERT INTO `tags`(`t_Name`) VALUES ('Fantasy');
UNLOCK TABLES;

DROP TABLE IF EXISTS `comic_tag_details`;
CREATE TABLE `comic_tag_details`(
	`ct_ID` INT NOT NULL AUTO_INCREMENT,
    `t_ID` INT NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`ct_ID`) USING BTREE,
    FOREIGN KEY (`t_ID`) REFERENCES `tags`(`t_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `comic_tag_details` WRITE;
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,2);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,2);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,2);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(9,2);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,2);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,2);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,1);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,1);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,1);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,1);


INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,3);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,3);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,3);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(9,3);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,3);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,3);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,4);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,4);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,4);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(6,4);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(10,4);


INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,5);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,5);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,5);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(9,5);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,5);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,5);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,6);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,6);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,6);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(9,6);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,6);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,6);


INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,7);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(12,7);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,7);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,7);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,8);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,8);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,8);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,8);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,8);


INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(12,9);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(8,9);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(13,9);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(2,10);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(4,10);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,10);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,10);

INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(1,11);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(9,11);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(11,11);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(14,11);
INSERT INTO `comic_tag_details`(`t_ID`,`c_ID`) VALUES(15,11);
UNLOCK TABLES;

DROP TABLE IF EXISTS `chapters`;
CREATE TABLE `chapters`(
	`ch_ID` INT NOT NULL AUTO_INCREMENT,
    `ch_No` INT NOT NULL,
    `ch_Name` VARCHAR(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci,
    `ch_Update` DATETIME NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`ch_ID`) USING BTREE,
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `chapters` WRITE;
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 2);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 2);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 2);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 2);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 2);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 1);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 1);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 1);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 1);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 1);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 3);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 3);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 3);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 3);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 3);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 4);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 4);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 4);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 4);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 4);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 5);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 5);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 5);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 5);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 5);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 6);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 6);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 6);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 6);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 6);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 7);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 7);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 7);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 7);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 7);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 8);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 8);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 8);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 8);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 8);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 9);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 9);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 9);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 9);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 9);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 10);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 10);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(3, CURTIME(), 10);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(4, CURTIME(), 10);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(5, CURTIME(), 10);

INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(1, CURTIME(), 11);
INSERT INTO `chapters`(`ch_No`, `ch_Update`, `c_ID`) VALUES(2, CURTIME(), 11);

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
    `u_BanExp` DATETIME,
    `u_IsAdmin` BOOLEAN NOT NULL,
    PRIMARY KEY (`u_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `users` WRITE;
INSERT INTO `users`(`u_Username`, `u_Password`, `u_Email`, `u_Name`, `u_DOB`, 
					`u_IsPublisher`, `u_IsActivated`, `u_IsBanned`, `u_IsAdmin`)
VALUES ('conghuynt1999', '$2a$10$TMpvgTKnJY7rFDdlPwVQoOvgM/vjLu7fNoYNf1G7HkV/0svJMOK2.',
		'conghuynt1999@gmail.com','Huy Nguyen', '1999-07-28',1,1,0,0);
        
INSERT INTO `users`(`u_Username`, `u_Password`, `u_Email`, `u_Name`, `u_DOB`, 
					`u_IsPublisher`, `u_IsActivated`, `u_IsBanned`, `u_IsAdmin`)
VALUES ('conghuynguyentran1999', '$2a$10$TMpvgTKnJY7rFDdlPwVQoOvgM/vjLu7fNoYNf1G7HkV/0svJMOK2.',
		'conghuynguyentran1999@gmail.com','Huy Nguyen', '1999-07-28',0,1,0,0);
        
INSERT INTO `users`(`u_Username`, `u_Password`, `u_Email`, `u_Name`, `u_DOB`, 
			`u_IsPublisher`, `u_IsActivated`, `u_IsBanned`, `u_IsAdmin`)
VALUES ('conghuyawesome1999', '$2a$10$TMpvgTKnJY7rFDdlPwVQoOvgM/vjLu7fNoYNf1G7HkV/0svJMOK2.',
		'conghuyawesome1999@gmail.com','Huy Nguyen', '1999-07-28',0,1,0,0);
        
INSERT INTO `users`(`u_Username`, `u_Password`, `u_Email`, `u_Name`, `u_DOB`, 
					`u_IsPublisher`, `u_IsActivated`, `u_IsBanned`, `u_IsAdmin`)
VALUES ('conghuy', '$2a$10$TMpvgTKnJY7rFDdlPwVQoOvgM/vjLu7fNoYNf1G7HkV/0svJMOK2.',
		'conghuy@gmail.com','Huy Nguyen', '1999-07-28',0,1,0,0);
        
INSERT INTO `users`(`u_Username`, `u_Password`, `u_Email`, `u_Name`, `u_DOB`, 
					`u_IsPublisher`, `u_IsActivated`, `u_IsBanned`, `u_IsAdmin`)
VALUES ('admin', '$2a$10$TMpvgTKnJY7rFDdlPwVQoOvgM/vjLu7fNoYNf1G7HkV/0svJMOK2.',
		'admin@gmail.com','THE BEST ADMIN', '1999-07-28',0,1,0,1);
UNLOCK TABLES;
#
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`(
	`cmt_ID` INT NOT NULL AUTO_INCREMENT,
	`u_ID` INT NOT NULL,
	`ch_ID` INT NOT NULL,
	`cmt_Time` DATETIME NOT NULL,
	`cmt_Text` TEXT CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
	PRIMARY KEY (`cmt_ID`),
	FOREIGN KEY (`ch_ID`) REFERENCES `chapters`(`ch_ID`),
	FOREIGN KEY (`u_ID`) REFERENCES `users`(`u_ID`)	
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `likes`;
CREATE TABLE `likes`(
	`l_ID` INT NOT NULL AUTO_INCREMENT,
    `u_ID` INT NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`l_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`),
    FOREIGN KEY (`u_ID`) REFERENCES `users`(`u_ID`)	
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SELECT c_Likes FROM comics WHERE c_ID = 1;

DROP TABLE IF EXISTS `follows`;
CREATE TABLE `follows`(
	`f_ID` INT NOT NULL AUTO_INCREMENT,
    `u_ID` INT NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`f_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`),
    FOREIGN KEY (`u_ID`) REFERENCES `users`(`u_ID`)	
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`(
	`h_ID` INT NOT NULL AUTO_INCREMENT,
    `c_ID` INT NOT NULL,
    `ch_ID` INT NOT NULL,
    `h_Time` DATETIME NOT NULL,
    `u_ID` INT NOT NULL,
    PRIMARY KEY (`h_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`),
    FOREIGN KEY (`u_ID`) REFERENCES `users`(`u_ID`)	
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `publisher_requests`;
CREATE TABLE `publisher_requests`(
    `u_ID` INT NOT NULL,
    `pr_Time` DATETIME NOT NULL,
    PRIMARY KEY (`u_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

DROP TABLE IF EXISTS `publisher_comics`;
CREATE TABLE IF NOT EXISTS `publisher_comics`(
	`pc_ID` INT NOT NULL AUTO_INCREMENT,
    `u_ID` INT NOT NULL,
    `c_ID` INT NOT NULL,
    PRIMARY KEY (`pc_ID`),
    FOREIGN KEY (`u_ID`) REFERENCES `users`(`u_ID`),
    FOREIGN KEY (`c_ID`) REFERENCES `comics`(`c_ID`)
)ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

LOCK TABLES `publisher_comics` WRITE;
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 10);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 9);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 8);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 7);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 6);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 5);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 4);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 3);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 2);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 1);
INSERT INTO `publisher_comics`(`u_ID`, `c_ID`) VALUES (1, 11);
UNLOCK TABLES;
