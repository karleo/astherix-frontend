"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { EmployeeForm } from "@/components/employee-form"
import { toast } from "sonner"

export default function EmployeesPage() {
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false)

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      department: "Engineering",
      role: "Senior Developer",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      department: "Marketing",
      role: "Marketing Manager",
      status: "Active",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      department: "HR",
      role: "HR Specialist",
      status: "On Leave",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily@example.com",
      department: "Finance",
      role: "Financial Analyst",
      status: "Active",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      department: "Engineering",
      role: "Developer",
      status: "Inactive",
    },
  ]

  const handleEmployeeAdded = () => {
    toast.success("Employee added successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-sm sm:text-base text-muted-foreground">Manage your organization's employees</p>
          </div>
          <Button onClick={() => setIsAddEmployeeOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-8" />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            Filters
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="hidden md:table-cell min-w-[200px]">Email</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[120px]">Department</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[120px]">Role</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{employee.name}</span>
                      <span className="text-xs text-muted-foreground md:hidden">{employee.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{employee.email}</TableCell>
                  <TableCell className="hidden lg:table-cell">{employee.department}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-col">
                      <span>{employee.role}</span>
                      <span className="text-xs text-muted-foreground lg:hidden">{employee.department}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : employee.status === "On Leave"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {employee.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <EmployeeForm open={isAddEmployeeOpen} onOpenChange={setIsAddEmployeeOpen} onSuccess={handleEmployeeAdded} />
    </div>
  )
}
