/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false
    }
    
    // Handle QR scanner worker files - exclude from processing
    config.module.rules.push({
      test: /qr-scanner.*\.js$/,
      type: 'asset/resource'
    })
    
    // Ignore qr-scanner worker in optimization
    config.optimization = config.optimization || {}
    config.optimization.minimizer = config.optimization.minimizer || []
    
    return config
  }
}

export default nextConfig