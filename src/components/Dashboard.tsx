
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, BookCheck, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  borrowedBooks: number;
  totalMembers: number;
  overdueBooks: number;
}

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const stats: DashboardStats = {
    totalBooks: 1250,
    availableBooks: 987,
    borrowedBooks: 263,
    totalMembers: 156,
    overdueBooks: 12
  };

  const recentActivities = [
    { id: 1, type: 'borrow', book: 'The Great Gatsby', member: 'John Smith', date: '2024-06-14' },
    { id: 2, type: 'return', book: 'To Kill a Mockingbird', member: 'Jane Doe', date: '2024-06-13' },
    { id: 3, type: 'new_book', book: '1984', member: 'System', date: '2024-06-12' },
    { id: 4, type: 'overdue', book: 'Pride and Prejudice', member: 'Bob Johnson', date: '2024-06-10' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back! Here's what's happening in your library today.
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-muted-foreground">
              Collection size
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <BookCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.availableBooks}</div>
            <p className="text-xs text-muted-foreground">
              Ready to borrow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Borrowed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.borrowedBooks}</div>
            <p className="text-xs text-muted-foreground">
              Currently out
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueBooks}</div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Latest library transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{activity.book}</span>
                      <Badge variant={
                        activity.type === 'borrow' ? 'default' :
                        activity.type === 'return' ? 'secondary' :
                        activity.type === 'new_book' ? 'outline' : 'destructive'
                      }>
                        {activity.type === 'borrow' ? 'Borrowed' :
                         activity.type === 'return' ? 'Returned' :
                         activity.type === 'new_book' ? 'New Book' : 'Overdue'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activity.type === 'new_book' ? 'Added to collection' : `by ${activity.member}`}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {activity.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
