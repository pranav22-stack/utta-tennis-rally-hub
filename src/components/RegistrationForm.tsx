
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { EventSelectionForm } from "./EventSelectionForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RegistrationFormProps {
  onBack: () => void;
}

export interface PlayerData {
  name: string;
  whatsapp_number: string;
  date_of_birth: string;
  city: string;
  shirt_size: string;
  short_size: string;
  food_pref: string;
  stay_y_or_n: boolean;
  fee_paid: boolean;
}

export interface EventData {
  event1: string;
  partner1: string;
  event2: string;
  partner2: string;
}

export const RegistrationForm = ({ onBack }: RegistrationFormProps) => {
  const [step, setStep] = useState(1);
  const [playerData, setPlayerData] = useState<PlayerData>({
    name: "",
    whatsapp_number: "",
    date_of_birth: "",
    city: "",
    shirt_size: "",
    short_size: "",
    food_pref: "",
    stay_y_or_n: false,
    fee_paid: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePersonalDetailsSubmit = (data: PlayerData) => {
    setPlayerData(data);
    setStep(2);
  };

  const handleEventSubmit = async (eventData: EventData) => {
    setIsSubmitting(true);
    try {
      // Insert player data
      const { data: player, error: playerError } = await supabase
        .from('tbl_players')
        .insert([playerData])
        .select()
        .single();

      if (playerError) throw playerError;

      console.log('Player created:', player);

      // Insert partner entries
      const partnerEntries = [];
      
      if (eventData.event1) {
        partnerEntries.push({
          event_name: eventData.event1,
          user_id: player.id,
          partner_id: eventData.partner1 === "Partner not registered yet" ? null : eventData.partner1,
        });
      }
      
      if (eventData.event2) {
        partnerEntries.push({
          event_name: eventData.event2,
          user_id: player.id,
          partner_id: eventData.partner2 === "Partner not registered yet" ? null : eventData.partner2,
        });
      }

      if (partnerEntries.length > 0) {
        const { error: partnersError } = await supabase
          .from('tbl_partners')
          .insert(partnerEntries);

        if (partnersError) throw partnersError;
      }

      // Update existing partner entries if partners were selected
      if (eventData.partner1 && eventData.partner1 !== "Partner not registered yet") {
        await supabase
          .from('tbl_partners')
          .update({ partner_id: player.id })
          .eq('user_id', eventData.partner1)
          .eq('event_name', eventData.event1)
          .is('partner_id', null);
      }

      if (eventData.partner2 && eventData.partner2 !== "Partner not registered yet") {
        await supabase
          .from('tbl_partners')
          .update({ partner_id: player.id })
          .eq('user_id', eventData.partner2)
          .eq('event_name', eventData.event2)
          .is('partner_id', null);
      }

      toast({
        title: "Registration Successful!",
        description: "You have been successfully registered for the tournament.",
      });

      onBack();
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error during registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-green-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Tournament Registration</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">
              Step {step} of 2: {step === 1 ? "Personal Details" : "Event Selection"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <PersonalDetailsForm
                initialData={playerData}
                onSubmit={handlePersonalDetailsSubmit}
              />
            ) : (
              <EventSelectionForm
                onSubmit={handleEventSubmit}
                onBack={() => setStep(1)}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
