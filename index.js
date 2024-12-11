import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { createBareServer } from "@nebula-services/bare-server-node";
import chalk from "chalk";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import basicAuth from "express-basic-auth";
import mime from "mime-types";
import fetch from "node-fetch";
import config from "./config.js";

console.log(chalk.yellow("🚀 Starting server..."));

const __dirname = process.cwd();
const server = http.createServer();
const app = express();
const bareServer = createBareServer("/fq/");
const PORT = process.env.PORT || 8080;

if (config.challenge) {
  console.log(chalk.green("🔒 Password protection is enabled! Listing logins below"));
  Object.entries(config.users).forEach(([username, password]) => {
    console.log(chalk.blue(`Username: ${username}, Password: ${password}`));
  });
  app.use(basicAuth({ users: config.users, challenge: true }));
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, "static")));

const routes = [
  { path: "/", file: "index.html" },
  { path: "/~", file: "apps.html" },
  { path: "/-", file: "games.html" },
  { path: "/!", file: "settings.html" },
  { path: "/0", file: "tabs.html" },
  { path: "/1", file: "go.html" },
  { path: "/2", file: "other.html" },
  { path: "/404", file: "404.html" },
];

const fetchData = async (req, res, next, baseUrl) => {
  const reqTarget = `${baseUrl}/${req.params[0]}`;
  try {
    const asset = await fetch(reqTarget);
    if (asset.ok) {
      const data = await asset.arrayBuffer();
      res.end(Buffer.from(data));
    } else {
      next();
    }
  } catch {
    next();
  }
};

app.get("/y/*", cors({ origin: false }), (req, res, next) => {
  fetchData(req, res, next, "https://raw.githubusercontent.com/ypxa/y/main");
});

app.get("/f/*", cors({ origin: false }), (req, res, next) => {
  fetchData(req, res, next, "https://raw.githubusercontent.com/4x-a/x/fixy");
});

routes.forEach(route => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(__dirname, "static", route.file));
  });
});

app.get("/m/uv/*", async (req, res) => {
  const filePath = path.join(process.cwd(), req.url);
  try {
    const content = await fs.readFile(filePath);
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.end(content);
  } catch {
    res.status(404).end("File not found");
  }
});

app.get("/m/bare/*", async (req, res) => {
  const bareUrl = req.url.slice("/m/bare/".length);
  try {
    const response = await fetch(bareUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
    });
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (!["set-cookie", "transfer-encoding"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });
    response.body.pipe(res);
  } catch {
    res.status(500).end("Error proxying request");
  }
});

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(chalk.green(`🌍 Server is running on http://localhost:${PORT}`));
});
