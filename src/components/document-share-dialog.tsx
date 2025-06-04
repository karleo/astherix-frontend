"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Share2, Users, Eye, Edit3, Upload, Trash2, Search, X, Crown, Shield, User, UserCheck } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DocumentShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: {
    id: string
    name: string
    type: string
    permissions: {
      owner: string
      canView: string[]
      canEdit: string[]
      canUpload: string[]
      canDelete: string[]
    }
    isShared: boolean
    sharedWith: string[]
  } | null
  onShare: (documentId: string, users: string[], permissions: any) => void
  currentUser: string
  currentUserRole: string
}

// Mock users data - in a real app, this would come from your user management system
const availableUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "Super Admin", avatar: "/diverse-user-avatars.png" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", role: "Admin", avatar: "/diverse-user-avatars.png" },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    role: "Manager",
    avatar: "/diverse-user-avatars.png",
  },
  { id: "4", name: "Emily Davis", email: "emily@example.com", role: "Employee", avatar: "/diverse-user-avatars.png" },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael@example.com",
    role: "Employee",
    avatar: "/diverse-user-avatars.png",
  },
  { id: "6", name: "Sarah Connor", email: "sarah@example.com", role: "Manager", avatar: "/diverse-user-avatars.png" },
  { id: "7", name: "Mike Johnson", email: "mike@example.com", role: "Employee", avatar: "/diverse-user-avatars.png" },
  { id: "8", name: "Lisa Anderson", email: "lisa@example.com", role: "Admin", avatar: "/diverse-user-avatars.png" },
]

