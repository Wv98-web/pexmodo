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

	/* track notice */
	$('#notice_btn').click(() => {
		$('.notice_content_wrapper').show();
	});
	$('.notice_close').click(() => {
		$('.notice_content_wrapper').hide();
	});
	$('.notice_cover').click(() => {
		$('.notice_content_wrapper').hide();
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

/* Coupon code auto write */
const comparePrice = (price) => {
  if (price > 29900) {
    $('#couponcode').val('70OFF');
    $('#Cartdiscode').val('70OFF');
  } else if (price > 20900) {
    $('#couponcode').val('50OFF');
    $('#Cartdiscode').val('50OFF');
  } else if (price > 15900) {
    $('#couponcode').val('30OFF');
    $('#Cartdiscode').val('30OFF');
  } else if (price > 7900) {
    $('#couponcode').val('10OFF');
    $('#Cartdiscode').val('10OFF');
  } else {
    $('#couponcode').val('');
    $('#Cartdiscode').val('');
  }
};
const comparePrice2 = (price) => {
  if (price > 29900) {
    $('#couponcode').val('70OFF');
    $('#Cartdiscode').val('70OFF');
  } else if (price > 20900) {
    $('#couponcode').val('50OFF');
    $('#Cartdiscode').val('50OFF');
  } else if (price > 15900) {
    $('#couponcode').val('30OFF');
    $('#Cartdiscode').val('30OFF');
  } else if (5900 < price && price < 15900) {
    $('#couponcode').val('FREE');
    $('#Cartdiscode').val('FREE');
  } else {
    $('#couponcode').val('');
    $('#Cartdiscode').val('');
  }
};

const couponcode = (data) => {
  let final_line_price = 0;
  $.ajaxSettings.async = false;
  data.items.forEach(async (item, index) => {
    await jQuery.getJSON(
      window.Shopify.routes.root + `products/${item.handle}`,
      function (product) {
        const { tags } = product.product;
        if (tags.indexOf('flash_sale') > 0) {
          final_line_price =
            data.items[index].final_line_price + final_line_price;
          return false;
        }
      }
    );
  });
  $.ajaxSettings.async = true;

	let price = data.items_subtotal_price - final_line_price;

	if (data.item_count >= 3) {
		comparePrice2(price);
	} else {
		comparePrice(price)
	}
};

async function cartContent() {
  await fetch(window.Shopify.routes.root + 'cart.js')
    .then((response) => response.json())
    .then((data) => {
      // 有一个产品且为促销品时，不展示code
      // 有多个产品且包含促销品时，计算总金额-促销品金额x数量的金额，计算是否满足折扣金额后展示对应code
      // 有三件及以上产品且结算金额为59-159展示FREE折扣码
      // 新客结算且不含促销品展示 5OFF
			couponcode(data);
    });
}

cartContent();

/* 监听购物车更新 */
(function (ns, fetch) {
  if (typeof fetch !== 'function') return;

  ns.fetch = function () {
    const response = fetch.apply(this, arguments);

    response.then((res) => {
      if (
        [
          `${window.location.origin}/cart/add.js`,
          `${window.location.origin}/cart/update.js`,
          `${window.location.origin}/cart/change.js`,
          `${window.location.origin}/cart/clear.js`
        ].includes(res.url)
      ) {
        res
          .clone()
          .json()
          .then((data) => {
            cartContent();
          });
      }
    });

    return response;
  };
})(window, window.fetch);
