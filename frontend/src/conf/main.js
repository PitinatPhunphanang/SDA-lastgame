const isProd = process.env.NODE_ENV === 'production'

const conf = {
	isProd,
	url: isProd ? 'https://http://35.240.177.163' :"http://localhost:1337"  ,
	apiUrlPrefix: isProd ? 'https://http://35.240.177.163/api' :"http://localhost:1337/api",
    globalchat: isProd ? 'https://http://35.240.177.163' : "http://localhost"
};

export default conf;
