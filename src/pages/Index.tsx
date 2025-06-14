
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import BookManagement from '../components/BookManagement';
import MemberManagement from '../components/MemberManagement';
import TransactionSystem from '../components/TransactionSystem';
import MemberHistory from '../components/MemberHistory';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { userProfile } = useAuth();
  const isLibrarian = userProfile?.role === 'librarian';
  
  // Set initial page based on user role
  const [currentPage, setCurrentPage] = useState(isLibrarian ? 'dashboard' : 'history');

  const renderPage = () => {
    // If user is not a librarian, only show member history
    if (!isLibrarian) {
      return <MemberHistory />;
    }

    // Librarian pages
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'books':
        return <BookManagement />;
      case 'members':
        return <MemberManagement />;
      case 'transactions':
        return <TransactionSystem />;
      case 'reports':
        return (
          <div className="p-3 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Reports & Analytics</h1>
            <p className="text-muted-foreground">Reports and analytics functionality coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-3 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Settings</h1>
            <p className="text-muted-foreground">Settings functionality coming soon...</p>
          </div>
        );
      case 'history':
        return <MemberHistory />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="w-full">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
