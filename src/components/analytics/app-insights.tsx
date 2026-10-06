'use client'

import { useEffect } from 'react'
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

let appInsightsInstance: ApplicationInsights | null = null

export function AppInsights() {
  useEffect(() => {
    const connectionString = process.env.NEXT_PUBLIC_APPLICATIONINSIGHTS_CONNECTION_STRING
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
