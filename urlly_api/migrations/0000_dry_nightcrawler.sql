CREATE TABLE `urls` (
	`id` integer PRIMARY KEY NOT NULL,
	`target` text NOT NULL,
	`slug` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `urls_slug_unique` ON `urls` (`slug`);