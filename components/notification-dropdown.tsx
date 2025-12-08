"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  BookMarked as MarkAsRead,
  X,
  User,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  role: "candidate" | "employer" | "agency" | "admin";
  status: "active" | "inactive" | "pending";
  joinDate: string;
  companyName?: string;
  agencyName?: string;
  createdAt: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "user_registration" | "payment" | "maintenance" | "general";
  status: "read" | "unread";
  date: string;
  priority: "high" | "normal" | "low";
  actionUrl?: string;
  relatedId?: string;
  userRole?: string;
}

interface NotificationDropdownProps {
  userRole: "admin";
}

const getRoleDisplayName = (role: string) => {
  switch (role) {
    case "candidate":
      return "Candidate";
    case "employer":
      return "Employer";
    case "agency":
      return "Agency";
    default:
      return role;
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case "candidate":
      return User;
    case "employer":
      return Building;
    case "agency":
      return Briefcase;
    default:
      return User;
  }
};

// Helper function to safely extract array from response
const extractArrayFromResponse = (data: any): any[] => {
  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // If data has a results or data property that is an array
  if (data && typeof data === 'object') {
    if (Array.isArray(data.results)) {
      return data.results;
    }
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.users)) {
      return data.users;
    }
    if (Array.isArray(data.candidates)) {
      return data.candidates;
    }
    if (Array.isArray(data.employers)) {
      return data.employers;
    }
    if (Array.isArray(data.agencies)) {
      return data.agencies;
    }
  }
  
  // If we can't find an array, return empty array
  console.warn('Could not extract array from response:', data);
  return [];
};

