
import { useState, useEffect } from "react";
import { Users, Package, TrendingUp, Clock, FileText, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    activeProjects: 0,
    totalItems: 0,
    lowStockItems: 0,
    pendingQuotes: 0,
    totalSalespeople: 0,
    totalQuotes: 0,
    totalCanvassers: 0,
    activeTasks: 0
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

        // Fetch quotes data
        const { data: quotes } = await supabase
          .from('quotes')
          .select('status');

        // Fetch salespeople data
        const { data: salespeople } = await supabase
          .from('salespeople')
          .select('id')
          .eq('active', true);

        // Fetch canvassers data
        const { data: canvassers } = await supabase
          .from('canvassers')
          .select('id')
          .eq('active', true);

        // Fetch tasks data
        const { data: tasks } = await supabase
          .from('tasks')
          .select('completed');

        if (leads) {
          const totalLeads = leads.length;
          const newLeads = leads.filter(lead => lead.status === 'New').length;
          const activeProjects = leads.filter(lead => lead.status === 'In Progress').length;

          const totalItems = inventory?.length || 0;
          const lowStockItems = inventory?.filter(item => item.quantity <= item.min_stock).length || 0;

          const pendingQuotes = quotes?.filter(quote => quote.status === 'pending').length || 0;
          const totalQuotes = quotes?.length || 0;
          const totalSalespeople = salespeople?.length || 0;
          const totalCanvassers = canvassers?.length || 0;
          const activeTasks = tasks?.filter(task => !task.completed).length || 0;

          setStats({
            totalLeads,
            newLeads,
            activeProjects,
            totalItems,
            lowStockItems,
            pendingQuotes,
            totalSalespeople,
            totalQuotes,
            totalCanvassers,
            activeTasks
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
      color: "bg-blue-600"
    },
    {
      icon: FileText,
      title: "Pending Quotes",
      value: stats.pendingQuotes,
      subtitle: `${stats.totalQuotes} total quotes`,
      color: "bg-blue-700"
    },
    {
      icon: User,
      title: "Active Salespeople",
      value: stats.totalSalespeople,
      subtitle: "Team members",
      color: "bg-blue-800"
    },
    {
      icon: Users,
      title: "Active Canvassers",
      value: stats.totalCanvassers,
      subtitle: "Field team",
      color: "bg-blue-900"
    },
    {
      icon: TrendingUp,
      title: "Active Projects",
      value: stats.activeProjects,
      subtitle: "Projects in progress",
      color: "bg-gray-700"
    },
    {
      icon: Package,
      title: "Inventory Items",
      value: stats.totalItems,
      subtitle: `${stats.lowStockItems} low stock alerts`,
      color: "bg-gray-800"
    },
    {
      icon: Clock,
      title: "Active Tasks",
      value: stats.activeTasks,
      subtitle: "Pending tasks",
      color: "bg-gray-900"
    },
    {
      icon: FileText,
      title: "Total Quotes",
      value: stats.totalQuotes,
      subtitle: "All time quotes",
      color: "bg-gray-700"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-gray-900 border border-blue-800 rounded-lg shadow-xl p-6 hover:shadow-2xl transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">{stat.title}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.subtitle}</p>
            </div>
            <div className={`${stat.color} rounded-full p-3 shadow-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
