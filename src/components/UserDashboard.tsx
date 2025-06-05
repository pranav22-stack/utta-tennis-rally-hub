
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, LogOut } from "lucide-react";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { EventSelectionForm } from "./EventSelectionForm";
import { PlayerData, EventData } from "./RegistrationForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserDashboardProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

export const UserDashboard = ({ user, onBack, onLogout }: UserDashboardProps) => {
  const [editMode, setEditMode] = useState<'personal' | 'events' | null>(null);
  const [userEvents, setUserEvents] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserEvents();
  }, [user.id]);

  const fetchUserEvents = async () => {
    const { data, error } = await supabase
      .from('tbl_partners')
      .select(`
        *,
        partner:tbl_players!tbl_partners_partner_id_fkey(name)
      `)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching user events:', error);
    } else {
      setUserEvents(data || []);
    }
  };

  const handlePersonalDetailsUpdate = async (data: PlayerData) => {
    try {
      const { error } = await supabase
        .from('tbl_players')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Personal details updated successfully",
      });
      setEditMode(null);
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update personal details",
        variant: "destructive",
      });
    }
  };

  const handleEventUpdate = async (eventData: EventData) => {
    try {
      // Delete existing entries
      await supabase
        .from('tbl_partners')
        .delete()
        .eq('user_id', user.id);

      // Insert new entries
      const partnerEntries = [];
      
      if (eventData.event1) {
        partnerEntries.push({
          event_name: eventData.event1,
          user_id: user.id,
          partner_id: eventData.partner1 === "Partner not registered yet" ? null : eventData.partner1,
        });
      }
      
      if (eventData.event2) {
        partnerEntries.push({
          event_name: eventData.event2,
          user_id: user.id,
          partner_id: eventData.partner2 === "Partner not registered yet" ? null : eventData.partner2,
        });
      }

      if (partnerEntries.length > 0) {
        const { error } = await supabase
          .from('tbl_partners')
          .insert(partnerEntries);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Event selections updated successfully",
      });
      setEditMode(null);
      fetchUserEvents();
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update event selections",
        variant: "destructive",
      });
    }
  };

  if (editMode === 'personal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="bg-green-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setEditMode(null)} className="text-white hover:bg-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Edit Personal Details</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <PersonalDetailsForm
                initialData={user}
                onSubmit={handlePersonalDetailsUpdate}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (editMode === 'events') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        <div className="bg-green-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setEditMode(null)} className="text-white hover:bg-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Edit Event Selections</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <EventSelectionForm
                onSubmit={handleEventUpdate}
                onBack={() => setEditMode(null)}
                isSubmitting={false}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="bg-green-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-green-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-green-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>WhatsApp:</strong> {user.whatsapp_number}</p>
              <p><strong>Date of Birth:</strong> {user.date_of_birth}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Shirt Size:</strong> {user.shirt_size}</p>
              <p><strong>Short Size:</strong> {user.short_size}</p>
              <p><strong>Food Preference:</strong> {user.food_pref}</p>
              <p><strong>Accommodation:</strong> {user.stay_y_or_n ? 'Yes' : 'No'}</p>
              <p><strong>Fee Paid:</strong> {user.fee_paid ? 'Yes' : 'No'}</p>
              <Button 
                onClick={() => setEditMode('personal')}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
              >
                Edit Personal Details
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {userEvents.length > 0 ? (
                <div className="space-y-3">
                  {userEvents.map((event, index) => (
                    <div key={event.id} className="border rounded p-3">
                      <p><strong>Event:</strong> {event.event_name}</p>
                      <p><strong>Partner:</strong> {event.partner?.name || 'Partner not registered yet'}</p>
                      {event.ranking && <p><strong>Ranking:</strong> {event.ranking}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No events registered</p>
              )}
              <Button 
                onClick={() => setEditMode('events')}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
              >
                Edit Event Selections
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
