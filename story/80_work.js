/* ===========================================================================
   ⑧ 工作系统：接戏 / 通告 / 剧组探班 / 通告结算
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

/* ---------- 故事块：Job_Drama ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Drama",
  src: `
<<nobr>>
<div class="tech-card">
    <div class="header-banner"><span>🎬 影视拍摄结算</span></div>
    
    <div style="padding:20px;">
        /* 1. 初始化与扣除消耗 */
        <<set _a to $actors[$current_actor]>>
        <<if not def $zp_lazy_streak>><<set $zp_lazy_streak to 0>><</if>>

        <<set _cost to 20>>
        <<if $current_actor is "qs">><<set _cost to 40>><</if>> 
        <<set _a.current_energy -= _cost>>

        /* ========================================= */
        /* 2. 展鹏特殊剧情判定区 (调用 Widget)      */
        /* ========================================= */
        <<Event_ZP_Drama>>

        /* ========================================= */
        /* 3. 结果分流                            */
        /* ========================================= */
        
        /* A. 如果触发了特殊事件 (摸鱼/私房钱)，Widget已经处理了显示和数据，直接结束 */
        <<if _zp_event_handled is true>>
             /* 这里什么都不用做，上面已经显示了 */

        /* B. 如果没触发特殊事件 (或者不是展鹏)，走正常结算 */
        <<else>>
            <p>
                <<print _a.name>> 顺利杀青！
                <<if $current_actor is "new">>导演夸赞他很有灵气，是个可塑之才。<</if>>
                <<if $current_actor is "zp">>难得见他全程清醒，剧组都感动哭了。<</if>>
            </p>

            /* 调用全能结算 Widget */
            <<Job_Settle "drama">>
            
            /* 白小纯新人福利逻辑 */
            <<if $current_actor is "new" and _a.acting < 60>>
                <<set _a.acting += 2>>
                <div style="font-size:0.8em; color:#059669; margin-top:5px; background:#dcfce7; padding:5px; border-radius:4px;">
                    🌱 <b>新人红利期：</b> 演技突飞猛进 (额外+2)
                </div>
            <<elseif $current_actor is "new">>
                <div style="font-size:0.8em; color:#64748b; margin-top:5px;">
                    🤔 <b>瓶颈期：</b> 靠天赋已经不够了，需要更多磨练。
                </div>
            <</if>>
        <</if>>

        <br>
        <div style="text-align:center;">[[✅ 确定|Work_Center]]</div>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Job_Drama_Select ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Drama_Select",
  src: `<<nobr>>
/* 引用全局容器 */
<div class="page-container">

    <<set _act to $actors[$target]>>

    /* === 🚫 阻断情况：忙碌或没资源 === */
    <<if _act.busy_months > 0>>
        <div class="biz-card" style="text-align:center;">
            <div class="biz-body">
                <div style="font-size:4em; margin-bottom:20px;">🚫</div>
                <h3 style="margin-bottom:10px;">档期冲突</h3>
                <p style="color:var(--slate-500);">
                    <<print _act.name>> 正在拍摄《_act.project_name》，<br>分身乏术，无法接新戏。
                </p>
                <div class="btn-group">
                    <<button "🔙 返回通告中心" class="btn-secondary">>
                        <<goto "Work_Center">>
                    <</button>>
                </div>
            </div>
        </div>

    <<elseif $resources[$req_res] < 1>>
        <div class="biz-card" style="text-align:center;">
            <div class="biz-body">
                <div style="font-size:4em; margin-bottom:20px;">📉</div>
                <h3 style="margin-bottom:10px;">资源不足</h3>
                <p style="color:var(--slate-500);">
                    公司缺少 <b><<print $req_res.toUpperCase()>></b> 级资源券。<br>请前往商务部洽谈获取。
                </p>
                <div class="btn-group">
                    <<button "🔙 返回通告中心" class="btn-secondary">>
                        <<goto "Work_Center">>
                    <</button>>
                </div>
            </div>
        </div>

    /* === ✅ 正常流程：剧本提案 === */
    <<else>>
    
        /* 1. 生成数据 */
        <<Job_Generate "drama" $req_res>>
        
        /* 2. 投资方判定 */
        <<set _investor_roll to random(1, 100)>>
        <<set _bad_investor to false>>
        <<if _investor_roll <= 20>>
            <<set _bad_investor to true>>
            <<set _investor_pool to ["皮包公司", "煤老板", "传销大佬", "诈骗犯"]>>
            <<set _investor_name to _investor_pool.random()>>
        <<else>>
            <<set _investor_name to "正规影视公司">>
        <</if>>

        /* 3. 显示提案卡片 */
        <div class="biz-card">
            /* 卡片头部 */
            <div class="biz-header">
                <span class="biz-header-title">片约提案</span>
                <span class="badge badge-neutral"><<print $req_res.toUpperCase()>>级项目</span>
            </div>
            
            <div class="biz-body">
                <div style="text-align:center; margin-bottom:25px;">
                    <div style="font-size:0.9em; color:var(--slate-400); margin-bottom:5px;">意向艺人：<<print _act.name>></div>
                    /* 剧名自带《》，这里不要再包一层，否则会变成《《剧名》》 */
                    <div style="font-size:1.8em; font-weight:800; color:var(--slate-800);">$generated_name</div>
                </div>

                /* 剧情简介框 */
                <div class="alert-box info">
                    “ $generated_desc ”
                </div>
                
                /* 信息网格 */
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">拍摄周期</span>
                        <span class="info-value">$generated_period 个月</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">预计到账（税后）</span>
                        <span class="info-value" style="color:var(--color-success);">$<<Calc_Income_Preview $target $req_res>> 万</span>
                    </div>
                    
                    /* 投资方风险提示 */
                    <div class="info-item" style="grid-column: span 2;">
                        <span class="info-label">投资方背景调研</span>
                        <<if _bad_investor>>
                            <span class="badge badge-danger">⚠️ <<print _investor_name>> (高风险)</span>
                            <div style="font-size:0.8em; color:var(--color-danger); margin-top:5px;">*业内传闻该公司资金链极不稳定</div>
                        <<else>>
                            <span class="badge badge-success">✅ <<print _investor_name>> (信誉良好)</span>
                        <</if>>
                    </div>
                </div>
                
                /* 操作按钮组 */
                <div class="btn-group">
                    /* 拒绝按钮 */
                    <<button "❌ 婉拒邀约" class="btn-secondary">>
                        <<goto "Work_Center">>
                    <</button>>
                    
                    /* 接受按钮 */
                    <<button "✅ 签约进组" class="btn-primary">>
                        /* 逻辑处理：扣资源与行动点 */
                        <<set $resources[$req_res] -= 1>>
                        <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
                        
                        /* 更新艺人状态 */
                        <<set _act.busy_months = $generated_period>>
                        <<set _act.project_name = $generated_name>>
                        <<set _act.job_type = "drama">>
                        <<set _act.res_level = $req_res>>
                        
                        /* 坏投资方处理 */
                        <<if _bad_investor>>
                            <<set _delay to random(1, 3)>>
                            <<set _act.busy_months += _delay>>
                            <<set _act.reputation -= 5>>
                            <<set $is_bad_project to true>>
                            <<set $gossips.push({
                                desc: _act.name + " 接了「" + _investor_name + "」投资的烂戏，被业内嘲笑。",
                                type: "blue", label: "🔵黑料", price: 20, power: 100
                            })>>
                        <</if>>
                        
                        <<goto "Work_Center">>
                    <</button>>
                </div>
            </div>
        </div>
    <</if>>

</div>
<</nobr>>`
});

