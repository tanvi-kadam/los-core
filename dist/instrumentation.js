"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_node_1 = require("@opentelemetry/sdk-node");
const exporter_trace_otlp_grpc_1 = require("@opentelemetry/exporter-trace-otlp-grpc");
const resources_1 = require("@opentelemetry/resources");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_pg_1 = require("@opentelemetry/instrumentation-pg");
const instrumentation_ioredis_1 = require("@opentelemetry/instrumentation-ioredis");
const instrumentation_kafkajs_1 = require("@opentelemetry/instrumentation-kafkajs");
const endpoint = process.env["OTEL_EXPORTER_OTLP_ENDPOINT"] ?? "http://152.67.7.3:4317";
const serviceName = process.env["OTEL_SERVICE_NAME"] ?? "los-core";
const traceExporter = new exporter_trace_otlp_grpc_1.OTLPTraceExporter({
    url: endpoint,
});
const sdk = new sdk_node_1.NodeSDK({
    resource: new resources_1.Resource({
        "service.name": serviceName,
    }),
    traceExporter,
    instrumentations: [
        new instrumentation_http_1.HttpInstrumentation(),
        new instrumentation_pg_1.PgInstrumentation(),
        new instrumentation_ioredis_1.IORedisInstrumentation(),
        new instrumentation_kafkajs_1.KafkaJsInstrumentation(),
    ],
});
sdk.start();
//# sourceMappingURL=instrumentation.js.map