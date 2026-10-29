/* ===========================================================================
   ⑮ 补丁故事块
   ---------------------------------------------------------------------------
   ★ 这三个块在原 Twine 工程里"被引用但没有内容"，点下去会白屏或报错。
     这里补齐了它们，内容和别的故事块写法完全一样，可以随意改。
   =========================================================================== */

window.__STORY_PASSAGES = window.__STORY_PASSAGES || [];

/* ── 结局评价 · 📋 旗下艺人最终去向 ─────────────────────────────────────────
   故事块：Game_Ending_Evaluation
   ──────────────────────────────────────────────────────── */
/* ── 结局评价 · 📋 最终结算 ──────────────────────────────────────────────
   故事块：Game_Ending_Evaluation
   （2026-10-28 重写：四段式结算页）
   ---------------------------------------------------------------------------
   ① 结局定格  —— 哪个结局 + 三条判定数值 + 展鹏此后的去向（约 150 字）
   ② 成绩单    —— 评级 / 评分 / 资产 / 作品数 / 爆款数
   ③ 艺人工牌  —— 每个人：咖位、粉丝、拍过的戏、接过的通告、一句话去向
   ④ 五年大事记 —— 从 $story_seen 自动长出来的时间线
   数据来源：$ending_outcome / $film_lib / $job_log / $story_seen
   ⚠️ 改文案只需要改文字，不要动 <<set>> / <<for>> / <<if>> 这些行。
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Game_Ending_Evaluation",
  src: `<<nobr>>
/* ========== 0. 老存档兜底：缺变量也不会崩 ========== */
<<if not def $ending_outcome>><<set $ending_outcome to "family">><</if>>
<<if not def $film_lib>><<set $film_lib to []>>><</if>>
<<if not def $job_log>><<set $job_log to []>>><</if>>
<<if not def $story_seen>><<set $story_seen to {}>><</if>>
<<if not def $money>><<set $money to 0>>><</if>>
<<if not def $actors>><<set $actors to {}>>><</if>>

/* ========== 1. 算分（段位 40 分/级，资金封顶 300，粉丝封顶 400） ========== */
/* 先把「真正在自己公司的人」挑出来：黄耀祖、刘梁周没签约就不算 */
<<set _act_keys to []>>
<<if def $actors.zp>><<run _act_keys.push("zp")>><</if>>
<<if def $actors.qs>><<run _act_keys.push("qs")>><</if>>
<<if def $actors.new>><<run _act_keys.push("new")>><</if>>
<<if $has_signed_huang is true>><<if def $actors.huang>><<run _act_keys.push("huang")>><</if>><</if>>
<<if $has_signed_liu is true>><<if def $actors.liu>><<run _act_keys.push("liu")>><</if>><</if>>

<<set _rank_score to 0>>
<<set _fan_total to 0>>
<<for _k range _act_keys>>
<<set _rank_score += ($actors[_k].rank_level || 1) * 40>>
<<set _fan_total += FanSumCore($actors[_k])>>
<</for>>
<<set _money_score to Math.min(300, Math.floor(($money || 0) / 1000))>>
<<set _fan_score to Math.min(400, Math.floor(_fan_total / 1000))>>
<<set _score to _rank_score + _money_score + _fan_score>>

<<set _grade to "C">>
<<set _gloss to "勉强维持温饱的娱乐圈路人。">>
<<if _score > 1450>>
<<set _grade to "SSS">><<set _gloss to "【娱乐圈教父】你缔造了无法撼动的娱乐帝国。">>
<<elseif _score > 1100>>
<<set _grade to "S">><<set _gloss to "【王牌操盘手】你的名字就是票房的保证。">>
<<elseif _score > 800>>
<<set _grade to "A">><<set _gloss to "【金牌推手】圈内人都得喊你一声大佬。">>
<<elseif _score > 450>>
<<set _grade to "B">><<set _gloss to "【小有名气】没赚大钱，但也没赔本。">>
<</if>>

