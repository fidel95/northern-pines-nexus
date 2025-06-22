
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  salesperson_id: string | null;
  created_at: string;
}

interface Salesperson {
  id: string;
  name: string;
  email: string;
}

export const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    salesperson_id: ''
  });

  const fetchData = async () => {
    try {
      const [leadsRes, salespeopleRes] = await Promise.all([
        supabase.from('leads').select('*').order('created_at', { ascending: false }),
        supabase.from('salespeople').select('id, name, email').eq('active', true)
      ]);

      if (leadsRes.error) throw leadsRes.error;
      if (salespeopleRes.error) throw salespeopleRes.error;

      setLeads(leadsRes.data || []);
      setSalespeople(salespeopleRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch leads",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addLead = async () => {
    if (!newLead.name || !newLead.email || !newLead.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (Name, Email, Message)",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          ...newLead,
          salesperson_id: newLead.salesperson_id || null,
          status: 'New'
        }]);

      if (error) throw error;

      await fetchData();
      setNewLead({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        salesperson_id: ''
      });
      setIsAddDialogOpen(false);
      
      toast({
        title: "Lead Added",
        description: "New lead has been added successfully",
      });
    } catch (error) {
      console.error('Error adding lead:', error);
      toast({
        title: "Error",
        description: "Failed to add lead",
        variant: "destructive"
      });
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Lead Updated",
        description: `Lead status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: "Error",
        description: "Failed to update lead",
        variant: "destructive"
      });
    }
  };

  const assignSalesperson = async (leadId: string, salespersonId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ salesperson_id: salespersonId || null, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Lead Updated",
        description: "Salesperson assignment updated",
      });
    } catch (error) {
      console.error('Error assigning salesperson:', error);
      toast({
        title: "Error",
        description: "Failed to assign salesperson",
        variant: "destructive"
      });
    }
  };

  const deleteLead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Lead Deleted",
        description: "Lead has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast({
        title: "Error",
        description: "Failed to delete lead",
        variant: "destructive"
      });
    }
  };

  const getSalespersonName = (id: string | null) => {
    if (!id) return 'Unassigned';
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Unknown';
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.service && lead.service.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Quoted': return 'bg-purple-100 text-purple-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-white">Loading leads...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            Lead Management
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Lead</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                      <Input
                        id="name"
                        value={newLead.name}
                        onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                        placeholder="Enter full name"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-300">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newLead.email}
                        onChange={(e) => setNewLead({...newLead, email: e.target.value})}
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
                        value={newLead.phone}
                        onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                        placeholder="Enter phone number"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="service" className="text-gray-300">Service</Label>
                      <Select value={newLead.service} onValueChange={(value) => setNewLead({...newLead, service: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="Custom Home Building" className="text-white">Custom Home Building</SelectItem>
                          <SelectItem value="Commercial Construction" className="text-white">Commercial Construction</SelectItem>
                          <SelectItem value="Renovations & Remodeling" className="text-white">Renovations & Remodeling</SelectItem>
                          <SelectItem value="Interior Finishing" className="text-white">Interior Finishing</SelectItem>
                          <SelectItem value="General Contracting" className="text-white">General Contracting</SelectItem>
                          <SelectItem value="Sustainable Building" className="text-white">Sustainable Building</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="salesperson" className="text-gray-300">Assign Salesperson</Label>
                    <Select value={newLead.salesperson_id} onValueChange={(value) => setNewLead({...newLead, salesperson_id: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select salesperson" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="" className="text-white">No assignment</SelectItem>
                        {salespeople.map((salesperson) => (
                          <SelectItem key={salesperson.id} value={salesperson.id} className="text-white">
                            {salesperson.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-gray-300">Message *</Label>
                    <Textarea
                      id="message"
                      value={newLead.message}
                      onChange={(e) => setNewLead({...newLead, message: e.target.value})}
                      placeholder="Enter project details or message"
                      rows={4}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button onClick={addLead} className="bg-black hover:bg-gray-700">
                      Add Lead
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-gray-700 border-gray-600 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Status</SelectItem>
                <SelectItem value="New" className="text-white">New</SelectItem>
                <SelectItem value="Contacted" className="text-white">Contacted</SelectItem>
                <SelectItem value="Quoted" className="text-white">Quoted</SelectItem>
                <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                <SelectItem value="Completed" className="text-white">Completed</SelectItem>
                <SelectItem value="Lost" className="text-white">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-white">{lead.name}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                      <p><strong>Email:</strong> {lead.email}</p>
                      <p><strong>Phone:</strong> {lead.phone || 'N/A'}</p>
                      <p><strong>Service:</strong> {lead.service || 'N/A'}</p>
                      <p><strong>Salesperson:</strong> {getSalespersonName(lead.salesperson_id)}</p>
                      <p><strong>Date:</strong> {new Date(lead.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>Message:</strong> {lead.message}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Select onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                      <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="New" className="text-white">New</SelectItem>
                        <SelectItem value="Contacted" className="text-white">Contacted</SelectItem>
                        <SelectItem value="Quoted" className="text-white">Quoted</SelectItem>
                        <SelectItem value="In Progress" className="text-white">In Progress</SelectItem>
                        <SelectItem value="Completed" className="text-white">Completed</SelectItem>
                        <SelectItem value="Lost" className="text-white">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => assignSalesperson(lead.id, value)}>
                      <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        <SelectItem value="" className="text-white">Unassign</SelectItem>
                        {salespeople.map((salesperson) => (
                          <SelectItem key={salesperson.id} value={salesperson.id} className="text-white">
                            {salesperson.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        onClick={() => deleteLead(lead.id)}
                        className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No leads found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
