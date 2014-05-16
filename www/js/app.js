$(document).ready(function(){
 
  var rxBytes = new Array ();
  var txBytes = new Array ();
  var resolution = 200;
  
  var client = new Faye.Client('/faye');

  client.subscribe('/ssh', function(message) {
    message = jQuery.parseJSON(message);

    message.date = new Date(message.date).getTime();


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
      { data: txBytes, label: "Bytes Received", lines:{fill:true}},
    ], options_default);

    $('#hardware').first().html(JSON.stringify(message.hardware));
    $('#system').first().html(JSON.stringify(message.system));
    $('#adhoc').first().html(JSON.stringify(message.adhoc));

  });

});