/* ========== 2. 作品统计 ========== */
<<set _film_n to $film_lib.length>>
<<set _hit_n to 0>>
<<set _qsum to 0>>
<<set _qcnt to 0>>
<<for _f range $film_lib>>
<<if _f.hit>><<set _hit_n to _hit_n + 1>><</if>>
<<if _f.score > 0>>
<<set _qsum to _qsum + _f.score>>
<<set _qcnt to _qcnt + 1>>
<</if>>
<</for>>
<<set _avgq to 0>>
<<if _qcnt > 0>><<set _avgq to Math.round(_qsum / _qcnt * 10) / 10>><</if>>

/* 展鹏最后一部戏（film_lib 按杀青顺序排，最后一条就是最新的） */
<<set _zp_last to "">>
<<set _zp_fn to 0>>
<<for _f range $film_lib>>
<<if _f.actor is "zp">>
<<set _zp_last to (_f.name || "")>>
<<set _zp_fn to _zp_fn + 1>>
<</if>>
<</for>>

/* ========== 3. 结局三套配色与标题 ========== */
<<set _ec to "#B4555F">>
<<set _ebg to "#FDF4F5">>
<<set _eline to "#EFD3D8">>
<<set _en to "END 01 · BAD END">>
<<set _et to "无声的牺牲">>
<<set _esub to "公司还在，他没能回来。">>
<<if $ending_outcome is "police">>
<<set _ec to "#2F7E5E">>
<<set _ebg to "#F3F9F6">>
<<set _eline to "#CFE6DB">>
<<set _en to "END 02 · HAPPY END">>
<<set _et to "荣耀归队">>
<<set _esub to "他穿回了警服，你留在了原地。">>
<<elseif $ending_outcome is "family">>
<<set _ec to "#9B5A88">>
<<set _ebg to "#FBF4F8">>
<<set _eline to "#EED6E7">>
<<set _en to "END 03 · HAPPY END">>
<<set _et to "人间烟火">>
<<set _esub to "案卷合上了，他留在了你身边。">>
<</if>>

<div class="tech-card" style="max-width: 100%; margin: 0 auto;">

<div style="text-align:center; font-size:11px; letter-spacing:.34em; color:#94A3B8; padding:22px 0 0;">五 年 合 约 期 满 · 最 终 结 算</div>

/* ---------- ① 结局定格 ---------- */
<div style="margin:16px 22px 0; padding:26px 30px 24px; border-radius:18px; border:1px solid <<print _eline>>; background:<<print _ebg>>;">

<div style="font-size:10.5px; letter-spacing:.26em; font-weight:700; color:<<print _ec>>;"><<print _en>></div>
<div style="font-size:31px; font-weight:900; letter-spacing:.06em; color:<<print _ec>>; margin:8px 0 10px;"><<print _et>></div>
<div style="font-size:13.5px; line-height:1.85; color:#4A5568;"><<print _esub>></div>

<div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:20px;">
<div style="flex:1 1 120px; padding:9px 12px; border-radius:10px; background:rgba(255,255,255,.66); border:1px solid <<print _eline>>;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">信任度</div>
<div style="font-size:17px; font-weight:800; color:#334151; margin-top:2px;"><<print ($zp_trust || 0)>></div>
</div>
<div style="flex:1 1 120px; padding:9px 12px; border-radius:10px; background:rgba(255,255,255,.66); border:1px solid <<print _eline>>;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">羁绊值</div>
<div style="font-size:17px; font-weight:800; color:#334151; margin-top:2px;"><<print ($zp_bond || 0)>></div>
</div>
<div style="flex:1 1 120px; padding:9px 12px; border-radius:10px; background:rgba(255,255,255,.66); border:1px solid <<print _eline>>;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">正义值</div>
<div style="font-size:17px; font-weight:800; color:#334151; margin-top:2px;"><<print ($justice || 0)>></div>
</div>
</div>

