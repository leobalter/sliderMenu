jQuery(function($) {
	$.fn.sliderMenu = function(options) {
		var defaults = {
			interval: 3000,
			titleSelector: 'h1, h2, h3, h4, h5, h6',
			contentSelector: 'p, span'
		};

		function maxHeight(objetos) {
			return objetos.height( Math.max.apply(objetos, $.map( objetos , function(e){ return $(e).height() }) ) );
		}

		var opts = $.extend(defaults, options);
		
		var sMenuIntervalo = new Array();
		var iChamadasMenu = new Array();
	
		this.each(function() {
			var d = new Date();
			var anAlmostRandomNumber = d.getTime();
			var sliderMenu = $(this);
			sliderMenu.hide();
			sliderMenu.after('<div id="sMenuSlider'+anAlmostRandomNumber+'" class="sMenuSlider"><ul id="sMenu-banner-'+anAlmostRandomNumber+'" class="sMenu-banner"></ul><div id="sMenu-navegacao-'+anAlmostRandomNumber+'" class="sMenu-navegacao"><ul id="sMenu-navegacao-'+anAlmostRandomNumber+'" class="sMenu-navegacaoUl"></ul></div></div><div class="sMenu-sombra"></div>');

			var $sMenuB = $('#sMenu-banner-'+anAlmostRandomNumber);
			var $sMenuN = $('#sMenu-navegacao-'+anAlmostRandomNumber + ' > ul');

			sliderMenu.children().each( function() {
				var i = 0;

				$sMenuB.append('<li></li>');
				$sMenuN.append('<li></li>');

				var $bannerLastLi = $sMenuB.children('li').last();
				var $navegaLastLi = $sMenuN.children('li').last();

				$(this).children('img').first().detach().appendTo($bannerLastLi);

		 		var $bannerContentBox = $($bannerLastLi)
					.append('<div class="placeHolder"></div><div class="bigSlideText"></div><a class="sMenu-LinkToContent" href="#"></a>')
					.find('.bigSlideText');

				$bannerContentBox.find('.sMenu-LinkToContent').append($(this).find('a').first().html());

				var titulo = $(this).children(opts.titleSelector).detach().appendTo($bannerContentBox).html();
				$(this).children(opts.contentSelector).detach().appendTo($bannerContentBox);

				var conteudo = "";
				$($bannerContentBox).children(opts.contentSelector).each( function() { conteudo = "<p>"+$(this).html()+"</p>"; } );

				$navegaLastLi.append('<h2>' + titulo + '</h2>').append(conteudo);	
			});

			$sMenuN.children('li').hover( function(e) {
				if ( e.type == "mouseenter" ) {
					$(this).stop(true,true).addClass('liHover');
				} else if ( e.type == "mouseleave" ) {
					$(this).stop(true,true).removeClass('liHover');
				}
			}).first().addClass('sMenu-ativo');

			$sMenuB.children('li').hide().first().show('fast');

			var i = 1;
			$sMenuN.children('li').each(function() {
				$(this).attr('rel', i );
				$sMenuB.children('li:eq('+(i-1)+')').attr('rel', i );	
				++i;
			});

			var totalItems = $sMenuN.children('li').length;
			iChamadasMenu = 1;

			//$('.sMenu-navegacaoUl:last li').click(function(e) {
			$sMenuN.children('li').click(function(e) {
				// e.preventDefault();
				if (!$(this).hasClass('sMenu-ativo')) {
					var relacionado = $(this).attr('rel');
					iChamadasMenu = parseInt(relacionado);
					if ( iChamadasMenu >= totalItems ) {
						iChamadasMenu = 0;
					}
					$sMenuB.children('li').stop(true,true);
					var $item = $sMenuB.children('li[rel='+relacionado+']');
					$item.siblings().animate({ left:"-650px" }, 600, function() {
						$(this).hide().css({left:0});
						//$item.css({left:"650px"}).show().animate({ left: 0 });
					}).end().css({left:"650px"}).show().animate({ left: 0 });
					$(this).addClass('sMenu-ativo').siblings('.sMenu-ativo').removeClass('sMenu-ativo');

					if ( relacionado <= 2 ) {
						$(this).parent().animate( { top: 0 } );
					} else if ( relacionado <= (totalItems - 1)  ){
						var topTop = ( relacionado - 2 ) * 90;
						$(this).parent().animate( { 'top': '-'+topTop } );
					} else {
						var topTop = ( relacionado - 2 ) * 90;
						topTop -= 90;
						$(this).parent().animate( { 'top': '-'+topTop } );
					}
				}
			});

			sMenuIntervalo["loop"+(anAlmostRandomNumber)] = setInterval( function() {
				if ($sMenuN.children('li.sMenu-ativo').next('li').html()) {
					$sMenuN.children('li.sMenu-ativo').next('li').click();
				} else {
					$sMenuN.children('li.sMenu-ativo').siblings('li').first().click();
				}
			} , opts.interval );
			
			var $thisMenuSlider = $('#sMenuSlider'+anAlmostRandomNumber);

			$thisMenuSlider.append('<input class="sMenuLoopNumber" type="hidden" value="'+anAlmostRandomNumber+'" />');
			$thisMenuSlider.append('<input class="sMenuNavegacao" type="hidden" value="#sMenu-navegacao-'+anAlmostRandomNumber+'" />');
			$thisMenuSlider.append('<input class="sMenuIntervalo" type="hidden" value="'+opts.interval+'" />');

			$thisMenuSlider.hover( function(e) {
				var loopNumber = $(this).find('.sMenuLoopNumber').val();
				var selNavegacao = $(this).find('.sMenuNavegacao').val();
				var intervalo = $(this).find('.sMenuIntervalo').val();
				if ( e.type == "mouseenter" ) {
					clearInterval(sMenuIntervalo["loop"+loopNumber]);
				} else if ( e.type == "mouseleave" ) {
					sMenuIntervalo["loop"+loopNumber] = setInterval( function() {
						if ($('li.sMenu-ativo', selNavegacao).next().length) {
							$('li.sMenu-ativo', selNavegacao).next().click();
						} else {
							$('li.sMenu-ativo', selNavegacao).siblings().first().click();
						}
					} , parseInt(intervalo) );			
				}
		 	});
			
			// Ajustes de layout
			// Altura do PlaceHolder (uma caixa com opacity) igual ao do texto que aparece junto
			maxHeight($thisMenuSlider.find('.bigSlideText, .placeHolder'));
			
		});
	}
});