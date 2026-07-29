import cloudinary from "../config/cloudinary.ts";
export function uploadImage(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream({ folder: "social-media/posts" }, (error, result) => {
            if (error || !result) {
                return reject(error);
            }
            resolve(result);
        })
            .end(buffer);
    });
}
export const deleteImage = async (publicId) => {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
};
//# sourceMappingURL=cloudinary.js.map