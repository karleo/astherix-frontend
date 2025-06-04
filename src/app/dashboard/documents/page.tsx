"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Download,
  Eye,
  Trash2,
  FileText,
  FileIcon as FilePdf,
  FileImage,
  FileSpreadsheet,
  MoreHorizontal,
  FolderPlus,
  UploadIcon,
  Filter,
  X,
  FileIcon,
  Share2,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card } from "@/components/ui/card"
import { FolderTree } from "@/components/folder-tree"
import { CreateFolderDialog } from "@/components/create-folder-dialog"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ApprovalDialog } from "@/components/approval-dialog"
import { BulkActionsToolbar } from "@/components/bulk-actions-toolbar"
import { BulkDownloadDialog } from "@/components/bulk-download-dialog"
import { DocumentDetailsDialog } from "@/components/document-details-dialog"
import { DocumentPreview } from "@/components/document-preview"
import { DocumentShareDialog } from "@/components/document-share-dialog"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"
import { toast } from "sonner"

// Update the document interface to include sharing and permissions
const initialDocuments = [
  {
    id: "doc-1",
    name: "Annual Report 2023.pdf",
    folderId: null,
    type: "PDF",
    size: "4.2 MB",
    uploadedBy: "John Doe",
    uploadedAt: new Date(2023, 11, 15, 14, 30),
    modifiedBy: "John Doe",
    modifiedAt: new Date(2023, 11, 15, 14, 30),
    version: "1.0",
    isShared: false,
    sharedWith: [],
    permissions: {
      owner: "John Doe",
      canView: ["all"],
      canEdit: ["John Doe"],
      canUpload: ["John Doe"],
      canDelete: ["John Doe"],
    },
  },
  {
    id: "doc-2",
    name: "Marketing Strategy.docx",
    folderId: "folder-1",
    type: "Document",
    size: "1.8 MB",
    uploadedBy: "Jane Smith",
    uploadedAt: new Date(2023, 11, 10, 9, 15),
    modifiedBy: "Robert Johnson",
    modifiedAt: new Date(2023, 11, 12, 11, 45),
    version: "2.1",
    isShared: true,
    sharedWith: ["Robert Johnson", "Emily Davis"],
    permissions: {
      owner: "Jane Smith",
      canView: ["Robert Johnson", "Emily Davis", "John Doe"],
      canEdit: ["Robert Johnson"],
      canUpload: ["Jane Smith"],
      canDelete: ["Jane Smith"],
    },
  },
  {
    id: "doc-3",
    name: "Financial Forecast.xlsx",
    folderId: "folder-3",
    type: "Spreadsheet",
    size: "3.5 MB",
    uploadedBy: "Robert Johnson",
    uploadedAt: new Date(2023, 11, 5, 16, 20),
    modifiedBy: "Robert Johnson",
    modifiedAt: new Date(2023, 11, 5, 16, 20),
    version: "1.0",
    isShared: false,
    sharedWith: [],
    permissions: {
      owner: "Robert Johnson",
      canView: ["Robert Johnson"],
      canEdit: ["Robert Johnson"],
      canUpload: ["Robert Johnson"],
      canDelete: ["Robert Johnson"],
    },
  },
  {
    id: "doc-4",
    name: "Company Logo.png",
    folderId: "folder-1-2",
    type: "Image",
    size: "0.8 MB",
    uploadedBy: "Emily Davis",
    uploadedAt: new Date(2023, 10, 28, 10, 0),
    modifiedBy: "Jane Smith",
    modifiedAt: new Date(2023, 11, 2, 14, 10),
    version: "1.2",
    isShared: true,
    sharedWith: ["Jane Smith", "John Doe"],
    permissions: {
      owner: "Emily Davis",
      canView: ["all"],
      canEdit: ["Jane Smith", "Emily Davis"],
      canUpload: ["Emily Davis"],
      canDelete: ["Emily Davis"],
    },
  },
  {
    id: "doc-5",
    name: "Employee Handbook.pdf",
    folderId: "folder-2",
    type: "PDF",
    size: "5.1 MB",
    uploadedBy: "Michael Wilson",
    uploadedAt: new Date(2023, 10, 20, 11, 30),
    modifiedBy: "Michael Wilson",
    modifiedAt: new Date(2023, 10, 20, 11, 30),
    version: "3.0",
    isShared: true,
    sharedWith: ["all"],
    permissions: {
      owner: "Michael Wilson",
      canView: ["all"],
      canEdit: ["Michael Wilson", "John Doe"],
      canUpload: ["Michael Wilson"],
      canDelete: ["Michael Wilson"],
    },
  },
]

