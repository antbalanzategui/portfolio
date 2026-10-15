import { SimPage } from '@/components/sim-page';
import { getStormPostHtml } from '@/lib/sim-post';

export async function getStaticProps() {
  return { props: { bodyHtml: getStormPostHtml('storm-engine') || '' } };
}

export default function StormEngine({ bodyHtml }) {
  return (
    <SimPage
      slug="storm-engine"
      title="The Storm Engine"
      tagline="A real-time GPU engine where the storm is not drawn — it is solved. Cloud shape, rain, charge structure and every lightning bolt are consequences of the equations, not assets."
      image="/figs/engine/fig_schematic_v2.png"
      imageAlt="The five-stage storm-engine physics pipeline with governing equations and feedback loops."
      imageFit="contain"
      tags={['Rust', 'wgpu', 'WGSL', 'Navier–Stokes', 'GPU compute', 'Multigrid']}
      bodyHtml={bodyHtml}
      next={{ slug: 'cumulus-congestus', title: 'Cumulus Congestus →' }}
    />
  );
}
