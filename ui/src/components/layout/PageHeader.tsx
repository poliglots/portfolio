interface PageHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Reusable page header with title and subtitle.
 */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div id="page-header">
      <h1 className="page-title">{title}</h1>
      <p className="page-subtitle">{subtitle}</p>
    </div>
  );
}
