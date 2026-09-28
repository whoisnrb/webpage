/**
 * Service JSON-LD structured data component.
 * Generates Schema.org Service markup for service pages.
 */

interface ServiceJsonLdProps {
  name: string;
  description: string;
  serviceType: string;
  url: string;
}

export function ServiceJsonLd({ name, description, serviceType, url }: ServiceJsonLdProps) {
  const baseUrl = "https://backlineit.hu";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceType,
    "name": name,
    "description": description,
    "provider": {
      "@type": "ProfessionalService",
      "@id": `${baseUrl}/#organization`,
    },
    "areaServed": {
      "@type": "Country",
      "name": "Hungary",
    },
    "url": url.startsWith("http") ? url : `${baseUrl}${url}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
