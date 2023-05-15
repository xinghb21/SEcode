/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: process.env.NODE_ENV === "production" ? "https://Aplus-backend-Aplus.app.secoder.net/:path*" : "http://127.0.0.1:8000/:path*",
        }, 
        {
            source: "/image",
            destination: "https://aplus-avatar.oss-cn-beijing.aliyuncs.com",
        },
        {
            source: "/image/:path*",
            destination: "http://aplus-secoder.oss-cn-beijing.aliyuncs.com/:path*",
        }];
    }
};

module.exports = nextConfig;
