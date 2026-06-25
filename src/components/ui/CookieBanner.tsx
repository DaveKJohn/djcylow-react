'use client'

import { useState, useEffect, startTransition } from 'react'

const GTM_ID = 'GTM-PK7VHJ46'

function loadGTM() {
    const w = window as Window & { dataLayer?: object[] }
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
    document.head.appendChild(script)
}

export default function CookieBanner() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('cookieConsent')
        if (stored === 'accepted') {
            loadGTM()
        } else if (!stored) {
            startTransition(() => setVisible(true))
        }
    }, [])

    function accept() {
        localStorage.setItem('cookieConsent', 'accepted')
        loadGTM()
        setVisible(false)
    }

    function decline() {
        localStorage.setItem('cookieConsent', 'declined')
        setVisible(false)
    }

    if (!visible) return null

    return (
        <div className="cookie-banner">
            <p className="cookie-banner__text">
                This site uses cookies for analytics to understand how visitors use the site.
            </p>
            <div className="cookie-banner__actions">
                <button className="btn passive" onClick={decline}>Decline</button>
                <button className="btn cta" onClick={accept}>
                    <span>Accept</span>
                </button>
            </div>
        </div>
    )
}
