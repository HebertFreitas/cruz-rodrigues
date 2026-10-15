export default function Brand({ className = '' }) {
  return (
    <a className={`brand ${className}`} href="#top" aria-label="Cruz e Rodrigues — voltar ao início">
      <img
        className="brand-symbol"
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
