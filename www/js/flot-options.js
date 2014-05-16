
        var options_default = { 
        yaxis: { min: 0, max: 50000000 },
        xaxis: { mode: "time", timeformat: "%H:%M:%S"},
                   
          series: {
            lines: { show: true, fillColor: "rgba(166,225,38,0.7)", lineWidth: 1 },
   //       points: { show: true, fill: true, fillColor: "rgba(202,0,204,0.7)", radius: 1 },
            shadowSize: 0
          },  
                               
          colors: ["rgba(50,50,50,0.7)"],

          grid: {
            show: true,
            aboveData: false,
            color: "#483a3a",
            backgroundColor: null,
            margin: 50, 
            labelMargin: 10, 
            axisMargin: 50, 
            borderWidth: 1,
            borderColor: "#483a3a",
            minBorderMargin: 20, 
//            clickable: true,
            hoverable: true,
            autoHighlight: true,
            mouseActiveRadius: 50
          },  

          legend: {
            show: false,
            labelBoxBorderColor: "#483a3a",
            position: "sw",
            margin: 5,
            backgroundColor: "#FFFFFF",
            backgroundOpacity: 0.5 
          }   
    
        }; 