<div style="margin-top:22px; padding-top:18px; border-top:1px dashed <<print _eline>>;">
<div style="font-size:10.5px; letter-spacing:.22em; color:#8A6A2E; margin-bottom:10px;">展 鹏 · 此 后</div>
<div style="font-size:13.5px; line-height:2.05; color:#3D4B61; text-align:justify;">
<<if $ending_outcome is "bad">>
<<if _zp_fn > 0>>
<<print _zp_last>>的档期排到了合约期满之后。首映礼你没去，一个人买了最后一场的票，坐在最后一排。片尾字幕滚到演员表，他的名字后面多了一行小字——谨以此片，纪念一位没能看到它上映的警察。全场没有人鼓掌，灯亮起来的时候，你才发现自己一直攥着扶手。后来粉丝都管这部戏叫遗作，你从来没有这样叫过。在你这里，它只是一部还没看完的戏，等他回来一起看。
<<else>>
他没有留下什么作品。收网之后那几个月，他一直在外面跑，你连他最后一部戏是哪一部都记不清了。后来你想，这样也好——银幕上不会有个假的他，让你一次次认错。
<</if>>
<<elseif $ending_outcome is "police">>
<<if _zp_fn > 0>>
<<print _zp_last>>上映和退圈声明撞在了同一个月。粉丝在超话里刷「警察叔叔好」，把首映礼刷上了热搜第一。有人说可惜，正是最好的年纪；他只回了一句，穿戏服是工作，穿警服是回家。这部戏成了他的息影之作，也是他留给内娱的最后一样东西——往后银幕上再有那样的脸，都不是他了。你偶尔翻出来看，看到一半就关掉：屏幕里那个人还在，屏幕外那个人正在隔壁擦枪。
<<else>>
他走得很干脆，连一部像样的告别作品都没留下。你后来想，也对，他本来就没打算在这里久待。戏服脱下来叠好，放在衣柜最上面；警服一直挂在门后。
<</if>>
<<else>>
<<if _zp_fn > 0>>
<<print _zp_last>>压了半年，正好赶在他重新签约的那个月上映。公关部如获至宝，把「消失半年的男人回来了」做成了一整套通稿，红毯、采访、连麦一条龙。他配合得很好，回家往沙发上一躺，说累死了以后不干了。这部戏成了他的复出之作，票房比他走之前还高。你问他图什么，他说图你高兴，然后被你按在沙发上亲了一顿，第二天腰疼没起来。
<<else>>
他回来的时候，那部戏还压在库里没播。你说正好，等他歇够了再上。他哼了一声说你不懂，压着的戏才有话题。
<</if>>
<</if>>
</div>
</div>
</div>

/* ---------- ② 五年成绩单 ---------- */
<div style="margin:22px 22px 0;">
<div style="font-size:12px; letter-spacing:.2em; color:#8A6A2E; margin-bottom:12px;">五 年 成 绩 单</div>
<div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(96px,1fr)); gap:10px;">
<div style="text-align:center; padding:14px 6px 12px; border-radius:12px; background:#FFFDF7; border:1px solid #EFE3C9;">
<div style="font-size:10.5px; color:#A08A5E; letter-spacing:.1em;">经营评级</div>
<div style="font-size:25px; font-weight:900; color:#C0392B; line-height:1.3;"><<print _grade>></div>
</div>
<div style="text-align:center; padding:14px 6px 12px; border-radius:12px; background:#FBFCFE; border:1px solid #E8EEF6;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">综合评分</div>
<div style="font-size:21px; font-weight:800; color:#334151; line-height:1.5;"><<print _score>></div>
</div>
<div style="text-align:center; padding:14px 6px 12px; border-radius:12px; background:#FBFCFE; border:1px solid #E8EEF6;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">最终资产</div>
<div style="font-size:21px; font-weight:800; color:#334151; line-height:1.5;"><<print $money>> 万</div>
</div>
<div style="text-align:center; padding:14px 6px 12px; border-radius:12px; background:#FBFCFE; border:1px solid #E8EEF6;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">作品总数</div>
<div style="font-size:21px; font-weight:800; color:#334151; line-height:1.5;"><<print _film_n>> 部</div>
</div>
<div style="text-align:center; padding:14px 6px 12px; border-radius:12px; background:#FBFCFE; border:1px solid #E8EEF6;">
<div style="font-size:10.5px; color:#94A3B8; letter-spacing:.1em;">爆款</div>
<div style="font-size:21px; font-weight:800; color:#C0392B; line-height:1.5;"><<print _hit_n>> 部</div>
</div>
</div>
<div style="margin-top:10px; font-size:11.5px; color:#94A3B8; line-height:1.9;">
<i>「<<print _gloss>>」</i>
&nbsp;·&nbsp; 段位 <<print _rank_score>> ＋ 资金 <<print _money_score>> ＋ 粉丝 <<print _fan_score>>
<<if _qcnt > 0>> &nbsp;·&nbsp; 平均口碑 <<print _avgq>> 分<</if>>
</div>
</div>

