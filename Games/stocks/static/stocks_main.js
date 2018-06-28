function startGame() {
    getChartOf("spy","1y",5);

};

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
    var dayPriceTemplate = _.template('<p><%= date %><span class=<%= style %>><%= price %></span></p>')
    var previousPrice = 0;
    for(i=0;i<data.length;i++){
        var priceColor;
        var currentPrice = data[i].open;
        if (currentPrice > previousPrice){
            priceColor ='sharePriceGreen';
        }else{
            priceColor ='sharePriceRed';
        }
        $("#stock_slot").append(dayPriceTemplate({date:data[i].date,style:priceColor,price:currentPrice}))
        previousPrice = currentPrice;
    }

    $("#stock_chart").append('<svg width="800" height="300"><line x1="10"  x2="90" y2="90"  y1="5" stroke-width="1" stroke="black"/></svg>')
}


window.onload = startGame;