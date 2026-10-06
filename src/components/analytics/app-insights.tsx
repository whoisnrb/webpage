'use client'

import { useEffect } from 'react'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

let appInsightsInstance: ApplicationInsights | null = null

const DEFAULT_CONNECTION_STRING = "InstrumentationKey=eaeb52c4-0ed5-4726-9465-0013356ab1b2;IngestionEndpoint=https://northeurope-2.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;ApplicationId=6b3fb9ac-d008-4d3f-9540-725c5fb56391"

export function AppInsights() {
  useEffect(() => {
    const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING || DEFAULT_CONNECTION_STRING
    if (!connectionString || appInsightsInstance) return

    try {
      appInsightsInstance = new ApplicationInsights({
        config: {
          connectionString,
          enableAutoRouteTracking: true,
          disableFetchTracking: false,
          enableCorsCorrelation: true,
          enableUnhandledPromiseRejectionTracking: true,
        },
      })
      appInsightsInstance.loadAppInsights()
      appInsightsInstance.trackPageView()
    } catch (err) {
      console.warn('Azure AppInsights initialization warning:', err)
    }
  }, [])

  return null
}
