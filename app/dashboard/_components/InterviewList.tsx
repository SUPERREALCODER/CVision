import InterviewItemCard from "./InterviewItemCard";

function InterviewList({ getInterviewList }: { getInterviewList: any[] }) {
  return (
    <div>
      <h2 className="font-medium text-2xl">Previous Mock Interview</h2>
      {/* You can render the interviewList here if needed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {getInterviewList && getInterviewList.map((interview, index) => (
          <InterviewItemCard
            interview={interview}
            key={index} />
        ))}
      </div>

    </div>
  );
}

export default InterviewList;
