$(document).ready(function(){


  $('#submit').click(function() {
    console.log("in click")
    setTimeout(function(){
      console.log("in timeout")
      window.location.reload(true);
      console.log("in after")
    },5000)

    });
})
