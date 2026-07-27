declare const getProfileService: (username: string) => Promise<{
    display_name: string;
    username: string;
    profile_picture_url: string | null;
    bio: string | null;
    posts_count: number;
    friends_count: number;
}>;
export default getProfileService;
//# sourceMappingURL=getProfile.d.ts.map