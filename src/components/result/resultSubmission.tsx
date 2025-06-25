"use client";
import { useState } from "react";
import { LTIProvider } from "@/lib/ltiProvider";
import { useRecoilValue } from "recoil";
import { ltiDataState } from "@/store/data";
import { useSearchParams } from "next/navigation";

interface QuizSubmissionProps {
  score: number;
  totalQuestions: number;
}

export default function QuizSubmission({
  score,
  totalQuestions,
}: QuizSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const ltiData = useRecoilValue(ltiDataState);

  const searchParams = useSearchParams();
  const outcomeUrl = searchParams.get("outcomeUrl");
  const sourceId = searchParams.get("sourceId");

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!outcomeUrl || !sourceId) {
        throw new Error("LTI data is missing or incomplete");
      }

      const normalizedScore = score;
      const ltiProvider = new LTIProvider(
        process.env.NEXT_PUBLIC_LTI_CONSUMER_KEY!,
        process.env.NEXT_PUBLIC_LTI_CONSUMER_SECRET!
      );

      await ltiProvider.sendScore({
        sourcedId: sourceId,
        outcomeUrl: outcomeUrl,
        score: normalizedScore,
      });

      // Handle successful submission
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit score");
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="p-4 w-full items-center justify-center flex ">
      {/* <h2 className="text-xl font-bold mb-4">Quiz Results</h2>
      <p className="mb-4">
        Score: {score} out of {totalQuestions}
      </p> */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Score"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
