"use client";

import { ReactGoogleReviews } from "react-google-reviews";
// @ts-ignore
import "react-google-reviews/dist/index.css";

const GoogleReviews = () => {
    return (
        <section className="column spacing-4xl v-push-9xl">

            <h2 className="center">Wat klanten zeggen</h2>
            <ReactGoogleReviews
                layout="carousel"
                featurableId="73d49339-555d-4d39-b732-94312650ad5f"
            />

        </section>
    );
};

export default GoogleReviews;