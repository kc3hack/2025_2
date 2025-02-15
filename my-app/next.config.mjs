/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, context) => {
        config.watchOptions = {
            poll: 300,
            aggregateTimeout: 300
        }
        return config
    }
}

export default nextConfig;
