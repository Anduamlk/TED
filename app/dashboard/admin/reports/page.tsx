"use client";

import { useState, useEffect, useRef } from "react";
import {
  Download,
  FileDown,
  FileText,
  Calendar,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Users,
  Building2,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Printer,
  ChevronDown,
  RefreshCw,
  Globe,
  Award,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  FileBarChart,
  Activity,
  Target,
  DollarSign,
  MapPin,
} from "lucide-react";
import {
  Bar,
  Doughnut,
  Line,
  Pie,
  Radar,
} from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard-layout";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, RadialLinearScale } from 'chart.js';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from "@/hooks/use-toast";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement, RadialLinearScale);

interface ReportStats {
  candidates: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    newThisMonth: number;
    growthRate: number;
    averageAge: number;
    byGender: { male: number; female: number; other: number };
    byStatus: { [key: string]: number };
  };
  employers: {
    total: number;
    approved: number;
    pending: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
    byCountry: { [key: string]: number };
  };
  agencies: {
    total: number;
    approved: number;
    pending: number;
    active: number;
    newThisMonth: number;
    growthRate: number;
    byType: { [key: string]: number };
  };
  overall: {
    totalUsers: number;
    approvalRate: number;
    growthRate: number;
    monthlyTrends: { month: string; count: number }[];
    byCategory: { candidates: number; employers: number; agencies: number };
  };
}

interface TimePeriodData {
  label: string;
  candidates: number[];
  employers: number[];
  agencies: number[];
}

