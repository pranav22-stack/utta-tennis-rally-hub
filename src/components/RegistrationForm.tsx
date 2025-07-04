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
  food_preference: string;
  accommodation_needed: boolean;
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
    food_preference: "",
    accommodation_needed: false,
    fee_paid: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handlePersonalDetailsSubmit = (data: PlayerData) => {
    setPlayerData(data);
    setStep(2);
  };

  const checkExistingRegistrations = async (playerId: string) => {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('player_id', playerId);

    if (error) {
      console.error('Error checking existing registrations:', error);
      return 0;
    }

    return data?.length || 0;
  };

  const handleEventSubmit = async (eventData: EventData) => {
    setIsSubmitting(true);
    try {
      // Check if player already exists
      const { data: existingPlayer, error: playerCheckError } = await supabase
        .from('players')
        .select('id')
        .eq('whatsapp_number', playerData.whatsapp_number)
        .maybeSingle();

      if (playerCheckError) {
        console.error('Error checking existing player:', playerCheckError);
        throw playerCheckError;
      }

      let playerId: string;

      if (existingPlayer) {
        // Player already exists, check their current registrations
        const existingRegistrations = await checkExistingRegistrations(existingPlayer.id);
        
        if (existingRegistrations >= 2) {
          toast({
            title: "Registration Restricted",
            description: "You have already registered for two events. Multiple registrations beyond two are not allowed.",
            variant: "destructive",
          });
          return;
        }
        
        playerId = existingPlayer.id;
        
        // Update existing player data
        const { error: updateError } = await supabase
          .from('players')
          .update(playerData)
          .eq('id', playerId);

        if (updateError) throw updateError;
      } else {
        // Insert new player data
        const { data: player, error: playerError } = await supabase
          .from('players')
          .insert([playerData])
          .select()
          .single();

        if (playerError) throw playerError;
        playerId = player.id;
      }

      console.log('Player processed:', playerId);

      // Count how many events are being registered
      const eventsToRegister = [];
      if (eventData.event1) eventsToRegister.push('event1');
      if (eventData.event2) eventsToRegister.push('event2');

      // Check if adding these events would exceed the limit
      const currentRegistrations = await checkExistingRegistrations(playerId);
      if (currentRegistrations + eventsToRegister.length > 2) {
        toast({
          title: "Registration Restricted",
          description: "You have already registered for two events. Multiple registrations beyond two are not allowed.",
          variant: "destructive",
        });
        return;
      }

      // Insert registrations
      const registrationEntries = [];
      
      if (eventData.event1) {
        registrationEntries.push({
          event_name: eventData.event1,
          player_id: playerId,
          partner_id: eventData.partner1 === "Partner not registered yet" ? null : eventData.partner1,
        });
      }
      
      if (eventData.event2) {
        registrationEntries.push({
          event_name: eventData.event2,
          player_id: playerId,
          partner_id: eventData.partner2 === "Partner not registered yet" ? null : eventData.partner2,
        });
      }

      if (registrationEntries.length > 0) {
        const { error: registrationsError } = await supabase
          .from('registrations')
          .insert(registrationEntries);

        if (registrationsError) throw registrationsError;
      }

      // Update existing registrations if partners were selected
      if (eventData.partner1 && eventData.partner1 !== "Partner not registered yet") {
        await supabase
          .from('registrations')
          .update({ partner_id: playerId })
          .eq('player_id', eventData.partner1)
          .eq('event_name', eventData.event1)
          .is('partner_id', null);
      }

      if (eventData.partner2 && eventData.partner2 !== "Partner not registered yet") {
        await supabase
          .from('registrations')
          .update({ partner_id: playerId })
          .eq('player_id', eventData.partner2)
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
