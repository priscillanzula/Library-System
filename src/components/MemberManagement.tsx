
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';
import MemberForm from './MemberForm';
import MemberDetails from './MemberDetails';

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  membershipType: 'student' | 'faculty' | 'public' | 'premium';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  expiryDate: string;
  borrowedBooks: number;
  maxBooksAllowed: number;
}

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      address: '123 Main St, City, State 12345',
      membershipType: 'student',
      status: 'active',
      joinDate: '2024-01-15',
      expiryDate: '2024-12-31',
      borrowedBooks: 2,
      maxBooksAllowed: 5
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@email.com',
      phone: '+1-555-0124',
      address: '456 Oak Ave, City, State 12345',
      membershipType: 'faculty',
      status: 'active',
      joinDate: '2023-09-01',
      expiryDate: '2025-08-31',
      borrowedBooks: 4,
      maxBooksAllowed: 10
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@email.com',
      phone: '+1-555-0125',
      address: '789 Pine Rd, City, State 12345',
      membershipType: 'public',
      status: 'inactive',
      joinDate: '2023-06-10',
      expiryDate: '2024-06-09',
      borrowedBooks: 0,
      maxBooksAllowed: 3
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const membershipTypes = ['all', 'student', 'faculty', 'public', 'premium'];
  const statuses = ['all', 'active', 'inactive', 'suspended'];

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
    const matchesType = selectedType === 'all' || member.membershipType === selectedType;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddMember = (memberData: Omit<Member, 'id'>) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
    };
    setMembers([...members, newMember]);
    setShowMemberForm(false);
  };

  const handleEditMember = (memberData: Omit<Member, 'id'>) => {
    if (editingMember) {
      setMembers(members.map(member => 
        member.id === editingMember.id ? { ...memberData, id: editingMember.id } : member
      ));
      setEditingMember(null);
    }
  };

  const handleDeleteMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId));
  };

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

  if (showMemberForm || editingMember) {
    return (
      <MemberForm
        member={editingMember}
        onSubmit={editingMember ? handleEditMember : handleAddMember}
        onCancel={() => {
          setShowMemberForm(false);
          setEditingMember(null);
        }}
      />
    );
  }

  if (selectedMember) {
    return (
      <MemberDetails
        member={selectedMember}
        onBack={() => setSelectedMember(null)}
        onEdit={() => {
          setEditingMember(selectedMember);
          setSelectedMember(null);
        }}
        onDelete={() => {
          handleDeleteMember(selectedMember.id);
          setSelectedMember(null);
        }}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Member Management</h1>
          <p className="text-muted-foreground">Manage library members and their accounts</p>
        </div>
        <Button onClick={() => setShowMemberForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Tabs value={selectedType} onValueChange={setSelectedType}>
                <TabsList>
                  {membershipTypes.map(type => (
                    <TabsTrigger key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
                <TabsList>
                  {statuses.map(status => (
                    <TabsTrigger key={status} value={status}>
                      {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
          <CardDescription>
            {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
              ? `Showing filtered results` 
              : 'All registered library members'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members found matching your criteria.
              </div>
            ) : (
              filteredMembers.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{member.firstName} {member.lastName}</h3>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <Badge className={getMembershipTypeColor(member.membershipType)}>
                          {member.membershipType}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mb-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Joined: {new Date(member.joinDate).toLocaleDateString()}</span>
                        <span>Expires: {new Date(member.expiryDate).toLocaleDateString()}</span>
                        <span>Books: {member.borrowedBooks}/{member.maxBooksAllowed}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMember(member)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

export default MemberManagement;
