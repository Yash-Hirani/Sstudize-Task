"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SignIn from "@/components/signIn";
import { GraduationCap, UserCog } from "lucide-react";

export default function AuthModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-6 text-lg"
        >
          Get Started
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Choose Your Role
          </DialogTitle>
          <DialogDescription className="text-center">
            Select whether you are a student or a teacher to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
              <GraduationCap className="h-10 w-10 text-slate-700" />
            </div>
            <SignIn buttonText="Student Sign Up" redirect="/sign-up/student" />
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
              <UserCog className="h-10 w-10 text-slate-700" />
            </div>
            <SignIn buttonText="Teacher Sign Up" redirect="/sign-up/teacher" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
