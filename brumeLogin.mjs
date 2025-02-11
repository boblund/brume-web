export {getToken};

let Cognito = await import( './amazon-cognito-identity.min.js' );
if( Cognito?.__esModule !== true ){
	Cognito = window.AmazonCognitoIdentity;
}

const poolData = {
	UserPoolId: 'us-east-1_p5E3AsRc8',
	ClientId: '6dspdoqn9q00f0v42c12qvkh5l'
};

const userPool = new Cognito.CognitoUserPool( poolData );

function userPassAuth( username, password ) {
	return new Promise( ( res, rej ) => {
		const authenticationData = {
			Username: username,
			Password: password
		};

		const authenticationDetails = new Cognito.AuthenticationDetails( authenticationData );

		const userData = {
			Username: username,
			Pool: userPool
		};

		const cognitoUser = new Cognito.CognitoUser( userData );

		cognitoUser.authenticateUser( authenticationDetails, {
			onSuccess: function( result ) {
				cognitoUser.getUserAttributes( ( e, r ) => {
					//const brume_name = r.reduce((a, e) => a = e.Name == 'custom:brume_name' ? e.Value : a, '');
					res( { IdToken: result.getIdToken().getJwtToken() } );
				} );
			},
			onFailure: function( err ) {
				res ( { error: err } );
			}
		} );
	} );
}

let brumeLogin = null;

if(customElements.get('brume-login')){
	brumeLogin = document.getElementById('brumeLogin');
	brumeLogin.submitLogin.addEventListener('click', processLogin);
}

brumeLogin.email.value = localStorage?.email ? localStorage.email : '';
brumeLogin.checkbox.checked = localStorage?.checkbox ? localStorage.checkbox : false;

let loginCallBack = ()=> {};

async function processLogin() {
	brumeLogin.loginStatus.innerHTML = '';
	if (brumeLogin.checkbox.checked && brumeLogin.email.value !== "") {
		localStorage.email = brumeLogin.email.value;
		localStorage.checkbox = brumeLogin.checkbox.checked;
	} else {
		localStorage.email = "";
		localStorage.checkbox = "";
	}

	const result = await userPassAuth(brumeLogin.email.value, brumeLogin.password.value);
	if(result.error) {
		if(result.error == "NEW_PASSWORD_REQUIRED") {
			alert('New Password Required. Change your password at brume.occams.solutions.');
		} else { //if(result.error?.code == 'NotAuthorizedException'){
			brumeLogin.loginStatus.innerHTML = result.error;
		}
		delete localStorage.Authorization;
		loginCallBack( { error: result.error } );
	} else {
		if(brumeLogin.stayLoggedInCb.checked)
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
