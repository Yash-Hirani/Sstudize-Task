import { BookOpen, Award, Clock, Users } from "lucide-react";
import Image from "next/image";

export default function AboutUs() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We are dedicated to revolutionizing the way exams are conducted and
            making education more accessible and efficient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Image
              src="/sstudizeabout.png"
              alt="About Exam Portal"
              width={600}
              height={600}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="text-slate-600">
              At Exam Portal, we believe in the power of education to transform
              lives. Our mission is to provide a seamless, user-friendly
              platform that connects students and teachers, making the
              examination process more efficient, transparent, and effective.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-3">
                <BookOpen className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Comprehensive</h4>
                  <p className="text-sm text-slate-500">
                    Full range of exam tools and resources
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Excellence</h4>
                  <p className="text-sm text-slate-500">
                    Committed to the highest standards
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Efficiency</h4>
                  <p className="text-sm text-slate-500">
                    Save time with automated processes
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-emerald-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Community</h4>
                  <p className="text-sm text-slate-500">
                    Building connections between educators and learners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
