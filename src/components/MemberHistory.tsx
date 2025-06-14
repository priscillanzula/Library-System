
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Book, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface BorrowingHistory {
  id: string;
  bookTitle: string;
  author: string;
  isbn: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'current' | 'returned' | 'overdue';
  fineAmount?: number;
}

const MemberHistory = () => {
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app this would come from API based on logged-in member
  const borrowingHistory: BorrowingHistory[] = [
    {
      id: '1',
      bookTitle: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      issueDate: '2024-06-01',
      dueDate: '2024-06-15',
      status: 'current'
    },
    {
      id: '2',
      bookTitle: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      issueDate: '2024-05-15',
      dueDate: '2024-05-29',
      returnDate: '2024-05-28',
      status: 'returned'
    },
    {
      id: '3',
      bookTitle: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      issueDate: '2024-05-01',
      dueDate: '2024-05-15',
      returnDate: '2024-05-20',
      status: 'returned',
      fineAmount: 5.00
    },
    {
      id: '4',
      bookTitle: 'Pride and Prejudice',
      author: 'Jane Austen',
      isbn: '978-0-14-143951-8',
      issueDate: '2024-04-10',
      dueDate: '2024-04-24',
      status: 'overdue',
      fineAmount: 12.00
    }
  ];

  const filteredHistory = borrowingHistory.filter(item => {
    const matchesSearch = 
      item.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isbn.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: BorrowingHistory['status']) => {
    switch (status) {
      case 'current': return 'bg-blue-100 text-blue-800';
      case 'returned': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: BorrowingHistory['status']) => {
    switch (status) {
      case 'current': return <Clock className="w-4 h-4" />;
      case 'returned': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <Calendar className="w-4 h-4" />;
    }
  };

  const currentBooks = borrowingHistory.filter(item => item.status === 'current').length;
  const overdueBooks = borrowingHistory.filter(item => item.status === 'overdue').length;
  const totalFines = borrowingHistory.reduce((sum, item) => sum + (item.fineAmount || 0), 0);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Library History</h1>
          <p className="text-muted-foreground">Welcome back, {userProfile?.full_name}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Current Books</CardTitle>
            <Book className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg md:text-2xl font-bold text-blue-600">{currentBooks}</div>
            <p className="text-xs text-muted-foreground">Currently borrowed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Overdue</CardTitle>
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-red-600" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg md:text-2xl font-bold text-red-600">{overdueBooks}</div>
            <p className="text-xs text-muted-foreground">Books overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Total Borrowed</CardTitle>
            <Book className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg md:text-2xl font-bold">{borrowingHistory.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium">Outstanding Fines</CardTitle>
            <Calendar className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg md:text-2xl font-bold text-orange-600">${totalFines.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total fines</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Status</option>
              <option value="current">Current</option>
              <option value="returned">Returned</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Borrowing History */}
      <Card>
        <CardHeader>
          <CardTitle>Borrowing History ({filteredHistory.length})</CardTitle>
          <CardDescription>Your complete library borrowing record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No borrowing history found matching your criteria.
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div key={item.id} className="border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2 flex-wrap">
                        <Book className="w-5 h-5 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm md:text-base">{item.bookTitle}</h3>
                          <p className="text-sm text-muted-foreground">by {item.author}</p>
                          <p className="text-xs text-muted-foreground">ISBN: {item.isbn}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(item.status)}
                          <Badge className={getStatusColor(item.status)} variant="secondary">
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                        <span>Issued: {new Date(item.issueDate).toLocaleDateString()}</span>
                        <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                        {item.returnDate && (
                          <span>Returned: {new Date(item.returnDate).toLocaleDateString()}</span>
                        )}
                        {item.fineAmount && (
                          <span className="text-orange-600 font-medium">
                            Fine: ${item.fineAmount.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberHistory;
