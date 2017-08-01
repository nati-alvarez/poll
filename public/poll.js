//apply event listener to answers 
var answers = document.getElementsByClassName('answer');
for(var i = 0; i < answers.length; i++){

    answers[i].addEventListener('click', function(){
        for (var j = 0; j < answers.length; j++){
            answers[j].classList.remove('selected');
        }
        this.classList.toggle('selected');
    });
}

  
var vote_btn = document.getElementById("vote_btn");
var poll_notification = document.getElementById("poll-notification");
//casts vote  
if (vote_btn){
    vote_btn.addEventListener('click', function() {
        var answer = document.getElementsByClassName("selected")[0];
        var ajax = new XMLHttpRequest();
        ajax.open('PUT', '/polls/' + vote_btn.dataset.pollid + "/vote", true);
        ajax.setRequestHeader('csrf-token', vote_btn.dataset.csrf);


        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                poll_notification.innerHTML = "<p class='success'>" + this.responseText + "</p>"; 
                setTimeout(()=>{
                    poll_notification.style.display = 'none';
                }, 3000);         
            }else {
                console.log(this.responseText);
                poll_notification.innerHTML = "<p class='error'>" + this.responseText + "</p>";
                setTimeout(()=>{
                    poll_notification.style.display = 'none';
                }, 3000); 
            }
        };

        var data = new FormData();
        data.append('answer_id', answer.dataset.optionid);
        data.append('poll_id', vote_btn.dataset.pollid);
        ajax.send(data);
    });
}

//toggle results
var view_results = document.getElementById('view-results');
var text = document.getElementById('result-btn-text');

view_results.addEventListener('click', function(){
    if(document.getElementById('poll-results').style.opacity == 0){
        text.innerHTML = "Hide Results";
        document.getElementById('poll-results').classList.remove('fadeOut');
        document.getElementById('poll-results').classList.add('fadeIn');
        document.getElementById('poll-results').style.opacity = 1;
        document.getElementById('result-arr').style.transform = 'rotate(270deg)';
    } else {
        text.innerHTML = "View Poll Results";
        document.getElementById('poll-results').classList.remove('fadeIn');
        document.getElementById('poll-results').classList.add('fadeOut');
        document.getElementById('poll-results').style.opacity = 0;
        document.getElementById('result-arr').style.transform = 'rotate(90deg)';
    }
});