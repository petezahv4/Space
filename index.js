import express from 'express';
import cors from 'cors';
import http from 'node:http';
import path from 'node:path';
import { hostname } from 'node:os';
import chalk from 'chalk';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import routes from './src/routes.js';

const server = http.createServer();
const app = express();
const __dirname = process.cwd();
const PORT = process.env.PORT || 6060;
const desiredIP = '192.168.1.6'; // Replace with your actual IP

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/epoxy/', express.static(epoxyPath));
app.use('/@/', express.static(uvPath));
app.use('/libcurl/', express.static(libcurlPath));
app.use('/baremux/', express.static(baremuxPath));

app.use('/', routes);

server.on('request', (req, res) => {
	app(req, res);
});

server.on('upgrade', (req, socket, head) => {
	if (req.url.endsWith('/wisp/')) {
		wisp.routeRequest(req, socket, head);
	} else {
		socket.end();
	}
});

server.on('listening', () => {
	const address = server.address();
	const theme = chalk.hex('#8F00FF');
	const host = chalk.hex('0d52bd');
	console.log(
		chalk.bold(
			theme(`
	███████╗██████╗  █████╗  ██████╗███████╗
	██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝
	███████╗██████╔╝███████║██║     █████╗  
	╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝  
	███████║██║     ██║  ██║╚██████╗███████╗
	╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝
											
	`)
		)
	);
	console.log(
		`  <span class="math-inline">\{chalk\.bold\(host\('Local System\:'\)\)\}            http\://</span>{desiredIP}${address.port === 80 ? '' : ':' + chalk.bold(address.port)}`
	);

	console.log(
		`  <span class="math-inline">\{chalk\.bold\(host\('Local System\:'\)\)\}            http\://localhost</span>{address.port === 8080 ? '' : ':' + chalk.bold(address.port)}`
	);

	try {
		console.log(
			`  <span class="math-inline">\{chalk\.bold\(host\('On Your Network\:'\)\)\}  http\://</span>{hostname()}${address.port === 8080 ? '' : ':' + chalk.bold(address.port)}`
		);
	} catch (err) {
		// can't find LAN interface
	}

	if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
		console.log(
			`  <span class="math-inline">\{chalk\.bold\(host\('Replit\:'\)\)\}           https\://</span>{process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
		);
	}

	if (process.env.HOSTNAME && process.env.GITPOD_WORKSPACE_CLUSTER_HOST) {
		console.log(
			`  <span class="math-inline">\{chalk\.bold\(host\('Gitpod\:'\)\)\}           https\://</span>{PORT}-<span class="math-inline">\{process\.env\.HOSTNAME\}\.</span>{process.env.GITPOD_WORKSPACE_CLUSTER_
