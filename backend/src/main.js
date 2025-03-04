const isProd = process.env.NODE_ENV === 'production'

const conf = {
	isProd,
	url: isProd ? 'https://34.124.206.211' :"http://localhost:1337"  ,
	apiUrlPrefix: isProd ? 'https://34.124.206.211/api' :"http://localhost:1337/api",
    globalchat: isProd ? 'https://34.124.206.211' : "http://localhost"
};

export default conf;