/* ---------- ③ 艺人工牌 ---------- */
<div style="margin:26px 22px 0;">
<div style="font-size:12px; letter-spacing:.2em; color:#8A6A2E; margin-bottom:12px;">艺 人 工 牌 · 这 五 年 他 们 都 干 了 什 么</div>

<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(238px,1fr)); gap:12px;">

<<for _k range _act_keys>>
<<set _a to $actors[_k]>>
<<set _an to 0>>
<<for _f range $film_lib>>
<<if _f.actor is _k>><<set _an to _an + 1>><</if>>
<</for>>
<<set _jv to 0>><<set _jf to 0>><<set _js to 0>>
<<for _j range $job_log>>
<<if _j.a is _k>>
<<if _j.t is "variety">><<set _jv to _jv + 1>>
<<elseif _j.t is "fashion">><<set _jf to _jf + 1>>
<<elseif _j.t is "stage">><<set _js to _js + 1>>
<</if>>
<</if>>
<</for>>
<<set _cardStyle to "border:1px solid #E8EEF6; background:#FFFFFF;">>
<<if _k is "zp">><<set _cardStyle to "border:1.5px solid #DFC081; background:linear-gradient(180deg,#FFFDF4,#FFFFFF);">><</if>>

<div style="border-radius:14px; padding:16px 16px 14px; <<print _cardStyle>>">

<div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
<b style="font-size:15px; color:#243044;"><<print _a.name>></b>
<span style="flex:none; font-size:10.5px; padding:2px 9px; border-radius:999px; color:#8A6A2E; background:#FBF3E2; border:1px solid #EBD9B6;"><<print _a.rank_label>></span>
</div>
<div style="font-size:11px; color:#94A3B8; margin-top:4px;">
粉丝 <<print Math.round(FanSumCore(_a) / 1000) / 10>> 万
&nbsp;·&nbsp; 影视 <<print _an>> 部
<<if _jv > 0>> &nbsp;·&nbsp; 综艺 <<print _jv>> 档<</if>>
<<if _jf > 0>> &nbsp;·&nbsp; 时尚 <<print _jf>> 场<</if>>
<<if _js > 0>> &nbsp;·&nbsp; 舞台 <<print _js>> 场<</if>>
</div>

<div style="margin-top:11px; padding-top:10px; border-top:1px dashed #E8EEF6; font-size:11.5px; line-height:1.95; color:#5A6678;">
<<if _an == 0>>
<div style="color:#B4BFCB;">一部戏都没接过。</div>
<<else>>
<<set _shown to 0>>
<<for _fi to $film_lib.length - 1; _fi >= 0; _fi = _fi - 1>>
<<if $film_lib[_fi].actor is _k and _shown < 3>>
<<set _shown to _shown + 1>>
<<set _ff to $film_lib[_fi]>>
<div style="display:flex; justify-content:space-between; gap:10px;">
<span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;"><<print _ff.name>></span>
<<if _ff.status is "pending">>
<span style="flex:none; color:#94A3B8;">待播</span>
<<elseif _ff.hit>>
<span style="flex:none; color:#C0392B; font-weight:700;">★ <<print _ff.score>></span>
<<elseif _ff.rot>>
<span style="flex:none; color:#B08A8A;">烂片</span>
<<else>>
<span style="flex:none; color:#8A6A2E;"><<print _ff.score>></span>
<</if>>
</div>
<</if>>
<</for>>
<<if _an > 3>>
<div style="color:#A8B3C1; font-size:11px; margin-top:2px;">还有 <<print _an - 3>> 部更早的</div>
<</if>>
<</if>>
</div>

