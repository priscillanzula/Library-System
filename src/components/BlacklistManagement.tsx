
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, AlertTriangle, UserX, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BlacklistEntry {
  id: string;
  member_id: string;
  reason: string;
  blacklisted_by: string;
  blacklisted_at: string;
  is_active: boolean;
  member_name?: string;
  blacklisted_by_name?: string;
}

interface Member {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const BlacklistManagement = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [blacklistEntries, setBlacklistEntries] = useState<BlacklistEntry[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [reason, setReason] = useState('');
  const [memberSearch, setMemberSearch] = useState('');

  useEffect(() => {
    fetchBlacklistEntries();
    fetchMembers();
  }, []);

  const fetchBlacklistEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('member_blacklist')
        .select(`
          *,
          member:profiles!member_blacklist_member_id_fkey(full_name),
          blacklisted_by_profile:profiles!member_blacklist_blacklisted_by_fkey(full_name)
        `)
        .order('blacklisted_at', { ascending: false });

      if (error) {
        console.error('Error fetching blacklist entries:', error);
        toast({
          title: "Error",
          description: "Failed to load blacklist entries.",
          variant: "destructive",
        });
        return;
      }

      const entriesWithNames = data?.map(entry => ({
        ...entry,
        member_name: entry.member?.full_name || 'Unknown Member',
        blacklisted_by_name: entry.blacklisted_by_profile?.full_name || 'Unknown Librarian'
      })) || [];

      setBlacklistEntries(entriesWithNames);
    } catch (error) {
      console.error('Error in fetchBlacklistEntries:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredEntries = blacklistEntries.filter(entry =>
    entry.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleAddToBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !reason.trim()) {
      toast({
        title: "Error",
        description: "Please select a member and provide a reason.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('member_blacklist')
        .insert({
          member_id: selectedMember.id,
          reason: reason.trim(),
          blacklisted_by: userProfile?.id
        });

      if (error) {
        console.error('Error adding to blacklist:', error);
        toast({
          title: "Error",
          description: "Failed to add member to blacklist.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Member has been added to the blacklist.",
      });

      setShowAddForm(false);
      setSelectedMember(null);
      setReason('');
      setMemberSearch('');
      fetchBlacklistEntries();
    } catch (error) {
      console.error('Error in handleAddToBlacklist:', error);
    }
  };

  const handleToggleBlacklist = async (entryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('member_blacklist')
        .update({ is_active: !isActive })
        .eq('id', entryId);

      if (error) {
        console.error('Error toggling blacklist status:', error);
        toast({
          title: "Error",
          description: "Failed to update blacklist status.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Member has been ${!isActive ? 'blacklisted' : 'removed from blacklist'}.`,
      });

      fetchBlacklistEntries();
    } catch (error) {
      console.error('Error in handleToggleBlacklist:', error);
    }
  };

  if (userProfile?.role !== 'librarian') {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Only librarians can access the blacklist management.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Blacklist Management</h1>
          <p className="text-muted-foreground">Manage blacklisted members</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          Add to Blacklist
        </Button>
      </div>

      {/* Add to Blacklist Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Member to Blacklist</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddToBlacklist} className="space-y-4">
              <div>
                <Label htmlFor="memberSearch">Search Member</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="memberSearch"
                    placeholder="Search members by name or email..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {memberSearch && (
                <div className="max-h-32 overflow-y-auto space-y-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`p-2 border rounded cursor-pointer transition-colors ${
                        selectedMember?.id === member.id
                          ? 'border-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedMember(member)}
                    >
                      <p className="font-medium">{member.full_name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <Label htmlFor="reason">Reason</Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for blacklisting..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={!selectedMember || !reason.trim()}>
                  Add to Blacklist
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blacklist entries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blacklist Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Blacklist Entries ({filteredEntries.length})</CardTitle>
          <CardDescription>
            {searchTerm ? 'Showing filtered results' : 'All blacklist entries'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading blacklist entries...
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No blacklist entries found.
                </div>
              ) : (
                filteredEntries.map((entry) => (
                  <div key={entry.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1">
                            {entry.is_active ? (
                              <UserX className="w-4 h-4 text-red-500" />
                            ) : (
                              <User className="w-4 h-4 text-green-500" />
                            )}
                            <h3 className="font-semibold">{entry.member_name}</h3>
                          </div>
                          <Badge className={entry.is_active ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                            {entry.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{entry.reason}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Blacklisted by: {entry.blacklisted_by_name}</span>
                          <span>Date: {new Date(entry.blacklisted_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleBlacklist(entry.id, entry.is_active)}
                      >
                        {entry.is_active ? 'Remove' : 'Reactivate'}
                      </Button>
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

export default BlacklistManagement;
