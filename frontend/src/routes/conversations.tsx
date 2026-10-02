import { UserAvatar } from "@/components/common/UserAvatar";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/hooks/useConversations";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations")({
  component: ConversationsPage,
});

function ConversationsPage() {
  return (
    <RequireAuth>
      <Conversations />
    </RequireAuth>
  );
}

function Conversations() {
  const { user } = useAuth();
  const { data: conversations, isLoading } = useConversations();

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="border-b px-4 py-5">
          <h1 className="text-2xl font-semibold">Messages</h1>
        </div>

        <div className="flex justify-center py-12">
          <p className="text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header */}
      <div className="border-b px-4 py-5">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your conversations</p>
      </div>

      {/* Conversations */}
      <div className="divide-y">
        {conversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
            <p className="text-lg font-medium">No conversations yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Start a conversation with one of your friends.
            </p>
          </div>
        ) : (
          conversations?.map((conversation) => {
            const otherMember = conversation.members.find((member) => member.user_id !== user?.id);

            if (!otherMember) return null;

            const otherUser = otherMember.user;

            return (
              <Link
                key={conversation.id}
                to="/chat/$conversationId"
                params={{ conversationId: conversation.id }}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-muted/50"
              >
                <UserAvatar user={otherUser} size="md" />

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {otherUser.display_name || otherUser.username}
                  </p>

                  <p className="truncate text-sm text-muted-foreground">@{otherUser.username}</p>
                </div>

                <p className="truncate text-sm text-muted-foreground">
                  {conversation.messages[0]?.content || "No messages yet"}
                </p>

                {conversation.messages[0] && (
                  <span className="text-xs text-muted-foreground">
                    {new Date(conversation.messages[0].created_at).toLocaleDateString()}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
