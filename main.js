document.getElementById('filterSelect').addEventListener('change', function() {
    const selectedValue = this.value;
    const items = document.querySelectorAll('#itemList li');

    items.forEach(function(item) {
        if (selectedValue === 'all' || item.getAttribute('data-category') === selectedValue) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});


// Selecciona el campo de entrada y el botón
const input = document.getElementById('myInput');
const button = document.getElementById('myButton');

// Función que se ejecutará cuando se presione Enter o se haga clic en el botón
function handleEvent() {
    const inputValue = input.value;
    alert(`El valor ingresado es: ${inputValue}`);
    // Puedes agregar aquí el código que necesites ejecutar
}

// Evento para el campo de entrada, detecta la tecla Enter (código 13)
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        handleEvent();
    }
});

// Evento para el clic del botón
button.addEventListener('click', handleEvent);
