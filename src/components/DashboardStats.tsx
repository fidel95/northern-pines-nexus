
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data with error handling for each query
        const queries = await Promise.allSettled([
          supabase.from('leads').select('status'),
          supabase.from('inventory').select('quantity, min_stock'),
          supabase.from('quotes').select('status'),
          supabase.from('salespeople').select('id').eq('active', true),
          supabase.from('canvassers').select('id').eq('active', true),
          supabase.from('tasks').select('completed'),
        ]);

        const [leadsResult, inventoryResult, quotesResult, salespeopleResult, canvassersResult, tasksResult] = queries;

        let newStats = { ...stats };

        // Process leads data
        if (leadsResult.status === 'fulfilled' && leadsResult.value.data) {
          const leads = leadsResult.value.data;
          newStats.totalLeads = leads.length;
          newStats.newLeads = leads.filter(lead => lead.status === 'New').length;
          newStats.activeProjects = leads.filter(lead => lead.status === 'In Progress').length;
        }

        // Process inventory data
        if (inventoryResult.status === 'fulfilled' && inventoryResult.value.data) {
          const inventory = inventoryResult.value.data;
          newStats.totalItems = inventory.length;
          newStats.lowStockItems = inventory.filter(item => item.quantity <= item.min_stock).length;
        }

        // Process quotes data
        if (quotesResult.status === 'fulfilled' && quotesResult.value.data) {
          const quotes = quotesResult.value.data;
          newStats.totalQuotes = quotes.length;
          newStats.pendingQuotes = quotes.filter(quote => quote.status === 'pending').length;
        }

        // Process salespeople data
        if (salespeopleResult.status === 'fulfilled' && salespeopleResult.value.data) {
          newStats.totalSalespeople = salespeopleResult.value.data.length;
        }

        // Process canvassers data
        if (canvassersResult.status === 'fulfilled' && canvassersResult.value.data) {
          newStats.totalCanvassers = canvassersResult.value.data.length;
        }

        // Process tasks data
        if (tasksResult.status === 'fulfilled' && tasksResult.value.data) {
          const tasks = tasksResult.value.data;
          newStats.activeTasks = tasks.filter(task => !task.completed).length;
        }

        setStats(newStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-900 border border-blue-800 rounded-lg shadow-xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900 border border-red-600 rounded-lg p-6 text-center">
        <p className="text-red-200">{error}</p>
      </div>
    );
  }

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
