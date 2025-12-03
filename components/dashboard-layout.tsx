"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Building,
  FileText,
  CreditCard,
  Wrench,
  BarChart3,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Menu,
  User,
  ChevronDown,
  Building2,
  Grid,
  Calendar,
  Handshake,
  MessageCircle,
  UserCheck,
  DollarSign,
  Heart,
  MapPin,
  Package,
  Book,
  Star,
  Shield,
  ArrowLeft,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import NotificationDropdown from "@/components/notification-dropdown";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: "admin";
  userName?: string;
  userEmail?: string;
}

const navigationItems = {
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: Home },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Candidates", href: "/dashboard/admin/candidate", icon: User },
    { name: "Employers", href: "/dashboard/admin/employer", icon: UserCheck },
    { name: "Agencies", href: "/dashboard/admin/agency", icon: Handshake },
    { name: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Reports", href: "/dashboard/admin/reports", icon: BarChart3 },
    { name: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

export default function DashboardLayout({
  children,
  userRole,
  userName,
  userEmail,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const navigation = navigationItems[userRole] || [];
  const displayName = userName || "Admin User";

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      default:
        return role;
    }
  };

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:w-[280px]">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-b from-white via-white to-gray-50/50 border-r border-gray-100 px-6 py-6 shadow-xl">
          {/* Logo Section */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-4">
           {/* Logo Container */}
<div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-100 relative overflow-hidden">
  {logoLoaded ? (
    <div className="relative w-10 h-10">
      <img 
        src="/ted.ico" 
        alt="Logo" 
        className="w-full h-full object-contain"
        onError={() => setLogoLoaded(false)}
      />
    </div>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl">
      <Building2 className="h-6 w-6 text-white" />
    </div>
  )}
</div>

              {/* Text Section */}
              <div>
                <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  TEDBEER
                </span>
                <p className="text-xs text-gray-600 font-medium max-w-full truncate">
                  Global Recruitment Solutions
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col mt-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              <li>
                <div className="px-2 mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main Menu
                  </span>
                </div>
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium leading-5 transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 shadow-sm"
                              : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600 hover:border hover:border-blue-100"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isActive
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="truncate">{item.name}</span>
                          {isActive && (
                            <div className="ml-auto w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            </ul>
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-gray-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start p-3 h-auto hover:bg-blue-50/50 rounded-xl group"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <Avatar className="h-10 w-10 ring-2 ring-blue-200 group-hover:ring-blue-300 transition-all">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white font-bold">
                        {displayName
                          .split(" ")
                          .slice(-2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {displayName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={cn(
                            "text-xs font-medium px-2 py-0.5",
                            getRoleColor(userRole)
                          )}
                        >
                          {getRoleLabel(userRole)}
                        </Badge>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl"
              >
                <DropdownMenuLabel className="text-center p-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Avatar className="h-14 w-14 ring-2 ring-blue-100">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white text-lg">
                        {displayName
                          .split(" ")
                          .slice(-2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">{displayName}</div>
                      <div className="text-xs text-gray-500 font-normal mt-1">
                        {userEmail || "admin@tedbeer.com"}
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-blue-50" asChild>
                  <Link href={`/dashboard/${userRole}/profile`}>
                    <User className="mr-3 h-4 w-4 text-gray-500" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-blue-50" asChild>
                  <Link href={`/dashboard/${userRole}/settings`}>
                    <Settings className="mr-3 h-4 w-4 text-gray-500" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer p-3 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent
          side="left"
          className="w-80 p-0 bg-white border-r border-gray-200"
        >
          <div className="flex h-full flex-col">
            {/* Logo Section */}
            <div className="flex h-20 shrink-0 items-center px-6 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-100 relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    TEDBEER
                  </span>
                  <p className="text-xs text-gray-600 font-medium">
                    Global Recruitment Solutions
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4">
                <ul role="list" className="space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-x-3 rounded-xl p-3 text-sm font-medium leading-5 transition-all duration-200",
                            isActive
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700"
                              : "text-gray-700 hover:bg-blue-50/50 hover:text-blue-600"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <div className={cn(
                            "p-2 rounded-lg",
                            isActive
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-600"
                          )}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Mobile Profile */}
            <div className="border-t border-gray-100 p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-blue-200">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                    {displayName
                      .split(" ")
                      .slice(-2)
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{displayName}</p>
                  <Badge className={cn("text-xs", getRoleColor(userRole))}>
                    {getRoleLabel(userRole)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="lg:pl-[280px]">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-20 shrink-0 items-center border-b border-gray-100 bg-white/90 backdrop-blur-xl px-4 shadow-sm sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-between">
            {/* Left side - Menu toggle and breadcrumb */}
            <div className="flex items-center gap-x-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden hover:bg-blue-50"
                  >
                    <Menu className="h-5 w-5 text-gray-600" />
                  </Button>
                </SheetTrigger>
              </Sheet>

              {/* Breadcrumb */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm font-medium text-gray-700">
                  {navigation.find(item => pathname.startsWith(item.href))?.name || 'Dashboard'}
                </span>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search candidates, employers, or agencies..."
                  className="pl-10 h-10 border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-300"
                />
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-x-4">
              {/* Notifications */}
              <NotificationDropdown userRole={userRole} />
              {/* Desktop Profile */}
              <div className="hidden lg:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{displayName}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                          {displayName
                            .split(" ")
                            .slice(-2)
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userRole}/profile`}>
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userRole}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-5rem)]">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Optional: Page Header */}
            {pathname === "/dashboard/admin" && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {displayName.split(' ')[0]}!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your recruitment agency today.</p>
              </div>
            )}
            
            {/* Children Content */}
            <div className="animate-in fade-in duration-500">
              {children}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500">
              © {new Date().getFullYear()} TEDBEER Recruitment Agency. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span className="text-xs text-gray-400">v2.1.0</span>
              <div className="h-1 w-1 rounded-full bg-gray-300"></div>
              <span className="text-xs text-green-600 flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-1 animate-pulse"></div>
                System Online
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// Add missing Plus icon component
const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);