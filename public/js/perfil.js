var select = document.querySelector('#update_select');

select.addEventListener('change', (event) => {

    var value = parseInt(select.value);   

    if(value == 1)
    {
        document.getElementById("name_field").style.display = "flex";
        document.getElementById("name_field").required = true;
        document.getElementById("altura_field").required = false;
        document.getElementById("peso_field").required = false;

        if(document.getElementById("altura_field").style.display != "none")
        {
            document.getElementById("altura_field").style.display = "none";
        }

        if(!document.getElementById("peso_field").style.display != "none")
        {
            document.getElementById("peso_field").style.display = "none"
        }

        document.getElementById("btnatt").disabled = false
    } else if(value == 2) {
        document.getElementById("altura_field").style.display = "flex";

        document.getElementById("name_field").required = false;
        document.getElementById("altura_field").required = true;
        document.getElementById("peso_field").required = false;

        if(document.getElementById("name_field").style.display != "none")
        {
            document.getElementById("name_field").style.display = "none"
        }

        if(document.getElementById("peso_field").style.display != "none")
        {
            document.getElementById("peso_field").style.display = "none"
        }

        document.getElementById("btnatt").disabled = false
    } else if(value == 3) {
        document.getElementById("peso_field").style.display = "flex";

        document.getElementById("name_field").required = false;
        document.getElementById("altura_field").required = false;
        document.getElementById("peso_field").required = true;

        if(document.getElementById("altura_field").style.display != "none")
        {
            document.getElementById("altura_field").style.display = "none"
        }

        if(document.getElementById("name_field").style.display != "none")
        {
            document.getElementById("name_field").style.display = "none"
        }

        document.getElementById("btnatt").disabled = false
    } else {
        document.getElementById("altura_field").style.display = "none";
        document.getElementById("name_field").style.display = "none"
        document.getElementById("peso_field").style.display = "none"

        document.getElementById("name_field").required = false;
        document.getElementById("altura_field").required = false;
        document.getElementById("peso_field").required = false;
        document.getElementById("btnatt").disabled = true
    }
});
