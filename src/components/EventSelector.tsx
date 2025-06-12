
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EventSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  events: any[];
  excludeEvent?: string;
  placeholder?: string;
}

export const EventSelector = ({ 
  label, 
  value, 
  onValueChange, 
  events, 
  excludeEvent, 
  placeholder = "Select an event" 
}: EventSelectorProps) => {
  const filteredEvents = excludeEvent 
    ? events.filter(event => event.event_name !== excludeEvent)
    : events;

  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {filteredEvents.map((event) => (
            <SelectItem key={event.id} value={event.event_name}>
              {event.event_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
