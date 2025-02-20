"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { eq } from "drizzle-orm";
import QuestionSection from './_components/QuestionSection';
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
    
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState();
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
    <div className='grid grid-cols-1 md:grid-cols-2'>
        {/* Questions */}
        <QuestionSection  mockInterviewQuestion={mockInterviewQuestion}
        activeQuestionIndex={activeQuestionIndex}
        />

        {/* video/Audio recording */}
    </div>
  )
}

export default StartInterview