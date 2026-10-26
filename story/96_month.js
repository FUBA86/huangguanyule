/* ===========================================================================
   ⑫ 月度结算与随机事件
   ---------------------------------------------------------------------------
   ★ 这个文件是【故事内容】，可以放心修改。
   ★ 每个 ((故事块)) 对应游戏里的一屏画面。
   ★ 规则：
       $xxx  = 存档里的变量（改一辈子都有效）
       _xxx  = 临时变量（只在当前这一屏有效）
       $money 这种写在普通文字里的，会自动显示成数字
       <<link "按钮字" "目标块名">>  = 做一个跳转按钮
       <<set $money += 100>>        = 加钱
       <<if $month > 10>> ... <</if>> = 条件判断
   =========================================================================== */

window.__STORY_PASSAGES = window.__STORY_PASSAGES || [];

/* ── 月结剧情路由器（所有「按月触发」剧情的总表） ──────────────────────
   故事块：Month_Check_Router
   顺序即优先级；`is` 精确月份、`>=` 宽松补触发
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Month_Check_Router",
  src: `<<silently>>
    
    /* =========================================================
       🟢 第一乐章：信任危机（第25–31月）
       ========================================================= */

    /* 第25月 · 突发绯闻（关键分歧：必须 Rank4 一线，否则坏结局） */
    <<if $month is 25 and $actors.zp.rank_level >= 4>>
        <<set $gossip_count to 1>>
        <<goto "Story_Act1_01_Scandal">>

    /* 第25月 · 结局：平庸的宁静（Rank < 4） */
    <<elseif $month is 25 and $actors.zp.rank_level < 4>>
        <<goto "Story_BadEnd_Mediocre">>

    /* 第26月 · 路透照流出 */
    <<elseif $month >= 26 and $gossip_count is 1>>
        <<set $gossip_count to 2>>
        <<goto "Story_Act1_02_Car">>

    /* 第27月 · 周一见：实锤？ */
    <<elseif $month >= 27 and $gossip_count is 2>>
        <<set $gossip_count to 3>>
        <<goto "Story_Act1_03_Hotel">>

    /* 第28月 · 似曾相识的面孔 →（页内直接继续）醉酒与逃避 */
    <<elseif $month >= 28 and $gossip_count >= 3 and $zp_story_stage is 0 and not $flag_substitute_seen>>
        <<goto "Story_Act1_04_Substitute">>

    /* 第29月 · 暗巷追踪 */
    <<elseif $month >= 29 and $gossip_count >= 3 and $zp_story_stage is 0 and not $flag_tracking_seen>>
        <<goto "Story_Act1_06_Tracking">>

    /* 第30月 · 帝国娱乐的报价 →（页内直接继续）残酷的真相 */
    <<elseif $month >= 30 and $gossip_count >= 3 and $zp_story_stage is 0 and not $flag_offer_seen>>
        <<goto "Story_Act1_07_Offer">>

    /* 第31月 · 断尾求生（签字离婚 → 展鹏离队、stage=2、黄耀祖入职） */
    <<elseif $month >= 31 and $gossip_count >= 3 and $zp_story_stage is 0>>
        <<goto "Story_Act1_09_Divorce">>

    /* =========================================================
       🟢 第二乐章：至暗时刻（第32–36月）
       ========================================================= */

    /* 第32月 · 新的拼图（刘梁周签约；此时黄耀祖已在册） */
    <<elseif $month >= 32 and $zp_story_stage >= 2 and $has_signed_liu is false>>
        <<goto "Story_Act2_11_NewBlood">>

    /* 第33月 · 留白（不安排剧情，走日常过场） */

    /* 第34月 · 票房惨案（娱乐头条模拟） */
    <<elseif $month is 34 and $zp_story_stage is 2>>
        <<goto "Story_Act2_12_News_34">>

    /* 第35月 · 舆论反噬 */
    <<elseif $month is 35 and $zp_story_stage is 2>>
        <<goto "Story_Act2_12_Gossip_35">>

    /* 第36月 · 暴雨夜归（核心分歧：资金≥5000万 才能开启卧底线） */
    <<elseif $month is 36 and $zp_story_stage is 2>>
        <<goto "Story_Act2_13_RainyNight">>

    /* =========================================================
       🟢 第三乐章：卧底（第37月–）
       ========================================================= */

    /* 第37月 · 沉默的砖头 */
    <<elseif $month is 37 and $zp_story_stage is 3>>
        <<goto "Story_Act3_14_Waiting">>

    /* 第38月 · 加密短信（此后第39月起开放卧底联络点） */
    <<elseif $month is 38 and $zp_story_stage is 3>>
        <<goto "Story_Act3_15_MissionStart">>

    /* =========================================================
       🟢 第四乐章：深空黎明（第45–54月）
       ========================================================= */

    /* 第45月 · 🎬 五亿的邀约（签下洗钱片《深空黎明》） */
    <<elseif $month is 45 and $zp_story_stage is 3>>
        <<goto "Story_Movie_45_Offer">>

    /* 第46月 · 🎥 开机（解锁主界面「剧组探班」入口） */
    <<elseif $month is 46 and $zp_story_stage is 3>>
        <<goto "Story_Movie_46_Premiere">>

    /* 第50月 · 👶 家里多了个人（黄耀祖带娃，女儿认错妈） */
    <<elseif $month is 50 and $zp_story_stage is 3>>
        <<goto "Story_Movie_50_Babysitter">>

    /* 第52月 · 🎬 杀青（关闭探班入口、证据到手） */
    <<elseif $month is 52 and $zp_story_stage is 3>>
        <<goto "Story_Movie_52_Wrap">>

    /* 第53月 · ❄️ 暴风雪（三楼卧室的影子戏） */
    <<elseif $month is 53 and $zp_story_stage is 3>>
        <<goto "Story_Movie_53_Snowstorm">>

    /* 第54月 · 🌙 废弃仓库（方末身份揭晓） */
    <<elseif $month is 54 and $zp_story_stage is 3>>
        <<goto "Story_Act3_18_FangMo">>

    /* =========================================================
       🔴 终章：黎明前的黑暗（第56–60月，一路到底不再回头）
       ========================================================= */

    /* 第56月 · 🌙 黎明前的黑暗（最后一次偷偷回家，羁绊 +10） */
    <<elseif $month is 56 and $zp_story_stage is 3>>
        <<goto "Story_Act3_19_LastMoment">>

    /* 第57月 · 📜 三亿与静默（律师送来赠予合同，加密线路关闭） */
    <<elseif $month is 57 and $zp_story_stage is 3>>
        <<goto "Story_Act4_19_BlackCard">>

    /* 第58月 · 🚨 收网（帝国娱乐崩塌，展鹏、方末失联） */
    <<elseif $month is 58 and $zp_story_stage is 3>>
        <<goto "Story_Act4_20_Collapse">>

    /* 第59月 · 🕯️ 焦急的等待（最后一个可经营的月份） */
    <<elseif $month is 59 and $zp_story_stage is 3>>
        <<goto "Story_Act4_21_Waiting">>

    /* 第60月 · ⚖️ 直接结局判定（不再养成） */
    <<elseif $month >= 60>>
        <<goto "Story_Act4_22_Judgment">>

    /* =========================================================
       🏠 平安无事 -> 进入日常 (Rest_Transition)
       ========================================================= */
    <<else>>
        /* 没剧情时，才去播放过场日常 */
        <<goto "Rest_Transition">>
    <</if>>
