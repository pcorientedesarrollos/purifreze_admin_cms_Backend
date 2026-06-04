ALTER TABLE `Video`
  ADD COLUMN `placement` VARCHAR(30) NOT NULL DEFAULT 'gallery';

DROP INDEX `Video_sortOrder_id_idx` ON `Video`;

CREATE INDEX `Video_placement_sortOrder_id_idx` ON `Video`(`placement`, `sortOrder`, `id`);
