"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Building,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";

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
  type: "user_registration" | "payment" | "event" | "donation" | "program" | "general";
  status: "sent" | "pending" | "failed";
  recipient: string;
  sentDate: string;
  method: string;
  userRole?: string;
  relatedId?: string;
}

export default function NotificationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        
        // Fetch all user types concurrently
        const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
          fetch('http://localhost:5000/api/candidates'),
          fetch('http://localhost:5000/api/employers'),
          fetch('http://localhost:5000/api/agencies')
        ]);

        const candidates = await candidatesRes.json();
        const employers = await employersRes.json();
        const agencies = await agenciesRes.json();

        // Combine all users and sort by creation date (newest first)
        const allUsers: User[] = [
          ...candidates.map((candidate: any) => ({
            id: candidate.id,
            name: `${candidate.firstName} ${candidate.lastName}`,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            role: "candidate" as const,
            status: candidate.status || "pending",
            joinDate: candidate.createdAt || new Date().toISOString(),
            createdAt: candidate.createdAt,
          })),
          ...employers.map((employer: any) => ({
            id: employer.id,
            name: employer.companyName,
            email: employer.email,
            phone: employer.phone,
            role: "employer" as const,
            status: employer.status || "pending",
            joinDate: employer.createdAt || new Date().toISOString(),
            companyName: employer.companyName,
            createdAt: employer.createdAt,
          })),
          ...agencies.map((agency: any) => ({
            id: agency.id,
            name: agency.agencyName,
            email: agency.contactEmail || agency.directorEmail,
            phone: agency.contactPhone || agency.directorPhone,
            role: "agency" as const,
            status: agency.status || "pending",
            joinDate: agency.createdAt || new Date().toISOString(),
            agencyName: agency.agencyName,
            createdAt: agency.createdAt,
          }))
        ];

        // Sort by creation date (newest first)
        const recentUsers = allUsers
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 20); // Show only 20 most recent

        // Convert users to notifications
        const userNotifications: Notification[] = recentUsers.map((user) => ({
          id: `user-${user.id}`,
          title: `New ${getRoleDisplayName(user.role)} Registration`,
          message: user.role === "candidate" 
            ? `${user.firstName} ${user.lastName} has registered as a candidate`
            : user.role === "employer"
            ? `${user.companyName} has registered as an employer`
            : `${user.agencyName} has registered as an agency`,
          type: "user_registration" as const,
          status: "sent" as const,
          recipient: getRoleDisplayName(user.role),
          sentDate: user.createdAt,
          method: "System",
          userRole: user.role,
          relatedId: user.id,
        }));

        // Add some system notifications
        const systemNotifications: Notification[] = [
          {
            id: "sys-001",
            title: "System Update Completed",
            message: "New platform features have been successfully deployed",
            type: "general",
            status: "sent",
            recipient: "All Users",
            sentDate: new Date().toISOString(),
            method: "System",
          },
          {
            id: "sys-002",
            title: "Database Maintenance",
            message: "Weekly database backup completed successfully",
            type: "general",
            status: "sent",
            recipient: "System Admins",
            sentDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            method: "System",
          },
          {
            id: "sys-003",
            title: "Payment System Update",
            message: "Payment processing system has been upgraded to version 2.1",
            type: "payment",
            status: "sent",
            recipient: "Finance Team",
            sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            method: "Email",
          }
        ];

        setNotifications([...userNotifications, ...systemNotifications]);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to sample data if API fails
        setNotifications(getFallbackNotifications());
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Fallback notifications in case API fails
  const getFallbackNotifications = (): Notification[] => {
    return [
      {
        id: "user-001",
        title: "New Candidate Registration",
        message: "John Doe has registered as a candidate",
        type: "user_registration",
        status: "sent",
        recipient: "Candidate",
        sentDate: new Date().toISOString(),
        method: "System",
        userRole: "candidate",
      },
      {
        id: "user-002",
        title: "New Employer Registration",
        message: "Tech Solutions Inc has registered as an employer",
        type: "user_registration",
        status: "sent",
        recipient: "Employer",
        sentDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        method: "System",
        userRole: "employer",
      },
      {
        id: "user-003",
        title: "New Agency Registration",
        message: "Global Recruiters has registered as an agency",
        type: "user_registration",
        status: "sent",
        recipient: "Agency",
        sentDate: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        method: "System",
        userRole: "agency",
      },
    ];
  };

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

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || notification.type === filterType;
    const matchesStatus =
      filterStatus === "all" || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "sent":
        return "ተልኳል / Sent";
      case "pending":
        return "በመጠባበቅ / Pending";
      case "failed":
        return "አልተሳካም / Failed";
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "payment":
        return "ክፍያ / Payment";
      case "user_registration":
        return "የተጠቃሚ ምዝገባ / User Registration";
      case "event":
        return "ክስተት / Event";
      case "donation":
        return "ልገሳ / Donation";
      case "program":
        return "ፕሮግራም / Program";
      case "general":
        return "አጠቃላይ / General";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string, userRole?: string) => {
    if (type === "user_registration" && userRole) {
      return getRoleIcon(userRole);
    }
    
    switch (type) {
      case "payment":
        return CheckCircle;
      case "event":
        return Clock;
      case "donation":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const sentNotifications = filteredNotifications.filter(
    (n) => n.status === "sent"
  ).length;
  const pendingNotifications = filteredNotifications.filter(
    (n) => n.status === "pending"
  ).length;
  const failedNotifications = filteredNotifications.filter(
    (n) => n.status === "failed"
  ).length;

  if (loading) {
    return (
      <DashboardLayout
        userRole="admin"
        userName="Admin User"
        userEmail="admin@rams.et"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin User"
      userEmail="admin@rams.et"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gray-600 bg-clip-text text-transparent">
              Notifications
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all system notifications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {filteredNotifications.length}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Notifications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-8 w-8 text-emerald-600" />
                <div>
                  <p className="text-2xl font-bold">{sentNotifications}</p>
                  <p className="text-sm text-gray-600">Sent</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{pendingNotifications}</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{failedNotifications}</p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, recipient, or ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Type:{" "}
                  {filterType === "all"
                    ? "ሁሉም / All"
                    : getTypeLabel(filterType)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  Filter by Type
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Types
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("user_registration")}>
                  User Registration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("payment")}>
                  Payment
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("donation")}>
                  Donation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("event")}>
                  Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("general")}>
                  General
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Status:{" "}
                  {filterStatus === "all"
                    ? "ሁሉም / All"
                    : getStatusLabel(filterStatus)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  Filter by Status
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("sent")}>
                  Sent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("failed")}>
                  Failed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>
              All sent and pending notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.map((notification) => {
                  const StatusIcon = getStatusIcon(notification.status);
                  const TypeIcon = getTypeIcon(notification.type, notification.userRole);
                  return (
                    <TableRow
                      key={notification.id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <span className="font-mono text-sm font-medium">
                          {notification.id}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <TypeIcon className="h-4 w-4 text-gray-500" />
                          <Badge variant="outline">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {notification.message}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {notification.recipient}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{notification.method}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm">
                            {new Date(notification.sentDate).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.sentDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge
                            className={getStatusColor(notification.status)}
                          >
                            {getStatusLabel(notification.status)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link
                              href={`/dashboard/admin/users`}
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {notification.status === "failed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-600"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ምንም ማሳወቂያዎች አልተገኙም / No notifications found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== "all" || filterStatus !== "all"
                  ? "የፍለጋ ወይም የማጣሪያ መስፈርቶችዎን ማስተካከል ይሞክሩ / Try adjusting your search or filter criteria."
                  : "ምንም የማሳወቂያ ታሪክ የለም / No notification history available."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}