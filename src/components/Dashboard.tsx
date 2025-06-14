
import React from 'react';
import StatsCards from './StatsCards';
import RecentActivities from './RecentActivities';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  overdueBooks: number;
}

const Dashboard = () => {
  const { userProfile } = useAuth();
  
  // Mock data - in real app this would come from API
  const stats: DashboardStats = {
    totalBooks: 1250,
    availableBooks: 987,
    borrowedBooks: 263,
    totalMembers: 156,
    overdueBooks: 12
  };

  const recentActivities = [
    { id: 1, type: 'borrow' as const, book: 'The Great Gatsby', member: 'John Smith', date: '2024-06-14' },
    { id: 2, type: 'return' as const, book: 'To Kill a Mockingbird', member: 'Jane Doe', date: '2024-06-13' },
    { id: 3, type: 'new_book' as const, book: '1984', member: 'System', date: '2024-06-12' },
    { id: 4, type: 'overdue' as const, book: 'Pride and Prejudice', member: 'Bob Johnson', date: '2024-06-10' },
  ];

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Library Dashboard</h1>
          <div className="text-sm text-muted-foreground mt-1">
            Welcome back, {userProfile?.full_name}! Here's your library overview.
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsCards stats={stats} />

      {/* Recent Activities */}
      <RecentActivities activities={recentActivities} />
    </div>
  );
};

export default Dashboard;
