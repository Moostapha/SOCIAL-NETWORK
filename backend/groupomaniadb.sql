-- GROUPOMANIA DATABASE --


-- SQL table users --
CREATE TABLE IF NOT EXISTS `groupomania`.`users` (
    `userID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'clé primaire userID users du réseau',
    `username` varchar(255) NOT NULL COMMENT 'form signup frontend',
    `email` varchar(255) NOT NULL COMMENT 'form signup frontend',
    `password` varchar(255) NOT NULL COMMENT 'form signup frontend sécurisé',
    `avatar` varchar(255) NOT NULL DEFAULT 'http://localhost:3000/images/avatar/user_avatar_default.png' COMMENT 'URL fichier img user',
    `is_admin` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'statut administrateur 1 | statut user standard 0',
    `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8



-- SQL table posts --
CREATE TABLE IF NOT EXISTS `groupomania`.`posts` (
 `postID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id clé primaire des posts postID',
 `id_user_auteur_post` int(11) NOT NULL COMMENT 'id de l''auteur du post userID clé fk',
 `username` varchar(255) NOT NULL,
 `contentPost` varchar(255) NOT NULL COMMENT 'Texte du post',
 `imagePost` varchar(255) DEFAULT NULL COMMENT 'Fichier image du post (jpg,jpeg,png,gif acceptés)',
 `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
 PRIMARY KEY (`postID`),
 KEY `fk_userID_auteur_du_post` (`id_user_auteur_post`),
 CONSTRAINT `fk_userID_auteur_du_post` FOREIGN KEY (`id_user_auteur_post`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8



-- SQL table commentaires --
CREATE TABLE IF NOT EXISTS `groupomania`.`comments` (
 `commentID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Clé primaire id du commentaire fait par userIDauteur',
 `id_post_commented` int(11) NOT NULL COMMENT 'clé fk id du post commenté',
 `id_user_auteur_comment` int(11) NOT NULL COMMENT 'clé fk auteur du commentaire userID',
 `username` varchar(255) NOT NULL COMMENT 'nom auteur user du commentaire',
 `contentComment` varchar(255) NOT NULL COMMENT 'Contenu du commentaire',
 `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
 `status` tinyint(1) NOT NULL DEFAULT 0,
 PRIMARY KEY (`commentID`),
 KEY `fk_userID_auteur_du_commentaire` (`id_user_auteur_comment`),
 KEY `fk_postID_du_post_commented` (`id_post_commented`),
 CONSTRAINT `fk_postID_du_post_commented` FOREIGN KEY (`id_post_commented`) REFERENCES `posts` (`postID`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_userID_auteur_du_commentaire` FOREIGN KEY (`id_user_auteur_comment`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='Commentaires des utilisateurs sur les posts du réseau social'



-- SQL table réactions --
CREATE TABLE IF NOT EXISTS `groupomania`.`reactions` (
 `reactionID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'clé primaire table reactions',
 `id_post_reacted` int(11) NOT NULL COMMENT 'post objet de la réaction',
 `id_user_auteur_reaction` int(11) NOT NULL COMMENT 'user réagissant à un post',
 `like` int(11) NOT NULL DEFAULT 0 COMMENT 'like du post 0 par défaut et 1 quand like sur post effectué',
 `dislike` int(11) NOT NULL DEFAULT 0 COMMENT 'dislike du post 0 par défaut et 1 quand dislike sur post effectué',
 `date_creation` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'date de création de la réaction sur post',
 PRIMARY KEY (`reactionID`),
 KEY `fk_userID_qui_réagit_au_post` (`id_user_auteur_reaction`),
 KEY `fk_postID_objet_reaction` (`id_post_reacted`),
 CONSTRAINT `fk_postID_objet_reaction` FOREIGN KEY (`id_post_reacted`) REFERENCES `posts` (`postID`) ON DELETE CASCADE ON UPDATE CASCADE,
 CONSTRAINT `fk_userID_qui_réagit_au_post` FOREIGN KEY (`id_user_auteur_reaction`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4