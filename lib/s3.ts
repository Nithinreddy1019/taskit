import crypto from "crypto";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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

// function that generates signedURL
export const generateSignedUrl = async (imageName: string) => {
    
    if(!imageName) {
        return null
    }

    const getObjectParams = {
        Bucket: bucketName,
        Key: imageName
    };

    const command = new GetObjectCommand(getObjectParams);
    const imageUrl = await getSignedUrl(s3Client, command, { expiresIn: 24 * 60 * 60 });

    return imageUrl;
}