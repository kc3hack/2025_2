-- CreateTable
CREATE TABLE `UserTable` (
    `EmailAdd` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserTable_EmailAdd_key`(`EmailAdd`),
    PRIMARY KEY (`EmailAdd`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
