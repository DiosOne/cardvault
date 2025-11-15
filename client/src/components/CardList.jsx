import Section from './Section';

export default function CardList({ cards, onEdit, onDelete }) {
  if (!cards.length)
    return (
      <Section title="Your Card Collection" className="card-grid" aria-live="polite">
        <p>No cards yet.</p>
      </Section>
    );

  return (
    <Section title="Your Card Collection" className="card-grid" role="region">
      {cards.map((card, index) => (
        <article
          key={card._id}
          className="card"
          aria-label={`Card: ${card.name}, ${card.type}, ${card.rarity}`}
        >
          <img
            src={`https://picsum.photos/200/300?grayscale&random=${index + 1}`}
            alt={`${card.name} placeholder artwork`}
            width="200"
            height="300"
          />
          <header>
            <h4>{card.name}</h4>
          </header>
          <p>{card.type} - {card.rarity}</p>
          <p><strong>Value:</strong> ${card.value}</p>
          <footer className="card-actions">
            <button className="card-btn edit" type="button" onClick={() => onEdit(card)} aria-label={`Edit ${card.name}`}>
              Edit
            </button>
            <button className="card-btn delete" type="button" onClick={() => onDelete(card._id)} aria-label={`Delete ${card.name}`}>
              Delete
            </button>
          </footer>
        </article>
      ))}
    </Section>
  );
}
