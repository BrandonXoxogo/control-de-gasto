//variables
var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];
var tGastos=0;
var disponible=0;
var divPresupuesto = document.querySelector('#divpresupuesto');
var presupuesto = document.querySelector('#presupuesto');
var btnPresupuesto = document.querySelector('#btnPresupuesto');
var divGastos = document.querySelector('#divgastos');
var progress = document.querySelector("#progress");


const inicio = () => {
    tPresupuesto=parseInt(localStorage.getItem("presupuesto"))
    if (tPresupuesto > 0) {
        divPresupuesto.classList.remove("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.add("d-none");
        divGastos.classList.add("d-block");
        mostrarGastos();
    } else {
        divPresupuesto.classList.remove("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.add("d-block");
        divGastos.classList.add("d-none");
        presupuesto.value=0;
    }
}


//evento cunado precionas enter y aparece la informacion oculta
const input=document.getElementById('presupuesto');
const button=document.getElementById('btnPresupuesto');


function handleEvent() {
    const inputValue = input.value;

    tPresupuesto = parseInt(presupuesto.value);
    localStorage.setItem('presupuesto', tPresupuesto);
    if (tPresupuesto == 0) {
        Swal.fire({ icon: "error", title: "ERROR", text: "Presupuesto mayor a 0" });
        return;
    }
    divPresupuesto.classList.remove("d-block");
    divGastos.classList.remove("d-none");
    divPresupuesto.classList.add("d-none");
    divGastos.classList.add("d-block");
    mostrarGastos();
   
}


input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleEvent();
    }
});

button.addEventListener('click', handleEvent);    





//guarda cosas de la ventana modal nuevo gasto

const guardarGasto = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.getElementById("descripcion").value;
    let categoria = document.getElementById("categoria2").value;
    let costo = parseInt(document.getElementById("costo").value);
    if(descripcion.trim()==""||document.getElementById("costo").value.trim()===""||costo==0){
        Swal.fire({icon: "error",title: "ERROR", text:"Datos incorrectos"});
        return;
    }

    if(costo>disponible){
        Swal.fire({icon: "error",title: "ERROR", text:"Ya no tienes fondos"});
        return;
    }

    const gasto = { descripcion, costo, categoria }
  gastos.push(gasto);
  localStorage.setItem("gastos",JSON.stringify(gastos));
  bootstrap.Modal.getInstance(document.getElementById("nuevogasto")).hide();
    mostrarGastos();
    limpiarFormulario();
}


//filta los datos guadados por la ventana modal

const mostrarGastos = () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let gastosHTML = ``;
    if(gastos.length==0){
        gastosHTML+=`<b>No hay Gastos</b>`
    }
    index=0;
    tGastos=0;
    gastos.map(gasto=> {
        gastosHTML += `
           <div class="card text-center w-100 m-auto mt-3 shadow p-2">
           <div class="row">
           <div class="col"> 
           <img src="img/${gasto.categoria}.jpg" class="imgCategoria"> 
           </div>
           <div class="col text-start"> 
           <p><b>Descripcion</b> <small>${gasto.descripcion}</small> </p>
           <p><b>Costo</b> <small>${parseInt(gasto.costo).toFixed(2)}</small> </p>
           </div>
           <div class="col">
              <button type="button" class="btn btn-outline-warning" onclick="cargarGasto(${index})" data-bs-toggle="modal" data-bs-target="#editargasto" onclick="cargarGastoEditar(${index})">
                  <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger" onclick="eliminarGasto(${index})"><i class="bi bi-trash"></i></button>
           </div>
           </div>
           </div>
        `;
        tGastos+=parseInt(gasto.costo);
        
        index++;
    });
    document.getElementById('listagastos').innerHTML = gastosHTML;
    pintarDatos()
}

//actualiza la barra de progreso cada vez que gastas o aumentas el saldo disponible que tienes

const pintarDatos=()=>{
  
let totalPresupuesto = document.querySelector("#totalpresupuesto");
let totalDisponible=document.querySelector("#totaldisponible");
let totalGastos=document.querySelector("#totalgastos");
var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));

disponible=tPresupuesto-tGastos;
let porcentaje=100-((tGastos/tPresupuesto)*100);
progress.innerHTML=`<circle-progress value="${porcentaje}" min="0"  max="100" text-format="percent" ></circle-progress>`
totalGastos.innerHTML=`$ ${tGastos.toFixed(2)}`;
totalPresupuesto.innerHTML=`$ ${tPresupuesto.toFixed(2)}`
totalDisponible.innerHTML=`$ ${disponible.toFixed(2)}`;

}

//limpia los datos ingresados de la ventana modal

const limpiarFormulario = () => {
    document.getElementById("descripcion").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("categoria2").value = "comida";
    document.getElementById("edescripcion").value = "";
    document.getElementById("ecosto").value = "";
    document.getElementById("editarcategoria").value = "comida";
}


