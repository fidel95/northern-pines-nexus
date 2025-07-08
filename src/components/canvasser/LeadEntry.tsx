import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, User, Phone, Mail, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";

export const LeadEntry = () => {
  const { canvasser } = useCanvasserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
    result: "interested"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canvasser) return;

    setIsSubmitting(true);
    try {
      // Create lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service: formData.service,
          message: formData.message,
          canvasser_id: canvasser.id,
          status: 'New'
        })
        .select()
        .single();

      if (leadError) throw leadError;

      // Create canvassing activity
      const { error: activityError } = await supabase
        .from('canvassing_activities')
        .insert({
          canvasser_id: canvasser.id,
          address: formData.address,
          result: formData.result,
          notes: `Lead generated: ${formData.name} - ${formData.service}`,
          requires_followup: formData.result === 'interested'
        });

      if (activityError) throw activityError;

      // Update canvasser stats
      const { error: updateError } = await supabase
        .from('canvassers')
        .update({
          total_visits: canvasser.total_visits + 1,
          leads_generated: canvasser.leads_generated + 1
        })
        .eq('id', canvasser.id);

      if (updateError) throw updateError;

      toast({
        title: "Lead Submitted",
        description: "Lead has been successfully recorded.",
      });

      // Reset form
      setFormData({
        address: "",
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
        result: "interested"
      });

    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit lead. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Add New Lead
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-gray-300">Address Visited</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="123 Main Street, City"
                className="pl-10 bg-gray-800 border-blue-700 text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name" className="text-gray-300">Contact Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="John Doe"
                className="pl-10 bg-gray-800 border-blue-700 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com"
                  className="pl-10 bg-gray-800 border-blue-700 text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-300">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="pl-10 bg-gray-800 border-blue-700 text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="service" className="text-gray-300">Service Interest</Label>
            <Select 
              value={formData.service} 
              onValueChange={(value) => setFormData({...formData, service: value})}
            >
              <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="roofing">Roofing</SelectItem>
                <SelectItem value="siding">Siding</SelectItem>
                <SelectItem value="windows">Windows</SelectItem>
                <SelectItem value="gutters">Gutters</SelectItem>
                <SelectItem value="general">General Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="result" className="text-gray-300">Visit Result</Label>
            <Select 
              value={formData.result} 
              onValueChange={(value) => setFormData({...formData, result: value})}
            >
              <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="not_interested">Not Interested</SelectItem>
                <SelectItem value="no_answer">No Answer</SelectItem>
                <SelectItem value="callback_requested">Callback Requested</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message" className="text-gray-300">Notes/Message</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Additional notes about the visit..."
              className="bg-gray-800 border-blue-700 text-white"
              rows={3}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </div>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Submit Lead
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};