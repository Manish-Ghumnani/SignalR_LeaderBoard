// A simple templating method for replacing placeholders enclosed in curly braces.
if (!String.prototype.supplant) {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g,
            function (a, b) {
                var r = o[b];
                return typeof r === 'string' || typeof r === 'number' ? r : a;
            }
        );
    };
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("teamTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.getElementsByTagName("TR");
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }//if
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    //if so, mark as a switch and break the loop:
                    shouldSwitch = true;
                    break;
                }//if
            }//elseif
        }//for
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            //Each time a switch is done, increase this count by 1:
            switchcount++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }//if
        }//else
    }//switch

}//function sortTab

$(function () {

    var ticker = $.connection.boardUpdate, // the generated client-side hub proxy
        $teamTable = $('#teamTable'),
        $teamTableBody = $teamTable.find('tbody'),
        rowTemplate = '<tr data-symbol="{Rank}"><td>{Rank}</td><td>{Team}</td><td>{TotalPitStops}</td><td>{PitStopsCleared}</td><td>{PitStopsRemaining}</td></tr>';

    //function formatStock(board) {
    //    return $.extend(board, {
    //        Price: stock.Price.toFixed(2),
    //        PercentChange: (stock.PercentChange * 100).toFixed(2) + '%',
    //        Direction: stock.Change === 0 ? '' : stock.Change >= 0 ? up : down
    //    });
    //}

    function init() {
        ticker.server.getAllRows().done(function (boards) {
            $teamTableBody.empty();
            $.each(boards, function () {
                var board = this;
                $teamTableBody.append(rowTemplate.supplant(board));
            });
        });
    }

    // Add a client-side hub method that the server will call
    ticker.client.updateLeaderBoard = function (board) {
        var displayBoard = board,
            $row = $(rowTemplate.supplant(displayBoard));

        $teamTableBody.find('tr[data-symbol=' + board.Rank + ']')
            .replaceWith($row);
        sortTable(3);
    }

    // Start the connection
    $.connection.hub.start().done(init);

});