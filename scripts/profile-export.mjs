import fs from "node:fs";
import path from "node:path";

// Runs inside the existing prerender browser. Only the public page is read.
export function collectPublicProfile(generatedAt) {
  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
  if (!canonical || new URL(canonical).protocol !== "https:") {
    throw new Error("Profile export requires an absolute HTTPS canonical URL");
  }
  const main = document.querySelector("main");
  if (!main) throw new Error("Profile export requires public main content");
  const clean = element => {
    const clone = element.cloneNode(true);
    clone.querySelectorAll('script, style, noscript, canvas, svg, form, button, nav, [aria-hidden="true"], [hidden]').forEach(el => el.remove());
    clone.querySelectorAll("br, p, div, li, h1, h2, h3, h4").forEach(el => el.append(document.createTextNode(" ")));
    return clone;
  };
  const text = element => (element?.textContent || "").replace(/\s+/g, " ").trim();
  const sections = [...main.querySelectorAll("section[id]")]
    .filter(section => !section.parentElement.closest("section[id]"))
    .map(section => {
      const copy = clean(section);
      const links = [...copy.querySelectorAll("a[href]")].flatMap(anchor => {
        const url = new URL(anchor.getAttribute("href"), canonical);
        return ["https:", "http:", "mailto:", "tel:"].includes(url.protocol)
          ? [{ label: text(anchor), url: url.href }] : [];
      });
      return {
        id: section.id,
        heading: text(copy.querySelector("h1, h2")) || section.id,
        text: text(copy),
        source_url: new URL("#" + section.id, canonical).href,
        links: links.filter((link, index) => links.findIndex(other => other.url === link.url && other.label === link.label) === index),
      };
    }).filter(section => section.text);
  const structured = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map(script => JSON.parse(script.textContent));
  const description = document.querySelector('meta[name="description"]')?.content;
  if (!sections.length || !structured.length || !description) {
    throw new Error("Profile export requires content, structured metadata and a description");
  }
  const directory = canonical.endsWith("/") ? canonical : canonical + "/";
  return {
    schema_version: "1.0", canonical_url: canonical,
    language: document.documentElement.lang, generated_at: generatedAt,
    title: document.title, description, structured_data: structured, sections,
    representations: {
      html: canonical, markdown: new URL("about.md", directory).href,
      json: new URL("profile.json", directory).href,
    },
  };
}

export function profileMarkdown(profile) {
  const lines = [
    `# ${profile.title}`, "", profile.description, "",
    `Source: <${profile.canonical_url}>`, `Language: ${profile.language}`,
    `Export generated: ${profile.generated_at}`, `JSON: <${profile.representations.json}>`, "",
  ];
  for (const section of profile.sections) {
    lines.push(`## ${section.heading}`, "", section.text, "", `Source: <${section.source_url}>`, "");
    for (const link of section.links) lines.push(`- ${link.label || link.url}: <${link.url}>`);
    if (section.links.length) lines.push("");
  }
  return lines.join("\n");
}

export function writeProfileExports(profile, directory) {
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "profile.json"), JSON.stringify(profile, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(directory, "about.md"), profileMarkdown(profile), "utf8");
}

export function writeProfileIndex(profiles, directory) {
  if (!profiles.length) throw new Error("Cannot publish an empty profile index");
  const first = profiles.find(profile => profile.language === "en") || profiles[0];
  const lines = [`# ${first.title}`, "", first.description, "", "## Public sources", ""];
  for (const profile of profiles) {
    lines.push(`- HTML (${profile.language}): ${profile.canonical_url}`);
    lines.push(`- Markdown (${profile.language}): ${profile.representations.markdown}`);
    lines.push(`- JSON (${profile.language}): ${profile.representations.json}`);
  }
  lines.push("", `JSON Schema: ${new URL("/profile.schema.json", first.canonical_url).href}`, "");
  fs.writeFileSync(path.join(directory, "llms.txt"), lines.join("\n"), "utf8");
}
