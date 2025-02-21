"use client"
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import InterviewItemCard from "./InterviewItemCard";

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        if (!user?.primaryEmailAddress) return; // Ensure the email exists

        const result: any = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.createdBy, user.primaryEmailAddress.toString()))
            .orderBy(desc(MockInterview.id));

        console.log(result);
        setInterviewList(result);
    };

    return (
        <div>
            <h2 className="font-medium text-2xl">Previous Mock Interview</h2>
            {/* You can render the interviewList here if needed */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {interviewList&&interviewList.map((interview,index)=>(
                    <InterviewItemCard 
                    interview={interview}
                    key={index}/>
                ))}
            </div>

        </div>
    );
}

export default InterviewList;
