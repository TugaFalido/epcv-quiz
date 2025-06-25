"use client";
import ScoreSubmitButton from "@/components/result/scoreButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LaunchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const quizId = params.get("quizId");

  console.log({ params: params.get("quizId") });

  // useEffect(() => {
  //   const redir = () => {
  //     router.push(`/quiz/${quizId}`);
  //   };

  //   redir();
  // }, [quizId]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">LTI Debug Information</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">LTI Launch Data</h2>
      </div>

      <ScoreSubmitButton totalPoints={10} score={10} />

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Testing Instructions</h2>
        <ol className="list-decimal pl-5">
          <li className="mb-2">Launch your tool from Moodle</li>
          <li className="mb-2">Navigate to this debug page</li>
          <li className="mb-2">Check if LTI parameters are present</li>
        </ol>
      </div>
    </div>
  );
}

export default function DebugPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LaunchContent />
    </Suspense>
  );
}
