import React from 'react';
import Image from 'next/image'; // Gaat uit van Next.js gezien de Image component
import ReadMore from "@/components/ui/ReadMore";
import { homeContent } from "@/content/home";

const MeetTheDJ = () => {
  return (
    <div className="column wrapper WoB" id="hero">
      <div className="column stack constrainer hero-section">
        
        <div className="column overlay wrapper hero-image-wrapper">
          <Image
            src="/images/face.webp"
            width={500}
            height={500}
            alt="Dave Kok"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
            style={{ height: 'auto', width: 'auto' }}
          />
        </div>

        <div className="column overlay text-wrapper spacing-4xl hero-text-container anchor">
          <div className="column text-wrapper header">
            <h2 dangerouslySetInnerHTML={{ __html: homeContent.intro_h3 || "" }} />
          </div>

          <ReadMore
            teaser={
              <p>{homeContent.intro_story_p_one}</p>
            }
            hiddenContent={
              <>
                <p>{homeContent.intro_story_p_two}</p>
                <p className="size-base" dangerouslySetInnerHTML={{ __html: homeContent.intro_story_p_three || "" }} />
                <p>{homeContent.intro_story_p_four}</p>
              </>
            }
          />
        </div>

      </div>
    </div>
  );
};

export default MeetTheDJ;