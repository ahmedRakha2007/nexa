declare const editPostService: (id: string, content: string | undefined, file: Express.Multer.File | undefined, userId: string) => Promise<{
    content: string | null;
    created_at: Date;
    id: string;
    image_url: string | null;
    updated_at: Date;
}>;
export default editPostService;
//# sourceMappingURL=editPost.d.ts.map