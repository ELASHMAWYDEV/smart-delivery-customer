(function ($) {
    "use strict";
    const $window = $(window);

    $window.on("load", function () {

        $(document).scroll(function () {
            var navbar = $(".main_nav");
            var y = $(document).scrollTop();
            //   alert(y);
            if (y >= 20) {
                navbar.addClass("sticky");
            } else {
                navbar.removeClass("sticky");
            }
        });
    
        var $signupForm = $("#SignupForm");
        
        $signupForm.validationEngine('attach', {promptPosition : "centerRight", scroll: false});

        if (getCookie("Language") == "ar") {
            $signupForm.formToWizard({
                submitButton: "SaveAccount",
                showProgress: true, //default value for showProgress is also true
                nextBtnName: "التالي",
                prevBtnName: "السابق",
                showStepNo: false,
                validateBeforeNext: function () {
                    return $signupForm.validationEngine("validate");
                },
            });
        } else {
            $signupForm.formToWizard({
                submitButton: "SaveAccount",
                showProgress: true, //default value for showProgress is also true
                nextBtnName: "Next",
                prevBtnName: "Previous",
                showStepNo: false,
                validateBeforeNext: function () {
                    return $signupForm.validationEngine("validate");
                },
            });
        }
      
    
        $("#txt_stepNo").change(function () {
          $signupForm.formToWizard("GotoStep", $(this).val());
        });
    
        $("#btn_next").click(function () {
          $signupForm.formToWizard("NextStep");
        });
    
        $("#btn_prev").click(function () {
          $signupForm.formToWizard("PreviousStep");
        });

    });

    $(".nav-item.dropdown").mouseover(function(){
      $(this).addClass('show');
      $('.dropdown-menu').addClass('show');
    });
    $(".nav-item.dropdown").mouseout(function(){
      $(this).removeClass('show');
      $('.dropdown-menu').removeClass('show');
    });
    
    
})(jQuery);


