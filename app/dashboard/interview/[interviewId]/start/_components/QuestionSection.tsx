import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

interface QuestionSectionProps {
  mockInterviewQuestion: any;
  activeQuestionIndex: number;
}

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }: QuestionSectionProps) {

  const textToSpeech = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(mockInterviewQuestion[activeQuestionIndex]?.question);
    speechSynthesis.speak(utterance);
  };

  return mockInterviewQuestion && (
    <>
      <div className="p-5 border rounded-lg my-10">
        <span>Question No. {activeQuestionIndex + 1}/{mockInterviewQuestion.length}</span>
        <h2 className="my-5 text-sm md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <Volume2 className='cursor-pointer' onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)} />
        <div className="border rounded-lg p-5 bg-purple-400 mt-20">
          <h2 className="flex gap-2 items-center text-white">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-white text-sm my-2">{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
        </div>
      </div>
    </>
  );
}

export default QuestionSection;
