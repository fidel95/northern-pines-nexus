
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, Square, History } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";
import { format } from "date-fns";

interface TimeEntry {
  id: string;
  clock_in: string;
  clock_out: string | null;
  total_hours: number | null;
  notes: string | null;
}

export const TimeTracker = () => {
  const { canvasser } = useCanvasserAuth();
  const [isWorking, setIsWorking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second when working
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorking) {
      interval = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorking]);

  const fetchTimeEntries = async () => {
    if (!canvasser) return;

    try {
      const { data, error } = await supabase
        .from('time_entries' as any)
        .select('*')
        .eq('canvasser_id', canvasser.id)
        .order('clock_in', { ascending: false })
        .limit(10);

      if (error) throw error;

      const timeEntries = (data || []) as TimeEntry[];
      setRecentEntries(timeEntries);
      
      // Check if there's an active session
      const activeEntry = timeEntries.find(entry => !entry.clock_out);
      if (activeEntry) {
        setCurrentEntry(activeEntry);
        setIsWorking(true);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  useEffect(() => {
    fetchTimeEntries();
  }, [canvasser]);

  const clockIn = async () => {
    if (!canvasser) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('time_entries' as any)
        .insert([{
          canvasser_id: canvasser.id,
          clock_in: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const newEntry = data as TimeEntry;
      setCurrentEntry(newEntry);
      setIsWorking(true);
      await fetchTimeEntries();
      
      toast({
        title: "Clocked In",
        description: "Your work session has started",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clock in",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clockOut = async () => {
    if (!currentEntry) return;
    
    setLoading(true);
    try {
      const clockOutTime = new Date();
      const clockInTime = new Date(currentEntry.clock_in);
      const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

      const { error } = await supabase
        .from('time_entries' as any)
        .update({
          clock_out: clockOutTime.toISOString(),
          total_hours: Math.round(totalHours * 100) / 100
        })
        .eq('id', currentEntry.id);

      if (error) throw error;

      setCurrentEntry(null);
      setIsWorking(false);
      await fetchTimeEntries();
      
      toast({
        title: "Clocked Out",
        description: `Work session ended. Total: ${Math.round(totalHours * 100) / 100} hours`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clock out",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentSessionTime = () => {
    if (!currentEntry) return "00:00:00";
    
    const clockIn = new Date(currentEntry.clock_in);
    const diff = currentTime.getTime() - clockIn.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5 text-blue-400" />
            Time Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {isWorking && (
              <div className="bg-blue-900 p-4 rounded-lg">
                <p className="text-blue-300 text-sm">Current Session</p>
                <p className="text-2xl font-mono text-white">{getCurrentSessionTime()}</p>
                <Badge className="bg-green-600 text-white mt-2">Active</Badge>
              </div>
            )}
            
            <div className="flex justify-center gap-4">
              {!isWorking ? (
                <Button
                  onClick={clockIn}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Clock In
                </Button>
              ) : (
                <Button
                  onClick={clockOut}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Clock Out
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <History className="w-5 h-5 text-blue-400" />
            Recent Time Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {format(new Date(entry.clock_in), 'MMM dd, yyyy')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {format(new Date(entry.clock_in), 'HH:mm')} - {entry.clock_out ? format(new Date(entry.clock_out), 'HH:mm') : 'Active'}
                  </p>
                </div>
                <div className="text-right">
                  {entry.total_hours ? (
                    <Badge className="bg-blue-600 text-white">
                      {entry.total_hours}h
                    </Badge>
                  ) : (
                    <Badge className="bg-green-600 text-white">
                      Active
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {recentEntries.length === 0 && (
              <p className="text-gray-400 text-center py-4">No time entries yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
