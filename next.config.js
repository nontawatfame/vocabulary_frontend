/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin/vocabulary',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig

