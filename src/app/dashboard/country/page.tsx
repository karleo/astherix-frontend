"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CountryFormDialog } from "@/components/country-form-dialog"
import { ApprovalDialog } from "@/components/approval-dialog"
import { Plus, MoreHorizontal } from "lucide-react"

import moment from "moment"

// Define the Country type
interface Country {
  id: string
  name: string
  code: string
  createdAt: string
}
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// const initialCountries: Country[] = [
//   { id: "1", name: "United States", code: "US", createdAt: "2024-01-15" },
//   { id: "2", name: "Canada", code: "CA", createdAt: "2024-01-16" },
//   { id: "3", name: "United Kingdom", code: "GB", createdAt: "2024-01-17" },
//   { id: "4", name: "Germany", code: "DE", createdAt: "2024-01-18" },
//   { id: "5", name: "France", code: "FR", createdAt: "2024-01-19" },
//   { id: "6", name: "Japan", code: "JP", createdAt: "2024-01-20" },
//   { id: "7", name: "Australia", code: "AU", createdAt: "2024-01-21" },
//   { id: "8", name: "Brazil", code: "BR", createdAt: "2024-01-22" },
// ]


const mockCountry: Country[] = [

]

export default function CountryPage() {
  const [countries, setCountries] = useState<Country[]>(mockCountry)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCountry, setEditingCountry] = useState<Country | null>(null)
  const [countryToDelete, setCountryToDelete] = useState<Country | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Filter countries based on search term
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.code.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle adding a new country
  const handleAddCountry = () => {
    setEditingCountry(null)
    setIsFormOpen(true)
  }

  // Handle editing a country
  const handleEditCountry = (country: Country) => {
    setEditingCountry(country)
    setIsFormOpen(true)
  }

  // Handle deleting a country
  const handleDeleteCountry = (country: Country) => {
    setCountryToDelete(country)
    setIsDeleteDialogOpen(true)
  }
  const initContries = async () => {
    const response = await fetch(`${API_URL}/api/countries`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    console.log("Countries data:", data);
    const countryList = data.map((country: any) => {
      return {
        id: country.id,
        name: country.country_name,
        code: country.country_code,
        createdAt: moment(country.created_at).format("DD/MM/YYYY"),
      }
    });
    setCountries(countryList);
  }
   useEffect(() => {
      initContries().then();
    }, []);

  // Handle form submission
  const handleFormSubmit = async (data: { name: string; code: string }) => {
    try {
      if (editingCountry) {
        // Update existing country
        const response = await fetch(`${API_URL}/api/countries/${editingCountry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ country_name: data.name, country_code: data.code }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          toast.error("Failed to update country", { description: errorData.message || "Unknown error" })
          return
        }
        setCountries((prev) =>
          prev.map((country) =>
            country.id === editingCountry.id ? { ...country, name: data.name, code: data.code } : country,
          ),
        )
        toast.success("Country updated successfully", {
          description: `${data.name} has been updated`,
        })
      } else {
        // Add new country
        const response = await fetch(`${API_URL}/api/countries`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ country_name: data.name, country_code: data.code }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          toast.error("Failed to add country", { description: errorData.message || "Unknown error" })
          return
        }
        const newCountry: Country = {
          id: Date.now().toString(),
          name: data.name,
          code: data.code,
          createdAt: new Date().toISOString().split("T")[0],
        }
        setCountries((prev) => [...prev, newCountry])
        toast.success("Country added successfully", {
          description: `${data.name} has been added to the system`,
        })
      }
    } catch {
      toast.error("Failed to add/update country", { description: "Network or server error" })
      return
    }
    setIsFormOpen(false)
    setEditingCountry(null)
  }

  // Confirm delete action
  const confirmDelete = async () => {
    if (countryToDelete) {
      try {
        const response = await fetch(`${API_URL}/api/countries/${countryToDelete.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ country_name: countryToDelete.name, country_code: countryToDelete.code }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          toast.error("Failed to delete country", { description: errorData.message || "Unknown error" })
          return
        }
        setCountries((prev) => prev.filter((country) => country.id !== countryToDelete.id))
        toast.success("Country deleted successfully", {
          description: `${countryToDelete.name} has been removed from the system`,
        })
      } catch {
        toast.error("Failed to delete country", { description: "Network or server error" })
        return
      }
      setIsDeleteDialogOpen(false)
      setCountryToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Country Management</h1>
          <p className="text-muted-foreground">Manage countries and their codes in the system</p>
        </div>
        <Button onClick={handleAddCountry} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Country
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
          <CardDescription>A list of all countries in the system with their respective codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                type="search"
                placeholder="Search countries..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Badge variant="secondary" className="ml-auto">
              {filteredCountries.length} countries
            </Badge>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country Name</TableHead>
                  <TableHead>Country Code</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCountries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No countries found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCountries.map((country) => (
                    <TableRow key={country.id}>
                      <TableCell>{country.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{country.code}</Badge>
                      </TableCell>
                      <TableCell>{country.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingCountry(country)
                                setIsFormOpen(true)
                              }}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setCountryToDelete(country)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Country Form Dialog */}
      <CountryFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingCountry}
      />

      {/* Delete Confirmation Dialog */}
      <ApprovalDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onApprove={confirmDelete}
        title="Delete Country"
        description={`Are you sure you want to delete ${countryToDelete?.name}? This action cannot be undone.`}
        approveText="Delete"
        cancelText="Cancel"
        itemType="country"
      />
    </div>
  )
}
