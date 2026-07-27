const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const host = "127.0.0.1";
const port = 4173;
const publicFiles = new Set([
  "index.html",
  "app.js",
  "styles.css",
  path.join("src", "lib", "supabase.js"),
]);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split("?")[0]);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Bad request");
    return;
  }
  const safePath = path.normalize(urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, ""));
  const filePath = path.resolve(root, safePath);
  const relative = path.relative(root, filePath);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (!publicFiles.has(relative)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "text/plain; charset=utf-8" });
    res.end(data);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`端口 ${port} 已被占用。请先关闭旧的启动窗口，或结束旧的 node server.js 进程后再重试。`);
  } else {
    console.error("启动失败：", err.message);
  }
  process.exit(1);
});

server.listen(port, host, () => {
  console.log("========================================");
  console.log("FitTrack 健身记录 App 已启动");
  console.log(`请在 Codex 内置浏览器打开：http://${host}:${port}`);
  console.log("保持此窗口打开，关闭窗口后网页服务会停止。");
  console.log("========================================");
});
