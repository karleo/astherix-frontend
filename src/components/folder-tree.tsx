"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Folder, File, Plus, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RenameFolderDialog } from "./rename-folder-dialog"
import { ApprovalDialog } from "./approval-dialog"
import { Edit3, Trash2 } from "lucide-react"

interface FolderItem {
  id: string
  name: string
  type: "folder"
  children: (FolderItem | FileItem)[]
}

interface FileItem {
  id: string
  name: string
  type: "file"
  fileType: string
  size: string
}

type FolderTreeItem = FolderItem | FileItem

interface FolderTreeProps {
  data: FolderTreeItem[]
  onFolderSelect: (folderId: string) => void
  onCreateFolder: (parentId: string | null) => void
  onRenameFolder: (folderId: string, newName: string) => void
  onDeleteFolder: (folderId: string) => void
  selectedFolderId: string | null
  className?: string
}

export function FolderTree({
  data,
  onFolderSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  selectedFolderId,
  className,
}: FolderTreeProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter folders based on search query
  const filterFolders = (items: FolderTreeItem[], query: string): FolderTreeItem[] => {
    if (!query) return items

    return items
      .filter((item) => {
        if (item.type === "folder") {
          const matchesName = item.name.toLowerCase().includes(query.toLowerCase())
          const hasMatchingChildren = filterFolders(item.children, query).length > 0
          return matchesName || hasMatchingChildren
        }
        return item.name.toLowerCase().includes(query.toLowerCase())
      })
      .map((item) => {
        if (item.type === "folder") {
          return {
            ...item,
            children: filterFolders(item.children, query),
          }
        }
        return item
      })
  }

  const filteredData = filterFolders(data, searchQuery)

  return (
    <TooltipProvider>
      <div className={cn("text-sm", className)}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm sm:text-base">Folders</h3>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onCreateFolder(null)}
                className="h-6 w-6 sm:h-8 sm:w-8"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="sr-only">Create root folder</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create new folder</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Search Input */}
        <div className="relative mb-3">
          <Search className="absolute left-2 top-2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-7 sm:pl-8 h-7 sm:h-8 text-xs sm:text-sm"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1 h-5 w-5 sm:h-6 sm:w-6"
            >
              <X className="h-2 w-2 sm:h-3 sm:w-3" />
            </Button>
          )}
        </div>

        <div className="space-y-1">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                level={0}
                onFolderSelect={onFolderSelect}
                onCreateFolder={onCreateFolder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
                selectedFolderId={selectedFolderId}
                searchQuery={searchQuery}
              />
            ))
          ) : searchQuery ? (
            <div className="text-xs text-muted-foreground text-center py-4">No folders found</div>
          ) : (
            data.map((item) => (
              <TreeItem
                key={item.id}
                item={item}
                level={0}
                onFolderSelect={onFolderSelect}
                onCreateFolder={onCreateFolder}
                onRenameFolder={onRenameFolder}
                onDeleteFolder={onDeleteFolder}
                selectedFolderId={selectedFolderId}
                searchQuery=""
              />
            ))
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}

interface TreeItemProps {
  item: FolderTreeItem
  level: number
  onFolderSelect: (folderId: string) => void
  onCreateFolder: (parentId: string) => void
  onRenameFolder: (folderId: string, newName: string) => void
  onDeleteFolder: (folderId: string) => void
  selectedFolderId: string | null
  searchQuery?: string
}

function TreeItem({
  item,
  level,
  onFolderSelect,
  onCreateFolder,
  onRenameFolder,
  onDeleteFolder,
  selectedFolderId,
  searchQuery = "",
}: TreeItemProps) {
  const [expanded, setExpanded] = useState(searchQuery ? true : false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const isFolder = item.type === "folder"
  const isSelected = selectedFolderId === item.id

  // Auto-expand when searching
  useEffect(() => {
    if (searchQuery) {
      setExpanded(true)
    }
  }, [searchQuery])

  const toggleExpanded = () => {
    if (isFolder) {
      setExpanded(!expanded)
    }
  }

  const handleFolderSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isFolder) {
      onFolderSelect(item.id)
    }
  }

  // Highlight search matches
  const highlightText = (text: string, query: string) => {
    if (!query) return text

    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  const handleRename = (newName: string) => {
    onRenameFolder(item.id, newName)
  }

  const handleDelete = () => {
    onDeleteFolder(item.id)
  }

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-muted text-sm",
                  isSelected && "bg-muted font-medium",
                  level > 0 && "ml-3 sm:ml-4",
                )}
                onClick={handleFolderSelect}
                onDoubleClick={toggleExpanded}
              >
                {isFolder && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-3 w-3 sm:h-4 sm:w-4 p-0 mr-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpanded()
                    }}
                  >
                    {expanded ? (
                      <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                    ) : (
                      <ChevronRight className="h-2 w-2 sm:h-3 sm:w-3" />
                    )}
                  </Button>
                )}
                {isFolder ? (
                  <Folder className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-blue-500" />
                ) : (
                  <File className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-gray-500" />
                )}
                <span className="truncate text-xs sm:text-sm">{highlightText(item.name, searchQuery)}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div className="max-w-xs">
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {isFolder
                    ? `Folder • ${(item as FolderItem).children.length} items`
                    : `File • ${(item as FileItem).fileType}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isFolder ? "Click to select, double-click to expand" : "File item"}
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        {isFolder && (
          <ContextMenuContent>
            <ContextMenuItem onClick={() => onCreateFolder(item.id)}>
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setIsRenameOpen(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Rename
            </ContextMenuItem>
            <ContextMenuItem onClick={() => setIsDeleteOpen(true)} className="text-red-600 focus:text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </ContextMenuItem>
          </ContextMenuContent>
        )}
      </ContextMenu>

      {isFolder && expanded && (item as FolderItem).children.length > 0 && (
        <div className="pl-2">
          {(item as FolderItem).children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              level={level + 1}
              onFolderSelect={onFolderSelect}
              onCreateFolder={onCreateFolder}
              onRenameFolder={onRenameFolder}
              onDeleteFolder={onDeleteFolder}
              selectedFolderId={selectedFolderId}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}

      {/* Add the dialogs */}
      {isFolder && (
        <>
          <RenameFolderDialog
            open={isRenameOpen}
            onOpenChange={setIsRenameOpen}
            onRename={handleRename}
            currentName={item.name}
          />
          <ApprovalDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onApprove={handleDelete}
            title="Delete Folder"
            description="This action requires management approval to proceed."
            itemName={item.name}
            itemType="folder"
          />
        </>
      )}
    </div>
  )
}
