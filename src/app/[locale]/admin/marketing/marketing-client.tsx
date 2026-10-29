"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "@/i18n/routing"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import {
    generateMarketingCampaign,
    saveGeneratedBlogPost,
    MarketingCampaignResult,
} from "@/app/actions/marketing-autopilot"
import {
    Sparkles,
    Bot,
    FileText,
    Share2,
    ImageIcon,
    Copy,
    Check,
    Save,
    ExternalLink,
    RefreshCw,
    ShieldCheck,
    CheckCircle2,
    Eye,
    Code,
    Zap,
    Send,
} from "lucide-react"

interface MarketingClientProps {
    userEmail: string
}

const PRESET_TOPICS = [
    {
        emoji: "🛡️",
        category: "Kiberbiztonság",
        title: "Kiberbiztonsági Kézikönyv KKV-knak 2026: Hogyan védd meg céged leállások és adatszivárgás ellen",
        coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    },
    {
        emoji: "☁️",
        category: "Felhőmigráció",
        title: "Felhőmigráció Lépésről Lépésre: Azure előnyök & IT üzemeltetési költségcsökkentés a gyakorlatban",
        coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    },
    {
        emoji: "⚡",
        category: "Automatizáció",
        title: "Hogyan spóroltunk napi 2 órát számlázási & adatbázis Python szkriptekkel? – Esettanulmány",
        coverImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    },
    {
        emoji: "👨‍💻",
        category: "Rendszerüzemeltetés",
        title: "Havidíjas Rendszergazda vs. Belső IT csapat: Melyik éri meg jobban a növekvő KKV-knak?",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    },
    {
        emoji: "🤖",
        category: "AI & Innováció",
        title: "Céges Belső AI Asszisztens saját adatokkal: RAG architektúra és biztonságos bevezetés",
        coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    },
    {
        emoji: "🌐",
        category: "Webfejlesztés",
        title: "Miért váltanak a prémium B2B cégek Next.js és modern felhő architektúrára 2026-ban?",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    },
]