/* ---------- 故事块：Job_Fashion_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Fashion_Execute",
  src: `<<nobr>>
<div class="tech-card">
    <div class="header-banner"><span>👠 时尚资源结算</span></div>
    <div style="padding:20px;">
        <<set _a to $actors[$current_actor]>>
        <p>闪光灯下，<<print _a.name>> 的表现力十足！</p>
        
        <<Job_Settle "fashion">>
        
        <br>
        <div style="text-align:center;">
            <<link "✅ 确定">>
                <<goto "Work_Center">>
            <</link>>
            <span style="margin:0 10px;">|</span>
            <<link "📸 再接一单">>
                <<goto "Work_Center">>
            <</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Job_Precheck ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Precheck",
  src: `<<nobr>>

/* --- 1. 展鹏特殊状态锁判定 --- */
<<set _job_check_type to "job_other">>
<<if $type is "drama">><<set _check_type to "job_drama">>
<<elseif $type is "stage">><<set _check_type to "job_stage">>
<</if>>

<<ZP_Check_Lock _check_type>>

/* --- 2. 逻辑分流 --- */
/* 如果有锁 (lock_msg 不为空)，显示错误并停止 */
<<if _zp_lock_msg neq "">>
    
    <div class="tech-card" style="padding:40px; text-align:center;">
        <div style="font-size:4em; margin-bottom:20px;">🚫</div>
        <h3 style="color:#ef4444;">无法执行</h3>
        <p>_zp_lock_msg</p>
        <br>
        <<button "🔙 返回" "Work_Center">><</button>>
    </div>

/* 否则，执行正常的接通告逻辑 */
<<else>>

    <div class="tech-card" style="min-height: 400px; display:flex; flex-direction:column; justify-content:center; align-items:center;">

    /* --- 数据准备 --- */
    <<set _act to $actors[$target]>>
    <<set _res_map to { s:4, a:3, b:2, c:1 }>>
    <<set _res_level to _res_map[$req_res]>>
    <<set _gap to _res_level - _act.rank_level>>

    /* --- 阻断性逻辑判断 --- */
    <<if $stamina < 10>>
        <div style="background:#fef2f2; border:2px solid #ef4444; color:#b91c1c; padding:20px; border-radius:8px; text-align:center;">
            ❌ <b>体力不足！</b><br>你需要至少 10 点体力。<br><br>[[🔙 返回通告中心|Work_Center]]
        </div>
    <<elseif $resources[$req_res] < 1>>
        <div style="background:#fff7ed; border:2px solid #f97316; color:#c2410c; padding:20px; border-radius:8px; text-align:center;">
            ⚠️ <b>资源不足！</b><br>没有 <<print $req_res.toUpperCase()>> 级资源券了。<br><br>[[🔙 返回通告中心|Work_Center]]
        </div>
    <<elseif _gap >= 2>>
        <div style="background:#f3f4f6; border:2px solid #94a3b8; color:#1e293b; padding:20px; border-radius:8px; text-align:center; max-width:400px;">
            👤 <b>面试被拒</b><br><br>
            经纪人带着 <b>_act.name</b> 去试镜了 <<print $req_res.toUpperCase()>> 级项目。<br>
            <div style="margin:10px 0; font-style:italic; color:#64748b;">"不好意思，我们需要更有知名度的艺人。"</div>
            @@color:red; (判定：咖位不足)@@<br><br>[[😤 知道了|Work_Center]]
        </div>
    <<else>>
        /* --- 成功分支 --- */
        <<if $type is "drama">>
            <<set _title_text to "签约进组">><<set _time_label to "拍摄周期">><<set _money_label to "预计到账（税后）">>
        <<else>>
            <<set _title_text to "行程确认">><<set _time_label to "工作时长">><<set _money_label to "预计到账（税后）">>
        <</if>>

        <<Job_Generate $type $req_res>>
        
        <<set $stamina -= 10>>
        <<set $resources[$req_res] -= 1>>
        <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
        
        /* 随机事件：天坑剧组 */
        <<set _bad_event_type to "none">>
        <<if random(1,100) <= 20>>
            <<set _bad_roll to random(1, 3)>>
            <<if _bad_roll == 1>>
                <<set _bad_event_type to "ugly">>
                <<set $generated_desc to "🤡 <b>妆造翻车：</b>得罪了造型师，路透照满脸油光，被群嘲‘普男/普女’！">>
                <<set _loss_face to Math.floor(_act.fans.face * 0.1)>> 
                <<set _act.fans.face -= _loss_face>>
                <<set _act.reputation -= 15>>
            <<elseif _bad_roll == 2>>
                <<set _bad_event_type to "evil_edit">>
                <<set $generated_desc to "✂️ <b>恶意剪辑：</b>为了捧皇族，导演把你剪成了弱智反派，全网黑嘲！">>
                <<set _act.topic += 100>> 
                <<set _act.reputation -= 30>> 
                <<set _act.fans.toxic += 500>> 
            <<else>>
                <<set _bad_event_type to "delay">>
                <<set $generated_period += 3>> 
                <<set $generated_desc to "🐌 <b>资金链断裂：</b>投资方跑路，项目无限期延后！(周期+3)" >>
            <</if>>
        <</if>>

        /* 锁定艺人数据 */
        <<set $actors[$target].busy_months to $generated_period>>
        <<set $actors[$target].project_name to $generated_name>>
        <<set $actors[$target].job_type to $type>>

        /* 降级惩罚判定 */
        <<set _penalty_text to "">>
        <<if _gap <= -2>>
            <<set $actors[$target].reputation -= 10>>
            <<set _penalty_text to "<br>📉 <b>降级接戏警告：</b>粉丝觉得太掉价，口碑 -10！">>
        <</if>>

        /* 显示卡片 */
        <div style="background:#ecfdf5; border:2px solid #10b981; color:#065f46; padding:20px; border-radius:8px; text-align:center; width:100%; max-width:500px;">
            
            <<if _bad_event_type neq "none">>
                <div style="font-size:3em; margin-bottom:10px;">🌩️</div>
                <b style="color:#b91c1c; font-size:1.2em;">前途未卜...</b>
            <<else>>
                <div style="font-size:3em; margin-bottom:10px;">🎉</div>
                <b style="font-size:1.2em;"><<print _title_text>>成功！</b>
            <</if>>
            <hr style="border-color:#10b981; opacity:0.3;">
            
            <div style="font-size:1.1em; margin:10px 0;">
                <b>_act.name</b> 确认接下<br>
                <span style="font-size:1.3em; color:#059669;">$generated_name</span>
            </div>
            
            <<if _bad_event_type neq "none">>
                 <div style="background:#fef2f2; border:1px solid #fecaca; padding:10px; border-radius:4px; margin-top:10px; text-align:left;">
                     <span style="color:#b91c1c;">$generated_desc</span>
                 </div>
            <<else>>
                 <div style="background:rgba(255,255,255,0.6); padding:10px; border-radius:4px; margin-top:10px;">
                     <div style="color:#64748b; font-size:0.9em; margin-bottom:5px;">“ $generated_desc ”</div>
                 </div>
            <</if>>

            <div style="margin-top:15px; font-size:1.2em; font-weight:bold; color:#059669;">
                💰 <<print _money_label>>: 
                <span style="font-size:1.2em;">$<<Calc_Income_Preview $target $req_res>> 万</span>
            </div>

            <div style="margin-top:5px; font-family:monospace; color:#047857; font-size:0.9em;">
                 📅 <<print _time_label>>: <b>$generated_period</b> 月 | 🎫 消耗: <b><<print $req_res.toUpperCase()>></b>
            </div>

            <<if _penalty_text neq "">>
                <div style="margin-top:10px; color:#b91c1c; background:#fee2e2; padding:5px; border-radius:4px;">
                    <<print _penalty_text>>
                </div>
            <</if>>

            <br>
            [[✅ 确定 (返回办公室)|Office]]
        </div>
    <</if>>
    </div>

