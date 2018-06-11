var signinUrl = 'https://private-47ed5-interviewapitest.apiary-mock.com/signin';

(function(window, document, zxcvbn){
    
    document.addEventListener('DOMContentLoaded',function(event){
        
        // get elements
        const fullName = document.querySelector('#fullname');
        const eMail = document.querySelector('#email');
        const userName = document.querySelector('#username');
        const passWord = document.querySelector('#password');
        const errorDiv = document.querySelector('.error-inline');
        const submitBtn = document.querySelector('.ap-btn');
        const meterElem = document.querySelector('#meter-password-strength');
        const strText = document.querySelector('#text-password-strength');
        const loader  = document.querySelector('#gif-loader');

        // const map for regex.
        const regExSet = {
            username : /^[a-zA-Z0-9_-]{6,10}$/,
            email    : /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([\w]{2,6}(?:\.[\w]{2})?)$/i,
            password : /^[A-Za-z0-9!@#$%^&*()_]{8,20}$/
        }

        // const map for errors.
        const errorMessages = {
            'inValidEmail'     : 'Enter valid email address',
            'fieldMissing'     : 'Must specify an email, username and password',
            'inValidUser'      : 'Username must be alphanumeric and length should be between 6 to 10',
            'inValidPassword'  : 'Password is invalid'
        }

        //enum for strength.
        const strength = {
            0: "Worst",
            1: "Bad",
            2: "Weak",
            3: "Good",
            4: "Strong"
          }

        //on Load - focus on first element.
        fullName.focus();
        errorDiv.style.display = 'none';
        loader.style.display = 'none';

        /**********************************************
         * validate Email
        *********************************************/
        function checkEmail() {
            
            if(eMail && eMail.value && regExSet.email.test(eMail.value)) {
                return true;
            } else {
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = errorMessages['inValidEmail'];
                return false;
            }
        }

        /**********************************************
         * validate UserName
        *********************************************/
        function validateUsername() {
            
            if(userName && userName.value && regExSet.username.test(userName.value)) {
                return true;
            } else {
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = errorMessages['inValidUser'];
                return false;
            }
        }

        /**********************************************
         * validate password
        *********************************************/
        function validatePassword() {
            
            if(passWord && passWord.value && regExSet.password.test(passWord.value)) {
                return true;
            } else {
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = errorMessages['inValidPassword'];
                return false;
            }
        }

        /*************************************************
        * verify value of password based on their strength.
        *************************************************/
        passWord.addEventListener('input', function() {
            
            // check strength
            const strengthResult = zxcvbn(passWord.value);
          
            // Update meter
            meterElem.value = strengthResult.score;
            
            if(meterElem.value > 0) {
                meterElem.style.display = 'block';
                strText.innerHTML = "<b>Strength: " + strength[strengthResult.score] + '</b>';
                strText.style.color = 'rgb(46, 43, 43)   ';
            } else {
                meterElem.style.display = 'none';
                strText.innerHTML = "";
            }
        });


        /*****************************************************
         * Function to perform POST call for API
         ****************************************************/
        function post(url, data, cb) {
            // show loader
            loader.style.display = 'block';
            submitBtn.disabled = true;
            var xhr = new XMLHttpRequest();
            xhr.onload = function() {
                loader.style.display = 'none'; // response came , now hide loader
                submitBtn.disabled = false;
                cb(this);
            }
            xhr.open('POST', url);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data))
        }


        /*********************************************************
         * click event on submit button. 
         ********************************************************/
        submitBtn.addEventListener('click',function(event){
           
           errorDiv.style.display = 'none'; // hide error box.

           if(eMail && userName && passWord && eMail.value && userName.value && passWord.value ) {
                if(checkEmail() && validateUsername() && validatePassword()) {
                    
                    // hide meter
                    meterElem.style.display = 'none';
                    strText.innerHTML = "";

                    post(signinUrl, {
                        username: userName.value,
                        password: passWord.value
                    }, function(res) {
                        
                        if(res.readyState === 4 && res.status === 401) {
                            errorDiv.style.display = 'block';
                            errorDiv.innerHTML = JSON.parse(res.responseText).error.msg;
                        }
                    });
                }
           } else {
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = errorMessages['fieldMissing'];
           }
        });

    });
})(window, document, zxcvbn);

