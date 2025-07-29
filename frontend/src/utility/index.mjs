import { Kafka } from "@confluentinc/kafka-javascript";

async function main() {
  const disconnect = () => {
    consumer.commitOffsets().finally(() => {
      consumer.disconnect();
    });
  };
  process.on("SIGTERM", disconnect);
  process.on("SIGINT", disconnect);

  const consumer = new Kafka().consumer({
    "bootstrap.servers": "pkc-p11xm.us-east-1.aws.confluent.cloud:9092",
    "sasl.username": "EHJ57CVANGKEPPLR",
    "sasl.password":
      "rwaXwGxnbIC9dK6ZWxP1EVdDXV9nusGXfwXhFiAkzSumdgQH9HCHjdunsmClM+Ch",
    "security.protocol": "SASL_SSL",
    "sasl.mechanisms": "PLAIN",
    "group.id": "nodejs-group-1", // Mandatory property for a consumer - the consumer group id.
    "auto.offset.reset": "earliest",
    // "client.id": "ccloud-nodejs-client-5f09f699-7dde-48a0-8dfb-687512230cba",
  });
  await consumer.connect();
  await consumer.subscribe({ topics: ["shopping"] });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        headers: message.headers,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value.toString(),
      });
    },
  });

  // Whenever we're done consuming, maybe after user input or a signal:
  // await consumer.disconnect();
}

main();
