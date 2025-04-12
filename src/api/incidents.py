from fastapi import APIRouter, HTTPException
from typing import Dict, List
import json
import os
from ..models.security_analyzer import SecurityAnalyzer

router = APIRouter()
analyzer = SecurityAnalyzer()

# Cargar ejemplos de incidentes
def load_incident_examples():
    try:
        with open('src/data/incident_examples.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error cargando ejemplos: {str(e)}")
        return {"incidentes": []}

@router.get("/examples")
async def get_incident_examples():
    """
    Devuelve los ejemplos de incidentes disponibles
    """
    return load_incident_examples()

@router.post("/analyze")
async def analyze_incident(incident_data: Dict):
    """
    Analiza un incidente de seguridad y devuelve:
    - Vulnerabilidades identificadas
    - Impactos potenciales
    - Controles recomendados
    """
    try:
        analysis = analyzer.analyze_incident(incident_data)
        return {
            "status": "success",
            "data": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 