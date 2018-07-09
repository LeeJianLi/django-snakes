function startGame() {

    $( "#SearchBtn" ).click(function() {
        var ticker = $("#ticker").val();
        clearChart();
        getChartOf(ticker,"1y",1);
      });
};

function clearChart(){
    $("#stock_chart").empty();
    $("#stock_slot").empty();
}

function getChartOf(ticker,year,interval){

    var stockData;


    $.ajax({
        url:"https://api.iextrading.com/1.0/stock/"+ticker+"/chart/"+year+"?chartInterval="+interval,
        method:"GET",
        dataType:"json",
        success:function(data){
            stockData = data;
            drawChart(stockData);
        },
        error:function(){
            console.log("failed");
        }
    })
}

function drawChart (data){
    var graphicWidth = 800;
    var graphicHeight = 300;
    var pricePoints = new Array();

    var dayPriceTemplate = _.template('<p class="datePrice"><%= date %><span class=<%= style %>><%= price %></span></p>')
    var previousPrice = data[0].close;
    for(i=0;i<data.length;i++){
        
        var priceColor;
        var currentPrice = data[i].close;
        var percentageChanged = (((data[i].close - data[i].open) / data[i].open)*100).toFixed(2)+"%";
        pricePoints.push(currentPrice);
        if (currentPrice >= previousPrice){
            priceColor ='sharePriceGreen';
        }else{
            priceColor ='sharePriceRed';
        }
        $("#stock_slot").append(dayPriceTemplate({date:data[i].date,style:priceColor,price:currentPrice+"("+percentageChanged+")"}))
        previousPrice = currentPrice;
    }

    var highestNum = Math.max(...pricePoints);
    var lowestNum = Math.min(...pricePoints);
    var rangeHL = highestNum - lowestNum;
    var xIncreasment = graphicWidth/pricePoints.length;
    var svgPath = "";
    for(i=0; i<pricePoints.length; i++){
        var remainder = highestNum - pricePoints[i];
        var percentage = remainder/rangeHL;
        var y = graphicHeight*percentage

        if(i==0){
            svgPath +="M";
        }else{
            svgPath +="L";
        }
        svgPath+=(i*xIncreasment +" "+y)
    }
    svgPath+="L"+graphicWidth+" "+graphicHeight;
    $("#stock_chart").append("<svg width=800 height=300><path d='"+svgPath+"'/></svg>")
}




window.onload = startGame;