
import { useState, useEffect } from "react";
import { Plus, Trash2, User, Edit, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Salesperson {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  job_types: string[] | null;
  commission_percentage: number;
  total_profit: number;
  total_sales: number;
  active: boolean;
  created_at: string;
}

const jobTypeOptions = [
  'Custom Home Building',
  'Commercial Construction',
  'Renovations & Remodeling',
  'Interior Finishing',
  'General Contracting',
  'Sustainable Building'
];

export const SalespeopleManager = () => {
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSalesperson, setEditingSalesperson] = useState<Salesperson | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    job_types: [] as string[],
    commission_percentage: 0
  });

  const fetchSalespeople = async () => {
    try {
      const { data, error } = await supabase
        .from('salespeople')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSalespeople(data || []);
    } catch (error) {
      console.error('Error fetching salespeople:', error);
      toast({
        title: "Error",
        description: "Failed to fetch salespeople",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalespeople();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      job_types: [],
      commission_percentage: 0
    });
    setEditingSalesperson(null);
  };

  const handleEdit = (salesperson: Salesperson) => {
    setEditingSalesperson(salesperson);
    setFormData({
      name: salesperson.name,
      email: salesperson.email,
      phone: salesperson.phone || '',
      job_types: salesperson.job_types || [],
      commission_percentage: salesperson.commission_percentage
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
      if (editingSalesperson) {
        const { error } = await supabase
          .from('salespeople')
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            job_types: formData.job_types,
            commission_percentage: formData.commission_percentage,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSalesperson.id);

        if (error) throw error;
        toast({
          title: "Salesperson Updated",
          description: "Salesperson has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('salespeople')
          .insert([{
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            job_types: formData.job_types,
            commission_percentage: formData.commission_percentage
          }]);

        if (error) throw error;
        toast({
          title: "Salesperson Added",
          description: "New salesperson has been added successfully",
        });
      }

      await fetchSalespeople();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving salesperson:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save salesperson",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('salespeople')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSalespeople();
      toast({
        title: "Salesperson Deleted",
        description: "Salesperson has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting salesperson:', error);
      toast({
        title: "Error",
        description: "Failed to delete salesperson",
        variant: "destructive"
      });
    }
  };

  const toggleJobType = (jobType: string) => {
    setFormData(prev => ({
      ...prev,
      job_types: prev.job_types.includes(jobType)
        ? prev.job_types.filter(type => type !== jobType)
        : [...prev.job_types, jobType]
    }));
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading salespeople...</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Salespeople Management
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Salesperson
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingSalesperson ? 'Edit Salesperson' : 'Add New Salesperson'}
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
                      className="bg-gray-700 border-gray-600 text-white"
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
                      className="bg-gray-700 border-gray-600 text-white"
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
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="commission" className="text-gray-300">Commission %</Label>
                    <Input
                      id="commission"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.commission_percentage}
                      onChange={(e) => setFormData({...formData, commission_percentage: parseFloat(e.target.value) || 0})}
                      placeholder="Enter commission percentage"
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">Job Types</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {jobTypeOptions.map((jobType) => (
                      <Button
                        key={jobType}
                        type="button"
                        variant={formData.job_types.includes(jobType) ? "default" : "outline"}
                        className={`text-xs ${formData.job_types.includes(jobType) 
                          ? 'bg-black text-white' 
                          : 'bg-gray-700 text-gray-300 border-gray-600'}`}
                        onClick={() => toggleJobType(jobType)}
                      >
                        {jobType}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black hover:bg-gray-700">
                    {editingSalesperson ? 'Update' : 'Add'} Salesperson
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {salespeople.map((salesperson) => (
            <div key={salesperson.id} className="flex items-center justify-between p-4 border border-gray-600 rounded-lg bg-gray-700">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-white">{salesperson.name}</h3>
                  <Badge className="bg-black text-white">
                    {salesperson.commission_percentage}% Commission
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                  <p><strong>Email:</strong> {salesperson.email}</p>
                  <p><strong>Phone:</strong> {salesperson.phone || 'N/A'}</p>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span><strong>Sales:</strong> ${salesperson.total_sales.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    <span><strong>Profit:</strong> ${salesperson.total_profit.toLocaleString()}</span>
                  </div>
                </div>
                {salesperson.job_types && salesperson.job_types.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {salesperson.job_types.map((jobType) => (
                      <Badge key={jobType} variant="outline" className="text-xs border-gray-500 text-gray-300">
                        {jobType}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(salesperson)}
                  className="text-gray-300 border-gray-600 hover:bg-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDelete(salesperson.id)}
                  className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        {salespeople.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No salespeople found.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
