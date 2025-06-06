interface LoginCredentials {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  password_confirmation: string
  role?: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: string
  position?: string
  created_at: string
}

interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
    token_type: string
  }
}

interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Record<string, string[]>
}

class ApiService {
  private baseURL: string
  private token: string | null = null
  private isApiAvailable = true

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"
    this.token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
  }

  private async checkApiHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })
      return response.ok
    } catch (error) {
      console.warn("API health check failed:", error)
      return false
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      this.isApiAvailable = true
      return data
    } catch (error: any) {
      console.error("API request failed:", error)

      // Check if it's a network error
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please check your connection")
      }

      if (error.message.includes("fetch")) {
        this.isApiAvailable = false
        throw new Error("Unable to connect to server - using demo mode")
      }

      throw error
    }
  }

  // Demo authentication for when API is not available
  private async demoLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const demoUsers = [
      {
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        role: "admin",
        department: "IT",
        position: "System Administrator",
      },
      {
        id: 2,
        name: "Manager User",
        email: "manager@example.com",
        role: "manager",
        department: "Operations",
        position: "Operations Manager",
      },
      {
        id: 3,
        name: "John Doe",
        email: "john@example.com",
        role: "employee",
        department: "Sales",
        position: "Sales Representative",
      },
    ]

    const user = demoUsers.find((u) => u.email === credentials.email)

    if (!user || credentials.password !== "password1") {
      throw new Error("Invalid credentials")
    }

    const token = `demo_token_${user.id}_${Date.now()}`

    return {
      success: true,
      message: "Login successful (Demo Mode)",
      data: {
        user: { ...user, created_at: new Date().toISOString() },
        token,
        token_type: "Bearer",
      },
    }
  }

  // Auth methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // First check if API is available
      const isHealthy = await this.checkApiHealth()

      if (!isHealthy) {
        console.warn("API not available, using demo mode")
        return await this.demoLogin(credentials)
      }

      const response = await this.request<AuthResponse["data"]>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      })

      if (response.success && response.data) {
        this.token = response.data.token
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("auth_mode", "api")
      }

      return response as AuthResponse
    } catch (error: any) {
      // If API fails, fall back to demo mode
      if (!this.isApiAvailable || error.message.includes("connect")) {
        console.warn("Falling back to demo mode due to API error:", error.message)
        const demoResponse = await this.demoLogin(credentials)
        localStorage.setItem("auth_mode", "demo")
        return demoResponse
      }
      throw error
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.request<AuthResponse["data"]>("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      if (response.success && response.data) {
        this.token = response.data.token
        localStorage.setItem("auth_token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("auth_mode", "api")
      }

      return response as AuthResponse
    } catch (error: any) {
      if (!this.isApiAvailable) {
        throw new Error("Registration not available in demo mode")
      }
      throw error
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.isApiAvailable && localStorage.getItem("auth_mode") === "api") {
        await this.request("/auth/logout", {
          method: "POST",
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      this.token = null
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
      localStorage.removeItem("auth_mode")
    }
  }

  async getMe(): Promise<ApiResponse<{ user: User }>> {
    if (localStorage.getItem("auth_mode") === "demo") {
      const user = this.getCurrentUser()
      if (user) {
        return {
          success: true,
          data: { user },
        }
      }
    }
    return this.request("/auth/me")
  }

  // User methods with demo fallback
  async getUsers(params?: { search?: string; per_page?: number }): Promise<ApiResponse> {
    if (localStorage.getItem("auth_mode") === "demo") {
      // Return demo users
      const demoUsers = [
        {
          id: 1,
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          department: "IT",
          position: "System Administrator",
        },
        {
          id: 2,
          name: "Manager User",
          email: "manager@example.com",
          role: "manager",
          department: "Operations",
          position: "Operations Manager",
        },
        {
          id: 3,
          name: "John Doe",
          email: "john@example.com",
          role: "employee",
          department: "Sales",
          position: "Sales Representative",
        },
        {
          id: 4,
          name: "Jane Smith",
          email: "jane@example.com",
          role: "employee",
          department: "Marketing",
          position: "Marketing Specialist",
        },
      ]

      let filteredUsers = demoUsers
      if (params?.search) {
        filteredUsers = demoUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(params.search!.toLowerCase()) ||
            user.email.toLowerCase().includes(params.search!.toLowerCase()),
        )
      }

      return {
        success: true,
        data: {
          data: filteredUsers,
          total: filteredUsers.length,
          per_page: params?.per_page || 10,
          current_page: 1,
        },
      }
    }

    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString())

    const query = searchParams.toString()
    return this.request(`/users${query ? `?${query}` : ""}`)
  }

  async createUser(userData: Partial<User> & { password: string }): Promise<ApiResponse<User>> {
    if (localStorage.getItem("auth_mode") === "demo") {
      throw new Error("User creation not available in demo mode")
    }
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  }

  async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    if (localStorage.getItem("auth_mode") === "demo") {
      throw new Error("User updates not available in demo mode")
    }
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number): Promise<ApiResponse> {
    if (localStorage.getItem("auth_mode") === "demo") {
      throw new Error("User deletion not available in demo mode")
    }
    return this.request(`/users/${id}`, {
      method: "DELETE",
    })
  }

  // Utility methods
  setToken(token: string) {
    this.token = token
    localStorage.setItem("auth_token", token)
  }

  getToken(): string | null {
    return this.token
  }

  isAuthenticated(): boolean {
    return !!this.token || !!localStorage.getItem("auth_token")
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user")
    return userStr ? JSON.parse(userStr) : null
  }

  getAuthMode(): "api" | "demo" | null {
    return localStorage.getItem("auth_mode") as "api" | "demo" | null
  }

  isApiConnected(): boolean {
    return this.isApiAvailable && localStorage.getItem("auth_mode") === "api"
  }
}

export const apiService = new ApiService()
export type { User, LoginCredentials, RegisterData, AuthResponse, ApiResponse }
