$(document).ready(function(){

  console.log("ready js file");
  $('button').click(function() {
    console.log("in click")
    setTimeout(function(){
      console.log("in timeout")
      window.location.reload(true);
      console.log("in after")
    },5000)

    });
})
