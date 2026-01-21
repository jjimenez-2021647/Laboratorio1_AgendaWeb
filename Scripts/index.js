//Sistema de Login y Registro

//Elementos del DOM 
const tarjetaVolteadora = document.getElementById('flipCard');
const botonRegistro = document.getElementById('btnRegistro');
const botonLogin = document.getElementById('btnLogin');
const formularioLogin = document.getElementById('formularioLogin');
const formularioRegistro = document.getElementById('formularioRegistro');

//Cambiar entre Login y Registro
botonRegistro.addEventListener('click', function(evento) {
    evento.preventDefault();
    tarjetaVolteadora.style.transform = 'rotateY(180deg)';
});

botonLogin.addEventListener('click', function(evento) {
    evento.preventDefault();
    tarjetaVolteadora.style.transform = 'rotateY(0deg)';
});

//Funcionalidad para las contraseñas

//SVG para mostrar/ocultar contraseña
function crearIconoOjo(campoContrasena) {
    const contenedor = campoContrasena.parentElement;
    
    //botón para el icono
    const botonAlternar = document.createElement('button');
    botonAlternar.type = 'button';
    botonAlternar.className = 'toggle-password';
    
    //SVG del ojo abierto 
    const ojoAbierto = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    `;
    
    //SVG del ojo cerrado
    const ojoCerrado = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
    `;
    
    botonAlternar.innerHTML = ojoAbierto;
    
    //Alternar para mostrar y ocultar contraseña
    botonAlternar.addEventListener('click', () => {
        const tipo = campoContrasena.type === 'password' ? 'text' : 'password';
        campoContrasena.type = tipo;
        
        // Cambiar icono
        if (tipo === 'text') {
            botonAlternar.innerHTML = ojoCerrado;
        } else {
            botonAlternar.innerHTML = ojoAbierto;
        }
    });
    
    contenedor.appendChild(botonAlternar);
}

//iconos a todos los campos de contraseña
document.addEventListener('DOMContentLoaded', function() {
    const camposContrasena = document.querySelectorAll('input[type="password"]');
    camposContrasena.forEach(campo => crearIconoOjo(campo));
    
    //Cargar datos de "Recordarme" si existen
    cargarRecordarme();
    
    //👻 al enlace de "Olvidaste tu contraseña"
    const botonOlvideContrasena = document.querySelector('.olvido-contrasena');
    if (botonOlvideContrasena) {
        botonOlvideContrasena.addEventListener('click', function(evento) {
            evento.preventDefault();
            mostrarModalOlvideContrasena();
        });
    }
});

//👻

function mostrarModalOlvideContrasena() {
    //Crear superposición oscura
    const superposicion = document.createElement('div');
    superposicion.style.cssText = `
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
        animation: aparecerGradual 0.3s ease-out;
    `;
    
    //Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 50px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        width: 90%;
        text-align: center;
        animation: deslizarArriba 0.3s ease-out;
    `;
    
    modal.innerHTML = `
        <div style="font-size: 80px;">👻</div>
        <div style="font-size: 20px;">Que lo siento bro</div>
    `;
    
    superposicion.appendChild(modal);
    document.body.appendChild(superposicion);
    
    //Cerrar modal al hacer clic fuera de él
    superposicion.addEventListener('click', function(evento) {
        if (evento.target === superposicion) {
            superposicion.style.animation = 'desaparecerGradual 0.3s ease-out';
            setTimeout(() => superposicion.remove(), 300);
        }
    });
}

//mensajes a mostrar en js

function mostrarMensaje(mensaje) {
    //Crear superposición oscura
    const superposicion = document.createElement('div');
    superposicion.style.cssText = `
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
        animation: aparecerGradual 0.3s ease-out;
    `;
    
    //Crear modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: deslizarArriba 0.3s ease-out;
    `;
    
    //Contenido del modal
    modal.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 15px;">👻</div>
        <p style="color: #1a3a52; font-size: 16px; margin-bottom: 25px; line-height: 1.5; font-weight: 500;">
            ${mensaje}
        </p>
        <button id="botonAceptarMensaje" style="
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
    
    superposicion.appendChild(modal);
    document.body.appendChild(superposicion);
    
    //Efecto al pasar el cursor sobre el botón
    const botonAceptar = document.getElementById('botonAceptarMensaje');
    botonAceptar.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 6px 15px rgba(9, 154, 161, 0.4)';
    });
    
    botonAceptar.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 10px rgba(9, 154, 161, 0.3)';
    });
    
    //Cerrar modal al hacer clic en el botón
    botonAceptar.addEventListener('click', function() {
        superposicion.style.animation = 'desaparecerGradual 0.3s ease-out';
        setTimeout(() => superposicion.remove(), 300);
    });
    
    //Cerrar modal al hacer clic fuera de él
    superposicion.addEventListener('click', function(evento) {
        if (evento.target === superposicion) {
            superposicion.style.animation = 'desaparecerGradual 0.3s ease-out';
            setTimeout(() => superposicion.remove(), 300);
        }
    });
}