export function MarketingClient({ userEmail }: MarketingClientProps) {
    const [topic, setTopic] = useState(PRESET_TOPICS[0].title)
    const [targetAudience, setTargetAudience] = useState("Magyar KKV cégvezetők és ügyvezetők")
    const [tone, setTone] = useState("Szakmai, hiteles, probléma-megoldás fókuszú")
    const [customNotes, setCustomNotes] = useState("")

    const [isGenerating, startGenerating] = useTransition()
    const [isSaving, startSaving] = useTransition()
    const [hasSaved, setHasSaved] = useState(false)
    const [savedSlug, setSavedSlug] = useState<string | null>(null)

    // Result state
    const [result, setResult] = useState<MarketingCampaignResult | null>(null)

    // Blog editable fields
    const [blogTitle, setBlogTitle] = useState("")
    const [blogSlug, setBlogSlug] = useState("")
    const [blogExcerpt, setBlogExcerpt] = useState("")
    const [blogContent, setBlogContent] = useState("")
    const [blogTags, setBlogTags] = useState<string[]>([])
    const [blogCoverImage, setBlogCoverImage] = useState("")
    const [activeViewMode, setActiveViewMode] = useState<"preview" | "raw">("preview")

    // Copy states
    const [copiedLinkedIn, setCopiedLinkedIn] = useState(false)
    const [copiedDalle, setCopiedDalle] = useState(false)
    const [copiedMarkdown, setCopiedMarkdown] = useState(false)

    const handleSelectPreset = (preset: typeof PRESET_TOPICS[0]) => {
        setTopic(preset.title)
        setBlogCoverImage(preset.coverImage)
        toast.info(`Kiválasztott téma: ${preset.category}`)
    }

    const handleGenerate = () => {
        if (!topic.trim()) {
            toast.error("Kérlek, adj meg egy témát vagy válassz egy sablont!")
            return
        }

        setHasSaved(false)
        setSavedSlug(null)

        startGenerating(async () => {
            toast.loading("Azure OpenAI GPT-4o generálja a marketing anyagokat...", { id: "generating" })
            const res = await generateMarketingCampaign({
                topic,
                targetAudience,
                tone,
                customNotes,
            })

            toast.dismiss("generating")

            if (res.success && res.data) {
                setResult(res.data)
                setBlogTitle(res.data.blog.title)
                setBlogSlug(res.data.blog.slug)
                setBlogExcerpt(res.data.blog.excerpt)
                setBlogContent(res.data.blog.content)
                setBlogTags(res.data.blog.tags || [])
                setBlogCoverImage(res.data.blog.suggestedCoverUrl || PRESET_TOPICS[0].coverImage)
                toast.success("✨ Marketing csomag sikeresen elkészült!")
            } else {
                toast.error(res.error || "Hiba történt a generálás során.")
            }
        })
    }

    const handleSavePost = (publishImmediately: boolean) => {
        if (!blogTitle || !blogSlug || !blogContent) {
            toast.error("A blogcikk címe, slugja és tartalma kötelező.")
            return
        }

        startSaving(async () => {
            const res = await saveGeneratedBlogPost({
                title: blogTitle,
                slug: blogSlug,
                excerpt: blogExcerpt,
                content: blogContent,
                tags: blogTags,
                coverImage: blogCoverImage,
                published: publishImmediately,
            })

            if (res.success && "slug" in res && res.slug) {
                setHasSaved(true)
                setSavedSlug(res.slug)
                toast.success(
                    publishImmediately
                        ? "🎉 Blogcikk azonnal publikálva lett a weboldalon!"
                        : "💾 Blogcikk sikeresen elmentve piszkozatként az admin blogba!"
                )
            } else {
                toast.error(("error" in res && res.error) ? String(res.error) : "Nem sikerült elmenteni a cikket.")
            }
        })
    }

    const copyToClipboard = async (text: string, type: "linkedin" | "dalle" | "markdown") => {
        try {
            await navigator.clipboard.writeText(text)
            if (type === "linkedin") {
                setCopiedLinkedIn(true)
                setTimeout(() => setCopiedLinkedIn(false), 2000)
                toast.success("LinkedIn poszt másolva a vágólapra!")
            } else if (type === "dalle") {
                setCopiedDalle(true)
                setTimeout(() => setCopiedDalle(false), 2000)
                toast.success("DALL-E prompt másolva a vágólapra!")
            } else if (type === "markdown") {
                setCopiedMarkdown(true)
                setTimeout(() => setCopiedMarkdown(false), 2000)
                toast.success("Markdown tartalom másolva a vágólapra!")
            }
        } catch {
            toast.error("Nem sikerült másolni a vágólapra.")
        }
    }

    return (
        <div className="space-y-8">
            {/* Top Header & Status */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#0c0e1e] via-[#090d16] to-[#0d1326] p-6 md:p-8 shadow-2xl backdrop-blur-md">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                                <Sparkles className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
                                Azure OpenAI Autopilot
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                                GPT-4o Online (Sweden Central)
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                            Marketing Autopilot
                        </h2>
                        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
                            Generálj professzionális, SEO-optimalizált blogcikkeket, figyelemfelkeltő LinkedIn posztokat és DALL-E képi illusztrációkat egyetlen kattintással a BacklineIT B2B márkaidentitására kalibrálva.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <Link href={"/admin/blog" as any}>
                            <Button
                                variant="outline"
                                className="border-white/10 hover:border-cyan-500/30 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                            >
                                <FileText className="h-4 w-4 text-cyan-400" />
                                Blog Bejegyzések ({hasSaved ? "1 új piszkozat" : "Lista"})
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Topic Selection & Generator Card */}
            <Card className="border border-white/10 bg-[#090d16]/70 rounded-3xl shadow-xl backdrop-blur-sm overflow-hidden">
                <CardHeader className="border-b border-white/5 bg-[#0b101c]/40 pb-5">
                    <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-purple-400" />
                        <CardTitle className="text-lg font-bold text-white">Téma & Beállítások</CardTitle>
                    </div>
                    <CardDescription className="text-slate-400 text-xs">
                        Válassz a BacklineIT legfontosabb szakmai területeiből, vagy írj be egy egyedi témát.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {/* Preset Topic Chips */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Gyors Sablonok (Kattints a kiválasztáshoz)
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                            {PRESET_TOPICS.map((p, idx) => {
                                const isSelected = topic === p.title
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => handleSelectPreset(p)}
                                        className={`text-left p-3 rounded-2xl border transition-all duration-200 flex flex-col gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? "border-purple-500/60 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                                : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15"
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                                                <span>{p.emoji}</span>
                                                {p.category}
                                            </span>
                                            {isSelected && (
                                                <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                            {p.title}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* Topic Input */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Cikk & Poszt Témája / Címötlet
                        </label>
                        <Textarea
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Pl.: Hogyan költöztethető egy elavult szerver a felhőbe leállás és adatvesztés nélkül?"
                            className="bg-[#0b101c] border-white/10 text-white rounded-xl focus:border-purple-500 min-h-[85px] leading-relaxed resize-none text-sm"
                        />
                    </div>

                    {/* Settings grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Célközönség
                            </label>
                            <select
                                value={targetAudience}
                                onChange={(e) => setTargetAudience(e.target.value)}
                                className="w-full bg-[#0b101c] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                            >
                                <option value="Magyar KKV cégvezetők és ügyvezetők">KKV cégvezetők & döntéshozók</option>
                                <option value="IT vezetők, CTO-k és rendszergazdák">IT vezetők & CTO-k</option>
                                <option value="Növekvő vállalkozások és webáruház tulajdonosok">E-kereskedelem & webáruházak</option>
                                <option value="Pénzügyi és könyvelő irodák">Irodák & adminisztratív KKV-k</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Hangnem & Stílus
                            </label>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value)}
                                className="w-full bg-[#0b101c] border border-white/10 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500"
                            >
                                <option value="Szakmai, hiteles, probléma-megoldás fókuszú">Szakmai, hiteles & megoldásközpontú</option>
                                <option value="Gyakorlatias esettanulmány lépésről lépésre">Gyakorlatias How-To / Esettanulmány</option>
                                <option value="Dinamikus, figyelemfelkeltő & provokatív">Dinamikus & figyelemfelkeltő</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                Extra fókusz / Megjegyzés
                            </label>
                            <Input
                                value={customNotes}
                                onChange={(e) => setCustomNotes(e.target.value)}
                                placeholder="Pl.: Emeld ki a BacklineIT ingyenes auditját"
                                className="bg-[#0b101c] border-white/10 text-white rounded-xl text-xs focus:border-purple-500 h-[38px]"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-slate-400 flex items-center gap-1.5">
                            <Bot className="h-4 w-4 text-purple-400" />
                            Modell: <strong className="text-slate-200">gpt-4o-2024-11-20</strong> (Azure AI Sweden Central)
                        </p>

                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold px-7 py-3 rounded-2xl shadow-lg shadow-purple-600/25 border border-purple-400/40 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                                    <span>Generálás folyamatban az Azure-ban...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="h-4 w-4 text-yellow-300" />
                                    <span>Marketing Csomag Generálása</span>
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results Display */}
            {result ? (
                <div className="space-y-6">
                    <Tabs defaultValue="blog" className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#090d16]/60 p-2 rounded-2xl border border-white/10">
                            <TabsList className="bg-[#0b101c] p-1 rounded-xl border border-white/5">
                                <TabsTrigger
                                    value="blog"
                                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg text-xs font-semibold px-4 py-2 flex items-center gap-2 text-slate-300 cursor-pointer"
                                >
                                    <FileText className="h-3.5 w-3.5" />
                                    1. Blogcikk (SEO)
                                </TabsTrigger>
                                <TabsTrigger
                                    value="linkedin"
                                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-lg text-xs font-semibold px-4 py-2 flex items-center gap-2 text-slate-300 cursor-pointer"
                                >
                                    <Share2 className="h-3.5 w-3.5" />
                                    2. LinkedIn Poszt
                                </TabsTrigger>
                                <TabsTrigger
                                    value="visual"
                                    className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white rounded-lg text-xs font-semibold px-4 py-2 flex items-center gap-2 text-slate-300 cursor-pointer"
                                >
                                    <ImageIcon className="h-3.5 w-3.5" />
                                    3. Kép & Illusztráció Prompt
                                </TabsTrigger>
                            </TabsList>

                            {/* Saved Notification */}
                            {hasSaved && savedSlug && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    <span>Elmentve az adatbázisba!</span>
                                    <Link
                                        href={`/blog/${savedSlug}` as any}
                                        target="_blank"
                                        className="underline hover:text-emerald-300 flex items-center gap-1 ml-1"
                                    >
                                        Előnézet
                                        <ExternalLink className="h-3 w-3" />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* TAB 1: BLOG */}
                        <TabsContent value="blog" className="space-y-6">
                            <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl overflow-hidden shadow-2xl">
                                <CardHeader className="border-b border-white/5 bg-[#0b101c]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 font-medium">
                                                {result.blog.readingTime || "5 perc olvasás"}
                                            </Badge>
                                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-medium">
                                                SEO Kész
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl font-bold text-white">
                                            SEO Blogcikk Szerkesztése & Közzététele
                                        </CardTitle>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => copyToClipboard(blogContent, "markdown")}
                                            className="border-white/10 hover:border-white/20 bg-white/5 text-slate-200 text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                                        >
                                            {copiedMarkdown ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5 text-slate-400" />
                                            )}
                                            {copiedMarkdown ? "Másolva!" : "Markdown másolása"}
                                        </Button>

                                        <Button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => handleSavePost(false)}
                                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-white/10 flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Save className="h-3.5 w-3.5 text-purple-400" />
                                            Mentés piszkozatként
                                        </Button>

                                        <Button
                                            type="button"
                                            disabled={isSaving}
                                            onClick={() => handleSavePost(true)}
                                            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <Send className="h-3.5 w-3.5 text-white" />
                                            Azonnali publikálás a blogon
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6 space-y-5">
                                    {/* Meta fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">Cikk címe (Title)</label>
                                            <Input
                                                value={blogTitle}
                                                onChange={(e) => setBlogTitle(e.target.value)}
                                                className="bg-[#0b101c] border-white/10 text-white rounded-xl text-sm"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">URL Slug</label>
                                            <Input
                                                value={blogSlug}
                                                onChange={(e) => setBlogSlug(e.target.value)}
                                                className="bg-[#0b101c] border-white/10 text-cyan-300 font-mono text-xs rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {/* Excerpt */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold text-slate-400">Kivonat / Meta Description</label>
                                        <Textarea
                                            value={blogExcerpt}
                                            onChange={(e) => setBlogExcerpt(e.target.value)}
                                            className="bg-[#0b101c] border-white/10 text-slate-200 rounded-xl text-xs min-h-[60px] resize-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Tags & Cover image */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">Címkék (Vesszővel elválasztva)</label>
                                            <Input
                                                value={blogTags.join(", ")}
                                                onChange={(e) =>
                                                    setBlogTags(
                                                        e.target.value
                                                            .split(",")
                                                            .map((t) => t.trim())
                                                            .filter(Boolean)
                                                    )
                                                }
                                                className="bg-[#0b101c] border-white/10 text-slate-300 rounded-xl text-xs"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-400">Borítókép URL</label>
                                            <Input
                                                value={blogCoverImage}
                                                onChange={(e) => setBlogCoverImage(e.target.value)}
                                                className="bg-[#0b101c] border-white/10 text-slate-300 rounded-xl text-xs font-mono"
                                            />
                                        </div>
                                    </div>

                                    {/* View Toggle */}
                                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                            Cikk törzsszövege (Markdown)
                                        </span>
                                        <div className="flex items-center gap-1 bg-[#0b101c] p-1 rounded-xl border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setActiveViewMode("preview")}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                    activeViewMode === "preview"
                                                        ? "bg-purple-600 text-white"
                                                        : "text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                <Eye className="h-3 w-3" />
                                                Formázott Előnézet
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setActiveViewMode("raw")}
                                                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                                    activeViewMode === "raw"
                                                        ? "bg-purple-600 text-white"
                                                        : "text-slate-400 hover:text-white"
                                                }`}
                                            >
                                                <Code className="h-3 w-3" />
                                                Markdown Kód
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content display */}
                                    {activeViewMode === "preview" ? (
                                        <div className="bg-[#060913] border border-white/5 rounded-2xl p-6 md:p-8 max-h-[500px] overflow-y-auto custom-scrollbar">
                                            <div className="prose prose-invert prose-cyan max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed prose-li:text-slate-300 prose-strong:text-white prose-blockquote:border-l-purple-500 prose-blockquote:bg-purple-500/5 prose-blockquote:text-slate-300 prose-blockquote:p-4 prose-blockquote:rounded-r-xl">
                                                <ReactMarkdown>{blogContent}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ) : (
                                        <Textarea
                                            value={blogContent}
                                            onChange={(e) => setBlogContent(e.target.value)}
                                            className="bg-[#060913] border-white/10 text-slate-200 font-mono text-xs rounded-2xl p-4 min-h-[400px] resize-y leading-relaxed focus:border-purple-500"
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 2: LINKEDIN */}
                        <TabsContent value="linkedin" className="space-y-6">
                            <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl overflow-hidden shadow-2xl">
                                <CardHeader className="border-b border-white/5 bg-[#0b101c]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                            <Share2 className="h-5 w-5 text-blue-400" />
                                            LinkedIn Poszt Előnézet
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 text-xs">
                                            Optimalizálva B2B szakmai elérésre, erős nyitással és magas kattintási aránnyal.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => copyToClipboard(result.linkedin.fullText, "linkedin")}
                                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
                                    >
                                        {copiedLinkedIn ? (
                                            <Check className="h-4 w-4 text-white" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-white" />
                                        )}
                                        {copiedLinkedIn ? "Másolva a vágólapra!" : "LinkedIn Poszt Másolása"}
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-6 md:p-8 flex justify-center">
                                    {/* LinkedIn Preview Card */}
                                    <div className="w-full max-w-2xl bg-[#0b101c] border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
                                        {/* Mock LinkedIn Profile */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md">
                                                B
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                                                    BacklineIT
                                                    <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded font-normal">
                                                        Cég
                                                    </span>
                                                </h4>
                                                <p className="text-[11px] text-slate-400">
                                                    Informatikai Partner & Rendszerüzemeltetés KKV-knak • 1 órája • 🌐
                                                </p>
                                            </div>
                                        </div>

                                        {/* Post Text */}
                                        <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-sans border-t border-white/5 pt-3">
                                            {result.linkedin.fullText}
                                        </div>

                                        {/* Mock LinkedIn Engagement Bar */}
                                        <div className="border-t border-white/5 pt-3 flex items-center justify-between text-xs text-slate-400">
                                            <span>👍💡❤️ 142 elismerés</span>
                                            <span>28 hozzászólás • 12 megosztás</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB 3: VISUAL */}
                        <TabsContent value="visual" className="space-y-6">
                            <Card className="border border-white/10 bg-[#090d16]/80 rounded-3xl overflow-hidden shadow-2xl">
                                <CardHeader className="border-b border-white/5 bg-[#0b101c]/60 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                            <ImageIcon className="h-5 w-5 text-cyan-400" />
                                            Képi Koncepció & DALL-E 3 / Midjourney Prompt
                                        </CardTitle>
                                        <CardDescription className="text-slate-400 text-xs">
                                            Kifejezetten a BacklineIT sötétkék és élénk neon-cyan stílusára hangolt vizuális instrukciók.
                                        </CardDescription>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => copyToClipboard(result.visual.dallePrompt, "dalle")}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-cyan-600/25 cursor-pointer"
                                    >
                                        {copiedDalle ? (
                                            <Check className="h-4 w-4 text-white" />
                                        ) : (
                                            <Copy className="h-4 w-4 text-white" />
                                        )}
                                        {copiedDalle ? "Prompt másolva!" : "DALL-E Prompt Másolása"}
                                    </Button>
                                </CardHeader>

                                <CardContent className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {/* Cover Image Preview */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                                Javasolt Borítókép Előnézet
                                            </label>
                                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-xl group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={blogCoverImage || PRESET_TOPICS[0].coverImage}
                                                    alt="Cover preview"
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                                            {result.visual.bannerHeadline || "IT MEGOLDÁSOK"}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-white">
                                                            {result.visual.bannerSubline || blogTitle}
                                                        </h4>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Prompts & Concept */}
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-400">
                                                    Vizuális Koncepció Leírása
                                                </label>
                                                <p className="text-xs text-slate-300 bg-[#0b101c] p-4 rounded-xl border border-white/5 leading-relaxed">
                                                    {result.visual.conceptDescription}
                                                </p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-cyan-400 flex items-center justify-between">
                                                    <span>Angol Nyelvű Képgeneráló Prompt (DALL-E 3)</span>
                                                    <span className="text-[10px] font-mono text-slate-400">16:9 arány</span>
                                                </label>
                                                <Textarea
                                                    readOnly
                                                    value={result.visual.dallePrompt}
                                                    className="bg-[#0b101c] border-white/10 text-cyan-200 font-mono text-xs rounded-xl min-h-[120px] resize-none leading-relaxed"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-[#0b101c] p-3 rounded-xl border border-white/5">
                                                    <span className="text-[10px] text-slate-400 block font-semibold">Banner Főcím Ötlet</span>
                                                    <span className="text-xs font-bold text-white">{result.visual.bannerHeadline}</span>
                                                </div>
                                                <div className="bg-[#0b101c] p-3 rounded-xl border border-white/5">
                                                    <span className="text-[10px] text-slate-400 block font-semibold">Banner Alcím Ötlet</span>
                                                    <span className="text-xs font-bold text-slate-300">{result.visual.bannerSubline}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            ) : (
                /* Empty state / Prompt to generate */
                <Card className="border border-white/5 bg-[#090d16]/30 rounded-3xl p-12 text-center shadow-lg">
                    <div className="max-w-md mx-auto space-y-4">
                        <div className="h-16 w-16 mx-auto rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                            <Sparkles className="h-8 w-8 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Készen állsz a tartalomgyártásra?</h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Válassz ki egy sablont a fenti listából vagy írj be egy egyedi témát, majd kattints a{" "}
                            <strong className="text-purple-300">„Marketing Csomag Generálása”</strong> gombra. A rendszer az Azure OpenAI GPT-4o modellt használva mindössze pár másodperc alatt elkészíti a teljes blogcikket, a LinkedIn posztot és a vizuális koncepciót!
                        </p>
                    </div>
                </Card>
            )}
        </div>
    )
}
