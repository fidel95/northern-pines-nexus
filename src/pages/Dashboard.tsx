
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadsManager } from "@/components/LeadsManager";
import { InventoryManager } from "@/components/InventoryManager";
import { DashboardStats } from "@/components/DashboardStats";
import { Navigation } from "@/components/Navigation";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your leads and inventory</p>
        </div>
        
        <DashboardStats />
        
        <Tabs defaultValue="leads" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="leads">Lead Management</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <LeadsManager />
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