<</if>>
<</nobr>>`
});

/* ---------- 故事块：Job_Precheck_Quick ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Precheck_Quick",
  src: `<<nobr>>

/* 🛠️ Bug修复：进入瞬间锁定当前艺人，防止结算显示错误 */
<<set $current_actor to $target>>

/* --- 1. 锁判定 --- */
<<set _job_check_type to "job_other">>
<<if $type is "drama">><<set _check_type to "job_drama">>
<<elseif $type is "stage">><<set _check_type to "job_stage">>
<</if>>

<<ZP_Check_Lock _check_type>>

/* --- 2. 逻辑分流 --- */
<<if _zp_lock_msg neq "">>
    
    <div class="tech-card" style="padding:40px; text-align:center;">
        <div style="font-size:4em; margin-bottom:20px;">🚫</div>
        <h3 style="color:#ef4444;">无法执行</h3>
        <p>_zp_lock_msg</p>
        <br>
        <<button "🔙 返回" "Work_Center">><</button>>
    </div>

/* 否则，执行正常逻辑 */
<<else>>

    <div class="tech-card" style="min-height: 400px; display:flex; flex-direction:column; justify-content:center; align-items:center;">

    <<set _act to $actors[$target]>>
    <<set _res_map to { s:4, a:3, b:2, c:1 }>>
    <<set _res_level to _res_map[$req_res]>>
    <<set _gap to _res_level - _act.rank_level>>

    /* --- 体力检查 --- */
    <<if $type is "variety" or $type is "fashion">>
        <<set _energy_cost to 15>>
    <<elseif $type is "stage">>
        <<set _energy_cost to 30>>
    <</if>>

    /* 🏟️ 巡回演唱会（S/A 级商演）：每月全公司只能一场 */
    <<set _concert_block to false>>
    <<if $type is "stage">>
        <<if $req_res is "s" or $req_res is "a">>
            <<if ($concert_used || 0) >= 1>><<set _concert_block to true>><</if>>
        <</if>>
    <</if>>

    <<if _concert_block>>
        <div style="background:#fff7ed; border:2px solid #f97316; color:#c2410c; padding:20px; border-radius:8px; text-align:center; max-width:420px;">
            🏟️ <b>演唱会档期已满</b><br><br>
            一个月只能办一场巡回演唱会，这个月已经开过了。<br>
            下个月再来，或者换 B/C 级商演。<br><br>
            <<link "🔙 返回通告中心">><<goto "Work_Center">><</link>>
        </div>
    <<elseif _act.current_energy < _energy_cost>>
         <div style="background:#fef2f2; border:2px solid #ef4444; color:#b91c1c; padding:20px; border-radius:8px; text-align:center;">
            ❌ <b>体力不足！</b><br>需要 _energy_cost 点体力。<br><br>
            <<link "🔙 返回通告中心">><<goto "Work_Center">><</link>>
        </div>
    <<elseif $resources[$req_res] < 1>>
        <div style="background:#fff7ed; border:2px solid #f97316; color:#c2410c; padding:20px; border-radius:8px; text-align:center;">
            ⚠️ <b>资源不足！</b><br>没有 <<print $req_res.toUpperCase()>> 级资源券了。<br><br>
            <<link "🔙 返回通告中心">><<goto "Work_Center">><</link>>
        </div>
    <<elseif _gap >= 2>>
        <div style="background:#f3f4f6; border:2px solid #94a3b8; color:#1e293b; padding:20px; border-radius:8px; text-align:center; max-width:400px;">
            👤 <b>面试被拒</b><br><br>
            经纪人带着 <b>_act.name</b> 去谈 <<print $req_res.toUpperCase()>> 级项目。<br>
            <div style="margin:10px 0; font-style:italic; color:#64748b;">"不好意思，我们需要更有知名度的艺人。"</div>
            @@color:red; (判定：咖位不足)@@<br><br>
            <<link "😤 知道了">><<goto "Work_Center">><</link>>
        </div>
    <<else>>
        /* 生成项目数据 */
        <<Job_Generate $type $req_res>>
        
        /* 扣除消耗 */
        <<set $resources[$req_res] -= 1>>
        <<set $action_points to Math.max(0, ($action_points || 0) - 1)>>
        <<set _act.current_energy -= _energy_cost>>
        
        /* 锁定到当前艺人供结算用 */
        <<set $current_actor = $target>>
        
        /* 存档资源等级 */
        <<set $actors[$target].res_level = $req_res>>
        
        /* 立即跳转到对应结算节点 */
        <<if $type is "variety">>
            <<goto "Job_Variety_Execute">>
        <<elseif $type is "fashion">>
            <<goto "Job_Fashion_Execute">>
        <<elseif $type is "stage">>
            <<goto "Job_Stage_Execute">>
        <</if>>
    <</if>>
    </div>

