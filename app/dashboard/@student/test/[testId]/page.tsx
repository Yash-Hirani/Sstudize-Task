"use client";

// import { prisma } from "@/utils/prisma";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const testId = params.testId;
  //   const test = await prisma.test.findUnique({
  //     where: { id: String(testId) },
  //     include: {
  //       testQuestions: {
  //         include: {
  //           question: {
  //             include: { options: true },
  //           },
  //         },
  //       },
  //     },
  //   });

  //   if (!test) {
  //     return <div className="p-4">Test not found.</div>;
  //   }
  console.log(testId);
  return (
    <div className="p-4">
      {testId}
      {String(testId)} was intended here
      {/* <h1 className="text-xl font-semibold">{test.name}</h1>
      {test.testQuestions.map(({ question }) => (
        <div key={question.id} className="mb-6">
          <h2 className="font-medium">{question.text}</h2>
          <ul className="list-disc ml-6 mt-2">
            {question.options.map((opt) => (
              <li key={opt.id}>{opt.text}</li>
            ))}
          </ul>
        </div>
      ))} */}
    </div>
  );
}
