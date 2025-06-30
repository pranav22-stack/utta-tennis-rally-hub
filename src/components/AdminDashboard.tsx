import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ArrowLeft, LogOut, Trash2, UserPlus, Database, Search } from "lucide-react";
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
  const [allPlayers, setAllPlayers] = useState<any[]>([]);
  const [rankings, setRankings] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'rankings' | 'players'>('rankings');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
    fetchAllPlayers();
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

  const fetchAllPlayers = async () => {
    const { data, error } = await supabase
      .from('tbl_players')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching players:', error);
    } else {
      setAllPlayers(data || []);
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
      // Filter out duplicate teams - only show each team once
      const uniqueTeams = new Map();
      const filteredData = data?.filter(pair => {
        if (!pair.partner_id) return true; // Show incomplete pairs
        
        const teamKey = [pair.user_id, pair.partner_id].sort().join('-');
        if (uniqueTeams.has(teamKey)) {
          return false; // Skip duplicate team
        }
        uniqueTeams.set(teamKey, true);
        return true;
      }) || [];

      setEventPairs(filteredData);
      const initialRankings: { [key: string]: string } = {};
      filteredData?.forEach(pair => {
        if (pair.ranking) {
          initialRankings[pair.id] = pair.ranking.toString();
        }
      });
      setRankings(initialRankings);
    }
  };

  const handleRankingChange = (pairId: string, ranking: string) => {
    const numRanking = parseInt(ranking);
    const maxRanking = eventPairs.length;
    
    if (numRanking < 1) {
      toast({
        title: "Invalid Ranking",
        description: "Ranking cannot be less than 1",
        variant: "destructive",
      });
      return;
    }
    
    if (numRanking > maxRanking) {
      toast({
        title: "Invalid Ranking",
        description: `Ranking cannot exceed ${maxRanking} (total pairs in event)`,
        variant: "destructive",
      });
      return;
    }

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
      
      fetchEventPairs();
    } catch (error) {
      console.error('Error updating rankings:', error);
      toast({
        title: "Error",
        description: "Failed to update rankings",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlayer = async (playerId: string, playerName: string) => {
    if (!confirm(`Are you sure you want to delete ${playerName}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(playerId);

    try {
      console.log('Starting delete process for player:', playerId);
      
      // First delete from partners table
      const { error: partnersError } = await supabase
        .from('tbl_partners')
        .delete()
        .or(`user_id.eq.${playerId},partner_id.eq.${playerId}`);

      if (partnersError) {
        console.error('Error deleting from partners:', partnersError);
        throw partnersError;
      }

      // Then delete from players table
      const { error: playerError } = await supabase
        .from('tbl_players')
        .delete()
        .eq('id', playerId);

      if (playerError) {
        console.error('Error deleting player:', playerError);
        throw playerError;
      }

      console.log('Player deleted successfully');
      
      toast({
        title: "Success",
        description: `${playerName} has been deleted successfully`,
      });

      // Refresh data immediately
      await fetchAllPlayers();
      if (selectedEvent) {
        await fetchEventPairs();
      }
    } catch (error) {
      console.error('Error deleting player:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${playerName}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm("Are you sure you want to clear the entire database? This will delete all players and registrations. This action cannot be undone.")) {
      return;
    }

    if (!confirm("This will permanently delete ALL data. Are you absolutely sure?")) {
      return;
    }

    try {
      console.log('Starting database clear process');
      
      // Delete all partners first
      const { error: partnersError } = await supabase
        .from('tbl_partners')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (partnersError) {
        console.error('Error clearing partners:', partnersError);
        throw partnersError;
      }

      // Then delete all players
      const { error: playersError } = await supabase
        .from('tbl_players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (playersError) {
        console.error('Error clearing players:', playersError);
        throw playersError;
      }

      console.log('Database cleared successfully');

      toast({
        title: "Success",
        description: "Database cleared successfully",
      });

      // Refresh all data
      await fetchAllPlayers();
      setEventPairs([]);
      setRankings({});
    } catch (error) {
      console.error('Error clearing database:', error);
      toast({
        title: "Error",
        description: "Failed to clear database. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredPlayers = allPlayers.filter(player =>
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-sky-50">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <Button
            onClick={() => setActiveTab('rankings')}
            className={`px-6 py-3 ${activeTab === 'rankings' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Tournament Rankings
          </Button>
          <Button
            onClick={() => setActiveTab('players')}
            className={`px-6 py-3 ${activeTab === 'players' 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white' 
              : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            Player Management
          </Button>
        </div>

        {activeTab === 'rankings' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
              <CardTitle className="text-2xl">Tournament Rankings Management</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
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
                  <h3 className="text-lg font-semibold mb-4">Teams for {selectedEvent}</h3>
                  
                  {eventPairs.length > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>S.No</TableHead>
                            <TableHead>Team</TableHead>
                            <TableHead>Ranking (1-{eventPairs.length})</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {eventPairs.map((pair, index) => (
                            <TableRow key={pair.id}>
                              <TableCell>{index + 1}</TableCell>
                              <TableCell className="font-medium">
                                {pair.user?.name} & {pair.partner?.name || "Partner not registered yet"}
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  max={eventPairs.length}
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
                        className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      >
                        Submit Rankings
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No teams registered for this event yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'players' && (
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
              <CardTitle className="text-2xl flex items-center">
                <UserPlus className="mr-3" />
                Player Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search players by name or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={handleClearDatabase}
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Clear Database
                </Button>
              </div>

              {/* Players Table */}
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Name</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>WhatsApp</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlayers.map((player) => (
                      <TableRow key={player.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{player.name}</TableCell>
                        <TableCell>{player.city}</TableCell>
                        <TableCell>{player.whatsapp_number}</TableCell>
                        <TableCell>{new Date(player.date_of_birth).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleDeletePlayer(player.id, player.name)}
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting === player.id}
                            className="bg-red-500 hover:bg-red-600 disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            {isDeleting === player.id ? "Deleting..." : "Delete"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No players found matching your search.</p>
                </div>
              )}

              <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong>Total Players:</strong> {allPlayers.length}</p>
                <p><strong>Filtered Results:</strong> {filteredPlayers.length}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
