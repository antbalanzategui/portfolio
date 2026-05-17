import { SimPage } from '@/components/sim-page';
import { getSimWriteupHtml } from '@/lib/sim-writeup';

export async function getStaticProps() {
  return { props: { bodyHtml: getSimWriteupHtml('blackhole') || '' } };
}

export default function Blackhole({ bodyHtml }) {
  return (
    <SimPage
      slug="blackhole"
      title="Black Hole"
      tagline="A real-time GPU ray-traced reconstruction of M87* — every visible feature emerges from first-principles general relativity, nothing is painted in."
      image="/black_hole_thumbnail.png"
      imageAlt="Black hole simulation still — Einstein ring, lensed accretion disk, and tidal-disruption debris stream."
      video="/evolutionsim/blackhole.mp4"
      tags={['GPU compute', 'Kerr metric', 'Ray marching', 'WGSL', 'Python']}
      bodyHtml={bodyHtml}
      next={{ slug: 'neutron-star-merger', title: 'Neutron Star Merger →' }}
    />
  );
}
