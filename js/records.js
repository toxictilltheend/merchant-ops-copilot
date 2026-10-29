/* Local-only business records. No message provider or model API is contacted. */
window.SC=(function(){
 'use strict';
 const KEY='shangce.workbench.v2',VERSION=2;
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const copy=v=>JSON.parse(JSON.stringify(v));
 const state={tasks:[],drafts:[],events:[],activeDraft:null};let timer,saveTimer,focusBefore,resetting=false;
 const id=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
 function toast(msg){const el=document.getElementById('sc-toast');el.textContent=msg;el.classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('visible'),4200);}
 function modal(title,html){focusBefore=document.activeElement;document.getElementById('sc-modal-title').textContent=title;document.getElementById('sc-modal-body').innerHTML=html;document.getElementById('sc-modal').hidden=false;document.querySelector('#sc-modal header button').focus();}
 function closeModal(){document.getElementById('sc-modal').hidden=true;focusBefore?.focus?.({preventScroll:true});}
 function actor(){return {role:ROLE,industry:ROLE===0?'全行业':ROLE===1?LEADER_IND:ME.ind,nick:ROLE===2?ME.nick:(ROLE===1?'行业负责人':'平台管理员'),track:ROLE===1?LEADER_TRACK:'all'};}
 function canSee(item){const a=item.actor;return ROLE===0||(a&&a.industry===(ROLE===1?LEADER_IND:ME.ind)&&(ROLE===1?(LEADER_TRACK==='all'||a.track===LEADER_TRACK):a.nick===ME.nick));}
 const globals=['TODOS','BT_TPL','XA_MY','XA_MY_UID','MET_SHOW','BT_TASK','BT_SEL','BT_SCRIPT','BT_OPEN','XL_SCOPE','BT_MERCHANTS','XL_PICK','XL_HANDPICK','XA'];
 function save(){
  if(resetting)return;
  try{const g={};for(const k of globals)if(typeof window[k]!=='undefined')g[k]=window[k];const entries={};for(const k of ['bk','fb','pp'])entries[k]={items:SEC[k].items,ord:SEC[k].ord,seq:SEC[k].seq};
   const snapshot={version:VERSION,savedAt:new Date().toISOString(),state,globals:g,entries,role:document.getElementById('idRole').value,industry:LEADER_IND,track:LEADER_TRACK,dates:[MT_D1,MT_D2],chat:xlChat().innerHTML,selected:Array.from(document.querySelectorAll('.mrow.sel'),e=>e.dataset.sid)};
   localStorage.setItem(KEY,JSON.stringify(snapshot));document.querySelectorAll('.sc-save-state').forEach(e=>e.textContent='已保存在此浏览器');
  }catch(e){toast('本地保存失败：浏览器存储空间不足或已禁用。请导出任务后再清理。');}
 }
 function beginReset(){resetting=true;clearTimeout(saveTimer);}
 function saveSoon(){if(resetting)return;clearTimeout(saveTimer);saveTimer=setTimeout(save,180);}
 function log(message){state.events.unshift({at:new Date().toISOString(),message});state.events=state.events.slice(0,120);}
 function rebuildLogs(){RC_LOG=RC_LOG.filter(r=>!r.scId);for(const t of state.tasks){const a=t.actor;const poolKey=a.industry+'|'+a.nick;if(!RC_MER[poolKey])RC_MER[poolKey]=[];
   for(const m of t.merchants){if(!RC_MER[poolKey].some(x=>x.mer===m.name&&x.act===t.label))RC_MER[poolKey].push({mer:m.name,act:t.label,rt:'M',at:'未行动'});
    const sent=t.status!=='scheduled',stamp=t.executedAt||t.createdAt;RC_LOG.push({d:stamp.slice(0,10),t:stamp.replace('T',' ').slice(0,16),act:t.label,ind:a.industry,nick:a.nick,mer:m.name,chn:t.channels.join('、'),talk:t.tone,st:sent?'发送成功':'待发送',re:m.receipt==='replied'||m.receipt==='acted'?'已回复':m.receipt==='read'?'已读未回':sent?'未读':'—',ac:m.receipt==='acted'?'已行动':sent?'未行动':'—',scId:t.id,scSid:m.sid});}
   if(!RC_ACTS.includes(t.label))RC_ACTS.push(t.label);
  }
 }
 function restore(){let raw;try{raw=JSON.parse(localStorage.getItem(KEY)||'null');}catch{toast('本地记录无法读取，已使用初始演示数据。');return;}
  if(!raw||raw.version!==VERSION||!raw.state||!Array.isArray(raw.state.tasks))return;
  try{
   Object.assign(state,raw.state);for(const k of globals)if(Object.hasOwn(raw.globals||{},k))window[k]=raw.globals[k];
   for(const k of ['bk','fb','pp'])if(raw.entries?.[k])Object.assign(SEC[k],raw.entries[k]);
   LEADER_IND=raw.industry||LEADER_IND;LEADER_TRACK=raw.track||'all';document.getElementById('idRole').value=raw.role||'2';setRoleUI(raw.role||'2');
   if(raw.dates?.length===2){[MT_D1,MT_D2]=raw.dates;document.getElementById('mtD1').value=MT_D1;document.getElementById('mtD2').value=MT_D2;mtApply();}
   if(raw.chat)xlChat().innerHTML=raw.chat;
   for(const row of document.querySelectorAll('.mrow')){row.classList.toggle('sel',(raw.selected||[]).includes(row.dataset.sid));row.querySelector('.rowck')?.classList.toggle('on',row.classList.contains('sel'));}
   rebuildLogs();renderTodos();renderEntries();renderKpis();rcFilters();rcRender();updateSel();
  }catch(e){toast('部分本地记录格式已变化，请使用重置演示恢复初始状态。');}
 }
 function download(rows,name){if(!rows.length){toast('当前没有可导出的记录');return;}
  const sheet=XLSX.utils.json_to_sheet(rows.map(row=>Object.fromEntries(Object.entries(row).map(([k,v])=>[k,typeof v==='string'&&/^[=+\-@]/.test(v)?"'"+v:v]))));sheet['!cols']=Object.keys(rows[0]).map(()=>({wch:24}));const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,sheet,'商策名单');XLSX.writeFile(wb,name.endsWith('.xlsx')?name:name+'.xlsx');toast('表格已导出');
 }
 async function readSheet(file){if(!file||!(/\.(xlsx|xls|csv)$/i.test(file.name)))throw Error('请选择 .xlsx、.xls 或 .csv 文件');if(file.size>5*1024*1024)throw Error('名单文件请控制在 5 MB 以内');
  const data=await file.arrayBuffer();let wb;try{wb=XLSX.read(data,{type:'array',raw:true,cellDates:false});}catch{throw Error('文件无法解析，请检查格式是否正确');}
  const sheet=wb.Sheets[wb.SheetNames[0]];if(!sheet)throw Error('文件中没有可读取的工作表');const rows=XLSX.utils.sheet_to_json(sheet,{header:1,defval:'',raw:false});if(rows.length<2)throw Error('名单没有数据，请在第一行填写商家ID或店铺名称');if(rows.length>5001)throw Error('一次最多导入 5000 行名单');
  const headers=rows[0].map(x=>String(x).replace(/^\uFEFF/,'').trim().toLowerCase().replace(/[ _]/g,''));const idIndex=headers.findIndex(x=>['商家id','sellerid','店铺id','id'].includes(x)),nameIndex=headers.findIndex(x=>['店铺名称','店铺名','商家名称','商家名','商家','name'].includes(x));if(idIndex<0&&nameIndex<0)throw Error('缺少列名：请提供“商家ID”或“店铺名称”');
  return rows.slice(1).map(r=>({sid:idIndex>=0?String(r[idIndex]||'').trim():'',name:nameIndex>=0?String(r[nameIndex]||'').trim():''})).filter(r=>r.sid||r.name);
 }
 async function importList(file,pool,apply){try{const rows=await readSheet(file),matched=[],seen=new Set();let rejected=0,duplicates=0;
  for(const row of rows){const m=pool.find(m=>(row.sid&&String(m.sid)===row.sid)||(!row.sid&&row.name&&m.name===row.name));if(!m){rejected++;continue;}if(seen.has(m.sid)){duplicates++;continue;}matched.push(m);seen.add(m.sid);}
  if(!matched.length)throw Error('没有匹配到当前候选范围内的商家，原名单已保留');
  apply(matched);window.SC.lastImport={matched:matched.length,rejected,duplicates};log('导入 '+file.name+'，匹配 '+matched.length+' 家');save();toast('已匹配 '+matched.length+' 家 · 范围外 '+rejected+' 行 · 重复 '+duplicates+' 行');
 }catch(e){toast(e.message||'导入失败，原名单已保留');}}
 function pickedExport(pool,name){download(pool.map(m=>({'商家ID':m.sid,'店铺名称':m.name,'待办':(m.gaps||[]).map(g=>btMetric(g)?.name||g).join('、'),'健康度':m.st||m.tag||''})),name);}
 function scheduleValid(){if(XA.when!=='plan')return true;const ts=new Date(XA.date+'T'+XA.time);if(!XA.date||!XA.time||!Number.isFinite(ts.getTime())||ts<=new Date()){toast('定时时间需要晚于当前时间');return false;}return true;}
 function saveDraft(){if(!XA.list?.length||!XA.text?.trim()){toast('请先准备名单和话术');return;}const found=state.drafts.find(d=>d.id===state.activeDraft);const d={id:found?.id||id(),at:new Date().toISOString(),actor:actor(),label:XA.label||'商家触达',snapshot:copy(XA)};if(found)Object.assign(found,d);else state.drafts.unshift(d);state.activeDraft=d.id;log('保存触达草稿');save();toast('草稿已保存，可在“草稿与任务”恢复');}
 function restoreDraft(uid){const d=state.drafts.find(d=>d.id===uid&&canSee(d));if(!d)return;XA=copy(d.snapshot);state.activeDraft=d.id;closeModal();xlChat().replaceChildren();xlOpen();xlText(xlPushAI(),'已恢复草稿：'+esc(d.label));xaListCard(xlPushAI());xaSetCard(xlPushAI());save();}
 function submit(){const list=xaPicked();if(!list.length){toast('请先勾选商家');return;}if(!XA.text?.trim()){toast('话术不能为空');return;}if(!Object.values(XA.chn||{}).some(Boolean)){toast('请至少选择一个触达渠道');return;}if(!scheduleValid())return;
  const channels=XA_CHN.filter(c=>XA.chn[c]);const signature=JSON.stringify({list:list.map(x=>x.sid).sort(),tasks:XA.tasks,text:XA.text,channels,when:XA.when,date:XA.when==='plan'?XA.date:'',time:XA.when==='plan'?XA.time:'',rep:XA.rep});
  if(state.tasks.some(t=>t.signature===signature)){toast('这份名单与配置已经提交，请在触达中心跟进，避免重复触达');return;}
  const task={id:id(),signature,createdAt:new Date().toISOString(),actor:actor(),label:XA.label||'商家触达',tone:XA.custom?'自定义':xaTone(XA.tone).n,channels,when:XA.when,date:XA.date,time:XA.time,repeat:copy(XA.rep||{}),status:XA.when==='plan'?'scheduled':'sent',text:XA.text,content:XA.content,tasks:copy(XA.tasks||[]),taskSel:copy(XA.taskSel||{}),snapshot:copy(XA),merchants:list.map(m=>({...copy(m),message:xaFill(XA.text,m),receipt:'unread'}))};
  state.tasks.unshift(task);if(state.activeDraft){state.drafts=state.drafts.filter(d=>d.id!==state.activeDraft);state.activeDraft=null;}log('创建模拟触达任务 '+list.length+' 家');rebuildLogs();rcFilters();rcRender();save();xlText(xlPushAI(),'<b>'+list.length+' 家商家的模拟触达已'+(task.status==='scheduled'?'加入定时列表':'写入触达记录')+'</b>。<br>可到触达中心查看，发送内容与任务清单已保存为快照。');toast('已创建模拟任务 · '+list.length+' 家');}
 function execute(uid){const task=state.tasks.find(t=>t.id===uid&&canSee(t));if(!task||task.status!=='scheduled')return;task.status='sent';task.executedAt=new Date().toISOString();log('在页面内模拟执行定时任务');rebuildLogs();rcFilters();rcRender();save();openLibrary();toast('已模拟执行一次；未调用真实消息渠道');}
 function receipt(uid,sid,value){const t=state.tasks.find(t=>t.id===uid&&canSee(t));if(!t||t.status==='scheduled')return;const m=t.merchants.find(m=>m.sid===sid);if(!m)return;if(!['unread','read','replied','acted'].includes(value))return;m.receipt=value;rebuildLogs();rcRender();save();openTask(uid);}
 function openTask(uid){const t=state.tasks.find(t=>t.id===uid&&canSee(t));if(!t)return;
  modal('任务详情 · '+t.label,'<p><span class="sc-tag">'+(t.status==='scheduled'?'待模拟执行':'模拟已发送')+'</span> '+esc(t.createdAt.replace('T',' ').slice(0,16))+' · '+esc(t.channels.join('、'))+'</p><p class="sc-hint">'+(t.when==='plan'?'计划 '+esc(t.date+' '+t.time)+'；仅在本页面点击模拟执行。':'本次触达为本地演示，回执由体验者设置。')+'</p>'+t.merchants.map(m=>'<div class="sc-row"><div><b>'+esc(m.name)+'</b><small>'+esc(m.sid)+'</small><div class="sc-task-snapshot">'+esc(m.message)+'</div></div><div><button onclick="SC.preview('+esc(JSON.stringify(uid))+','+esc(JSON.stringify(m.sid))+')">商家端预览</button><select aria-label="模拟回执" '+(t.status==='scheduled'?'disabled':'')+' onchange="SC.receipt('+esc(JSON.stringify(uid))+','+esc(JSON.stringify(m.sid))+',this.value)">'+[['unread','未读'],['read','已读未回'],['replied','已回复'],['acted','已行动']].map(([v,l])=>'<option '+(m.receipt===v?'selected':'')+' value="'+v+'">'+l+'</option>').join('')+'</select></div></div>').join(''));
 }
 function preview(uid,sid){const t=state.tasks.find(t=>t.id===uid&&canSee(t)),m=t?.merchants.find(m=>m.sid===sid);if(!m)return;const live=XA;try{XA=copy(t.snapshot);document.getElementById('rcH5Body').innerHTML='<p class="sc-hint">发送时快照 · '+esc(m.name)+'</p><div class="tv-devs"><div><div class="tv-lbl">PC 端</div><div class="tv-pc"><div class="tv-scr">'+xaTaskPage(m,'pc')+'</div></div></div><div><div class="tv-lbl">移动端</div><div class="tv-mb"><div class="tv-scr">'+xaTaskPage(m,'mb')+'</div></div></div></div>';document.getElementById('rcH5Mask').classList.add('open');}finally{XA=live;}}
 function openLibrary(){const tasks=state.tasks.filter(canSee),drafts=state.drafts.filter(canSee);modal('草稿与任务','<div class="sc-stat"><div><b>'+drafts.length+'</b>已保存草稿</div><div><b>'+tasks.filter(t=>t.status==='scheduled').length+'</b>待模拟执行</div><div><b>'+tasks.filter(t=>t.status==='sent').length+'</b>模拟已发送</div></div><p class="sc-hint">定时配置仅保存在此浏览器，关闭页面后不会后台发送。可手动模拟执行并记录回执。</p><h3>草稿</h3>'+(drafts.length?drafts.map(d=>'<div class="sc-row"><div><b>'+esc(d.label)+'</b><small>'+d.snapshot.list.length+' 家 · '+esc(d.at.slice(0,16).replace('T',' '))+'</small></div><button onclick="SC.restoreDraft('+esc(JSON.stringify(d.id))+')">恢复草稿</button></div>').join(''):'<div class="sc-empty">暂无草稿。在助手触达设置中保存草稿。</div>')+'<h3>触达任务</h3>'+(tasks.length?tasks.map(t=>'<div class="sc-row"><div><b>'+esc(t.label)+'</b><small>'+t.merchants.length+' 家 · '+esc(t.tone)+' · '+(t.status==='scheduled'?esc(t.date+' '+t.time):'模拟已发送')+'</small></div><div class="sc-actions"><button onclick="SC.openTask('+esc(JSON.stringify(t.id))+')">查看详情</button>'+(t.status==='scheduled'?'<button onclick="SC.execute('+esc(JSON.stringify(t.id))+')">模拟执行一次</button>':'')+'</div></div>').join(''):'<div class="sc-empty">暂无新建任务。从商家明细或异常告警发起触达。</div>')+'<div class="sc-actions"><button onclick="SC.exportTasks()">导出任务记录</button></div>');}
 function exportTasks(){download(state.tasks.filter(canSee).flatMap(t=>t.merchants.map(m=>({'任务ID':t.id,'活动':t.label,'商家ID':m.sid,'店铺名称':m.name,'状态':t.status==='scheduled'?'待模拟执行':'模拟已发送','话术':m.message,'渠道':t.channels.join('、'),'计划日期':t.when==='plan'?t.date+' '+t.time:'立即','回执':m.receipt}))),'商策触达任务.xlsx');}
 function reset(){modal('重置此浏览器的演示记录','<p>将清除本工作台在此浏览器的草稿、待办修改、模板和模拟任务，恢复初始合成数据。可以先导出任务记录。</p><div class="sc-actions"><button onclick="SC.exportTasks()">导出任务记录</button><button class="btn-primary" onclick="SC.confirmReset()">确认重置</button><button onclick="SC.closeModal()">取消</button></div>');}
 function confirmReset(){localStorage.removeItem(KEY);location.reload();}
 document.getElementById('sc-modal').addEventListener('click',e=>{if(e.target.id==='sc-modal')closeModal();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.getElementById('sc-modal').hidden)closeModal();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});window.addEventListener('pagehide',save);
 return {KEY,state,escape:esc,copy,toast,modal,closeModal,save,saveSoon,beginReset,restore,actor,canSee,log,download,readSheet,importList,pickedExport,saveDraft,restoreDraft,submit,execute,receipt,openTask,preview,openLibrary,exportTasks,reset,confirmReset,rebuildLogs,scheduleValid};
})();
