
import { useState, useEffect } from "react";
import { Users, Package, TrendingUp, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    activeProjects: 0,
    totalItems: 0,
    lowStockItems: 0,
    pendingQuotes: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch leads data
        const { data: leads } = await supabase
          .from('leads')
          .select('status');

        // Fetch inventory data
        const { data: inventory } = await supabase
          .from('inventory')
          .select('quantity, min_stock');

        if (leads) {
          const totalLeads = leads.length;
          const newLeads = leads.filter(lead => lead.status === 'New').length;
          const activeProjects = leads.filter(lead => lead.status === 'In Progress').length;
          const pendingQuotes = leads.filter(lead => lead.status === 'Quoted').length;

          const totalItems = inventory?.length || 0;
          const lowStockItems = inventory?.filter(item => item.quantity <= item.min_stock).length || 0;

          setStats({
            totalLeads,
            newLeads,
            activeProjects,
            totalItems,
            lowStockItems,
            pendingQuotes
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      icon: Users,
      title: "Total Leads",
      value: stats.totalLeads,
      subtitle: `${stats.newLeads} new this week`,
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Active Projects",
      value: stats.activeProjects,
      subtitle: "Projects in progress",
      color: "bg-green-500"
    },
    {
      icon: Package,
      title: "Inventory Items",
      value: stats.totalItems,
      subtitle: `${stats.lowStockItems} low stock alerts`,
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Pending Quotes",
      value: stats.pendingQuotes,
      subtitle: "Awaiting response",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>
            </div>
            <div className={`${stat.color} rounded-full p-3`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
