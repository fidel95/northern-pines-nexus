
import { useState, useEffect } from "react";
import { Plus, CheckCircle, Circle, Calendar, User, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Task {
  id: string;
  salesperson_id: string;
  lead_id: string | null;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean | null;
  priority: number | null;
  created_at: string;
  updated_at: string;
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

export const TasksManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [salespeople, setSalespeople] = useState<Salesperson[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSalesperson, setSelectedSalesperson] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    salesperson_id: '',
    lead_id: '',
    title: '',
    description: '',
    due_date: '',
    priority: 1
  });

  const fetchData = async () => {
    try {
      const [tasksRes, salespeopleRes, leadsRes] = await Promise.all([
        supabase.from('tasks').select('*').order('due_date', { ascending: true }),
        supabase.from('salespeople').select('id, name, email').eq('active', true),
        supabase.from('leads').select('id, name, email')
      ]);

      if (tasksRes.error) throw tasksRes.error;
      if (salespeopleRes.error) throw salespeopleRes.error;
      if (leadsRes.error) throw leadsRes.error;

      setTasks(tasksRes.data || []);
      setSalespeople(salespeopleRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
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
      salesperson_id: '',
      lead_id: '',
      title: '',
      description: '',
      due_date: '',
      priority: 1
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.salesperson_id || !formData.title) {
      toast({
        title: "Error",
        description: "Salesperson and title are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const taskData = {
        salesperson_id: formData.salesperson_id,
        lead_id: formData.lead_id || null,
        title: formData.title,
        description: formData.description || null,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        priority: formData.priority,
        completed: false
      };

      const { error } = await supabase
        .from('tasks')
        .insert([taskData]);

      if (error) throw error;

      await fetchData();
      resetForm();
      setIsDialogOpen(false);
      
      toast({
        title: "Task Added",
        description: "New task has been created successfully",
      });
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save task",
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !completed,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchData();
      toast({
        title: "Task Updated",
        description: `Task marked as ${!completed ? 'completed' : 'pending'}`,
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    }
  };

  const getSalespersonName = (id: string) => {
    const salesperson = salespeople.find(s => s.id === id);
    return salesperson ? salesperson.name : 'Unknown';
  };

  const getLeadName = (id: string | null) => {
    if (!id) return 'No lead assigned';
    const lead = leads.find(l => l.id === id);
    return lead ? lead.name : 'Unknown';
  };

  const getPriorityColor = (priority: number | null) => {
    switch (priority) {
      case 3: return 'bg-red-600';
      case 2: return 'bg-yellow-600';
      case 1: return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityLabel = (priority: number | null) => {
    switch (priority) {
      case 3: return 'High';
      case 2: return 'Medium';
      case 1: return 'Low';
      default: return 'Low';
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSalesperson = selectedSalesperson === 'all' || task.salesperson_id === selectedSalesperson;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'pending' && !task.completed);
    return matchesSalesperson && matchesStatus;
  });

  if (loading) {
    return <div className="text-center py-8 text-white">Loading tasks...</div>;
  }

  return (
    <Card className="bg-gray-900 border-blue-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-400" />
            Task Management
          </div>
          <div className="flex gap-2">
            <Select value={selectedSalesperson} onValueChange={setSelectedSalesperson}>
              <SelectTrigger className="w-48 bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Filter by salesperson" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="all" className="text-white">All Salespeople</SelectItem>
                {salespeople.map((salesperson) => (
                  <SelectItem key={salesperson.id} value={salesperson.id} className="text-white">
                    {salesperson.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32 bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="all" className="text-white">All</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
                <SelectItem value="completed" className="text-white">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-blue-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="salesperson" className="text-gray-300">Assign to Salesperson *</Label>
                    <Select value={formData.salesperson_id} onValueChange={(value) => setFormData({...formData, salesperson_id: value})}>
                      <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                        <SelectValue placeholder="Select salesperson" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-blue-700">
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
                    <Select value={formData.lead_id} onValueChange={(value) => setFormData({...formData, lead_id: value === 'none' ? '' : value})}>
                      <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                        <SelectValue placeholder="Select lead" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-blue-700">
                        <SelectItem value="none" className="text-white">No lead</SelectItem>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id} className="text-white">
                            {lead.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="title" className="text-gray-300">Task Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Enter task title"
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-gray-300">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Enter task description"
                      rows={3}
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="due_date" className="text-gray-300">Due Date</Label>
                      <Input
                        id="due_date"
                        type="datetime-local"
                        value={formData.due_date}
                        onChange={(e) => setFormData({...formData, due_date: e.target.value})}
                        className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="priority" className="text-gray-300">Priority</Label>
                      <Select value={formData.priority.toString()} onValueChange={(value) => setFormData({...formData, priority: parseInt(value)})}>
                        <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-blue-700">
                          <SelectItem value="1" className="text-white">Low</SelectItem>
                          <SelectItem value="2" className="text-white">Medium</SelectItem>
                          <SelectItem value="3" className="text-white">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-blue-700 text-gray-300 hover:bg-gray-800">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Create Task
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
          {filteredTasks.map((task) => (
            <div key={task.id} className="border border-blue-800 rounded-lg p-4 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <button
                      onClick={() => toggleTaskCompletion(task.id, task.completed || false)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <h3 className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
                      {task.title}
                    </h3>
                    <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                    {task.completed && (
                      <Badge className="bg-green-600 text-white">Completed</Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 text-blue-400" />
                      <span><strong>Assigned to:</strong> {getSalespersonName(task.salesperson_id)}</span>
                    </div>
                    <p><strong>Lead:</strong> {getLeadName(task.lead_id)}</p>
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span><strong>Due:</strong> {format(new Date(task.due_date), 'MMM dd, yyyy HH:mm')}</span>
                        {new Date(task.due_date) < new Date() && !task.completed && (
                          <AlertTriangle className="w-3 h-3 text-red-400 ml-1" />
                        )}
                      </div>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>Description:</strong> {task.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredTasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No tasks found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
