/** @type {import('next').NextConfig} */
const withSvgr = require('next-plugin-svgr');
const composePlugins = require("next-compose-plugins");

module.exports = composePlugins([withSvgr], {
  reactStrictMode: true,
  eslint: { dirs: ['src'] },
  images: {
    domains: ['4.bp.blogspot.com'],
  },
});
