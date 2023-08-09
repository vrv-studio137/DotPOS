let viewproductstock={
    modal:$('#modal-save-stock'),
    params:{
        productid:0,
    },
    tblProductStock:{
        table:null,
        init:function () {    
            viewproductstock.tblProductStock.table = viewproductstock.modal.find('#tblProductStock').DataTable({
                ajax:{
                    url:'stock/get',
                    type:'GET',
                    data: function(data){
                        $productid = viewproductstock.params.productid;
                        data.productid = $productid;

                    },
                    dataSrc:'data'
                },
                columns:[
                    { data: 'storename' },
                    
                    {data:'stock',render: function ( data, type, row ){
                            return '<input id="stock_'+row.stockid+'" type="number" value="'+row.stock+'">';
                        }
                    },
                    {data:'price',render: function ( data, type, row ){
                            return '<input id="price_'+row.stockid+'" type="number" value="'+row.price+'">';
                        }
                    },
                    {data:'discountprice',render: function ( data, type, row ){
                        return '<input id="discountprice_'+row.stockid+'" type="number" value="'+row.discountprice+'">';
                        }
                    },
                    {data:'threshold',render: function ( data, type, row ){
                        return '<input id="threshold_'+row.stockid+'" type="number" value="'+row.threshold+'">';
                    }
                },

                ],
                serverSide:true,
                pageLength:10,
                rowId: 'stockid',
                searching: false,
                ordering:  false,
                bLengthChange : false, //thought this line could hide the LengthMenu
                // bInfo:false,    
                columnDefs: [{
                    targets: 1,
                    width:150
                },{
                    targets: 2,
                    width:150
                },{
                    targets: 3,
                    width:150
                },{
                    targets: 4,
                    width:150
                }],
                initComplete:function(settings, json) {
                    // viewproductstock.modal.find("#tblProductStock tr:nth-of-type(1) input").focus();
                    viewproductstock.modal.find("#tblProductStock input").first().focus();
                }
            });

            
        },
        reload: function(){
            viewproductstock.tblProductStock.table.ajax.reload();
        },
    },
    save: function(saveMode){
        var table = viewproductstock.tblProductStock.table;
        var data = [];
        
        table.rows().every( function ( index ) {
            var stockid = this.id();
            var threshold = $(this.node() ).find('#threshold_'+stockid).val();
            var quantity = $(this.node() ).find('#stock_'+stockid).val();
            var price = $(this.node() ).find('#price_'+stockid).val();
            var discountprice = $(this.node() ).find('#discountprice_'+stockid).val();
            stock ={
                stockid:stockid,
                threshold:threshold,
                stock:quantity,
                price: price,
                discountprice: discountprice
            }
            
            data.push(stock);
        } );

        $.ajax({
            type:'POST',
            url: 'stock/save/',
            data:{
                csrfmiddlewaretoken: viewproductstock.modal.find('#formSaveProductStock input[name=csrfmiddlewaretoken]').val(),
                data:JSON.stringify(data)
            },
            success:function(res){
                util.showAlertSuccess(viewproductstock.modal,'Product successfully saved');

                if(res.message=='success'){
                    switch(saveMode){
                        case 0:
                            //save
                            // util.hideAlert(viewproductstock.modal);
                            break;
                        case 1:
                            //save and update product
                            viewproductstock.modal.find('#btnClose').click();
                            saveproduct.params.productid= 0;
                            saveproduct.modal.modal("show");
                            break;
                        case 3:
                            //save and update product
                            viewproductstock.modal.find('#btnClose').click();
                            saveproduct.params.productid= viewproductstock.params.productid;
                            saveproduct.modal.modal("show");
                            break;
                        case 2:
                            //save and close
                            viewproductstock.modal.find('#btnClose').click();
                            break;
                    }
                    viewProducts.tblProducts.reload();

                }else{
                    util.showAlertFail(viewproductstock.modal,res.message[0][1],viewproductstock.modal.find('input[name='+ res.message[0][0]+']'));
                }
                
            },
            fail: function(res){
                
            }
        });
    },
    init: function(){
        viewproductstock.modal.on('show.bs.modal', function (e) {
            var newproduct = $(e.relatedTarget).data('newproduct');
            if(newproduct ==false){
                viewproductstock.modal.find('#btnSaveAddMore').hide();
            }
            else{
                viewproductstock.modal.find('#btnSaveAddMore').show();

            }
        });

        //ON MODAL SHOWN
        viewproductstock.modal.on('shown.bs.modal', function () {
           
            ////LOAD TABLE
            if ( ! $.fn.DataTable.isDataTable('#tblProductStock' ) ) {
                viewproductstock.tblProductStock.init();
            }
            else{
                viewproductstock.tblProductStock.reload();
            }
        });

        viewproductstock.modal.on('hide.bs.modal', function () {
            util.hideAlert(viewproductstock.modal);
        });

        //Submit
        

        viewproductstock.modal.find('#btnSave').on('click',function(){

            if (viewproductstock.modal.find('#formSaveProductStock')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                viewproductstock.save(0);
            }

            viewproductstock.modal.find('#formSaveProductStock').addClass('was-validated');

        });

        viewproductstock.modal.find('#btnSaveAddMore').on('click',function(){

            if (viewproductstock.modal.find('#formSaveProductStock')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                viewproductstock.save(1);
            }

            viewproductstock.modal.find('#formSaveProductStock').addClass('was-validated');

        });

        viewproductstock.modal.find('#btnSaveUpdateProduct').on('click',function(){

            if (viewproductstock.modal.find('#formSaveProductStock')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                viewproductstock.save(3);
            }

            viewproductstock.modal.find('#formSaveProductStock').addClass('was-validated');

        });

        viewproductstock.modal.find('#btnSaveClose').on('click',function(){

            if (viewproductstock.modal.find('#formSaveProductStock')[0].checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                viewproductstock.save(2);
            }

            viewproductstock.modal.find('#formSaveProductStock').addClass('was-validated');

        });

        window.onbeforeunload = function() {
            if (viewproductstock.modal.hasClass('show')) {
                return 'Changes you made may not be saved.';
            }
            return undefined;
            }
    }

}


$(document).ready(function(){
    viewproductstock.init();
});