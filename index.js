const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

// 静态文件
app.use(express.static(__dirname));

// 根路径：返回 index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 订阅路径：读取 worker.js 生成的 sub.txt
app.get("/sub", (req, res) => {
  const subPath = path.join(__dirname, ".tmp/sub.txt");

  if (fs.existsSync(subPath)) {
    const content = fs.readFileSync(subPath, "utf8");
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.send(content);
  } else {
    res.send("Subscription not ready, please try again later.");
  }
});

// 启动 Web 服务
app.listen(PORT, () => {
  console.log(`Web server running on port ${PORT}`);

  // 后台启动 worker.js（不阻塞）
  require("./worker");
});
