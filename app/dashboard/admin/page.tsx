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

  // Blue color palette variations
  const bluePalette = {
    light: [
      '#60a5fa', // blue-400
      '#93c5fd', // blue-300
      '#3b82f6', // blue-500
      '#1d4ed8', // blue-700
      '#bfdbfe', // blue-100
      '#1e40af', // blue-800
      '#1e3a8a', // blue-900
      '#2563eb', // blue-600
    ],
    dark: [
      '#1d4ed8', // blue-700
      '#1e40af', // blue-800
      '#1e3a8a', // blue-900
      '#3b82f6', // blue-500
      '#2563eb', // blue-600
      '#60a5fa', // blue-400
      '#93c5fd', // blue-300
      '#bfdbfe', // blue-100
    ]
  };

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

      const candidatesData = await candidatesRes.json();
      const employersData = await employersRes.json();
      const agenciesData = await agenciesRes.json();

      // Extract the array of candidates/employers/agencies from the response
      // Check if the response is an object with a 'candidates' property or directly an array
      const candidates: Candidate[] = Array.isArray(candidatesData) 
        ? candidatesData 
        : candidatesData.candidates || candidatesData.data || [];
      
      const employers: Employer[] = Array.isArray(employersData)
        ? employersData
        : employersData.employers || employersData.data || [];
      
      const agencies: Agency[] = Array.isArray(agenciesData)
        ? agenciesData
        : agenciesData.agencies || agenciesData.data || [];

      // Log for debugging
      console.log('Candidates data structure:', candidatesData);
      console.log('Candidates extracted:', candidates);

      // Calculate statistics
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const newStats: DashboardStats = {
        totalCandidates: candidates.length,
        totalEmployers: employers.length,
        totalAgencies: agencies.length,
        pendingCandidates: candidates.filter((c: Candidate) => c.status === 'pending').length,
        pendingEmployers: employers.filter((e: Employer) => e.status === 'pending').length,
        pendingAgencies: agencies.filter((a: Agency) => a.status === 'pending').length,
        approvedCandidates: candidates.filter((c: Candidate) => c.status === 'approved').length,
        approvedEmployers: employers.filter((e: Employer) => e.status === 'approved').length,
        approvedAgencies: agencies.filter((a: Agency) => a.status === 'approved').length,
        newThisWeek: {
          candidates: candidates.filter((c: Candidate) => {
            try {
              return new Date(c.createdAt) > oneWeekAgo;
            } catch {
              return false;
            }
          }).length,
          employers: employers.filter((e: Employer) => {
            try {
              return new Date(e.createdAt) > oneWeekAgo;
            } catch {
              return false;
            }
          }).length,
          agencies: agencies.filter((a: Agency) => {
            try {
              return new Date(a.createdAt) > oneWeekAgo;
            } catch {
              return false;
            }
          }).length,
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

  // Updated Registration Overview Chart with blue theme
  const registrationData = {
    labels: [
      'Candidates',
      'Employers', 
      'Agencies',
      'Pending',
      'Approved',
      'New This Week'
    ],
    datasets: [
      {
        label: "Total Count",
        data: [
          stats.totalCandidates,
          stats.totalEmployers,
          stats.totalAgencies,
          stats.pendingCandidates + stats.pendingEmployers + stats.pendingAgencies,
          stats.approvedCandidates + stats.approvedEmployers + stats.approvedAgencies,
          stats.newThisWeek.candidates + stats.newThisWeek.employers + stats.newThisWeek.agencies
        ],
        backgroundColor: [
          '#60a5fa', // blue-400 for Candidates
          '#93c5fd', // blue-300 for Employers
          '#3b82f6', // blue-500 for Agencies
          '#bfdbfe', // blue-100 for Pending
          '#1d4ed8', // blue-700 for Approved
          '#2563eb', // blue-600 for New This Week
        ],
        borderColor: [
          '#3b82f6', // blue-500
          '#60a5fa', // blue-400
          '#1d4ed8', // blue-700
          '#93c5fd', // blue-300
          '#1e40af', // blue-800
          '#1e3a8a', // blue-900
        ],
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  // Updated Approval Status Doughnut Chart with blue theme
  const approvalStatusData = {
    labels: [
      'Approved Candidates', 
      'Pending Candidates',
      'Approved Employers',
      'Pending Employers',
      'Approved Agencies',
      'Pending Agencies'
    ],
    datasets: [
      {
        data: [
          stats.approvedCandidates,
          stats.pendingCandidates,
          stats.approvedEmployers,
          stats.pendingEmployers,
          stats.approvedAgencies,
          stats.pendingAgencies
        ],
        backgroundColor: [
          '#1d4ed8', // blue-700
          '#60a5fa', // blue-400
          '#2563eb', // blue-600
          '#93c5fd', // blue-300
          '#1e40af', // blue-800
          '#bfdbfe', // blue-100
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
        spacing: 4,
      },
    ],
  };

  // Status Comparison Bar Chart (new addition)
  const statusComparisonData = {
    labels: ['Candidates', 'Employers', 'Agencies'],
    datasets: [
      {
        label: 'Approved',
        data: [stats.approvedCandidates, stats.approvedEmployers, stats.approvedAgencies],
        backgroundColor: '#1d4ed8', // blue-700
        borderColor: '#1e40af', // blue-800
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Pending',
        data: [stats.pendingCandidates, stats.pendingEmployers, stats.pendingAgencies],
        backgroundColor: '#60a5fa', // blue-400
        borderColor: '#3b82f6', // blue-500
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Total',
        data: [stats.totalCandidates, stats.totalEmployers, stats.totalAgencies],
        backgroundColor: '#93c5fd', // blue-300
        borderColor: '#60a5fa', // blue-400
        borderWidth: 1,
        borderRadius: 4,
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
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
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
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
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
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
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
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

  // Chart options with blue theme
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151', // gray-700
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937', // gray-800
        bodyColor: '#374151', // gray-700
        borderColor: '#d1d5db', // gray-300
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: true,
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280', // gray-500
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)', // gray-200 with opacity
        },
        ticks: {
          color: '#6b7280', // gray-500
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          stepSize: 50
        }
      },
    },
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151', // gray-700
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          },
          padding: 20,
          boxWidth: 12,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: ${context.parsed}`;
          }
        }
      }
    },
  };

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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
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
                className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 bg-transparent transition-all duration-300"
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
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Registration Overview Chart */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm w-full col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    Registration Overview
                  </CardTitle>
                  <CardDescription>
                    Total counts across all user categories
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-blue-200 text-blue-600">
                  Last Updated: Just now
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse space-y-4 w-full">
                    <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                    <div className="h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg"></div>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <Bar
                    data={registrationData}
                    options={barChartOptions}
                  />
                </div>
              )}
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalCandidates + stats.totalEmployers + stats.totalAgencies}</div>
                  <div className="text-sm text-gray-500">Total Users</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{stats.approvedCandidates + stats.approvedEmployers + stats.approvedAgencies}</div>
                  <div className="text-sm text-gray-500">Approved</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-blue-600">{stats.newThisWeek.candidates + stats.newThisWeek.employers + stats.newThisWeek.agencies}</div>
                  <div className="text-sm text-gray-500">New This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Status Doughnut Chart */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Approval Status
              </CardTitle>
              <CardDescription>
                Distribution of approval status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse">
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"></div>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <Doughnut
                    data={approvalStatusData}
                    options={doughnutChartOptions}
                  />
                </div>
              )}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-700"></div>
                    <span className="text-sm">Approved</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.approvedCandidates + stats.approvedEmployers + stats.approvedAgencies}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="text-sm font-semibold">
                    {stats.pendingCandidates + stats.pendingEmployers + stats.pendingAgencies}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Comparison Chart */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm w-full col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Status Comparison
              </CardTitle>
              <CardDescription>
                Compare approved vs pending across all categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-pulse space-y-4 w-full">
                    <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                    <div className="h-40 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg"></div>
                  </div>
                </div>
              ) : (
                <div className="h-64">
                  <Bar
                    data={statusComparisonData}
                    options={{
                      ...barChartOptions,
                      scales: {
                        ...barChartOptions.scales,
                        x: {
                          ...barChartOptions.scales?.x,
                          stacked: false,
                        },
                        y: {
                          ...barChartOptions.scales?.y,
                          stacked: false,
                        }
                      }
                    }}
                  />
                </div>
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
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                Quick Actions
              </CardTitle>
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
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Approval Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Candidates", value: stats.totalCandidates > 0 ? (stats.approvedCandidates / stats.totalCandidates) * 100 : 0, color: "bg-blue-400" },
                { label: "Employers", value: stats.totalEmployers > 0 ? (stats.approvedEmployers / stats.totalEmployers) * 100 : 0, color: "bg-blue-300" },
                { label: "Agencies", value: stats.totalAgencies > 0 ? (stats.approvedAgencies / stats.totalAgencies) * 100 : 0, color: "bg-blue-500" },
              ].map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="font-semibold">{Math.round(item.value)}%</span>
                  </div>
                  <div className="w-full bg-blue-50 rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                This Week's Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: User, label: "New Candidates", value: stats.newThisWeek.candidates, color: "text-blue-600" },
                { icon: Building, label: "New Employers", value: stats.newThisWeek.employers, color: "text-blue-500" },
                { icon: Building2, label: "New Agencies", value: stats.newThisWeek.agencies, color: "text-blue-400" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-blue-50`}>
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                    </div>
                    <span className="text-sm">{item.label}</span>
                  </div>
                  <Badge variant="outline" className="border-blue-200 text-blue-600">
                    {item.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { 
                  label: "API Connection", 
                  status: "Connected", 
                  icon: CheckCircle, 
                  color: "bg-emerald-100 text-emerald-800",
                  iconColor: "text-emerald-500"
                },
                { 
                  label: "Data Freshness", 
                  status: "Just now", 
                  icon: Clock, 
                  color: "bg-blue-100 text-blue-800",
                  iconColor: "text-blue-500"
                },
                { 
                  label: "Pending Actions", 
                  status: `${stats.pendingCandidates + stats.pendingEmployers + stats.pendingAgencies}`, 
                  icon: AlertCircle, 
                  color: "bg-orange-100 text-orange-800",
                  iconColor: "text-orange-500"
                },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  <span className="text-sm">{item.label}</span>
                  <Badge className={item.color}>
                    <item.icon className={`h-3 w-3 mr-1 ${item.iconColor}`} />
                    {item.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}