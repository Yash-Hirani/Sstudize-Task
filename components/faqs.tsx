"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faqs() {
  const faqItems = [
    {
      question: "How do I register for an exam?",
      answer:
        "After logging in, navigate to the 'Available Exams' section, select the exam you wish to take, and click on 'Register'. Follow the prompts to complete your registration.",
    },
    {
      question: "Can I review my past exam results?",
      answer: "work in progress",
    },
    {
      question: "How do teachers create exams?",
      answer:
        "Teachers can create exams by logging in to their account, navigating to 'Create Exam', and following the step-by-step process to set up questions, time limits, and other parameters.",
    },
    {
      question: "Is there a time limit for exams?",
      answer:
        "Yes, most exams have a time limit set by the teacher. The remaining time will be displayed during the exam, and the system will automatically submit your answers when time expires.",
    },
    {
      question: "Can I use the platform on mobile devices?",
      answer: "hope",
    },
    {
      question: "How secure is the exam environment?",
      answer:
        "We employ multiple security measures including browser lockdown options, randomized questions, and proctoring tools to ensure the integrity of the examination process.",
    },
  ];

  return (
    <section id="faqs" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Find answers to common questions about our exam portal.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
