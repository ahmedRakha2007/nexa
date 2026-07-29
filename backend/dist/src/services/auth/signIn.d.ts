export interface SignInInput {
    identifier: string;
    password: string;
}
declare const signInService: ({ identifier, password, }: SignInInput) => Promise<{
    message: string;
    user: {
        bio: string | null;
        birth_date: Date;
        created_at: Date;
        display_name: string;
        email: string;
        id: string;
        profile_picture_url: string | null;
        provider: import("../../generated/prisma/enums.ts").AuthProvider;
        updated_at: Date;
        username: string;
    };
    token: string;
}>;
export default signInService;
//# sourceMappingURL=signIn.d.ts.map