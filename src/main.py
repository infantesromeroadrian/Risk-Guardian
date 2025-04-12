from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi import Request

app = FastAPI(
    title="Terra Renewables Cybersecurity Management System",
    description="Sistema de gestión de incidentes de ciberseguridad para Terra Renewables",
    version="1.0.0"
)

# Montar archivos estáticos
app.mount("/static", StaticFiles(directory="src/static"), name="static")

# Configurar templates
templates = Jinja2Templates(directory="src/templates")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    """
    Página principal de la aplicación
    """
    return templates.TemplateResponse(
        "index.html",
        {"request": request, "title": "Terra Renewables - Ciberseguridad"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 