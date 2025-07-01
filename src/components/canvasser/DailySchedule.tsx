
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, MapPin, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";
import { format } from "date-fns";

interface ScheduleItem {
  id: string;
  address: string;
  zip_code: string | null;
  status: 'pending' | 'completed' | 'skipped';
  completion_time: string | null;
  notes: string | null;
}

export const DailySchedule = () => {
  const { canvasser } = useCanvasserAuth();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSchedule = async () => {
    if (!canvasser) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('daily_schedules' as any)
        .select('*')
        .eq('canvasser_id', canvasser.id)
        .eq('assigned_date', today)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching schedule:', error);
        return;
      }
      
      // Handle case where table doesn't exist yet
      if (data) {
        setScheduleItems(data as unknown as ScheduleItem[]);
      } else {
        setScheduleItems([]);
      }
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setScheduleItems([]);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, [canvasser]);

  const updateScheduleItem = async (itemId: string, status: 'completed' | 'skipped', notes: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('daily_schedules' as any)
        .update({
          status,
          completion_time: new Date().toISOString(),
          notes: notes || null
        })
        .eq('id', itemId);

      if (error) throw error;

      await fetchSchedule();
      setSelectedItem(null);
      setNotes("");
      
      toast({
        title: "Schedule Updated",
        description: `Address marked as ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update schedule",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'skipped': return 'bg-red-600';
      default: return 'bg-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'skipped': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const completedCount = scheduleItems.filter(item => item.status === 'completed').length;
  const totalCount = scheduleItems.length;

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-400" />
              Today's Schedule
            </div>
            <Badge className="bg-blue-600 text-white">
              {completedCount}/{totalCount} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduleItems.map((item) => (
              <div key={item.id} className="border border-blue-800 rounded-lg p-4 bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      <h3 className="font-medium text-white">{item.address}</h3>
                      <Badge className={`${getStatusColor(item.status)} text-white`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </Badge>
                    </div>
                    {item.zip_code && (
                      <p className="text-gray-400 text-sm">ZIP: {item.zip_code}</p>
                    )}
                    {item.notes && (
                      <p className="text-gray-300 text-sm mt-2">
                        <strong>Notes:</strong> {item.notes}
                      </p>
                    )}
                    {item.completion_time && (
                      <p className="text-gray-400 text-sm">
                        Completed: {format(new Date(item.completion_time), 'HH:mm')}
                      </p>
                    )}
                  </div>
                  {item.status === 'pending' && (
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setSelectedItem(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Update
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {scheduleItems.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No addresses assigned for today.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedItem && (
        <Card className="bg-gray-900 border-blue-800">
          <CardHeader>
            <CardTitle className="text-white">Update: {selectedItem.address}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this visit..."
                className="bg-gray-800 border-blue-700 text-white"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => updateScheduleItem(selectedItem.id, 'completed', notes)}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Completed
              </Button>
              <Button
                onClick={() => updateScheduleItem(selectedItem.id, 'skipped', notes)}
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Mark Skipped
              </Button>
              <Button
                onClick={() => {
                  setSelectedItem(null);
                  setNotes("");
                }}
                variant="outline"
                className="border-blue-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
