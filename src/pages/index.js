import { SeoMeta } from '@/components/seo-meta';
import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Work } from '@/components/work';
import { Skills } from '@/components/skills';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <>
      <SeoMeta
        title="Antonio Balanzategui — Software Engineer"
        description="Software engineer working at the intersection of applied statistics, GPU physics simulation, and building-systems control."
        path="/"
      />
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Work />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
