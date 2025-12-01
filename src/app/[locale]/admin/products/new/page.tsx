import { ProductForm } from "../product-form"

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Új termék létrehozása</h1>
            <ProductForm />
        </div>
    )
}
