//script for the click me button
function sweetclick(){
    swal("Good job!", "You clicked the button! Here is an inspirational quote: According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway, because bees don't care what humans think is impossible. - Bee Movie", "success");
}


/*
const form = document.querySelector("form"),
statusTxt = form.querySelector(".button-area span");

form.onsubmit = (e)=>{
    e.preventDefault(); //prevent form submissions
    statusTxt.style.display = "block";

    let xhr = new XMLHttpsRequest();
    xhr.open("POST", "message.php", true);
    xhr.onload = ()=>{
        if(xhr.readyState == 4 && xhr.status == 200){ //no errors
            let response = xhr.response;
            console.log(response);
        }
    }
    let formData = new FormData(); //obj to send form data
    xhr.send(formData); //send formdata
}
*/