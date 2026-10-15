export default function Hero() {
  return (
<section className="hero" tabIndex="0" aria-labelledby="hero-title">
<img className="hero-photo" src="/assets/hero.png" alt="Retrato dos dois advogados do escritório Cruz e Rodrigues, sentados em poltronas de couro" fetchPriority="high" />
<div className="hero-shade"></div>
<div className="signature" aria-hidden="true">Cruz e<br />Rodrigues</div>
<p className="hero-eyebrow">Advocacia com estratégia e compromisso</p>
<h1 id="hero-title">Seu direito merece<br /><span>uma defesa à altura.</span></h1>
<div className="hero-bottom"><p>Cruz e Rodrigues <b>•</b> Advocacia Especializada</p><a className="scroll-link" href="#areas-de-atuacao" aria-label="Conheça nossas áreas de atuação"><span>Conheça nossa atuação</span><span className="scroll-line" aria-hidden="true">↓</span></a></div>
<span className="hero-side" aria-hidden="true">Estratégia. Presença. Compromisso.</span>
</section>
  );
}
