/* ===========================================================================
   ⑨ 商务：买资源 / 买流量 / 狗仔 / 情报库 / 秘密基地
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

/* ---------- 故事块：Buy_Gossip ---------- */
window.__STORY_PASSAGES.push({
  name: "Buy_Gossip",
  src: `<<nobr>>
<div class="tech-card">
    <div class="header-banner"><span>📡 正在联络狗仔...</span></div>
    <div style="padding:30px; text-align:center;">
        <<set $money -= 30>>
        <<set $stamina -= 10>>
        
        /* 调用 Widget 生成瓜 */
        <<Generate_Gossip>>
        
        <div style="font-size:4em; margin-bottom:20px;">📸</div>
        <p>你支付了 30万 信息费，消耗了 10点体力。</p>
        <p>狗仔发来了一个加密文档...</p>
        
        <div style="background:#f1f5f9; padding:15px; border-radius:8px; margin:20px auto; max-width:400px; font-weight:bold;">
            <<print $last_gossip.label>>：<<print $last_gossip.desc>>
        </div>
        
        <br>
        [[📥 收录进档案库|Gossip_Center]]
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Buy_Resource ---------- */
window.__STORY_PASSAGES.push({
  name: "Buy_Resource",
  src: `<div class="tech-card-business">
    <h3 style="border-left: 5px solid #0f172a; padding-left: 10px;">🏢 商务拓展中心</h3>
    
    /* 顶部状态栏 */
    <div style="background:#fff; border-radius:8px; padding:15px 20px; display:flex; justify-content:space-between; align-items:center; margin-bottom:25px; border: 1px solid #e2e8f0; box-shadow:0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="font-size:1em;">
            <div style="margin-bottom:8px; display:flex; align-items:center;">
                <span style="font-size:1.2em; margin-right:5px;">💰</span> 
                资金: <span style="font-weight:bold; font-size:1.2em; margin-left:5px;">$money</span> <span style="font-size:0.9em; margin-left:2px;">万</span>
            </div>
            <div style="display:flex; align-items:center;">
                <span style="font-size:1.2em; margin-right:5px;">⚡</span> 
                体力: <span style="font-weight:bold; color:#0ea5e9; font-size:1.1em; margin:0 5px;">$stamina</span> / 100
            </div>
        </div>
        <div style="text-align:right;">
            <div class="res-header-label">
                <span style="font-size:1.3em; margin-right:6px;">🗃️</span> 资源库存总览
            </div>
            <div>
                <span class="res-rank-base res-s">S: $resources.s</span>
                <span class="res-rank-base res-a">A: $resources.a</span>
                <span class="res-rank-base res-b">B: $resources.b</span>
                <span class="res-rank-base res-c">C: $resources.c</span>
            </div>
        </div>
    </div>
    
    <div class="card-container">

        /* --- 模块1：资本采购 --- */
        <div class="sub-card">
            <h4 style="margin-top:0; color:#b45309; border-bottom: 1px solid #e5e7eb; padding-bottom:10px; margin-bottom:10px;">
                👑 资本直购
            </h4>
            <div class="text-muted" style="font-size:0.9em; margin-bottom: 15px;">
                溢价购买，消耗资金和体力。
            </div>
            
            <div style="margin-top:auto;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:#f8fafc; padding:8px; border-radius:4px; border:1px solid #f1f5f9;">
                    <span>📄 <b>C级包</b> (5个)</span>
                    <<if $money >= 120 and $stamina >= 10>>
                        <<button "¥120万 (-10体力)">>
                             <<set $money -= 120>><<set $stamina -= 10>>
                             <<set $resources.c += 5>>
                             <<set $last_gained_res to "c">><<set $last_gained_count to 5>>
                             <<goto "Resource_Get">>
                        <</button>>
                    <<else>>
                        <span style="color:#94a3b8; font-size:0.8em;">条件不足</span>
                    <</if>>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:#f8fafc; padding:8px; border-radius:4px; border:1px solid #f1f5f9;">
                    <span>📜 <b>B级</b> (1个)</span>
                    <<if $money >= 60 and $stamina >= 10>>
                        <<button "¥60万 (-10体力)">>
                             <<set $money -= 60>><<set $stamina -= 10>>
                             <<set $resources.b += 1>>
                             <<set $last_gained_res to "b">><<set $last_gained_count to 1>>
                             <<goto "Resource_Get">>
                        <</button>>
                    <<else>>
                        <span style="color:#94a3b8; font-size:0.8em;">条件不足</span>
                    <</if>>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:8px; border-radius:4px; border:1px solid #f1f5f9;">
                    <span>⭐ <b>A级</b> (1个)</span>
                    <<if $money >= 160 and $stamina >= 10>>
                        <<button "¥160万 (-10体力)">>
                             <<set $money -= 160>><<set $stamina -= 10>>
                             <<set $resources.a += 1>>
                             <<set $last_gained_res to "a">><<set $last_gained_count to 1>>
                             <<goto "Resource_Get">>
                        <</button>>
                    <<else>>
                        <span style="color:#94a3b8; font-size:0.8em;">条件不足</span>
                    <</if>>
                </div>
            </div>
        </div>

        /* --- 模块2：人脉组局 (体力消耗调整) --- */
        <div class="sub-card">
            <h4 style="margin-top:0; color:#be185d; border-bottom: 1px solid #e5e7eb; padding-bottom:10px; margin-bottom:10px;">
                🍷 社交酒局
            </h4>
            <div class="text-muted" style="font-size:0.9em; margin-bottom: 15px;">
                消耗体力组局，<span style="color:#db2777; font-weight:bold;">概率抽卡</span>。
            </div>
            
            <div style="margin-top:auto;">
                /* 普通饭局 */
                <div style="background:#fff1f2; padding:10px; border-radius:5px; margin-bottom:10px; border:1px solid #fecdd3;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                        <span style="color:#881337; font-weight:bold;">普通饭局</span>
                        <span style="color:#9f1239; font-size:0.8em;">-25 体力</span>
                    </div>
                    <div style="font-size:0.7em; color:#9f1239; margin-bottom:5px; opacity:0.8;">
                        (概率: S 3% | A 12% | B 35% | C 50%)
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#9f1239; font-size:0.9em;">¥40万/次</span>
                        <<if $money >= 40 and $stamina >= 25>>
                            <<button "🎲 组局 (B/C级为主)">>
                                <<Social_Gacha 40 "normal">>
                                <<goto "Resource_Get">>
                            <</button>>
                        <<else>>
                             <span style="color:#94a3b8; font-size:0.8em;">条件不足</span>
                        <</if>>
                    </div>
                </div>

                /* 高端晚宴 (体力消耗增加到 50) */
                <div style="background:#fdf2f8; padding:10px; border-radius:5px; border:1px solid #fbcfe8;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                        <span style="color:#db2777; font-weight:bold;">✨ 商务晚宴</span>
                        <span style="color:#db2777; font-size:0.8em; font-weight:bold;">-50 体力</span>
                    </div>
                    <div style="font-size:0.7em; color:#be185d; margin-bottom:5px; opacity:0.8;">
                        (概率: S 8% | A 30% | B 40% | C 22%)
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="color:#db2777; font-size:0.9em;">¥160万/次</span>
                        /* 检查条件修改为 >= 50 */
                        <<if $money >= 160 and $stamina >= 50>>
                            <<button "🥂 请柬 (A级概率UP)">>
                                <<Social_Gacha 160 "high">>
                                <<goto "Resource_Get">>
                            <</button>>
                        <<else>>
                             <span style="color:#94a3b8; font-size:0.8em;">条件不足</span>
                        <</if>>
                    </div>
                </div>
            </div>
        </div>

        /* --- 模块3：资源置换 --- */
        <div class="sub-card">
            <h4 style="margin-top:0; color:#b91c1c; border-bottom: 1px solid #e5e7eb; padding-bottom:10px; margin-bottom:10px;">
                🤝 资源置换
            </h4>
            <div class="text-muted" style="font-size:0.9em; margin-bottom: 15px;">
                用<span style="color:#d97706; font-weight:bold;">🟡机密情报</span>作为筹码，<span style="color:#b45309; font-weight:bold;">额外支付160万</span>，换取顶级资源。
            </div>
            
            <div style="margin-top:auto; text-align:center; padding:15px; background:#fef2f2; border-radius:5px; border:1px solid #fee2e2;">
                <div style="font-size:1.2em; font-weight:bold; color:#b45309; margin-bottom:5px;">S级 顶级大饼</div>
                <div style="font-size:0.9em; color:#7f1d1d; margin-bottom:15px;">
                    消耗: 机密情报x1 + 20体力 + <span style="color:#b91c1c; font-weight:bold;">160万资金</span>
                </div>
                <div style="font-size:0.8em; color:#059669; margin-bottom:15px; background:#dcfce7; padding:5px; border-radius:4px;">
                    ✨ <b>定向获取：</b>只要有机密情报，必得S级资源！
                </div>
                
                <<set _has_secret to $gossips.some(g => g.type === 'gold')>>
                
                 <<if _has_secret and $stamina >= 20 and $money >= 160>>
                    <<button "🤫 确认置换 (160万)">>
                        <<Trade_Secret_For_Res>>
                        <<goto "Resource_Get">>
                      <</button>>
                <<else>>
                    <<if !_has_secret>>
                        <div style="color:#ef4444; font-size:0.85em; background:rgba(255,255,255,0.5); padding:5px; border-radius:4px;">⛔ 暂无机密情报</div>
                    <<elseif $money < 500>>
                        <div style="color:#ef4444; font-size:0.85em;">⛔ 资金不足 (需160万)</div>
                    <<else>>
                        <div style="color:#ef4444; font-size:0.85em;">⛔ 体力不足</div>
                    <</if>>
                <</if>>
            </div>
        </div>
        
    </div>

    <div style="margin-top:30px; text-align:center;">
        <<button "🔙 返回办公室">>
            <<goto "Office">>
        <</button>>
    </div>
</div>`
});

/* ---------- 故事块：Buy_Traffic ---------- */
window.__STORY_PASSAGES.push({
  name: "Buy_Traffic",
  src: `<<if $money >= $buy_cost>>
    <<set $money -= $buy_cost>>
    <<set $traffic += $buy_amount>>
    
    <div class="tech-card" style="text-align:center; padding:30px;">
        <div style="font-size:3em; margin-bottom:10px;">✅</div>
        <h3 style="color:#059669;">交易成功</h3>
        <p>资金 <span style="color:#ef4444;">-$buy_cost 万</span> | 流量 <span style="color:#2563eb;">+$buy_amount</span></p>
        
        <div style="background:#f1f5f9; padding:10px; border-radius:4px; margin-top:20px; color:#475569;">
            当前余额: <b>$money 万</b><br>
            流量储备: <b>$traffic</b>
        </div>
        
        <br><br>
        <div style="display:flex; justify-content:center; gap:20px;">
            [[🔙 继续采购|Public_Relations]]
            [[⚔️ 去搞事情 (公关部)|Marketing_Center]]
        </div>
    </div>
<<else>>
    <div class="tech-card" style="text-align:center; padding:30px; border-top: 5px solid #ef4444;">
        <div style="font-size:3em; margin-bottom:10px;">💸</div>
        <h3 style="color:#ef4444;">余额不足</h3>
        <p>公司账面资金不足，无法支付水军费用。</p>
        <p style="color:#64748b;">需要: $buy_cost 万 | 拥有: $money 万</p>
        <br><br>
        [[🔙 返回|Public_Relations]]
    </div>
<</if>>`
});

/* ---------- 故事块：Gossip_Center ---------- */
window.__STORY_PASSAGES.push({
  name: "Gossip_Center",
  src: `<<nobr>>
<div class="tech-card">
    <div class="header-banner" style="background:linear-gradient(135deg, #1e293b, #0f172a); border-bottom:4px solid #6366f1;">
        <span>🕵️‍♀️ 圈内情报交易所</span>
        <span style="font-size:0.8em; opacity:0.8;">资金: $money万 | 流量池: $traffic | 体力: $stamina</span>
    </div>

    <div style="padding:20px; display:grid; grid-template-columns: 1fr 1fr; gap:20px;">
        
        /* --- 左侧：狗仔联络站 (买瓜) --- */
        <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:15px;">
            <div style="color:#0f172a; font-weight:bold; margin-bottom:10px; border-bottom:2px solid #94a3b8; padding-bottom:5px;">
                📡 搜寻情报
            </div>
            
            <div style="font-size:0.95em; color:#020617; margin-bottom:15px; line-height:1.6; font-weight:500;">
                联系业内的狗仔、代拍、营销号，获取第一手黑料或内幕。<br>
                <span style="color:#ef4444; font-size:0.9em;">⚠️ 需要消耗：30万资金 + 10点体力</span>
            </div>

  <div style="text-align:center;">
    <<if $money >= 30 and $stamina >= 10>>
        <div data-passage="Buy_Gossip" 
             style="cursor:pointer; font-size:1em; padding:12px 30px; background:linear-gradient(to bottom, #3b82f6, #2563eb); border-radius:6px; box-shadow:0 4px 6px rgba(37,99,235,0.3); color:#ffffff; font-weight:bold; transition:transform 0.1s;">
            💸 购买情报
        </div>
    <<elseif $money < 30>>
        <div style="background:#e2e8f0; color:#475569; padding:10px; border-radius:6px; font-weight:bold; border:1px solid #cbd5e1;">
            🚫 资金不足 (需30万)
        </div>
    <<else>>
        <div style="background:#e2e8f0; color:#475569; padding:10px; border-radius:6px; font-weight:bold; border:1px solid #cbd5e1;">
            🚫 体力不足 (需10体力)
        </div>
    <</if>>
</div>
            
            /* --- 概率公示 (已更新为：50/30/14/6) --- */
            <div style="margin-top:20px; font-size:0.9em; color:#334155; background:#fff; border:1px solid #cbd5e1; padding:12px; border-radius:8px;">
                <b style="color:#000;">📊 购买概率公示：</b><br>
                <div style="margin-top:5px; line-height:1.6;">
                    <span style="color:#16a34a; font-weight:bold;">●</span> 圈内趣闻 (50%)<br>
                    <span style="color:#3b82f6; font-weight:bold;">●</span> 行业黑料 (30%)<br>
                    <span style="color:#ef4444; font-weight:bold;">●</span> 塌房实锤 (14%)<br>
                    <span style="color:#eab308; font-weight:bold;">●</span> 商业机密 (6%)
                </div>
                <div style="font-size:0.8em; color:#64748b; margin-top:5px; border-top:1px dashed #cbd5e1; padding-top:5px;">
                    *每月自动掉落的情报品质略低<br>
                    (绿60% / 蓝25% / 红12% / 金3%)
                </div>
            </div>
        </div>

        /* --- 右侧：情报收容所 (库存) --- */
        <div style="background:#fff; border:1px solid #cbd5e1; border-radius:8px; padding:15px; height: 400px; overflow-y:auto;">
            <div style="color:#0f172a; font-weight:bold; margin-bottom:10px; border-bottom:2px solid #94a3b8; padding-bottom:5px; display:flex; justify-content:space-between;">
                <span>📂 情报档案库</span>
                <span style="font-size:0.8em; background:#f1f5f9; padding:2px 8px; border-radius:12px; color:#334155; border:1px solid #cbd5e1; font-weight:bold;">库存: <<print $gossips.length>></span>
            </div>

            <<if $gossips.length == 0>>
                <div style="text-align:center; padding-top:80px; color:#64748b;">
                    <div style="font-size:4em; opacity:0.5; margin-bottom:10px;">📭</div>
                    <span style="font-size:1em; color:#475569; font-weight:bold;">暂无情报，去左边买点？</span>
                </div>
            <<else>>
                <<for _i to 0; _i < $gossips.length; _i++>>
                    <<capture _i>>
                    <<set _g to $gossips[_i]>>
                    
                    /* 计算边框颜色 */
                    <<set _borderColor to "#cbd5e1">>
                    <<if _g.type is "green">><<set _borderColor to "#22c55e">>
                    <<elseif _g.type is "blue">><<set _borderColor to "#3b82f6">>
                    <<elseif _g.type is "red">><<set _borderColor to "#ef4444">>
                    <<elseif _g.type is "gold">><<set _borderColor to "#eab308">>
                    <</if>>

                    <div @style="'background:#f8fafc; border:1px solid #cbd5e1; border-left-width:5px; margin-bottom:12px; padding:12px; border-radius:4px; box-shadow:0 2px 4px rgba(0,0,0,0.05); border-left-color:' + _borderColor">
                    
                        <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                            <span style="font-weight:bold; font-size:0.95em; color:#0f172a;">_g.label</span>
                            <span style="font-size:0.85em; color:#334155; background:#e2e8f0; padding:1px 6px; border-radius:4px; font-weight:bold;">估值: <<print _g.price>> 万</span>
                        </div>
                        
                        <div style="font-size:1em; color:#1e293b; margin-bottom:12px; line-height:1.4; font-weight:500;">
                            "_g.desc"
                        </div>

                        /* 操作按钮区 */
                        <div style="display:flex; gap:12px; justify-content:flex-end; font-size:0.95em; font-weight:bold;">
                            /* 卖出按钮 */
                            <<link "💰卖出">>
                                <<set $gid to _i>><<set $action to "sell">>
                                <<goto "Use_Gossip">>
                            <</link>>
                            
                            /* 攻击按钮 (蓝/红可用) */
                            <<if _g.type is "blue" or _g.type is "red">>
                                <span style="color:#cbd5e1;">|</span>
                                <<link "💣引爆">>
                                    <<set $gid to _i>><<set $action to "attack">>
                                    <<goto "Use_Gossip">>
                                <</link>>
                            <</if>>
                            
                            /* 置换按钮 (金可用 - 只能置换A级资源) */
                        <<if _g.type is "gold">>
                            <span style="color:#cbd5e1;">|</span>
                            <<link "🤝置换(A级)">>
                                <<set $gid to _i>><<set $action to "exchange_a">>
                                <<goto "Use_Gossip">>
                                <</link>>
                            <</if>>
                        </div>
                    </div>
                    <</capture>>
                <</for>>
            <</if>>
        </div>
    </div>

    <div style="text-align:center; margin-top:20px;">
        [[🔙 返回办公室|Office]]
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Resource_Get ---------- */
window.__STORY_PASSAGES.push({
  name: "Resource_Get",
  src: `<<nobr>>
<style>
    /* 🎨 商务结算页样式 V2.1 (灰蓝商务版) */
    
    /* 1. 全局容器 */
    .business-container {
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        min-height: 550px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    
    /* 2. 结果卡片 */
    .result-card {
        background: #ffffff;
        border-radius: 12px;
        padding: 40px 50px;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
        border: 1px solid #cbd5e1;
        max-width: 480px;
        width: 100%;
        text-align: center;
        position: relative;
        overflow: hidden;
    }
    
    /* 顶部装饰条 */
    .status-bar {
        height: 6px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
    }
    
    /* 3. 图标与标题 */
    .status-icon-box {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 3em;
        margin: 0 auto 20px auto;
    }
    
    .result-title {
        font-size: 1.8em;
        font-weight: 800;
        color: #1e293b; 
        margin-bottom: 10px;
        letter-spacing: -0.5px;
    }
    
    .result-subtitle {
        font-size: 1em;
        color: #64748b;
        margin-bottom: 30px;
        line-height: 1.5;
    }
    
    /* 4. 数据展示区 */
    .data-panel {
        background: #f8fafc;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 25px;
        border: 1px dashed #94a3b8;
    }
    
    .data-label {
        font-size: 0.8em;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 1px;
        margin-bottom: 5px;
        font-weight: 600;
    }
    
    .data-value {
        font-size: 3.5em;
        font-weight: 900;
        font-family: monospace;
        line-height: 1;
    }
    
    /* 5. 提示框 */
    .info-box {
        background: #fff;
        border-left: 4px solid #94a3b8;
        padding: 12px 15px;
        text-align: left;
        font-size: 0.9em;
        color: #475569;
        margin-bottom: 25px;
        border: 1px solid #e2e8f0;
        border-left-width: 4px;
    }
    
    /* 6. 按钮 */
    .btn-return {
        display: inline-block;
        background: #0f172a; /* Slate-900 */
        color: white;
        padding: 12px 30px;
        border-radius: 6px;
        font-weight: 600;
        text-decoration: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        width: 100%;
        box-sizing: border-box;
    }
    
    .btn-return:hover {
        background: #334155;
        transform: translateY(-2px);
    }

    /* === 状态配色 (核心修改区) === */
    
    /* 🔵 成功状态：改为灰蓝色 (Slate Blue) */
    .success-theme .status-bar { background: #475569; } /* Slate-600 */
    .success-theme .status-icon-box { background: #f1f5f9; color: #334155; } /* Slate-100 / Slate-700 */
    .success-theme .data-value { color: #475569; } /* Slate-600 */
    .success-theme .info-box { border-left-color: #475569; } /* 提示框左边也是灰蓝 */
    
    /* 🔴 失败状态：保持玫瑰红警示 */
    .fail-theme .status-bar { background: #ef4444; }
    .fail-theme .status-icon-box { background: #fef2f2; color: #b91c1c; }
    .fail-theme .data-value { color: #78849A; text-decoration: line-through; }
    .fail-theme .info-box { border-left-color: #ef4444; background: #fff1f2; color: #be123c; }

</style>

<div class="business-container">
    
    /* === 逻辑判断 === */
    <<if $last_gained_res is "fail">>
        
        /* 🔴 失败状态卡片 */
        <div class="result-card fail-theme">
            <div class="status-bar"></div>
            
            <div class="status-icon-box">❌</div>
            
            <h1 class="result-title">谈判中止</h1>
            <div class="result-subtitle">
                Negotiation Failed<br>
                由于某些不可控因素，本次资源置换未能达成。
            </div>
            
            <div class="info-box">
                💡 <b>风险提示：</b><br>
                资金与体力已按流程扣除。可能是对方临时抬价，建议稍后重试。
            </div>
            
            <<button "🔙 返回商务中心" class="btn-return">>
                <<goto "Buy_Resource">>
            <</button>>
        </div>

    <<else>>
        
        /* 🔵 成功状态卡片 (灰蓝商务风) */
        <div class="result-card success-theme">
            <div class="status-bar"></div>
            
            <div class="status-icon-box">🤝</div>
            
            <h1 class="result-title">签约成功</h1>
            <div class="result-subtitle">
                Deal Closed Successfully<br>
                已成功签署合同，资源已录入公司系统。
            </div>
            
            <div class="data-panel">
                <div class="data-label">Acquired Resources</div>
                <div class="data-value">+<<print $last_gained_count>></div>
            </div>
            
            <<if def $last_gained_extra>>
                <div class="info-box" style="border-left-color: #f59e0b; background: #fffbeb; color: #92400e;">
                    ✨ <b>额外触发：</b> <<print $last_gained_extra>>
                </div>
            <<else>>
                <div class="info-box">
                    📋 <b>系统日志：</b><br>
                    资源类型与等级已更新，请前往“通告中心”查看详细库存。
                </div>
            <</if>>
            
            <<button "✅ 确认归档" class="btn-return">>
                <<goto "Buy_Resource">>
            <</button>>
        </div>
        
    <</if>>
    
    <div style="margin-top: 20px; font-size: 0.85em; color: #94a3b8;">
        MUGEN ENTERTAINMENT SYSTEM V2.1
    </div>

</div>
<</nobr>>`
});

/* ---------- 故事块：Secret_Base ---------- */
window.__STORY_PASSAGES.push({
  name: "Secret_Base",
  src: `<div class="tech-card dark-card secret-term">

    /* --- 🔧 逻辑初始化 --- */
    <<silently>>
        <<if def $exposure is false>> <<set $exposure to 0>> <</if>>
        <<if def $mission_progress is false>> <<set $mission_progress to 0>> <</if>>

        /* 补发艺人逻辑 (防卡关) */
        <<if $zp_story_stage >= 3 and $has_signed_huang is false>>
            <<set $has_signed_huang to true>>
            /* 🛠️ 修复：补全 role / rank_label / status / split / topic / limit_*
               —— 原来缺 limit_acting 等字段，导致「报班学习」结算页显示 +NaN，
               而且 rank_label、话题、分成比例也是空的。 */
            <<set $actors.new_boy to {
                name: "黄耀祖", role: "替身", rank_label: "新人", rank_level: 1,
                status: "active", split: 0.6,
                reputation: 0, looks: 90, topic: 30,
                acting: 10, fashion: 40, stage: 20,
                limit_acting: 70, limit_fashion: 85, limit_stage: 75,
                fans: { career: 0, mom: 2000, toxic: 0, cp: 0, clown: 2500, face: 500, dream: 500,
                        moe: 1500, passerby: 1500 },
                energy: 120, current_energy: 100,
                busy_months: 0, project_name: "", job_type: "none",
                trait: "努力"
            }>>
            <<set $actors.huang = $actors.new_boy>>
        <</if>>
        <<if $zp_story_stage >= 3 and $has_signed_liu is false>>
            <<set $has_signed_liu to true>>
            /* 🛠️ 同上：补全缺失字段 */
            <<set $actors.liu to {
                name: "刘梁周", role: "摄影师", rank_label: "三线", rank_level: 2,
                status: "active", split: 0.5,
                reputation: 50, looks: 70, topic: 40,
                acting: 5, fashion: 95, stage: 5,
                limit_acting: 60, limit_fashion: 98, limit_stage: 55,
                fans: { career: 200, mom: 0, toxic: 0, cp: 0, clown: 800, face: 0, dream: 500,
                        moe: 300, passerby: 2000 },
                energy: 120, current_energy: 100,
                busy_months: 0, project_name: "", job_type: "none",
                trait: "专业"
            }>>
        <</if>>
    <</silently>>

    /* =========================================
       📴 线路已断：第57月之后（$zp_comm_cut）
       ========================================= */
    <<if $zp_comm_cut>>
        <div class="st-top">
            <div class="st-brand">
                <span class="st-dot off"></span>
                <span class="st-title">加密线路</span>
                <span class="st-code">CH-007 / CLOSED</span>
            </div>
            <div class="st-signal off"><i></i><i></i><i></i><i></i><span>NO SIGNAL</span></div>
        </div>

        <div class="st-dead">
            <div class="st-dead-head">📴 NO SIGNAL</div>
            <p class="st-dead-line">加密线路已经关闭。这条线，再也不会亮起来了。</p>
            <div class="st-msg">
                <div class="st-msg-meta">最后一条消息 · 已存档</div>
                <div class="st-msg-body">「线要断了。别再给我发消息。新年快乐，小飞。」</div>
                <div class="st-msg-time">接收于 · 第 57 月</div>
            </div>
            <p class="st-dead-note">—— 此后再无回音</p>
            <div class="st-foot">
                <a class="st-logout" data-go="Office">回到办公室</a>
            </div>
        </div>

    /* =========================================
       ☠️ 暴露值检测：如果过高，强制断联 (Bad Ending 前置)
       ========================================= */
    <<elseif $exposure >= 70>>
        <div class="st-top danger">
            <div class="st-brand">
                <span class="st-dot dead"></span>
                <span class="st-title">加密线路</span>
                <span class="st-code">CH-007 / COMPROMISED</span>
            </div>
            <div class="st-signal danger"><i></i><i></i><i></i><i></i><span>截断中</span></div>
        </div>

        <div class="st-dead danger">
            <div class="st-dead-head">🚫 SIGNAL LOST</div>
            <p class="st-dead-line">加密线路已强制切断。信号在他那端灭掉了，没有任何预兆。</p>
            <div class="st-msg danger">
                <div class="st-msg-body">「韩证飞，你那边动静太大了，顾涛已经盯上你了。」</div>
                <div class="st-msg-body">「为了你的安全，我会切断一切联系。别找我。」</div>
                <div class="st-msg-time">—— 最后的留言</div>
            </div>
            <div class="st-foot">
                <<link "面对结局（任务失败）" class="st-exec st-exec-danger">>
                    /* 触发牺牲逻辑 */
                    <<set $zp_story_stage to 99>>
                    <<set $actors.zp.status to "dead">>
                    <<goto "Office">>
                <</link>>
            </div>
        </div>

    <<else>>
        /* =========================================
           🖥️ 正常操作界面
           ========================================= */
        <div class="st-top">
            <div class="st-brand">
                <span class="st-dot"></span>
                <span class="st-title">加密线路</span>
                <span class="st-code">CH-007 / SECURE</span>
            </div>
            <div class="st-signal"><i></i><i></i><i></i><i></i><span>AES-256</span></div>
        </div>

        /* 信任度影响"擦痕迹"的能力：他越信你，越会替你收尾；
           他越不信你，你就只能自己硬来，暴露得更快。
           ≥60 → 每次行动暴露 +5；<40 → +15；其余 +10。 */
        <<set _expo_gain to 10>>
        <<if ($zp_trust || 0) >= 60>>
            <<set _expo_gain to 5>>
        <<elseif ($zp_trust || 0) < 40>>
            <<set _expo_gain to 15>>
        <</if>>

        /* --- 对面是谁 --- */
        <div class="st-peer">
            <div class="st-peer-ava">ZP</div>
            <div class="st-peer-main">
                <div class="st-peer-name">展鹏 <em>卧底中</em></div>
                <div class="st-peer-sub">第 <<print $month>> 月 · 单线联系 · 不留记录</div>
            </div>
            <div class="st-peer-life">
                <span class="st-peer-life-k">暴露</span>
                <b class="st-peer-life-v"><<print $exposure>></b>
                <span class="st-peer-life-m">/70</span>
            </div>
        </div>

        /* --- 两块仪表 --- */
        <div class="st-gauges">
            <div class="st-gauge">
                <div class="st-gauge-head"><span>⚠️ 暴露风险</span><b><<print $exposure>> / 70</b></div>
                <div class="st-bar risk"><i style="width: <<print Math.min(100, $exposure / 70 * 100)>>%"></i></div>
                <div class="st-gauge-note">超过 70，这条线会被强制切断</div>
            </div>
            <div class="st-gauge">
                <div class="st-gauge-head"><span>📥 任务完成度</span><b><<print $mission_progress>>%</b></div>
                <div class="st-bar mission"><i style="width: <<print Math.min(100, $mission_progress)>>%"></i></div>
                <div class="st-gauge-note">慢慢来，别一次把牌全打完</div>
            </div>
        </div>

        /* --- 三个关键数值 ---
           信任度：展鹏敢不敢把后背交给你（结局判定用，<40 会走向 BE）
           羁绊值：你们之间的感情（结局判定用）
           正义值：你这几年站的那一边（结局判定用） */
        <div class="st-stats">
            <div class="st-stat">
                <span class="st-stat-ico">🛡️</span>
                <div class="st-stat-txt">
                    <span class="st-stat-k">信任度</span>
                    <b class="st-stat-v"><<print $zp_trust>></b>
                </div>
            </div>
            <div class="st-stat">
                <span class="st-stat-ico">💞</span>
                <div class="st-stat-txt">
                    <span class="st-stat-k">羁绊值</span>
                    <b class="st-stat-v"><<print $zp_bond>></b>
                </div>
            </div>
            <div class="st-stat">
                <span class="st-stat-ico">⚖️</span>
                <div class="st-stat-txt">
                    <span class="st-stat-k">正义值</span>
                    <b class="st-stat-v"><<print $justice>></b>
                </div>
            </div>
        </div>

        /* --- 判定说明：把三个数值的用途直接写给玩家看 --- */
        <div class="st-judge">
            <div class="st-judge-row">
                <span class="st-judge-k">⚖️ 正义 &gt; 70 且 &gt; 💞 羁绊</span>
                <span class="st-judge-v">→ HE · 荣耀归队</span>
            </div>
            <div class="st-judge-row">
                <span class="st-judge-k">其余（正义 ≥ 70）</span>
                <span class="st-judge-v">→ HE · 人间烟火</span>
            </div>
            <div class="st-judge-row">
                <span class="st-judge-k">🛡️ 信任 &lt; 40 或 ⚖️ 正义 &lt; 70</span>
                <span class="st-judge-v danger">→ BE · 无声的牺牲</span>
            </div>
            <div class="st-judge-note">正义值剧情最多给到 65，到不了 70 —— 想活下来就得靠这里的行动往上抬。</div>
            <<if ($justice || 0) > 70 and ($justice || 0) > ($zp_bond || 0)>>
                <div class="st-judge-warn" style="color:#2F6E56; background:rgba(16,185,129,.1); border-color:rgba(16,185,129,.3);">
                    ✅ 已达归队线：正义 <<print $justice>>，高于羁绊 <<print $zp_bond>>。
                </div>
            <<elseif ($justice || 0) < 70>>
                <div class="st-judge-warn">
                    ⚠️ 正义还差 <<print 70 - ($justice || 0)>> 点才到 70。低于 70，第 60 月会走向「无声的牺牲」。
                </div>
            <<else>>
                <div class="st-judge-note">归队线：正义 &gt; 70 且高于羁绊 <<print $zp_bond>>（当前正义 <<print $justice>>）。</div>
            <</if>>
            <<if ($zp_trust || 0) < 45>>
                <div class="st-judge-warn">
                    ⚠️ 信任度偏低。真到了那一天，他可能不敢把最后一枪交到你手上。
                </div>
            <</if>>
        </div>

        /* --- 日常情报操作 --- */
        <div class="st-ops">
            <div class="st-ops-head">
                <span>日常情报操作</span>
                <<if $mission_progress >= 100>>
                    <span class="st-ops-hint done">✅ 任务已完成 —— 手上能做的都做完了，再动只会暴露</span>
                <<else>>
                    <span class="st-ops-hint">每一次行动，都会在账面上留下痕迹</span>
                <</if>>
            </div>

            /* 1. 狠黑展鹏 */
            <div class="st-op">
                <div class="st-op-l">
                    <div class="st-op-code">OP-01</div>
                    <div class="st-op-name">📢 全网抹黑展鹏</div>
                    <div class="st-op-desc">买通营销号，攻击展鹏“抛妻弃子”，让顾涛彻底放下戒心。</div>
                    <div class="st-op-tags">
                        <span class="st-tag buff">正义 +5</span>
                        <span class="st-tag buff">信任 +5</span>
                        <span class="st-tag risk">暴露 +<<print _expo_gain>></span>
                        <span class="st-tag gain">进度 +5</span>
                    </div>
                </div>
                <div class="st-op-r">
                    <div class="st-op-cost">-80 万</div>
                    <<if $mission_progress >= 100>>
                        <span class="st-nocost">任务已完成</span>
                    <<elseif $money >= 80>>
                        <<link "执行" class="st-exec">>
                            <<set $money -= 80>>
                            <<set $justice += 5>>
                            <<set $zp_trust += 5>>
                            <<set $exposure += _expo_gain>>
                            <<set $mission_progress to Math.min(100, $mission_progress + 5)>>

                            /* 设置类型并生成 1-3 的随机种子 */
                            <<set $op_type to "blacken">>
                            <<set $r_seed to random(1, 3)>>
                            <<goto "Secret_Base_Execute">>
                        <</link>>
                    <<else>>
                        <span class="st-nocost">资金不足</span>
                    <</if>>
                </div>
            </div>

            /* 2. 针对帝国娱乐 */
            <div class="st-op">
                <div class="st-op-l">
                    <div class="st-op-code">OP-02</div>
                    <div class="st-op-name">⚔️ 狙击帝国娱乐</div>
                    <div class="st-op-desc">打击顾涛的公司，替展鹏出一口恶气。</div>
                    <div class="st-op-tags">
                        <span class="st-tag buff">羁绊 +10</span>
                        <span class="st-tag risk">暴露 +<<print _expo_gain>></span>
                        <span class="st-tag gain">进度 +5</span>
                    </div>
                </div>
                <div class="st-op-r">
                    <div class="st-op-cost">-120 万</div>
                    <<if $mission_progress >= 100>>
                        <span class="st-nocost">任务已完成</span>
                    <<elseif $money >= 120>>
                        <<link "执行" class="st-exec">>
                            <<set $money -= 120>>
                            <<set $zp_bond += 10>>
                            <<set $exposure += _expo_gain>>
                            <<set $mission_progress to Math.min(100, $mission_progress + 5)>>

                            <<set $op_type to "attack">>
                            <<set $r_seed to random(1, 3)>>
                            <<goto "Secret_Base_Execute">>
                        <</link>>
                    <<else>>
                        <span class="st-nocost">资金不足</span>
                    <</if>>
                </div>
            </div>

            /* 3. 捧杀替身 */
            <div class="st-op">
                <div class="st-op-l">
                    <div class="st-op-code">OP-03</div>
                    <div class="st-op-name">❤‍🔥 高调宠爱“替身”</div>
                    <div class="st-op-desc">营销新人，坐实自己“渣男”的人设，把水搅浑。</div>
                    <div class="st-op-tags">
                        <span class="st-tag buff">正义 +5</span>
                        <span class="st-tag lose">羁绊 -5</span>
                        <span class="st-tag risk">暴露 +<<print _expo_gain>></span>
                        <span class="st-tag gain">进度 +5</span>
                    </div>
                </div>
                <div class="st-op-r">
                    <div class="st-op-cost">-100 流</div>
                    <<if $mission_progress >= 100>>
                        <span class="st-nocost">任务已完成</span>
                    <<elseif $traffic >= 100>>
                        <<link "执行" class="st-exec">>
                            <<set $traffic -= 100>>
                            <<set $justice += 5>>
                            <<set $zp_bond -= 5>>
                            <<set $exposure += _expo_gain>>
                            <<set $mission_progress to Math.min(100, $mission_progress + 5)>>

                            <<set $op_type to "substitute">>
                            <<set $r_seed to random(1, 3)>>
                            <<goto "Secret_Base_Execute">>
                        <</link>>
                    <<else>>
                        <span class="st-nocost">流量不足</span>
                    <</if>>
                </div>
            </div>
        </div>

        <div class="st-foot">
            <<link "断开连接" class="st-logout">><<goto "Office">><</link>>
            <span class="st-foot-hint">关闭后不留记录</span>
        </div>
    <</if>>
</div>`
});

/* ---------- 故事块：Secret_Base_Execute ---------- */
window.__STORY_PASSAGES.push({
  name: "Secret_Base_Execute",
  src: `<div class="tech-card dark-card" style="border-color: #334155; background-color: #0f172a; color: #e2e8f0;">
    <div class="header-banner" style="background: #1e293b; border-bottom: 1px solid #334155; padding: 10px 20px;">
        <span style="font-family: monospace; letter-spacing: 2px; color: #10b981;">> OPERATION REPORT</span>
    </div>

    <div style="padding: 30px; font-family: 'Segoe UI', sans-serif;">
        
        /* =========================================
           A. 全网抹黑 (Blacken) - 3种随机剧情
           ========================================= */
        <<if $op_type is "blacken">>
            <h2 style="color: #fbbf24; border-bottom: 1px dashed #555; padding-bottom: 10px;">📢 行动代号：全网自黑</h2>
            
            <<if $r_seed is 1>>
                /* 剧情 1：营销号通稿 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>资金打入营销号的账户二十分钟后，指责展鹏抛夫弃子的通稿已经满天飞了。</p>
                    <p>你看着屏幕上那些不堪入目的言论有些不忍，但手里的砖块却震动了一下。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #10b981; font-family: monospace;">
                        > ZP: 干得漂亮。顾涛刚才看到热搜笑得很开心，还拍了拍我的肩膀假模假样地安慰我。
                    </p>
                    <p>好吧，展鹏的心理素质可比你强多了。</p>
                </div>

            <<elseif $r_seed is 2>>
                /* 剧情 2：伪造匿名爆料 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>你在著名的某封闭小组里发爆料贴，以路人身份造谣展鹏在婚内对你进行暴力，并附上你去医院体检时的照片。</p>
                    <p>舆论瞬间沸腾，网友们叫嚣着展鹏是家暴男，数万条评论跟帖刷屏。深夜，展鹏传回了简讯。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #10b981; font-family: monospace;">
                        > ZP: 你怎么想到去扒一扒组造谣的，机智又缺德，不愧是你。
                    </p>
                    <p>文字后面跟着灿烂的笑脸，你看了很长时间。</p>
                </div>

            <<else>>
                /* 剧情 3：摆拍冲突 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>狗仔放出了一组两年前你和展鹏在街头争论的旧照，其实是你们在争论哪一家奶茶更好喝。</p>
                    <p>不愧是专业狗仔，标题耸人听闻。《豪门梦碎！展鹏街头怒斥前夫，疑似索要天价分手费》。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #10b981; font-family: monospace;">
                        > ZP: 长见识了，几年前的照片都能拿出来造谣啊！
                    </p>
                    <p>有时候你不知道展鹏是真的乐观，还是怕你难受。</p>
                </div>
            <</if>>
            
            /* 结算数值显示 */
            <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 5px;">RESULT:</div>
                <div style="color: #10b981;">🛡️ 信任度 +5</div>
                <div style="color: #fbbf24;">⚖️ 正义值 +5</div>
                <div style="color: #38bdf8;">📥 任务完成度 +5 (当前: $mission_progress%)</div>
                <div style="color: #ef4444; margin-top: 5px;">⚠️ 暴露风险 ↑ (当前: $exposure)</div>
            </div>

        /* =========================================
           B. 狙击帝国 (Attack) - 3种随机剧情
           ========================================= */
        <<elseif $op_type is "attack">>
            <h2 style="color: #ef4444; border-bottom: 1px dashed #555; padding-bottom: 10px;">📢 行动代号：狙击帝国</h2>
            
            <<if $r_seed is 1>>
                /* 剧情 1：法务狙击 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>无垠娱乐王牌法务部突袭起诉，导致帝国娱乐正在谈的一个S级项目被迫搁置。虽然这称不上伤筋动骨，但足以恶心顾涛一把。</p>
                    <p>据说顾涛在办公室摔了杯子，指着展鹏大骂了一顿，展鹏一直低着头没有说话，但你猜他心里应该是痛快的。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #ec4899; font-family: monospace;">
                        > ZP: 你不知道他气成什么样了，可惜不能直接气死他。
                    </p>
                </div>

            <<elseif $r_seed is 2>>
                /* 剧情 2：税务举报 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>法务部再创佳绩，你动用人脉，实名向税务机关举报了帝国娱乐旗下某子公司的账目问题。虽然最后罚款了事，但帝国娱乐为了摆平此事大出血，股价还应声下跌。</p>
                    <p>展鹏连续几天上活动都是神清气爽的， 脸上痘痘都下去了。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #ec4899; font-family: monospace;">
                        > ZP: 股价跌了，顾涛忙着去安抚股东，我今天终于能早点下班了。干得小飞。
                    </p>
                </div>

            <<else>>
                /* 剧情 3：挖角练习生 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>你帮助天际传媒挖走了帝国娱乐好不容易培养的苗子练习生，并买营销号发通稿嘲讽帝国娱乐留不住人。</p>
                    <p>这不是商业竞争，因为对你根本没好处， 所有人都说这是你在报复前妻和前妻的现东家。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #ec4899; font-family: monospace;">
                        > ZP: 顾涛骂你是疯子，每天都忍着不要揍他。
                    </p>
                </div>
            <</if>>

            /* 结算数值 */
            <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 5px;">RESULT:</div>
                <div style="color: #ec4899;">💞 羁绊值 +10</div>
                <div style="color: #38bdf8;">📥 任务完成度 +5 (当前: $mission_progress%)</div>
                <div style="color: #ef4444; margin-top: 5px;">⚠️ 暴露风险 ↑ (当前: $exposure)</div>
            </div>

        /* =========================================
           C. 捧杀替身 (Substitute) - 3种随机剧情
           ========================================= */
        <<elseif $op_type is "substitute">>
            <h2 style="color: #3b82f6; border-bottom: 1px dashed #555; padding-bottom: 10px;">📢 行动代号：捧杀替身</h2>
            
            <<if $r_seed is 1>>
                /* 剧情 1：回家的诱惑 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>有点钱都上交给营销号了，你掏钱将黄耀祖捧上了热搜，标题是《韩证飞新宠：这才是真正的豪门男主》。</p>
                    <p>全网都在嘲讽展鹏是失宠前妻，离婚的原因更是有无数猜测，因为干的事过于渣男，顾涛完全想不到你和展鹏竟然还在联系。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #3b82f6; font-family: monospace;">
                        > ZP: 听说你们昨天去海边拍写真了？韩总好惬意啊，呵呵。
                    </p>
                </div>

            <<elseif $r_seed is 2>>
                /* 剧情 2：新缪斯 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>你高调宣布刘梁周成为公司下一季度的核心C位，并亲自为他站台，趁他为自己的缪斯。媒体问及展鹏时，更是冷漠地表示不熟。</p>
                    <p>展鹏的短信里充满了酸味。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #3b82f6; font-family: monospace;">
                        > ZP: 呦，韩总现在都有缪斯了。
                    </p>
                </div>

            <<else>>
                /* 剧情 3：拉踩通稿 */
                <div style="margin: 20px 0; font-size: 1.1em; line-height: 1.8; text-align: justify;">
                    <p>买营销号疯狂拉踩的事根本瞒不过业内，现在所有人都知道你把展鹏的高糊偷拍照和黄耀祖的精修写真做对比，把前妻当垫脚石。</p>
                    <p>消息发布的时候，你已经预见展鹏逐步气晕的样子了。</p>
                    <p style="background: rgba(255,255,255,0.1); padding: 10px; border-left: 3px solid #3b82f6; font-family: monospace;">
                        > ZP: 我忍，我忍。
                    </p>
                </div>
            <</if>>

            /* 结算数值 */
            <div style="background: #1e293b; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <div style="color: #94a3b8; font-size: 0.8em; margin-bottom: 5px;">RESULT:</div>
                <div style="color: #fbbf24;">⚖️ 正义值 +5</div>
                <div style="color: #ec4899;">💔 羁绊值 -5</div>
                <div style="color: #38bdf8;">📥 任务完成度 +5 (当前: $mission_progress%)</div>
                <div style="color: #ef4444; margin-top: 5px;">⚠️ 暴露风险 ↑ (当前: $exposure)</div>
            </div>
        <</if>>

        <div style="margin-top: 40px; text-align: right;">
            <<link "🔙 清理痕迹，断开连接">>
                <<goto "Secret_Base">>
            <</link>>
        </div>
    </div>
</div>`
});

/* ---------- 故事块：Use_Gossip ---------- */
window.__STORY_PASSAGES.push({
  name: "Use_Gossip",
  src: `<<nobr>>
/* 引入高级样式 (保持上一版样式不变，仅微调文字颜色适配) */
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
    
    /* 样式变种 */
    .card-sell { background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border-left: 8px solid #f59e0b; color: #92400e; } .card-sell .rank-badge { background: #f59e0b; color: white; }
    .card-exchange { background: linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%); border-left: 8px solid #9333ea; color: #6b21a8; } .card-exchange .rank-badge { background: #9333ea; color: white; }
    .card-legend { background: linear-gradient(135deg, #ecfdf5 0%, #6ee7b7 100%); border: 2px solid #059669; color: #064e3b; box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); } .card-legend .rank-badge { background: linear-gradient(to right, #10b981, #047857); color: #fff; }
    .card-mythic { background: linear-gradient(135deg, #fff1f2 0%, #fda4af 100%); border: 3px solid #be123c; color: #881337; box-shadow: 0 0 30px rgba(225, 29, 72, 0.4); } .card-mythic .rank-badge { background: linear-gradient(to right, #f43f5e, #be123c); color: #fff; padding: 10px 30px; font-size: 1.6em; }
    
    .result-icon { font-size: 4em; float: right; opacity: 0.15; margin-top: -20px; margin-right: -10px; }
    .reward-box { background: rgba(255,255,255,0.8); padding: 15px; border-radius: 8px; margin-top: 15px; font-size: 1.1em; font-weight: 900; border-left: 5px solid rgba(0,0,0,0.2); font-style: normal; display:flex; justify-content:space-between; }
    
    /* 新增：风险解释区域样式 */
    .risk-note {
        margin-top: 15px; padding-top: 10px;
        border-top: 1px dashed rgba(0,0,0,0.15);
        font-size: 0.9em; font-style: italic; 
        text-align: center; color: inherit; opacity: 0.85;
    }

    .btn-return {
        display: inline-block; padding: 12px 30px; background: #334155; color: white; 
        text-decoration: none; border-radius: 50px; font-weight: bold; margin-top: 30px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.2); transition: all 0.2s;
    }
    .btn-return:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.3); background: #1e293b; }
</style>

<<set _g to $gossips[$gid]>>

<div class="tech-card" style="min-height:500px; display:flex; flex-direction:column; justify-content:center; align-items:center; background:none; box-shadow:none; border:none; margin: 0 auto !important;">

<<if not _g>>
    <div style="background:#fef2f2; border:2px solid #ef4444; color:#b91c1c; padding:40px; border-radius:12px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="font-size:4em; margin-bottom:15px;">⚠️</div>
        <h2 style="color:#ef4444; font-weight:900;">情报失效</h2>
        <p>该情报可能已经被使用或不存在了。</p>
        <br>[[🔙 返回|Gossip_Center]]
    </div>
<<else>>
    
    <div class="pr-container">
        <div style="text-align:center; margin-bottom:10px;">
            <div style="font-size:3.5em; margin-bottom:5px;">📠</div>
            <h2 style="margin:0; color:#334155; text-transform: uppercase; letter-spacing: 2px; font-weight:900;">情报处理报告</h2>
        </div>

        /* === 卖给营销号 (换钱) === */
        <<if $action is "sell">>
            <<set $money += _g.price>>
            <<if _g.type is "green">><<set $traffic += 50>><</if>>
            
            <div class="pr-card card-sell">
                <div class="rank-badge">SOLD</div><span class="result-icon">💰</span>
                <span class="news-title">交易成功</span>
                <p>你把这条情报独家卖给了"娱乐圈扒皮王"。</p>
                <div class="reward-box" style="display:block;">
                    <div>爆料费：<span style="color:#ea580c;">+<<print _g.price>> 万</span></div>
                    <<if _g.type is "green">>
                    <div style="font-size:0.8em; margin-top:5px; color:#92400e; opacity:0.8;">(这种小料没什么人看，流量微涨)</div>
                    <</if>>
                </div>
            </div>

        /* === 攻击对家 (换流量 + 削弱对手) === */
        <<elseif $action is "attack">>
            /* 数值计算 */
            <<if _g.type is "blue">>
                <<set _traffic_gain to 1500>>
                <<set _danger_gain to 5>>
                <<set _dmg_desc to "中等伤害">>
                <<set _card_class to "card-legend">><<set _badge to "SR">><<set _icon to "📉">>
            <<elseif _g.type is "red">>
                <<set _traffic_gain to 15000>>
                <<set _danger_gain to 10>>
                <<set _dmg_desc to "毁灭性打击">>
                <<set _card_class to "card-mythic">><<set _badge to "SSR">><<set _icon to "💣">>
            <</if>>
            
            <<set $rival_company.heat -= _g.power>>
            <<set $traffic += _traffic_gain>>
            <<set $danger_level += _danger_gain>>
            
            /* 🎲 随机生成风险解释文案 */
            <<set _risk_reasons to [
                "“凝视深渊的时候，深渊也在凝视你。”",
                "购买爆料的痕迹被情报贩子注意到了，引来窥探。",
                "手段虽有效，但水军操作留下了可追踪的线索。",
                "这种伤敌一千自损八百的手段，让公司口碑蒙上阴影。",
                "业内开始流传关于你的风言风语，对手已察觉端倪。"
            ]>>
            <<set _current_reason to _risk_reasons.random()>>

            <div @class="'pr-card ' + _card_class">
                <div class="rank-badge">_badge</div><span class="result-icon">_icon</span>
                <span class="news-title">🔥 全网推送！</span>
                <p>你安排水军将这条黑料顶上了热搜！<br>
                <span style="background:rgba(255,255,255,0.5); padding:2px 8px; border-radius:4px; font-size:0.9em;">热搜爆：<<print _g.desc>></span></p>
                
                <p style="margin-top:10px;">对手公司 <b><<print $rival_company.name>></b> 陷入公关危机！</p>
                
                <div class="reward-box">
                    <div style="color:var(--text-color);">我方流量 +_traffic_gain</div>
                    <div style="color:#dc2626;">危险值 +_danger_gain</div>
                </div>
                
                /* 🔴 新增：风险解释区域 */
                <div class="risk-note">
                    ⚠️ 风险警示：_current_reason
                </div>

                <div style="text-align:center; margin-top:10px; font-weight:900; font-size:1.2em; color:inherit; text-transform:uppercase; letter-spacing:1px; border-top:1px dashed rgba(0,0,0,0.1); padding-top:10px;">
                    效果：_dmg_desc
                </div>
            </div>

        /* === 商业机密置换 (A级) === */
        <<elseif $action is "exchange_a">>
            <<set _qty to random(1, 2)>>
            <<set $resources.a += _qty>>
            
            <div class="pr-card card-exchange">
                <div class="rank-badge">DEAL</div><span class="result-icon">🤝</span>
                <span class="news-title">资源置换成功</span>
                <p>你利用这条商业机密，与资方达成了合作。</p>
                <div class="reward-box">
                    <div>获得资源：<span style="color:#9333ea;">A级 x _qty</span></div>
                </div>
                <div style="background:rgba(255,255,255,0.5); padding:10px; border-radius:4px; margin-top:10px; font-size:0.8em;">
                    ⚠️ <b>提示：</b>如需S级资源，请前往<b>商务拓展中心</b>付费置换。
                </div>
            </div>

        /* === S级置换 (商务中心用) === */
        <<elseif $action is "exchange">>
            <<set _qty to random(1, 2)>>
            <<set $resources.s += _qty>>
            <<set $money -= 160>>
            <<set $stamina -= 20>>
            
            <div class="pr-card card-sell" style="border-left-color:#d97706;">
                <div class="rank-badge" style="background:#d97706;">VIP</div><span class="result-icon">🏆</span>
                <span class="news-title" style="color:#b45309;">顶级资源置换</span>
                <p>你利用商业机密与160万封口费，换取了顶级资源。</p>
                <div class="reward-box">
                    <div style="color:#d97706;">S级资源 x _qty</div>
                    <div style="color:#78350f; font-size:0.9em;">消耗: 160万</div>
                </div>
            </div>

        <</if>>

        /* 删除已使用的情报 */
        <<set $gossips.deleteAt($gid)>>

        <a class="btn-return" data-passage="Gossip_Center">✅ 确认并返回</a>
    </div>
<</if>>
</div>
<</nobr>>`
});
