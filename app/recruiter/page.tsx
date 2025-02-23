"use server"
import { db } from "@/utils/db"
import CreateJobProfile from "./_components/createJobProfile"
import { currentUser } from "@clerk/nextjs/server"
import { notFound } from "next/navigation"
import { RecruitmentProfile } from "@/utils/schema"
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const RecruiterPage = async () => {
  const user = await currentUser()
  if (!user) return notFound()

  const jobProfiles = await db
    .select()
    .from(RecruitmentProfile)
    .where(eq(RecruitmentProfile.createdBy, user.emailAddresses)) ?? []

  console.log(jobProfiles)

  return (
    <div className="p-6">
      <div className="mb-8 text-xl font-bold">Create Recruitment Job Profile</div>
      <CreateJobProfile />

      <div className="mt-10 space-y-8">
        <div className="text-2xl font-semibold">List all the Job Profiles</div>
        {
          jobProfiles.length === 0 ? (
            <div className="text-gray-500">No job profiles found.</div>
          ) : (
            jobProfiles.map((job, index) => (
              <Card key={index} className="bg-white shadow-md hover:shadow-xl transition duration-200 ease-in-out">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{job.jobTitle}</CardTitle>
                  <CardDescription className="text-gray-500">{job.jobPosition}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-800">{job.jobDesc}</div>
                </CardContent>
                <CardFooter className="flex justify-between text-gray-500 text-sm">
                  <span>Mock ID: {job.mockId}</span>
                </CardFooter>
              </Card>
            ))
          )
        }
      </div>
    </div>
  )
}

export default RecruiterPage
