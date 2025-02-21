import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

interface Interview {
    jobPosition: any
    interview:any
    jobExperience:any
    createdAt:any
    mockId:any
}

function InterviewItemCard({interview}: { interview: Interview }) {
  return (
    <div className='border shadow-sm rounded-lg p-3'>
        <h2 className='font-bold text-primary'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-500'>{interview?.jobExperience} Years of Experience</h2>
        <h2 className='text-xs text-gray-500'>Created At:{interview.createdAt}</h2>
        <div className='flex justify-between mt-2 gap-5'>
            <Link href={'/dashboard/interview/'+interview?.mockId+'/feedback'}><Button size="sm" className='w-full'>Feedback</Button></Link>
            <Link href={'/dashboard/interview/'+interview?.mockId}><Button size="sm" className='w-full'>Start</Button></Link>
            
        </div>
    </div>
  )
}

export default InterviewItemCard