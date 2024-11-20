/** @type {import('next').NextConfig} */


const nextConfig = {
    images: {
        domains: ['taskit-s3-bucket.s3.ap-south-1.amazonaws.com', 'lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
};

export default nextConfig;
