/* ===========================================================================
   ⑬ 影视作品库 · 播出 · 播出期营销（2026-10-27 新增）
   ---------------------------------------------------------------------------
   ★ 这个文件是【故事内容】，可以放心修改。
   ★ 一句话说明这套东西在干什么：
       接戏时从「剧本池」抽一部 → 杀青时登记进作品库并定档 → 几个月后播出
       → 播出当月与次月可以花钱营销 → 成绩结算完就存档进作品库。
   ★ 想加剧本：直接往下面 FILM_POOL 对应等级里加一条，id 不要重复。
   ★ 想改播出间隔：搜 "random(4, 6)"（在 Film_Archive 里）。
   =========================================================================== */

window.__STORY_PASSAGES = window.__STORY_PASSAGES || [];

/* 评分配色：给一个 0~100 的分，返回对应的 CSS 类名 */
window.FilmSc = function (n) {
  n = n || 0;
  if (n >= 85) return "sc-hi";
  if (n >= 75) return "sc-good";
  if (n >= 60) return "sc-ok";
  if (n >= 45) return "sc-flat";
  return "sc-bad";
};

/* ===========================================================================
   评分档位表
   ---------------------------------------------------------------------------
   一部戏播出后落在哪一档，全看这里的 min。
   字段：t 档位名 / pay 片酬加成 / fan 每月粉丝流入（比例）/ rep 播出后第
        1、2、3 个月各加多少口碑 / line 口碑页的一句话总评
   ★ 想调强弱就改 pay 和 fan；★ 想让某个档位更常见，改 Film_Air_Tick 里的分档线。
   =========================================================================== */
window.FILM_TIER = [
  { min: 85, key: "god",  t: "🏆 年度剧王", pay: 0.18,  fan: 0.0100, rep: [2, 1, 0],
    line: "开分即封神。这部剧被反复拉出来当行业标杆，连平时不看国产剧的人都补完了。" },
  { min: 75, key: "good", t: "✨ 口碑佳作", pay: 0.12,  fan: 0.0060, rep: [1, 1, 0],
    line: "口碑一路走高，自来水自发安利。不算现象级，但足够让业内记住这个名字。" },
  { min: 60, key: "ok",   t: "📺 平稳播出", pay: 0.06,  fan: 0.0030, rep: [0, 0, 0],
    line: "该看的都看了，没出错也没出彩。播完之后很快被下一部剧盖过去。" },
  { min: 45, key: "flat", t: "😐 反应平淡", pay: 0.02,  fan: 0.0010, rep: [0, 0, 0],
    line: "热搜一次没上，弹幕稀稀拉拉。观众看完就忘，连吐槽的兴致都没有。" },
  { min: 0,  key: "bad",  t: "💀 扑了",     pay: -0.05, fan: -0.0020, rep: [-1, -1, 0],
    line: "开分就塌，剪辑和台词被逐条截图。骂声盖过了剧情本身。" }
];

window.FilmTierOf = function (score) {
  var s = score || 0, T = window.FILM_TIER;
  for (var i = 0; i < T.length; i++) { if (s >= T[i].min) return T[i]; }
  return T[T.length - 1];
};

/* ===========================================================================
   作品余温（2026-10-27 新增）
   ---------------------------------------------------------------------------
   一部戏播出后，接下来的 3 个月会持续给主演加成：
       第 1 个月 ×1.0 → 第 2 个月 ×0.6 → 第 3 个月 ×0.3，逐月衰减
   加成 = 片酬/通告费报价（结算时直接乘上去） + 每月粉丝流入 + 每月口碑
   ★ 想改「几个月」：改下面的 3（同时 FilmBuffOne 里的范围也要一起改）。
   =========================================================================== */
window.FILM_BUFF_DECAY = [1, 0.6, 0.3];

/* 单部作品的余温；不在加成期就返回 null */
window.FilmBuffOne = function (f, month) {
  if (!f || f.status === "pending") return null;
  var m = (month || 0) - (f.air || 0);
  if (m < 1 || m > window.FILM_BUFF_DECAY.length) return null;
  var t = window.FilmTierOf(f.score);
  var d = window.FILM_BUFF_DECAY[m - 1];
  return {
    m: m,
    decay: d,
    left: window.FILM_BUFF_DECAY.length - m,
    pay: t.pay * d,
    fan: t.fan * d,
    rep: (t.rep && t.rep[m - 1]) || 0
  };
};

/* 某个演员当前全部作品的余温合计
   pay 合计夹在 -15% ~ +35%，fan 合计夹在 -3% ~ +4%，防止叠出天文数字 */
window.FilmBuffSum = function (lib, key, month) {
  var out = { pay: 0, fan: 0, rep: 0, items: [] };
  lib = lib || [];
  for (var i = 0; i < lib.length; i++) {
    var f = lib[i];
    if (!f || f.actor !== key) continue;
    var b = window.FilmBuffOne(f, month);
    if (!b) continue;
    out.pay += b.pay; out.fan += b.fan; out.rep += b.rep;
    out.items.push({ name: f.name, b: b });
  }
  out.pay = Math.max(-0.15, Math.min(0.35, out.pay));
  out.fan = Math.max(-0.03, Math.min(0.04, out.fan));
  return out;
};

/* 稳定的伪随机：同一部戏每次进来看到的评价都一样，不会刷一次变一次 */
window.FilmHash = function (s) {
  s = String(s || "x");
  var h = 7;
  for (var i = 0; i < s.length; i++) { h = (h * 31 + s.charCodeAt(i)) % 100003; }
  return h;
};

/* 按 id 找回剧本池里那条原始数据（详情页要展示剧情简介） */
window.FilmFind = function (id) {
  var P = window.FILM_POOL || {};
  for (var k in P) {
    if (!P.hasOwnProperty(k)) continue;
    for (var i = 0; i < P[k].length; i++) { if (P[k][i].id === id) return P[k][i]; }
  }
  return null;
};

/* ===========================================================================
   口碑 / 粉丝评价文案池
   ---------------------------------------------------------------------------
   每个档位：media 媒体短评、net 网友短评、fan 粉丝留言（带粉丝类型）
   ★ 想加一句话，直接往数组里加，界面会自动轮着用。
   =========================================================================== */
