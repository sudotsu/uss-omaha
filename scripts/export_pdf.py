import os
import sys
from playwright.sync_api import sync_playwright

def export_pdf():
    # Ensure URL is provided or default to local
    url = "http://localhost:3000/print"
    output_path = "public/USS_Omaha_Memorial_2026_Plan.pdf"

    print(f"Generating PDF from {url}...")

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate and wait for content
        page.goto(url, wait_until="networkidle")

        # Force print media type emulation just in case, though playright pdf does this
        page.emulate_media(media="print")

        # Additional wait for images if needed
        page.wait_for_timeout(2000)

        # Generate PDF
        page.pdf(
            path=output_path,
            format="Letter",
            print_background=True,
            margin={
                "top": "0.5in",
                "right": "0.5in",
                "bottom": "0.5in",
                "left": "0.5in"
            }
        )

        browser.close()

    print(f"PDF successfully generated at: {output_path}")

if __name__ == "__main__":
    export_pdf()
