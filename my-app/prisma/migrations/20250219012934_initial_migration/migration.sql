/*
  Warnings:

  - Added the required column `Duration` to the `MusicTable` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MusicTable` ADD COLUMN `Duration` INTEGER NOT NULL;
