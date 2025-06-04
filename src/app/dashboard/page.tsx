import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, ShieldCheck, Bell, TrendingUp, BarChart3, Calendar } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+6 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">356</div>
            <p className="text-xs text-muted-foreground">+24 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">No change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+3 new today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Performance Overview</CardTitle>
            <CardDescription className="text-sm">Monthly performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <BarChart3 className="h-12 w-12 sm:h-16 sm:w-16" />
              <p className="text-sm sm:text-base">Performance chart will appear here</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Recent Activities</CardTitle>
            <CardDescription className="text-sm">Latest activities in your admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: Users, text: "New employee John Smith added", time: "2 hours ago" },
                { icon: FileText, text: "Annual report uploaded", time: "Yesterday" },
                { icon: ShieldCheck, text: "Role permissions updated", time: "2 days ago" },
                { icon: Calendar, text: "Team meeting scheduled", time: "3 days ago" },
                { icon: TrendingUp, text: "Monthly analytics report", time: "1 week ago" },
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="rounded-full bg-muted p-1.5 sm:p-2 flex-shrink-0">
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium leading-tight">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
