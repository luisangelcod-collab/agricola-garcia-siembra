const http = require("http");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const editKey = String(process.env.EDIT_KEY || "").trim();
const dataFile = path.resolve(process.env.DATA_FILE || path.join(rootDir, "data", "siembra-state.json"));
const maxBodyBytes = 8 * 1024 * 1024;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".txt": "text/plain; charset=utf-8",
  ".zip": "application/zip",
};

function seedState() {
  const code = fs.readFileSync(path.join(rootDir, "seed-data.js"), "utf8");
  const context = { window: {} };
  vm.runInNewContext(code, context, { filename: "seed-data.js" });
  return context.window.SIEMBRA_COSECHAS_SEED || {};
}

function ensureStateFile() {
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(seedState(), null, 2), "utf8");
  }
}

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function canEdit(req, url) {
  if (!editKey) return true;
  return req.headers["x-edit-key"] === editKey || url.searchParams.get("edit") === editKey;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBodyBytes) {
        reject(new Error("El archivo de datos es demasiado grande."));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function handleApi(req, res, url) {
  ensureStateFile();
  if (req.method === "GET") {
    const state = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    sendJson(res, 200, state);
    return;
  }

  if (req.method === "PUT" || req.method === "POST") {
    if (!canEdit(req, url)) {
      sendJson(res, 403, { error: "Este link no tiene permiso para editar." });
      return;
    }
    const body = await readBody(req);
    const state = JSON.parse(body || "{}");
    fs.writeFileSync(dataFile, JSON.stringify(state, null, 2), "utf8");
    sendJson(res, 200, { ok: true, savedAt: new Date().toISOString() });
    return;
  }

  sendJson(res, 405, { error: "Metodo no permitido." });
}

function safeStaticPath(urlPath) {
  const cleanPath = urlPath === "/" ? "/index.html" : decodeURIComponent(urlPath);
  const fullPath = path.resolve(rootDir, `.${cleanPath}`);
  if (!fullPath.startsWith(rootDir)) return null;
  return fullPath;
}

function serveStatic(req, res, url) {
  const filePath = safeStaticPath(url.pathname);
  if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": mimeTypes[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=60",
  });
  fs.createReadStream(filePath).pipe(res);
}

function serveCloudConfig(res) {
  res.writeHead(200, {
    "Content-Type": "application/javascript; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(`(function () {
  const params = new URLSearchParams(String(window.location.hash || "").replace(/^#/, ""));
  const editKeyRequired = ${editKey ? "true" : "false"};
  window.AGRICOLA_GARCIA_CLOUD = {
    enabled: true,
    endpoint: "/api/state",
    editKey: params.get("edit") || "",
    editKeyRequired,
    readOnly: editKeyRequired && !params.get("edit"),
    pollMs: 15000
  };
})();`);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname === "/api/state") {
      await handleApi(req, res, url);
      return;
    }
    if (url.pathname === "/cloud-config.js") {
      serveCloudConfig(res);
      return;
    }
    serveStatic(req, res, url);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Error interno" });
  }
});

server.listen(port, "0.0.0.0", () => {
  ensureStateFile();
  console.log(`Agricola Garcia web lista en http://localhost:${port}`);
});
