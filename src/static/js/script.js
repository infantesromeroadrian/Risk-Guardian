document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar los ejemplos desde el archivo JSON
    async function loadExamples() {
        try {
            const response = await fetch('/static/data/incident_examples.json');
            if (!response.ok) {
                throw new Error('Error al cargar los ejemplos');
            }
            const data = await response.json();
            console.log('Datos cargados:', data); // Para depuración
            return data;
        } catch (error) {
            console.error('Error al cargar los ejemplos:', error);
            return null;
        }
    }

    // Función para crear elementos de ejemplo
    function createExampleElement(example) {
        const div = document.createElement('div');
        div.className = 'subexample-item';
        div.setAttribute('data-title', example.titulo);
        div.setAttribute('data-description', example.descripcion);
        
        const title = document.createElement('h4');
        title.textContent = example.titulo;
        
        const description = document.createElement('p');
        description.textContent = example.descripcion;
        
        div.appendChild(title);
        div.appendChild(description);
        return div;
    }

    // Función para cargar ejemplos en una categoría
    async function loadCategoryExamples(categoryId) {
        console.log('Cargando ejemplos para categoría:', categoryId); // Para depuración
        const data = await loadExamples();
        if (!data || !data.categorias[categoryId]) {
            console.error('No se encontraron ejemplos para la categoría:', categoryId);
            return;
        }

        const category = data.categorias[categoryId];
        const container = document.getElementById(`subexamples-${categoryId}`);
        if (!container) {
            console.error('No se encontró el contenedor para la categoría:', categoryId);
            return;
        }

        container.innerHTML = '';
        category.ejemplos.forEach(example => {
            const exampleElement = createExampleElement(example);
            container.appendChild(exampleElement);
        });
    }

    // Manejadores para los botones de categorías
    const categoryButtons = document.querySelectorAll('.example-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', async function() {
            // Ocultar todas las subcategorías
            document.querySelectorAll('.subexamples-list').forEach(list => {
                list.classList.remove('active');
            });
            
            // Mostrar la subcategoría correspondiente
            const categoryId = this.getAttribute('data-category');
            console.log('Botón clickeado:', categoryId); // Para depuración
            await loadCategoryExamples(categoryId);
            const subcategoryList = document.getElementById(`subexamples-${categoryId}`);
            if (subcategoryList) {
                subcategoryList.classList.add('active');
            }
        });
    });

    // Manejadores para los elementos de subcategoría
    document.addEventListener('click', function(e) {
        const subexampleItem = e.target.closest('.subexample-item');
        if (subexampleItem) {
            const title = subexampleItem.getAttribute('data-title');
            const description = subexampleItem.getAttribute('data-description');
            
            // Actualizar el formulario con los datos del ejemplo
            document.getElementById('incident-title').value = title;
            document.getElementById('incident-description').value = description;
            
            // Ocultar todas las subcategorías
            document.querySelectorAll('.subexamples-list').forEach(list => {
                list.classList.remove('active');
            });
        }
    });

    // Función para analizar el incidente y generar recomendaciones
    function analyzeIncident(title, description) {
        console.log('Iniciando análisis del incidente:', { title, description });
        
        const vulnerabilities = [];
        const impacts = [];
        const controls = [];

        // Análisis de vulnerabilidades
        const vulnerabilityPatterns = [
            {
                keywords: ['credenciales', 'contraseña', 'acceso', 'login', 'password'],
                title: "Gestión inadecuada de credenciales",
                description: "Exposición o manejo inseguro de credenciales de acceso"
            },
            {
                keywords: ['correo', 'email', 'mensaje', 'comunicación'],
                title: "Falta de concienciación en seguridad",
                description: "Uso inseguro del correo electrónico para compartir información sensible"
            },
            {
                keywords: ['dispositivo', 'portátil', 'móvil', 'equipo'],
                title: "Falta de controles físicos",
                description: "Dispositivos sin cifrado o controles de seguridad adecuados"
            },
            {
                keywords: ['red', 'wifi', 'conexión', 'redes'],
                title: "Vulnerabilidades de red",
                description: "Configuraciones inseguras o falta de segmentación de red"
            },
            {
                keywords: ['software', 'aplicación', 'sistema', 'programa'],
                title: "Vulnerabilidades de software",
                description: "Falta de actualizaciones o configuraciones inseguras"
            }
        ];

        // Análisis de impactos
        const impactPatterns = [
            {
                keywords: ['datos', 'información', 'confidencial', 'sensible'],
                title: "Pérdida de confidencialidad",
                description: "Exposición de información sensible o confidencial"
            },
            {
                keywords: ['acceso', 'sistema', 'servidor', 'base de datos'],
                title: "Compromiso de sistemas",
                description: "Posible acceso no autorizado a sistemas o recursos"
            },
            {
                keywords: ['cliente', 'empleado', 'usuario', 'persona'],
                title: "Impacto en privacidad",
                description: "Afectación a la privacidad de clientes o empleados"
            },
            {
                keywords: ['financiero', 'dinero', 'coste', 'económico'],
                title: "Impacto financiero",
                description: "Pérdidas económicas o costes asociados al incidente"
            },
            {
                keywords: ['reputación', 'imagen', 'confianza', 'marca'],
                title: "Impacto en reputación",
                description: "Daño a la imagen o reputación de la organización"
            }
        ];

        // Recomendaciones de controles
        const controlPatterns = [
            {
                vulnerability: 'credenciales',
                controls: [
                    {
                        title: "Implementar MFA",
                        description: "Establecer autenticación multifactor para todos los sistemas críticos"
                    },
                    {
                        title: "Gestión de contraseñas",
                        description: "Implementar un gestor de contraseñas corporativo y políticas de contraseñas fuertes"
                    }
                ]
            },
            {
                vulnerability: 'concienciación',
                controls: [
                    {
                        title: "Formación en seguridad",
                        description: "Realizar formación periódica en concienciación de seguridad"
                    },
                    {
                        title: "Políticas de correo",
                        description: "Establecer y comunicar políticas claras sobre el uso seguro del correo electrónico"
                    }
                ]
            },
            {
                vulnerability: 'físicos',
                controls: [
                    {
                        title: "Cifrado de dispositivos",
                        description: "Implementar cifrado de disco completo en todos los dispositivos móviles"
                    },
                    {
                        title: "Control de acceso físico",
                        description: "Establecer controles de acceso físico a instalaciones y recursos"
                    }
                ]
            }
        ];

        // Analizar vulnerabilidades
        vulnerabilityPatterns.forEach(pattern => {
            if (pattern.keywords.some(keyword => 
                description.toLowerCase().includes(keyword) || 
                title.toLowerCase().includes(keyword))) {
                vulnerabilities.push({
                    title: pattern.title,
                    description: pattern.description
                });
            }
        });

        // Analizar impactos
        impactPatterns.forEach(pattern => {
            if (pattern.keywords.some(keyword => 
                description.toLowerCase().includes(keyword) || 
                title.toLowerCase().includes(keyword))) {
                impacts.push({
                    title: pattern.title,
                    description: pattern.description
                });
            }
        });

        // Generar controles basados en vulnerabilidades identificadas
        vulnerabilities.forEach(vuln => {
            const matchingControl = controlPatterns.find(pattern => 
                vuln.title.toLowerCase().includes(pattern.vulnerability));
            if (matchingControl) {
                controls.push(...matchingControl.controls);
            }
        });

        // Asegurar que siempre haya al menos un control recomendado
        if (controls.length === 0) {
            controls.push({
                title: "Revisión general de seguridad",
                description: "Realizar una auditoría completa de seguridad para identificar y corregir vulnerabilidades"
            });
        }

        console.log('Resultados del análisis:', { vulnerabilities, impacts, controls });
        return { vulnerabilities, impacts, controls };
    }

    // Función para calcular el nivel de riesgo
    function calculateRiskLevel(vulnerabilities, impacts) {
        let riskScore = 0;
        
        // Ponderación de vulnerabilidades
        const vulnerabilityWeights = {
            'Gestión inadecuada de credenciales': 3,
            'Falta de concienciación en seguridad': 2,
            'Falta de controles físicos': 2,
            'Vulnerabilidades de red': 3,
            'Vulnerabilidades de software': 2
        };

        // Ponderación de impactos
        const impactWeights = {
            'Pérdida de confidencialidad': 3,
            'Compromiso de sistemas': 3,
            'Impacto en privacidad': 2,
            'Impacto financiero': 4,
            'Impacto en reputación': 3
        };

        // Calcular puntuación de vulnerabilidades
        vulnerabilities.forEach(vuln => {
            riskScore += vulnerabilityWeights[vuln.title] || 1;
        });

        // Calcular puntuación de impactos
        impacts.forEach(impact => {
            riskScore += impactWeights[impact.title] || 1;
        });

        // Determinar nivel de riesgo
        if (riskScore >= 8) return { level: 'Alto', color: '#e74c3c' };
        if (riskScore >= 5) return { level: 'Medio', color: '#f39c12' };
        return { level: 'Bajo', color: '#2ecc71' };
    }

    // Función para mostrar el nivel de riesgo
    function displayRiskLevel(riskLevel) {
        const riskDisplay = document.createElement('div');
        riskDisplay.className = 'risk-level';
        riskDisplay.innerHTML = `
            <h4>Nivel de Riesgo: <span style="color: ${riskLevel.color}">${riskLevel.level}</span></h4>
            <div class="risk-bar">
                <div class="risk-fill" style="width: ${riskLevel.level === 'Alto' ? '100%' : riskLevel.level === 'Medio' ? '66%' : '33%'}; background-color: ${riskLevel.color}"></div>
            </div>
        `;
        return riskDisplay;
    }

    // Función para mostrar los resultados del análisis
    function displayAnalysisResults(results) {
        console.log('Mostrando resultados:', results);
        
        const resultSection = document.getElementById('result-section');
        resultSection.innerHTML = ''; // Limpiar resultados anteriores

        // Crear contenedor principal
        const resultContent = document.createElement('div');
        resultContent.className = 'result-content';

        // Calcular y mostrar nivel de riesgo
        const riskLevel = calculateRiskLevel(results.vulnerabilities, results.impacts);
        resultContent.appendChild(displayRiskLevel(riskLevel));

        // Mostrar vulnerabilidades
        const vulnerabilitiesGroup = document.createElement('div');
        vulnerabilitiesGroup.className = 'result-group';
        vulnerabilitiesGroup.innerHTML = '<h4>Vulnerabilidades Identificadas</h4>';
        const vulnerabilitiesList = document.createElement('div');
        vulnerabilitiesList.className = 'result-list';
        vulnerabilitiesList.id = 'vulnerabilities-list';

        if (results.vulnerabilities.length === 0) {
            vulnerabilitiesList.innerHTML = '<p>No se identificaron vulnerabilidades específicas.</p>';
        } else {
            results.vulnerabilities.forEach(vuln => {
                const div = document.createElement('div');
                div.className = 'vulnerability-item';
                div.innerHTML = `
                    <h4>${vuln.title}</h4>
                    <p>${vuln.description}</p>
                `;
                vulnerabilitiesList.appendChild(div);
            });
        }
        vulnerabilitiesGroup.appendChild(vulnerabilitiesList);
        resultContent.appendChild(vulnerabilitiesGroup);

        // Mostrar impactos
        const impactsGroup = document.createElement('div');
        impactsGroup.className = 'result-group';
        impactsGroup.innerHTML = '<h4>Impactos Potenciales</h4>';
        const impactsList = document.createElement('div');
        impactsList.className = 'result-list';
        impactsList.id = 'impacts-list';

        if (results.impacts.length === 0) {
            impactsList.innerHTML = '<p>No se identificaron impactos específicos.</p>';
        } else {
            results.impacts.forEach(impact => {
                const div = document.createElement('div');
                div.className = 'impact-item';
                div.innerHTML = `
                    <h4>${impact.title}</h4>
                    <p>${impact.description}</p>
                `;
                impactsList.appendChild(div);
            });
        }
        impactsGroup.appendChild(impactsList);
        resultContent.appendChild(impactsGroup);

        // Mostrar controles
        const controlsGroup = document.createElement('div');
        controlsGroup.className = 'result-group';
        controlsGroup.innerHTML = '<h4>Controles Recomendados</h4>';
        const controlsList = document.createElement('div');
        controlsList.className = 'result-list';
        controlsList.id = 'controls-list';

        results.controls.forEach(control => {
            const div = document.createElement('div');
            div.className = 'control-item';
            div.innerHTML = `
                <h4>${control.title}</h4>
                <p>${control.description}</p>
            `;
            controlsList.appendChild(div);
        });
        controlsGroup.appendChild(controlsList);
        resultContent.appendChild(controlsGroup);

        // Agregar botón para exportar resultados
        const exportButton = document.createElement('button');
        exportButton.className = 'export-btn';
        exportButton.textContent = 'Exportar Análisis';
        exportButton.onclick = () => exportAnalysis(results, riskLevel);
        resultContent.appendChild(exportButton);

        resultSection.appendChild(resultContent);
        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth' });
    }

    // Función para exportar el análisis
    function exportAnalysis(results, riskLevel) {
        const analysis = {
            fecha: new Date().toLocaleString(),
            nivelRiesgo: riskLevel,
            vulnerabilidades: results.vulnerabilities,
            impactos: results.impacts,
            controles: results.controls
        };

        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analisis-incidente-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Manejador del formulario
    const incidentForm = document.getElementById('analysis-form');
    incidentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulario enviado');
        
        const title = document.getElementById('incident-title').value;
        const description = document.getElementById('incident-description').value;
        
        if (!title || !description) {
            alert('Por favor, complete todos los campos del formulario');
            return;
        }
        
        // Realizar análisis
        const analysisResults = analyzeIncident(title, description);
        
        // Mostrar resultados
        displayAnalysisResults(analysisResults);
    });
}); 