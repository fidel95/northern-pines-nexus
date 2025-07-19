
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
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FormSubmissionsManager } from "@/components/FormSubmissionsManager";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut, isAdmin, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      console.log('Redirecting to auth - no user or not admin');
      navigate('/auth');
    }
  }, [user, isAdmin, isLoading, navigate]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Dashboard Error</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In Again
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

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-6">You need admin privileges to access this dashboard.</p>
          <div className="space-y-2 text-sm text-gray-500 mb-6">
            <p>Current user: {user?.email || 'None'}</p>
            <p>Admin status: {isAdmin ? 'Yes' : 'No'}</p>
          </div>
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
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-gray-900 border-gray-700 shadow-lg overflow-x-auto">
            <TabsTrigger value="leads" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Leads</TabsTrigger>
            <TabsTrigger value="submissions" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Submissions</TabsTrigger>
            <TabsTrigger value="quotes" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Quotes</TabsTrigger>
            <TabsTrigger value="salespeople" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Sales</TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Calendar</TabsTrigger>
            <TabsTrigger value="tasks" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Tasks</TabsTrigger>
            <TabsTrigger value="canvassers" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Canvassers</TabsTrigger>
            <TabsTrigger value="activities" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Activities</TabsTrigger>
            <TabsTrigger value="inventory" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Inventory</TabsTrigger>
            <TabsTrigger value="admins" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200 text-xs sm:text-sm">Admins</TabsTrigger>
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
