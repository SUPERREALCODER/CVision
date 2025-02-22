"use server"
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAIModel';
import { MockInterview, RecruitmentProfile } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';


export const handleCreateRecruitmentJobProfile = async (data: FormData) => {
  const jobTitle = data.get('jobTitle') as string
  const jobDesc = data.get('jobDesc') as string
  const jobExperience = data.get('jobExperience') as string
  const jobPosition = data.get('jobPosition') as string
  const user = await currentUser()

  if (!user || !jobDesc || !jobTitle || !jobExperience || !jobPosition) return null

  const mockId = uuidv4()

  const recruitmentProfile = await db.insert(RecruitmentProfile).values({
    jobTitle: jobTitle,
    jobPosition: jobPosition,
    jobDesc: jobDesc,
    jobExperience: jobExperience,
    mockId: mockId,
    createdBy: user.emailAddresses,
    createdAt: moment.now()
  })

  const InputPrompt = "Job position:" + jobPosition + " Job Description:" + jobDesc + "Years of Experience:" + jobExperience + "Depends on Job Position, Job Description & Years of Experience give us" + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + "Interview question along with Answer in JSON format, Give us question and answer field on JSON";
  const result = await chatSession.sendMessage(InputPrompt);
  const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');

  const createMockInterview = await db.insert(MockInterview).values({
    mockId: uuidv4(),
    jsonMockResp: MockJsonResp,
    jobPosition: jobPosition,
    jobDesc: jobDesc,
    jobExperience: jobExperience,
    resumeContent: '',
    createdBy: user?.primaryEmailAddress?.emailAddress || '',
    createdAt: moment().format('DD-MM-yyyy')
  })

  return true
}
