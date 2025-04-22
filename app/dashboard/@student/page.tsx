"use server";

import { auth } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const dashServer = async () => {
  const session = await auth();

  // Get only basic test information
  const tests = await prisma.test.findMany({
    where: {
      users: {
        some: {
          user: {
            email: session?.user?.email ?? "",
          },
        },
      },
    },
  });

  // Separate upcoming and past tests
  const now = new Date();
  const upcomingTests = tests.filter((test) => new Date(test.startTime) > now);
  const pastTests = tests.filter((test) => new Date(test.startTime) <= now);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-emerald-700">Student Dashboard</h1>

      {/* Upcoming Tests Section */}
      {upcomingTests.length > 0 && (
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test) => (
                <Link
                  href={`/dashboard/test/${test.id}`}
                  key={test.id}
                  className="block p-4 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{test.name}</span>
                    <span className="text-sm text-emerald-600">
                      {new Date(test.startTime).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Tests Section */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Your Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastTests.map((test) => (
              <Link
                href={`/dashboard/test/${test.id}`}
                key={test.id}
                className="block p-4 rounded-lg border border-emerald-100 hover:bg-emerald-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{test.name}</span>
                  <span className="text-sm text-emerald-600">
                    {new Date(test.startTime).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default dashServer;