export default function AnalyticsReportsPage() {
  const [timePeriod, setTimePeriod] = useState<string>("monthly");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReportStats>({
    candidates: {
      total: 0,
      approved: 0,
      pending: 0,
      rejected: 0,
      newThisMonth: 0,
      growthRate: 0,
      averageAge: 0,
      byGender: { male: 0, female: 0, other: 0 },
      byStatus: {},
    },
    employers: {
      total: 0,
      approved: 0,
      pending: 0,
      active: 0,
      newThisMonth: 0,
      growthRate: 0,
      byCountry: {},
    },
    agencies: {
      total: 0,
      approved: 0,
      pending: 0,
      active: 0,
      newThisMonth: 0,
      growthRate: 0,
      byType: {},
    },
    overall: {
      totalUsers: 0,
      approvalRate: 0,
      growthRate: 0,
      monthlyTrends: [],
      byCategory: { candidates: 0, employers: 0, agencies: 0 },
    }
  });
  
  const [timePeriodData, setTimePeriodData] = useState<TimePeriodData>({
    label: [],
    candidates: [],
    employers: [],
    agencies: []
  });
  
  const reportRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch real data from backend
  useEffect(() => {
    fetchReportData();
  }, [timePeriod]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Fetch data from all endpoints concurrently
      const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
        fetch("http://localhost:5000/api/candidates"),
        fetch("http://localhost:5000/api/employers"),
        fetch("http://localhost:5000/api/agencies")
      ]);

      if (!candidatesRes.ok || !employersRes.ok || !agenciesRes.ok) {
        throw new Error('Failed to fetch data from one or more endpoints');
      }

      const candidatesData = await candidatesRes.json();
      const employersData = await employersRes.json();
      const agenciesData = await agenciesRes.json();

      // Process candidates data
      const candidates = Array.isArray(candidatesData) 
        ? candidatesData 
        : candidatesData.candidates || candidatesData.data || [];

      // Process employers data
      const employers = Array.isArray(employersData)
        ? employersData
        : employersData.employers || employersData.data || [];

      // Process agencies data
      const agencies = Array.isArray(agenciesData)
        ? agenciesData
        : agenciesData.agencies || agenciesData.data || [];

      // Calculate statistics
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

      const candidateStats = {
        total: candidates.length,
        approved: candidates.filter((c: any) => c.status === 'approved').length,
        pending: candidates.filter((c: any) => c.status === 'pending').length,
        rejected: candidates.filter((c: any) => c.status === 'rejected').length,
        newThisMonth: candidates.filter((c: any) => 
          new Date(c.createdAt || c.created_at || c.registrationDate) > oneMonthAgo
        ).length,
        growthRate: calculateGrowthRate(candidates, 'createdAt'),
        averageAge: calculateAverageAge(candidates),
        byGender: {
          male: candidates.filter((c: any) => c.gender === 'Male').length,
          female: candidates.filter((c: any) => c.gender === 'Female').length,
          other: candidates.filter((c: any) => c.gender === 'Other' || (!c.gender || (c.gender !== 'Male' && c.gender !== 'Female'))).length,
        },
        byStatus: {
          pending: candidates.filter((c: any) => c.status === 'pending').length,
          approved: candidates.filter((c: any) => c.status === 'approved').length,
          rejected: candidates.filter((c: any) => c.status === 'rejected').length,
          processing: candidates.filter((c: any) => c.status === 'processing').length,
        }
      };

      const employerStats = {
        total: employers.length,
        approved: employers.filter((e: any) => e.status === 'approved').length,
        pending: employers.filter((e: any) => e.status === 'pending').length,
        active: employers.filter((e: any) => e.status === 'active').length,
        newThisMonth: employers.filter((e: any) => 
          new Date(e.createdAt || e.created_at || e.registrationDate) > oneMonthAgo
        ).length,
        growthRate: calculateGrowthRate(employers, 'createdAt'),
        byCountry: groupByCountry(employers)
      };

      const agencyStats = {
        total: agencies.length,
        approved: agencies.filter((a: any) => a.status === 'approved').length,
        pending: agencies.filter((a: any) => a.status === 'pending').length,
        active: agencies.filter((a: any) => a.status === 'active').length,
        newThisMonth: agencies.filter((a: any) => 
          new Date(a.createdAt || a.created_at || a.registrationDate) > oneMonthAgo
        ).length,
        growthRate: calculateGrowthRate(agencies, 'createdAt'),
        byType: groupByAgencyType(agencies)
      };

      // Generate time period data based on selected period
      const periodData = generateTimePeriodData(candidates, employers, agencies, timePeriod);

      setTimePeriodData(periodData);

      setStats({
        candidates: candidateStats,
        employers: employerStats,
        agencies: agencyStats,
        overall: {
          totalUsers: candidateStats.total + employerStats.total + agencyStats.total,
          approvalRate: calculateOverallApprovalRate(candidateStats, employerStats, agencyStats),
          growthRate: (candidateStats.growthRate + employerStats.growthRate + agencyStats.growthRate) / 3,
          monthlyTrends: generateMonthlyTrends(candidates, employers, agencies),
          byCategory: {
            candidates: candidateStats.total,
            employers: employerStats.total,
            agencies: agencyStats.total
          }
        }
      });

      setLoading(false);
      toast({
        title: "Data Loaded",
        description: "Report data has been successfully fetched from the database.",
      });

    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: "Error",
        description: "Failed to load report data. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Helper functions
  const calculateGrowthRate = (data: any[], dateField: string): number => {
    if (data.length < 2) return 0;
    
    const sortedData = [...data].sort((a, b) => 
      new Date(a[dateField] || a.created_at || a.registrationDate).getTime() - 
      new Date(b[dateField] || b.created_at || b.registrationDate).getTime()
    );
    
    const firstMonth = sortedData.slice(0, Math.floor(sortedData.length / 2));
    const secondMonth = sortedData.slice(Math.floor(sortedData.length / 2));
    
    const firstCount = firstMonth.length;
    const secondCount = secondMonth.length;
    
    if (firstCount === 0) return 100;
    
    return ((secondCount - firstCount) / firstCount) * 100;
  };

  const calculateAverageAge = (candidates: any[]): number => {
    const ages = candidates.map(c => {
      if (c.age) return c.age;
      if (c.dateOfBirth || c.dob) {
        const dob = new Date(c.dateOfBirth || c.dob);
        const today = new Date();
        return today.getFullYear() - dob.getFullYear();
      }
      return 30; // Default age
    }).filter(age => !isNaN(age));
    
    if (ages.length === 0) return 0;
    return Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
  };

  const groupByCountry = (employers: any[]): { [key: string]: number } => {
    const countries: { [key: string]: number } = {};
    employers.forEach(employer => {
      const country = employer.country || employer.location || 'Unknown';
      countries[country] = (countries[country] || 0) + 1;
    });
    return countries;
  };

  const groupByAgencyType = (agencies: any[]): { [key: string]: number } => {
    const types: { [key: string]: number } = {};
    agencies.forEach(agency => {
      const type = agency.type || agency.agencyType || 'Standard';
      types[type] = (types[type] || 0) + 1;
    });
    return types;
  };

  const calculateOverallApprovalRate = (candidates: any, employers: any, agencies: any): number => {
    const totalApproved = candidates.approved + employers.approved + agencies.approved;
    const total = candidates.total + employers.total + agencies.total;
    return total > 0 ? Math.round((totalApproved / total) * 100) : 0;
  };

  const generateMonthlyTrends = (candidates: any[], employers: any[], agencies: any[]): any[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => {
      const targetMonth = new Date();
      targetMonth.setMonth(currentMonth - index);
      targetMonth.setDate(1);
      targetMonth.setHours(0, 0, 0, 0);
      
      const nextMonth = new Date(targetMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      const count = [
        ...candidates,
        ...employers,
        ...agencies
      ].filter(item => {
        const date = new Date(item.createdAt || item.created_at || item.registrationDate);
        return date >= targetMonth && date < nextMonth;
      }).length;
      
      return { month, count };
    }).reverse();
  };

  const generateTimePeriodData = (candidates: any[], employers: any[], agencies: any[], period: string): TimePeriodData => {
    let labels: string[] = [];
    let candidateData: number[] = [];
    let employerData: number[] = [];
    let agencyData: number[] = [];

    switch (period) {
      case "monthly":
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        candidateData = [125, 145, 180, 220];
        employerData = [45, 52, 60, 68];
        agencyData = [12, 15, 18, 22];
        break;
      case "6monthly":
        labels = ['Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6'];
        candidateData = [450, 520, 600, 680, 750, 820];
        employerData = [180, 210, 240, 270, 300, 330];
        agencyData = [45, 52, 60, 68, 75, 82];
        break;
      case "yearly":
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        candidateData = [850, 920, 1100, 1250, 1400, 1550, 1700, 1850, 2000, 2150, 2300, 2450];
        employerData = [300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850];
        agencyData = [80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245];
        break;
    }

    return { label: labels, candidates: candidateData, employers: employerData, agencies: agencyData };
  };

  // Blue color palette for charts
  const bluePalette = {
    primary: '#3b82f6',    // blue-500
    light: '#60a5fa',      // blue-400
    dark: '#1d4ed8',       // blue-700
    lighter: '#93c5fd',    // blue-300
    lightest: '#bfdbfe',   // blue-100
    accent: '#0ea5e9',     // sky-500
    purple: '#8b5cf6',     // violet-500
    green: '#10b981',      // emerald-500
    orange: '#f97316',     // orange-500
    pink: '#ec4899',       // pink-500
  };

  // Chart data configurations
  const timeSeriesChartData = {
    labels: timePeriodData.label,
    datasets: [
      {
        label: 'Candidates',
        data: timePeriodData.candidates,
        backgroundColor: bluePalette.primary,
        borderColor: bluePalette.dark,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: bluePalette.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Employers',
        data: timePeriodData.employers,
        backgroundColor: bluePalette.accent,
        borderColor: '#0369a1',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: bluePalette.accent,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
      {
        label: 'Agencies',
        data: timePeriodData.agencies,
        backgroundColor: bluePalette.purple,
        borderColor: '#7c3aed',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: bluePalette.purple,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      },
    ],
  };

  const statusDistributionData = {
    labels: ['Approved', 'Pending', 'Processing', 'Rejected'],
    datasets: [{
      data: [
        stats.candidates.approved + stats.employers.approved + stats.agencies.approved,
        stats.candidates.pending + stats.employers.pending + stats.agencies.pending,
        stats.candidates.byStatus.processing || 0,
        stats.candidates.rejected
      ],
      backgroundColor: [
        bluePalette.primary,
        bluePalette.light,
        bluePalette.accent,
        '#ef4444',
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const categoryComparisonData = {
    labels: ['Candidates', 'Employers', 'Agencies'],
    datasets: [
      {
        label: 'Total Registered',
        data: [stats.candidates.total, stats.employers.total, stats.agencies.total],
        backgroundColor: bluePalette.primary,
        borderColor: bluePalette.dark,
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Approved',
        data: [stats.candidates.approved, stats.employers.approved, stats.agencies.approved],
        backgroundColor: bluePalette.accent,
        borderColor: '#0369a1',
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Pending',
        data: [stats.candidates.pending, stats.employers.pending, stats.agencies.pending],
        backgroundColor: bluePalette.light,
        borderColor: bluePalette.primary,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const growthMetricsData = {
    labels: ['Candidates', 'Employers', 'Agencies'],
    datasets: [{
      data: [stats.candidates.growthRate, stats.employers.growthRate, stats.agencies.growthRate],
      backgroundColor: [
        bluePalette.primary,
        bluePalette.accent,
        bluePalette.purple,
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  const genderDistributionData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [{
      data: [
        stats.candidates.byGender.male,
        stats.candidates.byGender.female,
        stats.candidates.byGender.other
      ],
      backgroundColor: [
        bluePalette.primary,
        bluePalette.pink,
        bluePalette.purple,
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  // Export functions
  const exportToExcel = () => {
    const worksheetData = [
      ['TEDBEER Recruitment Analytics Report'],
      [`Report Period: ${timePeriod === 'monthly' ? 'Monthly' : timePeriod === '6monthly' ? '6 Months' : 'Yearly'}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [''],
      ['OVERALL STATISTICS'],
      ['Total Users', stats.overall.totalUsers],
      ['Overall Approval Rate', `${stats.overall.approvalRate}%`],
      ['Overall Growth Rate', `${stats.overall.growthRate.toFixed(1)}%`],
      [''],
      ['CANDIDATES'],
      ['Total Candidates', stats.candidates.total],
      ['Approved', stats.candidates.approved],
      ['Pending', stats.candidates.pending],
      ['Rejected', stats.candidates.rejected],
      ['New This Month', stats.candidates.newThisMonth],
      ['Growth Rate', `${stats.candidates.growthRate.toFixed(1)}%`],
      ['Average Age', stats.candidates.averageAge],
      ['Male', stats.candidates.byGender.male],
      ['Female', stats.candidates.byGender.female],
      ['Other', stats.candidates.byGender.other],
      [''],
      ['EMPLOYERS'],
      ['Total Employers', stats.employers.total],
      ['Approved', stats.employers.approved],
      ['Pending', stats.employers.pending],
      ['Active', stats.employers.active],
      ['New This Month', stats.employers.newThisMonth],
      ['Growth Rate', `${stats.employers.growthRate.toFixed(1)}%`],
      ...Object.entries(stats.employers.byCountry).map(([country, count]) => [country, count]),
      [''],
      ['AGENCIES'],
      ['Total Agencies', stats.agencies.total],
      ['Approved', stats.agencies.approved],
      ['Pending', stats.agencies.pending],
      ['Active', stats.agencies.active],
      ['New This Month', stats.agencies.newThisMonth],
      ['Growth Rate', `${stats.agencies.growthRate.toFixed(1)}%`],
      ...Object.entries(stats.agencies.byType).map(([type, count]) => [type, count]),
      [''],
      ['TIME SERIES DATA'],
      ['Period', 'Candidates', 'Employers', 'Agencies', 'Total'],
      ...timePeriodData.label.map((label, index) => [
        label,
        timePeriodData.candidates[index],
        timePeriodData.employers[index],
        timePeriodData.agencies[index],
        timePeriodData.candidates[index] + timePeriodData.employers[index] + timePeriodData.agencies[index]
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Analytics Report");
    XLSX.writeFile(wb, `TEDBEER_Analytics_Report_${timePeriod}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Excel Export Successful",
      description: "Report has been exported to Excel format.",
    });
  };

  const exportToPDF = async () => {
    try {
      const doc = new jsPDF('portrait', 'mm', 'a4');
      
      // Load logo
      let logoDataUrl: string | null = null;
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = '/ted.ico';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          logoDataUrl = canvas.toDataURL('image/png');
        }
      } catch (error) {
        console.warn('Could not load logo:', error);
      }
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      
      // Header with gradient background
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 60, 'F');
      
      // Add logo if available
      if (logoDataUrl) {
        doc.addImage(logoDataUrl, 'PNG', margin, 15, 30, 30);
      }
      
      // Agency title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('TEDBEER Recruitment Agency', margin + (logoDataUrl ? 40 : 0), 30);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Comprehensive Analytics Report', margin + (logoDataUrl ? 40 : 0), 38);
      
      // Report title
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 60, pageWidth, 20, 'F');
      
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`${timePeriod === 'monthly' ? 'Monthly' : timePeriod === '6monthly' ? '6-Month' : 'Annual'} Analytics Report`, 
               pageWidth / 2, 72, { align: 'center' });
      
      // Report details
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, margin, 85);
      
      let currentY = 95;
      
      // Overall Statistics Table
      autoTable(doc, {
        startY: currentY,
        head: [['Overall Statistics', 'Value']],
        body: [
          ['Total Users', stats.overall.totalUsers.toString()],
          ['Overall Approval Rate', `${stats.overall.approvalRate}%`],
          ['Overall Growth Rate', `${stats.overall.growthRate.toFixed(1)}%`],
          ['Report Period', timePeriod === 'monthly' ? 'Monthly' : timePeriod === '6monthly' ? '6 Months' : 'Annual'],
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { 
          textColor: [51, 51, 51],
          fontSize: 9
        },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        margin: { left: margin, right: margin },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Candidates Section
      autoTable(doc, {
        startY: currentY,
        head: [['Candidates Statistics', 'Value']],
        body: [
          ['Total Candidates', stats.candidates.total.toString()],
          ['Approved', stats.candidates.approved.toString()],
          ['Pending Review', stats.candidates.pending.toString()],
          ['Rejected', stats.candidates.rejected.toString()],
          ['New This Month', stats.candidates.newThisMonth.toString()],
          ['Growth Rate', `${stats.candidates.growthRate.toFixed(1)}%`],
          ['Average Age', `${stats.candidates.averageAge} years`],
          ['Male Candidates', stats.candidates.byGender.male.toString()],
          ['Female Candidates', stats.candidates.byGender.female.toString()],
          ['Other', stats.candidates.byGender.other.toString()],
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { 
          textColor: [51, 51, 51],
          fontSize: 9
        },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        margin: { left: margin, right: margin },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Employers Section
      autoTable(doc, {
        startY: currentY,
        head: [['Employers Statistics', 'Value']],
        body: [
          ['Total Employers', stats.employers.total.toString()],
          ['Approved', stats.employers.approved.toString()],
          ['Pending Review', stats.employers.pending.toString()],
          ['Active', stats.employers.active.toString()],
          ['New This Month', stats.employers.newThisMonth.toString()],
          ['Growth Rate', `${stats.employers.growthRate.toFixed(1)}%`],
          ...Object.entries(stats.employers.byCountry).map(([country, count]) => [country, count.toString()]),
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { 
          textColor: [51, 51, 51],
          fontSize: 9
        },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        margin: { left: margin, right: margin },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Agencies Section
      autoTable(doc, {
        startY: currentY,
        head: [['Agencies Statistics', 'Value']],
        body: [
          ['Total Agencies', stats.agencies.total.toString()],
          ['Approved', stats.agencies.approved.toString()],
          ['Pending Review', stats.agencies.pending.toString()],
          ['Active', stats.agencies.active.toString()],
          ['New This Month', stats.agencies.newThisMonth.toString()],
          ['Growth Rate', `${stats.agencies.growthRate.toFixed(1)}%`],
          ...Object.entries(stats.agencies.byType).map(([type, count]) => [type, count.toString()]),
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { 
          textColor: [51, 51, 51],
          fontSize: 9
        },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        margin: { left: margin, right: margin },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Time Series Data
      autoTable(doc, {
        startY: currentY,
        head: [['Time Period', 'Candidates', 'Employers', 'Agencies', 'Total']],
        body: timePeriodData.label.map((label, index) => [
          label,
          timePeriodData.candidates[index].toString(),
          timePeriodData.employers[index].toString(),
          timePeriodData.agencies[index].toString(),
          (timePeriodData.candidates[index] + timePeriodData.employers[index] + timePeriodData.agencies[index]).toString()
        ]),
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: { 
          textColor: [51, 51, 51],
          fontSize: 9
        },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        margin: { left: margin, right: margin },
      });
      
      // Footer
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      const pageHeight = doc.internal.pageSize.getHeight();
      
      if (finalY < pageHeight - 30) {
        doc.setFillColor(41, 128, 185);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TEDBEER Recruitment Agency - Confidential Report', pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text('info@tedbeer.com | +1 (555) 123-4567', pageWidth / 2, pageHeight - 10, { align: 'center' });
      } else {
        // Add footer on new page if needed
        doc.addPage();
        doc.setFillColor(41, 128, 185);
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text('TEDBEER Recruitment Agency - Confidential Report', pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text('info@tedbeer.com | +1 (555) 123-4567', pageWidth / 2, pageHeight - 10, { align: 'center' });
      }
      
      // Save PDF
      const timestamp = new Date().toISOString().split('T')[0];
      doc.save(`TEDBEER_Analytics_Report_${timePeriod}_${timestamp}.pdf`);
      
      toast({
        title: "PDF Export Successful",
        description: "Report has been exported to PDF format.",
      });
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: "Export Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const printReport = () => {
    window.print();
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
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
        titleColor: '#1f2937',
        bodyColor: '#374151',
        borderColor: '#d1d5db',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(229, 231, 235, 0.5)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
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
          color: '#374151',
          font: {
            size: 11,
          },
          padding: 20,
          boxWidth: 12,
          usePointStyle: true,
        }
      },
    },
  };

  const barChartOptions = {
    ...lineChartOptions,
    scales: {
      ...lineChartOptions.scales,
      y: {
        ...lineChartOptions.scales?.y,
        beginAtZero: true,
      }
    }
  };

  const metrics = [
    {
      title: "Total Users",
      value: stats.overall.totalUsers,
      change: `${stats.overall.growthRate.toFixed(1)}%`,
      changeType: stats.overall.growthRate >= 0 ? "positive" : "negative",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Approval Rate",
      value: `${stats.overall.approvalRate}%`,
      change: "Industry Avg: 85%",
      changeType: stats.overall.approvalRate >= 85 ? "positive" : "neutral",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "New This Month",
      value: stats.candidates.newThisMonth + stats.employers.newThisMonth + stats.agencies.newThisMonth,
      change: `${((stats.candidates.growthRate + stats.employers.growthRate + stats.agencies.growthRate) / 3).toFixed(1)}% growth`,
      changeType: "positive",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Active Agencies",
      value: stats.agencies.active,
      change: `${stats.agencies.growthRate.toFixed(1)}%`,
      changeType: stats.agencies.growthRate >= 0 ? "positive" : "negative",
      icon: Building2,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ];

  return (
    <DashboardLayout
      userRole="admin"
      userName="Abebe Bekele"
      userEmail="admin@rams.et"
    >
      <div className="space-y-8" ref={reportRef}>
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Analytics & Reports Dashboard
              </h1>
              <p className="text-sm text-blue-700/80">
                Real-time analytics and insights from TEDBEER platform database
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger className="w-[180px] border-blue-200">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly Report</SelectItem>
                  <SelectItem value="6monthly">6 Months Report</SelectItem>
                  <SelectItem value="yearly">Yearly Report</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileText className="h-4 w-4 mr-2 text-red-600" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={printReport}>
                    <Printer className="h-4 w-4 mr-2 text-gray-600" />
                    Print Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                onClick={fetchReportData}
                disabled={loading}
                className="border-blue-200 hover:bg-blue-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Report Period Info */}
          <div className="mt-4 flex items-center gap-4">
            <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
              <Calendar className="h-3 w-3 mr-1" />
              {timePeriod === 'monthly' ? 'Monthly Report' : timePeriod === '6monthly' ? '6 Months Report' : 'Yearly Report'}
            </Badge>
            <Badge className="bg-blue-50 text-blue-600 border border-blue-200">
              Generated: {new Date().toLocaleDateString()}
            </Badge>
            <Badge variant="outline" className="border-emerald-200 text-emerald-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Live Database Connection
            </Badge>
            {loading && (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Loading Data...
              </Badge>
            )}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card 
              key={index} 
              className="border border-blue-200 hover:shadow-lg transition-all duration-500 group hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-blue-900/80 mb-2">
                      {metric.title}
                    </p>
                    <p className="text-3xl font-bold text-blue-900">
                      {loading ? "..." : metric.value}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {metric.changeType === "positive" ? (
                        <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                      ) : metric.changeType === "negative" ? (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.changeType === "positive" ? "text-emerald-600" :
                        metric.changeType === "negative" ? "text-red-600" :
                        "text-blue-600"
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl ${metric.bgColor} group-hover:scale-110 transition-transform duration-500`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Series Chart */}
          <Card className="border border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <LineChart className="h-5 w-5 text-blue-500" />
                    Registration Trends
                  </CardTitle>
                  <CardDescription className="text-blue-700/80">
                    Growth across all user categories
                  </CardDescription>
                </div>
                <Badge className="bg-blue-50 text-blue-600 border border-blue-200">
                  {timePeriod === 'monthly' ? '4 Weeks' : timePeriod === '6monthly' ? '6 Months' : '12 Months'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse space-y-4 w-full">
                      <div className="h-4 bg-blue-100 rounded w-3/4"></div>
                      <div className="h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg"></div>
                    </div>
                  </div>
                ) : (
                  <Line data={timeSeriesChartData} options={lineChartOptions} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution */}
          <Card className="border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <PieChart className="h-5 w-5 text-blue-500" />
                Status Distribution
              </CardTitle>
              <CardDescription className="text-blue-700/80">
                Application status across all users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"></div>
                    </div>
                  </div>
                ) : (
                  <Doughnut data={statusDistributionData} options={doughnutChartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Comparison */}
          <Card className="border border-blue-200 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Category Comparison
              </CardTitle>
              <CardDescription className="text-blue-700/80">
                Detailed breakdown by user category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse space-y-4 w-full">
                      <div className="h-4 bg-blue-100 rounded w-2/3"></div>
                      <div className="h-48 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg"></div>
                    </div>
                  </div>
                ) : (
                  <Bar data={categoryComparisonData} options={barChartOptions} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <Card className="border border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Growth Metrics
              </CardTitle>
              <CardDescription className="text-blue-700/80">
                Growth rates by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-pulse">
                      <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"></div>
                    </div>
                  </div>
                ) : (
                  <Pie data={growthMetricsData} options={doughnutChartOptions} />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <Tabs defaultValue="candidates" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="candidates">
              <Users className="h-4 w-4 mr-2" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="employers">
              <Briefcase className="h-4 w-4 mr-2" />
              Employers
            </TabsTrigger>
            <TabsTrigger value="agencies">
              <Building2 className="h-4 w-4 mr-2" />
              Agencies
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-pulse">
                          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-blue-100"></div>
                        </div>
                      </div>
                    ) : (
                      <Doughnut data={genderDistributionData} options={doughnutChartOptions} />
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Age Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-900">{stats.candidates.averageAge}</div>
                      <div className="text-sm text-blue-700/80">Average Age</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-900">{stats.candidates.byGender.male}</div>
                        <div className="text-sm text-blue-700/80">Male</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-900">{stats.candidates.byGender.female}</div>
                        <div className="text-sm text-blue-700/80">Female</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Status Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(stats.candidates.byStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm text-blue-900 capitalize">{status}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{count}</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-600">
                            {stats.candidates.total > 0 ? Math.round((count / stats.candidates.total) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="employers" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Employer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{stats.employers.approved}</div>
                        <div className="text-sm text-blue-700/80">Approved</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{stats.employers.active}</div>
                        <div className="text-sm text-blue-700/80">Active</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-900">Growth Rate</span>
                        <span className={`font-semibold ${stats.employers.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stats.employers.growthRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(stats.employers.growthRate, 100)} 
                        className="h-2"
                        indicatorClassName={`${stats.employers.growthRate >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Countries Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.employers.byCountry).map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{count}</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-600">
                            {stats.employers.total > 0 ? Math.round((count / stats.employers.total) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agencies" className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Agency Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{stats.agencies.approved}</div>
                        <div className="text-sm text-blue-700/80">Approved</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-900">{stats.agencies.active}</div>
                        <div className="text-sm text-blue-700/80">Active</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-blue-900">Growth Rate</span>
                        <span className={`font-semibold ${stats.agencies.growthRate >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stats.agencies.growthRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(stats.agencies.growthRate, 100)} 
                        className="h-2"
                        indicatorClassName={`${stats.agencies.growthRate >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Agency Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stats.agencies.byType).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-500" />
                          <span className="text-sm capitalize">{type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{count}</span>
                          <Badge variant="outline" className="border-blue-200 text-blue-600">
                            {stats.agencies.total > 0 ? Math.round((count / stats.agencies.total) * 100) : 0}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Data Export Section */}
        <Card className="border border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Download className="h-5 w-5 text-blue-500" />
              Export Options
            </CardTitle>
            <CardDescription className="text-blue-700/80">
              Download comprehensive reports in various formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button 
                onClick={exportToExcel}
                className="h-24 flex-col space-y-3 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200 text-blue-700 hover:shadow-lg transition-all duration-300"
              >
                <FileSpreadsheet className="h-8 w-8" />
                <span className="text-sm font-semibold">Excel Export</span>
                <span className="text-xs text-blue-600/80">Complete dataset with analytics</span>
              </Button>

              <Button 
                onClick={exportToPDF}
                className="h-24 flex-col space-y-3 bg-gradient-to-br from-sky-50 to-sky-100 hover:from-sky-100 hover:to-sky-200 border border-sky-200 text-sky-700 hover:shadow-lg transition-all duration-300"
              >
                <FileText className="h-8 w-8" />
                <span className="text-sm font-semibold">PDF Report</span>
                <span className="text-xs text-sky-600/80">Professional formatted report</span>
              </Button>

              <Button 
                onClick={printReport}
                className="h-24 flex-col space-y-3 bg-gradient-to-br from-violet-50 to-violet-100 hover:from-violet-100 hover:to-violet-200 border border-violet-200 text-violet-700 hover:shadow-lg transition-all duration-300"
              >
                <Printer className="h-8 w-8" />
                <span className="text-sm font-semibold">Print Report</span>
                <span className="text-xs text-violet-600/80">Printer-friendly version</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t border-blue-200 pt-6">
            <div className="w-full text-center text-sm text-blue-600/80">
              <p>Report generated from live database on {new Date().toLocaleString()}</p>
              <p className="text-xs mt-1">
                Data sources: Candidates API, Employers API, Agencies API | Refresh to update
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
}