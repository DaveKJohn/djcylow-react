'use client';

import React, { useMemo, useState } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Carousel from '@/components/ui/Carousel';

// 1. Importeer ALLE bestanden
import lightBlue from '@/data/mixes/light-blue.json';
import lightCyan from '@/data/mixes/light-cyan.json';
import lightGreen from '@/data/mixes/light-green.json';
import lightYellow from '@/data/mixes/light-yellow.json';
import lightOrange from '@/data/mixes/light-orange.json';
import lightPurple from '@/data/mixes/light-purple.json';
import lightRed from '@/data/mixes/light-red.json';
import lightMagenta from '@/data/mixes/light-magenta.json';

// @ts-ignore
import '@/styles/components/musicmoodcolours/basiskleurenCarousel.scss';

const allMixesData = [
	...lightBlue, ...lightCyan, ...lightGreen, ...lightYellow, ...lightOrange, ...lightPurple, ...lightRed, ...lightMagenta
];

const COLORS_CONFIG = [
	{ id: 1, name: 'cyan', description: 'Vermaakt' },
	{ id: 2, name: 'green', description: 'Dankbaar' },
	{ id: 3, name: 'yellow', description: 'Ambitieus' },
	{ id: 4, name: 'orange', description: 'Hoopvol' },
	{ id: 5, name: 'red', description: 'Bang' },
	{ id: 6, name: 'magenta', description: 'Geïrriteerd' },
	{ id: 7, name: 'purple', description: 'Verdrietig' },
	{ id: 8, name: 'blue', description: 'Onverschillig' },
];

export default function BasiskleurenCarousel() {
	const [activeMixId, setActiveMixId] = useState<string | null>(null);

	const featuredMixes = useMemo(() => {
		return COLORS_CONFIG.map(config => {
			const mix = allMixesData.find(m =>
				m.color.toLowerCase() === config.name.toLowerCase() &&
				m.featured === true
			);
			return { ...config, mix };
		});
	}, []);

	return (
		<Carousel id="basiskleuren">

			<div className="row extra spacing-3xl gradient"></div>

			{/* 1. Nummers rij */}
			<div className="row spacing-2xl numbers">
				{COLORS_CONFIG.map(c => (
					<div key={c.id} className={`column stack number ${c.name}`}>
						<div className="column overlay back"></div>
						<div className="column overlay center front">
							<p className="size-sm">{c.id}</p>
						</div>
					</div>
				))}
			</div>

			{/* 2. Labels rij */}
			<div className="row extra spacing-2xl labels">
				{COLORS_CONFIG.map(c => (
					<div key={c.name} className="column center label">
						<div className={`colour ${c.name}`}>
							<p>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</p>
						</div>
					</div>
				))}
			</div>

			{/* 3. Audio Players rij */}
			<div className="row extra spacing-2xl colours">
				{featuredMixes.map(({ name, mix }) => (
					<div key={name} className={`stack colour ${name}`}>
						{mix && mix.audioSrc ? (
							<AudioPlayer
								id={String(mix.id)}
								src={mix.audioSrc}
								image={mix.image_square || ""}
								showVolumeSlider={false}
								activeId={activeMixId}
								onPlay={(id) => setActiveMixId(id)}
								className={name}
							/>
						) : (
							<div className="column center" style={{ height: '100%', minHeight: '150px' }}>
								<p className="error center size-sm">Geen mix.</p>
							</div>
						)}
					</div>
				))}
			</div>

			{/* 4. Decoratieve cirkels */}
			<div className="row extra spacing-2xl circles">
				{COLORS_CONFIG.map(c => <div key={c.name} className={`column circle ${c.name}`}></div>)}
			</div>

			{/* 5. Beschrijvingen */}
			<div className="row spacing-2xl descriptions">
				{COLORS_CONFIG.map(c => (
					<div key={c.name} className={`column text description ${c.name}`}>
						<p className="size-sm">"{c.description}"</p>
					</div>
				))}
			</div>
		</Carousel>
	);
}