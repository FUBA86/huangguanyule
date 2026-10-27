/* ===========================================================================
   ⑥ 主线·第四幕 + 结局判定的剧情卡
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

/* ── 第57月 · 📜 三亿与静默 ─────────────────────────────────────────────
   故事块：Story_Act4_19_BlackCard
   （2026-10-25 改写：不再送黑卡，改为律师何正钰持赠予合同上门。
     原先由「巨额家书」提前到这一月结算的 +30000 万仍然保留，
     剧情上改称"提存"——她拒签，钱进了公证处，五年为期。）
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Story_Act4_19_BlackCard",
  src: `<div class="story-card">
<div class="story-body">
<div style="font-size: 16px; line-height: 1.8; color: #334151; text-align: justify;">
            <p>又一个新年过去，公司复工的第一天，临下班前秘书打来电话，说有位很有名的律师找你。</p>
            <p>男人西装笔挺，十足的精英相，看到你之后出示了律师证，开门见山道：“韩先生你好，我叫何正钰，受展鹏先生委托来找您。”</p>
            <p>说着他打开了公文包，拿出一份文件，你扫了眼，标题是赠予合同。</p>
            <p>“展先生有一笔款项想要赠予给您，因为某些原因无法现场签署合同，所以委托我来完成交付。”何正钰审视地看着你，把桌子上的文件推给你，“展先生已经完成了公证，只要您签字，交付就算是完成了。”</p>
            <p>你问是多少。</p>
            <p>何正钰眉头挑了一下，报了一个数字。</p>
            <p>三个亿，一串长得惊人的数字，展鹏这些年所有的积蓄。</p>
            <p>你翻看着桌子上白纸黑字的合同，展鹏委托何正钰的时间是一个月之前。忽然想起他上次忽然回家。那时你只是奇怪他为什么突然到来，又觉得是过年了想要家人团聚。你没想那么多，单纯开心可以再一次见到展鹏。那时你不知道，他刚刚找了律师，准备把这一辈子的积蓄都留给你。</p>
            <p>他说想囡囡，也说想你，那不是想念，那是告别，他是来见你最后一面的。</p>

            <div class="scene-break">· · ·</div>

            <p>“我不签字。”你合上了合同，你已经竭力在控制自己的情绪，但你的语气依旧很冲，“我也不接受赠予，他要是想给，让他自己来。”</p>
            <p>然而无辜被凶的何正钰看着你，目光却温和了一些，他点点头没有再劝，收起了合同，然后平静地从公文包里拿出第二组文件。</p>
            <p>“既然您拒绝受领，那么根据展先生的授权，这笔钱现在进入提存程序，五年内您随时可以去公证处领取，如果您逾期五年仍未领取，这笔钱就会收为国有。”</p>
            <p>这是都给你计划好了，你盯着眼前薄薄的一张纸发呆，展鹏他怎么能这么狠心，就这样轻描淡写地告别，却又逼你收下钱，让你不得安生。</p>

            <div class="scene-break">· · ·</div>

            <p>“韩先生，如果你没有其他诉求的话，我们今天就到这里。”何正钰没有看你痛哭流涕的兴趣，他起身整了整外套，提起了公文包，眼神看了过来，却又轻轻地叹了口气，“韩总，你救救他。”</p>
            <p>“什么？”你愣住了。</p>
            <p>“我知道他要做很危险的事，但我拦不了，你一定有联系他的方式，找到他，阻止他。”何正钰说着，他的眼神划过一丝异色，但很快转过头，补充道，“这是我作为一个有良知的律师给出的请求，他是一个好人，不应该出事。”</p>
            <p>你觉得这是欲盖弥彰，但你现在没有力气想这些事了，满脑子只有展鹏。</p>
            <p>展鹏不是人，他是个无情的混蛋。</p>

            <div class="scene-break">· · ·</div>

            <p>当天晚上，那台砖头一样的旧手机震动了一次，只有一行字：</p>
            <p style="text-align:center; color:#7C8798;">「线要断了。别再给我发消息。新年快乐，小飞。」</p>
            <p>你盯着那行字看了很久，回了一个字：好。</p>
            <p>发送失败，屏幕上代表链接成功的绿色小点暗了下去，你也失去和他的联系了。</p>
        </div>

        <<set $zp_comm_cut to true>>
        <<set $flag_blackcard_seen to true>>
        <<set $flag_he_warn to true>>
        <<set $money to $money + 30000>>

        <p style="font-size:14px; color:#B08A4A;">·  资金 +30000 万（三亿已提存于公证处）　｜　加密线路已关闭  ·</p>

        <div class="continue-row">
            <<link "把合同收进抽屉 (下个月)">>
                <<goto "Next_Month_End">>
            <</link>>
        </div>
</div>`
});

/* ── 第58月 · 🚨 收网（帝国娱乐崩塌，展鹏失联） ──────────────────────────
   故事块：Story_Act4_20_Collapse
   （2026-10-26 改写：行动代号改「破晓」；不再有"两名协助调查人员失联"的
     官方通报，改成她自己在电视上一个一个找，一个熟悉的面孔都没找到）
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Story_Act4_20_Collapse",
  src: `<div class="story-card">
<div class="story-body">
<div style="font-size: 16px; line-height: 1.8; color: #334151; text-align: justify;">
            <p>出事的那天公司正好在加班，不知道谁忽然惊叫了一声。</p>
            <p>“帝国娱乐完了！顾涛竟然是大毒枭！”</p>
            <p>安静的办公室瞬间变得乱七八糟，你打开电视，新闻频道正在播报着新闻。</p>
            <p style="border-left:3px solid rgba(122,154,214,.5); padding-left:12px;">“昨日凌晨四时，警方展开代号为‘破晓’的收网行动，出动警力三百余人……”</p>
            <p>办公室里交谈的声音越来越小，逐渐没有人说话了，只剩下主持人的播报声。大家都看似专心致志地看着新闻，背地里眼神却纷纷飘向你。</p>
            <p>你知道他们在想什么，帝国娱乐出事了，那展鹏呢，展鹏也被抓了吗？</p>
            <p style="border-left:3px solid rgba(122,154,214,.5); padding-left:12px;">“犯罪嫌疑人顾某试图通过海路潜逃时，被警方拦截。目前顾涛及集团高管十余人已被控制，涉案金额初步估计超过百亿……”</p>
            <p>电视上播放的画面里，红蓝灯光闪烁下，警察押解着一个又一个熟悉的面孔走进警车。你紧紧盯着屏幕，希望能看到那个熟悉的面孔。</p>
            <p>可是你失望了，没有展鹏，甚至没有方末，没有任何一个你熟悉的人，甚至连熊支都没有出现。你打开手机，消息栏安安静静，没有任何人联系你。</p>
            <p>案子结束了，顾涛被抓了，展鹏呢？</p>
            <p>以你对展鹏的了解，行动结束后，他会第一时间给你打电话报平安。而现在新闻都播出了，行动早就结束了，你却什么都不知道。</p>
            <p>不应该是这样的，展鹏应该气喘吁吁地推开门，满身是汗地把你拥入怀里，呼吸急促又断断续续地说他回来了，他再也不走了。展鹏会这么做的，甚至他只应该这么做。</p>
            <p>为什么他不见了，为什么上个月他叫来律师，把所有的积蓄留给你，为什么在行动开始前一个月就和你断开联系，展鹏到底想做什么，他……</p>
            <p>他还活着吗？</p>

            <div class="scene-break">· · ·</div>

            <p>你大脑一片空白，甚至不知道自己是怎么回到办公室的。只有你一个人的场合，手指僵硬地拨打着电话。</p>
            <p>展鹏的手机关机。</p>
            <p>方末的手机关机。</p>
            <p>熊支的手机……关机。</p>

            <div class="scene-break">· · ·</div>

            <p>你失魂落魄地回到家，女儿正抱着小熊玩偶在怀里小声说着什么，看到你出现女儿眼前一亮，举着玩偶跑向你。</p>
            <p>“爸爸，熊先生说妈妈天黑就回家啦！”</p>
            <p>你弯下腰把女儿抱在怀里。</p>
            <p>“好，我们一起等妈妈回家。”</p>
        </div>
        <div class="continue-row">
            <<link "等下去 (下个月)">>
                <<goto "Next_Month_End">>
            <</link>>
        </div>
</div>`
});

/* ── 第59月 · 🕯️ 焦急的等待 ─────────────────────────────────────────────
   故事块：Story_Act4_21_Waiting
   （2026-10-26 改写：熊支改在市局见面、手抖点不着烟；坠海改为"车冲出护栏"；
     结尾加"即将进入结局"，下一页直接判定）
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Story_Act4_21_Waiting",
  src: `<div class="story-card">
<div class="story-body">
<div style="font-size: 16px; line-height: 1.8; color: #334151; text-align: justify;">
            <p>日子在浑浑噩噩中度过，窗外老树长出嫩绿色的新芽，凛冽寒风不知何时温柔了许多，每天早上在空荡荡的床上醒来时，你都不知道自己是不是还活着。</p>
            <p>女儿把心爱的小熊玩偶放进了箱子里，很多个晚上，她等到睡着也没有等到妈妈回家，哭着说熊先生骗她，妈妈也骗她，妈妈说过不走的。</p>
            <p>展鹏的确是个骗子，他说过他不会有事，可现在他已经失联两个月了。</p>

            <div class="scene-break">· · ·</div>

            <p>这一个月里你找到了熊支，他看到你后递给你一支烟，然后哆嗦着手按打火机，按了几下都没有把烟点着。他说行动那天夜里出了岔子，顾涛的人在半路劫了车，展鹏追捕过程中为了截停顾涛，车冲出了护栏。车在海里找到了，人没找到。</p>
            <p>帝国娱乐的崩塌给娱乐圈带来了一场大地震，一个月过去还有余震发生，不断有抓捕的消息传来，反而成了一场新的全网狂欢。猜测一个接着一个，粉丝和路人都在兴致勃勃地讨论，你的微博账号下，展鹏的粉丝们每天都在问你，展鹏在哪儿，展鹏也出事了吗？</p>
            <p>你无法回应，而你的沉默也成了新的谈资，被营销号拿来言之凿凿地说这是展鹏被逮捕的佐证。</p>

            <div class="scene-break">· · ·</div>

            <p>女儿有一天晚上忽然哭闹不止，她抱着你的腿，问妈妈是不是不要我们了，你亲了亲她的额头，说不会的，妈妈很快就会回来看我们的。</p>
            <p>展鹏会回来吗，你不知道，你只是每天给熊支打着电话，只要从他那里没有传来坏消息，展鹏就一定还会回来。</p>
        </div>

        <p style="text-align:center; font-size:13px; color:#78849B; letter-spacing:.28em; margin:18px 0 4px;">·  即 将 进 入 结 局  ·</p>

        <div class="continue-row">
            <<link "把公司撑下去（最后一个月）">>
                <<goto "Next_Month_End">>
            <</link>>
        </div>
</div>`
});

/* ── 第60月 · ⚖️ 命运的分岔路口（不再养成，先给判定，再进结局） ────────────
   故事块：Story_Act4_22_Judgment
   （2026-10-27 定稿：加密线路就是给玩家调数值冲结局用的，所以阈值全部写成绝对值，
     不再用「正义 ≥ 羁绊」这种相对比较 —— 那会让 0 : 0 也判成归队。
      ① stage 99（线路早早被切断）              → BE 无声的牺牲
      ② 信任度 < 40                             → BE 无声的牺牲（他没敢把后背交给你）
      ③ 正义值 < 70（始终没真正站到他那一边）    → BE 无声的牺牲
      ④ 正义值 > 70 且 正义值 > 羁绊值           → Ending_Police（HE·荣耀归队）
      ⑤ 其余（正义 ≥ 70，含正好 70）              → Ending_Family（HE·人间烟火）
   ⚠️ 顺序不要动：先判生死，再判走哪条路。 */
