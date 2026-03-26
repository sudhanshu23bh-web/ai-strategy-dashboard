import os

base = r"C:\Users\SUDHANSHU BHARGAVA\.gemini\antigravity\scratch\ai-strategy-doc"

with open(os.path.join(base, "style.css"), "r", encoding="utf-8") as f:
    css = f.read()
with open(os.path.join(base, "data.js"), "r", encoding="utf-8") as f:
    data_js = f.read()
with open(os.path.join(base, "app.js"), "r", encoding="utf-8") as f:
    app_js = f.read()
with open(os.path.join(base, "render.js"), "r", encoding="utf-8") as f:
    render_js = f.read()
with open(os.path.join(base, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

# Read Chart.js local file
chart_js = ""
chart_path = os.path.join(base, "chart.min.js")
if os.path.exists(chart_path):
    with open(chart_path, "r", encoding="utf-8") as f:
        chart_js = f.read()
    print(f"Chart.js loaded: {len(chart_js)} chars")

# Replace CDN script with inline Chart.js
html = html.replace(
    '<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>',
    f'<script>\n{chart_js}\n</script>'
)

# Replace external references with inline
html = html.replace('<link rel="stylesheet" href="style.css">', f'<style>\n{css}\n</style>')
html = html.replace('<script src="data.js"></script>\n<script src="app.js"></script>\n<script src="render.js"></script>',
    f'<script>\n{data_js}\n{app_js}\n{render_js}\n</script>')

out_path = os.path.join(base, "AI_Strategy_Document_SHAREABLE.html")
with open(out_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"DONE! Single file: {out_path}")
print(f"Size: {os.path.getsize(out_path)/1024:.0f} KB")
