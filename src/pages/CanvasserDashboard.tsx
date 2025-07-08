
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Clock, Calendar, MapPin, RefreshCw, LogIn } from "lucide-react";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";
import { TimeTracker } from "@/components/canvasser/TimeTracker";
import { DailySchedule } from "@/components/canvasser/DailySchedule";
import { ActivityLogger } from "@/components/canvasser/ActivityLogger";
import { TimeTracking } from "@/components/canvasser/TimeTracking";
import { LeadEntry } from "@/components/canvasser/LeadEntry";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const CanvasserDashboard = () => {
  const { canvasser, signOut, isLoading } = useCanvasserAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !canvasser) {
      navigate('/canvasser-auth');
    }
  }, [canvasser, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/canvasser-auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      window.location.reload();
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh Error",
        description: "There was an error refreshing the dashboard.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-white mb-4">Loading dashboard...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!canvasser) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">Please sign in to access your canvasser dashboard.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/canvasser-auth')}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-900 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900 border-b border-blue-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{canvasser.name}</h1>
              <p className="text-gray-400 text-sm">{canvasser.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2 border-gray-600 text-gray-400 hover:bg-gray-800"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-blue-600 text-blue-400 hover:bg-blue-900"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-gray-900 border-blue-800 mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Your Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-blue-400 text-2xl font-bold">{canvasser.total_visits || 0}</div>
                <div className="text-gray-400 text-sm">Total Visits</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-green-400 text-2xl font-bold">{canvasser.leads_generated || 0}</div>
                <div className="text-gray-400 text-sm">Leads Generated</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <div className="text-yellow-400 text-2xl font-bold">{canvasser.conversion_rate || 0}%</div>
                <div className="text-gray-400 text-sm">Conversion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="clock" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border-blue-800">
            <TabsTrigger 
              value="clock" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">Clock</span>
            </TabsTrigger>
            <TabsTrigger 
              value="leads" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Add Lead</span>
              <span className="sm:hidden">Leads</span>
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clock">
            <TimeTracking />
          </TabsContent>

          <TabsContent value="leads">
            <LeadEntry />
          </TabsContent>

          <TabsContent value="schedule">
            <DailySchedule />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogger />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CanvasserDashboard;
