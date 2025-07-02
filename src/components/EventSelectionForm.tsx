
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EventData } from "./RegistrationForm";
import { useToast } from "@/hooks/use-toast";
import { useEventData } from "@/hooks/useEventData";
import { usePartnerData } from "@/hooks/usePartnerData";
import { EventSelector } from "./EventSelector";
import { PartnerSelector } from "./PartnerSelector";

interface EventSelectionFormProps {
  onSubmit: (data: EventData) => void;
  onBack: () => void;
  isSubmitting: boolean;
  initialData?: EventData;
}

export const EventSelectionForm = ({ onSubmit, onBack, isSubmitting, initialData }: EventSelectionFormProps) => {
  const [eventData, setEventData] = useState<EventData>({
    event1: "",
    partner1: "",
    event2: "",
    partner2: "",
  });
  const { toast } = useToast();
  const { events } = useEventData();
  const { availablePartners: availablePartners1 } = usePartnerData(eventData.event1);
  const { availablePartners: availablePartners2 } = usePartnerData(eventData.event2);

  // Load initial data when component mounts or initialData changes
  useEffect(() => {
    if (initialData) {
      console.log('Loading initial event data:', initialData);
      setEventData(initialData);
    }
  }, [initialData]);

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
        
        <EventSelector
          label="Select Event"
          value={eventData.event1}
          onValueChange={(value) => updateField('event1', value)}
          events={events}
        />

        {eventData.event1 && (
          <PartnerSelector
            label="Select Partner"
            value={eventData.partner1}
            onValueChange={(value) => updateField('partner1', value)}
            partners={availablePartners1}
          />
        )}
      </div>

      <div className="border rounded-lg p-4 space-y-4">
        <h3 className="font-semibold text-lg">Event 2 (Optional)</h3>
        
        <EventSelector
          label="Select Event"
          value={eventData.event2}
          onValueChange={(value) => updateField('event2', value)}
          events={events}
          excludeEvent={eventData.event1}
        />

        {eventData.event2 && (
          <PartnerSelector
            label="Select Partner"
            value={eventData.partner2}
            onValueChange={(value) => updateField('partner2', value)}
            partners={availablePartners2}
          />
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
          {isSubmitting ? "Submitting..." : "Update Registration"}
        </Button>
      </div>
    </form>
  );
};
