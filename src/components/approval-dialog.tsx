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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ApprovalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprove: () => void
  title: string
  description: string
  itemName: string
  itemType: "folder" | "file"
}

export function ApprovalDialog({
  open,
  onOpenChange,
  onApprove,
  title,
  description,
  itemName,
  itemType,
}: ApprovalDialogProps) {
  const [approvalCode, setApprovalCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Mock approval codes - in a real app, these would be validated against a backend
  const validCodes = ["ADMIN123", "MGR456", "DELETE789"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!approvalCode.trim()) {
      setError("Please enter an approval code")
      return
    }

    setIsLoading(true)

    // Simulate API validation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (validCodes.includes(approvalCode.toUpperCase())) {
      onApprove()
      setApprovalCode("")
      onOpenChange(false)
    } else {
      setError("Invalid approval code. Please contact your manager.")
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    setApprovalCode("")
    setError("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Warning:</strong> You are about to delete the {itemType} "{itemName}".
            {itemType === "folder" && " This will also delete all contents inside the folder."}
            This action cannot be undone.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit}>
          <TooltipProvider>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="approvalCode">Management Approval Code</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Input
                      id="approvalCode"
                      type="password"
                      placeholder="Enter approval code"
                      value={approvalCode}
                      onChange={(e) => setApprovalCode(e.target.value)}
                      autoFocus
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-xs">
                      <p className="font-medium">Approval Code Required</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact your manager or administrator for the deletion approval code.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">Demo codes: ADMIN123, MGR456, DELETE789</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </TooltipProvider>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={isLoading || !approvalCode.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
