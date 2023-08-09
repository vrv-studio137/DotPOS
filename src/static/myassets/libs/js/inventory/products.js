let viewProducts ={
    queryContainer:$('#productQueryContainer'),
    tblProducts:{
        table:null,
        init:function () {
            // alert();
            
            viewProducts.tblProducts.table = $('#tblProducts').DataTable({
                ajax:{
                    url:'products/get',
                    type:'GET',
                    data: function(data){
                        $storeid = viewProducts.queryContainer.find('#dpStore').val();
                        $categoryid = viewProducts.queryContainer.find('#dpCategory').val();
                        $sku = viewProducts.queryContainer.find('#txtSku').val();
                        $productname = viewProducts.queryContainer.find('#txtProductName').val();
                        $barcode = viewProducts.queryContainer.find('#txtBarcode').val();
                        $shortcode = viewProducts.queryContainer.find('#txtShortCode').val();
                        $sortby = viewProducts.queryContainer.find('#dpSortBy').val();
                        
                        data.storeid = $storeid;
                        data.categoryid = $categoryid;
                        data.sku = $sku;
                        data.productname = $productname;
                        data.barcode = $barcode;
                        data.shortcode = $shortcode;
                        data.sortby = $sortby;
                    },
                    dataSrc:'data'
                },
                columns:[
                    {data:'productid',render: function ( data, type, row ){
                            return '<div class="">\
                                <a class="action-btn" data-toggle="dropdown" href="#">Actions</a>\
                                <div class="dropdown-menu">\
                                    <a href="#" class="dropdown-item edit-product" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-product">Details</a>\
                                    <a href="#" class="dropdown-item edit-price" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-stock" data-newproduct="false">Price/Stock</a>\
                                    <div class="dropdown-divider"></div>\
                                    <a href="#" class="dropdown-item view-history" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-product-history">Product History</a>\
                                    <a href="#" class="dropdown-item stock-history" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-stock-history">Stock History</a>\
                                </div>\
                            </div>';
                        }
                    },

                    {data: 'sku' },
                    {data: 'barcode' },
                    {data:'productname',render: function ( data, type, row ){
                            return '['+row.shortcode+'] '+row.productname+'\
                                <br>\
                                <small class="text-muted category">'+row.categoryname+'</small> <small class="text-muted" style="float:right;">'+row.brand+'</small>\
                            ';
                        }
                    },
                    
                    {data: 'price' ,render: function ( data, type, row ){
                        return '<a href="#" class="edit-price underlined-link" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-stock" data-newproduct="false">'+util.formatCurrency(row.price)+'</a>'
                    }},
                    {data: 'stock' ,render: function ( data, type, row ){
                        return '<a href="#" class="edit-price underlined-link" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-stock" data-newproduct="false">'+row.stock+'</a>'
                    }},
                    {data: 'storename' },
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
                rowId: 'productid',
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
                    width: 150
                },
                {
                    targets: 2,
                    width: 150
                },
                {
                    targets: 4,
                    width: 150,
                    className: 'numeric-col'
                },
                {
                    targets: 5,
                    width: 150,
                    className: 'numeric-col'
                },
                {
                    targets: 7,
                    width: 150,
                    className: 'status-col'
                }
            ],
                
                // bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblProducts tbody').on('click', '.edit-product', function () {
                        var row = viewProducts.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveproduct.params.productid= data.productid;

                    });
                    $('#tblProducts tbody').on('click', '.edit-price', function () {
                        var row = viewProducts.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        viewproductstock.params.productid = data.productid;
                    });
                    $('#tblProducts tbody').on('click', '.view-history', function () {
                        var row = viewProducts.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        viewproducthistory.params.productid = data.productid;
                    });

                    $('#tblProducts tbody').on('click', '.stock-history', function () {
                        var row = viewProducts.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        viewstockhistory.params.productid = data.productid;
                    });
                    
                }
            });

            
        },
        reload: function(){
            viewProducts.tblProducts.table.ajax.reload();
        },
    },
    init: function(){
        //FOCUS ON FIRST INPUT
        viewProducts.queryContainer.find('#txtProductName').focus();
        viewProducts.queryContainer.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });
        ////LOAD TABLE
        if ( ! $.fn.DataTable.isDataTable('#tblProducts' ) ) {
            viewProducts.tblProducts.init();
        }
        else{
            viewProducts.tblProducts.reload();
        }

        //SEARCH
        viewProducts.queryContainer.find('#txtSku,#txtProductName,#txtBarcode,#txtShortCode').keypress(function(event){
            if(event.keyCode == 13){
                viewProducts.tblProducts.reload();
            }
        });

        viewProducts.queryContainer.find('#dpStore,#dpCategory,#dpSortBy').change(function(){
            viewProducts.tblProducts.reload();
        });
    }
}

$(document).ready(function(){
    viewProducts.init();
});