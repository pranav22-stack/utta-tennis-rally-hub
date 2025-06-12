
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
      // Get all players who have registered for this event
      const { data: registeredPlayers, error: registeredError } = await supabase
        .from('tbl_partners')
        .select(`
          user_id,
          partner_id,
          tbl_players!inner(id, name)
        `)
        .eq('event_name', eventName);

      if (registeredError) {
        console.error('Error fetching registered players:', registeredError);
        setAvailablePartners([]);
        return;
      }

      // Get all player IDs who already have partners (either as user_id with partner_id or as partner_id)
      const playersWithPartners = new Set();
      registeredPlayers?.forEach(entry => {
        if (entry.partner_id) {
          playersWithPartners.add(entry.user_id);
          playersWithPartners.add(entry.partner_id);
        }
      });

      // Filter out players who already have partners
      const availablePlayers = registeredPlayers?.filter(entry => 
        !playersWithPartners.has(entry.user_id)
      ) || [];

      console.log('Available partners for', eventName, ':', availablePlayers);
      setAvailablePartners(availablePlayers);
    } catch (error) {
      console.error('Error in fetchAvailablePartners:', error);
      setAvailablePartners([]);
    }
  };

  return { availablePartners };
};
