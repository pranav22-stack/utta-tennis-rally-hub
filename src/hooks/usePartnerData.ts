
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePartnerData = (eventName: string) => {
  const [availablePartners, setAvailablePartners] = useState<any[]>([]);

  useEffect(() => {
    if (eventName) {
      fetchAvailablePartners(eventName);
    } else {
      setAvailablePartners([]);
    }
  }, [eventName]);

  const fetchAvailablePartners = async (eventName: string) => {
    try {
      console.log('Fetching partners for event:', eventName);
      
      // Get all players who have registered for this event
      const { data: registeredEntries, error: registeredError } = await supabase
        .from('registrations')
        .select(`
          player_id,
          partner_id,
          players!registrations_player_id_fkey(id, name)
        `)
        .eq('event_name', eventName);

      if (registeredError) {
        console.error('Error fetching registered players:', registeredError);
        setAvailablePartners([]);
        return;
      }

      console.log('Registered entries:', registeredEntries);

      if (!registeredEntries || registeredEntries.length === 0) {
        console.log('No registered entries found');
        setAvailablePartners([]);
        return;
      }

      // Get all player IDs who already have partners
      const playersWithPartners = new Set();
      registeredEntries.forEach(entry => {
        if (entry.partner_id) {
          playersWithPartners.add(entry.player_id);
          playersWithPartners.add(entry.partner_id);
        }
      });

      console.log('Players with partners:', Array.from(playersWithPartners));

      // Filter out players who already have partners, keeping only those without partners
      const availablePlayers = registeredEntries
        .filter(entry => !playersWithPartners.has(entry.player_id))
        .map(entry => ({
          user_id: entry.player_id,
          tbl_players: entry.players
        }));

      console.log('Available partners for', eventName, ':', availablePlayers);
      setAvailablePartners(availablePlayers);
    } catch (error) {
      console.error('Error in fetchAvailablePartners:', error);
      setAvailablePartners([]);
    }
  };

  return { availablePartners };
};
