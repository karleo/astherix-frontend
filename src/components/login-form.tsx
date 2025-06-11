"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('API_URL', API_URL)


export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      console.log('Response:', data)      
      
      if (!response.ok) {
      //  const data = await response.json()  

        setError(data.message || "Login failed")
        toast.error("Login failed", {
          description: data.message || "Login failed",
        })
        setIsLoading(false)
        return
      }
      toast.success("Login successful", {        
        description: "Welcome to the admin panel",
      })      
      localStorage.setItem("token", data.data.token) // Replace with actual token from response if available      
      localStorage.setItem("isAuthenticated", "true")
      // // localStorage.setItem("userEmail", email) 
      // // localStorage.setItem("userRole", "admin") // Assuming admin role for this example 
      // // localStorage.setItem("userName", "Admin") // Assuming admin name for this example



    router.push("/dashboard")
    } catch (err) {
      setError("Failed to login. Please try again.")
      toast.error("Login failed", {
        description: "Failed to login. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto">
      {/* Left side - Login Form */}
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access the astherix panel</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">Forgot your password? Contact your administrator</p>
          </CardFooter>
        </Card>
      </div>

      {/* Right side - Company Logo/Branding */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-8">
        <div className="text-center space-y-6">
          {/* Company Logo */}
          <div className="flex justify-center">
            <img src="/images.png" alt="Company Logo" className="h-32 w-32 object-contain" />
          </div>

          {/* Company Name and Tagline */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Astherix Portal</h2>
            <p className="text-lg text-gray-600">Streamline Your Business Operations</p>
          </div>

          {/* Features List */}
          <div className="space-y-3 text-left max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Employee Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Document Management</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Role & Permissions</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Analytics & Reports</span>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="w-64 h-64 border-4 border-blue-200 rounded-full"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-5">
              <div className="w-48 h-48 border-4 border-indigo-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
