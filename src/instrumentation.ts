export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const connectionString =
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
      "InstrumentationKey=eaeb52c4-0ed5-4726-9465-0013356ab1b2;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;ApplicationId=6b3fb9ac-d008-4d3f-9540-725c5fb56391";

    if (connectionString) {
      try {
        const appInsights = await import('applicationinsights');
        
        // Csak egyszer inicializáljuk
        if (!appInsights.defaultClient) {
          appInsights
            .setup(connectionString)
            .setAutoCollectRequests(true)
            .setAutoCollectPerformance(true, true)
            .setAutoCollectExceptions(true)
            .setAutoCollectDependencies(true)
            .setAutoCollectConsole(true, true)
            .setUseDiskRetryCaching(true)
            .setSendLiveMetrics(true)
            .start();

          console.log('[Azure AppInsights] Server-side telemetria sikeresen elindult.');
        }
      } catch (err) {
        console.warn('[Azure AppInsights] Nem sikerült a szerveroldali telemetria indítása:', err);
      }
    }
  }
}