<div style="margin-top:10px; padding-top:9px; border-top:1px dashed #E8EEF6; font-size:12px; line-height:1.85; color:#3D4B61;">
<<if _k is "zp">>
<<if $ending_outcome is "bad">>
此后：不再有此后。
<<elseif $ending_outcome is "police">>
退圈归队，平嶂铁路公安局刑侦支队长。
<<else>>
复婚，重新签约无垠娱乐。热搜挂了三天。
<</if>>
<<elseif _k is "qs">>
<<if _a.rank_level >= 4>>
终于摆脱了恶女标签，拿了第一个正经女主。她说以后不演坏人了，然后接了个更坏的。
<<else>>
还在各种狗血剧里演坏女人。她自己说挺好，赚钱。
<</if>>
<<elseif _k is "new">>
<<if _a.rank_level >= 3>>
从被欺负的新人熬成能独当一面的艺人，现在敢跟导演提意见了。
<<else>>
还是那个糊咖，但他说在你公司待着挺开心，主要是食堂好。
<</if>>
<<elseif _k is "huang">>
<<if _a.rank_level >= 3>>
彻底走出替身的影子，现在别人先叫他的名字，再想起另一个人。
<<else>>
在圈里浮沉几年后退了，回老家开了家店，据说生意不错。
<</if>>
<<else>>
还在坚持他的艺术追求，偶尔拍出惊艳全网的大片，然后继续赔钱。
<</if>>
</div>

</div>
<</for>>

</div>
</div>

/* ---------- ④ 五年大事记 ---------- */
<div style="margin:26px 22px 0;">
<div style="font-size:12px; letter-spacing:.2em; color:#8A6A2E; margin-bottom:12px;">五 年 大 事 记</div>
<div style="display:flex; flex-wrap:wrap; gap:8px;">
<<set _chap to [["Story_Act1_01_Scandal", "绯闻爆出"], ["Story_Act1_08_Truth", "知道他是谁"], ["Story_Act1_09_Divorce", "断尾求生"], ["Story_Movie_45_Offer", "五亿的邀约"], ["Story_Movie_53_Snowstorm", "暴风雪那一夜"], ["Story_Act4_19_BlackCard", "三亿与静默"], ["Story_Act4_20_Collapse", "收网"], ["Story_Act4_22_Judgment", "命运的分岔"]]>>
<<for _c range _chap>>
<<set _sk to _c[0]>>
<<if def $story_seen[_sk]>>
<span style="font-size:11.5px; padding:5px 11px; border-radius:999px; background:#F7FAFE; border:1px solid #E8EEF6; color:#5A6678;">第 <<print $story_seen[_sk]>> 月 · <<print _c[1]>></span>
<</if>>
<</for>>
</div>
<div style="margin-top:10px; font-size:11px; color:#B4BFCB; line-height:1.9;">只列出主线里最关键的几个节点，完整的可以回办公室翻「剧情档案」。</div>
</div>

<div style="text-align:center; padding:30px 0 34px;">
<<button "🔄 再开一世" "Game_Notice">><<run Engine.restart()>><</button>>
</div>

