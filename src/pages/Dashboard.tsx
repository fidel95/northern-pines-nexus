import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
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
import { useEffect } from "react";
import { FormSubmissionsManager } from "@/components/FormSubmissionsManager";

const Dashboard = () => {
  const { user, signOut, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You need admin privileges to access this dashboard.</p>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={() => navigate('/auth')} 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
            <Button 
              onClick={() => signOut()} 
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

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user.email}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2 border-blue-600 text-blue-400 hover:bg-blue-900 shadow-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="grid w-full grid-cols-9 bg-gray-900 border-blue-800 shadow-lg">
            <TabsTrigger value="leads" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Leads</TabsTrigger>
            <TabsTrigger value="submissions" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Submissions</TabsTrigger>
            <TabsTrigger value="quotes" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Quotes</TabsTrigger>
            <TabsTrigger value="salespeople" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Salespeople</TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Calendar</TabsTrigger>
            <TabsTrigger value="tasks" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Tasks</TabsTrigger>
            <TabsTrigger value="canvassers" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Canvassers</TabsTrigger>
            <TabsTrigger value="activities" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Activities</TabsTrigger>
            <TabsTrigger value="inventory" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-200">Inventory</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
