import SiteShell from "./SiteShell";

export default function RawHtmlPage({ html }) {
  return (
    <SiteShell>
      <div
        className="page-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </SiteShell>
  );
}
