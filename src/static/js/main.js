document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('analysis-form');
    const titleInput = document.getElementById('incident-title');
    const descriptionTextarea = document.getElementById('incident-description');
    const exampleButtons = document.querySelectorAll('.example-btn');

    // Cargar ejemplos de incidentes
    let incidentExamples = {};

    // Función para cargar los ejemplos
    async function loadExamples() {
        try {
            const response = await fetch('/api/examples');
            const data = await response.json();
            incidentExamples = data.incidentes;
        } catch (error) {
            console.error('Error cargando ejemplos:', error);
        }
    }

    // Cargar ejemplos al iniciar
    loadExamples();

    // Manejar clic en botones de ejemplo
    exampleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const incidentId = button.dataset.id;
            const incident = incidentExamples.find(i => i.id === incidentId);
            
            if (incident) {
                titleInput.value = incident.titulo;
                descriptionTextarea.value = incident.descripcion;
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = titleInput.value.trim();
        const description = descriptionTextarea.value.trim();
        
        if (!title || !description) {
            alert('Por favor, complete todos los campos');
            return;
        }

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    titulo: title,
                    descripcion: description
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                displayResults(data.data);
            } else {
                throw new Error('Error en el análisis');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al analizar el incidente');
        }
    });

    function displayResults(results) {
        // Mostrar vulnerabilidades
        const vulnerabilitiesContent = document.querySelector('#vulnerabilities .result-content');
        vulnerabilitiesContent.innerHTML = formatVulnerabilities(results.vulnerabilidades);

        // Mostrar impactos
        const impactsContent = document.querySelector('#impacts .result-content');
        impactsContent.innerHTML = formatImpacts(results.impactos);

        // Mostrar controles
        const controlsContent = document.querySelector('#controls .result-content');
        controlsContent.innerHTML = formatControls(results.controles);
    }

    function formatVulnerabilities(vulnerabilities) {
        return vulnerabilities.map(v => `
            <div class="vulnerability-item">
                <h4>Tipo: ${v.tipo}</h4>
                <p><strong>Descripción:</strong> ${v.descripcion}</p>
                <p><strong>Severidad:</strong> ${v.severidad}</p>
                <p><strong>Categoría:</strong> ${v.categoria}</p>
                <p><strong>Recomendación:</strong> ${v.recomendacion}</p>
            </div>
        `).join('');
    }

    function formatImpacts(impacts) {
        return impacts.map(i => `
            <div class="impact-item">
                <h4>Tipo: ${i.tipo}</h4>
                <p><strong>Descripción:</strong> ${i.descripcion}</p>
                <p><strong>Impacto:</strong> ${i.impacto}</p>
                <p><strong>Recuperable:</strong> ${i.recuperable ? 'Sí' : 'No'}</p>
                <p><strong>Tiempo de Recuperación:</strong> ${i.tiempo_recuperacion}</p>
            </div>
        `).join('');
    }

    function formatControls(controls) {
        return controls.map(c => `
            <div class="control-item">
                <h4>Tipo: ${c.tipo}</h4>
                <p><strong>Descripción:</strong> ${c.descripcion}</p>
                <p><strong>Prioridad:</strong> ${c.prioridad}</p>
                <p><strong>Costo Estimado:</strong> ${c.costo_estimado}</p>
                <p><strong>Tiempo de Implementación:</strong> ${c.tiempo_implementacion}</p>
            </div>
        `).join('');
    }
}); 