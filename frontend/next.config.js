// next.config.js

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',  // Matches all domains
      },
    ],
  },
}
