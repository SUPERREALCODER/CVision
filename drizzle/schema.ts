import { pgTable, serial, varchar, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userAnswer = pgTable("userAnswer", {
	id: serial().primaryKey().notNull(),
	mockId: varchar().notNull(),
	question: varchar().notNull(),
	correctAnswer: text(),
	userAns: text(),
	feedback: text(),
	rating: varchar(),
	userEmail: varchar(),
	createdAt: varchar(),
});

export const mockInterview = pgTable("mockInterview", {
	id: serial().primaryKey().notNull(),
	jsonMockResp: text().notNull(),
	jobPosition: varchar().notNull(),
	jobDesc: varchar().notNull(),
	jobExperience: varchar().notNull(),
	createdBy: varchar().notNull(),
	createdAt: varchar(),
	mockId: varchar().notNull(),
	resumeContent: text().notNull(),
});
