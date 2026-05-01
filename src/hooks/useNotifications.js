import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    try {
      const q = query(
        collection(db, 'notifications'),
        orderBy('sentAt', 'desc'),
        limit(20)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setNotifications(items);
        const unreadCount = items.filter(n => !n.read).length;
        setUnread(unreadCount);

        // Show latest notification as popup
        if (items.length > 0 && !items[0].read) {
          const latestNotif = items[0];
          // Only show if it was sent in the last 24 hours
          if (latestNotif.sentAt) {
            const sentTime = latestNotif.sentAt.toDate ? latestNotif.sentAt.toDate() : new Date(latestNotif.sentAt);
            const hoursDiff = (Date.now() - sentTime.getTime()) / (1000 * 60 * 60);
            if (hoursDiff < 24) {
              setLatest(latestNotif);
            }
          }
        }
      }, (error) => {
        console.log('Notifications offline');
      });

      return () => unsub();
    } catch (e) {
      console.log('Notifications not available');
    }
  }, []);

  const dismissLatest = () => setLatest(null);

  return { notifications, unread, latest, dismissLatest };
}