window.__STORY_PASSAGES.push({
  name: "Story_Act4_22_Judgment",
  src: `<<silently>>
<<if def $justice is false>><<set $justice to 0>><</if>>
<<if def $zp_bond is false>><<set $zp_bond to 0>><</if>>
<<if def $zp_trust is false>><<set $zp_trust to 0>><</if>>
<</silently>>

<<set _trust to ($zp_trust || 0)>>
<<set _bond to ($zp_bond || 0)>>
<<set _just to ($justice || 0)>>

/* ★ 判定顺序不要动：先看"还能不能活"，再看"往哪条路走" */
<<if $zp_story_stage is 99>>
    <<set _end to "Ending_Bad">>
    <<set $ending_outcome to "bad">>
    <<set _tag to "BE">>
    <<set _why to "加密线路在收网之前就被切断了。你没能把他完整地带回来。">>
<<elseif _trust < 40>>
    <<set _end to "Ending_Bad">>
    <<set $ending_outcome to "bad">>
    <<set _tag to "BE">>
    <<set _why to "你们之间的默契始终差了一层。最后一次行动，他没有等你，自己把顾涛的车撞下了护栏。">>
<<elseif _just < 70>>
    <<set _end to "Ending_Bad">>
    <<set $ending_outcome to "bad">>
    <<set _tag to "BE">>
    <<set _why to "这几年，你始终没有真正站到他那一边。到最后，他还是一个人把车开向了护栏。">>
<<elseif _just > 70 and _just > _bond>>
    <<set _end to "Ending_Police">>
    <<set $ending_outcome to "police">>
    <<set _tag to "HE">>
    <<set _why to "正义 > 70，而且压过了私心。你替他守住了那条线，他也终于穿回了自己的警服。">>
<<else>>
    <<set _end to "Ending_Family">>
    <<set $ending_outcome to "family">>
    <<set _tag to "HE">>
    <<set _why to "羁绊压过了立场。他留了下来，留在这个圈子，也留在你身边。">>
<</if>>

<div class="tech-card" style="max-width: 620px; margin: 30px auto;">
    <div class="header-banner" style="background: linear-gradient(120deg, #334155, #475569);">
        <span>⚖️ 第 60 月 · 命运的分岔</span>
    </div>

    <div style="padding: 26px 28px 24px;">

        <p style="font-size: 13.5px; color: #64748B; line-height: 1.9; margin: 0 0 16px;">
            惊蛰之前，所有的账都要清一遍。
        </p>

        <div style="border: 1px solid #E3EAF4; border-radius: 12px; overflow: hidden;">
            <div style="display:flex; justify-content:space-between; padding: 11px 16px; background: #F7FAFE; font-size: 13.5px;">
                <span>🛡️ 信任度</span>
                <b style="font-family: ui-monospace, Menlo, monospace; color: <<if _trust < 40>>#BE5B6A<<else>>#2F6E56<</if>>;"><<print _trust>></b>
            </div>
            <div style="display:flex; justify-content:space-between; padding: 11px 16px; border-top: 1px solid #EEF3FA; font-size: 13.5px;">
                <span>💞 羁绊值</span>
                <b style="font-family: ui-monospace, Menlo, monospace; color: #9B5A88;"><<print _bond>></b>
            </div>
            <div style="display:flex; justify-content:space-between; padding: 11px 16px; border-top: 1px solid #EEF3FA; font-size: 13.5px;">
                <span>⚖️ 正义值</span>
                <b style="font-family: ui-monospace, Menlo, monospace; color: <<if _just < 70>>#BE5B6A<<elseif _just > 70>>#2F6E56<<else>>#B4813A<</if>>;"><<print _just>></b>
            </div>
        </div>

        <div style="margin-top: 10px; font-size: 11.5px; color: #94A3B8; line-height: 1.85;">
            判定：信任 ≥ 40 且 正义 ≥ 70 才活得下来；正义 &gt; 70 且高于羁绊 → 归队；其余 → 留下。
        </div>

        <div style="margin-top: 18px; padding: 14px 16px; border-radius: 12px; background: <<if _tag is "BE">>#FDF0F2<<else>>#EFF8F3<</if>>; border: 1px solid <<if _tag is "BE">>#F3D3D8<<else>>#CFE9DC<</if>>;">
            <div style="font-size: 12px; letter-spacing: .18em; color: <<if _tag is "BE">>#B4555F<<else>>#2F6E56<</if>>; margin-bottom: 6px;"><<print _tag>> · 判定结果</div>
            <div style="font-size: 13.5px; line-height: 1.85; color: #3D4B61;"><<print _why>></div>
        </div>

        <div class="continue-row" style="margin-top: 22px;">
            <<link "▶ 推开那扇门">><<goto _end>><</link>>
        </div>

    </div>
</div>`
});

