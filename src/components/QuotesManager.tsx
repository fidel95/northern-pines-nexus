
import { useState, useEffect } from "react";
import { Plus, FileText, Edit, Trash2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Quote {
  id: string;
  lead_id: string | null;
  client_name: string;
  service_type: string;
  estimated_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const QuotesManager = () => {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    client_name: '',
    service_type: '',
    estimated_amount: 0,
    status: 'pending',
    notes: ''
  });

  const serviceTypes = [
    'Custom Home Building',
    'Commercial Construction',
    'Renovations & Remodeling',
    'Interior Finishing',
    'General Contracting',
    'Sustainable Building'
  ];

  const statusOptions = [
    'pending',
    'approved',
    'rejected',
    'in_review'
  ];

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch quotes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const resetForm = () => {
    setFormData({
      client_name: '',
      service_type: '',
      estimated_amount: 0,
      status: 'pending',
      notes: ''
    });
    setEditingQuote(null);
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setFormData({
      client_name: quote.client_name,
      service_type: quote.service_type,
      estimated_amount: quote.estimated_amount,
      status: quote.status,
      notes: quote.notes || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_name || !formData.service_type || formData.estimated_amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingQuote) {
        const { error } = await supabase
          .from('quotes')
          .update({
            client_name: formData.client_name,
            service_type: formData.service_type,
            estimated_amount: formData.estimated_amount,
            status: formData.status,
            notes: formData.notes || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingQuote.id);

        if (error) throw error;
        toast({
          title: "Quote Updated",
          description: "Quote has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('quotes')
          .insert([{
            client_name: formData.client_name,
            service_type: formData.service_type,
            estimated_amount: formData.estimated_amount,
            status: formData.status,
            notes: formData.notes || null
          }]);

        if (error) throw error;
        toast({
          title: "Quote Added",
          description: "New quote has been added successfully",
        });
      }

      await fetchQuotes();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save quote",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchQuotes();
      toast({
        title: "Quote Deleted",
        description: "Quote has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting quote:', error);
      toast({
        title: "Error",
        description: "Failed to delete quote",
        variant: "destructive"
      });
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('quotes')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      await fetchQuotes();
      toast({
        title: "Quote Updated",
        description: `Quote status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating quote status:', error);
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingQuotes = quotes.filter(quote => quote.status === 'pending');

  if (loading) {
    return <div className="text-center py-8 text-white">Loading quotes...</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Quotes Management
            <Badge className="bg-yellow-600 text-white ml-2">
              {pendingQuotes.length} Pending
            </Badge>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Quote
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingQuote ? 'Edit Quote' : 'Add New Quote'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client_name" className="text-gray-300">Client Name *</Label>
                    <Input
                      id="client_name"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      placeholder="Enter client name"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="service_type" className="text-gray-300">Service Type *</Label>
                    <Select value={formData.service_type} onValueChange={(value) => setFormData({...formData, service_type: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {serviceTypes.map((service) => (
                          <SelectItem key={service} value={service} className="text-white">
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimated_amount" className="text-gray-300">Estimated Amount *</Label>
                    <Input
                      id="estimated_amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.estimated_amount}
                      onChange={(e) => setFormData({...formData, estimated_amount: parseFloat(e.target.value) || 0})}
                      placeholder="Enter estimated amount"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-gray-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-700 border-gray-600">
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status} className="text-white">
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Enter additional notes"
                    rows={3}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-black hover:bg-gray-700">
                    {editingQuote ? 'Update' : 'Add'} Quote
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-white">{quote.client_name}</h3>
                    <Badge className={getStatusColor(quote.status)}>
                      {quote.status.charAt(0).toUpperCase() + quote.status.slice(1).replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <p><strong>Service:</strong> {quote.service_type}</p>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      <span><strong>Amount:</strong> ${quote.estimated_amount.toLocaleString()}</span>
                    </div>
                    <p><strong>Created:</strong> {new Date(quote.created_at).toLocaleDateString()}</p>
                    <p><strong>Updated:</strong> {new Date(quote.updated_at).toLocaleDateString()}</p>
                  </div>
                  {quote.notes && (
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>Notes:</strong> {quote.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Select onValueChange={(value) => updateQuoteStatus(quote.id, value)}>
                    <SelectTrigger className="w-32 bg-gray-600 border-gray-500 text-white">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-white">
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(quote)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(quote.id)}
                    className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {quotes.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No quotes found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
