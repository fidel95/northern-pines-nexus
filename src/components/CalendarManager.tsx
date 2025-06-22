
import { useState, useEffect } from "react";
import { Plus, Calendar as CalendarIcon, Edit, Trash2, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  salesperson_id: string | null;
  lead_id: string | null;
  created_at: string;
}

interface Salesperson {
  id: string;
  name: string;
  email: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
}

export const CalendarManager = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    salesperson_id: '',
    lead_id: ''
  });

  const fetchData = async () => {
    try {
      const [eventsRes, salespeopleRes, leadsRes] = await Promise.all([
        supabase.from('calendar_events').select('*').order('start_time', { ascending: true }),
        supabase.from('salespeople').select('id, name, email').eq('active', true),
        supabase.from('leads').select('id, name, email')
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (salespeopleRes.error) throw salespeopleRes.error;
      if (leadsRes.error) throw leadsRes.error;

      setEvents(eventsRes.data || []);
      setSalespeople(salespeopleRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      salesperson_id: '',
      lead_id: ''
    });
    setEditingEvent(null);
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    const startDate = new Date(event.start_time);
    const endDate = new Date(event.end_time);
    
    setFormData({
      title: event.title,
      description: event.description || '',
      start_date: format(startDate, 'yyyy-MM-dd'),
      start_time: format(startDate, 'HH:mm'),
      end_date: format(endDate, 'yyyy-MM-dd'),
      end_time: format(endDate, 'HH:mm'),
      salesperson_id: event.salesperson_id || '',
      lead_id: event.lead_id || ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.start_date || !formData.start_time || !formData.end_date || !formData.end_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

    if (endDateTime <= startDateTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    try {
      const eventData = {
        title: formData.title,
        description: formData.description || null,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        salesperson_id: formData.salesperson_id || null,
        lead_id: formData.lead_id || null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('calendar_events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast({
          title: "Event Updated",
          description: "Calendar event has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('calendar_events')
          .insert([eventData]);

        if (error) throw error;
        toast({
          title: "Event Added",
          description: "New calendar event has been added successfully",
        });
      }

      await fetchData();
      resetForm();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save event",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Event Deleted",
        description: "Calendar event has been removed successfully",
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive"
      });
    }
  };

  const getSalespersonName = (id: string | null) => {
    if (!id) return 'Unassigned';
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Unknown';
  };

  const getLeadName = (id: string | null) => {
    if (!id) return 'No lead assigned';
    const lead = leads.find(l => l.id === id);
    return lead ? lead.name : 'Unknown';
  };

  const filteredEvents = selectedSalesperson === 'all' 
    ? events 
    : events.filter(event => event.salesperson_id === selectedSalesperson);

  if (loading) {
    return <div className="text-center py-8 text-white">Loading calendar...</div>;
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Calendar Management
          </div>
          <div className="flex gap-2">
            <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Filter by salesperson" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="all" className="text-white">All Salespeople</SelectItem>
                {salespeople.map((salesperson) => (
                  <SelectItem key={salesperson.id} value={salesperson.id} className="text-white">
                    {salesperson.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-black hover:bg-gray-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">
                    {editingEvent ? 'Edit Event' : 'Add New Event'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter event title"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter event description"
                      rows={3}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date" className="text-gray-300">Start Date *</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="start_time" className="text-gray-300">Start Time *</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="end_date" className="text-gray-300">End Date *</Label>
                      <Input
                        id="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="end_time" className="text-gray-300">End Time *</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                        className="bg-gray-700 border-gray-600 text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salesperson" className="text-gray-300">Salesperson</Label>
                      <Select value={formData.salesperson_id} onValueChange={(value) => setFormData({...formData, salesperson_id: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select salesperson" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="" className="text-white">No salesperson</SelectItem>
                          {salespeople.map((salesperson) => (
                            <SelectItem key={salesperson.id} value={salesperson.id} className="text-white">
                              {salesperson.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lead" className="text-gray-300">Related Lead</Label>
                      <Select value={formData.lead_id} onValueChange={(value) => setFormData({...formData, lead_id: value})}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select lead" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="" className="text-white">No lead</SelectItem>
                          {leads.map((lead) => (
                            <SelectItem key={lead.id} value={lead.id} className="text-white">
                              {lead.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-gray-600 text-gray-300">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-black hover:bg-gray-700">
                      {editingEvent ? 'Update' : 'Add'} Event
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{event.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span><strong>Start:</strong> {format(new Date(event.start_time), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span><strong>End:</strong> {format(new Date(event.end_time), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span><strong>Salesperson:</strong> {getSalespersonName(event.salesperson_id)}</span>
                    </div>
                    <p><strong>Lead:</strong> {getLeadName(event.lead_id)}</p>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>Description:</strong> {event.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(event)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(event.id)}
                    className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-gray-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No events found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
