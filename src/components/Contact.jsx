export default function Contact({ onOpenContact }) {
  return (
<section className="contact reveal-section" id="contato" aria-labelledby="contact-title">
<div className="contact-content reveal-content"><p className="eyebrow">Fale com o escritório</p><h2 id="contact-title">Vamos conversar<br /><em>sobre o seu caso.</em></h2><p className="contact-lead">O primeiro passo é uma conversa. Conte com uma orientação jurídica clara e uma escuta atenta à sua realidade.</p><address><div><span className="detail-label">Criminal · Marlon Henrique</span><a href="tel:+5531975844780">(31) 97584-4780</a></div><div><span className="detail-label">Cível · Marlon Cruz</span><a href="tel:+5531982151333">(31) 98215-1333</a></div><div><span className="detail-label">Nosso escritório</span><a href="https://waze.com/ul?a=share_drive&amp;locale=pt-BR&amp;sd=0FCBq3zfK1JisnrkNg-sd&amp;env=row&amp;utm_source=waze_app&amp;utm_campaign=share_drive" target="_blank" rel="noopener noreferrer">Veja como chegar <span aria-hidden="true">↗</span></a></div><div><span className="detail-label">Acompanhe</span><a href="https://www.instagram.com/cruzerodrigues/" target="_blank" rel="noopener noreferrer">@cruzerodrigues <span aria-hidden="true">↗</span></a></div></address><button className="button" type="button" onClick={onOpenContact}>Agendar uma conversa <span aria-hidden="true">↗</span></button></div>
</section>
  );
}
