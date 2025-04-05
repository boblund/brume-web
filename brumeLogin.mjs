export { getToken };
import { userPassAuth } from 'brume-auth';

let brumeLogin = null;

if( customElements.get( 'brume-login' ) ){
	brumeLogin = document.getElementById( 'brumeLogin' );
	brumeLogin.submitLogin.addEventListener( 'click', processLogin );
}

brumeLogin.email.value = localStorage?.email ? localStorage.email : '';
brumeLogin.checkbox.checked = localStorage?.checkbox ? localStorage.checkbox : false;

let loginCallBack = ()=> {};

async function processLogin() {
	brumeLogin.loginStatus.innerHTML = '';
	if ( brumeLogin.checkbox.checked && brumeLogin.email.value !== "" ) {
		localStorage.email = brumeLogin.email.value;
		localStorage.checkbox = brumeLogin.checkbox.checked;
	} else {
		localStorage.email = "";
		localStorage.checkbox = "";
	}

	const result = await userPassAuth( brumeLogin.email.value, brumeLogin.password.value );
	if( result.error ) {
		if( result.error == "NEW_PASSWORD_REQUIRED" ) {
			alert( 'New Password Required. Change your password at brume.occams.solutions.' );
		} else { //if(result.error?.code == 'NotAuthorizedException'){
			brumeLogin.loginStatus.innerHTML = result.error;
		}
		delete localStorage.Authorization;
		loginCallBack( { error: result.error } );
	} else {
		if( brumeLogin.stayLoggedInCb.checked )
			localStorage.Authorization = result.IdToken;
		loginCallBack( { token: result.IdToken } );
	}
}


function getToken() {
	return new Promise( ( res, rej ) => {
		loginCallBack = ( result ) => {
			if( result?.token ) {
				res( result.token );
			} else {
				rej( result.error );
			}
		};
	} );
}