<</if>>
<</nobr>>`
});

/* ---------- 故事块：Job_Router ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Router",
  src: `/* === 通告分流中心 === */

<<if $type is "drama">>
    /* 1. 拍戏：先去选剧本 (修复 undefined 问题的关键！) */
    /* 对应你截图里的 Job_Drama_Select */
    <<goto "Job_Drama_Select">>

<<elseif $type is "variety">>
    /* 2. 综艺：直接执行 */
    /* 对应你截图里的 Job_Variety_Execute */
    <<goto "Job_Variety_Execute">>

<<elseif $type is "fashion">>
    /* 3. 时尚：直接执行 */
    /* 对应你截图里的 Job_Fashion_Execute */
    <<goto "Job_Fashion_Execute">>

<<elseif $type is "stage">>
    /* 4. 舞台：直接执行 */
    /* 对应你截图里的 Job_Stage_Execute */
    <<goto "Job_Stage_Execute">>

<<else>>
    /* 防报错兜底 */
    错误：未知的通告类型 $type
    [[返回办公室|Office]]
<</if>>`
});

/* ---------- 故事块：Job_Stage_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Stage_Execute",
  src: `<<nobr>>
<div class="tech-card">
    <<set _is_concert to ($req_res is "s" or $req_res is "a")>>
    <<if _is_concert>>
        <<if $req_res is "s">><<set _venue to "体育场巡回">><<else>><<set _venue to "体育馆巡回">><</if>>
    <</if>>
    <div class="header-banner"><span><<if _is_concert>>🏟️ 巡回演唱会结算 · <<print _venue>><<else>>💃 商演舞台结算<</if>></span></div>
    <div style="padding:20px;">
        <<set _a to $actors[$current_actor]>>
        <<if _is_concert>>
            <p><<print _a.name>> 的 <<print _venue>> 开场了，看台坐得满不满，直接决定这一趟赚不赚钱。</p>
        <<else>>
            <p>台下的荧光棒汇成海洋，<<print _a.name>> 享受着欢呼！</p>
        <</if>>
        
        <<Job_Settle "stage">>
        
        <br>
        <div style="text-align:center;">
            <<link "✅ 确定">>
                <<goto "Work_Center">>
            <</link>>
            <span style="margin:0 10px;">|</span>
            <<if _is_concert>>
                <span style="opacity:0.55; font-size:0.85em;">🏟️ 本月的演唱会档期已经用掉了</span>
            <<else>>
                <<link "🎤 再来一场">>
                    <<goto "Work_Center">>
                <</link>>
            <</if>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Job_Variety_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "Job_Variety_Execute",
  src: `<<nobr>>
<div class="tech-card">
    <div class="header-banner"><span>🎤 综艺通告结算</span></div>
    <div style="padding:20px;">
        <<set _a to $actors[$current_actor]>>
        <p><<print _a.name>> 在节目中卖力表现，贡献了不少笑点！</p>
        
        /* 直接结算，体力已在Job_Precheck_Quick中扣除 */
        <<Job_Settle "variety">>
        
        <br>
        <div style="text-align:center;">
            <<link "✅ 确定">>
                <<goto "Work_Center">>
            <</link>>
            <span style="margin:0 10px;">|</span>
            <<link "📺 再接一档">>
                <<goto "Work_Center">>
            <</link>>
        </div>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Visit_Set ---------- */
window.__STORY_PASSAGES.push({
  name: "Visit_Set",
  src: `<<nobr>>
<style>
/* 🎨 V3.0: 现代商务微立体风格 (Subtle Gradient + Depth) */

/* 1. 主容器：极浅灰渐变底纹 */
.visit-container {
    /* 核心修改：从纯白改为极浅的冷灰渐变 */
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    min-height: 500px;
    border-radius: 16px; /* 圆角稍微加大一点 */
    padding: 40px;
    color: #334155;
    border: 1px solid #cbd5e1; /* 边框稍微加深一点点，更有质感 */
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); /* 柔和的大投影 */
    max-width: 800px;
    margin: 0 auto;
}

/* 2. 头部区域 */
.visit-header {
    text-align: center;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(148, 163, 184, 0.2); /* 半透明分割线 */
}

.visit-icon {
    font-size: 3.5em;
    margin-bottom: 10px;
    display: block;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1)); /* 给图标加一点悬浮感 */
}

.visit-title {
    font-size: 1.8em;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
}

.visit-subtitle {
    color: #64748b;
    font-size: 0.95em;
    font-weight: 500;
}

/* 3. 角色标签 (改为纯白卡片) */
.actor-badge {
    display: inline-block;
    background: #ffffff; /* 纯白 */
    color: #475569;
    padding: 6px 16px;
    border-radius: 50px; /* 全圆角胶囊状 */
    font-weight: 600;
    font-size: 0.9em;
    margin-bottom: 25px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 5px rgba(0,0,0,0.03); /* 微弱投影 */
}

/* 4. 探班观察记录卡片（原名 story-card，已改名以免与剧情页大卡片冲突） */
.visit-note {
    background: #ffffff; /* 纯白背景 */
    border-radius: 10px;
    padding: 25px;
    border-left: 5px solid #3b82f6;
    margin-bottom: 30px;
    font-size: 1.05em;
    line-height: 1.8;
    color: #334155;
    text-align: left;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); /* 增加投影 */
    border: 1px solid #f1f5f9;
}

/* 5. 属性网格 */
.effects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 15px;
    margin-top: 20px;
}

.effect-card {
    background: #ffffff; /* 纯白 */
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    border: 1px solid #f1f5f9; /* 极淡边框 */
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    transition: all 0.2s ease;
}

.effect-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
}

.effect-icon {
    font-size: 1.8em;
    margin-bottom: 8px;
    display: block;
}

.effect-label {
    font-size: 0.85em;
    color: #66738C;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.effect-value {
    font-size: 1.2em;
    font-weight: 700;
    font-family: monospace;
}

