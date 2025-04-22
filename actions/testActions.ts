"use server"

import { auth } from "@/utils/auth"
import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"

// Update test analytics with current state
export async function updateTestAnalytics({
  testId,
  userId,
  lastActiveQuestionId,
  timeSpent,
  tabSwitches,
  attemptedQuestionIds,
  skippedQuestionIds,
  markedQuestionIds,
}: {
  testId: string
  userId: string
  lastActiveQuestionId: string | null
  timeSpent: number
  tabSwitches: number
  attemptedQuestionIds: string[]
  skippedQuestionIds: string[]
  markedQuestionIds: string[]
}) {
  try {
    // Find existing analytics or create new one
    const existingAnalytics = await prisma.testAnalytics.findFirst({
      where: {
        testId,
        userId,
      },
    })

    if (existingAnalytics) {
      // Update existing analytics
      await prisma.testAnalytics.update({
        where: {
          id: existingAnalytics.id,
        },
        data: {
          lastActiveQuestionId,
          timeSpent,
          tabSwitches,
          attemptedQuestions: {
            set: attemptedQuestionIds.map((id) => ({ id })),
          },
          skippedQuestions: {
            set: skippedQuestionIds.map((id) => ({ id })),
          },
          markedQuestions: {
            set: markedQuestionIds.map((id) => ({ id })),
          },
        },
      })
    } else {
      // Create new analytics
      await prisma.testAnalytics.create({
        data: {
          test: {
            connect: {
              id: testId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          ...(lastActiveQuestionId
            ? {
                lastActiveQuestion: {
                  connect: {
                    id: lastActiveQuestionId,
                  },
                },
              }
            : {}),
          timeSpent,
          tabSwitches,
          attemptedQuestions: {
            connect: attemptedQuestionIds.map((id) => ({ id })),
          },
          skippedQuestions: {
            connect: skippedQuestionIds.map((id) => ({ id })),
          },
          markedQuestions: {
            connect: markedQuestionIds.map((id) => ({ id })),
          },
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update test analytics:", error)
    return { success: false, error: "Failed to update test analytics" }
  }
}

// Update question time and selected option
export async function updateQuestionTime({
  testId,
  questionId,
  userId,
  timeSpent,
  userOption,
}: {
  testId: string
  questionId: string
  userId: string
  timeSpent: number
  userOption: string | null
}) {
  try {
    // Find existing question time or create new one
    const existingQuestionTime = await prisma.questionTime.findUnique({
      where: {
        testId_questionId_userId: {
          testId,
          questionId,
          userId,
        },
      },
    })

    if (existingQuestionTime) {
      // Update existing question time
      await prisma.questionTime.update({
        where: {
          id: existingQuestionTime.id,
        },
        data: {
          timeSpent,
          userOption,
        },
      })
    } else {
      // Create new question time
      await prisma.questionTime.create({
        data: {
          test: {
            connect: {
              id: testId,
            },
          },
          question: {
            connect: {
              id: questionId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          timeSpent,
          userOption,
        },
      })
    }

    return { success: true }
  } catch (error) {
    console.error("Failed to update question time:", error)
    return { success: false, error: "Failed to update question time" }
  }
}

// Update multiple question times at once (for batch updates)
export async function updateMultipleQuestionTimes({
  questionTimes,
}: {
  questionTimes: Array<{
    testId: string
    questionId: string
    userId: string
    timeSpent: number
    userOption: string | null
  }>
}) {
  try {
    // Use Promise.all to update all question times in parallel
    await Promise.all(
      questionTimes.map(async (qt) => {
        await updateQuestionTime(qt)
      }),
    )

    return { success: true }
  } catch (error) {
    console.error("Failed to update multiple question times:", error)
    return { success: false, error: "Failed to update multiple question times" }
  }
}

// Submit test (final update of all data)
export async function submitTest({
  testId,
  userId,
  lastActiveQuestionId,
  timeSpent,
  tabSwitches,
  attemptedQuestionIds,
  skippedQuestionIds,
  markedQuestionIds,
  questionTimes,
}: {
  testId: string
  userId: string
  lastActiveQuestionId: string | null
  timeSpent: number
  tabSwitches: number
  attemptedQuestionIds: string[]
  skippedQuestionIds: string[]
  markedQuestionIds: string[]
  questionTimes: Array<{
    questionId: string
    timeSpent: number
    userOption: string | null
  }>
}) {
  try {
    // Update test analytics
    await updateTestAnalytics({
      testId,
      userId,
      lastActiveQuestionId,
      timeSpent,
      tabSwitches,
      attemptedQuestionIds,
      skippedQuestionIds,
      markedQuestionIds,
    })

    // Update all question times
    await Promise.all(
      questionTimes.map(async (qt) => {
        await updateQuestionTime({
          testId,
          questionId: qt.questionId,
          userId,
          timeSpent: qt.timeSpent,
          userOption: qt.userOption,
        })
      }),
    )

    // You could add additional logic here for test completion
    // For example, marking the test as completed in a separate table

    revalidatePath(`/test/${testId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to submit test:", error)
    return { success: false, error: "Failed to submit test" }
  }
}

export async function saveSelectedOptions({questionId, optionId, testId}: {questionId: string, optionId: string, testId: string}) {
    const session = await auth();

    const userData = await prisma.user.findUnique({where:{email: session?.user?.email ?? ""}})
    
    const x = await prisma.questionTime.update({
        where: {
            testId_questionId_userId: {
                questionId: questionId,
                userId: userData?.id ?? "", 
                testId: testId
            }
        }, 
        data: {
            userOption: optionId,
        }
    })
}