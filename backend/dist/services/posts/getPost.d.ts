export declare const getPostService: (id: string) => Promise<{
    user: {
        display_name: string;
        id: string;
        profile_picture_url: string | null;
        username: string;
    };
} & {
    id: string;
    content: string | null;
    image_url: string | null;
    image_public_id: string | null;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}>;
export default getPostService;
//# sourceMappingURL=getPost.d.ts.map