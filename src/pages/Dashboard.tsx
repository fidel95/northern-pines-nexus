
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn, RefreshCw } from "lucide-react";
import { LeadsManager } from "@/components/LeadsManager";
import { InventoryManager } from "@/components/InventoryManager";
import { DashboardStats } from "@/components/DashboardStats";
import { AdminManager } from "@/components/AdminManager";
import { SalespeopleManager } from "@/components/SalespeopleManager";
import { QuotesManager } from "@/components/QuotesManager";
import { CalendarManager } from "@/components/CalendarManager";
import { TasksManager } from "@/components/TasksManager";
import { CanvassersManager } from "@/components/CanvassersManager";
import { CanvassingActivitiesManager } from "@/components/CanvassingActivitiesManager";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { FormSubmissionsManager } from "@/components/FormSubmissionsManager";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      navigate('/auth');
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
      // Trigger a page refresh to reload all data
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

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to access the dashboard.</p>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this dashboard.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In as Admin
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
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.email}</p>
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
              className="flex items-center gap-2 border-blue-600 text-blue-400 hover:bg-blue-900 shadow-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="grid w-full grid-cols-10 bg-gray-900 border-blue-800 shadow-lg">
            <TabsTrigger value="leads" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Leads</TabsTrigger>
            <TabsTrigger value="submissions" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Submissions</TabsTrigger>
            <TabsTrigger value="quotes" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Quotes</TabsTrigger>
            <TabsTrigger value="salespeople" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Salespeople</TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Calendar</TabsTrigger>
            <TabsTrigger value="tasks" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Tasks</TabsTrigger>
            <TabsTrigger value="canvassers" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Canvassers</TabsTrigger>
            <TabsTrigger value="activities" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Activities</TabsTrigger>
            <TabsTrigger value="inventory" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Inventory</TabsTrigger>
            <TabsTrigger value="admins" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsManager />
          </TabsContent>
          
          <TabsContent value="submissions">
            <FormSubmissionsManager />
          </TabsContent>
          
          <TabsContent value="quotes">
            <QuotesManager />
          </TabsContent>
          
          <TabsContent value="salespeople">
            <SalespeopleManager />
          </TabsContent>
          
          <TabsContent value="calendar">
            <CalendarManager />
          </TabsContent>
          
          <TabsContent value="tasks">
            <TasksManager />
          </TabsContent>
          
          <TabsContent value="canvassers">
            <CanvassersManager />
          </TabsContent>
          
          <TabsContent value="activities">
            <CanvassingActivitiesManager />
          </TabsContent>
          
          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>

          <TabsContent value="admins">
            <AdminManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
