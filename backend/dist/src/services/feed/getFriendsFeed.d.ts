declare const getFriendsFeedService: (userId: string, page: number, limit: number) => Promise<{
    posts: {
        content: string | null;
        created_at: Date;
        id: string;
        image_url: string | null;
        user: {
            display_name: string;
            profile_picture_url: string | null;
            username: string;
        };
    }[];
    total_posts: number;
    total_pages: number;
    page: number;
    limit: number;
}>;
export default getFriendsFeedService;
//# sourceMappingURL=getFriendsFeed.d.ts.map