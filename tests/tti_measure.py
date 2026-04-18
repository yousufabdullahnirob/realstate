from playwright.sync_api import sync_playwright
import time

def measure_tti_and_images():
    print("--- ADVANCED PERFORMANCE: TTI & IMAGE ANALYSIS ---")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # Dashboard URL
        url = "http://localhost:5173/dashboard"
        
        print(f"[INFO] Measuring TTI for {url}...")
        
        # We start measuring from navigation start
        start_nav = time.time()
        page.goto(url)
        
        # Wait until the page is interactive (no network activity for 500ms)
        page.wait_for_load_state("networkidle")
        tti = (time.time() - start_nav) * 1000
        
        print(f"[OK] Time to Interactive (TTI): {tti:.2f} ms")
        
        # Image Analysis
        print("[INFO] Analyzing Image Loading metrics...")
        images = page.evaluate("""
            () => performance.getEntriesByType('resource')
                .filter(r => r.initiatorType === 'img')
                .map(r => ({ name: r.name.split('/').pop(), duration: r.duration }))
        """)
        
        for img in images[:5]: # Show top 5
            print(f" - Image: {img['name']} | Load Duration: {img['duration']:.2f} ms")
            
        blocking_images = [img for img in images if img['duration'] > 500]
        if blocking_images:
            print(f"[WARN] found {len(blocking_images)} images taking > 500ms to load.")
        else:
            print("[OK] Image loading is efficient and non-blocking.")

        browser.close()

if __name__ == "__main__":
    try:
        measure_tti_and_images()
    except Exception as e:
        print(f"[ERROR] Advanced performance check failed: {e}")
