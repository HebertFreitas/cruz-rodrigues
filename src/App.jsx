import { useRef } from 'react';
import Hero from './components/Hero';
import PracticeAreas from './components/PracticeAreas';
import About from './components/About';
import Highlights from './components/Highlights';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ContactDialog from './components/ContactDialog';
import usePageMotion from './hooks/usePageMotion';
import useSiteReveal from './hooks/useSiteReveal';

export default function App() {
  const dialogRef = useRef(null);
  const smoothScrollRef = usePageMotion();
  useSiteReveal();

  return (
    <>
      <a className="skip-link" href="#areas-de-atuacao">Ir para o conteúdo</a>
      <main id="top">
        <Hero smoothScrollRef={smoothScrollRef} />
        <Highlights />
        <PracticeAreas />
        <About />
        <Contact onOpenContact={() => dialogRef.current?.showModal()} />
      </main>
      <Footer />
      <button className="mobile-cta" type="button" onClick={() => dialogRef.current?.showModal()}>
        Fale com um advogado <span aria-hidden="true">↗</span>
      </button>
      <ContactDialog dialogRef={dialogRef} />
    </>
  );
}
