/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50553
Source Host           : localhost:3306
Source Database       : dongnao

Target Server Type    : MYSQL
Target Server Version : 50553
File Encoding         : 65001

Date: 2017-07-10 16:38:14
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `comments`
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES ('1', 'ryan老师加油', '2017-06-27 18:04:21', '2017-06-27 18:04:23', '2', '1');
INSERT INTO `comments` VALUES ('2', 'ryan老师好好上课', '2017-06-27 18:04:51', '2017-06-27 18:04:53', '3', '1');
INSERT INTO `comments` VALUES ('3', 'hello', '2017-06-28 13:32:00', '2017-06-28 13:32:02', '5', '3');
INSERT INTO `comments` VALUES ('4', '宋老师好厉害', '2017-07-06 13:51:37', '2017-07-06 13:51:39', '1', '2');
INSERT INTO `comments` VALUES ('5', '来上课哦', '2017-07-06 13:52:32', '2017-07-06 13:52:33', '4', '3');
INSERT INTO `comments` VALUES ('6', 'star老师好厉害', '2017-07-06 13:54:42', '2017-07-06 13:54:44', '1', '5');
INSERT INTO `comments` VALUES ('7', 'star老师厉害了', '2017-07-06 13:55:13', '2017-07-06 13:55:15', '2', '6');
INSERT INTO `comments` VALUES ('8', '很好', '2017-07-06 13:56:57', '2017-07-06 13:56:59', '1', '8');
INSERT INTO `comments` VALUES ('9', '哟呵', '2017-07-06 13:57:30', '2017-07-06 13:57:33', '2', '9');

-- ----------------------------
-- Table structure for `posts`
-- ----------------------------
DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `authorId` varchar(255) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of posts
-- ----------------------------
INSERT INTO `posts` VALUES ('1', 'ryan老师补课', 'node.js补课', null, '', '0', '2017-06-21 13:20:31', '2017-06-21 13:20:33', '1');
INSERT INTO `posts` VALUES ('2', '宋老师架构师课程开课了', '想当架构师的来', null, null, '0', '2017-06-21 13:21:16', '2017-06-21 13:21:17', '3');
INSERT INTO `posts` VALUES ('3', '第一次补课', '干货多多啊', null, null, '0', '2017-06-21 05:23:08', '2017-06-21 05:23:08', '1');
INSERT INTO `posts` VALUES ('4', '今天有课哦', '来上课哦哦', null, null, '0', '2017-06-21 06:52:47', '2017-06-21 06:52:47', '1');
INSERT INTO `posts` VALUES ('5', '接手高级UI', 'createjs玩的可6啦', null, null, '0', '2017-06-22 01:57:03', '2017-06-22 01:57:03', '2');
INSERT INTO `posts` VALUES ('6', '接手高级ui', 'createjs玩的可6啦~~~', null, null, '0', '2017-06-22 01:58:17', '2017-06-22 01:58:17', '2');
INSERT INTO `posts` VALUES ('7', '我是精壮的成年男子~~~', '我是动脑第一美男', null, null, '0', '2017-06-22 02:04:00', '2017-06-22 02:04:00', '2');
INSERT INTO `posts` VALUES ('8', '我是小妮', '阳阳是你们班主任', null, null, '0', '2017-06-22 09:47:46', '2017-06-22 09:47:46', '5');
INSERT INTO `posts` VALUES ('9', '我是你们班主任', '其实我是程序媛', null, null, '0', '2017-06-22 09:49:09', '2017-06-22 09:49:09', '4');

-- ----------------------------
-- Table structure for `relations`
-- ----------------------------
DROP TABLE IF EXISTS `relations`;
CREATE TABLE `relations` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) NOT NULL DEFAULT '0',
  `friendId` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`userId`,`friendId`),
  KEY `friendId` (`friendId`),
  CONSTRAINT `relations_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `relations_ibfk_2` FOREIGN KEY (`friendId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of relations
