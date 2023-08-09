let saveorderpayment={
    modal:$('#modal-order-payment'),
    params:{
        orderid:0,
        totalamount:0,
        remainingbalance:0,
    },
    tblOrderPayment:{
        table:null,
        init:function () {
            saveorderpayment.tblOrderPayment.table = saveorderpayment.modal.find('#tblOrderPayment').DataTable({
                ajax:{
                    url:'payment/get',
                    type:'GET',
                    data: function(data){
                        $orderid = saveorderpayment.params.orderid;
                        data.orderid = $orderid;
                    },
                    dataSrc:'data'
                },
                columns:[
                   
                    {data:'paymentid',render: function ( data, type, row ){
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
                    {data: 'dateadded' ,render: function ( data, type, row ){
                            return moment(row.dateadded).format('MM/DD/yyyy h:mm a')
                        }
                    },
                    {data: 'amount' ,render: function ( data, type, row ){
                            return util.formatCurrency(row.amount)
                        }
                    },
                ],
                serverSide:true,
                bPaginate:false,
                rowId: 'paymentid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                columnDefs: [
                    {
                        targets: 0,
                        width: 45, 
                        className: 'action-col'
                    },
                    // {
                    //     targets: 1,
                    //     width: 200,
                    // },
                    {
                        targets: 2,
                        width: 200,
                        className: 'numeric-col'
                    },
                ],
                bInfo:false,
                initComplete:function(settings, json) {
                    $('#tblOrderPayment tbody').on('click', '.edit-store', function () {
                        var row = saveorderpayment.tblOrderItems.table.row($(this).closest('tr'));
                        var data = row.data();

                        saveorderpayment.params.orderid= data.orderid;

                    });
                }
            });

            
        },
        reload: function(){
            saveorderpayment.tblOrders.table.ajax.reload();
        },
    },
    details:function(){
        if(saveorderpayment.params.productid != 0){

            $.ajax({
                type:'GET',
                url: 'orders/detail/get',
                data:{
                    orderid: saveorderpayment.params.orderid,
                },
                success:function(res){
                    let orderdate = moment(res.data.orderdate, 'YYYY-MM-DD');
                    saveorderpayment.modal.find('#txtInvoiceNo').val(res.data.invoiceno);
                    saveorderpayment.modal.find('#txtReferenceNo').val(res.data.referenceno);
                    saveorderpayment.modal.find('#txtOrderDate').val(orderdate.format('YYYY-MM-DD'));
                    saveorderpayment.modal.find('#txtRemainingBalance').val(util.formatCurrency(res.data.balance));
                    saveorderpayment.modal.find('#lblTotalAmount').html(util.formatCurrency(res.data.totalamount))
                    saveorderpayment.modal.find('#lblPaidAmount').html(util.formatCurrency(res.data.totalamount-res.data.balance))
                    saveorderpayment.modal.find('#lblRemainingBalance').html(util.formatCurrency(res.data.balance))
                    
                    saveorderpayment.modal.find("#txtPayment").attr('max',res.data.balance);
                    saveorderpayment.modal.find("#txtPayment").on('keyup',function(e){

                        let maxval = res.data.balance;

                        if(parseFloat(this.value) < 0 || isNaN(parseFloat(this.value))) 
                            saveorderpayment.modal.find("#txtPayment").val(0); 
                        else if(parseFloat(this.value) > maxval) 
                            saveorderpayment.modal.find("#txtPayment").val(maxval);
                    });

                    if(res.data.balance >0){
                        
                        saveorderpayment.modal.find("#txtPayment").prop('readonly', false);
                        saveorderpayment.modal.find("#txtOrderDate").prop('readonly', false);
                    }else{
                        saveorderpayment.modal.find("#txtPayment").prop('readonly', true);
                        saveorderpayment.modal.find("#txtOrderDate").prop('readonly', true);
                    }
                },
                fail: function(res){
                    
                }
            });
        }

        saveorderpayment.modal.find('#txtPaymentDate').val(moment().format('YYYY-MM-DD'));
        
    },
    save: function(status){
        $orderid = saveorderpayment.params.orderid;
        $orderdate = saveorderpayment.modal.find('#txtOrderDate').val();

        $.ajax({
            type:'POST',
            url: 'payment/save/',
            data:{
                csrfmiddlewaretoken: saveorderpayment.modal.find('#formSavePayment input[name=csrfmiddlewaretoken]').val(),
                orderid: saveorderpayment.params.orderid,
                orderdate: $orderdate,
            },
            success:function(res){
                if(res.message=='success'){
                    util.showAlertSuccess(saveorderpayment.modal,'Payment saved successfully');
                    viewOrders.tblOrders.reload();
                }else{
                    util.showAlertFail(saveorderpayment.modal,res.message[0][1],saveorderpayment.modal.find('input[name='+ res.message[0][0]+']'));
                }
            },
            fail: function(res){
                
            }
        });
    },
    resetParamter:function(){
        saveorderpayment.params.orderid = 0;
        saveorderpayment.params.totalamount = 0;
        saveorderpayment.params.remainingbalance = 0;
        saveorderpayment.modal.find('#formSaveProduct')
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');
    },
    init: function(){
        saveorderpayment.modal.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });
        saveorderpayment.modal.find("#txtPayment").attr('min',0);
        //ON MODAL SHOWN
        saveorderpayment.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            saveorderpayment.details();

        });

        saveorderpayment.modal.on('shown.bs.modal',function(){
            saveorderpayment.modal.find('#txtAddShortCode').focus();
            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#modal-order-payment #tblOrderPayment') ) {
                saveorderpayment.tblOrderPayment.init();
            }
            else{
                saveorderpayment.tblOrderPayment.reload();
            }
        });

        //ON MODAL CLOSE
        saveorderpayment.modal.on('hidden.bs.modal', function () {
            util.hideAlert(saveorderpayment.modal);

            //RESET PARAMETER
            saveorderpayment.resetParamter();
        });

        //Submit
        saveorderpayment.modal.find('#btnSave').on('click',function(){

            if (saveorderpayment.modal.find('#formSavePayment')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {

                if(saveorderpayment.modal.find("#txtPayment").val() > 0 && saveorderpayment.modal.find("#txtPayment").val() <= saveorderpayment.params.remainingbalance){
                    saveorderpayment.save();
                }
                else{
                    // util.confirmDialog('Confirmation','Save changes for this order?',function(){saveorderpayment.save(true)})
                }

            }

            saveorderpayment.modal.find('#formSaveOrder').addClass('was-validated');

        });

      
        window.onbeforeunload = function() {
            if (saveorderpayment.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }

    }

}

$(document).ready(function(){
    saveorderpayment.init();
});