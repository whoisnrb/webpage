import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const services = [
    {
        name: "Scriptek és Automatizáció",
        nameEn: "Scripts & Automation",
        slug: "scriptek",
        description: "Egyedi Python scriptek és automatizációs megoldások, amelyek felgyorsítják a munkafolyamataidat és csökkentik a manuális munkát.",
        descriptionEn: "Custom Python scripts and automation solutions that speed up your workflows and reduce manual labor.",
        price: 50000,
        icon: "Code2",
        href: "/szolgaltatasok/scriptek",
        features: JSON.stringify([
            "Egyedi Python scriptek fejlesztése",
            "Munkafolyamat automatizálás",
            "API integrációk",
            "Adatfeldolgozás és elemzés"
        ]),
        featuresEn: JSON.stringify([
            "Custom Python script development",
            "Workflow automation",
            "API integrations",
            "Data processing and analysis"
        ]),
        active: true,
        sortOrder: 0,
    },
    {
        name: "Webfejlesztés",
        nameEn: "Web Development",
        slug: "webfejlesztes",
        description: "Modern, reszponzív weboldalak és webalkalmazások fejlesztése a legújabb technológiákkal.",
        descriptionEn: "Modern, responsive websites and web applications built with the latest technologies.",
        price: 150000,
        icon: "ShoppingCart",
        href: "/szolgaltatasok/webfejlesztes",
        features: JSON.stringify([
            "Modern, reszponzív design",
            "Next.js / React alapú fejlesztés",
            "SEO optimalizáció",
            "Teljes e-commerce megoldások"
        ]),
        featuresEn: JSON.stringify([
            "Modern, responsive design",
            "Next.js / React development",
            "SEO optimization",
            "Full e-commerce solutions"
        ]),
        active: true,
        sortOrder: 1,
    },
    {
        name: "Rendszerüzemeltetés",
        nameEn: "System Administration",
        slug: "rendszeruzemeltetes",
        description: "Professzionális szerverüzemeltetés, virtualizáció és felhőmegoldások az Ön infrastruktúrájához.",
        descriptionEn: "Professional server management, virtualization and cloud solutions for your infrastructure.",
        price: 0,
        icon: "Server",
        href: "/szolgaltatasok/rendszeruzemeltetes",
        features: JSON.stringify([
            "Virtualizáció és felhőmegoldások",
            "Szerverfelügyelet és karbantartás",
            "24/7 monitoring",
            "Katasztrófa-helyreállítás"
        ]),
        featuresEn: JSON.stringify([
            "Virtualization and cloud solutions",
            "Server management and maintenance",
            "24/7 monitoring",
            "Disaster recovery"
        ]),
        active: true,
        sortOrder: 2,
    },
    {
        name: "Biztonság",
        nameEn: "Security",
        slug: "biztonsag",
        description: "IT biztonsági audit, penetrációs tesztelés és adatvédelmi megoldások vállalkozásod számára.",
        descriptionEn: "IT security audit, penetration testing and data protection solutions for your business.",
        price: 80000,
        icon: "Shield",
        href: "/szolgaltatasok/biztonsag",
        features: JSON.stringify([
            "Biztonsági audit és tanácsadás",
            "Penetrációs tesztelés",
            "Adatvédelem és GDPR",
            "Incidenskezelés"
        ]),
        featuresEn: JSON.stringify([
            "Security audit and consulting",
            "Penetration testing",
            "Data protection and GDPR",
            "Incident management"
        ]),
        active: true,
        sortOrder: 3,
    },
    {
        name: "Hálózat",
        nameEn: "Network",
        slug: "halozat",
        description: "Professzionális hálózati infrastruktúra tervezés, kivitelezés és karbantartás.",
        descriptionEn: "Professional network infrastructure design, implementation and maintenance.",
        price: 0,
        icon: "Server",
        href: "/szolgaltatasok/halozat",
        features: JSON.stringify([
            "Hálózattervezés és kivitelezés",
            "VPN és távoli hozzáférés",
            "WiFi optimalizálás",
            "Hálózatbiztonság"
        ]),
        featuresEn: JSON.stringify([
            "Network design and implementation",
            "VPN and remote access",
            "WiFi optimization",
            "Network security"
        ]),
        active: true,
        sortOrder: 4,
    },
]

async function main() {
    console.log('Seeding services...')

    for (const service of services) {
        await prisma.service.upsert({
            where: { slug: service.slug },
            update: service,
            create: service,
        })
        console.log(`  ✓ ${service.name}`)
    }

    console.log('Done! Seeded', services.length, 'services.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
