(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$('#sidebarCollapse').on('click', function () {
      $('#sidebar').toggleClass('active');
  });

})(jQuery);

//Create toast 
function toast({
	title='', 
	message='', 
	type = 'success', 
	duration = 3000
}) {
	const main = document.getElementById('toast');
	if(main){
		const toast = document.createElement('div');
		const icons = {
			success: 'fa fa-check-circle',
			error: 'fa fa-exclamation-circle',
		};
		const icon = icons[type];
		const delay = (duration/1000).toFixed(2);

		toast.classList.add('toast', `toast--${type}`);
		toast.style.animation = `slideInLeft ease 2s, fadeOut linear 2s 6s forwards`;

		toast.innerHTML = `
		<div class="toast__icon">
			<i class="${icon}"></i>
		</div>
		<div class="toast__body">
			<h3 class="toast__title">${title}</h3>
			<p class="toast__msg">${message}</p>
		</div>
		<div class="toast__close">
			<i class="fa fa-times"></i>
		</div>
		`;
		main.appendChild(toast);
		setTimeout(function(){
			main.removeChild(toast)
		}, duration + 1000)
	}
}

function showSuccessToast(input){
	toast({
		title: 'Success',
		message: input,
		type: 'success',
		duration: 1000
	})
}

function showErrorToast(input){
	toast({
		title: 'Error',
		message: input,
		type: 'error',
		duration: 1000
	})
}

