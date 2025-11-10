import { useState, useEffect } from "react";
import { getUsersFromDB, User } from "@/utils/usersDBsupabase";
 import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 import { Input } from "@/components/ui/input";
 import { Search, Calendar } from "lucide-react";
 
 const SignupsPage = () => {
   const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
   const [searchTerm, setSearchTerm] = useState("");
   const [dateFilter, setDateFilter] = useState("");

     useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('🔍 Loading signups from database...');
        
        const users = await getUsersFromDB();
        console.log('✅ Signups loaded successfully:', users.length);
        setRegisteredUsers(users);
        
      } catch (error) {
        console.error('❌ Failed to load signups:', error);
      }
    };
    loadUsers();
  }, []);
 
   // Filter users based on search term and date
   const filteredUsers = registeredUsers.filter(user => {
     const matchesSearch = 
       (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
       (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
     // Use created_at as signup date
     const signupDate = user.created_at ? user.created_at.split('T')[0] : '';
     const matchesDate = dateFilter === "" || signupDate === dateFilter;
     return matchesSearch && matchesDate;
   });
 
   return (
     <div className="space-y-6">
       <div className="flex justify-between items-center">
         <h2 className="text-2xl font-bold tracking-tight">new sign in</h2>
       </div>
 
       {/* Filters */}
       <div className="flex flex-col sm:flex-row gap-4">
         <div className="relative flex-grow">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
           <Input
             type="text"
             placeholder="Search users..."
             className="pl-10 pr-4 py-2"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
         </div>
         <div className="flex items-center gap-2">
           <Calendar className="h-4 w-4 text-muted-foreground" />
           <Input
             type="date"
             className="w-auto"
             value={dateFilter}
             onChange={(e) => setDateFilter(e.target.value)}
           />
         </div>
       </div>
 
       {/* Users Table */}
       <div className="border rounded-md">
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>User ID</TableHead>
               <TableHead>Name</TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Sign Up Date</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {filteredUsers.map((user) => (
               <TableRow key={user.id}>
                 <TableCell className="font-medium">{user.id}</TableCell>
                 <TableCell>{user.name}</TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>{user.date}</TableCell>
               </TableRow>
             ))}
             {filteredUsers.length === 0 && (
               <TableRow>
                 <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                   No sign ups found
                 </TableCell>
               </TableRow>
             )}
           </TableBody>
         </Table>
       </div>
     </div>
   );
 };
 
 export default SignupsPage;