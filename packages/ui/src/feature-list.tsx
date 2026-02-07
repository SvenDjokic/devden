interface FeatureListProps {
  features: string[];
}

export function FeatureList({ features }: FeatureListProps) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {features.map((feature, index) => (
        <li
          key={index}
          className="flex items-start gap-2 text-sm text-muted-foreground/80"
        >
          <svg
            className="w-4 h-4 text-primary-400/70 mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}
