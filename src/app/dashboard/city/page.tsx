"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CityFormDialog } from "@/components/city-form-dialog"
import { ApprovalDialog } from "@/components/approval-dialog"
import { Plus, MoreHorizontal } from "lucide-react"

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
  createdAt: string
}

const countries: Country[] = [
  { id: "1", name: "United States", code: "US" },
  { id: "2", name: "Canada", code: "CA" },
  { id: "3", name: "United Kingdom", code: "GB" },
  { id: "4", name: "Germany", code: "DE" },
  { id: "5", name: "France", code: "FR" },
  { id: "6", name: "Japan", code: "JP" },
  { id: "7", name: "Australia", code: "AU" },
  { id: "8", name: "Brazil", code: "BR" },
]

const initialCities: City[] = [
  { id: "1", name: "New York", code: "NYC", countryId: "1", countryName: "United States", createdAt: "2024-01-15" },
  { id: "2", name: "Los Angeles", code: "LAX", countryId: "1", countryName: "United States", createdAt: "2024-01-16" },
  { id: "3", name: "Toronto", code: "TOR", countryId: "2", countryName: "Canada", createdAt: "2024-01-17" },
  { id: "4", name: "London", code: "LON", countryId: "3", countryName: "United Kingdom", createdAt: "2024-01-18" },
  { id: "5", name: "Berlin", code: "BER", countryId: "4", countryName: "Germany", createdAt: "2024-01-19" },
  { id: "6", name: "Paris", code: "PAR", countryId: "5", countryName: "France", createdAt: "2024-01-20" },
  { id: "7", name: "Tokyo", code: "TYO", countryId: "6", countryName: "Japan", createdAt: "2024-01-21" },
  { id: "8", name: "Sydney", code: "SYD", countryId: "7", countryName: "Australia", createdAt: "2024-01-22" },
]

export default function CityPage() {
  const [cities, setCities] = useState<City[]>(initialCities)
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [cityToDelete, setCityToDelete] = useState<City | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.countryName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCity = () => {
    setEditingCity(null)
    setIsFormOpen(true)
  }

  const handleEditCity = (city: City) => {
    setEditingCity(city)
    setIsFormOpen(true)
  }

  const handleDeleteCity = (city: City) => {
    setCityToDelete(city)
    setIsDeleteDialogOpen(true)
  }

  const handleFormSubmit = (data: { name: string; code: string; countryId: string }) => {
    const country = countries.find((c) => c.id === data.countryId)
    if (!country) return

    if (editingCity) {
      // Update existing city
      setCities((prev) =>
        prev.map((city) =>
          city.id === editingCity.id
            ? {
                ...city,
                name: data.name,
                code: data.code,
                countryId: data.countryId,
                countryName: country.name,
              }
            : city,
        ),
      )
      toast.success("City updated successfully", {
        description: `${data.name} has been updated`,
      })
    } else {
      // Add new city
      const newCity: City = {
        id: Date.now().toString(),
        name: data.name,
        code: data.code,
        countryId: data.countryId,
        countryName: country.name,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCities((prev) => [...prev, newCity])
      toast.success("City added successfully", {
        description: `${data.name} has been added to the system`,
      })
    }
    setIsFormOpen(false)
    setEditingCity(null)
  }

  const confirmDelete = () => {
    if (cityToDelete) {
      setCities((prev) => prev.filter((city) => city.id !== cityToDelete.id))
      toast.success("City deleted successfully", {
        description: `${cityToDelete.name} has been removed from the system`,
      })
      setIsDeleteDialogOpen(false)
      setCityToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">City Management</h1>
          <p className="text-muted-foreground">Manage cities and their codes in the system</p>
        </div>
        <Button onClick={handleAddCity} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add City
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cities</CardTitle>
          <CardDescription>
            A list of all cities in the system with their respective codes and countries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search cities by name, code, or country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary" className="ml-auto">
              {filteredCities.length} cities
            </Badge>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City Name</TableHead>
                  <TableHead>City Code</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No cities found matching your search." : "No cities available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCities.map((city) => (
                    <TableRow key={city.id}>
                      <TableCell className="font-medium">{city.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{city.code}</Badge>
                      </TableCell>
                      <TableCell>{city.countryName}</TableCell>
                      <TableCell>{city.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditCity(city)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCity(city)} className="text-destructive">
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

      <CityFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingCity}
        countries={countries}
      />

      <ApprovalDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete City"
        description={`Are you sure you want to delete "${cityToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
