function validateNewPoll(){
    var inputs = document.getElementsByTagName('input');
    var filledOut = true;
    var whitespace = /\s/;
    
    for (i = 0; i < inputs.length; i++){
        if (inputs[i].type == 'date'){
            //date field is not required, do nothing
        }else {
            if (!inputs[i].value){
                console.log( inputs[i].name + " is emtpy");
                filledOut = false;
            }

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

//add new input element on add more uutotn click
var add_option = document.getElementById('add-option');

add_option.addEventListener('click', function(){
    var options = document.getElementById("options");
    var input = document.createElement('input');
    input.type = "text";
    input.name = "option[]"
    options.appendChild(input);
})