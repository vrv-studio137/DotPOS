let saveproduct={
    modal:$('#modal-save-product'),
    params:{
        productid:0,
        productname:'',
        sku:'',
        status:'',
        categoryid:0,
        barcode:'0',
        description:'',
        shortcode:''
    },
    save: function(saveMode){
        $sku = saveproduct.modal.find('#txtSku').val();
        $shortcode = saveproduct.modal.find('#txtShortCode').val(); 
        $categoryid = saveproduct.modal.find('#dpCategory').val(); 
        $productname = saveproduct.modal.find('#txtProductName').val(); 
        $description = saveproduct.modal.find('#txtDescription').val(); 
        $barcode = saveproduct.modal.find('#txtBarcode').val(); 
        $status = saveproduct.modal.find('#dpStatus').val(); 
        $brand = saveproduct.modal.find('#txtBrand').val(); 


        $.ajax({
            type:'POST',
            url: 'product/save/',
            data:{
                csrfmiddlewaretoken: saveproduct.modal.find('#formSaveProduct input[name=csrfmiddlewaretoken]').val(),
                productid: saveproduct.params.productid,
                sku: $sku,
                shortcode: $shortcode,
                productname: $productname,
                categoryid: $categoryid,
                description: $description,
                barcode: $barcode,
                status: $status,
                brand: $brand
            },
            success:function(res){
                if(res.message=='success'){
                    util.showAlertSuccess(saveproduct.modal,'Product successfully saved');

                    
                    $('.was-validated').removeClass('was-validated');

                    switch(saveMode){
                        case 0:
                            if(saveproduct.params.productid == 0){
                                saveproduct.clearInputs()
                            }
                            saveproduct.modal.find('#txtProductName').focus();
                            break;
                        case 1:
                            saveproduct.clearInputs()

                            saveproduct.modal.find('#btnClose').click();
                            $('#modal-save-stock').modal('show');
                            break;
                        case 2:
                            saveproduct.clearInputs()

                            saveproduct.modal.find('#btnClose').click();
                            break;
                    }

                    saveproduct.modal.find('#formSaveProduct').addClass('was-validated');

                    viewProducts.tblProducts.reload();
                }else{
                    // for (let i = 0; i < res.message.length; ++i) {
                    //     let invalid = saveproductcategory.modal.find('#'+res.message[i][0]+'-invalid');
                    //     invalid.innerHtml = res.message[0][1];
                    //     alert(invalid.attr('id'));
                    // }
                    util.showAlertFail(saveproduct.modal,res.message[0][1],saveproduct.modal.find('input[name='+ res.message[0][0]+']'));
                }
                
            },
            fail: function(res){
                
            }
        });
    },
    resetParamter:function(){
        saveproduct.params.productid = 0;
        saveproduct.params.categoryid = 0;
        saveproduct.params.productname = '';
        saveproduct.params.shortcode = '';
        saveproduct.modal.find('#formSaveProduct')
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');
    },
    clearInputs:function(){
        saveproduct.modal.find('#formSaveProduct')
        .find("input[type=text],textarea,select")
            .val('')
            .end()
        .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();

    },
    init: function(){
        saveproduct.modal.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });

        //ON MODAL SHOW
        saveproduct.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            if(saveproduct.params.productid != 0){

                $.ajax({
                    type:'GET',
                    url: 'product/detail/get',
                    data:{
                        productid: saveproduct.params.productid,
                    },
                    success:function(res){
                        saveproduct.modal.find('.modal-title').html('Edit '+res.data.productname);
                        saveproduct.modal.find('#txtSku').val(res.data.sku);
                        saveproduct.modal.find('#txtProductName').val(res.data.productname);
                        saveproduct.modal.find('#txtShortCode').val(res.data.shortcode);
                        saveproduct.modal.find('#txtDescription').val(res.data.description);
                        saveproduct.modal.find('#txtBarcode').val(res.data.barcode);
                        saveproduct.modal.find('#dpCategory').val(res.data.categoryid);
                        saveproduct.modal.find('#dpStatus').val(res.data.status);
                        saveproduct.modal.find('#txtBrand').val(res.data.brand);
                    },
                    fail: function(res){
                        
                    }
                });

                saveproduct.modal.find('#btnSaveAndUpdateStock').hide();


            }else{
                saveproduct.modal.find('#btnSaveAndUpdateStock').show();

                saveproduct.modal.find('.modal-title').html('New Product');
                saveproduct.modal.find('#dpStatus').val(1);
            }


        });

        saveproduct.modal.on('shown.bs.modal',function(){
            saveproduct.modal.find('#txtProductName').focus();
        })

        //ON MODAL CLOSE
        saveproduct.modal.on('hidden.bs.modal', function () {
            util.hideAlert(saveproduct.modal);
            //RESET PARAMETER
            saveproduct.resetParamter();
        });

        //Submit
        saveproduct.modal.find('#btnSave').on('click',function(e){

            if (saveproduct.modal.find('#formSaveProduct')[0].checkValidity() === false) {
                e.preventDefault();
                e.stopPropagation();
                
            } 
            else {
                if(saveproduct.params.productid == 0){
                    saveproduct.save(0)
                }
                else{
                    util.confirmDialog('Confirmation','Save changes for this product?',function(){saveproduct.save(0)})
                }

                // saveproduct.save(0);
            }


        });

        saveproduct.modal.find('#btnSaveAndUpdateStock').on('click',function(){

            if (saveproduct.modal.find('#formSaveProduct')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                saveproduct.save(1);
            }

            saveproduct.modal.find('#formSaveProduct').addClass('was-validated');

        });
        
        saveproduct.modal.find('#btnSaveAndClose').on('click',function(){

            if (saveproduct.modal.find('#formSaveProduct')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if(saveproduct.params.productid == 0){
                    saveproduct.save(2);
                }
                else{
                    util.confirmDialog('Confirmation','Save changes for this product?',function(){saveproduct.save(2)})
                }
            }

            saveproduct.modal.find('#formSaveProduct').addClass('was-validated');

        });

        window.addEventListener("beforeunload", function (e) {
            if (saveproduct.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
        });

        // window.onbeforeunload = function() {
        //     if (saveproduct.modal.hasClass('show')) {
        //         return 'Changes you made may not be saved.';
        //     }
        //     return undefined;
        // }
    }

}


$(document).ready(function(){
    saveproduct.init();
});