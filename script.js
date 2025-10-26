// Mostrar un mensaje de bienvenida
alert("Bienvenido a la Tienda de Gonzalo 🦇");

document.addEventListener("DOMContentLoaded", function () {
  const titulo = document.querySelector("header h1");
  titulo.style.color = "#ffccff";

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const historialGuardado = JSON.parse(localStorage.getItem("historial")) || [];

  const botones = document.querySelectorAll(".agregar-carrito");
  const contador = document.getElementById("contador");
  const listaCarrito = document.getElementById("lista-carrito");
  const botonVaciar = document.getElementById("vaciar-carrito");
  const botonFinalizar = document.getElementById("finalizar-compra");
  const totalTexto = document.getElementById("total");
  const formulario = document.getElementById("form-compra");
  const listaHistorial = document.getElementById("lista-historial");

  // Mostrar historial guardado al cargar
  historialGuardado.forEach(compra => {
    const item = document.createElement("li");
    item.textContent = compra;
    listaHistorial.appendChild(item);
  });

  // Actualizar el total del carrito
  function actualizarTotal() {
    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    totalTexto.textContent = `Total: $${total}`;
  }

  // Mostrar producto en la lista del carrito
  function agregarProductoAlDOM(producto) {
    const item = document.createElement("li");
    item.textContent = `${producto.nombre} - $${producto.precio}`;

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "❌";
    botonEliminar.style.marginLeft = "10px";
    botonEliminar.addEventListener("click", () => {
      const index = carrito.findIndex(p => p.nombre === producto.nombre && p.precio === producto.precio);
      if (index !== -1) {
        carrito.splice(index, 1);
        localStorage.setItem("carrito", JSON.stringify(carrito));
      }
      listaCarrito.removeChild(item);
      contador.textContent = carrito.length;
      actualizarTotal();
    });

    item.appendChild(botonEliminar);
    listaCarrito.appendChild(item);
  }

  // Mostrar productos guardados al cargar
  carrito.forEach(producto => agregarProductoAlDOM(producto));
  contador.textContent = carrito.length;
  actualizarTotal();

  // Agregar productos al carrito
  botones.forEach(boton => {
    boton.addEventListener("click", () => {
      const producto = boton.parentElement.querySelector("h3").textContent;
      const precio = parseInt(boton.parentElement.querySelector(".precio").dataset.precio);
      const nuevoProducto = { nombre: producto, precio: precio };

      carrito.push(nuevoProducto);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      contador.textContent = carrito.length;
      agregarProductoAlDOM(nuevoProducto);
      actualizarTotal();
    });
  });

  // Vaciar carrito
  botonVaciar.addEventListener("click", () => {
    carrito = [];
    localStorage.removeItem("carrito");
    contador.textContent = 0;
    listaCarrito.innerHTML = "";
    actualizarTotal();
  });

  // Finalizar compra (resumen)
  botonFinalizar.addEventListener("click", () => {
    if (carrito.length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de finalizar la compra.");
      return;
    }

    let resumen = "Resumen de tu compra:\n\n";
    carrito.forEach((producto, index) => {
      resumen += `${index + 1}. ${producto.nombre} - $${producto.precio}\n`;
    });

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    resumen += `\nTotal a pagar: $${total}`;
    alert(resumen);
  });

  // Procesar formulario de pago y guardar historial
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    // Eliminar errores anteriores
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    document.querySelectorAll(".error-message").forEach(el => el.remove());

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const metodo = document.getElementById("metodo").value;

    let valid = true;

    function marcarError(id, mensaje) {
      const campo = document.getElementById(id);
      campo.classList.add("error");

      const msg = document.createElement("div");
      msg.className = "error-message";
      msg.textContent = mensaje;
      campo.parentElement.insertBefore(msg, campo.nextSibling);
      valid = false;
    }

    if (!nombre) marcarError("nombre", "El nombre es obligatorio.");
    if (!email) marcarError("email", "El correo es obligatorio.");
    if (!metodo) marcarError("metodo", "Seleccioná un método de pago.");

    if (!valid) return;

    if (carrito.length === 0) {
      alert("Tu carrito está vacío. Agrega productos antes de confirmar la compra.");
      return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    alert(`¡Gracias por tu compra, ${nombre}!\n\nSe enviará un resumen a: ${email}\nMétodo de pago: ${metodo}\nTotal a pagar: $${total}`);

    // Crear resumen para historial
    const resumenCompra = `${nombre} - ${carrito.length} productos - $${total} - ${metodo}`;
    historialGuardado.push(resumenCompra);
    localStorage.setItem("historial", JSON.stringify(historialGuardado));

    const itemHistorial = document.createElement("li");
    itemHistorial.textContent = resumenCompra;
    listaHistorial.appendChild(itemHistorial);

    // Limpiar todo
    carrito = [];
    localStorage.removeItem("carrito");
    contador.textContent = 0;
    listaCarrito.innerHTML = "";
    actualizarTotal();
    formulario.reset();
  });
});
     