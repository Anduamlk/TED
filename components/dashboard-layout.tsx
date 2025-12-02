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
	Building2,Grid,Calendar,
	Handshake,MessageCircle,
	UserCheck,DollarSign,  
	Heart,MapPin,Package,Book,Star,Shield,ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaPlus } from 'react-icons/fa'; 
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

interface DashboardLayoutProps {
	children: React.ReactNode;
	userRole: "admin";
	userName?: string;
	userEmail?: string;
}

const navigationItems  = {
	 admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: Home },
    { name: "User Management", href: "/dashboard/admin/users", icon: Users },
    { name: "Candidate Management", href: "/dashboard/admin/candidate", icon: User },
    { name: "Employeer Management", href: "/dashboard/admin/employeer", icon: UserCheck },
    { name: "Agency Management", href: "/dashboard/admin/agency", icon: Handshake },
	 { name: "Payments Management", href: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Reports & Analytics", href: "/dashboard/admin/reports", icon: BarChart3 },
	{ name: "Notifications", href: "/dashboard/admin/notifications", icon: Bell },
    { name: "Settings & Configuration", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

const ethiopianNames = {
	admin: "Super Admin ",
};

export default function DashboardLayout({
	children,
	userRole,
	userName,
	userEmail,
}: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const pathname = usePathname();
	const router = useRouter();
	 const navigation = navigationItems[userRole] || []; 
	const displayName = userName || ethiopianNames[userRole];

	// Close sidebar on route change (mobile)
	useEffect(() => {
		setSidebarOpen(false);
	}, [pathname]);

	const getRoleColor = (role: string) => {
		switch (role) {
			case "admin":
				return "bg-red-100 text-red-800";
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
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
				{/* Desktop Sidebar */}
			<div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:flex-col lg:w-[288px]">
				<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-4 py-4 shadow-md ">
				{/* Logo */}
{/* Logo */}
<div className="flex h-20 shrink-0 items-center">
  <div className="flex items-center space-x-4">
    {/* Logo Circle with Plus Icon */}
    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-blue-900 relative">
      <Building2 className="h-6 w-6 text-blue-900" /> {/* Red plus icon */}
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-900 rounded-full flex items-center justify-center">
        <span className="text-xs font-bold text-white">🏛️</span>
      </div>
    </div>

    {/* Text Section */}
    <div>
     <span className="font-bold text-xl text-blue-900 ml-10">
 RAMS
</span>
<p className="text-xs sm:text-[10px] text-blue-900 font-medium max-w-full truncate">
 Recruitment Agency Management System
</p>



    </div>
  </div>
</div>



					{/* Navigation */}
					<nav className="flex flex-1 flex-col">
						<ul role="list" className="flex flex-1 flex-col gap-y-2">
							<li>
								<ul role="list" className="-mx-2 space-y-1">
									{navigation.map((item) => {
										const isActive = pathname === item.href;
										return (
											<li key={item.name}>
												<Link
													href={item.href}
													className={cn(
														"group flex gap-x-3 rounded-lg p-2 text-sm font-medium leading-5 transition-all duration-200 text-xs sm:text-[13px]",
														isActive
															? " bg-gray-200 text-primary-500"
															: "text-gray-600 hover:bg-blue-200 hover:text-primary-500"
													)}
												>
													<item.icon
														className={cn(
															"h-5 w-5 shrink-0 transition-colors",
															isActive
																? "text-primary-500"
																: "text-gray-400 group-hover:text-primary-500"
														)}
													/>
													<span className="truncate">{item.name}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</li>
						</ul>
					</nav>

					{/* User Profile */}
					<div className="mt-auto">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="w-full justify-start p-4 h-auto hover:bg-gray-500 rounded-2xl"
								>
									<div className="flex items-center space-x-3 w-full">
										<Avatar className="h-12 w-12 ring-2 ring-red-800/50">
											<AvatarImage src="/placeholder-user.jpg" />
											<AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-gray-800 font-bold">
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
														"text-xs font-medium",
														getRoleColor(userRole)
													)}
												>
													{getRoleLabel(userRole)}
												</Badge>
											</div>
										</div>
										<ChevronDown className="h-4 w-4 text-emerald-200" />
									</div>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-64 bg-white/95 backdrop-blur-sm"
							>
								<DropdownMenuLabel className="text-center">
									<div className="font-semibold">{displayName}</div>
									<div className="text-xs text-gray-500 font-normal">
										{userEmail || `${userRole}@volunteer.et`}
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem className="cursor-pointer" asChild>
									<Link href={``}>
										<User className="mr-2 h-4 w-4" />
										Profile
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem className="cursor-pointer" asChild>
									<Link href={``}>
										<Settings className="mr-2 h-4 w-4" />
										Settings
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-red-600 cursor-pointer"
									onClick={handleLogout}
								>
									<LogOut className="mr-2 h-4 w-4" />
									Logout
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
					className="w-80 p-0 bg-bg-white"
				>
					<div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4">
						{/* Logo */}
						<div className="flex h-20 shrink-0 items-center">
							<div className="flex items-center space-x-4">
								<div className="w-12 h-12 bg-red-800 rounded-2xl flex items-center justify-center shadow-lg relative">
									 <FaPlus className="h-6 w-6 text-gray-200" />
									<div className="absolute -top-1 -right-1 w-4 h-4 bg-red-800 rounded-full flex items-center justify-center">
										<span className="text-xs font-bold text-gray-200">+</span>
									</div>
								</div>
							    <div>
     <span className="font-bold text-xl text-red-800">
  Volunteer MMS
</span>
<p className="text-xs sm:text-[11px] text-red-700 font-medium max-w-full truncate">
  Digital Volunteer & Membership
</p>



    </div>
							</div>
						</div>

						{/* Navigation */}
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-2">
										{navigation.map((item) => {
											const isActive = pathname === item.href;
											return (
												<li key={item.name}>
													<Link
														href={item.href}
														className={cn(
															"group flex gap-x-3 rounded-2xl p-4 text-sm font-semibold leading-6 transition-all duration-300",
															isActive
																? "bg-red-200 text-gray-800 shadow-md"
																: "text-gray-600 hover:bg-red-200 hover:text-primary-500"
														)}
														onClick={() => setSidebarOpen(false)}
													>
														<item.icon
															className={cn(
																"h-6 w-6 shrink-0 transition-colors",
																isActive
																	? "text-white"
																	: "text-gray-400 group-hover:text-primary-500 "
															)}
														/>
														<span className="truncate">{item.name}</span>
													</Link>
												</li>
											);
										})}
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</SheetContent>
			</Sheet>

			{/* Main content */}
			<div className="lg:pl-[280px]">
				{/* Top header */}
				<div className="sticky top-0 z-40 flex h-20 shrink-0 items-center gap-x-4 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm px- shadow-sm sm:gap-x-6 sm:px-0 lg:px-8">
					<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="lg:hidden hover:bg-emerald-50"
							>
								<Menu className="h-6 w-6" />
								<span className="sr-only">Open sidebar</span>
							</Button>
						</SheetTrigger>
					</Sheet>

					<div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
						<div className="flex flex-1 items-center">
							<div className="text-sm text-gray-600">
								<span className="font-medium">Welcome,</span>{" "}
								<span className="font-semibold text-gray-600">
									{displayName.split(" ")[0]}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-x-4 lg:gap-x-6">
							<NotificationDropdown userRole={userRole} />

							{/* Mobile Profile Dropdown */}
							<div className="lg:hidden">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="sm" className="relative">
											<Avatar className="h-8 w-8 ring-2 ring-emerald-200">
												<AvatarImage src="/placeholder-user.jpg" />
												<AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-500 text-white font-bold text-xs">
													{displayName
														.split(" ")
														.slice(-2)
														.map((n) => n[0])
														.join("")}
												</AvatarFallback>
											</Avatar>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										align="end"
										className="w-64 bg-white/95 backdrop-blur-sm"
									>
										<DropdownMenuLabel className="text-center">
											<div className="font-semibold text-sm">{displayName}</div>
											<div className="text-xs text-gray-500 font-normal">
												{userEmail || `${userRole}@akeray.et`}
											</div>
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem className="cursor-pointer">
											<User className="mr-2 h-4 w-4" />
											Profile
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer">
											<Settings className="mr-2 h-4 w-4" />
											Settings
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600 cursor-pointer"
											onClick={handleLogout}
										>
											<LogOut className="mr-2 h-4 w-4" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</div>

				{/* Page content */}
				<main className="py-8">
					<div className="px-4 sm:px-6 lg:px-8">{children}</div>
				</main>
			</div>
		</div>
	);
}
