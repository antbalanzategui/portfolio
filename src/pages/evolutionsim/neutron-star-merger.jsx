import { SimPage } from '@/components/sim-page';
import { getSimWriteupHtml } from '@/lib/sim-writeup';

export async function getStaticProps() {
  return { props: { bodyHtml: getSimWriteupHtml('neutron-star-merger') || '' } };
}

export default function NeutronStarMerger({ bodyHtml }) {
  return (
    <SimPage
      slug="neutron-star-merger"
      title="Neutron Star Merger"
      tagline="A cinematic of GW170817 — inspiral, merger, hypermassive remnant, and two-component kilonova — pinned to the LIGO/Virgo measured parameters."
      image="/neutron_star_merger_thumbnail.png"
      imageAlt="Neutron star merger simulation still — kilonova ejecta shell pierced by twin relativistic jets."
      video="/evolutionsim/neutron-star-merger.mp4"
      tags={['GPU compute', 'GW170817', 'Numerical relativity', 'WGSL', 'Python']}
      bodyHtml={bodyHtml}
      prev={{ slug: 'blackhole', title: '← Black Hole' }}
      next={{ slug: 'lightning', title: 'Lightning →' }}
    />
  );
}
