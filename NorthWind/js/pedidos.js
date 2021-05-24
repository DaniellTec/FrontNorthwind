const URL = "http://localhost:8080/E02RestEjemplo/webapi/pedidos";
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
    .then((pedidos) => {
      let tblBody = document.getElementById("id_tblPedidos");
      for (const pedido of pedidos) {
        let fila = document.createElement("tr");
        let elemento = document.createElement("td");
        elemento.innerHTML = pedido.id;
        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = pedido.employeeId;

        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = pedido.customerId;

        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = pedido.orderDate;

        fila.appendChild(elemento);
        elemento = document.createElement("td");
        elemento.innerHTML = pedido.shipperId;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = pedido.shipName;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = pedido.shipAddress;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = pedido.shipZipPostalCode;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML = pedido.paymentType;
        fila.appendChild(elemento);

        elemento = document.createElement("td");
        elemento.innerHTML =
          `<button class="btn btn-link" onclick="editaPedido(${pedido.id})"><i class="bi-pencil"></i></button>` +
          `<button style="color:red;" class="btn btn-link"  onclick="borrarCliente(${pedido.id})"><i class="bi-x-circle"></i></button>`;
        fila.appendChild(elemento);

        tblBody.appendChild(fila);
      }

      // Todo ha ido bien hast aquí, habilito el boton de añadir cliente

      document.getElementById("idAddPedido").addEventListener("click", addPedido);
    })
    .catch((error) => {
      muestraMsg("¡M**rd!", "¡No he podido recuperar el listado de clientes!<br>" + error, false, "error");
    });
}

function editaPedido(idpedido) {
  window.location.href = `editarCliente.html?idpedido=${idpedido}`;
}

function addPedido() {
  window.location.href = "editarCliente.html";
}

function borrarPedido(idpedido) {
  muestraMsg(
    "¡Atención!",
    `¿Estas seguró de querer borrar el cliente ${idpedido}?`,
    true,
    "question",
    "Adelante con los faroles!",
    "Naaa, era broma..."
  );
  document.getElementById("idMdlOK").addEventListener("click", () => {
    
    borrarPedidoAPI(idpedido);
  });
}

function borrarPedidoAPI(idpedido) {
  myModal.hide();
  modalWait.show();
  opciones = {
    method: "DELETE", // Modificamos la BBDD
  };

  fetch(URL + "/" + idpedido, opciones)
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
      muestraMsg(`¡Cliente ${idpedido} Borrado!`, "¡A tomar por saco!", false, "success");
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
