"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Trash2, X, Archive, Share2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface BulkActionsToolbarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkDownload: () => void
  onBulkDelete: () => void
  onBulkArchive?: () => void
  onBulkShare?: () => void
}

export function BulkActionsToolbar({
  selectedCount,
  onClearSelection,
  onBulkDownload,
  onBulkDelete,
  onBulkArchive,
  onBulkShare,
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          {selectedCount} {selectedCount === 1 ? "file" : "files"} selected
        </Badge>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear selection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onBulkDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download selected files as ZIP</p>
            </TooltipContent>
          </Tooltip>

          {onBulkShare && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onBulkShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share selected files</p>
              </TooltipContent>
            </Tooltip>
          )}

          {onBulkArchive && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={onBulkArchive}>
                  <Archive className="h-4 w-4 mr-1" />
                  Archive
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Archive selected files</p>
              </TooltipContent>
            </Tooltip>
          )}

          <Separator orientation="vertical" className="h-6" />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" onClick={onBulkDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete selected files (requires approval)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
