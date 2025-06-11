"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  Users,
  FileText,
  User,
  Bell,
  Home,
  LogOut,
  Crown,
  ChevronLeft,
  ChevronRight,
  Settings,
  ShieldCheck,
  Globe,
  Building2,
} from "lucide-react"
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
  SidebarGroup,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0">
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{isCollapsed ? "Expand sidebar" : "Collapse sidebar"}</p>
            </TooltipContent>
          </Tooltip> */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <Home className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Dashboard</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Dashboard</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Collapsible defaultOpen className="group/collapsible">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild tooltip="User Management">
                        <CollapsibleTrigger className="flex items-center gap-2 w-full">
                          <Users className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="truncate">User Management</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </>
                          )}
                        </CollapsibleTrigger>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <p>User Management</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/users"}>
                          <Link href="/dashboard/users">
                            <User className="h-4 w-4" />
                            <span>Users</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/roles"}>
                          <Link href="/dashboard/roles">
                            <ShieldCheck className="h-4 w-4" />
                            <span>Roles</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/employees"}
                      tooltip="Employee Management"
                    >
                      <Link href="/dashboard/employees" className="flex items-center gap-2">
                        <Users className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Employee Management</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Employee Management</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/documents"}
                      tooltip="Document Management"
                    >
                      <Link href="/dashboard/documents" className="flex items-center gap-2">
                        <FileText className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Document Management</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Document Management</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Collapsible defaultOpen className="group/collapsible">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild tooltip="Location Management">
                        <CollapsibleTrigger className="flex items-center gap-2 w-full">
                          <Globe className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && (
                            <>
                              <span className="truncate">Location Management</span>
                              <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                            </>
                          )}
                        </CollapsibleTrigger>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">
                        <p>Location Management</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/country"}>
                          <Link href="/dashboard/country">
                            <Globe className="h-4 w-4" />
                            <span>Countries</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild isActive={pathname === "/dashboard/city"}>
                          <Link href="/dashboard/city">
                            <Building2 className="h-4 w-4" />
                            <span>Cities</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/maintenance"} tooltip="Maintenance">
                      <Link href="/dashboard/maintenance" className="flex items-center gap-2">
                        <Settings className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Maintenance</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Maintenance</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton asChild isActive={pathname === "/dashboard/profile"} tooltip="Profile">
                      <Link href="/dashboard/profile" className="flex items-center gap-2">
                        <User className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Profile</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Profile</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/notifications"}
                      tooltip="Notifications"
                    >
                      <Link href="/dashboard/notifications" className="flex items-center gap-2">
                        <Bell className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="truncate">Notifications</span>}
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>Notifications</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                <SidebarMenuBadge>3</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
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
