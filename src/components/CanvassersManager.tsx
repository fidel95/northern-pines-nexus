
import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Canvasser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  assigned_territories: string[] | null;
  hire_date: string;
  active: boolean;
  total_visits: number;
  leads_generated: number;
  conversion_rate: number;
  created_at: string;
  updated_at: string;
}

export const CanvassersManager = () => {
  const [canvassers, setCanvassers] = useState<Canvasser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newCanvasser, setNewCanvasser] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    assigned_territories: [] as string[],
    active: true
  });
  const [territories, setTerritories] = useState('');

  const fetchCanvassers = async () => {
    try {
      const { data, error } = await supabase
        .from('canvassers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCanvassers(data || []);
    } catch (error) {
      console.error('Error fetching canvassers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch canvassers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCanvassers();
  }, []);

  const addCanvasser = async () => {
    if (!newCanvasser.name || !newCanvasser.email || !newCanvasser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Email, Password)",
        variant: "destructive"
      });
      return;
    }

    try {
      // First create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newCanvasser.email,
        password: newCanvasser.password,
        email_confirm: true
      });

      if (authError) throw authError;

      // Then create the canvasser record
      const territoriesArray = territories.split(',').map(t => t.trim()).filter(t => t);
      
      const { error: canvasserError } = await supabase
        .from('canvassers')
        .insert([{
          name: newCanvasser.name,
          email: newCanvasser.email,
          phone: newCanvasser.phone || null,
          assigned_territories: territoriesArray.length > 0 ? territoriesArray : null,
          active: newCanvasser.active
        }]);

      if (canvasserError) throw canvasserError;

      await fetchCanvassers();
      setNewCanvasser({
        name: '',
        email: '',
        phone: '',
        password: '',
        assigned_territories: [],
        active: true
      });
      setTerritories('');
      setIsAddDialogOpen(false);
      
      toast({
        title: "Canvasser Added",
        description: "New canvasser has been added successfully and can now log in",
      });
    } catch (error: any) {
      console.error('Error adding canvasser:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add canvasser",
        variant: "destructive"
      });
    }
  };

  const toggleCanvasserStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('canvassers')
        .update({ 
          active: !currentStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);

      if (error) throw error;

      await fetchCanvassers();
      toast({
        title: "Status Updated",
        description: `Canvasser ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating canvasser status:', error);
      toast({
        title: "Error",
        description: "Failed to update canvasser status",
        variant: "destructive"
      });
    }
  };

  const deleteCanvasser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this canvasser? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('canvassers')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCanvassers();
      toast({
        title: "Canvasser Deleted",
        description: "Canvasser has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting canvasser:', error);
      toast({
        title: "Error",
        description: "Failed to delete canvasser",
        variant: "destructive"
      });
    }
  };

  const filteredCanvassers = canvassers.filter(canvasser => 
    canvasser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    canvasser.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-8 text-white">Loading canvassers...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            Canvasser Management
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Canvasser
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Canvasser</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        value={newCanvasser.name}
                        onChange={(e) => setNewCanvasser({...newCanvasser, name: e.target.value})}
                        placeholder="Enter full name"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCanvasser.email}
                        onChange={(e) => setNewCanvasser({...newCanvasser, email: e.target.value})}
                        placeholder="Enter email"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                      <Input
                        id="phone"
                        value={newCanvasser.phone}
                        onChange={(e) => setNewCanvasser({...newCanvasser, phone: e.target.value})}
                        placeholder="Enter phone number"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-gray-300">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newCanvasser.password}
                        onChange={(e) => setNewCanvasser({...newCanvasser, password: e.target.value})}
                        placeholder="Create password"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="territories" className="text-gray-300">Assigned Territories</Label>
                    <Input
                      id="territories"
                      value={territories}
                      onChange={(e) => setTerritories(e.target.value)}
                      placeholder="Enter territories separated by commas"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                    <p className="text-xs text-gray-400 mt-1">e.g., Downtown, North Side, East District</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newCanvasser.active}
                      onCheckedChange={(checked) => setNewCanvasser({...newCanvasser, active: checked})}
                    />
                    <Label htmlFor="active" className="text-gray-300">Active</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={addCanvasser} className="bg-blue-600 hover:bg-blue-700">
                      Add Canvasser
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search canvassers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredCanvassers.map((canvasser) => (
              <div key={canvasser.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-white">{canvasser.name}</h3>
                      <Badge className={canvasser.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {canvasser.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-300">
                      <p><strong>Email:</strong> {canvasser.email}</p>
                      <p><strong>Phone:</strong> {canvasser.phone || 'N/A'}</p>
                      <p><strong>Hire Date:</strong> {new Date(canvasser.hire_date).toLocaleDateString()}</p>
                      <p><strong>Total Visits:</strong> {canvasser.total_visits}</p>
                      <p><strong>Leads Generated:</strong> {canvasser.leads_generated}</p>
                      <p><strong>Conversion Rate:</strong> {canvasser.conversion_rate}%</p>
                    </div>
                    {canvasser.assigned_territories && canvasser.assigned_territories.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-300">
                          <strong>Territories:</strong> {canvasser.assigned_territories.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-600">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => deleteCanvasser(canvasser.id)}
                        className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => toggleCanvasserStatus(canvasser.id, canvasser.active)}
                      className={canvasser.active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                    >
                      {canvasser.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredCanvassers.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No canvassers found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
