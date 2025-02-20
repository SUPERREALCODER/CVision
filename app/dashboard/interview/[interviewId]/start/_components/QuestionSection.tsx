import { Lightbulb } from "lucide-react";
import React from "react";

interface QuestionSectionProps {
  mockInterviewQuestion: any;
  activeQuestionIndex: any;
}

function QuestionSection({ mockInterviewQuestion, activeQuestionIndex }: QuestionSectionProps) {
  return mockInterviewQuestion&&(
    <div className="p-5 border rounded-lg my-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion &&
          mockInterviewQuestion.map((question: any, index: number) => (
            <h2
              key={index}
              className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer
                ${activeQuestionIndex==index&&'bg-purple-600 text-white'}`}
            >
              Question #{index + 1}
            </h2>
          ))}
         </div>
         <h2 className="my-5 text-sm md:text-lg">{mockInterviewQuestion[activeQuestionIndex]?.question}</h2>

         <div className="border rounded-lg p-5 bg-purple-400">
            <h2 className="flex gap-2 items-center text-white">
                <Lightbulb/>
                <strong>Note:</strong>
            </h2>
         </div>
    </div>
  );
}

export default QuestionSection;
