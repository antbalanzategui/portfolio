import { SimPage } from '@/components/sim-page';
import { getStormPostHtml } from '@/lib/sim-post';

export async function getStaticProps() {
  return { props: { bodyHtml: getStormPostHtml('dodge-city') || '' } };
}

export default function DodgeCity({ bodyHtml }) {
  return (
    <SimPage
      slug="dodge-city"
      title="Dodge City"
      tagline="A weather balloon went up on 26 May 2024. That sounding — and nothing else — went into the engine, and a giant-hail supercell came back out: right depth, right intensity, prolific and correctly-structured lightning. None of it was dialled in."
      image="/figs/kddc/01_hero_kddc.png"
      imageAlt="Modeled Dodge City supercell — reflectivity, charge structure and lightning."
      tags={['Supercell', 'Lightning', 'Real sounding', 'GPU compute', 'WGSL']}
      bodyHtml={bodyHtml}
      prev={{ slug: 'cumulus-congestus', title: '← Cumulus Congestus' }}
      next={{ slug: 'chasing-a-dead-lightning-bolt', title: 'Chasing a Dead Lightning Bolt →' }}
    />
  );
}
