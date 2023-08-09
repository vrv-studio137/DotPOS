let viewproducthistory={
    modal:$('#modal-product-history'),
    params:{
        productid:0
    },
    tblCategory:{
        table:null,
        init:function () {
            viewproducthistory.tblCategory.table = viewproducthistory.modal.find('#tblProductHistory').DataTable({
                ajax:{
                    url:'history/get',
                    type:'GET',
                    data: function(data){
                        $productid = viewproducthistory.params.productid;
                        $datefrom = viewproducthistory.modal.find('#txtDateFrom').val();
                        $dateto = viewproducthistory.modal.find('#txtDateTo').val();

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
            viewproducthistory.tblCategory.table.ajax.reload();
        }
    },
    init: function(){
        //ON MODAL SHOWN
        viewproducthistory.modal.on('shown.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            viewproducthistory.modal.find('#txtDateFrom').focus();

            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#tblProductHistory' ) ) {
                viewproducthistory.tblCategory.init();
            }
            else{
                viewproducthistory.tblCategory.reload();
            }
        });

        //ON MODAL CLOSE
        viewproducthistory.modal.on('hidden.bs.modal', function () {
        });

        //SEARCH
        viewproducthistory.modal.find('#txtDateFrom, #txtDateTo').keypress(function(event){
            if(event.keyCode == 13){
                viewproducthistory.tblCategory.reload();
            }
        });

    }

}

$(document).ready(function(){
    viewproducthistory.init();
});