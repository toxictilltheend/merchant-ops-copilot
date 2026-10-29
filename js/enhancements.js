/* Connect the reference interaction graph to the local records module. */
(function(){
 'use strict';
 const esc=SC.escape,copy=SC.copy,$=s=>document.querySelector(s);
 window.xlToast=SC.toast;window.alert=message=>SC.toast(message);
 // Keep the reference permission system while giving every demonstration entry a local destination.
 window.bkGo=function(section,uid){const b=bkFind(section,uid);if(!b)return;if(section==='pp'){dtOpen(b);return;}
  SC.modal(b.nm,'<p>'+esc(b.ds||'业务入口演示')+'</p><p class="sc-hint">这是合成业务工作空间，不会打开真实企业后台。</p><div class="sc-chart">'+[34,56,42,72,58,78,89].map(v=>'<span style="height:'+v+'%"></span>').join('')+'</div><div class="sc-actions"><button onclick="SC.closeModal();stPick(document.querySelectorAll(\'.st-pill\')[1],\'B\')">查看商家明细</button><button onclick="SC.closeModal();stPick(document.querySelectorAll(\'.st-pill\')[2],\'C\')">查看触达中心</button></div>');};
 window.dtGo=function(){const name=DT_WHO?.nm||'联系人';dtClose();SC.modal('协作消息 · '+name,'<p>此处展示与虚构业务联系人的协作入口。</p><textarea id="sc-collab" rows="4" style="width:100%;padding:12px;border:1px solid #e9dfd2;border-radius:8px" placeholder="填写协作事项，不会发送真实消息"></textarea><div class="sc-actions"><button onclick="SC.keepCollaboration()">保存本地协作记录</button></div>');};
 SC.keepCollaboration=function(){const text=$('#sc-collab')?.value.trim();if(!text){SC.toast('请填写协作事项');return;}SC.log('协作记录：'+text);SC.save();SC.closeModal();SC.toast('协作事项已保存在本地');};
 // Stable synthetic merchant IDs are shared by the main list, imports and previews.
 const rows=Array.from(document.querySelectorAll('.mrow'));rows.forEach((row,i)=>{
  row.dataset.product='橙选 '+['轻软通勤单鞋','织面休闲鞋','圆头短靴','城市漫步鞋','柔底乐福鞋','秋日系带鞋','轻便运动鞋','暖绒短靴'][i%8];
  const td=row.children,values=[[91,86,67,80,38,74,41,29],[88,84,64,79,25,45,38,17],[83,78,48,73,18,65,34,23],[75,70,46,61,21,53,32,16]];
  [5,7,9,11].forEach((n,k)=>{const v=values[k][i%8];td[n].innerHTML='<span class="sc-meter"><i style="width:'+v+'%"></i></span><span>'+v+'%</span>';});
  td[4].textContent=['+14.2%','+7.8%','-8.3%','+11.6%','-19.4%','+4.5%','-9.2%','-12.6%'][i%8];
 });
 const nameId=new Map(rows.map((r,i)=>[r.querySelector('.mn b').textContent,String(730510001+i)]));
 window.xlSid=function(name){if(nameId.has(name))return nameId.get(name);let h=17;for(const c of name)h=(h*131+c.charCodeAt(0))%800000000;return String(740000000+h);};
 mfInit();
 function merchantFromRow(row,i){const td=row.children;return {id:'m'+(i+1),sid:row.dataset.sid,name:row.dataset.nm,gaps:(row.dataset.td||'').split(',').filter(Boolean),st:row.dataset.hp,tag:row.dataset.hp,product:row.dataset.product,gmv:td[3].textContent.trim(),yoy:td[4].textContent.trim(),material:xlPct(td[5]),coupon:xlPct(td[7]),redbag:xlPct(td[9]),preN:xlPct(td[11])};}
 const allMerchants=()=>rows.map(merchantFromRow);
 SC.merchants=allMerchants;
 // Consistent per-merchant preview; metrics come from the same visible record.
 const oldTaskPage=window.xaTaskPage;
 window.xaTaskPage=function(m,mode){let html=oldTaskPage(m,mode);const real=allMerchants().find(x=>x.sid===m.sid||x.name===m.name);const h=alHash(m.sid||m.name);const vals=real||{material:45+h%40,coupon:30+h%55,redbag:20+h%65,gmv:(30+h%180)+'万',product:'橙选秋日商品'};
  html=html.replace(/新品橱窗打爆率<\/div><div class="v">50%/g,'新品商品贡献率</div><div class="v">'+(30+h%30)+'%').replace(/优质多素材覆盖率<\/div><div class="v">55%/g,'优质多素材覆盖率</div><div class="v">'+vals.material+'%');
  html=html.replace(/<div class="tp-ov">[\s\S]*?<\/div><div class="tp-tabs">/,'<div class="tp-ov"><div class="r am">本期多素材覆盖率 '+vals.material+'%，请结合待办核对素材缺口。</div><div class="r gn">店铺红包渗透 '+vals.redbag+'% · 消费券渗透 '+vals.coupon+'%。</div><div class="r tip">合成商品：'+esc(vals.product||'橙选秋日商品')+'；完成动作后可在任务详情手动设置回执。</div></div><div class="tp-tabs">');return html;
 };
 window.openDiag=function(el){const row=el.closest('.mrow'),i=rows.indexOf(row),m=merchantFromRow(row,i);const reasons=m.gaps.map(g=>btMetric(g)).filter(Boolean);const html='<p><b>'+esc(m.name)+'</b> · '+esc(m.sid)+' <span class="sc-tag">'+esc(m.st)+'</span></p><div class="sc-stat"><div><b>'+esc(m.gmv)+'</b>近30日成交</div><div><b>'+esc(m.yoy)+'</b>同比变化</div><div><b>'+m.material+'%</b>多素材覆盖率</div></div><p>合成商品：'+esc(m.product)+'</p><h3>可核对的经营事实</h3><p>消费券渗透 '+m.coupon+'%；店铺红包渗透 '+m.redbag+'%；前N活动渗透 '+m.preN+'%。来源为当前商家明细快照。</p><h3>待跟进事项</h3>'+(reasons.length?reasons.map(x=>'<p>• '+esc(x.name)+'：'+esc(x.gap)+'</p>').join(''):'<p>当前展示指标未发现待补缺口。</p>')+'<h3>待验证假设</h3><p>活动配置、素材准备或商家参与意愿可能影响当前进度，需要进一步沟通核实；本页不推断因果，也不承诺经营增幅。</p><div class="sc-actions"><button class="btn-primary" onclick="SC.startMerchant('+i+')">为此商家编排任务</button></div>';SC.modal('经营诊断',html);};
 SC.startMerchant=function(i){SC.closeModal();clearSel();const r=rows[i];r.classList.add('sel');r.querySelector('.rowck').classList.add('on');updateSel();xlBatch();};
 // Main-row selection is retained between pages and filtering, while the count refers to all selected rows.
 window.updateSel=function(){const selected=rows.filter(r=>r.classList.contains('sel'));for(const uid of ['selCount','bmCount','bmCount2']){const e=document.getElementById(uid);if(e)e.textContent=selected.length;}const visible=rows.filter(r=>!r.classList.contains('mhide')&&r.style.display!=='none');$('.allck')?.classList.toggle('on',visible.length>0&&visible.every(r=>r.classList.contains('sel')));return selected.length;};
 window.toggleAll=function(){const shown=rows.filter(r=>!r.classList.contains('mhide')&&r.style.display!=='none');const on=!shown.every(r=>r.classList.contains('sel'));for(const r of shown){r.classList.toggle('sel',on);r.querySelector('.rowck')?.classList.toggle('on',on);}updateSel();};
 const originalFilter=window.mfGo;
 window.mfGo=function(){const selection=rows.filter(r=>r.classList.contains('sel'));originalFilter();for(const r of selection){r.classList.add('sel');r.querySelector('.rowck')?.classList.add('on');}updateSel();};
 // The column picker changes actual table visibility instead of only its selection styling.
 const columnMap={'成交30d':3,'YoY':4,'消费券报名':6,'消费券渗透':7,'店铺红包':8,'红包渗透':9,'前N报名':10,'前N渗透':11,'多素材覆盖率':5};
 const columnBox=$('#colPicker .pk-opts');columnBox.innerHTML=Object.keys(columnMap).map(n=>'<span class="opt on" data-column="'+columnMap[n]+'">'+n+'</span>').join('');columnBox.addEventListener('click',e=>{const opt=e.target.closest('[data-column]');if(!opt)return;opt.classList.toggle('on');const index=+opt.dataset.column;for(const tr of [rows[0].closest('table').querySelector('thead tr'),...rows])if(tr?.children[index])tr.children[index].style.display=opt.classList.contains('on')?'':'none';});
 window.xaFileChg=function(el){const file=el.files?.[0];if(!file)return;const pool=copy(XA.list);SC.importList(file,pool,matched=>{XA.list=matched;XA.pick=Object.fromEntries(matched.map(m=>[m.id,1]));XA.up=file.name;const tb=$('#xaTb');if(tb)tb.innerHTML=xaRows();xaSync();}).finally(()=>el.value='');};
 window.xaApplyUpload=function(){const data=XLSX.utils.json_to_sheet(XA.list.slice(0,Math.max(1,Math.floor(XA.list.length/2))).map(m=>({'商家ID':m.sid,'店铺名称':m.name})));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,data,'名单');const file=new File([XLSX.write(wb,{type:'array',bookType:'xlsx'})],'示例名单.xlsx');xaFileChg({files:[file],value:''});};
 window.btUpFile=function(mid,input){const f=input.files?.[0];if(!f)return;const pool=(XL_SCOPE||BT_MERCHANTS).filter(m=>(m.gaps||[]).includes(mid));SC.importList(f,pool,matched=>{BT_SEL[mid]=matched.map(m=>m.id);btRenderCards();btUpdatePersons();}).finally(()=>input.value='');};
 const oldRcPreview=window.rcH5Open;window.rcH5Open=function(i){const r=RC_PAGE[i];if(r?.scId){SC.preview(r.scId,r.scSid);return;}oldRcPreview(i);};
 window.xaDoSend=SC.submit;
 const oldSend=window.xaSend;window.xaSend=function(){if(!SC.scheduleValid())return;oldSend();};
 const oldRcRender=window.rcRender;window.rcRender=function(){oldRcRender();let bar=$('#sc-record-actions');if(!bar){bar=document.createElement('div');bar.id='sc-record-actions';bar.className='sc-actions';$('.receipt').prepend(bar);}const tasks=SC.state.tasks.filter(SC.canSee);bar.innerHTML='<button onclick="SC.openLibrary()">我的新建任务 · '+tasks.length+'</button><button onclick="SC.exportTasks()">导出任务记录</button><span class="sc-hint">下方含预置历史样例；新任务与回执取自本地操作。</span>';};
 const originalPoolCnt=window.rcPoolCnt;window.rcPoolCnt=function(act,ind,nick){return originalPoolCnt(act,ind,nick);};
 function wire(){
  for(const a of document.querySelectorAll('.lk,.btn-ghost')){if(a.dataset.scWired)continue;const label=a.textContent.trim();if(label==='下载表格'){a.onclick=()=>{const card=a.closest('.xl-card,.bt-card');if(card?.id==='xaList'){SC.pickedExport(xaPicked(),'商策触达名单.xlsx');return;}const metric=card?.dataset.mid;if(metric){SC.pickedExport((XL_SCOPE||BT_MERCHANTS).filter(m=>(BT_SEL[metric]||[]).includes(m.id)),'商策任务名单.xlsx');return;}if(card?.id==='xlList'){const selected=BT_MERCHANTS.filter(m=>XL_PICK[m.id]);SC.pickedExport(selected,'商策商家名单.xlsx');return;}const tr=Array.from(card?.querySelectorAll('tbody tr')||[]);SC.download(tr.map(r=>({'明细':r.innerText.replace(/\s+/g,' ')})),'商策明细.xlsx');};a.dataset.scWired='1';}else if(label==='存为草稿'){a.onclick=SC.saveDraft;a.dataset.scWired='1';}}
  for(const input of document.querySelectorAll('input,textarea'))if(!input.getAttribute('aria-label')&&!input.id?.startsWith('sc-'))input.setAttribute('aria-label',input.placeholder||'输入内容');
 }
 const observer=new MutationObserver(()=>{wire();});observer.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('click',()=>setTimeout(SC.saveSoon,30));document.addEventListener('change',SC.saveSoon);document.addEventListener('input',SC.saveSoon);
 // Small, explicit demonstration destinations for navigation that had no reference page.
 for(const a of document.querySelectorAll('.topnav .nav a')){a.tabIndex=0;a.onclick=()=>{const t=a.textContent.trim();if(t==='商家运营'||t==='首页'){stPick(document.querySelectorAll('.st-pill')[t==='首页'?0:1],t==='首页'?'A':'B');return;}SC.modal(t+' · 演示入口','<p>当前作品展示商家运营工作台。'+esc(t)+'入口预留为业务协作场景。</p><div class="sc-actions"><button onclick="SC.closeModal();stPick(document.querySelectorAll(\'.st-pill\')[1],\'B\')">查看经营指标与商家明细</button></div>');};}
 $('.topnav .rt .ai').onclick=()=>xlOpen();$('.topnav .fav').onclick=()=>stPick(document.querySelectorAll('.st-pill')[0],'A');
 const mode=document.querySelectorAll('.toggle span');for(const [i,m] of Array.from(mode).entries())m.onclick=()=>{for(const n of mode)n.classList.remove('on');m.classList.add('on');if(i===0)xlOpen();else xlClose();};
 for(const a of document.querySelectorAll('[title="历史会话"]')){a.textContent='◷';a.onclick=()=>{const history=SC.state.events.slice(0,25);SC.modal('操作记录',history.length?history.map(x=>'<div class="sc-row"><span>'+esc(x.message)+'</span><small>'+esc(x.at.replace('T',' ').slice(0,16))+'</small></div>').join(''):'<div class="sc-empty">暂无操作记录。当前浏览器的任务与修改将保存在这里。</div>');};}
 $('.topnav .more').onclick=()=>SC.openLibrary();$('.topnav .ava').onclick=()=>SC.modal('演示身份','<p>当前为虚构运营人员林舟的演示空间。可使用页面上方的角色切换，查看不同管理范围。</p><p class="sc-hint">角色切换用于展示产品规则，不是线上账号授权系统。</p>');
 const quick=document.createElement('div');quick.className='sc-quick-questions';quick.innerHTML=['查看未设置消费券的商家','生成触达话术模板'].map(q=>'<button onclick="xlAsk('+esc(JSON.stringify(q))+')">'+q+'</button>').join('');$('.xl-rail-f').prepend(quick);
 const foot=document.createElement('p');foot.className='sc-save-state';foot.textContent='修改和任务仅保存在此浏览器';$('.xl-rail-f').append(foot);
 const caption=document.createElement('p');caption.className='sc-role-caption';caption.textContent='经营指标、商家、商品与回执均为合成；助手基于规则处理演示任务。';$('.idbar').after(caption);
 // Limit pasted fields to text. Reference renderers use escaped values for chat; form fields are cleaned on commit.
 for(const name of ['bkTrySubmit','tkConfirm']){const original=window[name];window[name]=function(...args){for(const inp of document.querySelectorAll('#bkFields input,#tkName'))if(/[<>]/.test(inp.value)){SC.toast('名称和说明请使用普通文字，不包含尖括号');return;}return original(...args);};}
 document.addEventListener('keydown',e=>{const modal=$('#sc-modal');if(!modal.hidden&&e.key==='Tab'){const list=Array.from(modal.querySelectorAll('button,input,select,textarea,[tabindex="0"]')).filter(el=>!el.disabled);if(!list.length)return;const first=list[0],last=list.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 const auditNames={toggleTodo:'更新待办完成状态',tkConfirm:'保存待办任务',bkSubmit:'保存常用入口或联系人',bkDel:'删除常用入口或联系人',xaSaveAsMy:'保存个人话术模板',btSaveTpl:'保存任务话术模板'};for(const [name,label] of Object.entries(auditNames)){const original=window[name];if(typeof original==='function')window[name]=function(...args){const r=original(...args);SC.log(label);SC.saveSoon();return r;};}
 SC.restore();SC.rebuildLogs();rcRender();wire();
})();
