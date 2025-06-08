"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Database,
  HardDrive,
  Server,
  Shield,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Settings,
  Activity,
  Clock,
} from "lucide-react"
import { toast } from "sonner"

export default function MaintenancePage() {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [systemStatus, setSystemStatus] = useState({
    database: "healthy",
    storage: "warning",
    server: "healthy",
    security: "healthy",
  })

  const handleMaintenanceToggle = () => {
    setIsMaintenanceMode(!isMaintenanceMode)
    toast.success(isMaintenanceMode ? "Maintenance mode disabled" : "Maintenance mode enabled", {
      description: isMaintenanceMode ? "System is now accessible to all users" : "System is now in maintenance mode",
    })
  }

  const handleSystemAction = (action: string) => {
    toast.info(`${action} initiated`, {
      description: "This operation may take a few minutes to complete",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Healthy</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">System Maintenance</h1>
        <p className="text-muted-foreground">Monitor and maintain system health and performance</p>
      </div>

      {/* Maintenance Mode Alert */}
      {isMaintenanceMode && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">System is currently in maintenance mode</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">99.9%</div>
              {getStatusBadge(systemStatus.database)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Uptime</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">78%</div>
              {getStatusBadge(systemStatus.storage)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Used</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Server</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2.1GB</div>
              {getStatusBadge(systemStatus.server)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Memory Usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">0</div>
              {getStatusBadge(systemStatus.security)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Threats</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Maintenance Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Controls</CardTitle>
            <CardDescription>System maintenance and operational controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Maintenance Mode</h4>
                <p className="text-sm text-muted-foreground">Restrict system access for maintenance</p>
              </div>
              <Button variant={isMaintenanceMode ? "destructive" : "default"} onClick={handleMaintenanceToggle}>
                {isMaintenanceMode ? "Disable" : "Enable"}
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("System restart")}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Restart System
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("Cache clear")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cache
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("System optimization")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Optimize System
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Backup & Recovery */}
        <Card>
          <CardHeader>
            <CardTitle>Backup & Recovery</CardTitle>
            <CardDescription>Data backup and recovery operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Last Backup</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <Separator />

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("Database backup")}
              >
                <Download className="mr-2 h-4 w-4" />
                Create Backup
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("Database restore")}
              >
                <Upload className="mr-2 h-4 w-4" />
                Restore Backup
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSystemAction("Backup schedule")}
              >
                <Clock className="mr-2 h-4 w-4" />
                Schedule Backup
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Activity</CardTitle>
          <CardDescription>Latest system events and maintenance logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                time: "2 minutes ago",
                event: "System health check completed",
                status: "success",
              },
              {
                time: "15 minutes ago",
                event: "Database optimization finished",
                status: "success",
              },
              {
                time: "1 hour ago",
                event: "Storage cleanup completed",
                status: "success",
              },
              {
                time: "2 hours ago",
                event: "Automated backup created",
                status: "success",
              },
              {
                time: "3 hours ago",
                event: "Security scan completed",
                status: "warning",
              },
            ].map((log, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Activity className={`h-4 w-4 ${log.status === "success" ? "text-green-600" : "text-yellow-600"}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.event}</p>
                  <p className="text-xs text-muted-foreground">{log.time}</p>
                </div>
                {getStatusBadge(log.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
