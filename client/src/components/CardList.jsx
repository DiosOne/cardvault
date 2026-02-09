import { useMemo, useState } from 'react';
import Section from './Section';

const STATUS_META = {
  owned: { key: 'owned', label: 'Owned', pill: 'Owned', className: 'owned' },
  'for trade': { key: 'for trade', label: 'For Trade', pill: 'For Trade', className: 'trade' },
  wanted: { key: 'wanted', label: 'Wanted', pill: 'Wanted', className: 'wanted' },
};

const STATUS_ORDER = ['owned', 'for trade', 'wanted'];

const normalizeStatus = (status) => {
  const normalized = (status || 'owned').toString().toLowerCase().trim();
  if (
    normalized === 'for trade' ||
    normalized === 'fortrade' ||
    normalized === 'for-trade' ||
    normalized === 'trade'
  ) {
    return 'for trade';
  }
  if (normalized === 'owned' || normalized === 'wanted') {
    return normalized;
  }
  return 'owned';
};

const matchesText = (value, query) => {
  if (!query) return true;
  return (value || '').toString().toLowerCase().includes(query.toLowerCase().trim());
};

const matchesMinValue = (value, filterValue) => {
  if (filterValue === '' || filterValue === null || filterValue === undefined) return true;
  const min = Number(filterValue);
  if (Number.isNaN(min)) return true;
  const cardValue = Number(value);
  if (Number.isNaN(cardValue)) return false;
  return cardValue >= min;
};

export default function CardList({
  cards,
  onEdit,
  onDelete,
  onMoveToTrade,
  onCancelTrade,
  onAddWanted,
}) {
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    rarity: '',
    value: '',
    status: 'all',
  });

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCards = useMemo(
    () =>
      cards.filter((card) => {
        if (!matchesText(card.name, filters.name)) return false;
        if (!matchesText(card.type, filters.type)) return false;
        if (!matchesText(card.rarity, filters.rarity)) return false;
        if (!matchesMinValue(card.value, filters.value)) return false;
        if (filters.status !== 'all' && normalizeStatus(card.status) !== filters.status) return false;
        return true;
      }),
    [cards, filters],
  );

  const groupedCards = useMemo(() => {
    const groups = { owned: [], 'for trade': [], wanted: [] };
    filteredCards.forEach((card) => {
      const statusKey = normalizeStatus(card.status);
      (groups[statusKey] || groups.owned).push(card);
    });
    return groups;
  }, [filteredCards]);

  if (!cards.length)
    return (
      <Section title="Your Card Collection" className="card-collection" aria-live="polite">
        <p>No cards yet.</p>
      </Section>
    );

  return (
    <Section title="Your Card Collection" className="card-collection" role="region">
      <div className="card-filters" role="search" aria-label="Filter cards">
        <div className="card-filter">
          <label htmlFor="filter-name">Name</label>
          <input
            id="filter-name"
            name="name"
            placeholder="Search name"
            value={filters.name}
            onChange={handleFilterChange}
          />
        </div>
        <div className="card-filter">
          <label htmlFor="filter-type">Type</label>
          <input
            id="filter-type"
            name="type"
            placeholder="Search type"
            value={filters.type}
            onChange={handleFilterChange}
          />
        </div>
        <div className="card-filter">
          <label htmlFor="filter-rarity">Rarity</label>
          <input
            id="filter-rarity"
            name="rarity"
            placeholder="Search rarity"
            value={filters.rarity}
            onChange={handleFilterChange}
          />
        </div>
        <div className="card-filter">
          <label htmlFor="filter-value">Min Value</label>
          <input
            id="filter-value"
            name="value"
            type="number"
            inputMode="numeric"
            placeholder="0"
            value={filters.value}
            onChange={handleFilterChange}
          />
        </div>
        <div className="card-filter">
          <label htmlFor="filter-status">Status</label>
          <select
            id="filter-status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="owned">Owned</option>
            <option value="for trade">For Trade</option>
            <option value="wanted">Wanted</option>
          </select>
        </div>
      </div>

      <div className="card-columns">
        {STATUS_ORDER.map((statusKey) => {
          const status = STATUS_META[statusKey];
          const columnCards = groupedCards[statusKey] || [];

          return (
            <section
              key={status.key}
              className="card-column"
              aria-label={`${status.label} cards`}
            >
              <header className="card-column__header">
                <h4>{status.label}</h4>
                <span className="card-column__count">{columnCards.length}</span>
              </header>
              <div className="card-column__list">
                {columnCards.length ? (
                  columnCards.map((card, index) => (
                    <article
                      key={card._id}
                      className="card"
                      aria-label={`Card: ${card.name}, ${card.type}, ${card.rarity}, ${status.label}`}
                    >
                      <img
                        src={`https://picsum.photos/200/300?grayscale&random=${index + 1}`}
                        alt={`${card.name} placeholder artwork`}
                        width="200"
                        height="300"
                      />
                      <header className="card-item__header">
                        <h4>{card.name}</h4>
                        <span className={`card-status-pill card-status-pill--${status.className}`}>
                          {status.pill}
                        </span>
                      </header>
                      <p>{card.type} - {card.rarity}</p>
                      <p><strong>Value:</strong> ${card.value}</p>
                      <footer className="card-actions">
                        <button
                          className="card-btn edit"
                          type="button"
                          onClick={() => onEdit(card)}
                          aria-label={`Edit ${card.name}`}
                        >
                          Edit
                        </button>
                        {status.key === 'owned' && (
                          <>
                            <button
                              className="card-btn action"
                              type="button"
                              onClick={() => onMoveToTrade(card)}
                              aria-label={`Move ${card.name} to for trade`}
                            >
                              Move to Trade
                            </button>
                            <button
                              className="card-btn action"
                              type="button"
                              onClick={() => onAddWanted(card)}
                              aria-label={`Add ${card.name} to wanted`}
                            >
                              Add to Wanted
                            </button>
                          </>
                        )}
                        {status.key === 'for trade' ? (
                          <button
                            className="card-btn cancel"
                            type="button"
                            onClick={() => onCancelTrade(card)}
                            aria-label={`Cancel trade for ${card.name}`}
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className="card-btn delete"
                            type="button"
                            onClick={() => onDelete(card._id)}
                            aria-label={`Delete ${card.name}`}
                          >
                            Delete
                          </button>
                        )}
                      </footer>
                    </article>
                  ))
                ) : (
                  <p className="card-column__empty">No cards here.</p>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </Section>
  );
}
