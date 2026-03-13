import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { Bell, CopyCheck, Inbox } from "lucide-react";

type Notification = {
  id: string;
  user_email: string;
  title: string;
  body: string;
  read: boolean;
  type: string;
  created_at: string;
};

export default function NotificationBell() {
  const { user } = useAuth();
  const { isAdmin } = useOrganization();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAdmin || !user?.email) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from('notifications' as any)
        .select('*')
        .eq('user_email', user.email)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        setNotifications(data as any as Notification[]);
      }
    };

    fetchNotifications();

    const channel = supabase.channel(`notifications_${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_email=eq.${user.email}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as any as Notification, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => prev.map(n => n.id === payload.new.id ? payload.new as any as Notification : n));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.email, user?.id, isAdmin]);

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    await supabase
      .from('notifications' as any)
      .update({ read: true })
      .eq('id', id);
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;

    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    await supabase
      .from('notifications' as any)
      .update({ read: true })
      .in('id', unreadIds);
  };

  if (!isAdmin) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-white/5 transition-colors text-[#888] hover:text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-platform-purple ring-2 ring-[#0a0a0a] animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <h3 className="text-white font-medium">Notificações</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#888] hover:text-white flex items-center gap-1 transition-colors"
              >
                <CopyCheck className="w-3 h-3" />
                Marcar lidas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-[#555]">
                <Inbox className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map(notif => (
                  <div 
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markAsRead(notif.id);
                    }}
                    className={`p-4 transition-colors cursor-pointer hover:bg-white/[0.02] ${
                      !notif.read ? 'bg-purple-500/5' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-platform-purple' : 'bg-transparent'}`} />
                      <div>
                        <p className={`text-sm ${!notif.read ? 'text-white font-medium' : 'text-[#888]'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-[#666] mt-1 pr-2 line-clamp-2 leading-relaxed">
                          {notif.body}
                        </p>
                        <span className="text-[10px] text-[#444] mt-2 block">
                          {new Date(notif.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
