/* ===========================================================================
   ⑩ 营销：粉丝 / 热搜 / 公关
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

/* ---------- 故事块：Fan_Action ---------- */
window.__STORY_PASSAGES.push({
  name: "Fan_Action",
  src: `<<nobr>>
<div class="tech-card">
  <div class="header-banner">
    <span>📊 营销执行报告</span>
  </div>
  
  <div style="padding: 20px;">
    
    /* =========================================
       0. 安全检查
       ========================================= */
    <<if not $current_actor or not $actors[$current_actor]>>
        <div style="padding:20px; border:1px solid red; background:#300; color:#fff;">
            ❌ <b>系统错误：</b> 找不到艺人数据。<br>
            当前艺人ID: <<print $current_actor>><br><br>
            [[🔙 返回|Fan_Management]]
        </div>
    <<else>>
        /* 0.5 行动点检查 */
        <<if ($action_points || 0) <= 0>>
            <div style="padding:20px; border:1px solid #fdba74; background:#fff7ed; color:#c2410c; text-align:center;">
                🎯 <b>本月行动点用完了</b><br>
                <span style="font-size:0.9em; opacity:.85;">粉丝运营每次要花 1 点，下个月恢复 8 点。</span><br><br>
                [[🔙 返回粉丝管理|Fan_Management]]
            </div>
        /* 1. 检查资金 */
        <<elseif $money < $cost>>
            <div style="padding:20px; border:1px solid red; background:#300; color:#fff;">
                ❌ <b>资金不足！</b><br>公司账面没钱了。<br><br>
                [[🔙 返回|Fan_Management]]
            </div>
        /* 2. 检查流量 (脂粉除外) */
        <<elseif $action neq "guide_war" and $action neq "guide_war_x10" and $traffic < $cost_traffic>>
            <div style="padding:20px; border:1px solid #2563eb; background:#eff6ff; color:#1e40af;">
                📉 <b>流量不足！</b><br>
                当前流量: <<print $traffic>><br>
                需要流量: <<print $cost_traffic>><br><br>
                <span style="font-size:0.9em;">"老板，没有数据支持，这通稿发出去也没人看啊！"</span><br><br>
                [[🛒 去买流量|Public_Relations]] | [[🔙 返回|Fan_Management]]
            </div>
        <<else>>
            /* 执行扣除 */
            <<set $money -= $cost>>
            <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
            <<if $action neq "guide_war" and $action neq "guide_war_x10">>
                <<set $traffic -= $cost_traffic>>
            <</if>>
            
            <<set _a to $actors[$current_actor]>>
            
            /* --- 分支逻辑 --- */
            
            /* 1. 发福利图 */
            <<if $action is "visual">>
                <h3>📸 <b>官方营业</b></h3>
                <p>消耗了资源位推广高清神图。</p>
                <<set _a.fans.face += 800>>
                <<set _a.fans.career += 50>>
                <<set _a.fans.toxic = Math.max(0, _a.fans.toxic - 50)>> 
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 颜粉 +800</span> | 
                    <span style="color:green;">📈 事业粉 +50</span> | 
                    <span style="color:red;">📉 毒唯 -50</span> | 
                    <span style="color:#2563eb;">📉 流量 -2000</span>
                </div>
            
            /* 2. 卖惨虐粉 */
            <<elseif $action is "miserable">>
                <h3>😭 <b>虐粉营销</b></h3>
                <p>买通了营销号大肆扩散生病通稿。</p>
                <<set _a.fans.mom += 800>>
                <<set _a.fans.toxic += 200>>
                <<set _a.fans.clown += 1000>>
                <<set _a.reputation -= 5>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 妈粉 +800</span> | 
                    <span style="color:green;">📈 毒唯 +200</span> | 
                    <span style="color:green;">📈 乐子人 +1000</span> | 
                    <span style="color:#2563eb;">📉 流量 -3000</span> | 
                    <span style="color:red;">📉 口碑 -5</span>
                </div>
            
            /* 3. 脂粉下场 (特殊：增加流量) */
            <<elseif $action is "guide_war">>
                <h3>☠️ <b>脂粉带节奏</b></h3>
                <p>"给我往死里撕！"<br>
                职业黑粉入场，掀起了一场腥风血雨。</p>
                <<set _a.fans.toxic += 500>>
                <<set _a.fans.clown += 1000>>
                <<set $traffic += 3000>> /* 增加流量 */
                <<set _a.reputation -= 5>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 毒唯 +500</span> | 
                    <span style="color:green;">⬆️ 流量 +3000</span>
                    <br>
                    <span style="color:green;">📈 乐子人 +1000</span> | 
                    <span style="color:red;">📉 口碑 -5</span>
                </div>
            
            /* 4. 工业糖精 */
            <<elseif $action is "fake_cp">>
                <h3>🍬 <b>人工撒糖</b></h3>
                <p>全网铺设 CP 剪辑视频，按头嗑糖。</p>
                <<set _a.fans.cp += 1200>>
                <<set _a.fans.toxic = Math.max(0, _a.fans.toxic - 300)>>
                <<set _a.fans.mom = Math.max(0, _a.fans.mom - 100)>>
                <<set _a.reputation -= 5>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 <<if $current_actor is "huang" or $current_actor is "new_boy">>嬷嬷粉<<else>>CP粉<</if>> +1200</span> | 
                    <span style="color:red;">📉 毒唯 -300</span> | 
                    <span style="color:red;">📉 妈粉 -100</span> | 
                    <span style="color:#2563eb;">📉 流量 -5000</span> | 
                    <span style="color:red;">📉 口碑 -5</span>
                </div>
            
            /* 5. 发福利图×10 */
            <<elseif $action is "visual_x10">>
                <h3>📸 <b>官方营业（大规模）</b></h3>
                <p>大规模投放推广美图，短时间内刷屏各大平台，病毒式营销引起了一部分路人和粉丝的反感。</p>
                <<set _a.fans.face += 7000>>
                <<set _a.fans.career += 500>>
                <<set _a.fans.toxic = Math.max(0, _a.fans.toxic - 100)>>
                <<set _a.reputation -= 10>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 颜粉 +7000</span> | 
                    <span style="color:green;">📈 事业粉 +500</span> | 
                    <span style="color:red;">📉 毒唯 -100</span> | 
                    <span style="color:#2563eb;">📉 流量 -20000</span> | 
                    <span style="color:red;">📉 口碑 -10</span>
                </div>
            
            /* 6. 卖惨虐粉×10 */
            <<elseif $action is "miserable_x10">>
                <h3>😭 <b>虐粉营销（大规模）</b></h3>
                <p>全网铺天盖地的卖惨通稿，引起广泛讨论，大量粉丝被虐粉提纯成毒唯，引起了路人反感。</p>
                <<set _a.fans.mom += 6000>>
                <<set _a.fans.toxic += 3000>>
                <<set _a.reputation -= 15>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 妈粉 +6000</span> | 
                    <span style="color:green;">📈 毒唯 +3000</span> | 
                    <span style="color:#2563eb;">📉 流量 -30000</span> | 
                    <span style="color:red;">📉 口碑 -15</span>
                </div>
            
            /* 7. 工业糖精×10 */
            <<elseif $action is "fake_cp_x10">>
                <h3>🍬 <b>人工撒糖（大规模）</b></h3>
                <p>全网大量投放CP内容，强制按头嗑糖，cp粉涌入直呼天生一对，但引起大量唯粉不满。</p>
                <<set _a.fans.cp += 20000>>
                <<set _a.fans.toxic = Math.max(0, _a.fans.toxic - 3000)>>
                <<set _a.fans.mom = Math.max(0, _a.fans.mom - 1000)>>
                <<set _a.reputation -= 10>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 <<if $current_actor is "huang" or $current_actor is "new_boy">>嬷嬷粉<<else>>CP粉<</if>> +20000</span> | 
                    <span style="color:red;">📉 毒唯 -3000</span> | 
                    <span style="color:red;">📉 妈粉 -1000</span> | 
                    <span style="color:#2563eb;">📉 流量 -50000</span> | 
                    <span style="color:red;">📉 口碑 -10</span>
                </div>
            
            /* 8. 脂粉下场×10 (特殊：增加流量) */
            <<elseif $action is "guide_war_x10">>
                <h3>☠️ <b>脂粉带节奏（大规模）</b></h3>
                <p>"全网联动，给我往死里撕！"<br>
                职业水军大规模下场，掀起全网腥风血雨，与对家撕成一片，毒唯表示就是这个战斗爽。</p>
                <<set _a.fans.toxic += 5000>>
                <<set _a.fans.clown += 10000>>
                <<set $traffic += 30000>> /* 增加流量 */
                <<set _a.reputation -= 20>>
                <div style="margin-top:10px;">
                    <span style="color:green;">📈 毒唯 +5000</span> | 
                    <span style="color:green;">⬆️ 流量 +30000</span>
                    <br>
                    <span style="color:green;">📈 乐子人 +10000</span> | 
                    <span style="color:red;">📉 口碑 -10</span>
                </div>
            <</if>>
            
            /* ===== 粉丝反应：评论区里的人在说什么（纯氛围，不改数值） ===== */
            <<print WYFanReact.block($current_actor, $action)>>

            <hr>
            <div style="text-align:center; margin-top:20px;">
                [[✅ 效果确认|Fan_Management]]
            </div>
        <</if>>
    <</if>>
  </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Fan_Management ---------- */
window.__STORY_PASSAGES.push({
  name: "Fan_Management",
  src: `<<nobr>>

/* =========================================
   1. 逻辑控制中心：自动纠错与默认值
   (进页面瞬间执行，决定默认显示谁)
   ========================================= */

/* 🟢 第一阶段：展鹏还在 (Stage < 2) */
<<if $zp_story_stage < 2>>
    /* 如果没选人，或者选了后期才会出现的人，强制归位到展鹏 */
    <<if not def $current_actor or $current_actor is "huang" or $current_actor is "liu">>
        <<set $current_actor to "zp">>
    <</if>>

/* 🔴 第二阶段：展鹏已走 (Stage >= 2) */
<<else>>
    /* 如果变量还停留在展鹏，或者没选人，强制切换为黄耀祖 */
    <<if not def $current_actor or $current_actor is "zp">>
        <<set $current_actor to "huang">>
    <</if>>
<</if>>

/* =========================================
   2. 界面渲染
   ========================================= */

<div class="tech-card">
  
  <div class="header-banner" style="background: linear-gradient(to right, #be185d, #db2777);">
    <span>📢 粉丝后援会总舵</span>
  </div>

  <div style="padding: 25px;">
    
    <div style="font-size:0.9em; color:#64748b; margin-bottom:10px;">请选择要管理的艺人：</div>
    
    <div class="tab-grid" style="display:flex; flex-wrap:wrap; gap:5px;">
    
      /* --- 按钮组：根据剧情阶段显示不同顺序 --- */

      /* A. 第一阶段顺序：展鹏 -> 秦飒 -> 白小纯 */
      <<if $zp_story_stage < 2>>
      
          /* 0. 展鹏 (C位) */
          <div class="tab-btn" style="flex:1;">
             <<link "展鹏 (ZP)">>
                <<set $current_actor to "zp">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.zp.name<</replace>>
             <</link>>
          </div>
          
          /* 1. 秦飒 */
          <div class="tab-btn" style="flex:1;">
             <<link "秦飒 (QS)">>
                <<set $current_actor to "qs">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.qs.name<</replace>>
             <</link>>
          </div>

          /* 2. 白小纯 */
          <div class="tab-btn" style="flex:1;">
             <<link "白小纯 (New)">>
                <<set $current_actor to "new">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.new.name<</replace>>
             <</link>>
          </div>

      /* B. 第二阶段顺序：黄耀祖 -> 刘梁周 -> 秦飒 -> 白小纯 */
      <<else>>
      
          /* 0. 黄耀祖 (新C位) */
          /* 这里的 ID 修正为 huang，对应你剧情里的变量 */
          <div class="tab-btn" style="flex:1; background:#e0f2fe; border-color:#7dd3fc;">
             <<link "黄耀祖">>
                <<set $current_actor to "huang">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.huang.name<</replace>>
             <</link>>
          </div>

          /* 1. 刘梁周 (如果已签约) */
          <<if $has_signed_liu is true>>
              <div class="tab-btn" style="flex:1; background:#f0fdf4; border-color:#86efac;">
                 <<link "刘梁周">>
                    <<set $current_actor to "liu">>
                    <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                    <<replace "#current-name">>$actors.liu.name<</replace>>
                 <</link>>
              </div>
          <</if>>

          /* 2. 秦飒 */
          <div class="tab-btn" style="flex:1;">
             <<link "秦飒">>
                <<set $current_actor to "qs">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.qs.name<</replace>>
             <</link>>
          </div>

          /* 3. 白小纯 */
          <div class="tab-btn" style="flex:1;">
             <<link "白小纯">>
                <<set $current_actor to "new">>
                <<replace "#fan-panel">><<include "Fan_Panel_Widget">><</replace>>
                <<replace "#current-name">>$actors.new.name<</replace>>
             <</link>>
          </div>
          
      <</if>>

    </div>

    /* 3. 数据显示面板 */
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #fff; margin-top:20px;">
       
       <div style="border-bottom:1px solid #f1f5f9; padding-bottom:10px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center;">
           <span style="font-weight:bold; color:#334155; font-size:1.1em;">
               📊 <span id="current-name"><<print $actors[$current_actor].name>></span> 数据监控
           </span>
       </div>

       /* 这里调用核心 Widget */
       <div id="fan-panel">
           <<include "Fan_Panel_Widget">>
       </div>
    </div>
    
    <div style="text-align:center; margin-top: 30px;">
      <<link "🔙 返回办公室">><<goto "Office">><</link>>
    </div>

  </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Fan_Panel_Widget ---------- */
window.__STORY_PASSAGES.push({
  name: "Fan_Panel_Widget",
  src: `<<nobr>>
<<set _a to $actors[$current_actor]>>
<<set _f to _a.fans>>

/* =========================================
   1. 标签与颜色配置
   ========================================= */

/* 默认值 */
<<set _L_career to "事业粉">><<set _C_career to "#7FA8DC">>
<<set _L_mom    to "妈粉">><<set _C_mom    to "#74C2A2">>
<<set _L_face   to "颜粉">><<set _C_face   to "#E8A0BE">>
<<set _L_clown  to "乐子人">><<set _C_clown  to "#EDC583">>
<<set _L_toxic  to "毒唯">><<set _C_toxic  to "#D98A9C">>
<<set _L_cp     to "CP粉">><<set _C_cp     to "#A99BE0">>
<<set _L_dream  to "梦女">><<set _C_dream  to "#E5A9C8">>

/* 定制修改 */
/* 🛠️ 2026-10-25 二次修正：妈粉就是「妈粉」，不再被嬷嬷粉顶掉；
   嬷嬷粉住进原来「CP 粉」那一栏（黄耀祖那批人只想让他当受，不嗑别人的 CP）。 */
<<if $current_actor is "huang" or $current_actor is "new_boy">>
    <<set _L_cp to "嬷嬷粉">>
    <<set _C_cp to "#A85B76">>
<</if>>

<<if $current_actor is "liu">>
    <<set _L_career to "艺术粉">>
<</if>>

/* =========================================
   2. 数据与样式计算 (安全模式)
   ========================================= */

/* 2.1 样式生成函数 - 提前生成style字符串，防止HTML解析错误 */
<<set _style_card_base to "display:flex; justify-content:space-between; align-items:center; background:#FAFCFF; padding:5px 8px; border-radius:4px; border-left:3px solid ">>

<<set _style_career to _style_card_base + _C_career>>
<<set _style_mom    to _style_card_base + _C_mom>>
<<set _style_face   to _style_card_base + _C_face>>
<<set _style_clown  to _style_card_base + _C_clown>>
<<set _style_toxic  to _style_card_base + _C_toxic>>
<<set _style_cp     to _style_card_base + _C_cp>>

/* 2.2 饼图计算 */
<<set _v_career to (_f.career || 0)>>
<<set _v_mom    to (_f.mom || 0)>>
<<set _v_face   to (_f.face || 0)>>
<<set _v_clown  to (_f.clown || 0)>>
<<set _v_toxic  to (_f.toxic || 0)>>
<<set _v_cp     to (_f.cp || 0)>>
<<set _v_dream  to (_f.dream || 0)>>
<<set _v_moe      to (_f.moe || 0)>>
<<set _v_passerby to (_f.passerby || 0)>>

/* 统一口径：9 类全算，避免新增类型时漏掉 */
<<set _total to FanSum(_a)>>
<<if _total < 1>><<set _total to 1>><</if>>
<<set _moe_pct to Math.round(_v_moe / _total * 100)>>

<<set _p1 to (_v_career / _total * 100)>>
<<set _p2 to _p1 + (_v_mom / _total * 100)>>
<<set _p3 to _p2 + (_v_face / _total * 100)>>
<<set _p4 to _p3 + (_v_clown / _total * 100)>>
<<set _p5 to _p4 + (_v_toxic / _total * 100)>>
<<set _p6 to _p5 + (_v_cp / _total * 100)>>
<<set _p7 to _p6 + (_v_dream / _total * 100)>>
<<set _p8 to _p7 + (_v_moe / _total * 100)>>

<<set _pie_style to "width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(" +
    _C_career + " 0% " + _p1 + "%," +
    _C_mom    + " " + _p1 + "% " + _p2 + "%," +
    _C_face   + " " + _p2 + "% " + _p3 + "%," +
    _C_clown  + " " + _p3 + "% " + _p4 + "%," +
    _C_toxic  + " " + _p4 + "% " + _p5 + "%," +
    _C_cp     + " " + _p5 + "% " + _p6 + "%," +
    _C_dream  + " " + _p6 + "% " + _p7 + "%," +
    "#9C7B32" + " " + _p7 + "% " + _p8 + "%," +
    "#93A2B8" + " " + _p8 + "% 100%); box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
>>

/* =========================================
   3. 界面显示
   ========================================= */

<div style="display:flex; align-items:flex-start; gap:20px; margin-bottom:20px;">
    
    /* 饼图 */
    <div style="flex-shrink:0; text-align:center;">
        <div @style="_pie_style"></div>
        <div style="margin-top:10px; font-weight:bold; color:#334155;">
            总粉丝: <span style="font-size:1.1em;"><<print FanSumCore(_a)>></span>
        </div>
        <div style="font-size:10.5px; color:#93A0B4; margin-top:2px;">不含路人</div>
    </div>

    /* 数据列表 (使用预生成的 style 变量) —— 每一行都能点进该群体的留言墙 */
    <div class="fan-grid" style="flex-grow:1; display:grid; grid-template-columns: 1fr 1fr; gap:8px; align-content: start;">
        <a class="fan-row" @style="_style_career" data-go="Fan_Wall" data-set='{"wall_fan":"career"}' title="看看事业粉在说什么">
            <span class="fan-name"><<print _L_career>></span>
            <span class="fan-val"><<print _v_career>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" @style="_style_mom" data-go="Fan_Wall" data-set='{"wall_fan":"mom"}' title="看看妈粉在说什么">
            <span class="fan-name"><<print _L_mom>></span>
            <span class="fan-val"><<print _v_mom>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" @style="_style_face" data-go="Fan_Wall" data-set='{"wall_fan":"face"}' title="看看颜粉在说什么">
            <span class="fan-name"><<print _L_face>></span>
            <span class="fan-val"><<print _v_face>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" @style="_style_clown" data-go="Fan_Wall" data-set='{"wall_fan":"clown"}' title="看看乐子人在说什么">
            <span class="fan-name"><<print _L_clown>></span>
            <span class="fan-val"><<print _v_clown>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" @style="_style_toxic" data-go="Fan_Wall" data-set='{"wall_fan":"toxic"}' title="看看毒唯在说什么">
            <span class="fan-name"><<print _L_toxic>></span>
            <span class="fan-val"><<print _v_toxic>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" @style="_style_cp" data-go="Fan_Wall" data-set='{"wall_fan":"cp"}' title="看看<<print _L_cp>>在说什么">
            <span class="fan-name"><<print _L_cp>></span>
            <span class="fan-val"><<print _v_cp>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" style="display:flex; justify-content:space-between; align-items:center; background:#FAFCFF; padding:5px 8px; border-radius:4px; border-left:3px solid #6E8FC4;"
           data-go="Fan_Wall" data-set='{"wall_fan":"dream"}' title="看看梦女在说什么">
            <span class="fan-name">梦女</span>
            <span class="fan-val"><<print _v_dream>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" style="display:flex; justify-content:space-between; align-items:center; background:#FAFCFF; padding:5px 8px; border-radius:4px; border-left:3px solid #9C7B32;"
           data-go="Fan_Wall" data-set='{"wall_fan":"moe"}' title="看看萌萌人在说什么">
            <span class="fan-name">萌萌人</span>
            <span class="fan-val"><<print _v_moe>><i class="fan-arrow">›</i></span>
        </a>
        <a class="fan-row" style="display:flex; justify-content:space-between; align-items:center; background:#FAFCFF; padding:5px 8px; border-radius:4px; border-left:3px solid #93A2B8;"
           data-go="Fan_Wall" data-set='{"wall_fan":"passerby"}' title="看看路人在说什么">
            <span class="fan-name">路人</span>
            <span class="fan-val"><i class="fan-arrow">›</i></span>
        </a>
    </div>
</div>

/* 点进去看留言的提示 */
<div class="fan-hint">点击任意一类，看看他们正在说什么 →</div>

<div style="background:linear-gradient(120deg,#F1F7FF,#FDFDFB); padding:10px; border-radius:12px; margin-bottom:20px; border:1px solid rgba(122,154,214,.14);">
    <div style="font-size:0.85em; font-weight:bold; color:#475569; margin-bottom:5px;">💬 粉丝正在热议...</div>
    <div style="font-size:0.85em; color:#334155; line-height:1.5;">
        <<silently>>
            /* 安全获取评论函数 */
            <<set _comment_text to "">>
            <<if def $comment_library>>
                <<if ($current_actor is "huang" or $current_actor is "new_boy") and def $comment_library["momo_huang"]>>
                     <<set _comment_tag to "[嬷嬷粉]">><<set _comment_color to "#be185d">>
                     <<set _comment_text to $comment_library["momo_huang"].random()>>
                <<elseif $current_actor is "zp" and def $comment_library["momo_zp"] and random(1,100) > 70>>
                     <<set _comment_tag to "[泥塑粉]">><<set _comment_color to "#be185d">>
                     <<set _comment_text to $comment_library["momo_zp"].random()>>
                <<elseif def $comment_library["career"]>>
                     <<set _comment_tag to "[事业粉]">><<set _comment_color to "#3b82f6">>
                     <<set _comment_text to $comment_library["career"].random()>>
                <<else>>
                     <<set _comment_text to "期待新作品！">>
                <</if>>
            <<else>>
                <<set _comment_text to "数据库连接中...">>
            <</if>>
        <</silently>>
        
        <span @style="'color:'+_comment_color+'; font-weight:bold;'">_comment_tag</span> 
        <<print _comment_text>>
    </div>
</div>

/* ===== 粉圈结构诊断（2026-10-27 新增）=====
   任意一类超过 40% 就标出来，超过 45% 会在月结里吃惩罚。
   ★ 惩罚内容只写在代码注释里（见 05_widgets.js 的 FAN_OVER），界面不展示，
     玩家只需要知道"这类人太多了、可以清理掉一些"。 */
<<set _over_keys to []>>
<<for _k range ["career", "face", "clown", "mom", "toxic", "cp", "dream", "moe", "passerby"]>>
    <<if FanPct(_a, _k) >= 40>><<run _over_keys.push(_k)>><</if>>
<</for>>

<div class="fan-diag">
  <div class="fd-head">
    <span>🩺 粉圈结构</span>
    <span class="fd-sub">某一类太多，可以清一清</span>
  </div>
  <<if _over_keys.length == 0>>
    <div class="fd-ok">目前九类粉丝还算均衡，没有哪一类独大。</div>
  <<else>>
    <<for _k range _over_keys>>
      <<capture _k>>
        <<set _band to FAN_OVER[_k]>>
        <<set _pct to FanPct(_a, _k)>>
        <div class="fd-row">
          <div class="fd-info">
            <b><<print _band.name>></b>
            <span class="fd-pct"><<print _pct>>%</span>
          </div>
          <<if ($action_points || 0) > 0 and $money >= 120>>
            <<link "🧹 清理" "Fan_Purge">>
              <<set $purge_key to _k>>
            <</link>>
          <<else>>
            <span class="fd-disabled">清理需 1 行动点 + 120 万</span>
          <</if>>
        </div>
      <</capture>>
    <</for>>
    <div class="fd-note">清理会让这一类立刻 −25%，其他类型各涨一点，但口碑 −8，且会招来“官方赶粉”的热搜。</div>
  <</if>>
</div>

/* ===== 粉丝运营：四张操作卡（逻辑完全沿用原来的 set 与跳转） ===== */
<<if ($action_points || 0) <= 0>>
<div style="background:#fff7ed; border:1px solid #fdba74; color:#c2410c; padding:14px 16px; border-radius:12px; margin-bottom:20px; text-align:center; font-size:.9rem;">
  🎯 本月行动点已经用完了，粉丝运营要等下个月。
</div>
<<else>>
<div class="fan-acts">

<div class="fan-act">
  <div class="fan-act-head">
    <span class="fan-act-name">📸 媚粉福利</span>
    <span class="fan-act-cost">15w · 2000 流</span>
  </div>
  <div class="fan-act-btns">
    <<link "发一组" "Fan_Action">>
      <<set $action to "visual", $cost to 15, $cost_traffic to 2000>>
    <</link>>
    <<link "×10 连发" "Fan_Action">>
      <<set $action to "visual_x10", $cost to 150, $cost_traffic to 20000>>
    <</link>>
  </div>
  <div class="fan-act-warn">⚠️ 短时间大量水军操作效果递减，且会引起路人反感</div>
</div>

<div class="fan-act">
  <div class="fan-act-head">
    <span class="fan-act-name">😭 卖惨虐粉</span>
    <span class="fan-act-cost">15w · 3000 流</span>
  </div>
  <div class="fan-act-btns">
    <<link "卖一波" "Fan_Action">>
      <<set $action to "miserable", $cost to 15, $cost_traffic to 3000>>
    <</link>>
    <<link "×10 扩散" "Fan_Action">>
      <<set $action to "miserable_x10", $cost to 150, $cost_traffic to 30000>>
    <</link>>
  </div>
  <div class="fan-act-warn">⚠️ 短时间大量水军操作效果递减，且会引起路人反感</div>
</div>

<div class="fan-act">
  <div class="fan-act-head">
    <span class="fan-act-name">🍬 工业糖精</span>
    <span class="fan-act-cost">20w · 5000 流</span>
  </div>
  <div class="fan-act-btns">
    <<link "炒一轮" "Fan_Action">>
      <<set $action to "fake_cp", $cost to 20, $cost_traffic to 5000>>
    <</link>>
    <<link "×10 加码" "Fan_Action">>
      <<set $action to "fake_cp_x10", $cost to 200, $cost_traffic to 50000>>
    <</link>>
  </div>
  <div class="fan-act-warn">⚠️ 短时间大量水军操作效果递减，且会引起路人反感</div>
</div>

<div class="fan-act">
  <div class="fan-act-head">
    <span class="fan-act-name">☠️ 脂粉下场</span>
    <span class="fan-act-cost">25w · 转 3000 流</span>
  </div>
  <div class="fan-act-btns">
    <<link "带一次节奏" "Fan_Action">>
      <<set $action to "guide_war", $cost to 25, $cost_traffic to 0>>
    <</link>>
    <<link "×10 猛攻" "Fan_Action">>
      <<set $action to "guide_war_x10", $cost to 250, $cost_traffic to 0>>
    <</link>>
  </div>
  <div class="fan-act-warn">⚠️ 短时间大量水军操作效果递减，且会引起路人反感</div>
</div>

<</if>>
</div>
<</nobr>>`
});

/* ---------- 故事块：HotSearch_Board ---------- */
window.__STORY_PASSAGES.push({
  name: "HotSearch_Board",
  src: `<<nobr>>

/* 🚨 1. 强制去除容器本身的所有内边距 */
<div class="tech-card" style="margin: 0 auto !important; padding: 0 !important; background: #f8fafc; overflow: hidden;">
  
  /* --- 2. 顶部导航栏 --- */
  <div style="background: #fff; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; position:sticky; top:0; z-index:10; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
    <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.4em; color:#f43f5e; font-weight:900; font-style:italic;">HOT🔥</span>
        <span style="font-weight:bold; color:#334155;">全网热搜</span>
    </div>
    <div style="text-align:right; font-size:0.8em; color:#64748b;">
        <div style="font-family:monospace; font-weight:bold; color:#475569;">💰$money | 🌊$traffic</div>
        <div style="color:#94a3b8; margin-top:2px;">公关次数: <b style="color:#f43f5e">$pr_action_count</b>/3</div>
    </div>
  </div>

  /* 🚨 3. 后台逻辑消音区 */
  <<silently>>
      <<if not def $hot_search_list or $hot_search_list.length == 0>>
          <<Generate_Monthly_HotSearch>>
      <</if>>
      /* 安全运行更新逻辑 */
      <<if def $Update_My_Company_Heat>>
          <<Update_My_Company_Heat>>
      <</if>>
  <</silently>>

  /* --- 4. 内容区域 --- */
  <div style="padding: 15px; min-height: 500px;">
    
    /* 价格小贴士 */
    <div style="text-align:center; font-size:0.75em; color:#94a3b8; margin-bottom:15px; background:rgba(255,255,255,0.5); padding:5px; border-radius:4px;">
       💡 公关部报价：每次操作需 <span style="color:#f43f5e; font-weight:bold;">100w 资金 + 1000 流量</span>
    </div>

    /* === 👑 榜首超级卡片 (NO.1) === */
    <<set _top to $hot_search_list[0]>>
    <div style="background: linear-gradient(135deg, #fff1f2 0%, #fff 100%); border-left: 5px solid #e11d48; border-radius: 8px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(225, 29, 72, 0.08); position:relative; overflow:hidden;">
        
        <div style="position:absolute; right:-20px; top:-20px; font-size:6em; opacity:0.05; color:#e11d48; font-weight:bold; pointer-events:none;">#1</div>

        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
             <span style="background:#e11d48; color:white; padding:2px 8px; border-radius:4px; font-size:0.8em; font-weight:bold;">NO.1 爆</span>
             <span style="color:#e11d48; font-weight:bold; font-family:monospace;">🔥 <<print _top.heat>></span>
        </div>

        <div style="font-size:1.3em; font-weight:900; color:#1e293b; line-height:1.4; margin-bottom:15px;">
            <<print _top.text>>
        </div>

        <div style="border-top: 1px dashed #fecdd3; padding-top: 15px;">
            <<if $is_top1_handled is true or _top.handled is true>>
                 <div style="background:rgba(255,255,255,0.6); color:#94a3b8; padding:8px; border-radius:6px; text-align:center; font-weight:bold; font-size:0.9em;">
                    ✅ 舆情已控制
                 </div>
            <<elseif $pr_action_count <= 0>>
                 <div style="background:#f1f5f9; color:#cbd5e1; padding:8px; border-radius:6px; text-align:center; font-size:0.9em;">
                    🚫 本月次数耗尽
                 </div>
            <<else>>
                 <<if _top.type is "my_bad">>
                    <<link "📉 100w | 紧急撤热搜" "PR_Execute">>
                        <<set $type to "lower_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                        <<set $hot_search_list[0].handled to true>>
                    <</link>>
                 <<elseif _top.type is "rival_bad">>
                    <<link "🔥 100w | 帮他对家买热搜" "PR_Execute">>
                        <<set $type to "raise_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                        <<set $hot_search_list[0].handled to true>>
                    <</link>>
                 <<elseif _top.type is "my_good">>
                    <<link "🔥 100w | 趁热打铁推广" "PR_Execute">>
                        <<set $type to "raise_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                        <<set $hot_search_list[0].handled to true>>
                    <</link>>
                 <<elseif _top.type is "rival_good">>
                    <<link "📉 100w | 压他热度" "PR_Execute">>
                        <<set $type to "lower_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                        <<set $hot_search_list[0].handled to true>>
                    <</link>>
                 <<else>>
                    <span style="color:#94a3b8; font-size:0.8em;">(无关社会新闻)</span>
                 <</if>>
            <</if>>
        </div>
    </div>


    /* === 📋 列表区域 (已修复文字按钮) === */
    <div style="background:white; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,0.03); overflow:hidden;">
        
        <<for _i to 1; _i < $hot_search_list.length; _i++>>
            <<set _item to $hot_search_list[_i]>>
            <<capture _i>>
            
            <div style="padding: 12px 15px; border-bottom: 1px solid #f1f5f9; display:flex; align-items:center; gap:12px;">
                
                <div style="width:20px; text-align:center; font-weight:900; font-size:1.1em; font-style:italic; color: <<if _i==1>>#f97316<<elseif _i==2>>#f59e0b<<else>>#cbd5e1<</if>>;">
                    <<print _i + 1>>
                </div>

                <div style="flex:1;">
                    <div style="color:#334155; font-weight:bold; margin-bottom:3px; font-size:0.9em;">
                        _item.text
                        <<if _i < 3>><span style="background:#fff7ed; color:#ea580c; font-size:0.6em; padding:0 3px; border-radius:2px; margin-left:4px;">HOT</span><</if>>
                    </div>
                    
                    <div style="display:flex; gap:6px; font-size:0.7em; align-items:center;">
                        <<if _item.type.includes("my_good")>>
                            <span style="background:#ecfdf5; color:#059669; padding:1px 5px; border-radius:3px;">我方正面</span>
                        <<elseif _item.type.includes("my_bad")>>
                            <span style="background:#fef2f2; color:#ef4444; padding:1px 5px; border-radius:3px;">⚠️ 我方负面</span>
                        <<elseif _item.type.includes("rival_good")>>
                            <span style="background:#fffbeb; color:#d97706; padding:1px 5px; border-radius:3px;">对手正面</span>
                        <<elseif _item.type.includes("rival_bad")>>
                            <span style="background:#eff6ff; color:#2563eb; padding:1px 5px; border-radius:3px;">对手黑料</span>
                        <<else>>
                             <span style="color:#cbd5e1;">社会</span>
                        <</if>>
                        <span style="color:#cbd5e1;">|</span>
                        <span style="color:#94a3b8;">🔥 _item.heat</span>
                    </div>
                </div>

                /* 🟢 修复点：加宽操作区，使用文字按钮 */
                <div style="width:100px; text-align:right;">
                    <<if _item.handled>>
                         <span style="color:#cbd5e1; font-size:0.7em;">已阅</span>
                    <<elseif $pr_action_count <= 0>>
                         <span style="color:#e2e8f0;">-</span>
                    <<else>>
                        <<if _item.type.includes("my_good") or _item.type.includes("rival_bad")>>
                             <<button "🔥升热搜">>
                                <<set $type to "raise_top1">><<set $cost to 60>><<set $cost_t to 1000>>
                                <<set $hot_search_list[_i].handled to true>>
                                <<goto "PR_Execute">>
                             <</button>>
                        <<elseif _item.type.includes("my_bad") or _item.type.includes("rival_good")>>
                             <<button "📉降热搜">>
                                <<set $type to "lower_top1">><<set $cost to 60>><<set $cost_t to 1000>>
                                <<set $hot_search_list[_i].handled to true>>
                                <<goto "PR_Execute">>
                             <</button>>
                        <</if>>
                    <</if>>
                </div>

            </div>
            <</capture>>
        <</for>>
    </div>
    
    <div style="position:sticky; bottom:0; padding:20px; text-align:center; margin-top:10px;">
        <<link "🔙 返回公关部" "Marketing_Center" class="btn-primary">><</link>>
    </div>

  </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Marketing_Battle ---------- */
window.__STORY_PASSAGES.push({
  name: "Marketing_Battle",
  src: `<<nobr>>
<style>
    /* 1. 基础动画 */
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes pulse-gold { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); } 70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }
    
    /* 2. 战报容器 */
    .battle-container {
        background-color: #f1f5f9;
        background-image: linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        border: 2px dashed #cbd5e1; border-radius: 16px;
        padding: 40px 30px; width: 100%; max-width: 800px;
        display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15); animation: slideUp 0.5s ease-out;
    }

    .battle-card { width: 100%; max-width: 650px; border-radius: 12px; padding: 25px; margin-top: 20px; position: relative; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); text-align: left; border: 1px solid rgba(255,255,255,0.8); }
    .rank-badge { position: absolute; top: 0; right: 0; padding: 5px 15px; border-bottom-left-radius: 12px; font-weight: 900; font-size: 1.2em; font-family: Impact, sans-serif; letter-spacing: 2px; }
    .result-icon { font-size: 4em; float: right; opacity: 0.2; margin-top: -10px; }
    .news-title { font-size: 1.4em; font-weight: bold; margin-bottom: 12px; display: block; }
    
    /* 🟢 强化后的正文字体：大号、加粗、不斜体 */
    .battle-card p { font-size: 1.15em; font-weight: bold; line-height: 1.6; margin: 10px 0; }
    .gossip-desc { font-size: 1.25em; font-weight: 900; color: #1e293b; margin-bottom: 15px; display: block; background: rgba(255,255,255,0.4); padding: 10px; border-radius: 4px; }

    .card-green { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-left: 8px solid #94a3b8; color: #475569; }
    .card-green .rank-badge { background: #cbd5e1; color: #64748b; }
    .card-blue { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 8px solid #3b82f6; color: #1e40af; }
    .card-blue .rank-badge { background: #3b82f6; color: white; }
    .card-red { background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-left: 8px solid #ef4444; color: #991b1b; }
    .card-red .rank-badge { background: #ef4444; color: white; }
    .card-gold { background: linear-gradient(135deg, #fffbeb 0%, #fff7ed 100%); border: 2px solid #f59e0b; color: #78350f; animation: pulse-gold 2s infinite; }
    .card-gold .rank-badge { background: linear-gradient(to right, #f59e0b, #b45309); color: #fff; }

    .reward-tag { background: #fff; border: 1px solid #e2e8f0; padding: 8px 15px; border-radius: 6px; font-weight: 900; font-size: 0.9em; display: inline-block; margin: 4px; color: #1e40af; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
</style>

<div class="tech-card" style="min-height:400px; display:flex; flex-direction:column; justify-content:center; align-items:center; background:none; box-shadow:none; border:none;">

/* --- 0. 变量抓取 --- */
<<set _act to $actors[$war_actor]>>
<<set _changeList to []>>

/* --- 1. 资源检查 --- */
<<if $money < $cost>>
    <div style="background:#fef2f2; border:2px solid #ef4444; color:#b91c1c; padding:40px; border-radius:12px; text-align:center;">
        <div style="font-size:3em;">💸</div><h3 style="margin-top:10px;">资金不足</h3><p>缺口: $cost 万</p>[[🔙 返回营销中心|Marketing_Center]]
    </div>
<<else>>
    /* 执行扣费 */
    <<set $money -= $cost>>
    <<if def $cost_t>><<set $traffic -= $cost_t>><</if>>

    <div class="battle-container">
        
        <div style="text-align:center; margin-bottom:20px; width:100%;">
            <div style="font-size:3em; margin-bottom:5px;">⚔️</div>
            <h3 style="margin:0; color:#334155; text-transform: uppercase; letter-spacing: 2px;">公关行动执行报告</h3>
            <div style="font-size:0.85em; color:#94a3b8; font-family: monospace;">SERIAL: PR-<<print random(1000,9999)>> / AGENT: <<print _act.name>></div>
        </div>

      /* === 1. 落井下石 (神鬼二象性逻辑升级) === */
        <<if $battle_type is "kick_rival">>
             <<set _roll to random(1, 100)>>
             
             <<if _roll <= 15>>
                /* SSS成功 */
                <div class="battle-card card-gold">
                    <div class="rank-badge">SSS</div><span class="result-icon">👑</span>
                    <span class="news-title">👑 神性爆发：铁锤定音</span>
                    <p>公关部精准预热，一记铁锤砸穿地心！全网流量如海啸般涌入我方账户，对家彻底哑火，甚至连澄清声明都不敢发。</p>
                    <<set $traffic += 5000>><<set $danger_level to Math.max(0, $danger_level - 10)>>
                    <<run _changeList.push("全局流量 +5000", "公司危险 -10")>>
                </div>
             
             <<elseif _roll <= 80>>
                /* A级成功 (16-80) */
                <div class="battle-card card-blue">
                    <div class="rank-badge">A</div><span class="result-icon">👟</span>
                    <span class="news-title">👊 趁乱补刀</span>
                    <p>趁着对家翻车，你指挥水军疯狂煽风点火。公关部这次表现稳健，成功劫持了对方的大量潜在流量，转化为公司关注度。</p>
                    <<set $traffic += 1000>><<set $danger_level to Math.max(0, $danger_level - 10)>>
                    <<run _changeList.push("全局流量 +1000", "公司危险 -10")>>
                </div>
             
             <<else>>
                /* B级翻车 (81-100) - 🔴【新增】弄巧成拙逻辑 */
                <div class="battle-card card-red">
                    <div class="rank-badge">FAIL</div><span class="result-icon">💩</span>
                    <span class="news-title">💥 弄巧成拙：水军翻车</span>
                    <p>公关部的操作太蠢太明显了！买的低级水军竟然在评论区发错文案，被对家反手一个“卖惨”公关。网友纷纷倒戈，开始心疼对家，并大骂我方艺人 <b><<print _act.name>></b> 吃血馒头！</p>
                    <<set _act.reputation to Math.max(0, _act.reputation - 5)>>
                    <<set $danger_level += 15>>
                    <<run _changeList.push(_act.name + " 口碑 -5", "公司危险 +15", "流量收益: 0")>>
                </div>
             <</if>>
             
             /* 行动结束重置热搜 */
             <<set $current_hot_topic to { text: "热搜利用完毕", type: "normal", target: "none" }>>

        /* === 2. 流量硬刚 (差异化文案) === */
        <<elseif $battle_type is "traffic">>
            <div class="battle-card card-blue">
                <div class="rank-badge">PVP</div><span class="result-icon">🌊</span>
                <span class="news-title">🌊 流量硬刚：资本对决</span>
                
                /* 🛠️ 修复：补充新人文案 */
                <<if $war_actor is "zp">>
                    <p>“展鹏，起床营业了！”在你的金钱攻势下，展鹏被迫营业，靠着一张“厌世咸鱼脸”硬生生杀出了一条血路。</p>
                <<elseif $war_actor is "qs">>
                    <p>“给老娘让开。”秦飒的红毯通稿铺天盖地，艳压群芳。营销号纷纷倒戈：“这才是内娱真正的女王。”</p>
                <<elseif $war_actor is "new">>
                    <p>“谁敢欺负我们乖崽！”白小纯楚楚可怜的照片一发，妈粉瞬间战斗力爆表，把广场洗得干干净净。</p>
                <<elseif $war_actor is "huang">>
                    <p>“这也太像了吧...” 黄耀祖的一组模仿照横空出世，瞬间引爆了对“替身文学”的讨论，黑红也是红！</p>
                <<elseif $war_actor is "liu">>
                    <p>刘梁周甩出了一组极具艺术感的概念大片，降维打击了所有流量明星。“这才是高级感。”</p>
                <</if>>
                
                <<set _act.reputation += 5>><<set $traffic += 500>>
                <<run _changeList.push(_act.name + " 口碑 +5", "全局流量 +500")>>
            </div>

        /* === 3. 独自美丽 (差异化文案) === */
        <<elseif $battle_type is "solo">>
            <div class="battle-card card-blue">
                <div class="rank-badge">SOLO</div><span class="result-icon">💔</span>
                <span class="news-title">💔 提纯行动：独美宣言</span>
                
                /* 🛠️ 修复：补充新人文案 */
                <<if $war_actor is "zp">>
                    <p>工作室发布声明：“已婚，勿扰。”虽然大家不知道他有什么作品，但“人夫感”拉满。乐子人狂喜。</p>
                    <<set _act.fans.clown += 200>><<set _act.fans.cp += 100>><<set _act.reputation -= 2>>
                    <<run _changeList.push(_act.name + " 口碑 -2", "乐子人粉 +200", "CP粉 +100")>>
                <<elseif $war_actor is "qs">>
                    <p>秦飒亲自下场回复：“男人只会影响我拔刀的速度。”全网疯转，毒唯直接高潮，大喊姐姐独美。</p>
                    <<set _act.fans.toxic += 300>><<set _act.reputation += 5>>
                    <<run _changeList.push(_act.name + " 口碑 +5", "毒唯粉 +300")>>
                <<elseif $war_actor is "new">>
                    <p>公司发布声明：“还是孩子，拒绝早恋谣言。”妈粉们松了一口气，纷纷表示要监督乖崽好好学习。</p>
                    <<set _act.fans.mom += 400>><<set _act.reputation += 2>>
                    <<run _changeList.push(_act.name + " 口碑 +2", "妈粉 +400")>>
                <<elseif $war_actor is "huang">>
                    <p>黄耀祖在采访中红着眼眶：“我不是谁的影子，我就是我。” 这一波虐粉操作非常成功。</p>
                    <<set _act.fans.mom += 300>><<set _act.reputation += 2>>
                    <<run _changeList.push(_act.name + " 口碑 +2", "妈粉 +300")>>
                <<elseif $war_actor is "liu">>
                    <p>刘梁周关闭了评论区，只发了一张风景照。高冷艺术家的姿态让粉丝更加疯狂迷恋。</p>
                    <<set _act.fans.career += 200>><<set _act.reputation += 5>>
                    <<run _changeList.push(_act.name + " 口碑 +5", "事业粉 +200")>>
                <</if>>
            </div>

        /* === 4. 捆绑炒作 (差异化文案) === */
        <<elseif $battle_type is "cp_bundle">>
            <div class="battle-card card-red">
                <div class="rank-badge">CP</div><span class="result-icon">🍬</span>
                <span class="news-title">❤️ 工业糖精：全网嗑糖</span>
                
                /* 🛠️ 修复：补充新人文案 */
                <<if $war_actor is "zp">>
                    <p>展鹏深夜为神秘女子买粥的照片曝光。虽然很假，但架不住他眼神实在太拉丝了。CP粉：“他超爱！”</p>
                    <<set _act.fans.cp += 800>><<run _changeList.push("CP粉 +800")>>
                <<elseif $war_actor is "qs">>
                    <p>秦飒和某顶流的红毯对视动图上了热搜。一种“恶女x忠犬”的张力拉满，路人嗑疯了。</p>
                    <<set _act.fans.cp += 600>><<run _changeList.push("CP粉 +600")>>
                <<elseif $war_actor is "new">>
                    <p>白小纯和前辈的“摸头杀”花絮流出。“姐弟恋”好香！妈粉虽然心情复杂，但全网热度暴涨。</p>
                    <<set _act.fans.cp += 500>><<run _changeList.push("CP粉 +500")>>
                <<elseif $war_actor is "huang">>
                    <p>黄耀祖和某位酷似秦飒的新人被拍到同框。“替身文学”照进现实，CP粉直呼带感！</p>
                    <<set _act.fans.cp += 700>><<run _changeList.push("CP粉 +700")>>
                <<elseif $war_actor is "liu">>
                    <p>刘梁周的镜头里永远只有那一个缪斯。这种隐晦的糖最致命，全网都在扒“那个人是谁”。</p>
                    <<set _act.fans.cp += 400>><<run _changeList.push("CP粉 +400")>>
                <</if>>
                
                <<set $danger_level += 10>><<run _changeList.push("公司危险值 +10")>>
            </div>

        /* === 5. 随机爆黑料 (炫酷吐槽版) === */
        <<elseif $battle_type is "gossip_attack">>
            <<if $gossips.length == 0>>
                 <div class="battle-card card-green" style="text-align:center;">
                    <div class="rank-badge">FAIL</div><span style="font-size:3em;">📭</span>
                    <p><b>尴尬了！一条料都没有！</b><br>公关部翻遍了保险柜，发现里面空空如也。</p>
                 </div>
            <<else>>
                 <<set _rnd_idx to random(0, $gossips.length - 1)>>
                 <<set _used_gossip to $gossips[_rnd_idx]>>
                 <<run $gossips.deleteAt(_rnd_idx)>>
                 <div style="background:#334155; color:#fff; padding:6px 15px; border-radius:4px; font-size:0.85em; margin-bottom:10px;">📡 DATA SENDING IN PROGRESS...</div>
                 
                 <<if _used_gossip.type is "green">>
                    <div class="battle-card card-green">
                        <div class="rank-badge">N</div><span class="result-icon">😓</span>
                        <span class="news-title">📉 拿错剧本了？</span>
                        <span class="gossip-desc">“_used_gossip.desc”</span>
                        <p>这种路边摊消息也能当武器？公关部是小学生吗！你看着这条不痛不痒的八卦，觉得公关部在浪费你的老婆本。</p>
                        <<set $danger_level to Math.max(0, $danger_level - 2)>><<set $traffic += 500>>
                        <<run _changeList.push("全局流量 +500", "公司危险 -2")>>
                    </div>
                 <<elseif _used_gossip.type is "blue">>
                    <div class="battle-card card-blue">
                        <div class="rank-badge">R</div><span class="result-icon">👊</span>
                        <span class="news-title">📊 有效打击</span>
                        <span class="gossip-desc">“_used_gossip.desc”</span>
                        <p>公关部表现还算正常。虽然不是惊天大瓜，但足以让对家头疼一阵子了。</p>
                        <<set $danger_level to Math.max(0, $danger_level - 5)>><<set $resources.c += 1>>
                        <<run _changeList.push("获得 C级资源 x1", "公司危险 -5")>>
                    </div>
                 <<elseif _used_gossip.type is "red">>
                     <div class="battle-card card-red">
                        <div class="rank-badge">SR</div><span class="result-icon">🔥</span>
                        <span class="news-title">💣 公关部杀疯了！</span>
                        <span class="gossip-desc">“_used_gossip.desc”</span>
                        <p>公关部终于睡醒了！这记重拳砸得对家眼冒金星，连夜发声明澄清，这波血赚。</p>
                        <<set $danger_level to Math.max(0, $danger_level - 10)>><<set $resources.b += 1>>
                        <<run _changeList.push("获得 B级资源 x1", "公司危险 -10")>>
                    </div>
                 <<elseif _used_gossip.type is "gold">>
                    <div class="battle-card card-gold">
                        <div class="rank-badge">SSR</div><span class="result-icon">👑</span>
                        <span class="news-title">⚡ 医学奇迹！</span>
                        <span class="gossip-desc">“_used_gossip.desc”</span>
                        <p>你不敢相信这是公关部那群人干出来的！核弹级机密，这波操作足以载入娱乐圈教科书！</p>
                        <<set $danger_level to Math.max(0, $danger_level - 20)>><<set $resources.a += 1>>
                        <<run _changeList.push("获得 A级资源 x1", "公司危险 -20")>>
                    </div>
                 <</if>>
            <</if>>
        <</if>>

        /* 🟢 底部加成明细区 */
        <div style="margin-top:25px; width:100%; max-width:650px; border-top:2px solid #cbd5e1; padding-top:20px;">
            <div style="font-size:0.9em; color:#64748b; margin-bottom:12px; font-weight:bold; display:flex; justify-content:space-between;">
                <span>📈 最终执行加成明细：</span>
                <span style="color:#1e40af;">执行人：公关部</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <<for _item range _changeList>>
                    <span class="reward-tag">_item</span>
                <</for>>
            </div>
        </div>

        <div style="margin-top:40px;">
            <<link "✅ 确认并签署报告" "Marketing_Center">><</link>>
        </div>
    </div>
<</if>>
</div>
<</nobr>>`
});

/* ---------- 故事块：Marketing_Center ---------- */
window.__STORY_PASSAGES.push({
  name: "Marketing_Center",
  src: `<<nobr>>
<div class="tech-card">
  /* 标题栏 */
  <div class="header-banner" style="background: linear-gradient(to right, #3730a3, #312e81);">
    <span>⚔️ 营销与公关部</span>
    <span style="font-size:0.8em;">资金: $money | 流量: $traffic</span>
  </div>

  <div style="padding:20px;">
    
    /* 🛠️ 核心修复：状态自动重置逻辑 */
    /* 逻辑 A：检测跨月 */
    /* 如果“上次处理的月份”不等于“当前月份”，说明是新的一月，强制解锁 */
    <<if $top1_solved_month isnot $month>>
        <<set $is_top1_handled to false>>
        <<if def $hot_search_list and $hot_search_list.length > 0>>
            <<set $hot_search_list[0].handled to false>>
        <</if>>
    <</if>>

    /* 逻辑 B：检测锁定 */
    /* 如果“上次处理的月份”等于“当前月份”，说明本月已操作过，强制锁定 */
    <<if $top1_solved_month is $month>>
        <<set $is_top1_handled to true>>
        <<if def $hot_search_list and $hot_search_list.length > 0>>
            <<set $hot_search_list[0].handled to true>>
        <</if>>
    <</if>>

    /* 列表生成逻辑 */
    <<if not def $hot_search_list or $hot_search_list.length == 0>>
        <<Generate_Monthly_HotSearch>>
    <</if>>
    
    <<set _top_news to $hot_search_list[0]>>

    /* === 公益锁定检查 === */
    <<if $charity_done is true>>
         <div style="background:#f0fdf4; border:2px solid #22c55e; padding:30px; text-align:center; border-radius:8px;">
            <div style="font-size:4em; margin-bottom:15px;">💖</div>
            <h3 style="color:#15803d;">本月公益目标已达成</h3>
            <p style="color:#166534;">公司本月已进行过大额捐赠，公关部暂停一切营销活动。</p>
            <div style="font-size:0.9em; color:#86efac; margin-top:10px;">( 下个月恢复功能 )</div>
         </div>
        <div style="margin-top:30px; text-align:center;">[[🔙 返回办公室|Office]]</div>

    <<else>>
    
     /* --- 0. 📡 实时热点监控 (NO.1 Boss) --- */
        <div style="background:#0f172a; color:#fff; padding:15px; border-radius:8px; margin-bottom:20px; border:1px solid #334155; box-shadow:0 4px 10px rgba(0,0,0,0.2);">
            
            <div style="font-size:0.8em; color:#94a3b8; margin-bottom:5px; display:flex; justify-content:space-between;">
                <span>📡 实时热点监控 (NO.1)</span>
                <<link "🔥 查看完整榜单 >" "HotSearch_Board">><</link>>
            </div>
            
            <div style="font-size:1.2em; font-weight:bold; letter-spacing:1px; display:flex; justify-content:space-between; align-items:center;">
                <span>🔥 <<print _top_news.text>></span>
                <span style="background:#b91c1c; color:#fff; font-size:0.6em; padding:2px 6px; border-radius:4px;">爆</span>
            </div>
            
            <div style="margin-top:10px; border-top:1px dashed #334155; padding-top:10px; font-size:0.9em;">
                
                /* 🔒 判定区：检查时间戳锁 或 全局锁 */
                <<if $is_top1_handled is true>>
                    
                    /* === 状态 A：已操作 (锁定) === */
                    <div style="background:rgba(255,255,255,0.1); padding:15px; border-radius:6px; text-align:center; display:flex; flex-direction:column; gap:5px; border:1px solid #475569;">
                        <span style="font-size:1.5em;">✅</span>
                        <span style="color:#94a3b8; font-weight:bold; font-size:1.1em;">本月榜首舆情已处理</span>
                        <span style="color:#64748b; font-size:0.8em;">( 正在执行公关方案... )</span>
                    </div>

                <<else>>
                    /* === 状态 B：未操作 (显示按钮) === */
                    /* 点击时打上“本月已办”的时间戳 */

                    /* Case: 我方负面 -> 降热度 */
                    <<if _top_news.type is "my_bad">>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#fca5a5;">⚠️ 警报：舆论发酵，需重金压制！</span>
                            <<button "📉 紧急降温 (100w)">>
                                <<set $top1_solved_month to $month>> /* 打时间戳 */
                                <<set $is_top1_handled to true>>
                                <<set $type to "lower_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                                <<goto "PR_Execute">>
                            <</button>>
                        </div>

                    /* Case: 对手负面 -> 落井下石 */
                    <<elseif _top_news.type is "rival_bad">>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#86efac;">✨ 机会：对手翻车，全力进攻？</span>
                            <<button "👊 全力进攻 (100w)">>
                                <<set $top1_solved_month to $month>> /* 打时间戳 */
                                <<set $is_top1_handled to true>>
                                <<set $type to "raise_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                                <<goto "PR_Execute">>
                            <</button>>
                        </div>
                  
                    /* Case: 我方正面 -> 趁热打铁 */
                    <<elseif _top_news.type is "my_good">>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#fbbf24;">📈 利好：正面热搜，全网推广？</span>
                            <<button "🔥 全网推广 (100w)">>
                                 <<set $top1_solved_month to $month>> /* 打时间戳 */
                                 <<set $is_top1_handled to true>>
                                 <<set $type to "raise_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                                 <<goto "PR_Execute">>
                            <</button>>
                        </div>
                    
                    /* Case: 对手正面 -> 打压 */
                    <<elseif _top_news.type is "rival_good">>
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <span style="color:#fbbf24;">⚔️ 竞争：对手起势，重金打压？</span>
                            <<button "📉 重金打压 (100w)">>
                                 <<set $top1_solved_month to $month>> /* 打时间戳 */
                                 <<set $is_top1_handled to true>>
                                 <<set $type to "lower_top1">><<set $cost to 100>><<set $cost_t to 3000>>
                                 <<goto "PR_Execute">>
                            <</button>>
                        </div>

                    /* Case: 路人 */
                    <<else>>
                        <span style="color:#94a3b8;">当前榜首为社会新闻，无特殊风险。</span>
                    <</if>>
                <</if>>
            </div>
        </div>

        /* --- 📺 在播作品营销（2026-10-27 新增） ---
           作品播出当月与次月可以在这里花钱营销，每次消耗 1 次公关机会。 */
        <<if not def $film_lib>><<set $film_lib to []>>><</if>>
        <<set _live_n to 0>>
        <<for _lf0 range $film_lib>>
            <<if _lf0.status is "airing">><<set _live_n += 1>><</if>>
        <</for>>
        <<if _live_n > 0>>
        <div class="actor-mini-card pr-live" style="border-left:4px solid #B4657F; margin-bottom:20px;">
          <div class="pr-live-h">
            <b>📺 在播作品</b>
            <span>播出期营销 · 公关次数 <<print $pr_action_count>>/3</span>
          </div>
          <<for _li to 0; _li < $film_lib.length; _li++>>
            <<set _lf1 to $film_lib[_li]>>
            <<if _lf1.status is "airing">>
              <div class="pr-live-row">
                <div class="pr-live-main">
                  <div class="pr-live-name">
                    <<print _lf1.name>>
                    <span class="fl-tag lv-<<print _lf1.res>>"><<print _lf1.res.toUpperCase()>></span>
                    <<if _lf1.hit>><span class="fl-tag hit">🔥 爆</span><</if>>
                  </div>
                  <div class="pr-live-meta">
                    <<print _lf1.actor_name>> · 评分 <b class="<<print FilmSc(_lf1.score)>>"><<print _lf1.score>></b>
                    · 播到第 <<print (_lf1.air + 1)>> 月
                  </div>
                </div>
                <<if _lf1.live_m is $month>>
                  <span class="pr-live-done">本月已营销</span>
                <<else>>
                  <<link "去营销">><<set $live_film to _li>><<goto "Film_Live">><</link>>
                <</if>>
              </div>
            <</if>>
          <</for>>
        </div>
        <</if>>

        /* --- 1. 流量加油站 --- */
        <div style="background: linear-gradient(to right, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; padding: 15px; border-radius: 8px; margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
             <div>
                <div style="font-weight:bold; color:#1e40af; font-size:1.1em;">🌊 流量加油站</div>
                <div style="font-size:0.8em; color:#60a5fa;">当前流量库存: <b>$traffic</b></div>
             </div>
             <<link "🛒 购买水军" "Public_Relations">><</link>>
        </div>

        /* --- 2. 危机公关台 --- */
        <div class="actor-mini-card" style="border-left:4px solid #ef4444; margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b>🚑 危机公关台 (特殊手段)</b>
            <span style="font-size:0.9em;">危险值: <<if $danger_level > 50>><b style="color:red">$danger_level</b><<else>><b style="color:green">$danger_level</b><</if>></span>
          </div>
          <div class="pr-acts pr-acts-2">
            <div class="pr-act">
              <<link "⚖️ 律师函" "PR_Execute">><<set $type to "lawyer", $cost to 5, $cost_t to 500>><</link>>
              <span class="pr-act-cost">5w · 500 流</span>
              <span class="pr-act-tag">危险 −2</span>
            </div>
            <div class="pr-act">
              <<link "🌪️ 祸水东引" "PR_Execute">><<set $type to "divert", $cost to 10, $cost_t to 2000>><</link>>
              <span class="pr-act-cost">10w · 2k 流</span>
              <span class="pr-act-tag">危险 −10</span>
            </div>
            <div class="pr-act">
              <<link "🌊 全网洗地" "PR_Execute">><<set $type to "water", $cost to 25, $cost_t to 5000>><</link>>
              <span class="pr-act-cost">25w · 5k 流</span>
              <span class="pr-act-tag good">危险 −30</span>
            </div>
            <div class="pr-act">
              <<link "📹 直播澄清" "PR_Execute">><<set $type to "live_apology", $cost to 0, $cost_t to 3000>><</link>>
              <span class="pr-act-cost">0w · 3k 流</span>
              <span class="pr-act-tag warn">高风险</span>
            </div>
          </div>
        </div>

        /* --- 3. 营销战争 --- */
        <div class="actor-mini-card" style="border-left:4px solid #3b82f6;">
          <div style="margin-bottom:10px; font-weight:bold; color:#1e40af;">⚔️ 主动出击 <span style="font-size:0.8em; font-weight:normal; color:#64748b;">(请先点击选择出战艺人)</span></div>
          <div id="war-actor-selector" style="background:#f1f5f9; padding:10px; border-radius:6px; margin-bottom:15px; display:flex; gap:10px; flex-wrap:wrap;">
             
             /* 🛠️ 修复开始：动态生成出战名单 */
             <<if $has_signed_huang is true>>
                 /* --- 阶段二：黄耀祖带队 --- */
                 /* 如果当前没有选人，或者选了已离开的展鹏，默认重置为黄耀祖 */
                 <<if not def $war_actor or $war_actor is "zp">>
                    <<set $war_actor to "huang">>
                 <</if>>
                 
                 <label><<radiobutton "$war_actor" "huang" checked>> 黄耀祖</label>
                 
                 <<if $has_signed_liu is true>>
                    <label><<radiobutton "$war_actor" "liu">> 刘梁周</label>
                 <</if>>
                 
                 <label><<radiobutton "$war_actor" "qs">> 秦飒</label>
                 <label><<radiobutton "$war_actor" "new">> 白小纯</label>

             <<else>>
                 /* --- 阶段一：展鹏带队 --- */
                 <<if not def $war_actor>>
                    <<set $war_actor to "zp">>
                 <</if>>
                 
                 <label><<radiobutton "$war_actor" "zp" checked>> 展鹏</label>
                 <label><<radiobutton "$war_actor" "qs">> 秦飒</label>
                 <label><<radiobutton "$war_actor" "new">> 白小纯</label>
             <</if>>
             /* 🛠️ 修复结束 */
             
          </div>
          <hr>
          <div class="pr-label">VS 同性竞品</div>
          <div class="pr-acts pr-acts-2">
            <div class="pr-act">
              <<link "👊 流量硬刚" "Marketing_Battle">>
                  <<set $battle_type to "traffic", $cost to 25, $cost_t to 5000, $cost_s to 0>>
              <</link>>
              <span class="pr-act-cost">25w · 5k 流</span>
            </div>
            <<if $gossips.length > 0>>
            <div class="pr-act">
              <<link "💣 爆黑料" "Marketing_Battle">>
                  <<set $battle_type to "gossip_attack", $cost to 0, $cost_t to 2000, $cost_s to 20>>
              <</link>>
              <span class="pr-act-cost">2k 流 · 20 体力</span>
              <span class="pr-act-tag">消耗一条情报</span>
            </div>
            <<else>>
            <div class="pr-act is-out">
              <span class="pr-act-name">💣 爆黑料</span>
              <span class="pr-act-cost">库存暂无情报</span>
            </div>
            <</if>>
          </div>

          <div class="pr-label">VS 异性 / 合作</div>
          <div class="pr-acts pr-acts-2">
            <div class="pr-act">
              <<link "💔 独自美丽" "Marketing_Battle">>
                  <<set $battle_type to "solo", $cost to 25, $cost_t to 3000, $cost_s to 0>>
              <</link>>
              <span class="pr-act-cost">25w · 3k 流</span>
            </div>
            <div class="pr-act">
              <<link "❤️ 捆绑炒作" "Marketing_Battle">>
                  <<set $battle_type to "cp_bundle", $cost to 25, $cost_t to 3000, $cost_s to 0>>
              <</link>>
              <span class="pr-act-cost">25w · 3k 流</span>
            </div>
          </div>
        </div>

        /* --- 4. 公益慈善 --- */
        <div class="actor-mini-card" style="border-left:4px solid #10b981; margin-top:20px; background:#f0fdf4;">
          <b>💖 公益慈善</b> <span style="font-size:0.8em; color:#ef4444;">(每月限一次)</span>
          <div class="pr-acts pr-acts-3">
             <div class="pr-act">
               <<link "📦 物资捐赠" "PR_Execute">><<set $type to "charity", $cost to 60, $cost_t to 0>><</link>>
               <span class="pr-act-cost">60w</span>
             </div>
             <div class="pr-act">
               <<link "🏫 希望小学" "PR_Execute">><<set $type to "charity", $cost to 150, $cost_t to 0>><</link>>
               <span class="pr-act-cost">150w</span>
             </div>
             <div class="pr-act">
               <<link "🎗️ 成立基金会" "PR_Execute">><<set $type to "charity", $cost to 260, $cost_t to 0>><</link>>
               <span class="pr-act-cost">260w</span>
             </div>
          </div>
        </div>

        <div style="text-align:center; margin-top:20px;">[[🔙 返回办公室|Office]]</div>
    <</if>>
  </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：PR_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "PR_Execute",
  src: `<<nobr>>
<style>
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .pr-container {
        background-color: #f8fafc;
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
        background-size: 20px 20px;
        border: 2px dashed #94a3b8; border-radius: 16px; padding: 40px 30px;
        width: 100%; max-width: 800px; margin: 0 auto; 
        display: flex; flex-direction: column; align-items: center;
        box-shadow: 0 20px 50px rgba(0,0,0,0.15); animation: slideUp 0.5s ease-out;
    }
    .pr-card {
        width: 100%; max-width: 600px; border-radius: 12px; padding: 30px; margin-top: 20px;
        position: relative; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.15); 
        text-align: left; border: 1px solid rgba(255,255,255,0.8);
    }
    .pr-card .news-title { font-size: 1.6em; font-weight: 900; margin-bottom: 15px; display: block; font-family: "Microsoft YaHei", sans-serif; letter-spacing: 1px; }
    .pr-card p { font-size: 1.2em; font-weight: bold; line-height: 1.6; color: #334155; margin-bottom: 20px; }
    .rank-badge { position: absolute; top: 0; right: 0; padding: 8px 20px; border-bottom-left-radius: 12px; font-weight: 900; font-size: 1.4em; font-family: Impact, sans-serif; letter-spacing: 2px; box-shadow: -2px 2px 5px rgba(0,0,0,0.1); }
    .card-fail { background: linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%); border-left: 8px solid #64748b; color: #475569; } .card-fail .rank-badge { background: #64748b; color: #fff; }
    .card-standard { background: linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%); border-left: 8px solid #3b82f6; color: #1e40af; } .card-standard .rank-badge { background: #3b82f6; color: white; }
    .card-legend { background: linear-gradient(135deg, #ecfdf5 0%, #6ee7b7 100%); border: 2px solid #059669; color: #064e3b; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); } .card-legend .rank-badge { background: linear-gradient(to right, #10b981, #047857); color: #fff; }
    .card-mythic { background: linear-gradient(135deg, #fff1f2 0%, #fda4af 100%); border: 3px solid #be123c; color: #881337; box-shadow: 0 0 30px rgba(225, 29, 72, 0.4); } .card-mythic .rank-badge { background: linear-gradient(to right, #f43f5e, #be123c); color: #fff; padding: 10px 30px; font-size: 1.6em; }
    .result-icon { font-size: 4em; float: right; opacity: 0.15; margin-top: -20px; margin-right: -10px; }
    .reward-box { background: rgba(255,255,255,0.8); padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 1.1em; font-weight: 900; border-left: 5px solid rgba(0,0,0,0.2); font-style: normal; }
</style>

<div class="tech-card" style="min-height:500px; display:flex; flex-direction:column; justify-content:center; align-items:center; background:none; box-shadow:none; border:none; margin: 0 auto !important;">

/* --- 1. 资金与流量检查 --- */
<<if $money < $cost>>
    <div style="background:#fef2f2; border:2px solid #ef4444; color:#b91c1c; padding:40px; border-radius:12px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="font-size:4em; margin-bottom:15px;">💸</div>
        <h2 style="color:#ef4444; font-weight:900;">资金不足</h2>
        <p>需要 $cost 万 资金。</p>
        <br>[[🔙 返回|Marketing_Center]]
    </div>
<<elseif $cost_t > 0 and $traffic < $cost_t>>
    <div style="background:#eff6ff; border:2px solid #3b82f6; color:#1e40af; padding:40px; border-radius:12px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="font-size:4em; margin-bottom:15px;">📉</div>
        <h2 style="color:#2563eb; font-weight:900;">流量不足</h2>
        <p>需要 $cost_t 流量。</p>
        <br>[[🔙 返回|Marketing_Center]]
    </div>
    
/* --- 2. 执行逻辑 --- */
<<else>>
    /* 扣除资源 */
    <<set $money -= $cost>>
    <<if $cost_t > 0>><<set $traffic -= $cost_t>><</if>>

    /* 🔒 锁定机制 (榜首防刷) */
    <<if $type is "raise_top1" or $type is "lower_top1">>
        <<set $top1_solved_month to $month>>
        <<set $is_top1_handled to true>>
        <<set $hot_search_list[0].handled to true>>
    <</if>>

    <div class="pr-container">
        <div style="text-align:center; margin-bottom:20px;">
            <div style="font-size:3.5em; margin-bottom:5px;">📢</div>
            <h2 style="margin:0; color:#334155; text-transform: uppercase; letter-spacing: 2px; font-weight:900;">公关执行报告</h2>
        </div>

        /* === BOSS战：升热搜 === */
        <<if $type is "raise_top1">>
             <<set _roll to random(1, 100)>>
             <<if _roll <= 30>>
                <<set _card_class to "card-mythic">><<set _badge to "SSR">><<set _icon to "🚀">>
                <<set _title to "🔥 流量狂欢 (暴利)">>
                <<set _text to "你的营销策略引发了病毒式传播！服务器一度崩溃。">>
                <<set _gain_traffic to 15000>><<set _gain_danger to -20>>
             <<elseif _roll <= 80>>
                <<set _card_class to "card-legend">><<set _badge to "SR">><<set _icon to "📈">>
                <<set _title to "✨ 完美获利">>
                <<set _text to "水军、大V配合得天衣无缝，效果拔群。">>
                <<set _gain_traffic to 8000>><<set _gain_danger to -10>>
             <<else>>
                <<set _card_class to "card-fail">><<set _badge to "FAIL">><<set _icon to "🤡">>
                <<set _title to "📉 营销翻车">>
                <<set _text to "用力过猛了！全网都在嘲讽“吃相难看”。">>
                <<set _gain_traffic to -5000>><<set _gain_danger to 15>>
             <</if>>

        /* === BOSS战：降热搜 === */
        <<elseif $type is "lower_top1">>
             <<set _roll to random(1, 100)>>
             <<if _roll <= 30>>
                <<set _card_class to "card-mythic">><<set _badge to "SSR">><<set _icon to "👻">>
                <<set _title to "⚡ 资本“钞”能力">>
                <<set _text to "直接动用高层关系“拔网线”，热度瞬间归零。">>
                <<set _gain_traffic to 0>><<set _gain_danger to -40>>
             <<elseif _roll <= 80>>
                <<set _card_class to "card-legend">><<set _badge to "SR">><<set _icon to "🤫">>
                <<set _title to "📉 有效降温">>
                <<set _text to "通过海量娱乐瓜分流，大众注意力成功转移。">>
                <<set _gain_traffic to 0>><<set _gain_danger to -15>>
             <<else>>
                <<set _card_class to "card-fail">><<set _badge to "FAIL">><<set _icon to "🤬">>
                <<set _title to "🔥 欲盖弥彰">>
                <<set _text to "撤榜行为被网友截图留证，引发报复性传播！">>
                <<set _gain_traffic to 0>><<set _gain_danger to 20>>
             <</if>>
        <</if>>

        /* === 3. 统一结算 (BOSS战) === */
        <<if def _title>>
            <<if def _gain_traffic>><<set $traffic += _gain_traffic>><</if>>
            <<if def _gain_danger>><<set $danger_level = Math.max(0, $danger_level + _gain_danger)>><</if>>
            
            <div @class="'pr-card ' + _card_class">
                <div class="rank-badge">_badge</div><span class="result-icon">_icon</span>
                <span class="news-title">_title</span>
                <p>_text</p>
                <div class="reward-box">
                    <<if _gain_traffic != 0>>流量 <<if _gain_traffic > 0>>+<</if>>_gain_traffic | <</if>>
                    <<if _gain_danger != 0>>危险值 <<if _gain_danger > 0>>+<</if>>_gain_danger<</if>>
                </div>
            </div>
        <</if>>
        
        /* === 4. 常规操作 (恢复了旧版文案和逻辑) === */
        
        /* 律师函 */
        <<if $type is "lawyer">>
            <div class="pr-card card-standard">
                <div class="rank-badge">R</div><span class="result-icon">⚖️</span>
                <span class="news-title">📄 严正声明</span>
                <p>律师函发了出去，虽然评论区还在嘲讽，但震慑了部分营销号。</p>
                <div class="reward-box">危险值 -2</div>
                <<set $danger_level to Math.max(0, $danger_level - 2)>>
            </div>

        /* 祸水东引 */
        <<elseif $type is "divert">>
             <div class="pr-card card-legend">
                <div class="rank-badge">SR</div><span class="result-icon">🌪️</span>
                <span class="news-title">🎭 围魏救赵</span>
                <p>你爆出了另一位顶流的恋情瓜，吃瓜群众瞬间被转移了注意力。</p>
                <div class="reward-box">危险值 -10</div>
                <<set $danger_level to Math.max(0, $danger_level - 10)>>
             </div>

        /* 水军洗地 */
        <<elseif $type is "water">>
            <div class="pr-card card-standard">
                <div class="rank-badge">R</div><span class="result-icon">🌊</span>
                <span class="news-title">🧼 水军洗地</span>
                <p>铺天盖地的水军开始洗地，控评组占领了前排。互联网是没有记忆的。</p>
                <div class="reward-box" style="color:#166534;">✅ 效果显著：危险值 -30</div>
                <<set $danger_level to Math.max(0, $danger_level - 30)>>
            </div>

        /* 直播澄清 (恢复了随机性) */
        <<elseif $type is "live_apology">>
            <<set _roll to random(1,100)>>
            <<if _roll < 50>>
                /* 成功 */
                <div class="pr-card card-legend">
                    <div class="rank-badge">SSR</div><span class="result-icon">😭</span>
                    <span class="news-title">🏆 影帝级表演</span>
                    <p>直播非常真诚，艺人声泪俱下，连黑粉都觉得心疼。</p>
                    <div class="reward-box">🎉 大成功！危险值 -30</div>
                    <<set $danger_level to Math.max(0, $danger_level - 30)>>
                </div>
            <<else>>
                /* 失败 */
                <div class="pr-card card-fail">
                    <div class="rank-badge">FAIL</div><span class="result-icon">🤡</span>
                    <span class="news-title">🎬 直播翻车</span>
                    <p>艺人在直播里说错话了！表情管理也没做好，被做成了表情包。</p>
                    <div class="reward-box" style="color:#ef4444;">😱 弄巧成拙！危险值 +10</div>
                    <<set $danger_level += 10>>
                </div>
            <</if>>

        /* 🟢 慈善逻辑 (完全恢复全员加成) */
        <<elseif $type is "charity">>
            <div class="pr-card card-legend">
                <div class="rank-badge">SSR</div><span class="result-icon">💖</span>
                <span class="news-title">✨ 慈善光环</span>
                <p>善款已到账。媒体对此进行了正面报道，官方也点名表扬。</p>
                <div class="reward-box">
                    <div>🛡️ 本月危险值免疫 (锁定)</div>
                    <div style="font-size:0.9em; margin-top:5px; color:#059669; border-top:1px dashed rgba(0,0,0,0.1); padding-top:5px;">
                        👥 全员口碑 +10 | 全员死忠粉 +200
                    </div>
                </div>
                
                /* 恢复丢失的循环逻辑 */
                <<for _k range Object.keys($actors)>>
                    <<set $actors[_k].reputation += 10>>
                    <<if def $actors[_k].fans and def $actors[_k].fans.mom>>
                         <<set $actors[_k].fans.mom += 200>>
                    <</if>>
                <</for>>
                
                <<set $danger_level to 0>>
                <<set $charity_done to true>>
            </div>
        <</if>>

        <div style="margin-top:30px;">
            <<link "✅ 确认 (返回)" "Marketing_Center" class="btn-primary">><</link>>
        </div>
    </div>
<</if>>
</div>
<</nobr>>`
});

/* ---------- 故事块：PR_Execution_Report ---------- */
window.__STORY_PASSAGES.push({
  name: "PR_Execution_Report",
  src: `<<nobr>>
<div class="tech-card" style="min-height:400px; display:flex; flex-direction:column; justify-content:center; align-items:center;">
    
    <div style="width:100%; max-width:500px; background:#fff; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.1); overflow:hidden;">
        
        /* 顶部颜色条 */
        <div @style="'height:8px; width:100%; background:' + ($pr_result.color || '#cbd5e1')"></div>

        <div style="padding:30px; text-align:center;">
            
            /* 状态图标与标题 */
            <div style="font-size:4em; margin-bottom:10px;">
                <<if $pr_result.status is "大成功">>🚀
                <<elseif $pr_result.status is "成功">>✅
                <<else>>🤡
                <</if>>
            </div>
            
            <h2 @style="'margin:0; color:' + ($pr_result.color || '#333')">
                <<print $pr_result.title>>
            </h2>
            
            <div style="color:#94a3b8; font-weight:bold; font-size:0.9em; margin-top:5px; margin-bottom:20px;">
                状态: <<print $pr_result.status>>
            </div>

            /* 描述文本 */
            <p style="color:#475569; line-height:1.6; margin-bottom:20px;">
                <<print $pr_result.desc>>
            </p>

            /* 变更列表 */
            <div style="background:#f8fafc; border-radius:8px; padding:15px; text-align:left;">
                <div style="font-size:0.8em; color:#94a3b8; margin-bottom:8px;">📊 数据变动报告</div>
                <<for _change range $pr_result.changes>>
                    <div style="color:#334155; font-weight:bold; border-bottom:1px dashed #e2e8f0; padding:4px 0;">
                        ▪ _change
                    </div>
                <</for>>
            </div>
        </div>

        /* 底部按钮 */
        <div style="background:#f1f5f9; padding:15px; text-align:center;">
            <<button "🔙 返回热搜榜" "HotSearch_Board">><</button>>
        </div>

    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Public_Relations ---------- */
window.__STORY_PASSAGES.push({
  name: "Public_Relations",
  src: `<div class="tech-card">
    <div class="header-banner" style="background: linear-gradient(to right, #3730a3, #312e81);">
        <span>🌊 流量加油站</span>
        <span style="font-size:0.8em;">资金: $money 万 | 流量储备: $traffic</span>
    </div>

    <div style="padding:20px;">
        
        <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:20px; border-radius:8px; margin-bottom:20px; text-align:center;">
            <div style="font-size:3em; margin-bottom:10px;">🤖</div>
            <h3 style="color:#1e40af; margin-top:0;">数据维护与水军采购</h3>
            <p style="font-size:0.9em; color:#64748b; margin-bottom:20px;">
                "老板，量大从优。最近平台算法又变了，建议您多囤点。" <br>
                <span style="color:#ef4444; font-weight:bold;">基础汇率：30万资金 = 1,000 流量</span>
            </p>
            
            <div style="display:flex; flex-direction:column; gap:12px; max-width:400px; margin:0 auto;">
                
                /* 档位 1: 50万 -> 1000流量 */
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 15px; border-radius:6px; border:1px solid #cbd5e1;">
                    <span style="color:#334155; font-weight:bold;">💧 基础体验包</span>
                    <<link "¥30万 (+1000流)" "Buy_Traffic">>
                        <<set $buy_cost to 30>><<set $buy_amount to 1000>>
                    <</link>>
                </div>
                
                /* 档位 2: 200万 -> 4500流量 (多送500) */
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 15px; border-radius:6px; border:1px solid #93c5fd;">
                    <span style="color:#2563eb; font-weight:bold;">🌊 进阶包 <span style="font-size:0.8em; color:#ef4444;">(+12%)</span></span>
                    <<link "¥120万 (+4500流)" "Buy_Traffic">>
                        <<set $buy_cost to 120>><<set $buy_amount to 4500>>
                    <</link>>
                </div>

                /* 档位 3: 500万 -> 12000流量 (多送2000) */
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 15px; border-radius:6px; border:1px solid #60a5fa;">
                    <span style="color:#1d4ed8; font-weight:bold;">⚡ 商务包 <span style="font-size:0.8em; color:#ef4444;">(+20%)</span></span>
                    <<link "¥300万 (+1.2万流)" "Buy_Traffic">>
                        <<set $buy_cost to 300>><<set $buy_amount to 12000>>
                    <</link>>
                </div>

                /* 档位 4: 1000万 -> 26000流量 (多送6000) */
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 15px; border-radius:6px; border:1px solid #fcd34d;">
                    <span style="color:#b45309; font-weight:bold;">🔥 霸榜包 <span style="font-size:0.8em; color:#ef4444;">(+30%)</span></span>
                    <<link "¥650万 (+2.6万流)" "Buy_Traffic">>
                        <<set $buy_cost to 650>><<set $buy_amount to 26000>>
                    <</link>>
                </div>

                /* 档位 5: 2000万 -> 60000流量 (多送20000) */
                <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:10px 15px; border-radius:6px; border:1px solid #f87171;">
                    <span style="color:#b91c1c; font-weight:bold;">🚀 造神包 <span style="font-size:0.8em; color:#ef4444;">(+50%!)</span></span>
                    <<link "¥1300万 (+6万流)" "Buy_Traffic">>
                        <<set $buy_cost to 1300>><<set $buy_amount to 60000>>
                    <</link>>
                </div>
            </div>
        </div>

        <div style="text-align:center;">
            <<link "🔙 返回营销与公关部" "Marketing_Center">><</link>>
        </div>
    </div>
</div>`
});

/* ---------- 故事块：War_Actor_Selector_Widget ---------- */
window.__STORY_PASSAGES.push({
  name: "War_Actor_Selector_Widget",
  src: `<<nobr>>
<style>
    /* 按钮基础样式 */
    .war-btn-inner {
        background: #fff;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        text-align: center;
        transition: all 0.2s;
        cursor: pointer;
    }
    .war-btn-inner a {
        display: block;
        padding: 10px;
        text-decoration: none !important;
        font-weight: bold;
        color: #64748b !important;
    }
    .war-btn-inner:hover {
        border-color: #94a3b8;
        background: #f8fafc;
    }
    
    /* 选中状态样式 */
    .war-btn-active {
        color: #fff !important;
        border-radius: 6px;
        text-align: center;
        font-weight: bold;
        padding: 10px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
</style>

<div style="display:flex; gap:10px; width:100%;">

    /* --- 展鹏按钮 --- */
    <div style="flex:1;">
        <<if $war_actor is "zp">>
            <div class="war-btn-active" style="background:#3b82f6; border:2px solid #2563eb;">
                ✅ 展鹏
            </div>
        <<else>>
            <div class="war-btn-inner">
                <<link "展鹏">>
                    <<set $war_actor to "zp">>
                    <<replace "#war-actor-selector">><<include "War_Actor_Selector_Widget">><</replace>>
                <</link>>
            </div>
        <</if>>
    </div>

    /* --- 秦飒按钮 --- */
    <div style="flex:1;">
        <<if $war_actor is "qs">>
            <div class="war-btn-active" style="background:#f43f5e; border:2px solid #e11d48;">
                ✅ 秦飒
            </div>
        <<else>>
            <div class="war-btn-inner">
                <<link "秦飒">>
                    <<set $war_actor to "qs">>
                    <<replace "#war-actor-selector">><<include "War_Actor_Selector_Widget">><</replace>>
                <</link>>
            </div>
        <</if>>
    </div>

    /* --- 白小纯按钮 --- */
    <div style="flex:1;">
        <<if $war_actor is "new">>
            <div class="war-btn-active" style="background:#10b981; border:2px solid #059669;">
                ✅ 白小纯
            </div>
        <<else>>
            <div class="war-btn-inner">
                <<link "白小纯">>
                    <<set $war_actor to "new">>
                    <<replace "#war-actor-selector">><<include "War_Actor_Selector_Widget">><</replace>>
                <</link>>
            </div>
        <</if>>
    </div>

</div>

/* Debug 提示：让你确认变量真的变了 */
<div style="text-align:center; font-size:0.8em; color:#94a3b8; margin-top:5px;">
    当前出战艺人代码: $war_actor
</div>
<</nobr>>`
});

/* ---------- 故事块：Fan_Purge（清理某一类粉丝） ---------- */
window.__STORY_PASSAGES.push({
  name: "Fan_Purge",
  src: `<<nobr>>
<<set _a to $actors[$current_actor]>>
<<set _ok to FanEnsure(_a)>>
<<set _band to FAN_OVER[$purge_key]>>

<div class="tech-card">
    <div class="header-banner"><span>🧹 清理粉丝</span></div>
    <div style="padding:26px;">

    <<if not def _band>>
        <div style="text-align:center; padding:30px; color:#94a3b8;">
            数据异常，没找到这类粉丝。<br><br>
            [[🔙 返回粉丝管理|Fan_Management]]
        </div>

    <<elseif ($action_points || 0) <= 0>>
        <div style="text-align:center; padding:30px;">
            <div style="font-size:2.4em; margin-bottom:10px;">🎯</div>
            <h3 style="color:#c2410c;">本月行动点用完了</h3>
            <p>清理粉圈也要花 1 点行动点，下个月再说。</p>
            [[🔙 返回粉丝管理|Fan_Management]]
        </div>

    <<elseif $money < 120>>
        <div style="text-align:center; padding:30px;">
            <div style="font-size:2.4em; margin-bottom:10px;">💸</div>
            <h3 style="color:#ef4444;">预算不够</h3>
            <p>清理 <b><<print _band.name>></b> 需要 120 万的公关预算（买水军、控评、发通稿）。</p>
            [[🔙 返回粉丝管理|Fan_Management]]
        </div>

    <<else>>
        <<set _before to FanPct(_a, $purge_key)>>
        <<set _cut to Math.floor((_a.fans[$purge_key] || 0) * 0.25)>>
        <<set _a.fans[$purge_key] -= _cut>>
        <<set _spread to Math.floor(_cut * 0.5 / 8)>>
        <<set _gained to 0>>
        <<for _k range FAN_KEYS>>
            <<if _k isnot $purge_key>>
                <<set _a.fans[_k] += _spread>>
                <<set _gained += _spread>>
            <</if>>
        <</for>>
        <<set _a.reputation to Math.max(0, (_a.reputation || 0) - 8)>>
        <<set $money -= 120>>
        <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
        <<set _after to FanPct(_a, $purge_key)>>

        <div style="text-align:center; margin-bottom:18px;">
            <div style="font-size:2.4em;">🧹</div>
            <h3 style="margin:8px 0 4px; color:#3D4B61;">清理完成</h3>
            <p style="color:#5C6880; font-size:.92rem; line-height:1.8;">
                公司暗中调整了运营方向，<b><<print _band.name>></b> 从 <b><<print _before>>%</b> 掉到 <b><<print _after>>%</b>，<br>
                少了 <<print _cut>> 人。剩下的人被分到其他粉丝群体里（各 +<<print _spread>>）。
            </p>
        </div>

        <div class="nm-settle" style="margin-bottom:18px;">
            <div class="nm-settle-body">
                <div class="row"><span><<print _band.name>></span><span>−<<print _cut>> 人</span></div>
                <div class="row"><span>其他类型</span><span>+<<print _gained>> 人</span></div>
                <div class="row total"><span>口碑</span><span class="num">−8</span></div>
            </div>
        </div>

        <div class="fd-note" style="margin-bottom:16px;">
            ⚠️ “官方亲自下场赶粉”已经冲上热搜。路人觉得这家公司冷血，粉丝觉得被背叛。
        </div>

        <<if $money >= 80>>
            <<link "💸 再花 80 万压热搜（口碑 +4）" "Fan_Management">>
                <<set $money -= 80>>
                <<set _a.reputation += 4>>
            <</link>>
            <span style="margin:0 8px; color:#CBD3E2;">|</span>
        <</if>>
        [[✅ 就这样|Fan_Management]]

    <</if>>
    </div>
</div>
<</nobr>>`
});
