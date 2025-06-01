
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { LeadsManager } from "@/components/LeadsManager";
import { InventoryManager } from "@/components/InventoryManager";
import { DashboardStats } from "@/components/DashboardStats";
import { AdminManager } from "@/components/AdminManager";
import { AdminLogin } from "@/components/AdminLogin";
import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { isAuthenticated, currentAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {currentAdmin?.username}</p>
          </div>
          <Button 
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
            <TabsTrigger value="admins">Admin Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsManager />
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
