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
            // Actualizar nombre de usuario en el header
            const nombreUsuario = document.getElementById('nombreUsuario');
            if (nombreUsuario) {
                // Extraer nombre del correo si no existe nombre
                const nombre = usuario.nombre || usuario.correo.split('@')[0];
                nombreUsuario.textContent = nombre.charAt(0).toUpperCase() + nombre.slice(1);
            }
            
            // Actualizar mensaje de bienvenida
            const mensajeBienvenida = document.getElementById('mensajeBienvenida');
            if (mensajeBienvenida) {
                const nombre = usuario.nombre || usuario.correo.split('@')[0];
                const nombreFormateado = nombre.charAt(0).toUpperCase() + nombre.slice(1);
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