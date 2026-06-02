-- CreateTable
CREATE TABLE `Testimonial` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `videoUrl` VARCHAR(500) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `label` VARCHAR(255) NOT NULL,
  `featured` BOOLEAN NOT NULL DEFAULT false,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Testimonial_sortOrder_id_idx` (`sortOrder`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Video` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `vertical` BOOLEAN NOT NULL DEFAULT true,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `Video_sortOrder_id_idx` (`sortOrder`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComparisonRow` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `feature` VARCHAR(255) NOT NULL,
  `category` VARCHAR(80) NOT NULL,
  `purifrezeText` VARCHAR(500) NOT NULL,
  `garrafonesText` VARCHAR(500) NOT NULL,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `ComparisonRow_sortOrder_id_idx` (`sortOrder`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FaqItem` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `isVisible` BOOLEAN NOT NULL DEFAULT true,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `FaqItem_sortOrder_id_idx` (`sortOrder`, `id`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Backfill Testimonial
INSERT INTO `Testimonial` (`videoUrl`, `name`, `label`, `featured`, `isVisible`, `sortOrder`, `updatedAt`)
SELECT
  COALESCE(jt.url, ''),
  COALESCE(jt.name, ''),
  COALESCE(jt.label, ''),
  COALESCE(jt.featured, false),
  COALESCE(jt.isVisible, true),
  jt.pos - 1,
  CURRENT_TIMESTAMP(3)
FROM `ContentSection` cs,
JSON_TABLE(
  cs.content,
  '$.testimonials[*]' COLUMNS (
    pos FOR ORDINALITY,
    url VARCHAR(500) PATH '$.url',
    name VARCHAR(255) PATH '$.name',
    label VARCHAR(255) PATH '$.label',
    featured BOOLEAN PATH '$.featured',
    isVisible BOOLEAN PATH '$.isVisible'
  )
) AS jt
WHERE cs.`key` = 'testimonials';

-- Backfill Video
INSERT INTO `Video` (`title`, `url`, `vertical`, `isVisible`, `sortOrder`, `updatedAt`)
SELECT
  COALESCE(jt.title, ''),
  COALESCE(jt.url, ''),
  COALESCE(jt.vertical, true),
  COALESCE(jt.isVisible, true),
  jt.pos - 1,
  CURRENT_TIMESTAMP(3)
FROM `ContentSection` cs,
JSON_TABLE(
  cs.content,
  '$.videos[*]' COLUMNS (
    pos FOR ORDINALITY,
    title VARCHAR(255) PATH '$.title',
    url VARCHAR(500) PATH '$.url',
    vertical BOOLEAN PATH '$.vertical',
    isVisible BOOLEAN PATH '$.isVisible'
  )
) AS jt
WHERE cs.`key` = 'videos';

-- Backfill ComparisonRow
INSERT INTO `ComparisonRow` (`feature`, `category`, `purifrezeText`, `garrafonesText`, `isVisible`, `sortOrder`, `updatedAt`)
SELECT
  COALESCE(jt.feature, ''),
  COALESCE(jt.category, ''),
  COALESCE(jt.purifrezeText, ''),
  COALESCE(jt.garrafonesText, ''),
  COALESCE(jt.isVisible, true),
  jt.pos - 1,
  CURRENT_TIMESTAMP(3)
FROM `ContentSection` cs,
JSON_TABLE(
  cs.content,
  '$.badges[*]' COLUMNS (
    pos FOR ORDINALITY,
    feature VARCHAR(255) PATH '$.feature',
    category VARCHAR(80) PATH '$.category',
    purifrezeText VARCHAR(500) PATH '$.purifrezeText',
    garrafonesText VARCHAR(500) PATH '$.garrafonesText',
    isVisible BOOLEAN PATH '$.isVisible'
  )
) AS jt
WHERE cs.`key` = 'comparison';

-- Backfill FaqItem
INSERT INTO `FaqItem` (`question`, `answer`, `isVisible`, `sortOrder`, `updatedAt`)
SELECT
  COALESCE(jt.question, ''),
  COALESCE(jt.answer, ''),
  COALESCE(jt.isVisible, true),
  jt.pos - 1,
  CURRENT_TIMESTAMP(3)
FROM `ContentSection` cs,
JSON_TABLE(
  cs.content,
  '$.faqs[*]' COLUMNS (
    pos FOR ORDINALITY,
    question TEXT PATH '$.question',
    answer TEXT PATH '$.answer',
    isVisible BOOLEAN PATH '$.isVisible'
  )
) AS jt
WHERE cs.`key` = 'faq';

-- DropTable
DROP TABLE `ContentSection`;
