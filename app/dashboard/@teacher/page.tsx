// app/dashboard/@teacher/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  PlusCircle,
  BarChart3,
  Users,
  Clock,
  FileText,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";

// Sample data - in a real app, this would come from your API/database
const teacherStats = {
  activeTests: 4,
  totalStudents: 142,
  averageScore: 76.5,
  completionRate: 89.2,
  upcomingTests: 2,
};

const recentTests = [
  {
    id: 1,
    name: "Midterm Algebra",
    date: "April 15, 2025",
    participants: 32,
    averageScore: 78.5,
    status: "completed",
  },
  {
    id: 2,
    name: "Physics Quiz #3",
    date: "April 18, 2025",
    participants: 28,
    averageScore: 68.2,
    status: "completed",
  },
  {
    id: 3,
    name: "Biology Final",
    date: "April 22, 2025",
    participants: 45,
    averageScore: null,
    status: "active",
  },
  {
    id: 4,
    name: "Chemistry Lab Test",
    date: "April 24, 2025",
    participants: 37,
    averageScore: null,
    status: "scheduled",
  },
];

const TeacherDash = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Create Test Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Teacher Dashboard
            </h1>
            <p className="text-slate-500">
              Manage your tests and view student performance
            </p>
          </div>
          <Link href="/dashboard/test/create">
            <button className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors shadow-sm">
              <PlusCircle className="h-5 w-5 mr-2" />
              Create Test
            </button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Active Tests</span>
              <FileText className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {teacherStats.activeTests}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Total Students</span>
              <Users className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {teacherStats.totalStudents}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Average Score</span>
              <BarChart3 className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {teacherStats.averageScore}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Completion Rate</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {teacherStats.completionRate}%
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-500 text-sm">Upcoming Tests</span>
              <Calendar className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {teacherStats.upcomingTests}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-3 ${
                activeTab === "overview"
                  ? "border-b-2 border-emerald-600 text-emerald-600 font-medium"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`pb-3 ${
                activeTab === "tests"
                  ? "border-b-2 border-emerald-600 text-emerald-600 font-medium"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              My Tests
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`pb-3 ${
                activeTab === "students"
                  ? "border-b-2 border-emerald-600 text-emerald-600 font-medium"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Students
            </button>
          </div>
        </div>

        {/* Recent Tests Table */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h2 className="font-medium text-slate-800">Recent Tests</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 text-slate-700 text-sm">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Test Name</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium">
                    Participants
                  </th>
                  <th className="py-3 px-4 text-left font-medium">
                    Average Score
                  </th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTests.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {test.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{test.date}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {test.participants} students
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {test.averageScore ? `${test.averageScore}%` : "-"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${
                          test.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : test.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {test.status === "completed" && (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        )}
                        {test.status === "active" && (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {test.status === "scheduled" && (
                          <Calendar className="h-3 w-3 mr-1" />
                        )}
                        {test.status.charAt(0).toUpperCase() +
                          test.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button className="text-emerald-600 hover:text-emerald-800 text-sm">
                          View
                        </button>
                        {test.status !== "completed" && (
                          <button className="text-slate-600 hover:text-slate-800 text-sm">
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
            <Link
              href="/dashboard/tests"
              className="text-emerald-600 hover:text-emerald-800 text-sm font-medium"
            >
              View All Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDash;
