#!/usr/bin/env python3
"""Generate a simple interactive tree visualization of a codebase."""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

IGNORE = {".git", "node_modules", "__pycache__", ".venv", "venv", "dist", "build"}


def scan(path: Path, stats: dict) -> dict:
    result = {"name": path.name, "children": [], "size": 0}
    try:
        for item in sorted(path.iterdir()):
            if item.name in IGNORE or item.name.startswith("."):
                continue
            if item.is_file():
                size = item.stat().st_size
                ext = item.suffix.lower() or "(no ext)"
                result["children"].append({"name": item.name, "size": size, "ext": ext})
                result["size"] += size
                stats["files"] += 1
                stats["extensions"][ext] += 1
                stats["ext_sizes"][ext] += size
            elif item.is_dir():
                stats["dirs"] += 1
                child = scan(item, stats)
                if child["children"]:
                    result["children"].append(child)
                    result["size"] += child["size"]
    except PermissionError:
        pass
    return result


def fmt_bytes(size: int) -> str:
    if size < 1024:
        return f"{size} B"
    if size < 1_048_576:
        return f"{size / 1024:.1f} KB"
    return f"{size / 1_048_576:.1f} MB"


def build_html(data: dict, stats: dict) -> str:
    colors = {
        ".js": "#f7df1e",
        ".ts": "#3178c6",
        ".py": "#3776ab",
        ".go": "#00add8",
        ".rs": "#dea584",
        ".css": "#264de4",
        ".html": "#e34c26",
        ".json": "#6b7280",
        ".md": "#083fa1",
        ".tsx": "#3178c6",
        ".jsx": "#61dafb",
        ".sh": "#4eaa25",
    }
    top_exts = sorted(stats["ext_sizes"].items(), key=lambda item: -item[1])[:8]
    total = sum(stats["ext_sizes"].values()) or 1
    bars = "".join(
        f'<div class="bar-row"><span class="bar-label">{ext}</span>'
        f'<div class="bar" style="width:{(size / total) * 100:.1f}%;background:{colors.get(ext, "#6b7280")}"></div>'
        f'<span class="bar-pct">{(size / total) * 100:.1f}%</span></div>'
        for ext, size in top_exts
    )
    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Codebase Explorer</title>
  <style>
    body {{ font: 14px/1.5 system-ui, sans-serif; margin: 0; background: #101826; color: #ecf2ff; }}
    .container {{ display: flex; min-height: 100vh; }}
    .sidebar {{ width: 290px; background: #172235; padding: 20px; border-right: 1px solid #24324a; }}
    .main {{ flex: 1; padding: 20px; overflow: auto; }}
    h1 {{ font-size: 18px; margin: 0 0 12px; }}
    h2 {{ font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #8aa0c7; margin-top: 20px; }}
    .stat {{ display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid #24324a; }}
    .tree {{ list-style: none; padding-left: 20px; }}
    details summary {{ cursor: pointer; padding: 4px 6px; border-radius: 6px; }}
    details summary:hover, .file:hover {{ background: #1d2b41; }}
    .file {{ padding: 4px 6px; border-radius: 6px; display: flex; align-items: center; }}
    .size {{ margin-left: auto; color: #8aa0c7; font-size: 12px; }}
    .dot {{ width: 8px; height: 8px; border-radius: 999px; margin-right: 8px; }}
    .bar-row {{ display: flex; align-items: center; margin: 7px 0; gap: 8px; }}
    .bar-label {{ width: 52px; color: #9fb3d8; font-size: 12px; }}
    .bar {{ height: 16px; border-radius: 999px; }}
    .bar-pct {{ font-size: 12px; color: #9fb3d8; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="sidebar">
      <h1>Summary</h1>
      <div class="stat"><span>Files</span><strong>{stats["files"]:,}</strong></div>
      <div class="stat"><span>Directories</span><strong>{stats["dirs"]:,}</strong></div>
      <div class="stat"><span>Total size</span><strong>{fmt_bytes(data["size"])}</strong></div>
      <div class="stat"><span>File types</span><strong>{len(stats["extensions"])}</strong></div>
      <h2>By file type</h2>
      {bars}
    </div>
    <div class="main">
      <h1>{data["name"]}</h1>
      <ul class="tree" id="root"></ul>
    </div>
  </div>
  <script>
    const data = {json.dumps(data)};
    const colors = {json.dumps(colors)};
    function fmtBytes(n) {{
      if (n < 1024) return `${{n}} B`;
      if (n < 1048576) return `${{(n / 1024).toFixed(1)}} KB`;
      return `${{(n / 1048576).toFixed(1)}} MB`;
    }}
    function render(node, parent) {{
      if (node.children) {{
        const li = document.createElement("li");
        const details = document.createElement("details");
        details.open = parent.id === "root";
        details.innerHTML = `<summary>📁 ${{node.name}} <span class="size">${{fmtBytes(node.size)}}</span></summary>`;
        const ul = document.createElement("ul");
        ul.className = "tree";
        node.children
          .sort((a, b) => (b.children ? 1 : 0) - (a.children ? 1 : 0) || a.name.localeCompare(b.name))
          .forEach(child => render(child, ul));
        details.appendChild(ul);
        li.appendChild(details);
        parent.appendChild(li);
      }} else {{
        const li = document.createElement("li");
        li.className = "file";
        li.innerHTML = `<span class="dot" style="background:${{colors[node.ext] || "#6b7280"}}"></span>${{node.name}}<span class="size">${{fmtBytes(node.size)}}</span>`;
        parent.appendChild(li);
      }}
    }}
    data.children.forEach(child => render(child, document.getElementById("root")));
  </script>
</body>
</html>
"""


def main() -> int:
    target = Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    stats = {"files": 0, "dirs": 0, "extensions": Counter(), "ext_sizes": Counter()}
    data = scan(target, stats)
    out = Path("codebase-map.html")
    out.write_text(build_html(data, stats), encoding="utf-8")
    print(f"Generated {out.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
