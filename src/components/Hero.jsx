import { useRef } from 'react';
import Brand from './Brand';
import useCursorReveal from '../hooks/useCursorReveal';

export default function Hero({ smoothScrollRef }) {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const scrollTitleRef = useRef(null);
  useCursorReveal(heroRef, titleRef, scrollTitleRef, smoothScrollRef);

  return (
<section ref={heroRef} className="hero" tabIndex="0" aria-labelledby="hero-title">
<img className="hero-portrait" src="/assets/hero-cutout.png" alt="Retrato dos dois advogados do escritório Cruz e Rodrigues, sentados em poltronas de couro" fetchPriority="high" />
<div className="hero-background" aria-hidden="true" />
<div className="hero-shade" aria-hidden="true" />
<div className="signature" aria-hidden="true">Cruz e<br />Rodrigues</div>
<Brand className="hero-brand" />
<p className="hero-eyebrow">Advocacia com estratégia e compromisso</p>
<h1 ref={titleRef} className="hero-title" id="hero-title">Seu direito merece<br /><span>uma defesa à altura.</span></h1>
<div ref={scrollTitleRef} className="hero-title hero-title-scroll" aria-hidden="true">Seu direito merece<br /><span>uma defesa à altura.</span></div>
<div className="hero-bottom"><p>Cruz e Rodrigues <b>•</b> Advocacia Especializada</p></div>

</section>
  );
}