const initialFolders = [
  {
    id: "folder-1",
    name: "Marketing",
    type: "folder",
    children: [
      {
        id: "folder-1-1",
        name: "Campaigns",
        type: "folder",
        children: [],
      },
      {
        id: "folder-1-2",
        name: "Reports",
        type: "folder",
        children: [],
      },
    ],
  },
  {
    id: "folder-2",
    name: "HR",
    type: "folder",
    children: [],
  },
  {
    id: "folder-3",
    name: "Finance",
    type: "folder",
    children: [],
  },
]

export default function DocumentsPage() {
  const [folders, setFolders] = useState(initialFolders)
  const [documents, setDocuments] = useState(initialDocuments)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false)
  const [parentFolderId, setParentFolderId] = useState<string | null>(null)
  const [fileTypeFilter, setFileTypeFilter] = useState("all")
  const [fileSizeFilter, setFileSizeFilter] = useState("all")
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  const [isDocumentDeleteOpen, setIsDocumentDeleteOpen] = useState(false)

  // Add current user role state
  const [currentUserRole, setCurrentUserRole] = useState("Super Admin") // Can be "Super Admin", "Admin", "Manager", "Employee"
  const [currentUser, setCurrentUser] = useState("John Doe")

  // Add sharing dialog state
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [documentToShare, setDocumentToShare] = useState<string | null>(null)

  const allowedFileTypes = [
    { value: "PDF", label: "PDF Documents (.pdf)" },
    { value: "Document", label: "Word Documents (.doc, .docx)" },
    { value: "Spreadsheet", label: "Excel Spreadsheets (.xls, .xlsx)" },
    { value: "Image", label: "Images (.jpg, .png, .gif)" },
    { value: "Presentation", label: "Presentations (.ppt, .pptx)" },
  ]

  const fileSizeOptions = [
    { value: "all", label: "All Sizes" },
    { value: "small", label: "Small (< 1MB)" },
    { value: "medium", label: "Medium (1-5MB)" },
    { value: "large", label: "Large (> 5MB)" },
  ]

  // Bulk selection state
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set())
  const [isBulkDownloadOpen, setIsBulkDownloadOpen] = useState(false)
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

  const [selectedDocumentForDetails, setSelectedDocumentForDetails] = useState<string | null>(null)
  const [isDocumentDetailsOpen, setIsDocumentDetailsOpen] = useState(false)
  const [selectedDocumentForPreview, setSelectedDocumentForPreview] = useState<string | null>(null)

  // Function to get the appropriate icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FilePdf className="h-4 w-4 text-red-500" />
      case "Document":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "Spreadsheet":
        return <FileSpreadsheet className="h-4 w-4 text-green-500" />
      case "Image":
        return <FileImage className="h-4 w-4 text-purple-500" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  // Function to find folder name by ID
  const findFolderName = (folderId: string | null, folderList = folders): string | null => {
    if (!folderId) return null

    for (const folder of folderList) {
      if (folder.id === folderId) return folder.name

      if (folder.children.length > 0) {
        const childResult = findFolderName(folderId, folder.children.filter((child) => child.type === "folder") as any)
        if (childResult) return childResult
      }
    }

    return null
  }

  // Generate breadcrumb items based on current folder
  const generateBreadcrumbItems = () => {
    const items = [
      {
        label: "Dashboard",
        href: "/dashboard",
        isCurrentPage: false,
      },
      {
        label: "Document Management",
        href: "/dashboard/documents",
        isCurrentPage: !selectedFolderId,
      },
    ]

    if (selectedFolderId) {
      const folderName = findFolderName(selectedFolderId)
      if (folderName) {
        items.push({
          label: folderName,
          isCurrentPage: true,
        })
      }
    }

    return items
  }

  // Handle folder selection
  const handleFolderSelect = (folderId: string) => {
    setSelectedFolderId(folderId)
    // Clear document selection when changing folders
    setSelectedDocuments(new Set())
  }

  // Handle create folder dialog
  const handleOpenCreateFolder = (parentId: string | null) => {
    setParentFolderId(parentId)
    setIsCreateFolderOpen(true)
  }

  // Create a new folder
  const handleCreateFolder = (name: string) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      type: "folder" as const,
      children: [],
    }

    if (!parentFolderId) {
      // Add to root
      setFolders([...folders, newFolder])
    } else {
      // Add to parent folder
      const updateFolderStructure = (folderList: any[]): any[] => {
        return folderList.map((folder) => {
          if (folder.id === parentFolderId) {
            return {
              ...folder,
              children: [...folder.children, newFolder],
            }
          }

          if (folder.children.length > 0) {
            return {
              ...folder,
              children: updateFolderStructure(folder.children),
            }
          }

          return folder
        })
      }

      setFolders(updateFolderStructure(folders))
    }

    toast.success("Folder created successfully", {
      description: `"${name}" has been created`,
    })
  }

  // Handle file upload
  const handleUploadFiles = (files: File[], fileType: string) => {
    const newDocuments = files.map((file) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      folderId: selectedFolderId,
      type: fileType,
      size: formatFileSize(file.size),
      uploadedBy: "Current User",
      uploadedAt: new Date(),
      modifiedBy: "Current User",
      modifiedAt: new Date(),
      version: "1.0",
      isShared: false,
      sharedWith: [],
      permissions: {
        owner: "Current User",
        canView: ["Current User"],
        canEdit: ["Current User"],
        canUpload: ["Current User"],
        canDelete: ["Current User"],
      },
    }))

    setDocuments([...documents, ...newDocuments])

    toast.success("Files uploaded successfully", {
      description: `${files.length} ${files.length === 1 ? "file" : "files"} uploaded`,
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Handle folder rename
  const handleRenameFolder = (folderId: string, newName: string) => {
    const updateFolderName = (folderList: any[]): any[] => {
      return folderList.map((folder) => {
        if (folder.id === folderId) {
          return { ...folder, name: newName }
        }
        if (folder.children.length > 0) {
          return { ...folder, children: updateFolderName(folder.children) }
        }
        return folder
      })
    }
    setFolders(updateFolderName(folders))

    toast.success("Folder renamed successfully", {
      description: `Folder renamed to "${newName}"`,
    })
  }

  // Handle folder delete
  const handleDeleteFolder = (folderId: string) => {
    const folderToDelete = folders.find((f) => f.id === folderId)
    const folderName = folderToDelete?.name || "Unknown"

    const removeFolderFromStructure = (folderList: any[]): any[] => {
      return folderList
        .filter((folder) => folder.id !== folderId)
        .map((folder) => ({
          ...folder,
          children: folder.children.length > 0 ? removeFolderFromStructure(folder.children) : [],
        }))
    }

    // Remove folder from structure
    setFolders(removeFolderFromStructure(folders))

    // Remove all documents in the deleted folder and its subfolders
    const getAllFolderIds = (folderList: any[], targetId: string): string[] => {
      const ids: string[] = []

      const traverse = (folders: any[]) => {
        folders.forEach((folder) => {
          if (folder.id === targetId) {
            ids.push(folder.id)
            if (folder.children) {
              folder.children.forEach((child: any) => {
                if (child.type === "folder") {
                  ids.push(...getAllFolderIds(folderList, child.id))
                }
              })
            }
          } else if (folder.children) {
            traverse(folder.children)
          }
        })
      }

      traverse(folderList)
      return ids
    }

    const folderIdsToDelete = getAllFolderIds(folders, folderId)
    setDocuments(documents.filter((doc) => !folderIdsToDelete.includes(doc.folderId || "")))

    // Reset selected folder if it was deleted
    if (selectedFolderId === folderId || folderIdsToDelete.includes(selectedFolderId || "")) {
      setSelectedFolderId(null)
    }

    // Clear selection
    setSelectedDocuments(new Set())

    toast.success("Folder deleted successfully", {
      description: `"${folderName}" and its contents have been deleted`,
    })
  }

  // Handle document delete
  const handleDeleteDocument = (documentId: string) => {
    const documentToDelete = documents.find((doc) => doc.id === documentId)
    const documentName = documentToDelete?.name || "Unknown"

    setDocuments(documents.filter((doc) => doc.id !== documentId))
    setDocumentToDelete(null)
    setIsDocumentDeleteOpen(false)

    // Remove from selection if it was selected
    const newSelection = new Set(selectedDocuments)
    newSelection.delete(documentId)
    setSelectedDocuments(newSelection)

    toast.success("Document deleted successfully", {
      description: `"${documentName}" has been deleted`,
    })
  }

  // Open document delete confirmation
  const openDocumentDeleteDialog = (documentId: string) => {
    setDocumentToDelete(documentId)
    setIsDocumentDeleteOpen(true)
  }

  // Bulk selection handlers
  const handleSelectDocument = (documentId: string, checked: boolean) => {
    const newSelection = new Set(selectedDocuments)
    if (checked) {
      newSelection.add(documentId)
    } else {
      newSelection.delete(documentId)
    }
    setSelectedDocuments(newSelection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allDocumentIds = new Set(filteredDocuments.map((doc) => doc.id))
      setSelectedDocuments(allDocumentIds)
    } else {
      setSelectedDocuments(new Set())
    }
  }

  const handleClearSelection = () => {
    setSelectedDocuments(new Set())
  }

  const handleBulkDownload = (zipName: string) => {
    // In a real application, this would trigger the actual download
    console.log(`Downloading ${selectedDocuments.size} files as ${zipName}.zip`)

    toast.success("Download started", {
      description: `Preparing ${selectedDocuments.size} files for download`,
    })

    // Simulate download completion
    setTimeout(() => {
      setSelectedDocuments(new Set())
      toast.success("Download completed", {
        description: `${zipName}.zip has been downloaded`,
      })
    }, 2000)
  }

  const handleBulkDelete = () => {
    setIsBulkDeleteOpen(true)
  }

  const confirmBulkDelete = () => {
    const count = selectedDocuments.size
    // Remove selected documents
    setDocuments(documents.filter((doc) => !selectedDocuments.has(doc.id)))
    setSelectedDocuments(new Set())
    setIsBulkDeleteOpen(false)

    toast.success("Documents deleted successfully", {
      description: `${count} ${count === 1 ? "document" : "documents"} deleted`,
    })
  }

  // Handle document details view
  const handleOpenDocumentDetails = (documentId: string) => {
    setSelectedDocumentForDetails(documentId)
    setIsDocumentDetailsOpen(true)
  }

  // Handle document preview
  const handleOpenDocumentPreview = (documentId: string) => {
    setSelectedDocumentForPreview(documentId)
  }

  // Update the handleDocumentShare function
  const handleDocumentShare = (documentId: string) => {
    setDocumentToShare(documentId)
    setIsShareDialogOpen(true)
  }

  // Add function to handle sharing
  const handleShareDocument = (documentId: string, users: string[], permissions: any) => {
    setDocuments(
      documents.map((doc) =>
        doc.id === documentId
          ? {
              ...doc,
              isShared: users.length > 0,
              sharedWith: users,
              permissions: {
                ...doc.permissions,
                ...permissions,
              },
            }
          : doc,
      ),
    )
    setIsShareDialogOpen(false)
    setDocumentToShare(null)

    const documentName = documents.find((doc) => doc.id === documentId)?.name || "Document"

    if (users.length > 0) {
      toast.success("Document shared successfully", {
        description: `"${documentName}" has been shared with ${users.includes("all") ? "all users" : `${users.length} ${users.length === 1 ? "user" : "users"}`}`,
      })
    } else {
      toast.success("Sharing removed", {
        description: `"${documentName}" is no longer shared`,
      })
    }
  }

  // Handle document download
  const handleDocumentDownload = (documentId: string) => {
    console.log(`Downloading document: ${documentId}`)
    // In a real app, this would trigger the actual download
  }

  // Handle add note
  const handleAddNote = (documentId: string, note: string, isPrivate: boolean) => {
    console.log(`Adding note to document ${documentId}: ${note} (Private: ${isPrivate})`)
    // In a real app, this would save the note to the backend
  }

  // Update the filter logic to respect permissions
  const filteredDocuments = documents.filter((doc) => {
    // Super Admin can see all documents
    if (currentUserRole === "Super Admin") {
      // Apply existing filters
      if (selectedFolderId && doc.folderId !== selectedFolderId) return false
      if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (fileTypeFilter !== "all" && doc.type !== fileTypeFilter) return false
      if (fileSizeFilter !== "all") {
        const sizeInMB = Number.parseFloat(doc.size.split(" ")[0])
        const unit = doc.size.split(" ")[1]
        const sizeInMegabytes = unit === "KB" ? sizeInMB / 1024 : unit === "GB" ? sizeInMB * 1024 : sizeInMB
        if (fileSizeFilter === "small" && sizeInMegabytes >= 1) return false
        if (fileSizeFilter === "medium" && (sizeInMegabytes < 1 || sizeInMegabytes > 5)) return false
        if (fileSizeFilter === "large" && sizeInMegabytes <= 5) return false
      }
      return true
    }

    // For other users, check permissions
    const canView =
      doc.permissions.canView.includes("all") ||
      doc.permissions.canView.includes(currentUser) ||
      doc.permissions.owner === currentUser

    if (!canView) return false

    // Apply existing filters
    if (selectedFolderId && doc.folderId !== selectedFolderId) return false
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (fileTypeFilter !== "all" && doc.type !== fileTypeFilter) return false
    if (fileSizeFilter !== "all") {
      const sizeInMB = Number.parseFloat(doc.size.split(" ")[0])
      const unit = doc.size.split(" ")[1]
      const sizeInMegabytes = unit === "KB" ? sizeInMB / 1024 : unit === "GB" ? sizeInMB * 1024 : sizeInMB
      if (fileSizeFilter === "small" && sizeInMegabytes >= 1) return false
      if (fileSizeFilter === "medium" && (sizeInMegabytes < 1 || sizeInMegabytes > 5)) return false
      if (fileSizeFilter === "large" && sizeInMegabytes <= 5) return false
    }
    return true
  })

  // Add function to check if user can perform action
  const canPerformAction = (document: any, action: "view" | "edit" | "upload" | "delete") => {
    if (currentUserRole === "Super Admin") return true

    switch (action) {
      case "view":
        return (
          document.permissions.canView.includes("all") ||
          document.permissions.canView.includes(currentUser) ||
          document.permissions.owner === currentUser
        )
      case "edit":
        return document.permissions.canEdit.includes(currentUser) || document.permissions.owner === currentUser
      case "upload":
        return document.permissions.canUpload.includes(currentUser) || document.permissions.owner === currentUser
      case "delete":
        return document.permissions.canDelete.includes(currentUser) || document.permissions.owner === currentUser
      default:
        return false
    }
  }

  const selectedDocumentDetails = filteredDocuments.filter((doc) => selectedDocuments.has(doc.id))
  const isAllSelected = filteredDocuments.length > 0 && filteredDocuments.every((doc) => selectedDocuments.has(doc.id))
  const isPartiallySelected = selectedDocuments.size > 0 && !isAllSelected

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Custom breadcrumbs for document context */}
      <div className="hidden lg:block">
        <BreadcrumbNav customItems={generateBreadcrumbItems()} />
      </div>

      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Add role indicator in the header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm sm:text-base text-muted-foreground">Manage and organize your documents</p>
              <Badge variant="outline" className="text-xs">
                {currentUserRole}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => handleOpenCreateFolder(selectedFolderId)} className="w-full sm:w-auto">
                    <FolderPlus className="mr-2 h-4 w-4" />
                    New Folder
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create a new folder {selectedFolderId ? "in current location" : "in root directory"}</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={() => setIsFileUploadOpen(true)} className="w-full sm:w-auto">
                    <UploadIcon className="mr-2 h-4 w-4" />
                    Upload Files
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Upload files {selectedFolderId ? "to current folder" : "to root directory"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 lg:gap-6 w-full">
        {/* Folder Tree */}
        <Card className="p-3 sm:p-4 xl:col-span-1 order-2 xl:order-1">
          <div className="max-h-[300px] xl:max-h-[calc(100vh-300px)] overflow-auto">
            <FolderTree
              data={folders}
              onFolderSelect={handleFolderSelect}
              onCreateFolder={handleOpenCreateFolder}
              onRenameFolder={handleRenameFolder}
              onDeleteFolder={handleDeleteFolder}
              selectedFolderId={selectedFolderId}
            />
          </div>
        </Card>

        {/* Document List */}
        <div className="xl:col-span-4 space-y-3 sm:space-y-4 order-1 xl:order-2 w-full min-w-0">
          {/* Bulk Actions Toolbar */}
          <BulkActionsToolbar
            selectedCount={selectedDocuments.size}
            onClearSelection={handleClearSelection}
            onBulkDownload={() => setIsBulkDownloadOpen(true)}
            onBulkDelete={handleBulkDelete}
          />

          {/* Current location and filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-medium truncate">
                {selectedFolderId ? findFolderName(selectedFolderId) : "All Documents"}
              </h3>
              {selectedFolderId && (
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs sm:text-sm text-muted-foreground"
                  onClick={() => setSelectedFolderId(null)}
                >
                  Back to all documents
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="px-2 py-1 text-xs">
                {filteredDocuments.length} {filteredDocuments.length === 1 ? "document" : "documents"}
              </Badge>
            </div>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      placeholder="Search documents..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Search documents by name, type, or content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {searchQuery && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-2 h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clear search</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="File Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <Separator className="my-1" />
                        {allowedFileTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter documents by file type</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={fileSizeFilter} onValueChange={setFileSizeFilter}>
                      <SelectTrigger className="w-full sm:w-[140px]">
                        <SelectValue placeholder="File Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {fileSizeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter documents by file size</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Document table */}
          <Card className="overflow-hidden w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Checkbox
                              checked={isAllSelected}
                              onCheckedChange={handleSelectAll}
                              ref={(ref) => {
                                if (ref) {
                                  ref.indeterminate = isPartiallySelected
                                }
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Select all documents</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead className="min-w-[200px]">Name</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[80px]">Type</TableHead>
                    <TableHead className="hidden sm:table-cell min-w-[80px]">Size</TableHead>
                    <TableHead className="hidden lg:table-cell min-w-[120px]">Modified By</TableHead>
                    <TableHead className="hidden md:table-cell min-w-[120px]">Modified Date</TableHead>
                    <TableHead className="w-[60px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.length > 0 ? (
                    filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedDocuments.has(document.id)}
                            onCheckedChange={(checked) => handleSelectDocument(document.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(document.type)}
                            <div className="min-w-0 flex-1">
                              <span className="font-medium text-sm block truncate">{document.name}</span>
                              <div className="flex flex-col sm:hidden text-xs text-muted-foreground mt-1">
                                <span>
                                  {document.type} • {document.size}
                                </span>
                                <span>Modified by {document.modifiedBy}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm">{document.type}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">{document.size}</TableCell>
                        <TableCell className="hidden lg:table-cell text-sm">{document.modifiedBy}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-col text-sm">
                            <span>{format(document.modifiedAt, "MMM d, yyyy")}</span>
                            <span className="text-xs text-muted-foreground">
                              {format(document.modifiedAt, "h:mm a")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <DropdownMenu>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">Open menu</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Document actions</p>
                                </TooltipContent>
                              </Tooltip>
                              {/* Update the table row actions to respect permissions */}
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleOpenDocumentDetails(document.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenDocumentPreview(document.id)}>
                                  <FileIcon className="mr-2 h-4 w-4" />
                                  Quick Preview
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDocumentDownload(document.id)}>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDocumentShare(document.id)}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                {canPerformAction(document, "delete") && (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => openDocumentDeleteDialog(document.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center text-sm">
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderOpen}
        onOpenChange={setIsCreateFolderOpen}
        onCreateFolder={handleCreateFolder}
        parentFolderName={parentFolderId ? findFolderName(parentFolderId) : null}
      />

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={isFileUploadOpen}
        onOpenChange={setIsFileUploadOpen}
        onUploadFiles={handleUploadFiles}
        currentFolderName={selectedFolderId ? findFolderName(selectedFolderId) : null}
        allowedFileTypes={allowedFileTypes}
      />

      {/* Bulk Download Dialog */}
      <BulkDownloadDialog
        open={isBulkDownloadOpen}
        onOpenChange={setIsBulkDownloadOpen}
        selectedFiles={selectedDocumentDetails}
        onDownload={handleBulkDownload}
      />

      {/* Document Delete Approval Dialog */}
      {documentToDelete && (
        <ApprovalDialog
          open={isDocumentDeleteOpen}
          onOpenChange={setIsDocumentDeleteOpen}
          onApprove={() => handleDeleteDocument(documentToDelete)}
          title="Delete Document"
          description="This action requires management approval to proceed."
          itemName={documents.find((doc) => doc.id === documentToDelete)?.name || ""}
          itemType="file"
        />
      )}

      {/* Bulk Delete Approval Dialog */}
      <ApprovalDialog
        open={isBulkDeleteOpen}
        onOpenChange={setIsBulkDeleteOpen}
        onApprove={confirmBulkDelete}
        title="Bulk Delete Documents"
        description="This action requires management approval to proceed."
        itemName={`${selectedDocuments.size} selected documents`}
        itemType="file"
      />

      {/* Document Preview Panel */}
      {selectedDocumentForPreview && (
        <div className="xl:col-span-4 order-3">
          <DocumentPreview
            document={filteredDocuments.find((doc) => doc.id === selectedDocumentForPreview)!}
            onClose={() => setSelectedDocumentForPreview(null)}
            onDownload={handleDocumentDownload}
            onOpenDetails={handleOpenDocumentDetails}
          />
        </div>
      )}

      {/* Document Details Dialog */}
      <DocumentDetailsDialog
        open={isDocumentDetailsOpen}
        onOpenChange={setIsDocumentDetailsOpen}
        document={
          selectedDocumentForDetails
            ? filteredDocuments.find((doc) => doc.id === selectedDocumentForDetails) || null
            : null
        }
        onDownload={handleDocumentDownload}
        onShare={handleDocumentShare}
        onDelete={openDocumentDeleteDialog}
        onAddNote={handleAddNote}
      />

      {/* Document Share Dialog */}
      <DocumentShareDialog
        open={isShareDialogOpen}
        onOpenChange={setIsShareDialogOpen}
        document={documentToShare ? documents.find((doc) => doc.id === documentToShare) || null : null}
        onShare={handleShareDocument}
        currentUser={currentUser}
        currentUserRole={currentUserRole}
      />
    </div>
  )
}
