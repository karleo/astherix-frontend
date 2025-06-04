"use client"

import { DialogFooter } from "@/components/ui/dialog"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, FileIcon, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadFiles: (files: File[], fileType: string) => void
  currentFolderName: string | null
  allowedFileTypes: { value: string; label: string }[]
}

export function FileUploadDialog({
  open,
  onOpenChange,
  onUploadFiles,
  currentFolderName,
  allowedFileTypes,
}: FileUploadDialogProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [fileType, setFileType] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...filesArray])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFiles.length === 0 || !fileType) return

    setIsUploading(true)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    onUploadFiles(selectedFiles, fileType)
    setIsUploading(false)
    setSelectedFiles([])
    setFileType("")
    setUploadProgress(0)
    onOpenChange(false)
  }

  const getTotalSize = () => {
    return selectedFiles.reduce((acc, file) => acc + file.size, 0)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !isUploading && onOpenChange(value)}>
      <DialogContent className="w-[95vw] max-w-[500px] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            {currentFolderName ? `Upload files to folder "${currentFolderName}"` : "Upload files to the root directory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <TooltipProvider>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fileType">File Type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Select value={fileType} onValueChange={setFileType}>
                      <SelectTrigger id="fileType">
                        <SelectValue placeholder="Select file type" />
                      </SelectTrigger>
                      <SelectContent>
                        {allowedFileTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Choose the type of files you're uploading</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Files</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="border-2 border-dashed rounded-md p-4 sm:p-6 text-center hover:bg-muted/50 transition-colors">
                      <Input
                        id="files"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                        disabled={isUploading}
                      />
                      <Label htmlFor="files" className="cursor-pointer flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-medium">Drag files here or click to browse</span>
                        <span className="text-xs text-muted-foreground">Upload multiple files up to 10MB each</span>
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Drag and drop files or click to select from your device</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm">Selected Files</Label>
                    <span className="text-xs text-muted-foreground">Total: {formatFileSize(getTotalSize())}</span>
                  </div>
                  <div className="max-h-32 sm:max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-xs sm:text-sm gap-2">
                        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                          <FileIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 sm:h-6 sm:w-6"
                            onClick={() => removeFile(index)}
                            disabled={isUploading}
                          >
                            <X className="h-2 w-2 sm:h-3 sm:w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          </TooltipProvider>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" disabled={isUploading || selectedFiles.length === 0 || !fileType}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    <>Upload Files</>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Start uploading the selected files</p>
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
