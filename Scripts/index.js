// Sistema de Login y Registro - MyDaily

// Elementos del DOM
const flipCard = document.getElementById('flipCard');
const btnRegistro = document.getElementById('btnRegistro');
const btnLogin = document.getElementById('btnLogin');
const formularioLogin = document.getElementById('formularioLogin');
const formularioRegistro = document.getElementById('formularioRegistro');

// Cambiar entre Login y Registro
btnRegistro.addEventListener('click', function(e) {
    e.preventDefault();
    flipCard.style.transform = 'rotateY(180deg)';
});

btnLogin.addEventListener('click', function(e) {
    e.preventDefault();
    flipCard.style.transform = 'rotateY(0deg)';
});

// FUNCIONALIDAD DE VER/OCULTAR CONTRASEÑAS

// Crear iconos SVG para mostrar/ocultar contraseña
function crearIconoOjo(inputPassword) {
    const contenedor = inputPassword.parentElement;
    
    // Crear botón para el icono
    const btnToggle = document.createElement('button');
    btnToggle.type = 'button';
    btnToggle.className = 'toggle-password';
    
    // SVG del ojo abierto (contraseña oculta)
    const ojoAbierto = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    `;
    
    // SVG del ojo cerrado (contraseña visible)
    const ojoCerrado = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    `;
    
    btnToggle.innerHTML = ojoAbierto;
    
    // Toggle para mostrar/ocultar contraseña
    btnToggle.addEventListener('click', () => {
        const tipo = inputPassword.type === 'password' ? 'text' : 'password';
        inputPassword.type = tipo;
        
        // Cambiar icono
        if (tipo === 'text') {
            btnToggle.innerHTML = ojoCerrado;
        } else {
            btnToggle.innerHTML = ojoAbierto;
        }
    });
    
    contenedor.appendChild(btnToggle);
}

// Agregar iconos a todos los campos de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const camposPassword = document.querySelectorAll('input[type="password"]');
    camposPassword.forEach(input => crearIconoOjo(input));
    
    // Cargar datos de "Recordarme" si existen
    cargarRecordarme();
});

// FUNCIÓN PARA MOSTRAR MENSAJES CON MODAL

function mostrarMensaje(mensaje) {
    // Crear overlay oscuro
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease-out;
    `;
    
    // Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: slideUp 0.3s ease-out;
    `;
    
    // Contenido del modal
    modal.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 15px;">👻</div>
        <p style="color: #1a3a52; font-size: 16px; margin-bottom: 25px; line-height: 1.5; font-weight: 500;">
            ${mensaje}
        </p>
        <button id="btnAceptarMensaje" style="
            background: #099aa1;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 10px rgba(9, 154, 161, 0.3);
        ">
            Aceptar
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Efecto hover en el botón
    const btnAceptar = document.getElementById('btnAceptarMensaje');
    btnAceptar.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });
    
    btnAceptar.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });
    
    // Cerrar modal al hacer clic en el botón
    btnAceptar.addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    });
    
    // Cerrar modal al hacer clic fuera de él
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => overlay.remove(), 300);
        }
    });
}

// Agregar estilos de animación
if (!document.querySelector('#mensaje-styles')) {
    const style = document.createElement('style');
    style.id = 'mensaje-styles';
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// REGISTRO DE USUARIO

formularioRegistro.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = document.getElementById('correoRegistro').value.trim();
    const contrasena = document.getElementById('contrasenaRegistro').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    
    // Validaciones
    if (!correo || !contrasena || !confirmarContrasena) {
        mostrarMensaje('Por favor completa todos los campos');
        return;
    }
    
    if (contrasena !== confirmarContrasena) {
        mostrarMensaje('Las contraseñas no coinciden');
        return;
    }
    
    if (contrasena.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Verificar si el usuario ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExiste = usuarios.find(u => u.correo === correo);
    
    if (usuarioExiste) {
        mostrarMensaje('Este correo ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        correo: correo,
        contrasena: contrasena,
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    mostrarMensaje('¡Registro exitoso! Ahora puedes iniciar sesión');
    
    // Limpiar formulario
    formularioRegistro.reset();
    
    // Cambiar a vista de login después de 1.5 segundos
    setTimeout(() => {
        flipCard.style.transform = 'rotateY(0deg)';
        // Pre-llenar el correo en el login
        document.getElementById('correo').value = correo;
    }, 1500);
});

// INICIO DE SESIÓN

formularioLogin.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const recordar = document.getElementById('recordar').checked;
    
    // Validaciones básicas
    if (!correo || !contrasena) {
        mostrarMensaje('Por favor completa todos los campos');
        return;
    }
    
    // Verificar credenciales
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(u => u.correo === correo && u.contrasena === contrasena);
    
    if (!usuario) {
        mostrarMensaje('Correo o contraseña incorrectos');
        return;
    }
    
    // Login exitoso
    mostrarMensaje('¡Bienvenido a MyDaily!');
    
    // Guardar sesión actual
    const sesionActual = {
        correo: correo,
        fechaLogin: new Date().toISOString()
    };
    sessionStorage.setItem('sesionActual', JSON.stringify(sesionActual));
    
    // Guardar datos si marcó "Recordarme"
    if (recordar) {
        localStorage.setItem('recordarUsuario', JSON.stringify({
            correo: correo,
            contrasena: contrasena
        }));
    } else {
        localStorage.removeItem('recordarUsuario');
    }
    
    // Redirigir a la página principal
    setTimeout(() => {
        window.location.href = './Index/principal.html';
    }, 1000);
});

// CARGAR DATOS DE "RECORDARME"

function cargarRecordarme() {
    const datosGuardados = JSON.parse(localStorage.getItem('recordarUsuario') || 'null');
    
    if (datosGuardados) {
        document.getElementById('correo').value = datosGuardados.correo;
        document.getElementById('contrasena').value = datosGuardados.contrasena;
        document.getElementById('recordar').checked = true;
    }
}

// Función para cerrar sesión (puedes usarla en Principal.html)
function cerrarSesion(mantenerRecordarme = true) {
    sessionStorage.removeItem('sesionActual');
    
    if (!mantenerRecordarme) {
        localStorage.removeItem('recordarUsuario');
    }
    
    window.location.href = '../index.html';
}

// Hacer la función disponible globalmente
window.cerrarSesion = cerrarSesion;