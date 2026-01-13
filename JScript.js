// Sistema de tabs
document.querySelectorAll('.custom-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.custom-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // Aquí agregar lógica para cambiar contenido según tab
    });
});

document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener elementos
    const navLinks = document.querySelectorAll('#navContenido a[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    const liElements = document.querySelectorAll('.ul_Secciones > li');
    
    function detectarClicks(elemento, onClickInside, onClickOutside) {
        // Obtener el elemento si es un selector
        const el = typeof elemento === 'string' ? document.querySelector(elemento) : elemento;
        
        if (!el) {
            console.error('Elemento no encontrado');
            return;
        }
        
        // Agregar listener al documento
        document.addEventListener('click', function(event) {
            // Verificar si el click fue dentro del elemento
            if (el.contains(event.target)) {
                // Click DENTRO del elemento
                if (onClickInside) {
                    onClickInside(event);
                }
            } else {
                // Click FUERA del elemento
                if (onClickOutside) {
                    onClickOutside(event);
                }
            }
        });
    }

    // ===== NAVEGACIÓN AL HACER CLICK =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll suave hacia la sección
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                updateActiveSection(targetId.substring(1));
            }
        });
    });
    
    // ===== ACTUALIZAR SECCIÓN ACTIVA AL HACER SCROLL =====
    function updateActiveSection(activeId = null) {
        let current = activeId;
        
        // Si no se proporciona ID, detectar la sección visible
        if (!current) {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= (sectionTop - 150)) {
                    current = section.getAttribute('id');
                }
            });
        }
        
        // Buscar el marcador existente y la sección activa
        const marcadorActual = document.querySelector('.marcador');
        const seccionActivaActual = document.querySelector('.SeccionActiva');
        
        // Buscar el nuevo li que debe estar activo
        let nuevoLiActivo = null;
        
        liElements.forEach(li => {
            // Verificar link principal
            const link = li.querySelector('a[href^="#"]');
            if (link) {
                const href = link.getAttribute('href').substring(1);
                
                if (href === current) {
                    nuevoLiActivo = li;
                }
            }
            
            // También verificar subsecciones
            const subLinks = li.querySelectorAll('.ul_Subsecciones a[href^="#"]');
            subLinks.forEach(subLink => {
                const subHref = subLink.getAttribute('href').substring(1);
                if (subHref === current) {
                    nuevoLiActivo = subLink;
                }
            });
        });
        
        // Si hay un nuevo li activo y es diferente al actual
        if (nuevoLiActivo && nuevoLiActivo !== seccionActivaActual) {
            // Remover clase activa del li anterior
            if (seccionActivaActual) {
                seccionActivaActual.classList.remove('SeccionActiva');
            }
            
            // Remover marcador del li anterior
            if (marcadorActual) {
                marcadorActual.remove();
            }
            
            // Agregar clase activa al nuevo li
            nuevoLiActivo.classList.add('SeccionActiva');
            
            // Crear y agregar nuevo marcador al nuevo li
            const nuevoMarcador = document.createElement('span');
            nuevoMarcador.className = 'marcador';
            nuevoLiActivo.appendChild(nuevoMarcador);
        }
    }
    
    // ===== DETECTAR SCROLL =====
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        // Optimizar con debounce
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveSection();
        }, 50);
    });
    
    // ===== INICIALIZAR AL CARGAR =====
    updateActiveSection();

    const navContenido = document.getElementById('navContenido');
    detectarClicks(
        navContenido,
        function(event) {
            navContenido.className="navVisible";
        },
        function(event) {
            navContenido.className="navOculto";
        }
    );
});