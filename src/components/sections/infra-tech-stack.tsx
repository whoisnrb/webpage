"use client"

import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { FadeIn } from "@/components/ui/motion-wrapper"
import Image from "next/image"

// Tech stack items with SVG logos from Simple Icons CDN
const techCategories = {
    virtualization: [
        { name: "Proxmox", logo: "https://cdn.simpleicons.org/proxmox/E57000" },
        { name: "VMware", logo: "https://cdn.simpleicons.org/vmware/607078" },
        { name: "KVM", logo: "https://cdn.simpleicons.org/linux/FCC624" },
        { name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ED" },
        { name: "Kubernetes", logo: "https://cdn.simpleicons.org/kubernetes/326CE5" },
        { name: "Portainer", logo: "https://cdn.simpleicons.org/portainer/13BEF9" },
    ],
    network: [
        { name: "MikroTik", logo: "https://cdn.simpleicons.org/mikrotik/293239" },
        { name: "Ubiquiti", logo: "https://cdn.simpleicons.org/ubiquiti/0559C9" },
        { name: "pfSense", logo: "https://cdn.simpleicons.org/pfsense/212121" },
        { name: "WireGuard", logo: "https://cdn.simpleicons.org/wireguard/88171A" },
        { name: "OpenVPN", logo: "https://cdn.simpleicons.org/openvpn/EA7E20" },
        { name: "Cloudflare", logo: "https://cdn.simpleicons.org/cloudflare/F38020" },
    ],
    os: [
        { name: "Debian", logo: "https://cdn.simpleicons.org/debian/A81D33" },
        { name: "Ubuntu", logo: "https://cdn.simpleicons.org/ubuntu/E95420" },
        { name: "Rocky Linux", logo: "https://cdn.simpleicons.org/rockylinux/10B981" },
        { name: "Windows Server", logo: "/assets/icons/windows.svg" },
        { name: "AlmaLinux", logo: "https://cdn.simpleicons.org/almalinux/0F4266" },
        { name: "CentOS", logo: "https://cdn.simpleicons.org/centos/262577" },
    ],
    automation: [
        { name: "Ansible", logo: "https://cdn.simpleicons.org/ansible/EE0000" },
        { name: "Terraform", logo: "https://cdn.simpleicons.org/terraform/844FBA" },
        { name: "GitHub Actions", logo: "https://cdn.simpleicons.org/githubactions/2088FF" },
        { name: "Prometheus", logo: "https://cdn.simpleicons.org/prometheus/E6522C" },
        { name: "Grafana", logo: "https://cdn.simpleicons.org/grafana/F46800" },
        { name: "Zabbix", logo: "/assets/icons/zabbix.svg" },
    ],
}

export function InfraTechStack() {
    const t = useTranslations("Services.SysAdmin")

    const categories = ["virtualization", "network", "os", "automation"] as const

    return (
        <section className="py-24 md:py-32 relative overflow-hidden bg-slate-950/50">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <FadeIn>
                        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-[10px] font-black tracking-[0.4em] uppercase rounded-full bg-white/[0.03] text-primary border border-white/10 backdrop-blur-xl">
                            {t("tech_stack_badge")}
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6">
                            {t("tech_stack_title")}
                        </h2>
                        <p className="text-xl text-white/40 max-w-2xl mx-auto font-medium">
                            {t("tech_stack_desc")}
                        </p>
                    </FadeIn>
                </div>

                <div className="max-w-6xl mx-auto space-y-12">
                    {categories.map((category, catIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: catIndex * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <h3 className="text-lg font-bold text-white/60 uppercase tracking-wider mb-6 pl-4 border-l-4 border-primary">
                                {t(`tech_categories.${category}`)}
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                {techCategories[category].map((tech, index) => (
                                    <motion.div
                                        key={tech.name}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: (catIndex * 0.1) + (index * 0.05) }}
                                        viewport={{ once: true }}
                                        className="group relative"
                                    >
                                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300">
                                            <div className="relative h-10 w-10 flex items-center justify-center">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={tech.logo}
                                                    alt={tech.name}
                                                    className="h-8 w-8 object-contain filter brightness-0 invert opacity-60 group-hover:opacity-100 transition-opacity"
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-white/40 group-hover:text-white/80 transition-colors text-center">
                                                {tech.name}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