export default function NotificationDropdown({
  userRole,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch real notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all user types concurrently
        const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
          fetch('http://localhost:5000/api/candidates'),
          fetch('http://localhost:5000/api/employers'),
          fetch('http://localhost:5000/api/agencies')
        ]);

        // Check if responses are OK
        if (!candidatesRes.ok || !employersRes.ok || !agenciesRes.ok) {
          throw new Error('Failed to fetch user data');
        }

        const candidatesData = await candidatesRes.json();
        const employersData = await employersRes.json();
        const agenciesData = await agenciesRes.json();

        // Extract arrays safely from responses
        const candidates = extractArrayFromResponse(candidatesData);
        const employers = extractArrayFromResponse(employersData);
        const agencies = extractArrayFromResponse(agenciesData);

        // Log for debugging
        console.log('Fetched data:', {
          candidatesCount: candidates.length,
          employersCount: employers.length,
          agenciesCount: agencies.length
        });

        // Combine all users and sort by creation date (newest first)
        const allUsers: User[] = [
          ...candidates.map((candidate: any) => ({
            id: candidate.id || candidate._id || `candidate-${Date.now()}`,
            name: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Unknown Candidate',
            firstName: candidate.firstName || '',
            lastName: candidate.lastName || '',
            email: candidate.email || 'No email',
            phone: candidate.phone || 'No phone',
            role: "candidate" as const,
            status: (candidate.status || "pending") as "active" | "inactive" | "pending",
            joinDate: candidate.createdAt || candidate.joinDate || new Date().toISOString(),
            createdAt: candidate.createdAt || candidate.joinDate || new Date().toISOString(),
          })),
          ...employers.map((employer: any) => ({
            id: employer.id || employer._id || `employer-${Date.now()}`,
            name: employer.companyName || employer.name || 'Unknown Company',
            email: employer.email || employer.contactEmail || 'No email',
            phone: employer.phone || employer.contactPhone || 'No phone',
            role: "employer" as const,
            status: (employer.status || "pending") as "active" | "inactive" | "pending",
            joinDate: employer.createdAt || employer.joinDate || new Date().toISOString(),
            companyName: employer.companyName || employer.name,
            createdAt: employer.createdAt || employer.joinDate || new Date().toISOString(),
          })),
          ...agencies.map((agency: any) => ({
            id: agency.id || agency._id || `agency-${Date.now()}`,
            name: agency.agencyName || agency.name || 'Unknown Agency',
            email: agency.contactEmail || agency.directorEmail || agency.email || 'No email',
            phone: agency.contactPhone || agency.directorPhone || agency.phone || 'No phone',
            role: "agency" as const,
            status: (agency.status || "pending") as "active" | "inactive" | "pending",
            joinDate: agency.createdAt || agency.joinDate || new Date().toISOString(),
            agencyName: agency.agencyName || agency.name,
            createdAt: agency.createdAt || agency.joinDate || new Date().toISOString(),
          }))
        ];

        // Sort by creation date (newest first) and take only recent ones
        const recentUsers = allUsers
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 10); // Show only 10 most recent

        // Convert users to notifications
        const userNotifications: Notification[] = recentUsers.map((user, index) => ({
          id: `user-${user.id}-${index}`,
          title: `New ${getRoleDisplayName(user.role)} Registration`,
          message: user.role === "candidate" 
            ? `${user.firstName} ${user.lastName} has registered as a candidate`
            : user.role === "employer"
            ? `${user.name} has registered as an employer`
            : `${user.name} has registered as an agency`,
          type: "user_registration" as const,
          status: "unread" as const,
          date: user.createdAt,
          priority: user.status === "pending" ? "high" as const : "normal" as const,
          actionUrl: "/dashboard/admin/users",
          relatedId: user.id,
          userRole: user.role,
        }));

        // Add some system notifications (you can customize these)
        const systemNotifications: Notification[] = [
          {
            id: "sys-001",
            title: "System Update",
            message: "New features have been deployed to the platform",
            type: "general",
            status: "unread",
            date: new Date().toISOString(),
            priority: "normal",
            actionUrl: "/dashboard/admin/settings",
          },
          {
            id: "sys-002",
            title: "Database Backup",
            message: "Weekly database backup completed successfully",
            type: "general",
            status: "unread",
            date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            priority: "low",
          }
        ];

        setNotifications([...userNotifications, ...systemNotifications]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications');
        // Fallback to sample data if API fails
        setNotifications(getFallbackNotifications());
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Refresh notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Fallback notifications in case API fails
  const getFallbackNotifications = (): Notification[] => {
    return [
      {
        id: "user-001",
        title: "New Candidate Registration",
        message: "John Doe has registered as a candidate",
        type: "user_registration",
        status: "unread",
        date: new Date().toISOString(),
        priority: "high",
        actionUrl: "/dashboard/admin/users",
        userRole: "candidate",
      },
      {
        id: "user-002",
        title: "New Employer Registration",
        message: "Tech Solutions Inc has registered as an employer",
        type: "user_registration",
        status: "unread",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        priority: "normal",
        actionUrl: "/dashboard/admin/users",
        userRole: "employer",
      },
      {
        id: "user-003",
        title: "New Agency Registration",
        message: "Global Recruiters has registered as an agency",
        type: "user_registration",
        status: "unread",
        date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        priority: "normal",
        actionUrl: "/dashboard/admin/users",
        userRole: "agency",
      },
    ];
  };

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === notificationId ? { ...n, status: "read" as const } : n
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read" as const }))
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const getTypeIcon = (type: string, userRole?: string) => {
    if (type === "user_registration" && userRole) {
      const RoleIcon = getRoleIcon(userRole);
      return RoleIcon;
    }
    
    switch (type) {
      case "payment":
        return CheckCircle;
      case "maintenance":
        return AlertCircle;
      case "user_registration":
        return User;
      default:
        return Bell;
    }
  };

  const getTypeColor = (type: string, userRole?: string) => {
    if (type === "user_registration") {
      switch (userRole) {
        case "candidate":
          return "text-green-600";
        case "employer":
          return "text-blue-600";
        case "agency":
          return "text-orange-600";
        default:
          return "text-gray-600";
      }
    }
    
    switch (type) {
      case "payment":
        return "text-emerald-600";
      case "maintenance":
        return "text-orange-600";
      case "user_registration":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "normal":
        return "bg-blue-100 text-blue-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Recently";
      }
      
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (error) {
      return "Recently";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative hover:bg-emerald-50"
          disabled={loading}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center animate-pulse">
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">View notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 bg-white/95 backdrop-blur-sm border-0 shadow-2xl"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark All Read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-blue-600 hover:text-blue-700"
              >
                <Link href={`/dashboard/${userRole}/notifications`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View All
                </Link>
              </Button>
            </div>
          </div>

          <ScrollArea className="h-96">
            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-500 mb-2">{error}</p>
                  <p className="text-gray-500 text-sm">Showing sample notifications</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const TypeIcon = getTypeIcon(notification.type, notification.userRole);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:shadow-md ${
                        notification.status === "unread"
                          ? "bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200"
                          : "bg-white border-gray-100 hover:bg-gray-50"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            notification.status === "unread"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <TypeIcon
                            className={`h-4 w-4 ${
                              notification.status === "unread"
                                ? getTypeColor(notification.type, notification.userRole)
                                : "text-gray-600"
                            }`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4
                              className={`font-medium text-sm ${
                                notification.status === "unread"
                                  ? "text-gray-900"
                                  : "text-gray-700"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1 ml-2">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                              {notification.status === "unread" && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatTimeAgo(notification.date)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>

          {notifications.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="border-emerald-300 hover:bg-emerald-50"
                >
                  <Link href={`/dashboard/${userRole}/notifications`}>
                    View All Notifications
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}