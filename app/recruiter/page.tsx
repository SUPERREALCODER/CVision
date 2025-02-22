"use server"
import { db } from "@/utils/db"
import CreateJobProfile from "./_components/createJobProfile"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { RecruitmentProfile } from "@/utils/schema"
import { eq } from 'drizzle-orm'


const RecruiterPage = async () => {
  const user = await currentUser()
  if (!user) return notFound()
  const jobProfiles = await db
    .select()
    .from(RecruitmentProfile)
    .where(eq(RecruitmentProfile.createdBy, user.emailAddresses)) ?? []

  console.log(jobProfiles)

  return (
    <div>
      <div>
        Create Recruitment Job Profile
        <CreateJobProfile />
      </div>
      <div>
        List all the job profiles
        {
          jobProfiles.map((job, index) =>
            <div key={index}>
              <div>Job {index+1}</div>
              <div>{job.jobTitle}</div>
              <div>{job.jobDesc}</div>
              <div>{job.jobPosition}</div>
              <div>{job.mockId}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default RecruiterPage
