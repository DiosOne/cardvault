/**
 * Layout wrapper for authentication forms with consistent heading and styling.
 * @param {{ title: string, subtitle?: string, onSubmit: (event: import('react').FormEvent<HTMLFormElement>) => void, children: import('react').ReactNode }} props
 * @returns {JSX.Element}
 */
export default function AuthLayout({title, children, onSubmit, subtitle}) {
  return (
    <main className='auth-container' role='main'>
      <form onSubmit={onSubmit} aria-labelledby='auth-heading'>
        <h2 id='auth-heading'>{title}</h2>
        {subtitle && <p className='auth-subtitle'>{subtitle}</p>}
        {children}
      </form>
    </main>
  );
}
