"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  FileText,
  Calendar,
  User,
  MapPin,
  Briefcase,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText as FileTextIcon,
  ChevronDown,
  ChevronUp,
  XCircle,
  SlidersHorizontal,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Define interface with all fields from backend
interface Candidate {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  age?: number;
  weight?: number;
  height?: number;
  placeOfBirth: string;
  phone: string;
  email: string;
  
  // Marital & Family
  maritalStatus: string;
  numberOfChildren?: number;
  religion: string;
  
  // Passport & Nationality
  nationality: string;
  passportNumber: string;
  passportPlaceIssued: string;
  passportDateIssued: string;
  passportExpiryDate: string;
  
  // Job Preferences
  positionApplied: string;
  expectedSalary: number;
  skills: string;
  preferredDestination: string;
  otherDestination?: string;
  
  // Language Skills
  arabicProficiency?: number;
  englishProficiency?: number;
  otherLanguages?: string;
  
  // Previous Employment
  previousEmploymentCountry?: string;
  previousEmploymentPeriod?: string;
  
  // Skills Checklist
  cleaning: boolean;
  washing: boolean;
  ironing: boolean;
  sewing: boolean;
  babySitting: boolean;
  cooking: boolean;
  arabicCooking: boolean;
  elderlyCare: boolean;
  caregiver: boolean;
  otherSkills?: string;
  
  // Documents
  passportPath?: string;
  photoPath?: string;
  medicalClearancePath?: string;
  policeClearancePath?: string;
  
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  gender: string;
  status: string;
  destination: string;
  ageGroup: string;
  maritalStatus: string;
  position: string;
}