export function DocumentShareDialog({
  open,
  onOpenChange,
  document,
  onShare,
  currentUser,
  currentUserRole,
}: DocumentShareDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [permissions, setPermissions] = useState({
    canView: [] as string[],
    canEdit: [] as string[],
    canUpload: [] as string[],
    canDelete: [] as string[],
  })
  const [shareWithAll, setShareWithAll] = useState(false)
  const [defaultPermissionLevel, setDefaultPermissionLevel] = useState("view")

  // Reset state when dialog opens/closes or document changes
  useEffect(() => {
    if (open && document) {
      setSelectedUsers(document.sharedWith || [])
      setPermissions({
        canView: document.permissions.canView.filter((user) => user !== "all"),
        canEdit: document.permissions.canEdit || [],
        canUpload: document.permissions.canUpload || [],
        canDelete: document.permissions.canDelete || [],
      })
      setShareWithAll(document.permissions.canView.includes("all"))
      setSearchQuery("")
    } else {
      setSelectedUsers([])
      setPermissions({
        canView: [],
        canEdit: [],
        canUpload: [],
        canDelete: [],
      })
      setShareWithAll(false)
      setSearchQuery("")
    }
  }, [open, document])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Super Admin":
        return <Crown className="h-3 w-3 text-yellow-500" />
      case "Admin":
        return <Shield className="h-3 w-3 text-blue-500" />
      case "Manager":
        return <UserCheck className="h-3 w-3 text-green-500" />
      default:
        return <User className="h-3 w-3 text-gray-500" />
    }
  }

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name !== currentUser && // Don't show current user
      user.name !== document?.permissions.owner && // Don't show document owner
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleUserSelect = (userName: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userName])
      // Auto-assign view permission when user is selected
      if (!permissions.canView.includes(userName)) {
        setPermissions((prev) => ({
          ...prev,
          canView: [...prev.canView, userName],
        }))
      }
    } else {
      setSelectedUsers(selectedUsers.filter((user) => user !== userName))
      // Remove all permissions when user is deselected
      setPermissions((prev) => ({
        canView: prev.canView.filter((user) => user !== userName),
        canEdit: prev.canEdit.filter((user) => user !== userName),
        canUpload: prev.canUpload.filter((user) => user !== userName),
        canDelete: prev.canDelete.filter((user) => user !== userName),
      }))
    }
  }

  const handlePermissionChange = (userName: string, permission: keyof typeof permissions, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: checked ? [...prev[permission], userName] : prev[permission].filter((user) => user !== userName),
    }))
  }

  const handleShareWithAllChange = (checked: boolean) => {
    setShareWithAll(checked)
    if (checked) {
      // When sharing with all, clear individual user selections
      setSelectedUsers([])
      setPermissions({
        canView: [],
        canEdit: [],
        canUpload: [],
        canDelete: [],
      })
    }
  }

  const applyDefaultPermissions = () => {
    const updatedPermissions = { ...permissions }

    selectedUsers.forEach((userName) => {
      // Ensure view permission is always included
      if (!updatedPermissions.canView.includes(userName)) {
        updatedPermissions.canView.push(userName)
      }

      // Apply additional permissions based on default level
      switch (defaultPermissionLevel) {
        case "edit":
          if (!updatedPermissions.canEdit.includes(userName)) {
            updatedPermissions.canEdit.push(userName)
          }
          break
        case "upload":
          if (!updatedPermissions.canEdit.includes(userName)) {
            updatedPermissions.canEdit.push(userName)
          }
          if (!updatedPermissions.canUpload.includes(userName)) {
            updatedPermissions.canUpload.push(userName)
          }
          break
        case "full":
          if (!updatedPermissions.canEdit.includes(userName)) {
            updatedPermissions.canEdit.push(userName)
          }
          if (!updatedPermissions.canUpload.includes(userName)) {
            updatedPermissions.canUpload.push(userName)
          }
          if (!updatedPermissions.canDelete.includes(userName)) {
            updatedPermissions.canDelete.push(userName)
          }
          break
      }
    })

    setPermissions(updatedPermissions)
  }

  const handleSubmit = () => {
    if (!document) return

    const finalPermissions = {
      ...document.permissions,
      canView: shareWithAll ? ["all"] : permissions.canView,
      canEdit: permissions.canEdit,
      canUpload: permissions.canUpload,
      canDelete: permissions.canDelete,
    }

    onShare(document.id, shareWithAll ? ["all"] : selectedUsers, finalPermissions)
  }

  const canManageSharing =
    currentUserRole === "Super Admin" || currentUserRole === "Admin" || document?.permissions.owner === currentUser

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-blue-500" />
            Share Document: {document.name}
          </DialogTitle>
          <DialogDescription>Manage who can access this document and their permission levels</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="users" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Select Users</TabsTrigger>
            <TabsTrigger value="permissions">Manage Permissions</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-auto max-h-[calc(90vh-250px)]">
            <TabsContent value="users" className="space-y-4">
              {/* Share with All Option */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Quick Share Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="share-all"
                      checked={shareWithAll}
                      onCheckedChange={handleShareWithAllChange}
                      disabled={!canManageSharing}
                    />
                    <Label htmlFor="share-all" className="text-sm font-medium">
                      Share with all registered users
                    </Label>
                    <Badge variant="secondary" className="text-xs">
                      View Only
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    When enabled, all registered users will have view access to this document
                  </p>
                </CardContent>
              </Card>

              {!shareWithAll && (
                <>
                  {/* User Search */}
                  <div className="space-y-2">
                    <Label>Search Users</Label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-2 h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Default Permission Level */}
                  <div className="space-y-2">
                    <Label>Default Permission Level for Selected Users</Label>
                    <div className="flex gap-2">
                      <Select value={defaultPermissionLevel} onValueChange={setDefaultPermissionLevel}>
                        <SelectTrigger className="w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="view">View Only</SelectItem>
                          <SelectItem value="edit">View & Edit</SelectItem>
                          <SelectItem value="upload">View, Edit & Upload</SelectItem>
                          <SelectItem value="full">Full Access</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={applyDefaultPermissions}
                        disabled={selectedUsers.length === 0}
                      >
                        Apply to Selected
                      </Button>
                    </div>
                  </div>

                  {/* User List */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Available Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-64">
                        <div className="space-y-2">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user.id}
                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50"
                              >
                                <Checkbox
                                  checked={selectedUsers.includes(user.name)}
                                  onCheckedChange={(checked) => handleUserSelect(user.name, checked as boolean)}
                                  disabled={!canManageSharing}
                                />
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium truncate">{user.name}</p>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger>{getRoleIcon(user.role)}</TooltipTrigger>
                                        <TooltipContent>
                                          <p>{user.role}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No users found</p>
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
              {/* Current Owner */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Document Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/diverse-user-avatars.png" />
                      <AvatarFallback className="text-xs">
                        {document.permissions.owner
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{document.permissions.owner}</p>
                      <p className="text-xs text-muted-foreground">Owner (Full Access)</p>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">Owner</Badge>
                  </div>
                </CardContent>
              </Card>

              {shareWithAll ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Public Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                      <Users className="h-8 w-8 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">All Registered Users</p>
                        <p className="text-xs text-muted-foreground">View access for everyone</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Public</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : selectedUsers.length > 0 ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">User Permissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64">
                      <div className="space-y-3">
                        {selectedUsers.map((userName) => {
                          const user = availableUsers.find((u) => u.name === userName)
                          if (!user) return null

                          return (
                            <div key={userName} className="border rounded-lg p-3">
                              <div className="flex items-center space-x-3 mb-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {user.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {user.role}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${userName}-view`}
                                    checked={permissions.canView.includes(userName)}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(userName, "canView", checked as boolean)
                                    }
                                    disabled={!canManageSharing}
                                  />
                                  <Label htmlFor={`${userName}-view`} className="text-xs flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    View
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${userName}-edit`}
                                    checked={permissions.canEdit.includes(userName)}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(userName, "canEdit", checked as boolean)
                                    }
                                    disabled={!canManageSharing}
                                  />
                                  <Label htmlFor={`${userName}-edit`} className="text-xs flex items-center gap-1">
                                    <Edit3 className="h-3 w-3" />
                                    Edit
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${userName}-upload`}
                                    checked={permissions.canUpload.includes(userName)}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(userName, "canUpload", checked as boolean)
                                    }
                                    disabled={!canManageSharing}
                                  />
                                  <Label htmlFor={`${userName}-upload`} className="text-xs flex items-center gap-1">
                                    <Upload className="h-3 w-3" />
                                    Upload
                                  </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${userName}-delete`}
                                    checked={permissions.canDelete.includes(userName)}
                                    onCheckedChange={(checked) =>
                                      handlePermissionChange(userName, "canDelete", checked as boolean)
                                    }
                                    disabled={!canManageSharing || currentUserRole !== "Super Admin"}
                                  />
                                  <Label htmlFor={`${userName}-delete`} className="text-xs flex items-center gap-1">
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </Label>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Users className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">No users selected for sharing</p>
                    <p className="text-xs text-muted-foreground">Go to the Users tab to select users</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canManageSharing}>
            {shareWithAll || selectedUsers.length > 0 ? "Update Sharing" : "Remove Sharing"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
