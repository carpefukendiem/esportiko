/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["ssh2", "ssh2-sftp-client"],
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "catalog.sanmar.com", pathname: "/imglib/**" },
      { protocol: "https", hostname: "cdn.sanmar.com", pathname: "/**" },
      { protocol: "https", hostname: "cdnp.sanmar.com", pathname: "/**" },
      { protocol: "https", hostname: "cdnm.sanmar.com", pathname: "/**" },
      { protocol: "https", hostname: "www.sanmar.com", pathname: "/**" },
      { protocol: "https", hostname: "images.sanmar.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
