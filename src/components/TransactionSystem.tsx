
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Book, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Transaction {
  id: string;
  type: 'borrow' | 'return' | 'reserve';
  bookTitle: string;
  memberName: string;
  date: string;
  dueDate?: string;
  status: 'active' | 'completed' | 'overdue';
}

const TransactionSystem = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'borrow',
      bookTitle: 'The Great Gatsby',
      memberName: 'John Smith',
      date: '2024-06-10',
      dueDate: '2024-06-24',
      status: 'active'
    },
    {
      id: '2',
      type: 'return',
      bookTitle: 'To Kill a Mockingbird',
      memberName: 'Jane Doe',
      date: '2024-06-13',
      status: 'completed'
    },
    {
      id: '3',
      type: 'borrow',
      bookTitle: 'Pride and Prejudice',
      memberName: 'Bob Johnson',
      date: '2024-06-01',
      dueDate: '2024-06-12',
      status: 'overdue'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'borrow': return <ArrowLeftRight className="w-4 h-4" />;
      case 'return': return <Book className="w-4 h-4" />;
      case 'reserve': return <Calendar className="w-4 h-4" />;
    }
  };

  const handleQuickReturn = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, status: 'completed' as const, type: 'return' as const, date: new Date().toISOString().split('T')[0] }
          : t
      )
    );
    toast({
      title: "Book Returned",
      description: "The book has been successfully returned.",
    });
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage book borrowing and returns</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by book title or member name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex h-10 w-full md:w-40 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Types</option>
              <option value="borrow">Borrow</option>
              <option value="return">Return</option>
              <option value="reserve">Reserve</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          <CardDescription>
            {searchTerm || filterType !== 'all' 
              ? `Showing filtered results` 
              : 'All library transactions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No transactions found matching your criteria.
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="border rounded-lg p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getTypeIcon(transaction.type)}
                        <h3 className="font-semibold text-sm md:text-base">{transaction.bookTitle}</h3>
                        <Badge className={getStatusColor(transaction.status)} variant="secondary">
                          {transaction.status}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {transaction.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{transaction.memberName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Date: {transaction.date}</span>
                        {transaction.dueDate && (
                          <span>Due: {transaction.dueDate}</span>
                        )}
                      </div>
                    </div>
                    {transaction.type === 'borrow' && transaction.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReturn(transaction.id)}
                        className="w-full sm:w-auto"
                      >
                        Quick Return
                      </Button>
                    )}
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

export default TransactionSystem;
