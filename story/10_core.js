/* ===========================================================================
   ① 核心：初始数值 / 侧边栏 / 公告 / 说明书 / 办公室
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

/* ---------- 故事块：Debug_Cheats ---------- */
window.__STORY_PASSAGES.push({
  name: "Debug_Cheats",
  src: `<<if not def $film_lib>><<set $film_lib to []>>><</if>><<if not def $film_used>><<set $film_used to { s: [], a: [], b: [], c: [] }>>><</if>>
<div class="tech-card" style="border: 2px dashed #f59e0b;">
    <div class="header-banner" style="background: #f59e0b; color: black;">🔧 开发者测试面板 (全功能版)</div>
    
    <div style="padding: 20px; text-align: center;">
        
        <p>当前时间：<b>Month <<print $month>></b></p>
        
        /* =========================================
           1. 资金与流量 (点击即加)
           ========================================= */
        <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-weight:bold; margin-bottom:5px; color:#d97706;">💰 基础资金流</div>
            
            <div style="display:inline-block; margin: 0 10px;">
                <<link "💳 资金 +2000万">>
                    <<set $money += 2000>>
                    <<goto "Debug_Cheats">>
                <</link>>
            </div>
            |
            <div style="display:inline-block; margin: 0 10px;">
                <<link "🌊 流量 +2万">>
                    <<set $traffic += 20000>>
                    <<goto "Debug_Cheats">>
                <</link>>
            </div>
            
            <div style="margin-top:5px; font-size:0.8em; color:#666;">
                资金: $money 万 | 流量: $traffic
            </div>
        </div>

        /* =========================================
           2. 资源道具 (S/A/B/C) - 新增
           ========================================= */
        <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-weight:bold; margin-bottom:5px; color:#9333ea;">🗃️ 资源道具 (+5)</div>
            
            <span style="color:#d97706; font-weight:bold;">S:</span> <<print $resources.s>> 
            <<link "[+5]">><<set $resources.s += 5>><<goto "Debug_Cheats">><</link>>
            &nbsp;|&nbsp;

            <span style="color:#9333ea; font-weight:bold;">A:</span> <<print $resources.a>> 
            <<link "[+5]">><<set $resources.a += 5>><<goto "Debug_Cheats">><</link>>
            &nbsp;|&nbsp;
            
            <span style="color:#3b82f6; font-weight:bold;">B:</span> <<print $resources.b>> 
            <<link "[+5]">><<set $resources.b += 5>><<goto "Debug_Cheats">><</link>>
            &nbsp;|&nbsp;
            
            <span style="color:#64748b; font-weight:bold;">C:</span> <<print $resources.c>> 
            <<link "[+5]">><<set $resources.c += 5>><<goto "Debug_Cheats">><</link>>
        </div>

        /* =========================================
           3. 情报获取 (四色瓜) - 新增
           ========================================= */
        <div style="background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
            <div style="font-weight:bold; margin-bottom:5px; color:#ef4444;">🕵️ 情报获取 (+1)</div>
            
            /* 绿色瓜 */
            <<link "🟢趣闻">>
                <<run $gossips.push({ type: "green", label: "🟢趣闻", price: 10, power: 10, desc: "开发者测试瓜(绿)" })>>
                <<goto "Debug_Cheats">>
            <</link>>
            &nbsp;&nbsp;

            /* 蓝色瓜 */
            <<link "🔵黑料">>
                <<run $gossips.push({ type: "blue", label: "🔵黑料", price: 30, power: 50, desc: "开发者测试瓜(蓝)" })>>
                <<goto "Debug_Cheats">>
            <</link>>
            &nbsp;&nbsp;

            /* 红色瓜 */
            <<link "🔴塌房">>
                <<run $gossips.push({ type: "red", label: "🔴塌房", price: 80, power: 100, desc: "开发者测试瓜(红)" })>>
                <<goto "Debug_Cheats">>
            <</link>>
            &nbsp;&nbsp;

            /* 金色瓜 */
            <<link "🟡机密">>
                <<run $gossips.push({ type: "gold", label: "🟡机密", price: 200, power: 200, desc: "开发者测试瓜(金)" })>>
                <<goto "Debug_Cheats">>
            <</link>>

            <div style="margin-top:5px; font-size:0.8em; color:#666;">
                当前库存: <<print $gossips.length>> 条
            </div>
        </div>

        <hr style="border-top: 1px dashed #ccc;">

        /* =========================================
           4. 艺人定向涨粉区 (5人 x 4档)
           ========================================= */
        <div style="text-align: left;">
            <div style="font-weight:bold; margin-bottom:15px; text-align:center; color:#059669;">📈 艺人涨粉 (事业粉)</div>
            
            /* --- 1. 展鹏 --- */
            <div style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="display:inline-block; width:70px; font-weight:bold;">展鹏:</span>
                <span style="color:#059669; margin-right:10px; font-size:0.9em;"><<print $actors.zp.fans.career>></span>
                <<link "[+1w]">><<set $actors.zp.fans.career += 10000>><<goto "Debug_Cheats">><</link>>
                <<link "[+3w]">><<set $actors.zp.fans.career += 30000>><<goto "Debug_Cheats">><</link>>
                <<link "[+5w]">><<set $actors.zp.fans.career += 50000>><<goto "Debug_Cheats">><</link>>
                <<link "[+10w]">><<set $actors.zp.fans.career += 100000>><<goto "Debug_Cheats">><</link>>
            </div>

            /* --- 2. 秦飒 --- */
            <div style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="display:inline-block; width:70px; font-weight:bold;">秦飒:</span>
                <span style="color:#059669; margin-right:10px; font-size:0.9em;"><<print $actors.qs.fans.career>></span>
                <<link "[+1w]">><<set $actors.qs.fans.career += 10000>><<goto "Debug_Cheats">><</link>>
                <<link "[+3w]">><<set $actors.qs.fans.career += 30000>><<goto "Debug_Cheats">><</link>>
                <<link "[+5w]">><<set $actors.qs.fans.career += 50000>><<goto "Debug_Cheats">><</link>>
                <<link "[+10w]">><<set $actors.qs.fans.career += 100000>><<goto "Debug_Cheats">><</link>>
            </div>

            /* --- 3. 白小纯 --- */
            <div style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="display:inline-block; width:70px; font-weight:bold;">白小纯:</span>
                <span style="color:#059669; margin-right:10px; font-size:0.9em;"><<print $actors.new.fans.career>></span>
                <<link "[+1w]">><<set $actors.new.fans.career += 10000>><<goto "Debug_Cheats">><</link>>
                <<link "[+3w]">><<set $actors.new.fans.career += 30000>><<goto "Debug_Cheats">><</link>>
                <<link "[+5w]">><<set $actors.new.fans.career += 50000>><<goto "Debug_Cheats">><</link>>
                <<link "[+10w]">><<set $actors.new.fans.career += 100000>><<goto "Debug_Cheats">><</link>>
            </div>

            /* --- 4. 黄耀祖 --- */
            <div style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="display:inline-block; width:70px; font-weight:bold;">黄耀祖:</span>
                <<if def $actors.huang>>
                    <span style="color:#059669; margin-right:10px; font-size:0.9em;"><<print $actors.huang.fans.career>></span>
                    <<link "[+1w]">><<set $actors.huang.fans.career += 10000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+3w]">><<set $actors.huang.fans.career += 30000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+5w]">><<set $actors.huang.fans.career += 50000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+10w]">><<set $actors.huang.fans.career += 100000>><<goto "Debug_Cheats">><</link>>
                <<else>>
                    <span style="color:#999;">未解锁</span>
                <</if>>
            </div>

            /* --- 5. 刘梁周 --- */
            <div style="margin-bottom:8px; border-bottom:1px solid #eee; padding-bottom:5px;">
                <span style="display:inline-block; width:70px; font-weight:bold;">刘梁周:</span>
                <<if def $actors.liu>>
                    <span style="color:#059669; margin-right:10px; font-size:0.9em;"><<print $actors.liu.fans.career>></span>
                    <<link "[+1w]">><<set $actors.liu.fans.career += 10000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+3w]">><<set $actors.liu.fans.career += 30000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+5w]">><<set $actors.liu.fans.career += 50000>><<goto "Debug_Cheats">><</link>>
                    <<link "[+10w]">><<set $actors.liu.fans.career += 100000>><<goto "Debug_Cheats">><</link>>
                <<else>>
                    <span style="color:#999;">未解锁</span>
                <</if>>
            </div>

        </div>

        <hr style="border-top: 1px dashed #ccc;">

        /* =========================================
           5. 时间控制区
           ========================================= */
        <div style="font-weight:bold; margin-bottom:10px; color:#d97706;">⏩ 时间控制</div>
        
        <<link "⏩ 跳跃 (+3月)">>
            <<set $month += 3>>
            <<goto "Debug_Cheats">>
        <</link>>
        &nbsp;&nbsp;
        <<link "🚀 飞跃 (+5月)">>
            <<set $month += 5>>
            <<goto "Debug_Cheats">>
        <</link>>

        /* =========================================
           6. 剧情快捷入口（测试用）
           ========================================= */
        <div style="margin-top:20px; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px; text-align:left;">
            <div style="font-weight:bold; margin-bottom:6px; color:#0f766e; text-align:center;">🧪 剧情快捷入口</div>
            <div style="font-size:0.78em; color:#94a3b8; text-align:center; margin-bottom:8px;">
                不用等主线推进，直接把剧情条件补齐后跳过去
            </div>

            <div style="text-align:center; margin-bottom:8px;">
                <<link "📞 加密线路">>
                    <<set $zp_story_stage to 3>>
                    <<set $month to Math.max(($month || 0), 39)>>
                    <<goto "Secret_Base">>
                <</link>>
                &nbsp;|&nbsp;
                <<link "🎬 深渊黎明探班">>
                    <<set $zp_story_stage to 3>>
                    <<set $movie_visit_open to true>>
                    <<set $month to 47>>
                    <<goto "Deep_Visit_Hub">>
                <</link>>
            </div>
            <div style="font-size:0.75em; color:#94a3b8; text-align:center;">
                （探班会把月份改到第 47 月，才能看到第一场戏）
            </div>
        </div>

        /* =========================================
           7. 一键杀青（测试用）—— 会结算收益
           ========================================= */
        <div style="margin-top:12px; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px;">
            <div style="font-weight:bold; margin-bottom:6px; color:#b45309;">🎬 一键杀青（含收益结算）</div>
            <<link "结束所有在拍通告并结算">>
                <<goto "Debug_Settle_All">>
            <</link>>
            <div style="margin-top:5px; font-size:0.75em; color:#94a3b8;">
                会像正常杀青一样出片酬小票（片酬 / 分成 / 税 / 涨粉 / 妆造），
                培训 / 封杀 / 产假不受影响。
            </div>
        </div>

        /* =========================================
           8. 作品库测试（2026-10-27 新增）
           ========================================= */
        <div style="margin-top:12px; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px;">
            <div style="font-weight:bold; margin-bottom:6px; color:#7c3f58;">🎞️ 作品库测试</div>
            <div style="text-align:center; margin-bottom:6px;">
                <<link "打开作品库">><<goto "Film_Library">><</link>>
                &nbsp;|&nbsp;
                <<link "全部立即播出">>
                    <<if not def $film_lib>><<set $film_lib to []>>><</if>>
                    <<set _fc to 0>>
                    /* 注意：这里必须用下标循环。for-range 拿到的是元素副本，
                       改副本的 air 写不回 $film_lib —— 之前点了没反应就是这个原因。 */
                    <<for _fi to 0; _fi < $film_lib.length; _fi++>>
                        <<if $film_lib[_fi].status is "pending">>
                            <<set $film_lib[_fi].air to $month>>
                            <<set _fc += 1>>
                        <</if>>
                    <</for>>
                    <<if _fc > 0>>
                        <<Film_Air_Tick>>
                        <<set _fl to "">>
                        <<for _fi to 0; _fi < $film_air_results.length; _fi++>>
                            <<if _fi > 0>><<set _fl to _fl + "、" >><</if>>
                            <<set _fl to _fl + $film_air_results[_fi].name + "（" + $film_air_results[_fi].score + " 分）">>
                        <</for>>
                        <<set $fl_flash to "🎬 已让 " + _fc + " 部作品立刻播出 —— " + _fl>>
                    <<else>>
                        <<set $fl_flash to "⚠️ 现在没有待播的作品。先去通告中心接部戏，杀青之后才会进作品库。">>
                    <</if>>
                    <<goto "Film_Library">>
                <</link>>
                &nbsp;|&nbsp;
                <<link "清空作品库">>
                    <<set $film_lib to []>>
                    <<set $film_used to { s: [], a: [], b: [], c: [] }>>
                    <<set $debug_film_msg to "作品库和剧本记录都清空了（已接过的戏会重新出现）。">>
                    <<goto "Debug_Cheats">>
                <</link>>
            </div>
            <<if def $debug_film_msg and $debug_film_msg neq "">>
                <div style="font-size:0.78em; color:#059669; text-align:center; margin-bottom:5px;"><<print $debug_film_msg>></div>
                <<set $debug_film_msg to "">>
            <</if>>
            <div style="font-size:0.75em; color:#94a3b8; text-align:center;">
                共 <<print $film_lib.length>> 部作品 · 已接剧本 <<print $film_used.s.length + $film_used.a.length + $film_used.b.length + $film_used.c.length>> 部
            </div>
        </div>

        <hr>
        <p style="font-size:0.8em; color:gray;">*所有操作点击即生效，数值自动刷新。</p>
        
        <<link "🔙 返回办公室">><<goto "Office">><</link>>
    </div>
</div>`
});

