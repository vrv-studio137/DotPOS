let checkout={
    modal:$('#modal-checkout'),
    params:{
        invoiceno:'',
        totalamount:0
    },
    getInvoiceNo:function(){
        $.ajax({
            url: "salesinvoice/get",
            type: 'GET',
            success: function(res) {
                console.log(res);
                checkout.params.invoiceno = res.salesinvoice;
                checkout.modal.find('#txtInvoiceNo').val(res.salesinvoice);
                checkout.modal.find('#txtReferenceNo').val(res.salesinvoice);
                
            }
        });
    },
    save: function(status){
        $salesinvoice = checkout.modal.find('#txtInvoiceNo').val(); 
        $referenceno = checkout.modal.find('#txtReferenceNo').val();
        $totalamount = checkout.modal.find('#txtTotalAmount').val(); 
        $amounttendered = checkout.modal.find('#txtAmountTendered').val();
        $customername = checkout.modal.find('#txtCustomerName').val();
        $address = checkout.modal.find('#txtAddress').val();
        $orderdate = checkout.modal.find('#txtOrderDate').val();
        $tin = checkout.modal.find('#txtTin').val();

        var table = cashierView.tblCart.table;

        var data = [];
        
        table.rows().every( function ( index ) {
            var productid = $(this.node()).prop('id');
            var stockid = $(this.node() ).find('#quantity_'+productid).data('stockid');
            var quantity = $(this.node() ).find('#quantity_'+productid).val();
            var unitprice = parseFloat($(this.node() ).find('#unitprice_'+productid).html().replace(',',''));
            var product ={
                stockid:stockid,
                productid:productid,
                quantity:quantity,
                unitprice: unitprice
            }
            
            data.push(product);
        } );

        $.ajax({
            type:'POST',
            url: 'order/save/',
            data:{
                csrfmiddlewaretoken: checkout.modal.find('#formCheckout input[name=csrfmiddlewaretoken]').val(),
                salesinvoice: $salesinvoice,
                referenceno: $referenceno,
                totalamount: $totalamount,
                amounttendered: $amounttendered,
                customername: $customername,
                customeraddress: $address,
                customertin: $tin,
                orderstatus:status,
                orderdate:$orderdate,
                data:JSON.stringify(data)
            },
            success:function(res){
                if(res.message=='success'){
                    $('#modalChange').find('#lblChange').html(util.formatCurrency(checkout.modal.find('#txtChange').val()));
                    checkout.clearInputs();

                    checkout.modal.modal('hide');

                    cashierView.tblCart.table.clear().draw()
                    cashierView.tblProducts.table.ajax.reload()

                    $('#modalChange').modal('show');
                    $('#modalChange #btnConfirm').focus();
                }else{
                    // for (let i = 0; i < res.message.length; ++i) {
                    //     let invalid = checkout.modal.find('#'+res.message[i][0]+'-invalid');
                    //     invalid.innerHtml = res.message[0][1];
                    //     alert(invalid.attr('id'));
                    // }
                    util.showAlertFail(checkout.modal,res.message[0][1],checkout.modal.find('input[name='+ res.message[0][0]+']'));
                }
            },
            fail: function(res){
                
            }
        });
    },
    hotkeys:function(){
        document.addEventListener("keydown", e => {
            let modalOpen = $('#modal-checkout').hasClass('show') && $('#modal-checkout').hasClass('ready');
            if(modalOpen){
                if(e.key === "F1") {
                    e.preventDefault();
                    checkout.modal.find('#txtCustomerName').focus();
                }
                if(e.key === "F12") {
                    e.preventDefault();
                    checkout.save(2);
                }
            }
            
        })
    },
    resetParamter: function(){
        checkout.params.totalamount = 0;
        
        checkout.modal
                .find("input[type=number],textarea,select")
                    .val('')
                    .end()
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');

        checkout.modal.find('#txtAmountTendered').val(0.00);
    },
    clearInputs:function(){
        checkout.modal.find('#formcheckout')
        .find("input[type=text],textarea,select")
            .val('')
            .end()
        .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();

    },
    init: function(){
        checkout.modal.find('#txtOrderDate').prop('max', function(){
            return new Date().toJSON().split('T')[0];
        });
        
        checkout.hotkeys();
        checkout.modal.find('input[type="text"],input[type="number"]').on('focus',function(){
            $(this).select();
        });


        //ON MODAL SHOW
        checkout.modal.on('show.bs.modal', function () {
            checkout.getInvoiceNo();
            checkout.modal.find('#txtTotalAmount').val(checkout.params.totalamount);
            checkout.modal.find('#lblTotalAmount').html(util.formatCurrency(checkout.params.totalamount));
            checkout.modal.find('#txtOrderDate').val(moment().format('YYYY-MM-DD'));

            let amountTendered = parseFloat(checkout.modal.find('#txtAmountTendered').val());
            let totalAmount = parseFloat(checkout.modal.find('#txtTotalAmount').val());
            let balance =  totalAmount-amountTendered;
            if(balance <0){
                balance = 0.00;
            }
            checkout.modal.find('#lblRemainingBalance').html(util.formatCurrency(balance));

        });

        checkout.modal.on('shown.bs.modal',function(){
            checkout.modal.find('#txtAmountTendered').focus();
            $('#modal-checkout').addClass('ready');
        })

        //ON MODAL CLOSE
        checkout.modal.on('hidden.bs.modal', function () {
            util.hideAlert(checkout.modal);
            //RESET PARAMETER
            checkout.resetParamter();
            $('#modal-checkout').removeClass('ready');
        });


        checkout.modal.find('#txtAmountTendered').on('keyup',function(){
            let amountTendered = parseFloat(checkout.modal.find('#txtAmountTendered').val());
            let totalAmount = parseFloat(checkout.modal.find('#txtTotalAmount').val());
            let change =  amountTendered-totalAmount;
            let balance =  totalAmount-amountTendered;
            if(change <0 || isNaN(change)){
                change = 0.00;
            }
            if(isNaN(balance)){
                balance = totalAmount;
            }
            else if(balance <0){
                balance = 0.00;
            }
            checkout.modal.find('#txtChange').val(change);
            checkout.modal.find('#lblChange').html(util.formatCurrency(change));
            checkout.modal.find('#lblRemainingBalance').html(util.formatCurrency(balance));
        });

        checkout.modal.find('#btnCheckout').on('click',function(){
            checkout.save(2);
        });

        window.addEventListener("beforeunload", function (e) {
            if (checkout.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
        });

        // window.onbeforeunload = function() {
        //     if (checkout.modal.hasClass('show')) {
        //         return 'Changes you made may not be saved.';
        //     }
        //     return undefined;
        // }
    }

}


$(document).ready(function(){
    checkout.init();
});