import { useId } from 'react';

export default function Brand({ className = '' }) {
  const filterId = `brand-alpha-${useId().replace(/:/g, '')}`;
  return (
    <a className={`brand ${className}`} href="#top" aria-label="Cruz e Rodrigues — voltar ao início">
      <svg width="0" height="0" className="brand-filter" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 0 0 0 -.5" />
          </filter>
        </defs>
      </svg>
      <img
        className="brand-symbol"
        style={{ filter: `url(#${filterId})` }}
        src="/brand/logo-cruz-rodrigues.jpg"
        alt="Monograma oficial Cruz e Rodrigues"
        width="644"
        height="582"
      />
      <span className="brand-wordmark" aria-hidden="true">
        Cruz e Rodrigues
        <small>Advocacia Especializada</small>
      </span>
    </a>
  );
}
