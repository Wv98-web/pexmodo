jQuery_T4NT(document).ready(function ($) {
	/**
	 * Variant selection changed
	 */
	$(document).on("variant:change", function (evt, variant) {
		//console.log( variant );
	});
});

new ResizeSensor($(".additional_checkout_buttons"), function () {
	let target = document.querySelector(".btn_checkout");
	if (!target) {
		return false;
	}
	let width = $(".additional_checkout_buttons")[0].clientWidth;
	target.style.width = width + "px";
});

let handleSlideHeightChange = () => {
	let slideArr = document.querySelectorAll(".swiper-slide");
	if (!slideArr.length) {
		return false;
	}
	let width = slideArr[0].clientWidth;
	console.log(width);
	slideArr.forEach((item, index) => {
		item.style.width = width + "px";
		item.style.height = (width * 4) / 3 + "px";
	});
};

let debounce = (fn, delay) => {
	let timer;
	return function () {
		if (timer) {
			clearTimeout(timer);
		}
		timer = setTimeout(() => {
			fn();
		}, delay);
	};
};

window.addEventListener("resize", debounce(handleSlideHeightChange, 500));
handleSlideHeightChange();
