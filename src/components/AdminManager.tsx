
import { useState } from "react";
import { Plus, Trash2, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export const AdminManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { addAdmin, getAdmins, deleteAdmin, currentAdmin } = useAuth();
  const admins = getAdmins();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (addAdmin(formData.username, formData.password)) {
      toast({
        title: "Admin Added",
        description: "New admin has been created successfully",
      });
      setFormData({ username: '', password: '' });
      setIsDialogOpen(false);
    } else {
      toast({
        title: "Error",
        description: "Username already exists",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: number) => {
    if (admins.length === 1) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the last admin",
        variant: "destructive",
      });
      return;
    }
    
    if (currentAdmin?.id === id) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete your own account",
        variant: "destructive",
      });
      return;
    }
    
    deleteAdmin(id);
    toast({
      title: "Admin Deleted",
      description: "Admin has been removed successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Admin Management
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-800 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Admin</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Add Admin</Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{admin.username}</p>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(admin.createdAt).toLocaleDateString()}
                    {currentAdmin?.id === admin.id && " (Current)"}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleDelete(admin.id)}
                className="text-red-600 hover:text-red-700"
                disabled={admins.length === 1 || currentAdmin?.id === admin.id}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
