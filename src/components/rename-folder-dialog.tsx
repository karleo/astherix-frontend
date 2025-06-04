"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Loader2, Edit3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RenameFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRename: (newName: string) => void
  currentName: string
}

export function RenameFolderDialog({ open, onOpenChange, onRename, currentName }: RenameFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setFolderName(currentName)
    }
  }, [open, currentName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!folderName.trim() || folderName === currentName) return

    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    onRename(folderName.trim())
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleClose = () => {
    setFolderName(currentName)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-500" />
            Rename Folder
          </DialogTitle>
          <DialogDescription>Enter a new name for the folder "{currentName}"</DialogDescription>
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
                      placeholder="Enter new folder name"
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
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !folderName.trim() || folderName === currentName}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Rename Folder
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
