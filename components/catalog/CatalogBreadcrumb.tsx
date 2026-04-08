import Link from "next/link";

export function CatalogBreadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="bg-navy font-sans text-body-sm">
      <ol className="mx-auto flex max-w-content flex-wrap items-center gap-x-2 gap-y-1 px-6 pt-4 pb-2 md:px-8 lg:px-12">
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="text-gray-muted">
                &gt;
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="text-gray-muted transition-colors hover:text-blue-light"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-off-white">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
