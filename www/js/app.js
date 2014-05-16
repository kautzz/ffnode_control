$(document).ready(function(){

  var client = new Faye.Client('/faye');

  client.subscribe('/ssh', function(message) {
  message = jQuery.parseJSON(message);

  message.date = new Date(message.date).getTime();
 
  // Prepare Data for Plot:
  var rxBytes = new Array ();
  var txBytes = new Array ();
  var resolution = 200;

  // fill arrays, shift when resolution is max. X=time, Y=data
  rxBytes.push ([message.date, message.adhoc.statistics.rx_bytes]);
  if (rxBytes.length == resolution){
    rxBytes.shift (0);
  }

  txBytes.push ([message.date, message.adhoc.statistics.tx_bytes]);
  if (txBytes.length == resolution){
    txBytes.shift (0);
  }

  console.log(rxBytes);

  // Plot Data
  $.plot("#graph_rx_tx", [
    { data: rxBytes, label: "Bytes Received", lines:{fill:true}},
  ], options_default);

    $('#hardware').first().html(JSON.stringify(message.hardware));
    $('#system').first().html(JSON.stringify(message.system));
    $('#adhoc').first().html(JSON.stringify(message.adhoc));

  });

});
