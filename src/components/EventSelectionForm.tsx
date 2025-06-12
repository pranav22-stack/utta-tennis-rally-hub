import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { EventData } from "./RegistrationForm";
import { useToast } from "@/hooks/use-toast";

interface EventSelectionFormProps {
  onSubmit: (data: EventData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export const EventSelectionForm = ({ onSubmit, onBack, isSubmitting }: EventSelectionFormProps) => {
  const [eventData, setEventData] = useState<EventData>({
    event1: "",
    partner1: "",
    event2: "",
    partner2: "",
  });
  const [events, setEvents] = useState<any[]>([]);
  const [availablePartners1, setAvailablePartners1] = useState<any[]>([]);
  const [availablePartners2, setAvailablePartners2] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventData.event1) {
      fetchAvailablePartners(eventData.event1, setAvailablePartners1);
    }
  }, [eventData.event1]);

  useEffect(() => {
    if (eventData.event2) {
      fetchAvailablePartners(eventData.event2, setAvailablePartners2);
    }
  }, [eventData.event2]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('tbl_eventname')
      .select('*')
      .order('event_name');

    if (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
  };

  const fetchAvailablePartners = async (eventName: string, setter: (partners: any[]) => void) => {
    try {
      // Get all players who have registered for this event
      const { data: registeredPlayers, error: registeredError } = await supabase
        .from('tbl_partners')
        .select(`
          user_id,
          partner_id,
          tbl_players!inner(id, name)
        `)
        .eq('event_name', eventName);

      if (registeredError) {
        console.error('Error fetching registered players:', registeredError);
        setter([]);
        return;
      }

      // Get all player IDs who already have partners (either as user_id with partner_id or as partner_id)
      const playersWithPartners = new Set();
      registeredPlayers?.forEach(entry => {
        if (entry.partner_id) {
          playersWithPartners.add(entry.user_id);
          playersWithPartners.add(entry.partner_id);
        }
      });

      // Filter out players who already have partners
      const availablePlayers = registeredPlayers?.filter(entry => 
        !playersWithPartners.has(entry.user_id)
      ) || [];

      console.log('Available partners for', eventName, ':', availablePlayers);
      setter(availablePlayers);
    } catch (error) {
      console.error('Error in fetchAvailablePartners:', error);
      setter([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.event1 && !eventData.event2) {
      toast({
        title: "Error",
        description: "Please select at least one event",
        variant: "destructive",
      });
      return;
    }

    if (eventData.event1 === eventData.event2 && eventData.event1) {
      toast({
        title: "Error",
        description: "Please select different events",
        variant: "destructive",
      });
      return;
    }

    onSubmit(eventData);
  };

  const updateField = (field: keyof EventData, value: string) => {
    setEventData(prev => ({ ...prev, [field]: value }));
    
    // Clear partner selection if event is changed
    if (field === 'event1') {
      setEventData(prev => ({ ...prev, partner1: "" }));
    }
    if (field === 'event2') {
      setEventData(prev => ({ ...prev, partner2: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-lg">Event 1</h3>
        
        <div>
          <Label htmlFor="event1">Select Event</Label>
          <Select value={eventData.event1} onValueChange={(value) => updateField('event1', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.event_name}>
                  {event.event_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {eventData.event1 && (
          <div>
            <Label htmlFor="partner1">Select Partner</Label>
            <Select value={eventData.partner1} onValueChange={(value) => updateField('partner1', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Partner not registered yet">Partner not registered yet</SelectItem>
                {availablePartners1.map((partner) => (
                  <SelectItem key={partner.user_id} value={partner.user_id}>
                    {partner.tbl_players.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-lg">Event 2 (Optional)</h3>
        
        <div>
          <Label htmlFor="event2">Select Event</Label>
          <Select value={eventData.event2} onValueChange={(value) => updateField('event2', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {events
                .filter(event => event.event_name !== eventData.event1)
                .map((event) => (
                <SelectItem key={event.id} value={event.event_name}>
                  {event.event_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {eventData.event2 && (
          <div>
            <Label htmlFor="partner2">Select Partner</Label>
            <Select value={eventData.partner2} onValueChange={(value) => updateField('partner2', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Partner not registered yet">Partner not registered yet</SelectItem>
                {availablePartners2.map((partner) => (
                  <SelectItem key={partner.user_id} value={partner.user_id}>
                    {partner.tbl_players.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button 
          type="submit" 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
};
