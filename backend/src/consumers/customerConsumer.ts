// src/consumers/customerConsumer.ts
import { Kafka } from 'kafkajs';

const kafka = new Kafka({ clientId: 'logger', brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'log-service' });

export const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'customer-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value?.toString() || '{}');
      console.log('📥 Received customer event:', event);
    },
  });
};
