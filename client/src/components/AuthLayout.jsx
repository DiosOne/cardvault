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
