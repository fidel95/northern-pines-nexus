
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCanvasserAuth } from "@/contexts/CanvasserAuthContext";

export const ActivityLogger = () => {
  const { canvasser } = useCanvasserAuth();
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [result, setResult] = useState("");
  const [notes, setNotes] = useState("");
  const [requiresFollowup, setRequiresFollowup] = useState(false);
  const [followupPriority, setFollowupPriority] = useState("1");
  const [loading, setLoading] = useState(false);

  const resultOptions = [
    { value: "not_interested", label: "Not Interested" },
    { value: "maybe", label: "Maybe Later" },
    { value: "callback", label: "Call Back" },
    { value: "interested", label: "Interested" },
    { value: "no_answer", label: "No Answer" },
    { value: "not_home", label: "Not Home" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canvasser || !address.trim() || !result) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('canvassing_activities' as any)
        .insert([{
          canvasser_id: canvasser.id,
          address: address.trim(),
          zip_code: zipCode.trim() || null,
          result,
          notes: notes.trim() || null,
          requires_followup: requiresFollowup,
          followup_priority: requiresFollowup ? parseInt(followupPriority) : null,
          visit_date: new Date().toISOString()
        }]);

      if (error) throw error;

      // Reset form
      setAddress("");
      setZipCode("");
      setResult("");
      setNotes("");
      setRequiresFollowup(false);
      setFollowupPriority("1");

      toast({
        title: "Activity Logged",
        description: "Your visit has been recorded successfully",
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
          <MapPin className="w-5 h-5 text-blue-400" />
          Log Visit Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="address" className="text-gray-300">Address *</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St, City, State"
              className="bg-gray-800 border-blue-700 text-white"
              required
            />
          </div>

          <div>
            <Label htmlFor="zipCode" className="text-gray-300">ZIP Code</Label>
            <Input
              id="zipCode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="12345"
              className="bg-gray-800 border-blue-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="result" className="text-gray-300">Visit Result *</Label>
            <Select value={result} onValueChange={setResult} required>
              <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                <SelectValue placeholder="Select outcome..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-blue-700">
                {resultOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes" className="text-gray-300">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details about the visit..."
              className="bg-gray-800 border-blue-700 text-white"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="followup"
              checked={requiresFollowup}
              onCheckedChange={setRequiresFollowup}
              className="border-blue-700"
            />
            <Label htmlFor="followup" className="text-gray-300">
              Requires Follow-up
            </Label>
          </div>

          {requiresFollowup && (
            <div>
              <Label htmlFor="priority" className="text-gray-300">Follow-up Priority</Label>
              <Select value={followupPriority} onValueChange={setFollowupPriority}>
                <SelectTrigger className="bg-gray-800 border-blue-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-blue-700">
                  <SelectItem value="1" className="text-white">Low (1)</SelectItem>
                  <SelectItem value="2" className="text-white">Medium (2)</SelectItem>
                  <SelectItem value="3" className="text-white">High (3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Saving..." : "Log Activity"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
