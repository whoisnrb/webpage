"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const codeSnippet = `import asyncio
from automation import Task, Result

async function automate_workflow():
    # 1. Adatok begyűjtése
    data = await scraper.fetch_leads()
    
    # 2. Feldolgozás & Elemzés
    processed = ai_analyzer.process(data)
    
    # 3. Jelentés generálása
    report = generate_pdf(processed)
    
    # 4. Automatikus küldés
    await email.send(
        to="ugyfel@ceg.hu",
        attachment=report
    )
    
    return Result.SUCCESS

# Indítás...
await automate_workflow()`

export function CodeWindow() {
    const [text, setText] = useState("")
    const [lineIndex, setLineIndex] = useState(0)

    useEffect(() => {
        let currentIndex = 0
        const interval = setInterval(() => {
            if (currentIndex <= codeSnippet.length) {
                setText(codeSnippet.slice(0, currentIndex))
                currentIndex++
            } else {
                clearInterval(interval)
            }
        }, 30) // Typing speed

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="rounded-xl overflow-hidden border bg-[#1e1e1e] shadow-2xl font-mono text-sm">
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-4 py-3 bg-[#252526] border-b border-[#333]">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="ml-4 text-xs text-gray-400">automation.py</div>
            </div>

            {/* Code Area */}
            <div className="p-4 overflow-x-auto">
                <pre className="text-gray-300 leading-relaxed">
                    <code>
                        {text.split('\n').map((line, i) => (
                            <div key={i} className="table-row">
                                <span className="table-cell text-gray-600 select-none pr-4 text-right w-8">{i + 1}</span>
                                <span className="table-cell">
                                    {line.split(' ').map((word, j) => {
                                        // Simple syntax highlighting simulation
                                        let color = "text-gray-300"
                                        if (['import', 'from', 'async', 'def', 'return', 'await'].includes(word)) color = "text-[#c586c0]" // Keywords
                                        else if (['function', 'class'].includes(word)) color = "text-[#569cd6]"
                                        else if (word.includes('(')) color = "text-[#dcdcaa]" // Functions
                                        else if (word.startsWith('#')) color = "text-[#6a9955]" // Comments
                                        else if (word.includes('"')) color = "text-[#ce9178]" // Strings

                                        // Fix for comments (whole line green if starts with #)
                                        if (line.trim().startsWith('#')) return <span key={j} className="text-[#6a9955]">{word} </span>

                                        return <span key={j} className={color}>{word} </span>
                                    })}
                                </span>
                            </div>
                        ))}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-2 h-4 bg-white ml-1 align-middle"
                        />
                    </code>
                </pre>
            </div>
        </div>
    )
}
