import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";


interface UserAnswer {
  rating: number;
  id: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  feedback: string;
  mockIdRef: string;
}

async function Feedback({ params }: { params: Promise<{ interviewId: string }> }) {
  const { interviewId } = await params
  if (!interviewId) return notFound()

  const feedbackList = await db
    .select()
    .from(UserAnswer)
    .where(eq(UserAnswer.mockIdRef, interviewId));

  const totalRating = feedbackList.reduce((acc, item) => acc + parseInt(item.rating as string), 0);
  const avgRating = totalRating / feedbackList.length;
  console.log(avgRating);
  return (
    <div>
      <h2 className="text-3xl font-bold text-green-500">Congratulations</h2>
      <h2 className="font-bold text-2xl">Here is your Interview feedback</h2>
      {feedbackList?.length == 0 ? (
        <h2 className="font-bold text-xl text-500">No interview Record Found</h2>
      ) : (
        <>
          <h2 className="text-black text-lg my-3">
              Your overall interview rating:<strong>{avgRating}/{feedbackList.length}</strong>
          </h2>
          <h2 className="text-sm text-gray-500">
            Find below Interview with correct answer, your answer, and feedback for improvement
          </h2>
        </>
      )}
      {feedbackList && feedbackList.map((item, index) => (
        <Collapsible key={index} className="mt-7">
          <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-10 w-full">
            {item.question}<ChevronsUpDown className="h-5 w-5" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="flex flex-col gap-2">
              <h2 className="text-red-500 p-2 border rounded-lg">
                <strong>Rating:</strong>{item.rating}
              </h2>
              <h2 className="p-2 border rounded-lg bg-red-50 text-sm"><strong>Your answer:</strong>{item.userAns}</h2>
              <h2 className="p-2 border rounded-lg bg-green-50 text-sm"><strong>Correct answer:</strong>{item.correctAnswer}</h2>
              <h2 className="p-2 border rounded-lg bg-blue-50 text-sm"><strong>FeedBack:</strong>{item.feedback}</h2>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

export default Feedback;
