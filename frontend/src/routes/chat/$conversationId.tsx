import { UserAvatar } from "@/components/common/UserAvatar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { useOldMessages } from "@/hooks/useConversations";
import socket from "@/lib/socket";
import { Message } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/chat/$conversationId")({
  component: ChatPage,
});

function ChatPage() {
  return (
    <RequireAuth>
      <Chat />
    </RequireAuth>
  );
}

function Chat() {
  const { conversationId } = Route.useParams();
  const { user } = useAuth();

  const { data: oldMessages, isLoading } = useOldMessages(conversationId);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!oldMessages) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((message) => message.id));

      const newOldMessages = oldMessages.filter((message: Message) => !existingIds.has(message.id));

      return [...newOldMessages, ...prev].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
    });
  }, [oldMessages]);

  useEffect(() => {
    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
      console.log("message", message);
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      conversationId,
      content: message,
    });

    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="border-b px-6 py-4">
        <h1 className="text-xl font-semibold">Chat</h1>
      </div>

      {/* Messages */}
      <div className=" chat-scrollbar flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <p className="text-sm text-muted-foreground">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center py-20">
              <p className="text-sm text-muted-foreground">
                No messages yet. Start the conversation.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isMine = message.sender_id === user?.id;

                const formattedTime = new Date(message.created_at).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={message.id}
                    className={`flex w-full items-end gap-2 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMine && <UserAvatar user={message.sender} />}

                    <div
                      className={`flex min-w-0 max-w-[75%] flex-col ${
                        isMine ? "items-end" : "items-start"
                      }`}
                    >
                      {!isMine && (
                        <div className="mb-1 ml-1">
                          <p className="text-sm font-medium">
                            {message.sender.display_name || message.sender.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            @{message.sender.username}
                          </p>
                        </div>
                      )}

                      <div
                        className={`w-fit max-w-full rounded-2xl px-4 py-2.5 ${
                          isMine ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                      </div>

                      <p className="mt-1 px-1 text-[11px] text-muted-foreground">{formattedTime}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t bg-background px-4 py-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            placeholder="Write a message..."
            className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