-- ----------------------------
INSERT INTO `relations` VALUES ('2017-06-21 13:17:59', '2017-06-21 13:18:00', '1', '2');
INSERT INTO `relations` VALUES ('2017-06-22 09:35:37', '2017-06-22 09:35:37', '1', '3');
INSERT INTO `relations` VALUES ('2017-06-22 17:21:21', '2017-06-22 17:21:21', '1', '4');
INSERT INTO `relations` VALUES ('2017-06-22 09:44:14', '2017-06-22 09:44:14', '2', '4');
INSERT INTO `relations` VALUES ('2017-06-21 13:19:19', '2017-06-21 13:19:20', '2', '5');
INSERT INTO `relations` VALUES ('2017-06-22 17:15:34', '2017-06-22 17:15:36', '3', '2');
INSERT INTO `relations` VALUES ('2017-06-22 16:49:24', '2017-06-22 16:49:25', '4', '3');
INSERT INTO `relations` VALUES ('2017-06-30 09:29:05', '2017-06-30 09:29:05', '5', '1');
INSERT INTO `relations` VALUES ('2017-06-22 09:44:43', '2017-06-22 09:44:43', '5', '3');
INSERT INTO `relations` VALUES ('2017-06-22 09:48:17', '2017-06-22 09:48:17', '5', '4');

-- ----------------------------
-- Table structure for `replies`
-- ----------------------------
DROP TABLE IF EXISTS `replies`;
CREATE TABLE `replies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `commentId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commentId` (`commentId`),
  CONSTRAINT `replies_ibfk_1` FOREIGN KEY (`commentId`) REFERENCES `comments` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of replies
-- ----------------------------
INSERT INTO `replies` VALUES ('1', '谢谢', '2017-06-27 18:05:38', '2017-06-27 18:05:39', '1');
INSERT INTO `replies` VALUES ('2', '加油', '2017-06-27 18:05:48', '2017-06-27 18:05:49', '2');
INSERT INTO `replies` VALUES ('3', '好好上课', '2017-06-28 16:01:41', '2017-06-28 16:01:44', '3');

-- ----------------------------
-- Table structure for `requests`
-- ----------------------------
DROP TABLE IF EXISTS `requests`;
CREATE TABLE `requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `respone` varchar(255) DEFAULT NULL,
  `read` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `fromId` int(11) DEFAULT NULL,
  `toId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fromId` (`fromId`),
  KEY `toId` (`toId`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`fromId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`toId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of requests
-- ----------------------------

-- ----------------------------
-- Table structure for `stars`
-- ----------------------------
DROP TABLE IF EXISTS `stars`;
CREATE TABLE `stars` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `postId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userId` (`userId`),
  KEY `postId` (`postId`),
  CONSTRAINT `stars_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `stars_ibfk_2` FOREIGN KEY (`postId`) REFERENCES `posts` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of stars
-- ----------------------------
INSERT INTO `stars` VALUES ('1', '2017-06-28 11:04:54', '2017-06-28 11:04:56', '5', '1');
INSERT INTO `stars` VALUES ('2', '2017-06-28 11:10:07', '2017-06-28 11:10:10', '2', '1');
INSERT INTO `stars` VALUES ('3', '2017-07-06 14:02:52', '2017-07-06 14:02:51', '1', '2');
INSERT INTO `stars` VALUES ('4', '2017-07-06 14:03:02', '2017-07-06 14:03:02', '3', '2');
INSERT INTO `stars` VALUES ('5', '2017-07-06 14:03:14', '2017-07-06 14:03:15', '2', '5');
INSERT INTO `stars` VALUES ('6', '2017-07-06 14:03:29', '2017-07-06 14:03:30', '5', '6');
INSERT INTO `stars` VALUES ('7', '2017-07-06 14:04:01', '2017-07-06 14:04:03', '5', '7');
INSERT INTO `stars` VALUES ('8', '2017-07-06 14:04:39', '2017-07-06 14:04:40', '1', '8');
INSERT INTO `stars` VALUES ('9', '2017-07-06 14:04:51', '2017-07-06 14:04:52', '2', '9');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'ryan', 'ryan', 'ryan123', '14990602695471.jpg', '2017-06-21 13:14:09', '2017-06-21 13:14:10');
INSERT INTO `users` VALUES ('2', 'star', 'star', 'star123', '14990467316122.jpg', '2017-06-21 13:15:31', '2017-06-21 13:15:32');
INSERT INTO `users` VALUES ('3', 'song', '老宋', 'song123', '14990467383973.jpg', '2017-06-21 13:15:54', '2017-06-21 13:15:55');
INSERT INTO `users` VALUES ('4', 'yangyang', '阳阳', 'yangyang123', '14990467483484.jpg', '2017-06-21 13:16:36', '2017-06-21 13:16:38');
INSERT INTO `users` VALUES ('5', 'xiaoni', '小妮', 'xiaoni123', '14990467555055.jpg', '2017-06-21 13:16:56', '2017-06-21 13:16:58');
