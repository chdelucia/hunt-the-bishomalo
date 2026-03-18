from playwright.sync_api import Page, expect, sync_playwright
import os

def verify_performance_changes(page: Page):
    # Enable console logging to see our performance metrics
    page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))

    # Navigate to the app
    page.goto("http://localhost:4200")
    page.wait_for_timeout(2000)

    # Take screenshot of the home page (LCP candidate)
    page.screenshot(path="/home/jules/verification/home.png")

    # Go to config/start game to see the board (CLS test)
    # Based on app.routes.ts, HOME points to game shell.
    # Usually there is a start button or something.
    # Let's just capture the initial state.

    page.wait_for_timeout(1000)
    page.screenshot(path="/home/jules/verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()
        try:
            verify_performance_changes(page)
        finally:
            context.close()
            browser.close()
