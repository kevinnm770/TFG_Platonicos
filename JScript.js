// Sistema de tabs
document.querySelectorAll('.custom-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.custom-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        // Aquí agregar lógica para cambiar contenido según tab
    });
});

const navbar = document.getElementById('main-navbar');
const stopSection = document.querySelector('#inicio + section'); // la sección después del hero
// O por ID directo: document.querySelector('#segunda-seccion')

window.addEventListener('scroll', () => {
    const stopPoint = stopSection.offsetTop - navbar.offsetHeight;

    if (window.scrollY >= stopPoint) {
        navbar.classList.add('anchored');
        navbar.style.top = stopPoint + 'px';
    } else {
        navbar.classList.remove('anchored');
        navbar.style.top = '0';
    }
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

    const botonesObra = document.querySelectorAll('button[id^="btn-obra-"]');

    botonesObra.forEach((boton) => {
        const idImagen = boton.getAttribute('data-image-id');
        const imagen = document.getElementById(idImagen);
        const card = boton.closest('.card-3d');
        const stage = card ? card.querySelector('.mv-stage') : null;

        if (!imagen || !stage) {
            return;
        }

        imagen.classList.add('mv-stage-image');
        imagen.style.display = 'block';
        stage.appendChild(imagen);

        boton.addEventListener('click', function() {
            const visible = imagen.classList.toggle('is-visible');
            boton.setAttribute('aria-pressed', visible ? 'true' : 'false');
        });
    });

    document.querySelectorAll('.desc').forEach(element=>{
        const content=element.innerText;
        const short_content=content.slice(0, 150)+" ...";
        element.innerText=short_content;
        element.addEventListener('mouseenter',function(){
            element.innerText=content;
            element.style.paddingBottom="50px";
        });
        element.addEventListener('mouseleave',function(){
            element.innerText=short_content;
            element.style.paddingBottom="0";
        });
    });
});

function resetPolypad(numFrame) {
    const iframe = document.getElementById('polypadFrame'+numFrame);
    iframe.src = iframe.src; // Recarga el iframe
}

function changeModel(btn,fig_str){
    const btns=[btn.parentNode.parentNode.children[0].children[0],
                btn.parentNode.parentNode.children[1].children[0],
                btn.parentNode.parentNode.children[2].children[0]];

    if(!btn.className.includes('btn_active')){
        btns[0].className="btn_model";
        btns[1].className="btn_model";
        btns[2].className="btn_model";
        
        btn.className="btn_model btn_active";

        if(btn.getAttribute('data-modelMode')=='solid'){
            document.getElementById('model_wireframe_'+fig_str).style.display="none";
            document.getElementById('model_dual_'+fig_str).style.display="none";
            document.getElementById('model_solid_'+fig_str).style.display="";
        }else if(btn.getAttribute('data-modelMode')=='wireframe'){
            document.getElementById('model_solid_'+fig_str).style.display="none";
            document.getElementById('model_dual_'+fig_str).style.display="none";
            document.getElementById('model_wireframe_'+fig_str).style.display="";
        }else if(btn.getAttribute('data-modelMode')=='dual'){
            document.getElementById('model_solid_'+fig_str).style.display="none";
            document.getElementById('model_wireframe_'+fig_str).style.display="none";
            document.getElementById('model_dual_'+fig_str).style.display="";
        }
    }
}