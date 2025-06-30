
import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Eye, CheckCircle, Archive, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FormSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: string;
  status: string;
  submitted_at: string;
  responded_at?: string;
}

export const FormSubmissionsManager = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
      setFilteredSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch form submissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'responded') {
        updates.responded_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      toast({
        title: "Success",
        description: `Submission marked as ${status}`,
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const csvData = filteredSubmissions.map(submission => ({
      Name: submission.name,
      Email: submission.email,
      Phone: submission.phone || '',
      Message: submission.message.replace(/"/g, '""'),
      Source: submission.source,
      Status: submission.status,
      'Submitted At': formatDate(submission.submitted_at),
      'Responded At': submission.responded_at ? formatDate(submission.responded_at) : ''
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        headers.map(header => `"${row[header as keyof typeof row]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `form-submissions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "Export Complete",
      description: "Form submissions exported successfully",
    });
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (searchTerm) {
      filtered = filtered.filter(submission =>
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(submission => submission.status === statusFilter);
    }

    setFilteredSubmissions(filtered);
  }, [submissions, searchTerm, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'responded': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8">
          <div className="text-center text-white">Loading submissions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Form Submissions ({filteredSubmissions.length})
          </CardTitle>
          <Button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700"
            disabled={filteredSubmissions.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
        
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search submissions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {searchTerm || statusFilter !== 'all' ? 'No submissions match your filters.' : 'No form submissions yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-600">
                  <TableHead className="text-gray-300">Name</TableHead>
                  <TableHead className="text-gray-300">Email</TableHead>
                  <TableHead className="text-gray-300">Phone</TableHead>
                  <TableHead className="text-gray-300">Source</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Submitted</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <TableRow key={submission.id} className="border-gray-600">
                    <TableCell className="text-white font-medium">
                      {submission.name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {submission.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {submission.phone ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {submission.phone}
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <Badge variant="outline" className="text-blue-400 border-blue-400">
                        {submission.source}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(submission.status)}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(submission.submitted_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                              onClick={() => setSelectedSubmission(submission)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Form Submission Details
                              </DialogTitle>
                            </DialogHeader>
                            {selectedSubmission && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-gray-300 text-sm font-medium">Name</label>
                                    <p className="text-white">{selectedSubmission.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-300 text-sm font-medium">Email</label>
                                    <p className="text-white">{selectedSubmission.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-300 text-sm font-medium">Phone</label>
                                    <p className="text-white">{selectedSubmission.phone || 'Not provided'}</p>
                                  </div>
                                  <div>
                                    <label className="text-gray-300 text-sm font-medium">Source</label>
                                    <p className="text-white">{selectedSubmission.source}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-gray-300 text-sm font-medium">Message</label>
                                  <p className="text-white bg-gray-700 p-3 rounded mt-1 whitespace-pre-wrap">
                                    {selectedSubmission.message}
                                  </p>
                                </div>
                                <div className="flex gap-2 pt-4">
                                  {selectedSubmission.status === 'new' && (
                                    <Button
                                      onClick={() => updateSubmissionStatus(selectedSubmission.id, 'responded')}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Mark as Responded
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    onClick={() => updateSubmissionStatus(selectedSubmission.id, 'archived')}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                  >
                                    <Archive className="w-4 h-4 mr-2" />
                                    Archive
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {submission.status === 'new' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateSubmissionStatus(submission.id, 'responded')}
                            className="border-green-600 text-green-400 hover:bg-green-900"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
