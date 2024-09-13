'use strict';


{    
    // scroll_effect
    // fadeup_triggerクラスが見える画面範囲に入って100px進んだら.onクラスを追加する
    
    $(window).scroll(function() {
        var scrollAnimationElm = document.querySelectorAll('.scroll_up');
        
        var scrollAnimationFunc = function() {
            for (var i =0; i < scrollAnimationElm.length; i++) {
                var triggerMargin = 100;
                if (window.innerHeight > scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin) {
                    scrollAnimationElm[i].classList.add('on');
                }
                
            }
        }
        window.addEventListener('load', scrollAnimationFunc);
        window.addEventListener('scroll', scrollAnimationFunc);
    });



    // 一番下のfooterにアニメーションが来るための設定
    function scrollChk() {

        // スクロール位置を取得する。スタートが0、スクロールしたら0からの距離をpxで返します。
        var scroll = $(window).scrollTop();
        // ブラウザウィンドウの縦の長さ(ページが表示される高さ)を取得。
        var windowHeight = $(window).height();

        $('.scroll_animation').not('.active').each(function() {
            // thisはデフォルトでwindowオブジェクトと同じです。
            // ウィンドウのトップを起点にしたときのxy座標を取得します。
            var pos = $(this).offset().top;

            // scroll:4200   　　　※一番下のfooterを表示させる位置にきたところ
            // windowHeight:944　　※これはウィンドウサイズは動かすことがないためスクロール中はずっと変わりません。
            // pos:5121　　　　　　※pcだとどの位置にスクロールしていたかにかかわらず、
            //                      トップから該当の項目位置までの距離は下記のように固定になっています。
            //                      スマホ表示のほうが画像が倍で縦に多く並ぶため距離は約倍ほど長くなります。
            //                      pc表示で3257→3279→3301
            //                      スマホ表示で4886→4909→4931
            // 下記はスマホの場合
            //      pos:5121 - windowHeight:944 = 4177
            //      scroll:4200 > 4155でtrueとなり、表示されるようになります。
            if (scroll > pos - windowHeight) {
                $(this).addClass("active");
            }
        });
    }
    $(window).scroll(function () {
        scrollChk();
    });
    $('body').on('touchmove', function() {
        scrollChk();
    });




    // 動く背景
    const rand = function(min, max) {
        return Math.random() * ( max - min ) + min;
      }
      
      let canvas = document.getElementById('canvas');
      let ctx = canvas.getContext('2d');
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext('2d');
        ctx.globalCompositeOperation = 'lighter';
      });
      let backgroundColors = [ '#000', '#000' ];
      let colors = [
        //  0かなり薄い肌色     0とてつもなく薄い水色
        [ '#ffe0e0', "#eaffff" ],
        //  0さらに薄い肌色     0とてつもなく薄い紫
        [ '#ffeaea', '#f2e5ff' ], 
        //  0とてつもなく薄い黄色   0とてつもなく薄いピンク色
        [ '#ffffe5' ,'#ffeaff' ]
      ];

      let count = 70;
      let blur = [ 12, 70 ];
      let radius = [ 1, 120 ];
      
      ctx.clearRect( 0, 0, canvas.width, canvas.height );
      ctx.globalCompositeOperation = 'lighter';
      
      let grd = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
      grd.addColorStop(0, backgroundColors[0]);
      grd.addColorStop(1, backgroundColors[1]);
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      let items = [];
      
      while(count--) {
          let thisRadius = rand( radius[0], radius[1] );
          let thisBlur = rand( blur[0], blur[1] );
          let x = rand( -100, canvas.width + 100 );
          let y = rand( -100, canvas.height + 100 );
          let colorIndex = Math.floor(rand(0, 299) / 100);
          let colorOne = colors[colorIndex][0];
          let colorTwo = colors[colorIndex][1];
          
          ctx.beginPath();
          ctx.filter = `blur(${thisBlur}px)`;
          let grd = ctx.createLinearGradient(x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius);
        
          grd.addColorStop(0, colorOne);
          grd.addColorStop(1, colorTwo);
          ctx.fillStyle = grd;
          ctx.fill();
          ctx.arc( x, y, thisRadius, 0, Math.PI * 2 );
          ctx.closePath();
          
          let directionX = Math.round(rand(-99, 99) / 100);
          let directionY = Math.round(rand(-99, 99) / 100);
        
          items.push({
            x: x,
            y: y,
            blur: thisBlur,
            radius: thisRadius,
            initialXDirection: directionX,
            initialYDirection: directionY,
            initialBlurDirection: directionX,
            colorOne: colorOne,
            colorTwo: colorTwo,
            gradient: [ x - thisRadius / 2, y - thisRadius / 2, x + thisRadius, y + thisRadius ],
          });
      }
      
      
      function changeCanvas(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let adjX = 2;
        let adjY = 2;
        let adjBlur = 1;
        items.forEach(function(item) {
          
            if(item.x + (item.initialXDirection * adjX) >= canvas.width && item.initialXDirection !== 0 || item.x + (item.initialXDirection * adjX) <= 0 && item.initialXDirection !== 0) {
              item.initialXDirection = item.initialXDirection * -1;
            }
            if(item.y + (item.initialYDirection * adjY) >= canvas.height && item.initialYDirection !== 0 || item.y + (item.initialYDirection * adjY) <= 0 && item.initialYDirection !== 0) {
              item.initialYDirection = item.initialYDirection * -1;
            }
            
            if(item.blur + (item.initialBlurDirection * adjBlur) >= radius[1] && item.initialBlurDirection !== 0 || item.blur + (item.initialBlurDirection * adjBlur) <= radius[0] && item.initialBlurDirection !== 0) {
              item.initialBlurDirection *= -1;
            }
          
            item.x += (item.initialXDirection * adjX);
            item.y += (item.initialYDirection * adjY);
            item.blur += (item.initialBlurDirection * adjBlur);
            ctx.beginPath();
            ctx.filter = `blur(${item.blur}px)`;
            let grd = ctx.createLinearGradient(item.gradient[0], item.gradient[1], item.gradient[2], item.gradient[3]);
            grd.addColorStop(0, item.colorOne);
            grd.addColorStop(1, item.colorTwo);
            ctx.fillStyle = grd;
            ctx.arc( item.x, item.y, item.radius, 0, Math.PI * 2 );
            ctx.fill();
            ctx.closePath();
          
        });
        window.requestAnimationFrame(changeCanvas);
        
      }
      
      window.requestAnimationFrame(changeCanvas);



}