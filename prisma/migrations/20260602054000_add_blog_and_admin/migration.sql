CREATE TABLE `BlogPost` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `coverImageUrl` VARCHAR(500) NULL,
  `blocks` JSON NOT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  `publishedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `BlogPost_slug_key` (`slug`),
  INDEX `BlogPost_status_publishedAt_idx` (`status`, `publishedAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `BlogPostSlugRedirect` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(255) NOT NULL,
  `postId` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `BlogPostSlugRedirect_slug_key` (`slug`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminUser` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(80) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `AdminUser_username_key` (`username`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `BlogPostSlugRedirect`
  ADD CONSTRAINT `BlogPostSlugRedirect_postId_fkey`
  FOREIGN KEY (`postId`) REFERENCES `BlogPost`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
