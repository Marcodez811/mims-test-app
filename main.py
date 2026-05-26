from fastapi import FastAPI, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import sample_consume_code

app = FastAPI()

# CORS for frontend development (Vite dev server at :5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (assets needed by XSLT-rendered HTML + JSON data)
app.mount("/CSS", StaticFiles(directory="CSS"), name="CSS")
app.mount("/Scripts", StaticFiles(directory="Scripts"), name="Scripts")
app.mount("/images", StaticFiles(directory="images"), name="images")

SCENARIOS_FILE = "scenarios.json"
TEST_FILE = "test.json"

# In-memory store for the last response HTML (served as a real page)
_last_response_html: str | None = None


def load_json_file(path: str):
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return []


@app.get("/api/scenarios")
async def get_scenarios():
    """Return all saved scenarios."""
    return load_json_file(SCENARIOS_FILE)


@app.get("/api/tests")
async def get_tests():
    """Return all test scenarios from test.json."""
    return load_json_file(TEST_FILE)


@app.post("/api/consume")
async def consume(
    endpoint: str = Form(...),
    prescription_query: str = Form(...),
    alert_filter_by_drug: str = Form(""),
    alert_filter_by_severity: str = Form(""),
):
    """
    Proxy the MIMS API request and return both raw XML and transformed HTML.
    Also stores the HTML so it can be served as a standalone page via /api/response-html.
    """
    global _last_response_html

    xml_response = sample_consume_code.consume_endpoint(
        endpoint,
        prescription_query,
        "xml",
        alert_filter_by_drug,
        alert_filter_by_severity,
    )

    if not xml_response:
        _last_response_html = None
        return JSONResponse(
            status_code=502,
            content={"xml_response": None, "html_content": None, "error": "No XML response received from MIMS endpoint."},
        )

    # Transform XML to HTML using XSLT
    xslt_path = "MIMSStylesheet_CDSDefault_byRanking_EN_551126.xsl"
    html_content = sample_consume_code.transform_xml_to_html(xml_response, xslt_path)

    # Store for serving as a standalone page
    _last_response_html = html_content

    return {
        "xml_response": xml_response,
        "html_content": html_content or None,
        "error": "XSLT transformation failed." if not html_content else None,
    }


@app.get("/response-html")
async def get_response_html():
    """Serve the last XSLT-transformed response as a standalone HTML page."""
    if _last_response_html:
        return HTMLResponse(content=_last_response_html)
    return HTMLResponse(
        content="<html><body><p>No response yet. Execute a request first.</p></body></html>",
        status_code=404,
    )


@app.get("/api/health")
async def health():
    """Health check endpoint for the frontend to verify connectivity."""
    return {"status": "ok"}