/* ---------- 故事块：Debug_Settle_All ----------
   一键杀青的结算页。做法和月结里的 NM_Filming 完全一样：
   逐个把「拍摄中」的艺人切到 $current_actor，调用 Job_Settle 出小票，
   然后再把 busy / project / job_type 清空。
   ⚠️ 不要把这个逻辑写成"清空状态"，那样玩家看不到收益。
   ------------------------------------------------- */
window.__STORY_PASSAGES.push({
  name: "Debug_Settle_All",
  src: `<<nobr>>
<<set _before_money to ($money || 0)>>
<<set _settle_list to []>>
<<for _k range Object.keys($actors)>>
    <<set _x to $actors[_k]>>
    <<if def _x and (_x.busy_months || 0) > 0 and (_x.job_type is "drama" or _x.job_type is "variety" or _x.job_type is "fashion" or _x.job_type is "stage")>>
        <<run _settle_list.push(_k)>>
    <</if>>
<</for>>

<div class="tech-card" style="border: 2px dashed #f59e0b;">
    <div class="header-banner" style="background: #10b981; color: #fff;">🎬 一键杀青 · 收益结算</div>

    <div style="padding: 18px 20px 24px;">

        <<if _settle_list.length == 0>>
            <div class="nm-soft blue">
                <h4>现在没有正在拍摄的通告</h4>
                <p>所有人都是空闲状态，没有可以结算的片酬。</p>
            </div>
        <<else>>
            <p style="font-size: 13px; color: #64748B; margin: 0 0 14px;">
                共 <<print _settle_list.length>> 个通告杀青，结算明细如下（和正常月结完全一致）：
            </p>

            <<for _k range _settle_list>>
                <<set $current_actor to _k>>
                <<set _a to $actors[_k]>>
                <<set _pn to (_a.project_name || "通告")>>
                <<if not def _a.res_level>><<set $req_res to "b">><</if>>
                <div class="nm-card">
                    <div class="nm-sec biz">杀青</div>
                    <div style="font-size:13px; color:#3D4B61; line-height:1.8; margin-bottom:6px;">
                        🎉 <<print _a.name>> 的 <<print _pn>> 杀青了
                    </div>
                    <<Job_Settle _a.job_type>>
                </div>
                <<set _a.busy_months to 0>>
                <<set _a.project_name to "">>
                <<set _a.job_type to "">>
            <</for>>

            <div class="nm-card" style="background: #ECFDF5; border-color: #A7F3D0;">
                <div class="nm-sec" style="color:#047857;">合计</div>
                <div style="font-size: 13.5px; color:#065F46; line-height:1.9;">
                    本次杀青一共为公司入账
                    <b style="font-size: 1.15em;">+ $<<print Math.floor(($money || 0) - _before_money)>> 万</b><br>
                    <span style="font-size: 12px; color:#4B7F68;">当前资金：<<print $money>> 万</span>
                </div>
            </div>
        <</if>>

        <div class="continue-row" style="margin-top: 18px;">
            <<link "🔙 返回测试面板">><<goto "Debug_Cheats">><</link>>
            &nbsp;&nbsp;
            <<link "🏢 回办公室">><<goto "Office">><</link>>
        </div>

    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Game_Manual ---------- */
window.__STORY_PASSAGES.push({
  name: "Game_Manual",
  src: `<<nobr>>
<div class="tech-card" style="padding:26px 30px 24px;">
    <div class="header-banner" style="margin-bottom:20px; background: linear-gradient(to right, #1e293b, #334155);">
        <span>📘 通关攻略</span>
    </div>

    <div style="max-height:76vh; min-height:480px; overflow-y:auto; padding-right:14px;">

<style>
.mn-wrap{max-width:880px;margin:0 auto;}
.mn-nav{position:sticky;top:0;z-index:9;display:flex;gap:5px;flex-wrap:wrap;padding:9px 0 10px;margin:-4px 0 4px;background:linear-gradient(180deg,#FFFFFF 78%,rgba(255,255,255,0));border-bottom:1px solid #EDF2FA;}
.mn-nav-i{display:inline-flex;align-items:center;list-style:none;font-size:11.5px;font-weight:800;letter-spacing:.02em;color:#4A6FA3 !important;background:#F1F6FD;border:1px solid #E1EAF6;border-radius:999px;padding:3px 10px;cursor:pointer;text-decoration:none !important;}
.mn-nav-i::marker{content:none;}
.mn-nav-i:hover{background:#E4EEFB;color:#2E4E7C !important;}
.mn-h{display:flex;align-items:baseline;gap:9px;margin:28px 0 10px;padding-bottom:8px;border-bottom:2px solid #EDF2FA;scroll-margin-top:48px;}
.mn-n{flex:0 0 24px;height:24px;border-radius:7px;background:#2F4A7C;color:#fff;font:900 12px/24px ui-monospace,Menlo,monospace;text-align:center;transform:translateY(-1px);}
.mn-t{font-size:16.5px;font-weight:900;color:#22314E;letter-spacing:.02em;}
.mn-s{font-size:10.5px;color:#A2AEC1;letter-spacing:.18em;margin-left:auto;text-transform:uppercase;}
.mn-p{font-size:13.5px;line-height:1.9;color:#4A5870;margin:0 0 10px;}
.mn-p b{color:#22314E;}
.mn-tb{width:100%;border-collapse:collapse;font-size:12.8px;margin:6px 0 10px;}
.mn-tb th{background:#F3F7FD;color:#3E5B8C;font-weight:800;text-align:left;padding:8px 10px;border-bottom:1px solid #E1EAF6;white-space:nowrap;}
.mn-tb td{padding:8px 10px;border-bottom:1px solid #EFF4FB;color:#4A5870;line-height:1.7;vertical-align:top;}
.mn-tb td b{color:#22314E;}
.mn-tb tr:last-child td{border-bottom:none;}
.mn-tb .c{white-space:nowrap;}
.mn-tb .m{font-family:ui-monospace,Menlo,monospace;font-weight:800;color:#2F4A7C;}
.mn-box{border-radius:10px;padding:12px 15px;margin:8px 0 12px;font-size:12.8px;line-height:1.85;}
.mn-box b{font-weight:800;}
.mn-red{background:#FDF1F3;border:1px solid #F2D5DA;color:#8E3B47;}
.mn-red b{color:#A83B4C;}
.mn-grn{background:#EFF8F3;border:1px solid #CFE9DC;color:#2F6E56;}
.mn-grn b{color:#256A52;}
.mn-amb{background:#FDF7EC;border:1px solid #F0E2C4;color:#7C6231;}
.mn-amb b{color:#8A6A2B;}
.mn-blu{background:#F1F6FD;border:1px solid #D8E6F8;color:#395A87;}
.mn-blu b{color:#2E4E7C;}
.mn-check{border:1px solid #DCE7F6;border-radius:13px;padding:15px 17px;background:linear-gradient(160deg,#FBFDFF,#F4F8FE);margin-top:6px;}
.mn-check-h{font-size:11.5px;letter-spacing:.16em;color:#7C90AF;font-weight:800;margin-bottom:10px;}
.mn-kpis{display:flex;gap:9px;flex-wrap:wrap;}
.mn-kpi{flex:1 1 84px;min-width:80px;background:#fff;border:1px solid #E5EDF8;border-radius:9px;padding:9px 10px;text-align:center;}
.mn-kpi span{display:block;font-size:10.5px;color:#93A2B8;letter-spacing:.08em;margin-bottom:4px;}
.mn-kpi b{font:900 17px/1.1 ui-monospace,Menlo,monospace;white-space:nowrap;display:block;}
.k-good{color:#2F6E56;} .k-warn{color:#B4813A;} .k-bad{color:#B4515F;} .k-idle{color:#8A98AE;}
.mn-vd{margin-top:12px;padding-top:11px;border-top:1px dashed #DCE7F6;font-size:12.8px;line-height:1.85;color:#4A5870;}
.mn-vd b{font-weight:900;}
.mn-tag{display:inline-block;padding:1px 7px;border-radius:999px;font-size:10.5px;font-weight:800;letter-spacing:.04em;vertical-align:1px;}
.tg-req{background:#FDECEF;color:#B4515F;}
.tg-rec{background:#E9F5EF;color:#2F6E56;}
.tg-ok{background:#EEF3FB;color:#4A6FA3;}
.mn-swipe{display:none;}
@media (max-width:860px){ .mn-swipe{display:block;font-size:11px;color:#A2AEC1;margin:-4px 0 6px;} }
</style>

<div class="mn-wrap">

<div class="mn-nav">
    <a class="mn-nav-i" href="#mn1">① 生死线</a>
    <a class="mn-nav-i" href="#mn2">② 结局</a>
    <a class="mn-nav-i" href="#mn3">③ 剧情月份</a>
    <a class="mn-nav-i" href="#mn4">④ 一线</a>
    <a class="mn-nav-i" href="#mn5">⑤ 选项</a>
    <a class="mn-nav-i" href="#mn6">⑥ 加密线路</a>
    <a class="mn-nav-i" href="#mn7">⑦ 每月</a>
    <a class="mn-nav-i" href="#mn8">⑧ 死法</a>
    <a class="mn-nav-i" href="#mn9">⑨ 存档</a>
</div>

<div class="mn-check">
    <div class="mn-check-h">现在这一档 · 照这样打下去的结局</div>
    <div class="mn-kpis">
        <div class="mn-kpi"><span>月份</span><b class="k-idle"><<print $month>>/60</b></div>
        <div class="mn-kpi"><span>资金(万)</span><b class="<<if $money < 5000>>k-warn<<else>>k-good<</if>>"><<print $money>></b></div>
        <div class="mn-kpi"><span>信任</span><b class="<<if $month < 25>>k-idle<<elseif $zp_trust < 40>>k-bad<<else>>k-good<</if>>"><<print ($zp_trust || 0)>></b></div>
        <div class="mn-kpi"><span>正义</span><b class="<<if $month < 25>>k-idle<<elseif $justice < 70>>k-bad<<else>>k-good<</if>>"><<print ($justice || 0)>></b></div>
        <div class="mn-kpi"><span>羁绊</span><b class="k-idle"><<print ($zp_bond || 0)>></b></div>
        <div class="mn-kpi"><span>暴露</span><b class="<<if def $exposure>><<if $exposure >= 55>>k-bad<<else>>k-idle<</if>><<else>>k-idle<</if>>"><<if def $exposure>><<print $exposure>><<else>>—<</if>></b></div>
    </div>
    <div class="mn-vd">
        <<if $month < 25>>
            <<set _zp_fans to FanSum($actors.zp)>>
            <<set _zp_star to _zp_fans + ($actors.zp.topic || 0) * 60 + ($actors.zp.reputation || 0) * 80 + Math.max($actors.zp.acting || 0, $actors.zp.fashion || 0, $actors.zp.stage || 0) * 60 + ($actors.zp.looks || 0) * 20>>
            展鹏：<<print $actors.zp.rank_label>> · 粉丝 <b><<print _zp_fans>></b> · 星光 <b><<print Math.round(_zp_star)>></b>。
            <<if _zp_star <= 150000>>离一线还差 <b><<print Math.ceil(150001 - _zp_star)>></b> 星光，补法见 ④。<</if>>
            <<if _zp_fans < 80000>>粉丝也差 <b><<print 80000 - _zp_fans>></b>。<</if>>
        <<elseif $month < 36>>
            下一道坎：第 36 月暴雨夜要拿 5000 万。现在账上 <<print $money>> 万，
            <<if $money < 5000>>差 <<print 5000 - $money>> 万，接下来别买流量、别组局。<</if>>
        <<elseif $month < 60>>
            照现在这样走到第 60 月：
            <<if $zp_story_stage is 99>>
                <b class="k-bad">BE</b>（卧底线已断）
            <<elseif ($zp_trust || 0) < 40>>
                <b class="k-bad">BE</b>——信任 <<print ($zp_trust || 0)>>，不足 40，补不回来，只能读档
            <<elseif ($justice || 0) < 70>>
                <b class="k-bad">BE</b>——正义 <<print ($justice || 0)>>，还差 <<print 70 - ($justice || 0)>> 点
                <<if $month < 57>>，加密线路「抹黑展鹏」一次 +5<</if>>
            <<elseif ($justice || 0) > 70 and ($justice || 0) > ($zp_bond || 0)>>
                <b class="k-good">归队（HE）</b>——正义压过羁绊
            <<else>>
                <b class="k-good">留下（HE）</b>——正义够，但没高过羁绊
            <</if>>
        <<else>>
            已经是结局判定的月份了。
        <</if>>
    </div>
</div>

<div class="mn-h" id="mn1"><span class="mn-n">01</span><span class="mn-t">五道生死线</span><span class="mn-s">Hard Gates</span></div>
<table class="mn-tb">
    <tr><th>月份</th><th>硬条件</th><th>没做到</th></tr>
    <tr><td class="c m">第 25 月</td><td>展鹏是一线：星光 &gt; 150,000 且 粉丝 ≥ 80,000</td><td>直接进【平庸的宁静】，游戏结束</td></tr>
    <tr><td class="c m">第 60 月</td><td>信任 ≥ 40（低于即 BE）</td><td>BE【无声的牺牲】</td></tr>
    <tr><td class="c m">第 60 月</td><td>正义 ≥ 70</td><td>BE。两条 HE 也都要求正义 ≥ 70</td></tr>
    <tr><td class="c m">第 36 月</td><td>暴雨夜现金 ≥ 5000 万</td><td>卧底线关闭、展鹏失联 → BE，不给选项</td></tr>
    <tr><td class="c m">第 39–56 月</td><td>暴露值 &lt; 70</td><td>加密线路强制切断 → BE</td></tr>
</table>
<div class="mn-box mn-red">
    <b>信任只有 4 次机会</b>：第 25、26、27、28 月各一次，每次 +10，合计正好 40。错一次就永远差 10 点，无法补救。
</div>

<div class="mn-h" id="mn2"><span class="mn-n">02</span><span class="mn-t">结局判定</span><span class="mn-s">Endings</span></div>
<p class="mn-p">顺序固定，从上往下第一条命中即停：</p>
<table class="mn-tb">
    <tr><th>顺序</th><th>条件</th><th>结果</th></tr>
    <tr><td class="c m">1</td><td>卧底线断了（stage = 99）</td><td>BE</td></tr>
    <tr><td class="c m">2</td><td>信任 &lt; 40</td><td>BE</td></tr>
    <tr><td class="c m">3</td><td>正义 &lt; 70</td><td>BE</td></tr>
    <tr><td class="c m">4</td><td>正义 &gt; 70 <b>且</b> 正义 &gt; 羁绊</td><td>HE · 荣耀归队</td></tr>
    <tr><td class="c m">5</td><td>其余（正义 ≥ 70 但没高过羁绊）</td><td>HE · 人间烟火</td></tr>
</table>
<div class="mn-box mn-amb">
    第 4 条是<b>严格大于</b>。正义正好 70 既不算 BE，也进不了归队，会落到「留下」。要归队就把正义做到 75 以上。
</div>
<p class="mn-p"><b>归队</b>：正义 ≥ 75，且羁绊低于正义。少拿羁绊——不探班，第 28 月选「考虑一下」，第 29 月选「他是线人」，第 30 月选「先拒绝方末」。躲不掉的三笔羁绊：第 36 月、第 53 月、第 56 月，各 +10。</p>
<p class="mn-p"><b>留下</b>：羁绊尽量高，正义做到 71 以上就停。<b>不能低于 70。</b></p>

<div class="mn-h" id="mn3"><span class="mn-n">03</span><span class="mn-t">剧情固定在哪些月份</span><span class="mn-s">Timeline</span></div>
<p class="mn-p">每一段剧情只在它自己那个月结算时触发，不会提前也不会补发。跳月跳过的剧情，去<b>「🎞️ 剧情档案」</b>看，那里标着「没看到」，可以点开补看。</p>

<table class="mn-tb">
    <tr><th>月份</th><th>剧情</th><th>触发条件</th></tr>
    <tr><td class="c m">1–24</td><td>自由经营</td><td>—</td></tr>
    <tr><td class="c m">25</td><td>突发绯闻</td><td><b>展鹏须已一线</b>，否则当场结局</td></tr>
    <tr><td class="c m">26</td><td>路透照流出</td><td>—</td></tr>
    <tr><td class="c m">27</td><td>周一见：实锤？</td><td>—</td></tr>
    <tr><td class="c m">28</td><td>似曾相识的面孔 → 当面对峙</td><td>同月两段，都有选项</td></tr>
    <tr><td class="c m">29</td><td>暗巷追踪</td><td>—</td></tr>
    <tr><td class="c m">30</td><td>帝国娱乐的报价 → 残酷的真相</td><td>同月两段，都有选项</td></tr>
    <tr><td class="c m">31</td><td>断尾求生（签字离婚）</td><td>触发后展鹏离队、黄耀祖入职</td></tr>
    <tr><td class="c m">32</td><td>新的拼图（刘梁周签约）</td><td>须已离婚</td></tr>
    <tr><td class="c m">34</td><td>票房惨案</td><td>须已离婚</td></tr>
    <tr><td class="c m">35</td><td>舆论反噬</td><td>须已离婚</td></tr>
    <tr><td class="c m">36</td><td>暴雨夜归</td><td>须已离婚 + <b>现金 ≥ 5000 万</b></td></tr>
    <tr><td class="c m">37</td><td>沉默的砖头</td><td>须已进入卧底线</td></tr>
    <tr><td class="c m">38</td><td>加密短信</td><td>须已进入卧底线。此后办公室出现「加密线路」</td></tr>
    <tr><td class="c m">45</td><td>五亿的邀约（《深空黎明》）</td><td>须已进入卧底线</td></tr>
    <tr><td class="c m">46</td><td>开机</td><td>解锁「剧组探班」，只在杀青前有效</td></tr>
    <tr><td class="c m">50</td><td>家里多了个人</td><td>固定 +正义 10、+信任 10</td></tr>
    <tr><td class="c m">52</td><td>杀青</td><td>探班入口关闭</td></tr>
    <tr><td class="c m">53</td><td>暴风雪 → 天亮之后</td><td>固定 +羁绊 10</td></tr>
    <tr><td class="c m">54</td><td>废弃仓库（方末身份揭晓）</td><td>须已进入卧底线</td></tr>
    <tr><td class="c m">56</td><td>黎明前的黑暗</td><td>固定 +羁绊 10。最后一个还能刷数值的月份</td></tr>
    <tr><td class="c m">57</td><td>三亿与静默</td><td>加密线路永久关闭</td></tr>
    <tr><td class="c m">58</td><td>收网</td><td>—</td></tr>
    <tr><td class="c m">59</td><td>焦急的等待</td><td>最后一个能经营的月份</td></tr>
    <tr><td class="c m">60</td><td>命运的分岔</td><td>判定结局</td></tr>
</table>
<div class="mn-box mn-blu">
    <b>剧组探班</b>（第 47–51 月开放，每次耗 10 体力，每篇只能拿一次）：<br>
    ① 第 47 月 +羁绊 6　② 第 47 月 +羁绊 8　③ 第 48 月 +羁绊 6、+正义 5　④ 第 49 月 +羁绊 8　⑤ 第 51 月需羁绊 &gt; 70，+羁绊 12、+信任 5。<br>
    五篇全看共 +羁绊 40、+正义 5、+信任 5。归队线不要碰，留下线靠它堆羁绊。
</div>

<div class="mn-h" id="mn4"><span class="mn-n">04</span><span class="mn-t">把展鹏推上一线</span><span class="mn-s">Rank Up</span></div>
<div class="mn-box mn-blu">
    <b>星光</b> = 粉丝总数 + 话题 × 60 + 口碑 × 80 + 最高技能 × 60 + 颜值 × 20<br>
    最终段位取「星光段位」和「粉丝段位」<b>较低的那个</b>，两个都得够。
</div>
<table class="mn-tb">
    <tr><th>段位</th><th>星光</th><th>粉丝总数</th></tr>
    <tr><td class="c">三线</td><td>&gt; 20,000</td><td>5,000</td></tr>
    <tr><td class="c">二线</td><td>&gt; 60,000</td><td>25,000</td></tr>
    <tr><td class="c"><b>一线</b></td><td><b>&gt; 150,000</b></td><td><b>80,000</b></td></tr>
    <tr><td class="c">顶流</td><td>&gt; 420,000</td><td>300,000</td></tr>
</table>
<p class="mn-p">展鹏开局：粉丝 81,500、星光 96,960。<b>粉丝刚好够一线，星光差 53,041。</b>只靠接戏涨不到，必须在第 25 月前手动刷。</p>
<table class="mn-tb">
    <tr><th>手段</th><th>成本</th><th>星光变化</th></tr>
    <tr><td>🍬 工业糖精 ×10（粉丝后援）</td><td>400 万 + 5 万流量 + 1 行动点</td><td><b>+15,200</b>（CP 粉 +20000，毒唯 −3000，妈粉 −1000，口碑 −10）</td></tr>
    <tr><td>😭 卖惨虐粉 ×10</td><td>300 万 + 3 万流量 + 1 行动点</td><td>+7,800（口碑 −15）</td></tr>
    <tr><td>📸 官方营业 ×10</td><td>300 万 + 2 万流量 + 1 行动点</td><td>+6,600（口碑 −10）</td></tr>
</table>
<div class="mn-box mn-grn">
    <b>最省事：连续做 4 次「工业糖精 ×10」。</b>星光 96,960 → 157,760，过线。<br>
    总成本 1600 万 + 20 万流量 + 4 行动点。流量在「公关作战 → 流量加油站」买，2000 万换 6 万流量。<br>
    想留余量就做 5 次（星光约 17.3 万），代价是口碑掉到 10 左右。
</div>

<div class="mn-h" id="mn5"><span class="mn-n">05</span><span class="mn-t">每个岔路口选哪句</span><span class="mn-s">Choices</span></div>
<p class="mn-p"><b>第 25–31 月</b>（前四行是信任，必须全对）</p>

<table class="mn-tb">
    <tr><th>月份</th><th>选这句</th><th>效果</th></tr>
    <tr><td class="c m">25</td><td>「信任他」<span class="mn-tag tg-req">必选</span></td><td>信任 +10；「询问他」不加</td></tr>
    <tr><td class="c m">26</td><td>「安慰展鹏」<span class="mn-tag tg-req">必选</span></td><td>信任 +10；「质问展鹏」不加</td></tr>
    <tr><td class="c m">27</td><td>「展鹏不愿意让你担心」<span class="mn-tag tg-req">必选</span></td><td>信任 +10；「展鹏背叛了你们的婚姻」不加</td></tr>
    <tr><td class="c m">28</td><td>「他有难言的苦衷」<span class="mn-tag tg-req">必选</span></td><td>信任 +10；「你不得不怀疑了」不加</td></tr>
    <tr><td class="c m">28</td><td>「明确拒绝」／「考虑一下」</td><td>前者羁绊 +10，后者不加</td></tr>
    <tr><td class="c m">29</td><td>「他是警察！」／「他是线人」</td><td>前者羁绊 +10，后者不加</td></tr>
    <tr><td class="c m">30</td><td>「先向展鹏解释」／「先拒绝方末」</td><td>前者羁绊 +10，后者不加</td></tr>
    <tr><td class="c m">30</td><td>「答应他」／「拒绝他」</td><td>前者正义 +10，后者羁绊 +10</td></tr>
    <tr><td class="c m">31</td><td>「故意承认」／「避而不谈」</td><td>前者正义 +10，后者羁绊 +10</td></tr>
</table>
<p class="mn-p"><b>第 32–36 月</b></p>
<table class="mn-tb">
    <tr><th>月份</th><th>选这句</th><th>效果</th></tr>
    <tr><td class="c m">32</td><td>「天才学霸」人设<span class="mn-tag tg-rec">归队</span></td><td>正义 +10</td></tr>
    <tr><td class="c m">32</td><td>「咸鱼替身」人设<span class="mn-tag tg-rec">留下</span></td><td>羁绊 +10，刘梁周话题 +300、黄耀祖话题 +200</td></tr>
    <tr><td class="c m">35</td><td>「不帮 · 相信他能自己处理」<span class="mn-tag tg-rec">归队</span></td><td>正义 +10；「帮他压下去」花 50 万，不加数值</td></tr>
    <tr><td class="c m">36</td><td>「给钱」<span class="mn-tag tg-req">必选</span></td><td>花 5000 万，羁绊 +10，开启卧底线；「不给」= BE</td></tr>
</table>
<p class="mn-p"><b>不用选、到点自动加的</b>：第 50 月 正义 +10 / 信任 +10；第 52 月 正义 +10；第 53 月 羁绊 +10；第 56 月 羁绊 +10。</p>

<div class="mn-h" id="mn6"><span class="mn-n">06</span><span class="mn-t">加密线路</span><span class="mn-s">CH-007</span></div>
<p class="mn-p">第 39 月起办公室出现入口，第 57 月关闭。每执行一次任务进度 +5，同时涨暴露值，暴露到 70 就断线。</p>
<table class="mn-tb">
    <tr><th>操作</th><th>成本</th><th>收益</th></tr>
    <tr><td>📢 全网抹黑展鹏</td><td>200 万</td><td>正义 +5、信任 +5</td></tr>
    <tr><td>⚔️ 狙击帝国娱乐</td><td>300 万</td><td>羁绊 +10</td></tr>
    <tr><td>💗 高调宠爱「替身」</td><td>100 流量</td><td>正义 +5、羁绊 −5</td></tr>
</table>
<div class="mn-box mn-blu">
    <b>每次涨多少暴露</b>：信任 ≥ 60 → +5；信任 40–59 → +10；信任 &lt; 40 → +15。上限 70。<br>
    信任 60 时能刷 13 次，信任 40 时只能刷 6 次。所以先把信任做高再来刷。
</div>
<div class="mn-box mn-amb">
    <b>归队</b>：只做「全网抹黑展鹏」，一次正义 +5。<br>
    <b>留下</b>：做「狙击帝国娱乐」堆羁绊，再用抹黑把正义顶到 71 以上。<br>
    任务进度到 100 后不再有操作，别指望用它刷分。
</div>

<div class="mn-h" id="mn7"><span class="mn-n">07</span><span class="mn-t">每月固定收支</span><span class="mn-s">Loop</span></div>
<table class="mn-tb">
    <tr><th>项目</th><th>金额</th></tr>
    <tr><td>公司运营</td><td>300 万</td></tr>
    <tr><td>艺人工资</td><td>每人「段位 × 100」万：糊咖 100、三线 200、二线 300、一线 400、顶流 500</td></tr>
    <tr><td>流量维护</td><td>糊咖 200、三线 1,000、二线 3,000、一线 8,000、顶流 26,000</td></tr>
    <tr><td>每年 12 月</td><td>额外 500 万</td></tr>
</table>
<div class="mn-box mn-red">
    流量不足时<b>全员话题 −20、集体掉咖</b>。顶流一个人每月吃 26,000 流量，比三个一线加起来还多——别把所有人都推上去。
</div>
<p class="mn-p"><b>每月 8 点行动点</b>，通告、培训、粉丝运营各 1 点；组局、买资源、探班不花行动点，只花体力。</p>
<p class="mn-p"><b>接戏</b>：S/A/B/C 要求咖位 4/3/2/1。差 2 级以上面试直接被拒；艺人比资源高 2 级以上，口碑 −10（一线别去接 C 级）。</p>
<p class="mn-p"><b>顺序</b>：通告中心派资源 → 剩余行动点给粉丝运营或报班 → 缺钱去资源筹备组局 → 点「休息 · 结束本月」，剧情在结算时插入。</p>

<div class="mn-h" id="mn8"><span class="mn-n">08</span><span class="mn-t">六种死法</span><span class="mn-s">Traps</span></div>
<table class="mn-tb">
    <tr><th>症状</th><th>原因</th><th>补救</th></tr>
    <tr><td>第 25 月直接结局</td><td>展鹏没到一线</td><td>开局就刷糖精，别等他慢慢涨</td></tr>
    <tr><td>结局写「信任不足」</td><td>25–28 月错一次</td><td><b>无法补救</b>，只能读档</td></tr>
    <tr><td>结局写「正义不足」</td><td>只走感情线</td><td>56 月前用「抹黑展鹏」补，每次 +5</td></tr>
    <tr><td>第 36 月展鹏失联</td><td>现金不足 5000 万</td><td>35 月前别买流量、别组局</td></tr>
    <tr><td>加密线路突然断</td><td>暴露到 70</td><td><b>无法补救</b>，刷之前先把信任做到 60</td></tr>
    <tr><td>艺人被全网抵制</td><td>危险值到 100</td><td>危险值 50 以上就去公关部洗地，或做公益清零</td></tr>
</table>

<div class="mn-h" id="mn9"><span class="mn-n">09</span><span class="mn-t">存档</span><span class="mn-s">Save</span></div>
<p class="mn-p">三个值得存档的点：<b>第 24 月</b>（进剧情前确认一线 + 5000 万）、<b>第 35 月</b>（确认现金够）、<b>第 59 月</b>（判定前，可以刷三个结局）。</p>
<div class="mn-box mn-blu">
    顶部永远能看到<b>「💾 存档」</b>和<b>「📂 读档」</b>。<br>
    · 存档：点一下写进「手动存档」，提示当前月份。<br>
    · 读档：打开存档中心，有自动存档 + 手动 1/2/3 四格，每格写着「第几月 · 资金 · 时间」。<br>
    · 每翻一页都会自动存档，忘存也能接着玩。<br>
    · 换设备：存档中心 →「⬇️ 导出存档文件」，新设备「⬆️ 导入存档」。
</div>
<p class="mn-p">存档存在浏览器本地，绑定网址，不需要服务器。通了之后有一页总结算：评级、五年成绩单、每个艺人的去向。</p>

</div>

    </div>

    <div style="text-align:center; margin-top:20px;">
        <<button "🔙 已阅，回办公室" "Office">><</button>>
    </div>
</div>
<</nobr>>`
});

/* ---------- 故事块：Game_Notice ---------- */
window.__STORY_PASSAGES.push({
  name: "Game_Notice",
  src: `<<nobr>>
<style>
    /* ===== 游玩须知 ===== */
    .nt-card {
        max-width: 660px !important;
        margin: 26px auto !important;
        padding: 0 !important;
        overflow: hidden;
        position: relative;
    }
    .nt-topline {
        height: 4px;
        background: linear-gradient(90deg, #7A9AD6, #8CB9E2 22%, #74C2A2 46%, #E7BE7E 68%, #F0B296 84%, #E39FAF);
        opacity: .85;
    }
    .nt-hero {
        padding: 26px 30px 20px;
        text-align: center;
        background: linear-gradient(168deg, rgba(232, 242, 254, .72), rgba(255, 250, 244, .35));
        border-bottom: 1px solid rgba(122, 154, 214, .14);
    }
    .nt-icon {
        font-size: 30px;
        line-height: 1;
        margin-bottom: 10px;
        filter: saturate(.9);
    }
    .nt-title {
        margin: 0;
        font-size: 22px;
        font-weight: 900;
        letter-spacing: .14em;
        color: #2F4A7C;
    }
    .nt-sub {
        margin-top: 8px;
        font-size: 11.5px;
        letter-spacing: .28em;
        color: #93A2B8;
        text-transform: uppercase;
    }
    .nt-body {
        padding: 8px 30px 4px;
    }
    .nt-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .nt-list li {
        display: flex;
        align-items: flex-start;
        gap: 11px;
        padding: 12px 0;
        font-size: 14px;
        line-height: 1.7;
        color: #4A5870;
        border-bottom: 1px dashed rgba(122, 154, 214, .18);
    }
    .nt-list li:last-child { border-bottom: none; }
    .nt-ico {
        flex: 0 0 22px;
        text-align: center;
        font-size: 14px;
        line-height: 1.7;
        opacity: .9;
    }
    .nt-foot {
        margin: 6px 30px 0;
        padding: 16px 0 0;
        border-top: 1px solid rgba(122, 154, 214, .16);
        text-align: center;
        font-size: 11.5px;
        line-height: 1.9;
        color: #8A95A8;
    }
    .nt-foot b { color: #5A6B85; font-weight: 700; }
    .nt-start {
        display: block;
        margin: 18px 30px 26px;
        padding: 14px 0;
        text-align: center;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: .08em;
        color: #FFFDF8 !important;
        text-decoration: none !important;
        border-radius: 12px;
        background: linear-gradient(122deg, #3B4A6E 0%, #46618F 52%, #5B79A6 100%);
        box-shadow: 0 14px 26px -18px rgba(59, 74, 110, .9), inset 0 1px 0 rgba(255, 255, 255, .18);
        transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
        cursor: pointer;
    }
    .nt-start:hover {
        transform: translateY(-2px);
        filter: brightness(1.06);
        box-shadow: 0 18px 30px -18px rgba(59, 74, 110, .95), inset 0 1px 0 rgba(255, 255, 255, .22);
    }
    .nt-start:active { transform: translateY(0); }

    @media (max-width: 560px) {
        .nt-hero { padding: 22px 20px 16px; }
        .nt-body { padding: 6px 20px 2px; }
        .nt-list li { font-size: 13.2px; padding: 11px 0; }
        .nt-foot { margin: 4px 20px 0; }
        .nt-start { margin: 16px 20px 22px; }
    }
</style>

<div class="tech-card nt-card">

    <div class="nt-topline"></div>

    <div class="nt-hero">
        <div class="nt-icon">⚠️</div>
        <h1 class="nt-title">游玩须知</h1>
        <div class="nt-sub">Read Me First</div>
    </div>

    <div class="nt-body">
        <ul class="nt-list">
            <li>
                <span class="nt-ico">📖</span>
                <span>免费同人衍生作品，仅供娱乐，禁止商用，请勿上升真人。</span>
            </li>
            <li>
                <span class="nt-ico">🎭</span>
                <span>韩证飞、展鹏、黄耀祖、刘梁周的原型为演员杨旭文饰演的角色，方末为秦俊杰饰演角色。</span>
            </li>
            <li>
                <span class="nt-ico">🔒</span>
                <span>唯一 CP 为韩证飞 × 展鹏，可逆不可拆。</span>
            </li>
            <li>
                <span class="nt-ico">🚫</span>
                <span>含 水仙、双性生子 等设定，无法接受请立即关闭。</span>
            </li>
            <li>
                <span class="nt-ico">🚧</span>
                <span>剧情尚未完结，可能存在 Bug 或数值失衡，请多包涵。</span>
            </li>
        </ul>
    </div>

    <div class="nt-foot">
        <div>剧本 / 文案 / 策划：<b>[我本人]</b></div>
        <div>技术支持：<b>WorkBuddy</b> · Gemini · DeepSeek</div>
        <div style="margin-top:4px; opacity:.82;">作者本人不懂代码，程序部分由 AI 辅助完成，如有报错，这很正常（）能修就会修。</div>
    </div>

    <a data-passage="Prologue_Chap1" class="nt-start">我已知晓，开始游戏</a>

</div>
<</nobr>>`
});

/* ---------- 故事块：Office ---------- */
window.__STORY_PASSAGES.push({
  name: "Office",
  src: `<<nobr>>

/* 老存档兜底：没有作品库字段时补上，避免首页报错 */
<<if not def $film_lib>><<set $film_lib to []>>><</if>>

<div class="header-banner">
    <div>
      <div style="font-size:20px; font-weight:900;">👑 无垠娱乐 CEO</div>
    </div>
    
    <div style="display:flex; gap:10px; align-items:center;">
        <<link "🎞️ 剧情档案" "Archive_Main">>
            <<script>>document.querySelectorAll(".header-banner a").forEach(function(a){a.style.color="#fbbf24";});<</script>>
        <</link>>

        <<link "📘 说明书" "Game_Manual">>
            <<script>>document.querySelectorAll(".header-banner a").forEach(function(a){a.style.color="#fbbf24";});<</script>>
        <</link>>
        
        <div style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:4px; font-size:13px;">
          📅 第 $month 月
        </div>
    </div>
</div>

  /* 状态栏 */
  <div class="status-bar">
    <div>💵 资金 <b style="color:#d97706">$money w</b></div>
    <div>⚡ 体力 <b>$stamina</b></div>
    <div>📡 流量 <b>$traffic</b></div>
    <div style="margin-left:auto;">📉 舆论 
      <<if $danger_level > 50>>
        <b style="color:#ef4444">$danger_level ⚠️</b>
      <<else>>
        <b style="color:#10b981">$danger_level OK</b>
      <</if>>
    </div>
  </div>

  /* 功能网格 */
  <div class="dashboard-grid">
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Artist_Management"><span class="tile-ico">🏢</span><span class="tile-txt">艺人管理<span class="tile-sub">培训 · 续约 · 解约</span></span><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Work_Center"><span class="tile-ico">📋</span><span class="tile-txt">通告中心<span class="tile-sub">影视 · 综艺 · 时尚 · 舞台</span></span><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Fan_Management"><span class="tile-ico">📢</span><span class="tile-txt">粉丝后援<span class="tile-sub">结构 · 运营 · 打投</span></span><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Film_Library"><span class="tile-ico">🎞️</span><span class="tile-txt">影视作品库<span class="tile-sub">在播 · 待播 · 评分</span></span><<if $film_lib.length > 0>><span class="tile-badge"><<print $film_lib.length>> 部</span><</if>><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Marketing_Center"><span class="tile-ico">⚔️</span><span class="tile-txt">公关作战<span class="tile-sub">热搜 · 水军 · 危机</span></span><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box btn-gossip">
      <a class="link-internal tile" data-passage="Gossip_Center"><span class="tile-ico">🍉</span><span class="tile-txt">圈内吃瓜<span class="tile-sub">情报 · 爆料 · 风向</span></span><<if $gossips.length > 0>><span class="tile-badge">新瓜 <<print $gossips.length>> 条</span><</if>><span class="tile-go">›</span></a>
    </div>
    <div class="btn-box">
      <a class="link-internal tile" data-passage="Buy_Resource"><span class="tile-ico">🔄</span><span class="tile-txt">资源筹备<span class="tile-sub">采购 · 置换 · 库存</span></span><span class="tile-go">›</span></a>
    </div>

/* 🎬 剧情入口：《深空黎明》剧组（46月开机后出现，52月杀青后自动消失） */
<<if $movie_visit_open>>
    <div class="btn-box btn-story" style="grid-column: 1 / -1;">
      <a class="link-internal tile" data-passage="Deep_Visit_Hub"><span class="tile-ico">🎬</span><span class="tile-txt">《深空黎明》剧组探班<span class="tile-sub">杀青前有效</span></span><span class="tile-go">›</span></a>
    </div>
<</if>>

/* 🕵️ 剧情解锁：卧底联络点 */
/* 第38月「加密短信」之后，第39月起才显示联络点入口 */
/* 第57月「三亿与静默」之后线路关闭（$zp_comm_cut），入口换成断线状态卡 */
<<if $zp_story_stage >= 3 and $month >= 39 and not $zp_comm_cut>> 
    <div class="btn-box btn-story" style="grid-column: 1 / -1;">
        <a class="link-internal tile" data-passage="Secret_Base"><span class="tile-ico">📞</span><span class="tile-txt">加密线路<span class="tile-sub">信任度 <<print $zp_trust>>%</span></span><span class="tile-go">›</span></a>
    </div>
<<elseif $zp_comm_cut>>
    <div class="btn-box btn-story btn-dead" style="grid-column: 1 / -1;">
        <span class="tile"><span class="tile-ico">📴</span><span class="tile-txt">加密线路已断<span class="tile-sub">无法联络</span></span></span>
    </div>
<</if>>

    /* 休息按钮 */
    <div class="btn-box btn-rest" style="grid-column: 1 / -1;">
      <a class="link-internal tile" data-passage="Month_Check_Router"><span class="tile-ico">🛌</span><span class="tile-txt">休息 · 结束本月</span><span class="tile-go">›</span></a>
    </div>
  </div>
<</nobr>>

<div style="margin-top: 50px; text-align: center; opacity: 0.6;">
    <<link "🔧 开发者通道">> <<goto "Debug_Cheats">> <</link>>
</div>`
});

/* ---------- 故事块：StoryCaption ---------- */
window.__STORY_PASSAGES.push({
  name: "StoryCaption",
  src: `<<nobr>>

/* =========================== */
/* 顶部 Logo 与 基础数据        */
/* =========================== */

<div class="side-brand">
  <span>👑</span>
  <span>无垠娱乐<small>WUYIN ENTERTAINMENT</small></span>
</div>

<div class="sidebar-row">
  <span class="stat-item">📅 第 <b>$month</b> 月</span>
  <span class="stat-item money">💰 <b>$money</b> 万</span>
</div>

<div class="sidebar-row">
  <span class="stat-item">🔥 流量 <b>$traffic</b></span>
  <span class="stat-item flat" title="体力：每次接活/组局消耗 10~50 点，每月回满 100">⚡ 体力 <b>$stamina</b></span>
</div>

<div class="sidebar-row">
  <span class="stat-item flat ap-item" title="行动点：本月还能做几件事。通告、粉丝运营、培训各消耗 1 点，每月恢复 8 点">
    🎯 行动 <b>$action_points</b><span class="ap-max">/8</span>
  </span>
</div>

/* --- 资源存量：点一下进资源筹备 --- */
<a class="res-box side-link" data-go="Buy_Resource" title="资源筹备：采购 / 置换 / 库存">
  <span class="stat-item res-s">S:$resources.s</span>
  <span class="stat-item res-a">A:$resources.a</span>
  <span class="stat-item res-b">B:$resources.b</span>
  <span class="stat-item res-c">C:$resources.c</span>
</a>

/* === 实时热搜栏：点一下进热搜榜 === */
<a class="side-hot side-link" data-go="HotSearch_Board" title="打开全网热搜榜">
    <div class="side-hot-title"><span>🔥 实时热搜</span><span class="side-go">›</span></div>
    <div class="side-hot-body">
    <<if def $current_hot_topic and $current_hot_topic.text>>
        <<if $current_hot_topic.type is "rival_scandal">>
            <span class="hot-good">$current_hot_topic.text</span>
        <<elseif $current_hot_topic.type is "my_scandal">>
            <span class="hot-bad">$current_hot_topic.text</span>
        <<else>>
            <span class="hot-plain">$current_hot_topic.text</span>
        <</if>>
    <<else>>
        <span class="text-muted">暂无热点</span>
    <</if>>
    </div>
</a>


/* =========================== */
/* 艺人列表 (动态C位修复)       */
/* =========================== */

/* 1. 判定第一位显示谁 (黄耀祖 OR 展鹏) */
/* 展鹏第31月离队（status = "left"）后不再出现在侧栏；
   如果这时也没有黄耀祖，主位就空着，只显示刘梁周/秦飒。 */
<<set _main_act to false>>
<<if $has_signed_huang is true and $actors.huang.status isnot "left">>
    <<set _main_act to $actors.huang>>
    <<set _badge_text to "替身">>
    <<set _is_zp to false>>
    <<set _main_key to "huang">>
<<elseif $actors.zp.status isnot "left">>
    <<set _main_act to $actors.zp>>
    <<set _badge_text to "妻子">>
    <<set _is_zp to true>>
    <<set _main_key to "zp">>
<</if>>

/* 计算C位艺人的总粉丝数 (防止除以0错误) */
<<if _main_act>>

    <div class="actor-section">
      <div class="actor-header">
        <a class="actor-name side-link" data-go="Artist_Management" data-actor="<<print _main_key>>" title="进入艺人管理">
          <<print _main_act.name>> <span class="wife-badge"><<print _badge_text>></span>
        </a>
        <span class="act-rank" title="段位要同时满足两件事：星光值达标 + 粉丝数过线（三线 5千 / 二线 2.5万 / 一线 8万 / 顶流 30万）">[<<print _main_act.rank_label>>]</span>
      </div>

      /* 工期显示 */
      <<if _main_act.busy_months > 0>>
        <<if _main_act.job_type is "banned">>
            <div class="act-status danger">❄️ 被抵制 (剩<<print _main_act.busy_months>>月)</div>
        <<elseif _main_act.job_type is "training">>
             <div class="act-status info" title="<<print _main_act.project_name>>">🎓 培训中 · <<print _main_act.project_name.replace("封闭式培训 · ", "")>> (剩<<print _main_act.busy_months>>月)</div>
        <<else>>
            <div class="act-status warn">⚠️ 拍摄中 (剩<<print _main_act.busy_months>>月)</div>
        <</if>>
      <</if>>

      /* 孕期/恢复状态 (只在展鹏在场时显示) */
      <<if _is_zp is true and def $zp_preg>>
          <<if $zp_preg.state == 1>>
              <div class="act-status preg">🤰 孕期: 第 $zp_preg.month 月</div>
          <<elseif $zp_preg.state == 2>>
              <div class="act-status ok">🍼 产后恢复: 第 $zp_preg.month 月</div>
          <</if>>
      <</if>>

      <div class="sidebar-row">
        <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="<<print _main_key>>"
           title="口碑：影响星光值（×80）与商务报价 —— 点击进入公关部">
          ❤️ 口碑 <b><<print _main_act.reputation>></b>
        </a>
        <span class="stat-item flat" title="体力：本月能排的通告总量，安排工作会消耗它">
          ⚡ 体力 <b><<print _main_act.current_energy>></b>
        </span>
      </div>
      <div class="sidebar-row">
        <a class="stat-item stat-link" data-go="Artist_Management" data-actor="<<print _main_key>>"
           title="颜值：影响星光值（×20）与颜粉增长 —— 点击进入艺人管理">
          ✨ 颜值 <b><<print _main_act.looks>></b>
        </a>
        <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="<<print _main_key>>"
           title="话题度：每月按 ×60 计入星光值，同时决定片酬加成（最高 +80%）；不营业每月自然 -5 —— 点击进入公关部">
          🔥 话题 <b><<print _main_act.topic>></b>
        </a>
      </div>

      /* 粉丝分布 (差异化显示) —— 点一下看这类粉丝的留言 */
      <a class="fans-line side-link" data-go="Fan_Management" data-actor="<<print _main_key>>" title="进入粉丝管理">
        📊 <<print FanLine(_main_act)>>
        <span class="side-go">›</span>
      </a>
    </div>
<</if>>

/* --- 补充：刘梁周 (LIU) --- */
<<if $has_signed_liu is true>>
    <<set _liu to $actors.liu>>

    <div class="actor-section">
      <div class="actor-header">
        <a class="actor-name side-link" data-go="Artist_Management" data-actor="liu" title="进入艺人管理">$actors.liu.name <span class="wife-badge gray">摄影师</span></a>
        <span class="act-rank">[$actors.liu.rank_label]</span>
      </div>

      <<if _liu.busy_months > 0>>
        <div class="act-status warn">⚠️ 工作中 (剩$actors.liu.busy_months月)</div>
      <</if>>

      <div class="sidebar-row">
        <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="liu"
           title="口碑：影响星光值（×80）与商务报价 —— 点击进入公关部">
          ❤️ 口碑 <b>$actors.liu.reputation</b>
        </a>
        <span class="stat-item flat" title="体力：本月能排的通告总量，安排工作会消耗它">
          ⚡ 体力 <b>$actors.liu.current_energy</b>
        </span>
      </div>
      <a class="fans-line side-link" data-go="Fan_Management" data-actor="liu" title="进入粉丝管理">
         📊 <<print FanLine(_liu)>>
         <span class="side-go">›</span>
      </a>
    </div>
<</if>>

/* --- 秦飒 (QS) --- */

<div class="actor-section">
  <div class="actor-header">
    <a class="actor-name side-link" data-go="Artist_Management" data-actor="qs" title="进入艺人管理">$actors.qs.name</a>
    <span class="act-rank">[$actors.qs.rank_label]</span>
  </div>

  <<if $actors.qs.busy_months > 0>>
    <div class="act-status warn">⚠️ 拍摄中 (剩$actors.qs.busy_months月)</div>
  <</if>>

  <div class="sidebar-row">
    <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="qs"
       title="口碑：影响星光值（×50）与商务报价 —— 点击进入公关部">
      ❤️ 口碑 <b>$actors.qs.reputation</b>
    </a>
    <span class="stat-item flat" title="体力：本月能排的通告总量，安排工作会消耗它">
      ⚡ 体力 <b>$actors.qs.current_energy</b>
    </span>
  </div>
  <div class="sidebar-row">
    <a class="stat-item stat-link" data-go="Artist_Management" data-actor="qs"
       title="颜值：影响星光值（×20）与颜粉增长 —— 点击进入艺人管理">
      ✨ 颜值 <b>$actors.qs.looks</b>
    </a>
    <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="qs"
       title="话题度：每月按 ×60 计入星光值，同时决定片酬加成（最高 +80%）；不营业每月自然 -5 —— 点击进入公关部">
      🔥 话题 <b>$actors.qs.topic</b>
    </a>
  </div>

  <a class="fans-line side-link" data-go="Fan_Management" data-actor="qs" title="进入粉丝管理">
    📊 <<print FanLine($actors.qs)>>
    <span class="side-go">›</span>
  </a>
</div>


/* --- 新人 (NEW) --- */

<div class="actor-section">
  <div class="actor-header">
    <a class="actor-name side-link" data-go="Artist_Management" data-actor="new" title="进入艺人管理">$actors.new.name</a>
    <span class="act-rank">[$actors.new.rank_label]</span>
  </div>

  <<if $actors.new.busy_months > 0>>
    <div class="act-status warn">⚠️ 拍摄中 (剩$actors.new.busy_months月)</div>
  <</if>>

  <div class="sidebar-row">
    <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="new"
       title="口碑：影响星光值（×50）与商务报价 —— 点击进入公关部">
      ❤️ 口碑 <b>$actors.new.reputation</b>
    </a>
    <span class="stat-item flat" title="体力：本月能排的通告总量，安排工作会消耗它">
      ⚡ 体力 <b>$actors.new.current_energy</b>
    </span>
  </div>
  <div class="sidebar-row">
    <a class="stat-item stat-link" data-go="Artist_Management" data-actor="new"
       title="颜值：影响时尚类通告与颜粉增长 —— 点击进入艺人管理">
      ✨ 颜值 <b>$actors.new.looks</b>
    </a>
    <a class="stat-item stat-link" data-go="Marketing_Center" data-actor="new"
       title="话题度：每月按 ×60 计入星光值，同时决定片酬加成（最高 +80%）；不营业每月自然 -5 —— 点击进入公关部">
      🔥 话题 <b>$actors.new.topic</b>
    </a>
  </div>

  <a class="fans-line side-link" data-go="Fan_Management" data-actor="new" title="进入粉丝管理">
    📊 <<print FanLine($actors.new)>>
    <span class="side-go">›</span>
  </a>
</div>

<</nobr>>`
});

/* ---------- 故事块：StoryInit ---------- */
window.__STORY_PASSAGES.push({
  name: "StoryInit",
  src: `/* ==============================
   1. 基础资源配置
   ============================== */
<<set $money to 20000>>        
<<set $month to 1>>            
<<set $total_months to 60>>    
<<set $stamina to 100>>        
<<set $action_points to 8>>     /* 行动点：每月 8 点，通告/粉丝运营/培训各 1 点 */
<<set $salary_cost to 0>>       /* 艺人工资，月结时重算 */
<<set $concert_used to 0>>      /* 🏟️ 巡回演唱会：本月是否已经开过一场 */
<<set $traffic to 200000>>      
<<set $monthly_cost to 300>>   
<<set $resources to { s: 0, a: 0, b: 2, c: 5 }>>
<<set $company_res to 7>>
<<set $bankruptcy_count to 0>>
<<set $charity_done to false>>

/* 影视作品库（2026-10-27 新增）
   film_lib  = 已杀青的作品（待播 / 在播 / 已播）
   film_used = 每级已经接过的「正经戏」id，接过就不再出现
   film_air_results = 月结临时用，放本月播出的结算结果 */
<<set $film_lib to []>>
<<set $film_used to { s: [], a: [], b: [], c: [] }>>
<<set $film_air_results to []>>

/* 通告履历（2026-10-28 新增）：结局结算页要用它列「大家都接过什么活」。
   每结算一次通告就往里记一条，最多留 300 条。（05_widgets.js 的 Job_Settle 里写） */
<<set $job_log to []>>

/* 危机与情报 */
<<set $current_crisis_desc to "暂无异常">>
<<set $danger_level to 0>> 
<<set $gossips to []>> 
<<set $fan_war_report to "">> 

/* ==============================
   2. 竞争对手
   ============================== */
<<set $rivals to [
  { name: "星火传媒", type: "资源咖", heat: 5000 }, 
  { name: "柠檬影业", type: "炒作狗", heat: 8000 },
  { name: "帝国娱乐", type: "行业霸主", heat: 45000 },
  { name: "天际传媒", type: "资本鳄鱼", heat: 18000 }, 
  { name: "造梦工厂", type: "流量收割机", heat: 25000 }, 
  { name: "盛世娱乐", type: "老牌巨头", heat: 32000 },
  { name: "量子文化", type: "网红孵化", heat: 12000 },
  { name: "白鲸影业", type: "艺术清流", heat: 6000 }
]>>
<<set $rival_company to $rivals[0]>>

/* ==============================
   3. 艺人数据配置 (✅ 修复重点：补全 status 属性)
   ============================== */
<<set $actors to {
  "zp": { 
    name: "展鹏", role: "老婆", rank_label: "二线", rank_level: 3, 
    status: "active",  /* 🟢 补丁：必须有这个，热搜才能识别他 */
    split: 0.4, 
    reputation: 60, looks: 98, topic: 80, 
    acting: 65, fashion: 25, stage: 10,
    limit_acting: 100, limit_fashion: 50, limit_stage: 40,
    energy: 150, current_energy: 150,
    fans: { 
        career: 8000, mom: 3000, face: 8000, clown: 10000,  
        toxic: 3000, cp: 10500, dream: 11000,
        moe: 8000, passerby: 20000
    }, 
    trait: "咸鱼特警", busy_months: 0, project_name: "" 
  },

  "qs": { 
    name: "秦飒", role: "恶女", rank_label: "三线", rank_level: 2, 
    status: "active",  /* 🟢 补丁 */
    split: 0.5,
    reputation: 75, looks: 90, topic: 50, 
    acting: 85, fashion: 75, stage: 75,
    limit_acting: 95, limit_fashion: 95, limit_stage: 90,
    energy: 120, current_energy: 120,
    fans: { 
        career: 6000, mom: 500, face: 7000, clown: 800, 
        toxic: 8000, cp: 200, dream: 2000,
        moe: 3000, passerby: 12000
    }, 
    trait: "娇贵", busy_months: 0, project_name: "" 
  },

  "new": { 
    name: "白小纯", role: "新人", rank_label: "糊咖", rank_level: 1, 
    status: "active",  /* 🟢 补丁 */
    split: 0.8,
    reputation: 55, looks: 65, topic: 20, 
    acting: 15, fashion: 45, stage: 45,
    limit_acting: 50, limit_fashion: 85, limit_stage: 85,
    energy: 120, current_energy: 120,
    fans: { 
        career: 200, mom: 2500, face: 500, clown: 50, 
        toxic: 800, cp: 300, dream: 300,
        moe: 2000, passerby: 3000
    }, 
    trait: "年轻", busy_months: 0, project_name: "" 
  }
}>>

/* ==============================
   4. 评论库
   ============================== */
<<set $comment_library to {
    "career": ["期待新作品！", "请多多搞事业！", "拒绝综艺咖。", "实绩图做好了。", "什么时候宣代言？", "请关注艺人作品。"],
    "mom": ["宝宝多穿点衣服！", "公司不要给太满的行程。", "妈妈爱你！", "乖乖好可爱。", "不管怎样妈妈都支持你。", "儿子最近是不是瘦了？"],
    "face": ["这张脸真是神颜。", "斯哈斯哈...", "舔屏中。", "颜值牛逼症。", "为了这张脸我原谅一切。", "在此脸蛋面前三观暂且崩塌。"],
    "clown": ["笑死，这什么造型？", "又在摸鱼？", "来看戏了。", "挺好感他的但是这演技……", "本人没有剧里好看。", "娱乐圈活人啊。", "这瓜保熟吗？"],
    "toxic": ["废物公司倒闭了没？", "抱走我家哥哥，不约。", "非官宣不约。", "离那个谁远一点！", "公司只有我们哥哥在赚钱！", "吸血鬼滚粗！"],
    "cp": ["嗑死我了！", "是真的！眼神拉丝了...", "民政局给你们搬来了。", "他俩绝对有一腿。", "这是我不花钱能看的吗？", "这体型差...我没了。"],
    "dream": ["老公！！！", "今天也是想睡你的一天。", "今晚回家吃饭吗？", "做梦素材有了。", "老公正面up我！", "命给你！"],
    
    "momo_zp": [
        "老婆哭起来一定很好看吧...", 
        "这种咸鱼样好想欺负他，想看他求饶。", 
        "好娇...想把他关起来。", 
        "每次看到展鹏摆烂，就想狠狠地惩罚他。", 
        "全娱乐唯一的公用妻子。", 
        "穿这件衣服是在勾引谁？",
        "别工作了，回家生孩子去吧！",
        "如果是展鹏的话，也不是不能...嘿嘿。"
    ],
    "momo_huang": [
        "看过他演的《深宫秘史》，那叫声绝了。",
        "这腰身软得...不愧是演那种片子出身的。",
        "想看他在综艺里被以此对待，哭出来的样子一定很美。",
        "穿得这么严实干嘛？大家什么没见过？",
        "一脸受样，天生就是给人欺负的。",
        "以前在片子里跪得那么熟练，现在装什么清纯？",
        "每次看到他唯唯诺诺的样子，就想狠狠更粗暴一点。",
        "他是懂怎么讨好男人的，这眼神太勾人了。",
        "这双腿一看就很好折叠。",
        "替身就要有替身的觉悟，乖乖张腿就好。",
        "导演们应该很喜欢用他吧，毕竟耐操又听话。"
    ],
    /* ---- 萌萌人：全肯定、捂耳朵、护剧组 ---- */
    "moe": [
        "不管发生什么我都支持他。",
        "你们这些黑子能不能闭嘴。",
        "他和剧组关系可好了，别乱说。",
        "哥哥自己都没意见，你们急什么？",
        "我觉得挺好的呀，是你们要求太高了。",
        "别带节奏了，会让哥哥很难做人的。"
    ],
    "moe_zp": [
        "展鹏那么好看，做什么都是对的。",
        "他躺平怎么了，人家有躺平的资本。",
        "你们说他演技差，那你们去演啊。"
    ],
    "moe_qs": [
        "别骂飒飒了，她只是性格直。",
        "她业务能力那么强，你们凭什么说她。",
        "姐姐对我们可温柔了，你们不懂。"
    ],
    "moe_new": [
        "纯纯还是个孩子。",
        "新人慢慢来，给他点时间。",
        "他已经很努力了，不要再说他了。"
    ],
    "moe_huang": [
        "耀祖在努力，你们看不到吗。",
        "他只是没资源，不是没能力。",
        "你们就是嫉妒他红。"
    ],
    "moe_liu": [
        "梁周是艺术家，你们不懂。",
        "摄影师出身怎么了，那叫高级。",
        "他的审美比你们高一百倍。"
    ],

    /* ---- 路人：看作品不看人，随时会走 ---- */
    "passerby": [
        "这谁啊。",
        "演得还行吧，就一普通演员。",
        "路过，不评价。",
        "我妈挺喜欢他的。",
        "有点印象，想不起来演过啥。",
        "作品还行，人不了解。"
    ],
    "passerby_zp": [
        "这不是那个演古装的吗，长得是挺好看。",
        "他老婆也是明星？哦。",
        "演技一般吧，脸是真顶。"
    ],
    "passerby_qs": [
        "她演技不错，就是脾气好像有点大。",
        "恶女专业户，看她演戏挺带劲。"
    ],
    "passerby_new": [
        "新人吧，没什么印象。",
        "脸挺干净的，再看看。"
    ],
    "passerby_huang": [
        "资源挺好的，就是不太会演。",
        "这张脸可惜了。"
    ],
    "passerby_liu": [
        "拍照片的？怎么跑来演戏了。",
        "造型是真的绝，演技算了。"
    ],

    "biased_cp": ["虽然展鹏很懒，但还好姐姐宠他。", "感谢姐姐扶贫。", "展鹏好爱，姐姐的专属小狗。", "姐姐到底看上展鹏什么了。"]
}>>

/* ==============================
   5. 其他初始化
   ============================== */
<<set $current_hot_topic to { text: "娱乐圈风平浪静", type: "normal", target: "none" }>>
<<set $zp_preg to { state: 0, month: 0, event_flag: "" }>>
<<set $zp_pregnancy_happened to false>>
<<set $zp_exhaustion_streak to 0>>
<<set $player_exhaustion_streak to 0>>
<<set $buff_zp_energy to false>>
<<set $buff_player_energy to false>>
<<set $war_actor to "zp">>
<<set $rival_artist_names to ["顾星舟", "江一鸣", "沈念初", "陆子野", "裴渺"]>>

<<set $pr_action_count to 3>>
<<set $is_top1_handled to false>>

/* 剧情变量 */
<<set $zp_story_stage to 0>>
<<set $gossip_count to 0>>
<<set $zp_trust to 0>>
<<set $zp_bond to 0>>
<<set $justice to 0>>
<<set $has_signed_huang to false>>
<<set $has_signed_liu to false>>

/* 《深空黎明》剧组（第45–54月） */
<<set $movie_signed to false>>      /* 45月：已签下这部洗钱片 */
<<set $movie_visit_open to false>>  /* 46月开机 → true；52月杀青 → false */
<<set $movie_wrapped to false>>     /* 52月：已杀青 */
<<set $deep_seen_1 to false>>       /* 探班 1~5 是否看过（重看不再给数值） */
<<set $deep_seen_2 to false>>
<<set $deep_seen_3 to false>>
<<set $deep_seen_4 to false>>
<<set $deep_seen_5 to false>>

/* 终章（第56–60月） */
<<set $zp_finale_started to false>> /* 56月：黎明前的黑暗已看过 */
<<set $zp_comm_cut to false>>       /* 57月：加密线路关闭 */
<<set $flag_blackcard_seen to false>>
<<set $flag_he_warn to false>>            /* 57月：何正钰那句"你救救他"（留给后面用） */


/* ==============================
   6. 安全补丁：初始化未来角色 (更新版)
   (防止在他们登场前，系统读取数据报错)
   ============================== */
<<set $actors.huang to {
	name: "???",
	status: "hidden", 
	rank_label: "未解锁",
	fans: { career:0, mom:0, toxic:0, cp:0, clown:0, face:0, dream:0 }
}>>

<<set $actors.liu to {
	name: "???",
	status: "hidden",
	rank_label: "未解锁",
	fans: { career:0, mom:0, toxic:0, cp:0, clown:0, face:0, dream:0 }
}>>

/* 标记是否已签约的逻辑开关 */
<<set $has_signed_huang to false>>
<<set $has_signed_liu to false>>`
});
