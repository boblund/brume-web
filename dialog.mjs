export { dialog };

const cancelBtn = document.querySelector( "#cancelBtn" );
const OKBtn = document.querySelector( "#OKBtn" );
const dialogDiv = document.querySelector( "#dialogDiv" );
const dialogMsg = document.querySelector( "#dialogMsg" );

function btnHandler( e, res ) {
	dialogDiv.hidden = true;
	cancelBtn.removeEventListener( 'click', btnHandler );
	OKBtn.removeEventListener( 'click', btnHandler );
	res( e.currentTarget.firstChild.data == 'OK' ? true : false );
}

function dialog( type, m ){
	return new Promise( ( res, rej ) => {
		dialogMsg.innerHTML = m;
		cancelBtn.style.visibility = type == 'alert' ? 'hidden' : 'visible';
		dialogDiv.hidden = false;
		cancelBtn.addEventListener( 'click', ( e ) => btnHandler( e, res ) );
		OKBtn.addEventListener( 'click', ( e ) => btnHandler( e, res ) );
	} );
};
