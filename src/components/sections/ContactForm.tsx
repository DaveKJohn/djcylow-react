"use client";

import { useState } from "react";

export default function ContactForm() {
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData as any).toString(),
            });

            if (response.ok) {
                setStatus("success");
            } else {
                throw new Error("Er ging iets mis bij het verzenden.");
            }
        } catch (error) {
            setStatus("error");
            setErrorMessage("Oeps! Er is een fout opgetreden. Probeer het later opnieuw.");
        }
    };

    return (
        <div className="constrainer column spacing-xs">
            {/* Header */}
            <div className="column wrapper spacing-m show_border_bottom">
                <div className="column text-wrapper spacing-m center">
                    <h2>Contact</h2>
                    <p className="size-m balanced">
                        Stuur een e-mail naar{" "}
                        <span className="highlight">info@djcylow.com</span>, of vul
                        hieronder je gegevens in en laat een bericht achter.
                    </p>
                </div>
            </div>

            <div className="column wrapper spacing-m h-push-m">
                {status !== "success" ? (
                    <form
                        className="column wrapper spacing-s form-wrapper show_border_bottom"
                        id="contactForm"
                        name="contact"
                        method="POST"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                        onSubmit={handleSubmit}
                    >
                        {/* Honeypot & Netlify hidden fields */}
                        <input type="hidden" name="form-name" value="contact" />
                        <p className="hidden" style={{ display: "none" }}>
                            <label>
                                Don’t fill this out if you’re human: <input name="bot-field" />
                            </label>
                        </p>

                        <div className="row wrapper spacing-s flex" id="naam">
                            <input
                                className="input-field"
                                type="text"
                                name="firstName"
                                required
                                aria-label="Voornaam"
                                placeholder="Voornaam"
                            />
                            <input
                                className="input-field"
                                type="text"
                                name="lastName"
                                required
                                aria-label="Achternaam"
                                placeholder="Achternaam"
                            />
                        </div>

                        <div className="column wrapper spacing-s" id="email">
                            <input
                                className="input-field"
                                type="email"
                                name="email"
                                required
                                aria-label="E-mailadres"
                                placeholder="E-mailadres"
                            />
                        </div>

                        <div className="column wrapper spacing-s" id="message">
                            <textarea
                                className="input-field textarea-field"
                                name="message"
                                rows={4}
                                required
                                aria-label="Jouw bericht"
                                placeholder="Vraag / opmerking"
                            ></textarea>
                        </div>

                        {/* Recaptcha Placeholder - Let op: vereist externe script in layout.tsx indien gebruikt */}
                        <div className="column wrapper spacing-xs start" id="recaptcha">
                            <div
                                className="g-recaptcha"
                                data-sitekey="6Ldk2uErAAAAANzM5R9ViVRwPNjDD-a44pUf5yd3"
                                data-action="LOGIN"
                            ></div>
                        </div>

                        {status === "error" && (
                            <div className="column wrapper spacing-xs" id="errorMessage">
                                <p className="size-m error text">{errorMessage}</p>
                                <div className="body error icon">❌</div>
                            </div>
                        )}

                        <div className="column wrapper spacing-xs" id="sendfilters">
                            <div className="column wrapper center">
                                <button
                                    className="btn cta size-m verzend-form-btn"
                                    type="submit"
                                >
                                    <span>Verzenden</span>
                                </button>
                            </div>
                            <div className="column text-wrapper text center">
                                <p className="size-xs">
                                    Na het versturen van dit contactformulier neem ik z.s.m.
                                    contact op.
                                </p>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* Succes Message */
                    <div className="column wrapper spacing-xs" id="succesMessage">
                        <p className="succes text">Bedankt! Je bericht is verzonden.</p>
                        <div className="succes icon">✅</div>
                    </div>
                )}

                {/* WhatsApp Sectie */}
                <div className="column wrapper spacing-xs">
                    <div className="column text-wrapper text center">
                        <p className="size-s balanced bold">
                            Heb je liever direct contact? WhatsApp mag ook!
                        </p>
                    </div>
                    <div className="column wrapper spacing-xs center">
                        <a
                            className="btn"
                            href="https://wa.me/31611531263"
                            id="whatsapp-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="WhatsApp ons nu"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 256 256"
                                width="40"
                                height="40"
                            >
                                {/* De transform zorgt ervoor dat het icoon het hele vlak vult */}
                                <g transform="translate(4, 4) scale(2.7)">
                                    <path
                                        d="M 76.735 13.079 C 68.315 4.649 57.117 0.005 45.187 0 C 20.605 0 0.599 20.005 0.589 44.594 c -0.003 7.86 2.05 15.532 5.953 22.296 L 0.215 90 l 23.642 -6.202 c 6.514 3.553 13.848 5.426 21.312 5.428 h 0.018 c 0.001 0 -0.001 0 0 0 c 24.579 0 44.587 -20.007 44.597 -44.597 C 89.789 32.713 85.155 21.509 76.735 13.079 z M 27.076 46.217 c -0.557 -0.744 -4.55 -6.042 -4.55 -11.527 c 0 -5.485 2.879 -8.181 3.9 -9.296 c 1.021 -1.115 2.229 -1.394 2.972 -1.394 s 1.487 0.007 2.136 0.039 c 0.684 0.035 1.603 -0.26 2.507 1.913 c 0.929 2.231 3.157 7.717 3.436 8.274 c 0.279 0.558 0.464 1.208 0.093 1.952 c -0.371 0.743 -0.557 1.208 -1.114 1.859 c -0.557 0.651 -1.17 1.453 -1.672 1.952 c -0.558 0.556 -1.139 1.159 -0.489 2.274 c 0.65 1.116 2.886 4.765 6.199 7.72 c 4.256 3.797 7.847 4.973 8.961 5.531 c 1.114 0.558 1.764 0.465 2.414 -0.279 c 0.65 -0.744 2.786 -3.254 3.529 -4.369 c 0.743 -1.115 1.486 -0.929 2.507 -0.558 c 1.022 0.372 6.5 3.068 7.614 3.625 c 1.114 0.558 1.857 0.837 2.136 1.302 c 0.279 0.465 0.279 2.696 -0.65 5.299 c -0.929 2.603 -5.381 4.979 -7.522 5.298 c -1.92 0.287 -4.349 0.407 -7.019 -0.442 c -1.618 -0.513 -3.694 -1.199 -6.353 -2.347 C 34.934 58.216 27.634 46.961 27.076 46.217 z"
                                        fill="currentColor"
                                    />
                                </g>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}