window.FILM_VOICE = {
  god: {
    media: [
      "「今年最好的剧，没有之一。」——《影视观察》",
      "「镜头、台词、表演全部在线，这才是钱该花的地方。」——某影评号",
      "「服化道考据到令人发指，连一只碗都有出处。」——行业周报"
    ],
    net: [
      "一口气看完，字幕滚完还坐着没动。",
      "本来只想看两集试试，现在已经开始二刷了。",
      "把这部剧安利给了全办公室，一个都没跑掉。"
    ],
    fan: [
      { k: "career", t: "实绩图已更新，谢谢剧组谢谢导演谢谢所有人。" },
      { k: "face",   t: "这部剧里连哭都好看，我截图截到手软。" },
      { k: "cp",     t: "他们的每一次对视我都能磕三年。" },
      { k: "moe",    t: "角色太让人心疼了，我追着追着就开始护着他。" }
    ]
  },
  good: {
    media: [
      "「完成度很高，节奏稳，演员撑住了。」——《剧集观察》",
      "「近半年最值得推荐的一部，可惜宣发太弱。」——某影评号",
      "「细节经得起推敲，看得出是认真做的。」——行业周报"
    ],
    net: [
      "比想象中好看太多了，怎么没上热搜。",
      "推荐给了我妈，她也追完了。",
      "结局有点仓促，但前面真的很好看。"
    ],
    fan: [
      { k: "career", t: "口碑稳住了，这就是我要的实绩。" },
      { k: "face",   t: "这个造型我存了八十张，够我用到明年。" },
      { k: "cp",     t: "第二条线能不能单独拍一部，我出钱。" },
      { k: "mom",    t: "拍这部的时候是不是又没好好吃饭。" }
    ]
  },
  ok: {
    media: [
      "「中规中矩，能看，但记不住。」——某剧评号",
      "「工业水准合格，缺少一点野心。」——《剧集观察》",
      "「演员没问题，问题在剧本。」——网友评论被顶到热评"
    ],
    net: [
      "下饭剧，边吃边看刚好。",
      "看完就忘了，但看的时候不难受。",
      "前半段还行，后半段有点拖。"
    ],
    fan: [
      { k: "career", t: "有作品总比没有好，下一部再冲。" },
      { k: "face",   t: "剧一般，但人是真的好看。" },
      { k: "clown",  t: "我不是来看剧的，我是来看弹幕的。" },
      { k: "passerby", t: "刷到片段觉得还行，就去看了。" }
    ]
  },
  flat: {
    media: [
      "「无声无息地播完了，几乎没人讨论。」——行业周报",
      "「题材不错，拍得太平。」——某剧评号",
      "「收视率曲线几乎是平的。」——数据号"
    ],
    net: [
      "我是怎么点进这个的。",
      "看了三集，想不起来主角叫什么。",
      "不是烂，是无聊。"
    ],
    fan: [
      { k: "career", t: "这部剧就当没拍过吧，我们看下一部。" },
      { k: "face",   t: "只有我在看脸，剧情我一个字都没记住。" },
      { k: "clown",  t: "连吐槽都没什么可吐的，太干了。" },
      { k: "passerby", t: "刷到过，划走了。" }
    ]
  },
  bad: {
    media: [
      "「年度最令人失望的作品，没有之一。」——某影评号",
      "「从剧本到剪辑，每一环都在拖后腿。」——《剧集观察》",
      "「建议直接下架，别浪费观众时间。」——热评第一"
    ],
    net: [
      "开分 3 点几不是没有理由的。",
      "看十分钟就关了，台词像 AI 写的。",
      "我是被预告片骗进来的。"
    ],
    fan: [
      { k: "career", t: "求公司以后别再给他接这种本子了。" },
      { k: "toxic",  t: "这剧扑了，账得算在剧组头上。" },
      { k: "clown",  t: "谢谢，笑了整整四十集。" },
      { k: "passerby", t: "朋友推荐我来看笑话的，确实好笑。" }
    ]
  }
};

/* ===========================================================================
   剧本池
   ---------------------------------------------------------------------------
   每级 12 部：9 部「正经戏」+ 3 部「循环烂片」。
     rot: false  → 全局唯一，接过一次就再也不出现
     rot: true   → 循环烂片，没戏可接时永远抽得到（烂片不挑人）
   字段：id / name（自带《》）/ desc（一句简介）/ rot
   =========================================================================== */
