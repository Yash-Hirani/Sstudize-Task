"use server"

import { prisma } from "@/utils/prisma"

export default async function getTestData({testId}: {testId: string}) {
    const questions = await prisma.test.findMany({
        where: {
            id: testId,
        }, 
        include: {
            testQuestions: {
                include: {
                    question: {
                        include: {
                            options: true,
                        }
                    }
                }
            } 
        }
    })

    return questions;
}