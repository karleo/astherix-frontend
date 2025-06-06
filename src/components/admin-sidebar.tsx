"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Users, FileText, ShieldCheck, User, Bell, Home, LogOut, Crown, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"

export function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { state, toggleSidebar } = useSidebar()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    toast.success("Logged out successfully", {
      description: "You have been logged out of the admin panel",
    })
    router.push("/")
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
    },
    {
      title: "Employee Management",
      icon: Users,
      path: "/dashboard/employees",
    },
    {
      title: "Document Management",
      icon: FileText,
      path: "/dashboard/documents",
    },
    {
      title: "Role Management",
      icon: ShieldCheck,
      path: "/dashboard/roles",
    },
    {
      title: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/dashboard/notifications",
      badge: "3",
    },
  ]

  const isCollapsed = state === "collapsed"

  return (
    <TooltipProvider>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarHeader className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src="/images.png" alt="Company Logo" />
              <AvatarFallback className="text-xs sm:text-sm">AC</AvatarFallback>
            </Avatar>
            {!isCollapsed && <div className="font-semibold text-sm sm:text-base truncate">Astherix Panel</div>}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
            </TooltipContent>
          </Tooltip>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild isActive={pathname === item.path} tooltip={item.title}>
                      <Link href={item.path} className="flex items-center gap-2">
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                {item.badge && !isCollapsed && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                {item.badge && isCollapsed && (
                  <div className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></div>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-3 sm:p-4">
          <div className={`flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 ${isCollapsed ? "justify-center" : ""}`}>
            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
              <AvatarImage src="/diverse-user-avatars.png" alt="User" />
              <AvatarFallback className="text-xs sm:text-sm">JD</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">John Doe</p>
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground truncate">Super Admin</p>
                </div>
              </div>
            )}
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={`${isCollapsed ? "w-10 h-10 p-0" : "w-full justify-start"} text-xs sm:text-sm`}
                onClick={handleLogout}
              >
                <LogOut className={`h-3 w-3 sm:h-4 sm:w-4 ${!isCollapsed ? "mr-2" : ""} flex-shrink-0`} />
                {!isCollapsed && "Logout"}
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}
