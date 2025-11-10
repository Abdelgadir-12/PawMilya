import { useState } from "react";
 import { useAuth } from "@/contexts/AuthContext";
 import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { useToast } from "@/components/ui/use-toast";
 import { UserRound, Mail, Phone, Edit } from "lucide-react";
 
 const Profile = () => {
   const { user, updateUserProfile } = useAuth();
   const { toast } = useToast();
   
   const [isEditing, setIsEditing] = useState(false);
   const [name, setName] = useState(user?.name || "");
   const [phone, setPhone] = useState(user?.phone || "");
   const [address, setAddress] = useState(user?.address || "");
   
   const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     
     updateUserProfile({ name, phone, address });
     
     toast({
       title: "Profile updated",
       description: "Your profile information has been updated successfully.",
     });
     
     setIsEditing(false);
   };
   
   return (
     <div className="container max-w-4xl py-12">
       <h1 className="text-3xl font-bold mb-8">My Profile</h1>
       
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-3">
           <Card>
             <CardHeader>
               <CardTitle className="flex justify-between items-center">
                 <span>Profile Information</span>
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={() => setIsEditing(!isEditing)}
                 >
                   <Edit className="h-4 w-4 mr-2" />
                   {isEditing ? "Cancel" : "Edit"}
                 </Button>
               </CardTitle>
               <CardDescription>
                 Manage your personal information
               </CardDescription>
             </CardHeader>
             <CardContent>
               {/* ...existing code for edit/view form... */}
               {isEditing ? (
                 <form onSubmit={handleSubmit} className="space-y-4">
                   {/* ...existing code for edit form... */}
                   <div className="space-y-2">
                     <Label htmlFor="name">Full Name</Label>
                     <Input
                       id="name"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       placeholder="Your full name"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                       id="email"
                       value={user?.email}
                       disabled
                       className="bg-gray-50"
                     />
                     <p className="text-xs text-muted-foreground">Email address cannot be changed</p>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phone">Phone Number</Label>
                     <Input
                       id="phone"
                       value={phone}
                       onChange={(e) => setPhone(e.target.value)}
                       placeholder="Your phone number"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="address">Address</Label>
                     <Input
                       id="address"
                       value={address}
                       onChange={(e) => setAddress(e.target.value)}
                       placeholder="Your address"
                     />
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="role">Account Type</Label>
                     <Input
                       id="role"
                       value={user?.role === "admin" ? "Administrator" : "Customer"}
                       disabled
                       className="bg-gray-50"
                     />
                   </div>
                   <div className="pt-2">
                     <Button type="submit">Save Changes</Button>
                   </div>
                 </form>
               ) : (
                 <div className="space-y-6">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-full bg-pet-blue flex items-center justify-center text-white">
                       <UserRound size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-medium">{user?.name}</h3>
                       <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <Mail className="h-4 w-4 text-muted-foreground" />
                       <span className="text-sm">{user?.email}</span>
                     </div>
                     {user?.phone && (
                       <div className="flex items-center gap-2">
                         <Phone className="h-4 w-4 text-muted-foreground" />
                         <span className="text-sm">{user?.phone}</span>
                       </div>
                     )}
                     {user?.address && (
                       <div className="flex items-center gap-2">
                         <svg className="h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                           <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                           <circle cx="12" cy="10" r="3"></circle>
                         </svg>
                         <span className="text-sm">{user?.address}</span>
                       </div>
                     )}
                   </div>
                 </div>
               )}
             </CardContent>
           </Card>
         </div>
       </div>
     </div>
   );
 };
 
 export default Profile;