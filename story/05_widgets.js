/* ===========================================================================
   ⑬ 逻辑插件（Widgets）：系统运算，改这里=改规则
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

/* ---------- 故事块：Patch_Energy_Buff ---------- */
window.__STORY_PASSAGES.push({
  name: "Patch_Energy_Buff",
  src: `<<widget "Apply_Overload_Buff">>
    /* 这是独立的体力加成补丁 
       它会在月度结算完成后执行，覆盖掉默认的100体力
    */

    /* 1. 检查是否有展鹏的爆种标记 */
    <<if $buff_zp_energy is true>>
        <<set $actors.zp.current_energy to 200>>
        <<set $buff_zp_energy to false>> /* 用完即销毁标记 */
        
        /* 在这里偷偷加一条日志，让你确信它执行了 */
        <<set _resource_event to {
            type: "good", 
            desc: "⚡ <b>爱的充电生效：</b> 展鹏本月体力上限已突破至 200！"
        }>>
    <</if>>

    /* 2. 检查是否有韩证飞（玩家）的爆种标记 */
    <<if $buff_player_energy is true>>
        <<set $stamina to 200>>
        <<set $buff_player_energy to false>> /* 用完即销毁标记 */
        
        /* 如果_resource_event已经被占用了（比如同时触发），就追加文本 */
        <<if def _resource_event>>
             <<set _resource_event.desc += "<br>⚡ <b>爱的充电生效：</b> 韩证飞本月体力上限已突破至 200！">>
        <<else>>
             <<set _resource_event to {
                type: "good", 
                desc: "⚡ <b>爱的充电生效：</b> 韩证飞本月体力上限已突破至 200！"
            }>>
        <</if>>
    <</if>>
<</widget>>`
});