//limpia el localstorage del dinero guardado y oculta todo lo anterior
const reset = () => {
    localStorage.clear();
    gastos = [];
    mostrarGastos();
    divPresupuesto.classList.remove("d-none");
    divGastos.classList.add("d-none");
    presupuesto.value='';
}

//edita las cosas guardadas de la ventana modal

const editar=()=>{
    gastos=JSON.parse(localStorage.getItem("gastos"))||[];

    let descripcion=document.getElementById("edescripcion").value;
    let costo=parseInt(document.getElementById("ecosto").value);
    let categoria=document.getElementById("editarcategoria").value;
    let index=parseInt(document.getElementById("eindex").value);
    
    if(descripcion.trim()==""||costo==0){
        Swal.fire({icon:"error",title:"ERROR",text:"Datos incorrectos"});
        return;
    }
    let costoAnterior=parseInt(gastos[index].costo);
    if(costo>(costoAnterior+disponible)){
        Swal.fire({icon: "error",title: "ERROR", text:"Ya no tienes fondos"});
        return;
    }
    gastos[index].descripcion=descripcion;
    gastos[index].costo=costo;
    gastos[index].categoria=categoria;
    localStorage.setItem("gastos",JSON.stringify(gastos));
    bootstrap.Modal.getInstance(document.getElementById("editargasto")).hide();
    mostrarGastos()

}

//carga la informacion previamente modificada
const cargarGasto=(index)=>{
    var gasto=gastos[index];
    document.getElementById("edescripcion").value=gasto.descripcion
    document.getElementById("ecosto").value=gasto.costo
    document.getElementById("editarcategoria").value=gasto.categoria
    document.getElementById("eindex").value=index
    
}

//elimina el los datos guadados de la ventana modal

const eliminarGasto=(index)=>{
    Swal.fire({
        title:"Estas seguro de eliminar?",
        showDenyButton:true,
        showCancelButton: false,
        confirmButtonText:"SI",
        denyButtonText: `NO`,
        cancelButtonColor: "#dc3545",
        confirmButtonColor:"#198754",
        denyButtonColor:"#dc3545",
    }).then((result)=>{
        if(result.isConfirmed){
            Swal.fire("Eliminado","","succes");
            gastos.splice(index,1)
            localStorage.setItem("gastos",JSON.stringify(gastos));
            mostrarGastos();
        }
    });
}


//filtrar gastos por categoria

document.getElementById('categoria1').addEventListener('change', function() {
    const selectedValue = this.value;
    const gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    let gastosHTML = ``;
    if (gastos.length == 0) {
        document.getElementById('listagastos').innerHTML = `<b>No hay Gastos</b>`;
        return;
    }

    let gastosFiltrados = gastos.filter(gasto => selectedValue === 'todo' || gasto.categoria === selectedValue);
    let tGastos = 0;
    let index = 0;

    if (gastosFiltrados.length === 0) {
        document.getElementById('listagastos').innerHTML = `<b>No hay gastos en la categoría seleccionada</b>`;
        let totalGastos = document.querySelector("#totalgastos");
        progress.innerHTML = `<circle-progress value="100" min="0" max="100" text-format="percent"></circle-progress>`;
        totalGastos.innerHTML = `$ 0.00`;

    } else {
        gastosFiltrados.forEach(function(gasto) {
            gastosHTML += `
                <div class="card text-center w-100 m-auto mt-3 shadow p-2">
                    <div class="row">
                        <div class="col"> 
                            <img src="img/${gasto.categoria}.jpg" class="imgCategoria"> 
                        </div>
                        <div class="col text-start"> 
                            <p><b>Descripcion</b> <small>${gasto.descripcion}</small> </p>
                            <p><b>Costo</b> <small>${parseInt(gasto.costo).toFixed(2)}</small> </p>
                        </div>
                        <div class="col">
                            <button type="button" class="btn btn-outline-warning" onclick="cargarGasto(${index})" data-bs-toggle="modal" data-bs-target="#editargasto" onclick="cargarGastoEditar(${index})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="eliminarGasto(${index})"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;

            tGastos += parseInt(gasto.costo);
            index++;
        });

        let totalPresupuesto = document.querySelector("#totalpresupuesto");
        let totalDisponible = document.querySelector("#totaldisponible");
        let totalGastos = document.querySelector("#totalgastos");
        var tPresupuesto = parseInt(localStorage.getItem("presupuesto"));

        disponible = tPresupuesto - tGastos;
        let porcentaje = 100 - ((tGastos / tPresupuesto) * 100);
        progress.innerHTML = `<circle-progress value="${porcentaje}" min="0" max="100" text-format="percent"></circle-progress>`;
        totalGastos.innerHTML = `$ ${tGastos.toFixed(2)}`;
        totalPresupuesto.innerHTML = `$ ${tPresupuesto.toFixed(2)}`;
        totalDisponible.innerHTML = `$ ${disponible.toFixed(2)}`;

        document.getElementById('listagastos').innerHTML = gastosHTML;
    }
});
