function validateNewPoll(){
    var inputs = document.getElementsByTagName('input');
    var filledOut = true;
    var whitespace = /\s/;
    
    for (i = 0; i < inputs.length; i++){
        if (inputs[i].type == 'date'){
            //date field is not required, do nothing
        } else {
            if(inputs[i].type == 'password' && whitespace.test(inputs[i].value)){
                console.log(whitespace.test(inputs[i]));
                console.log(inputs[i]);
                filledOut = false;
                console.log("passwords cannot contain whitespace");
            }
        }
    }

    if (filledOut === false){return false;}

    var password = (document.querySelectorAll("[name='password'")[0].value);
    var confirm = (document.querySelectorAll("[name='confirm'")[0].value);


    if (password !== confirm){
        console.log("passwords do not match");
        return false;
    }

    return true;

}

function deleteConfirm(pollName) {
    var confirmDeleteion = confirm("Are you sure you want to delete this poll? This will be permanent.");
    if (confirmDeleteion){
        return true;
    }else {
        return false;
    }
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