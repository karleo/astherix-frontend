"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Share2,
  Edit3,
  Trash2,
  Clock,
  FileIcon,
  Eye,
  MessageSquare,
  Plus,
  Save,
} from "lucide-react"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DocumentActivity {
  id: string
  action: "uploaded" | "modified" | "downloaded" | "viewed" | "shared" | "renamed" | "moved" | "commented"
  user: string
  userAvatar?: string
  timestamp: Date
  details?: string
  oldValue?: string
  newValue?: string
}

interface DocumentNote {
  id: string
  content: string
  author: string
  authorAvatar?: string
  createdAt: Date
  isPrivate: boolean
}

interface DocumentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: {
    id: string
    name: string
    type: string
    size: string
    uploadedBy: string
    uploadedAt: Date
    modifiedBy: string
    modifiedAt: Date
    folderId?: string | null
    description?: string
    tags?: string[]
    version?: string
    checksum?: string
    isShared?: boolean
    sharedWith?: string[]
    permissions?: {
      owner?: string
      canView?: string[]
      canEdit?: string[]
    }
  } | null
  onDownload?: (documentId: string) => void
  onShare?: (documentId: string) => void
  onDelete?: (documentId: string) => void
  onAddNote?: (documentId: string, note: string, isPrivate: boolean) => void
}

