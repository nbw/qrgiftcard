
        // ###############################
        // ### CUSTOM NON-KO FUNCTIONS ###

        function confirmPayment(amount,id){
            bootbox.dialog({
                        message:  "<h3>Are you sure?</h3></br></br>"+
                            "<table class='table table-bordered text-center'><tr>"+
                            "<td><h1>"+format2MoneyStr(amount)+"</h1></td>"+
                            "</tr></table>"+
                            "<h3>Current Balance: "+format2MoneyStr(viewModel.GC.balance())+"</h3>"+
                            "<h3>Effective Balance: "+format2MoneyStr(viewModel.GC.balance()+amount)+"</h3>",
                        buttons: {
                            success: {
                                label: "Confirm",
                                className: "btn-success confirm-btn",
                                callback: function() {
                                        viewModel.addTrans(amount);
                                        viewModel.addCreditToggle(false);
                                        viewModel.makePaymentToggle(false);
                                        $('#'+id).val(''); // reset value
                                        $('#'+id).trigger('keyup');
                                }
                            },
                            danger: {
                                label: "Cancel",
                                className: "btn-danger confirm-btn"
                            }
                        }
            });

        }

        function inputCheck(val){
                // 1. Check if the value is an interger
                // 2. Check that the value is at minimum 1 cent
                if (!isNaN(val) && parseFloat(val) >= 0.01)
                    return true;
                else
                    return false;
        }

        function addToInputField(id,val){
            if ($(id).val() ==""){
                var currInputVal = 0.00;
            }
            else {
            var currInputVal = parseFloat($(id).val());
            }
                currInputVal = currInputVal + val;
            $(id).val(currInputVal.toFixed(2));
            $(id).keydown();
        }

        // format integer to string. Example: "+$1.25" or "-$3.45"
        function format2MoneyStr(price){
            var priceAbs = Math.abs(price);
            if (price == 0.00){
                return "$" + priceAbs.toFixed(2);
            }
            else if (price > 0.00){
                return "+$" + priceAbs.toFixed(2);
            }
            else {
                return "-$" + priceAbs.toFixed(2);
            }
        }

        //format input cashier style. That means entering "144" equals $1.44
        function format2cashier(val){
            val = val.replace(".","");
            if(val){
                return val = (val/100).toFixed(2);
            }
            return "";
        }

        function customDateFormat(d,withTime){
            var date = (d.getDate().toString().length==1)?'0'+d.getDate().toString():d.getDate().toString();
            var month = ((d.getMonth()+1).toString().length==1)?'0'+(d.getMonth()+1).toString():(d.getMonth()+1).toString();
            var year = d.getFullYear().toString().substring(2,4);

            if (withTime){
                return d.toTimeString().substring(0,5)+" "+month+"/"+date+"/"+year
            }

            return month + "/" + date + "/" + year
        }