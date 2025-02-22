"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Interview() {
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
  const [webCamEnabled, setWebCamEnabled] = useState(false);

  useEffect(() => {
    GetInterviewDetails();
  }, [params]);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, params?.interviewId as string));

    console.log(result);
    setInterviewData(result[0]);
  };

  return (
    <div className="my-10 mx-auto max-w-4xl">
      <h2 className="font-bold text-2xl mb-5 text-center">Let's Get Started</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Job Details Section */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col p-5 rounded-lg border gap-4 shadow-md">
            <h2 className="text-lg">
              <strong>Job Role/Job Position:</strong> {interviewData?.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Years of Experience:</strong> {interviewData?.jobExperience}
            </h2>
          </div>
          <div className="p-5 border rounded-lg bg-yellow-50 shadow-md">
            <h2 className="flex gap-2 items-center text-yellow-500">
              <Lightbulb />
              <strong>Information</strong>
            </h2>
            <h2 className="mt-3 text-yellow-500">{process.env.NEXT_PUBLIC_INFORMATION}</h2>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="flex flex-col items-center justify-center gap-5">
          {webCamEnabled ? (
            <Webcam
              onUserMedia={() => setWebCamEnabled(true)}
              onUserMediaError={() => setWebCamEnabled(false)}
              mirrored={true}
              className="rounded-lg border shadow-md"
              style={{ height: 300, width: 300 }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3">
              <WebcamIcon className="h-72 w-72 p-10 bg-secondary rounded-lg border shadow-md" />
              <Button onClick={() => setWebCamEnabled(true)}>Enable Webcam & Microphone</Button>
            </div>
          )}
        </div>
      </div>

      {/* Start Button at Bottom Right */}
      <div className="flex justify-end mt-10">
        <Link href={'/dashboard/interview/'+params?.interviewId+'/start'}><Button className="px-6 py-3">Start Interview</Button></Link>

      </div>
    </div>
  );
}
