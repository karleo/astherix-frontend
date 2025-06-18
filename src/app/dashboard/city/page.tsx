"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { CityFormDialog } from "@/components/city-form-dialog"
import { ApprovalDialog } from "@/components/approval-dialog"
import { Plus, MoreHorizontal, ArrowUpDown } from "lucide-react"

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
  createdAt: string
}


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CityPage() {
  const [cities, setCities] = useState<City[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCity, setEditingCity] = useState<City | null>(null)
  const [cityToDelete, setCityToDelete] = useState<City | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof City | null;
    direction: 'ascending' | 'descending';
  }>({
    key: null,
    direction: 'ascending'
  });

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/cities`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch cities');
      }
      const data = await response.json() as City[];
      // console.log('Cities data:', data);
      const cityList = data.map((city: any) => {
        return {
          id: city.id,
          city_name: city.city_name,
          city_code: city.city_code,
          country_id: city.country_id,
          country: {
            id: city.country.id.toString(),
            country_name: city.country.country_name,
            country_code: city.country.country_code,
          },
          createdAt: new Date().toISOString().split('T')[0],
        }        
      });
      setCities(cityList);
    } catch (err) {
      console.error('Error fetching cities:', err);
      toast.error("Failed to fetch cities", { description: "Please try again later" });
    }
  };

  const fetchCountries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/countries`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }
      const data = await response.json() as Country[];
      // console.log('Countries data:', data);
      const countryList = data.map((country: Country) => {
        return {
          id: country.id.toString(), 
          country_name: country.country_name,
          country_code: country.country_code,
        }        
      });
      setCountries(countryList);
    } catch (err) {
      console.error('Error fetching countries:', err);
      toast.error("Failed to fetch countries", { description: "Please try again later" });
    } 
  };

  useEffect(() => {
    fetchCities();
    fetchCountries();
  }, []);

  const filteredCities = cities.filter(
    (city) =>
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.city_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.country_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSort = (key: keyof City) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }
    
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
  };

  const sortedAndFilteredCities = [...filteredCities].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'ascending' ? comparison : -comparison;
  });

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = sortedAndFilteredCities.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedAndFilteredCities.length / itemsPerPage)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

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

  const handleFormSubmit = async (data: { city_name: string; city_code: string; country_id: string }) => {
    try {
      const country = countries.find((c) => c.id === data.country_id)
     
      if (!country) return
  
      if (editingCity) {
        // Update existing city
        const response = await fetch(`${API_URL}/api/cities/${editingCity.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            city_name: data.city_name,
            city_code: data.city_code,
            country_id: data.country_id,           
          }),
        });
        console.log('Update response:', response)
  
        if (!response.ok) {
          throw new Error('Failed to update city');
        }
  
        const responseData = await response.json() as City;
        
        console.log('Updated city data:', responseData)
  
        setCities((prev) =>
          prev.map((city) =>
            city.id === editingCity.id
              ? {
                  ...city,
                  city_name: responseData.city_name,
                  city_code: responseData.city_code,
                  country_id: responseData.country_id,
                  country: {
                    id: responseData.country_id,
                    country_name: country.country_name, // Ensure country name is updated
                    country_code: country.country_code, // Ensure country code is updated
                  },
                  // countryName: country.country_name, // Update the countryName field with the new name,
                }
              : city,
          ),
        )
        toast.success("City updated successfully", {
          description: `${responseData.city_name} has been updated`,
        })
      } else {
        // Add new city
        const response = await fetch(`${API_URL}/api/cities`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            city_name: data.city_name,
            city_code: data.city_code,
            country_id: data.country_id,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add city');
        }
        const responseData = await response.json() as City;
        const newCity: City = {
          id:responseData.id,
          city_name: responseData.city_name,
          city_code: responseData.city_code,
          country_id: responseData.country_id,
          country: {
            id: responseData.country_id,
            country_name: country.country_name,
            country_code: country.country_code,
          },
          createdAt: new Date().toISOString().split("T")[0],
        }
        setCities((prev) => [...prev, newCity])
        toast.success("City added successfully", {
          description: `${responseData.city_name} has been added to the system`,
        })
      }
    } catch (err) {
      console.error('Error saving city:', err);
      toast.error("Failed to save city", { description: "Please try again later" });
      return;
    }
    setIsFormOpen(false)
    setEditingCity(null)
  }

  const confirmDelete = async () => {
    if (cityToDelete) {
      try {
        const response = await fetch(`${API_URL}/api/cities/${cityToDelete.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete city');
        }

        setCities((prev) => prev.filter((city) => city.id !== cityToDelete.id))
        toast.success("City deleted successfully", {
          description: `${cityToDelete.city_name} has been removed from the system`,
        })
      } catch (err) {
        console.error('Error deleting city:', err);
        toast.error("Failed to delete city", { description: "Please try again later" });
        return;
      }
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
                  <TableHead className="w-[50px]">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('id')}
                      className="flex items-center"
                    >
                      #
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('city_name')}
                      className="flex items-center"
                    >
                      City Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('city_code')}
                      className="flex items-center"
                    >
                      City Code
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('countryName')}
                      className="flex items-center"
                    >
                      Country
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center"
                    >
                      Created Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchTerm ? "No cities found matching your search." : "No cities available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentItems.map((city, index) => (
                    <TableRow key={city.id}>
                      <TableCell className="text-muted-foreground">
                        {indexOfFirstItem + index + 1}
                      </TableCell>
                      <TableCell className="font-medium">{city.city_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{city.city_code}</Badge>
                      </TableCell>
                      <TableCell>{city.country.country_name}</TableCell>
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

          {/* Pagination Controls */}
          {sortedAndFilteredCities.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedAndFilteredCities.length)} of {sortedAndFilteredCities.length} entries
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
        onApprove={confirmDelete}
        title="Delete City"
        description={`Are you sure you want to delete "${cityToDelete?.city_name}"? This action cannot be undone.`}
        approveText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
