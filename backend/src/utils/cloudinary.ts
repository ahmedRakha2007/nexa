import type { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.ts";

export function uploadImage(buffer: Buffer): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "social-media/posts" },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve(result);
        }
      )
      .end(buffer);
  });
}

export const deleteImage = async (publicId: string) => {
    const result =  await cloudinary.uploader.destroy(publicId);

    return result
};