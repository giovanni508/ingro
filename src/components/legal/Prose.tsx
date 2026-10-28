import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Minimal Markdown renderer for the legal pages (content/legal/*.md):
 * "## " headings, "- " lists, paragraphs, **bold**, [links](url), bare URLs
 * and e-mail addresses. Enough for these texts, no dependency.
 */
function inline(text: string, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s)]+[^\s).,;:])|([\w.+-]+@[\w-]+\.[\w.-]+[a-z])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const k = `${key}-${i++}`;
    if (m[1]) out.push(<strong key={k}>{m[1]}</strong>);
    else if (m[2]) {
      const href = m[3];
      out.push(href.startsWith("/") ? <Link key={k} href={href}>{m[2]}</Link> : <a key={k} href={href} target="_blank" rel="noopener noreferrer">{m[2]}</a>);
    } else if (m[4]) out.push(<a key={k} href={m[4]} target="_blank" rel="noopener noreferrer">{m[4]}</a>);
    else if (m[5]) out.push(<a key={k} href={`mailto:${m[5]}`}>{m[5]}</a>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function Prose({ source }: { source: string }) {
  const blocks = source.replace(/\r/g, "").split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose-legal">
      {blocks.map((b, i) => {
        if (b.startsWith("## ")) {
          const t = b.slice(3);
          return (
            <h2 key={i} id={t.toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "")}>
              {t}
            </h2>
          );
        }
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{inline(lines.join(" "), String(i))}</p>;
      })}
    </div>
  );
}
