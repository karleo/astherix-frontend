"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, FileIcon, Download, Eye, Maximize2, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DocumentPreviewProps {
  document: {
    id: string
    name: string
    type: string
    size: string
  }
  onClose?: () => void
  onDownload?: (documentId: string) => void
  onOpenDetails?: (documentId: string) => void
  className?: string
}

export function DocumentPreview({ document, onClose, onDownload, onOpenDetails, className }: DocumentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  const renderPreviewContent = () => {
    switch (document.type) {
      case "PDF":
        return (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <FileIcon className="h-16 w-16 text-red-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">PDF Document</p>
            <p className="text-xs text-gray-500 text-center px-4">{document.name}</p>
            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" onClick={() => onOpenDetails?.(document.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Full Preview
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload?.(document.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )
      case "Image":
        return (
          <div className="relative h-full flex items-center justify-center bg-gray-50 rounded">
            <img
              src="/placeholder.svg?height=400&width=600&text=Image Preview"
              alt={document.name}
              className="max-h-full max-w-full object-contain rounded"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        )
      case "Document":
        return (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <FileText className="h-16 w-16 text-blue-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Word Document</p>
            <p className="text-xs text-gray-500 text-center px-4">{document.name}</p>
            <div className="mt-4 space-y-2">
              <Button variant="outline" size="sm" onClick={() => onOpenDetails?.(document.id)}>
                <Eye className="h-4 w-4 mr-2" />
                Open in Editor
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDownload?.(document.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded border-2 border-dashed border-gray-300">
            <FileIcon className="h-16 w-16 text-gray-500 mb-4" />
            <p className="text-sm text-gray-600 mb-2">Preview not available</p>
            <p className="text-xs text-gray-500 text-center px-4">{document.name}</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => onDownload?.(document.id)}>
              <Download className="h-4 w-4 mr-2" />
              Download to View
            </Button>
          </div>
        )
    }
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <FileIcon className="h-5 w-5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm truncate">{document.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {document.type}
                </Badge>
                <span className="text-xs text-muted-foreground">{document.size}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <TooltipProvider>
              {document.type === "Image" && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Zoom Out</p>
                    </TooltipContent>
                  </Tooltip>

                  <span className="text-xs text-muted-foreground px-2">{zoom}%</span>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Zoom In</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRotate}>
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Rotate</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenDetails?.(document.id)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Full Details</p>
                </TooltipContent>
              </Tooltip>

              {onClose && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                      <X className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Close Preview</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </div>

        {/* Preview Content */}
        <div className="h-96 p-4">{renderPreviewContent()}</div>
      </CardContent>
    </Card>
  )
}
