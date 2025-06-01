
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  createdAt: string;
}

export const LeadsManager = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const storedLeads = JSON.parse(localStorage.getItem('leads') || '[]');
    setLeads(storedLeads);
  }, []);

  const saveLeads = (updatedLeads: Lead[]) => {
    localStorage.setItem('leads', JSON.stringify(updatedLeads));
    setLeads(updatedLeads);
  };

  const updateLeadStatus = (id: number, newStatus: string) => {
    const updatedLeads = leads.map(lead =>
      lead.id === id ? { ...lead, status: newStatus } : lead
    );
    saveLeads(updatedLeads);
    toast({
      title: "Lead Updated",
      description: `Lead status changed to ${newStatus}`,
    });
  };

  const deleteLead = (id: number) => {
    const updatedLeads = leads.filter(lead => lead.id !== id);
    saveLeads(updatedLeads);
    toast({
      title: "Lead Deleted",
      description: "Lead has been removed successfully",
    });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.service.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lead Management
            <Button className="bg-green-800 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Button>
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
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Quoted">Quoted</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{lead.name}</h3>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <p><strong>Email:</strong> {lead.email}</p>
                      <p><strong>Phone:</strong> {lead.phone}</p>
                      <p><strong>Service:</strong> {lead.service}</p>
                      <p><strong>Date:</strong> {new Date(lead.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Message:</strong> {lead.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Select onValueChange={(value) => updateLeadStatus(lead.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Contacted">Contacted</SelectItem>
                        <SelectItem value="Quoted">Quoted</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Lost">Lost</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteLead(lead.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLeads.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No leads found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
