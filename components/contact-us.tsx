"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";

export default function ContactUs() {
  return (
    <section id="contact" className="py-24 px-4 bg-white scroll-mt-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="space-y-10" id="contact-info">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-black">Contact Us</h2>
            <p className="text-lg text-slate-600 max-w-xl">
              Have questions or need assistance? Reach out to our team and we’ll
              get back to you as soon as possible.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-semibold text-black">Email</h4>
                <p className="text-slate-600">support@examportal.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-semibold text-black">Phone</h4>
                <p className="text-slate-600">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-emerald-500 mt-1" />
              <div>
                <h4 className="font-semibold text-black">Address</h4>
                <p className="text-slate-600">
                  123 Education Street
                  <br />
                  Learning City, ED 12345
                  <br />
                  United States
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-200">
            <h4 className="font-semibold text-black mb-4">Office Hours</h4>
            <p className="text-slate-600">
              Monday - Friday: 9:00 AM - 6:00 PM
              <br />
              Saturday: 10:00 AM - 2:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Right Side Image Placeholder */}
        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg relative">
          <Image
            src="/image2.png"
            alt="Student with book and test"
            height="700"
            width="500"
            priority
          />
        </div>
      </div>
    </section>
  );
}
