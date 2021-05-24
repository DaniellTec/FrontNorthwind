const URL = "http://localhost:8080/E02RestEjemplo/webapi/detallespedidos";
const myModal = new bootstrap.Modal(document.getElementById("idModal")); // Para los mensajes de error y avisos
const modalWait = new bootstrap.Modal(document.getElementById("idModalWait")); // Para los mensajes de error y avisos

window.onload = init;

function init() {
  const peticionHTTP = fetch(URL);

  peticionHTTP
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else throw new Error("Return not ok");
    })
    .then((detallespedidos) => {
      let tblBody = document.getElementById("id_tblDetallesPedido");
      for (const detallespedido of detallespedidos) {
        let fila = document.createElement("tr");
        let elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.id;
        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.orderId;

        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.productId;

        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.quantity;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.unitPrice;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.statusId;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = detallespedido.inventoryId;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML =
          `<button class="btn btn-link" onclick="editaPedido(${detallespedido.id})"><i class="bi-pencil"></i></button>` +
          `<button style="color:red;" class="btn btn-link"  onclick="borrarPedido(${detallespedido.id})"><i class="bi-x-circle"></i></button>`;
        fila.appendChild(elemento);

        tblBody.appendChild(fila);
      }

      // Todo ha ido bien hast aquí, habilito el boton de añadir cliente

      document.getElementById("idAddDetallesPedido").addEventListener("click", addDetallesPedido);
    })
    .catch((error) => {
      muestraMsg("¡M**rd!", "¡No he podido recuperar el listado de clientes!<br>" + error, false, "error");
    });
}

function editaDetallesPedido(iddetallespedido) {
  window.location.href = `editarCliente.html?iddetallespedido=${iddetallespedido}`;
}

function addDetallesPedido() {
  window.location.href = "editarCliente.html";
}

function borrarDetallesPedido(iddetallespedido) {
  muestraMsg(
    "¡Atención!",
    `¿Estas seguró de querer borrar el cliente ${iddetallespedido}?`,
    true,
    "Naaa, era broma..."
  );
  document.getElementById("idMdlOK").addEventListener("click", () => {
    
    borrarPedidoAPI(iddetallespedido);
  });
}

function borrarPedidoAPI(iddetallespedido) {
  myModal.hide();
  modalWait.show();
  opciones = {
    method: "DELETE", // Modificamos la BBDD
  };

  fetch(URL + "/" + iddetallespedido, opciones)
    .then((respuesta) => {
      if (respuesta.ok) {
        return respuesta.json();
      } else 
      {
        throw new Error(`Fallo al borrar, el servidor responde con ${respuesta.status}-${respuesta.statusText}`);
      }
        
    })
    .then((respuesta) => {
      modalWait.hide();
      muestraMsg(`¡Cliente ${iddetallespedido} Borrado!`, "¡A tomar por saco!", false, "success");
      document.getElementById('idMdlClose').addEventListener("click", () => {
        location.reload();
        document.getElementById('idMdlClose').removeEventListener("click");
      })
      
    })
    .catch((error) => {
      modalWait.hide();
      muestraMsg(
        "Cliente NO borrado",
        "¿Es posible que este cliente tenga algún pedido? 🤔<br>" + error,
        false,
        "error"
      );
    });
}

/**
 * Muestra un mensaje en el modal
 */
function muestraMsg(titulo, mensaje, okButton, tipoMsg, okMsg = "OK", closeMsg = "Close") {
  document.getElementById("idMdlOK").innerHTML = okMsg;
  document.getElementById("idMdlClose").innerHTML = closeMsg;

  myModal.hide();
  switch (tipoMsg) {
    case "error":
      {
        titulo = "<i style='color:red ' class='bi bi-exclamation-octagon-fill'></i> " + titulo;
      }
      break;
    case "question":
      {
        titulo = "<i style='color:blue' class='bi bi-question-circle-fill'></i> " + titulo;
      }
      break;
    default:
      {
        titulo = "<i style='color:green' class='bi bi-check-circle-fill'></i> " + titulo;
      }
      break;
  }
  document.getElementById("idMdlTitle").innerHTML = titulo;
  document.getElementById("idMdlMsg").innerHTML = mensaje;
  document.getElementById("idMdlOK").style.display = okButton ? "block" : "none";

  myModal.show();
}
