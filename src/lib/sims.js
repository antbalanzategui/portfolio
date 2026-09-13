// Canonical list of EvolutionSim entries, in display order.
//
// This is the single source of truth for which sim pages exist: the
// /evolutionsim index renders cards from it and sitemap.xml derives its
// /evolutionsim/* routes from it. Adding a sim here is enough for both.
//
// Not listed: /evolutionsim/lightning, which is a noindex client-side
// redirect to storm-engine, not a page in its own right.
export const sims = [
  {
    slug: 'storm-engine',
    title: 'The Storm Engine',
    tagline: 'The storm is not drawn — it is solved. Five-stage moist-convection pipeline, CPU/GPU hybrid, checked against a double-precision oracle.',
    image: '/figs/engine/fig_schematic_v2.png',
    fit: 'contain',
  },
  {
    slug: 'cumulus-congestus',
    title: 'Cumulus Congestus',
    tagline: 'Towering cumulus grown from one sounding — the tower, the cap, and the flip to taller-than-wide all emerge.',
    image: '/figs/congestus/01_congestus_regime.png',
    video: '/evolutionsim/congestus_showcase.mp4',
  },
  {
    slug: 'dodge-city',
    title: 'Dodge City',
    tagline: 'A 26 May 2024 weather-balloon sounding in, a giant-hail supercell out — depth, intensity and lightning, none of it dialled in.',
    image: '/figs/kddc/03_flash_constellation.png',
  },
  {
    slug: 'chasing-a-dead-lightning-bolt',
    title: 'Chasing a Dead Lightning Bolt',
    tagline: 'A storm stopped throwing cloud-to-ground lightning. The bug was a one-line multigrid alias; the real fix was the domain geometry.',
    image: '/figs/hybrid_cg/fig1_headline_iccg.png',
    fit: 'contain',
  },
  {
    slug: 'blackhole',
    title: 'Black Hole',
    tagline: 'GPU-ray-traced M87*, with MAD eruptions and a live tidal-disruption event.',
    image: '/black_hole_thumbnail.png',
    video: '/evolutionsim/blackhole.mp4',
  },
  {
    slug: 'neutron-star-merger',
    title: 'Neutron Star Merger',
    tagline: 'GW170817 from inspiral through two-component kilonova.',
    image: '/neutron_star_merger_thumbnail.png',
    video: '/evolutionsim/neutron-star-merger.mp4',
  },
  {
    slug: 'snowflake',
    title: 'Snowflake',
    tagline: 'Stellar dendrite from a single seed under Mullins-Sekerka instability.',
    image: '/snowflake_thumbnail.png',
    video: '/evolutionsim/snowflake.mp4',
  },
];
