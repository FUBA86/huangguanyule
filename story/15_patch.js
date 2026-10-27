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
window.__STORY_PASSAGES.push({
  name: "Game_Ending_Evaluation",
  src: `<<nobr>>
/* ---- 结算：先算分，再显示 ---- */
/* 评分 = 段位分（最多 1000）+ 资金分（最多 300）+ 粉丝分（最多 400） */
<<set _rank_score to 0>>
<<set _fan_total to 0>>

<<if def $actors.zp>>
    <<set _rank_score += ($actors.zp.rank_level || 1) * 40>>
    <<set _fan_total += FanSumCore($actors.zp)>>
<</if>>
<<if def $actors.qs>>
    <<set _rank_score += ($actors.qs.rank_level || 1) * 40>>
    <<set _fan_total += FanSumCore($actors.qs)>>
<</if>>
<<if def $actors.new>>
    <<set _rank_score += ($actors.new.rank_level || 1) * 40>>
    <<set _fan_total += FanSumCore($actors.new)>>
<</if>>
<<if $has_signed_huang is true and def $actors.huang>>
    <<set _rank_score += ($actors.huang.rank_level || 1) * 40>>
    <<set _fan_total += FanSumCore($actors.huang)>>
<</if>>
<<if $has_signed_liu is true and def $actors.liu>>
    <<set _rank_score += ($actors.liu.rank_level || 1) * 40>>
    <<set _fan_total += FanSumCore($actors.liu)>>
<</if>>

/* 资金与粉丝都封顶，防止「囤钱通吃」和「刷粉通吃」 */
<<set _money_score to Math.min(300, Math.floor(($money || 0) / 1000))>>
<<set _fan_score to Math.min(400, Math.floor(_fan_total / 1000))>>
<<set _score to _rank_score + _money_score + _fan_score>>

<<set _grade to "C">>
<<set _comment to "勉强维持温饱的娱乐圈路人。">>
<<if _score > 1450>>
    <<set _grade to "SSS">><<set _comment to "【娱乐圈教父】你缔造了无法撼动的娱乐帝国。">>
<<elseif _score > 1100>>
    <<set _grade to "S">><<set _comment to "【王牌操盘手】你的名字就是票房的保证。">>
<<elseif _score > 800>>
    <<set _grade to "A">><<set _comment to "【金牌推手】圈内人都得喊你一声大佬。">>
<<elseif _score > 450>>
    <<set _grade to "B">><<set _comment to "【小有名气】没赚大钱，但也没赔本。">>
<</if>>
<</nobr>>

<div class="tech-card">
  <div class="header-banner"><span>🏆 五年合约期满 · 最终经营评价</span></div>
  <div style="padding:30px;">

    <div style="border:2px solid gold; padding:20px; border-radius:10px; text-align:center; background:rgba(251,191,36,0.07);">
      最终资产：<span style="color:#b45309;font-size:20px;">$money 万</span><br><br>
      综合评分：<span style="color:#1d4ed8;font-size:24px;font-weight:800;">_score</span><br><br>
      经营评级：<span style="color:#dc2626;font-size:44px; font-weight:900;">_grade</span><br><br>
      <i style="color:#475569;">"_comment"</i>
      <div style="margin-top:10px;font-size:13px;color:#7B879B;">
        段位 _rank_score ＋ 资金 _money_score ＋ 粉丝 _fan_score
      </div>
    </div>

    <h3 style="margin-top:30px;">📋 旗下艺人最终去向</h3>
    <hr>

    <<if def $actors.qs>>
      <p><b>秦飒</b>（<<print $actors.qs.rank_label>>）：
        <<if $actors.qs.rank_level >= 4>>
          @@color:#b45309; 终于摆脱了“恶女”标签，成为真正的实力派大花。@@
        <<else>>
          @@color:#64748b; 依然在各种狗血剧里演坏女人。@@
        <</if>>
      </p>
    <</if>>

    <<if def $actors.new>>
      <p><b>白小纯</b>（<<print $actors.new.rank_label>>）：
        <<if $actors.new.rank_level >= 3>>
          @@color:#16a34a; 从被欺负的新人，成长为能独当一面的艺人。@@
        <<else>>
          @@color:#64748b; 还是那个糊咖，但他说在你公司待着挺开心。@@
        <</if>>
      </p>
    <</if>>

    <<if $has_signed_huang is true>>
      <p><b>黄耀祖</b>（<<print $actors.huang.rank_label>>）：
        <<if $actors.huang.rank_level >= 3>>
          @@color:#b45309; 彻底摆脱了替身阴影，走出了自己的路。@@
        <<else>>
          @@color:#64748b; 在娱乐圈浮沉几年后，退圈回老家开店了。@@
        <</if>>
      </p>
    <</if>>

    <<if $has_signed_liu is true>>
      <p><b>刘梁周</b>：@@color:#16a34a; 依然坚持着他的艺术追求。@@</p>
    <</if>>

    <hr><br>
    <<button "🔄 再开一世" "Game_Notice">><<run Engine.restart()>><</button>>
  </div>
</div>`
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

/* ---------- 故事块：Archive_Main（剧情档案） ---------- */
window.__STORY_PASSAGES.push({
  name: "Archive_Main",
  src: `<<nobr>>
<<if not def $story_seen>><<set $story_seen to {}>><</if>>
<<set _arc_keys to Object.keys($story_seen)>>

<div class="tech-card arc-card">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 剧情档案</span>
    </div>

    <div style="padding: 20px 24px 24px;">

        <p style="font-size: 13px; color: #6B7A90; line-height: 1.9; margin: 0 0 14px;">
            这一路看过的剧情都记在这里。点「重看」可以只读回放——
            <b>不改数值、不推进剧情</b>，随便看几遍都行。
        </p>

        <<if _arc_keys.length == 0>>
            <div class="arc-empty">还没有看过任何剧情。先去把日子过下去吧。</div>
        <<else>>
            <ul class="arc-list">
                <<for _k range _arc_keys>>
                    <li class="arc-item">
                        <span class="arc-m">第 <<print $story_seen[_k]>> 月</span>
                        <span class="arc-t"><<print (WY_STORY_TITLE[_k] || _k)>></span>
                        <<link "重看" class="arc-go">>
                            <<set $replay_name to _k>>
                            <<goto "Archive_Replay">>
                        <</link>>
                    </li>
                <</for>>
            </ul>
            <div class="arc-note">
                共 <<print _arc_keys.length>> 章。归档是按你看过的顺序排列的，越往下越新。<br>
                如果你发现某一章从来没出现过——那不是你的错觉，可能是那个月被别的事情挤掉了。
                以后遇到这种情况，直接在开发者面板里跳到对应剧情块补看即可。
            </div>
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

<div class="tech-card arc-card">
    <div class="header-banner" style="background: linear-gradient(120deg, #3B4A6E, #5B79A6);">
        <span>🎞️ 回看 · <<print (WY_STORY_TITLE[_rn] || _rn)>></span>
    </div>
    <div style="padding: 22px 24px 24px;">
        <div style="text-align: center;">
            <span class="replay-tag">只读回看 · 第 <<print ($story_seen[_rn] || "?")>> 月记录 · 不改变任何数值</span>
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
