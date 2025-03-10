const isProd = process.env.NODE_ENV === 'development'

const conf = {
	isProd,
	url: isProd ? 'https://sda-lastgame-437542875768.asia-southeast1.run.app' :"http://localhost:1337"  ,
	apiUrlPrefix: isProd ? 'https://sda-lastgame-437542875768.asia-southeast1.run.app/api' :"http://localhost:1337/api",
    globalchat: isProd ? 'https://sda-lastgame-437542875768.asia-southeast1.run.app' : "http://localhost"
};

export default conf;
