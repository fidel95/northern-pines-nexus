
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Flag } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";

export const ActivityLogger = () => {
  const { canvasser } = useCanvasserAuth();
  const [formData, setFormData] = useState({
    address: '',
    zip_code: '',
    result: '',
    notes: '',
    requires_followup: false,
    followup_priority: 1
  });
  const [loading, setLoading] = useState(false);

  const resultOptions = [
    { value: 'Not Interested', label: 'Not Interested', color: 'bg-red-600' },
    { value: 'Maybe', label: 'Maybe', color: 'bg-yellow-600' },
    { value: 'Call Back', label: 'Call Back', color: 'bg-blue-600' },
    { value: 'Interested', label: 'Interested', color: 'bg-green-600' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canvasser || !formData.address || !formData.result) {
      toast({
        title: "Error",
        description: "Address and result are required",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('canvassing_activities')
        .insert([{
          canvasser_id: canvasser.id,
          address: formData.address,
          zip_code: formData.zip_code || null,
          result: formData.result,
          notes: formData.notes || null,
          requires_followup: formData.requires_followup,
          followup_priority: formData.followup_priority
        }]);

      if (error) throw error;

      // Reset form
      setFormData({
        address: '',
        zip_code: '',
        result: '',
        notes: '',
        requires_followup: false,
        followup_priority: 1
      });

      toast({
        title: "Activity Logged",
        description: "Visit has been recorded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log activity",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-blue-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Plus className="w-5 h-5 text-blue-400" />
          Log New Visit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Address *</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter full address"
                className="bg-gray-800 border-blue-700 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">ZIP Code</label>
              <Input
                value={formData.zip_code}
                onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
                placeholder="ZIP code"
                className="bg-gray-800 border-blue-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Visit Result *</label>
            <Select value={formData.result} onValueChange={(value) => setFormData({...formData, result: value})}>
              <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Select result" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                {resultOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${option.color}`}></div>
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Additional notes about the visit..."
              className="bg-gray-800 border-blue-700 text-white"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requires_followup"
                checked={formData.requires_followup}
                onChange={(e) => setFormData({...formData, requires_followup: e.target.checked})}
                className="rounded border-blue-700"
              />
              <label htmlFor="requires_followup" className="text-gray-300 text-sm">
                Requires Follow-up
              </label>
            </div>

            {formData.requires_followup && (
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-blue-400" />
                <Select 
                  value={formData.followup_priority.toString()} 
                  onValueChange={(value) => setFormData({...formData, followup_priority: parseInt(value)})}
                >
                  <SelectTrigger className="w-24 bg-gray-800 border-blue-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-blue-700">
                    <SelectItem value="1" className="text-white">Low</SelectItem>
                    <SelectItem value="2" className="text-white">Medium</SelectItem>
                    <SelectItem value="3" className="text-white">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Logging...' : 'Log Visit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
