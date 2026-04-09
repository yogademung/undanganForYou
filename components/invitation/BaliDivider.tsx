export default function BaliDivider() {
  return (
    <div className="flex justify-center items-center py-8 opacity-70">
      <svg width="150" height="30" viewBox="0 0 150 30" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M75 1L85.5 15L75 29L64.5 15L75 1Z" stroke="var(--color-gold)" strokeWidth="1.5" />
        <path d="M0 15H55" stroke="var(--color-gold)" strokeWidth="1.5" />
        <path d="M95 15H150" stroke="var(--color-gold)" strokeWidth="1.5" />
        <circle cx="75" cy="15" r="4" fill="var(--color-gold)" />
      </svg>
    </div>
  );
}
