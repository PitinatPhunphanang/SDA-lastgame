const isProd = process.env.NODE_ENV === 'production'

const conf = {
	isProd,
	url: isProd ? 'https://http://34.124.175.248' :"http://localhost:1337"  ,
	apiUrlPrefix: isProd ? 'https://http://34.124.175.248/api' :"http://localhost:1337/api",
    globalchat: isProd ? 'https://http://34.124.175.248' : "http://localhost"
};

export default conf;
