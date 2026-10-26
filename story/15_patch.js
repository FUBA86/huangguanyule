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
    <<set _fan_total += ($actors.zp.fans.career || 0) + ($actors.zp.fans.mom || 0) + ($actors.zp.fans.face || 0) + ($actors.zp.fans.clown || 0) + ($actors.zp.fans.toxic || 0) + ($actors.zp.fans.cp || 0) + ($actors.zp.fans.dream || 0)>>
<</if>>
<<if def $actors.qs>>
    <<set _rank_score += ($actors.qs.rank_level || 1) * 40>>
    <<set _fan_total += ($actors.qs.fans.career || 0) + ($actors.qs.fans.mom || 0) + ($actors.qs.fans.face || 0) + ($actors.qs.fans.clown || 0) + ($actors.qs.fans.toxic || 0) + ($actors.qs.fans.cp || 0) + ($actors.qs.fans.dream || 0)>>
<</if>>
<<if def $actors.new>>
    <<set _rank_score += ($actors.new.rank_level || 1) * 40>>
    <<set _fan_total += ($actors.new.fans.career || 0) + ($actors.new.fans.mom || 0) + ($actors.new.fans.face || 0) + ($actors.new.fans.clown || 0) + ($actors.new.fans.toxic || 0) + ($actors.new.fans.cp || 0) + ($actors.new.fans.dream || 0)>>
<</if>>
<<if $has_signed_huang is true and def $actors.huang>>
    <<set _rank_score += ($actors.huang.rank_level || 1) * 40>>
    <<set _fan_total += ($actors.huang.fans.career || 0) + ($actors.huang.fans.mom || 0) + ($actors.huang.fans.face || 0) + ($actors.huang.fans.clown || 0) + ($actors.huang.fans.toxic || 0) + ($actors.huang.fans.cp || 0) + ($actors.huang.fans.dream || 0)>>
<</if>>
<<if $has_signed_liu is true and def $actors.liu>>
    <<set _rank_score += ($actors.liu.rank_level || 1) * 40>>
    <<set _fan_total += ($actors.liu.fans.career || 0) + ($actors.liu.fans.mom || 0) + ($actors.liu.fans.face || 0) + ($actors.liu.fans.clown || 0) + ($actors.liu.fans.toxic || 0) + ($actors.liu.fans.cp || 0) + ($actors.liu.fans.dream || 0)>>
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
