CREATE TABLE `UseCard` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(20) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(80) NULL,
  `mediaUrl` VARCHAR(500) NULL,
  `altText` VARCHAR(255) NULL,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `UseCard_sortOrder_id_idx` (`sortOrder`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
