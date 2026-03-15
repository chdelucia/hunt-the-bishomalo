from playwright.sync_api import Page, expect, sync_playwright

def verify_feature(page: Page):
    # Navigate to the home page
    page.goto("http://localhost:4200")
    page.wait_for_timeout(2000) # Wait for initial load and title animation

    # Click to start or enter game if needed
    # (Assuming there's a button to start, based on Hunt the Wumpus style)
    # Let's just capture the main page and title first
    page.screenshot(path="/home/jules/verification/verification_home.png")
    page.wait_for_timeout(1000)

    # If possible, navigate to the game page to see effects
    # Based on hunt-bisho.component.ts selector 'app-hunt-bisho'
    # and app-routes.ts (which I haven't read yet but usually '/' or '/game')

    # Let's check routes
    page.screenshot(path="/home/jules/verification/verification_game.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    import os
    os.makedirs("/home/jules/verification/video", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()
        try:
            verify_feature(page)
        finally:
            context.close()
            browser.close()
