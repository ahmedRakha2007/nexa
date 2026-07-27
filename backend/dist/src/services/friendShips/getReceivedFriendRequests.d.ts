declare const getReceivedFriendRequestsService: (userId: string) => Promise<{
    created_at: Date;
    id: string;
    sender: {
        display_name: string;
        id: string;
        profile_picture_url: string | null;
        username: string;
    };
}[]>;
export default getReceivedFriendRequestsService;
//# sourceMappingURL=getReceivedFriendRequests.d.ts.map