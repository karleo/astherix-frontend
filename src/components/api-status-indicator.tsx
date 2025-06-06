"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"
import { apiService } from "@/lib/api"

export function ApiStatusIndicator() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [authMode, setAuthMode] = useState<"api" | "demo" | null>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/health`, {
          method: "GET",
          signal: AbortSignal.timeout(3000),
        })
        setStatus(response.ok ? "connected" : "disconnected")
      } catch (error) {
        setStatus("disconnected")
      }

      setAuthMode(apiService.getAuthMode())
    }

    checkStatus()

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  if (status === "checking") {
    return (
      <Badge variant="secondary" className="text-xs">
        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse mr-1"></div>
        Checking...
      </Badge>
    )
  }

  if (status === "connected" && authMode === "api") {
    return (
      <Badge variant="default" className="text-xs bg-green-600">
        <Wifi className="w-3 h-3 mr-1" />
        API Connected
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="text-xs">
      <WifiOff className="w-3 h-3 mr-1" />
      Demo Mode
    </Badge>
  )
}
