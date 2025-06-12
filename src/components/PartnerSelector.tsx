
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PartnerSelectorProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  partners: any[];
  placeholder?: string;
}

export const PartnerSelector = ({ 
  label, 
  value, 
  onValueChange, 
  partners, 
  placeholder = "Select a partner" 
}: PartnerSelectorProps) => {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Partner not registered yet">Partner not registered yet</SelectItem>
          {partners.map((partner) => (
            <SelectItem key={partner.user_id} value={partner.user_id}>
              {partner.tbl_players.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