export function DocumentDetailsDialog({
  open,
  onOpenChange,
  document,
  onDownload,
  onShare,
  onDelete,
  onAddNote,
}: DocumentDetailsDialogProps) {
  const [newNote, setNewNote] = useState("")
  const [isPrivateNote, setIsPrivateNote] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)

  // Update the mockActivities to include more detailed version tracking and permission changes
  const mockActivities: DocumentActivity[] = [
    {
      id: "act-1",
      action: "uploaded",
      user: document?.uploadedBy || "Unknown",
      timestamp: document?.uploadedAt || new Date(),
      details: `Initial upload - Version ${document?.version || "1.0"}`,
    },
    {
      id: "act-2",
      action: "shared",
      user: "Jane Smith",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      details: "Document shared with Robert Johnson and Emily Davis",
    },
    {
      id: "act-3",
      action: "viewed",
      user: "Robert Johnson",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      details: "Opened for review",
    },
    {
      id: "act-4",
      action: "modified",
      user: document?.modifiedBy || "Unknown",
      timestamp: document?.modifiedAt || new Date(),
      details: `Content updated - Version ${document?.version || "1.0"} → ${document?.version || "1.1"}`,
      oldValue: "1.0",
      newValue: document?.version || "1.1",
    },
    {
      id: "act-5",
      action: "downloaded",
      user: "Robert Johnson",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      details: "Downloaded for external review",
    },
    {
      id: "act-6",
      action: "commented",
      user: "Emily Davis",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      details: "Added review comments and suggestions",
    },
    {
      id: "act-7",
      action: "renamed",
      user: "Jane Smith",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      details: "Document renamed for clarity",
      oldValue: "Marketing_Strategy_Draft.docx",
      newValue: document?.name || "Marketing Strategy.docx",
    },
  ]

  // Mock notes data
  const mockNotes: DocumentNote[] = [
    {
      id: "note-1",
      content:
        "This document needs to be reviewed by the legal team before final approval. Please ensure all compliance requirements are met.",
      author: "John Doe",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      isPrivate: false,
    },
    {
      id: "note-2",
      content:
        "Updated financial projections based on Q4 results. The revenue forecast has been adjusted upward by 12%.",
      author: "Jane Smith",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      isPrivate: false,
    },
    {
      id: "note-3",
      content:
        "Internal note: This document contains sensitive information. Restrict access to senior management only.",
      author: "Robert Johnson",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      isPrivate: true,
    },
  ]

  const getActionIcon = (action: DocumentActivity["action"]) => {
    switch (action) {
      case "uploaded":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "modified":
        return <Edit3 className="h-4 w-4 text-orange-500" />
      case "downloaded":
        return <Download className="h-4 w-4 text-green-500" />
      case "viewed":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "shared":
        return <Share2 className="h-4 w-4 text-indigo-500" />
      case "commented":
        return <MessageSquare className="h-4 w-4 text-pink-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getActionColor = (action: DocumentActivity["action"]) => {
    switch (action) {
      case "uploaded":
        return "bg-blue-100 text-blue-800"
      case "modified":
        return "bg-orange-100 text-orange-800"
      case "downloaded":
        return "bg-green-100 text-green-800"
      case "viewed":
        return "bg-purple-100 text-purple-800"
      case "shared":
        return "bg-indigo-100 text-indigo-800"
      case "commented":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim() || !document) return

    setIsAddingNote(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onAddNote?.(document.id, newNote, isPrivateNote)
    setNewNote("")
    setIsPrivateNote(false)
    setIsAddingNote(false)
  }

  const renderPreview = () => {
    if (!document) return null

    // This is a simplified preview - in a real app, you'd have proper file viewers
    switch (document.type) {
      case "PDF":
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileIcon className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">PDF Preview</p>
            <p className="text-xs text-gray-500">{document.name}</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Eye className="h-4 w-4 mr-2" />
              Open Full Preview
            </Button>
          </div>
        )
      case "Image":
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border">
            <img
              src="/placeholder.svg?height=200&width=300&text=Image Preview"
              alt={document.name}
              className="max-h-48 max-w-full object-contain rounded"
            />
            <p className="text-xs text-gray-500 mt-2">{document.name}</p>
          </div>
        )
      case "Document":
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileText className="h-16 w-16 text-blue-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Document Preview</p>
            <p className="text-xs text-gray-500">{document.name}</p>
            <Button variant="outline" size="sm" className="mt-4">
              <Eye className="h-4 w-4 mr-2" />
              Open in Editor
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FileIcon className="h-16 w-16 text-gray-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Preview not available</p>
            <p className="text-xs text-gray-500">{document.name}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => onDownload?.(document.id)}>
              <Download className="h-4 w-4 mr-2" />
              Download to View
            </Button>
          </div>
        )
    }
  }

  if (!document) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <FileIcon className="h-5 w-5" />
            {document.name}
          </DialogTitle>
          <DialogDescription>Document details, preview, and activity history</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="preview" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-auto max-h-[calc(90vh-200px)]">
            <TabsContent value="preview" className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">{renderPreview()}</div>
                <div className="w-full sm:w-80 space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => onDownload?.(document.id)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download this document</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => onShare?.(document.id)}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Share this document</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit document properties</p>
                          </TooltipContent>
                        </Tooltip>

                        <Separator />

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-red-600 hover:text-red-700"
                              onClick={() => onDelete?.(document.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete this document</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">File Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary">{document.type}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span>{document.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Version:</span>
                        <span>{document.version || "1.0"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            // Add sharing information to the details tab
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">File Name</Label>
                      <p className="text-sm bg-muted p-2 rounded">{document.name}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm bg-muted p-2 rounded min-h-[60px]">
                        {document.description || "No description provided"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="flex flex-wrap gap-1">
                        {document.tags?.length ? (
                          document.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No tags</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upload & Modification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/diverse-user-avatars.png" />
                          <AvatarFallback className="text-xs">
                            {document.uploadedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Uploaded by {document.uploadedBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(document.uploadedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/diverse-user-avatars.png" />
                          <AvatarFallback className="text-xs">
                            {document.modifiedBy
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">Modified by {document.modifiedBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(document.modifiedAt, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Technical Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Type:</span>
                      <span>{document.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span>{document.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <Badge variant="outline">{document.version || "1.0"}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Checksum:</span>
                      <span className="font-mono text-xs">{document.checksum || "SHA256:abc123..."}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Sharing & Permissions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Owner:</span>
                      <span className="font-medium">{document.permissions?.owner || document.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shared:</span>
                      <Badge variant={document.isShared ? "default" : "secondary"}>
                        {document.isShared ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {document.isShared && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shared with:</span>
                          <span>{document.sharedWith?.length || 0} users</span>
                        </div>
                        <div className="space-y-2">
                          <span className="text-muted-foreground">Access Level:</span>
                          <div className="space-y-1">
                            {document.permissions?.canView?.includes("all") ? (
                              <Badge variant="outline" className="text-xs">
                                All Users (View)
                              </Badge>
                            ) : (
                              document.sharedWith?.slice(0, 3).map((user, index) => (
                                <Badge key={index} variant="outline" className="text-xs mr-1">
                                  {user}
                                </Badge>
                              ))
                            )}
                            {document.sharedWith && document.sharedWith.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{document.sharedWith.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Downloads:</span>
                      <span>12 times</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Views:</span>
                      <span>45 times</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Activity Timeline</CardTitle>
                  <CardDescription>Complete history of actions performed on this document</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {mockActivities.map((activity, index) => (
                        <div key={activity.id} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">{getActionIcon(activity.action)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className={getActionColor(activity.action)}>
                                {activity.action}
                              </Badge>
                              <span className="text-sm font-medium">{activity.user}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">{activity.details}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(activity.timestamp, "MMM d, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Notes & Remarks</CardTitle>
                  <CardDescription>Add notes and remarks for this document</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Add Note Form */}
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">Add New Note</Label>
                    <Textarea
                      placeholder="Enter your note or remark..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="private-note"
                          checked={isPrivateNote}
                          onChange={(e) => setIsPrivateNote(e.target.checked)}
                          className="rounded"
                        />
                        <Label htmlFor="private-note" className="text-sm">
                          Private note (only visible to you)
                        </Label>
                      </div>
                      <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim() || isAddingNote}>
                        {isAddingNote ? (
                          <>
                            <Plus className="h-4 w-4 mr-2 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Add Note
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Existing Notes */}
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {mockNotes.map((note) => (
                        <Card key={note.id} className={note.isPrivate ? "border-amber-200 bg-amber-50" : ""}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={note.authorAvatar || "/diverse-user-avatars.png"} />
                                <AvatarFallback className="text-xs">
                                  {note.author
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-sm font-medium">{note.author}</span>
                                  {note.isPrivate && (
                                    <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800">
                                      Private
                                    </Badge>
                                  )}
                                  <span className="text-xs text-muted-foreground">
                                    {format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed">{note.content}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
