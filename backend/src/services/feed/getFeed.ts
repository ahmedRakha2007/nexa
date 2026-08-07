import { prisma } from "../../config/prisma.ts";



const getFeedService  = async (page: number, limit: number) => {

     const [totalPosts, posts] = await Promise.all([
            prisma.post.count({}),
            prisma.post.findMany({
                orderBy: {
                created_at: "desc",
                },
                skip: (page - 1) * limit,
                take: limit,
                select: {
                    id: true,
                    user_id: true,
                    content: true,
                    image_url: true,
                    created_at: true,
                    user: {
                        select: {
                        username: true,
                        display_name: true,
                        profile_picture_url: true,
                        },
                    },
                }
            }),
        ]);
        const totalPages = Math.ceil(totalPosts / limit);
        
        return {posts, totalPosts, total_pages: totalPages, page, limit}
}


export default getFeedService