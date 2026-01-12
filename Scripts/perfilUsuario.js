// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    cargarDatosUsuario();
    configurarFormulario();
    
    // Agregar iconos de ojo a campos de contraseña
    const camposPassword = document.querySelectorAll('input[type="password"]');
    camposPassword.forEach(input => crearIconoOjo(input));
});

// Verificar si hay sesión activa
function verificarSesion() {
    const sesion = sessionStorage.getItem('sesionActual');
    
    if (!sesion) {
        // Si no hay sesión, redirigir al login
        window.location.href = '../index.html';
    }
}

// Cargar datos del usuario en el formulario
function cargarDatosUsuario() {
    const sesionActual = JSON.parse(sessionStorage.getItem('sesionActual'));
    
    if (sesionActual) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.correo === sesionActual.correo);
        
        if (usuario) {
            // Actualizar nombre de usuario en el header
            const nombreUsuario = document.getElementById('nombreUsuario');
            if (nombreUsuario) {
                const nombre = usuario.nombre || usuario.correo.split('@')[0];
                nombreUsuario.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            }
            
            // CARGAR DATOS EN EL FORMULARIO
            document.getElementById('nombreContacto').value = usuario.nombre || '';
            document.getElementById('apellidoContacto').value = usuario.apellido || '';
            document.getElementById('telefonoContacto').value = usuario.telefono || '';
            document.getElementById('correoContacto').value = usuario.correo || '';
            document.getElementById('passwordContacto').value = usuario.contrasena || '';
            document.getElementById('direccionContacto').value = usuario.direccion || '';
            document.getElementById('fechaRegistro').value = usuario.fechaRegistro ? usuario.fechaRegistro.split('T')[0] : '';
            
            // Cargar imagen: si existe usa la del usuario, si no usa la por defecto
            const imagenPerfil = document.getElementById('preview-imagen');
            if (usuario.imagen && usuario.imagen !== '../Images/Perfil.jpg') {
                imagenPerfil.src = usuario.imagen;
            } else {
                imagenPerfil.src = '../Images/Perfil.jpg';
            }
        }
    }
}

// Configurar el formulario para actualizar datos
function configurarFormulario() {
    const formulario = document.getElementById('formContacto');
    const btnCrear = document.getElementById('btnCrear');
    
    // Cambiar texto del botón a "Actualizar Perfil"
    btnCrear.querySelector('.bnt_texto').textContent = 'Actualizar Perfil';
    btnCrear.querySelector('.btn_icono i').className = 'fa-solid fa-user-pen';
    
    // Manejar envío del formulario
    formulario.addEventListener('submit', function(e) {
        e.preventDefault();
        actualizarPerfil();
    });
    
    // Manejar cambio de imagen
    const inputImagen = document.getElementById('imagenContacto');
    inputImagen.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validar tamaño de archivo (máximo 2MB)
            if (file.size > 2 * 1024 * 1024) {
                mostrarMensaje('La imagen no puede superar los 2MB');
                return;
            }
            
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                mostrarMensaje('Por favor selecciona un archivo de imagen válido');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(event) {
                document.getElementById('preview-imagen').src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
}

// Actualizar perfil del usuario
function actualizarPerfil() {
    const sesionActual = JSON.parse(sessionStorage.getItem('sesionActual'));
    
    if (!sesionActual) {
        mostrarMensaje('Error: No hay sesión activa');
        return;
    }
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombreContacto').value.trim();
    const apellido = document.getElementById('apellidoContacto').value.trim();
    const telefono = document.getElementById('telefonoContacto').value.trim();
    const correo = document.getElementById('correoContacto').value.trim();
    const nuevaContrasena = document.getElementById('passwordContacto').value;
    const direccion = document.getElementById('direccionContacto').value.trim();
    const fechaRegistro = document.getElementById('fechaRegistro').value;
    const imagen = document.getElementById('preview-imagen').src;
    
    // Validaciones
    if (!nombre || !apellido || !correo || !nuevaContrasena) {
        mostrarMensaje('Por favor completa todos los campos obligatorios');
        return;
    }
    
    if (nuevaContrasena.length < 6) {
        mostrarMensaje('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const indiceUsuario = usuarios.findIndex(u => u.correo === sesionActual.correo);
    
    if (indiceUsuario === -1) {
        mostrarMensaje('Error: Usuario no encontrado');
        return;
    }
    
    // Verificar si el nuevo correo ya existe (si se cambió)
    if (correo !== sesionActual.correo) {
        const correoExiste = usuarios.some((u, index) => u.correo === correo && index !== indiceUsuario);
        if (correoExiste) {
            mostrarMensaje('Este correo ya está registrado por otro usuario');
            return;
        }
    }
    
    // Actualizar datos del usuario
    usuarios[indiceUsuario] = {
        ...usuarios[indiceUsuario],
        nombre: nombre,
        apellido: apellido,
        telefono: telefono,
        correo: correo,
        contrasena: nuevaContrasena,
        direccion: direccion,
        fechaRegistro: fechaRegistro,
        imagen: imagen,
        fechaActualizacion: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    // Actualizar sesión si cambió el correo
    if (correo !== sesionActual.correo) {
        sessionStorage.setItem('sesionActual', JSON.stringify({
            correo: correo,
            fechaLogin: sesionActual.fechaLogin
        }));
    }
    
    // Actualizar "Recordarme" si existe
    const recordarUsuario = JSON.parse(localStorage.getItem('recordarUsuario') || 'null');
    if (recordarUsuario && recordarUsuario.correo === sesionActual.correo) {
        localStorage.setItem('recordarUsuario', JSON.stringify({
            correo: correo,
            contrasena: nuevaContrasena
        }));
    }
    
    mostrarMensaje('Perfil actualizado exitosamente');
    
    // Actualizar el nombre en el header
    const nombreUsuario = document.getElementById('nombreUsuario');
    if (nombreUsuario) {
        nombreUsuario.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
    }
}

// FUNCIONALIDAD DE VER/OCULTAR CONTRASEÑAS
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
    
    // Contenido del modal - SIEMPRE CON FANTASMA 👻
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
    
    // Cerrar modal
    btnAceptar.addEventListener('click', function() {
        overlay.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => overlay.remove(), 300);
    });
    
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
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
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

// Función para cerrar sesión
function cerrarSesion(mantenerRecordarme = true) {
    sessionStorage.removeItem('sesionActual');
    
    if (!mantenerRecordarme) {
        localStorage.removeItem('recordarUsuario');
    }
    
    window.location.href = '../index.html';
}