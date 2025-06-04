import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, CheckCircle, AlertCircle, InfoIcon, Clock } from "lucide-react"

export default function NotificationsPage() {
  // Sample notification data
  const notifications = {
    unread: [
      {
        id: 1,
        title: "New Document Uploaded",
        message: "Annual Report 2023.pdf has been uploaded by Jane Smith",
        time: "2 hours ago",
        type: "info",
      },
      {
        id: 2,
        title: "Employee Status Change",
        message: "Robert Johnson is now on leave",
        time: "5 hours ago",
        type: "warning",
      },
      {
        id: 3,
        title: "System Update",
        message: "The system will undergo maintenance tonight at 11 PM",
        time: "Yesterday",
        type: "alert",
      },
    ],
    read: [
      {
        id: 4,
        title: "Role Permission Updated",
        message: "Manager role permissions have been updated",
        time: "2 days ago",
        type: "success",
      },
      {
        id: 5,
        title: "New Employee Added",
        message: "Emily Davis has been added to the Engineering department",
        time: "3 days ago",
        type: "info",
      },
      {
        id: 6,
        title: "Document Deleted",
        message: "Old Financial Report.xlsx has been deleted by Michael Wilson",
        time: "5 days ago",
        type: "warning",
      },
      {
        id: 7,
        title: "Password Changed",
        message: "Your account password was changed successfully",
        time: "1 week ago",
        type: "success",
      },
      {
        id: 8,
        title: "Login from New Device",
        message: "Your account was accessed from a new device",
        time: "2 weeks ago",
        type: "alert",
      },
    ],
  }

  // Function to get the appropriate icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "info":
      default:
        return <InfoIcon className="h-5 w-5 text-blue-500" />
    }
  }

  // Notification component
  const NotificationItem = ({ notification }: { notification: any }) => (
    <div className="flex items-start gap-3 sm:gap-4 rounded-lg border p-3 sm:p-4 hover:bg-muted/50">
      <div className="mt-0.5 sm:mt-1 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <p className="text-sm font-medium leading-tight">{notification.title}</p>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            {notification.time}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{notification.message}</p>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <p className="text-sm sm:text-base text-muted-foreground">Stay updated with the latest activities</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          Mark All as Read
        </Button>
      </div>

      <Tabs defaultValue="unread" className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unread" className="relative text-xs sm:text-sm">
            Unread
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
              {notifications.unread.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="all" className="text-xs sm:text-sm">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3 sm:space-y-4">
          {notifications.unread.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {notifications.unread.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-10">
                <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
                <p className="mt-3 sm:mt-4 text-base sm:text-lg font-medium">No unread notifications</p>
                <p className="text-xs sm:text-sm text-muted-foreground">You're all caught up!</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3 sm:space-y-4">
          <div className="space-y-3 sm:space-y-4">
            {[...notifications.unread, ...notifications.read].map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Notification Settings</CardTitle>
          <CardDescription className="text-sm">Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            You can customize your notification settings in your profile preferences.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href="/dashboard/profile?tab=notifications">Go to Settings</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
