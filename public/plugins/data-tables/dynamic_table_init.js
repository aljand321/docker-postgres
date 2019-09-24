function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData( nTr );
    var sOut = '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';
    sOut += '<tr><td>Numero de Historial:</td><td>'+aData[2]+' '+aData[3]+'</td></tr>';
    sOut += '<tr><td>Link to source:</td><td>Could provide a link here</td></tr>';
    sOut += '<tr><td>Extra info:</td><td>And any further details here (images etc)</td></tr>';
    sOut += '</table>';

    return sOut;
}
$(document).ready(function() {

    $('#dynamic-table').dataTable( {
        "aaSorting": [[ 4, "desc" ]]
    } );
    $('#dynamic-table2').dataTable( {
        "aaSorting": [[ 4, "desc" ]]
    } );
    $('#dynamic-table3').dataTable( {
        "aaSorting": [[ 4, "desc" ]]
    } );
    $('#dynamic-table4').dataTable({
        dom: 'lBfrtip',
        buttons: [
            { extend: 'print', exportOptions:
                { columns: ':visible' }
            },
            { extend: 'copy', exportOptions:
                 { columns: [ 0, ':visible' ] }
            },
            { extend: 'excel', exportOptions:
                 { columns: ':visible' }
            },
            { extend: 'pdf', exportOptions:
                  { columns: [ 0, 1, 2, 3, 4 ] }
            },
            { extend: 'colvis',   postfixButtons: [ 'colvisRestore' ] }
           ],
          language: {
              buttons: {
                  print: 'Stampa',
                  copy: 'Copia',
                  colvis: 'Colonne da visualizzare'
               } //buttons
           }, //language
           "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
    });
    /*
     * Insert a 'details' column to the table
     */
    var nCloneTh = document.createElement( 'th' );
    var nCloneTd = document.createElement( 'td' );
    nCloneTd.innerHTML = '<img src="/plugins/advanced-datatable/images/details_open.png">';
    nCloneTd.className = "center";

    $('#hidden-table-info thead tr').each( function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );

    $('#hidden-table-info tbody tr').each( function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );

    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
    var oTable = $('#hidden-table-info').dataTable( {
        "aoColumnDefs": [
            { "bSortable": false, "aTargets": [ 0 ] }
        ],
        "aaSorting": [[1, 'asc']]
    });

    /* Add event listener for opening and closing details
     * Note that the indicator for showing which row is open is not controlled by DataTables,
     * rather it is done here
     */
    $('#hidden-table-info tbody td img').click(function () {
        var nTr = $(this).parents('tr')[0];
        if ( oTable.fnIsOpen(nTr) )
        {
            /* This row is already open - close it */
            this.src = "/plugins/advanced-datatable/images/details_open.png";
            oTable.fnClose( nTr );
        }
        else
        {
            /* Open this row */
            this.src = "/plugins/advanced-datatable/images/details_close.png";
            oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
        }
    } );
} );


