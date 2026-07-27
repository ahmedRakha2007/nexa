declare const createPostService: (content: string, file: Express.Multer.File | undefined, userId: string) => Promise<{
    id: string;
    content: string | null;
    image_url: string | null;
    image_public_id: string | null;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}>;
export default createPostService;
//# sourceMappingURL=createPost.d.ts.map