"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Country {
  id: string
  name: string
  code: string
}

interface CountryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; code: string }) => void
  initialData?: Country | null
}

export function CountryFormDialog({ open, onOpenChange, onSubmit, initialData }: CountryFormDialogProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [errors, setErrors] = useState<{ name?: string; code?: string }>({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCode(initialData.code)
    } else {
      setName("")
      setCode("")
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = () => {
    const newErrors: { name?: string; code?: string } = {}

    if (!name.trim()) {
      newErrors.name = "Country name is required"
    }

    if (!code.trim()) {
      newErrors.code = "Country code is required"
    } else if (code.length !== 3) {
      newErrors.code = "Country code must be exactly 3 characters"
    } else if (!/^[A-Z]{3}$/.test(code.toUpperCase())) {
      newErrors.code = "Country code must contain only letters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    onSubmit({
      name: name.trim(),
      code: code.toUpperCase().trim(),
    })

    // Reset form
    setName("")
    setCode("")
    setErrors({})
  }

  const handleCancel = () => {
    setName("")
    setCode("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Country" : "Add New Country"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the country information below." : "Enter the details for the new country."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Country Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter country name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">Country Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter 3-letter country code (e.g., US)"
                maxLength={3}
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update Country" : "Add Country"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
