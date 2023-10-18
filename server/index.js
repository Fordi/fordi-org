import express from "express";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { resolve, dirname } from "path";

const resApp = (n) =>
  resolve(resolve(dirname(new URL(import.meta.url).pathname), ".."), n);
const { name } = JSON.parse(await readFile(resApp("package.json"), "utf8"));
const staticRoot = resApp("docs");

const app = express();

app.use(express.static(staticRoot));
app.use((req, res) => {
  if (req.path.startsWith(`/api/`) || /\.[^.]+$/.test(req.path)) {
    res.status(404).send("");
  } else {
    res.sendFile(resolve(staticRoot, "index.html"));
  }
});

const server = createServer({}, app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.info(`${name} listening at 'http://localhost:${port}`);
});
