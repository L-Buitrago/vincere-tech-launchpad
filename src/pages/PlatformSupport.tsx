import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/hooks/useOrganization";
import { supabase } from "@/integrations/supabase/client";
import { Send, User, Headset, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Message = {
  id: string;
  content: string;
  is_admin: boolean;
  sender_id: string;
  sender_name: string;
  created_at: string;
};

type Conversation = {
  id: string;
  org_id: string;
  org_name: string;
  status: string;
  last_message_at: string;
};

export default function PlatformSupport() {
  const { user } = useAuth();
  const { orgId, org: organization, isAdmin } = useOrganization();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        setIsLoading(true);

        if (isAdmin) {
          const { data: convs, error } = await supabase
            .from('support_conversations' as any)
            .select('*')
            .order('last_message_at', { ascending: false });
          
          if (!error && convs) {
            setConversations(convs as any as Conversation[]);
            if (convs.length > 0) setActiveConversation(convs[0] as any as Conversation);
          }
        } else if (orgId) {
          let { data: convs } = await supabase
            .from('support_conversations' as any)
            .select('*')
            .eq('org_id', orgId);
          
          let conv = convs?.[0] as any as Conversation;

          if (!conv && organization) {
            const { data: newConv, error: createError } = await supabase
              .from('support_conversations' as any)
              .insert({
                org_id: orgId,
                org_name: (organization as any).name
              })
              .select()
              .single();
            
            if (!createError && newConv) {
              conv = newConv as any as Conversation;
            }
          }

          if (conv) {
            setActiveConversation(conv);
          }
        }
      } catch (err) {
        console.error("Error loading chat:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, orgId, isAdmin, organization]);

  useEffect(() => {
    if (!activeConversation) return;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('support_messages' as any)
        .select('*')
        .eq('conversation_id', activeConversation.id)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setMessages(data as any as Message[]);
      }
    };

    loadMessages();

    const channel = supabase.channel(`chat_${activeConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'support_messages',
          filter: `conversation_id=eq.${activeConversation.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            if (prev.find(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!isAdmin) return;

    const convChannel = supabase.channel('admin_conversations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'support_conversations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setConversations(prev => [payload.new as Conversation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setConversations(prev => prev.map(c => c.id === payload.new.id ? payload.new as Conversation : c));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(convChannel);
    };
  }, [isAdmin]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || !user) return;

    const content = newMessage.trim();
    setNewMessage("");

    const senderName = isAdmin 
      ? `Suporte (${user.user_metadata?.full_name?.split(' ')[0] || 'Admin'})` 
      : (user.user_metadata?.full_name || 'Usuário');

    const { error: msgError } = await supabase
      .from('support_messages' as any)
      .insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        sender_name: senderName,
        content,
        is_admin: isAdmin
      });

    if (msgError) {
      toast({ title: "Erro ao enviar", description: msgError.message, variant: "destructive" });
      setNewMessage(content);
      return;
    }

    await supabase
      .from('support_conversations' as any)
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', activeConversation.id);
  };

  if (isLoading) {
    return <div className="p-8 text-[#888] text-center">Carregando suporte...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] max-h-[900px]">
      
      {isAdmin && (
        <div className="w-80 border-r border-white/5 bg-[#111] flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-white font-bold">Conversas</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-sm text-[#888] text-center">Nenhuma conversa ativa</div>
            ) : (
              conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setActiveConversation(conv)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-colors ${
                    activeConversation?.id === conv.id ? 'bg-purple-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-white text-sm truncate pr-2">{conv.org_name}</span>
                  </div>
                  <div className="text-xs text-[#888] truncate">
                    {new Date(conv.last_message_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-[#0a0a0a]">
          <div className="h-16 border-b border-white/5 flex items-center px-6 bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-violet-400">
                {isAdmin ? <User className="w-5 h-5" /> : <Headset className="w-5 h-5" />}
              </div>
              <div>
                <h2 className="text-white font-medium">
                  {isAdmin ? activeConversation.org_name : 'Suporte Vincere'}
                </h2>
                <p className="text-xs text-violet-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
                  Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="text-center">
              <span className="text-xs text-[#666] bg-white/5 px-3 py-1 rounded-full">
                Esta é uma conversa segura e as mensagens são gravadas.
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              const isSupport = msg.is_admin;

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {!isMe && (
                      <div className="w-8 h-8 shrink-0 rounded-full bg-white/10 flex items-center justify-center mb-1">
                        {isSupport ? <Headset className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                      </div>
                    )}
                    
                    <div className="flex flex-col">
                      {!isMe && (
                        <span className="text-xs text-[#888] mb-1 ml-1">{msg.sender_name}</span>
                      )}
                      <div 
                        className={`p-3 rounded-2xl text-sm ${
                          isMe 
                            ? 'bg-platform-purple text-white rounded-tr-sm' 
                            : isSupport 
                              ? 'bg-[#222] text-white border border-white/10 rounded-tl-sm'
                              : 'bg-white/10 text-white rounded-tl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                      <span className={`text-[10px] text-[#666] mt-1 ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-white/5 bg-[#111]">
            <form onSubmit={sendMessage} className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" className="text-[#888] hover:text-white shrink-0">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-white/5 border-transparent focus-visible:ring-1 focus-visible:ring-purple-500 text-white"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim()} 
                className="bg-platform-purple hover:bg-platform-purple/90 text-white px-4 shrink-0 transition-all"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0a0a0a] text-[#888]">
          <Headset className="w-16 h-16 mb-4 opacity-20" />
          <p>Nenhuma conversa selecionada</p>
        </div>
      )}
    </div>
  );
}
