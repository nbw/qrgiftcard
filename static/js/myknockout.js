
        // Class to represent a Giftcard
        function GiftcardClass() {
            var self = this;
            self.id = {{ id|json }};
            self.create_date = new Date({{create_date}}*1000);
            {% if disabled %}
            self.disabledDate = new Date({{disabled_date}}*1000);
            {% else %}
            self.disabledDate = false;
            {% endif %}

            self.transactions = ko.observableArray();
            {% for trans in transactions %}
                self.transactions.push(new TransactionClass(new Date({{trans.date}}*1000), 
                                                                {{trans.amount}}, 
                                                                {{trans.id}},
                                                                {{trans.is_disabled}}));
            {% endfor %}

            self.currTransaction = ko.observable(new TransactionClass(new Date(), 0, 0));

            self.balance = ko.computed(function(){
                var total = 0.00;
                for ( i = 0; i < self.transactions().length; i++){
                    if(!self.transactions()[i].isDisabled()){
                        total += self.transactions()[i].amount();
                    }
                }
                return total;
            });

            self.firstName = ko.observable("{{ first_name }}");
            self.lastName = ko.observable("{{ last_name }}");
        }

        // Class to represent a transaction
        function TransactionClass(timestamp, amount, id, isDisabled) {
            var self = this;
            self.timestamp = timestamp;
            self.amount = ko.observable(amount); 
            self.trans_id = id; 
            self.isDisabled = ko.observable(isDisabled);
        }

        // Overall viewmodel for this screen, along with initial state
        function TransactionsViewModel() {
            var self = this;   

            self.GC = new GiftcardClass();

            self.addInputValue = ko.observable('');
            self.addInputValueCalc = ko.computed({
                read: function(){
                    var val = self.addInputValue();
                    if(inputCheck(val)){
                           return format2cashier(val);
                    }
                    return val;  
                },
                write: function(val){
                    self.addInputValue(val);
                },
                owner: self
            }); 


            self.payInputValue = ko.observable('');
            self.payInputValueCalc = ko.computed({
                read: function(){
                    var val = self.payInputValue();
                    if(inputCheck(val)){
                        return format2cashier(val);
                    }
                    return val;
                },
                write: function(val){ 
                    self.payInputValue(val);
                },
                owner: self
            }); 

            self.addCreditToggle = ko.observable(null);
            self.makePaymentToggle = ko.observable(null);
            
            self.addBtns = ko.observableArray();
            {% for btn in credit %}
                self.addBtns.push({'value': {{btn.value}}, 'active': {{btn.enabled}}})
            {% endfor %}

            self.payBtns = ko.observableArray();
            {% for btn in payment %}
                self.payBtns.push({'value': {{btn.value}}, 'active': {{btn.enabled}}})
            {% endfor %}

            self.serverPin = ko.observable("");

            //Make Transaction
            self.addTrans = function(val,timestamp){
                if(typeof timestamp === "undefined") {timestamp = new Date();}

                // 1. Add the transaction to the SQL server
                $.post("/api/v1/giftcard/" + self.GC.id.toString() + "/transactions", { amount: val, user_id: user_id})
                    .success(function(res){
                        // 2. once the transaction is confirmed then update the webpage. 
                        self.GC.transactions.push(new TransactionClass(timestamp, val,res.id));
                        //force  a scroll to bottom of the transactionslist:
                        listScroll.refresh();
                        if (self.GC.transactions().length > numListItems){
                            listScroll.scrollTo(0,-($("#scroller").height() - $("#list-wrapper").height()),0);
                        }
                    })
                    .fail(function(err){
                        console.log("Error: "+ err);
                    });     
            }

            //Disable Transaction
            self.removeTrans = function(trans) {

                if (self.GC.balance() >= trans.amount()){
                    var modal = $('#disableModal');
            
                    function showModal(trans, callback){
                        if (typeof callback === "function") {
                            self.GC.currTransaction(trans);
                            modal.modal('show');
                            modal.find('.password').submit(function(e){
                                e.preventDefault();
                                callback($('#disableModal .pwForm input').val());
                            });
                        }
                    }

                    pw = function(pass){
                        var b = new jQuery.Deferred();
                        $.post("/api/v1/validate_action", {
                            'password': pass
                        }).success(function(){
                            b.resolve();  
                        })
                        .fail(function(){

                        });
                        return b.promise();
                    } 

                    // unbind the modal when it closes
                    modal.on('hide.bs.modal', function () {
                            modal.find("form").unbind('submit');
                            modal.find('.password').val('');
                    });

                    // button handlers
                    $('#disableModal .m-mainSelection button, #disableModal .cancel-btn').click(function()
                    {
                        $(".m-mainSelection").toggleClass('isHidden');
                        $("."+$(this).data('target')).toggleClass('isHidden');
                    });

                    //show modal
                    showModal(trans,function(pass){
                        // validate the admin password
                        pw($(modal).find('.password input').val()).then(
                        function(data){
                            var d = new jQuery.Deferred();
                            $.post("/api/v1/giftcard/"+self.GC.id.toString()+"/transactions/"+trans.trans_id.toString(),{user_id: user_id})
                            .success(function(){
                                trans.isDisabled(true);
                                listScroll.refresh();
                                $('#disableModal').modal('hide');
                            })
                            .fail(function(err){
                                console.log(err);
                            });  
                        });
                    });     
                }
            }
            self.createIdentity = function(data,event)
            {
                var parent = $("#introModal .m-userInfo");
                var firstName = parent.find(".firstNameForm input").val();
                var lastName = parent.find(".lastNameForm input").val();
                var email = parent.find(".emailForm input").val();      
    
                $.post("/api/v1/giftcard/" + self.GC.id.toString() + "/set_metadata", 
                    {   first_name: firstName, 
                        last_name:lastName, 
                        email:email,
                        user_id: user_id
                    })
                    .success(function(res){
                        self.GC.firstName(firstName);
                        self.GC.lastName(lastName);
                        $('#introModal').modal('hide');
                    })
                    .fail(function(err){
                        console.log("Error: "+ err);
                    });    
            }

            self.transferIdentity = function(data,event)
            {
                var modal = $('#introModal');
                var old_id = modal.find(".m-transferCard .oldIDForm input").val();

                pw = function(pass){
                    var b = new jQuery.Deferred();
                    $.post("/api/v1/validate_action", {
                        'password': pass
                    }).success(function(){
                        b.resolve();  
                    })
                    .fail(function(){
                        modal.find('form.password').toggleClass("has-error");
                        setTimeout(function(){modal.find('form.password').toggleClass("has-error");},2500);
                    });
                    return b.promise();
                } 

                // validate the admin password
                pw($(modal).find('.m-transferCard .password input').val()).then(
                function(data){
                    var d = new jQuery.Deferred();
                    $.post("/api/v1/transfer_giftcard", 
                    {   old_id: old_id, 
                        new_id: self.GC.id,
                        user_id: user_id
                    })
                    .success(function(){
                        modal.modal('hide');
                        location.reload();
                    })
                    .fail(function(e){
                        console.log(e);
                    });
                });

                // unbind the modal when it closes
                modal.on('hide.bs.modal', function () {
                        modal.find("form").unbind('submit');
                        modal.find('.password').val('');
                });

                // button handlers
                $('#introModal .m-mainSelection button, #introModal .cancel-btn').click(function()
                {
                    $(".m-mainSelection").toggleClass('isHidden');
                    $("."+$(this).data('target')).toggleClass('isHidden');
                });  
            }
            self.addSuperCard = function(data,event)
            {
                var modal = $('#introModal');

                pw = function(pass){
                    var b = new jQuery.Deferred();
                    $.post("/api/v1/validate_action", {
                        'password': pass
                    }).success(function(){
                        b.resolve();
                    })
                    .fail(function(){
                        modal.find('form.password').toggleClass("has-error");
                        setTimeout(function(){modal.find('form.password').toggleClass("has-error");},2500);
                    });
                    return b.promise();
                } 

                // validate the admin password
                pw($(modal).find('.m-superCard .password input').val()).then(
                function(data){
                    var d = new jQuery.Deferred();
                    $.post("/api/v1/giftcard/" + self.GC.id.toString() + "/set_metadata", 
                    {   first_name: 'SUPERCARD', 
                        last_name:'', 
                        email:'',
                        super: true,
                        user_id: user_id
                    })
                    .success(function(res){
                        location.reload();
                    })
                    .fail(function(err){
                        console.log("Error: "+ err);
                    });   
                });

                // unbind the modal when it closes
                modal.on('hide.bs.modal', function () {
                        modal.find("form").unbind('submit');
                        modal.find('.password').val('');
                });  
            }
        }

        viewModel = new TransactionsViewModel(); // don't delete in production. just remove "window"
        ko.applyBindings(viewModel);
