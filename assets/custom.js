const MIC_ID = 6338834464988;
jQuery_T4NT(document).ready(function ($) {
	/**
	 * Variant selection changed
	 */
	$(document).on("variant:change", function (evt, variant) {
		//console.log( variant );
	});

	/* report ga start*/
	let user = $('body').data('pexmoder');
	let pp_report = sessionStorage.getItem('pp_reports');
	if(user == MIC_ID){
				let is_collection = window.location.pathname.includes("/collections/"),
				is_product_dt = window.location.pathname.includes("/products/"),
							pr_set = $(".products.nt_products_holder").children(),
							rp_data = JSON.parse(pp_report);
					if(!rp_data){
						$.post("/apps/pex/google_api/ga/data_api/", { user: user }).done(function (res) {
								sessionStorage.setItem('pp_reports', JSON.stringify(res.data));
								alert('加载数据完成,即将自动刷新页面');
								window.location.reload();
						});
					}else{
						if (is_collection && !is_product_dt) {
									// default
									pr_set.map(function(index, item){
										let item_data = rp_data.filter(function(pp_data){
												return pp_data.product_id == item.dataset.pr_id;
										});
										console.log(item_data)
										let block = `
											<div style="position: absolute;top: 0;right: 0;z-index: 1;background: rgb(86 102 207);color: rgb(255 255 255);padding: 10px 15px;font-size:0.6rem;">
												<div>过去7天数据</div>
												<div>浏览量: ${item_data[0].last7day_pageviews}</div>
												<div>用户数: ${item_data[0].last7day_users}</div>
												<div>点击率: ${(item_data[0].last7day_ctr * 100).toFixed(2)}%</div>
												<div>加购数: ${item_data[0].last7day_to_cart}</div>
												<div>加购率: ${(item_data[0].last7day_cart_rate * 100).toFixed(2)}%</div>
												<div>结账数: ${item_data[0].last7day_ic_count}</div>
												<div>结账率: ${(item_data[0].last7day_checkout_rate * 100).toFixed(2)}%</div>
												<div>订单数: ${item_data[0].last7day_orders}</div>
												<div>转化率: ${(item_data[0].last7day_conversion * 100).toFixed(2)}%</div>
												<div>历史数据</div>
												<div>发布时间: ${item_data[0].created_at}</div>
												<div>历史订单: ${item_data[0].history_orders}</div>
												<div>整体转化率: ${(item_data[0].overall_conversion * 100).toFixed(2)}%</div>
											</div>
										`
										$(item).prepend(block);
									})
					}
					//collection product details
					if (is_collection && is_product_dt) {
					}
					//product details
					if (!is_collection && is_product_dt) {
					}
						
					}
	}
	/* report ga end*/
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
