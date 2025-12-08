"use client";

import {
  Clock,
  CheckCircle,
  Mail,
  MessageSquare,
  ArrowLeft,
  Home,
  Users,
  Shield,
  FileCheck,
  Bell,
  ArrowRight,
  Sparkles,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ApprovalWaitPage() {
  const [progress, setProgress] = useState(25);
  const [timeRemaining, setTimeRemaining] = useState(120); // 2 hours in minutes

  useEffect(() => {
    // Simulate progress updates
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Success Animation with Logo */}
        <div className="text-center animate-in fade-in duration-1000 mb-12">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
                <img 
                  src="/ted.ico" 
                  alt="TEDBEER Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-lg font-bold text-yellow-600">✓</span>
              </div>
            </div>
            
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold">Application Submitted Successfully</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome to TEDBEER!
              </h1>
              
              <p className="text-xl text-blue-700/80 max-w-2xl mx-auto">
                Your application has been received and is now in the verification queue
              </p>
            </div>
          </div>
        </div>

        {/* Main Status Card */}
        <Card className="shadow-2xl border border-blue-200 bg-white/95 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <CardTitle className="text-3xl font-bold text-blue-900">
                  Account Verification in Progress
                </CardTitle>
                <CardDescription className="text-blue-700/80 text-lg">
                  Our compliance team is reviewing your application
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Progress Bar */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-900">Verification Progress</span>
                <span className="text-sm font-bold text-blue-600">{progress}%</span>
              </div>
              <div className="relative">
                <Progress value={progress} className="h-3" indicatorClassName="bg-gradient-to-r from-blue-600 to-cyan-500" />
                <div className="absolute -top-8 left-0 right-0 flex justify-between">
                  <span className="text-xs text-blue-600">Submitted</span>
                  <span className="text-xs text-blue-600">Reviewing</span>
                  <span className="text-xs text-blue-600">Verifying</span>
                  <span className="text-xs text-blue-600">Approved</span>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="text-sm text-blue-700/80">Avg. Processing Time</div>
                  </div>
                </div>
              </div>

              <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-900">98%</div>
                    <div className="text-sm text-cyan-700/80">Approval Rate</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-900">24/7</div>
                    <div className="text-sm text-green-700/80">Support Available</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Steps */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                Verification Process
              </h3>
              
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Document Verification",
                    description: "Reviewing submitted documents and information",
                    icon: FileCheck,
                    color: "bg-blue-500",
                    status: "completed",
                  },
                  {
                    step: 2,
                    title: "Background Check",
                    description: "Conducting security and compliance verification",
                    icon: Shield,
                    color: "bg-cyan-500",
                    status: "in-progress",
                  },
                  {
                    step: 3,
                    title: "Account Activation",
                    description: "Final approval and system access setup",
                    icon: Award,
                    color: "bg-green-500",
                    status: "pending",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white font-bold">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-blue-900">{item.title}</h4>
                        <Badge 
                          className={`
                            ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-gray-100 text-gray-800'}
                          `}
                        >
                          {item.status === 'completed' ? '✓ Completed' : 
                           item.status === 'in-progress' ? '⏳ In Progress' : 
                           '⏱️ Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-blue-700/80 mt-1">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Channels */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-3">
                <Bell className="w-6 h-6 text-blue-600" />
                How You'll Be Notified
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="group bg-white rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">SMS Notification</h4>
                      <p className="text-sm text-blue-700/80 mb-3">
                        Instant SMS confirmation at your registered phone number
                      </p>
                      <Badge variant="outline" className="border-blue-200 text-blue-600">
                        Real-time Updates
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="group bg-white rounded-2xl p-6 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Email Notification</h4>
                      <p className="text-sm text-blue-700/80 mb-3">
                        Detailed account information and access credentials
                      </p>
                      <Badge variant="outline" className="border-purple-200 text-purple-600">
                        Complete Details
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-yellow-600" />
                <h3 className="text-lg font-bold text-yellow-800">Important Notes</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Keep your phone accessible for SMS notifications",
                  "Check your email spam folder regularly",
                  "You can try logging in after receiving approval",
                  "Contact support if no response within 24 hours",
                  "Have your application reference number ready",
                  "Ensure your email and phone are correctly entered",
                ].map((note, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-yellow-600 text-sm">•</span>
                    </div>
                    <span className="text-sm text-yellow-700">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-6 pt-8 border-t border-blue-200">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button
                asChild
                className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                <Link href="/login" className="flex items-center justify-center gap-3">
                  <span>Try Login (After Approval)</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button
                variant="outline"
                asChild
                className="flex-1 h-14 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 font-bold rounded-xl transition-all duration-300 group"
              >
                <Link href="/" className="flex items-center justify-center gap-3">
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Back to Homepage</span>
                </Link>
              </Button>
            </div>

            {/* Support Contact */}
            <div className="text-center w-full">
              <p className="text-sm text-blue-700/80 mb-3">Need immediate assistance?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">+251-911-123456</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">support@tedbeer.com</span>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 left-10 opacity-10 pointer-events-none">
        <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-3xl"></div>
      </div>
      <div className="absolute top-10 right-10 opacity-10 pointer-events-none">
        <div className="w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}