from pathlib import Path
from playwright.sync_api import sync_playwright


def capture_gallery() -> None:
    output_dir = Path("docs/screenshots")
    output_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1280})
        page.goto("http://127.0.0.1:4173", wait_until="networkidle")

        page.screenshot(path=str(output_dir / "menu-screen.png"), full_page=True)

        page.locator("#launch-run").click()
        page.wait_for_timeout(1800)
        page.keyboard.down("ArrowUp")
        page.wait_for_timeout(1100)
        page.keyboard.up("ArrowUp")
        page.wait_for_timeout(900)
        page.screenshot(path=str(output_dir / "mid-run-screen.png"), full_page=True)

        page.keyboard.down("ArrowDown")
        page.wait_for_timeout(7200)
        page.keyboard.up("ArrowDown")
        page.locator("#status-title").wait_for(state="visible")
        page.wait_for_function(
            """() => {
                const text = document.querySelector('#status-title')?.textContent ?? '';
                return text.includes('Splashdown') || text.includes('Run archived');
            }""",
            timeout=12000,
        )
        page.wait_for_timeout(1200)
        page.screenshot(path=str(output_dir / "splashdown-screen.png"), full_page=True)

        browser.close()


if __name__ == "__main__":
    capture_gallery()