</div>
<</nobr>>`
});

/* ── 未启用（原设计第59月） · 第四幕入口 ───────────────────────────────────────
   故事块：Story_Act4_Finale
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Story_Act4_Finale",
  src: `<<goto "Story_Act4_20_Collapse">>`
});

/* ===========================================================================
   剧情档案（2026-10-27）
   ---------------------------------------------------------------------------
   解决的问题：剧情页一旦被误点关掉（点了侧栏、刷新了页面），那一屏就再也回不去了，
   后面的剧情虽然有，但中间少了一块，玩家会一头雾水。

   做法：
   ① 引擎在每次进入 Story_ / Prologue_ / Ending_ 页面时，自动把章节名记进
      $story_seen（值为第一次看到时的月份）—— 不用手工登记。
   ② 办公室 → 🎞️ 剧情档案 按顺序列出看过的章节，点「重看」进入只读回放。
   ③ 回放时 Engine.readonly = true：set / run / goto 全部不执行，按钮变成死标签，
      所以重看一百遍也不会重复加羁绊值、不会跳走。
   =========================================================================== */

/* 章节名 → 人话标题。新加剧情时在这里补一行就行（不补也能看，会直接显示块名） */
window.WY_STORY_TITLE = {
  "Prologue_Chap1": "序章 · 一",
  "Prologue_Chap2": "序章 · 二",
  "Prologue_Chap3": "序章 · 三",

  "Story_Act1_01_Scandal":    "突发绯闻",
  "Story_Act1_02_Car":        "路透照流出",
  "Story_Act1_03_Hotel":      "周一见",
  "Story_Act1_04_Substitute": "似曾相识的面孔",
  "Story_Act1_05_Confrontation": "当面对峙",
  "Story_Act1_06_Tracking":   "暗巷追踪",
  "Story_Act1_07_Offer":      "帝国娱乐的报价",
  "Story_Act1_08_Truth":      "残酷的真相",
  "Story_Act1_09_Divorce":    "断尾求生",

  "Story_Act2_11_NewBlood":   "新的拼图",
  "Story_Act2_12_News_34":    "票房惨案",
  "Story_Act2_12_Gossip_35":  "舆论反噬",
  "Story_Act2_13_RainyNight": "暴雨夜归",

  "Story_Act3_14_Waiting":    "沉默的砖头",
  "Story_Act3_15_MissionStart": "加密短信",
  "Story_Movie_45_Offer":     "五亿的邀约",
  "Story_Movie_46_Premiere":  "开机",
  "Story_Movie_50_Babysitter": "家里多了个人",
  "Story_Movie_52_Wrap":      "杀青",
  "Story_Movie_53_Snowstorm": "暴风雪",
  "Story_Act3_18_FangMo":     "废弃仓库",
  "Story_Act3_19_LastMoment": "黎明前的黑暗",

  "Story_Act4_19_BlackCard":  "三亿与静默",
  "Story_Act4_20_Collapse":   "收网",
  "Story_Act4_21_Waiting":    "焦急的等待",
  "Story_Act4_22_Judgment":   "命运的分岔",

  "Story_BadEnd_Mediocre":    "结局 · 平庸的宁静",
  "Ending_Police":            "结局 · 荣耀归队",
  "Ending_Family":            "结局 · 人间烟火",
  "Ending_Bad":               "结局 · 无声的牺牲"
};

/* ── 剧情固定月份表 ─────────────────────────────────────────────────────
   每一段主线剧情只在自己那个月结算时触发（见 96_month.js 的月结路由）。
   跳月跳过的，会在这里标成「没看到」，可以点开只读补看。
   加新剧情时：这里补一行，96_month.js 补一条路由，两边月份要一致。
   ──────────────────────────────────────────────────────── */
window.WY_STORY_SCHEDULE = [
  { m: 25, k: "Story_Act1_01_Scandal",     t: "突发绯闻",         d: "条件：展鹏已是一线" },
  { m: 26, k: "Story_Act1_02_Car",         t: "路透照流出",       d: "条件：无" },
  { m: 27, k: "Story_Act1_03_Hotel",       t: "周一见：实锤？",   d: "条件：无" },
  { m: 28, k: "Story_Act1_04_Substitute",  t: "似曾相识的面孔",   d: "同月接当面对峙，两个选择" },
  { m: 29, k: "Story_Act1_06_Tracking",    t: "暗巷追踪",         d: "条件：未离婚" },
  { m: 30, k: "Story_Act1_07_Offer",       t: "帝国娱乐的报价",   d: "同月接残酷的真相" },
  { m: 31, k: "Story_Act1_09_Divorce",     t: "断尾求生",         d: "签离婚协议，展鹏离队" },
  { m: 32, k: "Story_Act2_11_NewBlood",    t: "新的拼图",         d: "条件：已离婚，刘梁周签约" },
  { m: 34, k: "Story_Act2_12_News_34",     t: "票房惨案",         d: "条件：已离婚" },
  { m: 35, k: "Story_Act2_12_Gossip_35",   t: "舆论反噬",         d: "条件：已离婚" },
  { m: 36, k: "Story_Act2_13_RainyNight",  t: "暴雨夜归",         d: "条件：现金 ≥ 5000 万" },
  { m: 37, k: "Story_Act3_14_Waiting",     t: "沉默的砖头",       d: "条件：已进入卧底线" },
  { m: 38, k: "Story_Act3_15_MissionStart", t: "加密短信",        d: "此后开放加密线路" },
  { m: 45, k: "Story_Movie_45_Offer",      t: "五亿的邀约",       d: "条件：已进入卧底线" },
  { m: 46, k: "Story_Movie_46_Premiere",   t: "开机",             d: "解锁剧组探班" },
  { m: 50, k: "Story_Movie_50_Babysitter", t: "家里多了个人",     d: "固定 +正义 10 / +信任 10" },
  { m: 52, k: "Story_Movie_52_Wrap",       t: "杀青",             d: "探班入口关闭" },
  { m: 53, k: "Story_Movie_53_Snowstorm",  t: "暴风雪",           d: "之后接「天亮之后」，固定 +羁绊 10" },
  { m: 54, k: "Story_Act3_18_FangMo",      t: "废弃仓库",         d: "条件：已进入卧底线" },
  { m: 56, k: "Story_Act3_19_LastMoment",  t: "黎明前的黑暗",     d: "固定 +羁绊 10" },
  { m: 57, k: "Story_Act4_19_BlackCard",   t: "三亿与静默",       d: "加密线路永久关闭" },
  { m: 58, k: "Story_Act4_20_Collapse",    t: "收网",             d: "条件：已进入卧底线" },
  { m: 59, k: "Story_Act4_21_Waiting",     t: "焦急的等待",       d: "最后一个能经营的月份" },
  { m: 60, k: "Story_Act4_22_Judgment",    t: "命运的分岔",       d: "判定结局" }
];

window.WY_SCHED_MAP = (function () {
  var m = {};
  for (var i = 0; i < window.WY_STORY_SCHEDULE.length; i++) {
    m[window.WY_STORY_SCHEDULE[i].k] = window.WY_STORY_SCHEDULE[i].m;
  }
  return m;
})();

/* ---------- 故事块：Archive_Main（剧情档案） ---------- */
window.__STORY_PASSAGES.push({
  name: "Archive_Main",
  src: `<<nobr>>
