const util ={
    hideAlert: function(modal){
        modal.find('.alert').hide();
    },
    showAlertSuccess: function(modal,message){
        if(modal.find('.alert').hasClass('d-none')){
            modal.find('.alert').removeClass('d-none')
        }
        if(modal.find('.alert').hasClass('alert-danger')){
            modal.find('.alert').removeClass('alert-danger')
        }
        if(!modal.find('.alert').hasClass('alert-success')){
            modal.find('.alert').addClass('alert-success')
        }
        modal.find('.alert-text').html("");
        modal.find('.alert-text').append(message);
        modal.find('.alert').show();
        modal.find('.alert').delay(3000).fadeOut(function() {
            // $(this).remove(); 
        });
    
    },
    showAlertFail:function(modal,message,el){
        if(modal.find('.alert').hasClass('d-none')){
            modal.find('.alert').removeClass('d-none')
        }
        if(modal.find('.alert').hasClass('alert-success')){
            modal.find('.alert').removeClass('alert-success')
        }
        if(!modal.find('.alert').hasClass('alert-danger')){
            modal.find('.alert').addClass('alert-danger')
        }
        
        modal.find('.alert-text').html("");
        modal.find('.alert-text').append(message);
        modal.find('.alert').show();
        el.focus();
        // modal.find('.alert').delay(3000).fadeOut(function() {
        //     // $(this).remove(); 
        // });
    },
    confirmDialog: function (title,message,callback) {
        $.alert({
            title: title,
            type:'blue',
            icon: 'fa fa-check',
            content: message,
            escapeKey: 'cancel',
            buttons: {
                Cancel: {
                    btnClass: 'btn btn-secondary btn-xs',
                    keys: ['esc'],
                    action:function () {
                    },
                },
                Confirm: {
                    btnClass: 'btn btn-primary btn-xs',
                    keys: ['enter'],
                    action:function () {
                        callback()
                    },
                }
                
            }
        });
    },
    formatCurrency: function(number){
        // return Number(parseFloat(number).toFixed(2)).toLocaleString('en');

        number = parseFloat(number).toFixed(2).toLocaleString();
        //Seperates the components of the number
        var n= number.toString().split(".");
        //Comma-fies the first part
        n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //Combines the two sections
        return n.join(".");

        // return parseFloat(number).toFixed(2).toLocaleString();
    },
    removeComma:function(number){
        return number.replace(',','');
    },
    isEmpty(value) {
        return !value.trim();
    }
}