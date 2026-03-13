'use client';

import React from 'react';

export default function KubusHoeken() {
    return (
        <div className="column wrapper spacing-h6 black-90-bg in-push-h3" id="canvas_3Dspace">
            <div className="container h3-constrainer-1 cube">
                <div className="container h3-container-2 canvas-level-1 cube" id="cube">

                    {/* De Vlakken */}
                    <div className="cube-1 container h3-container-3 canvas-level-2 cube" id="cube_plates">
                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_plates_front"></div>
                        <div className="cube-2 container h3-container-4 canvas-level-3 cube" id="cube_plates_back"></div>
                        <div className="cube-3 container h3-container-4 canvas-level-3 cube" id="cube_plates_right"></div>
                        <div className="cube-4 container h3-container-4 canvas-level-3 cube" id="cube_plates_left"></div>
                        <div className="cube-5 container h3-container-4 canvas-level-3 cube" id="cube_plates_top"></div>
                        <div className="cube-6 container h3-container-4 canvas-level-3 cube" id="cube_plates_bottom"></div>
                    </div>

                    {/* De Hoekpunten */}
                    <div className="cube-2 container h3-container-3 canvas-level-2 cube" id="cube_corners">

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_magenta">
                            <div className="colour colour-magenta">
                                <p>Magenta</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_yellow">
                            <div className="colour colour-yellow">
                                <p>Yellow</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_blue">
                            <div className="colour colour-blue">
                                <p>Blue</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_cyan">
                            <div className="colour colour-cyan">
                                <p>Cyan</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_red">
                            <div className="colour colour-red">
                                <p>Red</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_orange">
                            <div className="colour colour-orange">
                                <p>Orange</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_purple">
                            <div className="colour colour-purple">
                                <p>Purple</p>
                            </div>
                        </div>

                        <div className="cube-1 container h3-container-4 canvas-level-3 cube" id="cube_corners_green">
                            <div className="colour colour-green">
                                <p>Green</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}