window.FILM_POOL = {
  s: [
    { id: "s1",  name: "《大秦：帝国余晖》",       desc: "投资 3 亿的历史正剧，老戏骨云集，冲奖预定。", rot: false },
    { id: "s2",  name: "《深空彼岸》",             desc: "好莱坞团队做特效的硬核科幻，人类最后的希望。", rot: false },
    { id: "s3",  name: "《长安十二时辰·夜宴》",     desc: "服化道精良，还原大唐盛世的悬疑巨制。", rot: false },
    { id: "s4",  name: "《苍穹之昂》",             desc: "知名 IP 改编的史诗级仙侠，特效烧钱。", rot: false },
    { id: "s5",  name: "《潮汐》",                 desc: "文艺片，全片只有两个演员和一片海，冲着国际电影节去的。", rot: false },
    { id: "s6",  name: "《雪落长河》",             desc: "战争史诗，零下三十度实景拍摄，全组冻哭了三个。", rot: false },
    { id: "s7",  name: "《九章》",                 desc: "高智商犯罪推理剧，每一集藏着一个数学隐喻。", rot: false },
    { id: "s8",  name: "《人间烟火录》",           desc: "横跨四十年的年代群像，从粮票一直拍到外卖。", rot: false },
    { id: "s9",  name: "《长夜将尽》",             desc: "反腐题材，剧本改了七稿才过审。", rot: false },
    { id: "s10", name: "《天道酬勤》",             desc: "号称 S+ 投资，正片注水六十集，男主全程一个表情。", rot: true },
    { id: "s11", name: "《幻城之巅》",             desc: "特效堆到眼花，剧情逻辑全线崩塌，开分 3.8。", rot: true },
    { id: "s12", name: "《大宋提刑官之血谜》",     desc: "蹭经典 IP 的续作，绿幕抠图，配角口型全对不上。", rot: true }
  ],
  a: [
    { id: "a1",  name: "《法医手记》",             desc: "口碑极佳的刑侦悬疑剧，剧情烧脑。", rot: false },
    { id: "a2",  name: "《金陵旧梦》",             desc: "民国情感大戏，虐恋情深，最容易吸粉。", rot: false },
    { id: "a3",  name: "《都市合伙人》",           desc: "聚焦职场生存的现代剧，话题度很高。", rot: false },
    { id: "a4",  name: "《剑雨江湖》",             desc: "中规中矩的武侠剧，打戏非常精彩。", rot: false },
    { id: "a5",  name: "《暗涌》",                 desc: "双面间谍谍战剧，节奏紧得让人喘不过气。", rot: false },
    { id: "a6",  name: "《南风知我意》",           desc: "都市情感剧，男女主从互相嫌弃到谁也离不开谁。", rot: false },
    { id: "a7",  name: "《山海秘闻》",             desc: "民俗悬疑，把地方怪谈拍出了电影质感。", rot: false },
    { id: "a8",  name: "《白露为霜》",             desc: "古装言情，服化道精致，虐得观众连夜写小作文。", rot: false },
    { id: "a9",  name: "《第七个嫌疑人》",         desc: "刑侦剧，凶手直到最后一集才露脸。", rot: false },
    { id: "a10", name: "《豪门弃妇复仇记》",       desc: "四十集狗血，每集一个巴掌。", rot: true },
    { id: "a11", name: "《神医下山》",             desc: "男频爽文改编，主角一路打脸，逻辑全无。", rot: true },
    { id: "a12", name: "《我的女友是 AI》",        desc: "土味科幻爱情，特效像十年前的游戏 CG。", rot: true }
  ],
  b: [
    { id: "b1",  name: "《霸道总裁的落跑甜心》",   desc: "古早味浓郁的甜宠剧，虽然土但很上头。", rot: false },
    { id: "b2",  name: "《重生之我是王妃》",       desc: "穿越短剧，剧情雷人但节奏极快。", rot: false },
    { id: "b3",  name: "《婆媳大战三百回合》",     desc: "狗血家庭伦理剧，大妈们的最爱。", rot: false },
    { id: "b4",  name: "《校草爱上我》",           desc: "低成本青春校园剧，全是新面孔。", rot: false },
    { id: "b5",  name: "《闪婚老公是首富》",       desc: "竖屏短剧，一集三分钟，反转两分钟。", rot: false },
    { id: "b6",  name: "《穿越之我在古代开超市》", desc: "沙雕穿越，笑点密集，下饭专用。", rot: false },
    { id: "b7",  name: "《总裁的替身新娘》",       desc: "替身梗老套，但观众就是吃这一套。", rot: false },
    { id: "b8",  name: "《我的同桌是校霸》",       desc: "校园甜剧，弹幕全在喊“好青涩”。", rot: false },
    { id: "b9",  name: "《离婚后前夫跪求复合》",   desc: "复仇爽剧，前二十集解气，后二十集注水。", rot: false },
    { id: "b10", name: "《龙王归来之赘婿逆袭》",   desc: "五分钟一集的爽文短剧，演员念台词像在背课文。", rot: true },
    { id: "b11", name: "《一夜暴富之我中了十个亿》", desc: "剧情离谱，全片靠喊。", rot: true },
    { id: "b12", name: "《重生之我是学霸》",       desc: "导演自己都没上过高中。", rot: true }
  ],
  c: [
    { id: "c1",  name: "《抗日神侠之包子雷》",     desc: "剧情离谱的雷剧，被 B 站 UP 主疯狂吐槽。", rot: false },
    { id: "c2",  name: "《恐怖游泳馆 2》",          desc: "洗钱嫌疑严重的低俗惊悚片，海报很擦边。", rot: false },
    { id: "c3",  name: "《纯洁的心灵·逐梦演艺圈》", desc: "足以载入史册的烂片，不知道谁投的钱。", rot: false },
    { id: "c4",  name: "《乡村爱情故事之刘能逆袭》", desc: "土味乡土剧，只有村口大爷在看。", rot: false },
    { id: "c5",  name: "《老屋》",                 desc: "小成本恐怖片，不靠跳吓，靠氛围，意外有点口碑。", rot: false },
    { id: "c6",  name: "《县城来的年轻人》",       desc: "小成本现实题材，拍得笨拙但很真诚。", rot: false },
    { id: "c7",  name: "《神探狄仁杰之鬼吹灯》",   desc: "两个 IP 硬缝在一起，观众一头雾水。", rot: false },
    { id: "c8",  name: "《霸道村长的俏寡妇》",     desc: "村口小卖部循环播放，演员全是本地人。", rot: false },
    { id: "c9",  name: "《战狼出击之孤胆英雄》",   desc: "一个人打一个师，子弹会拐弯。", rot: false },
    { id: "c10", name: "《还魂夜之绣花鞋》",       desc: "恐怖片，全场最吓人的是票价。", rot: true },
    { id: "c11", name: "《机甲战神之小学生拯救世界》", desc: "特摄质感，小学生开着机甲打外星人。", rot: true },
    { id: "c12", name: "《重生之我是富二代》",     desc: "全程炫富，最后发现是做梦。", rot: true }
  ]
};

/* ===========================================================================
   故事块：Widget_Film —— 三个后台函数
   =========================================================================== */
