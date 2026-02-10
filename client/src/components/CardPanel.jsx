/**
 * Panel wrapper for grouping card management content.
 * @param {{ title: string, description?: string, children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export default function CardPanel({title, description, children}) {
  return (
    <section className='card-panel'>
      <header className='card-panel_header'>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </header>
      <div className='card-panel_body'>
        {children}
      </div>
    </section>
  );
}
