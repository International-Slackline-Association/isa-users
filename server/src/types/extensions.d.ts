interface ServerlessLogSubscriptionPluginConfig {
  logSubscription:
    | {
        enabled: boolean;
        filterPattern?: string;
        addLambdaPermission?: boolean;
        apiGatewayLogs?: boolean;
      }
    | boolean;
}

declare module '@turinggroup/serverless-express-custom-domain-middleware' {
  interface SetupOpts {
    onRouted: (orig: string, interpolated: string) => void;
  }
  export const setup: (opts?: SetupOpts) => NextHandleFunction;
}