window.__STORY_PASSAGES.push({
  name: "Widget_Film",
  src: `<<nobr>>

/* ---------------------------------------------------------------------------
   Film_Draw：从某一级剧本池里抽一部
   用法：<<Film_Draw "s">>
   抽完写进 $generated_film / $generated_name / $generated_desc
   --------------------------------------------------------------------------- */
<<widget "Film_Draw">>
    <<set _fres to $args[0]>>
    <<if not def $film_used>><<set $film_used to { s: [], a: [], b: [], c: [] }>>><</if>>
    <<if not def $film_used[_fres]>><<run $film_used[_fres] = []>><</if>>

    <<set _fpool to FILM_POOL[_fres]>>
    <<if not def _fpool>><<set _fpool to FILM_POOL.b>><<set _fres to "b">><</if>>

    <<set _avail to []>>
    <<for _fx range _fpool>>
        <<if _fx.rot>>
            <<run _avail.push(_fx)>>
        <<elseif $film_used[_fres].indexOf(_fx.id) < 0>>
            <<run _avail.push(_fx)>>
        <</if>>
    <</for>>

    /* 这一级的正经戏全被接过一遍了 —— 只剩循环烂片 */
    <<if _avail.length == 0>>
        <<for _fx range _fpool>>
            <<if _fx.rot>><<run _avail.push(_fx)>><</if>>
        <</for>>
    <</if>>

    <<set _fpick to _avail.random()>>
    <<set $generated_film to { id: _fpick.id, name: _fpick.name, desc: _fpick.desc, rot: _fpick.rot }>>
    <<set $generated_name to _fpick.name>>
    <<set $generated_desc to _fpick.desc>>
<</widget>>

/* ---------------------------------------------------------------------------
   Film_Archive：杀青时把这部戏登记进作品库，并定档
   调用时机：Job_Settle 里 drama 分支，此时 _a / _mk / $req_res 都还在
   --------------------------------------------------------------------------- */
<<widget "Film_Archive">>
    <<set _fa to $actors[$current_actor]>>
    <<if not def _fa>><<set _fa to $actors.zp>><</if>>
    <<if not def $film_lib>><<set $film_lib to []>>><</if>>

    /* 质量分（拍的时候就已经定了，播出时才揭晓）
       底子 55 + 演技 + 段位 + 资源等级 + 运气，妆造和烂片再加减 */
    <<set _fq to 55>>
    <<set _fq += Math.round(((_fa.acting || 50) - 60) * 0.45)>>
    <<set _fq += (((_fa.rank_level || 1) - 3) * 5)>>
    <<if $req_res is "s">><<set _fq += 12>>
    <<elseif $req_res is "a">><<set _fq += 6>>
    <<elseif $req_res is "c">><<set _fq += -8>>
    <</if>>
    <<set _fq += random(-9, 9)>>
    <<if _mk is "god">><<set _fq += 6>>
    <<elseif _mk is "fail">><<set _fq += -6>>
    <<elseif _mk is "sabotage">><<set _fq += -8>>
    <</if>>
    <<if _fa.film_rot>><<set _fq += -26>><</if>>
    <<set _fq to Math.max(5, Math.min(98, _fq))>>

    /* 定档：杀青后 4~6 个月播出 */
    <<set _fair to ($month + random(4, 6))>>

    <<set _fentry to {
        id: (_fa.film_id || ("x" + $month + "_" + $current_actor)),
        name: (_fa.project_name || "《未命名》"),
        res: ($req_res || "b"),
        rot: (_fa.film_rot || false),
        actor: $current_actor,
        actor_name: (_fa.name || "???"),
        rank: (_fa.rank_level || 1),
        shot: $month,
        air: _fair,
        status: "pending",
        q: _fq,
        score: 0,
        hit: false,
        live_m: 0,
        live_n: 0,
        market: ""
    }>>
    <<run $film_lib.push(_fentry)>>
    <<unset _fa.film_id>>
    <<unset _fa.film_rot>>
<</widget>>

/* ---------------------------------------------------------------------------
   Film_Air_Tick：月结时跑一遍 —— 到期的播出、播完的归档
   必须在 Process_Month_Logic（$month 已经 +1）之后调用
   --------------------------------------------------------------------------- */
<<widget "Film_Air_Tick">>
    <<set $film_air_results to []>>
    <<if not def $film_lib>><<set $film_lib to []>>><</if>>

    /* 用下标循环，直接写回 $film_lib[i]，不要依赖 for-range 的元素引用 */
    <<for _fi to 0; _fi < $film_lib.length; _fi++>>
        <<set _ff to $film_lib[_fi]>>

        /* ================= 到点播出 ================= */
        <<if _ff.status is "pending" and $month >= _ff.air>>
            <<set _fp to $actors[_ff.actor]>>
            <<if not def _fp>><<set _fp to $actors.zp>><</if>>

            /* 营销过的作品，播出成绩会好一点（每次 +2 分，最多 +6） */
            <<set _fsc to (_ff.q || 50)>>
            <<set _fsc += Math.min(6, (_ff.live_n || 0) * 2)>>
            <<set _fsc to Math.max(5, Math.min(99, _fsc))>>
            <<set $film_lib[_fi].score to _fsc>>

            /* 5% 概率爆款 —— 烂片也会黑红出圈 */
            <<set _fhit to (random(1, 100) <= 5)>>
            <<set $film_lib[_fi].hit to _fhit>>

            /* --- 基础档位 --- */
            <<set _ftier to "flat">>
            <<set _frep to 0>>
            <<set _ffan to 0>>
            <<set _ftopic to 0>>
            <<if _fsc >= 85>>
                <<set _ftier to "god">><<set _frep to 7>><<set _ffan to 0.16>><<set _ftopic to 45>>
            <<elseif _fsc >= 75>>
                <<set _ftier to "good">><<set _frep to 4>><<set _ffan to 0.10>><<set _ftopic to 26>>
            <<elseif _fsc >= 60>>
                <<set _ftier to "ok">><<set _frep to 1>><<set _ffan to 0.04>><<set _ftopic to 12>>
            <<elseif _fsc >= 45>>
                <<set _ftier to "flat">><<set _frep to -1>><<set _ffan to 0.01>><<set _ftopic to 5>>
            <<else>>
                <<set _ftier to "bad">><<set _frep to -5>><<set _ffan to -0.06>><<set _ftopic to 8>>
            <</if>>

            /* --- 粉丝增减（顺手把明细记下来，作品详情页要展示） --- */
            <<set _fsum to FanSum(_fp)>>
            <<set _fgain to Math.floor(_fsum * _ffan)>>
            <<set _fd_c to 0>><<set _fd_f to 0>><<set _fd_p to 0>>
            <<if _fgain >= 0>>
                <<set _fd_c to Math.floor(_fgain * 0.55)>>
                <<set _fd_p to Math.floor(_fgain * 0.28)>>
                <<set _fd_f to Math.floor(_fgain * 0.17)>>
                <<set _fp.fans.career to ((_fp.fans.career || 0) + _fd_c)>>
                <<set _fp.fans.passerby to ((_fp.fans.passerby || 0) + _fd_p)>>
                <<set _fp.fans.face to ((_fp.fans.face || 0) + _fd_f)>>
            <<else>>
                <<set _fd_c to Math.floor(_fgain * 0.6)>>
                <<set _fd_p to Math.floor(_fgain * 0.4)>>
                <<set _fp.fans.career to Math.max(0, ((_fp.fans.career || 0) + _fd_c))>>
                <<set _fp.fans.passerby to Math.max(0, ((_fp.fans.passerby || 0) + _fd_p))>>
            <</if>>

            /* --- 爆款：分「真火」和「黑红」两种 --- */
            <<if _fhit>>
                <<set _fp.topic to ((_fp.topic || 0) + 50)>>
                <<if _fsc >= 50>>
                    <<set _frep += 3>>
                    <<set _ftopic += 20>>
                    <<for _fk range FAN_KEYS>>
                        <<set _fp.fans[_fk] to Math.floor((_fp.fans[_fk] || 0) * 1.15)>>
                    <</for>>
                <<else>>
                    <<set _frep -= 2>>
                    <<set _ftopic += 25>>
                    <<set _fp.fans.clown to ((_fp.fans.clown || 0) + Math.floor(_fsum * 0.08))>>
                    <<set _fp.fans.moe to ((_fp.fans.moe || 0) + Math.floor(_fsum * 0.05))>>
                    <<set _fp.fans.career to Math.max(0, Math.floor((_fp.fans.career || 0) * 0.94))>>
                <</if>>
            <</if>>

            <<set _fp.reputation to Math.max(0, Math.min(100, ((_fp.reputation || 0) + _frep)))>>
            <<set _fp.topic to Math.max(0, ((_fp.topic || 0) + _ftopic))>>

            /* 成绩明细存档 —— 作品详情页「带来的加成」直接用这几个数 */
            <<set $film_lib[_fi].rep to _frep>>
            <<set $film_lib[_fi].fan to _fgain>>
            <<set $film_lib[_fi].topic to _ftopic>>
            <<set $film_lib[_fi].fd to { career: _fd_c, face: _fd_f, passerby: _fd_p }>>
            <<set $film_lib[_fi].status to "airing">>

            <<set _frow to {
                name: _ff.name,
                actor_name: _ff.actor_name,
                tier: _ftier,
                score: _fsc,
                hit: _fhit,
                rep: _frep,
                fan: _fgain,
                topic: _ftopic,
                rot: _ff.rot
            }>>
            <<run $film_air_results.push(_frow)>>

        /* ================= 播完归档 ================= */
        <<elseif _ff.status is "airing" and $month > (_ff.air + 1)>>
            <<set $film_lib[_fi].status to "done">>
        <</if>>

    <</for>>
<</widget>>

/* ---------------------------------------------------------------------------
   Film_Afterglow_Tick：月结时跑一遍 —— 作品余温到账
   播出后第 1/2/3 个月各结算一次：粉丝流入 + 口碑变化
   片酬加成不在这里扣，是在结算通告费的时候乘上去的（见 05_widgets.js）
   --------------------------------------------------------------------------- */
<<widget "Film_Afterglow_Tick">>
    <<set $film_afterglow to []>>
    <<if not def $film_lib>><<set $film_lib to []>>><</if>>

    <<for _fi to 0; _fi < $film_lib.length; _fi++>>
        <<set _bf to FilmBuffOne($film_lib[_fi], $month)>>
        <<if _bf>>
            <<set _ff to $film_lib[_fi]>>
            <<set _ap to $actors[_ff.actor]>>
            <<if not def _ap>><<set _ap to $actors.zp>><</if>>

            /* 粉丝流入：按比例分给 4 类，路人吃最小一份 */
            <<set _afg to Math.floor(FanSum(_ap) * _bf.fan)>>
            <<set _ac to 0>><<set _af to 0>><<set _aq to 0>><<set _ag to 0>>
            <<if _afg >= 0>>
                <<set _ac to Math.floor(_afg * 0.45)>>
                <<set _af to Math.floor(_afg * 0.20)>>
                <<set _aq to Math.floor(_afg * 0.15)>>
                <<set _ag to Math.max(0, _afg - _ac - _af - _aq)>>
                <<set _ap.fans.career to ((_ap.fans.career || 0) + _ac)>>
                <<set _ap.fans.face to ((_ap.fans.face || 0) + _af)>>
                <<set _ap.fans.cp to ((_ap.fans.cp || 0) + _aq)>>
                <<set _ap.fans.passerby to ((_ap.fans.passerby || 0) + _ag)>>
            <<else>>
                <<set _ac to _afg>>
                <<set _ap.fans.career to Math.max(0, ((_ap.fans.career || 0) + _ac))>>
            <</if>>

            <<if _bf.rep neq 0>>
                <<set _ap.reputation to Math.max(0, Math.min(100, ((_ap.reputation || 0) + _bf.rep)))>>
            <</if>>

            <<run $film_afterglow.push({
                name: _ff.name,
                actor_name: _ff.actor_name,
                actor: _ff.actor,
                score: _ff.score,
                m: _bf.m,
                left: _bf.left,
                pay: _bf.pay,
                fan: _afg,
                rep: _bf.rep
            })>>
        <</if>>
    <</for>>
<</widget>>

<</nobr>>`
});

