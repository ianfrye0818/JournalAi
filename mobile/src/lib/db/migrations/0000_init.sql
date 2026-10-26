CREATE TABLE `days` (
	`local_date` text PRIMARY KEY NOT NULL,
	`server_id` text,
	`status` text DEFAULT 'open' NOT NULL,
	`interview_round` integer DEFAULT 0 NOT NULL,
	`finalized_at` integer,
	`updated_at` integer NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `entries` (
	`id` text PRIMARY KEY NOT NULL,
	`local_date` text NOT NULL,
	`title` text,
	`body` text NOT NULL,
	`ai_draft` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`model` text,
	`updated_at` integer NOT NULL,
	`fetched_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `entries_local_date_unique` ON `entries` (`local_date`);--> statement-breakpoint
CREATE TABLE `kv` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `snippets` (
	`client_id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	`source` text DEFAULT 'text' NOT NULL,
	`captured_at` integer NOT NULL,
	`local_date` text NOT NULL,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	`synced_at` integer
);
--> statement-breakpoint
CREATE INDEX `snippets_local_date_idx` ON `snippets` (`local_date`,`captured_at`);