/* Deterministic, synthetic demonstration model. No production data or network. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BIZ=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const DAY=86400000,clock=()=>new Date().toISOString();
 function parts(stamp=clock()){const d=new Date(stamp);if(!Number.isFinite(+d))return null;return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(d).reduce((a,p)=>(a[p.type]=p.value,a),{});}
 function day(stamp=clock()){const p=parts(stamp);return p?`${p.year}-${p.month}-${p.day}`:'';}
 function time(stamp=clock()){const p=parts(stamp);return p?`${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`:'无效时间';}
 function shift(ds,n){return day(new Date(Date.parse(ds+'T12:00:00+08:00')+n*DAY).toISOString());}
 function scheduled(date,hour){const s=date+'T'+hour+':00+08:00',d=new Date(s);return /^\d{4}-\d{2}-\d{2}$/.test(date)&&/^\d{2}:\d{2}$/.test(hour)&&Number.isFinite(+d)&&day(s)===date&&time(s).slice(11)===hour?d.toISOString():null;}
 const industries=['女装','男装','女鞋','男鞋','箱包','内衣','服配','手表眼镜'];
 const shopRoots=['橙屿','山岚','栖木','拾步','晴川','鹿橙','半夏','归途'];
 const products=['棉质衬衫','针织开衫','轻软通勤鞋','系带休闲鞋','帆布托特包','亲肤家居服','编织围巾','轻量光学镜架'];
 const shoeNames=['橙屿原创鞋履','山岚制鞋工作室','栖木鞋履工坊','拾步日常鞋店','晴川鞋履研究所','鹿橙手作鞋铺','半夏舒适鞋履','归途轻履'];
 const seedDay=day();
 const merchants=industries.flatMap((industry,ix)=>shopRoots.map((n,i)=>{
  const missing=i===5,material=[91,86,67,80,38,null,41,29][i],coupon=[88,84,64,79,25,45,38,17][i],redbag=[83,78,48,73,18,65,34,23][i],preN=[75,70,46,61,21,53,32,16][i];
  const sid=String(ix===2?730510001+i:731000001+ix*100+i),owner=i<6?'林舟':'林禾',track=i<6?'原创设计':'产业带';
  const m={id:'m'+sid,sid,name:ix===2?shoeNames[i]:n+industry+'生活馆',industry,owner,track,product:'橙选·'+products[ix],productId:'P'+sid,eligible:true,linked:i!==7,claim:'已认领',gmvValue:[391.4,231.6,87.2,179.5,42.8,105.6,55.1,28.9][i]+ix*1.1,yoyValue:[14.2,7.8,-8.3,11.6,-19.4,4.5,-9.2,-12.6][i],material,coupon,redbag,preN,signup:i<4,hot:i%3!==0,couponJoined:i<4,redbagSet:i<5,preNJoined:i<4,live:i%3===0?0:2,newProducts:i%3===0?0:3,shortVideos:i%3,productCount:100,materialCount:material===null?null:material,quality:missing?'资料待核对':'完整',source:'SYN-MERCHANTS-01',updatedDay:seedDay};
  m.gaps=[];for(const k of ['material','coupon','redbag','preN'])if(m[k]!==null&&(m[k]<60||(k==='coupon'&&!m.couponJoined)||(k==='redbag'&&!m.redbagSet)||(k==='preN'&&!m.preNJoined)))m.gaps.push(k);
  if(!m.signup)m.gaps.push('signup');if(!m.hot)m.gaps.push('hot');if(!m.newProducts)m.gaps.push('newprod');if(!m.live)m.gaps.push('live');if(m.yoyValue<0)m.gaps.push('recall');
  m.st=m.tag=missing?'资料待核对':m.gaps.length>=5?'风险':m.gaps.length?'预警':'安全';m.scale=m.gmvValue>=300?'头部':m.gmvValue>=100?'腰部':'长尾';m.tier='T'+(i<2?8:i<4?6:4);m.gmv=m.gmvValue.toFixed(1)+'万';m.yoy=(m.yoyValue>=0?'+':'')+m.yoyValue+'%';return Object.freeze(m);
 }));
 const byId=sid=>merchants.find(m=>m.sid===String(sid));
 function allowed(m,a){return !!m&&(a.role===0||(m.industry===a.industry&&(a.role===2?m.owner===a.nick:a.track==='all'||m.track===a.track)));}
 const scope=a=>merchants.filter(m=>allowed(m,a));
 function metrics(list){const n=list.length,sum=k=>list.reduce((s,m)=>s+(m[k]||0),0),rate=k=>{const valid=list.filter(m=>m[k]!==null);return valid.length?Math.round(valid.reduce((s,m)=>s+m[k],0)/valid.length):0;};return [rate('material'),sum('materialCount'),rate('material'),list.filter(m=>m.material>=80).length,rate('redbag'),list.filter(m=>m.redbagSet).length,rate('coupon'),n?Math.round(list.filter(m=>m.signup).length/n*100):0,list.filter(m=>m.signup).length,list.filter(m=>m.preNJoined).length,n?Math.round(list.filter(m=>m.newProducts>0).length/n*100):0,sum('newProducts'),sum('live'),sum('shortVideos')];}
 function targets(list){const n=list.length;return [80,n*80,80,n,80,n,75,100,n,n,80,n*3,n*2,n*2];}
 const campaign={id:'DEMO-AUTUMN-01',name:'秋日经营核对（演示）',source:'SYN-POLICY-01 · 本作品自拟规则',cooldownHours:24,maxSevenDays:2,deadline:shift(seedDay,14),versions:{v1:{label:'V1',threshold:60,description:'经营指标低于60%或尚未配置时提醒'},v2:{label:'V2',threshold:70,description:'经营指标低于70%或尚未配置时提醒'}}};
 function gaps(m,version='v1'){const v=campaign.versions[version]||campaign.versions.v1;return [...new Set([...m.gaps.filter(k=>!['material','coupon','redbag','preN'].includes(k)),...['material','coupon','redbag','preN'].filter(k=>m[k]!==null&&(m[k]<v.threshold||(k==='coupon'&&!m.couponJoined)||(k==='redbag'&&!m.redbagSet)||(k==='preN'&&!m.preNJoined)))])];}
 function candidates(a,key,version){return scope(a).filter(m=>key==='missing'?m.quality!=='完整':gaps(m,version).includes(key));}
 function seedLogs(){return merchants.filter((m,i)=>i%3===0).map((m,i)=>({d:shift(seedDay,-3),t:shift(seedDay,-3)+' 10:30',act:campaign.name,campaignId:campaign.id,ind:m.industry,nick:m.owner,mer:m.name,sid:m.sid,chn:'企业消息',talk:'合成历史样例',st:i%5===0?'发送失败':'发送成功',re:i%5===0?'—':i%4===0?'已回复':'未读',ac:i%5===0?'—':i%4===0?'已行动':'未行动',source:'SYN-RECEIPTS-01'}));}
 const seedReceipts=seedLogs();
 function reason(m,{actor,tasks=[],taskSel=null,campaignId=campaign.id,version='v1',history=[],now=clock(),ignoreTaskId=null,checkGaps=true}){
  if(!allowed(m,actor))return '不在当前角色、行业或赛道范围';if(!m.eligible)return '不符合活动参与条件';
  if(taskSel)tasks=tasks.filter(k=>!taskSel[k]||taskSel[k].includes(m.id));
  if(tasks.includes('material')&&m.material===null)return '多素材数据缺失，需先核对，不能推断为零';
  if(checkGaps&&(!tasks.length||!tasks.some(k=>gaps(m,version).includes(k))))return '当前规则下没有待办缺口';
  const prior=history.filter(h=>h.sid===m.sid&&h.campaignId===campaignId&&h.taskId!==ignoreTaskId&&h.status!=='cancelled');
  if(prior.some(h=>h.status==='acted'))return '本活动已行动，停止后续提醒';
  const stamp=+new Date(now),reserved=prior.find(h=>['scheduled','paused','submitted'].includes(h.status));if(reserved)return '本活动已有待执行或待审核任务';
  const attempted=prior.filter(h=>Number.isFinite(+new Date(h.at))&&stamp-+new Date(h.at)>=0&&stamp-+new Date(h.at)<7*DAY);
  if(attempted.some(h=>stamp-+new Date(h.at)<campaign.cooldownHours*3600000))return '同活动24小时冷却中（跨渠道合并）';
  if(attempted.length>=campaign.maxSevenDays)return '同活动7天已达2次上限';return '';
 }
 function assess(list,options){const unique=new Map();list.forEach(m=>unique.set(String(m.sid),m));const approved=[],blocked=[];for(const m of unique.values()){const why=reason(byId(m.sid),options);if(why)blocked.push({sid:m.sid,name:m.name,reason:why});else approved.push(copy(byId(m.sid)));}return {approved,blocked};}
 const transitions={submitted:['sent','failed','cancelled','paused'],sent:['delivered','failed'],delivered:['read','replied','acted'],read:['replied','acted'],replied:['acted'],failed:['submitted'],scheduled:['submitted','cancelled','paused'],paused:['cancelled'],acted:[],cancelled:[]};
 function transition(m,next,at=clock(),failure=''){if(!transitions[m.status]?.includes(next))throw Error('不允许从 '+m.status+' 变更为 '+next);if(next==='failed'&&!failure.trim())throw Error('失败需要填写原因');if(next==='submitted'&&m.status==='failed'&&(m.attempts||1)>=3)throw Error('最多模拟3次尝试');if(next==='submitted'&&m.status==='failed')m.attempts=(m.attempts||1)+1;m.status=next;m.events=m.events||[];m.events.push({at,status:next,reason:failure});if(failure)m.failure=failure;if(next==='submitted')m.failure='';return m;}
 function history(tasks){return [...seedReceipts.map(r=>({sid:r.sid,campaignId:r.campaignId,at:r.d+'T10:30:00+08:00',status:r.ac==='已行动'?'acted':r.st==='发送失败'?'failed':'sent',taskId:'seed-'+r.sid})),...tasks.filter(t=>!t.legacy).flatMap(t=>t.merchants.map(m=>({sid:m.sid,campaignId:t.campaignId,at:m.attemptAt||m.sentAt||t.executedAt||t.createdAt,status:m.status||t.status,taskId:t.id})))];}
 function fingerprint(config,version){return JSON.stringify({list:config.list.map(m=>String(m.sid)).sort(),tasks:[...(config.tasks||[])].sort(),taskSel:Object.entries(config.taskSel||{}).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,[...v].sort()]),text:config.text,channels:Object.keys(config.chn||{}).filter(k=>config.chn[k]).sort(),when:config.when,date:config.when==='plan'?config.date:'',time:config.when==='plan'?config.time:'',content:config.content,version});}
 return {DAY,clock,copy,day,time,shift,scheduled,industries,seedDay,merchants,byId,allowed,scope,metrics,targets,campaign,gaps,candidates,seedReceipts,reason,assess,transition,history,fingerprint};
});
