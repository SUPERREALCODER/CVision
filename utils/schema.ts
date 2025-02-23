import { relations } from "drizzle-orm";
import { pgTable, serial, text, varchar, pgEnum, integer } from "drizzle-orm/pg-core";

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  jsonMockResp: text('jsonMockResp').notNull(),
  jobPosition: varchar('jobPosition').notNull(),
  jobDesc: varchar('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull()
})



export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: varchar('question').notNull(),
  correctAnswer: text('correctAnswer'),
  userAns: text('userAns'),
  feedback: text('feedback'),
  rating: varchar('rating'),
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
})

export const RecruitmentProfile = pgTable('recruitmentProfile', {
  id: serial('id').primaryKey(),
  jobTitle: varchar('jobTitle').notNull(),  // Add this line
  jobPosition: varchar('jobPosition').notNull(),
  jobDesc: varchar('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  mockId: varchar('mockId').notNull().unique(), // Ensure `mockId` is unique for the relation
})

export const ShortlistedUsers = pgTable('shortlistedUsers', {
  id: serial('id').primaryKey(),
  recruitmentProfileId: integer('recruitmentProfileId').notNull(),
  userEmail: varchar('userEmail').notNull(),
  resume: text('resume'),
  createdAt: varchar('createdAt'),
})

export const recruitmentProfileRelation = relations(RecruitmentProfile, ({ many }) => ({
  shortlistedUsers: many(ShortlistedUsers)
}))

export const shortlistedUsersRelation = relations(ShortlistedUsers, ({ one }) => ({
  recruitmentProfile: one(RecruitmentProfile, {
    fields: [ShortlistedUsers.recruitmentProfileId],
    references: [RecruitmentProfile.id]
  })
}))
