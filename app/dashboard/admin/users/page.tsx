"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Building,
  Briefcase,
  User,
  Building2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard-layout";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "candidate" | "employer" | "agency" | "admin";
  status: "pending" | "approved" | "rejected";
  joinDate: string;
  
  // Candidate specific fields
  firstName?: string;
  lastName?: string;
  photoPath?: string;
  
  // Employer specific fields
  companyName?: string;
  contactPersonFirstName?: string;
  contactPersonLastName?: string;
  contactPersonPhotoPath?: string;
  
  // Agency specific fields
  agencyName?: string;
  directorFirstName?: string;
  directorLastName?: string;
  directorPhotoPath?: string;
}

interface ApiResponse<T> {
  data?: T[];
  candidates?: T[];
  employers?: T[];
  agencies?: T[];
  users?: T[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserTypeDialog, setShowUserTypeDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch users from API with pagination
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user types concurrently
      const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/candidates?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`http://localhost:5000/api/employers?page=${currentPage}&limit=${itemsPerPage}`),
        fetch(`http://localhost:5000/api/agencies?page=${currentPage}&limit=${itemsPerPage}`)
      ]);

      const candidatesData: ApiResponse<any> = await candidatesRes.json();
      const employersData: ApiResponse<any> = await employersRes.json();
      const agenciesData: ApiResponse<any> = await agenciesRes.json();

      // Extract arrays from responses
      const candidates = Array.isArray(candidatesData) 
        ? candidatesData 
        : candidatesData.candidates || candidatesData.data || [];
      
      const employers = Array.isArray(employersData)
        ? employersData
        : employersData.employers || employersData.data || [];
      
      const agencies = Array.isArray(agenciesData)
        ? agenciesData
        : agenciesData.agencies || agenciesData.data || [];

      // Transform data to common format
      const allUsers: User[] = [
        ...candidates.map((candidate: any) => ({
          id: candidate.id || candidate._id,
          name: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
          email: candidate.email || '',
          phone: candidate.phone || '',
          role: "candidate" as const,
          status: candidate.status || "pending",
          joinDate: candidate.createdAt || candidate.joinDate || new Date().toISOString(),
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          photoPath: candidate.photoPath,
        })),
        ...employers.map((employer: any) => ({
          id: employer.id || employer._id,
          name: employer.companyName || '',
          email: employer.email || '',
          phone: employer.phone || '',
          role: "employer" as const,
          status: employer.status || "pending",
          joinDate: employer.createdAt || employer.joinDate || new Date().toISOString(),
          companyName: employer.companyName,
          contactPersonFirstName: employer.contactPersonFirstName,
          contactPersonLastName: employer.contactPersonLastName,
          contactPersonPhotoPath: employer.contactPersonPhotoPath,
        })),
        ...agencies.map((agency: any) => ({
          id: agency.id || agency._id,
          name: agency.agencyName || '',
          email: agency.contactEmail || agency.directorEmail || '',
          phone: agency.contactPhone || agency.directorPhone || '',
          role: "agency" as const,
          status: agency.status || "pending",
          joinDate: agency.createdAt || agency.joinDate || new Date().toISOString(),
          agencyName: agency.agencyName,
          directorFirstName: agency.directorFirstName,
          directorLastName: agency.directorLastName,
          directorPhotoPath: agency.directorPhotoPath,
        }))
      ];

      setUsers(allUsers);
      
      // Calculate totals (this assumes your API returns pagination info)
      // If your API doesn't provide totals, you might need to fetch counts separately
      const totalCandidates = candidatesData.total || candidates.length;
      const totalEmployers = employersData.total || employers.length;
      const totalAgencies = agenciesData.total || agencies.length;
      
      setTotalUsers(totalCandidates + totalEmployers + totalAgencies);
      setTotalPages(Math.ceil((totalCandidates + totalEmployers + totalAgencies) / itemsPerPage));
      
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to dummy data for demo
      const dummyUsers: User[] = [
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          role: "candidate",
          status: "approved",
          joinDate: new Date().toISOString(),
          firstName: "John",
          lastName: "Doe",
        },
        {
          id: "2",
          name: "Acme Corp",
          email: "contact@acme.com",
          phone: "+1234567891",
          role: "employer",
          status: "pending",
          joinDate: new Date().toISOString(),
          companyName: "Acme Corp",
        },
        {
          id: "3",
          name: "Recruit Pro",
          email: "info@recruitpro.com",
          phone: "+1234567892",
          role: "agency",
          status: "approved",
          joinDate: new Date().toISOString(),
          agencyName: "Recruit Pro",
        }
      ];
      setUsers(dummyUsers);
      setTotalUsers(dummyUsers.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginate filtered users
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "employer":
        return "bg-blue-100 text-blue-800";
      case "candidate":
        return "bg-green-100 text-green-800";
      case "agency":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Shield;
      case "employer":
        return Building;
      case "candidate":
        return User;
      case "agency":
        return Briefcase;
      default:
        return Users;
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Admin";
      case "employer":
        return "Employer";
      case "candidate":
        return "Candidate";
      case "agency":
        return "Agency";
      default:
        return role;
    }
  };

  // Function to render avatar based on user type
  const renderAvatar = (user: User) => {
    const baseUrl = "http://localhost:5000";

    switch (user.role) {
      case "candidate":
        return (
          <Avatar className="h-10 w-10">
            {user.photoPath ? (
              <AvatarImage 
                src={
                  user.photoPath.includes('uploads/candidates') 
                    ? `${baseUrl}/${user.photoPath}`
                    : `${baseUrl}/uploads/candidates/${user.photoPath.split('\\').pop()}`
                } 
                alt={`${user.firstName} ${user.lastName}`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-800">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        );

      case "employer":
        return (
          <Avatar className="h-10 w-10">
            {user.contactPersonPhotoPath ? (
              <AvatarImage 
                src={`${baseUrl}/${user.contactPersonPhotoPath}`} 
                alt={`${user.contactPersonFirstName} ${user.contactPersonLastName}`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <Building2 className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        );

      case "agency":
        return (
          <Avatar className="h-10 w-10">
            {user.directorPhotoPath ? (
              <AvatarImage 
                src={`${baseUrl}/${user.directorPhotoPath}`} 
                alt={`${user.directorFirstName} ${user.directorLastName}`}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-800">
              <Building2 className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        );

      default:
        return (
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gray-100 text-gray-800">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        );
    }
  };

  // Delete user function
  const handleDeleteUser = async (userId: string, userRole: string) => {
    try {
      setDeleteLoading(userId);
      
      let endpoint = '';
      switch (userRole) {
        case 'candidate':
          endpoint = `http://localhost:5000/api/candidates/${userId}`;
          break;
        case 'employer':
          endpoint = `http://localhost:5000/api/employers/${userId}`;
          break;
        case 'agency':
          endpoint = `http://localhost:5000/api/agencies/${userId}`;
          break;
        default:
          throw new Error('Invalid user role');
      }

      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from local state
      setUsers(users.filter(user => user.id !== userId));
      setTotalUsers(prev => prev - 1);
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit user functions
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      setSaveLoading(true);
      
      let endpoint = '';
      let updateData = {};

      switch (editingUser.role) {
        case 'candidate':
          endpoint = `http://localhost:5000/api/candidates/${editingUser.id}`;
          updateData = {
            firstName: editFormData.name?.split(' ')[0] || editingUser.firstName,
            lastName: editFormData.name?.split(' ')[1] || editingUser.lastName,
            email: editFormData.email,
            phone: editFormData.phone,
            status: editFormData.status,
          };
          break;
        case 'employer':
          endpoint = `http://localhost:5000/api/employers/${editingUser.id}`;
          updateData = {
            companyName: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
            status: editFormData.status,
          };
          break;
        case 'agency':
          endpoint = `http://localhost:5000/api/agencies/${editingUser.id}`;
          updateData = {
            agencyName: editFormData.name,
            contactEmail: editFormData.email,
            contactPhone: editFormData.phone,
            status: editFormData.status,
          };
          break;
        default:
          throw new Error('Invalid user role');
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update local state
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...editFormData }
          : user
      ));

      setEditingUser(null);
      setEditFormData({});
      
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setEditFormData({});
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Calculate pagination numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show limited pages with ellipsis
      if (currentPage <= 3) {
        // Show first 4 pages and last page
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Show first page and last 4 pages
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Show pages around current page
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return (
      <DashboardLayout
        userRole="admin"
        userName="Admin User"
        userEmail="admin@rams.et"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-pulse" />
            <p className="text-gray-600">Loading users...</p>
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
            <h1 className="text-3xl font-poppins font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Users Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all system users - candidates, employers, and agencies
            </p>
          </div>
          <Button 
            className="bg-blue-900 text-white hover:bg-blue-400"
            onClick={() => setShowUserTypeDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-green-100">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {users.filter((u) => u.role === "candidate").length}
                  </p>
                  <p className="text-sm text-gray-600">Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {users.filter((u) => u.role === "employer").length}
                  </p>
                  <p className="text-sm text-gray-600">Employers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-orange-100">
                  <Briefcase className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">
                    {users.filter((u) => u.role === "agency").length}
                  </p>
                  <p className="text-sm text-gray-600">Agencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  className="pl-10 h-11 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11">
                      <Filter className="h-4 w-4 mr-2" />
                      Role: {filterRole === "all" ? "All" : getRoleDisplayName(filterRole)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterRole("all")}>
                      All Roles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole("candidate")}>
                      <User className="h-4 w-4 mr-2 text-green-600" />
                      Candidates
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole("employer")}>
                      <Building className="h-4 w-4 mr-2 text-blue-600" />
                      Employers
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterRole("agency")}>
                      <Briefcase className="h-4 w-4 mr-2 text-orange-600" />
                      Agencies
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-11">
                      <Filter className="h-4 w-4 mr-2" />
                      Status: {filterStatus === "all" ? "All" : filterStatus}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All Status
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      Rejected
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      Pending
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>User List</CardTitle>
                <CardDescription>
                  Showing {paginatedUsers.length} of {filteredUsers.length} filtered users ({totalUsers} total)
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <span className="text-sm text-gray-600">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No users found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || filterRole !== "all" || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No users have been added yet."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((user) => {
                      const RoleIcon = getRoleIcon(user.role);
                      return (
                        <TableRow key={user.id} className="hover:bg-gray-50/50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {renderAvatar(user)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ID: {user.id.substring(0, 8)}...
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm truncate max-w-[200px]">{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{user.phone}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <RoleIcon className="h-4 w-4" />
                              <Badge variant="outline" className={getRoleColor(user.role)}>
                                {getRoleDisplayName(user.role)}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-600">
                              {new Date(user.joinDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete <span className="font-semibold">{user.name}</span>? 
                                      This action cannot be undone and will permanently remove the user from the system.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteUser(user.id, user.role)}
                                      disabled={deleteLoading === user.id}
                                    >
                                      {deleteLoading === user.id ? (
                                        <>
                                          <span className="animate-spin mr-2">⟳</span>
                                          Deleting...
                                        </>
                                      ) : "Delete User"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(endIndex, filteredUsers.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredUsers.length}</span> filtered users
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page as number)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Type Selection Dialog */}
        <Dialog open={showUserTypeDialog} onOpenChange={setShowUserTypeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New User</DialogTitle>
              <DialogDescription>
                Choose the type of user you want to register
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 py-4">
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-green-50 hover:border-green-200">
                <Link href="/register/candidate" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-4 text-left">
                    <div className="p-2 rounded-lg bg-green-100">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Register Candidate</p>
                      <p className="text-sm text-gray-500 mt-1">Job seeker looking for opportunities</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-blue-50 hover:border-blue-200">
                <Link href="/register/employer" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-4 text-left">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Register Employer</p>
                      <p className="text-sm text-gray-500 mt-1">Company looking to hire candidates</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4 hover:bg-orange-50 hover:border-orange-200">
                <Link href="/register/agency" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-4 text-left">
                    <div className="p-2 rounded-lg bg-orange-100">
                      <Briefcase className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">Register Agency</p>
                      <p className="text-sm text-gray-500 mt-1">Recruitment agency</p>
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User Information</DialogTitle>
              <DialogDescription>
                Update user details for {editingUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Account Status</Label>
                <Select
                  value={editFormData.status || 'pending'}
                  onValueChange={(value: "approved" | "rejected" | "pending") => 
                    setEditFormData({...editFormData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved" className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      Approved
                    </SelectItem>
                    <SelectItem value="rejected" className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                      Rejected
                    </SelectItem>
                    <SelectItem value="pending" className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                      Pending
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saveLoading} className="bg-blue-600 hover:bg-blue-700">
                {saveLoading ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}