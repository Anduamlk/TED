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

  // Fetch users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all user types concurrently
      const [candidatesRes, employersRes, agenciesRes] = await Promise.all([
        fetch('http://localhost:5000/api/candidates'),
        fetch('http://localhost:5000/api/employers'),
        fetch('http://localhost:5000/api/agencies')
      ]);

      const candidates = await candidatesRes.json();
      const employers = await employersRes.json();
      const agencies = await agenciesRes.json();

      // Transform data to common format
      const allUsers: User[] = [
        ...candidates.map((candidate: any) => ({
          id: candidate.id,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          phone: candidate.phone,
          role: "candidate" as const,
          status: candidate.status || "pending",
          joinDate: candidate.createdAt || new Date().toISOString(),
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          photoPath: candidate.photoPath,
        })),
        ...employers.map((employer: any) => ({
          id: employer.id,
          name: employer.companyName,
          email: employer.email,
          phone: employer.phone,
          role: "employer" as const,
          status: employer.status || "pending",
          joinDate: employer.createdAt || new Date().toISOString(),
          companyName: employer.companyName,
          contactPersonFirstName: employer.contactPersonFirstName,
          contactPersonLastName: employer.contactPersonLastName,
          contactPersonPhotoPath: employer.contactPersonPhotoPath,
        })),
        ...agencies.map((agency: any) => ({
          id: agency.id,
          name: agency.agencyName,
          email: agency.contactEmail || agency.directorEmail,
          phone: agency.contactPhone || agency.directorPhone,
          role: "agency" as const,
          status: agency.status || "pending",
          joinDate: agency.createdAt || new Date().toISOString(),
          agencyName: agency.agencyName,
          directorFirstName: agency.directorFirstName,
          directorLastName: agency.directorLastName,
          directorPhotoPath: agency.directorPhotoPath,
        }))
      ];

      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <DashboardLayout
        userRole="admin"
        userName="Admin User"
        userEmail="admin@rams.et"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
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
            <h1 className="text-3xl font-poppins font-bold text-gray-900">
              Users
            </h1>
            <p className="text-gray-600 mt-1">
              Manage all system users - candidates, employers, and agencies
            </p>
          </div>
          <Button 
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={() => setShowUserTypeDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-gray-600">Total Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "candidate").length}
                  </p>
                  <p className="text-sm text-gray-600">Candidates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "employer").length}
                  </p>
                  <p className="text-sm text-gray-600">Employers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.role === "agency").length}
                  </p>
                  <p className="text-sm text-gray-600">Agencies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email, or phone..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Role: {filterRole === "all" ? "All" : getRoleDisplayName(filterRole)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterRole("all")}>
                  All Roles
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole("candidate")}>
                  Candidates
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole("employer")}>
                  Employers
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterRole("agency")}>
                  Agencies
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
                <DropdownMenuItem onClick={() => setFilterStatus("approved")}>
                  Approved
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("rejected")}>
                  Rejected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  Pending
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              A list of all users in the system with their roles and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {renderAvatar(user)}
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{user.email}</span>
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
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(user.joinDate).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {user.name}?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleDeleteUser(user.id, user.role)}
                                  disabled={deleteLoading === user.id}
                                >
                                  {deleteLoading === user.id ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterRole !== "all" || filterStatus !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by adding your first user."}
              </p>
              {!searchTerm &&
                filterRole === "all" &&
                filterStatus === "all" && (
                  <Button onClick={() => setShowUserTypeDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                )}
            </CardContent>
          </Card>
        )}

        {/* User Type Selection Dialog */}
        <Dialog open={showUserTypeDialog} onOpenChange={setShowUserTypeDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Select User Type</DialogTitle>
              <DialogDescription>
                Choose the type of user you want to register
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4 py-4">
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/register/candidate" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-3 text-left">
                    <User className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium">Candidate</p>
                      <p className="text-sm text-gray-500">Job seeker looking for opportunities</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/register/employer" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-3 text-left">
                    <Building className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium">Employer</p>
                      <p className="text-sm text-gray-500">Company looking to hire candidates</p>
                    </div>
                  </div>
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="h-auto p-4">
                <Link href="/register/agency" onClick={() => setShowUserTypeDialog(false)}>
                  <div className="flex items-center space-x-3 text-left">
                    <Briefcase className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium">Agency</p>
                      <p className="text-sm text-gray-500">Recruitment agency</p>
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information for {editingUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email || ''}
                  onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editFormData.phone || ''}
                  onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={saveLoading}>
                <Save className="h-4 w-4 mr-2" />
                {saveLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}