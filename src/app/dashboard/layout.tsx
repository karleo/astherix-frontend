"use client"

import type React from "react"
import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Bell, Search, User } from "lucide-react"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    setIsClient(true)
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")

    if (!isAuthenticated) {
      router.push("/")
    }

    // Show welcome notification on first load
    if (pathname === "/dashboard" && isAuthenticated) {
      toast.success("Welcome back!", {
        description: "You have 3 new notifications",
      })
    }
  }, [pathname, router])

  const getPageTitle = () => {
    const routeTitles: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/dashboard/users": "User Management",
      "/dashboard/employees": "Employee Management",
      "/dashboard/documents": "Document Management",
      "/dashboard/roles": "Role Management",
      "/dashboard/maintenance": "System Maintenance",
      "/dashboard/profile": "Profile",
      "/dashboard/notifications": "Notifications",
    }

    return (
      routeTitles[pathname] ||
      pathname.split("/").pop()?.charAt(0).toUpperCase() + pathname.split("/").pop()?.slice(1) ||
      "Dashboard"
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    toast.success("Logged out successfully", {
      description: "You have been securely logged out of your account",
    })
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast.info("Search initiated", {
        description: `Searching for "${searchQuery}"`,
      })
      // Handle search logic here
    }
  }

  if (!isClient) {
    return null // Prevent hydration errors
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SidebarProvider>
        <Suspense fallback={null}>
          <div className="flex min-h-screen w-full bg-background">
            <AdminSidebar />
            <SidebarInset className="flex-1 flex flex-col">
              <header className="sticky top-0 z-10 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background px-3 sm:px-6">
                <SidebarTrigger className="flex">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </SidebarTrigger>

                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <h1 className="text-base sm:text-lg font-semibold md:text-xl truncate">{getPageTitle()}</h1>
                  <div className="hidden sm:block">
                    <BreadcrumbNav />
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <form onSubmit={handleSearch} className="relative hidden sm:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="pl-10 pr-4 w-48 lg:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>

                  <ThemeToggle />

                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/diverse-user-avatars.png" alt="Admin" />
                          <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">John Doe</p>
                          <p className="text-xs leading-none text-muted-foreground">admin@company.com</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>

              {/* Mobile breadcrumbs - shown below header on small screens */}
              <div className="sm:hidden px-3 py-2 border-b bg-muted/30">
                <BreadcrumbNav />
              </div>

              <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto w-full max-w-full">{children}</main>
            </SidebarInset>
          </div>
        </Suspense>
        <Toaster position="top-right" richColors />
      </SidebarProvider>
    </ThemeProvider>
  )
}
