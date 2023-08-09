let viewStores ={
    queryContainer:$('#storesQueryContainer'),
    tblStores:{
        table:null,
        init:function () {
            // alert();
            
            viewStores.tblStores.table = $('#tblStores').DataTable({
                ajax:{
                    url:'stores/get',
                    type:'GET',
                    data: function(data){
                        $storename = viewStores.queryContainer.find('#txtStoreName').val();
                        $storeno = viewStores.queryContainer.find('#txtStoreNo').val();
                        $storetype = viewStores.queryContainer.find('#dpType').val();
                        
                        // $categoryid = viewStores.queryContainer.find('#dpCategory').val();
                        // $sku = viewStores.queryContainer.find('#txtSku').val();
                        // $productname = viewStores.queryContainer.find('#txtProductName').val();
                        // $barcode = viewStores.queryContainer.find('#txtBarcode').val();
                        // $shortcode = viewStores.queryContainer.find('#txtShortCode').val();
                        // $sortby = viewStores.queryContainer.find('#dpSortBy').val();
                        
                        data.storename = $storename;
                        data.storeno = $storeno;
                        data.storetype = $storetype;
                    },
                    dataSrc:'data'
                },
                columns:[
                    {data:'storeid',render: function ( data, type, row ){
                            return '<div class="">\
                                <a class="action-btn" data-toggle="dropdown" href="#">Actions</a>\
                                <div class="dropdown-menu">\
                                    <a href="#" class="dropdown-item edit-store" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-store">Details</a>\
                                    <div class="dropdown-divider"></div>\
                                    <a href="#" class="dropdown-item view-history" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-store-history">Store History</a>\
                                </div>\
                            </div>';
                        }
                    },
                    {data: 'storename' },
                    {data: 'storeno' },
                    {data: 'storetype',render:function(data, type, row){
                            return '<div class="category">'+row.storetype+'</div>'
                        } 
                    },
                    {data: 'address' },
                    {data:'status',render: function ( data, type, row ){
                        let statusname = 'ACTIVE';
                        let statuscolor = 'status-success';
                        switch(row.status){
                            case '1':
                                statusname = 'ACTIVE';
                                statuscolor = 'status-success';
                                break;
                            case '2':
                                statusname = 'INACTIVE';
                                statuscolor = 'status-error';
                                break;
                        }
                        
                        return '<div class="'+statuscolor+'">'+statusname+'</div>';
                    }
                },
                ],
                serverSide:true,
                pageLength:30,
                rowId: 'storeid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [{
                        targets: 0,
                        width: 50, 
                        className: 'action-col'
                    },
                    {
                        targets: 1,
                        width: 400
                    },
                    {
                        targets: 3,
                        width: 100
                    },
                    {
                        targets: 5,
                        width: 150,
                        className: 'status-col'
                    },
                ],
                
                // bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblStores tbody').on('click', '.edit-store', function () {
                        var row = viewStores.tblStores.table.row($(this).closest('tr'));
                        var data = row.data();

                        savestore.params.storeid= data.storeid;

                    });
                   
                    $('#tblStores tbody').on('click', '.view-history', function () {
                        var row = viewStores.tblStores.table.row($(this).closest('tr'));
                        var data = row.data();

                        viewproducthistory.params.productid = data.productid;
                    });
                    
                }

            });

            
        },
        reload: function(){
            viewStores.tblStores.table.ajax.reload();
        },
    },
    init: function(){
        //FOCUS ON FIRST INPUT
        viewStores.queryContainer.find('#txtProductName').focus();

        ////LOAD TABLE
        if ( ! $.fn.DataTable.isDataTable('#tblStores' ) ) {
            viewStores.tblStores.init();
        }
        else{
            viewStores.tblStores.reload();
        }

        //SEARCH
        viewStores.queryContainer.find('#txtStoreName,#txtStoreNo').keypress(function(event){
            if(event.keyCode == 13){
                viewStores.tblStores.reload();
            }
        });

        viewStores.queryContainer.find('#dpType').change(function(){
            viewStores.tblStores.reload();
        });
    }
}

$(document).ready(function(){
    viewStores.init();
});