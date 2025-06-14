import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BookForm from './BookForm';
import BookDetails from './BookDetails';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
  publishedYear: number;
  copies: number;
  availableCopies: number;
  description?: string;
  location: string;
}

const BookManagement = () => {
  const { hasPermission, userProfile } = useAuth();
  const { toast } = useToast();
  
  const [books, setBooks] = useState<Book[]>([
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
      status: 'borrowed',
      publishedYear: 1960,
      copies: 2,
      availableCopies: 0,
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

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showBookForm, setShowBookForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const categories = ['all', 'Fiction', 'Science Fiction', 'Non-Fiction', 'Biography', 'History'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = (bookData: Omit<Book, 'id'>) => {
    if (!hasPermission('add_book')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to add books.",
        variant: "destructive",
      });
      return;
    }

    const newBook: Book = {
      ...bookData,
      id: Date.now().toString(),
    };
    setBooks([...books, newBook]);
    setShowBookForm(false);
    toast({
      title: "Book Added",
      description: "The book has been successfully added to the library.",
    });
  };

  const handleEditBook = (bookData: Omit<Book, 'id'>) => {
    if (!hasPermission('edit_book')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to edit books.",
        variant: "destructive",
      });
      return;
    }

    if (editingBook) {
      setBooks(books.map(book => 
        book.id === editingBook.id ? { ...bookData, id: editingBook.id } : book
      ));
      setEditingBook(null);
      toast({
        title: "Book Updated",
        description: "The book has been successfully updated.",
      });
    }
  };

  const handleDeleteBook = (bookId: string) => {
    if (!hasPermission('delete_book')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete books.",
        variant: "destructive",
      });
      return;
    }

    setBooks(books.filter(book => book.id !== bookId));
    toast({
      title: "Book Deleted",
      description: "The book has been successfully removed from the library.",
    });
  };

  const getStatusColor = (status: Book['status']) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showBookForm || editingBook) {
    return (
      <BookForm
        book={editingBook}
        onSubmit={editingBook ? handleEditBook : handleAddBook}
        onCancel={() => {
          setShowBookForm(false);
          setEditingBook(null);
        }}
      />
    );
  }

  if (selectedBook) {
    return (
      <BookDetails
        book={selectedBook}
        onBack={() => setSelectedBook(null)}
        onEdit={() => {
          if (!hasPermission('edit_book')) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to edit books.",
              variant: "destructive",
            });
            return;
          }
          setEditingBook(selectedBook);
          setSelectedBook(null);
        }}
        onDelete={() => {
          if (!hasPermission('delete_book')) {
            toast({
              title: "Access Denied",
              description: "You don't have permission to delete books.",
              variant: "destructive",
            });
            return;
          }
          handleDeleteBook(selectedBook.id);
          setSelectedBook(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Book Management</h1>
          <p className="text-muted-foreground">
            Manage your library's book collection
            {userProfile && (
              <Badge className="ml-2 text-xs">
                Access Level: {userProfile.role}
              </Badge>
            )}
          </p>
        </div>
        {hasPermission('add_book') ? (
          <Button onClick={() => setShowBookForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </Button>
        ) : (
          <Button disabled className="opacity-50">
            <Lock className="w-4 h-4 mr-2" />
            Add New Book
          </Button>
        )}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Books List */}
      <Card>
        <CardHeader>
          <CardTitle>Books ({filteredBooks.length})</CardTitle>
          <CardDescription>
            {searchTerm || selectedCategory !== 'all' 
              ? `Showing filtered results` 
              : 'All books in your collection'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No books found matching your criteria.
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{book.title}</h3>
                        <Badge className={getStatusColor(book.status)}>
                          {book.status}
                        </Badge>
                        <Badge variant="outline">{book.category}</Badge>
                      </div>
                      <p className="text-muted-foreground">by {book.author}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>ISBN: {book.isbn}</span>
                        <span>Published: {book.publishedYear}</span>
                        <span>Available: {book.availableCopies}/{book.copies}</span>
                        <span>Location: {book.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBook(book)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {hasPermission('edit_book') ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBook(book)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="opacity-50">
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}
                      {hasPermission('delete_book') ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled className="opacity-50">
                          <Lock className="w-4 h-4" />
                        </Button>
                      )}
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

export default BookManagement;
