
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, BookCheck, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    totalBooks: number;
    availableBooks: number;
    borrowedBooks: number;
    totalMembers: number;
    overdueBooks: number;
  };
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Total Books</CardTitle>
          <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg md:text-2xl font-bold">{stats.totalBooks}</div>
          <p className="text-xs text-muted-foreground">Collection size</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Available</CardTitle>
          <BookCheck className="h-3 w-3 md:h-4 md:w-4 text-green-600" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg md:text-2xl font-bold text-green-600">{stats.availableBooks}</div>
          <p className="text-xs text-muted-foreground">Ready to borrow</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Borrowed</CardTitle>
          <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg md:text-2xl font-bold text-blue-600">{stats.borrowedBooks}</div>
          <p className="text-xs text-muted-foreground">Currently out</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-lg md:text-2xl font-bold text-red-600">{stats.overdueBooks}</div>
          <p className="text-xs text-muted-foreground">Need attention</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
