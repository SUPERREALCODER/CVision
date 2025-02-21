"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { eq } from "drizzle-orm";
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
function StartInterview() {
    const params = useParams();
    const [interviewData, setInterviewData] = useState<{
        id: any;
        jsonMockResp: any;
        jobPosition: any;
        jobDesc: any;
        jobExperience: any;
        createdBy: any;
        createdAt: any | null;
        mockId: any;
      } | undefined>(undefined);
    
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState<any[]>([]);
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
      useEffect(()=>{
        GetInterviewDetails();

      },[])


     const GetInterviewDetails = async () => {
        const result = await db
          .select()
          .from(MockInterview)
          .where(eq(MockInterview.mockId, params?.interviewId as string));
        
        const jsonMockResp = JSON.parse(result[0].jsonMockResp)
        setMockInterviewQuestion(jsonMockResp)
        setInterviewData(result[0]);
        console.log(jsonMockResp);
        //console.log(result[0]);
        // console.log(result);
        // setInterviewData(result[0]);
      };
  return (
    <div>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionSection  mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        />

        {/* video/Audio recording */}
        <RecordAnsSection
        mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        interviewData={interviewData}
        />
    </div>
    <div className='flex justify-end gap-6'>
      {activeQuestionIndex>0 &&
      <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
      {activeQuestionIndex!=mockInterviewQuestion?.length-1 && 
      <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
      <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
      {activeQuestionIndex==mockInterviewQuestion?.length-1 &&
    <Button>End Interview</Button>}
      </Link>
    </div>
    </div>
  )
}

export default StartInterview