<</silently>>
    
    
    /* =========================================================
       🚧 施工现场：以下为未启用剧情 (备份区) 🚧
       已移出逻辑判断圈，绝对不会触发
       =========================================================



       13. 暴雨夜归 (核心分歧，需未触发过)
       <<elseif _next_m >= 37 and $zp_story_stage is 2 and not $flag_rainy_seen>>
           <<goto "Story_Act2_13_RainyNight">>

       === 第三乐章 ===

       15. 任务引导
       <<elseif _next_m >= 40 and $zp_story_stage is 3 and not $act3_mission_shown>>
           <<set $act3_mission_shown to true>>
           <<goto "Story_Act3_15_MissionStart">>

       18. 方末示警  ← 已接线（2026-10-24）
           现为「第54月 · 🌙 废弃仓库」，见上方路由；故事块 Story_Act3_18_FangMo
       <<elseif _next_m >= 53 and $zp_story_stage is 3 and not $act3_fangmo_shown>>
           <<set $act3_fangmo_shown to true>>
           <<goto "Story_Act3_18_FangMo">>

       19. 最后的温存  ← 已接线（2026-10-25）
           现为「第56月 · 🌙 黎明前的黑暗」，见上方路由；故事块 Story_Act3_19_LastMoment
           已改写为「新年深夜偷偷回家看女儿」，羁绊 +10，并从这里启动终章
       <<elseif _next_m >= 56 and $zp_story_stage is 3 and not $act3_last_shown>>
           <<set $act3_last_shown to true>>
           <<goto "Story_Act3_19_LastMoment">>

       20. 大结局  ← 已接线（2026-10-25）
           现为 57 三亿与静默 → 58 收网 → 59 等待 → 60 判定，见上方路由
       <<elseif _next_m >= 59 and $zp_story_stage is 3>>
           <<goto "Story_Act4_Finale">>
    */`
});

/* ---------- 故事块：NM_Events ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_Events",
  src: `<div class="nm-card">
    <div class="nm-sec evt">本月事件</div>

    <<if _rival_event>>
        <div class="nm-soft pink">
            <h4><<print _rival_event.title>></h4>
            <p><<print _rival_event.desc>></p>
            <div class="nm-tip">危险值激增，去公关部处理。</div>
        </div>
    <</if>>

    <<if _resource_event>>
        <div class="nm-soft cream">
            <p><<print _resource_event.desc>></p>
        </div>
    <</if>>

    <div class="nm-note-line">本月搜集到 <<print _monthly_gossip_count>> 条新情报。</div>
