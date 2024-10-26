import crypto from "crypto";
import { S3Client } from "@aws-sdk/client-s3";

export const bucketRegion = process.env.BUCKET_REGION!;
export const bucketName = process.env.BUCKET_NAME!;
export const accessKey = process.env.ACCESS_KEY!;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY!;


export const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
});


// Random image name generator
export const randomImageName = async (bytes = 32) => {
    const name = await crypto.randomBytes(bytes).toString("hex");
    return name;
};

// To check file size
export const isValidFileSize = (size: number): boolean => {
    const maxSize = 2 * 1024 * 1024;
    return size <= maxSize;
};