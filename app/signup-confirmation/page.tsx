"use client"

import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const translations = {
  en: {
    successTitle: "Registration Successful!",
    volunteerMsg: "Welcome to the ERCS Volunteer Community!",
    memberMsg: "Welcome to ERCS Membership!",
    idLabel: "Your ID:",
    emailConfirmation: "A confirmation email has been sent to your registered email address.",
    nextSteps: "Next Steps:",
    volunteerSteps: [
      "Check your email for confirmation and login credentials",
      "Complete your volunteer profile",
      "Browse available volunteer opportunities",
      "Start making an impact!",
    ],
    memberSteps: [
      "Check your email for confirmation and login credentials",
      "Proceed to payment to activate your membership",
      "Access member-only benefits and resources",
      "Stay connected with the ERCS community",
    ],
    proceedToPayment: "Proceed to Payment",
    backToHome: "Back to Home",
    backToSelection: "Back to Selection",
  },
  am: {
    successTitle: "ምዝገባ ተሳክቷል!",
    volunteerMsg: "ወደ ERCS Volunteer ማህበረሰብ እንኳን ደህና መጡ!",
    memberMsg: "ወደ ERCS አባልነት እንኳን ደህና መጡ!",
    idLabel: "የእርስዎ ID:",
    emailConfirmation: "ለተመዝገበ ኢሜይል አድራሻ ማረጋገጫ ኢሜይል ተልኩ።",
    nextSteps: "ቀጣይ ደረጃዎች:",
    volunteerSteps: [
      "ለማረጋገጥ ኢሜይልዎን ይመልከቱ እና ለመግባት ምስጢር ያግኙ",
      "የ volunteer ፕሮፋይልዎን ይሙሉ",
      "ተገኝ volunteer ዕድሎችን ይመልከቱ",
      "ተጽዕኖ ፍጠር!",
    ],
    memberSteps: [
      "ለማረጋገጥ ኢሜይልዎን ይመልከቱ እና ለመግባት ምስጢር ያግኙ",
      "አባልነትዎን ለማግበር ወደ ክፍያ ይቀጥሉ",
      "አባል-ብቻ ጠቀሜታ እና ሀብቶች ይደርሱ",
      "ከERCS ማህበረሰብ ጋር ተገናኝ",
    ],
    proceedToPayment: "ወደ ክፍያ ይቀጥሉ",
    backToHome: "ወደ ቤት ተመለስ",
    backToSelection: "ወደ ምርጫ ተመለስ",
  },
}

export default function SignupConfirmationPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "volunteer"
  const id = searchParams.get("id") || "ID-XXXXX"
  const [language, setLanguage] = useState("en")

  const t = translations[language as keyof typeof translations] || translations.en
  const isVolunteer = type === "volunteer"

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Header language={language} onLanguageChange={setLanguage} onSignupClick={() => {}} />

      <div className="flex-grow py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Card */}
          <Card className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-accent" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{t.successTitle}</h1>
            <p className="text-lg text-muted-foreground mb-6">{isVolunteer ? t.volunteerMsg : t.memberMsg}</p>

            {/* ID Display */}
            <div className="bg-muted rounded-lg p-6 mb-8">
              <p className="text-sm text-muted-foreground mb-2">{t.idLabel}</p>
              <p className="text-2xl font-bold text-foreground font-mono">{id}</p>
            </div>

            {/* Email Confirmation */}
            <div className="flex items-center justify-center gap-3 mb-8 p-4 bg-accent/10 border border-accent rounded-lg">
              <Mail className="w-5 h-5 text-accent flex-shrink-0" />
              <p className="text-sm text-foreground">{t.emailConfirmation}</p>
            </div>

            {/* Next Steps */}
            <div className="text-left mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">{t.nextSteps}</h2>
              <ol className="space-y-3">
                {(isVolunteer ? t.volunteerSteps : t.memberSteps).map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-foreground pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isVolunteer && (
                <Button className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  {t.proceedToPayment}
                </Button>
              )}
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full bg-transparent">
                  {t.backToHome}
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <Footer language={language} />
    </main>
  )
}
