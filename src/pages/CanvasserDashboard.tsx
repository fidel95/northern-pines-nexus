
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, User, Clock, Calendar, MapPin } from "lucide-react";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";
import { TimeTracker } from "@/components/canvasser/TimeTracker";
import { DailySchedule } from "@/components/canvasser/DailySchedule";
import { ActivityLogger } from "@/components/canvasser/ActivityLogger";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CanvasserDashboard = () => {
  const { canvasser, signOut, isLoading } = useCanvasserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !canvasser) {
      navigate('/canvasser-auth');
    }
  }, [canvasser, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!canvasser) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/canvasser-auth');
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900 border-b border-blue-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{canvasser.name}</h1>
              <p className="text-gray-400 text-sm">{canvasser.email}</p>
            </div>
          </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="time" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-900 border-blue-800">
            <TabsTrigger 
              value="time" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Time Tracking
            </TabsTrigger>
            <TabsTrigger 
              value="schedule" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Daily Schedule
            </TabsTrigger>
            <TabsTrigger 
              value="activity" 
              className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Log Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="time">
            <TimeTracker />
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
