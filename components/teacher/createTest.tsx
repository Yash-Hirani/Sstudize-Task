"use client";

import { useState } from "react";
import { User } from "@prisma/client";
import { createTestWithQuestions } from "@/actions/createTest";
import { useRouter } from "next/navigation";
import {
  Clock,
  CalendarDays,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";

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
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-slate-800 border-b pb-4 mb-6 flex items-center">
          <BookOpen className="h-6 w-6 text-emerald-600 mr-2" />
          Create New Test
        </h2>

        <div className="space-y-6">
          {/* Test Basic Information */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-slate-700 font-medium">Test Name</span>
              <input
                type="text"
                placeholder="Enter test name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full p-3 mt-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-slate-700 font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-emerald-500" />
                  Start Time
                </span>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 mt-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-slate-700 font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-emerald-500" />
                  End Time
                </span>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 mt-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-slate-700 font-medium flex items-center">
                <CalendarDays className="h-4 w-4 mr-1 text-emerald-500" />
                Test Date
              </span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 mt-1 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </label>
          </div>

          {/* Question Difficulty Distribution */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-800 mb-3">
              Question Distribution
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 text-sm mb-1">
                  Easy Questions
                </label>
                <input
                  type="number"
                  min="0"
                  value={easyCount}
                  onChange={(e) => setEasyCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm mb-1">
                  Medium Questions
                </label>
                <input
                  type="number"
                  min="0"
                  value={mediumCount}
                  onChange={(e) =>
                    setMediumCount(parseInt(e.target.value) || 0)
                  }
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-700 text-sm mb-1">
                  Hard Questions
                </label>
                <input
                  type="number"
                  min="0"
                  value={hardCount}
                  onChange={(e) => setHardCount(parseInt(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Student Selection */}
          <div>
            <h3 className="font-medium text-slate-800 mb-2 flex items-center">
              <Users className="h-5 w-5 text-emerald-500 mr-1" />
              Assign to Students
            </h3>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-300 text-sm text-slate-600">
                Select students who will take this test
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto p-3">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      selectedUsers.includes(student.id)
                        ? "bg-emerald-50 border border-emerald-200"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                      checked={selectedUsers.includes(student.id)}
                      onChange={() => toggleUser(student.id)}
                    />
                    <span className="ml-2">
                      {student.name || student.email}
                    </span>
                  </label>
                ))}
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-300 text-sm text-slate-600">
                {selectedUsers.length} students selected
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center font-medium"
            >
              Create Test
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTest;
