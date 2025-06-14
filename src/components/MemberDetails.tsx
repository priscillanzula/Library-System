
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, MapPin, Calendar, BookOpen } from 'lucide-react';
import { Member } from './MemberManagement';

interface MemberDetailsProps {
  member: Member;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MemberDetails: React.FC<MemberDetailsProps> = ({ member, onBack, onEdit, onDelete }) => {
  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMembershipTypeColor = (type: Member['membershipType']) => {
    switch (type) {
      case 'student': return 'bg-blue-100 text-blue-800';
      case 'faculty': return 'bg-purple-100 text-purple-800';
      case 'public': return 'bg-yellow-100 text-yellow-800';
      case 'premium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete member "${member.firstName} ${member.lastName}"? This action cannot be undone.`)) {
      onDelete();
    }
  };

  const isExpiringSoon = () => {
    const expiryDate = new Date(member.expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= thirtyDaysFromNow && expiryDate > today;
  };

  const isExpired = () => {
    const expiryDate = new Date(member.expiryDate);
    const today = new Date();
    return expiryDate < today;
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Members
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{member.firstName} {member.lastName}</h1>
            <div className="flex items-center gap-2">
              <Badge className={getMembershipTypeColor(member.membershipType)}>
                {member.membershipType.charAt(0).toUpperCase() + member.membershipType.slice(1)}
              </Badge>
              <Badge className={getStatusColor(member.status)}>
                {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
              </Badge>
              {isExpired() && <Badge variant="destructive">Expired</Badge>}
              {isExpiringSoon() && <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">{member.firstName} {member.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Membership Type</label>
                  <div>
                    <Badge className={getMembershipTypeColor(member.membershipType)}>
                      {member.membershipType.charAt(0).toUpperCase() + member.membershipType.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  {member.address}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Join Date</label>
                  <p>{new Date(member.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p className={isExpired() ? 'text-red-600 font-medium' : isExpiringSoon() ? 'text-yellow-600 font-medium' : ''}>
                    {new Date(member.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div>
                    <Badge className={getStatusColor(member.status)}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Books Borrowed</label>
                  <p>{member.borrowedBooks} of {member.maxBooksAllowed} allowed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Borrowing History */}
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
              <CardDescription>Recent book transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Mock borrowing history */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">The Great Gatsby</p>
                    <p className="text-sm text-muted-foreground">Borrowed on June 10, 2024</p>
                  </div>
                  <Badge variant="outline">Current</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">To Kill a Mockingbird</p>
                    <p className="text-sm text-muted-foreground">Borrowed May 15 - Returned June 1, 2024</p>
                  </div>
                  <Badge variant="secondary">Returned</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">1984</p>
                    <p className="text-sm text-muted-foreground">Borrowed April 20 - Returned May 5, 2024</p>
                  </div>
                  <Badge variant="secondary">Returned</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Issue Book
              </Button>
              <Button className="w-full" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Return Book
              </Button>
              <Button className="w-full" variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
              <Button className="w-full" variant="outline">
                Renew Membership
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Books Borrowed</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Currently Borrowed</span>
                <span className="font-medium">{member.borrowedBooks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overdue Books</span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Late Returns</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="font-medium">{new Date(member.joinDate).getFullYear()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
