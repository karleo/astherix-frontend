import { LoginForm } from "@/components/login-form"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full space-y-8">
        <div className="text-center lg:hidden">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to access your admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
