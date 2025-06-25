/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // remove images6 domain later.
    domains: ["twg-euwest2-prod-s3.s3.eu-west-2.amazonaws.com"],
  },

  async headers() {
    return [
      {
        // Allow LTI POST requests
        source: "/api/lti/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,OPTIONS" },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
