import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Calendar, User, Book, ArrowLeftRight, Plus, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import BorrowForm from './BorrowForm';

interface Transaction {
  id: string;
  member_id: string | null;
  book_id: string;
  book_title: string;
  transaction_type: 'borrow' | 'return';
  transaction_date: string;
  due_date: string | null;
  returned_date: string | null;
  status: 'active' | 'completed' | 'overdue';
  price: number | null;
  member_name?: string;
}

const TransactionSystem = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showBorrowForm, setShowBorrowForm] = useState(false);

  // Fetch transactions with member names
  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles!transactions_member_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        toast({
          title: "Error",
          description: "Failed to load transactions.",
          variant: "destructive",
        });
        return;
      }

      const transactionsWithNames: Transaction[] = data?.map(transaction => ({
        id: transaction.id,
        member_id: transaction.member_id,
        book_id: transaction.book_id,
        book_title: transaction.book_title,
        transaction_type: transaction.transaction_type as 'borrow' | 'return',
        transaction_date: transaction.transaction_date,
        due_date: transaction.due_date,
        returned_date: transaction.returned_date,
        status: transaction.status as 'active' | 'completed' | 'overdue',
        price: transaction.price,
        member_name: transaction.profiles?.full_name || 'Unknown Member'
      })) || [];

      setTransactions(transactionsWithNames);
    } catch (error) {
      console.error('Error in fetchTransactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update overdue transactions
  const updateOverdueTransactions = async () => {
    try {
      const { error } = await supabase.rpc('update_overdue_transactions');
      if (error) {
        console.error('Error updating overdue transactions:', error);
      }
    } catch (error) {
      console.error('Error calling update_overdue_transactions:', error);
    }
  };

  useEffect(() => {
    updateOverdueTransactions();
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.member_name && transaction.member_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
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

  const getTypeIcon = (type: Transaction['transaction_type']) => {
    switch (type) {
      case 'borrow': return <ArrowLeftRight className="w-4 h-4" />;
      case 'return': return <Book className="w-4 h-4" />;
    }
  };

  const handleQuickReturn = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'completed',
          returned_date: new Date().toISOString(),
          transaction_type: 'return'
        })
        .eq('id', transaction.id);

      if (error) {
        console.error('Error returning book:', error);
        toast({
          title: "Error",
          description: "Failed to return book.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Book Returned",
        description: "The book has been successfully returned.",
      });

      fetchTransactions(); // Refresh the list
    } catch (error) {
      console.error('Error in handleQuickReturn:', error);
    }
  };

  if (showBorrowForm) {
    return (
      <BorrowForm
        onSuccess={() => {
          setShowBorrowForm(false);
          fetchTransactions();
        }}
        onCancel={() => setShowBorrowForm(false)}
      />
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">Manage book borrowing and returns</p>
        </div>
        {userProfile?.role === 'librarian' && (
          <Button onClick={() => setShowBorrowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Transaction
          </Button>
        )}
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
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading transactions...
            </div>
          ) : (
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
                          {getTypeIcon(transaction.transaction_type)}
                          <h3 className="font-semibold text-sm md:text-base">{transaction.book_title}</h3>
                          <Badge className={getStatusColor(transaction.status)} variant="secondary">
                            {transaction.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {transaction.transaction_type}
                          </Badge>
                          {transaction.status === 'overdue' && (
                            <Badge className="bg-red-100 text-red-800" variant="secondary">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{transaction.member_name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Date: {new Date(transaction.transaction_date).toLocaleDateString()}</span>
                          {transaction.due_date && (
                            <span>Due: {new Date(transaction.due_date).toLocaleDateString()}</span>
                          )}
                          {transaction.returned_date && (
                            <span>Returned: {new Date(transaction.returned_date).toLocaleDateString()}</span>
                          )}
                          {transaction.price && transaction.price > 0 && (
                            <span>Price: ${transaction.price.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                      {transaction.transaction_type === 'borrow' && transaction.status === 'active' && userProfile?.role === 'librarian' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickReturn(transaction)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionSystem;
