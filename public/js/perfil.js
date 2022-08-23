var select = document.querySelector('#update_select');

select.addEventListener('change', function() {
    
    var value = parseInt(this.value);

    if(value == 1)
    {
        document.getElementById("update_name_valor").classList.add("d-block");
        document.getElementById("update_name_valor").classList.remove("d-none");

        if(!document.getElementById("update_altura_valor").classList.contains("d-none"))
        {
            document.getElementById("update_altura_valor").classList.add("d-none");
            document.getElementById("update_altura_valor").classList.remove("d-block");
        }

        if(!document.getElementById("update_peso_valor").classList.contains("d-none"))
        {
            document.getElementById("update_peso_valor").classList.add("d-none");
            document.getElementById("update_peso_valor").classList.remove("d-block");
        }
    } else if(value == 2) {
        document.getElementById("update_altura_valor").classList.add("d-block");
        document.getElementById("update_altura_valor").classList.remove("d-none");

        if(!document.getElementById("update_name_valor").classList.contains("d-none"))
        {
            document.getElementById("update_name_valor").classList.add("d-none");
            document.getElementById("update_name_valor").classList.remove("d-block");
        }

        if(!document.getElementById("update_peso_valor").classList.contains("d-none"))
        {
            document.getElementById("update_peso_valor").classList.add("d-none");
            document.getElementById("update_peso_valor").classList.remove("d-block");
        }
    } else if(value == 3) {
        document.getElementById("update_peso_valor").classList.add("d-block");
        document.getElementById("update_peso_valor").classList.remove("d-none");

        if(!document.getElementById("update_altura_valor").classList.contains("d-none"))
        {
            document.getElementById("update_altura_valor").classList.add("d-none");
            document.getElementById("update_altura_valor").classList.remove("d-block");
        }

        if(!document.getElementById("update_name_valor").classList.contains("d-none"))
        {
            document.getElementById("update_name_valor").classList.add("d-none");
            document.getElementById("update_name_valor").classList.remove("d-block");
        }
    }
});
