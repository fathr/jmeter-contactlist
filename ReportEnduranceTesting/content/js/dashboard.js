/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 95.80838323353294, "KoPercent": 4.191616766467066};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.45808383233532934, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "GET Contact with id 67a21a97ad458a00134b3070"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9cad458a00134b3076"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9cad458a00134b3077"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9cad458a00134b3075"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9fad458a00134b307a"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa3e0f4720013abcc0b"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9fad458a00134b307b"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa2ad458a00134b307e"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9aad458a00134b3073"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa3e0f4720013abcc0a"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa7ad458a00134b3081"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa6e0f4720013abcc0d"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa6e0f4720013abcc0e"], "isController": false}, {"data": [0.4696969696969697, 500, 1500, "POST Add Contact"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9dad458a00134b3078"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa6e0f4720013abcc0f"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aadad458a00134b3086"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa0ad458a00134b307c"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa0ad458a00134b307d"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa9ad458a00134b3083"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aaae0f4720013abcc12"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aacad458a00134b3084"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aace0f4720013abcc13"], "isController": false}, {"data": [0.0, 500, 1500, "GET Contact with id 67a21a95ad458a00134b306d"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aace0f4720013abcc14"], "isController": false}, {"data": [0.5, 500, 1500, "DELETE Contact"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "POST Log In User"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aacad458a00134b3085"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9de0f4720013abcc09"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21a9fad458a00134b3079"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa4e0f4720013abcc0c"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa9e0f4720013abcc10"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa9e0f4720013abcc11"], "isController": false}, {"data": [0.5, 500, 1500, "PUT Update Contact"], "isController": false}, {"data": [0.5, 500, 1500, "PATCH Update Contact"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa5ad458a00134b3080"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa3ad458a00134b307f"], "isController": false}, {"data": [0.5, 500, 1500, "GET Contact with id 67a21aa8ad458a00134b3082"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 167, 7, 4.191616766467066, 809.3113772455087, 595, 5129, 629.0, 1025.8000000000002, 2012.6, 4767.239999999996, 5.497761390571504, 5.386396744140111, 3.028481829816302], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET Contact with id 67a21a97ad458a00134b3070", 1, 0, 0.0, 2027.0, 2027, 2027, 2027.0, 2027.0, 2027.0, 2027.0, 0.49333991119881604, 0.5097203379378391, 0.24811528737049826], "isController": false}, {"data": ["GET Contact with id 67a21a9cad458a00134b3076", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 1.6901426518883416, 0.561242816091954], "isController": false}, {"data": ["GET Contact with id 67a21a9cad458a00134b3077", 1, 0, 0.0, 609.0, 609, 609, 609.0, 609.0, 609.0, 609.0, 1.6420361247947455, 1.6901426518883416, 0.561242816091954], "isController": false}, {"data": ["GET Contact with id 67a21a9cad458a00134b3075", 1, 0, 0.0, 607.0, 607, 607, 607.0, 607.0, 607.0, 607.0, 1.6474464579901154, 1.6957114909390445, 0.8285497322899505], "isController": false}, {"data": ["GET Contact with id 67a21a9fad458a00134b307a", 1, 0, 0.0, 615.0, 615, 615, 615.0, 615.0, 615.0, 615.0, 1.6260162601626016, 1.680005081300813, 0.5557672764227642], "isController": false}, {"data": ["GET Contact with id 67a21aa3e0f4720013abcc0b", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 1.6754594103392568, 0.552175888529887], "isController": false}, {"data": ["GET Contact with id 67a21a9fad458a00134b307b", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 1.6854863376835236, 0.5575805464926591], "isController": false}, {"data": ["GET Contact with id 67a21aa2ad458a00134b307e", 1, 0, 0.0, 639.0, 639, 639, 639.0, 639.0, 639.0, 639.0, 1.5649452269170578, 1.623019366197183, 0.5348933881064163], "isController": false}, {"data": ["GET Contact with id 67a21a9aad458a00134b3073", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 1.6745542868589745, 0.805977063301282], "isController": false}, {"data": ["GET Contact with id 67a21aa3e0f4720013abcc0a", 1, 0, 0.0, 621.0, 621, 621, 621.0, 621.0, 621.0, 621.0, 1.6103059581320451, 1.6700634057971016, 0.5503975442834138], "isController": false}, {"data": ["GET Contact with id 67a21aa7ad458a00134b3081", 1, 0, 0.0, 613.0, 613, 613, 613.0, 613.0, 613.0, 613.0, 1.6313213703099512, 1.6791139885807504, 0.5575805464926591], "isController": false}, {"data": ["GET Contact with id 67a21aa6e0f4720013abcc0d", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 1.6682942708333333, 0.5477514022435898], "isController": false}, {"data": ["GET Contact with id 67a21aa6e0f4720013abcc0e", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 1.6844913025889967, 0.5530693770226537], "isController": false}, {"data": ["POST Add Contact", 33, 0, 0.0, 712.3333333333334, 595, 2144, 629.0, 868.8000000000005, 1751.2999999999984, 2144.0, 1.2926982137261047, 1.3443801291718898, 0.901354027930116], "isController": false}, {"data": ["GET Contact with id 67a21a9dad458a00134b3078", 1, 0, 0.0, 614.0, 614, 614, 614.0, 614.0, 614.0, 614.0, 1.6286644951140066, 1.6763792752442996, 0.8191037255700326], "isController": false}, {"data": ["GET Contact with id 67a21aa6e0f4720013abcc0f", 1, 0, 0.0, 627.0, 627, 627, 627.0, 627.0, 627.0, 627.0, 1.594896331738437, 1.6603120015948962, 0.545130582137161], "isController": false}, {"data": ["GET Contact with id 67a21aadad458a00134b3086", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 1.6452279060509554, 0.5442625398089171], "isController": false}, {"data": ["GET Contact with id 67a21aa0ad458a00134b307c", 1, 0, 0.0, 611.0, 611, 611, 611.0, 611.0, 611.0, 611.0, 1.6366612111292964, 1.6910034779050738, 0.5594056873977087], "isController": false}, {"data": ["GET Contact with id 67a21aa0ad458a00134b307d", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 1.6836191152597402, 0.5548650568181819], "isController": false}, {"data": ["GET Contact with id 67a21aa9ad458a00134b3083", 1, 0, 0.0, 635.0, 635, 635, 635.0, 635.0, 635.0, 635.0, 1.574803149606299, 1.6270915354330708, 0.5382627952755905], "isController": false}, {"data": ["GET Contact with id 67a21aaae0f4720013abcc12", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 1.6647020465489566, 0.5486306179775281], "isController": false}, {"data": ["GET Contact with id 67a21aacad458a00134b3084", 1, 0, 0.0, 608.0, 608, 608, 608.0, 608.0, 608.0, 608.0, 1.644736842105263, 1.712196751644737, 0.5621659128289473], "isController": false}, {"data": ["GET Contact with id 67a21aace0f4720013abcc13", 1, 0, 0.0, 616.0, 616, 616, 616.0, 616.0, 616.0, 616.0, 1.6233766233766236, 1.6899604301948052, 0.5548650568181819], "isController": false}, {"data": ["GET Contact with id 67a21a95ad458a00134b306d", 1, 0, 0.0, 3066.0, 3066, 3066, 3066.0, 3066.0, 3066.0, 3066.0, 0.32615786040443573, 0.335713266470972, 0.1640344708088715], "isController": false}, {"data": ["GET Contact with id 67a21aace0f4720013abcc14", 1, 0, 0.0, 605.0, 605, 605, 605.0, 605.0, 605.0, 605.0, 1.6528925619834711, 1.7206869834710745, 0.5649535123966942], "isController": false}, {"data": ["DELETE Contact", 28, 0, 0.0, 625.857142857143, 611, 647, 625.5, 636.1, 642.5, 647.0, 1.6103059581320451, 1.1929024327122153, 0.8137459203186105], "isController": false}, {"data": ["POST Log In User", 12, 7, 58.333333333333336, 2505.5833333333335, 1025, 5129, 1985.0, 4969.400000000001, 5129.0, 5129.0, 0.9366950277105612, 0.8360734915307158, 0.2533833229256108], "isController": false}, {"data": ["GET Contact with id 67a21aacad458a00134b3085", 1, 0, 0.0, 618.0, 618, 618, 618.0, 618.0, 618.0, 618.0, 1.6181229773462784, 1.671849716828479, 0.5530693770226537], "isController": false}, {"data": ["GET Contact with id 67a21a9de0f4720013abcc09", 1, 0, 0.0, 623.0, 623, 623, 623.0, 623.0, 623.0, 623.0, 1.6051364365971108, 1.6772421749598716, 0.5486306179775281], "isController": false}, {"data": ["GET Contact with id 67a21a9fad458a00134b3079", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 1.6620342548076923, 0.5477514022435898], "isController": false}, {"data": ["GET Contact with id 67a21aa4e0f4720013abcc0c", 1, 0, 0.0, 617.0, 617, 617, 617.0, 617.0, 617.0, 617.0, 1.6207455429497568, 1.680890397082658, 0.5539657617504052], "isController": false}, {"data": ["GET Contact with id 67a21aa9e0f4720013abcc10", 1, 0, 0.0, 631.0, 631, 631, 631.0, 631.0, 631.0, 631.0, 1.5847860538827259, 1.6374059033280508, 0.5416749207606973], "isController": false}, {"data": ["GET Contact with id 67a21aa9e0f4720013abcc11", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 1.6620342548076923, 0.5477514022435898], "isController": false}, {"data": ["PUT Update Contact", 32, 0, 0.0, 652.03125, 618, 1341, 630.0, 645.2, 895.7499999999985, 1341.0, 1.5311737403703527, 1.5969663620268912, 1.1944071038087947], "isController": false}, {"data": ["PATCH Update Contact", 29, 0, 0.0, 651.8275862068966, 622, 949, 640.0, 659.0, 833.5, 949.0, 1.4970059880239521, 1.563296494295891, 0.7506202573301672], "isController": false}, {"data": ["GET Contact with id 67a21aa5ad458a00134b3080", 1, 0, 0.0, 622.0, 622, 622, 622.0, 622.0, 622.0, 622.0, 1.607717041800643, 1.6736585610932475, 0.5495126607717041], "isController": false}, {"data": ["GET Contact with id 67a21aa3ad458a00134b307f", 1, 0, 0.0, 619.0, 619, 619, 619.0, 619.0, 619.0, 619.0, 1.6155088852988693, 1.6754594103392568, 0.552175888529887], "isController": false}, {"data": ["GET Contact with id 67a21aa8ad458a00134b3082", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 1.6557742387820513, 0.5477514022435898], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 7, 100.0, 4.191616766467066], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 167, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Log In User", 12, 7, "401/Unauthorized", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
