declare const getSentFriendRequestsService: (userId: string) => Promise<{
    created_at: Date;
    id: string;
    receiver: {
        display_name: string;
        id: string;
        profile_picture_url: string | null;
        username: string;
    };
}[]>;
export default getSentFriendRequestsService;
//# sourceMappingURL=getSentFriendRequests.d.ts.map