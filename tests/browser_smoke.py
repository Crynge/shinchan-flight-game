from pathlib import Path
from playwright.sync_api import sync_playwright


def main() -> None:
    output_dir = Path("tests/artifacts")
    output_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 1280})
        page.goto("http://127.0.0.1:4173", wait_until="networkidle")
        page.locator("#launch-run").click()
        page.wait_for_timeout(1800)
        page.keyboard.down("ArrowUp")
        page.wait_for_timeout(900)
        page.keyboard.up("ArrowUp")
        page.wait_for_timeout(900)

        title = page.locator("h1").inner_text()
        distance = page.locator("#metric-distance").inner_text()

        if title != "Shinchan Flight":
            raise AssertionError(f"Unexpected title: {title}")

        if distance == "0 m":
            raise AssertionError("Distance did not advance during smoke test.")

        page.screenshot(path=str(output_dir / "shinchan-flight-smoke.png"), full_page=True)
        browser.close()


if __name__ == "__main__":
    main()
