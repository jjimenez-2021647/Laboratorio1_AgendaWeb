// Verificar sesión al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    verificarSesion();
    cargarDatosUsuario();
});

// Verificar si hay sesión activa
function verificarSesion() {
    const sesion = sessionStorage.getItem('sesionActual');
    
    if (!sesion) {
        // Si no hay sesión, redirigir al login
        window.location.href = '../index.html';
    }
}

// Cargar datos del usuario
function cargarDatosUsuario() {
    const sesionActual = JSON.parse(sessionStorage.getItem('sesionActual'));
    
    if (sesionActual) {
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.correo === sesionActual.correo);
        
        if (usuario) {
            // Construir nombre completo
            const nombreBase = usuario.nombre || usuario.correo.split('@')[0];
            const apellidoBase = usuario.apellido || '';
            const nombreCompleto = `${nombreBase} ${apellidoBase}`.trim();
            const nombreFormateado =
                nombreCompleto.charAt(0).toUpperCase() + nombreCompleto.slice(1);

            // Actualizar nombre de usuario en el header
            const nombreUsuario = document.getElementById('nombreUsuario');
            if (nombreUsuario) {
                nombreUsuario.textContent = nombreFormateado;
            }
            
            // Actualizar mensaje de bienvenida
            const mensajeBienvenida = document.getElementById('mensajeBienvenida');
            if (mensajeBienvenida) {
                mensajeBienvenida.textContent = `¡Bienvenido de nuevo, ${nombreFormateado}!`;
            }
        }
    }
}

// Función para cerrar sesión
function cerrarSesion(mantenerRecordarme = true) {
    sessionStorage.removeItem('sesionActual');
    
    if (!mantenerRecordarme) {
        localStorage.removeItem('recordarUsuario');
    }
    
    window.location.href = '../index.html';
}