export default function AdminCandidatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    gender: "all",
    status: "all",
    destination: "all",
    ageGroup: "all",
    maritalStatus: "all",
    position: "all",
  });
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { toast } = useToast();

  // Fetch candidates from backend
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/candidates");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      // Handle both array response and response with candidates property
      const candidatesData = Array.isArray(data) ? data : (data.candidates || []);
      setCandidates(candidatesData);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      });
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const positions = [...new Set(candidates.map(c => c.positionApplied || "").filter(Boolean))];
    const maritalStatuses = [...new Set(candidates.map(c => c.maritalStatus || "").filter(Boolean))];
    const nationalities = [...new Set(candidates.map(c => c.nationality || "").filter(Boolean))];
    
    return {
      positions,
      maritalStatuses,
      nationalities,
    };
  }, [candidates]);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const safeSearch = (value: string | null | undefined, searchTerm: string): boolean => {
    if (!value) return false;
    return value.toLowerCase().includes(searchTerm.toLowerCase());
  };

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesSearch =
        safeSearch(candidate.firstName, searchTerm) ||
        safeSearch(candidate.lastName, searchTerm) ||
        candidate.phone.includes(searchTerm) ||
        safeSearch(candidate.email, searchTerm) ||
        safeSearch(candidate.passportNumber, searchTerm) ||
        safeSearch(candidate.positionApplied, searchTerm) ||
        safeSearch(candidate.nationality, searchTerm);
      
      const matchesGender =
        filters.gender === "all" || candidate.gender === filters.gender;
      
      const matchesStatus =
        filters.status === "all" || candidate.status === filters.status;
      
      const matchesDestination =
        filters.destination === "all" || 
        candidate.preferredDestination === filters.destination ||
        (filters.destination === "Other" && candidate.otherDestination);

      const matchesAgeGroup = (() => {
        if (filters.ageGroup === "all") return true;
        const age = calculateAge(candidate.dateOfBirth);
        switch (filters.ageGroup) {
          case "18-25": return age >= 18 && age <= 25;
          case "26-35": return age >= 26 && age <= 35;
          case "36-45": return age >= 36 && age <= 45;
          case "45+": return age > 45;
          default: return true;
        }
      })();

      const matchesMaritalStatus =
        filters.maritalStatus === "all" || candidate.maritalStatus === filters.maritalStatus;

      const matchesPosition =
        filters.position === "all" || candidate.positionApplied === filters.position;

      return matchesSearch && matchesGender && matchesStatus && matchesDestination && 
             matchesAgeGroup && matchesMaritalStatus && matchesPosition;
    });
  }, [candidates, searchTerm, filters]);

  const handleApprove = async (candidateId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to approve candidate");

      toast({
        title: "Candidate Approved",
        description: "Candidate has been approved successfully.",
      });
      
      fetchCandidates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (candidateId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/candidates/${candidateId}/reject`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to reject candidate");

      toast({
        title: "Candidate Rejected",
        description: "Candidate has been rejected.",
        variant: "destructive",
      });
      
      fetchCandidates();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject candidate. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = (filePath: string, documentType: string) => {
    if (!filePath) {
      toast({
        title: "Error",
        description: "Document not available",
        variant: "destructive",
      });
      return;
    }
    
    const downloadUrl = `http://localhost:5000/${filePath}`;
    window.open(downloadUrl, '_blank');
    
    toast({
      title: "Download Started",
      description: `Downloading ${documentType}...`,
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredCandidates.map(candidate => ({
      "ID": candidate.id,
      "First Name": candidate.firstName,
      "Last Name": candidate.lastName,
      "Gender": candidate.gender,
      "Age": calculateAge(candidate.dateOfBirth),
      "Phone": candidate.phone,
      "Email": candidate.email,
      "Nationality": candidate.nationality || "N/A",
      "Position": candidate.positionApplied || "N/A",
      "Expected Salary": candidate.expectedSalary,
      "Destination": candidate.preferredDestination,
      "Status": candidate.status,
      "Marital Status": candidate.maritalStatus || "N/A",
      "Religion": candidate.religion,
      "Registration Date": formatDate(candidate.createdAt)
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");
    
    XLSX.writeFile(workbook, `candidates_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: "Candidate data has been exported to Excel.",
    });
  };
// Enhanced Export to PDF with modern design, agency logo, and better layout
const exportToPDF = async () => {
  try {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    
    // Load agency logo
    let logoDataUrl: string | null = null;
    try {
      // Try to load logo from public folder
      logoDataUrl = await loadImageToDataURL('/ted.ico');
      if (!logoDataUrl) {
        // Fallback to local path
        logoDataUrl = await loadImageToDataURL('http://localhost:3000/ted.ico');
      }
    } catch (error) {
      console.warn('Could not load agency logo:', error);
    }
    
    // Process each candidate on a separate page
    for (let i = 0; i < filteredCandidates.length; i++) {
      const candidate = filteredCandidates[i];
      
      // Add new page for each candidate (except first)
      if (i > 0) {
        doc.addPage();
      }
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Modern header with light blue background
      doc.setFillColor(41, 128, 185);
      doc.rect(0, 0, pageWidth, 50, 'F');
      
      // Add agency logo if available
      if (logoDataUrl) {
        try {
          doc.addImage(logoDataUrl, 'PNG', 20, 12, 25, 25);
        } catch (error) {
          console.warn('Could not add logo image:', error);
        }
      }
      
      // Agency branding
      const textStartX = logoDataUrl ? 55 : 20;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('TEDBEER Recruitment Agency', textStartX, 25);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Global Talent Solutions | Professional Recruitment Services', textStartX, 33);
      
      // Horizontal line below agency subtitle
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.5);
      doc.line(textStartX, 36, pageWidth - 20, 36);
      
      // Report title with white background for contrast
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 50, pageWidth, 15, 'F');
      
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Candidate Profile', pageWidth / 2, 60, { align: 'center' });
      
      // Report details
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`, 20, 70);
      
      doc.text(`Profile ${i + 1} of ${filteredCandidates.length}`, pageWidth - 20, 70, { align: 'right' });
      
      let currentY = 80;
      
      // Candidate header with photo (NO circular border - just the image)
      doc.setFillColor(249, 249, 249);
      doc.roundedRect(15, currentY, pageWidth - 30, 45, 3, 3, 'F');
      
      // Try to load actual candidate photo WITHOUT circular border
      const photoX = 25;
      const photoY = currentY + 7;
      const photoSize = 30; // Square photo size
      
      if (candidate.photoPath) {
        try {
          const photoUrl = candidate.photoPath.includes('http') 
            ? candidate.photoPath 
            : `http://localhost:5000/${candidate.photoPath}`;
          
          const imgData = await loadImageToDataURL(photoUrl);
          if (imgData) {
            // Add photo as is - NO circular border
            doc.addImage(imgData, 'JPEG', photoX, photoY, photoSize, photoSize);
            
            // Optional: Add a subtle shadow/outline for better visibility
            doc.setDrawColor(220, 220, 220);
            doc.setLineWidth(0.5);
            doc.rect(photoX, photoY, photoSize, photoSize, 'S');
          } else {
            showCandidateInitials(doc, candidate, photoX, photoY, photoSize);
          }
        } catch (error) {
          console.error('Error loading photo:', error);
          showCandidateInitials(doc, candidate, photoX, photoY, photoSize);
        }
      } else {
        showCandidateInitials(doc, candidate, photoX, photoY, photoSize);
      }
      
      // Candidate information (to the right of photo)
      const infoStartX = photoX + photoSize + 20;
      
      doc.setTextColor(44, 62, 80);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text(`${candidate.firstName} ${candidate.lastName}`, infoStartX, photoY + 12);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Candidate ID: ${candidate.id.substring(0, 8).toUpperCase()}`, infoStartX, photoY + 20);
      
      // Status badge
      const statusColor = candidate.status === 'approved' ? [46, 204, 113] : 
                        candidate.status === 'pending' ? [241, 196, 15] : 
                        [231, 76, 60];
      
      const statusText = candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1);
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.roundedRect(infoStartX, photoY + 25, 35, 10, 5, 5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(statusText.toUpperCase(), infoStartX + 17.5, photoY + 30, { align: 'center' });
      
      currentY += 55;
      
      // Section styling - FULL WIDTH sections (not two-column)
      const sectionSpacing = 12;
      
      // Personal Information Section with optimized column widths
      drawModernSectionHeader(doc, 'Personal Information', 15, currentY);
      currentY += sectionSpacing;
      
      autoTable(doc, {
        startY: currentY,
        head: [['Field', 'Details']],
        body: [
          ['Full Name', `${candidate.firstName} ${candidate.lastName}`],
          ['Gender', candidate.gender],
          ['Date of Birth', `${formatDate(candidate.dateOfBirth)} (${calculateAge(candidate.dateOfBirth)} years)`],
          ['Age', calculateAge(candidate.dateOfBirth).toString()],
          ['Place of Birth', candidate.placeOfBirth],
          ['Nationality', candidate.nationality],
          ['Religion', candidate.religion],
          ['Marital Status', candidate.maritalStatus],
          ['Number of Children', (candidate.numberOfChildren || 0).toString()],
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
        margin: { left: 15, right: 15 },
        tableWidth: pageWidth - 30,
        styles: { cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 45 }, // First column width for "Field"
          1: { cellWidth: 'auto' } // Second column takes remaining space
        },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Contact Information Section with same column widths
      drawModernSectionHeader(doc, 'Contact Information', 15, currentY);
      currentY += sectionSpacing;
      
      autoTable(doc, {
        startY: currentY,
        head: [['Field', 'Details']],
        body: [
          ['Phone Number', candidate.phone],
          ['Email Address', candidate.email],
          ['Passport Number', candidate.passportNumber],
          ['Passport Place Issued', candidate.passportPlaceIssued],
          ['Passport Date Issued', formatDate(candidate.passportDateIssued)],
          ['Passport Expiry Date', formatDate(candidate.passportExpiryDate)],
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
        margin: { left: 15, right: 15 },
        tableWidth: pageWidth - 30,
        styles: { cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 45 }, // Consistent first column width
          1: { cellWidth: 'auto' }
        },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Job Preferences Section with same column widths
      drawModernSectionHeader(doc, 'Job Preferences', 15, currentY);
      currentY += sectionSpacing;
      
      autoTable(doc, {
        startY: currentY,
        head: [['Field', 'Details']],
        body: [
          ['Position Applied', candidate.positionApplied || 'N/A'],
          ['Expected Salary', `$${candidate.expectedSalary}`],
          ['Preferred Destination', candidate.preferredDestination || 'N/A'],
          ['Other Destination', candidate.otherDestination || 'N/A'],
          ['Previous Employment Country', candidate.previousEmploymentCountry || 'N/A'],
          ['Previous Employment Period', candidate.previousEmploymentPeriod || 'N/A'],
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
        margin: { left: 15, right: 15 },
        tableWidth: pageWidth - 30,
        styles: { cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 45 }, // Consistent first column width
          1: { cellWidth: 'auto' }
        },
      });
      
      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      // Skills Section with same column widths
      drawModernSectionHeader(doc, 'Skills & Qualifications', 15, currentY);
      currentY += sectionSpacing;
      
      const skillsList = [];
      if (candidate.cleaning) skillsList.push('Cleaning');
      if (candidate.washing) skillsList.push('Washing');
      if (candidate.ironing) skillsList.push('Ironing');
      if (candidate.sewing) skillsList.push('Sewing');
      if (candidate.babySitting) skillsList.push('Baby Sitting');
      if (candidate.cooking) skillsList.push('Cooking');
      if (candidate.arabicCooking) skillsList.push('Arabic Cooking');
      if (candidate.elderlyCare) skillsList.push('Elderly Care');
      if (candidate.caregiver) skillsList.push('Caregiver');
      if (candidate.otherSkills) skillsList.push(candidate.otherSkills);
      
      const languageSkills = [];
      if (candidate.arabicProficiency) languageSkills.push(`Arabic: ${candidate.arabicProficiency}/10`);
      if (candidate.englishProficiency) languageSkills.push(`English: ${candidate.englishProficiency}/10`);
      if (candidate.otherLanguages) languageSkills.push(`Other: ${candidate.otherLanguages}`);
      
      autoTable(doc, {
        startY: currentY,
        head: [['Category', 'Details']],
        body: [
          ['Primary Skills', skillsList.length > 0 ? skillsList.join(', ') : 'No skills specified'],
          ['Language Proficiency', languageSkills.length > 0 ? languageSkills.join(', ') : 'N/A'],
          ['Additional Skills Description', candidate.skills || 'No additional skills specified'],
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
        margin: { left: 15, right: 15 },
        tableWidth: pageWidth - 30,
        styles: { cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 45 }, // Consistent first column width
          1: { cellWidth: 'auto' }
        },
      });
      
      // Add footer to each page with light blue background
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      
      // Light blue footer background (matches header)
      doc.setFillColor(41, 128, 185); // Same blue as header
      doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
      
      doc.setFontSize(8);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      
      // Footer text (white on light blue)
      doc.text('TEDBEER Recruitment Agency - Confidential Document', pageWidth / 2, pageHeight - 18, { align: 'center' });
      
      // Page info in footer
      doc.text(`Page ${i + 1} of ${filteredCandidates.length}`, 20, pageHeight - 10);
      
      // Generation timestamp in footer
      doc.text(`Generated: ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`, 
               pageWidth - 20, pageHeight - 10, { align: 'right' });
    }
    
    // Save PDF
    const timestamp = new Date().toISOString().split('T')[0];
    doc.save(`tedbeer_candidates_report_${timestamp}.pdf`);
    
    toast({
      title: "Export Successful",
      description: `Generated PDF with ${filteredCandidates.length} candidate profiles (one per page).`,
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    toast({
      title: "Error",
      description: "Failed to generate PDF. Please try again.",
      variant: "destructive",
    });
  }
};

// Alternative PDF export for individual candidate (full page) - SINGLE COLUMN layout
const exportCandidatePDF = async (candidate: Candidate) => {
  try {
    const doc = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Load agency logo
    let logoDataUrl: string | null = null;
    try {
      logoDataUrl = await loadImageToDataURL('/ted.ico');
      if (!logoDataUrl) {
        logoDataUrl = await loadImageToDataURL('http://localhost:3000/ted.ico');
      }
    } catch (error) {
      console.warn('Could not load agency logo:', error);
    }
    
    // Modern header with light blue background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 55, 'F');
    
    // Add logo if available
    if (logoDataUrl) {
      try {
        doc.addImage(logoDataUrl, 'PNG', 20, 15, 25, 25);
      } catch (error) {
        console.warn('Could not add logo image:', error);
      }
    }
    
    // Agency branding
    const textStartX = logoDataUrl ? 55 : 20;
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TEDBEER Recruitment Agency', textStartX, 28);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Global Talent Solutions | Professional Candidate Profile', textStartX, 36);
    
    // Horizontal line below agency subtitle
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(textStartX, 39, pageWidth - 20, 39);
    
    // White background for profile title
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 55, pageWidth, 15, 'F');
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Candidate Profile', pageWidth / 2, 65, { align: 'center' });
    
    // Report details
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 75);
    
    // Candidate header section
    let currentY = 85;
    
    // Photo area - Try to load actual photo WITHOUT circular border
    const photoX = 25;
    const photoY = currentY;
    const photoSize = 35; // Larger photo for individual profile
    
    if (candidate.photoPath) {
      try {
        const photoUrl = candidate.photoPath.includes('http') 
          ? candidate.photoPath 
          : `http://localhost:5000/${candidate.photoPath}`;
        
        const imgData = await loadImageToDataURL(photoUrl);
        if (imgData) {
          // Add photo as is - NO circular border
          doc.addImage(imgData, 'JPEG', photoX, photoY, photoSize, photoSize);
          
          // Optional: Add a subtle shadow/outline for better visibility
          doc.setDrawColor(220, 220, 220);
          doc.setLineWidth(0.5);
          doc.rect(photoX, photoY, photoSize, photoSize, 'S');
        } else {
          showCandidateInitialsIndividual(doc, candidate, photoX, photoY, photoSize);
        }
      } catch (error) {
        console.error('Error loading candidate photo:', error);
        showCandidateInitialsIndividual(doc, candidate, photoX, photoY, photoSize);
      }
    } else {
      showCandidateInitialsIndividual(doc, candidate, photoX, photoY, photoSize);
    }
    
    // Candidate information (to the right of photo)
    const infoStartX = photoX + photoSize + 25;
    
    doc.setTextColor(44, 62, 80);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${candidate.firstName} ${candidate.lastName}`, infoStartX, photoY + 15);
    
    // Status badge
    const statusColor = candidate.status === 'approved' ? [46, 204, 113] : 
                      candidate.status === 'pending' ? [241, 196, 15] : 
                      [231, 76, 60];
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(infoStartX, photoY + 22, 45, 12, 6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    
    const statusText = candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1);
    doc.text(statusText.toUpperCase(), infoStartX + 22.5, photoY + 28, { align: 'center' });
    
    // Basic info
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Candidate ID: ${candidate.id.substring(0, 8).toUpperCase()}`, infoStartX, photoY + 42);
    doc.text(`Profile Created: ${formatDate(candidate.createdAt || new Date())}`, infoStartX, photoY + 48);
    
    currentY += 60;
    
    // SINGLE COLUMN layout - NOT two columns
    // Personal Information Section with optimized column widths
    drawModernSectionHeader(doc, 'Personal Information', 20, currentY);
    currentY += 12;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Field', 'Details']],
      body: [
        ['Full Name', `${candidate.firstName} ${candidate.lastName}`],
        ['Gender', candidate.gender],
        ['Date of Birth', `${formatDate(candidate.dateOfBirth)} (${calculateAge(candidate.dateOfBirth)} years)`],
        ['Age', calculateAge(candidate.dateOfBirth).toString()],
        ['Place of Birth', candidate.placeOfBirth],
        ['Nationality', candidate.nationality],
        ['Religion', candidate.religion],
        ['Marital Status', candidate.maritalStatus],
        ['Number of Children', (candidate.numberOfChildren || 0).toString()],
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
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      styles: { cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 }, // Consistent first column width
        1: { cellWidth: 'auto' } // Second column takes remaining space
      },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Contact Information Section (FULL WIDTH - not in second column) with same column widths
    drawModernSectionHeader(doc, 'Contact Information', 20, currentY);
    currentY += 12;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Field', 'Details']],
      body: [
        ['Phone Number', candidate.phone],
        ['Email Address', candidate.email],
        ['Passport Number', candidate.passportNumber],
        ['Passport Place Issued', candidate.passportPlaceIssued],
        ['Passport Date Issued', formatDate(candidate.passportDateIssued)],
        ['Passport Expiry Date', formatDate(candidate.passportExpiryDate)],
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
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      styles: { cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 }, // Consistent first column width
        1: { cellWidth: 'auto' }
      },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Job Preferences Section with same column widths
    drawModernSectionHeader(doc, 'Job Preferences', 20, currentY);
    currentY += 12;
    
    autoTable(doc, {
      startY: currentY,
      head: [['Field', 'Details']],
      body: [
        ['Position Applied', candidate.positionApplied || 'N/A'],
        ['Expected Salary', `$${candidate.expectedSalary}`],
        ['Preferred Destination', candidate.preferredDestination || 'N/A'],
        ['Other Destination', candidate.otherDestination || 'N/A'],
        ['Previous Employment Country', candidate.previousEmploymentCountry || 'N/A'],
        ['Previous Employment Period', candidate.previousEmploymentPeriod || 'N/A'],
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
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      styles: { cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 }, // Consistent first column width
        1: { cellWidth: 'auto' }
      },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Skills Section with same column widths
    drawModernSectionHeader(doc, 'Skills & Qualifications', 20, currentY);
    currentY += 12;
    
    const skillsList = [];
    if (candidate.cleaning) skillsList.push('Cleaning');
    if (candidate.washing) skillsList.push('Washing');
    if (candidate.ironing) skillsList.push('Ironing');
    if (candidate.sewing) skillsList.push('Sewing');
    if (candidate.babySitting) skillsList.push('Baby Sitting');
    if (candidate.cooking) skillsList.push('Cooking');
    if (candidate.arabicCooking) skillsList.push('Arabic Cooking');
    if (candidate.elderlyCare) skillsList.push('Elderly Care');
    if (candidate.caregiver) skillsList.push('Caregiver');
    if (candidate.otherSkills) skillsList.push(candidate.otherSkills);
    
    const languageSkills = [];
    if (candidate.arabicProficiency) languageSkills.push(`Arabic: ${candidate.arabicProficiency}/10`);
    if (candidate.englishProficiency) languageSkills.push(`English: ${candidate.englishProficiency}/10`);
    if (candidate.otherLanguages) languageSkills.push(`Other: ${candidate.otherLanguages}`);
    
    autoTable(doc, {
      startY: currentY,
      head: [['Category', 'Details']],
      body: [
        ['Primary Skills', skillsList.length > 0 ? skillsList.join(', ') : 'No skills specified'],
        ['Language Proficiency', languageSkills.length > 0 ? languageSkills.join(', ') : 'N/A'],
        ['Additional Skills', candidate.skills || 'No additional skills specified'],
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
      margin: { left: 20, right: 20 },
      tableWidth: pageWidth - 40,
      styles: { cellPadding: 4 },
      columnStyles: {
        0: { cellWidth: 50 }, // Consistent first column width
        1: { cellWidth: 'auto' }
      },
    });
    
    // Add professional footer with light blue background
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Light blue footer background (matches header)
    doc.setFillColor(41, 128, 185);
    doc.rect(0, pageHeight - 30, pageWidth, 30, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    
    // Footer text (white on light blue)
    doc.text('TEDBEER Recruitment Agency - Confidential Candidate Profile', pageWidth / 2, pageHeight - 20, { align: 'center' });
    
    // Contact info in footer
    doc.setFontSize(7);
    doc.text('Email: info@tedbeer.com | Phone: +1 (555) 123-4567', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Generation timestamp
    doc.setFontSize(8);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    
    // Save PDF
    const fileName = `TEDBEER_${candidate.firstName}_${candidate.lastName}_${candidate.id.substring(0, 6)}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "Profile Exported",
      description: `Candidate profile for ${candidate.firstName} ${candidate.lastName} has been exported.`,
    });
    
  } catch (error) {
    console.error('Individual PDF generation error:', error);
    toast({
      title: "Error",
      description: "Failed to generate candidate profile PDF.",
      variant: "destructive",
    });
  }
};

// Helper function to load image and convert to Data URL
const loadImageToDataURL = (url: string): Promise<string | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      } catch (error) {
        console.error('Error converting image to Data URL:', error);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn('Could not load image:', url);
      resolve(null);
    };
    img.src = url;
  });
};

// Helper function to show candidate initials (NO circular border)
const showCandidateInitials = (doc: jsPDF, candidate: Candidate, x: number, y: number, size: number) => {
  // Square background
  doc.setFillColor(240, 240, 240);
  doc.rect(x, y, size, size, 'F');
  
  // Candidate initials
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(size * 0.4);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase(),
    x + size / 2,
    y + size / 2 + 2,
    { align: 'center' }
  );
  
  // Simple border (not circular)
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(x, y, size, size, 'S');
};

// Helper function to show candidate initials (for individual profile) - NO circular border
const showCandidateInitialsIndividual = (doc: jsPDF, candidate: Candidate, x: number, y: number, size: number) => {
  // Square background
  doc.setFillColor(240, 240, 240);
  doc.rect(x, y, size, size, 'F');
  
  // Candidate initials
  doc.setTextColor(41, 128, 185);
  doc.setFontSize(size * 0.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase(),
    x + size / 2,
    y + size / 2 + 3,
    { align: 'center' }
  );
  
  // Simple border (not circular)
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(x, y, size, size, 'S');
};

// New modern section header function
const drawModernSectionHeader = (doc: jsPDF, text: string, x: number, y: number) => {
  doc.setTextColor(44, 62, 80);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(text, x, y);
  
  // Colored underline
  const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(2);
  doc.line(x, y + 1.5, x + textWidth + 5, y + 1.5);
};

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-emerald-100 text-emerald-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case "Male":
        return "bg-blue-100 text-blue-800";
      case "Female":
        return "bg-pink-100 text-pink-800";
      case "Other":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDestinationColor = (destination: string) => {
    switch (destination) {
      case "Dubai":
        return "bg-orange-100 text-orange-800";
      case "Qatar":
        return "bg-maroon-100 text-maroon-800";
      case "Saudi Arabia":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const toggleRowExpansion = (candidateId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(candidateId)) {
      newExpandedRows.delete(candidateId);
    } else {
      newExpandedRows.add(candidateId);
    }
    setExpandedRows(newExpandedRows);
  };

  const getSkillBadges = (candidate: Candidate) => {
    const skills = [];
    if (candidate.cleaning) skills.push("🧹 Cleaning");
    if (candidate.washing) skills.push("👚 Washing");
    if (candidate.ironing) skills.push("♨️ Ironing");
    if (candidate.sewing) skills.push("🪡 Sewing");
    if (candidate.babySitting) skills.push("👶 Baby Sitting");
    if (candidate.cooking) skills.push("🍳 Cooking");
    if (candidate.arabicCooking) skills.push("🌮 Arabic Cooking");
    if (candidate.elderlyCare) skills.push("👵 Elderly Care");
    if (candidate.caregiver) skills.push("🏥 Caregiver");
    if (candidate.otherSkills) skills.push(candidate.otherSkills);
    return skills;
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      gender: "all",
      status: "all",
      destination: "all",
      ageGroup: "all",
      maritalStatus: "all",
      position: "all",
    });
    setSearchTerm("");
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== "all").length;

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin Aseffa Bekele"
      userEmail="aseffa@volunteer.et"
    >
      <div className="space-y-8">
        {/* Header with Export Buttons */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gray-600 bg-clip-text text-transparent mb-2">
                Candidate Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage and review overseas job candidate registrations
              </p>
              <p className="text-sm text-gray-500">
                Approve, reject, and monitor candidate applications
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={exportToExcel}>
                    <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                    Export as Excel (.xlsx)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileTextIcon className="h-4 w-4 mr-2 text-red-600" />
                    Export All as PDF (One per page)
                  </DropdownMenuItem>
                  {selectedCandidate && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Individual Export</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => exportCandidatePDF(selectedCandidate)}>
                        <FileTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                        Export Selected Candidate
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                onClick={fetchCandidates}
                variant="outline"
                className="border-blue-300 hover:bg-blue-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { 
              title: "Total Candidates", 
              value: candidates.length, 
              color: "yellow",
              icon: Users 
            },
            { 
              title: "Approved", 
              value: candidates.filter(c => c.status === "approved").length, 
              color: "emerald",
              icon: User 
            },
            { 
              title: "Pending Review", 
              value: candidates.filter(c => c.status === "pending").length, 
              color: "blue",
              icon: Users 
            },
            { 
              title: "Average Age", 
              value: candidates.length > 0 
                ? Math.round(candidates.reduce((acc, c) => acc + calculateAge(c.dateOfBirth), 0) / candidates.length) 
                : 0, 
              color: "purple",
              icon: Calendar 
            },
          ].map((stat, idx) => (
            <div key={idx} className={`animate-in fade-in slide-in-from-bottom-4 duration-700 delay-${300 + idx * 150}`}>
              <Card className={`hover:shadow-xl transition-all duration-500 border-l-4 border-${stat.color}-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                        {stat.title === "Average Age" && <span className="text-lg text-gray-500 ml-1">years</span>}
                      </p>
                    </div>
                    <div className={`p-4 rounded-3xl bg-${stat.color}-50 group-hover:scale-125 transition-transform duration-500 shadow-lg`}>
                      <stat.icon className={`h-8 w-8 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Modern Filter Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Search and Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search by name, phone, email, passport, position, or nationality..."
                      className="pl-12 py-6 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="relative py-6 px-6 border-gray-300 hover:bg-gray-50">
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        Filters
                        {activeFilterCount > 0 && (
                          <span className="ml-2 inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-600 text-xs text-white">
                            {activeFilterCount}
                          </span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <SlidersHorizontal className="h-5 w-5" />
                          Filter Candidates
                        </SheetTitle>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6">
                        {/* Status Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Application Status</Label>
                          <div className="flex flex-wrap gap-2">
                            {["all", "pending", "approved", "rejected"].map((status) => (
                              <Button
                                key={status}
                                size="sm"
                                variant={filters.status === status ? "default" : "outline"}
                                className="capitalize"
                                onClick={() => handleFilterChange("status", status)}
                              >
                                {status === "all" ? "All Statuses" : status}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Gender Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Gender</Label>
                          <div className="flex flex-wrap gap-2">
                            {["all", "Male", "Female", "Other"].map((gender) => (
                              <Button
                                key={gender}
                                size="sm"
                                variant={filters.gender === gender ? "default" : "outline"}
                                onClick={() => handleFilterChange("gender", gender)}
                              >
                                {gender === "all" ? "All Genders" : gender}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Age Group Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Age Group</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {["all", "18-25", "26-35", "36-45", "45+"].map((ageGroup) => (
                              <Button
                                key={ageGroup}
                                size="sm"
                                variant={filters.ageGroup === ageGroup ? "default" : "outline"}
                                onClick={() => handleFilterChange("ageGroup", ageGroup)}
                              >
                                {ageGroup === "all" ? "All Ages" : ageGroup === "45+" ? "45+" : `${ageGroup} Years`}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Destination Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Destination</Label>
                          <div className="flex flex-wrap gap-2">
                            {["all", "Dubai", "Qatar", "Saudi Arabia", "Other"].map((destination) => (
                              <Button
                                key={destination}
                                size="sm"
                                variant={filters.destination === destination ? "default" : "outline"}
                                onClick={() => handleFilterChange("destination", destination)}
                              >
                                {destination === "all" ? "All Destinations" : destination}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Position Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Position Applied</Label>
                          <Select
                            value={filters.position}
                            onValueChange={(value) => handleFilterChange("position", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Positions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Positions</SelectItem>
                              {filterOptions.positions.map((position) => (
                                <SelectItem key={position} value={position}>
                                  {position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Marital Status Filter */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Marital Status</Label>
                          <Select
                            value={filters.maritalStatus}
                            onValueChange={(value) => handleFilterChange("maritalStatus", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Marital Statuses" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              {filterOptions.maritalStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 border-t">
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={clearAllFilters}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Clear All
                            </Button>
                            <Button
                              className="flex-1"
                              onClick={() => setIsFilterOpen(false)}
                            >
                              Apply Filters
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Active Filters Display */}
                {activeFilterCount > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Active Filters</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 text-gray-500 hover:text-gray-700"
                      >
                        Clear all
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(filters).map(([key, value]) => {
                        if (value === "all") return null;
                        
                        let label = "";
                        switch (key) {
                          case "gender":
                            label = `Gender: ${value}`;
                            break;
                          case "status":
                            label = `Status: ${value}`;
                            break;
                          case "destination":
                            label = `Destination: ${value}`;
                            break;
                          case "ageGroup":
                            label = `Age: ${value}`;
                            break;
                          case "maritalStatus":
                            label = `Marital: ${value}`;
                            break;
                          case "position":
                            label = `Position: ${value}`;
                            break;
                        }
                        
                        return (
                          <Badge
                            key={key}
                            variant="secondary"
                            className="px-3 py-1 flex items-center gap-1"
                          >
                            {label}
                            <button
                              onClick={() => handleFilterChange(key as keyof FilterState, "all")}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl">Candidate Registrations</CardTitle>
                  <CardDescription>
                    {filteredCandidates.length} candidates found
                    {searchTerm && ` for "${searchTerm}"`}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="outline" className="bg-blue-50">
                    Total: {candidates.length}
                  </Badge>
                  <Badge variant="outline" className="bg-emerald-50">
                    Approved: {candidates.filter(c => c.status === "approved").length}
                  </Badge>
                  <Badge variant="outline" className="bg-yellow-50">
                    Pending: {candidates.filter(c => c.status === "pending").length}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading candidates...</p>
                </div>
              ) : filteredCandidates.length === 0 ? (
                <div className="text-center py-8">
                  <p>No candidates found matching your filters.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-10"></TableHead>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Personal Details</TableHead>
                        <TableHead>Job Details</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCandidates.map((candidate) => (
                        <TableRow key={candidate.id} className="hover:bg-gray-50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRowExpansion(candidate.id)}
                            >
                              {expandedRows.has(candidate.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                {candidate.photoPath ? (
                                  <AvatarImage 
                                    src={
                                      candidate.photoPath.includes('uploads/candidates') 
                                        ? `http://localhost:5000/${candidate.photoPath}`
                                        : `http://localhost:5000/uploads/candidates/${candidate.photoPath.split('\\').pop()}`
                                    } 
                                    alt={`${candidate.firstName} ${candidate.lastName}`}
                                    className="object-cover"
                                  />
                                ) : null}
                                <AvatarFallback className="bg-blue-100 text-blue-800">
                                  {candidate.firstName[0]}{candidate.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {candidate.firstName} {candidate.lastName}
                                </p>
                                <Badge variant="outline" className="mt-1">
                                  {candidate.positionApplied || "No Position"}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{candidate.phone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm truncate max-w-[150px]">{candidate.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Badge className={getGenderColor(candidate.gender)}>
                                  {candidate.gender}
                                </Badge>
                                <Badge variant="outline">
                                  {calculateAge(candidate.dateOfBirth)}y
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {candidate.nationality || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge className={getDestinationColor(candidate.preferredDestination)}>
                                {candidate.preferredDestination || "N/A"}
                              </Badge>
                              <p className="text-sm font-medium">
                                ${candidate.expectedSalary}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(candidate.status)}>
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedCandidate(candidate)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => exportCandidatePDF(candidate)}
                                title="Export to PDF"
                              >
                                <FileTextIcon className="h-4 w-4 text-gray-500" />
                              </Button>
                              {candidate.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    onClick={() => handleApprove(candidate.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleReject(candidate.id)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Expanded Row Details */}
                      {filteredCandidates.map((candidate) => (
                        expandedRows.has(candidate.id) && (
                          <TableRow key={`${candidate.id}-expanded`}>
                            <TableCell colSpan={7} className="bg-gray-50">
                              <div className="p-4 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div>
                                    <Label className="text-xs text-gray-500">Marital Status</Label>
                                    <p className="text-sm font-medium">{candidate.maritalStatus || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-500">Religion</Label>
                                    <p className="text-sm font-medium">{candidate.religion || 'N/A'}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-500">Children</Label>
                                    <p className="text-sm font-medium">{candidate.numberOfChildren || 0}</p>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-500">Place of Birth</Label>
                                    <p className="text-sm font-medium">{candidate.placeOfBirth || 'N/A'}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label className="text-xs text-gray-500">Skills</Label>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {getSkillBadges(candidate).map((skill, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-xs text-gray-500">Passport Details</Label>
                                    <div className="space-y-1 mt-1">
                                      <p className="text-sm font-mono">{candidate.passportNumber}</p>
                                      <p className="text-xs text-gray-600">
                                        Issued: {formatDate(candidate.passportDateIssued)} 
                                        | Expires: {formatDate(candidate.passportExpiryDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-gray-500">Languages</Label>
                                    <div className="flex items-center space-x-4 mt-1">
                                      {candidate.arabicProficiency && (
                                        <div className="text-sm">
                                          <span className="font-medium">Arabic: </span>
                                          <span className="text-gray-600">{candidate.arabicProficiency}/10</span>
                                        </div>
                                      )}
                                      {candidate.englishProficiency && (
                                        <div className="text-sm">
                                          <span className="font-medium">English: </span>
                                          <span className="text-gray-600">{candidate.englishProficiency}/10</span>
                                        </div>
                                      )}
                                      {candidate.otherLanguages && (
                                        <div className="text-sm">
                                          <span className="font-medium">Other: </span>
                                          <span className="text-gray-600">{candidate.otherLanguages}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Candidate Details Modal */}
        {selectedCandidate && (
          <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </DialogTitle>
                    <DialogDescription>
                      Complete candidate profile and documents
                    </DialogDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedCandidate.status)}>
                      {selectedCandidate.status.toUpperCase()}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportCandidatePDF(selectedCandidate)}
                    >
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Personal Information</Label>
                        <div className="mt-2 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <p className="text-sm"><span className="font-medium">Gender:</span> {selectedCandidate.gender}</p>
                            <p className="text-sm"><span className="font-medium">Age:</span> {calculateAge(selectedCandidate.dateOfBirth)} years</p>
                          </div>
                          <p className="text-sm"><span className="font-medium">Date of Birth:</span> {formatDate(selectedCandidate.dateOfBirth)}</p>
                          <p className="text-sm"><span className="font-medium">Place of Birth:</span> {selectedCandidate.placeOfBirth || 'N/A'}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Contact Information</Label>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm"><span className="font-medium">Phone:</span> {selectedCandidate.phone}</p>
                          <p className="text-sm"><span className="font-medium">Email:</span> {selectedCandidate.email}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Family Details</Label>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm"><span className="font-medium">Marital Status:</span> {selectedCandidate.maritalStatus || 'N/A'}</p>
                          <p className="text-sm"><span className="font-medium">Children:</span> {selectedCandidate.numberOfChildren || 0}</p>
                          <p className="text-sm"><span className="font-medium">Religion:</span> {selectedCandidate.religion || 'N/A'}</p>
                          <p className="text-sm"><span className="font-medium">Nationality:</span> {selectedCandidate.nationality || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Physical Details</Label>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm"><span className="font-medium">Height:</span> {selectedCandidate.height || 'N/A'} cm</p>
                          <p className="text-sm"><span className="font-medium">Weight:</span> {selectedCandidate.weight || 'N/A'} kg</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Passport Information</Label>
                        <div className="mt-2 space-y-2">
                          <p className="text-sm font-mono"><span className="font-medium">Number:</span> {selectedCandidate.passportNumber}</p>
                          <p className="text-sm"><span className="font-medium">Place Issued:</span> {selectedCandidate.passportPlaceIssued || 'N/A'}</p>
                          <p className="text-sm"><span className="font-medium">Date Issued:</span> {formatDate(selectedCandidate.passportDateIssued)}</p>
                          <p className="text-sm"><span className="font-medium">Expiry Date:</span> {formatDate(selectedCandidate.passportExpiryDate)}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Language Proficiency (1-10)</Label>
                        <div className="mt-2 space-y-2">
                          {selectedCandidate.arabicProficiency && (
                            <p className="text-sm"><span className="font-medium">Arabic:</span> {selectedCandidate.arabicProficiency}/10</p>
                          )}
                          {selectedCandidate.englishProficiency && (
                            <p className="text-sm"><span className="font-medium">English:</span> {selectedCandidate.englishProficiency}/10</p>
                          )}
                          {selectedCandidate.otherLanguages && (
                            <p className="text-sm"><span className="font-medium">Other Languages:</span> {selectedCandidate.otherLanguages}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="professional" className="space-y-4 pt-4">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Job Preferences</Label>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Position Applied:</span> {selectedCandidate.positionApplied || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Expected Salary:</span> ${selectedCandidate.expectedSalary}</p>
                        <p className="text-sm"><span className="font-medium">Preferred Destination:</span> {selectedCandidate.preferredDestination || 'N/A'}</p>
                        {selectedCandidate.otherDestination && (
                          <p className="text-sm"><span className="font-medium">Other Destination:</span> {selectedCandidate.otherDestination}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Skills Checklist</Label>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {getSkillBadges(selectedCandidate).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="justify-start">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Skills & Qualifications</Label>
                      <p className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedCandidate.skills || 'No additional skills specified'}
                      </p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Previous Employment Abroad</Label>
                      <div className="mt-2 space-y-2">
                        <p className="text-sm"><span className="font-medium">Country:</span> {selectedCandidate.previousEmploymentCountry || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Period:</span> {selectedCandidate.previousEmploymentPeriod || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { path: selectedCandidate.passportPath, label: "Passport Copy", type: "passport" },
                      { path: selectedCandidate.photoPath, label: "Photo", type: "photo" },
                      { path: selectedCandidate.medicalClearancePath, label: "Medical Clearance", type: "medical" },
                      { path: selectedCandidate.policeClearancePath, label: "Police Clearance", type: "police" },
                    ].map((doc, idx) => doc.path && (
                      <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{doc.label}</p>
                            <p className="text-sm text-gray-500">Click to download</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc.path!, doc.label)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4 pt-4">
                  {selectedCandidate.status === "pending" ? (
                    <div className="space-y-6">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          This candidate is pending review. Please approve or reject their application.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                          className="w-full bg-emerald-600 hover:bg-emerald-700 h-12"
                          onClick={() => {
                            handleApprove(selectedCandidate.id);
                            setSelectedCandidate(null);
                          }}
                        >
                          <Check className="h-5 w-5 mr-2" />
                          Approve Candidate
                        </Button>
                        
                        <Button
                          variant="destructive"
                          className="w-full h-12"
                          onClick={() => {
                            handleReject(selectedCandidate.id);
                            setSelectedCandidate(null);
                          }}
                        >
                          <X className="h-5 w-5 mr-2" />
                          Reject Candidate
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        This candidate has been <span className="font-medium">{selectedCandidate.status}</span>.
                        Status was updated on {formatDate(selectedCandidate.updatedAt)}.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}