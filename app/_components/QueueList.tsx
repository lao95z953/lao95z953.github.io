type QueueItem = {
  number: string;
  type: string;
  title: string;
  description: string;
  status: string;
};

export function QueueList({ items }: { items: readonly QueueItem[] }) {
  return (
    <div className="queue-list">
      {items.map((item) => (
        <article className="queue-row" key={item.number}>
          <span className="queue-number">{item.number}</span>
          <span className="queue-type">{item.type}</span>
          <div>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
          <span className="queue-status">{item.status}</span>
        </article>
      ))}
    </div>
  );
}
