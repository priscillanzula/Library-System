
import React, { useState } from 'react';
import Navigation from '../components/Navigation';
import Dashboard from '../components/Dashboard';
import BookManagement from '../components/BookManagement';
import MemberManagement from '../components/MemberManagement';
import TransactionSystem from '../components/TransactionSystem';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
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
