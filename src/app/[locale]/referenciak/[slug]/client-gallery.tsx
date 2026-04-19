"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface ClientGalleryProps {
    images: string[]
    title: string
}

export function ClientGallery({ images, title }: ClientGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIndex((prev) => (prev !== null ? (prev === 0 ? images.length - 1 : prev - 1) : null))
    }

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedIndex((prev) => (prev !== null ? (prev === images.length - 1 ? 0 : prev + 1) : null))
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, i) => (
                    <div 
                        key={i} 
                        className="aspect-video rounded-xl overflow-hidden shadow-md group border cursor-pointer"
                        onClick={() => setSelectedIndex(i)}
                    >
                        <img 
                            src={img} 
                            alt={`${title} ${i + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                    </div>
                ))}
            </div>

            <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
                <DialogContent className="max-w-[95vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] p-0 border-none bg-transparent shadow-none [&>button]:hidden flex items-center justify-center">
                    <DialogTitle className="sr-only">Galéria kép</DialogTitle>
                    <DialogDescription className="sr-only">Referencia galéria fókuszált képe</DialogDescription>
                    {selectedIndex !== null && (
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
                            <div className="absolute top-0 right-0 z-50 sm:-right-12 sm:top-0">
                                <button 
                                    onClick={() => setSelectedIndex(null)}
                                    className="p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                                    aria-label="Bezárás"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={handlePrevious}
                                        className="absolute left-2 sm:-left-12 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                                        aria-label="Előző kép"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button 
                                        onClick={handleNext}
                                        className="absolute right-2 sm:-right-12 top-1/2 -translate-y-1/2 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-sm transition-colors"
                                        aria-label="Következő kép"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}

                            <img 
                                src={images[selectedIndex]} 
                                alt={`${title} ${selectedIndex + 1}`} 
                                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            />
                            
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 text-white rounded-full text-sm font-medium backdrop-blur-sm z-50">
                                {selectedIndex + 1} / {images.length}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
