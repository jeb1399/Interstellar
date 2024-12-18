import express from 'express';
import basicAuth from 'express-basic-auth';
import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';
import cors from 'cors';
import config from './config.js';

const __dirname = process.cwd();
const server = http.createServer();
const app = express(server);
const bareServer = createBareServer('/v/');
const PORT = process.env.PORT || 8080;

if (config.challenge) {
    console.log('Password protection is enabled. Usernames are: ' + Object.keys(config.users));
    console.log('Passwords are: ' + Object.values(config.users));
    app.use(basicAuth(config));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'static')));

const routes = [
    { path: '/', file: 'index.html' },
    { path: '/~', file: 'apps.html' },
    { path: '/-', file: 'games.html' },
    { path: '/!', file: 'settings.html' },
    { path: '/0', file: 'tabs.html' },
    { path: '/1', file: 'go.html' },
    { path: '/2', file: 'other.html' },
    { path: '/404', file: '404.html' },
];

const fetchData = async (req, res, next, baseUrl) => {
    try {
        const reqTarget = `${baseUrl}/${req.params[0]}`;
        const asset = await fetch(reqTarget);

        if (asset.ok) {
            const data = await asset.arrayBuffer();
            res.end(Buffer.from(data));
        } else {
            next();
        }
    } catch (error) {
        next(error);
    }
};

app.get('/y/*', cors({ origin: false }), (req, res, next) => fetchData(req, res, next, 'https://raw.githubusercontent.com/ypxa/y/main'));

app.get('/f/*', cors({ origin: false }), (req, res, next) => fetchData(req, res, next, 'https://raw.githubusercontent.com/4x-a/x/fixy'));

routes.forEach(route => {
    app.get(route.path, (req, res) => res.sendFile(path.join(__dirname, 'static', route.file)));
});

app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /');
});

server.on('request', (req, res) => {
    bareServer.shouldRoute(req) ? bareServer.routeRequest(req, res) : app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    bareServer.shouldRoute(req) ? bareServer.routeUpgrade(req, socket, head) : socket.end();
});

server.on('listening', () => console.log(`Running at http://localhost:${PORT}`));

server.listen({ port: PORT });
