"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
    ssr: false,
    loading: () => <div className="captcha-loader">Loading captcha...</div>,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export default function ContactForm() {
    const t = useTranslations('contact');

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [shouldLoadCaptcha, setShouldLoadCaptcha] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setShouldLoadCaptcha(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );

        if (formRef.current) {
            observer.observe(formRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (status === "success") {
            const element = document.getElementById("succesMessage");
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [status]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!captchaToken) {
            setStatus("error");
            setErrorMessage(t('captchaRequired'));
            return;
        }

        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        data['g-recaptcha-response'] = captchaToken;

        try {
            const response = await fetch("/.netlify/functions/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setStatus("success");
                setCaptchaToken(null);
            } else {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || t('serverError'));
            }
        } catch (error: unknown) {
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : t('unknownError'));
        }
    };

    return (
        <div className="BoW column w-fill AMC P15 v-push-7xl spacing-2xl fill-90" id="contact-formulier">

            <div className="column w-fill AMC P20 spacing-3xl">
                <div className="column w-fix AMC constrainer">
                    <div className="column w-fill AMC P30">
                        <div className="column w-fill AMC P35 spacing-2xl">
                            <h2>{t('title')}</h2>
                            <p className="size-base center balanced">
                                {t('subtitle')}
                            </p>
                        </div>
                    </div>
                </div>


                <div className="row-c break-m w-fix ATC constrainer spacing-2xl">

                    {status === "success" ? (
                        <div className="column spacing-3xl center" id="succesMessage">
                            <div className="column text-wrapper center spacing-3xl">
                                <div className="success-emoji">✅</div>
                                <h3 className="succes text">{t('successTitle')}</h3>
                                <p>{t('successMessage')}</p>
                            </div>
                            <button
                                className="btn size-base send-new-btn"
                                onClick={() => setStatus("idle")}
                            >
                                {t('sendNew')}
                            </button>
                        </div>
                    ) : (
                        <form
                            ref={formRef}
                            className="column w-fix AML P30 "
                            id="contact-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="column w-fill AML P35">

                                <div className="column w-fill AML P40-xl fill-80">
                                    <input className="column w-fill AML P45" type="hidden" name="form-name" value="contact" />

                                    <div id="honeypot">
                                        <label>Bot field: <input name="bot-field" /></label>
                                    </div>

                                    <div className="column w-fill AML P45 spacing-xl">
                                        <h3 className="bold">{t('formTitle')}</h3>
                                        <p className="size-base balanced">{t('formSubtitle')}</p>
                                    </div>

                                    <div className="column w-fill AML P45">
                                        <input className="input-field" type="text" name="name" required placeholder={t('namePlaceholder')} />
                                    </div>

                                    <div className="column w-fill AML P45">
                                        <input className="input-field" type="email" name="email" required placeholder={t('emailPlaceholder')} />
                                    </div>

                                    <div className="column w-fill AML P45">
                                        <textarea className="input-field textarea-field" name="message" rows={4} required placeholder={t('messagePlaceholder')}></textarea>
                                    </div>

                                    <div className="column w-fill AML P45">
                                        {shouldLoadCaptcha && (
                                            <ReCAPTCHA
                                                sitekey="6LfMHYMsAAAAAA1-Kx9-XqhhM_hlaar5iXUY8nd5"
                                                onChange={(value: string | null) => setCaptchaToken(value)}
                                                theme="light"
                                            />
                                        )}
                                    </div>

                                    {status === "error" && (
                                        <div className="column spacing-3xl">
                                            <p className="size-base error-message">{errorMessage}</p>
                                        </div>
                                    )}

                                    <div className="column w-fill AML P45 ">
                                        <div className="column w-fill AMC">
                                            <button
                                                className="btn cta verzend-form-btn"
                                                type="submit"
                                                disabled={!captchaToken || status === "loading"}
                                            >
                                                {status === "loading" ? (
                                                    <span className="loading-text">
                                                        {t('sending')}<span className="dots">...</span>
                                                    </span>
                                                ) : (
                                                    <span>{t('send')}</span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </form>
                    )}

                    {/* WhatsApp */}
                    <div className="column w-fill AMC P30" id="whatsapp">

                        <div className="column w-fill AMC P35">

                            <div className="column w-fill AMC P40-xl fill-80">

                                <div className="column w-fill AMC P45 spacing-2xl">

                                    <h3 className="bold">{t('directTitle')}</h3>
                                    <p className="size-base center balanced">{t('directSubtitle')}</p>

                                    <a className="btn" href="https://wa.me/31611531263" target="_blank" rel="noopener noreferrer">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="40" height="40">
                                            <g transform="translate(4, 4) scale(2.7)">
                                                <path d="M 76.735 13.079 C 68.315 4.649 57.117 0.005 45.187 0 C 20.605 0 0.599 20.005 0.589 44.594 c -0.003 7.86 2.05 15.532 5.953 22.296 L 0.215 90 l 23.642 -6.202 c 6.514 3.553 13.848 5.426 21.312 5.428 h 0.018 c 24.579 0 44.587 -20.007 44.597 -44.597 C 89.789 32.713 85.155 21.509 76.735 13.079 z M 27.076 46.217 c -0.557 -0.744 -4.55 -6.042 -4.55 -11.527 c 0 -5.485 2.879 -8.181 3.9 -9.296 c 1.021 -1.115 2.229 -1.394 2.972 -1.394 s 1.487 0.007 2.136 0.039 c 0.684 0.035 1.603 -0.26 2.507 1.913 c 0.929 2.231 3.157 7.717 3.436 8.274 c 0.279 0.558 0.464 1.208 0.093 1.952 c -0.371 0.743 -0.557 1.208 -1.114 1.859 c -0.557 0.651 -1.17 1.453 -1.672 1.952 c -0.558 0.556 -1.139 1.159 -0.489 2.274 c 0.65 1.116 2.886 4.765 6.199 7.72 c 4.256 3.797 7.847 4.973 8.961 5.531 c 1.114 0.558 1.764 0.465 2.414 -0.279 c 0.65 -0.744 2.786 -3.254 3.529 -4.369 c 0.743 -1.115 1.486 -0.929 2.507 -0.558 c 1.022 0.372 6.5 3.068 7.614 3.625 c 1.114 0.558 1.857 0.837 2.136 1.302 c 0.279 0.465 0.279 2.696 -0.65 5.299 c -0.929 2.603 -5.381 4.979 -7.522 5.298 c -1.92 0.287 -4.349 0.407 -7.019 -0.442 c -1.618 -0.513 -3.694 -1.199 -6.353 -2.347 C 34.934 58.216 27.634 46.961 27.076 46.217 z" fill="currentColor" />
                                            </g>
                                        </svg>
                                    </a>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div >
    );
}
