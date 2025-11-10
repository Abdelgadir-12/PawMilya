// Admin configuration and detection utilities

// List of admin email addresses
export const ADMIN_EMAILS = [
  'admin@example.com',
  // Add your actual email here to become admin
  // 'your-actual-email@example.com',
];

// Admin role names that indicate admin status
export const ADMIN_ROLES = [
  'admin',
  'Admin',
  'administrator',
  'Administrator'
];

// Function to check if a user is an admin based on email
export const isAdminByEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Function to check if a user is an admin based on role
export const isAdminByRole = (role: string): boolean => {
  return ADMIN_ROLES.includes(role);
};

// Function to check if a user is an admin (checks both email and role)
export const isAdmin = (email: string, role?: string): boolean => {
  return isAdminByEmail(email) || (role && isAdminByRole(role));
};

// Function to get admin detection info for debugging
export const getAdminDetectionInfo = (email: string, role?: string) => {
  return {
    email,
    role,
    isAdminByEmail: isAdminByEmail(email),
    isAdminByRole: role ? isAdminByRole(role) : false,
    isAdmin: isAdmin(email, role),
    adminEmails: ADMIN_EMAILS,
    adminRoles: ADMIN_ROLES
  };
};
