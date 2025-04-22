"use client";

import AuthModal from "@/components/auth-modal";
import AboutUs from "@/components/about-us";
import Faqs from "@/components/faqs";
import ContactUs from "@/components/contact-us";

import { BookOpen, CheckCircle, Users } from "lucide-react";
import { useGsapScroll } from "./hooks/useGsapScroll";

export default function Home() {
  useGsapScroll(".section");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <section className="section py-2 relative bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Path to Academic Excellence
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl">
            A comprehensive exam platform designed for both students and
            teachers to enhance the learning experience.
          </p>
          <AuthModal />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <BookOpen className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Tests
              </h3>
              <p>Access a wide range of exams tailored to your curriculum</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <CheckCircle className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold mb-2">Instant Results</h3>
              <p>Get immediate feedback and detailed performance analysis</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
              <Users className="h-10 w-10 mb-4 text-emerald-400" />
              <h3 className="text-xl font-semibold mb-2">
                Collaborative Learning
              </h3>
              <p>Connect with teachers and peers for enhanced learning</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* About Us Section */}
      <section className="section py-2 bg-slate-900 text-white ">
        <AboutUs />
      </section>

      {/* FAQs Section */}
      <section className="section py-10 bg-slate-800 text-white ">
        <Faqs />
      </section>

      {/* Contact Us Section */}
      <section className="section bg-slate-900 text-white py-2">
        <ContactUs />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4">
            © {new Date().getFullYear()} Exam Portal. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
