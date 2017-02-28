function togglePin(pinID) {
    //open up xmlttprequest and send id of pin to toggle to server
    var url = "/"
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if(xhr.readyState == XMLHttpRequest.DONE){
        window.location.href = window.location.href;
      }

    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify({
      id: pinID
    }));

};