/* ---------- 故事块：Widget_Fan_War ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Fan_War",
  src: `<<nobr>>
<<widget "Generate_Fan_War">>
    <<set $fan_war_report to "">> /* 清空上月战报 */

    /* ====================================================
       ⚡ 0. 全员粉丝自然波动 (模拟真实娱乐圈)
       ==================================================== */
    <<for _key range Object.keys($actors)>>
        <<set _a to $actors[_key]>>
        <<if _a.status is "active" or _a.status is "maternity_leave">>
            /* 事业粉/颜粉 自然波动 */
            <<set _a.fans.career to Math.max(0, _a.fans.career + random(-50, 80))>>
            <<set _a.fans.face to Math.max(0, _a.fans.face + Math.floor(_a.looks/10) + random(-20, 50))>>
            /* 少量爬墙 */
            <<if random(1, 100) < 15>>
                <<set _a.fans.dream to Math.max(0, _a.fans.dream - random(10, 40))>>
            <</if>>
        <</if>>
    <</for>>
    
    /* ====================================================
       1. 动态确定主角 (权重池逻辑)
       ==================================================== */
    <<set _pool to []>>
    <<if $actors.zp.status is "active" or $actors.zp.status is "maternity_leave">><<run _pool.push("zp", "zp", "zp")>><</if>>
    <<if $actors.qs.status is "active">><<run _pool.push("qs", "qs")>><</if>>
    <<if $actors.new.status is "active">><<run _pool.push("new", "new")>><</if>>
    <<if def $actors.huang and $actors.huang.status is "active">><<run _pool.push("huang", "huang", "huang")>><</if>>
    <<if def $actors.liu and $actors.liu.status is "active">><<run _pool.push("liu", "liu")>><</if>>

    <<if _pool.length == 0>><<exit>><<else>><<set _target_key to _pool.random()>><</if>>
    <<set _target to $actors[_target_key]>>

    <<set _is_positive to false>>
    <<if random(1, 100) <= 35>><<set _is_positive to true>><</if>>
    <<set _comment to "">> 

    /* ====================================================
       A. 展鹏 (ZP) - 颜粉/演技粉/梦女粉为主
       ==================================================== */
    <<if _target_key is "zp">>
        
        /* [ZP-正向/混合] CP营业 or 演技大赏 */
        <<if _is_positive>>
            <<set _roll to random(1, 2)>>
            
            /* 1. CP营业 (韩证飞 x 展鹏) */
            <<if _roll == 1>>
                <<set _gain_cp to random(400, 800)>>
                <<set _loss_dream to random(200, 400)>>
                <<set _target.fans.cp += _gain_cp>>
                <<set _target.fans.dream = Math.max(0, _target.fans.dream - _loss_dream)>>
                <<set _comments to ["我就知道是真的！", "眼神骗不了人，韩总好宠。", "梦女心碎现场...", "这种糖是真实存在的吗？"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#7A6A70;'>
                    🍬 <b>展鹏热搜：老板亲自探班</b><br>
                    韩证飞与展鹏在片场的亲密互动被拍，CP粉过年。CP粉 <span style='color:green'>+\${_gain_cp}</span>，梦女粉心碎跑路 <span style='color:red'>-\${_loss_dream}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#8E5F72;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            
            /* 2. 演技高光 */
            <<else>>
                <<set _gain_career to random(200, 400)>>
                <<set _target.fans.career += _gain_career>>
                <<set _target.reputation += 5>>
                <<set _comments to ["这才是演员！", "眼神戏太绝了。", "那些流量学着点。", "展鹏认真起来很吓人。"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#F1F9F5; border-left:3px solid #7FBFA6; padding:10px; margin:10px 0; color:#4E7A6A;'>
                    🎬 <b>展鹏热搜：教科书演技</b><br>
                    一段无实物表演片段疯传，口碑回升。口碑 <span style='color:green'>+5</span>，事业粉 <span style='color:green'>+\${_gain_career}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#4E7A6A;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            <</if>>

        /* [ZP-负向] 翻车现场 */
        <<else>>
            <<set _war_type to random(1, 3)>>
            
            /* 1. 信了乐子人的邪 (硬汉翻车) */
            <<if _war_type == 1>> 
                <<set _loss_face to random(300, 600)>>
                <<set _loss_career to random(200, 400)>>
                <<set _target.fans.face = Math.max(0, _target.fans.face - _loss_face)>>
                <<set _target.fans.career = Math.max(0, _target.fans.career - _loss_career)>>
                <<set _target.looks -= 2>> /* 颜值临时下降 */
                <<set _comments to ["谁骗他涂的黑粉？", "像个挖煤回来的...", "帅哥为什么想不开？", "脱粉了，眼睛疼。", "乐子人：我们只是随口一说他真信啊？"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#9C6B7B;'>
                    🤡 <b>展鹏热搜：红毯造型灾难</b><br>
                    展鹏为了转型“硬汉”，故意涂黑皮肤走红毯，结果油腻翻车。颜粉崩溃 <span style='color:red'>-\${_loss_face}</span>，事业粉跑路 <span style='color:red'>-\${_loss_career}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#9C6B7B;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>

            /* 2. 唯粉反泥塑 (甚至连CP粉一起打) */
            <<elseif _war_type == 2>> 
                <<set _gain_rep to 5>>
                <<set _loss_cp to random(300, 500)>>
                <<set _loss_clown to random(200, 400)>> /* 嬷嬷通常也是乐子人/泥塑粉 */
                <<set _target.reputation += _gain_rep>>
                <<set _target.fans.cp = Math.max(0, _target.fans.cp - _loss_cp)>>
                <<set _target.fans.clown = Math.max(0, _target.fans.clown - _loss_clown)>>
                <<set _comments to ["拒绝泥塑，他是男人！", "玩梗要有度。", "叫什么老婆？恶心。", "唯粉管太宽了吧，无趣。"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#F5F6F9; border-left:3px solid #B4B2A9; padding:10px; margin:10px 0; color:#4A4A55;'>
                    🛡️ <b>展鹏粉圈：净化行动</b><br>
                    唯粉大规模投诉“老婆/泥塑”言论，强调硬汉人设。路人口碑 <span style='color:green'>+5</span>，但得罪了CP粉和嬷嬷(乐子人) <span style='color:red'>-\${_loss_cp + _loss_clown}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#6E6A78;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            
            /* 3. 咸鱼反噬 */
            <<else>> 
                 <<set _loss to random(300, 500)>><<set _target.fans.career = Math.max(0, _target.fans.career - _loss)>>
                 <<set _comment to "我看他根本不想红。">>
                 <<set $fan_war_report to \`
                 <div style='background:#FBF6EA; border-left:3px solid #D9B67A; padding:10px; margin:10px 0; color:#7F7461;'>
                     💤 <b>展鹏粉圈：恨铁不成钢</b><br>
                     粉丝熬夜做数据，正主却在打游戏。事业粉破防跑路 <span style='color:red'>-\${_loss}</span>。<br>
                     <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#8A7042;'>
                         💬 <b>热评：</b>“\${_comment}”
                     </div>
                 </div>\`>>
            <</if>>
        <</if>>

    /* ====================================================
       B. 黄耀祖 (Huang) - 黑红/替身/小三争议
       ==================================================== */
    <<elseif _target_key is "huang">>
        /* [Huang-正向] 快乐小狗/人妻感 */
        <<if _is_positive>>
            <<set _gain_mom to random(300, 600)>>
            <<set _gain_face to random(200, 400)>>
            <<set _target.fans.mom += _gain_mom>>
            <<set _target.fans.face += _gain_face>>
            <<set _comments to ["他真的好像一只快乐小狗！", "这才是真正的老婆感。", "比某人好相处多了。", "清纯男大即视感。"]>>
            <<set _comment to _comments.random()>>
            <<set $fan_war_report to \`
            <div style='background:#EDF2FA; border-left:3px solid #8AA3CC; padding:10px; margin:10px 0; color:#5E6E86;'>
                🐶 <b>黄耀祖热搜：快乐小狗</b><br>
                一段他在片场傻乐的花絮圈粉无数，被赞“情绪价值拉满”。妈粉 <span style='color:green'>+\${_gain_mom}</span>，颜粉 <span style='color:green'>+\${_gain_face}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#5E6E86;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        
        /* [Huang-负向] 小三/替身攻击 */
        <<else>>
            <<set _loss_rep to 15>>
            <<set $danger_level += 10>>
            <<set _comments to ["知三当三，恶心。", "一个替身也配？", "也就是老板的玩物罢辽。", "这股风尘味洗不掉的。"]>>
            <<set _comment to _comments.random()>>
            <<set $fan_war_report to \`
            <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#9C6B7B;'>
                💣 <b>黄耀祖粉圈：小三传闻</b><br>
                对家大肆散布他是“介入老板婚姻的小三”的谣言。公司危险值 <span style='color:red'>+10</span>，口碑暴跌 <span style='color:red'>-\${_loss_rep}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#9C6B7B;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        <</if>>

    /* ====================================================
       C. 刘梁周 (Liu) - 学霸 vs 假清高
       ==================================================== */
    <<elseif _target_key is "liu">>
        /* [Liu-正向] 文化人/学霸 */
        <<if _is_positive>>
            <<set _gain_career to random(300, 500)>>
            <<set _target.reputation += 10>>
            <<set _comments to ["正经大学毕业就是不一样。", "这就是文化人的底蕴。", "内娱绝望的文盲们学着点。", "谈吐太有内涵了。"]>>
            <<set _comment to _comments.random()>>
            <<set $fan_war_report to \`
            <div style='background:#F3EFF8; border-left:3px solid #A796C4; padding:10px; margin:10px 0; color:#6A5C86;'>
                🎓 <b>刘梁周热搜：学霸降维打击</b><br>
                他在采访中引经据典，言之有物，被官媒点赞。口碑 <span style='color:green'>+10</span>，事业粉 <span style='color:green'>+\${_gain_career}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#6A5C86;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        
        /* [Liu-负向] 假清高/资源咖 */
        <<else>>
            <<set _war_type to random(1, 2)>>
            
            /* 1. 假清高 (媚粉是不可能的) */
            <<if _war_type == 1>>
                <<set _loss_dream to random(200, 400)>>
                <<set _loss_career to random(100, 200)>>
                <<set _target.fans.dream = Math.max(0, _target.fans.dream - _loss_dream)>>
                <<set _target.fans.career = Math.max(0, _target.fans.career - _loss_career)>>
                <<set _comments to ["既然看不起粉丝，就别来娱乐圈捞钱。", "装什么清高？", "一脸欠他钱的样子。", "媚粉都不会，糊死你。"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#9C6B7B;'>
                    🧊 <b>刘梁周粉圈：拒绝媚粉</b><br>
                    刘梁周公开表示“不营业、不媚粉”，被批“端着碗吃饭嫌饭馊”。梦女粉跑路 <span style='color:red'>-\${_loss_dream}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#9C6B7B;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            
            /* 2. 资源咖 */
            <<else>>
                <<set _target.reputation -= 8>>
                <<set _comment to "素人出道即巅峰，背后没人谁信？">>
                <<set $fan_war_report to \`
                <div style='background:#FBF6EA; border-left:3px solid #D9B67A; padding:10px; margin:10px 0; color:#7F7461;'>
                    🍋 <b>刘梁周粉圈：皇族传闻</b><br>
                    素人直接签约且资源不断，被质疑是“资源咖/皇族”。口碑 <span style='color:red'>-8</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#8A7042;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            <</if>>
        <</if>>

    /* ====================================================
       D. 秦飒 (QS)
       ==================================================== */
    <<elseif _target_key is "qs">>
        <<if _is_positive>>
            /* 红毯杀手逻辑保持不变 */
            <<set _gain_fashion to 3>>
            <<set _gain_face to random(300, 500)>><<set _target.fans.face += _gain_face>>
            <<set _target.fashion += _gain_fashion>>
            <<set _comment to "内娱美神秦飒！这张脸就是江山。">>
            <<set $fan_war_report to \`
            <div style='background:#EDF2FA; border-left:3px solid #8AA3CC; padding:10px; margin:10px 0; color:#5E6E86;'>
                📸 <b>秦飒粉圈：红毯杀手</b><br>
                秦飒生图出圈，被封为“红毯定海神针”。时尚感 <span style='color:green'>+3</span>，颜粉 <span style='color:green'>+\${_gain_face}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#6E7F99;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        <<else>>
            /* 毒唯提纯逻辑保持不变 */
            <<set _loss_rep to 5>>
            <<set _gain_toxic to random(200, 400)>><<set _target.fans.toxic += _gain_toxic>>
            <<set _target.reputation -= _loss_rep>>
            <<set _comment to "独美！谁稀罕那个破番位！">>
            <<set $fan_war_report to \`
            <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#9C6B7B;'>
                🧨 <b>秦飒粉圈：手撕男主粉</b><br>
                因番位问题与男主粉大战。口碑 <span style='color:red'>-\${_loss_rep}</span>，提纯毒唯 <span style='color:green'>+\${_gain_toxic}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#9C6B7B;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        <</if>>

    /* ====================================================
       E. 白小纯 (New) - 九漏鱼/恋丑癖
       ==================================================== */
    <<elseif _target_key is "new">>
        <<if _is_positive>>
            <<set _gain_topic to 30>>
            <<set _gain_mom to random(100, 200)>><<set _target.fans.mom += _gain_mom>>
            <<set _target.topic += _gain_topic>>
            <<set _comment to "宝宝真棒！妈妈爱你！">>
            <<set $fan_war_report to \`
            <div style='background:#FBF6EA; border-left:3px solid #D9B67A; padding:10px; margin:10px 0; color:#7F7461;'>
                🍼 <b>白小纯粉圈：乖孙出息了</b><br>
                妈粉组织打榜，把“乖崽”送上热搜。话题 <span style='color:green'>+\${_gain_topic}</span>，妈粉 <span style='color:green'>+\${_gain_mom}</span>。<br>
                <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#8A7042;'>
                    💬 <b>热评：</b>“\${_comment}”
                </div>
            </div>\`>>
        <<else>>
            <<set _war_type to random(1, 2)>>
            
            /* 1. 九漏鱼 */
            <<if _war_type == 1>>
                <<set _target.reputation -= 10>>
                <<set _comments to ["绝望的文盲。", "九年义务教育漏网之鱼。", "连这个字都不认识？", "建议先回去读书。"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#FBF0F3; border-left:3px solid #D99AAE; padding:10px; margin:10px 0; color:#9C6B7B;'>
                    📚 <b>白小纯粉圈：文化课翻车</b><br>
                    在直播中读错常用字，被全网群嘲“九漏鱼”。口碑 <span style='color:red'>-10</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#9C6B7B;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            
            /* 2. 恋丑癖 */
            <<else>>
                <<set _loss_face to 100>>
                <<set _target.fans.face = Math.max(0, _target.fans.face - _loss_face)>>
                <<set _comments to ["粉丝是不是有恋丑癖？", "这颜值也能当爱豆？", "普男滚出娱乐圈。", "精修图都救不了的丑。"]>>
                <<set _comment to _comments.random()>>
                <<set $fan_war_report to \`
                <div style='background:#F5F6F9; border-left:3px solid #B4B2A9; padding:10px; margin:10px 0; color:#4A4A55;'>
                    🗿 <b>白小纯粉圈：颜值争议</b><br>
                    生图流出被嘲“普男”，路人质疑粉丝审美。颜粉跑路 <span style='color:red'>-\${_loss_face}</span>。<br>
                    <div style='margin-top:5px; padding-top:5px; border-top:1px dashed #E6E1EC; font-size:0.85em; color:#6E6A78;'>
                        💬 <b>热评：</b>“\${_comment}”
                    </div>
                </div>\`>>
            <</if>>
        <</if>>
    <</if>>
    
    /* === 通用收尾：数据修正 (防止负数) === */
    <<set _target.topic += 10>>
    <<set _target.fans.cp to Math.max(0, _target.fans.cp)>>
    <<set _target.fans.career to Math.max(0, _target.fans.career)>>
    <<set _target.fans.dream to Math.max(0, _target.fans.dream)>>
    <<set _target.fans.clown to Math.max(0, _target.fans.clown)>>
<</widget>>
<</nobr>>`
});

/* ---------- 故事块：Widget_Gossip_System ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Gossip_System",
  src: `<<widget "Generate_Gossip">>
    /* 参数: $args[0] 为模式，默认为 "buy" */
    <<set _mode to $args[0]>>
    <<if not def _mode>><<set _mode to "buy">><</if>>
    
    <<set _rnd to random(1, 100)>>
    <<set _type to "">>
    
    /* === 概率配置 === */
    <<if _mode is "month" or _mode is "drop">>
        /* 掉落模式 */
        <<if _rnd <= 60>>
            <<set _type to "green">>
        <<elseif _rnd <= 85>>
            <<set _type to "blue">>
        <<elseif _rnd <= 97>>
            <<set _type to "red">>
        <<else>>
            <<set _type to "gold">>
        <</if>>
    <<else>>
        /* 购买模式 */
        <<if _rnd <= 50>>
            <<set _type to "green">>
        <<elseif _rnd <= 80>>
            <<set _type to "blue">>
        <<elseif _rnd <= 94>>
            <<set _type to "red">>
        <<else>>
            <<set _type to "gold">>
        <</if>>
    <</if>>

    /* === 生成情报内容 === */
    /* 绿色情报 - 圈内趣闻 */
    <<if _type is "green">>
        <<set _label to "🟢趣闻">>
        <<set _pool to [
            "某古偶男主拍戏全靠眼药水",
            "某女星红毯假摔炒作",
            "剧组盒饭被吐槽猪食",
            "综艺导演现场骂哭嘉宾",
            "男团成员被爆假唱",
            "女演员为角色增肥20斤",
            "某流量小生拍戏带8个助理",
            "导演妻子探班当场发飙",
            "剧组夜戏拍到凌晨全员崩溃",
            "某歌手演唱会忘词硬唱",
            "综艺节目剧本痕迹明显",
            "某演员拍吻戏吃大蒜",
            "剧组经费不足道具粗制滥造",
            "某偶像包袱太重不敢做表情",
            "剧组宠物演员比人演员片酬高"
        ]>>
        <<set _price to random(5, 10)>>
        <<set _power to 100>>

    /* 蓝色情报 - 行业黑料 */
    <<elseif _type is "blue">>
        <<set _label to "🔵黑料">>
        <<set _pool to [
            "某演员打压老艺人抢戏份",
            "某导演片场耍大牌骂哭工作人员",
            "整容失败后遗症开始显现",
            "剧组涉嫌洗钱阴阳合同",
            "某艺人隐婚生子多年",
            "某歌手演唱会假唱对口型",
            "演员轧戏同时拍三部剧",
            "某流量数据造假购买水军",
            "剧组欺负新人演员加戏",
            "某艺人耍大牌要天价片酬",
            "某导演潜规则选角内幕",
            "某演员台词全靠配音",
            "某歌手抄袭国外歌曲",
            "某综艺节目恶意剪辑制造矛盾",
            "某艺人立人设实际反差巨大"
        ]>>
        <<set _price to random(30, 60)>>
        <<set _power to 300>>

    /* 红色情报 - 塌房实锤 */
    <<elseif _type is "red">>
        <<set _label to "🔴核弹">>
        <<set _pool to [
            "偷税漏税数额巨大",
            "潜规则录音文件曝光",
            "实锤出轨现场照片",
            "知三当三聊天记录",
            "公司做假账被查",
            "吸毒实锤警方介入",
            "代孕弃养录音曝光",
            "辱华言论被扒出",
            "诈捐门事件实锤",
            "学历造假证据确凿",
            "某艺人涉及刑事犯罪",
            "某公司财务造假退市",
            "某导演性骚扰多人",
            "某艺人台独言论被扒",
            "某公司涉嫌洗黑钱"
        ]>>
        <<set _price to random(500, 800)>>
        <<set _power to 1000>>

    /* 金色情报 - 商业机密 */
    <<else>>
        <<set _label to "🟡机密">>
        <<set _pool to [
            "某顶奢品牌即将换代言人",
            "某S+级综艺秘密选角名单",
            "某影视公司高层即将变动",
            "某大IP改编权正在竞标",
            "某平台明年重点投资项目",
            "某国际品牌寻求中国代言",
            "某电影冲击国际电影节",
            "某电视台综艺改版计划",
            "某视频平台会员涨价计划",
            "某电影续集筹备中",
            "某艺人即将解约自立门户",
            "某公司准备收购竞争对手",
            "某平台独家播放权争夺",
            "某国际合拍片项目启动",
            "某顶流艺人续约天价合同"
        ]>>
        <<set _price to random(1000, 1500)>>
        <<set _power to 0>>
    <</if>>

    /* 生成描述 */
    <<set _desc to _pool.random()>>
    
    /* 50%概率关联到具体对手 */
    <<if random(1,100) < 50 and _type neq "gold">>
        <<if def $rivals and $rivals.length > 0>>
            <<set _rival to $rivals.random()>>
            <<set _desc to _rival.name + "旗下艺人：" + _desc>>
        <</if>>
    <</if>>

    /* 创建情报对象 */
    <<set _new_gossip to { type: _type, label: _label, desc: _desc, price: _price, power: _power }>>
    <<set $gossips.push(_new_gossip)>>
    <<set $last_gossip to _new_gossip>>
<</widget>>`
});

/* ---------- 故事块：Widget_Job_Generator ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Job_Generator",
  src: `<<nobr>>
/* 用法：<<Job_Generate "drama" "s">> */
<<widget "Job_Generate">>
    <<set _type to $args[0]>>
    <<set _res to $args[1]>>
    
    /* === 1. 生成周期 (Period) === */
    <<if _type is "drama">>
        /* S/A级大制作周期长 */
        <<if _res is "s" or _res is "a">>
            <<set $generated_period to random(4, 6)>>
        <<else>>
            <<set $generated_period to random(3, 4)>>
        <</if>>
    <<elseif _type is "variety">>
        <<set $generated_period to random(2, 3)>>
    <<else>>
        <<set $generated_period to 1>>
    <</if>>

    /* === 2. 生成项目名称与简介 (完全架空版) === */
    
    /* --- A. 影视剧 (Drama) --- */
    <<if _type is "drama">>
        <<if _res is "s">>
            <<set _pool to [
                {name: "《大秦：帝国余晖》", desc: "投资3亿的历史正剧，老戏骨云集，冲奖预定。"},
                {name: "《深空彼岸》", desc: "好莱坞团队特效制作的硬核科幻，人类最后的希望。"},
                {name: "《长安十二时辰·夜宴》", desc: "精良的服化道，还原大唐盛世的悬疑巨制。"},
                {name: "《苍穹之昂》", desc: "根据知名IP改编的史诗级仙侠剧，特效烧钱。"}
            ]>>
        <<elseif _res is "a">>
            <<set _pool to [
                {name: "《法医手记》", desc: "口碑极佳的刑侦悬疑剧，剧情烧脑。"},
                {name: "《金陵旧梦》", desc: "民国情感大戏，虐恋情深，容易吸粉。"},
                {name: "《都市合伙人》", desc: "聚焦职场生存的现代剧，话题度很高。"},
                {name: "《剑雨江湖》", desc: "中规中矩的武侠剧，打戏非常精彩。"}
            ]>>
        <<elseif _res is "b">>
            <<set _pool to [
                {name: "《霸道总裁的落跑甜心》", desc: "古早味浓郁的甜宠剧，虽然土但很上头。"},
                {name: "《重生之我是王妃》", desc: "穿越短剧，剧情雷人但节奏极快。"},
                {name: "《婆媳大战三百回合》", desc: "狗血家庭伦理剧，大妈们的最爱。"},
                {name: "《校草爱上我》", desc: "低成本青春校园剧，全是新面孔。"}
            ]>>
        <<else>> /* C级 */
            <<set _pool to [
                {name: "《抗日神侠之包子雷》", desc: "剧情离谱的雷剧，被B站UP主疯狂吐槽。"},
                {name: "《恐怖游泳馆2》", desc: "洗钱嫌疑严重的低俗惊悚片，海报很擦边。"},
                {name: "《纯洁的心灵·逐梦演艺圈》", desc: "足以载入史册的烂片，不知道谁投资的。"},
                {name: "《乡村爱情故事之刘能逆袭》", desc: "土味乡土剧，只有村口大爷在看。"}
            ]>>
        <</if>>

    /* --- B. 综艺 (Variety) --- */
    <<elseif _type is "variety">>
        <<if _res is "s" or _res is "a">>
            <<set _pool to [
                {name: "《巅峰歌王》", desc: "现象级音综，全开麦Live，实力派的舞台。"},
                {name: "《谁是凶手》", desc: "高智商实景解密综艺，每个案件都反转不断。"},
                {name: "《姐姐妹妹站起来》", desc: "全明星竞演真人秀，热搜包年预定。"},
                {name: "《国家宝藏·探秘》", desc: "央视出品的文博类综艺，逼格极高。"}
            ]>>
        <<else>>
            <<set _pool to [
                {name: "《向前冲鸭！》", desc: "户外水上闯关节目，主要是看艺人落水出洋相。"},
                {name: "《相亲才会赢》", desc: "地方台调节类节目，全是奇葩素人。"},
                {name: "《深夜食堂·路边摊》", desc: "没啥经费的美食节目，就在路边吃烤串。"},
                {name: "《调解面对面》", desc: "调节邻里纠纷的节目，吵得不可开交。"}
            ]>>
        <</if>>

    /* --- C. 时尚 (Fashion) --- */
    <<elseif _type is "fashion">>
        <<if _res is "s" or _res is "a">>
            <<set _pool to [
                {name: "GILDED 金九封面", desc: "五大刊之首的九月刊封面，时尚圈的顶级荣誉。"},
                {name: "Dior 全球地广", desc: "蓝血顶奢的全球推广，铺满世界各地的大屏。"},
                {name: "ELLE 开年封", desc: "一线大刊的开年封面，也是必争之地。"},
                {name: "Chanel 秀场压轴", desc: "巴黎时装周走秀，老佛爷亲自指定的造型。"}
            ]>>
        <<else>>
            <<set _pool to [
                {name: "瑞丽内页拍摄", desc: "二线杂志的内页拼图，聊胜于无。"},
                {name: "拼多多服饰模特", desc: "给网店拍买家秀，多少有点掉价。"},
                {name: "优衣库商场海报", desc: "快时尚品牌的地广，虽然不高级但刷脸。"},
                {name: "微商产品站台", desc: "给三无面膜站台，还要配合假笑。"}
            ]>>
        <</if>>

    /* --- D. 舞台 (Stage) --- */
    <<elseif _type is "stage">>
        <<if _res is "s" or _res is "a">>
            <<set _pool to [
                {name: "春晚独唱", desc: "国民级舞台，多少人挤破头都想上的位置。"},
                {name: "鸟巢个人演唱会", desc: "十万人体育场，座无虚席的顶级排面。"},
                {name: "卫视跨年压轴", desc: "零点倒计时的黄金C位，全场欢呼。"},
                {name: "国家大剧院汇演", desc: "官方性质的文艺汇演，非常庄重。"}
            ]>>
        <<else>>
            <<set _pool to [
                {name: "楼盘开业剪彩", desc: "给郊区新楼盘剪彩，旁边还有舞狮队。"},
                {name: "县城拼盘演唱会", desc: "音响设备很烂，台下观众都在嗑瓜子。"},
                {name: "酒吧驻唱", desc: "环境嘈杂，还有喝醉的客人想冲上台。"},
                {name: "商场周年庆路演", desc: "在商场一楼中庭唱跳，围观的都是路人。"}
            ]>>
        <</if>>
    <</if>>

    /* 随机抽取并赋值 */
    <<set _pick to _pool.random()>>
    <<set $generated_name to _pick.name>>
    <<set $generated_desc to _pick.desc>>

<</widget>>
<</nobr>>`
});

/* ---------- 故事块：Widget_Job_Settlement ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Job_Settlement",
  src: `<<widget "Job_Settle">>
<<nobr>>
    <<set _job_type to $args[0]>>
    <<set _a to $actors[$current_actor]>>

    /* 🛠️ 修复：结算前先补齐必需字段。
       缺 limit_* 会让 Math.min(属性+3, limit) 变成 NaN；
       缺 topic / rank_level / rank_label 会让营收和分成变 NaN。 */
    <<if not def _a>><<set $current_actor to "zp">><<set _a to $actors.zp>><</if>>
    <<if not def _job_type>><<set _job_type to "drama">><</if>>
    <<if not def _a.rank_level>><<set _a.rank_level to 1>><</if>>
    <<if not def _a.rank_label>><<set _a.rank_label to "新人">><</if>>
    <<if not def _a.topic>><<set _a.topic to 0>><</if>>
    <<if not def _a.reputation>><<set _a.reputation to 0>><</if>>
    <<if not def _a.looks>><<set _a.looks to 70>><</if>>
    <<if not def _a.acting>><<set _a.acting to 10>><</if>>
    <<if not def _a.fashion>><<set _a.fashion to 10>><</if>>
    <<if not def _a.stage>><<set _a.stage to 10>><</if>>
    <<if not def _a.limit_acting>><<set _a.limit_acting to Math.min(99, _a.acting + 30)>><</if>>
    <<if not def _a.limit_fashion>><<set _a.limit_fashion to Math.min(99, _a.fashion + 30)>><</if>>
    <<if not def _a.limit_stage>><<set _a.limit_stage to Math.min(99, _a.stage + 30)>><</if>>

    /* --- 1. 读取资源等级 --- */
    <<if def _a.res_level>>
        <<set $req_res to _a.res_level>>
        <<unset _a.res_level>>
        <<set _res_source to "record">>
    <<elseif not def $req_res>>
        <<set $req_res to "c">>
        <<set _res_warning to true>>
    <</if>>
    
    <<if not _a.split>><<set _a.split = 0.5>><</if>>

    /* 标签定义 */
    <<if _job_type is "drama">>
        <<set _income_label to "片酬结算 (Film Salary)">>
    <<elseif _job_type is "stage" and ($req_res is "s" or $req_res is "a")>>
        <<set _income_label to "巡回演唱会结算 (Tour Revenue)">>
    <<else>>
        <<set _income_label to "通告费结算 (Performance Fee)">>
    <</if>>

    /* --- 2. 收入计算 --- */
    /* 💰 2026-10-27 重配：底层不动，顶端压平（顶流单部戏从 3000 降到 1900） */
    <<set _base_drama_map to   {1: 90, 2: 350, 3: 700, 4: 1350, 5: 1900}>>
    <<set _base_variety_map to {1: 45, 2: 120, 3: 290, 4: 560,  5: 780}>>
    <<set _base_fashion_map to {1: 45, 2: 120, 3: 290, 4: 560,  5: 780}>>
    <<set _base_stage_map to   {1: 70, 2: 420, 3: 900, 4: 1800, 5: 2600}>>

    <<set _res_mult_map to {
        s: {drama: 1.4, variety: 1.4, fashion: 1.4, stage: 1.4},
        a: {drama: 1.2, variety: 1.2, fashion: 1.2, stage: 1.2},
        b: {drama: 1.0, variety: 1.2, fashion: 1.0, stage: 1.0},
        c: {drama: 0.9, variety: 0.9, fashion: 0.9, stage: 0.9}
    }>>

    <<set _base_income to 0>>
    <<if _job_type is "drama">><<set _base_income to _base_drama_map[_a.rank_level]>>
    <<elseif _job_type is "variety">><<set _base_income to _base_variety_map[_a.rank_level]>>
    <<elseif _job_type is "fashion">><<set _base_income to _base_fashion_map[_a.rank_level]>>
    <<elseif _job_type is "stage">><<set _base_income to _base_stage_map[_a.rank_level]>>
    <</if>>
    /* 🛠️ 兜底：任何一环缺失都不再产生 NaN */
    <<if not def _base_income>><<set _base_income to 0>><</if>>

    <<set _star_bonus to (_a.rank_level - 1) * 0.2>>
    /* 话题加成封顶：话题 200 到顶 +80%，不再随话题无限放大 */
    <<set _topic_bonus to Math.min(0.8, (_a.topic || 0) / 250)>>
    <<set _res_mult to _res_mult_map[$req_res][_job_type]>>
    <<if not def _res_mult>><<set _res_mult to 1>><</if>>
    <<if isNaN(_star_bonus)>><<set _star_bonus to 0>><</if>>
    <<if isNaN(_topic_bonus)>><<set _topic_bonus to 0>><</if>>
    <<set _total_mult to _res_mult * (1 + _star_bonus + _topic_bonus)>>
    <<set _fluctuation to random(90, 110) / 100>>
    
    /* --- 3. 财务分账计算 --- */
    <<set _gross_income to Math.floor(_base_income * _total_mult * _fluctuation)>>
    <<if isNaN(_gross_income)>><<set _gross_income to 0>><</if>>

    /* 🏟️ 巡回演唱会：S 级 = 体育场巡回，A 级 = 体育馆巡回。
       50% 概率票房崩盘（来的人太少），本场无收入 —— 券、行动点、体力照样消耗。
       每月全公司只能开一场，$concert_used 由结算植入、月结清零。 */
    <<set _is_concert to false>>
    <<set _concert_failed to false>>
    <<if _job_type is "stage" and ($req_res is "s" or $req_res is "a")>>
        <<set _is_concert to true>>
        <<if random(1, 100) <= 50>>
            <<set _gross_income to 0>>
            <<set _concert_failed to true>>
        <</if>>
    <</if>>

    <<set _company_ratio to _a.split>>
    <<set _artist_ratio to (1 - _a.split)>>
    <<set _company_share_pretax to Math.floor(_gross_income * _company_ratio)>>
    <<set _artist_income to _gross_income - _company_share_pretax>>
    <<set _tax to Math.floor(_company_share_pretax * 0.25)>>
    <<set _company_income_net to _company_share_pretax - _tax>>
    
    /* --- 4. 属性增长 (🔴 修复点：增加 Math.min 限制上限) --- */
    <<set _base_fan_growth to {1: 30, 2: 60, 3: 100, 4: 200, 5: 400}>>
    <<set _main_fan_growth to Math.floor(_base_fan_growth[_a.rank_level] * 1.5)>>
    <<set _rep_gain to random(2, 4)>>
    <<set _msg to "">>
    
    <<if _job_type is "drama">>
        /* 限制演技不超过上限 */
        <<set _a.acting to Math.min(_a.acting + 3, _a.limit_acting)>>
        <<set _a.fans.career += _main_fan_growth>>
        <<set _a.reputation += _rep_gain>> 
        <<set _msg to "演技 +3 | 事业粉 +"+_main_fan_growth+" | 口碑 +"+_rep_gain>>
        
    <<elseif _job_type is "variety">>
        <<set _a.topic += 10>>
        <<set _a.fans.clown += _main_fan_growth>>
        <<set $traffic += Math.floor(_gross_income / 10)>>
        <<set _a.reputation += 1>>
        <<set _msg to "话题 +10 | 乐子人 +"+_main_fan_growth+" | 口碑 +1">>
        
    <<elseif _job_type is "fashion">>
        /* 限制时尚不超过上限 */
        <<set _a.fashion to Math.min(_a.fashion + 3, _a.limit_fashion)>>
        <<set _a.fans.face += _main_fan_growth>>
        <<set _a.reputation += _rep_gain>>
        <<set _msg to "时尚 +3 | 颜粉 +"+_main_fan_growth+" | 口碑 +"+_rep_gain>>
        
    <<elseif _job_type is "stage">>
        /* 限制唱跳不超过上限 */
        <<set _a.stage to Math.min(_a.stage + 3, _a.limit_stage)>>
        <<set _a.fans.mom += _main_fan_growth>>
        <<set _a.reputation += _rep_gain>>
        <<set _msg to "唱跳 +3 | 妈粉 +"+_main_fan_growth+" | 口碑 +"+_rep_gain>>
    <</if>>

    <<set _penalty_msg to "">>
    <<if _job_type is "drama" and def $is_bad_project and $is_bad_project>>
        <<set _a.reputation -= 10>> 
        <<set _penalty_msg to "⚠️ 烂尾风险: 口碑大幅下降!">>
        <<unset $is_bad_project>>
    <</if>>

    <<set $money += _company_income_net>>
    <<if _is_concert>><<set $concert_used to 1>><</if>>
    
    /* 界面显示（马卡龙小票样式，2026-10-25 替换原灰色表格） */
    <div class="nm-settle">
        <div class="nm-settle-head">
            <span>🧾 <<print _income_label>></span>
            <span class="lv">LEVEL <b><<print $req_res.toUpperCase()>></b></span>
        </div>
        <div class="nm-settle-body">
            <div class="row main">
                <span>营收总额</span>
                <span class="num">$ <<print _gross_income>> 万</span>
            </div>
            <div class="row">
                <span>- 艺人分成 (<<print Math.round(_artist_ratio * 100)>>%)</span>
                <span>$ <<print _artist_income>></span>
            </div>
            <div class="row">
                <span>- 企业税负 (25%)</span>
                <span>$ <<print _tax>></span>
            </div>
            <div class="row total">
                <span>公司实收</span>
                <span class="num">+ $<<print _company_income_net>> 万</span>
            </div>
        </div>
        <<if _is_concert>>
            <<if $req_res is "s">><<set _venue_label to "体育场巡回">><<else>><<set _venue_label to "体育馆巡回">><</if>>
            <div class="nm-settle-foot <<if _concert_failed>>warn<</if>>">
                <<if _concert_failed>>
                    🏟️ <<print _venue_label>> · 票房告急<br>观众来得太少，本场没有收入（券、行动点、体力照扣）。
                <<else>>
                    🏟️ <<print _venue_label>> · 满座
                <</if>>
            </div>
        <</if>>
        <<if _penalty_msg neq "">>
            <div class="nm-settle-foot warn"><<print _penalty_msg>></div>
        <</if>>
        <div class="nm-settle-foot">📈 <<print _msg>></div>
    </div>
<</nobr>>
<</widget>>`
});

/* ---------- 故事块：Widget_Logic_Actors ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Logic_Actors",
  src: `<<widget "Logic_Actors">>
    <<set _finished_actors to []>>
    /* 改名：不再叫 rank_up_events，改叫 rank_change_events */
    <<set _rank_change_events to []>>

    /* --- 话题自然衰减：一个月不营业，热度就先掉 5 点 ---
       这是「不刷综艺就掉」的来源，也是顶流维持成本的另一半。
       先衰减，再算段位，所以掉热度会立刻反映在咖位上。 */
    <<for _key range Object.keys($actors)>>
        <<if def $actors[_key] and $actors[_key].status isnot "left">>
            <<set $actors[_key].topic to Math.max(0, ($actors[_key].topic || 0) - 5)>>
        <</if>>
    <</for>>

    <<for _key range Object.keys($actors)>>
        <<set _a to $actors[_key]>>
        
        /* 🛡️ 安全检查：防止幽灵数据报错 */
        /* 已离队的艺人（展鹏第31月离开）不再参与月结播报：
           否则危险值爆表时还会跳「展鹏被全网抵制 / 解封」这种不合理提示 */
        <<if def _a and _a.status isnot "left">>

            /* --- A. 工期处理 --- */
            <<if (_a.busy_months || 0) > 0>>
                <<set _a.busy_months -= 1>>
                
                <<if _a.busy_months == 0>>
                    /* 区分培训和工作 */
                    <<if def _a.job_type and _a.job_type is "training">>
                        <<set _a.project_name to "">>
                        <<unset _a.job_type>>
                        <<set _training_complete_msg to "🎓 " + _a.name + " 完成了封闭培训！">>
                    <<else>>
                        <<set _finished_actors.push(_key)>>
                    <</if>>
                <</if>>
            <</if>>

            /* --- B. 体力恢复 --- */
            <<set _a.current_energy = Math.min(_a.energy, (_a.current_energy || 0) + 80)>>
            
            /* --- C. 升咖与降咖计算 (🛡️ 修复核心：增加 || 0 防错机制) --- */
            <<set _total_fans to 
                (_a.fans.career || 0) + 
                (_a.fans.mom || 0) + 
                (_a.fans.face || 0) + 
                (_a.fans.clown || 0) + 
                (_a.fans.toxic || 0) + 
                (_a.fans.cp || 0) + 
                (_a.fans.dream || 0)
            >>
            
            <<set _max_skill to Math.max((_a.acting || 0), (_a.fashion || 0), (_a.stage || 0))>>
            
            /* 计算星光值：粉丝 + 话题x60 + 口碑x80 + 最高技能x60 + 颜值x20 */
            <<set _star_power to _total_fans + ((_a.topic || 0) * 60) + ((_a.reputation || 0) * 80) + (_max_skill * 60) + ((_a.looks || 0) * 20)>>
        
            /* 记录旧等级 */
            <<set _old_level to (_a.rank_level || 1)>>
            <<set _old_label to (_a.rank_label || "新人")>>

            /* 判定门槛：星光值定天花板，粉丝数是硬门槛（粉丝不够，热度再高也不算那个段位）
               三线 5,000 / 二线 25,000 / 一线 80,000 / 顶流 300,000 */
            <<set _star_rank to 1>>
            <<if _star_power > 420000>><<set _star_rank to 5>>
            <<elseif _star_power > 150000>><<set _star_rank to 4>>
            <<elseif _star_power > 60000>><<set _star_rank to 3>>
            <<elseif _star_power > 20000>><<set _star_rank to 2>>
            <</if>>

            <<set _fan_rank to 1>>
            <<if _total_fans >= 300000>><<set _fan_rank to 5>>
            <<elseif _total_fans >= 80000>><<set _fan_rank to 4>>
            <<elseif _total_fans >= 25000>><<set _fan_rank to 3>>
            <<elseif _total_fans >= 5000>><<set _fan_rank to 2>>
            <</if>>

            <<set _final_rank to Math.min(_star_rank, _fan_rank)>>
            <<if _final_rank >= 5>>
                <<set _a.rank_label to "顶流">><<set _a.rank_level to 5>>
            <<elseif _final_rank >= 4>>
                <<set _a.rank_label to "一线">><<set _a.rank_level to 4>>
            <<elseif _final_rank >= 3>>
                <<set _a.rank_label to "二线">><<set _a.rank_level to 3>>
            <<elseif _final_rank >= 2>>
                <<set _a.rank_label to "三线">><<set _a.rank_level to 2>>
            <<else>>
                <<set _a.rank_label to "糊咖">><<set _a.rank_level to 1>>
            <</if>>

            /* --- 核心逻辑：判断升降 --- */
            <<if _a.rank_level > _old_level>>
                /* 升级 */
                <<set _rank_change_events.push({
                    type: "up", 
                    name: _a.name, 
                    old_rank: _old_label,
                    new_rank: _a.rank_label
                })>>
            <<elseif _a.rank_level < _old_level>>
                /* 降级 - 分析原因 */
                <<set _reason to "综合热度不足">>
                /* 如果话题度很低，就明确指出是因为流量枯竭 */
                <<if (_a.topic || 0) < 30>>
                    <<set _reason to "话题度过低 (流量枯竭)">>
                <</if>>
                
                <<set _rank_change_events.push({
                    type: "down", 
                    name: _a.name, 
                    old_rank: _old_label,
                    new_rank: _a.rank_label,
                    reason: _reason
                })>>
            <</if>>
        
        <</if>> /* 结束 def 检查 */
    <</for>>
<</widget>>`
});

/* ---------- 故事块：Widget_Logic_Cleanup ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Logic_Cleanup",
  src: `<<widget "Logic_Cleanup">>

    /* --- 0. 艺人数据纠错补丁 --- */
    /* 🛠️ 修复：老存档里的黄耀祖/刘梁周缺少 limit_acting 等字段，
       会让「报班学习」算出 NaN，还会让结算页话题加成、分成比例变成 NaN。
       这里每月兜底补齐一次，存档自动被修好。 */
    <<for _key range Object.keys($actors)>>
        <<set _p to $actors[_key]>>
        <<if def _p>>
            <<if not def _p.fans.dream>><<set _p.fans.dream to 100>><</if>>
            <<if not def _p.fans.career>><<set _p.fans.career to 0>><</if>>
            <<if not def _p.fans.mom>><<set _p.fans.mom to 0>><</if>>
            <<if not def _p.fans.face>><<set _p.fans.face to 0>><</if>>
            <<if not def _p.fans.clown>><<set _p.fans.clown to 0>><</if>>
            <<if not def _p.fans.toxic>><<set _p.fans.toxic to 0>><</if>>
            <<if not def _p.fans.cp>><<set _p.fans.cp to 0>><</if>>
            <<if not def _p.topic>><<set _p.topic to 0>><</if>>
            <<if not def _p.reputation>><<set _p.reputation to 0>><</if>>
            <<if not def _p.split>><<set _p.split to 0.5>><</if>>
            <<if not def _p.status>><<set _p.status to "active">><</if>>
            <<if not def _p.role>><<set _p.role to "艺人">><</if>>
            <<if not def _p.rank_label>><<set _p.rank_label to "新人">><</if>>
            <<if not def _p.project_name>><<set _p.project_name to "">><</if>>
            <<if not def _p.job_type>><<set _p.job_type to "none">><</if>>
            <<if not def _p.acting>><<set _p.acting to 10>><</if>>
            <<if not def _p.fashion>><<set _p.fashion to 10>><</if>>
            <<if not def _p.stage>><<set _p.stage to 10>><</if>>
            /* 天赋上限：缺失会导致培训算出 NaN，按当前值 +30 兜底 */
            <<if not def _p.limit_acting>><<set _p.limit_acting to Math.min(99, _p.acting + 30)>><</if>>
            <<if not def _p.limit_fashion>><<set _p.limit_fashion to Math.min(99, _p.fashion + 30)>><</if>>
            <<if not def _p.limit_stage>><<set _p.limit_stage to Math.min(99, _p.stage + 30)>><</if>>
            <<if not def _p.energy>><<set _p.energy to 120>><</if>>
            <<if not def _p.current_energy>><<set _p.current_energy to _p.energy>><</if>>
        <</if>>
    <</for>>
    
    /* 1. 危险值修正：自然恢复 */
    <<if $danger_level > 0>>
        <<set $danger_level to Math.max(0, $danger_level - 5)>>
    <</if>>
    
    /* --- 🕵️ 卧底线：暴露值自然冷却 --- */
<<if $zp_story_stage >= 3 and $exposure > 0>>
    /* 只有当暴露值大于0时才执行，避免负数 */
    <<set $exposure = Math.max(0, $exposure - 10)>>
    
    /* 可选：在月结报告里加一条金色日志 */
    <<run $gossips.push({
        type: "gold", 
        desc: "📉 [卧底线] 展鹏利用这一周的安分表现，成功打消了顾涛的部分怀疑。暴露值 -10。"
    })>>
<</if>>


    /* 2. 🔴【修复】兜底逻辑：防止资源和危险值变负数 */
    <<set $resources.s to Math.max(0, $resources.s)>>
    <<set $resources.a to Math.max(0, $resources.a)>>
    <<set $resources.b to Math.max(0, $resources.b)>>
    <<set $resources.c to Math.max(0, $resources.c)>>
    <<set $danger_level to Math.max(0, $danger_level)>>

    /* 3. 基础重置 */
    <<set $stamina to 100>>  
    <<set $action_points to 8>>   /* 每月 8 点行动点：通告 / 粉丝运营 / 培训 各 1 点 */
    <<set $concert_used to 0>>    /* 🏟️ 巡回演唱会：每月只能一场，这里清零 */
    <<set $charity_done to false>>
    
    /* 4. 月份增加 */
    <<set $month += 1>>
<</widget>>`
});

/* ---------- 故事块：Widget_Logic_Events ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Logic_Events",
  src: `/* =========================================================
   组件1：热搜榜生成器 (单次生成 15 条)
   调用方式: <<Generate_Monthly_HotSearch>>
   结果存储: $hot_search_list
   ========================================================= */
<<widget "Generate_Monthly_HotSearch">>
    
    /* 🛡️ 安全检查 */
    <<if def $actors and def $actors.zp>>
    
        <<set $hot_search_list to []>>
        
        /* --- 1. 建立超级词条库 --- */
        
        /* A. 我方正面词条库 */
        <<set _pool_my_good to []>>
        <<if $actors.zp.status is "active">>
            <<run _pool_my_good.push("展鹏 颜值回春", "展鹏 顶级人夫感", "展鹏 眼神拉丝", "展鹏 打戏花絮", "展鹏 敬业", "展鹏 护妻")>>
        <</if>>
        <<if $actors.qs.status is "active">>
            <<run _pool_my_good.push("秦飒 红毯杀手", "秦飒 绝美落泪", "秦飒 豪门姐弟感", "秦飒 演技炸裂", "秦飒 怼人爽")>>
        <</if>>
        <<if $actors.new.status is "active">>
            <<run _pool_my_good.push("白小纯 演技进步", "白小纯 乖巧懂事", "白小纯 妈粉天堂", "白小纯 少年感", "白小纯 励志")>>
        <</if>>
        <<if def $actors.huang and $actors.huang.status is "active">>
            <<run _pool_my_good.push("黄耀祖 破碎感", "黄耀祖 逆袭", "黄耀祖 眼神戏", "黄耀祖 性张力", "黄耀祖 剧抛脸")>>
        <</if>>
        <<if def $actors.liu and $actors.liu.status is "active">>
            <<run _pool_my_good.push("刘梁周 审美降维打击", "刘梁周 撕漫男", "刘梁周 摄影展", "刘梁周 清冷感", "刘梁周 氛围感")>>
        <</if>>
        <<run _pool_my_good.push("无垠娱乐 业界良心", "无垠娱乐 审美在线", "无垠娱乐 团建花絮", "无垠娱乐 公益")>>

        /* B. 我方负面词条库 */
        <<set _pool_my_bad to []>>
        <<if $actors.zp.status is "active">>
            <<run _pool_my_bad.push("展鹏 疑似摆烂", "展鹏 赘肉抢镜", "展鹏 软饭男", "展鹏 婚变传闻", "展鹏 状态差", "展鹏 油腻")>>
        <</if>>
        <<if $actors.qs.status is "active">>
            <<run _pool_my_bad.push("秦飒 耍大牌录音", "秦飒 翻白眼", "秦飒 抢番位", "秦飒 脸僵了", "秦飒 没礼貌")>>
        <</if>>
        <<if $actors.new.status is "active">>
            <<run _pool_my_bad.push("白小纯 没文化", "白小纯 假唱", "白小纯 资源咖", "白小纯 恋情曝光", "白小纯 绿茶")>>
        <</if>>
        <<if def $actors.huang and $actors.huang.status is "active">>
            <<run _pool_my_bad.push("黄耀祖 辣眼睛", "黄耀祖 滚出娱乐圈", "黄耀祖 东施效颦", "黄耀祖 黑历史", "黄耀祖 猥琐")>>
        <</if>>
        <<if def $actors.liu and $actors.liu.status is "active">>
            <<run _pool_my_bad.push("刘梁周 潜规则", "刘梁周 普信男", "刘梁周 僵尸脸", "刘梁周 皇族", "刘梁周 关系户")>>
        <</if>>
        <<run _pool_my_bad.push("无垠娱乐 压榨艺人", "无垠娱乐 拖欠工资", "无垠娱乐 倒闭了吗", "无垠娱乐 虚假宣传")>>

        /* D. 社会新闻库 */
        <<set _pool_social to [
            "周五不调休", "油价调整", "奶茶涨价", "考研成绩", "流星雨", "火锅店排队", "心疼打工人",
            "高温预警", "台风入境", "神秘富豪征婚", "猫咪后空翻", "发现UFO", "新型诈骗手法"
        ]>>


        /* --- 2. 生成榜首 (Top 1) --- */
        <<set _top1 to {}>>
        <<set _roll to random(1, 100)>>
        
        <<if _roll <= 50>>
            <<if random(1, 100) > $danger_level>>
                <<set _top1 = { text: _pool_my_good.random() + " (爆)", type: "my_good", heat: random(5000000, 9000000), handled: false }>>
            <<else>>
                <<set _top1 = { text: _pool_my_bad.random() + " (爆)", type: "my_bad", heat: random(6000000, 10000000), handled: false }>>
            <</if>>
        <<elseif _roll <= 90>>
            <<set _rival to $rivals.random()>>
            <<set _top1 = { text: _rival.name + " 陷入重大丑闻被调查 (爆)", type: "rival_bad", heat: random(4500000, 8500000), handled: false }>>
        <<else>>
            <<set _top1 = { text: "娱乐圈惊现孩子 (爆)", type: "normal", heat: random(6000000, 10000000), handled: false }>>
        <</if>>
        
        <<run $hot_search_list.push(_top1)>>


        /* --- 3. 生成 2-15 名 --- */
        <<for _i to 0; _i < 14; _i++>>
            <<set _item to {}>>
            <<set _roll to random(1, 100)>>
            
            <<if _roll <= 40>>
                <<if random(1, 100) > ($danger_level + 10)>>
                    <<set _item = { text: _pool_my_good.random(), type: "my_good", heat: random(100000, 3000000), handled: false }>>
                <<else>>
                    <<set _item = { text: _pool_my_bad.random(), type: "my_bad", heat: random(200000, 4000000), handled: false }>>
                <</if>>
            <<elseif _roll <= 80>>
                <<set _r to $rivals.random()>>
                <<set _rival_topic to "">>
                <<if _r.type is "炒作狗">>
                    <<set _rival_topic to ["买水军被抓", "通稿翻车", "恶意捆绑被群嘲", "虚假数据被清朗"].random()>>
                <<elseif _r.type is "资源咖">>
                    <<set _rival_topic to ["带资进组被抵制", "加戏改剧本", "演技太差被AI换脸", "强捧遭天谴"].random()>>
                <<elseif _r.type is "资本鳄鱼">>
                    <<set _rival_topic to ["偷税漏税被约谈", "阴阳合同曝光", "股价暴跌", "对赌协议失败"].random()>>
                <<elseif _r.type is "流量收割机">>
                    <<set _rival_topic to ["割韭菜太狠", "周边质量差被维权", "粉丝集资跑路", "代言微商暴雷"].random()>>
                <<else>>
                    <<set _rival_topic to ["片场耍大牌", "夜会外围女", "私联站姐", "学历造假", "整容后遗症"].random()>>
                <</if>>
                <<set _item = { text: _r.name + " " + _rival_topic, type: "rival_bad", heat: random(100000, 3500000), handled: false }>>
            <<else>>
                <<set _item = { text: _pool_social.random(), type: "normal", heat: random(50000, 2000000), handled: false }>>
            <</if>>
            
            <<if _item.heat > 2500000>>
                <<set _item.text += " (沸)">>
            <<elseif _item.heat > 1000000>>
                <<set _item.text += " (热)">>
            <</if>>
            <<set _item.heat to Math.floor(_item.heat / (_i * 0.5 + 1))>>
            
            <<run $hot_search_list.push(_item)>>
        <</for>>

        <<set $hot_search_list.sort((a, b) => b.heat - a.heat)>>

    <<else>>
        <<run $hot_search_list.push({ text: "⚠️ 系统加载中...", type: "normal", heat: 1000, handled: true })>>
    <</if>>

<</widget>>


/* =========================================================
   组件2：Logic_Events (月度结算主逻辑)
   ========================================================= */
<<widget "Logic_Events">>
    
    <<if def $actors and def $actors.zp>>

        <<set _rival_event to null>>
        <<set _resource_event to null>>

        /* A. 商战事件 */
        <<set _victims to []>>
        <<if $actors.zp.status is "active" or $actors.zp.status is "maternity_leave">><<run _victims.push("zp")>><</if>>
        <<if $actors.qs.status is "active">><<run _victims.push("qs")>><</if>>
        <<if $actors.new.status is "active">><<run _victims.push("new")>><</if>>
        <<if def $actors.huang and $actors.huang.status is "active">><<run _victims.push("huang")>><</if>>
        <<if def $actors.liu and $actors.liu.status is "active">><<run _victims.push("liu")>><</if>>

        <<set _max_rank to 1>>
        <<for _key range _victims>>
            <<if $actors[_key].rank_level > _max_rank>><<set _max_rank to $actors[_key].rank_level>><</if>>
        <</for>>
        
        <<set _attack_chance to 30 + (_max_rank * 10)>>
        
        <<if random(1, 100) < _attack_chance and _victims.length > 0>>
            
            <<set _rival to $rivals.random()>>
            <<set $danger_level += random(15, 25)>>
            <<set _target_key to _victims.random()>>
            <<set _target to $actors[_target_key]>>
            
            /* --- 针对 展鹏 (ZP) --- */
            <<if _target_key is "zp">>
                <<set _roll to random(1, 4)>>
                
                /* 事件1: 婚内出轨 */
                <<if _roll == 1>>
                    <<set _target.fans.cp -= 500>><<set $trust -= 5>>
                    <<set _rival_event to { type: "bad", title: "💔【夜会风波】", desc: "狗仔爆出模糊视频，指认展鹏深夜在酒店‘夜会神秘人’（其实是你）。" + _rival.name + " 趁机买通稿造谣他婚内出轨。" }>>
                
                /* 事件2: 软饭男 */
                <<elseif _roll == 2>>
                    <<set _target.reputation -= 20>>
                    <<set _rival_event to { type: "bad", title: "🍚【软饭硬吃】", desc: "营销号集体发难，嘲讽展鹏是‘靠老婆上位的花瓶’，列举了他所有的资源都来自无垠娱乐。" }>>
                
                /* 事件3: 吸血捆绑 */
                <<elseif _roll == 3>>
                    <<set _target.fans.cp += 200>><<set _target.fans.toxic += 500>><<set _target.fans.career -= 300>>
                    <<set _rival_event to { type: "bad", title: "🩸【吸血水蛭】", desc: _rival.name + " 旗下的新人刻意模仿展鹏的穿搭，并在采访中暧昧喊话。对方疯狂发通稿捆绑‘平替CP’，吸血上位。" }>>
                
                /* 事件4: 反串引战 */
                <<else>>
                    <<set $danger_level += 20>><<set _target.reputation -= 30>>
                    <<set _rival_event to { type: "bad", title: "🎭【反串引战】", desc: "一批顶着展鹏头像的‘粉丝’突然在官媒评论区大肆辱骂，随后营销号联动搬运‘粉丝行为偶像买单’。查出是 " + _rival.name + " 的水军。" }>>
                <</if>>

            /* --- 针对 黄耀祖 (Huang) --- */
            <<elseif _target_key is "huang">>
                <<set _roll to random(1, 4)>> /* 扩充到4种 */
                
                <<if _roll == 1>>
                    <<set _target.reputation -= 30>><<set $danger_level += 10>>
                    <<set _rival_event to { type: "bad", title: "🔞【艳星起底】", desc: "对家扒出了黄耀祖早年拍摄三级片的截图，全网疯传‘滚出娱乐圈’。" }>>
                <<elseif _roll == 2>>
                    <<set _target.fans.face -= 200>>
                    <<set _rival_event to { type: "bad", title: "🤡【东施效颦】", desc: "黄耀祖模仿展鹏的写真被群嘲‘画虎不成反类犬’，" + _rival.name + " 趁机发通稿踩一捧一。" }>>
                <<elseif _roll == 3>>
                    <<set _target.fans.mom += 300>><<set _target.reputation -= 10>>
                    <<set _rival_event to { type: "bad", title: "🥺【虐粉通稿】", desc: "网上突然流传黄耀祖在片场被当做‘廉价替身’使唤的视频。虽然虐到了妈粉，但业内评价降低了。" }>>
                /* 事件4 (新): 杀猪盘CP */
                <<else>>
                    <<set _target.fans.cp -= 400>><<set _target.reputation -= 20>>
                    <<set _rival_event to { type: "bad", title: "🍬【杀猪盘CP】", desc: "某男演员买通稿炒作‘照顾黄耀祖’的暖心人设，傻乎乎的黄耀祖竟然转发互动。对方立刻提纯CP粉，倒打一耙说黄耀祖吸血上位。" }>>
                <</if>>

            /* --- 针对 刘梁周 (Liu) --- */
            <<elseif _target_key is "liu">>
                <<set _roll to random(1, 3)>> /* 扩充到3种 */
                
                <<if _roll == 1>>
                    <<set _target.reputation -= 20>>
                    <<set _rival_event to { type: "bad", title: "🛌【潜规则上位】", desc: "有人爆料刘梁周直接签约是因为和高层（你）有不正当关系，" + _rival.name + " 暗示他是资源咖。" }>>
                <<elseif _roll == 2>>
                    <<set _target.fans.career -= 200>><<set _target.fans.face -= 200>>
                    <<set _rival_event to { type: "bad", title: "🧊【人设崩塌】", desc: "刘梁周私下拒绝媚粉的录音流出。对家营销号狂带节奏，称其‘端起碗吃饭，放下碗骂娘’，以此提纯自家粉丝。" }>>
                /* 事件3 (新): 碰瓷发糖 */
                <<else>>
                    <<set _target.reputation -= 15>><<set $danger_level += 10>>
                    <<set _rival_event to { type: "bad", title: "🍵【碰瓷发糖】", desc: "某女星疯狂晒出与刘梁周的‘同款’暗示恋情。刘梁周因未回应被骂‘冷暴力渣男’，女方卖惨喜提‘全网心疼’热搜。" }>>
                <</if>>

            /* --- 针对 秦飒 (QS) --- */
            <<elseif _target_key is "qs">>
                <<set _roll to random(1, 3)>>
                
                <<if _roll == 1>>
                    <<set _target.reputation -= 15>>
                    <<set _rival_event to { type: "bad", title: "😤【耍大牌疑云】", desc: "一段恶意剪辑的视频流出，看起来像是秦飒在对助理翻白眼。" }>>
                <<elseif _roll == 2>>
                    /* 单方面炒CP */
                    <<set _target.fans.cp -= 600>><<set _target.reputation -= 10>>
                    <<set _rival_event to { type: "bad", title: "🔪【糖里有毒】", desc: _rival.name + " 旗下的男艺人单方面炒作与秦飒的绯闻，热度到手后立刻发声明撇清，倒打一耙说秦飒倒贴。" }>>
                <<else>>
                    /* 挑拨离间 */
                    <<set $danger_level += 15>>
                    <<set _rival_event to { type: "bad", title: "🔥【拉踩引战】", desc: "数千个营销号同时发布‘秦飒艳压某前辈’的通稿。前辈粉暴怒屠版，实际上这是 " + _rival.name + " 的捧杀手段。" }>>
                <</if>>

            /* --- 针对 白小纯 (New) --- */
            <<elseif _target_key is "new">>
                <<set _roll to random(1, 2)>> /* 扩充到2种 */
                
                /* 事件1: 文盲 */
                <<if _roll == 1>>
                    <<set _target.reputation -= 10>>
                    <<set _rival_event to { type: "bad", title: "📚【绝望的文盲】", desc: "白小纯写错常用成语被狂喷‘九年义务教育漏网之鱼’，对家借机大发通稿嘲笑无垠娱乐的签约门槛。" }>>
                /* 事件2 (新): 恋爱脑 */
                <<else>>
                    <<set _target.fans.mom -= 300>><<set _target.fans.career -= 100>>
                    <<set _rival_event to { type: "bad", title: "🥰【恋爱脑通稿】", desc: "营销号把白小纯在片场发呆解读为‘暗恋某顶流花旦’，连喝水的动作都被解读为‘模仿心上人’。妈粉恨铁不成钢，对方粉丝辱骂他‘登月碰瓷’。" }>>
                <</if>>
            <</if>>

        <<else>>
            <<set $danger_level to Math.max(0, $danger_level - 5)>>
        <</if>>

        /* B. 资源掉落 */
        <<set _is_banned to false>>
        <<if $actors.zp.job_type is "banned">><<set _is_banned to true>><</if>>
        <<if $danger_level < 100 and _is_banned is false>>
            <<set _drop_chance to 0>>
            <<if _max_rank >= 4>><<set _drop_chance += 30>><</if>>
            <<if _max_rank >= 3>><<set _drop_chance += 20>><</if>>
            
            <<if random(1, 100) < _drop_chance>>
                <<set $resources.a += 1>>
                <<set _resource_event to {type: "good", desc: "🎁 <b>天上掉馅饼：</b> 资方大佬硬塞给你一个 A级 资源邀请！"}>>
            <<else>>
                <<set $resources.c += 2>>
                <<set _resource_event to {type: "normal", desc: "📩 收到了一些没人要的 C级 边角料资源。"}>>
            <</if>>
        <</if>>
        
        <<set _drop_count to random(1, 2)>>
        <<for _i to 0; _i < _drop_count; _i++>><<Generate_Gossip "month">><</for>>
        <<set _monthly_gossip_count to _drop_count>>

        /* C. 热搜生成 */
        <<Generate_Monthly_HotSearch>>

        <<if $hot_search_list.length > 0>>
            <<set $current_hot_topic to $hot_search_list[0]>>
            <<set _next_hotsearch to $current_hot_topic.text>>
        <</if>>
        
    <</if>>

<</widget>>`
});

/* ---------- 故事块：Widget_Logic_Finance ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Logic_Finance",
  src: `<<widget "Logic_Finance">>
    /* --- A. 基础运营费 + 艺人工资 --- */
    <<set _is_year_end to ($month % 12 == 0)>>

    /* 艺人工资：每人按段位计（糊咖100 / 三线200 / 二线300 / 一线400 / 顶流500）
       只给「真的在公司」的人发：未签约的占位角色 / 已离队的不算 */
    <<set $salary_cost to 0>>
    <<for _key range Object.keys($actors)>>
        <<set _pp to $actors[_key]>>
        <<set _pay to true>>
        <<if _pp.status is "left">><<set _pay to false>><</if>>
        <<if _pp.status is "hidden">><<set _pay to false>><</if>>
        <<if _key is "huang" and $has_signed_huang isnot true>><<set _pay to false>><</if>>
        <<if _key is "liu" and $has_signed_liu isnot true>><<set _pay to false>><</if>>
        <<if _pay is true>>
            <<set $salary_cost += ((_pp.rank_level || 1) * 100)>>
        <</if>>
    <</for>>
    
    <<if _is_year_end>>
        <<set _actual_cost to $monthly_cost + $salary_cost + 500>>
    <<else>>
        <<set _actual_cost to $monthly_cost + $salary_cost>>
    <</if>>
    
    <<set $money -= _actual_cost>>

    /* --- B. 流量维护费 (之前新增的逻辑) --- */
    <<set _total_traffic_cost to 0>>
    <<set _traffic_decay_msg to "">>
    
    /* 定义维护费标准 (顶流 15000→26000：红到这个位置，热搜包月就是天价) */
    <<set _maintenance_map to {1: 200, 2: 1000, 3: 3000, 4: 8000, 5: 26000}>>
    
    /* 🛠️ 只算「真的在公司」的人，避免未签约占位角色/离队艺人白扣流量 */
    <<for _key range Object.keys($actors)>>
        <<set _a to $actors[_key]>>
        <<set _tpay to true>>
        <<if _a.status is "left">><<set _tpay to false>><</if>>
        <<if _a.status is "hidden">><<set _tpay to false>><</if>>
        <<if _key is "huang" and $has_signed_huang isnot true>><<set _tpay to false>><</if>>
        <<if _key is "liu" and $has_signed_liu isnot true>><<set _tpay to false>><</if>>
        <<if _tpay is true>>
            <<set _cost to (_maintenance_map[_a.rank_level] || 200)>>
            <<set _total_traffic_cost += _cost>>
        <</if>>
    <</for>>
    
    /* 扣除流量 */
    <<if $traffic >= _total_traffic_cost>>
        <<set $traffic -= _total_traffic_cost>>
    <<else>>
        /* 流量不足惩罚 */
        <<set $traffic to 0>>
        <<set _traffic_decay_msg to "⚠️ 流量枯竭！无法维持艺人热度，全员话题度下降！">>
        <<for _key range Object.keys($actors)>>
            <<set $actors[_key].topic to Math.max(0, $actors[_key].topic - 20)>>
        <</for>>
    <</if>>
<</widget>>`
});

/* ---------- 故事块：Widget_Logic_Punishment ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Logic_Punishment",
  src: `<<widget "Logic_Check_Punishment">>
    <<set _punishment_triggered to false>>
    <<set _fired_actors to []>> /* 记录被退货的艺人名字 */
    <<set _total_penalty to 0>> /* 记录总违约金 */
    
    /* 如果危险值爆表 (大于等于100) */
    <<if $danger_level >= 100>>
        <<set _punishment_triggered to true>>
        
        /* 1. 清空所有资源 & 抹除掉落 */
        <<set $resources to {s:0, a:0, b:0, c:0}>>
        <<set _resource_event to null>>
        
        /* 2. 遍历所有艺人进行处理 */
        <<for _key range Object.keys($actors)>>
            <<set _a to $actors[_key]>>
            
            /* --- 检查是否正在接通告 (非空闲 且 非培训 且 非被封杀 且 非产假) --- */
            /* 🔴 修复：增加 neq "maternity_leave" 判断 */
            <<if _a.busy_months > 0 and _a.status isnot "left" and _a.job_type neq "training" and _a.job_type neq "banned" and _a.job_type neq "maternity_leave">>
                /* 触发退货惩罚 */
                <<set _fired_actors.push(_a.name)>>
                <<set _total_penalty += 500>>
                <<set $money -= 500>> /* 直接扣钱 */
            <</if>>
            
            /* --- 统一执行封杀 --- */
            /* 🔴 修复：如果展鹏正在休产假，不要覆盖他的状态 */
            <<if _a.status is "left">>
                /* 已离队的人不参与封杀（展鹏已经不在公司） */
            <<elseif _key is "zp" and _a.job_type is "maternity_leave">>
                /* 展鹏保持产假状态，不受封杀状态覆盖影响 */
                /* (虽然公司已经凉了，但他本来就在家带孩子) */
            <<else>>
                /* 其他人(或者没休假的展鹏) 强制回家反省 */
                <<set _a.busy_months to 3>>
                <<set _a.project_name to "📉 口碑崩盘 (无人敢用)">>
                <<set _a.job_type to "banned">>
            <</if>>
            
        <</for>>
        
        /* 3. 危险值归零 */
        <<set $danger_level to 0>>
    <</if>>
<</widget>>`
});

/* ---------- 故事块：Widget_Month_Logic ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Month_Logic",
  src: `<<widget "Process_Month_Logic">>
    <<silently>>
    
        /* 展鹏怀孕判定*/
        <<ZP_Monthly_Process>>

        /* 1. 财务与流量消耗计算 */
        <<Logic_Finance>>

        /* 2. 艺人状态更新 (体力、升咖、杀青) */
        <<Logic_Actors>>

        /* 3. 随机事件生成 (商战、资源、情报) */
        <<Logic_Events>>
        

        /* 🔴【新增】4. 检查危险值惩罚 (必须放在事件生成之后) */
        <<Logic_Check_Punishment>>
        
        /* 5. 月份递增与重置 */
        <<Logic_Cleanup>>
        
    <</silently>>
<</widget>>`
});

/* ---------- 故事块：Widget_PR_System ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_PR_System",
  src: `<<nobr>>
<<widget "PR_Action">>
/* 参数: $args[0]=索引, $args[1]=操作类型 */
<<set _idx to $args[0]>>
<<set _type to $args[1]>>
<<set _item to $hot_search_list[_idx]>>

/* 1. 成本不变：100万 + 1000流量 */
<<set _cost_money to 100>>
<<set _cost_traffic to 1000>>

/* 2. 检查资源 */
<<if $pr_action_count <= 0>>
    <<run alert("公关部总监：老板，本月公关次数已用尽！(3/3)")>>
<<elseif $money < _cost_money>>
    <<run alert("财务部：资金不足！需要 " + _cost_money + "万。")>>
<<elseif $traffic < _cost_traffic>>
    <<run alert("运营部：流量库存不足！需要 " + _cost_traffic + "点。")>>
<<else>>
    /* === 执行成功，扣除成本 === */
    <<set $money -= _cost_money>>
    <<set $traffic -= _cost_traffic>>
    <<set $pr_action_count -= 1>>
    
    <<set _item.handled to true>>
    <<set $pr_result to { title: "", desc: "", status: "", color: "", changes: [] }>>
    <<set _roll to random(1, 100)>>

    /* =================================================
       情形一：操作我方热搜 (主赚流量)
       ================================================= */
    <<if _item.type is "my_good" or _item.type is "my_bad">>
        
        /* SSR: 大成功 (20%) */
        <<if _roll <= 20>>
            <<set $traffic += 8000>> /* 💰 巨额收益 */
            <<set $pr_result to { title: "🚀 现象级爆红", status: "大成功", color: "#16a34a", desc: "不仅完成了公关目标，还引发了全网狂欢！这波流量赚麻了！", changes: ["流量 +8000 (血赚)"] }>>
            
            /* 额外奖励 */
            <<if _item.type is "my_bad">>
                <<set $danger_level to Math.max(0, $danger_level - 15)>>
                <<run $pr_result.changes.push("危险值 -15")>>
            <<else>>
                <<set $danger_level to Math.max(0, $danger_level - 5)>>
                <<run $pr_result.changes.push("危险值 -5")>>
            <</if>>

        /* Pass: 正常发挥 (60%) */
        <<elseif _roll <= 80>>
            <<set $traffic += 4000>> /* 💰 稳定盈利 */
            <<set $pr_result to { title: "✅ 运营成功", status: "成功", color: "#2563eb", desc: "投入产出比很划算，数据稳步增长。", changes: ["流量 +4000 (小赚)"] }>>
            
            <<if _item.type is "my_bad">>
                <<set $danger_level to Math.max(0, $danger_level - 8)>>
                <<run $pr_result.changes.push("危险值 -8")>>
            <</if>>

        /* Fail: 失常发挥 (20%) */
        <<else>>
            <<set $traffic -= 2000>>
            <<set $pr_result to { title: "🤡 惨遭反噬", status: "失败", color: "#dc2626", desc: "这届网友太难带了，买的热搜太尴尬被群嘲。", changes: ["流量 -2000 (亏损)"] }>>
            
            <<if _item.type is "my_bad">>
                <<set $danger_level += 5>>
                <<run $pr_result.changes.push("危险值 +5")>>
            <</if>>
        <</if>>

    /* =================================================
       情形二：操作对手热搜 (吸血 + 伤害)
       ================================================= */
    <<else>>
        /* SSR: 大成功 */
        <<if _roll <= 20>>
            <<set _dmg_heat to 500>>
            <<set $traffic += 5000>> /* 💰 吸干对手流量 */
            <<set $danger_level to Math.max(0, $danger_level - 10)>>
            
            <<set $pr_result to { title: "🧛 完美吸血", status: "大成功", color: "#16a34a", desc: "把对手的热度全部转化为了我们的流量！这招借力打力太漂亮了！", changes: ["对手指数 -5", "流量 +5000 (吸血)", "危险值 -10"] }>>

        /* Pass: 正常发挥 */
        <<elseif _roll <= 80>>
            <<set _dmg_heat to 300>>
            <<set $traffic += 3000>> /* 💰 刚好回本 */
            
            <<set $pr_result to { title: "✅ 成功截流", status: "成功", color: "#2563eb", desc: "成功蹭到了对手的热度，并打乱了对方的节奏。", changes: ["对手指数 -3", "流量 +3000 (保本)"] }>>

        /* Fail: 失常发挥 */
        <<else>>
            <<set _dmg_heat to -200>>
            <<set $danger_level += 8>>
            
            <<set $pr_result to { title: "🤬 偷鸡不成", status: "失败", color: "#dc2626", desc: "蹭热度姿势太难看，被路人骂惨了，反而给对手送了热度！", changes: ["对手指数 +2", "危险值 +8"] }>>
        <</if>>

        /* 结算对手数值 */
        <<for _r range $rivals>>
            <<if _r.name is _item.rival_name>>
                <<set _r.heat -= _dmg_heat>>
            <</if>>
        <</for>>
    <</if>>

    <<goto "PR_Execution_Report">>

<</if>>
<</widget>>
<</nobr>>`
});

/* ---------- 故事块：Widget_Resource_System ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Resource_System",
  src: `<<widget "Social_Gacha">>
    <<set _cost to $args[0]>>
    <<set _type to $args[1]>>
    
    /* 1. 扣除消耗 (修正体力逻辑) */
    <<set $money -= _cost>>
    
    /* 如果是高端晚宴(high)，扣50体力，否则扣25 */
    <<if _type is "high">>
        <<set $stamina -= 50>>
    <<else>>
        <<set $stamina -= 25>>
    <</if>>
    
    /* 2. 生成一个随机数 */
    <<set _roll to random(1, 100)>>
    
    /* 3. 失败判定 (5% 谈判破裂) */
    <<if _roll <= 5>>
        <<set $last_gained_res to "fail">>
        <<set $last_gained_count to 0>>
        <<set $last_gained_extra to undefined>>
    <<else>>
        /* === 谈判成功，开始计算掉落 === */
        <<set _qty to random(1, 2)>>
        <<set $last_gained_count to _qty>>
        
        <<set _gacha_roll to random(1, 100)>>

        <<if _type is "high">>
            /* 高端晚宴 (500w): S(8%), A(30%), B(40%), C(22%) */
            <<if _gacha_roll <= 8>>
                 <<set $resources.s += _qty>><<set $last_gained_res to "s">>
            <<elseif _gacha_roll <= 38>> 
                 <<set $resources.a += _qty>><<set $last_gained_res to "a">>
            <<elseif _gacha_roll <= 78>> 
                 <<set $resources.b += _qty>><<set $last_gained_res to "b">>
            <<else>>
                 <<set $resources.c += _qty>><<set $last_gained_res to "c">>
            <</if>>
        <<else>>
            /* 普通饭局 (100w): S(3%), A(12%), B(35%), C(50%) */
            <<if _gacha_roll <= 3>>
                 <<set $resources.s += _qty>><<set $last_gained_res to "s">>
            <<elseif _gacha_roll <= 15>> 
                 <<set $resources.a += _qty>><<set $last_gained_res to "a">>
            <<elseif _gacha_roll <= 50>> 
                 <<set $resources.b += _qty>><<set $last_gained_res to "b">>
            <<else>>
                 <<set $resources.c += _qty>><<set $last_gained_res to "c">>
            <</if>>
        <</if>>
        
        /* 6. 额外掉落判定 (保持30%) */
        <<if random(1, 100) <= 30>>
            <<Generate_Gossip "drop">>
            <<set $last_gained_extra to "🤫 意外收获：席间听到了一个秘密！">>
        <<else>>
            <<set $last_gained_extra to undefined>>
        <</if>>
    <</if>>
<</widget>>

/* 资源置换 (商务拓展中心专用 - 获取S级资源) */
<<widget "Trade_Secret_For_Res">>
    <<set _target_index to $gossips.findIndex(g => g.type === 'gold')>>
    <<if _target_index === -1>>
         <<set $last_gained_res to "c">>
    <<else>>
        <<run $gossips.deleteAt(_target_index)>>
        <<set _qty to random(1, 2)>>
        <<set $resources.s += _qty>>
        <<set $money -= 500>>
        <<set $stamina -= 20>>
        <<set $last_gained_res to "s">>
        <<set $last_gained_count to _qty>>
        <<set $last_gained_extra to "🤝 对方为了封口，非常痛快！">>
    <</if>>
<</widget>>

/* 情报中心资源置换 (只能获得A级) */
<<widget "Trade_Secret_For_A">>
    <<set _target_index to $gossips.findIndex(g => g.type === 'gold')>>
    <<if _target_index === -1>>
         <<set $last_gained_res to "c">>
    <<else>>
        <<run $gossips.deleteAt(_target_index)>>
        <<set _qty to random(1, 2)>>
        <<set $resources.a += _qty>>
        <<set $last_gained_res to "a">>
        <<set $last_gained_count to _qty>>
        <<set $last_gained_extra to "⚠️ 注意：在情报中心置换只能获得A级资源，如需S级请去商务拓展中心">>
    <</if>>
<</widget>>

/* Generate_Gossip Widget 代码保持不变，
  但为了保证文件完整性，如果您在这个文件中还有 Generate_Gossip 的代码，请保留它。
  上述代码仅替换了 Social_Gacha 和 Trade_Secret_For_Res/A 部分。
  如果您的 Widget_Resource_System 文件里包含了 Generate_Gossip，请不要误删。
  （根据您之前提供的文件，Generate_Gossip 似乎在一个单独的 Widget_Gossip_System 中，如果是这样，上面的代码就是完整的。）
*/`
});

/* ---------- 故事块：Widget_Salary_Calc ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_Salary_Calc",
  src: `<<widget "Calc_Income_Preview">>
<<nobr>>
    <<set _key to $args[0]>>
    <<set _res to $args[1]>>
    <<set _act to $actors[_key]>>

    <<if not def $type>><<set _calc_type to "drama">>
    <<else>><<set _calc_type to $type>><</if>>

    /* 🔴【核心同步】必须与 Job_Settle 完全一致 */
    <<set _base_drama_map to   {1: 90, 2: 350, 3: 700, 4: 1350, 5: 1900}>>
    <<set _base_variety_map to {1: 45, 2: 120, 3: 290, 4: 560,  5: 780}>>
    <<set _base_fashion_map to {1: 45, 2: 120, 3: 290, 4: 560,  5: 780}>>
    <<set _base_stage_map to   {1: 70, 2: 420, 3: 900, 4: 1800, 5: 2600}>>

    /* 🛠️ 修复：未知 $type / 缺字段时不再算出 NaN，统一兜底为 1 / 0 */
    <<if not def _act>><<set _act to $actors.zp>><</if>>
    <<if not def _act.rank_level>><<set _act.rank_level to 1>><</if>>
    <<if not def _act.topic>><<set _act.topic to 0>><</if>>
    <<if not def _res>><<set _res to "c">><</if>>

    <<set _base_income to 0>>
    <<if _calc_type is "drama">><<set _base_income to _base_drama_map[_act.rank_level]>>
    <<elseif _calc_type is "variety">><<set _base_income to _base_variety_map[_act.rank_level]>>
    <<elseif _calc_type is "fashion">><<set _base_income to _base_fashion_map[_act.rank_level]>>
    <<elseif _calc_type is "stage">><<set _base_income to _base_stage_map[_act.rank_level]>>
    <</if>>
    <<if not def _base_income>><<set _base_income to 0>><</if>>

    /* 与 Job_Settle 同一张倍率表，预估才不会和实际到账打脸 */
    <<set _res_mult_map to {
        s: {drama: 1.4, variety: 1.4, fashion: 1.4, stage: 1.4},
        a: {drama: 1.2, variety: 1.2, fashion: 1.2, stage: 1.2},
        b: {drama: 1.0, variety: 1.2, fashion: 1.0, stage: 1.0},
        c: {drama: 0.9, variety: 0.9, fashion: 0.9, stage: 0.9}
    }>>
    
    <<set _res_mult to _res_mult_map[_res][_calc_type]>>
    <<if not def _res_mult>><<set _res_mult to 1>><</if>>
    <<set _star_bonus to (_act.rank_level - 1) * 0.2>>
    <<set _topic_bonus to Math.min(0.8, (_act.topic || 0) / 250)>>
    <<if isNaN(_star_bonus)>><<set _star_bonus to 0>><</if>>
    <<if isNaN(_topic_bonus)>><<set _topic_bonus to 0>><</if>>

    /* 这里直接算「公司到账」= 分成 × 税后，和结算页对得上 */
    <<set _split to (_act.split || 0.5)>>
    <<set _est_income to Math.floor(_base_income * _res_mult * (1 + _star_bonus + _topic_bonus) * _split * 0.75)>>
    <<if isNaN(_est_income)>><<set _est_income to 0>><</if>>

    <<print _est_income>>
<</nobr>>
<</widget>>`
});

/* ---------- 故事块：Widget_ZP_Events ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_ZP_Events",
  src: `<<widget "Event_ZP_Drama">>
    /* 初始化标记：假设没触发特殊事件 */
    <<set _zp_event_handled to false>>
    
    /* 只有是展鹏时才进行判定 */
    <<if $current_actor is "zp">>
        
        /* === 1. 概率判定区 === */
        <<set _roll to random(1, 100)>>
        
        /* 30% 概率摸鱼 */
        <<if _roll <= 30>>
             <<set _zp_event_type to "lazy">>
             
        /* 20% 概率私房钱 (非摸鱼时) */
        <<elseif _roll <= 50>> 
             <<set _zp_event_type to "secret_money">>
        
        /* 【扩展位】以后想加剧情，在这里插队 */
        /* <<elseif _roll <= 60>> <<set _zp_event_type to "new_story">> */
        
        <<else>>
             <<set _zp_event_type to "none">>
        <</if>>

        /* === 2. 事件执行区 === */
        
        /* --- 事件 A: 咸鱼摸鱼 --- */
        <<if _zp_event_type is "lazy">>
            <<set _zp_event_handled to true>>
            <<set $zp_lazy_streak += 1>>
            
            /* 计算理论工资用于打折 */
            <<set _base_map to {1: 90, 2: 350, 3: 700, 4: 1350, 5: 1900}>>
            <<set _res_mult_map to {s: 1.4, a: 1.2, b: 1.0, c: 0.9}>>
            <<if not def $req_res>><<set $req_res to "c">><</if>>
            
            <<set _raw_income to Math.floor(_base_map[$actors.zp.rank_level] * _res_mult_map[$req_res])>>
            
            /* 摸鱼显示逻辑 */
            <<if $zp_lazy_streak < 3>>
                <div style="background:#fff7ed; border:2px solid #fdba74; padding:15px; border-radius:8px; margin-bottom:15px;">
                    <h3 style="color:#c2410c; margin:0;">🐟 咸鱼突刺 (x$zp_lazy_streak)</h3>
                    <hr style="opacity:0.2; margin:10px 0;">
                    <p>展鹏在片场打了个盹，导演虽然有点不爽，但看在他那张脸的份上忍了。</p>
                    <p style="color:#ea580c; font-size:0.9em;">“能不能让他少睡会儿？这次就算了，片酬照发。”</p>
                </div>
                <<set _final_income to Math.floor(_raw_income * 0.95)>>
                <<set $actors.zp.reputation -= 2>>
                <<set $actors.zp.fans.mom += 50>>
            <<else>>
                <div style="background:#fef2f2; border:2px solid #fecaca; padding:15px; border-radius:8px; margin-bottom:15px;">
                    <h3 style="color:#b91c1c; margin:0;">🤬 导演爆发 (连睡 $zp_lazy_streak 次)</h3>
                    <hr style="opacity:0.2; margin:10px 0;">
                    <p>“又是他！天天睡！当剧组是旅馆吗？”</p>
                    <p>导演彻底爆发了，扣除了大部分尾款。</p>
                </div>
                <<set _final_income to Math.floor(_raw_income * 0.6)>>
                <<set $actors.zp.reputation -= 10>>
                <<set $actors.zp.fans.toxic += 300>>
                <<set $actors.zp.fans.career -= 100>>
            <</if>>
            
            /* 结算入账 */
            <<set _share to Math.floor(_final_income * $actors.zp.split)>>
            <<set _tax to Math.floor(_share * 0.25)>>
            <<set $money += (_share - _tax)>>
            
            <div style="font-family:monospace; background:#fff; padding:10px; border-radius:4px; border:1px dashed #cbd5e1;">
                总片酬: $<<print _final_income>> 万 
                <br>公司实收: <b style="color:#ef4444;">+ $<<print (_share - _tax)>> 万</b>
            </div>

        /* --- 事件 B: 私房钱 (小夫妻情趣) --- */
        <<elseif _zp_event_type is "secret_money">>
            <<set _zp_event_handled to true>>
            <<set $zp_lazy_streak to 0>> /* 没摸鱼，计数清零 */
            
            <div style="background:#fdf4ff; border:2px solid #d8b4fe; padding:15px; border-radius:8px; margin-bottom:15px;">
                <h3 style="color:#9333ea; margin:0;">🤫 剧组没给钱？</h3>
                <hr style="opacity:0.2; margin:10px 0;">
                <p>展鹏回来的时候眼神飘忽，紧紧捂着自己的口袋：</p>
                <p style="color:#9333ea; font-weight:bold;">“那个...导演说资金链断了，这次是义演。”</p>
                <p>你瞥了一眼他口袋里露出的银行回执角，没拆穿他。</p>
            </div>
            
            <<set $actors.zp.fans.cp += 500>>
            <<set $actors.zp.reputation += 5>>
            <<set $actors.zp.acting += 2>>
            
            <div style="font-family:monospace; background:#fff; padding:10px; border-radius:4px; border:1px dashed #d8b4fe;">
                公司实收: <b style="color:#94a3b8;">$0 (已入老婆私账)</b>
                <br><span style="color:#d946ef;">📈 演技+2 | CP粉+500 | 口碑+5</span>
            </div>

        /* --- 无特殊事件 --- */
        <<else>>
            <<set $zp_lazy_streak to 0>> /* 正常工作，勤奋计数清零 */
        <</if>>
    <</if>>
<</widget>>`
});

/* ---------- 故事块：Widget_ZP_Pregnancy ---------- */
window.__STORY_PASSAGES.push({
  name: "Widget_ZP_Pregnancy",
  src: `<<widget "ZP_Init">>
    <<if not def $zp_preg>>
        <<set $zp_preg to { state: 0, month: 0, event_flag: "" }>>
    <</if>>
    <<if not def $zp_pregnancy_happened>>
        <<set $zp_pregnancy_happened to false>>
    <</if>>
<</widget>>

/* 🔒 锁判定逻辑 (保持修复后的版本) */
<<widget "ZP_Check_Lock">>
    <<set _zp_lock_msg to "">>
    <<set _check_type to $args[0]>>
    
    <<if $current_actor is "zp">>
        /* 阶段A: 全锁期 */
        <<if ($zp_preg.state is 1 and $zp_preg.month >= 7) or ($zp_preg.state is 2 and $zp_preg.month <= 2)>>
             <<set _zp_lock_msg to "🤰 展鹏正在全封闭产假/月子期，无法安排任何工作。">>
        
        /* 阶段B: 半锁期 */
        <<elseif $zp_preg.state is 2 and $zp_preg.month >= 3 and $zp_preg.month < 6>>
             <<if _check_type is "job_drama" or _check_type is "job_stage">>
                 <<set _zp_lock_msg to "💪 展鹏身体尚未完全恢复（产后恢复期），暂不能适应高强度的剧组或舞台唱跳。<br><br>💡 建议：可以安排【综艺】、【时尚】或【培训】。">>
            <</if>>
        <</if>>
    <</if>>
<</widget>>

/* 📅 每月自动处理逻辑 (已添加时间限制) */
<<widget "ZP_Monthly_Process">>
    <<set $zp_preg.event_flag to "">> 
    
    /* 阶段 0: 未怀孕 */
    <<if $zp_preg.state is 0>>
        
        /* 🔴 修改点：增加 $month < 25 限制 */
        /* 必须在第4月之后，且在第25月剧情开始之前，且之前没怀过 */
        <<if $month >= 4 and $month < 25 and $zp_pregnancy_happened is false>>
            
            /* 30% 概率触发 (原70%有点太高了，建议调低一点，或者你可以改回70) */
            <<if random(1, 100) <= 30>>
                <<set $zp_preg.state to 1>>
                <<set $zp_preg.month to 3>> /* 发现时已经3个月 */
                <<set $zp_preg.event_flag to "discovery">>
                <<set $zp_pregnancy_happened to true>>
            <</if>>
        <</if>>

    /* 阶段 1: 孕期中 */
    <<elseif $zp_preg.state is 1>>
        <<set $zp_preg.month += 1>>
        
        /* === 关键点：孕7月强制退组逻辑 === */
        <<if $zp_preg.month == 7>>
            <<set $zp_preg.event_flag to "leave_start">>
            
            /* 1. 检查是否正在真正工作 (排除 培训 和 封杀) */
            <<if $actors.zp.busy_months > 0 and $actors.zp.job_type neq "training" and $actors.zp.job_type neq "banned">>
                <<set _penalty to 200>>
                <<set $money -= _penalty>>
                <<set $zp_preg.force_quit_msg to "💥 <b>突发违约：</b>由于身体原因无法继续拍摄，展鹏被迫退出剧组/通告！<br>💸 赔偿违约金：200万">>
            <</if>>

            /* 2. 强制锁定行程 */
            <<set $actors.zp.busy_months to 6>> 
            <<set $actors.zp.job_type to "maternity_leave">>
            <<set $actors.zp.project_name to "全封闭待产">>
        <</if>>

        /* 生娃判定 */
        <<if $zp_preg.month >= 10>>
            <<set $zp_preg.event_flag to "birth">>
            <<set $zp_preg.state to 2>> /* 进入产后恢复 */
            <<set $zp_preg.month to 0>> 
            <<set $actors.zp.job_type to "maternity_leave">>
            <<set $actors.zp.project_name to "产后坐月子">>
        <</if>>

    /* 阶段 2: 产后恢复 */
    <<elseif $zp_preg.state is 2>>
        <<set $zp_preg.month += 1>>
        
        /* 产后3月: 部分解禁 */
        <<if $zp_preg.month == 3>>
            <<set $zp_preg.event_flag to "partial_recover">>
            <<set $actors.zp.busy_months to 0>>
            <<set $actors.zp.job_type to "">> 
            <<set $actors.zp.project_name to "">>
        <</if>>

        /* 产后6月: 完全恢复 */
        <<if $zp_preg.month == 6>>
            <<set $zp_preg.event_flag to "full_recover">>
            <<set $zp_preg.state to 3>>
        <</if>>
    <</if>>
<</widget>>

/* 📜 剧情弹窗 (文案保持不变) */
<<widget "ZP_Event_Display">>
    <<if $zp_preg.event_flag neq "">>
        <div class="nm-card" style="background:rgba(253,246,249,.85); border-color:rgba(246,222,232,.92);">
            <div class="nm-sec evt">家庭</div>
            
            /* 1. 发现怀孕 */
            <<if $zp_preg.event_flag is "discovery">>
                <div style="font-size:2em; text-align:center; margin-bottom:8px;">🤢</div>
                <h3 style="color:#8E5F72; text-align:center; font-size:15px; font-weight:600; margin:0 0 10px 0;">意外的“惊喜”</h3>
                <div style="color:#7A6A70; line-height:1.85; font-size:12.5px;">
                    <p>最近展鹏总是能在片场随时随地睡着，还吐了导演一身。你硬拖着他去了医院。</p>
                    <p>医生拿着报告单，表情复杂地看着你们：“恭喜韩总，展先生，你们要做爸爸了，展先生已经怀孕三个月了。”</p>
                    <p>展鹏手里的奶茶“啪”地掉在了地上，化身尖叫鸡：“什么——！！？”</p>
                </div>
                <div class="nm-status" style="color:#A85F72;">
                    🤰 状态更新：进入孕期 (当前3月)
                </div>
            
            /* 2. 开始休假 */
            <<elseif $zp_preg.event_flag is "leave_start">>
                <div style="font-size:2em; text-align:center; margin-bottom:8px;">🛋️</div>
                <h3 style="color:#8E5F72; text-align:center; font-size:15px; font-weight:600; margin:0 0 10px 0;">强制待产</h3>
                
                <<if def $zp_preg.force_quit_msg>>
                    <div class="nm-soft pink" style="margin-bottom:12px;">
                        <<print $zp_preg.force_quit_msg>>
                    </div>
                <</if>>

                <div style="color:#7A6A70; line-height:1.85; font-size:12.5px;">
                    <p>七个月了，宽松的衣服也遮不住展鹏隆起的腹部了。他在试衣间里发脾气，因为怎么都扣不上那条高定西装裤的扣子。</p>
                    <p>“别试了。”你从身后抱住滚圆的小腹，“回家吧，我养你。”</p>
                    <p>“就等你这句话呢！”展鹏愉快地跳进车里，开始了全封闭式的待产生活。</p>
                </div>
                <div class="nm-status" style="color:#A85F72;">
                    🚫 状态更新：全封闭待产 (暂停工作)
                </div>

            /* 3. 生娃 */
            <<elseif $zp_preg.event_flag is "birth">>
                <div style="font-size:2em; text-align:center; margin-bottom:8px;">👶</div>
                <h3 style="color:#8E5F72; text-align:center; font-size:15px; font-weight:600; margin:0 0 10px 0;">啼哭与新生</h3>
                <div style="color:#7A6A70; line-height:1.85; font-size:12.5px;">
                    <p>手术室外的时间格外漫长。当你终于被允许进去时，展鹏脸色苍白，头发全被汗水打湿了，看起来狼狈又虚弱。</p>
                    <p>看到你进来，他费力地抬起眼皮，虚弱地撒娇：“老公.…..疼死了……以后你生……”</p>
                    <p>护士抱着一个皱巴巴的小团子过来：“恭喜，是个健康的女孩，眉眼很像妈妈呢！”</p>
                </div>
                <div class="nm-status" style="color:#A85F72;">
                    🍼 状态更新：进入产后恢复期
                </div>

            /* 4. 部分恢复 */
            <<elseif $zp_preg.event_flag is "partial_recover">>
                <div style="font-size:2em; text-align:center; margin-bottom:8px;">🧘‍♂️</div>
                <h3 style="color:#8E5F72; text-align:center; font-size:15px; font-weight:600; margin:0 0 10px 0;">新手奶爸复出</h3>
                <div style="color:#7A6A70; line-height:1.85; font-size:12.5px;">
                    <p>出了月子，展鹏恢复得惊人地快。虽然腹肌还没完全练回来，但他已经不想在家里带娃了。</p>
                    <p>“我要出去工作！”展鹏掀开衬衫给孩子喂奶，眼珠却转得飞快，他演技在变好，但你一眼就看出来他没有对你说实话。“再不出去露脸，粉丝都要爬墙跑光了！奶粉钱你一个人赚我不放心！”</p>
                </div>
                <div class="nm-status" style="color:#4E7A6A;">
                    ✅ 解锁工作：时尚、综艺、培训
                </div>

            /* 5. 完全恢复 */
            <<elseif $zp_preg.event_flag is "full_recover">>
                <div style="font-size:2em; text-align:center; margin-bottom:8px;">✨</div>
                <h3 style="color:#8E5F72; text-align:center; font-size:15px; font-weight:600; margin:0 0 10px 0;">满血复活</h3>
                <div style="color:#7A6A70; line-height:1.85; font-size:12.5px;">
                    <p>半年过去了，那个在泥浆里摸爬滚打的展鹏又回来了。</p>
                    <p>他站在镜子前整理好领带，回头抓着你的脖子把你拉过来接吻，喘着气冲你挑眉一笑：“韩总，你最赚钱的艺人的回来啦！”</p>
                </div>
                <div class="nm-status" style="color:#4E7A6A;">
                    ✅ 解锁全工作：影视剧、舞台回归
                </div>
            <</if>>
        </div>
    <</if>>
<</widget>>`
});