</div>`
});

/* ---------- 故事块：NM_FanWar ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_FanWar",
  src: `<<Generate_Fan_War>>
<<if $fan_war_report neq "">>
<div class="nm-card">
    <div class="nm-sec evt">粉圈</div>
    <div class="fan-report" style="font-size:12.5px; color:#6E6A78; line-height:1.85;"><<print $fan_war_report>></div>
</div>
<</if>>`
});

/* ---------- 故事块：NM_Filming ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_Filming",
  src: `<<if _finished_actors.length > 0>>
    <<for _i to 0; _i < _finished_actors.length; _i++>>
        <<set _key to _finished_actors[_i]>>
        <<set $current_actor to _key>>
        <<set _a to $actors[_key]>>

        /* --- 1. 正常工作的结算 --- */
        <<if _a.job_type is "drama" or _a.job_type is "variety" or _a.job_type is "fashion" or _a.job_type is "stage">>
            <div class="nm-card">
                <div class="nm-sec biz">杀青</div>
                <div style="font-size:13px; color:#3D4B61; line-height:1.8;">
                    🎉 <<print _a.name>> 的 <<print _a.project_name>> 杀青了
                </div>
                <<Job_Settle _a.job_type>>
            </div>

        /* --- 2. 封杀/抵制结束 --- */
        <<elseif _a.job_type is "banned" and _a.busy_months == 0>>
            <div class="nm-soft blue">
                <h4>🔓 解封通知</h4>
                <p><<print _a.name>> 的「全网抵制期」结束了。</p>
                <div class="nm-tip" style="color:#8C9AB0;">大众已经淡忘，但口碑恢复还需要时间。</div>
            </div>

        /* --- 3. 产假状态变更通知 --- */
        <<elseif _a.job_type is "maternity_leave" and _a.busy_months == 0>>
            <<if $zp_preg.state is 2 and $zp_preg.month >= 3 and $zp_preg.month < 6>>
                <div class="nm-soft pink">
                    <h4>🍼 新手奶爸复出（部分解禁）</h4>
                    <p>展鹏已经度过最艰难的恢复期。</p>
                    <p style="margin-top:4px;">已解锁：综艺、时尚、培训。</p>
                    <div class="nm-tip">影视和唱跳仍需静养，暂不可用。</div>
                </div>
            <<elseif $zp_preg.state is 3>>
                <div class="nm-soft pink">
                    <h4>✨ 产假彻底结束</h4>
                    <p>展鹏的身体状态已经完全恢复。</p>
                    <p style="margin-top:4px;">已解锁：影视剧拍摄、高强度舞台。</p>
                </div>
            <</if>>

        /* --- 4. 培训结束 --- */
        <<elseif _a.job_type is "training" and _a.busy_months == 0>>
            <div class="nm-soft lilac">
                <h4>🎓 进修完成</h4>
                <p><<print _a.name>> 完成了封闭式培训，能力值已提升。</p>
            </div>
        <</if>>

        /* 只有当真的结束了，才清空状态 */
        <<if _a.busy_months == 0>>
            <<set _a.project_name to "">><<set _a.job_type to "">>
        <</if>>
    <</for>>
