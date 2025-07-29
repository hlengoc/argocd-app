import { createClient } from "redis";

//Connect to Redis DB

const clientRedis = createClient({
  password: "H7N3BFKoSxALiUcWmVHVTQ3HzrYlPqim",
  socket: {
    host: "redis-13961.c274.us-east-1-3.ec2.redns.redis-cloud.com",
    port: 13961,
  },
});

clientRedis.on("error", (err) => console.log("Redis Client Error", err));
await clientRedis.connect();
console.log("connect Redis OK!");

export default clientRedis;
