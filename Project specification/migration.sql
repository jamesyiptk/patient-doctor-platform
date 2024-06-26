BEGIN;
--
-- Create model Category
--
CREATE TABLE "pdp_category" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "name" varchar(100) NOT NULL);
--
-- Create model Post
--
CREATE TABLE "pdp_post" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "content" text NOT NULL, "created_at" datetime NOT NULL, "author_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "category_id" bigint NULL REFERENCES "pdp_category" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model PatientProfile
--
CREATE TABLE "pdp_patientprofile" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "crypto" integer NOT NULL, "user_id" integer NOT NULL UNIQUE REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model DoctorProfile
--
CREATE TABLE "pdp_doctorprofile" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "phone_number" varchar(16) NOT NULL, "specialty" varchar(100) NOT NULL, "position" varchar(100) NOT NULL, "hospital" varchar(100) NOT NULL, "address" varchar(200) NOT NULL, "city" varchar(100) NOT NULL, "state" varchar(100) NOT NULL, "photo" varchar(100) NOT NULL, "crypto" integer NOT NULL, "user_id" integer NOT NULL UNIQUE REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED);
--
-- Create model Comment
--
CREATE TABLE "pdp_comment" ("id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "text" text NOT NULL, "created_at" datetime NOT NULL, "author_id" integer NOT NULL REFERENCES "auth_user" ("id") DEFERRABLE INITIALLY DEFERRED, "post_id" bigint NOT NULL REFERENCES "pdp_post" ("id") DEFERRABLE INITIALLY DEFERRED);
CREATE INDEX "pdp_post_author_id_c2052fa7" ON "pdp_post" ("author_id");
CREATE INDEX "pdp_post_category_id_8c3a0d84" ON "pdp_post" ("category_id");
CREATE INDEX "pdp_comment_author_id_5c45e544" ON "pdp_comment" ("author_id");
CREATE INDEX "pdp_comment_post_id_22026c68" ON "pdp_comment" ("post_id");
COMMIT;
