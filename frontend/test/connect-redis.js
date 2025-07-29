import clientRedis from "./clientRedis.js";

console.log(await clientRedis.get("name"));
