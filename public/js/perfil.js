var select = document.querySelector('#update_select');

select.addEventListener('change', (event) => {

    var value = parseInt(select.value);   

    if(value == 1)
    {
        document.getElementById("name_field").style.display = "flex";

        if(document.getElementById("altura_field").style.display != "none")
        {
            document.getElementById("altura_field").style.display = "none";
        }

        if(!document.getElementById("peso_field").style.display != "none")
        {
            document.getElementById("peso_field").style.display = "none"
        }
    } else if(value == 2) {
        document.getElementById("altura_field").style.display = "flex";

        if(document.getElementById("name_field").style.display != "none")
        {
            document.getElementById("name_field").style.display = "none"
        }

        if(document.getElementById("peso_field").style.display != "none")
        {
            document.getElementById("peso_field").style.display = "none"
        }
    } else if(value == 3) {
        document.getElementById("peso_field").style.display = "flex";

        if(document.getElementById("altura_field").style.display != "none")
        {
            document.getElementById("altura_field").style.display = "none"
        }

        if(document.getElementById("name_field").style.display != "none")
        {
            document.getElementById("name_field").style.display = "none"
        }
    } else {
        document.getElementById("altura_field").style.display = "none";
        document.getElementById("name_field").style.display = "none"
        document.getElementById("peso_field").style.display = "none"
    }
});
