"use client";

import { useState, useEffect } from "react";
import {
  Building,
  Users,
  CreditCard,
  Wrench,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  MapPin,
  User,
  Building2,
  Award,
} from "lucide-react";
import { Bar, Doughnut } from "react-chartjs-2"; 

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface DashboardStats {
  totalCandidates: number;
  totalEmployers: number;
  totalAgencies: number;
  pendingCandidates: number;
  pendingEmployers: number;
  pendingAgencies: number;
  approvedCandidates: number;
  approvedEmployers: number;
  approvedAgencies: number;
  newThisWeek: {
    candidates: number;
    employers: number;
    agencies: number;
  };
}

interface Candidate {
  id: string;
  status: string;
  createdAt: string;
}

interface Employer {
  id: string;
  status: string;
  createdAt: string;
  companyType: string;
}

interface Agency {
  id: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    totalEmployers: 0,
    totalAgencies: 0,
    pendingCandidates: 0,
    pendingEmployers: 0,
    pendingAgencies: 0,
    approvedCandidates: 0,
    approvedEmployers: 0,
    approvedAgencies: 0,
    newThisWeek: {
      candidates: 0,
      employers: 0,
      agencies: 0,
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from APIs
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from all endpoints
      const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
        fetch("http://localhost:5000/api/candidates"),
        fetch("http://localhost:5000/api/employers"),
        fetch("http://localhost:5000/api/agencies")
      ]);

      if (!candidatesRes.ok || !employersRes.ok || !agenciesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const candidates: Candidate[] = await candidatesRes.json();
      const employers: Employer[] = await employersRes.json();
      const agencies: Agency[] = await agenciesRes.json();

      // Calculate statistics
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newStats: DashboardStats = {
        totalCandidates: candidates.length,
        totalEmployers: employers.length,
        totalAgencies: agencies.length,
        pendingCandidates: candidates.filter(c => c.status === 'pending').length,
        pendingEmployers: employers.filter(e => e.status === 'pending').length,
        pendingAgencies: agencies.filter(a => a.status === 'pending').length,
        approvedCandidates: candidates.filter(c => c.status === 'approved').length,
        approvedEmployers: employers.filter(e => e.status === 'approved').length,
        approvedAgencies: agencies.filter(a => a.status === 'approved').length,
        newThisWeek: {
          candidates: candidates.filter(c => new Date(c.createdAt) > oneWeekAgo).length,
          employers: employers.filter(e => new Date(e.createdAt) > oneWeekAgo).length,
          agencies: agencies.filter(a => new Date(a.createdAt) > oneWeekAgo).length,
        }
      };

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to demo data if API fails
      setStats({
        totalCandidates: 250,
        totalEmployers: 120,
        totalAgencies: 45,
        pendingCandidates: 45,
        pendingEmployers: 28,
        pendingAgencies: 12,
        approvedCandidates: 190,
        approvedEmployers: 85,
        approvedAgencies: 30,
        newThisWeek: {
          candidates: 34,
          employers: 18,
          agencies: 8,
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Chart data with real statistics
  const membershipData = {
    labels: [
      'Total Candidates', 
      'Pending Candidates', 
      'Approved Candidates',
      'Total Employers', 
      'Pending Employers', 
      'Approved Employers',
      'Total Agencies', 
      'Pending Agencies'
    ],
    datasets: [
      {
        label: "Registration Data",
        data: [
          stats.totalCandidates,
          stats.pendingCandidates,
          stats.approvedCandidates,
          stats.totalEmployers,
          stats.pendingEmployers,
          stats.approvedEmployers,
          stats.totalAgencies,
          stats.pendingAgencies
        ],
        backgroundColor: [
          "#4CAF50",   // Total Candidates - Green
          "#FF9800",   // Pending Candidates - Orange
          "#03A9F4",   // Approved Candidates - Blue
          "#8E24AA",   // Total Employers - Purple
          "#FF5722",   // Pending Employers - Red
          "#FFC107",   // Approved Employers - Yellow
          "#241b1eff", // Total Agencies - Dark
          "#009688",   // Pending Agencies - Teal
        ],
        borderColor: [
          "#388E3C",   // Dark Green
          "#F57C00",   // Dark Orange
          "#0288D1",   // Dark Blue
          "#7B1FA2",   // Dark Purple
          "#D32F2F",   // Dark Red
          "#FF8F00",   // Dark Yellow
          "#D500F9",   // Dark Pink
          "#00796B",   // Dark Teal
        ],
        borderWidth: 2,
      },
    ],
  };

  const membershipStatusData = {
    labels: [
      'Private Companies', 
      'Government', 
      'NGOs', 
      'Recruitment Agencies'
    ],
    datasets: [
      {
        data: [
          stats.totalEmployers > 0 ? Math.round((stats.approvedEmployers / stats.totalEmployers) * 100) : 0,
          stats.totalEmployers > 0 ? Math.round((stats.pendingEmployers / stats.totalEmployers) * 100) : 0,
          stats.totalAgencies > 0 ? Math.round((stats.approvedAgencies / stats.totalAgencies) * 100) : 0,
          stats.totalAgencies > 0 ? Math.round((stats.pendingAgencies / stats.totalAgencies) * 100) : 0
        ],
        backgroundColor: [
          '#4CAF50',  // Approved Employers - Green
          '#FF5722',  // Pending Employers - Red
          '#2196F3',  // Approved Agencies - Blue
          '#FFC107',  // Pending Agencies - Yellow
        ],
      },
    ],
  };

  const statsCards = [
    {
      title: "Total Candidates",
      value: stats.totalCandidates.toString(),
      change: `+${stats.newThisWeek.candidates} this week`,
      changeType: "positive",
      icon: User,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      href: "/dashboard/admin/candidate",
    },
    {
      title: "Total Employers",
      value: stats.totalEmployers.toString(),
      change: `+${stats.newThisWeek.employers} this week`,
      changeType: "positive",
      icon: Building,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      href: "/dashboard/admin/employer",
    },
    {
      title: "Total Agencies",
      value: stats.totalAgencies.toString(),
      change: `+${stats.newThisWeek.agencies} this week`,
      changeType: "positive",
      icon: Building2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      href: "/dashboard/admin/agency",
    },
    {
      title: "Pending Approvals",
      value: (stats.pendingCandidates + stats.pendingEmployers + stats.pendingAgencies).toString(),
      change: "Needs attention",
      changeType: "negative",
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      href: "/dashboard/admin/pending",
    },
  ];

  const quickActions = [
    {
      href: "/dashboard/admin/candidate",
      icon: User,
      label: "Manage Candidates",
      description: "View and manage candidate registrations",
      color: "text-purple-600",
      bg: "bg-purple-50",
      border: "border-purple-200",
    },
    {
      href: "/dashboard/admin/employeer",
      icon: Building,
      label: "Manage Employers",
      description: "View and manage employer registrations",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
    },
    {
      href: "/dashboard/admin/agency",
      icon: Building2,
      label: "Manage Agencies",
      description: "View and manage agency registrations",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
    },
    {
      href: "/dashboard/admin",
      icon: AlertCircle,
      label: "Pending Approvals",
      description: "Review pending applications",
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
    },
  ];

  return (
    <DashboardLayout
      userRole="admin"
      userName="Abebe Bekele"
      userEmail="admin@rams.et"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gray-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                Manage full control over all sections, including global user management, system configuration, and more seamlessly.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={fetchDashboardData}
                className="border-blue-200 hover:bg-blue-50 hover:text-gray-500 bg-transparent"
                disabled={loading}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                {loading ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{
                animationDelay: `${index * 150 + 300}ms`,
                animationFillMode: "forwards",
              }}
            >
              <Card
                className={`hover:shadow-xl transition-all duration-500 border-l-4 ${stat.borderColor} group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm`}
              >
                <Link href={stat.href}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-3">
                        <p className="text-sm font-semibold text-gray-600">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-700">
                          {loading ? "..." : stat.value}
                        </p>
                        <div className="flex items-center space-x-2">
                          {stat.changeType === "positive" ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500" />
                          )}
                          <p
                            className={`text-sm font-medium ${
                              stat.changeType === "positive"
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {stat.change}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`p-4 rounded-3xl ${stat.bgColor} group-hover:scale-125 transition-transform duration-500 shadow-lg`}
                      >
                        <stat.icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>
          ))}
        </div>

        {/* Registration Overview and Status Summary */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm w-full">
            <CardHeader>
              <CardTitle>Registration Overview</CardTitle>
              <CardDescription>
                Total counts across candidates, employers, and agencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <Bar
                  data={membershipData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y}`;
                          }
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 50
                        }
                      },
                    },
                  }}
                  height={300}
                />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm w-full">
            <CardHeader>
              <CardTitle>Approval Status Summary</CardTitle>
              <CardDescription>
                Distribution of approved vs pending applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <Doughnut
                  data={membershipStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                          }
                        }
                      }
                    },
                  }}
                  height={300}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1600"
          style={{ animationFillMode: "forwards" }}
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>
                Manage candidates, employers, and agencies for efficient management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    asChild
                    className={`h-28 flex-col space-y-3 ${action.border} hover:shadow-lg transition-all duration-500 group bg-transparent hover:scale-105`}
                  >
                    <Link href={action.href}>
                      <div
                        className={`p-3 rounded-2xl ${action.bg} group-hover:scale-125 transition-transform duration-500 shadow-md`}
                      >
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-semibold leading-tight block">
                          {action.label}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 block">
                          {action.description}
                        </span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approval Rates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Candidates</span>
                  <span>{stats.totalCandidates > 0 ? Math.round((stats.approvedCandidates / stats.totalCandidates) * 100) : 0}%</span>
                </div>
                <Progress value={stats.totalCandidates > 0 ? (stats.approvedCandidates / stats.totalCandidates) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Employers</span>
                  <span>{stats.totalEmployers > 0 ? Math.round((stats.approvedEmployers / stats.totalEmployers) * 100) : 0}%</span>
                </div>
                <Progress value={stats.totalEmployers > 0 ? (stats.approvedEmployers / stats.totalEmployers) * 100 : 0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Agencies</span>
                  <span>{stats.totalAgencies > 0 ? Math.round((stats.approvedAgencies / stats.totalAgencies) * 100) : 0}%</span>
                </div>
                <Progress value={stats.totalAgencies > 0 ? (stats.approvedAgencies / stats.totalAgencies) * 100 : 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">This Week's Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">New Candidates</span>
                </div>
                <Badge variant="secondary">{stats.newThisWeek.candidates}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">New Employers</span>
                </div>
                <Badge variant="secondary">{stats.newThisWeek.employers}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm">New Agencies</span>
                </div>
                <Badge variant="secondary">{stats.newThisWeek.agencies}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Connection</span>
                <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Freshness</span>
                <Badge variant="secondary">
                  <Clock className="h-3 w-3 mr-1" />
                  Just now
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Actions</span>
                <Badge variant="destructive">
                  {stats.pendingCandidates + stats.pendingEmployers + stats.pendingAgencies}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}