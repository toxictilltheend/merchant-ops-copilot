/* Deterministic, synthetic demonstration model. No production data or network. */
(function(root,factory){'use strict';const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.BIZ=api;})(typeof window==='object'?window:globalThis,function(){
 'use strict';
 const copy=x=>JSON.parse(JSON.stringify(x));
 const DAY=86400000,clock=()=>new Date().toISOString();
 const businessDateFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 function parts(stamp=clock()){const d=new Date(stamp);if(!Number.isFinite(+d))return null;return businessDateFormatter.formatToParts(d).reduce((a,p)=>(a[p.type]=p.value,a),{});}
 function day(stamp=clock()){const p=parts(stamp);return p?`${p.year}-${p.month}-${p.day}`:'';}
 function time(stamp=clock()){const p=parts(stamp);return p?`${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`:'无效时间';}
 function shift(ds,n){return day(new Date(Date.parse(ds+'T12:00:00+08:00')+n*DAY).toISOString());}
 function scheduled(date,hour){const s=date+'T'+hour+':00+08:00',d=new Date(s);return /^\d{4}-\d{2}-\d{2}$/.test(date)&&/^\d{2}:\d{2}$/.test(hour)&&Number.isFinite(+d)&&day(s)===date&&time(s).slice(11)===hour?d.toISOString():null;}
 const industries=['女装','男装','女鞋','男鞋','箱包','内衣','服配','手表眼镜'];
 const shopRoots=['橙屿','山岚','栖木','拾步','晴川','鹿橙','半夏','归途'];
 const products=['棉质衬衫','针织开衫','轻软通勤鞋','系带休闲鞋','帆布托特包','亲肤家居服','编织围巾','轻量光学镜架'];
 const shoeNames=['橙屿原创鞋履','山岚制鞋工作室','栖木鞋履工坊','拾步日常鞋店','晴川鞋履研究所','鹿橙手作鞋铺','半夏舒适鞋履','归途轻履'];
 // A versioned demonstration fixture must not rewrite yesterday's history when reopened tomorrow.
 const seedDay='2026-10-30',datasetVersion='SYN-2026-10-30-v6';
 const round=v=>Math.round((v+Number.EPSILON)*10)/10;
 const ratio=(n,d)=>Number.isFinite(n)&&Number.isFinite(d)&&d>0?round(n/d*100):null;
 const ageOf=ds=>Math.round((Date.parse(seedDay+'T12:00:00+08:00')-Date.parse(ds+'T12:00:00+08:00'))/DAY);
 // Counts are discrete dated events. The preceding 30 days are retained for like-for-like comparisons.
 function eventsAtAge(total,index,kind,age){if(age<0||age>=60)return null;const period=Math.floor(age/30),quota=period?Math.max(0,total+(index+kind)%3-1):total,position=age%30;let count=0;for(let k=0;k<quota;k++)if((index*7+kind*11+k*13)%30===position)count++;return count;}
 function applyFacts(m){
  m.materialCount=m.material===null?null:Math.round(m.productCount*m.material/100);m.material=ratio(m.materialCount,m.productCount);
  m.gmvMinor=Math.round(m.gmvValue*1000000);
  for(const [key,field] of [['redbag','redbagGmvMinor'],['coupon','couponGmvMinor'],['campaign','campaignGmvMinor'],['preN','preNGmvMinor']]){m[field]=m[key]===null?null:Math.round(m.gmvMinor*m[key]/100);m[key]=ratio(m[field],m.gmvMinor);}
  for(const [kind,key] of ['newProducts','live','shortVideos'].entries())m[key+'Day']=eventsAtAge(m.seedActivity[kind],m.seedIndex,kind,ageOf(m.updatedDay));
  return m;
 }

 const staffNames=['林舟','林禾','许岑','陈屿','沈宁','顾川'];
 const staffRoster=industries.flatMap((ind,ix)=>staffNames.map((nick,j)=>({ind,nick,no:String(j<2?960001+ix*2+j:960100+ix*10+j),track:j%2?'产业带':'原创设计'})));
 const contactChannels=['协作消息','短信','在线会话','电话','站内信'];
 const contactActivities=[
  {id:'SYN-HISTORY-CAM-1',name:'25年双11大促招商',talks:['大促报名截止提醒','大促玩法解读 · 满减档位','大促资源位申报提醒']},
  {id:'SYN-HISTORY-CAM-2',name:'8月消费券专项',talks:['消费券未设置提醒','消费券面额优化建议','消费券核销率偏低预警']},
  {id:'SYN-HISTORY-CAM-3',name:'店铺红包冲刺',talks:['店铺红包未设置提醒','红包档位配置建议']},
  {id:'SYN-HISTORY-CAM-4',name:'前N报名冲刺',talks:['前N 未报名催办','前N 货品结构建议']},
  {id:'SYN-HISTORY-CAM-5',name:'9月新势力周',talks:['新势力周招商邀约','新品上新节奏提醒']}
 ];
 const merchants=industries.flatMap((industry,ix)=>Array.from({length:72},(_,i)=>{
  const n=shopRoots[i%8],slot=i%8,extra=i>=8,series=['晨光','远山','浅湾','南巷','原野','晴空','渡口','风庭'][Math.floor((i-8)/8)],ownerIndex=i<6?0:i<8?1:i<14?0:i<24?1:Math.floor(i/12),person=staffRoster[ix*6+ownerIndex];
  const missing=i===5||(extra&&i%17===5),adjust=extra?(i%5-2)*3:0,material=missing?null:Math.min(98,Math.max(10,([91,86,67,80,38,58,41,29][slot])+adjust)),coupon=Math.min(98,Math.max(10,[88,84,64,79,25,45,38,17][slot]+adjust)),redbag=Math.min(98,Math.max(10,[83,78,48,73,18,65,34,23][slot]+adjust)),preN=Math.min(98,Math.max(10,[75,70,46,61,21,53,32,16][slot]+adjust));
  const sid=String(ix===2?730510001+i:731000001+ix*100+i),owner=person.nick,track=person.track;
  const m={id:'m'+sid,sid,name:extra?n+series+industry+(i%2?'工作室':'生活馆'):ix===2?shoeNames[i]:n+industry+'生活馆',industry,owner,track,product:'橙选·'+products[ix],productId:'P'+sid,eligible:true,linked:i!==7,claim:'已认领',gmvValue:extra?round([391.4,231.6,87.2,179.5,42.8,105.6,55.1,28.9][slot]*(0.6+(i*7+ix)%11/10)+ix*1.1):[391.4,231.6,87.2,179.5,42.8,105.6,55.1,28.9][slot]+ix*1.1,yoyValue:round([14.2,7.8,-8.3,11.6,-19.4,4.5,-9.2,-12.6][slot]+(extra?adjust:0)),material,coupon,redbag,preN,campaign:[72,58,39,52,14,32,18,11][slot],signup:extra?(i+ix)%5!==0:i<4,hot:i%3!==0,couponJoined:extra?(i+ix)%4!==0:i<4,redbagSet:extra?(i+ix)%5!==0:i<5,preNJoined:extra?(i+ix)%3!==0:i<4,live:i%3===0?0:2,newProducts:i%3===0?0:3,shortVideos:i%3,productCount:[100,300,200,400,200,100,300,200][slot],materialCount:material===null?null:material,seedIndex:extra?64+ix*64+(i-8):ix*8+i,seedActivity:[i%3===0?0:3,i%3===0?0:2,i%3],quality:missing?'资料待核对':'完整',source:'SYN-MERCHANTS-01',updatedDay:seedDay};
  applyFacts(m);
  m.gaps=[];for(const k of ['material','coupon','redbag','preN'])if(m[k]!==null&&(m[k]<60||(k==='coupon'&&!m.couponJoined)||(k==='redbag'&&!m.redbagSet)||(k==='preN'&&!m.preNJoined)))m.gaps.push(k);
  if(!m.signup)m.gaps.push('signup');if(!m.hot)m.gaps.push('hot');if(!m.newProducts)m.gaps.push('newprod');if(!m.live)m.gaps.push('live');if(m.yoyValue<0)m.gaps.push('recall');
  m.st=m.tag=missing?'资料待核对':m.gaps.length>=5?'风险':m.gaps.length?'预警':'安全';m.scale=m.gmvValue>=300?'头部':m.gmvValue>=100?'腰部':'长尾';m.tier='T'+(slot<2?8:slot<4?6:4);m.gmv=m.gmvValue.toFixed(1)+'万';m.yoy=(m.yoyValue>=0?'+':'')+m.yoyValue+'%';return Object.freeze(m);
 }));

 // Preserve existing merchant identities. Reference assignments reuse their owners' merchants;
 // only 84 extra merchants are needed where the reference pool is larger than the existing one.
 const referenceStaffCounts=[6,6,4,3,4,5,4,3],referenceBrandCounts=[12,12,12,10,10,10,9,9],referenceStaff=[],referenceAssignments=[];
 const referenceRandom=s=>{const x=Math.sin(s*12.9898)*43758.5453;return x-Math.floor(x);};
 for(const [ix,ind] of industries.entries()){
  const count=referenceStaffCounts[ix],people=staffRoster.filter(p=>p.ind===ind),ordered=[...people.filter(p=>p.track==='原创设计').slice(0,Math.ceil(count/2)),...people.filter(p=>p.track==='产业带').slice(0,Math.floor(count/2))];
  const pools=ordered.map(()=>[]),available=ordered.map(person=>merchants.filter(m=>m.industry===ind&&m.owner===person.nick));referenceStaff.push(...ordered.map((person,j)=>({...person,referenceIndex:j})));
  for(let i=0;i<referenceBrandCounts[ix]*6;i++){
   const personIndex=i%count,person=ordered[personIndex],pool=pools[personIndex],j=pool.length,candidates=available[personIndex];let m=candidates[j];
   if(!m){const source=candidates[j%candidates.length],extra=merchants.length-576,sid=String(735000001+ix*100+i),n=copy(source);Object.assign(n,{id:'m'+sid,sid,name:shopRoots[i%8]+['云溪','青原','晴屿','山川','澄湾','远庭'][Math.floor(i/8)%6]+ind+'精选店·'+String(i+1).padStart(2,'0'),product:'橙选·'+products[ix]+'精选款',productId:'P'+sid,seedIndex:576+extra,source:'SYN-REFERENCE-POOL-01'});applyFacts(n);m=Object.freeze(n);merchants.push(m);}
   const q=(j*7+3+personIndex*3)%20,u=(j*11+5+personIndex*7)%20,rt=q<9?'R':q<15?'S':'M',at=rt==='R'?(u<11?'已行动':u<16?'部分完成':'未行动'):rt==='S'?(u<4?'已行动':u<9?'部分完成':'未行动'):(u<1?'已行动':'未行动'),activity=contactActivities[(i*3+1)%contactActivities.length];
   const item={sid:m.sid,mer:m.name,ind,nick:person.nick,act:activity.name,campaignId:activity.id,rt,at,referenceKey:ind+'|'+personIndex+'|'+j};pool.push(item);referenceAssignments.push(item);
  }
 }
 const merchantIndex=new Map(merchants.map(m=>[m.sid,m]));const byId=sid=>merchantIndex.get(String(sid));
 function allowed(m,a){return !!m&&(a.role===0||(m.industry===a.industry&&(a.role===2?m.owner===a.nick:a.track==='all'||m.track===a.track)));}
 const scope=a=>merchants.filter(m=>allowed(m,a));
 const metricInfo=[
  {id:'m1',name:'优质多素材覆盖率',unit:'%',kind:'ratio',formula:'已覆盖商品数合计 ÷ 有效商品数合计 × 100%',numerator:'materialCount',denominator:'productCount',baseUnit:'个'},
  {id:'m2',name:'优质多素材覆盖量',unit:'个',kind:'stock',formula:'截止日已覆盖商品数合计；缺失商家不按0补齐'},
  {id:'m3',name:'素材达标商家占比',unit:'%',kind:'ratio',formula:'素材覆盖率≥80%的商家数 ÷ 有效素材资料商家数 × 100%'},
  {id:'m4',name:'素材达标商家数',unit:'家',kind:'stock',formula:'截止日素材覆盖率≥80%的商家数'},
  {id:'m5',name:'店铺红包GMV渗透率',unit:'%',kind:'rolling',formula:'近30日使用店铺红包的成交金额合计 ÷ 同期成交金额合计 × 100%',numerator:'redbagGmvMinor',denominator:'gmvMinor',baseUnit:'分'},
  {id:'m6',name:'店铺红包商家数',unit:'家',kind:'stock',formula:'截止日已设置店铺红包的商家数；当前状态可增加或减少'},
  {id:'m7',name:'消费券GMV渗透率',unit:'%',kind:'rolling',formula:'近30日使用消费券的成交金额合计 ÷ 同期成交金额合计 × 100%',numerator:'couponGmvMinor',denominator:'gmvMinor',baseUnit:'分'},
  {id:'m8',name:'大促GMV渗透率',unit:'%',kind:'rolling',formula:'近30日大促成交金额合计 ÷ 同期成交金额合计 × 100%',numerator:'campaignGmvMinor',denominator:'gmvMinor',baseUnit:'分'},
  {id:'m9',name:'大促报名商家数',unit:'家',kind:'stock',formula:'截止日有效报名商家数；退出后不再计入'},
  {id:'m10',name:'前N报名商家数',unit:'家',kind:'stock',formula:'截止日前N有效报名商家数'},
  {id:'m11',name:'近30日有上新商家占比',unit:'%',kind:'rolling',formula:'近30日至少有1次上新的商家数 ÷ 有效商家数 × 100%'},
  {id:'m12',name:'期间上新商品数',unit:'个',kind:'flow',activity:'newProducts',activityIndex:0,formula:'所选期间每天新增商品数累加；与上一等长期间比较'},
  {id:'m13',name:'期间直播场次',unit:'场',kind:'flow',activity:'live',activityIndex:1,formula:'所选期间每天开播场次累加；与上一等长期间比较'},
  {id:'m14',name:'期间短视频挂链数',unit:'条',kind:'flow',activity:'shortVideos',activityIndex:2,formula:'所选期间每天挂链条数累加；与上一等长期间比较'}
 ];
 const validRatio=(list,num,den)=>list.filter(m=>Number.isFinite(m[num])&&Number.isFinite(m[den])&&m[den]>0&&m[num]>=0&&m[num]<=m[den]);
 const sumField=(list,k)=>{const valid=list.filter(m=>Number.isFinite(m[k])&&m[k]>=0);return valid.length?valid.reduce((s,m)=>s+m[k],0):list.length?null:0;};
 function evidence(list,index){const info=metricInfo[index];let rows=list,numerator=null,denominator=null;
  if(index===1){rows=validRatio(list,'materialCount','productCount');}
  else if(info.numerator){rows=validRatio(list,info.numerator,info.denominator);numerator=rows.reduce((s,m)=>s+m[info.numerator],0);denominator=rows.reduce((s,m)=>s+m[info.denominator],0);}
  else if(index===2||index===3){rows=validRatio(list,'materialCount','productCount');numerator=rows.filter(m=>m.materialCount/m.productCount>=0.8).length;denominator=rows.length;}
  else if(index===10){rows=list.filter(m=>Number.isFinite(m.newProducts));numerator=rows.filter(m=>m.newProducts>0).length;denominator=rows.length;}
  return {numerator,denominator,valid:rows.length,total:list.length,missing:list.length-rows.length,unit:info.baseUnit||'家'};
 }
 function metrics(list){const material=evidence(list,0),qualified=evidence(list,2),redbag=evidence(list,4),coupon=evidence(list,6),campaign=evidence(list,7),newprod=evidence(list,10);
  const count=k=>{const known=list.filter(m=>typeof m[k]==='boolean');return known.length?known.filter(m=>m[k]).length:list.length?null:0;};
  return [ratio(material.numerator,material.denominator),sumField(list,'materialCount'),ratio(qualified.numerator,qualified.denominator),qualified.valid?qualified.numerator:list.length?null:0,ratio(redbag.numerator,redbag.denominator),count('redbagSet'),ratio(coupon.numerator,coupon.denominator),ratio(campaign.numerator,campaign.denominator),count('signup'),count('preNJoined'),ratio(newprod.numerator,newprod.denominator),sumField(list,'newProductsDay'),sumField(list,'liveDay'),sumField(list,'shortVideosDay')];
 }
 function targets(list,from=historyStart,to=seedDay){const ids=new Set(list.map(m=>typeof m==='string'?m:m.sid)),pool=snapshotAt(to).filter(m=>ids.has(m.sid)),n=pool.length,known=evidence(pool,0),days=ageOf(from)-ageOf(to)+1;return [80,Math.ceil(known.denominator*0.8),80,Math.ceil(known.valid*0.8),80,n,75,55,n,n,80,Math.ceil(n*3*days/30),Math.ceil(n*2*days/30),Math.ceil(n*2*days/30)];}
 // The 30-day demonstration history is derived per merchant, never drawn independently of the data.
 const historyStart=shift(seedDay,-29),dailySnapshots=new Map();
 function snapshotAt(ds){
  if(!scheduled(ds,'00:00')||ds<historyStart||ds>seedDay)throw Error('请选择合成历史范围内的日期：'+historyStart+' 至 '+seedDay);
  if(dailySnapshots.has(ds))return dailySnapshots.get(ds);
  const age=Math.round((Date.parse(seedDay+'T12:00:00+08:00')-Date.parse(ds+'T12:00:00+08:00'))/DAY);
  const rows=merchants.map((base,index)=>{
   if(!age)return base;
   index=base.seedIndex;const m=copy(base),phase=(index%8)*0.67+Math.floor(index/8)*0.23;
   const vary=(value,offset=0,max=100)=>value===null?null:Math.max(0,Math.min(max,round(value+(Math.sin(age*0.61+phase+offset)-Math.sin(phase+offset))*7.5)));
   for(const [i,key] of ['material','coupon','redbag','preN'].entries())m[key]=vary(base[key],i*0.8);
   m.productCount=Math.max(1,base.productCount+Math.round((Math.sin(age*0.22+phase)-Math.sin(phase))*base.productCount*0.12));
   m.gmvValue=round(base.gmvValue*(1+(Math.sin(age*0.4+phase)-Math.sin(phase))*0.08));m.gmv=m.gmvValue.toFixed(1)+'万';m.campaign=vary(base.campaign,3.1);
   m.yoyValue=Math.round((base.yoyValue+(Math.sin(age*0.4+phase)-Math.sin(phase))*3)*10)/10;m.yoy=(m.yoyValue>=0?'+':'')+m.yoyValue+'%';
   for(const [i,key] of ['signup','couponJoined','redbagSet','preNJoined','hot'].entries())m[key]=base[key]?(age<=10+(index*7+i*3)%20&&!(age>=4&&age<=7&&(index+i)%5===0)):(age>3&&age<13&&(index+i)%3===0);
   for(const [kind,key] of ['newProducts','live','shortVideos'].entries()){m[key]=0;for(let n=0;n<30;n++)m[key]+=eventsAtAge(base.seedActivity[kind],index,kind,age+n);}
   m.updatedDay=ds;applyFacts(m);
   m.gaps=[];for(const key of ['material','coupon','redbag','preN'])if(m[key]!==null&&(m[key]<60||(key==='coupon'&&!m.couponJoined)||(key==='redbag'&&!m.redbagSet)||(key==='preN'&&!m.preNJoined)))m.gaps.push(key);
   if(!m.signup)m.gaps.push('signup');if(!m.hot)m.gaps.push('hot');if(!m.newProducts)m.gaps.push('newprod');if(!m.live)m.gaps.push('live');if(m.yoyValue<0)m.gaps.push('recall');
   m.st=m.tag=m.quality!=='完整'?'资料待核对':m.gaps.length>=5?'风险':m.gaps.length?'预警':'安全';m.scale=m.gmvValue>=300?'头部':m.gmvValue>=100?'腰部':'长尾';m.source='SYN-HISTORY-01';m.updatedDay=ds;Object.freeze(m.gaps);return Object.freeze(m);
  });
  Object.freeze(rows);dailySnapshots.set(ds,rows);return rows;
 }
 function scopeAt(actor,ds){return snapshotAt(ds).filter(m=>allowed(m,actor));}
 function metricsAt(list,ds){const ids=new Set(list.map(m=>typeof m==='string'?m:m.sid));return metrics(snapshotAt(ds).filter(m=>ids.has(m.sid)));}
 function activityTotal(list,index,from,to){const info=metricInfo[index],ids=new Set(list.map(m=>typeof m==='string'?m:m.sid)),pool=merchants.filter(m=>ids.has(m.sid)),start=ageOf(from),end=ageOf(to);if(start>=60||end<0||start<end)return null;let total=0;for(const m of pool)for(let age=end;age<=start;age++)total+=eventsAtAge(m.seedActivity[info.activityIndex],m.seedIndex,info.activityIndex,age);return total;}
 function metricValues(list,from,to){const values=metricsAt(list,to);for(let i=11;i<14;i++)values[i]=activityTotal(list,i,from,to);return values;}
 function metricSeries(list,index,from,to){if(from>to)throw Error('开始日期不能晚于结束日期');snapshotAt(from);snapshotAt(to);const rows=[];let cumulative=0;for(let ds=from;ds<=to;ds=shift(ds,1)){const daily=metricsAt(list,ds)[index];if(metricInfo[index].kind==='flow'){cumulative+=daily;rows.push({d:ds,v:cumulative,daily});}else rows.push({d:ds,v:daily});}return rows;}
 function metricSummary(list,index,from,to){const info=metricInfo[index],series=metricSeries(list,index,from,to),first=series[0].v,value=series.at(-1).v,periodDays=ageOf(from)-ageOf(to)+1,previousTo=shift(from,-1),previousFrom=shift(from,-periodDays),baseline=info.kind==='flow'?activityTotal(list,index,previousFrom,previousTo):first,delta=value===null||baseline===null?null:round(value-baseline),goal=targets(list,from,to)[index],ids=new Set(list.map(m=>typeof m==='string'?m:m.sid)),pool=snapshotAt(to).filter(m=>ids.has(m.sid));return {info,value,first,baseline,delta,comparison:info.kind==='flow'?'较上期':'首末变化',previousFrom,previousTo,periodDays,goal,completion:value===null||!goal?null:round(value/goal*100),evidence:evidence(pool,index)};}
 const campaign={id:'DEMO-AUTUMN-01',name:'秋日经营核对（演示）',source:'SYN-POLICY-01 · 本作品自拟规则',cooldownHours:24,maxSevenDays:2,deadline:shift(day(),14),versions:{v1:{label:'V1',threshold:60,description:'经营指标低于60%或尚未配置时提醒'},v2:{label:'V2',threshold:70,description:'经营指标低于70%或尚未配置时提醒'}}};
 function gaps(m,version='v1'){const v=campaign.versions[version]||campaign.versions.v1;return [...new Set([...m.gaps.filter(k=>!['material','coupon','redbag','preN'].includes(k)),...['material','coupon','redbag','preN'].filter(k=>m[k]!==null&&(m[k]<v.threshold||(k==='coupon'&&!m.couponJoined)||(k==='redbag'&&!m.redbagSet)||(k==='preN'&&!m.preNJoined)))])];}
 function candidates(a,key,version){return scope(a).filter(m=>key==='missing'?m.quality!=='完整':gaps(m,version).includes(key));}
 function legacySeedLogs(){return merchants.filter(m=>m.seedIndex<64).sort((a,b)=>a.seedIndex-b.seedIndex).filter((m,i)=>i%3===0).map((m,i)=>({d:shift(seedDay,-3),t:shift(seedDay,-3)+' 10:30',act:campaign.name,campaignId:campaign.id,ind:m.industry,nick:m.owner,mer:m.name,sid:m.sid,chn:'企业消息',talk:contactActivities[0].talks[i%3],st:i%5===0?'发送失败':'发送成功',re:i%5===0?'—':i%4===0?'已回复':'未读',ac:i%5===0?'—':i%4===0?'已行动':'未行动',source:'SYN-RECEIPTS-01'}));}
 function seedLogs(){const out=[];let seed=0;for(let back=29;back>=0;back--){const ds=shift(seedDay,-back);for(let si=0;si<referenceStaff.length;si++){const person=referenceStaff[si],pool=referenceAssignments.filter(r=>r.ind===person.ind&&r.nick===person.nick),lim=Math.max(1,Math.round(pool.length*(0.55+0.30*referenceRandom(si*91+7)))),k=6+Math.floor(referenceRandom(++seed)*9);for(let j=0;j<k;j++){seed++;const item=pool[Math.floor(referenceRandom(seed*7+2)*lim)%lim],activity=contactActivities.find(a=>a.id===item.campaignId),p=referenceRandom(seed*13+5),st=p<0.85?'发送成功':p<0.93?'发送失败':'待发送';let re='—',ac='—';if(st==='发送成功'){const w=referenceRandom(seed*17+7);re=item.rt==='R'?(w<0.75?'已回复':'已读未回'):item.rt==='S'?(w<0.80?'已读未回':'未读'):(w<0.85?'未读':'已读未回');ac=re==='未读'?'未行动':item.at;}const hh=9+Math.floor(referenceRandom(seed*23+13)*11),mm=Math.floor(referenceRandom(seed*29+17)*60);out.push({d:ds,t:ds+' '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'),act:item.act,campaignId:item.campaignId,ind:item.ind,nick:item.nick,mer:item.mer,sid:item.sid,chn:contactChannels[Math.floor(referenceRandom(seed*31+19)*contactChannels.length)%contactChannels.length],talk:activity.talks[Math.floor(referenceRandom(seed*37+23)*activity.talks.length)%activity.talks.length],st,re,ac,source:'SYN-REFERENCE-RECEIPTS-01',referenceKey:item.referenceKey});}}}return out;}

 const seedReceipts=seedLogs(),frequencyReceipts=legacySeedLogs();
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
 function history(tasks){return [...[...frequencyReceipts,...seedReceipts].map(r=>({sid:r.sid,campaignId:r.campaignId,at:r.t.replace(' ','T')+':00+08:00',status:r.ac==='已行动'?'acted':r.st==='发送失败'?'failed':r.st==='待发送'?'submitted':'sent',taskId:'seed-'+r.sid})),...tasks.filter(t=>!t.legacy).flatMap(t=>t.merchants.map(m=>({sid:m.sid,campaignId:t.campaignId,at:m.attemptAt||m.sentAt||t.executedAt||t.createdAt,status:m.status||t.status,taskId:t.id})))];}
 function fingerprint(config,version){return JSON.stringify({list:config.list.map(m=>String(m.sid)).sort(),tasks:[...(config.tasks||[])].sort(),taskSel:Object.entries(config.taskSel||{}).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,[...v].sort()]),text:config.text,channels:Object.keys(config.chn||{}).filter(k=>config.chn[k]).sort(),when:config.when,date:config.when==='plan'?config.date:'',time:config.when==='plan'?config.time:'',content:config.content,version});}

 // Historical fixtures are immutable. Reuse date/scope calculations and return fresh copies
 // so callers cannot mutate cached results. Each cache is bounded for long sessions.
 const scopeCacheKey=list=>[...new Set(list.map(m=>typeof m==='string'?m:m.sid))].sort().join(','),memo=(cache,key,compute)=>{if(cache.has(key))return copy(cache.get(key));const value=compute();if(cache.size>=2500)cache.delete(cache.keys().next().value);cache.set(key,copy(value));return value;};
 const metricsAtBase=metricsAt,metricsAtCache=new Map();metricsAt=function(list,ds){return memo(metricsAtCache,scopeCacheKey(list)+'|'+ds,()=>metricsAtBase(list,ds));};
 const activityTotalBase=activityTotal,activityCache=new Map();activityTotal=function(list,index,from,to){return memo(activityCache,scopeCacheKey(list)+'|'+index+'|'+from+'|'+to,()=>activityTotalBase(list,index,from,to));};
 const metricValuesBase=metricValues,valuesCache=new Map();metricValues=function(list,from,to){return memo(valuesCache,scopeCacheKey(list)+'|'+from+'|'+to,()=>metricValuesBase(list,from,to));};
 const targetsBase=targets,targetsCache=new Map();targets=function(list,from=historyStart,to=seedDay){return memo(targetsCache,scopeCacheKey(list)+'|'+from+'|'+to,()=>targetsBase(list,from,to));};
 const metricSeriesBase=metricSeries,seriesCache=new Map();metricSeries=function(list,index,from,to){return memo(seriesCache,scopeCacheKey(list)+'|'+index+'|'+from+'|'+to,()=>metricSeriesBase(list,index,from,to));};
 const metricSummaryBase=metricSummary,summaryCache=new Map();metricSummary=function(list,index,from,to){return memo(summaryCache,scopeCacheKey(list)+'|'+index+'|'+from+'|'+to,()=>metricSummaryBase(list,index,from,to));};
 return {DAY,clock,copy,day,time,shift,scheduled,industries,staffRoster,contactActivities,contactChannels,referenceStaff,referenceAssignments,seedDay,datasetVersion,historyStart,merchants,byId,allowed,scope,metrics,targets,metricInfo,evidence,activityTotal,metricValues,metricSummary,snapshotAt,scopeAt,metricsAt,metricSeries,campaign,gaps,candidates,seedReceipts,reason,assess,transition,history,fingerprint};
});
