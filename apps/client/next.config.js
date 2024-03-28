/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	eslint: {
		ignoreDuringBuilds: true
	},
	typescript: {
		ignoreBuildErrors: true
	},
	pageExtensions: ['page.tsx'],
	images: {
		remotePatterns: [{
			protocol: 'https',
			hostname: 'placehold.co'
		}],
	},
};

module.exports = nextConfig;
