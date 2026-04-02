export default function TokenExpiredScreen({ reason }: { reason: string }) {
  const messages: Record<string, { title: string; body: string }> = {
    expired: {
      title: "This link has expired",
      body: "Your intake link is no longer valid. Please contact your attorney or legal representative to request a new link.",
    },
    not_found: {
      title: "Link not found",
      body: "We couldn't find this intake link. Please double-check the link or contact your attorney.",
    },
    default: {
      title: "Something went wrong",
      body: "We couldn't load your intake form. Please contact your attorney or legal representative.",
    },
  };

  const { title, body } = messages[reason] ?? messages.default;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5"
      style={{ background: "#0f1923" }}
    >
      <div className="text-center max-w-sm">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(251,191,36,0.1)" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 3L2 24h24L14 3z"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M14 11v6" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
            <circle cx="14" cy="20" r="1" fill="#fbbf24" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-3">{title}</h1>
        <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
          {body}
        </p>
      </div>
    </div>
  );
}
