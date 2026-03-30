from playwright.sync_api import sync_playwright
import os

def run_cuj(page):
    # We navigate to the built index.html directly for static verification of the script tag
    # or we could try to serve it. Since it's a security hardening,
    # the main thing is that the script tag is present and correct.

    # Path to the built index.html
    index_path = os.path.abspath("dist/browser/index.html")
    page.goto(f"file://{index_path}")
    page.wait_for_timeout(1000)

    # Check for the script tag
    script_tag = page.locator('script[src="assets/scripts/gtm.js"]')
    if script_tag.count() > 0:
        print("SUCCESS: Found gtm.js script tag")
    else:
        print("FAILURE: Could not find gtm.js script tag")
        # List all scripts for debugging
        scripts = page.locator('script').all()
        for s in scripts:
            print(f"Script: {s.get_attribute('src') or 'inline'}")

    # Verify that the inline script is gone
    inline_scripts = page.evaluate("() => Array.from(document.querySelectorAll('script:not([src])')).map(s => s.textContent)")
    found_gtm_logic = any("gtag" in s for s in inline_scripts)
    if not found_gtm_logic:
        print("SUCCESS: Inline GTM logic is gone")
    else:
        print("FAILURE: Inline GTM logic still present")

    page.screenshot(path="verification/screenshots/verification.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
