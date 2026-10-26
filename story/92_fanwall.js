/* =========================================================================
 *  92_fanwall.js —— 粉丝留言墙
 *  ---------------------------------------------------------------------
 *  从「粉丝管理」里点某一类粉丝（事业粉 / 妈粉 / 颜粉 / 乐子人 / 毒唯 / CP粉）
 *  进来，看到的是一面「这一类人正在说什么」的留言墙。
 *
 *  ★ 剧情作者怎么改：
 *    - 想加一句话：直接在下面 ACTOR_LINES["zp"].career 里加一行字符串。
 *    - 想给某个艺人单独定制某一类：加在对应的 key 下面；没有就自动用 COMMON。
 *    - 改颜色 / 名字 / 标语：改 META。
 *  这里的文字只影响"氛围"，不改任何数值。
 * ========================================================================= */
(function (root) {
  'use strict';

  /* ---------- 1. 七类粉丝的皮 ---------- */
  var META = {
    career: { label: '事业粉', icon: '📈', color: '#4E74B8', soft: '#ECF3FE',
              slogan: '数据不会骗人，他的事业我们自己扛。' },
    mom:    { label: '妈粉',   icon: '🧸', color: '#3F8A6E', soft: '#E9F7F0',
              slogan: '不求你大红大紫，只求你吃好睡好。' },
    face:   { label: '颜粉',   icon: '💄', color: '#C06A87', soft: '#FDEEF3',
              slogan: '这张脸，是娱乐圈的公共财产。' },
    clown:  { label: '乐子人', icon: '🍿', color: '#A07B32', soft: '#FCF3E3',
              slogan: '我不追星，我只是恰好路过。' },
    toxic:  { label: '毒唯',   icon: '🗡️', color: '#B65F70', soft: '#FDECEF',
              slogan: '他的世界只有我们，别人都不算数。' },
    cp:     { label: 'CP粉',   icon: '💞', color: '#8070C0', soft: '#F1EDFB',
              slogan: '他们是真的。我不管，就是真的。' },
    dream:  { label: '梦女',   icon: '🌙', color: '#B96A95', soft: '#FBEDF4',
              slogan: '今晚的梦，还是你。' }
  };
  var ORDER = ['career', 'mom', 'face', 'clown', 'toxic', 'cp', 'dream'];

  /* ---------- 2. 昵称池 ---------- */
  var NICKS = {
    career: ['数据女工003', '事业线观察员', '已退出饭圈（未成功）', '做数据的第八年',
             '冲鸭小分队', '实绩图收藏家', '只看作品不看人', '打工人的自我修养'],
    mom:    ['崽崽的妈妈', '早八人', '一只老母亲', '保暖协会会长', '不许熬夜',
             '厨房常驻嘉宾', '妈妈永远爱你', '饭要吃完'],
    face:   ['颜狗本狗', '截图机', '生图鉴赏家', '骨相研究员', '斯哈斯哈',
             '这张脸我存了八百张', '下颌线守护者', '侧脸控'],
    clown:  ['纯路人（真的）', '吃瓜第一线', '反向冲浪选手', '路过的一只', '瓜田里的猹',
             '键盘侠本侠', '来看看不说话', '不带感情地围观'],
    toxic:  ['唯爱一人', '反黑组组长', '非官宣不约', '守塔人', '别蹭',
             '我们哥哥只有我们', '已取证', '控评中'],
    cp:     ['民政局搬运工', '磕到升天', '同款侦探', '糖分超标', '慢放八百遍',
             '眼神分析员', '他们是真的'],
    dream:  ['老公的第七个号', '做梦素材库', '今晚不睡', '命给你', '异地恋女友',
             '他看我了我确定', '梦里见过'],
    /* 嬷嬷粉专用昵称（黄耀祖这一栏顶上用） */
    momo:   ['他唯一的攻', '受妈本妈', '反攻联盟会长', '不许他当攻', '腰细腿长观察员',
             '想看他被拿捏', '他适合被欺负', '老实人吃亏粉']
  };

  var TIMES = ['刚刚', '2 分钟前', '18 分钟前', '43 分钟前', '1 小时前',
               '3 小时前', '今天 02:41', '今天 07:08', '昨天 23:12', '昨天 21:36'];

  /* ---------- 3. 通用台词（任何艺人都可能出现的） ---------- */
  var COMMON = {
    career: [
      '什么时候进组？给个准话。',
      '别接综艺了，真的，掉价。',
      '这个月的行程表是不是空的？',
      '同事都在冲奖，我们家在冲商务。',
      '拜托公司给他排个正经本子吧。',
      '作品才是底气，其他都是虚的。'
    ],
    mom: [
      '今天有没有好好吃饭？',
      '脸色不太好，是不是又熬夜了。',
      '别太拼了，身体要紧。',
      '不管别人怎么说，妈妈都站你这边。',
      '手怎么这么凉，多穿一件。'
    ],
    face: [
      '这张脸是怎么长的啊。',
      '生图比精修好看，这合理吗。',
      '求求你别笑了，我心脏受不了。',
      '这个角度可以直接当壁纸。',
      '我承认我是来看脸的。',
      '造型师今天可以加鸡腿。'
    ],
    clown: [
      '来看戏了，爆米花自备。',
      '这瓜保熟吗？不熟我可不吃。',
      '内娱活人，挺稀有的。',
      '我对他没意见，我就是来乐呵的。',
      '笑死，这也能上热搜？',
      '路过，蹲一个后续。'
    ],
    toxic: [
      '公司倒闭了吗？没有我明天再问。',
      '非官宣不约，其他的别来沾边。',
      '只有我们还在给他做数据。',
      '离那个谁远一点，我说的是谁你们清楚。',
      '再乱安排行程试试看。',
      '他的时间不是给你们浪费的。'
    ],
    cp: [
      '这个眼神，我真的会以为是真的。',
      '同款，同一家店，还说没什么？',
      '民政局我给你们搬来了。',
      '慢放之后更不对劲了。',
      '他们自己知道自己在干什么吗。',
      '我不磕糖我会死。'
    ],
    dream: [
      '老公，今晚回家吃饭吗。',
      '做梦素材又有了，谢谢。',
      '他要是看我一眼，我能记一辈子。',
      '这种男人为什么不是我老公。',
      '别拦我，我要去横店当群演。',
      '今晚的梦已经预约好了。'
    ]
  };

  /* 嬷嬷粉的通用台词（黄耀祖的 CP 粉那一栏显示成嬷嬷粉，不混普通 CP 台词） */
  var MOMO_COMMON = [
    '他不适合当男朋友，适合当老婆。',
    '这种老实巴交的长相，最容易被按在墙上。',
    '他要是被人捏着下巴说话，声音一定是软的。',
    '有没有导演考虑一下，让他演个被强取豪夺的。',
    '别让他演男主了，让他演"男主的人"。',
    '他笑得那么乖，谁不想看他哭一次。',
    '我承认，我就是馋他身子。',
    '他那个腰，穿古装的时候我没法专心看剧情。'
  ];

  /* ---------- 4. 每个艺人自己的台词 ---------- */
  var ACTOR_LINES = {
    /* 展鹏：咸鱼特警，二线，已婚，综艺咖争议，爱摸鱼爱奶茶 */
    zp: {
      career: [
        '哥，《深空黎明》那种本子以后少碰，你值得更好的。',
        '三十五岁前必须拿个奖，不然以后只能演爹。',
        '别人家在撕电影，我们家在撕奶茶优惠券。',
        '打戏是真的好看，别浪费了，多接点硬的。',
        '三个月两部戏，这才叫干活，继续保持。'
      ],
      mom: [
        '宝宝是不是又瘦了，下巴都尖了。',
        '节目组给他安排那么满，谁心疼他。',
        '妈妈不要你红，妈妈只要你健康。',
        '看他打戏摔那一下，我心都揪起来了。',
        '记得喝热水，别老喝冰的。'
      ],
      face: [
        '这个下颌线是拿刀刻的吧。',
        '打戏那一下的侧脸，我截图截了三十遍。',
        '眼睛一抬我人就没了，谁负责。',
        '说他二十八我都信，这皮肤状态。',
        '穿这件衬衫是想干什么，想让我死吗。'
      ],
      clown: [
        '来看咸鱼营业了，今天翻身了吗。',
        '他是真懒还是演技就这样，谁给我解释一下。',
        '内娱唯一光明正大摸鱼的男人。',
        '我承认我来看乐子的，结果意外觉得还行。',
        '这哥们的采访比剧好看，建议转行。'
      ],
      toxic: [
        '别再给他接烂剧了，我们哥哥的时间不是钱？',
        '公司除了吸血还会干什么。',
        '只有我们在做数据，其他人在逛该。',
        '离那个谁远一点，我不想再看到同框。',
        '他一句怨言都没有，你们就欺负他脾气好。'
      ],
      cp: [
        '老板今天又给他递水了，你们看见没有。',
        '他提到老板的时候会笑，注意到了吗。',
        '同款外套，同一家店，还装。',
        '这个回头，我不信对面的人没心动。',
        '求你们了，公开吧，我嘴很严的。'
      ],
      dream: [
        '老公，今晚回家吃饭吗。',
        '他要是看我一眼，我能记一辈子。',
        '这种男人为什么不是我老公。',
        '别拦我，我要去横店当群演。',
        '今晚的梦已经预约好了。'
      ]
    },

    /* 秦飒：恶女，三线，演技好，清冷，气场强 */
    qs: {
      career: [
        '姐姐什么时候进组？本子不好我第一个骂。',
        '三线？这演技三线？评级的人眼睛是装饰吗。',
        '求一个正剧女主，别再让她演恶毒女配了。',
        '她挑本子的眼光比她公司靠谱多了。'
      ],
      mom: [
        '飒飒别太拼了，胃不好还喝冰的。',
        '谁说我们飒飒凶？她只是不爱笑。',
        '妈妈就喜欢你这样的，不装。',
        '收工了就早点睡，别刷手机。'
      ],
      face: [
        '这张脸就该去演祸国妖妃。',
        '冷脸的时候最好看，别笑了。',
        '骨相太优越了，灯光师都省事。',
        '这条裙子别人穿是衣服，她穿是武器。'
      ],
      clown: [
        '姐姐这个白眼翻得，我可以看一百遍。',
        '恶女本女，剧里剧外一个样。',
        '来看飒姐营业，顺便吃个瓜。',
        '她好像真的不在乎我们怎么想，好爽。'
      ],
      toxic: [
        '别拉我家姐姐炒 CP，谢谢。',
        '公司再让她演配角我就去门口坐着。',
        '她的资源配不上她的演技，这不是我说的，是数据说的。',
        '别再给她接那种傻白甜了，侮辱谁呢。'
      ],
      cp: [
        '她和谁的对手戏都有火花，这是天赋。',
        '这个回头，我不信对面的人没心动。',
        '她只有对那个人才会笑，我确定。',
        '剧里剧外都好嗑，我不管。'
      ],
      dream: [
        '姐姐踩我。',
        '这种气场，谁不想被骂一句。',
        '她要是看我一眼，我当场跪下。',
        '冷着脸的样子好想被她凶。'
      ]
    },

    /* 黄耀祖：替身出身，嬷嬷粉主场，唯唯诺诺 */
    huang: {
      career: [
        '新人就别挑了，有戏拍就不错了。',
        '先把台词练好，别再被剪成表情包。',
        '替身出身怎么了，替身也能当男主。',
        '这个资源是他自己争来的，别酸。'
      ],
      mom: [
        '崽崽别怕，慢慢来。',
        '他还是个孩子，你们别吓他。',
        '今天有没有人欺负他。',
        '他鞠躬鞠得那么深，我看着难受。'
      ],
      face: [
        '这张脸是有点东西的，就是还不会用。',
        '抬眼那一下，很像。',
        '再练练，能红。',
        '他笑起来其实挺好看的，别老低着头。'
      ],
      clown: [
        '替身哥今天又替谁了。',
        '他演的那个片子……我不好说。',
        '来考古的，越考越上头。',
        '这履历放出来能吓死一半人。'
      ],
      toxic: [
        '哥哥只有我们了。',
        '别蹭了，我们不屑。',
        '谁说他是替身？他就是他。',
        '你们骂他的时候，想过他怎么熬过来的吗。'
      ],
      cp: [
        '他明明一脸老实，我却总想让他被人欺负。',
        '这种弟弟，就该被人好好"管教"一下。',
        '求他演一次被强取豪夺的角色，我出钱。',
        '他低头那个样子，谁看了不想上手。',
        '他这身形是怎么做到又壮又软的。',
        '别让他当攻，他当攻我是不会认的。',
        '他和谁站一起都像被欺负的那个。',
        '这个体型差，我先磕为敬。'
      ],
      dream: [
        '这种弟弟，姐姐真的可以。',
        '想看他哭。',
        '他要是叫我一声姐姐，我命都没了。'
      ]
    },

    /* 刘梁周：摄影师，艺术粉，时尚挂 */
    liu: {
      career: [
        '别接商业片了，去拍文艺片。',
        '他适合镜头，不适合综艺。',
        '求一个摄影展，我买票。'
      ],
      mom: [
        '孩子太瘦了，风一吹就倒。',
        '别老熬夜修图。'
      ],
      face: [
        '手比脸好看，脸比命好看。',
        '这个构图感是天生的。',
        '他站在那不动就是一张海报。'
      ],
      clown: [
        '他不是摄影师吗，怎么开始演戏了。',
        '演技确实一般，但画面是真好看。'
      ],
      toxic: [
        '别拿他当花瓶。',
        '公司能不能给他接点有脑子的活。'
      ],
      cp: [
        '他镜头里的人，都是有感情的。',
        '这张照片的角度，太私人了。'
      ],
      dream: [
        '想被他拍一张。',
        '他要是说一句"别动"，我能站到天黑。'
      ]
    },

    /* 白小纯：新人，年轻，糊 */
    new: {
      career: [
        '新人先跑组，别想一步登天。',
        '公司是不是没钱了，怎么一点资源都没有。',
        '先把基本功练好，别急着上综艺。'
      ],
      mom: [
        '崽崽好可爱。',
        '妈妈给你投票了，别哭。',
        '他还小，慢慢来。'
      ],
      face: [
        '这小孩长得真干净。',
        '眼睛亮亮的，像小动物。',
        '再长大两年不得了。'
      ],
      clown: [
        '糊咖也想上位？',
        '来看新人，顺便留个名。',
        '这孩子有点意思。'
      ],
      toxic: [
        '非官宣不约。',
        '别拿他当垫脚石。'
      ],
      cp: [
        '他和谁都能嗑一口。',
        '这个年纪的小孩，眼神藏不住事。'
      ],
      dream: [
        '弟弟，姐姐可以。',
        '他叫我姐姐的时候我腿软了。'
      ]
    }
  };

  /* ---------- 5. 工具 ---------- */
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function num(n) {
    n = Number(n) || 0;
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  /* 把 1240 写成 1.2k */
  function likes(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return String(n);
  }

  /* ---------- 6. 标签（含个别艺人的定制叫法） ---------- */
  /* 黄耀祖的「CP 粉」这一栏，实际上住的是嬷嬷粉（妈粉就是妈粉，不再顶替） */
  function isMomo(actorKey, type) {
    return (actorKey === 'huang' || actorKey === 'new_boy') && type === 'cp';
  }
  function metaOf(actorKey, type) {
    var m = META[type] || META.career;
    var label = m.label, icon = m.icon, color = m.color, soft = m.soft, slogan = m.slogan;
    if (actorKey === 'liu' && type === 'career') label = '艺术粉';
    if (isMomo(actorKey, type)) {
      label = '嬷嬷粉';
      icon = '🥀';
      color = '#A85B76';
      soft = '#FBEAF0';
      slogan = '不许他当攻。';
    }
    return {
      key: type,
      label: label,
      icon: icon,
      color: color,
      soft: soft,
      slogan: slogan
    };
  }

  /* ---------- 7. 类型切换胶囊 ---------- */
  function chips(current, actorKey) {
    var out = '<div class="fw-chips">';
    for (var i = 0; i < ORDER.length; i++) {
      var t = ORDER[i];
      var m = metaOf(actorKey, t);
      out += '<a class="fw-chip' + (t === current ? ' on' : '') + '"' +
        ' data-go="Fan_Wall" data-set=\'{"wall_fan":"' + t + '"}\'' +
        ' style="--c:' + m.color + '">' +
        '<span class="fw-chip-ico">' + m.icon + '</span>' + m.label +
        '</a>';
    }
    out += '</div>';
    return out;
  }

  /* ---------- 8. 留言流 ---------- */
  function feed(actorKey, type, count) {
    count = count || 8;
    var momo = isMomo(actorKey, type);
    var own = (ACTOR_LINES[actorKey] || {})[type] || [];
    var com = momo ? MOMO_COMMON : (COMMON[type] || []);
    var bag = shuffle(own).slice(0, 4).concat(shuffle(com));
    /* 打散，避免"先四句本人的再四句通用的"这种机械感 */
    bag = shuffle(bag).slice(0, count);

    var m = metaOf(actorKey, type);
    var nicks = shuffle((momo ? NICKS.momo : NICKS[type]) || NICKS.clown);
    var out = '';
    for (var i = 0; i < bag.length; i++) {
      var like = Math.floor(Math.random() * 4200) + 12;
      var reply = Math.floor(Math.random() * 90);
      out +=
        '<article class="fw-item' + (i === 0 ? ' hot' : '') + '">' +
          '<span class="fw-ava" style="background:' + m.soft + ';color:' + m.color + '">' +
            m.icon +
          '</span>' +
          '<div class="fw-main">' +
            '<div class="fw-head">' +
              '<span class="fw-nick">' + esc(nicks[i % nicks.length]) + '</span>' +
              (i === 0 ? '<span class="fw-tag">热评</span>' : '') +
              '<span class="fw-time">' + pick(TIMES) + '</span>' +
            '</div>' +
            '<p class="fw-text">' + esc(bag[i]) + '</p>' +
            '<div class="fw-foot">' +
              '<button type="button" class="fw-like" data-like data-n="' + like + '">' +
                '<span>♥</span> <b>' + likes(like) + '</b>' +
              '</button>' +
              '<span class="fw-rep">回复 ' + reply + '</span>' +
            '</div>' +
          '</div>' +
        '</article>';
    }
    return out;
  }

  /* ---------- 9. 点赞 / 加载更多（挂一次，之后都靠委托） ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (!t.closest) return;

    var likeBtn = t.closest('.fw-like');
    if (likeBtn) {
      ev.preventDefault();
      var b = likeBtn.querySelector('b');
      var n = parseInt(likeBtn.getAttribute('data-n') || '0', 10);
      if (likeBtn.classList.contains('on')) { n -= 1; likeBtn.classList.remove('on'); }
      else { n += 1; likeBtn.classList.add('on'); }
      likeBtn.setAttribute('data-n', n);
      if (b) b.textContent = likes(n);
      return;
    }

    var moreBtn = t.closest('[data-fw-more]');
    if (moreBtn) {
      ev.preventDefault();
      var feedEl = document.getElementById('fw-feed');
      if (!feedEl) return;
      var a = moreBtn.getAttribute('data-actor') || 'zp';
      var f = moreBtn.getAttribute('data-fan') || 'career';
      feedEl.insertAdjacentHTML('beforeend', feed(a, f, 6));
      return;
    }
  }, false);

  /* =====================================================================
   *  9. 粉丝反应 —— 每做一次粉丝运营，评论区里的人在说什么
   *  ★ 想改文案：直接改下面 REACT 里对应操作后面的 s 字符串。
   *    t 是说话的人属于哪一类粉丝：career / mom / face / clown / toxic / cp / dream
   * ===================================================================== */
  var REACT_META = {
    visual:        { title: '粉丝反应', sub: '官图刚发出去，评论区已经挤爆了' },
    visual_x10:    { title: '粉丝反应', sub: '连发十组之后，首页的反应开始分裂' },
    miserable:     { title: '粉丝反应', sub: '通稿铺出去之后，评论区的气氛变了' },
    miserable_x10: { title: '粉丝反应', sub: '满屏都是心疼，也满屏都是"又来了"' },
    fake_cp:       { title: '粉丝反应', sub: '剪辑刚上线，两拨人就在评论区吵起来了' },
    fake_cp_x10:   { title: '粉丝反应', sub: '糖精铺满全网，唯粉的脸已经黑了' },
    guide_war:     { title: '粉丝反应', sub: '水军一进场，评论区就关不上了' },
    guide_war_x10: { title: '粉丝反应', sub: '全网开撕，热搜下面已经打成一锅粥' }
  };

  var REACT = {
    /* --- 媚粉福利 --- */
    visual: [
      { t: 'face',   s: '放粮赈灾了！！！今天我就是最幸福的那只狗。' },
      { t: 'face',   s: '这个光、这个角度，我已经换了三个手机壁纸。' },
      { t: 'face',   s: '求求了，别停，我还饿。' },
      { t: 'career', s: '有这时间不如进组。' },
      { t: 'career', s: '图再好看也不产粮，上一部戏是什么时候的事了？' },
      { t: 'career', s: '营业是营业，作品是作品，别搞混。' },
      { t: 'clown',  s: '一天三组图，这是要靠脸冲业绩啊。' },
      { t: 'mom',    s: '终于舍得营业了，妈妈等了好久。' },
      { t: 'toxic',  s: '发了就好，别理那些酸的。' }
    ],
    visual_x10: [
      { t: 'face',   s: '我手机内存快没了，但我一张也不想删。' },
      { t: 'career', s: '刷屏刷到我关了推送，这钱花得真不值。' },
      { t: 'clown',  s: '首页现在全是他的脸，我快不认识别人了。' },
      { t: 'clown',  s: '这波投放也太明显了，广告位像是排到了明年。' },
      { t: 'toxic',  s: '公司除了发图还会干什么。' },
      { t: 'mom',    s: '孩子是不是被逼着营业的，看着好累。' }
    ],

    /* --- 卖惨虐粉 --- */
    miserable: [
      { t: 'mom',    s: '他是不是真的病了？别瞒我们。' },
      { t: 'mom',    s: '看到那句"我没事"，我眼泪就下来了。' },
      { t: 'toxic',  s: '全世界都在欺负他，只有我们还在。' },
      { t: 'career', s: '卖惨不如进组，这话我说第三遍了。' },
      { t: 'clown',  s: '这通稿写得，我眼泪都省了。' },
      { t: 'clown',  s: '又来？上一波还没过去一个月吧。' }
    ],
    miserable_x10: [
      { t: 'mom',    s: '满屏都是他生病的消息，我心脏受不了。' },
      { t: 'toxic',  s: '从今天起我就是毒唯，谁也别劝。' },
      { t: 'career', s: '公司拿他身体换流量，恶心。' },
      { t: 'clown',  s: '这波卖惨力度，我承认我有点麻木了。' },
      { t: 'clown',  s: '全网都在心疼他，只有我在数这是第几次。' }
    ],

    /* --- 工业糖精 --- */
    fake_cp: [
      { t: 'cp',     s: '他们是真的！！！这个眼神骗不了人。' },
      { t: 'cp',     s: '民政局我搬来了，你们自己看着办。' },
      { t: 'toxic',  s: '恶心，别拿我家孩子炒。' },
      { t: 'mom',    s: '别拉他炒 CP，他还小。' },
      { t: 'career', s: '炒 CP 能炒出一个奖吗？' },
      { t: 'clown',  s: '糖精味有点冲，但我还是看完了。' }
    ],
    fake_cp_x10: [
      { t: 'cp',     s: '全网都是他们的剪辑，我磕到上头了。' },
      { t: 'toxic',  s: '取关。真的取关。' },
      { t: 'mom',    s: '心疼他被这样消费。' },
      { t: 'career', s: '这一波下去，路人缘彻底没了。' },
      { t: 'clown',  s: '这糖精量，齁得我喝了两杯水。' }
    ],

    /* --- 脂粉下场 --- */
    guide_war: [
      { t: 'toxic',  s: '就是战斗爽，来啊。' },
      { t: 'clown',  s: '开始了开始了，搬小板凳。' },
      { t: 'mom',    s: '别撕了，他看到会难过的。' },
      { t: 'career', s: '把精力用在数据上不好吗。' },
      { t: 'face',   s: '打架不如发图。' }
    ],
    guide_war_x10: [
      { t: 'toxic',  s: '全网开战，我们从来没怕过。' },
      { t: 'clown',  s: '内娱今天真热闹，瓜子不够了。' },
      { t: 'career', s: '热搜是上去了，口碑呢？' },
      { t: 'mom',    s: '我不管谁对谁错，我只想他别看到这些。' },
      { t: 'clown',  s: '路人转黑，别问我怎么知道的。' }
    ]
  };

  /* 每个艺人自己对同一种操作的反应（会额外插一条在列表里） */
  var ACTOR_REACT = {
    zp: {
      visual:    [{ t: 'face', s: '哥你这个状态，能不能天天营业。' }],
      miserable: [{ t: 'mom',  s: '打戏摔那一下还没好，别又让他熬夜。' }],
      fake_cp:   [{ t: 'cp',   s: '他和老板同框的时候，整个人都松下来了。' }],
      guide_war: [{ t: 'toxic', s: '哥哥的资源本来就少，别再给他招黑了。' }]
    },
    qs: {
      visual:    [{ t: 'face',  s: '姐姐这张脸不需要滤镜。' }],
      miserable: [{ t: 'toxic', s: '我不需要通稿，我只需要他们别再让她演配角。' }],
      fake_cp:   [{ t: 'cp',    s: '她和谁都有火花，但这次也太明显了。' }],
      guide_war: [{ t: 'clown', s: '飒姐粉打架跟本人一样凶。' }]
    },
    huang: {
      visual:    [{ t: 'cp',   s: '图我存了，能不能再来几张全身的。' }],
      miserable: [{ t: 'mom',  s: '他是真的会哭，不是演的。' }],
      fake_cp:   [{ t: 'cp',   s: '就他这身板，还想当攻？' }],
      guide_war: [{ t: 'toxic', s: '你们骂他的时候，想过他以前怎么熬过来的吗。' }]
    },
    liu: {
      visual:    [{ t: 'face',   s: '他站在那不动就是一张海报。' }],
      miserable: [{ t: 'clown',  s: '摄影师也出来卖惨了，这年头。' }],
      fake_cp:   [{ t: 'cp',     s: '他镜头里的人都是有感情的，这次是被人当道具了。' }],
      guide_war: [{ t: 'career', s: '别毁了他的调性。' }]
    },
    new: {
      visual:    [{ t: 'mom',   s: '崽崽终于有图了，妈妈存了。' }],
      miserable: [{ t: 'mom',   s: '他还这么小，别让他受这些。' }],
      fake_cp:   [{ t: 'clown', s: '糊咖炒 CP，炒得起来吗。' }],
      guide_war: [{ t: 'toxic', s: '别拿他当垫脚石。' }]
    }
  };

  var JUST_NOW = ['刚刚', '1 分钟前', '2 分钟前', '3 分钟前', '6 分钟前'];

  /* 黄耀祖的嬷嬷粉不说 CP 那套（"他们是真的"跟她们没关系），换成自己的一套 */
  var MOMO_REACT = [
    '就他这身板，还想当攻？',
    '他和谁站一起都像被欺负的那个。',
    '我只想看他被人拿捏，不想看他谈恋爱。',
    '可怜见的，被人卖了还帮人数钱。',
    '这脸、这腰，不被人惦记才怪。',
    '我倒要看看最后是谁把他哄到手。'
  ];

  function block(actorKey, action) {
    var meta = REACT_META[action] || REACT_META.visual;
    var pool = REACT[action] || REACT.visual;
    var own = (ACTOR_REACT[actorKey] || {})[action] || [];

    var list = [];
    if (own.length) {
      var o = own[Math.floor(Math.random() * own.length)];
      list.push({ t: o.t, s: o.s, own: 1 });
    }
    var rest = shuffle(pool);
    for (var i = 0; i < rest.length && list.length < 5; i++) {
      var dup = false;
      for (var j = 0; j < list.length; j++) { if (list[j].s === rest[i].s) dup = true; }
      if (!dup) list.push(rest[i]);
    }
    list = shuffle(list);

    var html = '<div class="fan-react">' +
      '<div class="fr-head">' +
        '<span class="fr-title">💬 ' + meta.title + '</span>' +
        '<span class="fr-sub">' + meta.sub + '</span>' +
      '</div>' +
      '<div class="fr-list">';

    var usedNick = {};
    var usedText = {};
    for (var k = 0; k < list.length; k++) {
      var it = list[k];
      var m = metaOf(actorKey, it.t);
      var pool2 = isMomo(actorKey, it.t) ? NICKS.momo : (NICKS[it.t] || NICKS.clown);
      var nick = pool2[Math.floor(Math.random() * pool2.length)];
      var guard = 0;
      while (usedNick[nick] && guard < 30) {
        nick = pool2[Math.floor(Math.random() * pool2.length)];
        guard++;
      }
      if (usedNick[nick]) nick = nick + (k + 1);
      usedNick[nick] = 1;

      var text = it.s;
      if (isMomo(actorKey, it.t) && !it.own) {
        var g2 = 0;
        do {
          text = MOMO_REACT[Math.floor(Math.random() * MOMO_REACT.length)];
          g2++;
        } while (usedText[text] && g2 < 24);
      }
      usedText[text] = 1;

      html +=
        '<div class="fr-item">' +
          '<span class="fr-ava" style="background:' + m.soft + ';color:' + m.color + '">' + m.icon + '</span>' +
          '<div class="fr-main">' +
            '<div class="fr-top">' +
              '<span class="fr-tag" style="color:' + m.color + ';background:' + m.color + '24;border-color:' + m.color + '40">' + m.label + '</span>' +
              '<span class="fr-nick">' + esc(nick) + '</span>' +
              '<span class="fr-time">' + JUST_NOW[k % JUST_NOW.length] + '</span>' +
            '</div>' +
            '<p class="fr-text">' + esc(text) + '</p>' +
          '</div>' +
        '</div>';
    }

    html += '</div></div>';
    return html;
  }

  root.WYFanReact = { block: block };

  root.WYFanWall = {
    meta: metaOf,
    chips: chips,
    feed: feed,
    isMomo: isMomo,
    num: num,
    order: ORDER
  };

})(typeof window !== 'undefined' ? window : globalThis);


/* ---------- 故事块：Fan_Wall ---------- */
window.__STORY_PASSAGES.push({
  name: "Fan_Wall",
  src: `<<nobr>>
<<set _a to $actors[$current_actor]>>
<<if not _a or not _a.name>><<set _a to $actors.zp>><<set $current_actor to "zp">><</if>>
<<if not def $wall_fan>><<set $wall_fan to "career">><</if>>
<<if WYFanWall.order.indexOf($wall_fan) < 0>><<set $wall_fan to "career">><</if>>

<<set _f to _a.fans>>
<<set _tot to (_f.career || 0) + (_f.mom || 0) + (_f.face || 0) + (_f.clown || 0) + (_f.toxic || 0) + (_f.cp || 0) + (_f.dream || 0)>>
<<if _tot < 1>><<set _tot to 1>><</if>>
<<set _cnt to _f[$wall_fan]>>
<<if not def _cnt>><<set _cnt to 0>><</if>>
<<set _pct to Math.round(_cnt / _tot * 100)>>
<<set _m to WYFanWall.meta($current_actor, $wall_fan)>>

<div class="tech-card fan-wall">
  <div class="header-banner fw-banner">
    <span>💬 <<print _m.label>>的超话</span>
    <span class="fw-banner-sub">@<<print _a.name>></span>
  </div>

  <div class="fw-body">

    /* --- 顶部：这个群体有多少人、占多少 --- */
    <div class="fw-top" style="--c:<<print _m.color>>;--soft:<<print _m.soft>>">
      <div class="fw-badge"><<print _m.icon>></div>
      <div class="fw-top-main">
        <div class="fw-top-title"><<print _m.label>> <span class="fw-count"><<print WYFanWall.num(_cnt)>> 人</span></div>
        <div class="fw-top-sub">占 <b><<print _a.name>></b> 全部粉丝的 <b><<print _pct>>%</b> · 共 <b><<print WYFanWall.num(_tot)>></b> 人</div>
        <div class="fw-slogan">「<<print _m.slogan>>」</div>
      </div>
    </div>

    /* --- 类型切换 --- */
    <<print WYFanWall.chips($wall_fan, $current_actor)>>

    /* --- 留言流 --- */
    <div class="fw-feed" id="fw-feed"><<print WYFanWall.feed($current_actor, $wall_fan, 8)>></div>

    <div class="fw-more">
      <button type="button" class="fw-more-btn" data-fw-more data-actor="<<print $current_actor>>" data-fan="<<print $wall_fan>>">
        加载更多留言
      </button>
    </div>

    /* --- 底部 --- */
    <div class="fw-foot-nav">
      <a class="side-link fw-back" data-go="Fan_Management" data-actor="<<print $current_actor>>">‹ 返回后援会总舵</a>
      <a class="side-link fw-back" data-go="Office">返回办公室</a>
    </div>

  </div>
</div>
<</nobr>>`
});
