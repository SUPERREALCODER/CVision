CREATE TABLE "mockInterview" (
	"id" serial PRIMARY KEY NOT NULL,
	"jsonMockResp" text NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDesc" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar,
	"mockId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruitmentProfile" (
	"id" serial PRIMARY KEY NOT NULL,
	"jobTitle" varchar NOT NULL,
	"jobPosition" varchar NOT NULL,
	"jobDesc" varchar NOT NULL,
	"jobExperience" varchar NOT NULL,
	"createdBy" varchar NOT NULL,
	"createdAt" varchar,
	"mockId" varchar NOT NULL,
	CONSTRAINT "recruitmentProfile_mockId_unique" UNIQUE("mockId")
);
--> statement-breakpoint
CREATE TABLE "shortlistedUsers" (
	"id" serial PRIMARY KEY NOT NULL,
	"recruitmentProfileId" integer NOT NULL,
	"userEmail" varchar NOT NULL,
	"resume" text,
	"createdAt" varchar
);
--> statement-breakpoint
CREATE TABLE "userAnswer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mockId" varchar NOT NULL,
	"question" varchar NOT NULL,
	"correctAnswer" text,
	"userAns" text,
	"feedback" text,
	"rating" varchar,
	"userEmail" varchar,
	"createdAt" varchar
);
