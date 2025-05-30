<?php
/**
 * Plugin Name: Roblox Social Icon
 * Description: Adds a first-class “Roblox” service to the Social Icons block.
 * Version:     1.0
 * Author:      John Shedletsky
 */

define( 'ROBLOX_SLUG',  'roblox' );
define( 'ROBLOX_COLOR', '#005FF9' );                 // brand blue

/* ------------------------------------------------------------------------- *
 * 1.  Shared CSS  (front-end + editor iframe)
 * ------------------------------------------------------------------------- */
add_action( 'wp_enqueue_scripts', 'roblox_enqueue_css' );
add_action( 'enqueue_block_editor_assets', 'roblox_enqueue_css' );

function roblox_enqueue_css() {
	$css = sprintf(
		'.wp-social-link-%1$s a{background:%2$s;color:#fff;border-radius:50%%}' .
		'.wp-social-link-%1$s a:hover,.wp-social-link-%1$s a:focus{background:#0047d5}',
		ROBLOX_SLUG,
		ROBLOX_COLOR
	);
	wp_add_inline_style( 'wp-block-library', $css );      // front-end
	wp_add_inline_style( 'wp-edit-blocks',   $css );      // editor
}

/* ------------------------------------------------------------------------- *
 * 2.  Editor JavaScript (variation + icon map entry)
 * ------------------------------------------------------------------------- */
add_action( 'enqueue_block_editor_assets', function () {
	wp_enqueue_script(
		'roblox-social-link',
		plugins_url( 'roblox-social-link.js', __FILE__ ),
		[ 'wp-element', 'wp-hooks' ],              // loads *before* wp-blocks
		filemtime( __DIR__ . '/roblox-social-link.js' ),
		true
	);
} );

/* ------------------------------------------------------------------------- *
 * 3.  Front-end SVG swap (keeps editor & front consistent)
 * ------------------------------------------------------------------------- */
add_filter( 'render_block_core/social-link', function ( $html, $block ) {
	if ( ( $block['attrs']['service'] ?? '' ) === ROBLOX_SLUG ) {
		$svg = '<svg viewBox="0 0 24 24" role="img" aria-hidden="true">'
		     . '<path d="M5.0752 0L0 18.8936l18.9248 5.1064 5.0752-18.8936-9.4655-2.5532L5.0752 0Z'
		     . 'M10.0633 8.6373l5.2807 1.451-1.4074 5.2745-5.2807-1.451 1.4074-5.2745Z" '
		     . 'fill="#fff"/></svg>';
		$html = preg_replace( '#<svg\b[^>]*>.*?</svg>#s', $svg, $html );
	}
	return $html;
}, 10, 2 );
