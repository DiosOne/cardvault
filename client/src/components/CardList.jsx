export default function CardList({cards, onEdit, onDelete}) {
  if (!cards.length) return <p>No cards yet.</p>;

  return (
    <div className="card-grid">
      {cards.map((card) => (
        <div key={card._id} className="card">
          <img src="https://via.placeholder.com/300x180" alt={card.name}/>
          <h3>{card.name}</h3>
          <p>{card.type} - {card.rarity}</p>
          <p>${card.value}</p>
          <button> onClick={() => onEdit(card)}Edit</button>
          <button> onClick={() => onDelete(card._id)}Delete</button>
        </div>
      ))} 
    </div>
  )
}