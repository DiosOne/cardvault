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
