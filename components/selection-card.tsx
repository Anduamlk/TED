"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type React from "react"

interface SelectionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  onClick: () => void
}

export function SelectionCard({ icon, title, description, buttonText, onClick }: SelectionCardProps) {
  return (
    <Card className="h-full flex flex-col p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-border hover:border-primary">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-foreground text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm text-center mb-6 flex-grow">{description}</p>
      <Button onClick={onClick} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
        {buttonText}
      </Button>
    </Card>
  )
}
