
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Activity {
  id: number;
  type: 'borrow' | 'return' | 'new_book' | 'overdue';
  book: string;
  member: string;
  date: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Recent Activities</CardTitle>
        <CardDescription>Latest library transactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className="font-medium text-sm md:text-base truncate">{activity.book}</span>
                    <Badge variant={
                      activity.type === 'borrow' ? 'default' :
                      activity.type === 'return' ? 'secondary' :
                      activity.type === 'new_book' ? 'outline' : 'destructive'
                    } className="text-xs w-fit">
                      {activity.type === 'borrow' ? 'Borrowed' :
                       activity.type === 'return' ? 'Returned' :
                       activity.type === 'new_book' ? 'New Book' : 'Overdue'}
                    </Badge>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {activity.type === 'new_book' ? 'Added to collection' : `by ${activity.member}`}
                  </p>
                </div>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground flex-shrink-0">
                {activity.date}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;
