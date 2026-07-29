import app from "./app.ts";
import { env } from "./config/env.ts";
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
//# sourceMappingURL=server.js.map