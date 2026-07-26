import { prisma } from "../../config/prisma.ts";
import { uploadImage } from "../../utils/cloudinary.ts";



const createPostService = async (content: string, file: Express.Multer.File | undefined, userId: string) => {

    let imageUrl: string | null = null
    let imagePublicId: string | null = null

    if (file?.buffer) {
        const {secure_url, public_id} = await uploadImage(file.buffer)
        imageUrl = secure_url
        imagePublicId = public_id
    }

   const post =  await prisma.post.create({
    data: {
        user_id: userId,
        content,
        image_url: imageUrl,
        image_public_id: imagePublicId
    },
});

    return post
}


export default createPostService;