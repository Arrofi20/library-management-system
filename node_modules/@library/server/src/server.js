const { createApp } = require("./app");

const port = Number(process.env.PORT || 3001);
const app = createApp();

app.listen(port, () => {
  console.log(`Library API listening on http://localhost:${port}`);
});
