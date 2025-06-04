"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateFolder: (name: string) => void
  parentFolderName: string | null
}

export function CreateFolderDialog({ open, onOpenChange, onCreateFolder, parentFolderName }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim()) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onCreateFolder(folderName)
    setIsLoading(false)
    setFolderName("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            {parentFolderName
              ? `Create a new folder inside "${parentFolderName}"`
              : "Create a new folder in the root directory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <TooltipProvider>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folderName">Folder Name</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="folderName"
                      placeholder="Enter folder name"
                      value={folderName}
                      onChange={(e) => setFolderName(e.target.value)}
                      autoFocus
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose a descriptive name for your folder</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" disabled={isLoading || !folderName.trim()}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Folder
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create the new folder</p>
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
