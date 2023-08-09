let viewcategoryhistory={
    modal:$('#modal-category-history'),
    params:{
        categoryid:0
    },
    tblCategory:{
        table:null,
        init:function () {
            viewcategoryhistory.tblCategory.table = viewcategoryhistory.modal.find('#tblCategoryHistory').DataTable({
                ajax:{
                    url:'category/history/get',
                    type:'GET',
                    data: function(data){
                        $categoryid = viewcategoryhistory.params.categoryid;
                        $datefrom = viewcategoryhistory.modal.find('#txtDateFrom').val();
                        $dateto = viewcategoryhistory.modal.find('#txtDateTo').val();

                        data.categoryid = $categoryid;
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
            viewcategoryhistory.tblCategory.table.ajax.reload();
        }
    },
    init: function(){
        //ON MODAL SHOWN
        viewcategoryhistory.modal.on('shown.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            viewcategoryhistory.modal.find('#txtDateFrom').focus();

            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#tblCategoryHistory' ) ) {
                viewcategoryhistory.tblCategory.init();
            }
            else{
                viewcategoryhistory.tblCategory.reload();
            }
        });

        //ON MODAL CLOSE
        viewcategoryhistory.modal.on('hidden.bs.modal', function () {
        });

        //SEARCH
        viewcategoryhistory.modal.find('#txtDateFrom, #txtDateTo').keypress(function(event){
            if(event.keyCode == 13){
                viewcategoryhistory.tblCategory.reload();
            }
        });

    }

}

$(document).ready(function(){
    viewcategoryhistory.init();
});