<</if>>`
});

/* ---------- 故事块：NM_Finance ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_Finance",
  src: `<div class="nm-card">
    <div class="nm-sec fin">财务</div>
    <div class="nm-kpis">
        <div class="nm-kpi out">
            <div class="k">公司运营成本</div>
            <div class="v">− <<print $monthly_cost>> 万</div>
        </div>
        <div class="nm-kpi out">
            <div class="k">艺人工资</div>
            <div class="v">− <<print $salary_cost>> 万</div>
        </div>
        <<if _is_year_end>>
        <div class="nm-kpi out">
            <div class="k">年终福利</div>
            <div class="v">− 500 万</div>
        </div>
        <</if>>
        <div class="nm-kpi bal <<if $money < 0>>is-neg<</if>>">
            <div class="k">账户结余</div>
            <div class="v"><<print $money>> 万</div>
        </div>
    </div>
    <<if _is_year_end>>
    <div class="nm-note-line">岁末年终，给全公司发了红包。</div>
    <</if>>
</div>`
});

/* ---------- 故事块：NM_Punishment ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_Punishment",
  src: `<<nobr>>
<<if _punishment_triggered>>
<div class="nm-card nm-alert">
    <div class="nm-sec evt">危机 · 全网抵制</div>
    <p class="nm-alert-lead">
        危险值已经顶到 100。业内口碑彻底崩盘，合作方连夜撤资，旗下艺人被集体停摆。
    </p>

    <<if _fired_actors.length > 0>>
        <div class="nm-soft pink">
            <h4>严重违约</h4>
            <p>合作方愤而解约，把 <<print _fired_actors.join("、")>> 赶出了剧组。</p>
            <p style="margin-top:4px;">违约金 − <<print _total_penalty>> 万</p>
        </div>
    <</if>>

    <div class="nm-item warn">所有库存资源已被资方撤回</div>
    <div class="nm-item warn">旗下艺人限制活动 3 个月</div>
</div>
<</if>>
<</nobr>>`
});

/* ---------- 故事块：NM_Rank ---------- */
window.__STORY_PASSAGES.push({
  name: "NM_Rank",
  src: `<<if _rank_change_events.length > 0>>
<div class="nm-card">
    <div class="nm-sec biz">咖位变动</div>
    <<for _i to 0; _i < _rank_change_events.length; _i++>>
        <<set _e to _rank_change_events[_i]>>
        <<if _e.type is "up">>
            <div class="nm-item good">✨ <<print _e.name>> 从 [_e.old_rank] 晋升为 <b>[_e.new_rank]</b></div>
        <<elseif _e.type is "down">>
            <div class="nm-item warn">
                <div>
                    📉 <<print _e.name>> 从 [_e.old_rank] 跌落至 <b>[_e.new_rank]</b>
                    <div style="font-size:11.5px; color:#A08595; margin-top:3px;">
                        原因：<<print _e.reason>>　·　可去公关部补一点流量
                    </div>
                </div>
            </div>
        <</if>>
    <</for>>
</div>
<</if>>`
});

/* ---------- 故事块：Next_Month ---------- */
window.__STORY_PASSAGES.push({
  name: "Next_Month",
  src: `<<nobr>>
