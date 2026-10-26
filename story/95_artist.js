/* ===========================================================================
   ⑪ 艺人：管理 / 培训 / 面板
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

/* ---------- 故事块：Artist_Management ---------- */
window.__STORY_PASSAGES.push({
  name: "Artist_Management",
  src: `<<nobr>>
/* 自动纠错逻辑：确保进入页面时有一个合法的默认艺人 */
<<if not def $current_actor or $actors[$current_actor].status is "left" or $actors[$current_actor].status is "dead">>
    /* 优先级 1: 展鹏 (如果在) */
    <<if $actors.zp.status isnot "left" and $actors.zp.status isnot "dead">>
        <<set $current_actor to "zp">>
    /* 优先级 2: 黄耀祖 (修正代号为 huang) */
    <<elseif $has_signed_huang is true>>
        <<set $current_actor to "huang">>
    /* 优先级 3: 刘梁周 (如果在) */
    <<elseif $has_signed_liu is true>>
        <<set $current_actor to "liu">>
    /* 优先级 4: 秦飒 (如果在) */
    <<elseif $actors.qs.status isnot "left">>
        <<set $current_actor to "qs">>
    /* 优先级 5: 白小纯 (兜底) */
    <<else>>
        <<set $current_actor to "new">>
    <</if>>
<</if>>

<div class="tech-card">
  <div class="header-banner" style="background: linear-gradient(to right, #7c3aed, #6d28d9);">
    <span>🏢 艺人管理与培训</span>
    <span style="font-size:0.8em;">资金: $money 万</span>
  </div>

  <div style="padding: 25px;">
    
    <div style="font-size:0.9em; color:#64748b; margin-bottom:10px;">选择要培训的艺人：</div>
    <div class="tab-grid">
       
       /* 0. 展鹏 */
       <<if $actors.zp.status isnot "left" and $actors.zp.status isnot "dead">>
           <div class="tab-btn tab-zp">
             <<link "展鹏">>
                <<set $current_actor to "zp">>
                <<replace "#manage-panel">><<include "Manage_Panel_Widget">><</replace>>
             <</link>>
           </div>
       <</if>>

       /* 1. 黄耀祖 (修正代号为 huang) */
       <<if $has_signed_huang is true>>
           <div class="tab-btn" style="background:#e0f2fe; border-color:#7dd3fc;">
             <<link "黄耀祖">>
                <<set $current_actor to "huang">> 
                <<replace "#manage-panel">><<include "Manage_Panel_Widget">><</replace>>
             <</link>>
           </div>
       <</if>>

       /* 2. 刘梁周 */
       <<if $has_signed_liu is true>>
           <div class="tab-btn" style="background:#f0fdf4; border-color:#86efac;">
             <<link "刘梁周">>
                <<set $current_actor to "liu">>
                <<replace "#manage-panel">><<include "Manage_Panel_Widget">><</replace>>
             <</link>>
           </div>
       <</if>>

       /* 3. 秦飒 */
       <div class="tab-btn tab-qs">
          <<link "秦飒">>
            <<set $current_actor to "qs">>
            <<replace "#manage-panel">><<include "Manage_Panel_Widget">><</replace>>
         <</link>>
       </div>
       
       /* 4. 白小纯 */
       <div class="tab-btn tab-new">
         <<link "白小纯">>
            <<set $current_actor to "new">>
            <<replace "#manage-panel">><<include "Manage_Panel_Widget">><</replace>>
         <</link>>
       </div>

    </div>

    <hr style="margin:15px 0; border:0; border-top:1px dashed #cbd5e1;">

    <div id="manage-panel">
        <<include "Manage_Panel_Widget">>
    </div>
    <div style="text-align:center; margin-top: 30px;">
      <<link "🔙 返回办公室">><<goto "Office">><</link>>
    </div>
  </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Manage_Panel_Widget ---------- */
window.__STORY_PASSAGES.push({
  name: "Manage_Panel_Widget",
  src: `<<nobr>>
<<set _a to $actors[$current_actor]>>

/* 🛠️ 修复：补齐可能缺失的属性/上限，否则进度条和「当前值/上限」会空掉或显示 NaN */
<<if not def _a.acting>><<set _a.acting to 10>><</if>>
<<if not def _a.fashion>><<set _a.fashion to 10>><</if>>
<<if not def _a.stage>><<set _a.stage to 10>><</if>>
<<if not def _a.limit_acting>><<set _a.limit_acting to Math.min(99, _a.acting + 30)>><</if>>
<<if not def _a.limit_fashion>><<set _a.limit_fashion to Math.min(99, _a.fashion + 30)>><</if>>
<<if not def _a.limit_stage>><<set _a.limit_stage to Math.min(99, _a.stage + 30)>><</if>>
<<if not def _a.rank_label>><<set _a.rank_label to "新人">><</if>>
<<if not def _a.topic>><<set _a.topic to 0>><</if>>
<<if not def _a.reputation>><<set _a.reputation to 0>><</if>>

<div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; background: #fff;">
    
/* 头部信息 */
    <div style="display:flex; justify-content:space-between; margin-bottom:20px; border-bottom:1px dashed #e2e8f0; padding-bottom:10px;">
        <div style="font-size:1.2em; font-weight:bold;">
            👤 _a.name <span style="font-size:0.7em; color:#64748b; font-weight:normal;">[_a.rank_label]</span>
        </div>
        <div>
            <<if _a.busy_months > 0>>
                /* 🔴 特殊状态标签 */
                <<if _a.job_type is "banned">>
                    <span style="background:#fef2f2; color:#ef4444; padding:4px 8px; border-radius:4px; font-size:0.9em; border:1px solid #fecaca;">❄️ 被抵制</span>
                <<elseif _a.job_type is "maternity_leave">>
                    <span style="background:#fff0f5; color:#db2777; padding:4px 8px; border-radius:4px; font-size:0.9em; border:1px solid #fbcfe8;">🤰 产假中</span>
                <<else>>
                    <span style="background:#fef3c7; color:#b45309; padding:4px 8px; border-radius:4px; font-size:0.9em;">🔒 忙碌中</span>
                <</if>>
            <<else>>
                <span style="background:#dcfce7; color:#15803d; padding:4px 8px; border-radius:4px; font-size:0.9em;">🟢 空闲</span>
            <</if>>
        </div>
    </div>

    /* 属性展示 (带上限进度条) */
    <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:30px;">
        
        /* 演技 */
        <div style="text-align:center;">
            <div style="font-weight:bold; color:#334155; margin-bottom:5px;">🎬 演技</div>
            <div style="font-size:1.5em; color:#059669;">_a.acting <span style="font-size:0.5em; color:#cbd5e1;">/ _a.limit_acting</span></div>
            <progress value="_a.acting" max="_a.limit_acting" style="width:100%; height:8px;"></progress>
            <<if _a.acting >= _a.limit_acting>>
                <div style="font-size:0.8em; color:#ef4444;">(已达上限)</div>
            <</if>>
        </div>

        /* 时尚 */
        <div style="text-align:center;">
            <div style="font-weight:bold; color:#334155; margin-bottom:5px;">👠 时尚</div>
            <div style="font-size:1.5em; color:#d97706;">_a.fashion <span style="font-size:0.5em; color:#cbd5e1;">/ _a.limit_fashion</span></div>
            <progress value="_a.fashion" max="_a.limit_fashion" style="width:100%; height:8px;"></progress>
             <<if _a.fashion >= _a.limit_fashion>>
                <div style="font-size:0.8em; color:#ef4444;">(已达上限)</div>
            <</if>>
        </div>

        /* 唱跳 */
        <div style="text-align:center;">
            <div style="font-weight:bold; color:#334155; margin-bottom:5px;">💃 唱跳</div>
            <div style="font-size:1.5em; color:#2563eb;">_a.stage <span style="font-size:0.5em; color:#cbd5e1;">/ _a.limit_stage</span></div>
            <progress value="_a.stage" max="_a.limit_stage" style="width:100%; height:8px;"></progress>
             <<if _a.stage >= _a.limit_stage>>
                <div style="font-size:0.8em; color:#ef4444;">(已达上限)</div>
            <</if>>
        </div>
    </div>

  /* 培训课程选择 */
    <div style="background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0;">
        <h4 style="margin:0 0 15px 0; color:#475569;">🎓 安排进修课程</h4>
        
        /* === 逻辑修正：判定全锁状态 === */
        <<set _is_maternity_locked to false>>
        <<if $current_actor is "zp" and (($zp_preg.state is 1 and $zp_preg.month >= 7) or ($zp_preg.state is 2 and $zp_preg.month <= 2))>>
            <<set _is_maternity_locked to true>>
        <</if>>
        
        /* 1. 产假锁定 */
        <<if _is_maternity_locked>>
             <div style="text-align:center; padding:20px; color:#db2777; background:#fff0f5; border:2px solid #fbcfe8; border-radius:8px;">
                🤰 <b>全封闭产假/月子期间</b><br>
                无法进行任何高强度训练。请等待产后恢复期（产后3月）。
            </div>

        /* 2. 正常忙碌（非封杀） */
        <<elseif _a.busy_months > 0 and _a.job_type neq "banned">>
            <div style="text-align:center; padding:20px; color:#94a3b8;">
                🚫 艺人当前正在工作中，无法安排课程。<br>
                (请等待工作结束)
            </div>
        
        /* 3. 可培训状态（含空闲 或 封杀期） */
        <<else>>
        
            <<if _a.job_type is "banned">>
                <div style="background:#fff7ed; color:#c2410c; padding:10px; margin-bottom:15px; border-radius:4px; font-size:0.9em; text-align:center;">
                    💪 虽然被外界抵制，但正是沉下心来磨练技艺的好时机！
                </div>
            <</if>>
            
            /* 产后恢复期提示 */
            <<if $current_actor is "zp" and $zp_preg.state is 2 and $zp_preg.month >= 3 and $zp_preg.month < 6>>
                 <div style="background:#f0fdf4; color:#166534; padding:5px; margin-bottom:15px; border-radius:4px; font-size:0.9em; text-align:center;">
                    ✅ 产后恢复期：可以进行温和的恢复性训练。
                </div>
            <</if>>

            <div style="font-size:0.9em; margin-bottom:10px; color:#64748b;">
                请选择培训方向：
                <label><<radiobutton "$train_attr" "acting" checked>> 🎬演技</label> 
                <label><<radiobutton "$train_attr" "fashion">> 👠时尚</label> 
                <label><<radiobutton "$train_attr" "stage">> 💃唱跳</label>
            </div>
           
            <<if ($action_points || 0) <= 0>>
            <div style="background:#fff7ed; border:1px solid #fdba74; color:#c2410c; padding:12px 14px; border-radius:9px; text-align:center; font-size:.9em;">
              🎯 本月行动点已经用完了，报班要等下个月。
            </div>
            <<else>>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                /* 初级 */
                <div style="background:#fff; border:1px solid #cbd5e1; padding:10px; border-radius:6px; text-align:center;">
                    <div style="font-weight:bold; color:#334155;">初级班</div>
                    <div style="font-size:0.8em; color:#64748b;">效果: +1 | 费用: 50万</div>
                    <<button "📚 报名 (50w)" "Train_Execute">>
                        <<set $train_cost to 50>><<set $train_gain to 1>>
                    <</button>>
                </div>

                /* 中级 */
                <div style="background:#fff; border:1px solid #93c5fd; padding:10px; border-radius:6px; text-align:center;">
                    <div style="font-weight:bold; color:#1e40af;">中级班</div>
                    <div style="font-size:0.8em; color:#64748b;">效果: +2 | 费用: 150万</div>
                    <<button "🏫 报名 (150w)" "Train_Execute">>
                         <<set $train_cost to 150>><<set $train_gain to 2>>
                    <</button>>
                </div>

                 /* 高级 */
                <div style="background:#fff; border:1px solid #fcd34d; padding:10px; border-radius:6px; text-align:center;">
                    <div style="font-weight:bold; color:#b45309;">高级班</div>
                    <div style="font-size:0.8em; color:#64748b;">效果: +3 | 费用: 300万</div>
                    <<button "🎓 报名 (300w)" "Train_Execute">>
                         <<set $train_cost to 300>><<set $train_gain to 3>>
                    <</button>>
                </div>

                 /* 大师 */
                <div style="background:#fff; border:1px solid #f87171; padding:10px; border-radius:6px; text-align:center;">
                    <div style="font-weight:bold; color:#991b1b;">大师班</div>
                    <div style="font-size:0.8em; color:#64748b;">效果: +4 | 费用: 500万</div>
                    <<button "👑 报名 (500w)" "Train_Execute">>
                         <<set $train_cost to 500>><<set $train_gain to 4>>
                    <</button>>
                </div>
            </div>
            <</if>>
            
            <div style="margin-top:10px; font-size:0.8em; color:#ef4444; text-align:center;">
                ⚠️ 注意：进修将消耗艺人本月所有行程（无法接通告）。
            </div>
        <</if>>
    </div>

</div>
<</nobr>>`
});

/* ---------- 故事块：Train_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "Train_Execute",
  src: `<<nobr>>

/* --- 0. 参数兜底 --- */
/* 🛠️ 修复：老存档（或直接跳进本页时）可能没有这些变量，
   缺任意一个都会让结算页显示「+NaN / 当前数值: NaN」。 */
<<if not def $train_attr>><<set $train_attr to "acting">><</if>>
<<if not def $train_gain>><<set $train_gain to 1>><</if>>
<<if not def $train_cost>><<set $train_cost to 50>><</if>>
<<if not def $current_actor>><<set $current_actor to "zp">><</if>>

/* --- 1. 锁判定 --- */
<<ZP_Check_Lock "training">>

/* --- 2. 逻辑分流 --- */
<<if _zp_lock_msg neq "">>
    
    <div class="tech-card" style="padding:40px; text-align:center;">
        <div style="font-size:4em; margin-bottom:20px;">🚫</div>
        <h3 style="color:#ef4444;">无法执行</h3>
        <p>_zp_lock_msg</p>
        <br>
        <<button "🔙 返回" "Artist_Management">><</button>>
    </div>

/* 否则，执行培训 */
<<else>>

    <div class="tech-card">
        <div class="header-banner"><span>🎓 培训结算</span></div>
        <div style="padding:30px; text-align:center;">

            /* 资金检查 */
            <<if $money < $train_cost>>
                <div style="font-size:3em; margin-bottom:10px;">💸</div>
                <h3 style="color:#ef4444;">资金不足！</h3>
                <p>公司账户余额不足，无法支付 <b style="color:#b45309">$train_cost 万</b> 的学费。</p>
                <br>
                [[🔙 返回|Artist_Management]]
            
            <<elseif ($action_points || 0) <= 0>>
                <div style="font-size:3em; margin-bottom:10px;">🎯</div>
                <h3 style="color:#c2410c;">本月行动点用完了</h3>
                <p>报班要花 1 点行动点，下个月恢复 8 点。</p>
                <br>
                [[🔙 返回|Artist_Management]]

            <<else>>
                <<set $money -= $train_cost>>
                <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
                <<set _a to $actors[$current_actor]>>
                
                /* 获取当前属性和上限 */
                /* 🛠️ 修复：老存档或刚签约的艺人可能没有 limit_* / 属性字段，
                   缺失就会变成 NaN。这里兜底成 0 / 99。 */
                <<if not def _a[$train_attr]>><<set _a[$train_attr] to 0>><</if>>
                <<if not def _a["limit_" + $train_attr]>>
                    <<set _a["limit_" + $train_attr] to Math.min(99, _a[$train_attr] + 30)>>
                <</if>>
                <<set _current_val to _a[$train_attr]>>
                <<set _limit to _a["limit_" + $train_attr]>>
                
                <<if $train_attr is "acting">><<set _attr_name to "演技">>
                <<elseif $train_attr is "fashion">><<set _attr_name to "时尚">>
                <<elseif $train_attr is "stage">><<set _attr_name to "唱跳">>
                <</if>>

                /* 天赋上限检查 */
                <<if _current_val >= _limit>>
                    <div style="font-size:3em; margin-bottom:10px;">🤔</div>
                    <h3>天赋已达上限</h3>
                    <p>老师无奈地摇摇头："<<print _a.name>> 在这方面真的没天分了，再学也是浪费钱。"</p>
                    <p style="color:#94a3b8; font-size:0.9em;">( 学费已退还 )</p>
                    <<set $money += $train_cost>> 
                
                <<else>>
                    /* 正常加点 */
                    <<set _real_gain to Math.min($train_gain, _limit - _current_val)>>
                    <<set _a[$train_attr] += _real_gain>>
                    
                    /* 锁定回合 */
                    <<set _a.busy_months to 1>>
                    <<set _a.project_name to "封闭式培训">> 
                    <<set _a.job_type to "training">>

                    <div style="font-size:3em; margin-bottom:10px;">📈</div>
                    <h3 style="color:#059669;">来上课吧！</h3>
                    
                    <p><<print _a.name>> 开始了封闭式训练。</p>
                    
                    <div style="background:#ecfdf5; border:1px solid #10b981; padding:15px; border-radius:8px; display:inline-block; margin-top:10px;">
                        <span style="font-size:1.2em; font-weight:bold; color:#065f46;">
                            <<print _attr_name>> +<<print _real_gain>>
                        </span>
                        <br>
                        <span style="font-size:0.9em; color:#047857;">
                            当前数值: <<print _a[$train_attr]>> / <<print _limit>>
                        </span>
                    </div>
                    
                    <<if _real_gain < $train_gain>>
                        <p style="color:#ea580c; font-size:0.9em; margin-top:10px;">( 已触碰天赋天花板，无法获得全部提升 )</p>
                    <</if>>
                    
                    <p style="color:#64748b; margin-top:20px; font-size:0.9em;">
                        * 艺人本月行程已锁定
                    </p>

                <</if>>
                
                <br><hr><br>
                [[✅ 确定|Artist_Management]]
            <</if>>
        </div>
    </div>

<</if>>
<</nobr>>`
});
