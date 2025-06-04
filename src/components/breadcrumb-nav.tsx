"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumbNavProps {
  customItems?: Array<{
    label: string
    href?: string
    isCurrentPage?: boolean
  }>
}

export function BreadcrumbNav({ customItems }: BreadcrumbNavProps) {
  const pathname = usePathname()

  // Define route mappings for better breadcrumb labels
  const routeLabels: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/dashboard/employees": "Employee Management",
    "/dashboard/documents": "Document Management",
    "/dashboard/roles": "Role Management",
    "/dashboard/profile": "Profile",
    "/dashboard/notifications": "Notifications",
  }

  // Generate breadcrumb items from pathname if no custom items provided
  const generateBreadcrumbItems = () => {
    if (customItems) {
      return customItems
    }

    const pathSegments = pathname.split("/").filter(Boolean)
    const items = []

    // Always start with Dashboard as home
    items.push({
      label: "Dashboard",
      href: "/dashboard",
      isCurrentPage: pathname === "/dashboard",
    })

    // Build path progressively
    let currentPath = ""
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`

      // Skip the first segment if it's "dashboard" since we already added it
      if (pathSegments[i] === "dashboard") continue

      const isLast = i === pathSegments.length - 1
      const label = routeLabels[currentPath] || pathSegments[i].charAt(0).toUpperCase() + pathSegments[i].slice(1)

      items.push({
        label,
        href: isLast ? undefined : currentPath,
        isCurrentPage: isLast,
      })
    }

    return items
  }

  const breadcrumbItems = generateBreadcrumbItems()

  // Don't show breadcrumbs if we're only on dashboard
  if (breadcrumbItems.length <= 1) {
    return null
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
            <BreadcrumbItem>
              {item.isCurrentPage ? (
                <BreadcrumbPage className="font-medium">{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href!} className="flex items-center gap-1 hover:text-foreground transition-colors">
                    {index === 0 && <Home className="h-3 w-3" />}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
