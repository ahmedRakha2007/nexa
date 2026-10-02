-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "conversation_id" UUID;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