/* ===========================================================================
   故事块：Film_Library —— 作品库（在播 / 待播 / 已播）
   =========================================================================== */
window.__STORY_PASSAGES.push({
  name: "Film_Library",
  src: `<<nobr>>
<<if not def $film_lib>><<set $film_lib to []>>><</if>>

<<set _airing to []>>
<<set _pending to []>>
<<set _done to []>>
<<set _score_sum to 0>>
<<set _score_cnt to 0>>
<<set _hit_cnt to 0>>
<<for _f range $film_lib>>
    <<if _f.status is "airing">><<run _airing.push(_f)>>
    <<elseif _f.status is "pending">><<run _pending.push(_f)>>
    <<else>>
        <<run _done.push(_f)>>
        <<set _score_sum += (_f.score || 0)>>
        <<set _score_cnt += 1>>
        <<if _f.hit>><<set _hit_cnt += 1>><</if>>
    <</if>>
<</for>>
<<set _avg to 0>>
<<if _score_cnt > 0>><<set _avg to Math.round(_score_sum / _score_cnt)>><</if>>

<div class="tech-card fl-card">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 影视作品库</span>
        <span style="font-size:.8em; opacity:.9;">共 <<print $film_lib.length>> 部</span>
    </div>

    <div class="fl-body">

        /* 调试面板「全部立即播出」之后跳过来，顶部闪一条结果 */
        <<if def $fl_flash and $fl_flash neq "">>
            <div class="fl-flash">
                <<print $fl_flash>>
                <<link "知道了">><<set $fl_flash to "">><<goto "Film_Library">><</link>>
            </div>
        <</if>>

        /* ---------- 概览 ---------- */
        <div class="fl-stats">
            <div class="fl-stat">
                <div class="k">在播</div>
                <div class="v"><<print _airing.length>></div>
            </div>
            <div class="fl-stat">
                <div class="k">待播</div>
                <div class="v"><<print _pending.length>></div>
            </div>
            <div class="fl-stat">
                <div class="k">已播</div>
                <div class="v"><<print _done.length>></div>
            </div>
            <div class="fl-stat">
                <div class="k">平均评分</div>
                <div class="v"><<if _score_cnt > 0>><<print _avg>><<else>>—<</if>></div>
            </div>
            <div class="fl-stat">
                <div class="k">爆款</div>
                <div class="v"><<print _hit_cnt>></div>
            </div>
        </div>

        <<if $film_lib.length == 0>>
            <div class="fl-empty">
                还没有作品。<br>
                <span>去通告中心接一部戏，杀青之后就会登记在这里。</span>
            </div>
        <<else>>

            /* ---------- 在播 ---------- */
            <<if _airing.length > 0>>
                <div class="fl-sec">
                    <span class="fl-sec-t">📺 正在播出</span>
                    <span class="fl-sec-h">播出当月与次月可以营销</span>
                </div>
                /* 用下标循环：for-range 拿到的是元素副本，indexOf 会找不到 */
                <<for _fi to 0; _fi < $film_lib.length; _fi++>>
                    <<set _f to $film_lib[_fi]>>
                    <<if _f.status is "airing">>
                    <div class="fl-row is-live">
                        <div class="fl-main">
                            <div class="fl-name">
                                <<print _f.name>>
                                <span class="fl-tag lv-<<print _f.res>>"><<print _f.res.toUpperCase()>></span>
                                <<if _f.hit>><span class="fl-tag hit">🔥 爆</span><</if>>
                            </div>
                            <div class="fl-meta">
                                <<print _f.actor_name>> · 评分 <b class="fl-sc <<print FilmSc(_f.score)>>"><<print _f.score>></b>
                                · 第 <<print _f.air>> 月首播
                            </div>
                        </div>
                        <div class="fl-act">
                            <<if _f.live_m is $month>>
                                <span class="fl-done">本月已营销</span>
                            <<else>>
                                <<link "📣 营销">><<set $live_film to _fi>><<goto "Film_Live">><</link>>
                            <</if>>
                            <span class="fl-detail"><<link "详情 ›">><<set $detail_film to _fi>><<goto "Film_Detail">><</link>></span>
                        </div>
                    </div>
                    <</if>>
                <</for>>
            <</if>>

            /* ---------- 待播 ---------- */
            <<if _pending.length > 0>>
                <div class="fl-sec">
                    <span class="fl-sec-t">🎬 待播</span>
                    <span class="fl-sec-h">杀青后 4~6 个月播出</span>
                </div>
                <<for _fi to 0; _fi < $film_lib.length; _fi++>>
                    <<set _f to $film_lib[_fi]>>
                    <<if _f.status is "pending">>
                    <div class="fl-row">
                        <div class="fl-main">
                            <div class="fl-name">
                                <<print _f.name>>
                                <span class="fl-tag lv-<<print _f.res>>"><<print _f.res.toUpperCase()>></span>
                            </div>
                            <div class="fl-meta">
                                <<print _f.actor_name>> · 第 <<print _f.shot>> 月杀青
                                · 预计第 <b><<print _f.air>></b> 月播出
                            </div>
                        </div>
                        <div class="fl-act">
                            <span class="fl-wait">还有 <<print (_f.air - $month)>> 个月</span>
                            <span class="fl-detail"><<link "详情 ›">><<set $detail_film to _fi>><<goto "Film_Detail">><</link>></span>
                        </div>
                    </div>
                    <</if>>
                <</for>>
            <</if>>

            /* ---------- 已播 ---------- */
            <<if _done.length > 0>>
                <div class="fl-sec">
                    <span class="fl-sec-t">📼 已播</span>
                    <span class="fl-sec-h">最近 12 部</span>
                </div>
                <<set _shown to 0>>
                <<set _i to ($film_lib.length - 1)>>
                <<for _i to ($film_lib.length - 1); _i >= 0; _i-->>
                    <<set _f to $film_lib[_i]>>
                    <<if _f.status is "done" and _shown < 12>>
                        <<set _shown += 1>>
                        <div class="fl-row is-done">
                            <div class="fl-main">
                                <div class="fl-name">
                                    <<print _f.name>>
                                    <span class="fl-tag lv-<<print _f.res>>"><<print _f.res.toUpperCase()>></span>
                                    <<if _f.hit>><span class="fl-tag hit">🔥 爆</span><</if>>
                                    <<if _f.rot>><span class="fl-tag rot">烂片</span><</if>>
                                </div>
                                <div class="fl-meta">
                                    <<print _f.actor_name>> · 第 <<print _f.air>> 月播出
                                    <<if (_f.live_n || 0) > 0>> · 营销 <<print _f.live_n>> 次<</if>>
                                </div>
                            </div>
                            <div class="fl-scbox">
                                <span class="fl-sc <<print FilmSc(_f.score)>>"><<print _f.score>></span>
                                <span class="fl-sc-l">评分</span>
                            </div>
                            <span class="fl-detail"><<link "详情 ›">><<set $detail_film to _i>><<goto "Film_Detail">><</link>></span>
                        </div>
                    <</if>>
                <</for>>
            <</if>>

        <</if>>

        <div class="continue-row" style="margin-top:18px;">
            <<link "🏢 回办公室">><<goto "Office">><</link>>
            &nbsp;&nbsp;
            <<link "📋 去接戏">><<goto "Work_Center">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ===========================================================================
   故事块：Film_Detail —— 单部作品详情（口碑 / 粉丝评价 / 带来的加成）
   参数：$detail_film = 作品在 $film_lib 里的下标
   =========================================================================== */
window.__STORY_PASSAGES.push({
  name: "Film_Detail",
  src: `<<nobr>>
<<if not def $film_lib or $film_lib.length == 0>><<goto "Film_Library">><</if>>
<<if not def $detail_film>><<set $detail_film to 0>>><</if>>
<<if $detail_film < 0 or $detail_film >= $film_lib.length>><<set $detail_film to 0>>><</if>>

<<set _f to $film_lib[$detail_film]>>
<<set _src to FilmFind(_f.id)>>
<<set _aired to (_f.status isnot "pending")>>
<<set _tp to FilmTierOf(_f.score)>>
<<set _bf to FilmBuffOne(_f, $month)>>
<<set _vp to FILM_VOICE[_tp.key]>>
<<set _h to FilmHash(_f.id)>>

<div class="tech-card fl-detail">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 作品详情</span>
        <span style="font-size:.8em; opacity:.9;">
            <<if _f.status is "airing">>正在播出
            <<elseif _f.status is "pending">>待播
            <<else>>已播完
            <</if>>
        </span>
    </div>

    <div class="fl-body">

        /* ---------------- 头部 ---------------- */
        <div class="fd-hero">
            <div class="fd-title"><<print _f.name>></div>
            <div class="fd-tags">
                <span class="fl-tag lv-<<print _f.res>>"><<print _f.res.toUpperCase()>> 级</span>
                <<if _f.hit>><span class="fl-tag hit">🔥 爆款</span><</if>>
                <<if _f.rot>><span class="fl-tag rot">烂片</span><</if>>
                <<if (_f.live_n || 0) > 0>><span class="fl-tag">营销 <<print _f.live_n>> 次</span><</if>>
            </div>
            <div class="fd-sub">
                <<print _f.actor_name>> 主演 · 第 <<print _f.shot>> 月杀青
                · 第 <<print _f.air>> 月首播
            </div>
            <<if _src>>
                <div class="fd-story"><<print _src.desc>></div>
            <</if>>

            <div class="fd-scoreline">
                <<if _aired>>
                    <span class="fd-score <<print FilmSc(_f.score)>>"><<print _f.score>></span>
                    <span class="fd-of">/ 100</span>
                    <span class="fd-tier"><<print _tp.t>></span>
                <<else>>
                    <span class="fd-score pending">—</span>
                    <span class="fd-of">还没开分</span>
                    <span class="fd-tier">🗓️ 预计第 <<print _f.air>> 月播出</span>
                <</if>>
            </div>
        </div>

        <<if not _aired>>
            <div class="fd-wait">
                成片已经锁死，是好是坏要等开播那天才知道。<br>
                <span>还有 <<print (_f.air - $month)>> 个月。播出后可以在「营销公关部」做播出期营销。</span>
            </div>
        <<else>>

            /* ---------------- 口碑 ---------------- */
            <div class="fd-sec">
                <div class="fd-sec-h">🗣️ 口碑</div>
                <div class="fd-one"><<print _tp.line>></div>

                <div class="fd-quote">
                    <span class="fd-src">媒体</span>
                    <span class="fd-qt"><<print _vp.media[_h % _vp.media.length]>></span>
                </div>
                <div class="fd-quote">
                    <span class="fd-src">网友</span>
                    <span class="fd-qt"><<print _vp.net[_h % _vp.net.length]>></span>
                </div>
                <div class="fd-quote">
                    <span class="fd-src">网友</span>
                    <span class="fd-qt"><<print _vp.net[(_h + 2) % _vp.net.length]>></span>
                </div>

                <<if _f.hit>>
                    <<if _f.score >= 50>>
                        <div class="fd-hit">🔥 现象级爆款 —— 全网都在追，连不看剧的人都在刷切片。</div>
                    <<else>>
                        <div class="fd-hit black">🤡 黑红出圈 —— 骂声把它送上了热搜，看的人比夸的人多。</div>
                    <</if>>
                <</if>>
            </div>

            /* ---------------- 粉丝评价 ---------------- */
            <div class="fd-sec">
                <div class="fd-sec-h">💬 粉丝在说什么</div>
                <<for _i to 0; _i < 3; _i++>>
                    <<set _p to _vp.fan[(_h + _i) % _vp.fan.length]>>
                    <div class="rk-row">
                        <span class="rk-tag rk-<<print _p.k>>"><<print FAN_LABEL[_p.k]>></span>
                        <span class="rk-text">「<<print _p.t>>」</span>
                    </div>
                <</for>>
            </div>

            /* ---------------- 带来的加成 ---------------- */
            <div class="fd-sec">
                <div class="fd-sec-h">📈 带来的影响</div>
                <div class="fd-impact">
                    <div class="fd-imp">
                        <div class="k">口碑</div>
                        <div class="v <<if (_f.rep || 0) > 0>>up<<elseif (_f.rep || 0) < 0>>down<</if>>">
                            <<if (_f.rep || 0) > 0>>+<</if>><<print _f.rep || 0>>
                        </div>
                    </div>
                    <div class="fd-imp">
                        <div class="k">粉丝</div>
                        <div class="v <<if (_f.fan || 0) > 0>>up<<elseif (_f.fan || 0) < 0>>down<</if>>">
                            <<if (_f.fan || 0) > 0>>+<</if>><<print _f.fan || 0>>
                        </div>
                    </div>
                    <div class="fd-imp">
                        <div class="k">话题</div>
                        <div class="v up">+<<print _f.topic || 0>></div>
                    </div>
                    <div class="fd-imp">
                        <div class="k">评分</div>
                        <div class="v"><<print _f.score>></div>
                    </div>
                </div>

                <<if _f.fd>>
                    <div class="fd-note">
                        粉丝构成：事业粉 +<<print _f.fd.career>>
                        · 颜粉 +<<print _f.fd.face>>
                        · 路人 +<<print _f.fd.passerby>>
                    </div>
                <</if>>

                <<if _bf>>
                    <div class="fd-buff">
                        <div class="fd-buff-h">
                            🔥 作品余温 · 第 <<print _bf.m>> / 3 个月
                            <span class="fd-buff-l">还剩 <<print _bf.left>> 个月</span>
                        </div>
                        <div class="fd-buff-d">
                            片酬与通告费 <b>+<<print Math.round(_bf.pay * 100)>>%</b>
                            · 每月粉丝 <b>+<<print (_bf.fan * 100).toFixed(1)>>%</b>
                            <<if _bf.rep neq 0>>
                                · 每月口碑 <b><<if _bf.rep > 0>>+<</if>><<print _bf.rep>></b>
                            <</if>>
                        </div>
                        <div class="fd-buff-bar">
                            <span style="width: <<print Math.round(_bf.decay * 100)>>%;"></span>
                        </div>
                        <div class="fd-buff-f">
                            播出后 3 个月内有效，热度逐月衰减 —— 想趁热接戏、接通告就趁现在。
                        </div>
                    </div>
                <<else>>
                    <<if _f.air is $month>>
                        <div class="fd-note">这部戏本月刚开播 —— 余温从下个月开始，会持续 3 个月。</div>
                    <<else>>
                        <div class="fd-note">这部戏的余温已经过去了（播出后 3 个月内有效）。</div>
                    <</if>>
                <</if>>

                <<if def _f.market and _f.market neq "">>
                    <div class="fd-note">播出期营销：<<print _f.market>></div>
                <</if>>
            </div>

        <</if>>

        <div class="continue-row" style="margin-top:18px;">
            <<link "‹ 返回作品库">><<goto "Film_Library">><</link>>
            &nbsp;&nbsp;
            <<if _f.status is "airing" and _f.live_m isnot $month>>
                <<link "📣 去营销">><<set $live_film to $detail_film>><<goto "Film_Live">><</link>>
                &nbsp;&nbsp;
            <</if>>
            <<link "⚔️ 营销公关部">><<goto "Marketing_Center">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ===========================================================================
   故事块：Film_Live —— 单部在播作品的营销页面
   参数：$live_film = 作品在 $film_lib 里的下标
   =========================================================================== */
window.__STORY_PASSAGES.push({
  name: "Film_Live",
  src: `<<nobr>>
<<if not def $film_lib or $film_lib.length == 0>><<goto "Film_Library">><</if>>
<<if not def $live_film>><<set $live_film to 0>>><</if>>
<<set _lf to $film_lib[$live_film]>>
<<if not def _lf>><<goto "Film_Library">><</if>>

<div class="tech-card fl-live">
    <div class="header-banner" style="background: linear-gradient(120deg, #7C3F58, #B4657F);">
        <span>📣 播出期营销</span>
        <span style="font-size:.8em; opacity:.9;"><<print _lf.name>></span>
    </div>

    <div class="fl-body">

        <div class="fl-hero">
            <div class="fl-hero-name"><<print _lf.name>></div>
            <div class="fl-hero-sub">
                <<print _lf.actor_name>> 主演 ·
                <<print _lf.res.toUpperCase()>>级 ·
                第 <<print _lf.air>> 月首播
            </div>
            <<if _lf.status is "airing">>
                <div class="fl-hero-score">
                    <span class="<<print FilmSc(_lf.score)>>"><<print _lf.score>></span>
                    <span class="fl-hero-scl">当前评分</span>
                </div>
                <div class="fl-hero-tip">
                    播出期还剩 <<print (_lf.air + 1 - $month)>> 个月可以营销。
                    营销每做一次，最终成绩 +2 分（最多 +6）。
                </div>
            <<else>>
                <div class="fl-hero-tip">这部戏不在播出期，无法营销。</div>
            <</if>>
        </div>

        <<if _lf.status is "airing" and _lf.live_m isnot $month>>
            <<if $pr_action_count <= 0>>
                <div class="fl-warn">公关部本月次数已用尽（3/3），下个月再来。</div>
            <<else>>
                <div class="fl-ops">

                    <div class="fl-op">
                        <div class="fl-op-h">
                            <span class="fl-op-t">🔥 买热搜造势</span>
                            <span class="fl-op-c">180 万</span>
                        </div>
                        <div class="fl-op-d">话题 +28 · 粉丝 +6%</div>
                        <div class="fl-op-r">30% 翻车：热搜太尬被群嘲，口碑 −5</div>
                        <<link "执行">><<set $live_action to "hot">><<goto "Film_Live_Do">><</link>>
                    </div>

                    <div class="fl-op">
                        <div class="fl-op-h">
                            <span class="fl-op-t">🛡️ 口碑维护</span>
                            <span class="fl-op-c">260 万</span>
                        </div>
                        <div class="fl-op-d">口碑 +3 · 稳定不翻车</div>
                        <div class="fl-op-r">片子本身不行（评分 &lt;52）时有 40% 被识破</div>
                        <<link "执行">><<set $live_action to "pr">><<goto "Film_Live_Do">><</link>>
                    </div>

                    <div class="fl-op">
                        <div class="fl-op-h">
                            <span class="fl-op-t">✂️ 二创投放</span>
                            <span class="fl-op-c">140 万</span>
                        </div>
                        <div class="fl-op-d">CP 粉 +6% · 梦女 +4% · 话题 +12</div>
                        <div class="fl-op-r">15% 翻车：剪辑太烂被嘲，反招乐子人</div>
                        <<link "执行">><<set $live_action to "vid">><<goto "Film_Live_Do">><</link>>
                    </div>

                </div>
            <</if>>
        <<elseif _lf.live_m is $month>>
            <div class="fl-warn good">本月已经给这部戏做过营销了，下个月再来。</div>
        <</if>>

        <div class="continue-row" style="margin-top:18px;">
            <<link "‹ 返回作品库">><<goto "Film_Library">><</link>>
            &nbsp;&nbsp;
            <<link "⚔️ 回营销公关部">><<goto "Marketing_Center">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ===========================================================================
   故事块：Film_Live_Do —— 执行营销并结算
   =========================================================================== */
window.__STORY_PASSAGES.push({
  name: "Film_Live_Do",
  src: `<<nobr>>
<<if not def $film_lib or $film_lib.length == 0>><<goto "Film_Library">><</if>>
<<if not def $live_film>><<set $live_film to 0>>><</if>>
<<set _lf to $film_lib[$live_film]>>
<<if not def _lf>><<goto "Film_Library">><</if>>

<<set _cost to 0>>
<<set _ok to false>>
<<set _title to "">>
<<set _desc to "">>
<<set _lines to []>>

<<if $live_action is "hot">><<set _cost to 180>><<set _title to "🔥 买热搜造势">>
<<elseif $live_action is "pr">><<set _cost to 260>><<set _title to "🛡️ 口碑维护">>
<<elseif $live_action is "vid">><<set _cost to 140>><<set _title to "✂️ 二创投放">>
<</if>>

<<set _a to $actors[_lf.actor]>>
<<if not def _a>><<set _a to $actors.zp>><</if>>

<<if _lf.status isnot "airing">>
    <div class="fl-warn">这部戏已经不在播出期了。</div>
<<elseif _lf.live_m is $month>>
    <div class="fl-warn">本月已经做过营销了。</div>
<<elseif $pr_action_count <= 0>>
    <div class="fl-warn">公关部本月次数已用尽。</div>
<<elseif $money < _cost>>
    <div class="fl-warn">资金不足，需要 <<print _cost>> 万。</div>
<<else>>
    <<set _ok to true>>
    <<set $money -= _cost>>
    <<set $pr_action_count -= 1>>
    <<set _lf.live_m to $month>>
    <<set _lf.live_n to ((_lf.live_n || 0) + 1)>>
    <<set _lf.market to (_lf.market || "") + _title + " ">>

    <<set _roll to random(1, 100)>>
    <<set _sum to FanSum(_a)>>
    <<set _tone to "ok">>

    /* ---------------- 买热搜 ---------------- */
    <<if $live_action is "hot">>
        <<if _roll <= 30>>
            <<set _tone to "bad">>
            <<set _a.topic to ((_a.topic || 0) + 10)>>
            <<set _a.reputation to Math.max(0, (_a.reputation || 0) - 5)>>
            <<set _desc to "通稿写得太假，词条刚上就被网友扒出买的痕迹。# 这热搜多少钱 # 反挂了一天，路人在评论区排队玩梗。">>
            <<run _lines.push("话题 +10", "口碑 −5")>>
        <<else>>
            <<set _a.topic to ((_a.topic || 0) + 28)>>
            <<set _a.fans.career to ((_a.fans.career || 0) + Math.floor(_sum * 0.045))>>
            <<set _a.fans.passerby to ((_a.fans.passerby || 0) + Math.floor(_sum * 0.03))>>
            <<set _desc to "剧情向剪辑和台词截图铺了一整天，路人开始说“这剧好像真的不错”，讨论度肉眼可见地涨。">>
            <<run _lines.push("话题 +28", "粉丝 +6%")>>
        <</if>>

    /* ---------------- 口碑维护 ---------------- */
    <<elseif $live_action is "pr">>
        <<if (_lf.q || 50) < 52 and _roll <= 40>>
            <<set _tone to "bad">>
            <<set _a.reputation to Math.max(0, (_a.reputation || 0) - 2)>>
            <<set _a.topic to ((_a.topic || 0) + 8)>>
            <<set _desc to "水军控评的模板太统一，被截图拼成九宫格。大家没记住剧情，倒是把“复制粘贴一样的好评”记住了。">>
            <<run _lines.push("口碑 −2", "话题 +8")>>
        <<else>>
            <<set _a.reputation to Math.min(100, (_a.reputation || 0) + 3)>>
            <<set _desc to "把几篇扎实的剧评推上了首页，讨论从“好不好看”变成了“这段到底想讲什么”。口碑稳住了。">>
            <<run _lines.push("口碑 +3")>>
        <</if>>

    /* ---------------- 二创投放 ---------------- */
    <<else>>
        <<if _roll <= 15>>
            <<set _tone to "bad">>
            <<set _a.topic to ((_a.topic || 0) + 15)>>
            <<set _a.reputation to Math.max(0, (_a.reputation || 0) - 2)>>
            <<set _a.fans.clown to ((_a.fans.clown || 0) + Math.floor(_sum * 0.03))>>
            <<set _desc to "投的剪辑素材太糊，BGM 还卡点失败，被剪成了鬼畜视频。播放量挺高，但没人是在看剧。">>
            <<run _lines.push("话题 +15", "口碑 −2", "乐子人 +")>>
        <<else>>
            <<set _a.topic to ((_a.topic || 0) + 12)>>
            <<set _a.fans.cp to ((_a.fans.cp || 0) + Math.floor(_sum * 0.06))>>
            <<set _a.fans.dream to ((_a.fans.dream || 0) + Math.floor(_sum * 0.04))>>
            <<set _desc to "一位剪刀手用三分钟把整部戏的感情线剪完了。转发量比正片宣发还高，评论区全在喊“求第二部”。">>
            <<run _lines.push("话题 +12", "CP 粉 +6%", "梦女 +4%")>>
        <</if>>
    <</if>>
<</if>>

<div class="tech-card fl-live">
    <div class="header-banner" style="background: linear-gradient(120deg, #7C3F58, #B4657F);">
        <span>📣 <<print _title>> · 结果</span>
    </div>
    <div class="fl-body">
        <<if _ok>>
            <div class="fl-result res-<<print _tone>>">
                <div class="fl-result-h">
                    <<if _tone is "bad">>💥 翻车了<<else>>✅ 效果不错<</if>>
                </div>
                <div class="fl-result-name"><<print _lf.name>></div>
                <p class="fl-result-d"><<print _desc>></p>
                <div class="fl-chips">
                    <<for _l range _lines>>
                        <span class="fl-chip <<if _tone is "bad">bad<</if>>"><<print _l>></span>
                    <</for>>
                    <span class="fl-chip cost">− <<print _cost>> 万</span>
                </div>
            </div>
        <</if>>

        <div class="continue-row" style="margin-top:18px;">
            <<link "‹ 返回作品库">><<goto "Film_Library">><</link>>
            &nbsp;&nbsp;
            <<link "⚔️ 回营销公关部">><<goto "Marketing_Center">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});
