import { useState, useEffect } from 'react';
import { greenlinkApi, getSupabaseBrowserClient, ZeroInventoryItem, useGroupBuyStore } from '@greenlink/lib';

export function useRealtimeDeal(id: string) {
    const [item, setItem] = useState<ZeroInventoryItem | null>(null);
    const [loading, setLoading] = useState(true);
    const updateSyncData = useGroupBuyStore(state => state.updateSyncData);

    // Initial Fetch
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        greenlinkApi.getZeroInventoryItem(id).then(data => {
            if (isMounted) {
                setItem(data);
                setLoading(false);
            }
        }).catch(e => {
            // Promise가 reject되어도 loading이 true로 고착되지 않도록 방어
            console.error('[useRealtimeDeal] getZeroInventoryItem failed:', e);
            if (isMounted) setLoading(false);
        });
        return () => { isMounted = false; };
    }, [id]);

    // Realtime Subscription
    useEffect(() => {
        if (!item || !id) return;

        // Skip realtime if it's a Mock ID (e.g., 'orc-1')
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        if (!isUuid) return;

        const sbClient = getSupabaseBrowserClient();

        const channel = sbClient
            .channel(`realtime:deal:${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'zero_inventory_items',
                    filter: `id=eq.${id}`
                },
                (payload) => {
                    console.log('🟢 Realtime Update Received:', payload.new);
                    // 1. Local state (Product detail page)
                    setItem((prev) => {
                        if (!prev) return prev;
                        return {
                            ...prev,
                            currentParticipants: payload.new.current_participants,
                            status: payload.new.status,
                        };
                    });
                    // 2. Global state (Group buy list)
                    updateSyncData(id, payload.new.current_participants, payload.new.status);
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`📡 Successfully subscribed to Realtime channel for deal: ${id}`);
                }
            });

        return () => {
            sbClient.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, item?.id]); // depend on item?.id to ensure initial fetch happened

    return { item, loading };
}
