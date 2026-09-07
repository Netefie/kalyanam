// Renders a schema.org JSON-LD block.
//
// Server component on purpose: the payload has to be in the HTML that crawlers
// receive, not injected after hydration.

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // The payload is built from our own constants, but `<` still has to be
      // escaped: a literal "</script>" anywhere in the JSON would otherwise
      // close this tag early and spill the rest into the document as markup.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
