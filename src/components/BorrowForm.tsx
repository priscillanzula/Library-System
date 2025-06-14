
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Book } from './BookManagement';

interface Member {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface BorrowFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [books] = useState<Book[]>([
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Fiction',
      status: 'available',
      publishedYear: 1925,
      copies: 3,
      availableCopies: 2,
      description: 'A classic American novel set in the Jazz Age.',
      location: 'A-1-01'
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Fiction',
      status: 'available',
      publishedYear: 1960,
      copies: 2,
      availableCopies: 1,
      description: 'A gripping tale of racial injustice and childhood innocence.',
      location: 'A-1-02'
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      isbn: '978-0-452-28423-4',
      category: 'Science Fiction',
      status: 'available',
      publishedYear: 1949,
      copies: 4,
      availableCopies: 3,
      description: 'A dystopian novel about totalitarian government control.',
      location: 'B-2-15'
    }
  ]);
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [borrowPrice, setBorrowPrice] = useState('0.00');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [blacklistedMembers, setBlacklistedMembers] = useState<string[]>([]);

  useEffect(() => {
    fetchMembers();
    fetchBlacklistedMembers();
    // Set default due date to 14 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('role', 'librarian')
        .order('full_name');

      if (error) {
        console.error('Error fetching members:', error);
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error('Error in fetchMembers:', error);
    }
  };

  const fetchBlacklistedMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('member_blacklist')
        .select('member_id')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching blacklisted members:', error);
        return;
      }

      setBlacklistedMembers(data?.map(item => item.member_id) || []);
    } catch (error) {
      console.error('Error in fetchBlacklistedMembers:', error);
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const filteredBooks = books.filter(book =>
    book.status === 'available' &&
    book.availableCopies > 0 &&
    (book.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
     book.author.toLowerCase().includes(bookSearch.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedBook) {
      toast({
        title: "Error",
        description: "Please select both a member and a book.",
        variant: "destructive",
      });
      return;
    }

    if (blacklistedMembers.includes(selectedMember.id)) {
      toast({
        title: "Error",
        description: "This member is blacklisted and cannot borrow books.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          member_id: selectedMember.id,
          book_id: selectedBook.id,
          book_title: selectedBook.title,
          transaction_type: 'borrow',
          due_date: dueDate,
          price: parseFloat(borrowPrice),
          status: 'active'
        });

      if (error) {
        console.error('Error creating transaction:', error);
        toast({
          title: "Error",
          description: "Failed to create transaction.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Book borrowed successfully.",
      });

      onSuccess();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold">New Book Transaction</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Member Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Member</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name or email..."
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredMembers.map((member) => {
                const isBlacklisted = blacklistedMembers.includes(member.id);
                return (
                  <div
                    key={member.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedMember?.id === member.id
                        ? 'border-primary bg-primary/5'
                        : isBlacklisted
                        ? 'border-red-200 bg-red-50 opacity-50 cursor-not-allowed'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => !isBlacklisted && setSelectedMember(member)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <Badge variant="outline" className="mt-1">
                          {member.role}
                        </Badge>
                      </div>
                      {isBlacklisted && (
                        <Badge className="bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Blacklisted
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Book Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Book</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title or author..."
                value={bookSearch}
                onChange={(e) => setBookSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {filteredBooks.map((book) => (
                <div
                  key={book.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedBook?.id === book.id
                      ? 'border-primary bg-primary/5'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedBook(book)}
                >
                  <div>
                    <p className="font-medium">{book.title}</p>
                    <p className="text-sm text-muted-foreground">by {book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{book.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Available: {book.availableCopies}/{book.copies}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Borrow Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={borrowPrice}
                  onChange={(e) => setBorrowPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading || !selectedMember || !selectedBook}>
            {loading ? 'Creating...' : 'Create Transaction'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BorrowForm;
