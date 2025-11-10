
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getUsersFromDB, User, updateUserStatusInDB, updateUserRoleInDB, deleteUserFromDB } from "@/utils/usersDBsupabase";
import { ensureAdminAccess } from "@/utils/appointmentDB";

const Users = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        console.log('🔍 Loading users from database...');
        
        const allUsers = await getUsersFromDB();
        console.log('✅ Users loaded successfully:', allUsers.length);
        setUsers(allUsers);
        
      } catch (error) {
        console.error('❌ Failed to load users:', error);
        toast({
          title: "Error",
          description: "Failed to load users from the database. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    // Ensure admin access policies are applied, then load users
    (async () => {
      await ensureAdminAccess().catch(() => {});
      loadUsers();
    })();
  }, [toast]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Reloading users from database...');
      const allUsers = await getUsersFromDB();
      console.log('✅ Loaded users from DB:', allUsers.length);
      setUsers(allUsers);
    } catch (error) {
      console.error('❌ Error loading users from DB:', error);
      toast({
        title: "Error",
        description: "Failed to load users from the database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadUsers();
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await ensureAdminAccess().catch(() => {});
        await deleteUserFromDB(userId);
        toast({
          title: "User Deleted",
          description: `${userName} has been removed from the system.`,
        });
        loadUsers(); // Refresh the list
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        toast({
          title: "Error",
          description: "Failed to delete user. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleStatusChange = async (userId: string, userName: string, newStatus: User['status']) => {
    try {
      await ensureAdminAccess().catch(() => {});
      await updateUserStatusInDB(userId, newStatus);
      toast({
        title: "Status Updated",
        description: `${userName}'s status has been updated to ${newStatus}.`,
      });
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, userName: string, newRole: User['role']) => {
    try {
      await ensureAdminAccess().catch(() => {});
      await updateUserRoleInDB(userId, newRole);
      toast({
        title: "Role Updated",
        description: `${userName}'s role has been updated to ${newRole}.`,
      });
      loadUsers(); // Refresh the list
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = () => {
    toast({
      title: "Add User",
      description: "Add user functionality will be implemented soon.",
    });
  };

  const handleEditUser = (user: User) => {
    toast({
      title: "Edit User",
      description: `Edit functionality for ${user.name} will be implemented soon.`,
    });
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || (user.role?.toLowerCase() === filterRole.toLowerCase());
    const matchesStatus = filterStatus === "All" || (user.status?.toLowerCase() === filterStatus.toLowerCase());
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-800";
      case "Veterinarian": return "bg-blue-100 text-blue-800";
      case "Staff": return "bg-orange-100 text-orange-800";
      case "Client": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
            👥 {users.length} Users
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            ➕ Add User
          </button>
          <button 
            onClick={handleRefresh} 
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users by name, email, phone, or ID..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Client">Clients</option>
          <option value="Veterinarian">Veterinarians</option>
          <option value="Admin">Admins</option>
          <option value="Staff">Staff</option>
        </select>
        <select
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Joined On</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
                  </td>
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{user.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      {user.address && (
                        <div className="text-xs text-gray-500">{user.address}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">{user.phone}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, user.name, e.target.value as User['role'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getRoleColor(user.role)}`}
                    >
                      <option value="Client">Client</option>
                      <option value="Veterinarian">Veterinarian</option>
                      <option value="Staff">Staff</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user.id, user.name, e.target.value as User['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(user.status)}`}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">{user.created_at ? new Date(user.created_at).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={8} className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl">👥</div>
                    <div className="text-gray-500">
                      {searchTerm || filterRole !== "All" || filterStatus !== "All"
                        ? "No users match your search criteria" 
                        : "No users found in the system"
                      }
                    </div>
                    {!searchTerm && filterRole === "All" && filterStatus === "All" && (
                      <button onClick={handleAddUser} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                        ➕ Add Your First User
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      {!isLoading && filteredUsers.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default Users;