/* ── ⚠️ 已废弃（2026-10-25）：原「第四幕 · 📨 巨额家书」────────────────────
   故事块：Story_Act4_21_Windfall —— 已删除，不再存在
   ---------------------------------------------------------------------------
   原因：三亿改由第57月「📜 三亿与静默」（Story_Act4_19_BlackCard）
        发放，时间点在收网之前；收网后如果再来一位律师送一遍钱，就重了。
        第58月改为「🚨 收网」（Story_Act4_20_Collapse），第59月为等待。
   ------------------------------------------------------------------------- */

/* ── 第25月 · 🔚 结局：平庸的宁静（Rank<4） ─────────────────────────────────
   故事块：Story_BadEnd_Mediocre
   ──────────────────────────────────────────────────────── */
window.__STORY_PASSAGES.push({
  name: "Story_BadEnd_Mediocre",
  src: `<div class="story-card">
<div class="story-body">
        <p>第25个月到了。</p>
        <p>你一直在努力经营，但展鹏的事业始终不温不火，始终没能跻身一线的行列。</p>
        <p>有一阵子你似乎听到了一些关于他的绯闻，但因为关注度不高，这些传言很快就像石沉大海一样消失了，没有激起任何水花。</p>
        <p>展鹏依然是那个有些咸鱼的二线艺人，你们的婚姻虽然平淡，却也安稳地维持了下去。你永远不会知道他背后的秘密，也永远不会经历那场原本会颠覆你人生的风暴。</p>
        <p>或许，这才是最好的结局。</p>
        <div class="scene-break">· · ·</div>
        <div style="text-align:center; margin-top:20px;">
            <p>GAME OVER</p>
            <p style="font-size:0.9em; color:#64748b;">达成结局：【平庸的宁静】</p>
            <p style="font-size:0.8em; color:#94a3b8;">提示：请在第25月前将展鹏培养至一线，以开启主线。</p>
            <br>
            <<button "🔄 重新开始" "Game_Notice">><<run Engine.restart()>><</button>>
</div>
</div>`
});
