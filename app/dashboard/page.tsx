import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
import { currentUser } from '@clerk/nextjs/server'
import { notFound } from 'next/navigation'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { desc, eq } from 'drizzle-orm'

async function Dashboard() {
  const user = await currentUser()

  if (!user) return notFound()

  if(!user.primaryEmailAddress) return

  const interviewList = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, user.primaryEmailAddress.emailAddress))
    .orderBy(desc(MockInterview.id));

  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and start your Mock Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview />
      </div>
      {/* Previous Interview List */}
      <InterviewList getInterviewList={interviewList} />
    </div>
  )
}

export default Dashboard
