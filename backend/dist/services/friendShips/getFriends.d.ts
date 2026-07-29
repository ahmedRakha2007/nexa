declare const getFriendsService: (userId: string) => Promise<{
    friendship_id: string;
    created_at: Date;
    friend: {
        display_name: string;
        id: string;
        profile_picture_url: string | null;
        username: string;
    };
}[]>;
export default getFriendsService;
//# sourceMappingURL=getFriends.d.ts.map