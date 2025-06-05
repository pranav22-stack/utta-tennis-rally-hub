
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

export const AdminDashboard = ({ onBack, onLogout }: AdminDashboardProps) => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [eventPairs, setEventPairs] = useState<any[]>([]);
  const [rankings, setRankings] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchEventPairs();
    }
  }, [selectedEvent]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('tbl_eventname')
      .select('*')
      .order('event_name');

    if (error) {
      console.error('Error fetching events:', error);
    } else {
      setEvents(data || []);
    }
  };

  const fetchEventPairs = async () => {
    const { data, error } = await supabase
      .from('tbl_partners')
      .select(`
        *,
        user:tbl_players!tbl_partners_user_id_fkey(name),
        partner:tbl_players!tbl_partners_partner_id_fkey(name)
      `)
      .eq('event_name', selectedEvent)
      .order('ranking', { ascending: true, nullsFirst: false });

    if (error) {
      console.error('Error fetching event pairs:', error);
    } else {
      setEventPairs(data || []);
      // Initialize rankings state
      const initialRankings: { [key: string]: string } = {};
      data?.forEach(pair => {
        if (pair.ranking) {
          initialRankings[pair.id] = pair.ranking.toString();
        }
      });
      setRankings(initialRankings);
    }
  };

  const handleRankingChange = (pairId: string, ranking: string) => {
    setRankings(prev => ({
      ...prev,
      [pairId]: ranking
    }));
  };

  const handleSubmitRankings = async () => {
    try {
      const updates = Object.entries(rankings).map(([pairId, ranking]) => ({
        id: pairId,
        ranking: ranking ? parseInt(ranking) : null
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('tbl_partners')
          .update({ ranking: update.ranking })
          .eq('id', update.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Rankings updated successfully",
      });
      
      fetchEventPairs(); // Refresh the data
    } catch (error) {
      console.error('Error updating rankings:', error);
      toast({
        title: "Error",
        description: "Failed to update rankings",
        variant: "destructive",
      });
    }
  };

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
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-green-700">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Tournament Rankings Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Event</label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose an event to manage rankings" />
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

            {selectedEvent && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pairs for {selectedEvent}</h3>
                
                {eventPairs.length > 0 ? (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>S.No</TableHead>
                          <TableHead>Player 1</TableHead>
                          <TableHead>Player 2</TableHead>
                          <TableHead>Ranking</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {eventPairs.map((pair, index) => (
                          <TableRow key={pair.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{pair.user?.name}</TableCell>
                            <TableCell>{pair.partner?.name || "Partner not registered yet"}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={rankings[pair.id] || ""}
                                onChange={(e) => handleRankingChange(pair.id, e.target.value)}
                                placeholder="Enter ranking"
                                className="w-24"
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <Button 
                      onClick={handleSubmitRankings}
                      className="mt-4 bg-green-600 hover:bg-green-700"
                    >
                      Submit Rankings
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-500">No pairs registered for this event yet.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
