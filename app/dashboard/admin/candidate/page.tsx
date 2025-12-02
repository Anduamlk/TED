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
  MapPin,
  Briefcase,
  Download,
  RefreshCw,
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

interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  passportNumber: string;
  skills: string;
  preferredDestination: string;
  otherDestination?: string;
  passportPath?: string;
  photoPath?: string;
  medicalClearancePath?: string;
  policeClearancePath?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function AdminCandidatePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDestination, setFilterDestination] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
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
      setCandidates(data);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      });
      // Fallback to empty array if API fails
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.phone.includes(searchTerm) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender =
      filterGender === "all" || candidate.gender === filterGender;
    
    const matchesStatus =
      filterStatus === "all" || candidate.status === filterStatus;
    
    const matchesDestination =
      filterDestination === "all" || 
      candidate.preferredDestination === filterDestination ||
      (filterDestination === "Other" && candidate.otherDestination);

    return matchesSearch && matchesGender && matchesStatus && matchesDestination;
  });

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
      
      // Refresh the candidates list
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
      
      // Refresh the candidates list
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
    // Create a direct download link to the file
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
                Candidate Management
              </h1>
              <p className="text-lg text-gray-600">
                Manage and review overseas job candidate registrations
              </p>
              <p className="text-sm text-gray-500">
                Approve, reject, and monitor candidate applications
              </p>
            </div>
            <Button 
              onClick={fetchCandidates}
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
                      Total Candidates
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {candidates.length}
                    </p>
                  </div>
                  <div className="p-4 rounded-3xl bg-yellow-50 group-hover:scale-125 transition-transform duration-500 shadow-lg">
                    <Users className="h-8 w-8 text-yellow-600" />
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
                      Approved Candidates
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {candidates.filter(c => c.status === "approved").length}
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
                      {candidates.filter(c => c.status === "pending").length}
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
                      {candidates.filter(c => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        return new Date(c.createdAt) > oneWeekAgo;
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
                placeholder="Search by name, phone, email, or passport..."
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
                    Gender: {filterGender === "all" ? "All" : filterGender}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Gender</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterGender("all")}>
                    All Genders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterGender("Male")}>
                    Male
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterGender("Female")}>
                    Female
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterGender("Other")}>
                    Other
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
                    Destination: {filterDestination === "all" ? "All" : filterDestination}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Destination</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterDestination("all")}>
                    All Destinations
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDestination("Dubai")}>
                    Dubai
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDestination("Qatar")}>
                    Qatar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDestination("Saudi Arabia")}>
                    Saudi Arabia
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterDestination("Other")}>
                    Other
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-1100">
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl">Candidate Registrations</CardTitle>
              <CardDescription>
                Manage and review overseas job candidate applications
              </CardDescription>
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Passport</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id} className="hover:bg-gray-50">
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
                              <p className="text-sm text-gray-500">
                                {candidate.skills.split(' ').slice(0, 3).join(' ')}...
                              </p>
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
                              <span className="text-sm">{candidate.email}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getGenderColor(candidate.gender)}>
                            {candidate.gender}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm font-medium">
                            {calculateAge(candidate.dateOfBirth)} years
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">
                            {candidate.passportNumber}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={getDestinationColor(candidate.preferredDestination)}>
                            {candidate.preferredDestination}
                            {candidate.otherDestination && ` (${candidate.otherDestination})`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(candidate.status)}>
                            {candidate.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {formatDate(candidate.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedCandidate(candidate)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                            </Dialog>
                            {candidate.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-emerald-600 hover:text-emerald-700"
                                  onClick={() => handleApprove(candidate.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700"
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
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Candidate Details Modal */}
        {selectedCandidate && (
          <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Candidate Details
                </DialogTitle>
                <DialogDescription>
                  Complete information for {selectedCandidate.firstName} {selectedCandidate.lastName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">First Name</Label>
                      <p className="font-medium">{selectedCandidate.firstName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                      <p className="font-medium">{selectedCandidate.lastName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Gender</Label>
                      <Badge className={getGenderColor(selectedCandidate.gender)}>
                        {selectedCandidate.gender}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                      <p className="font-medium">
                        {formatDate(selectedCandidate.dateOfBirth)} 
                        <span className="text-gray-500 ml-2">
                          ({calculateAge(selectedCandidate.dateOfBirth)} years)
                        </span>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Passport Number</Label>
                      <p className="font-mono font-medium">{selectedCandidate.passportNumber}</p>
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
                      <Label className="text-sm font-medium text-gray-500">Phone</Label>
                      <p className="font-medium">{selectedCandidate.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Email</Label>
                      <p className="font-medium">{selectedCandidate.email}</p>
                    </div>
                  </div>
                </div>

                {/* Skills and Preferences */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Skills & Preferences
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Skills & Qualifications</Label>
                      <p className="font-medium mt-1">{selectedCandidate.skills}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Preferred Destination</Label>
                        <Badge className={getDestinationColor(selectedCandidate.preferredDestination)}>
                          {selectedCandidate.preferredDestination}
                        </Badge>
                      </div>
                      {selectedCandidate.otherDestination && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Other Destination</Label>
                          <p className="font-medium">{selectedCandidate.otherDestination}</p>
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
                  <div className="grid grid-cols-2 gap-4">
                    {selectedCandidate.passportPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Passport Copy</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedCandidate.passportPath!, "Passport")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedCandidate.photoPath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Photo</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedCandidate.photoPath!, "Photo")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedCandidate.medicalClearancePath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Medical Clearance</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedCandidate.medicalClearancePath!, "Medical Clearance")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                    {selectedCandidate.policeClearancePath && (
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">Police Clearance</Label>
                          <p className="text-sm text-gray-600">Uploaded</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(selectedCandidate.policeClearancePath!, "Police Clearance")}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedCandidate.status === "pending" && (
                  <div className="flex space-x-4 pt-4 border-t">
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      onClick={() => {
                        handleApprove(selectedCandidate.id);
                        setSelectedCandidate(null);
                      }}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve Candidate
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedCandidate.id);
                        setSelectedCandidate(null);
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject Candidate
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