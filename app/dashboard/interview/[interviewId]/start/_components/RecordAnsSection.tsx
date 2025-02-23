"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import useSpeechToText from 'react-hook-speech-to-text'
import { toast } from 'sonner'
import { chatSession } from '@/utils/GeminiAIModel'
import { db } from '@/utils/db'
import { UserAnswer } from '@/utils/schema'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'

interface RecordAnsSectionProps {
  mockInterviewQuestion: any;
  activeQuestionIndex: number;
  interviewData: any;
  isVoiceRecording: boolean
  setIsVoiceRecording: Dispatch<SetStateAction<boolean>>
  setIsRecordingSubmit: Dispatch<SetStateAction<boolean>>
}

function RecordAnsSection({ mockInterviewQuestion, activeQuestionIndex, interviewData, isVoiceRecording, setIsVoiceRecording, setIsRecordingSubmit }: RecordAnsSectionProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const { user } = useUser();
  const {
    error,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });
  const [webCamEnabled, setWebCamEnabled] = useState(false);


  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results.map(result => typeof result === 'string' ? result : result.transcript).join(' '));
    }
  }, [results]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
      await UpdateUserAnswer();
      setIsRecordingSubmit(false)
    } else {
      await startSpeechToText()
      setIsRecordingSubmit(true)
    }
  }

  const UpdateUserAnswer = async () => {
    setIsVoiceRecording(true);
    const feedbackPrompt = "Question:" + mockInterviewQuestion[activeQuestionIndex]?.question + ",User Answer:" + userAnswer + ',Depending on question and user answer for given interview question please give us rating for answer and feedback as area of improvement if any in just 3 to 5 lines to improve it in JSON format with rating field and feedback field';
    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    const resp = await db.insert(UserAnswer)
      .values({
        mockIdRef: interviewData?.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAnswer: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      })
    if (resp) {
      toast.success('answer recorded in databse');
    } else {
      toast.error('error in recording answer!! Re');
    }
    setUserAnswer('');
    setResults([]);
    setIsVoiceRecording(false);
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col justify-center items-center bg-black rounded-lg p-5 mt-20'>
        <Image src={'/webcam.png'} alt='Webcam icon' width={200} height={200} className='absolute' />
        <div
          style={{ height: 300, width: '100%', zIndex: 10 }}
        >
          {
            webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{ height: 300, width: '100%', zIndex: 10 }}
              />
            ) : (
              <div className='flex flex-1 flex-col items-center gap-3'>
                <p className='text-center'>Webcam is disabled</p>
                <Button onClick={() => setWebCamEnabled(true)}>Enable Webcam</Button>
              </div>
            )
          }
        </div>
      </div>
      <Button disabled={isVoiceRecording} variant={'destructive'} className='my-10' onClick={StartStopRecording}>
        {isRecording ? 'Stop Recording' : 'Record Answer'}
      </Button>
    </div>
  );
}

export default RecordAnsSection;
