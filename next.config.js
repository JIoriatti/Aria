/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
   remotePatterns: [
    {
      protocol: 'https',
      hostname: 'encrypted-tbn0.gstatic.com',
      port: '',
      pathname:''
    },
    {
      protocol: 'https',
      hostname: 'i.scdn.co',
      port:'',
      pathname:'/image/**'
    }
   ]
  },
  env: {
    SPOTIFY_CLIENT_ID : process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET : process.env.SPOTIFY_CLIENT_SECRET,
  }
}

module.exports = nextConfig
