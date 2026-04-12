"use client";
import React from 'react';
import Carousel from '@/components/ui/Carousel';
import { homeContent } from "@/content/home";
import { referentiesData, Referentie } from '@/content/referenties';

// @ts-ignore
import '@/styles/components/home/referenties.scss';

const Referenties = () => {
    return (
        <div className="column center v-push-8xl WoB" id="referenties">

            <div className="column text-wrapper spacing-4xl center">
                <h2 dangerouslySetInnerHTML={{ __html: homeContent.klantervaringen_h3 || "" }} />

            </div>
            <Carousel>
                <div className="row spacing-5xl referenties-container">
                    {referentiesData.map((item: Referentie) => (
                        <div key={item.id} className="column referentie-item">
                            <p className="text">{item.text}</p>
                            <div className="client-info">
                                <h3 className="client">{item.client}</h3>
                                <div className="tags">
                                    {item.tags.map((tag, index) => (
                                        <span key={index}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </Carousel>
        </div>
    );
};

export default Referenties;