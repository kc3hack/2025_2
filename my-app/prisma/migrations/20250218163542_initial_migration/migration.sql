-- CreateTable
CREATE TABLE `UserTable` (
    `EmailAdd` VARCHAR(30) NOT NULL,
    `UserName` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `UserTable_EmailAdd_key`(`EmailAdd`),
    PRIMARY KEY (`EmailAdd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CollectionTable` (
    `CollectionID` INTEGER NOT NULL AUTO_INCREMENT,
    `EmailAdd` VARCHAR(30) NOT NULL,
    `MusicID` VARCHAR(40) NOT NULL,
    `Unlocked` DATETIME(3) NOT NULL,

    PRIMARY KEY (`CollectionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MusicTable` (
    `MusicID` VARCHAR(40) NOT NULL,
    `MusicName` VARCHAR(30) NOT NULL,
    `ArtistName` VARCHAR(30) NOT NULL,
    `ImageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`MusicID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntryTable` (
    `EntryID` INTEGER NOT NULL AUTO_INCREMENT,
    `MusicID` VARCHAR(40) NOT NULL,
    `Latitude` DOUBLE NOT NULL,
    `Longitude` DOUBLE NOT NULL,
    `BlockNo` INTEGER NOT NULL,

    INDEX `BlockNo_index`(`BlockNo`),
    PRIMARY KEY (`EntryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CollectionTable` ADD CONSTRAINT `CollectionTable_EmailAdd_fkey` FOREIGN KEY (`EmailAdd`) REFERENCES `UserTable`(`EmailAdd`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CollectionTable` ADD CONSTRAINT `CollectionTable_MusicID_fkey` FOREIGN KEY (`MusicID`) REFERENCES `MusicTable`(`MusicID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntryTable` ADD CONSTRAINT `EntryTable_MusicID_fkey` FOREIGN KEY (`MusicID`) REFERENCES `MusicTable`(`MusicID`) ON DELETE CASCADE ON UPDATE CASCADE;
