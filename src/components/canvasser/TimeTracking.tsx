import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Play, Pause, Square } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

export const TimeTracking = () => {
  const [isWorking, setIsWorking] = useState(false);
  const [currentSession, setCurrentSession] = useState<TimeEntry | null>(null);
  const [totalHours, setTotalHours] = useState(0);
  const [todayHours, setTodayHours] = useState(0);

  useEffect(() => {
    // Load saved session from localStorage
    const savedSession = localStorage.getItem('canvasser-current-session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      setCurrentSession(session);
      setIsWorking(true);
    }

    // Load time totals
    const savedTotalHours = localStorage.getItem('canvasser-total-hours');
    const savedTodayHours = localStorage.getItem('canvasser-today-hours');
    
    if (savedTotalHours) setTotalHours(parseFloat(savedTotalHours));
    if (savedTodayHours) {
      const today = new Date().toDateString();
      const savedDate = localStorage.getItem('canvasser-today-date');
      if (savedDate === today) {
        setTodayHours(parseFloat(savedTodayHours));
      } else {
        // New day, reset today's hours
        setTodayHours(0);
        localStorage.setItem('canvasser-today-date', today);
        localStorage.setItem('canvasser-today-hours', '0');
      }
    }
  }, []);

  const startWork = () => {
    const session: TimeEntry = {
      id: Date.now().toString(),
      startTime: new Date()
    };
    
    setCurrentSession(session);
    setIsWorking(true);
    localStorage.setItem('canvasser-current-session', JSON.stringify(session));
    
    toast({
      title: "Work Started",
      description: "Time tracking has begun.",
    });
  };

  const endWork = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = (endTime.getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60 * 60); // hours
    
    const completedSession = {
      ...currentSession,
      endTime,
      duration
    };

    // Update totals
    const newTotalHours = totalHours + duration;
    const newTodayHours = todayHours + duration;
    
    setTotalHours(newTotalHours);
    setTodayHours(newTodayHours);
    setCurrentSession(null);
    setIsWorking(false);

    // Save to localStorage
    localStorage.setItem('canvasser-total-hours', newTotalHours.toString());
    localStorage.setItem('canvasser-today-hours', newTodayHours.toString());
    localStorage.setItem('canvasser-today-date', new Date().toDateString());
    localStorage.removeItem('canvasser-current-session');

    // Save completed session to history
    const sessions = JSON.parse(localStorage.getItem('canvasser-sessions') || '[]');
    sessions.push(completedSession);
    localStorage.setItem('canvasser-sessions', JSON.stringify(sessions));

    toast({
      title: "Work Ended",
      description: `Session duration: ${duration.toFixed(2)} hours`,
    });
  };

  const getCurrentDuration = () => {
    if (!currentSession || !isWorking) return 0;
    return (new Date().getTime() - new Date(currentSession.startTime).getTime()) / (1000 * 60 * 60);
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours % 1) * 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-blue-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Time Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-blue-400 text-2xl font-bold">{formatTime(todayHours)}</div>
              <div className="text-gray-400 text-sm">Today</div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <div className="text-green-400 text-2xl font-bold">{formatTime(totalHours)}</div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
          </div>

          {isWorking && currentSession && (
            <div className="bg-yellow-900/20 border border-yellow-600 p-4 rounded-lg">
              <div className="text-yellow-400 text-center">
                <div className="text-lg font-semibold">Currently Working</div>
                <div className="text-sm">Started: {new Date(currentSession.startTime).toLocaleTimeString()}</div>
                <div className="text-xl font-bold mt-2">{formatTime(getCurrentDuration())}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {!isWorking ? (
              <Button 
                onClick={startWork}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Work
              </Button>
            ) : (
              <Button 
                onClick={endWork}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <Square className="w-4 h-4 mr-2" />
                End Work
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};