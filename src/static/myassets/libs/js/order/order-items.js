let saveorderitems={
    modal:$('#modal-order-items'),
    params:{
        orderid:0,
        totalamount:0,
        remainingbalance:0,
    },
    tblOrderItems:{
        table:null,
        init:function () {
            // alert();
            
            saveorderitems.tblOrderItems.table = saveorderitems.modal.find('#tblOrderItems').DataTable({
                ajax:{
                    url:'order/items/get',
                    type:'GET',
                    data: function(data){
                        $orderid = saveorderitems.params.orderid;
                        data.orderid = $orderid;
                    },
                    dataSrc:'data'
                },
                columns:[
                   
                    {data: 'quantity'},
                    {data:'productname',render: function ( data, type, row ){
                            return '['+row.shortcode+'] '+row.productname+'\
                                <br> <small class="text-muted">'+row.sku+'</small>\
                            ';
                        }
                    },
                    {data: 'unitprice' ,render: function ( data, type, row ){
                            return util.formatCurrency(row.unitprice)
                        }
                    },
                    {data: 'totalprice' ,render: function ( data, type, row ){
                        return util.formatCurrency(row.quantity * row.unitprice)
                    }
                },
                ],
                serverSide:true,
                bPaginate:false,
                rowId: 'orderitemid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [
                    {
                        targets: 0,
                        width: 70,
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
                ],
                
                bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblOrderItems tbody').on('click', '.edit-store', function () {
                        var row = saveorderitems.tblOrderItems.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveorderitems.params.orderid= data.orderid;

                    });
                    
                }

            });

            
        },
        reload: function(){
            saveorderitems.tblOrders.table.ajax.reload();
        },
    },
    details:function(){
        if(saveorderitems.params.productid != 0){

            $.ajax({
                type:'GET',
                url: 'orders/detail/get',
                data:{
                    orderid: saveorderitems.params.orderid,
                },
                success:function(res){
                    let dateAdded = moment(res.data.dateadded, 'YYYY-MM-DD');
                    let orderdate = moment(res.data.orderdate, 'YYYY-MM-DD');
                    saveorderitems.modal.find('#txtSku').val(res.data.sku);
                    saveorderitems.modal.find('#txtInvoiceNo').val(res.data.invoiceno);
                    saveorderitems.modal.find('#txtReferenceNo').val(res.data.referenceno);
                    saveorderitems.modal.find('#txtOrderDate').val(orderdate.format('YYYY-MM-DD'));
                    saveorderitems.modal.find('#txtCustomerName').val(res.data.customername);
                    saveorderitems.modal.find('#txtCustomerAddress').val(res.data.customeraddress);
                    saveorderitems.modal.find('#txtTinNo').val(res.data.customertin);

                },
                fail: function(res){
                    
                }
            });
        }

        saveorderitems.modal.find('#lblTotalAmount').html(util.formatCurrency(saveorderitems.params.totalamount))
        saveorderitems.modal.find('#lblPaidAmount').html(util.formatCurrency(saveorderitems.params.totalamount-saveorderitems.params.remainingbalance))
        saveorderitems.modal.find('#lblRemainingBalance').html(util.formatCurrency(saveorderitems.params.remainingbalance))
    },
    save: function(status){
        $referenceno = saveorderitems.modal.find('#txtReferenceNo').val();
        $customername = saveorderitems.modal.find('#txtCustomerName').val();
        $customeraddress = saveorderitems.modal.find('#txtCustomerAddress').val();
        $customertin = saveorderitems.modal.find('#txtTinNo').val();
        $orderdate = saveorderitems.modal.find('#txtOrderDate').val();


       
        $.ajax({
            type:'POST',
            url: 'order/save/',
            data:{
                csrfmiddlewaretoken: saveorderitems.modal.find('#formSaveOrder input[name=csrfmiddlewaretoken]').val(),
                orderid: saveorderitems.params.orderid,
                referenceno: $referenceno,
                customername: $customername,
                customeraddress: $customeraddress,
                customertin: $customertin,
                orderdate: $orderdate,
            },
            success:function(res){
                if(res.message=='success'){
                    util.showAlertSuccess(saveorderitems.modal,'Order saved successfully');
                    viewOrders.tblOrders.reload();
                }else{
                    util.showAlertFail(saveorderitems.modal,res.message[0][1],saveorderitems.modal.find('input[name='+ res.message[0][0]+']'));
                }
            },
            fail: function(res){
                
            }
        });
    },
    resetParamter:function(){
        saveorderitems.params.orderid = 0;
        saveorderitems.params.totalamount = 0;
        saveorderitems.params.remainingbalance = 0;
        saveorderitems.modal.find('#formSaveProduct')
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');
    },
    init: function(){
        saveorderitems.modal.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });

        //ON MODAL SHOWN
        saveorderitems.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            saveorderitems.details();

            // if(saveorderitems.params.categoryid != 0){
            //     saveorderitems.modal.find('.card-title').html('Edit '+saveorderitems.params.categoryname);
            //     saveorderitems.modal.find('#txtAddShortCode').val(saveorderitems.params.shortcode);
            //     saveorderitems.modal.find('#txtAddCategoryName').val(saveorderitems.params.categoryname);
            //     saveorderitems.modal.find('#btnSaveAddMore').hide();
            // }else{
            //     saveorderitems.modal.find('.card-title').html('New Category');
            //     saveorderitems.modal.find('#btnSaveAddMore').show();
            // }


        });

        saveorderitems.modal.on('shown.bs.modal',function(){
            saveorderitems.modal.find('#txtAddShortCode').focus();
            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#modal-order-items #tblOrderItems') ) {
                saveorderitems.tblOrderItems.init();
            }
            else{
                saveorderitems.tblOrderItems.reload();
            }
        });

        //ON MODAL CLOSE
        saveorderitems.modal.on('hidden.bs.modal', function () {
            util.hideAlert(saveorderitems.modal);

            //RESET PARAMETER
            saveorderitems.resetParamter();
        });

        //Submit
        saveorderitems.modal.find('#btnSave').on('click',function(){

            if (saveorderitems.modal.find('#formSaveOrder')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {

                if(saveorderitems.params.orderid == 0){
                    saveorderitems.save();
                }else{
                    util.confirmDialog('Confirmation','Save changes for this order?',function(){saveorderitems.save(true)})
                }

            }

            saveorderitems.modal.find('#formSaveOrder').addClass('was-validated');

        });

      
        window.onbeforeunload = function() {
            if (saveorderitems.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }

    }

}

$(document).ready(function(){
    saveorderitems.init();
});