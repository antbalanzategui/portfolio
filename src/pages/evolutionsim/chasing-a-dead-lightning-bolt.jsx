import { SimPage } from '@/components/sim-page';
import { getStormPostHtml } from '@/lib/sim-post';

export async function getStaticProps() {
  return { props: { bodyHtml: getStormPostHtml('chasing-a-dead-lightning-bolt') || '' } };
}

export default function ChasingADeadLightningBolt({ bodyHtml }) {
  return (
    <SimPage
      slug="chasing-a-dead-lightning-bolt"
      title="Chasing a dead lightning bolt"
      tagline="A fast GPU thunderstorm hybrid stopped producing cloud-to-ground lightning. Ruling out the physics first is what found the real bug — a one-line multigrid alias — and then the fix that actually generalized turned out to be the domain geometry, not the pointer."
      image="/figs/hybrid_cg/fig1_headline_iccg.png"
      imageAlt="IC:CG ratio across the debugging journey, from infinity to a physical range."
      imageFit="contain"
      tags={['GPU', 'Debugging', 'Multigrid', 'Profiling', 'Optimization']}
      bodyHtml={bodyHtml}
      prev={{ slug: 'dodge-city', title: '← Dodge City' }}
    />
  );
}
