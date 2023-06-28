import { createProxyMiddleware } from "http-proxy-middleware";

const apiEndpoint = process.env["API_ENDPOINT"];

const proxy = apiEndpoint
	? createProxyMiddleware({
			target: process.env["API_ENDPOINT"],
			changeOrigin: true,
			pathRewrite: (path) => path.replace(/^\/api/, ""),
	  })
	: null;

const notFound = () => {
	return new Response(null, { status: 404 });
};

export default proxy || notFound;
