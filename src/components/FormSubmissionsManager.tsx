
import { useState, useEffect } from "react";
import { Mail, Phone, Calendar, Eye, CheckCircle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
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

  useEffect(() => {
    fetchSubmissions();
  }, []);

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
        <CardTitle className="text-white flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Form Submissions ({submissions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No form submissions yet.
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
                {submissions.map((submission) => (
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
