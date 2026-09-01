CREATE INDEX `feedbacks_user_uuid_idx` ON `feedbacks_annorasky` (`user_uuid`);--> statement-breakpoint
CREATE INDEX `feedbacks_created_at_idx` ON `feedbacks_annorasky` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_locale_idx` ON `posts_annorasky` (`locale`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts_annorasky` (`status`);--> statement-breakpoint
CREATE INDEX `posts_slug_idx` ON `posts_annorasky` (`slug`);--> statement-breakpoint
CREATE INDEX `posts_created_at_idx` ON `posts_annorasky` (`created_at`);--> statement-breakpoint
CREATE INDEX `posts_locale_status_idx` ON `posts_annorasky` (`locale`,`status`);