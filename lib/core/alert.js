/* exported gdAlert, alert */

// Create a nice alert function...
const gdAlert = {
	container: false,
	overlay: false,

	populateContainer(callback) {
		if (gdAlert.container !== false) {
			gdAlert.container.innerHTML = '';
		} else {
			gdAlert.container = RESUtils.createElement('div', 'alert_message');
		}

		// Add text area
		gdAlert.container.appendChild(document.createElement('div'));

		let closeButton;
		if (typeof callback === 'function') {
			this.okButton = gdAlert.makeButton('confirm', 'button-right');
			this.okButton.addEventListener('click', callback, false);
			this.okButton.addEventListener('click', gdAlert.close, false);

			closeButton = gdAlert.makeButton('cancel', 'button-right');
			closeButton.addEventListener('click', gdAlert.close, false);

			gdAlert.container.appendChild(this.okButton);
			gdAlert.container.appendChild(closeButton);
		} else {
			closeButton = gdAlert.makeButton('Ok');
			closeButton.addEventListener('click', gdAlert.close, false);

			gdAlert.container.appendChild(closeButton);
		}
		document.body.appendChild(gdAlert.container);

		// Focus on cancel/okay button, so user can click enter to close
		setTimeout(() => closeButton.focus(), 0);
	},
	open(text, callback) {
		if (gdAlert.isOpen) {
			return;
		}
		$('body').on('keyup', gdAlert.listenForEscape);

		gdAlert.isOpen = true;
		gdAlert.populateContainer(callback);

		// Set message
		$(gdAlert.container.getElementsByTagName('div')[0]).html(text);
		gdAlert.container.getElementsByTagName('input')[0].focus();

		// create site overlay
		if (gdAlert.overlay === false) {
			gdAlert.overlay = RESUtils.createElement('div', 'alert_message_background');
			document.body.appendChild(gdAlert.overlay);
		}

		gdAlert.container.style.top = `${Math.max(0, (($(window).height() - $(gdAlert.container).outerHeight()) / 2))}px`;
		gdAlert.container.style.left = `${Math.max(0, (($(window).width() - $(gdAlert.container).outerWidth()) / 2))}px`;

		RESUtils.fadeElementIn(gdAlert.container, 0.3);
		RESUtils.fadeElementIn(gdAlert.overlay, 0.3);
	},
	listenForEscape(e) {
		if (e.keyCode === 27) {
			gdAlert.close();
		}
	},
	close() {
		$('body').off('keyup', gdAlert.listenForEscape);
		gdAlert.isOpen = false;

		RESUtils.fadeElementOut(gdAlert.container, 0.3);
		RESUtils.fadeElementOut(gdAlert.overlay, 0.3);
	},
	makeButton(text, cls) {
		const btn = document.createElement('input');
		btn.setAttribute('type', 'button');
		btn.setAttribute('value', text);
		if (typeof cls !== 'undefined') {
			btn.classList.add(cls);
		}
		return btn;
	}
};

// overwrite the alert function
function alert(text, callback) {
	gdAlert.open(text, callback);
}

exports.alert = alert;
exports.gdAlert = gdAlert;
