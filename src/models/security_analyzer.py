from typing import Dict, List
import json
import os
from openai import OpenAI
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

class SecurityAnalyzer:
    def __init__(self):
        # Inicializar cliente de OpenAI
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Ejemplos de entrenamiento para few-shot learning
        self.training_examples = {
            "vulnerabilidades": [
                {
                    "tipo": "personas",
                    "descripcion": "Empleado expone credenciales en redes sociales",
                    "severidad": "alta",
                    "categoria": "gestión de accesos",
                    "recomendacion": "Implementar políticas de uso de redes sociales y formación en seguridad"
                },
                {
                    "tipo": "tecnología",
                    "descripcion": "Sistema sin autenticación multifactor",
                    "severidad": "media",
                    "categoria": "control de acceso",
                    "recomendacion": "Implementar MFA para todos los sistemas críticos"
                },
                {
                    "tipo": "proceso",
                    "descripcion": "Falta de verificación en transferencias bancarias",
                    "severidad": "critica",
                    "categoria": "procesos financieros",
                    "recomendacion": "Establecer proceso de verificación de dos personas para transferencias"
                },
                {
                    "tipo": "tecnología",
                    "descripcion": "Sistema de pantallas internas sin segmentación de red",
                    "severidad": "media",
                    "categoria": "arquitectura de red",
                    "recomendacion": "Implementar segmentación de red y controles de acceso"
                }
            ],
            "impactos": [
                {
                    "tipo": "económico",
                    "descripcion": "Transferencia fraudulenta de 3.5M€",
                    "impacto": "crítico",
                    "recuperable": True,
                    "tiempo_recuperacion": "24 horas"
                },
                {
                    "tipo": "reputacional",
                    "descripcion": "Exposición de datos de clientes",
                    "impacto": "alto",
                    "recuperable": False,
                    "tiempo_recuperacion": "indefinido"
                },
                {
                    "tipo": "operacional",
                    "descripcion": "Interrupción de sistemas internos",
                    "impacto": "medio",
                    "recuperable": True,
                    "tiempo_recuperacion": "4 horas"
                }
            ],
            "controles": [
                {
                    "tipo": "preventivo",
                    "descripcion": "Implementar autenticación multifactor para transferencias",
                    "prioridad": "alta",
                    "costo_estimado": "medio",
                    "tiempo_implementacion": "2 semanas"
                },
                {
                    "tipo": "detectivo",
                    "descripcion": "Sistema de monitoreo de actividad anómala",
                    "prioridad": "alta",
                    "costo_estimado": "alto",
                    "tiempo_implementacion": "1 mes"
                },
                {
                    "tipo": "correctivo",
                    "descripcion": "Plan de respuesta a incidentes",
                    "prioridad": "media",
                    "costo_estimado": "bajo",
                    "tiempo_implementacion": "1 semana"
                }
            ]
        }

    def analyze_incident(self, incident_data: Dict) -> Dict:
        """
        Analiza un incidente de seguridad usando OpenAI y genera recomendaciones
        basadas en ejemplos de entrenamiento.
        """
        try:
            # Preparar el prompt para OpenAI
            prompt = self._prepare_prompt(incident_data)
            
            # Llamar a la API de OpenAI
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "Eres un experto en ciberseguridad analizando incidentes. Analiza el incidente proporcionado y genera recomendaciones específicas basadas en los ejemplos proporcionados."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Procesar la respuesta
            analysis = self._process_response(response.choices[0].message.content)
            
            return {
                "vulnerabilidades": analysis.get("vulnerabilidades", []),
                "impactos": analysis.get("impactos", []),
                "controles": analysis.get("controles", [])
            }
            
        except Exception as e:
            print(f"Error en el análisis: {str(e)}")
            # En caso de error, retornar análisis basado en ejemplos
            return {
                "vulnerabilidades": self._find_similar_vulnerabilities(incident_data),
                "impactos": self._assess_impacts(incident_data),
                "controles": self._suggest_controls(incident_data)
            }

    def _prepare_prompt(self, incident_data: Dict) -> str:
        """Prepara el prompt para OpenAI con ejemplos y el incidente actual"""
        examples = json.dumps(self.training_examples, indent=2)
        current_incident = json.dumps(incident_data, indent=2)
        
        return f"""
        Analiza el siguiente incidente de seguridad y proporciona:
        1. Lista de vulnerabilidades identificadas (tipo, descripción, severidad, categoría, recomendación)
        2. Impactos potenciales (tipo, descripción, impacto, recuperable, tiempo_recuperacion)
        3. Controles recomendados (tipo, descripción, prioridad, costo_estimado, tiempo_implementacion)

        Ejemplos de análisis previos:
        {examples}

        Incidente a analizar:
        {current_incident}

        Por favor, proporciona la respuesta en formato JSON estructurado con las mismas claves que los ejemplos.
        """

    def _process_response(self, response: str) -> Dict:
        """Procesa la respuesta de OpenAI y la convierte en un diccionario"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # Si la respuesta no es JSON válido, usar ejemplos
            return self.training_examples

    def _find_similar_vulnerabilities(self, incident_data: Dict) -> List[Dict]:
        """Encuentra vulnerabilidades similares basadas en el incidente"""
        return self.training_examples["vulnerabilities"]

    def _assess_impacts(self, incident_data: Dict) -> List[Dict]:
        """Evalúa los impactos potenciales"""
        return self.training_examples["impactos"]

    def _suggest_controls(self, incident_data: Dict) -> List[Dict]:
        """Sugiere controles basados en el incidente"""
        return self.training_examples["controles"] 