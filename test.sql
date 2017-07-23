/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50624
Source Host           : localhost:3306
Source Database       : test

Target Server Type    : MYSQL
Target Server Version : 50624
File Encoding         : 65001

Date: 2017-07-22 22:40:43
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `php_students`
-- ----------------------------
DROP TABLE IF EXISTS `php_students`;
CREATE TABLE `php_students` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL,
  `class` int(2) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of php_students
-- ----------------------------
INSERT INTO `php_students` VALUES ('1', 'wang', '1', '21', '1');
INSERT INTO `php_students` VALUES ('2', 'chen', '2', '21', '0');
INSERT INTO `php_students` VALUES ('3', 'tan', '1', '22', '0');
INSERT INTO `php_students` VALUES ('4', 'lu', '3', '21', '1');
INSERT INTO `php_students` VALUES ('5', 'wu', '1', '20', '0');
INSERT INTO `php_students` VALUES ('6', 'qian', '2', '21', '1');

-- ----------------------------
-- Table structure for `tb1`
-- ----------------------------
DROP TABLE IF EXISTS `tb1`;
CREATE TABLE `tb1` (
  `id` tinyint(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of tb1
-- ----------------------------
