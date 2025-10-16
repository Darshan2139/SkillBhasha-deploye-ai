import { createServer } from './server/index.js';

const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`🚀 SkillBhasha AI Server running on port ${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
  console.log(`📡 Health check: http://localhost:${port}/api/ping`);
});
