// The "watch" controls in the page heroes used to be bare <button>s with no
// handler — visible CTAs that did nothing. This renders them as a real external
// link once the matching URL is set in lib/site.ts, and as a plainly disabled
// control while it isn't, so the state is honest either way.

type Props = {
  url: string;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
};

export default function WatchVideoLink({
  url,
  className,
  ariaLabel,
  children,
}: Props) {
  if (!url) {
    return (
      <button
        type="button"
        className={className}
        aria-label={ariaLabel}
        title="Video coming soon"
        disabled
        style={{ cursor: "not-allowed", opacity: 0.55 }}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
