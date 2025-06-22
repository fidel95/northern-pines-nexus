
import { useState, useEffect } from "react";
import { Plus, Trash2, User, Edit, MapPin, Calendar, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

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
}

export const CanvassersManager = () => {
  const [canvassers, setCanvassers] = useState<Canvasser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCanvasser, setEditingCanvasser] = useState<Canvasser | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    assigned_territories: [] as string[],
    hire_date: ''
  });

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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      assigned_territories: [],
      hire_date: ''
    });
    setEditingCanvasser(null);
  };

  const handleEdit = (canvasser: Canvasser) => {
    setEditingCanvasser(canvasser);
    setFormData({
      name: canvasser.name,
      email: canvasser.email,
      phone: canvasser.phone || '',
      assigned_territories: canvasser.assigned_territories || [],
      hire_date: canvasser.hire_date
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const canvasserData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        assigned_territories: formData.assigned_territories.length > 0 ? formData.assigned_territories : null,
        hire_date: formData.hire_date || new Date().toISOString().split('T')[0]
      };

      if (editingCanvasser) {
        const { error } = await supabase
          .from('canvassers')
          .update({
            ...canvasserData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCanvasser.id);

        if (error) throw error;
        toast({
          title: "Canvasser Updated",
          description: "Canvasser has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('canvassers')
          .insert([canvasserData]);

        if (error) throw error;
        toast({
          title: "Canvasser Added",
          description: "New canvasser has been added successfully",
        });
      }

      await fetchCanvassers();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving canvasser:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save canvasser",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
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

  const addTerritory = () => {
    setFormData(prev => ({
      ...prev,
      assigned_territories: [...prev.assigned_territories, '']
    }));
  };

  const updateTerritory = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_territories: prev.assigned_territories.map((territory, i) => 
        i === index ? value : territory
      )
    }));
  };

  const removeTerritory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      assigned_territories: prev.assigned_territories.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading canvassers...</div>;
  }

  return (
    <Card className="bg-gray-900 border-blue-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Canvasser Management
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Add Canvasser
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-blue-800 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCanvasser ? 'Edit Canvasser' : 'Add New Canvasser'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter full name"
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter email"
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Enter phone number"
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hire_date" className="text-gray-300">Hire Date</Label>
                    <Input
                      id="hire_date"
                      type="date"
                      value={formData.hire_date}
                      onChange={(e) => setFormData({...formData, hire_date: e.target.value})}
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Assigned Territories (ZIP Codes)</Label>
                  <div className="space-y-2 mt-2">
                    {formData.assigned_territories.map((territory, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={territory}
                          onChange={(e) => updateTerritory(index, e.target.value)}
                          placeholder="Enter ZIP code"
                          className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                        />
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => removeTerritory(index)}
                          className="border-blue-700 text-blue-400 hover:bg-blue-900"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={addTerritory}
                      className="border-blue-700 text-blue-400 hover:bg-blue-900"
                    >
                      Add Territory
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-blue-700 text-gray-300 hover:bg-gray-800">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    {editingCanvasser ? 'Update' : 'Add'} Canvasser
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {canvassers.map((canvasser) => (
            <div key={canvasser.id} className="border border-blue-800 rounded-lg p-4 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{canvasser.name}</h3>
                    <Badge className={`${canvasser.active ? 'bg-blue-600' : 'bg-gray-600'} text-white`}>
                      {canvasser.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <p><strong>Email:</strong> {canvasser.email}</p>
                    <p><strong>Phone:</strong> {canvasser.phone || 'N/A'}</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span><strong>Hired:</strong> {format(new Date(canvasser.hire_date), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 text-blue-400" />
                      <span><strong>Conversion:</strong> {canvasser.conversion_rate}%</span>
                    </div>
                    <p><strong>Total Visits:</strong> {canvasser.total_visits}</p>
                    <p><strong>Leads Generated:</strong> {canvasser.leads_generated}</p>
                  </div>
                  {canvasser.assigned_territories && canvasser.assigned_territories.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-3 h-3 text-blue-400" />
                      <div className="flex flex-wrap gap-1">
                        {canvasser.assigned_territories.map((territory) => (
                          <Badge key={territory} variant="outline" className="text-xs border-blue-600 text-blue-400">
                            {territory}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(canvasser)}
                    className="text-blue-400 border-blue-700 hover:bg-blue-900"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(canvasser.id)}
                    className="text-red-400 hover:text-red-300 border-red-700 hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {canvassers.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No canvassers found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
