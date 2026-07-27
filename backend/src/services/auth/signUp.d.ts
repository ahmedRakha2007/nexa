interface SignUpInput {
    display_name: string;
    username: string;
    email: string;
    password: string;
    birth_date: string;
}
declare const signUpService: (data: SignUpInput) => Promise<{
    message: string;
    user: {
        bio: string | null;
        birth_date: Date;
        created_at: Date;
        display_name: string;
        email: string;
        id: string;
        profile_picture_url: string | null;
        provider: import("../../../generated/prisma/enums.ts").AuthProvider;
        updated_at: Date;
        username: string;
    };
    token: string;
}>;
export default signUpService;
//# sourceMappingURL=signUp.d.ts.map