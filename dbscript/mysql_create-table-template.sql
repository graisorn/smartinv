CREATE TABLE IF NOT EXISTS `smartinvdb`.`products`(  
    `ProductID` INT AUTO_INCREMENT ,
    `CategoryID` INT,
    `ProductName` VARCHAR(50),
    `UnitPrice` DECIMAL(18,2),
    `ProductPicture` VARCHAR(255),
    `UnitStock` INT,
    `create_time` DATETIME,
    `update_time` DATETIME,
     PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB  AUTO_INCREMENT=1 DEFAULT CHARSET = utf8 ;