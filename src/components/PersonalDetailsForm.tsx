
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { PlayerData } from "./RegistrationForm";

interface PersonalDetailsFormProps {
  initialData: PlayerData;
  onSubmit: (data: PlayerData) => void;
}

export const PersonalDetailsForm = ({ initialData, onSubmit }: PersonalDetailsFormProps) => {
  const [formData, setFormData] = useState<PlayerData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof PlayerData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
        <Input
          id="whatsapp"
          type="tel"
          value={formData.whatsapp_number}
          onChange={(e) => updateField('whatsapp_number', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="dob">Date of Birth *</Label>
        <Input
          id="dob"
          type="date"
          value={formData.date_of_birth}
          onChange={(e) => updateField('date_of_birth', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => updateField('city', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="shirt_size">Shirt Size *</Label>
          <Select value={formData.shirt_size} onValueChange={(value) => updateField('shirt_size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="short_size">Short Size *</Label>
          <Select value={formData.short_size} onValueChange={(value) => updateField('short_size', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="food_pref">Food Preference *</Label>
        <Select value={formData.food_preference} onValueChange={(value) => updateField('food_preference', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Vegetarian">Vegetarian</SelectItem>
            <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
            <SelectItem value="Vegan">Vegan</SelectItem>
            <SelectItem value="Jain">Jain</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="stay"
          checked={formData.accommodation_needed}
          onCheckedChange={(checked) => updateField('accommodation_needed', checked as boolean)}
        />
        <Label htmlFor="stay">I need accommodation</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="fee_paid"
          checked={formData.fee_paid}
          onCheckedChange={(checked) => updateField('fee_paid', checked as boolean)}
        />
        <Label htmlFor="fee_paid">Fee has been paid</Label>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
        Next: Event Selection
      </Button>
    </form>
  );
};
