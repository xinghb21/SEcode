/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: "http://127.0.0.1:8000/:path*",
        }, 
        {
            source: "/image",
            destination: "https://aplus-secoder.oss-cn-beijing.aliyuncs.com",
        }];
    }
};

module.exports = nextConfig;
