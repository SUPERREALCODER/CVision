"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { eq } from "drizzle-orm";
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { } from 'next/navigation';
import { toast } from 'sonner';


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

  const [mockInterviewQuestion, setMockInterviewQuestion] = useState<any[]>([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [isRecordingSubmit, setIsRecordingSubmit] = useState<boolean>(false);
  const [isSavingToDB, setIsSavingToDB] = useState<boolean>(false);
  const [cameraNotOnCnt, setCameraNotOnCnt] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (cameraNotOnCnt > 5) {
      router.replace('/dashboard/interview/' + interviewData?.mockId + '/feedback');
    }
  }, [cameraNotOnCnt])

  // Function to check camera availability
  const checkCameraStatus = async () => {
    try {
      // Request video stream to check if camera is accessible
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const tracks = stream.getVideoTracks();

      // If there are video tracks, it means camera is on
      if (tracks.length > 0) {
      }

      // Stop the stream to release the camera
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setCameraNotOnCnt(prev => prev + 1);
      toast.error(`Camera is not accessible. Please enable camera to continue. ${7 - cameraNotOnCnt}`);
      console.log("Error: ", error, cameraNotOnCnt);
    }
  };

  useEffect(() => {
    // Initial camera check
    checkCameraStatus();

    // Set up a polling mechanism to check every 2 seconds if camera is still on
    const intervalId = setInterval(() => {
      checkCameraStatus();
    }, 2000); // Check every 2 seconds

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const GetInterviewDetails = async () => {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params?.interviewId as string));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp)
      setMockInterviewQuestion(jsonMockResp)
      setInterviewData(result[0]);
      console.log(jsonMockResp);
    };

    GetInterviewDetails();
  }, [])

  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
        {/* Questions */}
        <QuestionSection mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* video/Audio recording */}
        <RecordAnsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          isVoiceRecording={isSavingToDB}
          setIsVoiceRecording={setIsSavingToDB}
          setIsRecordingSubmit={setIsRecordingSubmit}
        />
      </div>
      <div className='flex justify-end gap-6'>
        {activeQuestionIndex > 0 &&
          <Button disabled={isSavingToDB || isRecordingSubmit} onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>Previous Question</Button>}
        {activeQuestionIndex != mockInterviewQuestion?.length - 1 &&
          <Button disabled={isSavingToDB || isRecordingSubmit} onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>Next Question</Button>}
        <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
          {activeQuestionIndex == mockInterviewQuestion?.length - 1 &&
            <Button disabled={isSavingToDB || isRecordingSubmit}>End Interview</Button>}
        </Link>
      </div>
    </div>
  )
}

export default StartInterview
