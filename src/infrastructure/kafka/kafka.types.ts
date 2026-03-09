/**
 * Standard event format for all Kafka messages.
 */
export interface KafkaEvent {
  event_id: string;
  event_type: string;
  correlation_id: string;
  payload: unknown;
}

export type KafkaEventInput = Omit<KafkaEvent, 'event_id'> & { event_id?: string };
