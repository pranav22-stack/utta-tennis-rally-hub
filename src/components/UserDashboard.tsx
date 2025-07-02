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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserEvents();
  }, [user.id]);

  const fetchUserEvents = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching events for user:', user.id);
      
      const { data, error } = await supabase
        .from('tbl_partners')
        .select(`
          *,
          partner:tbl_players!tbl_partners_partner_id_fkey(name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user events:', error);
        toast({
          title: "Error",
          description: "Failed to load your registered events",
          variant: "destructive",
        });
      } else {
        console.log('User events data:', data);
        setUserEvents(data || []);
      }
    } catch (error) {
      console.error('Error in fetchUserEvents:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while loading events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      console.log('Updating events with data:', eventData);
      
      // Delete existing entries for this user
      const { error: deleteError } = await supabase
        .from('tbl_partners')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting existing entries:', deleteError);
        throw deleteError;
      }

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
        const { error: insertError } = await supabase
          .from('tbl_partners')
          .insert(partnerEntries);

        if (insertError) {
          console.error('Error inserting new entries:', insertError);
          throw insertError;
        }
      }

      toast({
        title: "Success",
        description: "Event selections updated successfully",
      });
      setEditMode(null);
      await fetchUserEvents(); // Refresh the events list
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: "Failed to update event selections",
        variant: "destructive",
      });
    }
  };

  // Convert userEvents to EventData format for the EventSelectionForm
  const getInitialEventData = (): EventData => {
    const eventData: EventData = {
      event1: "",
      partner1: "",
      event2: "",
      partner2: "",
    };

    if (userEvents.length > 0) {
      eventData.event1 = userEvents[0].event_name;
      eventData.partner1 = userEvents[0].partner_id || "Partner not registered yet";
    }

    if (userEvents.length > 1) {
      eventData.event2 = userEvents[1].event_name;
      eventData.partner2 = userEvents[1].partner_id || "Partner not registered yet";
    }

    return eventData;
  };

  if (editMode === 'personal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setEditMode(null)} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Edit Personal Details</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-xl border-0">
            <CardContent className="p-6 bg-white/90 backdrop-blur-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setEditMode(null)} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Edit Event Selections</h1>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto shadow-xl border-0">
            <CardContent className="p-6 bg-white/90 backdrop-blur-sm">
              <EventSelectionForm
                onSubmit={handleEventUpdate}
                onBack={() => setEditMode(null)}
                isSubmitting={false}
                initialData={getInitialEventData()}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-bold">Welcome, {user.name}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-6 bg-white/90 backdrop-blur-sm">
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
                className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Edit Personal Details
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0">
            <CardHeader className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white rounded-t-lg">
              <CardTitle>My Event Registrations</CardTitle>
            </CardHeader>
            <CardContent className="p-6 bg-white/90 backdrop-blur-sm">
              {isLoading ? (
                <p className="text-gray-500">Loading your events...</p>
              ) : userEvents.length > 0 ? (
                <div className="space-y-4">
                  {userEvents.map((event, index) => (
                    <div key={event.id} className="border rounded-lg p-4 bg-gradient-to-r from-cyan-50 to-sky-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-gray-800">{event.event_name}</h4>
                          <p className="text-gray-600 mt-1">
                            <strong>Partner:</strong> {event.partner?.name || "Partner not registered yet"}
                          </p>
                          {event.ranking && (
                            <p className="text-gray-600 mt-1">
                              <strong>Current Ranking:</strong> #{event.ranking}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">
                            Registered on: {new Date(event.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="ml-4">
                          {event.partner?.name ? (
                            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                              Team Complete
                            </span>
                          ) : (
                            <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              Waiting for Partner
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-2">Registration Summary</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Total Events:</span>
                        <span className="ml-2 font-semibold">{userEvents.length}</span>
                      </div>
                      <div>
                        <span className="text-blue-600">Complete Teams:</span>
                        <span className="ml-2 font-semibold">
                          {userEvents.filter(e => e.partner?.name).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No events registered yet</p>
                  <p className="text-sm text-gray-400">Click "Edit Event Selections" to register for events</p>
                </div>
              )}
              
              <Button 
                onClick={() => setEditMode('events')}
                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-600 hover:to-sky-600"
              >
                {userEvents.length > 0 ? 'Edit Event Selections' : 'Register for Events'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
