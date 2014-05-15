$(document).ready(function(){

  var client = new Faye.Client('/faye');

  client.subscribe('/ssh', function(message) {
    $('#ssh').first().html(message);
  });

});
