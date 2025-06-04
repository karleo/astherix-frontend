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
import { Progress } from "@/components/ui/progress"
import { Loader2, Download, FileArchive, CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { formatFileSize } from "@/lib/utils"

interface BulkDownloadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFiles: Array<{
    id: string
    name: string
    size: string
    type: string
  }>
  onDownload: (zipName: string) => void
}

export function BulkDownloadDialog({ open, onOpenChange, selectedFiles, onDownload }: BulkDownloadDialogProps) {
  const [zipName, setZipName] = useState("documents")
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const calculateTotalSize = () => {
    return selectedFiles.reduce((total, file) => {
      const sizeValue = Number.parseFloat(file.size.split(" ")[0])
      const unit = file.size.split(" ")[1]

      let bytes = sizeValue
      switch (unit) {
        case "KB":
          bytes *= 1024
          break
        case "MB":
          bytes *= 1024 * 1024
          break
        case "GB":
          bytes *= 1024 * 1024 * 1024
          break
      }

      return total + bytes
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!zipName.trim() || isDownloading) return

    setIsDownloading(true)
    setDownloadProgress(0)
    setIsComplete(false)

    // Simulate download progress
    for (let i = 0; i <= 100; i += 5) {
      setDownloadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsComplete(true)
    onDownload(zipName)

    // Reset after a short delay
    setTimeout(() => {
      setIsDownloading(false)
      setDownloadProgress(0)
      setIsComplete(false)
      onOpenChange(false)
    }, 2000)
  }

  const handleClose = () => {
    if (!isDownloading) {
      setZipName("documents")
      setDownloadProgress(0)
      setIsComplete(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileArchive className="h-5 w-5 text-blue-500" />
            Bulk Download
          </DialogTitle>
          <DialogDescription>
            Download {selectedFiles.length} selected {selectedFiles.length === 1 ? "file" : "files"} as a ZIP archive
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* File Summary */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Files to download:</span>
              <span className="text-muted-foreground">{selectedFiles.length} files</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="font-medium">Total size:</span>
              <span className="text-muted-foreground">{formatFileSize(calculateTotalSize())}</span>
            </div>
          </div>

          {/* File List Preview */}
          <div className="max-h-32 overflow-y-auto border rounded-md">
            <div className="p-2 space-y-1">
              {selectedFiles.slice(0, 5).map((file) => (
                <div key={file.id} className="flex items-center justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{file.name}</span>
                  <span className="text-muted-foreground">{file.size}</span>
                </div>
              ))}
              {selectedFiles.length > 5 && (
                <div className="text-xs text-muted-foreground text-center pt-1">
                  ... and {selectedFiles.length - 5} more files
                </div>
              )}
            </div>
          </div>

          {/* ZIP Name Input */}
          <form onSubmit={handleSubmit}>
            <TooltipProvider>
              <div className="space-y-2">
                <Label htmlFor="zipName">ZIP File Name</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex">
                      <Input
                        id="zipName"
                        placeholder="Enter ZIP file name"
                        value={zipName}
                        onChange={(e) => setZipName(e.target.value)}
                        disabled={isDownloading}
                        className="rounded-r-none"
                      />
                      <div className="flex items-center px-3 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                        .zip
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose a name for your ZIP archive</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>

            {/* Download Progress */}
            {isDownloading && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span>{isComplete ? "Download complete!" : "Preparing download..."}</span>
                  <span>{downloadProgress}%</span>
                </div>
                <Progress value={downloadProgress} className="h-2" />
                {isComplete && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Your download will start automatically
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose} disabled={isDownloading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isDownloading || !zipName.trim() || isComplete}>
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isComplete ? "Complete" : "Preparing..."}
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
