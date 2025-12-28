import crypto from 'crypto'

export interface SimplePayConfig {
    merchantId: string
    secretKey: string
    sandbox: boolean
    currency: string
    timeout: number
    methods: string
}

export interface PaymentData {
    orderRef: string
    amount: number
    currency: string
    customerEmail: string
    customerName?: string
    language?: string
    methods?: string[]
    timeout?: Date
    successUrl: string
    failUrl: string
    cancelUrl: string
    backUrl: string
}

export interface SimplePayResponse {
    salt: string
    merchant: string
    orderRef: string
    currency: string
    transactionId?: string
    timeout?: string
    total: number
    paymentUrl?: string
    errorCodes?: number[]
    [key: string]: unknown
}

export class SimplePay {
    private config: SimplePayConfig
    private baseUrl: string

    constructor(config: SimplePayConfig) {
        this.config = config
        this.baseUrl = config.sandbox
            ? 'https://sandbox.simplepay.hu/payment/v2'
            : 'https://secure.simplepay.hu/payment/v2'
    }

    /**
     * Generál egy egyedi rendelési azonosítót
     */
    generateOrderRef(): string {
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 9)
        return `ORDER-${timestamp}-${random}`.toUpperCase()
    }

    /**
     * Generál hash-t a SimplePay kommunikációhoz
     */
    private generateHash(data: Record<string, unknown>): string {
        const orderedData: Record<string, unknown> = {}
        Object.keys(data)
            .sort()
            .forEach(key => {
                orderedData[key] = data[key]
            })

        const dataString = Object.values(orderedData).join('')
        const hashBase = `${this.config.secretKey}${dataString}`

        return crypto
            .createHash('md5')
            .update(hashBase, 'utf8')
            .digest('hex')
            .toUpperCase()
    }

    /**
     * Elindít egy fizetési tranzakciót
     */
    async startPayment(paymentData: PaymentData): Promise<SimplePayResponse> {
        const salt = crypto.randomBytes(16).toString('hex')

        const requestData: Record<string, unknown> = {
            salt: salt,
            merchant: this.config.merchantId,
            orderRef: paymentData.orderRef,
            currency: paymentData.currency,
            customerEmail: paymentData.customerEmail,
            language: paymentData.language || 'HU',
            sdkVersion: 'SimplePay_PHP_SDK_2.0',
            methods: paymentData.methods || ['CARD'],
            total: paymentData.amount,
            timeout: paymentData.timeout || new Date(Date.now() + this.config.timeout * 1000),
            url: paymentData.successUrl,
            failUrl: paymentData.failUrl,
            cancelUrl: paymentData.cancelUrl,
            backUrl: paymentData.backUrl,
        }

        // Hash generálás
        const signature = this.generateHash(requestData)

        const payload = {
            ...requestData,
            signature: signature,
        }

        try {
            const response = await fetch(`${this.baseUrl}/start`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            const result: SimplePayResponse = await response.json()

            if (!response.ok) {
                throw new Error(`SimplePay error: ${JSON.stringify(result)}`)
            }

            // Ellenőrizzük a választ
            if (result.errorCodes && result.errorCodes.length > 0) {
                throw new Error(`SimplePay validation errors: ${result.errorCodes.join(', ')}`)
            }

            return result
        } catch (error) {
            console.error('SimplePay start payment error:', error)
            throw error
        }
    }

    /**
     * Validálja az IPN (Instant Payment Notification) callback-et
     */
    validateIPN(data: Record<string, unknown>, receivedSignature: string): boolean {
        const calculatedSignature = this.generateHash(data)
        return calculatedSignature === receivedSignature
    }

    /**
     * Visszaigazolás küldése SimplePay-nek IPN után
     */
    async confirmIPN(data: Record<string, unknown>): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/confirm`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })

            return response.ok
        } catch (error) {
            console.error('SimplePay IPN confirm error:', error)
            return false
        }
    }
}

/**
 * SimplePay singleton instance
 */
export function getSimplePay(): SimplePay {
    const config: SimplePayConfig = {
        merchantId: process.env.SIMPLEPAY_MERCHANT_ID || '',
        secretKey: process.env.SIMPLEPAY_SECRET_KEY || '',
        sandbox: process.env.SIMPLEPAY_SANDBOX === 'true',
        currency: process.env.SIMPLEPAY_CURRENCY || 'HUF',
        timeout: parseInt(process.env.SIMPLEPAY_TIMEOUT || '600'),
        methods: process.env.SIMPLEPAY_METHODS || 'CARD',
    }

    if (!config.merchantId || !config.secretKey) {
        throw new Error('SimplePay configuration missing! Check your .env.local file.')
    }

    return new SimplePay(config)
}
