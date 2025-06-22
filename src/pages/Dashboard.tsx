
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LeadsManager } from "@/components/LeadsManager";
import { InventoryManager } from "@/components/InventoryManager";
import { DashboardStats } from "@/components/DashboardStats";
import { AdminManager } from "@/components/AdminManager";
import { SalespeopleManager } from "@/components/SalespeopleManager";
import { QuotesManager } from "@/components/QuotesManager";
import { CalendarManager } from "@/components/CalendarManager";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/SupabaseAuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-4">You need admin privileges to access this dashboard.</p>
          <Button onClick={() => signOut()} className="bg-black hover:bg-gray-800">Sign Out</Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900">
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
            className="flex items-center gap-2 border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="grid w-full grid-cols-6 bg-gray-800 border-gray-700">
            <TabsTrigger value="leads" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Leads</TabsTrigger>
            <TabsTrigger value="quotes" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Quotes</TabsTrigger>
            <TabsTrigger value="salespeople" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Salespeople</TabsTrigger>
            <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Calendar</TabsTrigger>
            <TabsTrigger value="inventory" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Inventory</TabsTrigger>
            <TabsTrigger value="admins" className="text-gray-300 data-[state=active]:bg-black data-[state=active]:text-white">Admins</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsManager />
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
