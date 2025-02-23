"use client"
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import { eq } from "drizzle-orm";
import QuestionSection from './_components/QuestionSection';
import RecordAnsSection from './_components/RecordAnsSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Webcam from "react-webcam";
import axios from "axios";

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

  // Face Detection State
  const webcamRef = useRef<Webcam>(null);
  interface BoundingBox {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
  interface Emotion {
    emotion: string;
  }
  const [emotionData, setEmotionData] = useState<Emotion[]>([]);
  const [faceWarning, setFaceWarning] = useState<string | null>(null);
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  // Fetch Interview Details & Questions
  useEffect(() => {
    const GetInterviewDetails = async () => {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.mockId, params?.interviewId as string));

      const jsonMockResp = JSON.parse(result[0].jsonMockResp);
      setMockInterviewQuestion(jsonMockResp);
      setInterviewData(result[0]);
      console.log(jsonMockResp);
    };

    GetInterviewDetails();
  }, [params]);

  // Start face detection capture when webcam is enabled
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (webCamEnabled) {
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [webCamEnabled]);

  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    try {
      const base64Image = imageSrc.split(",")[1];
      const response = await axios.post("http://127.0.0.1:5000/analyze_emotion", {
        image: base64Image,
      });
      setBoundingBoxes(response.data.bounding_boxes || []);
      setEmotionData(response.data.emotions || []);
      setFaceWarning(response.data.warning || null);
    } catch (error) {
      console.error("Error analyzing emotion:", error);
    }
  };

  return (
    <div>
      {/* Real-Time Face Detection Section */}
      <div className="mb-10">
        <h2 className="font-bold text-2xl text-center">Real-Time Face Detection</h2>
        {webCamEnabled ? (
          <div className="relative w-[300px] h-[300px] mx-auto">
            
            {/* <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              className="rounded-lg border shadow-md absolute top-0 left-0"
              style={{ width: "100%", height: "100%" }}
            /> */}
            {/* Bounding Boxes & Emotion Labels */}
            <div className="absolute inset-0">
              {boundingBoxes.map((box, index) => (
                <div
                  key={index}
                  className="absolute border border-red-500"
                  style={{
                    left: `${box.x}px`,
                    top: `${box.y}px`,
                    width: `${box.w}px`,
                    height: `${box.h}px`,
                  }}
                >
                  {emotionData[index] && (
                    <div className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-1">
                      {emotionData[index].emotion}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Button onClick={() => setWebCamEnabled(true)}>Enable Webcam for Face Detection</Button>
          </div>
        )}
        {faceWarning && (
          <div className="mt-4 p-2 bg-red-500 text-white text-center">
            {faceWarning}
          </div>
        )}
      </div>

      {/* Existing Interview Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Questions */}
        <QuestionSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        {/* Video/Audio Recording */}
        <RecordAnsSection
        webcamRef={webcamRef}
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
          isVoiceRecording={isSavingToDB}
          setIsVoiceRecording={setIsSavingToDB}
          setIsRecordingSubmit={setIsRecordingSubmit}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button disabled={isSavingToDB || isRecordingSubmit} onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}>
            Previous Question
          </Button>
        )}
        {activeQuestionIndex !== mockInterviewQuestion?.length - 1 && (
          <Button disabled={isSavingToDB || isRecordingSubmit} onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}>
            Next Question
          </Button>
        )}
        <Link href={'/dashboard/interview/' + interviewData?.mockId + "/feedback"}>
          {activeQuestionIndex === mockInterviewQuestion?.length - 1 && (
            <Button disabled={isSavingToDB || isRecordingSubmit}>End Interview</Button>
          )}
        </Link>
      </div>
    </div>
  );
}

export default StartInterview;
