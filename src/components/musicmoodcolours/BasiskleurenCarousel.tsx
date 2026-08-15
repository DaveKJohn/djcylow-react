'use client';

import React, { useMemo, useState } from 'react';
import AudioPlayer from '@/components/ui/AudioPlayer';
import Carousel from '@/components/ui/Carousel';

// De acht `light-*`-bestanden stonden hier tot 2026-08-15 los geïmporteerd en samengevoegd, net als
// in twee andere carousels op deze pagina. `featuredMixByColor` doet nu hetzelfde -- inclusief het
// `power === 'Light'`-filter dat hier voorheen impliciet in de import zat.
import { featuredMixByColor } from '@/data/mixes/all';

import '@/styles/components/musicmoodcolours/basiskleurenCarousel.scss';

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
		return COLORS_CONFIG.map(config => ({ ...config, mix: featuredMixByColor(config.name) }));
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
						<p className="size-sm">&quot;{c.description}&quot;</p>
					</div>
				))}
			</div>
		</Carousel>
	);
}