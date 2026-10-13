import {campaign,AS_OF} from '../data/fixtures.js';
export const ratio=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&b>0?a/b:null;
export const change=(now,before)=>Number.isFinite(now)&&Number.isFinite(before)&&before>0?(now-before)/before:null;
export const percent=n=>n===null?'暂无数据':`${(n*100).toFixed(1)}%`;
export const money=n=>Number.isFinite(n)?`¥${n.toLocaleString('zh-CN')}`:'暂无数据';
export function evaluateMerchant(m,p,asOf=AS_OF){
 const reason=(id,pass,detail)=>({id,pass,detail});
 const reasons=[reason('P01',m.category==null?null:m.category===campaign.category,`所属类目：${m.category??'未提供'}`),reason('P02',typeof m.licensed==='boolean'?m.licensed:null,`经营资质：${m.licensed===true?'有效':m.licensed===false?'无效':'待核验'}`),reason('P03',Number.isFinite(m.rating)?m.rating>=p.minRating:null,`服务评分 ${m.rating??'未提供'} / 门槛 ${p.minRating}`),reason('P04',Number.isFinite(m.stock)?m.stock>=p.minStock:null,`可售库存 ${m.stock??'未提供'} / 门槛 ${p.minStock} 件`),reason('P05',asOf>=campaign.start&&asOf<=p.deadline,`判定日期 ${asOf} / 报名截止 ${p.deadline}`)];
 const status=reasons.some(r=>r.pass===false)?'ineligible':reasons.some(r=>r.pass===null)?'unknown':'eligible';
 const growth=change(m.current.gmv,m.previous.gmv);
 const priority=status!=='eligible'?'—':growth!==null&&growth>0?'优先跟进':m.participations>=2?'常规跟进':'补充了解';
 return {status,reasons,priority};
}
export function diagnose(m){
 const current=ratio(m.current.buyers,m.current.visitors),previous=ratio(m.previous.buyers,m.previous.visitors);
 const aov=ratio(m.current.gmv,m.current.orders),gmvChange=change(m.current.gmv,m.previous.gmv),visitorChange=change(m.current.visitors,m.previous.visitors);
 const missing=Object.entries(m.current).filter(([,v])=>!Number.isFinite(v)).map(([k])=>k);
 const dropping=current!==null&&previous!==null&&current<previous;
 const summary=missing.length?'经营数据不完整，暂不判断变化原因':dropping?'流量增长未充分转化为支付买家':gmvChange>0?'经营规模增长，评估活动承接能力':'经营表现平稳，先核实参与意愿';
 const facts=[{id:'D01',label:'成交额',value:money(m.current.gmv),detail:`前期 ${money(m.previous.gmv)}；变化 ${percent(gmvChange)}`},{id:'D02',label:'访客数',value:m.current.visitors?.toLocaleString('zh-CN')??'暂无数据',detail:`相邻 7 天变化 ${percent(visitorChange)}`},{id:'D03',label:'买家转化率',value:percent(current),detail:current===null||previous===null?'分母或数据缺失，无法比较':`前期 ${percent(previous)}；变化 ${((current-previous)*100).toFixed(2)} 个百分点`},{id:'D04',label:'订单客单价',value:money(aov),detail:'成交额 ÷ 支付订单数'}];
 return {merchantId:m.id,summary,facts,metrics:{current,previous,aov,gmvChange,visitorChange},missing,hypothesis:missing.length?'需补齐经营明细后再分析。':dropping?'商品承接、流量结构或优惠表达可能影响转化，需要进一步核实。':'活动素材、库存安排和参与意愿可能影响执行，需要向商家确认。',action:missing.length?'先补充本期访客、支付买家、订单及成交额。':dropping?'先核查商品页与流量来源，再讨论适合参与的主推商品。':'核实主推商品、库存及素材准备情况，确认后提交报名。',concern:m.concern??'暂无历史沟通；建议先询问商家最关心的资源与准备成本。',concernSource:m.concern?'历史沟通记录（合成）':'待验证假设',source:`${m.dataVersion} · ${m.windows.previous} / ${m.windows.current} · 同为 7 天`};
}
export function createDraft(m,p,d){
 const opening=m.concern?`您上次提到“${m.concern}”，我们可以先围绕这个问题核实准备情况。`:'想先了解您对活动资源和准备成本的考虑。';
 const content=`${m.name}的负责人您好，想和您沟通“${campaign.name}”。${opening}\n\n${d.action}\n\n本次报名截止 ${p.deadline}，审核通过的商品可申请专题页展示，最终以资源审核结果为准。活动不保证曝光或成交，也没有补贴承诺。方便先确认主推商品及可售库存吗？`;
 return {text:content,strategy:d.missing.length?'补齐经营信息后再细化建议':d.metrics.current!==null&&d.metrics.previous!==null&&d.metrics.current<d.metrics.previous?'先回应经营问题，再讨论活动匹配':'核实参与意愿，明确准备事项',citations:['P05','P06',...d.facts.map(f=>f.id)],mode:'synthetic-demo'};
}
export function summary(tasks,target=campaign.target){
 const unique=(type)=>new Set(tasks.filter(t=>t.receipts.some(r=>r.type===type)).map(t=>t.merchantId)).size;
 return {tasks:tasks.length,sent:unique('sent'),delivered:unique('delivered'),replied:unique('replied'),enrolled:unique('enrolled'),target,achievement:target>0?unique('enrolled')/target:null};
}
