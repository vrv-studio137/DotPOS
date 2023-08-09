let viewOrders ={
    queryContainer:$('#ordersQueryContainer'),
    tblOrders:{
        table:null,
        init:function () {
            // alert();
            
            viewOrders.tblOrders.table = $('#tblOrders').DataTable({
                ajax:{
                    url:'orders/get',
                    type:'GET',
                    data: function(data){
                        $storeid = viewOrders.queryContainer.find('#dpStore').val();
                        $invoiceno = viewOrders.queryContainer.find('#txtInvoiceNo').val();
                        $referenceno = viewOrders.queryContainer.find('#txtReferenceNo').val();
                        $orderstatus = viewOrders.queryContainer.find('#dpOrderStatus').val();
                        $customername = viewOrders.queryContainer.find('#txtCustomerName').val();
                        $datefrom = viewOrders.queryContainer.find('#txtDateFrom').val();
                        $dateto = viewOrders.queryContainer.find('#txtDateTo').val();
                        // $categoryid = viewOrders.queryContainer.find('#dpCategory').val();
                        // $sku = viewOrders.queryContainer.find('#txtSku').val();
                        // $productname = viewOrders.queryContainer.find('#txtProductName').val();
                        // $barcode = viewOrders.queryContainer.find('#txtBarcode').val();
                        // $shortcode = viewOrders.queryContainer.find('#txtShortCode').val();
                        // $sortby = viewOrders.queryContainer.find('#dpSortBy').val();
                        
                        data.storeid = $storeid;
                        data.invoiceno = $invoiceno;
                        data.referenceno = $referenceno;
                        data.orderstatus = $orderstatus;
                        data.customername = $customername;
                        data.datefrom = $datefrom;
                        data.dateto = $dateto;
                    },
                    dataSrc:'data'
                },
                columns:[
                    {data:'orderid',render: function ( data, type, row ){
                            return '<div class="">\
                                <a class="action-btn" data-toggle="dropdown" href="#">Actions</a>\
                                <div class="dropdown-menu">\
                                    <a href="#" class="dropdown-item view-items" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-order-items">Order Items</a>\
                                    <a href="#" class="dropdown-item view-payment" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-order-payment">Payment</a>\
                                    <div class="dropdown-divider"></div>\
                                    <a href="#" class="dropdown-item view-history" data-backdrop="static" data-dismiss="modal" data-toggle="modal" data-target="#modal-order-history">Void</a>\
                                </div>\
                            </div>';
                        }
                    },
                    {data: 'storename' },
                    
                    {data:'invoiceno',render: function ( data, type, row ){
                        return 'Invoice no.: '+row.invoiceno+'\
                            <br>\
                            <div class="text-muted">Reference no.:' +row.referenceno +'</div>';
                        }
                    },
                    {data:'customername',render: function ( data, type, row ){
                        let customername =row.customername;
                        let customeraddress =row.customeraddress;

                        if(util.isEmpty(customername)){
                            customername = 'N/A'
                        }
                        if(util.isEmpty(customeraddress)){
                            customeraddress = 'N/A'
                        }

                        return 'Name: '+customername+'\
                            <br>\
                            <div class="text-muted">Address: ' +customeraddress +'</div>';
                        }
                    },
                    {data: 'totalamount' ,render: function ( data, type, row ){
                            return util.formatCurrency(row.totalamount)
                        }
                    },
                    {data: 'balance' ,render: function ( data, type, row ){
                            return util.formatCurrency(row.balance)
                        }
                    },
                    {data:'orderdate',render: function ( data, type, row ){
                        // return ;
                        return 'Order Date: '+moment(row.orderdate).format('MM/DD/yyyy h:mm a')+'\
                            <br>\
                            <div class="text-muted">Date Created:' +moment(row.dateadded).format('MM/DD/yyyy h:mm a')+'</div>';
                        }
                    },
                    {data:'orderstatus',render: function ( data, type, row ){
                        let statusname = 'FULLY PAID';
                        let statuscolor = 'status-success';
                        switch(row.status){
                            case 1:
                                statusname = 'WITH BALANCE';
                                statuscolor = 'status-warning';
                                break;
                            case 2:
                                statusname = 'FULLY PAID';
                                statuscolor = 'status-success';
                                break;
                            case 3:
                            statusname = 'VOID';
                                statuscolor = 'status-error';
                                break;
                        }
                        
                        return '<div class="'+statuscolor+'">'+statusname+'</div>';
                        }
                    },
                ],
                serverSide:true,
                pageLength:30,
                rowId: 'orderid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [
                    {
                        targets: 0,
                        width: 45, 
                        className: 'action-col'
                    },
                    {
                        targets: 1,
                        width: 90,
                    },
                    {
                        targets: 2,
                        width: 190,
                    },
                    {
                        targets: 4,
                        width: 140,
                        className: 'numeric-col'
                    },
                    {
                        targets: 5,
                        width: 140,
                        className: 'numeric-col'
                    },
                    {
                        targets: 6,
                        width: 220,
                    },
                    {
                        targets: 7,
                        width: 100,
                        className: 'status-col'
                    },
                ],
                
                // bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblOrders tbody').on('click', '.view-items', function () {
                        var row = viewOrders.tblOrders.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveorderitems.params.orderid= data.orderid;
                        saveorderitems.params.totalamount= data.totalamount;
                        saveorderitems.params.remainingbalance= data.balance;

                    });
                    $('#tblOrders tbody').on('click', '.view-payment', function () {
                        var row = viewOrders.tblOrders.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveorderpayment.params.orderid= data.orderid;
                        saveorderpayment.params.totalamount= data.totalamount;
                        saveorderpayment.params.remainingbalance= data.balance;

                    });
                }

            });

            
        },
        reload: function(){
            viewOrders.tblOrders.table.ajax.reload();
        },
    },
    init: function(){
        //FOCUS ON FIRST INPUT
        viewOrders.queryContainer.find('#txtInvoiceNo').focus();
        viewOrders.queryContainer.find('#txtDateFrom').val(moment().startOf('month').format('YYYY-MM-DD'));
        viewOrders.queryContainer.find('#txtDateTo').val(moment().endOf('month').format('YYYY-MM-DD'));

        ////LOAD TABLE
        if ( ! $.fn.DataTable.isDataTable('#tblOrders' ) ) {
            viewOrders.tblOrders.init();
        }
        else{
            viewOrders.tblOrders.reload();
        }

        //SEARCH
        viewOrders.queryContainer.find('#txtInvoiceNo,#txtCustomerName,#txtReferenceNo,#txtDateFrom,#txtDateTo').keypress(function(event){
            if(event.keyCode == 13){
                viewOrders.tblOrders.reload();
            }
        });

        viewOrders.queryContainer.find('#txtDateFrom,#txtDateTo').change(function(event){
            viewOrders.tblOrders.reload();
        });

        viewOrders.queryContainer.find('#dpStore,#dpOrderStatus').change(function(){
            viewOrders.tblOrders.reload();
        });
    }
}

$(document).ready(function(){
    viewOrders.init();
});