/* 1. 先执行原本的后台计算 (会把体力重置为100) */
<<Process_Month_Logic>>

/* 2. 月度热搜榜刷新 */
<<Generate_Monthly_HotSearch>>
<<set $pr_action_count to 3>>
<<set $hot_search_list to []>>

/* 🔴【核心修复】立刻执行我们的“体力补丁” */
<<Apply_Overload_Buff>>

/* 4. 侧边栏热搜刷新 */
<<Logic_Events>>

<div class="nm-page">

    <div class="nm-head">
        <div class="nm-head-left">
            <div class="nm-month">第 <<print $month>> 月</div>
            <div class="nm-title">月度结算</div>
        </div>
    </div>

    /* --- 危机（只在触发时出现） --- */
    <<include "NM_Punishment">>

    /* --- 财务 --- */
    <<include "NM_Finance">>

    /* --- 展鹏怀孕 --- */
    <<ZP_Event_Display>>

    /* --- 杀青 / 解封 / 产假 / 培训 --- */
    <<include "NM_Filming">>

    /* --- 咖位变动 --- */
    <<include "NM_Rank">>

    /* --- 粉圈 --- */
    <<include "NM_FanWar">>

    /* --- 商战与资源 --- */
    <<include "NM_Events">>

    /* --- 下月预热 --- */
    <div class="nm-card quiet">
        <div class="nm-sec rew">下月预热</div>
        <div style="font-size:12.5px; color:#7C8798; line-height:1.85;"><<print _next_hotsearch>></div>
    </div>

    /* --- 进入下个月 --- */
    <div class="nm-next">
        <<if $money < 0>>
            <div class="nm-hint" style="margin-bottom:11px;">账户已经见底，撑不下去了。</div>
            [[查看结局 · 负债累累|Game_Over]]
        <<elseif $month > $total_months>>
            <div class="nm-hint" style="margin-bottom:11px;">五年合约期满。</div>
            [[查看结局 · 功成名就|Game_Ending]]
        <<else>>
            <<link "进入下个月">><<goto "Office">><</link>>
            <div class="nm-hint">第 <<print $month + 1>> 月</div>
        <</if>>
    </div>

</div>
<</nobr>>`
});

/* ---------- 故事块：Next_Month_End ---------- */
window.__STORY_PASSAGES.push({
  name: "Next_Month_End",
  src: `<<goto "Next_Month">>`
});

/* ---------- 故事块：Rest_Transition ---------- */
window.__STORY_PASSAGES.push({
  name: "Rest_Transition",
  src: `<<nobr>>
