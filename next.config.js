/** @type {import('next').NextConfig} */

const { default: SITE_CONFIG } = require('./src/settings');

const nextConfig = {
    reactStrictMode: false, /* @note: To prevent duplicated call of useEffect */
    swcMinify: true,

    async rewrites() {
        return [{
            source: "/api/:path*",
            destination: SITE_CONFIG.BACKEND + "/:path*",
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
