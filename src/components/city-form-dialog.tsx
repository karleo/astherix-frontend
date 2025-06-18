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
  country_name: string
  country_code: string
}

interface City {
  id: string
  city_name: string
  city_code: string
  country_id: string  
  country:{
    id: string
    country_name: string
    country_code: string
  }
}

interface CityFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { city_name: string; city_code: string; country_id: string }) => void
  initialData?: City | null
  countries: Country[]
}
 
export function CityFormDialog({ open, onOpenChange, onSubmit, initialData, countries }: CityFormDialogProps) {
  const [city_name, setName] = useState("")
  const [city_code, setCode] = useState("")
  const [country_id, setCountryId] = useState("")
  const [errors, setErrors] = useState<{ city_name?: string; city_code?: string; country_id?: string }>({})

  useEffect(() => {
    if (initialData) {      
      setName(initialData.city_name)
      setCode(initialData.city_code)
      setCountryId(initialData.country_id.toString())      
    } else {
      setName("")
      setCode("")
      setCountryId("")
    }
    setErrors({})
  }, [initialData, open])

  const validateForm = () => {
    const newErrors: { city_name?: string; city_code?: string; country_id?: string } = {}

    if (!city_name.trim()) {
      newErrors.city_name = "City name is required"
    }
    
    if (!city_code.trim()) {
      newErrors.city_code = "City code is required"
    } else if (city_code.length !== 3) {
      newErrors.city_code = "City code must 3 characters"
    } else if (!/^[A-Z]{3}$/.test(city_code.toUpperCase())) {
      newErrors.city_code = "City code must contain only letters"
    }

    if (!country_id) {
      newErrors.country_id = "Please select a country"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // console.log("Submitting city form", { city_name, city_code, countryId })  

    if (!validateForm()) {
      toast.error("Please fix the errors in the form")
      return
    }

    onSubmit({
      city_name: city_name.trim(),
      city_code: city_code.toUpperCase().trim(),
      country_id,
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
              <Label htmlFor="city_name">City Name</Label>
              <Input
                id="city_name"
                value={city_name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter city name"
                className={errors.city_name ? "border-destructive" : ""}
              />
              {errors.city_name && <p className="text-sm text-destructive">{errors.city_name}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city_code">City Code</Label>
              <Input
                id="city_code"
                value={city_code} 
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter city code (e.g., NYC, LON)"
                maxLength={5}
                className={errors.city_code ? "border-destructive" : ""}
              />
              {errors.city_code && <p className="text-sm text-destructive">{errors.city_code}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="country">Country {initialData?.country?.country_name}</Label>
              <Select value={country_id} onValueChange={(country_id: string) => {setCountryId(country_id)}}>              
                <SelectTrigger className={errors.country_id ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>                  
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {initialData?.country?.country_name === country.country_name ? `${country.country_name} (Current)` : country.country_name} ({country.country_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.country_id && <p className="text-sm text-destructive">{errors.country_id}</p>}
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
