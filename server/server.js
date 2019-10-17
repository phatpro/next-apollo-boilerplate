/*eslint-env node*/
var lines = process.stdout.getWindowSize()[1];
for (var i = 0; i < lines; i++) {
	console.log('\r\n');
}

require('colors');
const argv = require('minimist')(process.argv.slice(2));
console.log('Load argv', argv);

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const sitemap = require('sitemap');

const next = require('next');
const nextApp = next({
	dev: argv.env === 'development'
});
const nextAppHandler = nextApp.getRequestHandler();

nextApp
	.prepare()
	.then(() => {
		app.get('/', (req, res) => {
			return nextApp.render(req, res, '/home');
		});

		app.get('/trang-1', (req, res) => {
			return nextApp.render(req, res, '/page-1');
		});

		app.get('/trang-2', (req, res) => {
			return nextApp.render(req, res, '/page-2');
		});

		app.get('*', (req, res) => {
			return nextAppHandler(req, res);
		});

		app.use((error, req, res, next) => {
			console.log('App broken'.red, error);
		});

		app.listen(argv.port, argv.hostname, () => {
			console.log(`App running on port: ${argv.port}, hostname: ${argv.hostname}`.green);
		});
	})
	.catch((error) => {
		console.log('App startup error'.red);
		throw error;
	});
