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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Country {
  id: string
  name: string
  code: string
}

interface City {
  id: string
  name: string
  code: string
  countryId: string
  countryName: string
}

interface CityFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; code: string; countryId: string }) => void
  initialData?: City | null
  countries: Country[]
}

export function CityFormDialog({ open, onOpenChange, onSubmit, initialData, countries }: CityFormDialogProps) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [countryId, setCountryId] = useState("")
  const [errors, setErrors] = useState<{ name?: string; code?: string; countryId?: string }>({})

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setCode(initialData.code)
      setCountryId(initialData.countryId)
    } else {
      setName("")
      setCode("")
      setCountryId("")
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = () => {
    const newErrors: { name?: string; code?: string; countryId?: string } = {}

    if (!name.trim()) {
      newErrors.name = "City name is required"
    }

    if (!code.trim()) {
      newErrors.code = "City code is required"
    } else if (code.length < 2 || code.length > 5) {
      newErrors.code = "City code must be between 2-5 characters"
    } else if (!/^[A-Z0-9]+$/.test(code.toUpperCase())) {
      newErrors.code = "City code must contain only letters and numbers"
    }

    if (!countryId) {
      newErrors.countryId = "Please select a country"
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
      countryId,
    })

    // Reset form
    setName("")
    setCode("")
    setCountryId("")
    setErrors({})
  }

  const handleCancel = () => {
    setName("")
    setCode("")
    setCountryId("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit City" : "Add New City"}</DialogTitle>
          <DialogDescription>
            {initialData ? "Update the city information below." : "Enter the details for the new city."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">City Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter city name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">City Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter city code (e.g., NYC, LON)"
                maxLength={5}
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select value={countryId} onValueChange={setCountryId}>
                <SelectTrigger className={errors.countryId ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name} ({country.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryId && <p className="text-sm text-destructive">{errors.countryId}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">{initialData ? "Update City" : "Add City"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
