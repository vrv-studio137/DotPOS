let viewstockhistory={
    modal:$('#modal-stock-history'),
    params:{
        productid:0
    },
    tblCategory:{
        table:null,
        init:function () {
            viewstockhistory.tblCategory.table = viewstockhistory.modal.find('#tblStockHistory').DataTable({
                ajax:{
                    url:'stock/history/get',
                    type:'GET',
                    data: function(data){
                        $productid = viewstockhistory.params.productid;
                        $datefrom = viewstockhistory.modal.find('#txtDateFrom').val();
                        $dateto = viewstockhistory.modal.find('#txtDateTo').val();

                        data.productid = $productid;
                        data.datefrom = $datefrom;
                        data.dateto = $dateto;
                    },
                    dataSrc:'data'
                },
                columns:[
                    {data:'date',render: function ( data, type, row ){
                            return moment(row.date).format('MMMM DD yyyy, h:mm a');
                        }
                    },
                    { data: 'remarks' },
                    {data:'lastname',render: function ( data, type, row ){
                        return row.lastname+', '+row.firstname;
                    }
                },
                ],
                serverSide:true,
                pageLength:10,
                rowId: 'productid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                // bInfo:false,    
  
            });

            
        },
        reload: function(){
            viewstockhistory.tblCategory.table.ajax.reload();
        }
    },
    init: function(){
        //ON MODAL SHOWN
        viewstockhistory.modal.on('shown.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            viewstockhistory.modal.find('#txtDateFrom').focus();

            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#tblStockHistory' ) ) {
                viewstockhistory.tblCategory.init();
            }
            else{
                viewstockhistory.tblCategory.reload();
            }
        });

        //ON MODAL CLOSE
        viewstockhistory.modal.on('hidden.bs.modal', function () {
        });

        //SEARCH
        viewstockhistory.modal.find('#txtDateFrom, #txtDateTo').keypress(function(event){
            if(event.keyCode == 13){
                viewstockhistory.tblCategory.reload();
            }
        });

    }

}

$(document).ready(function(){
    viewstockhistory.init();
});