/* roblox-social-link.js — minimal but complete Roblox support
   -----------------------------------------------------------
   1. Adds the diamond glyph to Gutenberg’s icon map (priority 9999 so nobody clobbers it later)
   2. Registers a block-variation so “Roblox” shows up in the Social-Icons inserter
   3. ✨ LAST-RESORT PATCH ✨ waits a second and force-repairs any icon the
      mysterious “chain-reset” script overwrites.
      -------------------------------------------------------------------
      Dear future maintainer,
      I’m truly, deeply sorry for the brutish timer-based fix you’re about
      to read. Somewhere in the bowels of the block editor a late-running
      plugin replaces unknown service icons with a generic grey chain.
      Rather than spelunk through 30 kB of minified code every release,
      we reluctantly drop back in after the dust settles and put our blue,
      circular diamond right where it belongs. When the upstream culprit
      is finally tamed, please delete everything between  ‹SORRY HACK›  marks.
      Thanks, and forgive us this small aesthetic crime. 🙇‍♂️
   ----------------------------------------------------------- */

   ( () => {
	const { addFilter }          = wp.hooks;
	const { SVG, Path }          = wp.components;
	const { createElement: el }  = wp.element;

	const ROBLOX_BLUE = '#005FF9';
	const PATH_D      =
		'M5.0752 0L0 18.8936l18.9248 5.1064 5.0752-18.8936-9.4655-2.5532L5.0752 0Z' +
		'M10.0633 8.6373l5.2807 1.451-1.4074 5.2745-5.2807-1.451 1.4074-5.2745Z';

	/* ----- glyph once, reuse everywhere ---------------------------------- */
	const Glyph = el( Path, { d: PATH_D, fill: 'currentColor' } );

	/* ----- 1 · icon-map entry (early, last priority) ---------------------- */
	addFilter(
		'blocks.socialLinkIcons',
		'roblox/icon-map',
		icons => ( { ...icons, roblox: el( 'g', null, Glyph ) } ),
		9999
	);

	/* ----- 2 · block variation ------------------------------------------- */
	wp.domReady( () => {
		wp.blocks.registerBlockVariation( 'core/social-link', {
			name: 'roblox',
			title: 'Roblox',
			icon:  el( SVG, { viewBox: '0 0 24 24' }, Glyph ),
			attributes: {
				service: 'roblox',
				label:   'Roblox',
				style:   { color:{ background:ROBLOX_BLUE, text:'#FFFFFF' }, border:{ radius:'50%' } }
			},
			isActive: ({ service }) => service === 'roblox',
		} );

	/* ========== 3 · SORRY HACK START ==================================== */
		setTimeout( () => {
			document.querySelectorAll('li.wp-social-link-roblox').forEach( li => {
				const svg  = li.querySelector('svg');
				const path = svg?.querySelector('path');
				if ( path && !path.getAttribute('d')?.startsWith('M5.0752') ) {
					path.setAttribute('d', PATH_D);
					path.setAttribute('fill', 'currentColor');
				}
				(li.querySelector('a,button') || {}).style.cssText =
					`background:${ROBLOX_BLUE};color:#fff;border-radius:50%`;
			});
		}, 1000);   // give the phantom clobberer enough rope, then fix.
	/* ========== 3 · SORRY HACK END ====================================== */
	});
} )();
