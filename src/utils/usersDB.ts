import { readUsers, writeUsers } from './localAuth';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  joinedOn?: string;
  lastLogin?: string;
  address?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// Helper to convert local user to User format
const convertLocalUser = (localUser: any): User => {
  return {
    id: localUser.id,
    name: localUser.name,
    email: localUser.email,
    phone: localUser.phone,
    role: localUser.role || 'customer',
    status: localUser.status || 'Active',
    address: localUser.address,
    notes: localUser.notes,
    created_at: localUser.created_at || new Date().toISOString(),
    updated_at: localUser.updated_at || new Date().toISOString(),
  };
};

export const getUsersFromDB = async (): Promise<User[]> => {
  try {
    console.log('🔍 Loading users from localStorage...');
    const users = readUsers();
    const convertedUsers = users.map(convertLocalUser);
    console.log('✅ Users loaded successfully:', convertedUsers.length);
    return convertedUsers;
  } catch (error) {
    console.error('❌ Failed to load users:', error);
    return [];
  }
};

export const updateUserStatusInDB = async (userId: string, status: string): Promise<boolean> => {
  console.log(`🔄 Updating user ${userId} status to: ${status}`);
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`No user found with ID: ${userId}`);
    }
    
    users[userIndex] = {
      ...users[userIndex],
      status,
      updated_at: new Date().toISOString(),
    };
    
    writeUsers(users);
    console.log('✅ User status updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to update user status:', error);
    throw error;
  }
};

export const updateUserRoleInDB = async (userId: string, role: string): Promise<boolean> => {
  console.log(`🔄 Updating user ${userId} role to: ${role}`);
  const dbRole = role === 'Admin' ? 'admin' : 'customer';
  
  try {
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`No user found with ID: ${userId}`);
    }
    
    users[userIndex] = {
      ...users[userIndex],
      role: dbRole,
      updated_at: new Date().toISOString(),
    };
    
    writeUsers(users);
    console.log('✅ User role updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to update user role:', error);
    throw error;
  }
};

export const deleteUserFromDB = async (userId: string): Promise<boolean> => {
  console.log(`🗑️ Deleting user ${userId}`);
  try {
    const users = readUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    writeUsers(filteredUsers);
    console.log('✅ User deleted successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to delete user:', error);
    throw error;
  }
};

