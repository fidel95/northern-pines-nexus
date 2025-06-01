
import { Users, Package, TrendingUp, Clock } from "lucide-react";

export const DashboardStats = () => {
  const leads = JSON.parse(localStorage.getItem('leads') || '[]');
  const inventory = JSON.parse(localStorage.getItem('inventory') || '[]');
  
  const newLeads = leads.filter((lead: any) => lead.status === 'New').length;
  const totalLeads = leads.length;
  const lowStockItems = inventory.filter((item: any) => item.quantity <= item.minStock).length;
  const totalItems = inventory.length;

  const stats = [
    {
      icon: Users,
      title: "Total Leads",
      value: totalLeads,
      subtitle: `${newLeads} new this week`,
      color: "bg-blue-500"
    },
    {
      icon: TrendingUp,
      title: "Active Projects",
      value: leads.filter((lead: any) => lead.status === 'In Progress').length,
      subtitle: "Projects in progress",
      color: "bg-green-500"
    },
    {
      icon: Package,
      title: "Inventory Items",
      value: totalItems,
      subtitle: `${lowStockItems} low stock alerts`,
      color: "bg-purple-500"
    },
    {
      icon: Clock,
      title: "Pending Quotes",
      value: leads.filter((lead: any) => lead.status === 'Quoted').length,
      subtitle: "Awaiting response",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
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
