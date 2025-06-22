import { useState, useEffect } from "react";
import { Plus, MapPin, Calendar, Filter, Eye } from "lucide-react";
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

interface CanvassingActivity {
  id: string;
  canvasser_id: string;
  visit_date: string;
  address: string;
  zip_code: string | null;
  result: string;
  notes: string | null;
  requires_followup: boolean | null;
  followup_priority: number | null;
  created_at: string;
}

interface Canvasser {
  id: string;
  name: string;
  email: string;
}

export const CanvassingActivitiesManager = () => {
  const [activities, setActivities] = useState<CanvassingActivity[]>([]);
  const [canvassers, setCanvassers] = useState<Canvasser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCanvasser, setSelectedCanvasser] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [formData, setFormData] = useState({
    canvasser_id: '',
    address: '',
    zip_code: '',
    result: '',
    notes: '',
    requires_followup: false,
    followup_priority: 1,
    visit_date: ''
  });

  const resultOptions = ['Not Interested', 'Maybe', 'Call Back', 'Interested'];

  const fetchData = async () => {
    try {
      const [activitiesRes, canvassersRes] = await Promise.all([
        supabase.from('canvassing_activities').select('*').order('visit_date', { ascending: false }),
        supabase.from('canvassers').select('id, name, email').eq('active', true)
      ]);

      if (activitiesRes.error) throw activitiesRes.error;
      if (canvassersRes.error) throw canvassersRes.error;

      setActivities(activitiesRes.data || []);
      setCanvassers(canvassersRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch canvassing activities",
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
      canvasser_id: '',
      address: '',
      zip_code: '',
      result: '',
      notes: '',
      requires_followup: false,
      followup_priority: 1,
      visit_date: ''
    });
  };

  const updateCanvasserStats = async (canvasserId: string) => {
    try {
      // Get total visits for this canvasser
      const { data: activities, error: activitiesError } = await supabase
        .from('canvassing_activities')
        .select('result')
        .eq('canvasser_id', canvasserId);

      if (activitiesError) throw activitiesError;

      const totalVisits = activities?.length || 0;
      const leadsGenerated = activities?.filter(activity => 
        activity.result === 'Interested' || activity.result === 'Call Back'
      ).length || 0;
      const conversionRate = totalVisits > 0 ? (leadsGenerated / totalVisits) * 100 : 0;

      // Update canvasser stats
      const { error: updateError } = await supabase
        .from('canvassers')
        .update({
          total_visits: totalVisits,
          leads_generated: leadsGenerated,
          conversion_rate: conversionRate
        })
        .eq('id', canvasserId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating canvasser stats:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.canvasser_id || !formData.address || !formData.result) {
      toast({
        title: "Error",
        description: "Canvasser, address, and result are required",
        variant: "destructive"
      });
      return;
    }

    try {
      const activityData = {
        canvasser_id: formData.canvasser_id,
        address: formData.address,
        zip_code: formData.zip_code || null,
        result: formData.result,
        notes: formData.notes || null,
        requires_followup: formData.requires_followup,
        followup_priority: formData.followup_priority,
        visit_date: formData.visit_date ? new Date(formData.visit_date).toISOString() : new Date().toISOString()
      };

      const { error } = await supabase
        .from('canvassing_activities')
        .insert([activityData]);

      if (error) throw error;

      // Update canvasser stats
      await updateCanvasserStats(formData.canvasser_id);

      await fetchData();
      resetForm();
      setIsDialogOpen(false);
      
      toast({
        title: "Activity Added",
        description: "Canvassing activity has been logged successfully",
      });
    } catch (error: any) {
      console.error('Error saving activity:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save activity",
        variant: "destructive"
      });
    }
  };

  const getCanvasserName = (id: string) => {
    const canvasser = canvassers.find(c => c.id === id);
    return canvasser ? canvasser.name : 'Unknown';
  };

  const getResultColor = (result: string) => {
    switch (result) {
      case 'Interested': return 'bg-green-600';
      case 'Maybe': return 'bg-yellow-600';
      case 'Call Back': return 'bg-blue-600';
      case 'Not Interested': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesCanvasser = selectedCanvasser === 'all' || activity.canvasser_id === selectedCanvasser;
    const matchesResult = resultFilter === 'all' || activity.result === resultFilter;
    return matchesCanvasser && matchesResult;
  });

  if (loading) {
    return <div className="text-center py-8 text-white">Loading activities...</div>;
  }

  return (
    <Card className="bg-gray-900 border-blue-800 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-400" />
            Canvassing Activities
          </div>
          <div className="flex gap-2">
            <Select value={selectedCanvasser} onValueChange={setSelectedCanvasser}>
              <SelectTrigger className="w-48 bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Filter by canvasser" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="all" className="text-white">All Canvassers</SelectItem>
                {canvassers.map((canvasser) => (
                  <SelectItem key={canvasser.id} value={canvasser.id} className="text-white">
                    {canvasser.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-40 bg-gray-800 border-blue-700 text-white">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by result" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="all" className="text-white">All Results</SelectItem>
                {resultOptions.map((result) => (
                  <SelectItem key={result} value={result} className="text-white">
                    {result}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Log Activity
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-blue-800 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-white">Log Canvassing Activity</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="canvasser" className="text-gray-300">Canvasser *</Label>
                      <Select value={formData.canvasser_id} onValueChange={(value) => setFormData({...formData, canvasser_id: value})}>
                        <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                          <SelectValue placeholder="Select canvasser" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-blue-700">
                          {canvassers.map((canvasser) => (
                            <SelectItem key={canvasser.id} value={canvasser.id} className="text-white">
                              {canvasser.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="visit_date" className="text-gray-300">Visit Date</Label>
                      <Input
                        id="visit_date"
                        type="datetime-local"
                        value={formData.visit_date}
                        onChange={(e) => setFormData({...formData, visit_date: e.target.value})}
                        className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address" className="text-gray-300">Address *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        placeholder="Enter full address"
                        className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code" className="text-gray-300">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                        placeholder="Enter ZIP code"
                        className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="result" className="text-gray-300">Result *</Label>
                    <Select value={formData.result} onValueChange={(value) => setFormData({...formData, result: value})}>
                      <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-blue-700">
                        {resultOptions.map((result) => (
                          <SelectItem key={result} value={result} className="text-white">
                            {result}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gray-300">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Additional notes about the visit"
                      rows={3}
                      className="bg-gray-800 border-blue-700 text-white focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="requires_followup"
                      checked={formData.requires_followup}
                      onChange={(e) => setFormData({...formData, requires_followup: e.target.checked})}
                      className="rounded border-blue-700"
                    />
                    <Label htmlFor="requires_followup" className="text-gray-300">Requires Follow-up</Label>
                  </div>
                  {formData.requires_followup && (
                    <div>
                      <Label htmlFor="followup_priority" className="text-gray-300">Follow-up Priority</Label>
                      <Select value={formData.followup_priority.toString()} onValueChange={(value) => setFormData({...formData, followup_priority: parseInt(value)})}>
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
                  )}
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-blue-700 text-gray-300 hover:bg-gray-800">
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                      Log Activity
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
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="border border-blue-800 rounded-lg p-4 bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <h3 className="font-semibold text-white">{activity.address}</h3>
                    <Badge className={`${getResultColor(activity.result)} text-white`}>
                      {activity.result}
                    </Badge>
                    {activity.requires_followup && (
                      <Badge variant="outline" className="border-yellow-600 text-yellow-400">
                        Follow-up Required
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-300">
                    <p><strong>Canvasser:</strong> {getCanvasserName(activity.canvasser_id)}</p>
                    <p><strong>ZIP Code:</strong> {activity.zip_code || 'N/A'}</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span><strong>Date:</strong> {format(new Date(activity.visit_date), 'MMM dd, yyyy HH:mm')}</span>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-sm text-gray-300 mt-2">
                      <strong>Notes:</strong> {activity.notes}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-blue-400 border-blue-700 hover:bg-blue-900"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredActivities.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No activities found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
