import urllib.request
import json
import time
import subprocess
import sys

print("Starting Flask server as background process...")
process = subprocess.Popen([r".venv\Scripts\python.exe", "app.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Wait a few seconds for Flask to bind to port 5000
time.sleep(3)

try:
    print("Testing homepage GET /...")
    with urllib.request.urlopen("http://127.0.0.1:5000/") as response:
        html = response.read().decode('utf-8')
        print(f"Homepage load status: {response.status}")
        assert "BigQuery Release Radar" in html, "Homepage does not contain target title"
        print("[OK] Homepage loads successfully.")

    print("Testing API endpoint GET /api/releases...")
    with urllib.request.urlopen("http://127.0.0.1:5000/api/releases") as response:
        data = json.loads(response.read().decode('utf-8'))
        print(f"API load status: {response.status}")
        assert data.get("success") is True, "API response success is not True"
        assert len(data.get("releases", [])) > 0, "API returned empty releases"
        print(f"[OK] API loaded successfully. Parsed {len(data['releases'])} releases.")
        
    print("Integration test passed successfully!")
    sys.exit(0)

except Exception as e:
    print(f"Integration test FAILED: {e}")
    sys.exit(1)

finally:
    print("Stopping Flask server...")
    process.terminate()
    process.wait()
