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
  Award,
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

interface Agency {
  id: string;
  agencyName: string;
  licenseNumber: string;
  licenseExpiryDate: string;
  authorizedCountries: string;
  yearEstablished: string;
  directorFirstName: string;
  directorLastName: string;
  directorPhone: string;
  directorEmail: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  region: string;
  numberOfRecruiters: string;
  numberOfActivePlacements?: string;
  servicesOffered: string;
  previousExperience: string;
  experienceYears?: string;
  licenseDocumentPath?: string;
  registrationCertificatePath?: string;
  directorPhotoPath?: string;
  status: "pending" | "approved" | "rejected";
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAgencyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterExperience, setFilterExperience] = useState("all");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch agencies from backend
  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/agencies");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setAgencies(data);
    } catch (error) {
      console.error("Error fetching agencies:", error);
      toast({
        title: "Error",
        description: "Failed to load agencies. Please try again.",
        variant: "destructive",
      });
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredAgencies = agencies.filter((agency) => {
    const matchesSearch =
      agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.directorFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.directorLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency.contactPhone.includes(searchTerm) ||
      agency.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion =
      filterRegion === "all" || agency.region === filterRegion;
    
    const matchesStatus =
      filterStatus === "all" || agency.status === filterStatus;
    
    const matchesExperience =
      filterExperience === "all" || agency.previousExperience === filterExperience;

    return matchesSearch && matchesRegion && matchesStatus && matchesExperience;
  });

  const handleApprove = async (agencyId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agencies/${agencyId}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to approve agency");

      toast({
        title: "Agency Approved",
        description: "Agency has been approved successfully.",
      });
      
      fetchAgencies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve agency. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (agencyId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/agencies/${agencyId}/reject`, {
        method: "PATCH",
      });

      if (!response.ok) throw new Error("Failed to reject agency");

      toast({
        title: "Agency Rejected",
        description: "Agency has been rejected.",
        variant: "destructive",
      });
      
      fetchAgencies();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject agency. Please try again.",
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

  const getRegionColor = (region: string) => {
    switch (region) {
      case "Addis Ababa":
        return "bg-blue-100 text-blue-800";
      case "Oromia":
        return "bg-green-100 text-green-800";
      case "Amhara":
        return "bg-purple-100 text-purple-800";
      case "Tigray":
        return "bg-red-100 text-red-800";
      case "SNNPR":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case "Yes":
        return "bg-emerald-100 text-emerald-800";
      case "No":
        return "bg-gray-100 text-gray-800";
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

  const calculateYearsSince = (yearEstablished: string) => {
    const currentYear = new Date().getFullYear();
    const establishedYear = parseInt(yearEstablished);
    return currentYear - establishedYear;
  };

  const REGIONS = [
    "Addis Ababa", "Afar", "Amhara", "Benishangul-Gumuz", "Dire Dawa",
    "Gambela", "Harari", "Oromia", "SNNPR", "Somali", "Tigray"
  ];

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
                Agency Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage and review recruitment agency registrations
              </p>
              <p className="text-sm text-gray-500">
                Approve, reject, and monitor agency applications
              </p>
            </div>
            <Button 
              onClick={fetchAgencies}
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
                      Total Agencies
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {agencies.length}
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
                      Approved Agencies
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {agencies.filter(a => a.status === "approved").length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-emerald-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <Award className="h-8 w-8 text-emerald-600" />
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
                      {agencies.filter(a => a.status === "pending").length}
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
                      Experienced Agencies
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {agencies.filter(a => a.previousExperience === "Yes").length}
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
                placeholder="Search by agency name, director, license, phone, or email..."
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
                    Region: {filterRegion === "all" ? "All" : filterRegion}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Region</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterRegion("all")}>
                    All Regions
                  </DropdownMenuItem>
                  {REGIONS.map(region => (
                    <DropdownMenuItem key={region} onClick={() => setFilterRegion(region)}>
                      {region}
                    </DropdownMenuItem>
                  ))}
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
                    Experience: {filterExperience === "all" ? "All" : filterExperience}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Experience</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterExperience("all")}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterExperience("Yes")}>
                    With Experience
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterExperience("No")}>
                    No Experience
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Agencies Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Agency Registrations</CardTitle>
              <CardDescription>
                Manage and review recruitment agency applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading agencies...</p>
                </div>
              ) : filteredAgencies.length === 0 ? (
                <div className="text-center py-8">
                  <p>No agencies found matching your filters.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Agency</TableHead>
                      <TableHead>Director</TableHead>
                      <TableHead>Contact Info</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Recruiters</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgencies.map((agency) => (
                      <TableRow key={agency.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              {agency.directorPhotoPath ? (
                                <AvatarImage 
                                  src={`http://localhost:5000/${agency.directorPhotoPath}`} 
                                  alt={`${agency.directorFirstName} ${agency.directorLastName}`}
                                  className="object-cover"
                                />
                              ) : null}
                              <AvatarFallback className="bg-blue-100 text-blue-800">
                                <Building2 className="h-5 w-5" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {agency.agencyName}
                              </p>
                              <p className="text-sm text-gray-500">
                                License: {agency.licenseNumber}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-gray-900">
                              {agency.directorFirstName} {agency.directorLastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Est. {agency.yearEstablished} ({calculateYearsSince(agency.yearEstablished)} years)
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Phone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{agency.contactPhone}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{agency.contactEmail}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getRegionColor(agency.region)}>
                            {agency.region}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {agency.numberOfRecruiters}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getExperienceColor(agency.previousExperience)}>
                            {agency.previousExperience}
                            {agency.experienceYears && ` (${agency.experienceYears} years)`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(agency.status)}>
                            {agency.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(agency.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedAgency(agency)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            {agency.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-600 hover:text-emerald-700"
                                  onClick={() => handleApprove(agency.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleReject(agency.id)}
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

        {/* Agency Details Modal */}
         {selectedAgency && (
          <Dialog open={!!selectedAgency} onOpenChange={() => setSelectedAgency(null)}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Agency Details
                </DialogTitle>
                <DialogDescription>
                  Complete information for {selectedAgency.agencyName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Agency Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Agency Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Agency Name</Label>
                      <p className="font-medium">{selectedAgency.agencyName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">License Number</Label>
                      <p className="font-mono font-medium">{selectedAgency.licenseNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">License Expiry</Label>
                      <p className="font-medium">{formatDate(selectedAgency.licenseExpiryDate)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Year Established</Label>
                      <p className="font-medium">
                        {selectedAgency.yearEstablished} 
                        <span className="text-gray-500 ml-2">
                          ({calculateYearsSince(selectedAgency.yearEstablished)} years)
                        </span>
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Authorized Countries</Label>
                      <p className="font-medium mt-1">{selectedAgency.authorizedCountries}</p>
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
                      <Label className="text-sm font-medium text-gray-500">Region</Label>
                      <Badge className={getRegionColor(selectedAgency.region)}>
                        {selectedAgency.region}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">City</Label>
                      <p className="font-medium">{selectedAgency.city}</p>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm font-medium text-gray-500">Address</Label>
                      <p className="font-medium">{selectedAgency.address}</p>
                    </div>
                  </div>
                </div>

                {/* Director Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Director Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">First Name</Label>
                      <p className="font-medium">{selectedAgency.directorFirstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                      <p className="font-medium">{selectedAgency.directorLastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Director Phone</Label>
                      <p className="font-medium">{selectedAgency.directorPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Director Email</Label>
                      <p className="font-medium">{selectedAgency.directorEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Contact Phone</Label>
                      <p className="font-medium">{selectedAgency.contactPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Contact Email</Label>
                      <p className="font-medium">{selectedAgency.contactEmail}</p>
                    </div>
                  </div>
                </div>

                {/* Operations Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Operations Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Number of Recruiters</Label>
                        <p className="font-medium">{selectedAgency.numberOfRecruiters}</p>
                      </div>
                      {selectedAgency.numberOfActivePlacements && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Active Placements</Label>
                          <p className="font-medium">{selectedAgency.numberOfActivePlacements}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Services Offered</Label>
                      <p className="font-medium mt-1">{selectedAgency.servicesOffered}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Previous Experience</Label>
                        <Badge className={getExperienceColor(selectedAgency.previousExperience)}>
                          {selectedAgency.previousExperience}
                        </Badge>
                      </div>
                      {selectedAgency.experienceYears && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Years of Experience</Label>
                          <p className="font-medium">{selectedAgency.experienceYears} years</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedAgency.licenseDocumentPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Agency License</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedAgency.licenseDocumentPath!, "Agency License")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedAgency.registrationCertificatePath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Registration Certificate</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedAgency.registrationCertificatePath!, "Registration Certificate")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedAgency.directorPhotoPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Director Photo</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedAgency.directorPhotoPath!, "Director Photo")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedAgency.status === "pending" && (
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        handleApprove(selectedAgency.id);
                        setSelectedAgency(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Agency
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedAgency.id);
                        setSelectedAgency(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Agency
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