let addquantity={
    modal:$('#modal-quantity'),
    params:{
        stockid:0,
        productid:0,
        productname:'',
        sku:'',
        stock:0,
        categoryid:0,
        price:0,
        barcode:'0',
        description:'',
        shortcode:''
    },
    confirmQuantity: function(){
        $stockid = addquantity.params.stockid;
        $productid = addquantity.params.productid;
        $sku = addquantity.params.sku;
        $shortcode = addquantity.params.shortcode;
        $categoryid = addquantity.params.categoryid;
        $productname = addquantity.params.productname;
        $barcode = addquantity.params.barcode;
        $stock = addquantity.params.stock;
        $quantity = addquantity.modal.find('#txtQuantity').val();
        $price = addquantity.params.price;

        let _checkId = $('#tblCart #'+$productid);

        if(_checkId.length==0){

            cashierView.tblCart.addProduct($stockid,$productid,$quantity,$sku,$productname,$price,$stock);
            addquantity.modal.find('#btnClose').click();
            $('#txtSearchKey').focus();
        }else{
            cashierView.tblCart.updateProduct($productid,$quantity,$price)
            addquantity.modal.find('#btnClose').click();
            $('#txtSearchKey').focus();

        }

        
    },
    resetParamter:function(){
        addquantity.params.productid = 0;
        addquantity.params.stockid = 0;
        addquantity.params.categoryid = 0;
        addquantity.params.productname = '';
        addquantity.params.shortcode = '';
        addquantity.params.price = 0;
        
        addquantity.modal
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
    },
    clearInputs:function(){
        addquantity.modal.find('#formaddquantity')
        .find("input[type=text],textarea,select")
            .val('')
            .end()
        .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();

    },
    hotkeys:function(){
        document.addEventListener("keydown", e => {
            let modalClosed = $('#modal-quantity').hasClass('show');
            if(modalClosed){
                if(e.key === "F12") {
                    e.preventDefault();
                    addquantity.confirmQuantity();
                }
            }
            
        })
    },
    init: function(){
        addquantity.hotkeys();
        addquantity.modal.find('input[type="text"],input[type="number"]').on('focus',function(){
            $(this).select();
        });

        //ON MODAL SHOW
        addquantity.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            if(addquantity.params.productid != 0){
                let cartRow = $('#tblCart #'+addquantity.params.productid);
                let cartQuantity = $('#quantity_'+addquantity.params.productid);

                let stock = addquantity.params.stock;

                if(cartRow.length>0){
                    if(cartQuantity.length>0){
                        stock = parseFloat(addquantity.params.stock) - parseFloat(cartQuantity.val());
                    }
                }

                addquantity.modal.find('#lblProductName').html(addquantity.params.productname);
                addquantity.modal.find('#lblSkuBarcode').html(addquantity.params.sku+' | '+addquantity.params.barcode);
                addquantity.modal.find('#txtStock').val(stock);
                addquantity.modal.find('#txtPrice').val(util.formatCurrency(addquantity.params.price));
                addquantity.modal.find('#txtQuantity').attr('max',addquantity.params.stock)
            }

        });

        addquantity.modal.on('shown.bs.modal',function(){
            addquantity.modal.find('#txtQuantity').focus();
        })

        //ON MODAL CLOSE
        addquantity.modal.on('hidden.bs.modal', function () {
            util.hideAlert(addquantity.modal);
            //RESET PARAMETER
            addquantity.resetParamter();
        });

        //Submit
        addquantity.modal.find('#btnAdd').on('click',function(e){
            if(parseFloat(addquantity.modal.find('#txtQuantity').val())>0){
                addquantity.confirmQuantity();
            }
           
        });

        addquantity.modal.find('#txtQuantity').keypress(function(event){
            if(event.keyCode == 13){
                if(parseFloat(addquantity.modal.find('#txtQuantity').val())>0){
                    addquantity.confirmQuantity();
                }
            }
        });

        addquantity.modal.find("#txtQuantity").on('keyup',function(e){

            let stock = addquantity.params.stock;
            let maxval = stock;
            let cartQuantity = $('#quantity_'+addquantity.params.productid);


            if(cartQuantity.length>0){
                maxval = parseFloat(stock) - parseFloat(cartQuantity.val());
            }
            
            if(parseInt(this.value) < 0 || isNaN(parseInt(this.value))) 
                addquantity.modal.find("#txtQuantity").val(0); 
            else if(parseInt(this.value) > maxval) 
                addquantity.modal.find("#txtQuantity").val(maxval);
        });


        window.addEventListener("beforeunload", function (e) {
            if (addquantity.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
        });

        // window.onbeforeunload = function() {
        //     if (addquantity.modal.hasClass('show')) {
        //         return 'Changes you made may not be saved.';
        //     }
        //     return undefined;
        // }
    }

}


$(document).ready(function(){
    addquantity.init();
});