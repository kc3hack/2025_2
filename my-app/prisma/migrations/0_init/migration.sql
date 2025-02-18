-- CreateTable
CREATE TABLE `db`.`UserTable` (`EmailAdd` VARCHAR(30) NOT NULL , `UserName` VARCHAR(30) NOT NULL , PRIMARY KEY (`EmailAdd`)) ENGINE = InnoDB;
-- CreateTable
CREATE TABLE `db`.`CollectionTable` (`CollectionID` INT NOT NULL AUTO_INCREMENT , `EmailAdd` VARCHAR(30) NOT NULL , `MusicID` VARCHAR(30) NOT NULL , `Unlocked` DATETIME NOT NULL , PRIMARY KEY (`CollectionID`)) ENGINE = InnoDB;
-- CreateTable
CREATE TABLE `db`.`MusicTable` (`MusicID` VARCHAR(30) NOT NULL , `MusicName` VARCHAR(30) NOT NULL , `ArtistName` VARCHAR(30) NOT NULL , PRIMARY KEY (`MusicID`)) ENGINE = InnoDB;