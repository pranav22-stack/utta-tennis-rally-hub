
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
      // Check if player already exists by WhatsApp number
      const { data: existingPlayer, error: checkError } = await supabase
        .from('tbl_players')
        .select('id')
        .eq('whatsapp_number', playerData.whatsapp_number)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing player:', checkError);
        throw checkError;
      }

      if (existingPlayer) {
        // Check if this player already has any event registrations
        const { data: existingRegistrations, error: regError } = await supabase
          .from('tbl_partners')
          .select('id')
          .eq('user_id', existingPlayer.id);

        if (regError) {
          console.error('Error checking existing registrations:', regError);
          throw regError;
        }

        if (existingRegistrations && existingRegistrations.length > 0) {
          toast({
            title: "Registration Not Allowed",
            description: "You have already registered for an event. Multiple registrations are not allowed.",
            variant: "destructive",
          });
          return;
        }
      }

      // Insert player data
      const { data: player, error: playerError } = await supabase
        .from('tbl_players')
        .insert([playerData])
        .select()
        .single();

      if (playerError) throw playerError;

      console.log('Player created:', player);

      // Only allow registration for ONE event (restrict to event1 only)
      if (eventData.event1) {
        const { error: partnersError } = await supabase
          .from('tbl_partners')
          .insert([{
            event_name: eventData.event1,
            user_id: player.id,
            partner_id: eventData.partner1 === "Partner not registered yet" ? null : eventData.partner1,
          }]);

        if (partnersError) throw partnersError;

        // Update existing partner entries if partner was selected
        if (eventData.partner1 && eventData.partner1 !== "Partner not registered yet") {
          await supabase
            .from('tbl_partners')
            .update({ partner_id: player.id })
            .eq('user_id', eventData.partner1)
            .eq('event_name', eventData.event1)
            .is('partner_id', null);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-bold">Tournament Registration</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl">
              Step {step} of 2: {step === 1 ? "Personal Details" : "Event Selection"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-white/90 backdrop-blur-sm">
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
