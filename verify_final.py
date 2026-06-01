import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Verify root redirection
        await page.goto("http://localhost:8080/")
        url = page.url
        print(f"Root redirected to: {url}")

        # Take a screenshot of footer
        await page.set_viewport_size({"width": 1280, "height": 2000})
        await page.goto("http://localhost:8080/en/index.html")
        await page.screenshot(path="footer_verify.png", full_page=True)
        print("Screenshot saved to footer_verify.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