.positive-value { color: #059669; }
.negative-value { color: #dc2626; }

/* 6. 按钮 */
.action-btn {
    display: inline-block;
    background: #0f172a; /* Slate-900 (接近黑色) */
    color: white;
    padding: 12px 36px;
    border-radius: 8px;
    font-size: 1em;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 30px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.action-btn:hover {
    background: #334155;
    transform: translateY(-2px);
    box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}

/* 7. 错误状态 */
.error-card {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    color: #be123c;
    padding: 40px;
    border-radius: 12px;
    text-align: center;
}
.back-btn {
    display: inline-block;
    background: white;
    color: #334155;
    padding: 10px 24px;
    border-radius: 6px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid #cbd5e1;
    transition: all 0.2s;
    font-size: 0.9em;
}
.back-btn:hover {
    background: #f8fafc;
    border-color: #94a3b8;
}
</style>

<div class="visit-container">
    /* 1. 体力检查 */
    <<if $stamina < 10>>
        <div class="error-card">
            <div style="font-size: 3em; margin-bottom: 15px;">☕</div>
            <div style="font-size: 1.5em; font-weight: 800; margin-bottom: 10px;">需要休息</div>
            <div style="opacity: 0.8; margin-bottom: 25px;">体力不足 (需要 10 点)，请先去休息或补充体力。</div>
            <div>
                <a data-passage="Work_Center" class="back-btn">🔙 返回工作台</a>
            </div>
        </div>
    <<else>>
        /* 2. 扣除体力与恢复 */
        <<set $stamina -= 10>>
        <<set _a to $actors[$current_actor]>>
        <<set _a.current_energy = Math.min(_a.energy, _a.current_energy + 20)>>

        <div class="visit-header">
            <span class="visit-icon">🎬</span>
            <h1 class="visit-title">现场探班日志</h1>
            <div class="visit-subtitle">Work Log: Visit Set</div>
        </div>

        <div style="text-align:center;">
            <div class="actor-badge">
                <<if $current_actor is "zp">>👑 展鹏 · 核心艺人
                <<elseif $current_actor is "qs">>👠 秦飒 · 签约艺人
                <<elseif $current_actor is "huang">>🎭 黄耀祖 · 签约艺人
                <<elseif $current_actor is "liu">>📸 刘梁周 · 签约艺人
                <<else>>✨ 白小纯 · 练习生<</if>>
            </div>
        </div>

        /* --- 🎲 随机生成数值 --- */
        <<set _add_fans to random(100, 300)>>
        <<set _add_rep to random(1, 3)>>
        <<set _add_acting to random(1, 4)>>

        /* --- 🎭 剧情判定逻辑 --- */
        
        <<if $current_actor is "zp">>
            /* 展鹏 */
            <<set _roll to random(1, 3)>>
            <<if _roll is 1>>
               <div class="visit-note"><b>[观察]</b> 展鹏正躲在保姆车里打游戏，看到你来立刻把手机藏到了屁股底下...</div>
               <<set _effect_fans_cp = _add_fans>>
               <<set _effect_icon_cp = "💖">><<set _effect_desc_cp = "CP粉磕到了">>
            <<elseif _roll is 2>>
               <div class="visit-note"><b>[观察]</b> 导演正在讲戏，展鹏虽然听得昏昏欲睡，但看到你在旁边，立刻坐直了身体...</div>
               <<set _effect_energy = 20>>
               <<set _effect_icon_energy = "🔋">><<set _effect_desc_energy = "精力恢复">>
            <<else>>
               <div class="visit-note"><b>[观察]</b> 展鹏今天状态神勇，一场哭戏拍得全场动容，连导演都忍不住鼓掌...</div>
               <<set _effect_fans_career = _add_fans>>
               <<set _effect_rep = 1>>
               <<set _effect_icon_career = "✨">><<set _effect_desc_career = "颜粉狂欢">>
               <<set _effect_icon_rep = "📈">><<set _effect_desc_rep = "剧组称赞">>
            <</if>>

        <<elseif $current_actor is "qs">>
            /* 秦飒 */
            <<set _roll to random(1, 3)>>
            <<if _roll is 1>>
                <div class="visit-note"><b>[观察]</b> 秦飒嫌弃戏服的版型有问题，正在亲自上手改衣服，气场两米八...</div>
                <<set _effect_rep = _add_rep>>
                <<set _effect_icon_rep = "👠">><<set _effect_desc_rep = "危机解除">>
            <<elseif _roll is 2>>
                <div class="visit-note"><b>[观察]</b> 秦飒拍扇耳光的戏太入戏，手滑真打了对手演员，正在尴尬地道歉...</div>
                <<set _add_acting to Math.min(_add_acting, _a.limit_acting - _a.acting)>>
                <<set _effect_acting = _add_acting>>
                <<set _effect_icon_acting = "🎬">><<set _effect_desc_acting = "演技炸裂">>
            <<else>>
                <div class="visit-note"><b>[观察]</b> 连续拍了10个小时大夜戏，秦飒累得在椅子上睡着了，手里还紧紧抓着剧本...</div>
                <<set _effect_energy = 10>>
                <<set _effect_icon_energy = "💤">><<set _effect_desc_energy = "她真的很拼">>
            <</if>>

        <<elseif $current_actor is "huang">>
            /* 黄耀祖 */
            <<set _roll to random(1, 3)>>
            <<if _roll is 1>>
                <div class="visit-note"><b>[观察]</b> 黄耀祖正在休息区给全剧组发咖啡，点头哈腰的样子既心酸又熟练...</div>
                <<set _effect_rep = _add_rep>>
                <<set _effect_icon_rep = "🙏">><<set _effect_desc_rep = "懂事得让人心疼">>
            <<elseif _roll is 2>>
                <div class="visit-note"><b>[观察]</b> 黄耀祖试图模仿展鹏的招牌微笑，结果因为太僵硬，被路透发到网上做成了表情包...</div>
                <<set _effect_fans_clown = _add_fans>>
                <<set _effect_icon_clown = "🤡">><<set _effect_desc_clown = "乐子人+1">>
            <<else>>
                <div class="visit-note"><b>[观察]</b> 虽然只是个替身戏份，但黄耀祖在角落里把动作练了整整一百遍，汗水湿透了背心...</div>
                <<set _add_acting to Math.min(_add_acting, _a.limit_acting - _a.acting)>>
                <<set _effect_acting = _add_acting>>
                <<set _effect_icon_acting = "🔥">><<set _effect_desc_acting = "笨鸟先飞">>
            <</if>>

        <<elseif $current_actor is "liu">>
            /* 刘梁周 */
            <<set _roll to random(1, 3)>>
            <<if _roll is 1>>
                <div class="visit-note"><b>[观察]</b> 刘梁周觉得现场布光太丑，忍不住职业病发作，跑去和灯光师讨论了半小时...</div>
                <<set _effect_rep = _add_rep>>
                <<set _effect_icon_rep = "💡">><<set _effect_desc_rep = "专业度认可">>
            <<elseif _roll is 2>>
                <div class="visit-note"><b>[观察]</b> 刘梁周只是随便往那里一站，清冷的气质就让监视器前的导演大喊“绝了”...</div>
                <<set _effect_fans_face = _add_fans>>
                <<set _effect_icon_face = "📸">><<set _effect_desc_face = "神图出圈">>
            <<else>>
                <div class="visit-note"><b>[观察]</b> 刘梁周抱着相机在角落里睡着了，阳光洒在他脸上，美得像一幅油画...</div>
                <<set _effect_energy = 15>>
                <<set _effect_icon_energy = "🖼️">><<set _effect_desc_energy = "岁月静好">>
            <</if>>

        <<else>>
            /* 白小纯 */
            <<set _roll to random(1, 3)>>
            <<if _roll is 1>>
                <div class="visit-note"><b>[观察]</b> 白小纯正在帮剧务搬道具，力气大得吓人，完全没有女明星的架子...</div>
                <<set _effect_rep = _add_rep>>
                <<set _effect_icon_rep = "🥺">><<set _effect_desc_rep = "太懂事了">>
            <<elseif _roll is 2>>
                <div class="visit-note"><b>[观察]</b> 白小纯被导演骂哭了，一边抹眼泪一边鞠躬，看得旁边的工作人员母爱泛滥...</div>
                <<set _effect_fans_mom = _add_fans>>
                <<set _effect_icon_mom = "🤱">><<set _effect_desc_mom = "激起保护欲">>
            <<else>>
                <div class="visit-note"><b>[观察]</b> 白小纯对着空气练台词，虽然还是有点像背课文，但比昨天自然多了...</div>
                <<set _add_acting to Math.min(_add_acting, _a.limit_acting - _a.acting)>>
                <<set _effect_acting = _add_acting>>
                <<set _effect_icon_acting = "📈">><<set _effect_desc_acting = "演技进步">>
            <</if>>
        <</if>>

        /* --- 效果展示 --- */
        <div>
            <div style="font-size:0.8em; color:#94a3b8; text-transform:uppercase; margin-bottom:10px; letter-spacing:1px; font-weight:600;">本次结果</div>
            <div class="effects-grid">
                /* 1. CP粉 */
                <<if def _effect_fans_cp>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_cp>></span>
                        <div class="effect-label">CP粉</div>
                        <div class="effect-value positive-value">+<<print _effect_fans_cp>></div>
                        <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_cp>></div>
                        <<set _a.fans.cp += _effect_fans_cp>>
                    </div>
                <</if>>
                
                /* 2. 事业粉 */
                <<if def _effect_fans_career>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_career>></span>
                        <div class="effect-label">事业粉</div>
                        <div class="effect-value positive-value">+<<print _effect_fans_career>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_career>></div>
                        <<set _a.fans.career += _effect_fans_career>>
                    </div>
                <</if>>
                
                /* 3. 妈粉 */
                <<if def _effect_fans_mom>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_mom>></span>
                        <div class="effect-label">妈粉</div>
                        <div class="effect-value positive-value">+<<print _effect_fans_mom>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_mom>></div>
                        <<set _a.fans.mom += _effect_fans_mom>>
                    </div>
                <</if>>

                /* 4. 颜粉 */
                <<if def _effect_fans_face>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_face>></span>
                        <div class="effect-label">颜粉</div>
                        <div class="effect-value positive-value">+<<print _effect_fans_face>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_face>></div>
                        <<set _a.fans.face += _effect_fans_face>>
                    </div>
                <</if>>

                /* 5. 乐子人 */
                <<if def _effect_fans_clown>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_clown>></span>
                        <div class="effect-label">乐子人</div>
                        <div class="effect-value positive-value">+<<print _effect_fans_clown>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_clown>></div>
                        <<set _a.fans.clown += _effect_fans_clown>>
                    </div>
                <</if>>
                
                /* 6. 口碑 */
                <<if def _effect_rep>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_rep>></span>
                        <div class="effect-label">口碑</div>
                        <div class="effect-value positive-value">+<<print _effect_rep>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_rep>></div>
                        <<set _a.reputation += _effect_rep>>
                    </div>
                <</if>>
                
                /* 7. 演技 */
                <<if def _effect_acting>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_acting>></span>
                        <div class="effect-label">演技</div>
                        <div class="effect-value positive-value">+<<print _effect_acting>></div>
                         <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_acting>></div>
                        <<set _a.acting += _effect_acting>>
                    </div>
                <</if>>
                
                /* 8. 精力 */
                <<if def _effect_energy>>
                    <div class="effect-card">
                        <span class="effect-icon"><<print _effect_icon_energy>></span>
                        <div class="effect-label">精力</div>
                        <div class="effect-value positive-value">+<<print _effect_energy>></div>
                        <div style="font-size:0.8em; color:#64748b; margin-top:5px;"><<print _effect_desc_energy>></div>
                    </div>
                <</if>>
            </div>
        </div>

        <div style="text-align: center; margin-top: 50px;">
            <a data-passage="Work_Center" class="action-btn">
                确认并存档
            </a>
        </div>
    <</if>>
</div>
<</nobr>>`
});

/* ---------- 故事块：Work_Center ---------- */
window.__STORY_PASSAGES.push({
  name: "Work_Center",
  src: `<<nobr>>
<div class="tech-card">
  <div class="header-banner" style="padding: 10px 20px;">
    <span>📋 通告中心</span>
  </div>

  <div style="padding: 20px;">
    
    /* 资源库存条 */
    <<silently>>
      <<set _res_s = $resources.s>>
      <<set _res_a = $resources.a>>
      <<set _res_b = $resources.b>>
      <<set _res_c = $resources.c>>
    <</silently>>
    
    <div style="background:#1e293b; color:#fff; padding:12px 20px; border-radius:8px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; font-family: 'Arial Black', 'Microsoft YaHei', sans-serif; font-weight:900; font-size:1.25em; letter-spacing:1px; box-shadow:0 4px 6px rgba(0,0,0,0.1);">
      <span style="opacity:0.6; font-size:0.8em; font-weight:normal;">资源库存 ➔</span>
      <div style="display:flex; gap:20px;">
        <span style="color:#fbbf24; text-shadow:0 0 10px rgba(251, 191, 36, 0.3);">S: <<print _res_s>></span>
        <span style="color:#e879f9">A: <<print _res_a>></span>
        <span style="color:#60a5fa">B: <<print _res_b>></span>
        <span style="color:#94a3b8">C: <<print _res_c>></span>
      </div>
    </div>

    /* 行动点 */
    <<if $action_points <= 0>>
    <div style="background:#fff7ed; border:1px solid #fdba74; color:#c2410c; padding:11px 15px; border-radius:9px; margin-bottom:18px; text-align:center; font-size:0.9em;">
      🎯 本月行动点已经用完了 —— 还能做「组局 / 买资源 / 探班 / 休息」，下个月恢复 8 点
    </div>
    <<else>>
    <div style="display:flex; align-items:center; gap:6px; justify-content:flex-end; margin-bottom:14px; font-size:0.85em; color:#5C6880;">
      <span>🎯 本月行动点</span>
      <b style="color:#2F4A7C; font-size:1.1em;">$action_points</b>
      <span style="color:#8A96AB;">/ 8</span>
    </div>
    <</if>>

    /* 构建动态艺人列表 */
    <<set _actor_keys to []>>
    
    /* 判断当前阶段：是否有黄耀祖 */
    <<if $has_signed_huang is true>>
        /* --- 阶段二：新血换旧血 --- */
        <<run _actor_keys.push("huang")>>
        <<if $has_signed_liu is true>><<run _actor_keys.push("liu")>><</if>>
        <<run _actor_keys.push("qs")>>
        <<run _actor_keys.push("new")>>
    <<else>>
        /* --- 阶段一：展鹏还在 --- */
        <<set _actor_keys to ["zp", "qs", "new"]>>
    <</if>>
    
    /* 开始循环生成卡片 */
    <<for _key range _actor_keys>>
      <<capture _key>> 
      <<set _act to $actors[_key]>>
      
      /* 🛡️ 安全补丁 */
      <<if def _act>>

      /* =====================================
         ⚡ 核心逻辑计算：体力与状态
         ===================================== */
      <<set _is_filming to false>>
      /* 判定是否正在拍戏 (有工期 且 不是培训 且 不是封杀 且 不是产假) */
      <<if _act.busy_months > 0 and _act.job_type neq "banned" and _act.job_type neq "training" and _act.job_type neq "maternity_leave">>
          <<set _is_filming to true>>
      <</if>>

      /* 计算可用体力：如果拍戏，扣除100占用值 */
      <<set _real_energy to _act.current_energy>>
      <<if _is_filming>>
          <<set _real_energy to _act.current_energy - 100>>
      <</if>>
        
      <div class="actor-mini-card" style="margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1;">
        
        /* 1. 艺人头部信息 */
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
          <div style="font-size:1.1em;">
             <span style="font-size:1.3em;">👤</span> <b><<print _act.name>></b> 
             <span style="font-size:0.8em; color:#fff; background:#94a3b8; padding:2px 6px; border-radius:4px; margin-left:5px;"><<print _act.rank_label>></span>
             
             /* 🟢 口碑标签 */
             <<if _act.reputation < 20>>
                 <span style="font-size:0.8em; color:#fff; background:#ef4444; padding:2px 6px; border-radius:4px; margin-left:5px;">口碑崩盘</span>
             <<else>>
                 <span style="font-size:0.8em; color:#fff; background:#10b981; padding:2px 6px; border-radius:4px; margin-left:5px;">口碑: <<print _act.reputation>></span>
             <</if>>

             /* 🎥 拍摄中标签 (新增) */
             <<if _is_filming>>
                <span style="font-size:0.8em; color:#fff; background:#f97316; padding:2px 6px; border-radius:4px; margin-left:5px;">🎥 拍摄中 (剩<<print _act.busy_months>>月)</span>
             <</if>>
          </div>

          /* ⚡ 体力显示 (带占用提示) */
          <div style="font-size:0.9em; color:#059669; background:#ecfdf5; padding:4px 8px; border-radius:20px; border:1px solid #a7f3d0;">
            <<if _is_filming>>
                ⚡ 可用: <b><<print _real_energy>></b> (总<<print _act.current_energy>> | 🎥占用100)
            <<else>>
                ⚡ 体力: <b><<print _act.current_energy>></b> / <<print _act.energy>>
            <</if>>
          </div>
        </div>

        /* =========================================================
           状态优先级判断
           1. 产假全锁 (BLOCK)
           2. 被封杀 (BLOCK)
           3. 培训中 (BLOCK)
           4. 口碑崩盘 (BLOCK)
           5. 正常/拍戏中 (ALLOW - 拍戏只是占用体力)
           ========================================================= */
        
        /* 1. 产假全锁判定 (仅展鹏) */
        <<set _is_maternity_locked to false>>
        <<if _key is "zp" and (($zp_preg.state is 1 and $zp_preg.month >= 7) or ($zp_preg.state is 2 and $zp_preg.month <= 2))>>
             <<set _is_maternity_locked to true>>
        <</if>>

        <<if _is_maternity_locked>>
             /* --- [BLOCK] 产假 --- */
             <div style="background:#fff0f5; border:2px solid #f472b6; padding:20px; border-radius:8px; text-align:center; color:#db2777;">
                <div style="font-size:2em; margin-bottom:10px;">🤰 全封闭产假中</div>
                <div style="font-size:1em; opacity:0.8; margin-bottom:15px;">( 专心养胎/坐月子，暂停一切工作 )</div>
                <div style="font-weight:bold; font-size:1.1em; background:rgba(255,255,255,0.5); padding:10px; border-radius:6px; display:inline-block;">
                    <<if $zp_preg.state is 1>>当前: 孕期第 $zp_preg.month 月<<else>>当前: 产后第 $zp_preg.month 月<</if>>
                </div>
            </div>

        <<elseif _act.busy_months > 0 and _act.job_type is "banned">>
            /* --- [BLOCK] 被封杀 --- */
            <div style="background:#fef2f2; border:2px solid #ef4444; padding:20px; border-radius:8px; text-align:center; color:#b91c1c;">
                <div style="font-size:2em; margin-bottom:10px;">❄️ 无事可做</div>
                <div style="font-size:1em; opacity:0.8; margin-bottom:15px;">( 口碑崩盘，遭到全网抵制 )</div>
                <div style="font-weight:bold; font-size:1.1em; margin-bottom:15px;">
                    剩余刑期: <<print _act.busy_months>> 个月
                </div>
            </div>

        <<elseif _act.busy_months > 0 and _act.job_type is "training">>
            /* --- [BLOCK] 培训中 --- */
             <div style="background:#eff6ff; border:2px solid #60a5fa; padding:20px; border-radius:8px; text-align:center; color:#1e40af;">
                <div style="font-size:2em; margin-bottom:10px;">🎓 封闭培训中</div>
                <div style="font-size:1em; opacity:0.8;">( 正在闭关修炼，谢绝打扰 )</div>
            </div>

        <<elseif _act.reputation < 20>>
            /* --- [BLOCK] 口碑崩盘 --- */
            <div style="background:#fff1f2; border:2px solid #f43f5e; padding:25px; border-radius:8px; text-align:center; color:#9f1239;">
                <div style="font-size:3em; margin-bottom:10px;">📉</div>
                <div style="font-size:1.5em; font-weight:900; margin-bottom:10px;">口碑崩盘警告</div>
                <div style="font-size:1em; opacity:0.9; margin-bottom:20px; line-height:1.6;">
                    由于 <b><<print _act.name>></b> 近期负面新闻过多（口碑 < 20），<br>
                    没有任何资方愿意与其合作，所有通告已被撤回。
                </div>
                <div style="background:rgba(255,255,255,0.6); padding:10px 20px; border-radius:50px; display:inline-block; border:1px solid #fda4af;">
                    <<link "📢 前往公关部修复口碑 >">>
                        <<goto "Marketing_Center">>
                    <</link>>
                </div>
            </div>

        <<else>>
            /* --- [ALLOW] 正常接单 / 轧戏模式 --- */
            
            /* 提示：产后恢复期 */
            <<if _key is "zp" and $zp_preg.state is 2 and $zp_preg.month >= 3 and $zp_preg.month < 6>>
                <div style="background:#f0fdf4; color:#166534; padding:8px; border:1px solid #bbf7d0; border-radius:6px; margin-bottom:15px; font-size:0.9em; text-align:center;">
                    🍼 <b>产后恢复期：</b>仅解锁综艺、时尚、培训。影视/舞台仍需静养。
                </div>
            <</if>>
            
            /* 提示：轧戏警告 + 探班入口 */
            <<if _is_filming>>
                <div style="background:#fff7ed; color:#c2410c; padding:15px; border:1px solid #fdba74; border-radius:8px; margin-bottom:15px; text-align:center;">
                    <div style="margin-bottom:10px;">
                        🎬 <b>轧戏模式开启：</b> 艺人正在剧组拍摄，体力已占用 100 点。<br>
                        <span style="font-size:0.9em; opacity:0.8">无法接新戏，但可以利用剩余体力接其他通告。</span>
                    </div>
                    
                    /* 🔴 探班按钮回归 */
                    <div style="background:#fff; border:1px solid #fdba74; color:#ea580c; padding:5px 15px; border-radius:20px; display:inline-block; font-weight:bold; cursor:pointer;">
                        <<link "🚗 前往探班 (消耗10体力)">>
                            <<set $current_actor = _key>>
                            <<goto "Visit_Set">>
                        <</link>>
                    </div>
                </div>
            <</if>>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 20px 30px;">
                /* [格1] 影视 - 如果正在拍戏(_is_filming)，则禁用 */
                <div>
                    <div style="font-size:0.85em; color:#64748b; margin-bottom:5px; font-weight:bold;">🎬 影视剧本</div>
                    <div class="res-btn-group">
                      <<for _res range ["s", "a", "b", "c"]>>
                         <<capture _res>>
                             /* 判定：有资源 且 没在拍戏 */
                             <<if $resources[_res] > 0 and _is_filming is false and $action_points > 0>>
                                 <<link _res.toUpperCase()>><<set $target = _key>><<set $req_res = _res>><<set $type = "drama">><<goto "Job_Drama_Select">><</link>>
                             <<else>>
                                 <span><<print _res.toUpperCase()>></span>
                             <</if>>
                         <</capture>>
                      <</for>>
                    </div>
                 </div>

                /* [格2] 综艺 - 使用 _real_energy 判定 */
                <div>
                    <div style="font-size:0.85em; color:#64748b; margin-bottom:5px; font-weight:bold;">🎤 综艺通告</div>
                    <div class="res-btn-group">
                      <<for _res range ["s", "a", "b", "c"]>>
                        <<capture _res>>
                          <<if $resources[_res] > 0 and _real_energy >= 15 and $action_points > 0>>
                              <<link _res.toUpperCase()>><<set $target = _key, $type = "variety", $req_res = _res>><<goto "Job_Precheck_Quick">><</link>>
                          <<else>>
                              <span><<print _res.toUpperCase()>></span>
                          <</if>>
                        <</capture>>
                      <</for>>
                    </div>
                </div>

                /* [格3] 时尚 - 使用 _real_energy 判定 */
                <div>
                     <div style="font-size:0.85em; color:#64748b; margin-bottom:5px; font-weight:bold;">👠 时尚资源</div>
                    <div class="res-btn-group">
                      <<for _res range ["s", "a", "b", "c"]>>
                        <<capture _res>>
                          <<if $resources[_res] > 0 and _real_energy >= 15 and $action_points > 0>>
                              <<link _res.toUpperCase()>><<set $target = _key, $type = "fashion", $req_res = _res>><<goto "Job_Precheck_Quick">><</link>>
                          <<else>>
                              <span><<print _res.toUpperCase()>></span>
                          <</if>>
                        <</capture>>
                      <</for>>
                    </div>
                </div>

                /* [格4] 舞台 - 使用 _real_energy 判定 */
                <div>
                    <div style="font-size:0.85em; color:#64748b; margin-bottom:5px; font-weight:bold;">💃 商演舞台 <span style="font-weight:normal; opacity:0.75;">· S/A 为巡回演唱会（每月一场）</span></div>
                    <div class="res-btn-group">
                      <<for _res range ["s", "a", "b", "c"]>>
                        <<capture _res>>
                          /* 舞台通常需要更多体力，这里假设需要30，如果_real_energy不够则变灰 */
                          /* 🏟️ S/A 是巡回演唱会：本月已经开过一场就锁死 */
                          <<set _concert_locked to false>>
                          <<if ($concert_used || 0) >= 1>>
                              <<if _res is "s" or _res is "a">><<set _concert_locked to true>><</if>>
                          <</if>>
                          <<if $resources[_res] > 0 and _real_energy >= 30 and $action_points > 0 and _concert_locked is false>>
                              <<link _res.toUpperCase()>><<set $target = _key, $type = "stage", $req_res = _res>><<goto "Job_Precheck_Quick">><</link>>
                          <<else>>
                              <span><<print _res.toUpperCase()>></span>
                          <</if>>
                        <</capture>>
                      <</for>>
                    </div>
                </div>
            </div>
        <</if>>

      </div>
      
      /* 安全检查的结束标签 */
      <</if>> 
      
      <</capture>>
    <</for>>

    <div style="text-align:center; margin-top: 30px;">
      <<link "🔙 返回办公室">>
        <<goto "Office">>
      <</link>>
    </div>
  </div>
</div>
<</nobr>>`
});
