import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, Edit, Trash2, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RolesPage() {
  // Sample role data
  const roles = [
    {
      id: 1,
      name: "Administrator",
      description: "Full access to all resources",
      users: 3,
      permissions: {
        employees: { view: true, create: true, edit: true, delete: true },
        documents: { view: true, create: true, edit: true, delete: true },
        roles: { view: true, create: true, edit: true, delete: true },
      },
    },
    {
      id: 2,
      name: "Manager",
      description: "Access to manage employees and view documents",
      users: 8,
      permissions: {
        employees: { view: true, create: true, edit: true, delete: false },
        documents: { view: true, create: true, edit: true, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
      },
    },
    {
      id: 3,
      name: "Employee",
      description: "Limited access to resources",
      users: 42,
      permissions: {
        employees: { view: true, create: false, edit: false, delete: false },
        documents: { view: true, create: false, edit: false, delete: false },
        roles: { view: false, create: false, edit: false, delete: false },
      },
    },
    {
      id: 4,
      name: "HR Specialist",
      description: "Access to employee management",
      users: 5,
      permissions: {
        employees: { view: true, create: true, edit: true, delete: false },
        documents: { view: true, create: true, edit: false, delete: false },
        roles: { view: true, create: false, edit: false, delete: false },
      },
    },
    {
      id: 5,
      name: "Document Manager",
      description: "Access to document management",
      users: 7,
      permissions: {
        employees: { view: true, create: false, edit: false, delete: false },
        documents: { view: true, create: true, edit: true, delete: true },
        roles: { view: false, create: false, edit: false, delete: false },
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-sm sm:text-base text-muted-foreground">Manage roles and permissions</p>
          </div>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Role
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search roles..." className="pl-8" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="roles" className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles" className="text-xs sm:text-sm">
            Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs sm:text-sm">
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roles">
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Role Name</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[200px]">Description</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[80px]">Users</TableHead>
                    <TableHead className="w-[60px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{role.name}</span>
                          <span className="text-xs text-muted-foreground md:hidden">{role.description}</span>
                          <span className="text-xs text-muted-foreground sm:hidden">{role.users} users</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{role.description}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">{role.users}</TableCell>
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
        </TabsContent>

        <TabsContent value="permissions">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Role Permissions</CardTitle>
              <CardDescription className="text-sm">View and edit permissions for each role</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[120px]">Role</TableHead>
                        <TableHead colSpan={4} className="text-center border-r">
                          Employees
                        </TableHead>
                        <TableHead colSpan={4} className="text-center border-r">
                          Documents
                        </TableHead>
                        <TableHead colSpan={4} className="text-center">
                          Roles
                        </TableHead>
                      </TableRow>
                      <TableRow>
                        <TableHead></TableHead>
                        {/* Employees */}
                        <TableHead className="text-center text-xs">View</TableHead>
                        <TableHead className="text-center text-xs">Create</TableHead>
                        <TableHead className="text-center text-xs">Edit</TableHead>
                        <TableHead className="text-center text-xs border-r">Delete</TableHead>
                        {/* Documents */}
                        <TableHead className="text-center text-xs">View</TableHead>
                        <TableHead className="text-center text-xs">Create</TableHead>
                        <TableHead className="text-center text-xs">Edit</TableHead>
                        <TableHead className="text-center text-xs border-r">Delete</TableHead>
                        {/* Roles */}
                        <TableHead className="text-center text-xs">View</TableHead>
                        <TableHead className="text-center text-xs">Create</TableHead>
                        <TableHead className="text-center text-xs">Edit</TableHead>
                        <TableHead className="text-center text-xs">Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {roles.map((role) => (
                        <TableRow key={role.id}>
                          <TableCell className="font-medium text-sm">{role.name}</TableCell>
                          {/* Employees */}
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.employees.view} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.employees.create} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.employees.edit} disabled />
                          </TableCell>
                          <TableCell className="text-center border-r">
                            <Checkbox checked={role.permissions.employees.delete} disabled />
                          </TableCell>
                          {/* Documents */}
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.documents.view} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.documents.create} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.documents.edit} disabled />
                          </TableCell>
                          <TableCell className="text-center border-r">
                            <Checkbox checked={role.permissions.documents.delete} disabled />
                          </TableCell>
                          {/* Roles */}
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.roles.view} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.roles.create} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.roles.edit} disabled />
                          </TableCell>
                          <TableCell className="text-center">
                            <Checkbox checked={role.permissions.roles.delete} disabled />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
