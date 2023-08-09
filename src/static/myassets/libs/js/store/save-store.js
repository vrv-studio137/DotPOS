let savestore={
    modal:$('#modal-save-store'),
    params:{
        storeid:0
    },
    save: function(saveMode){
        $status = savestore.modal.find('#dpStatus').val(); 
        $storename = savestore.modal.find('#txtStoreName').val();
        $storeno = savestore.modal.find('#txtStoreNo').val(); 
        $type = savestore.modal.find('#dpType').val(); 
        $address = savestore.modal.find('#txtAddress').val(); 

        $.ajax({
            type:'POST',
            url: 'store/save/',
            data:{
                csrfmiddlewaretoken: savestore.modal.find('#formSaveStore input[name=csrfmiddlewaretoken]').val(),
                storeid: savestore.params.storeid,
                status: $status,
                storename: $storename,
                storeno: $storeno,
                typeid: $type,
                address: $address,
            },
            success:function(res){
                if(res.message=='success'){
                    util.showAlertSuccess(savestore.modal,'Store successfully saved');

                   
                    switch(saveMode){
                        case 0:
                            if(savestore.params.storeid == 0){
                                savestore.clearInputs();
                            }
                            savestore.modal.find('#txtStoreName').focus();
                            break;
                        case 1:
                            savestore.clearInputs()

                            savestore.modal.find('#btnClose').click();
                            break;
                        case 3:
                            break;
                        }

                }else{
                    // for (let i = 0; i < res.message.length; ++i) {
                    //     let invalid = savestore.modal.find('#'+res.message[i][0]+'-invalid');
                    //     invalid.innerHtml = res.message[0][1];
                    //     alert(invalid.attr('id'));
                    // }
                    util.showAlertFail(savestore.modal,res.message[0][1],savestore.modal.find('input[name='+ res.message[0][0]+']'));
                }
                viewStores.tblStores.reload();
            },
            fail: function(res){
                
            }
        });
    },
    resetParamter:function(){
        savestore.params.storeid = 0;
        savestore.modal.find('#formSaveStore')
                .find("input[type=text],textarea,select")
                    .val('')
                    .end()
                .find("input[type=checkbox], input[type=radio]")
                    .prop("checked", "")
                    .end();

                $('.was-validated').removeClass('was-validated');
    },
    clearInputs:function(){
        savestore.modal.find('#formSaveStore')
        .find("input[type=text],textarea,select")
            .val('')
            .end()
        .find("input[type=checkbox], input[type=radio]")
            .prop("checked", "")
            .end();

    },
    init: function(){
        savestore.modal.find('input[type="text"]').on('focus',function(){
            $(this).select();
        });

        //ON MODAL SHOWN
        savestore.modal.on('show.bs.modal', function () {
            //FOCUS ON FIRST INPUT
            if(savestore.params.storeid != 0){
                savestore.modal.find('#btnSaveAndAddAnother').hide();
                savestore.modal.find('#btnSaver').show();
                $.ajax({
                    type:'GET',
                    url: 'store/detail/get',
                    data:{
                        storeid: savestore.params.storeid,
                    },
                    success:function(res){
                        savestore.modal.find('.modal-title').html('Edit '+res.data.storename);
                        savestore.modal.find('#txtStoreName').val(res.data.storename);
                        savestore.modal.find('#txtStoreNo').val(res.data.storeno);
                        savestore.modal.find('#dpType').val(res.data.typeid);
                        savestore.modal.find('#dpStatus').val(res.data.status);
                        savestore.modal.find('#txtAddress').val(res.data.address);
                    },
                    fail: function(res){
                        
                    }
                });
            }else{
                savestore.modal.find('.card-title').html('New Store');
                savestore.modal.find('#btnSaveAndAddMore').show();
                savestore.modal.find('#btnSaver').hide();
            }


        });

        savestore.modal.on('shown.bs.modal',function(){
            savestore.modal.find('#txtStoreName').focus();
        });

        //ON MODAL CLOSE
        savestore.modal.on('hidden.bs.modal', function () {
            util.hideAlert(savestore.modal);

            //RESET PARAMETER
            savestore.resetParamter();
        });

        //Submit
        savestore.modal.find('#btnSaveAndAddAnother').on('click',function(){

            if (savestore.modal.find('#formSaveStore')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {

                if(savestore.params.storeid == 0){
                    savestore.save(0);
                }else{
                    util.confirmDialog('Confirmation','Save changes for this store?',function(){savestore.save(0)})
                }

            }

            savestore.modal.find('#formSaveStore').addClass('was-validated');

        });

        savestore.modal.find('#btnSaveAndClose').on('click',function(){
            
            if ($('#formSaveStore')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if(savestore.params.categoryid == 0){
                    savestore.save(1);
                }else{
                    util.confirmDialog('Confirmation','Save changes for this store?',function(){savestore.save(1)})
                }
            }

            savestore.modal.find('#formSaveStore').addClass('was-validated');

        });

        savestore.modal.find('#btnSave').on('click',function(){
            
            if ($('#formSaveStore')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                if(savestore.params.categoryid == 0){
                    savestore.save(3);
                }else{
                    util.confirmDialog('Confirmation','Save changes for this store?',function(){savestore.save(3)})
                }
            }

            savestore.modal.find('#formSaveStore').addClass('was-validated');

        });

        window.onbeforeunload = function() {
            if (savestore.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }

    }

}

$(document).ready(function(){
    savestore.init();
});