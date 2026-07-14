import Link from "next/link";

type IndexItem = {
  number: string;
  label: string;
  title: string;
  description: string;
  href: string;
};

export function CollectionIndex({ items }: { items: readonly IndexItem[] }) {
  return (
    <div className="index-list">
      {items.map((item) => (
        <Link className="index-row" href={item.href} key={item.number}>
          <span className="index-number">{item.number}</span>
          <span className="index-label">{item.label}</span>
          <span className="index-copy">
            <strong>{item.title}</strong>
            <small>{item.description}</small>
          </span>
          <span className="index-arrow" aria-hidden="true">↗</span>
        </Link>
      ))}
    </div>
  );
}
