import React from 'react';
import { getLocale } from 'next-intl/server';
import { getHomeContent } from "@/content/home";
import Image from 'next/image';
import ReadMore from "@/components/ui/ReadMore";

// @ts-ignore
import '@/styles/components/home/meetTheDJ.scss';


const MeetTheDJ = async () => {
  const locale = await getLocale();
  const content = getHomeContent(locale);

  return (
    <div className="column WoB" id="hero">
      <div className="column stack constrainer hero-section">

        <div className="column overlay hero-image-wrapper">
          <Image
            src="/images/face.webp"
            width={500}
            height={500}
            alt="Dave Kok"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        </div>

        <div className="column overlay text-wrapper spacing-4xl hero- anchor">
          <div className="column text-wrapper header">
            <h2 dangerouslySetInnerHTML={{ __html: content.intro_h3 || "" }} />
          </div>

          <ReadMore
            teaser={
              <p>{content.intro_story_p_one}</p>
            }
            hiddenContent={
              <>
                <p className="left">{content.intro_story_p_two}</p>
                <p className="size-base" dangerouslySetInnerHTML={{ __html: content.intro_story_p_three || "" }} />
                <p className="left">{content.intro_story_p_four}</p>
              </>
            }
          />
        </div>

      </div>
    </div>
  );
};

export default MeetTheDJ;
