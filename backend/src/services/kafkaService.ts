// src/services/kafkaService.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'],
});

const producer = kafka.producer();

export const startProducer = async () => {
  await producer.connect();
};

export const publishCustomerEvent = async (data: any) => {
  await producer.send({
    topic: 'customer-events',
    messages: [{ value: JSON.stringify(data) }],
  });
};
