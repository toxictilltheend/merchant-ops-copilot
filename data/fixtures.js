// All names, policies, targets, communications and business metrics are synthetic.
export const AS_OF = '2026-10-10';
export const campaign = {id:'autumn-home',name:'秋日居家焕新计划',category:'家居生活',owner:'家居行业运营',target:6,deadline:'2026-10-18',start:'2026-10-10',asOf:AS_OF};
export const policies = {
  v1:{version:'v1',minRating:4.6,minStock:50,deadline:'2026-10-18',clauses:[
    {id:'P01',title:'适用品类',text:'本次活动面向家居生活类目商家。'},
    {id:'P02',title:'经营资质',text:'参与商家须具有有效经营资质，资料待核验的商家须先补充证明。'},
    {id:'P03',title:'服务评分',text:'参与商家服务评分不得低于 4.6 分（满分 5 分）。'},
    {id:'P04',title:'可售库存',text:'主推商品可售库存合计不少于 50 件。'},
    {id:'P05',title:'活动节奏',text:'报名期为 2026-10-10 至 2026-10-18（含当日）；展示期为 2026-10-20 至 2026-10-27。'},
    {id:'P06',title:'资源与承诺',text:'审核通过的商品可申请专题页展示，最终以资源审核结果为准。不保证曝光量、成交额或收益；本活动不提供补贴承诺。'}]},
  v2:{version:'v2',minRating:4.8,minStock:100,deadline:'2026-10-18',clauses:[
    {id:'P01',title:'适用品类',text:'本次活动面向家居生活类目商家。'},
    {id:'P02',title:'经营资质',text:'参与商家须具有有效经营资质，资料待核验的商家须先补充证明。'},
    {id:'P03',title:'服务评分',text:'更新：参与商家服务评分不得低于 4.8 分（满分 5 分）。'},
    {id:'P04',title:'可售库存',text:'更新：主推商品可售库存合计不少于 100 件。'},
    {id:'P05',title:'活动节奏',text:'报名期为 2026-10-10 至 2026-10-18（含当日）；展示期为 2026-10-20 至 2026-10-27。'},
    {id:'P06',title:'资源与承诺',text:'审核通过的商品可申请专题页展示，最终以资源审核结果为准。不保证曝光量、成交额或收益；本活动不提供补贴承诺。'}]}
};
const snapshot=(visitors,buyers,orders,gmv)=>({visitors,buyers,orders,gmv});
const rows=[
 ['M01','木序生活','木',4.9,260,true,3,'担心流量增加后，商品页承接不够。',snapshot(10000,200,200,40000),snapshot(12000,180,180,36000)],
 ['M02','青禾织物','青',4.9,180,true,4,'希望提前知道需要准备哪些活动素材。',snapshot(8000,200,220,33000),snapshot(11000,330,350,52500)],
 ['M03','晴川灯具','晴',4.7,80,true,2,'小批量库存，希望先小规模参与。',snapshot(6000,120,130,26000),snapshot(6500,143,150,30000)],
 ['M04','拾光器皿','拾',4.8,150,true,0,null,snapshot(7000,140,150,30000),snapshot(7200,144,150,30000)],
 ['M05','棉间家居','棉',4.5,200,true,1,'近期在改善售后体验。',snapshot(9000,180,190,28500),snapshot(9000,180,190,28500)],
 ['M06','暮山收纳','暮',4.9,25,true,3,'补货仍在途中。',snapshot(4000,100,110,16500),snapshot(5000,110,120,18000)],
 ['M07','原野香氛','原',4.8,160,null,0,null,snapshot(4000,80,90,18000),snapshot(4200,84,90,18000)],
 ['M08','远行衣橱','远',4.9,300,true,4,'想了解报名规则。',snapshot(8000,160,180,36000),snapshot(9000,180,200,40000)],
 ['M09','白屿软装','白',null,100,true,2,'服务评分暂未同步。',snapshot(5000,100,110,22000),snapshot(5500,110,120,24000)],
 ['M10','有隅日用','有',4.8,120,true,2,'希望提升老客复购。',snapshot(7000,210,220,22000),snapshot(8000,240,250,25000)],
 ['M11','素间布艺','素',4.9,190,true,1,null,snapshot(5000,100,100,20000),snapshot(null,null,null,null)],
 ['M12','山色花器','山',4.8,110,true,1,'希望按现有价格带参与，不做额外折扣。',snapshot(3000,60,70,14000),snapshot(4000,88,100,20000)]
];
export const merchants=rows.map(([id,name,initial,rating,stock,licensed,participations,concern,previous,current])=>({id,name,initial,rating,stock,licensed,participations,concern,previous,current,category:id==='M08'?'服饰':'家居生活',dataVersion:'snapshot-20261010',windows:{previous:'09.26–10.02',current:'10.03–10.09',days:7},benchmark:{conversion:0.025,category:'家居生活',period:'10.03–10.09'},history:concern?[{date:'2026-10-09',text:concern}]:[]}));
