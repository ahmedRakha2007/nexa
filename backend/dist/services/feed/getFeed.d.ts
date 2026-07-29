declare const getFeedService: (page: number, limit: number) => Promise<{
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
    totalPosts: number;
    total_pages: number;
    page: number;
    limit: number;
}>;
export default getFeedService;
//# sourceMappingURL=getFeed.d.ts.map