<<if not def $story_seen>><<set $story_seen to {}>><</if>>

<<set _sch to WY_STORY_SCHEDULE>>
<<set _seen_n to 0>>
<<set _miss_n to 0>>
<<for _row range _sch>>
    <<if $story_seen[_row.k]>>
        <<set _seen_n to _seen_n + 1>>
    <<elseif $month > _row.m>>
        <<set _miss_n to _miss_n + 1>>
    <</if>>
<</for>>

<div class="tech-card arc-card">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 剧情档案</span>
    </div>

    <div style="padding: 20px 24px 24px;">

        <div class="arc2-stat">
            <span>已看 <b><<print _seen_n>></b> / <<print _sch.length>> 段</span>
            <span>错过 <b><<print _miss_n>></b> 段</span>
            <span>当前 第 <<print $month>> 月</span>
        </div>

        <div class="arc2-sec">按月主线 · 每段只在自己那个月触发</div>

        <ul class="arc2-list">
            <<for _row range _sch>>
                <<set _k to _row.k>>
                <<set _t to _row.t>>
                <<set _d to _row.d>>
                <<set _m to _row.m>>
                <li class="arc2-row<<if $month < _m>> is-future<</if>>">
                    <span class="arc2-m">第 <<print _m>> 月</span>
                    <span class="arc2-t"><<print (WY_STORY_TITLE[_k] || _t)>><span class="arc2-d"><<print _d>></span></span>
                    <<if $story_seen[_k]>>
                        <span class="arc2-s st-done">已看</span>
                        <<link "重看" class="arc2-go">>
                            <<set $replay_name to _k>>
                            <<set $replay_month to _m>>
                            <<goto "Archive_Replay">>
                        <</link>>
                    <<elseif $month > _m>>
                        <span class="arc2-s st-miss">没看到</span>
                        <<link "补看" class="arc2-go">>
                            <<set $replay_name to _k>>
                            <<set $replay_month to _m>>
                            <<goto "Archive_Replay">>
                        <</link>>
                    <<elseif $month is _m>>
                        <span class="arc2-s st-now">本月</span>
                    <<else>>
                        <span class="arc2-s st-future">未到</span>
                    <</if>>
                </li>
            <</for>>
        </ul>

        <<if _miss_n > 0>>
        <div class="arc2-note" style="margin-top:14px;">
            标「没看到」的是被你跳过去的月份。点「补看」可以只读回放——<b>不改数值、不推进剧情</b>，
            当月的加成不会补发。
        </div>
        <</if>>

        <<set _other to []>>
        <<for _k2 range Object.keys($story_seen)>>
            <<if not WY_SCHED_MAP[_k2]>>
                <<run _other.push(_k2)>>
            <</if>>
        <</for>>
        <<if _other.length > 0>>
            <div class="arc2-sec">其他记录</div>
            <ul class="arc2-list">
                <<for _k3 range _other>>
                    <li class="arc2-row">
                        <span class="arc2-m">第 <<print $story_seen[_k3]>> 月</span>
                        <span class="arc2-t"><<print (WY_STORY_TITLE[_k3] || _k3)>></span>
                        <<link "重看" class="arc2-go">>
                            <<set $replay_name to _k3>>
                            <<set $replay_month to $story_seen[_k3]>>
                            <<goto "Archive_Replay">>
                        <</link>>
                    </li>
                <</for>>
            </ul>
        <</if>>

        <div class="continue-row" style="margin-top: 18px;">
            <<link "🏢 回办公室">><<goto "Office">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Archive_Replay（只读回看） ---------- */
