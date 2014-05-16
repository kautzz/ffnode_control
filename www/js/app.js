$(document).ready(function(){

  var client = new Faye.Client('/faye');

  client.subscribe('/ssh', function(message) {
  console.log(message);
  message = jQuery.parseJSON(message);

    $('#hardware').first().html(message.hardware);
    $('#system').first().html(message.system);
    $('#adhoc').first().html(message.adhoc);

  });

});
