'use client';

import { createAdminInvite, listAdminInvites } from '@/actions/admin';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export default function AdminInvitesPage() {
  const [email, setEmail] = useState('');
  const [invites, setInvites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    const data = await listAdminInvites();
    setInvites(data);
  };

  const handleCreateInvite = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const { inviteLink } = await createAdminInvite(email);
      toast.success('Invite created');
      toast.info(`Invite link: ${inviteLink}`);
      setEmail('');
      await loadInvites();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Invites</h1>

      <div className="flex gap-2 mb-6">
        <Input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleCreateInvite} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Invite'}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => (
            <TableRow key={invite.id}>
              <TableCell>{invite.email}</TableCell>
              <TableCell>{new Date(invite.expiresAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(invite.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}