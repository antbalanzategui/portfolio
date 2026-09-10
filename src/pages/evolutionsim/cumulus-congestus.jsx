import { SimPage } from '@/components/sim-page';
import { getStormPostHtml } from '@/lib/sim-post';

export async function getStaticProps() {
  return { props: { bodyHtml: getStormPostHtml('cumulus-congestus') || '' } };
}

export default function CumulusCongestus({ bodyHtml }) {
  return (
    <SimPage
      slug="cumulus-congestus"
      title="Cumulus Congestus"
      tagline="Towering cumulus grown from a single sounding — the tower, the cap that stops it, and the flip from wider-than-tall to taller-than-wide all emerge from moist convection. Nothing is sculpted."
      image="/figs/congestus/01_congestus_regime.png"
      imageAlt="Cumulus congestus tower — cloud tops rising past 6 km with an aspect ratio below one."
      video="/evolutionsim/congestus_showcase.mp4"
      tags={['Moist convection', 'LES', 'GPU compute', 'WGSL', 'Verification']}
      bodyHtml={bodyHtml}
      prev={{ slug: 'storm-engine', title: '← The Storm Engine' }}
      next={{ slug: 'dodge-city', title: 'Dodge City →' }}
    />
  );
}
