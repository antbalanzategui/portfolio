import { SimPage } from '@/components/sim-page';

export default function Lightning() {
  return (
    <SimPage
      slug="lightning"
      title="Lightning"
      tagline="Takahashi non-inductive electrification coupled to a gauge-invariant Dielectric Breakdown Model."
      image="/evolutionsim/lightning.jpg"
      imageAlt="Lightning simulation still"
      video="/evolutionsim/lightning.mp4"
      tags={['DBM', 'Takahashi', 'Heidler', 'Navier–Stokes', 'WGSL']}
      description={[
        'Writeup in progress. Image slot above is wired to /public/evolutionsim/lightning.jpg — drop the still in and it renders here.',
      ]}
      prev={{ slug: 'neutron-star-merger', title: '← Neutron Star Merger' }}
      next={{ slug: 'snowflake', title: 'Snowflake →' }}
    />
  );
}
