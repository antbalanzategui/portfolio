import { SimPage } from '@/components/sim-page';
import { getSimWriteupHtml } from '@/lib/sim-writeup';

export async function getStaticProps() {
  return { props: { bodyHtml: getSimWriteupHtml('snowflake') || '' } };
}

export default function Snowflake({ bodyHtml }) {
  return (
    <SimPage
      slug="snowflake"
      title="Snowflake"
      tagline="An ice Ih stellar dendrite grown from a single seed at T = −15 °C and σ = 2.5% — every arm and side-branch emerges from diffusion + attachment physics, not procedural fractals."
      image="/snowflake_thumbnail.png"
      imageAlt="Snowflake simulation still — mid-growth six-fold dendrite with secondary side-branches from Mullins-Sekerka instability."
      video="/evolutionsim/snowflake.mp4"
      tags={['Diffusion-limited growth', 'Mullins-Sekerka', 'Hertz-Knudsen', 'Numba', 'Python']}
      bodyHtml={bodyHtml}
      prev={{ slug: 'lightning', title: '← Lightning' }}
    />
  );
}
