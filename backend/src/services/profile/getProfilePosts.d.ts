declare const getProfilePostsService: (username: string, page: number, limit: number) => Promise<{
    posts: {
        id: string;
        content: string | null;
        image_url: string | null;
        image_public_id: string | null;
        user_id: string;
        created_at: Date;
        updated_at: Date;
    }[];
    total_pages: number;
    page: number;
    limit: number;
}>;
export default getProfilePostsService;
//# sourceMappingURL=getProfilePosts.d.ts.map