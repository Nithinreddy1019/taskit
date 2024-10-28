import crypto from "crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const bucketRegion = process.env.BUCKET_REGION!;
export const bucketName = process.env.BUCKET_NAME!;
export const accessKey = process.env.ACCESS_KEY!;
export const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

// Creating s3 client
export const s3Client = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
});


// Acceptible formats 
export const fileFormats = [
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/svg"
]
export const isValidFormat = (fileType: string): boolean => {
    const isValid = fileFormats.includes(fileType);
    return isValid;
}

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
};


// function to put the image given the image file

type ImageUploadResult = 
  | { error: string }
  | { success: string; imageFileName: string };

export const putImageInBucket = async (image: File, imageFileName: string): Promise<ImageUploadResult> => {

    if(!image) {
        return { error: "No file given" }
    };

    if(!isValidFormat(image.type)) {
        return { error: "Invalid format" }
    };

    if(!isValidFileSize(image.size)) {
        return { error: "Image too large" }
    };

    const fileArrayBuffer = await image.arrayBuffer();
    const fileBuffer = Buffer.from(fileArrayBuffer);

    const params = {
        Bucket: bucketName,
        Key: imageFileName,
        Body: fileBuffer,
        ContentType: image.type 
    };

    const putCommand = new PutObjectCommand(params);
    const uploadResponse = await s3Client.send(putCommand);

    if(uploadResponse.$metadata.httpStatusCode !== 200) {
        return { error: "Could not upload the image" }
    };

    return { success: "Image uploaded", imageFileName: imageFileName}
};


//Function that deletes from S3
type DeleteImageResult = 
    { error: string } |
    { success: string }

export const deleteFromBucket = async (imageFileName: string): Promise<DeleteImageResult> => {
    const deleteObjectParams = {
        Bucket: bucketName,
        Key: imageFileName
    };

    const deleteCommand = new DeleteObjectCommand(deleteObjectParams);
    const deleteResponse = await s3Client.send(deleteCommand);

    if(deleteResponse.$metadata.httpStatusCode === 200) {
        return { success: "Image deleted" }
    };
    return { error: "could not delete" }
};