"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { createTestWithQuestions } from "@/actions/createTest";
import { useRouter } from "next/navigation";

const CreateTest = ({ students }: { students: User[] }) => {
  const router = useRouter();
  const [testName, setTestName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    try {
      await createTestWithQuestions({
        name: testName,
        startTime,
        endTime,
        date,
        easy: easyCount,
        medium: mediumCount,
        hard: hardCount,
        users: selectedUsers,
      });

      // ✅ Redirect after success
      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to create test:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold">Create Test</h2>
      <input
        type="text"
        placeholder="Test Name"
        value={testName}
        onChange={(e) => setTestName(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="datetime-local"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label>Easy</label>
          <input
            type="number"
            value={easyCount}
            onChange={(e) => setEasyCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Medium</label>
          <input
            type="number"
            value={mediumCount}
            onChange={(e) => setMediumCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label>Hard</label>
          <input
            type="number"
            value={hardCount}
            onChange={(e) => setHardCount(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>

      <h3 className="font-semibold">Select Students</h3>
      <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-scroll border p-2 rounded">
        {students.map((student) => (
          <label key={student.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedUsers.includes(student.id)}
              onChange={() => toggleUser(student.id)}
            />
            {student.name || student.email}
          </label>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Test
      </button>
    </div>
  );
};

export default CreateTest;
