"use client";

import { useState, useEffect } from "react";
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
  Building2,
  MapPin,
  Briefcase,
  Download,
  RefreshCw,
  Globe,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardLayout from "@/components/dashboard-layout";
import { useToast } from "@/hooks/use-toast";

interface Employer {
  id: string;
  companyName: string;
  companyType: string;
  licenseNumber: string;
  countryOfOperation: string;
  city: string;
  address: string;
  website?: string;
  contactPersonFirstName: string;
  contactPersonLastName: string;
  contactPersonPosition: string;
  phone: string;
  email: string;
  alternateEmail?: string;
  numberOfEmployees: string;
  sectorsOfOperation: string;
  previousHiringExperience: string;
  hiringHistory?: string;
  licenseDocumentPath?: string;
  registrationCertificatePath?: string;
  contactPersonPhotoPath?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function AdminEmployerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompanyType, setFilterCompanyType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [selectedEmployer, setSelectedEmployer] = useState<Employer | null>(null);
  const [employers, setEmployers] = useState<Employer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch employers from backend
  useEffect(() => {
    fetchEmployers();
  }, []);

  const fetchEmployers = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/employers");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setEmployers(data);
    } catch (error) {
      console.error("Error fetching employers:", error);
      toast({
        title: "Error",
        description: "Failed to load employers. Please try again.",
        variant: "destructive",
      });
      setEmployers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployers = employers.filter((employer) => {
    const matchesSearch =
      employer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.contactPersonFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.contactPersonLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.phone.includes(searchTerm) ||
      employer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employer.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompanyType =
      filterCompanyType === "all" || employer.companyType === filterCompanyType;
    
    const matchesStatus =
      filterStatus === "all" || employer.status === filterStatus;
    
    const matchesCountry =
      filterCountry === "all" || employer.countryOfOperation === filterCountry;

    return matchesSearch && matchesCompanyType && matchesStatus && matchesCountry;
  });

  const handleApprove = async (employerId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employers/${employerId}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to approve employer");

      toast({
        title: "Employer Approved",
        description: "Employer has been approved successfully.",
      });
      
      fetchEmployers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve employer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (employerId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/employers/${employerId}/reject`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to reject employer");

      toast({
        title: "Employer Rejected",
        description: "Employer has been rejected.",
        variant: "destructive",
      });
      
      fetchEmployers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject employer. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadDocument = (filePath: string, documentType: string) => {
    const downloadUrl = `http://localhost:5000/${filePath}`;
    window.open(downloadUrl, '_blank');
    
    toast({
      title: "Download Started",
      description: `Downloading ${documentType}...`,
    });
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

  const getCompanyTypeColor = (companyType: string) => {
    switch (companyType) {
      case "Private":
        return "bg-blue-100 text-blue-800";
      case "Government":
        return "bg-green-100 text-green-800";
      case "NGO":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCountryColor = (country: string) => {
    switch (country) {
      case "UAE":
        return "bg-orange-100 text-orange-800";
      case "Qatar":
        return "bg-maroon-100 text-maroon-800";
      case "Saudi Arabia":
        return "bg-green-100 text-green-800";
      case "Kuwait":
        return "bg-red-100 text-red-800";
      case "Oman":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout
      userRole="admin"
      userName="Admin Aseffa Bekele"
      userEmail="aseffa@volunteer.et"
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-in fade-in duration-1000">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gray-600 bg-clip-text text-transparent mb-2">
                Employer Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage and review overseas employer registrations
              </p>
              <p className="text-sm text-gray-500">
                Approve, reject, and monitor employer applications
              </p>
            </div>
            <Button 
              onClick={fetchEmployers}
              className="bg-blue-200 hover:bg-blue-100 hover:border-blue-400 text-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-yellow-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Total Employers
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {employers.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-yellow-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <Building2 className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-450">
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-emerald-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Approved Employers
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {employers.filter(e => e.status === "approved").length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <User className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600">
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-blue-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Pending Review
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {employers.filter(e => e.status === "pending").length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-blue-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-750">
            <Card className="hover:shadow-xl transition-all duration-500 border-l-4 border-purple-200 group cursor-pointer transform hover:scale-105 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600">
                      New This Week
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {employers.filter(e => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return new Date(e.createdAt) > oneWeekAgo;
                      }).length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-purple-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-900">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by company, contact person, phone, email, or license..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-emerald-300 hover:bg-emerald-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Type: {filterCompanyType === "all" ? "All" : filterCompanyType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Company Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterCompanyType("all")}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCompanyType("Private")}>
                    Private
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCompanyType("Government")}>
                    Government
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCompanyType("NGO")}>
                    NGO
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-blue-300 hover:bg-blue-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Status: {filterStatus === "all" ? "All" : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-purple-300 hover:bg-purple-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Country: {filterCountry === "all" ? "All" : filterCountry}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Country</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterCountry("all")}>
                    All Countries
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCountry("UAE")}>
                    UAE
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCountry("Qatar")}>
                    Qatar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCountry("Saudi Arabia")}>
                    Saudi Arabia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCountry("Kuwait")}>
                    Kuwait
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterCountry("Oman")}>
                    Oman
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Employers Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Employer Registrations</CardTitle>
              <CardDescription>
                Manage and review overseas employer applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading employers...</p>
                </div>
              ) : filteredEmployers.length === 0 ? (
                <div className="text-center py-8">
                  <p>No employers found matching your filters.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Employees</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployers.map((employer) => (
                      <TableRow key={employer.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              {employer.contactPersonPhotoPath ? (
                                <AvatarImage 
                                  src={`http://localhost:5000/${employer.contactPersonPhotoPath}`} 
                                  alt={`${employer.contactPersonFirstName} ${employer.contactPersonLastName}`}
                                  className="object-cover"
                                />
                              ) : null}
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                <Building2 className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {employer.companyName}
                              </p>
                              <p className="text-sm text-gray-500">
                                License: {employer.licenseNumber}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {employer.contactPersonFirstName} {employer.contactPersonLastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {employer.contactPersonPosition}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{employer.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{employer.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCompanyTypeColor(employer.companyType)}>
                            {employer.companyType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCountryColor(employer.countryOfOperation)}>
                            {employer.countryOfOperation}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {employer.numberOfEmployees}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(employer.status)}>
                            {employer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(employer.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedEmployer(employer)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            {employer.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-600 hover:text-emerald-700"
                                  onClick={() => handleApprove(employer.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleReject(employer.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Employer Details Modal */}
        {selectedEmployer && (
          <Dialog open={!!selectedEmployer} onOpenChange={() => setSelectedEmployer(null)}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Employer Details
                </DialogTitle>
                <DialogDescription>
                  Complete information for {selectedEmployer.companyName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Company Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Name</Label>
                      <p className="font-medium">{selectedEmployer.companyName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Company Type</Label>
                      <Badge className={getCompanyTypeColor(selectedEmployer.companyType)}>
                        {selectedEmployer.companyType}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">License Number</Label>
                      <p className="font-mono font-medium">{selectedEmployer.licenseNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Number of Employees</Label>
                      <p className="font-medium">{selectedEmployer.numberOfEmployees}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Sectors of Operation</Label>
                      <p className="font-medium mt-1">{selectedEmployer.sectorsOfOperation}</p>
                    </div>
                  </div>
                </div>

                {/* Location Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Country</Label>
                      <Badge className={getCountryColor(selectedEmployer.countryOfOperation)}>
                        {selectedEmployer.countryOfOperation}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">City</Label>
                      <p className="font-medium">{selectedEmployer.city}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Address</Label>
                      <p className="font-medium">{selectedEmployer.address}</p>
                    </div>
                    {selectedEmployer.website && (
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-500">Website</Label>
                        <p className="font-medium text-blue-600">{selectedEmployer.website}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Person Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Contact Person Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">First Name</Label>
                      <p className="font-medium">{selectedEmployer.contactPersonFirstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                      <p className="font-medium">{selectedEmployer.contactPersonLastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Position</Label>
                      <p className="font-medium">{selectedEmployer.contactPersonPosition}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="font-medium">{selectedEmployer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="font-medium">{selectedEmployer.email}</p>
                    </div>
                    {selectedEmployer.alternateEmail && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Alternate Email</Label>
                        <p className="font-medium">{selectedEmployer.alternateEmail}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hiring Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Hiring Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Previous Hiring Experience</Label>
                      <p className="font-medium">{selectedEmployer.previousHiringExperience}</p>
                    </div>
                    {selectedEmployer.hiringHistory && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Hiring History</Label>
                        <p className="font-medium mt-1">{selectedEmployer.hiringHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedEmployer.licenseDocumentPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Business License</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedEmployer.licenseDocumentPath!, "Business License")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedEmployer.registrationCertificatePath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Registration Certificate</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedEmployer.registrationCertificatePath!, "Registration Certificate")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedEmployer.contactPersonPhotoPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Contact Person Photo</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedEmployer.contactPersonPhotoPath!, "Contact Person Photo")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedEmployer.status === "pending" && (
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        handleApprove(selectedEmployer.id);
                        setSelectedEmployer(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Employer
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedEmployer.id);
                        setSelectedEmployer(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Employer
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}