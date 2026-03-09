declare module '@opentelemetry/resources' {
  export class Resource {
    constructor(attributes?: Record<string, string | number | boolean | undefined>);
  }
}
