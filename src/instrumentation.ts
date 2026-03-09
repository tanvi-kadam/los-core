/**
 * OpenTelemetry tracing. Must load before other application code so instrumentations patch modules.
 * Traces: HTTP requests, PostgreSQL (pg), Redis (ioredis), Kafka (kafkajs).
 * Exports to OTEL_EXPORTER_OTLP_ENDPOINT (default http://otel-collector:4317).
 */
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { IORedisInstrumentation } from '@opentelemetry/instrumentation-ioredis';
import { KafkaJsInstrumentation } from '@opentelemetry/instrumentation-kafkajs';

const endpoint = process.env['OTEL_EXPORTER_OTLP_ENDPOINT'] ?? 'http://otel-collector:4317';
const serviceName = process.env['OTEL_SERVICE_NAME'] ?? 'los-core';

const traceExporter = new OTLPTraceExporter({
  url: endpoint,
});

const sdk = new NodeSDK({
  resource: new Resource({
    'service.name': serviceName,
  }),
  traceExporter,
  instrumentations: [
    new HttpInstrumentation(),
    new PgInstrumentation(),
    new IORedisInstrumentation(),
    new KafkaJsInstrumentation(),
  ],
});

sdk.start();
