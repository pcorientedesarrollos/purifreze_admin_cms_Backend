CREATE TABLE `ContentSection` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `key` VARCHAR(80) NOT NULL,
  `label` VARCHAR(120) NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `content` JSON NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `ContentSection_key_key` (`key`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