window.__STORY_PASSAGES.push({
  name: "Archive_Replay",
  src: `<<nobr>>
<<set _rn to ($replay_name || "")>>
<<set _rm to ($replay_month || 0)>>
<<set _was_seen to ($story_seen[_rn] ? true : false)>>

<div class="tech-card arc-card">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 回看 · <<print (WY_STORY_TITLE[_rn] || _rn)>></span>
    </div>
    <div style="padding: 22px 24px 24px;">
        <div style="text-align: center;">
            <<if _was_seen>>
                <span class="replay-tag">只读回看 · 第 <<print $story_seen[_rn]>> 月记录 · 不改变任何数值</span>
            <<else>>
                <span class="replay-tag">错过的章节 · 应出现在第 <<print _rm>> 月 · 只读补看，不加任何数值</span>
            <</if>>
        </div>

        /* 打开只读开关 → 渲染原剧情 → 关掉。set/run/goto 在这中间全部失效。 */
        <<script>>Engine.readonly = true;<</script>>
        <<include _rn>>
        <<script>>Engine.readonly = false;<</script>>

        <div class="continue-row" style="margin-top: 18px;">
            <<link "‹ 返回剧情档案">><<goto "Archive_Main">><</link>>
            &nbsp;&nbsp;
            <<link "🏢 回办公室">><<goto "Office">><</link>>
        </div>
    </div>
</div>
<</nobr>>`
});
