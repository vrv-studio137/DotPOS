let cashierView ={
    queryContainer:$('#productQueryContainer'),
    tblProducts:{
        table:null,
        init:function () {
            
            cashierView.tblProducts.table = $('#tblProducts').DataTable({
                ajax:{
                    url:'products/get',
                    type:'GET',
                    data: function(data){
                        $searchkey = cashierView.queryContainer.find('#txtSearchKey').val();
                        $categoryid = $('#dpCategory').val();
                        $searchby = cashierView.queryContainer.find('#dpSearchBy').val();
                        $sortby = 0
                        
                        data.searchkey = $searchkey;
                        data.categoryid = $categoryid;
                        data.searchby = $searchby;
                        data.sortby = $sortby;
                    },
                    dataSrc:'data'
                },
                columns:[
                    
                    // {data: 'sku' },
                    // {data: 'barcode' },
                    {data: 'stock' ,render: function ( data, type, row ){
                        return '<a href="#" class="edit-quantity underlined-link" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-save-stock" data-newproduct="false">'+row.stock+'</a>'
                    }},
                    {data:'productname',render: function ( data, type, row ){
                            return '['+row.shortcode+'] '+row.productname+'\
                                <br>\
                                <small class="text-muted">'+row.sku+'</small> <small class="text-muted category" style="float:right;">'+row.categoryname+'</small>\
                            ';
                        }
                    },
                    
                    {data: 'price' ,render: function ( data, type, row ){
                        return util.formatCurrency(row.price);
                    }},
                    {data:'productid',render: function ( data, type, row ){
                            return '<div class="">\
                                <a id="add_'+row.productid+'" class="action-btn add-product" href="#" data-toggle="modal" data-target="#modal-quantity">ADD</a>\
                            </div>';
                        }
                    },
                ],
                serverSide:true,
                pageLength:30,
                rowId: 'productid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [
                    {
                        targets: 0,
                        width: 50,
                        className: 'numeric-col'
                    },
                    {
                        targets: 2,
                        width: 100,
                        className: 'numeric-col'
                    },
                    {
                        targets: 3,
                        width: 50, 
                        className: 'action-col'
                    },
                ],
                
                // bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblProducts tbody').on('click', '.add-product', function () {
                        var row = cashierView.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        addquantity.params.stockid= data.stockid;
                        addquantity.params.productid= data.productid;
                        addquantity.params.productname= data.productname;
                        addquantity.params.sku= data.sku;
                        addquantity.params.barcode= data.barcode;
                        addquantity.params.stock= data.stock;
                        addquantity.params.price= data.price;

                    });
                    
                    $('#tblProducts tbody').on('click', '.edit-quantity', function () {
                        var row = cashierView.tblProducts.table.row($(this).closest('tr'));
                        var data = row.data();

                        viewproductstock.params.productid = data.productid;
                    });
                },
                drawCallback:function(){
                    var data = cashierView.tblProducts.table.row(0).data();
                    var searchKey = $('#txtSearchKey').val();
                    if($('#chkExactMatch').is(':checked')){
                        let exactMatch = false;
                        switch($('#dpSearchBy').val()){
                            case 0:
                                if($searchKey.toUpperCase() == data.shortcode.toUpperCase()){
                                    exactMatch = true;
                                }
                                break;
                            case 1:
                                if(searchKey.toUpperCase() == data.barcode.toUpperCase()){
                                    exactMatch = true;
                                }
                                break;
                            case 2:
                                if(searchKey.toUpperCase() == data.sku.toUpperCase()){
                                    exactMatch = true;
                                }
                                break;
                            case 3:
                                if(searchKey.toUpperCase() == data.productname.toUpperCase()){
                                    exactMatch = true;
                                }
                                break;
                            default:
                                if(searchKey.toUpperCase() == data.shortcode.toUpperCase()){
                                    exactMatch = true;
                                }
                                break;
                        }

                        if(exactMatch){
                            $('#add_'+data.productid).click();
                        }
                    }
                }
            });

        },
        reload: function(){
            cashierView.tblProducts.table.ajax.reload();
        },
    },
    tblCart:{
        table:null,
        init:function () {
            cashierView.tblCart.table = $('#tblCart').DataTable({
                data:[],
                columns:[
                   {data:'quantity'},
                   {data:'productname'},
                   {data:'unitprice'},
                   {data:'totalprice'},
                ],
                serverSide:false,
                pageLength:100,
                rowId: 'productid',
                searching: false,
                ordering:  false,
                paging:false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [
                    {
                        targets: 0,
                        width: 100,
                        className: 'numeric-col'
                    },
                    {
                        targets: 2,
                        width: 100,
                        className: 'numeric-col'
                    },
                    {
                        targets: 3,
                        width: 100,
                        className: 'numeric-col'
                    },
                    // {
                    //     targets: 3,
                    //     width: 50, 
                    //     className: 'action-col'
                    // },
                ],
                language: {
                    "emptyTable": "No items added to cart"
                },
                initComplete:function(settings, json) {
                    // $('#tblCart tbody').on('click', '.add-product', function () {
                    //     var row = cashierView.tblCart.table.row($(this).closest('tr'));
                    //     var data = row.data();

                    //     addquantity.params.productid= data.productid;
                    //     addquantity.params.productname= data.productname;
                    //     addquantity.params.sku= data.sku;
                    //     addquantity.params.barcode= data.barcode;
                    //     addquantity.params.stock= data.stock;

                    // });
                    
                }
            });

            
        },
        reload: function(){
            cashierView.tblCart.table.ajax.reload();
        },
        addProduct: function(stockid,productid,quantity,sku,productname,price,stock){
            cashierView.tblCart.table
                .row.add( {
                    'quantity': '<input id="quantity_'+productid+'" data-stockid="'+stockid+'" style="width: 100px;" type="number" value="'+quantity+'" max ="'+stock+'" >',
                    'productname': productname+'\
                        <br>\
                        <small class="text-muted">'+sku+'</small>\
                    ',
                    'unitprice': '<div id="unitprice_'+productid+'" class="unitprice">'+ util.formatCurrency(price)+'</div>',
                    'totalprice': '<div id="total_'+productid+'" class="total">'+ util.formatCurrency(price*quantity)+'</div>',
                } )
                .node().id = productid;

            cashierView.tblCart.table.draw(false);

            $("#quantity_"+productid).on('keyup',function(e){

                let maxval = stock;
                if(parseInt(this.value) < 0 || isNaN(parseInt(this.value))) 
                    $("#quantity_"+productid).val(0); 
                else if(parseInt(this.value) > maxval) 
                    $("#quantity_"+productid).val(maxval);

                
            });

            $("#quantity_"+productid).on('change',function(e){

               
                let cartTotalPrice = $('#total_'+productid);
                let cartUnitPrice = $('#unitprice_'+productid);
                
                let newTotal = parseFloat($("#quantity_"+productid).val())*parseFloat(cartUnitPrice.html());

                if(cartTotalPrice.length >0){
                    cartTotalPrice.html(util.formatCurrency(newTotal));
                    cashierView.tblCart.updateTotalAmount();
                }
            });

            cashierView.tblCart.updateTotalAmount();
        },
        updateProduct: function(productid,quantity,price){
            let cartQuantity = $('#quantity_'+productid);
            let cartTotalPrice = $('#total_'+productid);
            let newQuantity = parseFloat(cartQuantity.val())+parseFloat(quantity);
            let newTotal = parseFloat(newQuantity)*parseFloat(price);

            if(cartQuantity.length >0){
                cartQuantity.val(newQuantity);
                cartQuantity.trigger('change');
            }
            // if(cartTotalPrice.length >0){
            //     cartTotalPrice.html(util.formatCurrency(newTotal));
            // }
        },
        updateTotalAmount:function(){
            let totalAmount = 0.00;
            cashierView.tblCart.table.rows().eq(0).each( function ( index ) {
                var row = cashierView.tblCart.table.row( index ).node();
             
                let _total = util.removeComma($(row).find('.total').html());
                let _productAmount = parseFloat(_total);
                totalAmount = totalAmount+_productAmount;
                
                $('#txtTotal').val(totalAmount);
                $('#txtTotal').trigger('change');
                // ... do something with data(), or row.node(), etc
            } );
        }
    },
    hotkeys:function(){
         document.addEventListener("keydown", e => {
            let modalQuantity = $('#modal-quantity').hasClass('show');
            let modalCheckout = $('#modal-checkout').hasClass('show');
            let modalChange = $('#modalChange').hasClass('show');
            if(modalChange){
                if(e.key === "Enter") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault();
                    $('#modalChange').modal('hide');
                }
            }
            if(!modalQuantity && !modalCheckout){
                if(e.key === "F1") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault()
                    $('#dpCategory').focus();
                }
    
                if(e.key === "F2") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault()
                    $('#dpSearchBy').focus();
                }
    
                if(e.key === "F3") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault()
                    $('#txtSearchKey').focus();
                }
    
                if(e.key === "F4") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault()
                    if($('#chkExactMatch').is(':checked')){
                        $('#chkExactMatch').prop('checked', false);
                    }
                    else{
                        $('#chkExactMatch').prop('checked', true);
                    }
                }
    
                if(e.key === "F11") {
                    // Suppress default behaviour 
                    // e.g. F1 in Microsoft Edge on Windows usually opens Windows help
                    e.preventDefault();
                    cashierView.checkout();
                    
                }
            }
            
        })
    },
    checkout:function(){
        if(cashierView.tblCart.table.rows().count() === 0){
            alert("No items added to cart")
        }else{
            checkout.params.totalamount = $(txtTotal).val();
            $("#modal-checkout").modal("show");
        }
    },
    init: function(){
        //FOCUS ON FIRST INPUT
        cashierView.queryContainer.find('input[type="text"],input[type="number"]').on('focus',function(){
            $(this).select();
        });
        
        cashierView.queryContainer.find('#txtSearchKey').focus();
        cashierView.queryContainer.find('#chkExactMatch').prop('checked', true).trigger("change");
        ////LOAD TABLE
        if ( ! $.fn.DataTable.isDataTable('#tblProducts' ) ) {
            cashierView.tblProducts.init();
        }
        else{
            cashierView.tblProducts.reload();
        }

        ////LOAD TABLE
        if ( ! $.fn.DataTable.isDataTable('#tblCart' ) ) {
            cashierView.tblCart.init();
        }
        else{
            cashierView.tblCart.reload();
        }

        $('#txtTotal').on('change',function(){
            this.value = parseFloat(this.value).toFixed(2);
        });

        //SEARCH
        cashierView.queryContainer.find('#txtSearchKey').keypress(function(event){
            if(event.keyCode == 13){
                cashierView.tblProducts.reload();
            }
        });

        $('#dpCategory, #dpSearchBy').change(function(){
            cashierView.tblProducts.reload();
        });

        $('#btnCheckout').on('click',function(){
            cashierView.checkout();
        });

        cashierView.hotkeys();
    }
}

$(document).ready(function(){
    cashierView.init();
});