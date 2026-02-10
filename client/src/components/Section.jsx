/**
 * Generic section wrapper with optional title and aria metadata.
 * @param {{ title?: string, className?: string, role?: string, live?: 'polite'|'assertive'|'off', children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export default function Section({
  title,
  className,
  role,
  live,
  children,
}) {
  return (
    <section className={className} role={role} aria-live={live}>
      {title && <h3 className="visually-hidden">{title}</h3>}
      {children}
    </section>
  );
}
