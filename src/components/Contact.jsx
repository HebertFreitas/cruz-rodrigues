import { useState } from 'react';
import OfficeMap from './OfficeMap';
import { practiceAreas } from '../practiceAreas';

const officeAddress = 'Av. Barão Homem de Melo, 4494 - Nova Granada, Belo Horizonte - MG';
const locationQuery = encodeURIComponent(officeAddress);
const mapUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;
const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${locationQuery}&travelmode=driving`;

export default function Contact({ onOpenContact }) {
  const [formError, setFormError] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const area = practiceAreas.find(area => area.id === form.get('area'));
    const name = String(form.get('name') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const message = String(form.get('message') || '').trim();
    if (!area || !name || phone.replace(/\D/g, '').length < 10 || !message) {
      setFormError('Preencha seu nome, um telefone com DDD, a área e sua mensagem.');
      return;
    }
    setFormError('');
    const text = `Olá! Meu nome é ${name}.\nTelefone: ${phone}\nÁrea: ${area.title}\n\n${message}`;
    window.location.assign(`${area.contactUrl}?text=${encodeURIComponent(text)}`);
  };

  return (
    <section className="contact contact--expanded reveal-section" id="contato" aria-labelledby="contact-title">
      <div className="contact-backdrop" aria-hidden="true"><img src="/assets/escritorio.jpg" alt="" loading="lazy" decoding="async" /></div>
      <div className="contact-layout">
        <div className="contact-content">
          <p className="eyebrow">Fale com o escritório</p>
          <h2 id="contact-title">Ao seu lado.<br /><em>A qualquer hora.</em></h2>
          <p className="contact-lead">Conte com uma orientação jurídica clara e uma escuta atenta à sua realidade. Entre em contato ou venha conhecer o escritório.</p>
          <div className="availability"><span className="availability-dot" aria-hidden="true" /><div><strong>Atendimento 24 horas</strong><p>Todos os dias, inclusive fins de semana e feriados.</p></div></div>
          <address>
            <div><span className="detail-label">Criminal · Marlon Henrique</span><a href="tel:+5531975844780">(31) 97584-4780</a></div>
            <div><span className="detail-label">Cível · Marlon Cruz</span><a href="tel:+5531982151333">(31) 98215-1333</a></div>
            <div><span className="detail-label instagram-label"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>Acompanhe</span><a href="https://www.instagram.com/cruzerodrigues/" target="_blank" rel="noopener noreferrer">@cruzerodrigues <span aria-hidden="true">↗</span></a></div>
          </address>
          <button className="button" type="button" onClick={onOpenContact}>Falar com um advogado <span aria-hidden="true">↗</span></button>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} aria-labelledby="contact-form-title">
          <p className="eyebrow">Vamos conversar</p>
          <h3 id="contact-form-title">Como podemos ajudar?</h3>
          <p>Preencha os dados para iniciar seu atendimento.</p>
          <div className="contact-form-fields">
            <label htmlFor="contact-name">Seu nome<input id="contact-name" name="name" autoComplete="name" placeholder="Como podemos chamar você?" required maxLength={120} /></label>
            <label htmlFor="contact-phone">WhatsApp com DDD<input id="contact-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(31) 99999-9999" required minLength={10} maxLength={25} /></label>
            <label htmlFor="contact-area">Área de interesse<select id="contact-area" name="area" required defaultValue=""><option value="" disabled>Selecione uma área</option>{practiceAreas.map(area => <option key={area.id} value={area.id}>{area.title}</option>)}</select></label>
            <label htmlFor="contact-message">Sua mensagem<textarea id="contact-message" name="message" rows={4} placeholder="Conte brevemente como podemos ajudar." required maxLength={2000} /></label>
          </div>
          {formError && <p className="form-error" role="alert">{formError}</p>}
          <button className="button contact-form-submit" type="submit">Continuar no WhatsApp <span aria-hidden="true">↗</span></button>
          <p className="form-note">Você será direcionado ao WhatsApp do advogado da área escolhida para revisar e enviar sua mensagem.</p>
        </form>
        <div className="office-location" aria-labelledby="office-location-title">
          <div className="office-location-heading"><div><p className="eyebrow">Encontre o escritório</p><h3 id="office-location-title">Esperamos por <em>você.</em></h3></div><div className="map-actions"><a className="button" href={mapUrl} target="_blank" rel="noopener noreferrer">Ver no mapa <span aria-hidden="true">↗</span></a><a className="button map-route" href={routeUrl} target="_blank" rel="noopener noreferrer">Iniciar rota <span aria-hidden="true">↗</span></a></div></div>
          <div className="office-map" data-lenis-prevent>
            <OfficeMap address={officeAddress} />
          </div>
          <p className="map-caption"><span aria-hidden="true">⌖</span> Av. Barão Homem de Melo, 4494 · Nova Granada · Belo Horizonte — MG</p>
        </div>
      </div>
    </section>
  );
}
