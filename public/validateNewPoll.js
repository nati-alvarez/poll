function validateNewPoll(){
    var inputs = document.getElementsByTagName('input');
    var filledOut = true;
    var whitespace = /\s/;
    var formError = document.getElementById('form-error');
    formError.innerHTML = "";
    
    for (i = 0; i < inputs.length; i++){
        if (inputs[i].type == 'date'){
            //date field is not required, do nothing
        }else {
            if (!inputs[i].value){
                formError.innerHTML = `<h2>FORM ERROR:</h2><p>Required fields not completed.</p>`;
                filledOut = false;
            }

            if(inputs[i].type == 'password' && whitespace.test(inputs[i].value)){
                filledOut = false;
                formError.innerHTML = "<h2>FORM ERROR:</h2><p>Passwords cannot contain whitespace.</p>";
            }
        }
    }

    if (filledOut === false){return false;}

    var password = (document.querySelectorAll("[name='password'")[0].value);
    var confirm = (document.querySelectorAll("[name='confirm'")[0].value);

    if (password !== confirm){
        formError.innerHTML = "<h2>FORM ERROR:</h2><p>Passwords do not match.</p>";
        return false;
    }

    return true;

}

function removeOption(button) {
    button.parentNode.remove()
    return false;
}

//add new input element on add more uutotn click
var add_option = document.getElementById('add-option');

add_option.addEventListener('click', function(){
    var options = document.getElementById("options");
    var div = document.createElement('div');
    div.className = 'option';
    div.style.display = 'flex';

    var html = `
        <input type='text' name='option[]'>
        <div onclick='removeOption(this)' class='remove-option'>X</div>
    `;

    div.innerHTML = html;

    options.appendChild(div);
})