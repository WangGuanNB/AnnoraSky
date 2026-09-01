CREATE TABLE `affiliates_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_uuid` text NOT NULL,
	`created_at` integer,
	`status` text DEFAULT '' NOT NULL,
	`invited_by` text NOT NULL,
	`paid_order_no` text DEFAULT '' NOT NULL,
	`paid_amount` integer DEFAULT 0 NOT NULL,
	`reward_percent` integer DEFAULT 0 NOT NULL,
	`reward_amount` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `apikeys_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`api_key` text NOT NULL,
	`title` text,
	`user_uuid` text NOT NULL,
	`created_at` integer,
	`status` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `apikeys_annorasky_api_key_unique` ON `apikeys_annorasky` (`api_key`);--> statement-breakpoint
CREATE TABLE `credits_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`trans_no` text NOT NULL,
	`created_at` integer,
	`user_uuid` text NOT NULL,
	`trans_type` text NOT NULL,
	`credits` integer NOT NULL,
	`order_no` text,
	`expired_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `credits_annorasky_trans_no_unique` ON `credits_annorasky` (`trans_no`);--> statement-breakpoint
CREATE TABLE `feedbacks_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer,
	`status` text,
	`user_uuid` text,
	`content` text,
	`rating` integer
);
--> statement-breakpoint
CREATE TABLE `orders_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_no` text NOT NULL,
	`created_at` integer,
	`user_uuid` text DEFAULT '' NOT NULL,
	`user_email` text DEFAULT '' NOT NULL,
	`amount` integer NOT NULL,
	`interval` text,
	`expired_at` integer,
	`status` text NOT NULL,
	`stripe_session_id` text,
	`credits` integer NOT NULL,
	`currency` text,
	`sub_id` text,
	`sub_interval_count` integer,
	`sub_cycle_anchor` integer,
	`sub_period_end` integer,
	`sub_period_start` integer,
	`sub_times` integer,
	`product_id` text,
	`product_name` text,
	`valid_months` integer,
	`order_detail` text,
	`paid_at` integer,
	`paid_email` text,
	`paid_detail` text,
	`pay_type` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_annorasky_order_no_unique` ON `orders_annorasky` (`order_no`);--> statement-breakpoint
CREATE TABLE `posts_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`slug` text,
	`title` text,
	`description` text,
	`content` text,
	`created_at` integer,
	`updated_at` integer,
	`status` text,
	`cover_url` text,
	`author_name` text,
	`author_avatar_url` text,
	`locale` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_annorasky_uuid_unique` ON `posts_annorasky` (`uuid`);--> statement-breakpoint
CREATE TABLE `users_annorasky` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`email` text NOT NULL,
	`created_at` integer,
	`nickname` text,
	`avatar_url` text,
	`locale` text,
	`signin_type` text,
	`signin_ip` text,
	`signin_provider` text,
	`signin_openid` text,
	`invite_code` text DEFAULT '' NOT NULL,
	`updated_at` integer,
	`invited_by` text DEFAULT '' NOT NULL,
	`is_affiliate` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_annorasky_uuid_unique` ON `users_annorasky` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_annorasky_provider_unique_idx` ON `users_annorasky` (`email`,`signin_provider`);