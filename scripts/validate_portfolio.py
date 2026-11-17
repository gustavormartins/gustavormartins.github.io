#!/usr/bin/env python3
"""Validate internal links and anchors for the static portfolio (stdlib only)."""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", ROOT / "cases" / "index.html"]
VERCEL_ROUTES = {"/linkedin", "/github", "/email"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"])
        if tag in {"a", "link", "script", "img"}:
            attribute = "href" if tag in {"a", "link"} else "src"
            if values.get(attribute):
                self.links.append((tag, values[attribute]))


def parse(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def main() -> int:
    errors: list[str] = []
    pages = {page.resolve(): parse(page) for page in PAGES}
    for page, parsed in pages.items():
        duplicate_ids = [key for key, count in Counter(parsed.ids).items() if count > 1]
        if duplicate_ids:
            errors.append(f"{page.relative_to(ROOT)}: duplicate IDs: {duplicate_ids}")
        for tag, url in parsed.links:
            parts = urlsplit(url)
            if parts.scheme or parts.netloc or url.startswith(("//", "data:", "mailto:", "tel:")):
                continue
            if parts.path in VERCEL_ROUTES:
                continue
            if parts.path.startswith("/"):
                target = ROOT / unquote(parts.path).lstrip("/")
            elif parts.path:
                target = page.parent / unquote(parts.path)
            else:
                target = page
            target = target.resolve()
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{page.relative_to(ROOT)}: {tag} {url!r} not found")
                continue
            if parts.fragment and target.suffix.lower() == ".html":
                other = pages.get(target) or parse(target)
                if parts.fragment not in other.ids:
                    errors.append(f"{page.relative_to(ROOT)}: anchor {url!r} not found")
    if errors:
        print("Internal link validation failed:")
        for issue in errors:
            print(" -", issue)
        return 1
    print(f"OK: {len(PAGES)} HTML pages, internal files and anchors validated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