<div class="tech-card" style="min-height: 60vh; position:relative; display:flex; flex-direction:column; justify-content:center; align-items:center;">

  <div style="font-size:4em; margin-bottom:20px;">🏩</div>

  /* =================================================================
     PART 1: 甜蜜时光 (Month < 25)
     只有在第25个月（绯闻爆发）之前，才能触发原本的甜蜜互动和体力爆种
     ================================================================= */
  <<if $month < 25>>

      /* --- 1. 核心判定逻辑 (后台静默运行) --- */
      
      /* 展鹏疲劳判定 */
      <<if $actors.zp.current_energy <= 10>>
          <<set $zp_exhaustion_streak to ($zp_exhaustion_streak || 0) + 1>>
      <<else>>
          <<set $zp_exhaustion_streak to 0>>
      <</if>>

      /* 玩家疲劳判定 */
      <<if $stamina <= 10>>
          <<set $player_exhaustion_streak to ($player_exhaustion_streak || 0) + 1>>
      <<else>>
          <<set $player_exhaustion_streak to 0>>
      <</if>>
      
      /* 封顶逻辑 */
      <<set $zp_exhaustion_streak to Math.min(3, $zp_exhaustion_streak)>>
      <<set $player_exhaustion_streak to Math.min(3, $player_exhaustion_streak)>>


      /* --- 2. 剧情分流 --- */

      /* 🔥 剧情A：丈夫的抚慰 (展鹏爆种) */
      <<if $zp_exhaustion_streak >= 3>>
          
          <h3 style="color:#be185d; margin-bottom:20px;">丈夫的抚慰</h3>
          <div style="background:#fff0f5; padding:25px; border-radius:10px; border-left:5px solid #be185d; color:#831843; font-size:1.1em; line-height:1.8; max-width:500px;">
            
            <<if $zp_preg.state is 0 or $zp_preg.state is 3>>
                <p>连续三个月的高强度压榨，展鹏已经累得像条真正的咸鱼，躺在床上一动不动：“周扒皮，不是人，哪有这么对老婆的……”</p>
                <p>“是吗？”你跳上床，看着他脸上奸计得逞一般的微笑，“那我来帮你‘充电’。”</p>
                <p>那一晚展鹏在床上尖叫着痉挛。次日清晨，他虽然扶着腰，但精神竟然出奇的好。</p>
            
            <<elseif $zp_preg.state is 1>>
                <p>孕期的不适加上体力的透支，展鹏的情绪格外敏感。他红着眼眶缩在被子里：“身上好难受，哪里都疼...”</p>
                <p>你钻进被窝，温热的手掌抚上他紧绷的身体，在他耳边轻声说：“医生说，适当的运动有利于身心健康……”</p>
                <p>“孕期还要，不是人啊！”展鹏幸福地夸赞你，“完全就是个变态啊韩证飞……”</p>
                <p>这是一个极尽温柔的夜晚，所有的疲惫都在你的安抚中化成了一滩春水。</p>
            
            <<elseif $zp_preg.state is 2>>
                <p>带娃和恢复身体的双重压力让展鹏憔悴了不少。看到你进来，他下意识想去抱孩子，却被你按住了手腕。</p>
                <p>“孩子睡了。”你吻上他有些干燥的嘴唇，手指轻轻划过他柔软的小腹，“让我亲亲好不好……”</p>
                <p>久违的亲密不仅治愈了身体的疲倦，更填补了新手爸爸内心的空虚。</p>
            <</if>>

            <div style="margin-top:15px; font-weight:bold; color:#be185d; font-size:0.9em;">
                  ⚡ 效果生效：展鹏下月体力上限将突破至 200！
            </div>
          </div>
          
          <<set $buff_zp_energy to true>>
          <<set $zp_exhaustion_streak to 0>>


      /* 🔥 剧情B：妻子的抚慰 (玩家爆种) */
      <<elseif $player_exhaustion_streak >= 3>>
      
          <h3 style="color:#be185d; margin-bottom:20px;">妻子的抚慰</h3>
          <div style="background:#fff0f5; padding:25px; border-radius:10px; border-left:5px solid #be185d; color:#831843; font-size:1.1em; line-height:1.8; max-width:500px;">
            
            <<if $zp_preg.state is 0 or $zp_preg.state is 3>>
                <p>通告、公关、营销……连续的高压工作让你回到家连手指都不想动。你瘫在沙发上闭目养神。</p>
                <p>“韩总，这就不行了？”一双修长的手搭上你的肩膀，力度适中地按揉着。展鹏贴在你耳边，朝着你的耳廓轻轻吹气，“去床上躺好，我来帮你‘恢复’一下。”</p>
                <p>平时懒散的妻子今晚十分勤劳，你终于可以好好歇歇了……不，好像比平时更累了！</p>
            
            <<elseif $zp_preg.state is 1>>
                <p>为了给未出世的孩子赚奶粉钱，你最近拼得太狠了。回到家时你差点靠在玄关睡着。</p>
                <p>挺着肚子的展鹏费力地把你扶到床上，心疼地摸着你的黑眼圈，嘴里还不依不饶：“韩总太没用了吧，怎么这就被榨干了？”</p>
                <p>他的行动已经有些笨拙了，慢慢解开你的衬衫扣子，跨坐在你腰上，小心避开肚子，低下头吻你：“今晚不准动，也不准拒绝我。”</p>

            <<elseif $zp_preg.state is 2>>
                <p>看着你为了照顾家里累得脸色苍白，正在哄孩子的展鹏突然把奶瓶一扔。</p>
                <p>“宝宝你自己玩会儿，妈妈要去救你爸爸了。”</p>
                <p>他把你拉进卧室，锁上门。虽然身体还没完全恢复，但他眼神里的欲望却丝毫未减：“韩证飞，你现在的样子太招人了……”</p>
            <</if>>

            <div style="margin-top:15px; font-weight:bold; color:#be185d; font-size:0.9em;">
                  ⚡ 效果生效：韩证飞下月体力上限将突破至 200！
            </div>
          </div>
          
          <<set $buff_player_energy to true>>
          <<set $player_exhaustion_streak to 0>>


      /* 🏡 剧情C：普通温馨日常 */
      <<else>>
      
          <h3 style="color:#475569; margin-bottom:30px;">家</h3>
          
          <<set _home_events to []>>
          <<set _scene_title to "温馨时刻">>

          <<if $zp_preg.state is 1>>
              <<set _scene_title to "🤰 孕期日常">>
              <<set _home_events to [
                "展鹏半夜突然摇醒你，红着眼睛说想吃城西那家倒闭了三年的酸辣粉，你哄了半天才把他哄睡着。",
                "你正在看剧本，展鹏抓着你的手放在他微微隆起的小腹上，一脸惊恐：它刚才是不是踢我了？",
                "展鹏站在镜子前比划了半天，郁闷地捏了捏自己的腰：完了，腹肌九九归一了，以后还能接到打戏吗？",
                "虽然平时很懒，但最近展鹏格外嗜睡。你回家时，发现他在沙发上睡得人事不省，嘴角还挂着一点晶莹的口水。",
                "展鹏因为腿抽筋疼醒了，你迷迷糊糊爬起来给他按摩，他哼哼唧唧地把头埋在你怀里撒娇。",
                "“你说孩子出来以后叫什么？”展鹏一边啃苹果一边问，“如果是男孩就叫展大鹏，女孩就叫展小鹏吧。”你果断驳回了这个取名方案。"
              ]>>
          <<elseif $zp_preg.state >= 2>>
              <<set _scene_title to "👨‍👩‍👧 甜蜜之家">>
              <<set _home_events to [
                "半夜孩子哇哇大哭，你和展鹏在被窝里装死。最后猜拳输了的他顶着鸡窝头爬起来：祖宗，这就来伺候您.……",
                "你回家看到温馨的一幕：展鹏在沙发上睡着了，宝宝趴在他胸口也睡着了，一大一小两张脸简直是一个模子里刻出来的。",
                "展鹏试图教宝宝叫“爸爸”，结果宝宝张口就是“妈妈”，气得展鹏捏了捏宝宝的脸：'小白眼狼，奶粉谁给你冲的？'",
                "家里到处都是婴儿用品，曾经的高冷影帝现在熟练地单手换尿布，另一只手还能腾出来接你的电话。",
                "终于把小祖宗哄睡着了。展鹏长出一口气，把你拉到阳台上，从身后轻轻环住你的腰，声音有点哑：终于轮到我了。",
                "展鹏看着熟睡的宝宝，突然吃醋地戳了戳你的脸：“以前你回家第一件事是亲我，现在全是看她。”你笑着亲了他一口安抚这只大醋坛子。",
                "你正在给孩子洗衣服，展鹏突然从背后抱过来，下巴搁在你肩膀上蹭来蹭去，手也不安分地伸进衣摆：“别洗了，陪我躺会儿嘛……”",
                "半夜醒来，发现孩子睡得很沉。展鹏悄悄在被窝里握住你的手，十指相扣，温热的呼吸洒在你耳边。"
              ]>>
          <<else>>
              <<set _home_events to [
                "回到家，展鹏正瘫在沙发上打游戏，看见你回来，自然地把脚丫伸到了你的膝盖上求按摩。",
                "展鹏今天难得亲自下厨，虽然味道有点一言难尽，但看着他期待的眼神，你还是吃光了。",
                "你刚进门就被展鹏抱住了腰，他迷迷糊糊地蹭了蹭你的颈窝，老公，不想努力了，你养我好不好……",
                "展鹏正在阳台上收衣服，动作敏捷得不像个咸鱼，但看到你后立刻捂着腰装作闪到了。",
                "今晚他早早关上了灯，把你拉进了温暖的被窝。",
                "你在书房处理文件，展鹏端着一杯热牛奶进来，顺便赖在你怀里不肯走了。",
                "展鹏洗完澡出来，发梢还在滴水。他懒得吹头发，把吹风机塞到了你手里。",
                "半夜醒来，发现展鹏正警惕地看着窗外，发现是你醒了，他立刻变回睡眼惺忪的样子钻进你怀里。",
                "周末的早晨，展鹏像只八爪鱼一样缠在你身上，嘟囔着再睡五分钟，结果一睡就是两小时。"
              ]>>
          <</if>>
          
          <<set _story to _home_events.random()>>
          
          <h4 style="color:#d97706; margin-top:0;">_scene_title</h4>
          <div style="background:#f8fafc; padding:25px; border-radius:10px; border-left:5px solid #f59e0b; 
                      color:#334155; font-size:1.1em; line-height:1.8; max-width:500px; box-shadow:0 4px 6px rgba(0,0,0,0.05);">
            "_story"
          </div>
      <</if>>


  /* =================================================================
     PART 2: 裂痕与孤独 (Month >= 25)
     当绯闻开始后，家就不再是避风港了
     ================================================================= */
  <<else>>
  
      /* --- 阶段A: 冷战期 (Month 25-30) --- */
      /* 还没离婚，但关系已经降至冰点 */
      <<if $zp_story_stage is 0 or $zp_story_stage is 1>>
          <h3 style="color:#64748b; margin-bottom:30px;">冰冷的家</h3>
          <<set _cold_events to [
              "餐桌上放着你做的菜，已经凉透了。展鹏发来短信：'今晚有局，不回。'",
              "半夜，你听到阳台上传来打火机的声音。展鹏站在黑暗里抽烟，背影看起来很孤独，但你走近时，他又挂上了那副玩世不恭的面具。",
              "展鹏的手机响了，屏幕上闪烁着'方末'的名字。他看了你一眼，拿着手机去了阳台。"
          ]>>
          <<set _story to _cold_events.random()>>
          <div style="background:#f1f5f9; padding:25px; border-radius:10px; border-left:5px solid #94a3b8; color:#475569; font-size:1.1em; line-height:1.8; max-width:500px;">
             "_story"
          </div>

      /* --- 阶段B: 离异独居期 (Month >= 31) --- */
      /* 离婚了，家里只剩你一个人 */
      <<else>>
          <h3 style="color:#94a3b8; margin-bottom:30px;">独居</h3>
          <<set _alone_events to [
              "你下意识地买了两份早餐，看着空荡荡的对面，才想起来他已经走了。",
              "衣柜空了一半。那些花里胡哨的衬衫不见了，只剩下你的黑白灰西装。",
              "黄耀祖今天在公司学着展鹏的样子笑。很像，但你知道那不是他。",
              "电视里放着展鹏的新闻。他在帝国娱乐的发布会上笑得张扬跋扈，看起来过得很好。",
              "深夜，你看着手机里那个加密的号码，犹豫了很久，还是没有拨出去。",
              "下雨了。以前这时候，他总会赖在床上让你去收衣服。",
              "你在沙发缝隙里找到了一枚旧硬币，那是他以前用来变魔术逗你开心的道具。"
          ]>>
          <<set _story to _alone_events.random()>>
          <div style="background:#f8fafc; padding:25px; border-radius:10px; border-left:5px solid #cbd5e1; color:#64748b; font-size:1.1em; line-height:1.8; max-width:500px; font-style:italic;">
             "_story"
          </div>
      <</if>>

  <</if>>

  <div style="margin-top:50px;">
    /* 🔴 关键链接：去下个月结算（不再回路由器了，因为是从路由器进来的） */
    <<link "💤 关灯睡觉 (进入月结)">>
        <<goto "Next_Month">>
    <</link>>
  </div>

</div>
<</nobr>>`
});