//Agregar estilos de animación
if (!document.querySelector('#estilos-mensaje')) {
    const estilo = document.createElement('style');
    estilo.id = 'estilos-mensaje';
    estilo.textContent = `
        @keyframes aparecerGradual {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
        @keyframes desaparecerGradual {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
            }
        }
        @keyframes deslizarArriba {
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
    document.head.appendChild(estilo);
}

//registro

formularioRegistro.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const correo = document.getElementById('correoRegistro').value.trim();
    const contrasena = document.getElementById('contrasenaRegistro').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    
    //Validaciones
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
    
    //Verificar si el usuario ya existe
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuarioExiste = usuarios.find(usuario => usuario.correo === correo);
    
    if (usuarioExiste) {
        mostrarMensaje('Este correo ya está registrado');
        return;
    }
    
    //Crear nuevo usuario
    const nuevoUsuario = {
        correo: correo,
        contrasena: contrasena,
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    mostrarMensaje('¡Registro exitoso! Ahora puedes iniciar sesión');
    
    //Limpiar formulario
    formularioRegistro.reset();
    
    //Cambiar a vista de login después de 1.5 segundos
    setTimeout(() => {
        tarjetaVolteadora.style.transform = 'rotateY(0deg)';
        //Pre-llenar el correo en el login
        document.getElementById('correo').value = correo;
    }, 1500);
});

//inicio de sesion

formularioLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    const recordar = document.getElementById('recordar').checked;
    
    //Validaciones básicas
    if (!correo || !contrasena) {
        mostrarMensaje('Por favor completa todos los campos');
        return;
    }
    
    //Verificar credenciales
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find(usuario => usuario.correo === correo && usuario.contrasena === contrasena);
    
    if (!usuario) {
        mostrarMensaje('Correo o contraseña incorrectos');
        return;
    }
    
    //Login exitoso
    mostrarMensaje('¡Bienvenido a MyDaily!');
    
    //Guardar sesión actual
    const sesionActual = {
        correo: correo,
        fechaLogin: new Date().toISOString()
    };
    sessionStorage.setItem('sesionActual', JSON.stringify(sesionActual));
    
    //Guardar datos si marcó "Recordarme"
    if (recordar) {
        localStorage.setItem('recordarUsuario', JSON.stringify({
            correo: correo,
            contrasena: contrasena
        }));
    } else {
        localStorage.removeItem('recordarUsuario');
    }
    
    //Redirigir a la página principal
    setTimeout(() => {
        window.location.href = './Index/principal.html';
    }, 1000);
});

//cargar datos del usuario logeado con el recuerdame

function cargarRecordarme() {
    const datosGuardados = JSON.parse(localStorage.getItem('recordarUsuario') || 'null');
    
    if (datosGuardados) {
        document.getElementById('correo').value = datosGuardados.correo;
        document.getElementById('contrasena').value = datosGuardados.contrasena;
        document.getElementById('recordar').checked = true;
    }
}

//Función para cerrar sesión
function cerrarSesion(mantenerRecordarme = true) {
    sessionStorage.removeItem('sesionActual');
    
    if (!mantenerRecordarme) {
        localStorage.removeItem('recordarUsuario');
    }
    
    window.location.href = '../index.html';
}

// Hacer la función disponible globalmente
window.cerrarSesion = cerrarSesion;