
  
  var ALL_METRICS = [
    {id:'m1',  k:'优质多素材覆盖率',   act:'多素材',  show:1, rate:1, unit:'%'},
    {id:'m2',  k:'优质多素材覆盖量',   act:'多素材',  show:1, rate:0, unit:'个'},
    {id:'m3',  k:'商家端优质多素材覆盖率',act:'多素材',  show:1, rate:1, unit:'%'},
    {id:'m4',  k:'商家端优质多素材覆盖量',act:'多素材',  show:1, rate:0, unit:'个'},
    {id:'m5',  k:'店铺红包GMV渗透',    act:'店铺红包', show:1, rate:1, unit:'%'},
    {id:'m6',  k:'店铺红包商家数量',   act:'店铺红包', show:0, rate:0, unit:'家'},
    {id:'m7',  k:'消费券GMV渗透',      act:'消费券',   show:1, rate:1, unit:'%'},
    {id:'m8',  k:'大促GMV渗透',        act:'好物节',     show:1, rate:1, unit:'%'},
    {id:'m9',  k:'大促商家数量',       act:'好物节',     show:1, rate:0, unit:'家'},
    {id:'m10', k:'前N商家数量',        act:'前N',      show:0, rate:0, unit:'家'},
    {id:'m11', k:'新品打爆率',         act:'新品橱窗', show:1, rate:1, unit:'%'},
    {id:'m12', k:'上新商品数量',       act:'新品橱窗', show:0, rate:0, unit:'个'},
    {id:'m13', k:'直播开播',           act:'直播',     show:0, rate:0, unit:'场'},
    {id:'m14', k:'短视频挂链',         act:'短视频',   show:0, rate:0, unit:'条'}
  ];
  var MET_SHOW = {};
  ALL_METRICS.forEach(function(m){ MET_SHOW[m.id] = m.show; });
  function visibleMets(){ return ALL_METRICS.filter(function(m){ return MET_SHOW[m.id]; }); }

  
  var ROLES = [
    { key:'admin', ttl:'服饰全量 · 大促与基础供给',
      who:'8 个子行业 · 9,860 家商家 · 35 名专员', scope:'整个服饰（女装/男装/女鞋/男鞋/箱包/内衣/服配/手表眼镜）',
      hint:'当前为<b>超级管理员</b>视角：指标栏为服饰全量口径，下方可下钻<b>各子行业进度</b>与<b>全部专员明细进度</b>，指标定义与上方完全一致。',
      // 14 metrics: [m1..m14] 当前值 / 目标值
      cv:[70,23940,56,17955,70,6156,58,40,6936,4959,39,2394,274,1026],
      tv:[80,35000,70,28000,80,9860,75,55,9860,8000,50,4000,500,2000]
    },
    { key:'负责人', ttl:'女装 · 大促与基础供给',
      who:'女装 2,680 家 · 6 名专员', scope:'本行业（女装）全部商家',
      hint:'当前为<b>行业 负责人</b>视角：指标栏为本行业口径，下方只能看到<b>本运营专员明细进度</b>，看不到其他行业与全服饰大盘。',
      cv:[75,3344,61,2552,76,862,64,45,1980,722,43,334,46,150],
      tv:[80,4800,70,3800,80,2680,75,55,2680,1200,50,540,90,280]
    },
    { key:'staff', ttl:'我的商家 · 大促与基础供给',
      who:'负责 150 家 · 亿级/千万级', scope:'仅本人认领的 150 家商家',
      hint:'',
      cv:[78,561,64,434,71,101,66,48,116,87,45,58,8,25],
      tv:[80,750,70,600,80,150,75,55,150,120,50,80,12,40]
    }
  ];
  var ROLE = 2;

  
  var MT_P0 = '2026-10-01', MT_P1 = '2026-10-29';
  var MT_D1 = '2026-09-30', MT_D2 = '2026-10-29';
  var MT_MET = 'm1';   // 走势图当前指标
  function mtDate(s){ var a = String(s).split('-'); return new Date(+a[0], +a[1]-1, +a[2]); }
  function mtStr(d){ var m = d.getMonth()+1, x = d.getDate(); return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(x<10?'0':'')+x; }
  function mtDot(s){ var a = String(s).split('-'); return a[0]+'.'+(+a[1])+'.'+(+a[2]); }
  function mtDays(a, b){ return Math.round((mtDate(b) - mtDate(a)) / 86400000); }
  function mtShift(s, n){ return mtStr(new Date(mtDate(s).getTime() + n*86400000)); }
  // 累计完成系数：周期起点 0.55 › 数据上限 1.00
  function mtF(ds){
    var total = mtDays(MT_P0, MT_P1) || 1;
    var t = mtDays(MT_P0, ds) / total;
    if(t < 0) t = 0; if(t > 1) t = 1;
    return 0.55 + 0.45 * Math.pow(t, 0.85);
  }
  // 底表当前值 › 区间末日当前值
  function mtV(v){ return Math.round(v * mtF(MT_D2)); }
  function mtQuick(n){
    if(n === 0){ MT_D1 = MT_P0; MT_D2 = MT_P1; }
    else { MT_D2 = MT_P1; MT_D1 = mtShift(MT_P1, -n); }
    var a = document.getElementById('mtD1'), b = document.getElementById('mtD2');
    if(a) a.value = MT_D1;
    if(b) b.value = MT_D2;
    mtApply();
  }
  function mtQuickMark(){
    var qs = document.querySelectorAll('.mtbar .mtb-q');
    if(!qs.length) return;
    var span = mtDays(MT_D1, MT_D2), hit = -1;
    if(MT_D2 === MT_P1){
      if(span === 6) hit = 0;
      else if(span === 29) hit = 1;
      if(MT_D1 === MT_P0) hit = 2;
    }
    [].forEach.call(qs, function(q, i){ q.classList.toggle('on', i === hit); });
  }
  function mtApply(){
    var a = document.getElementById('mtD1'), b = document.getElementById('mtD2');
    if(a && a.value) MT_D1 = a.value;
    if(b && b.value) MT_D2 = b.value;
    if(mtDate(MT_D2) < mtDate(MT_D1)){
      var t = MT_D1; MT_D1 = MT_D2; MT_D2 = t;
      if(a) a.value = MT_D1;
      if(b) b.value = MT_D2;
    }
    mtQuickMark();
    var tip = document.getElementById('mtTip');
    if(tip) tip.textContent = '共 ' + (mtDays(MT_D1, MT_D2) + 1) + ' 天 · 指标取区间末日累计值 · 底表更新至 ' + mtDot(MT_P1);
    renderKpis();
    if(document.getElementById('rtInd')) renderIndTable();
    if(document.getElementById('rtStaff')) renderStaffTable();
  }
  function mtInit(){
    var a = document.getElementById('mtD1'), b = document.getElementById('mtD2');
    if(a){ a.value = MT_D1; a.min = MT_P0; a.max = MT_P1; }
    if(b){ b.value = MT_D2; b.min = MT_P0; b.max = MT_P1; }
    mtApply();
  }

  // 进度条配色
  function kpiBar(pct){ return pct >= 80 ? '#eda06c,#e88645' : '#e88645,#e88645'; }
  // 根据 cv/tv 计算单个指标的 KPI 卡片数据（当前值 = 统计周期末日的累计值）
  function kpiOf(role, idx){
    var m = ALL_METRICS[idx], t = role.tv[idx];
    var c = Math.round(role.cv[idx] * mtF(MT_D2));
    var c0 = Math.round(role.cv[idx] * mtF(MT_D1));
    var pct = t ? Math.round(c / t * 100) : 0;
    var sfx = m.rate ? '%' : m.unit;
    var dsfx = m.rate ? 'pt' : m.unit;
    return {k:m.k, act:m.act, cur:c + sfx, tgt:t + sfx, dlt:(c - c0 >= 0 ? '+' : '') + (c - c0) + dsfx, pct:pct, done:pct};
  }
  
  function mtNoise(idx, k){
    // 确定性伪随机：同一指标同一位置每次渲染结果一致，范围约 [-1,1]
    var x = Math.sin((idx + 1) * 12.9898 + (k + 1) * 78.233) * 43758.5453;
    x = x - Math.floor(x);            // 0..1
    var s = Math.sin((k + 1) * 1.7 + idx);  // 叠加一层低频起伏
    return (x - 0.5) * 2 * 0.7 + s * 0.3;   // 合成 [-1,1] 附近
  }
  function mtSeries(role, idx){
    var n = mtDays(MT_D1, MT_D2), step = n > 8 ? n / 8 : 1, pts = [], seen = {}, i, k = 0;
    var base = role.cv[idx];
    var amp = Math.max(1, base * 0.06);   // 波动幅度：约 6% 量级
    for(i = 0; i <= n; i += step){
      var ds = mtShift(MT_D1, Math.round(i));
      if(seen[ds]) continue;
      seen[ds] = 1;
      var v = base * mtF(ds) + mtNoise(idx, k) * amp;
      pts.push({d:ds, v:Math.max(0, Math.round(v)), raw:1});
      k++;
    }
    // 首点、末点回归真实累计值（末点须与卡片当前值一致）
    if(pts.length){
      pts[0].v = Math.round(base * mtF(pts[0].d));
      if(pts[pts.length-1].d !== MT_D2) pts.push({d:MT_D2, v:Math.round(base * mtF(MT_D2))});
      else pts[pts.length-1].v = Math.round(base * mtF(MT_D2));
    } else {
      pts.push({d:MT_D2, v:Math.round(base * mtF(MT_D2))});
    }
    return pts;
  }
  function spark(role, idx){
    var pts = mtSeries(role, idx);
    var vals = pts.map(function(p){ return p.v; });
    var mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
    var pad = (mx - mn) || (mx || 1);
    var lo = mn - pad * 0.35, hi = mx + pad * 0.35;
    var W = 180, H = 30, rd = function(v){ return Math.round(v * 10) / 10; };
    var xy = pts.map(function(p, i){
      return {x:(pts.length > 1 ? i / (pts.length - 1) * (W - 6) + 3 : W / 2),
              y:H - 4 - (p.v - lo) / (hi - lo) * (H - 8)};
    });
    var line = xy.map(function(p){ return rd(p.x) + ',' + rd(p.y); }).join(' ');
    var last = xy[xy.length-1];
    return '<svg class="spk" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none">' +
      '<polygon points="3,' + H + ' ' + line + ' ' + (W-3) + ',' + H + '" fill="rgba(13,120,252,.13)"/>' +
      '<polyline points="' + line + '" fill="none" stroke="#e88645" stroke-width="1.6" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="' + rd(last.x) + '" cy="' + rd(last.y) + '" r="2.4" fill="#e88645" vector-effect="non-scaling-stroke"/>' +
      '</svg>';
  }
  function renderKpis(){
    var box = document.getElementById('kpiCards');
    if(!box) return;
    var role = ROLES[ROLE];
    // 负责人：统一用动态 role（随负责行业 / 赛道变化），不用静态 ROLES[1]
    if(ROLE === 1){
      role = 负责人Role();
    }
    var items = ALL_METRICS.map(function(m, idx){ return {m:m, idx:idx}; })
      .filter(function(o){ return MET_SHOW[o.m.id]; });
    box.innerHTML = items.map(function(o){
      var d = kpiOf(role, o.idx);
      return '<div class="kpi">' +
        '<div class="h"><span class="nm">' + d.k + '</span>' +
        '<span class="badge at">' + d.act + '</span></div>' +
        '<div class="pvrow"><span class="pv">' + d.done + '%</span>' +
        '<span class="dl' + (d.dlt.charAt(0) === '-' ? ' dn' : '') + '">区间' + d.dlt + '</span></div>' +
        spark(role, o.idx) +
        '<div class="pg"><i style="width:' + Math.min(d.done,100) + '%;background:linear-gradient(90deg,' + kpiBar(d.done) + ')"></i></div>' +
        '<div class="ct">当前' + d.cur + '/目标' + d.tgt + '</div>' +
        '<div class="ud">' + mtDot(MT_D1) + ' — ' + mtDot(MT_D2) + '</div></div>';
    }).join('');
  }
  
  function trackRole(){
    var rows = STAFF.filter(function(r){ return r.ind === LEADER_IND && r.track === LEADER_TRACK; });
    var cv = [], tv = [];
    for(var i = 0; i < 14; i++){
      var isR = ALL_METRICS[i].rate;
      var sc = 0, st = 0;
      rows.forEach(function(r){ sc += r.cur[i]; st += r.tgt[i]; });
      if(isR){ cv.push(rows.length ? Math.round(sc / rows.length) : 0); tv.push(rows.length ? Math.round(st / rows.length) : 0); }
      else { cv.push(sc); tv.push(st); }
    }
    return {key:'负责人', ttl:LEADER_IND + ' · ' + LEADER_TRACK + ' · 大促与基础供给',
      who:LEADER_IND + ' ' + LEADER_TRACK + ' 赛道 · ' + rows.length + ' 名专员',
      scope:LEADER_IND + '（' + LEADER_TRACK + ' 赛道）',
      hint:'当前为<b>' + LEADER_IND + ' · ' + LEADER_TRACK + ' 负责人</b>视角：指标栏为本行业<b>' + LEADER_TRACK + ' 赛道</b>口径，专员明细进度仅显示该赛道专员。',
      cv:cv, tv:tv};
  }
  
  function indData(){
    for(var i = 0; i < IND.length; i++){ if(IND[i].n === LEADER_IND) return IND[i]; }
    return IND[0];
  }
  
  function 负责人Role(){
    if(LEADER_TRACK !== 'all') return trackRole();
    var d = indData();
    var cnt = STAFF.filter(function(r){ return r.ind === LEADER_IND; }).length;
    return {key:'负责人', ttl:LEADER_IND + ' · 大促与基础供给',
      who:LEADER_IND + ' · ' + cnt + ' 名专员',
      scope:'本行业（' + LEADER_IND + '）全部商家',
      hint:'当前为<b>' + LEADER_IND + ' 行业 负责人</b>视角：指标栏为本行业口径，下方只能看到<b>本运营专员明细进度</b>，看不到其他行业与全服饰大盘。你还负责：' + LEADER_INDS.join(' / ') + '（在「负责行业」处逐个切换查看，不做跨行业汇总）。',
      cv:d.rc, tv:d.rt};
  }
  
  function setInd(v){
    if(LEADER_INDS.indexOf(v) < 0) v = LEADER_INDS[0];
    LEADER_IND = v;
    ST_TRK_OPEN = {};
    stPage = 1;
    setRole(1);
  }
  
  function renderIndSelect(){
    var sel = document.getElementById('idInd');
    if(!sel) return;
    sel.innerHTML = LEADER_INDS.map(function(n){
      return '<option value="' + n + '"' + (n === LEADER_IND ? ' selected' : '') + '>' + n + '</option>';
    }).join('');
  }
  
  function renderKpiPicker(){
    var chip = function(m){
      return '<span class="opt' + (MET_SHOW[m.id] ? ' on' : '') + '" onclick="metToggle(\'' + m.id + '\')">' + m.k + '</span>';
    };
    var html = '<div class="pk-opts">' + ALL_METRICS.map(chip).join('') + '</div>';
    document.getElementById('kpiPickBody').innerHTML = html;
    var n = visibleMets().length;
    document.getElementById('kpiPickHd').textContent = '选择展示指标（勾选后首屏卡片同步更新）· 已选 ' + n + ' / ' + ALL_METRICS.length;
  }
  function metToggle(id){
    MET_SHOW[id] = MET_SHOW[id] ? 0 : 1;
    renderKpiPicker(); renderKpis();
    if(document.getElementById('rtInd')) renderIndTable();
    if(document.getElementById('rtStaff')) renderStaffTable();
  }
  function metShowAll(on){
    ALL_METRICS.forEach(function(m){ MET_SHOW[m.id] = on ? 1 : 0; });
    renderKpiPicker(); renderKpis();
    if(document.getElementById('rtInd')) renderIndTable();
    if(document.getElementById('rtStaff')) renderStaffTable();
  }

  
  var MET = ALL_METRICS.map(function(m){ return m.k; });
  var IND = [
    {n:'女装',    staff:6, rc:[76,3800,60,2900,73,980,66,46,2250,820,41,380,52,170], rt:[80,4800,70,3800,80,2680,75,55,2680,1200,50,540,90,280]},
    {n:'男装',    staff:6, rc:[75,3600,60,2700,71,920,64,45,1042,740,40,360,48,160], rt:[80,4500,70,3500,80,1240,75,55,1240,1000,50,500,80,250]},
    {n:'女鞋',    staff:4, rc:[70,2200,54,1700,66,580,59,40,812,460,35,240,30,100],  rt:[80,3200,70,2500,80,980,75,55,980,700,50,380,60,180]},
    {n:'男鞋',    staff:3, rc:[68,1600,52,1200,64,360,57,38,496,310,33,180,22,72],   rt:[80,2400,70,1800,80,620,75,55,620,450,50,280,50,140]},
    {n:'箱包',    staff:4, rc:[71,2600,55,2000,68,680,61,41,943,550,36,280,35,120],  rt:[80,3400,70,2800,80,1150,75,55,1150,800,50,420,70,200]},
    {n:'内衣',    staff:5, rc:[74,3200,58,2500,70,860,63,44,1178,680,39,320,44,150], rt:[80,4200,70,3400,80,1420,75,55,1420,1000,50,480,80,240]},
    {n:'服配',    staff:4, rc:[69,2000,53,1500,65,520,58,39,853,420,34,220,28,90],   rt:[80,3000,70,2300,80,1080,75,55,1080,640,50,360,55,160]},
    {n:'手表眼镜',staff:3, rc:[66,1400,50,1050,62,300,55,36,538,280,31,160,18,58],  rt:[80,2100,70,1600,80,690,75,55,690,400,50,250,40,120]}
  ];
  var ALL = {n:'服饰整体', rc:[72,28000,56,21000,68,7200,61,42,8112,5800,38,2800,320,1200], rt:[80,35000,70,28000,80,9860,75,55,9860,8000,50,4000,500,2000]};

  var LEADER_INDS = ['女装','男装','女鞋'];  // 该 负责人 负责的行业集合（演示"一人多行业"，仅逐个切换查看，不做跨行业汇总）
  var LEADER_IND = '女装';                     // 当前正在查看的单个行业（始终属于 LEADER_INDS）
  var LEADER_TRACK = 'all';     // all=双赛道(本行业整体) / 原创设计 / 产业带
  var LETTER = 'ABCDEFGH';
  
  var TRACK_NAMES = ['原创设计','产业带'];

  // 由行业底表拆分出专员明细
  var STAFF = (function(){
    var out = [], jd = [3,-2,1,-3,2,-1], jr = [-9,7,-4,6,-3,3];
    IND.forEach(function(ind, i){
      var k = ind.staff, rows = [];
      for(var s = 0; s < k; s++){
        var cur = [], tgt = [];
        for(var mi = 0; mi < 14; mi++){
          var base = ind.rc[mi], target = ind.rt[mi];
          var isR = ALL_METRICS[mi].rate;
          var offset = jr[(s + mi) % jr.length];
          var v = isR ? base + offset : Math.round(base / k + (offset * base / 100));
          if(isR){ if(v > 99) v = 99; if(v < 20) v = 20; }
          else { if(v < 0) v = 0; }
          cur.push(v);
          tgt.push(isR ? target : Math.round(target / k));
        }
        rows.push({ind:ind.n, nick:'专员' + LETTER.charAt(s), no:String(900000 + i*100 + (s+1)*7), track: s < Math.ceil(k/2) ? '原创设计' : '产业带', cur:cur, tgt:tgt});
      }
      out = out.concat(rows);
    });
    return out;
  })();

  // 完成进度单元格：百分比 + 迷你条，配色沿用达标绿/接近黄/缺口红
  function prCell(cur, tgt){
    var p = tgt ? Math.round(cur / tgt * 100) : 0;
    var c = p >= 100 ? 'g' : (p >= 85 ? 'm' : 'r');
    var col = c === 'g' ? '#4fd08a' : (c === 'm' ? '#eda06c' : '#ff7a73');
    var w = p > 100 ? 100 : p;
    return '<td><span class="pr ' + c + '">' + p + '%</span>' +
      '<span class="mini"><i style="width:' + w + '%;background:' + col + '"></i></span></td>';
  }
  // 两级表头：第一行指标名跨 3 列，第二行 当前值 / 目标值 / 完成进度
  function rtHead(leads){
    var h1 = '<tr>', h2 = '<tr>', off = 0;
    leads.forEach(function(L){
      h1 += '<th class="lead fx" rowspan="2" style="left:' + off + 'px;min-width:' + L.w + 'px">' + L.t + '</th>';
      off += L.w;
    });
    ALL_METRICS.forEach(function(m){
      if(!MET_SHOW[m.id]) return;
      h1 += '<th class="grp" colspan="3">' + m.k + '</th>';
      h2 += '<th class="brd">当前值</th><th>目标值</th><th>完成进度</th>';
    });
    return '<thead>' + h1 + '</tr>' + h2 + '</tr></thead>';
  }
  function rtBody(row, leads, cls, attr){
    var off = 0, tr = '<tr' + (cls ? ' class="' + cls + '"' : '') + (attr ? ' ' + attr : '') + '>';
    leads.forEach(function(L, i){
      tr += '<td class="lead fx" style="left:' + off + 'px">' + row.leads[i] + '</td>';
      off += L.w;
    });
    ALL_METRICS.forEach(function(m, idx){
      if(!MET_SHOW[m.id]) return;
      var v = mtV(row.cur[idx]), t = row.tgt[idx];
      var suffix = m.rate ? '%' : '';
      tr += '<td class="cur brd">' + v + suffix + '</td>' +
            '<td class="goal">' + t + suffix + '</td>' +
            prCell(v, t);
    });
    return tr + '</tr>';
  }
  // 表单一：各子行业进度（仅超管）· 支持展开单行业看 原创设计 / 产业带两个赛道
  var IND_FIL = {n:''};
  var IND_OPEN = {};
  function indToggle(n){ IND_OPEN[n] = !IND_OPEN[n]; renderIndTable(); }
  function filInd(){ IND_FIL.n = (document.getElementById('indFilName')||{}).value||''; renderIndTable(); }
  function renderIndTable(){
    var leads = [{t:'行业名称', w:132}];
    var html = rtHead(leads) + '<tbody>';
    html += rtBody({leads:[ALL.n], cur:ALL.rc, tgt:ALL.rt}, leads, 'sum');
    var kw = IND_FIL.n.toLowerCase();
    IND.forEach(function(d){
      if(kw && d.n.toLowerCase().indexOf(kw) < 0) return;
      var open = !!IND_OPEN[d.n];
      html += rtBody({leads:['<span class="cvt">' + (open ? '▾' : '▸') + '</span>' + d.n], cur:d.rc, tgt:d.rt},
        leads, 'indp',
        'onclick="indToggle(\'' + d.n + '\')" title="点击' + (open ? '收起' : '展开') + ' ' + d.n + ' 的 原创设计 / 产业带 赛道指标"');
      if(open){
        TRACK_NAMES.forEach(function(t){
          var rows = STAFF.filter(function(r){ return r.ind === d.n && r.track === t; });
          if(!rows.length) return;
          var ag = aggRows(rows);
          html += rtBody({leads:['<span class="cvt"></span><span class="tsub">' + t + '</span>'], cur:ag.cur, tgt:ag.tgt}, leads, 'indc');
        });
      }
    });
    document.getElementById('rtInd').innerHTML = html + '</tbody>';
  }
  // 表单二：专员明细进度（超管看全部行业 / 负责人 只看本行业）
  var stPage = 1, stSize = 8;
  var STAFF_FIL = {ind:'', nick:'', no:''};
  function filStaff(){
    STAFF_FIL.ind = (document.getElementById('stFilInd')||{}).value||'';
    STAFF_FIL.nick = (document.getElementById('stFilNick')||{}).value||'';
    STAFF_FIL.no = (document.getElementById('stFilNo')||{}).value||'';
    stPage = 1; renderStaffTable();
  }
  function staffRows(){
    var rows = ROLE === 0 ? STAFF : STAFF.filter(function(r){ return r.ind === LEADER_IND; });
    // 负责人 选定单一赛道时进一步收敛
    if(ROLE === 1 && LEADER_TRACK !== 'all'){
      rows = rows.filter(function(r){ return r.track === LEADER_TRACK; });
    }
    return rows.filter(function(r){
      var i = STAFF_FIL.ind.toLowerCase(), n = STAFF_FIL.nick.toLowerCase(), o = STAFF_FIL.no;
      return (!i || r.ind.toLowerCase().indexOf(i) > -1)
        && (!n || r.nick.toLowerCase().indexOf(n) > -1)
        && (!o || String(r.no).indexOf(o) > -1);
    });
  }
  // 一组专员行聚合为一条口径：率类取均值，值类取求和
  function aggRows(list){
    var cv = [], tv = [];
    for(var i = 0; i < ALL_METRICS.length; i++){
      var isR = ALL_METRICS[i].rate, sc = 0, st = 0;
      list.forEach(function(r){ sc += r.cur[i]; st += r.tgt[i]; });
      if(isR){
        cv.push(list.length ? Math.round(sc / list.length) : 0);
        tv.push(list.length ? Math.round(st / list.length) : 0);
      } else { cv.push(sc); tv.push(st); }
    }
    return {cur:cv, tgt:tv};
  }
  // 赛道分组折叠状态（默认展开）
  var ST_TRK_OPEN = {};
  function stToggleTrack(t){
    ST_TRK_OPEN[t] = (ST_TRK_OPEN[t] === false);
    renderStaffTable();
  }
  function renderStaffTable(){
    var rows = staffRows();
    var leads = [{t:'所属行业', w:88}, {t:'赛道', w:72}, {t:'专员花名', w:80}, {t:'专员工号', w:78}];
    var grouped = (ROLE === 1 && LEADER_TRACK === 'all');
    var total = grouped ? 1 : (Math.ceil(rows.length / stSize) || 1);
    if(stPage > total) stPage = 1;
    var html = rtHead(leads) + '<tbody>';
    if(grouped){
      // 双赛道 负责人：按赛道输出「汇总行 + 可展开的专员明细」，本运营专员量级小，不再分页
      TRACK_NAMES.forEach(function(t){
        var tl = rows.filter(function(x){ return x.track === t; });
        if(!tl.length) return;
        var ag = aggRows(tl), open = ST_TRK_OPEN[t] !== false;
        html += rtBody({
          leads:[LEADER_IND, t, '<span class="cvt">' + (open ? '▾' : '▸') + '</span>赛道汇总', tl.length + ' 名'],
          cur:ag.cur, tgt:ag.tgt
        }, leads, 'trk', 'onclick="stToggleTrack(\'' + t + '\')" title="点击' + (open ? '收起' : '展开') + ' ' + t + ' 赛道专员明细"');
        if(open) tl.forEach(function(r){
          html += rtBody({leads:[r.ind, r.track, r.nick, r.no], cur:r.cur, tgt:r.tgt}, leads);
        });
      });
    } else {
      var page = rows.slice((stPage-1) * stSize, stPage * stSize);
      page.forEach(function(r){
        html += rtBody({leads:[r.ind, r.track, r.nick, r.no], cur:r.cur, tgt:r.tgt}, leads);
      });
    }
    document.getElementById('rtStaff').innerHTML = html + '</tbody>';
    var baseStaff = ROLE === 0 ? STAFF : STAFF.filter(function(r){ return r.ind === LEADER_IND; });
    if(ROLE === 1 && LEADER_TRACK !== 'all') baseStaff = baseStaff.filter(function(r){ return r.track === LEADER_TRACK; });
    var totalStaff = baseStaff.length;
    var trackTxt = (ROLE === 1 && LEADER_TRACK !== 'all') ? LEADER_TRACK + ' 赛道 · ' : '';
    var filTxt = rows.length === totalStaff ? '' : ' · 筛选后 ' + rows.length + ' 名';
    document.getElementById('stSub').textContent = (ROLE === 0
      ? '全部 8 个子行业 · 共 ' + totalStaff + ' 名专员'
      : LEADER_IND + ' · ' + trackTxt + '共 ' + totalStaff + ' 名专员') + filTxt;
    var pg = '<span class="mp-info">共 <b>' + rows.length + '</b> 名专员 · 第 ' + stPage + '/' + total + ' 页</span><span class="mp-sp"></span>';
    if(total > 1){
      pg += '<span class="mp-btn" onclick="stGo(' + (stPage-1) + ')">‹ 上一页</span>';
      for(var k=1; k<=total; k++){
        pg += '<span class="mp-num' + (k===stPage ? ' on' : '') + '" onclick="stGo(' + k + ')">' + k + '</span>';
      }
      pg += '<span class="mp-btn" onclick="stGo(' + (stPage+1) + ')">下一页 ›</span>';
    }
    document.getElementById('stPager').innerHTML = pg;
  }
  function stGo(p){
    var total = Math.ceil(staffRows().length / stSize) || 1;
    if(p < 1) p = 1; if(p > total) p = total;
    stPage = p;
    renderStaffTable();
  }
  function toggleRtable(id){
    var el = document.getElementById(id);
    if(!el) return;
    var was = el.classList.contains('collapsed');
    el.classList.toggle('collapsed');
    if(was){
      if(id === 'tblInd') renderIndTable();
      if(id === 'tblStaff'){ stPage = 1; renderStaffTable(); }
    }
  }

  
  function actGroups(){
    var order = [], map = {};
    ALL_METRICS.forEach(function(m, i){
      if(!map[m.act]){ map[m.act] = []; order.push(m.act); }
      map[m.act].push(i);
    });
    return order.map(function(n){ return {n:n, ms:map[n]}; });
  }
  function actGroup(n){
    var all = actGroups(), i;
    for(i = 0; i < all.length; i++){ if(all[i].n === n) return all[i]; }
    return null;
  }

  
  var RISK_RULES = [
    {id:'devi', n:'目标进度偏离异常'},
    {id:'mom',  n:'环比波动异常'},
    {id:'abs',  n:'低于绝对阈值'},
    {id:'pct',  n:'低于行业分位'}
  ];
  function alHash(s){
    var h = 0, i;
    for(i = 0; i < s.length; i++) h = (h * 131 + s.charCodeAt(i)) % 99991;
    return h;
  }
  
  function alRule(r, mi){
    var m = ALL_METRICS[mi], cur = r.cur[mi], tgt = r.tgt[mi] || 1;
    if(cur >= r.tgt[mi]) return null;
    var h = alHash(r.ind + r.nick + '#' + mi);
    var pace = Math.round(cur * 100 / tgt), plan = 62 + h % 9;
    var unit = m.rate ? '%' : m.unit, abs = Math.round(tgt * 0.7);
    if(plan - pace >= 12)                                     // 目标进度偏离异常
      return {rule:RISK_RULES[0], dt:'时间进度 ' + plan + '%，实际完成 ' + pace + '%，偏离 ' + (plan - pace) + 'pt'};
    if(h % 6 === 0)                                           // 环比波动异常
      return {rule:RISK_RULES[1], dt:'较上周环比 -' + (8 + h % 12) + '.' + (h % 10) + '%，连续 ' + (2 + h % 3) + ' 周下滑'};
    if(cur < abs && h % 3 !== 2)                              // 低于绝对阈值
      return {rule:RISK_RULES[2], dt:'低于绝对阈值 ' + abs + unit};
    if(h % 9 < 2)                                             // 低于行业分位
      return {rule:RISK_RULES[3], dt:'处于行业 P' + (8 + h % 20) + ' 分位，低于阈值 P30'};
    return null;
  }
  // 某活动下命中风险规则的专员清单：每位专员带异常指标、当前值/目标值、命中的风险规则
  function alBadStaff(g){
    var out = [];
    staffRows().forEach(function(r){
      var items = [];
      g.ms.forEach(function(mi){
        var x = alRule(r, mi);
        if(x) items.push({mi:mi, cur:r.cur[mi], tgt:r.tgt[mi], rule:x.rule, dt:x.dt});
      });
      if(items.length) out.push({ind:r.ind, track:r.track, nick:r.nick, no:r.no, items:items});
    });
    return out;
  }

  var ALERT_HTML0 = null;   // 缓存专员视角的原始商家层告警
  function renderAlerts(){
    var box = document.getElementById('alList'), cnt = document.getElementById('alCnt');
    if(!box) return;
    if(ALERT_HTML0 === null) ALERT_HTML0 = box.innerHTML;
    if(ROLE === 2){
      box.innerHTML = ALERT_HTML0;
      cnt.textContent = '共 71 条 · 按动作聚合';
      return;
    }
    var rows = staffRows(), scope = ROLE === 0 ? '服饰整体' : LEADER_IND + (LEADER_TRACK === 'all' ? '' : ' · ' + LEADER_TRACK);
    var html = '', allBad = {};
    var acts = actGroups().map(function(a){
      var bad = alBadStaff(a);
      bad.forEach(function(x){ allBad[x.nick + '@' + x.ind] = 1; });
      return {n:a.n, people:bad.length, ratio:rows.length ? bad.length / rows.length : 0};
    }).filter(function(a){ return a.people > 0; });

    html += '<div class="al sum"><span class="ic info"></span>' +
      '<span class="txt">' + scope + '异常汇总：<b>' + acts.length + '</b> 个活动存在专员不达标 · 涉及 <b>' +
      Object.keys(allBad).length + '</b> / ' + rows.length + ' 位专员</span></div>';
    acts.forEach(function(a){
      var ic = a.ratio >= 0.6 ? 'risk' : (a.ratio >= 0.3 ? 'warn' : 'info');
      html += '<div class="al clk" data-act="' + a.n + '" onclick="alDrill(\'' + a.n + '\')">' +
        '<span class="ic ' + ic + '">•</span>' +
        '<span class="txt"><span class="act">' + a.n + '</span>：<b>' + a.people + '</b> 位专员不达标</span>' +
        '<span class="go">查看不达标清单 ›</span>' +
        '<span class="num' + (ic === 'risk' ? ' hot' : '') + '">' + a.people + '</span></div>';
    });
    box.innerHTML = html;
    cnt.textContent = scope + ' · ' + acts.length + ' 个活动异常 · 按活动聚合';
  }

  
  var AL_DRILL = null;   // {act, list}
  var AL_VIEW = [];      // 经筛选后的清单（去提醒按此范围下发）
  var AL_PICK = {};      // 清单里被勾选的专员
  var AL_FIL = {nick:'', no:'', met:'', rule:''};
  function alDrill(name){
    if(typeof XL_BUSY !== 'undefined' && XL_BUSY) return;
    var g = actGroup(name); if(!g) return;
    var list = alBadStaff(g);
    if(!list.length){ xlToast('该活动当前没有不达标的专员'); return; }
    AL_DRILL = {act:name, list:list};
    xlOpen();
    xlPushUser('「' + name + '」这个活动有哪些专员不达标？不达标原因是什么？');
    alFlow();
  }
  function alFlow(){
    var name = AL_DRILL.act, list = AL_DRILL.list;
    XL_BUSY = true;
    var w = xlPushAI();
    var box = xlStepsBox(w, [
      '正在按「' + name + '」的指标口径检索' + (ROLE === 0 ? '服饰全量' : LEADER_IND) + '专员的目标完成情况……',
      '已定位 ' + list.length + ' 位专员存在不达标指标，正在调用策略中心的异常规则做原因归因……',
      '归因完成，已生成不达标专员清单：指标当前值 / 目标值，以及命中的风险规则。'
    ]);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 620);
    setTimeout(function(){ xlStep(box, 1, 'done'); xlStep(box, 2, 'run'); }, 1250);
    setTimeout(function(){
      xlStep(box, 2, 'done');
      alStaffCard(w);
      xlText(w, '「' + name + '」共 <b>' + list.length + '</b> 位专员不达标，不达标原因来自<b>策略中心 · 异常规则</b>的判定结果。可按花名、工号、不达标指标、风险规则筛选；勾选后点「去提醒」，会在对应专员<b>今日待办</b>里该活动的任务上打上「' + ASSIGNER + '提醒」标签。');
      XL_BUSY = false;
    }, 1900);
  }
  // 清单里出现过的不达标指标 / 风险规则，供下拉筛选
  function alMetOpts(){
    var seen = {}, out = [];
    AL_DRILL.list.forEach(function(x){ x.items.forEach(function(it){ seen[it.mi] = 1; }); });
    ALL_METRICS.forEach(function(m, i){ if(seen[i]) out.push({v:String(i), t:m.k}); });
    return out;
  }
  function alRuleOpts(){
    var seen = {}, out = [];
    AL_DRILL.list.forEach(function(x){ x.items.forEach(function(it){ seen[it.rule.id] = 1; }); });
    RISK_RULES.forEach(function(r){ if(seen[r.id]) out.push({v:r.id, t:r.n}); });
    return out;
  }
  function alOptHtml(list){
    return '<option value="">全部</option>' + list.map(function(o){
      return '<option value="' + o.v + '">' + o.t + '</option>';
    }).join('');
  }
  function alStaffCard(w){
    AL_FIL = {nick:'', no:'', met:'', rule:''};
    var d = document.createElement('div'); d.className = 'xl-card'; d.id = 'alCard';
    d.innerHTML = '<div class="xl-card-h">' + AL_DRILL.act + ' · 不达标专员清单（<b id="alCardN">' + AL_DRILL.list.length + '</b> 位）' +
      '<span class="sp"></span><span class="lk" onclick="xlToast(\'已导出不达标专员清单.xlsx\')">下载表格</span>' +
      '<span class="lk" onclick="xlFold(\'alCard\', this)">收起明细 ^</span></div>' +
      '<div class="xl-card-b">' +
        '<div class="xl-fil al-fil">' +
          '<span class="fw">专员花名<input id="alFNick" placeholder="请输入" oninput="alFilter()"></span>' +
          '<span class="fw">专员工号<input id="alFNo" placeholder="请输入" oninput="alFilter()"></span>' +
          '<span class="fw">不达标指标<select id="alFMet" onchange="alFilter()">' + alOptHtml(alMetOpts()) + '</select></span>' +
          '<span class="fw">命中风险规则<select id="alFRule" onchange="alFilter()">' + alOptHtml(alRuleOpts()) + '</select></span>' +
          '<span class="rs" onclick="alResetFil()">重置筛选</span>' +
        '</div>' +
        '<div class="xl-tblwrap"><table class="xl-tbl"><thead><tr><th style="width:34px"></th>' +
        '<th>专员花名</th><th>所属行业 · 赛道</th><th>不达标指标</th><th>当前值 / 目标值</th>' +
        '<th>命中风险规则</th></tr></thead><tbody id="alTb"></tbody></table></div>' +
        '<div class="xl-foot"><span class="btn-primary" onclick="alRemind()">去提醒（<span id="alRmN">0</span> 位专员）</span>' +
        '<span class="note">提醒后该条待办进入对应专员的今日待办，标签为「' + ASSIGNER + '提醒」</span></div>' +
      '</div>';
    w.appendChild(d);
    alRenderList();
    xlScroll();
  }
  function alFilter(){
    AL_FIL = {
      nick:(document.getElementById('alFNick') || {}).value || '',
      no:(document.getElementById('alFNo') || {}).value || '',
      met:(document.getElementById('alFMet') || {}).value || '',
      rule:(document.getElementById('alFRule') || {}).value || ''
    };
    alRenderList();
  }
  function alResetFil(){
    ['alFNick','alFNo'].forEach(function(id){ var e = document.getElementById(id); if(e) e.value = ''; });
    ['alFMet','alFRule'].forEach(function(id){ var e = document.getElementById(id); if(e) e.value = ''; });
    alFilter();
  }
  function alRenderList(){
    var tb = document.getElementById('alTb'); if(!tb || !AL_DRILL) return;
    var nick = AL_FIL.nick.toLowerCase(), no = AL_FIL.no;
    // 指标 / 规则筛选同时收敛到「命中行」，只保留符合条件的不达标指标
    AL_VIEW = [];
    AL_DRILL.list.forEach(function(x){
      if(nick && x.nick.toLowerCase().indexOf(nick) < 0) return;
      if(no && String(x.no).indexOf(no) < 0) return;
      var items = x.items.filter(function(it){
        if(AL_FIL.met !== '' && String(it.mi) !== AL_FIL.met) return false;
        if(AL_FIL.rule !== '' && it.rule.id !== AL_FIL.rule) return false;
        return true;
      });
      if(items.length) AL_VIEW.push({ind:x.ind, track:x.track, nick:x.nick, no:x.no, items:items});
    });
    AL_PICK = {};
    AL_VIEW.forEach(function(x){ AL_PICK[x.ind + '/' + x.nick] = 1; });
    tb.innerHTML = AL_VIEW.length ? AL_VIEW.map(function(x){
      var key = x.ind + '/' + x.nick;
      var cMet = x.items.map(function(it){
        return '<div class="al-ln">' + ALL_METRICS[it.mi].k + '</div>';
      }).join('');
      var cVal = x.items.map(function(it){
        var u = ALL_METRICS[it.mi].rate ? '%' : ALL_METRICS[it.mi].unit;
        return '<div class="al-ln"><b class="bad">' + it.cur + u + '</b> / ' + it.tgt + u + '</div>';
      }).join('');
      var cRule = x.items.map(function(it){
        return '<div class="al-ln"><span class="al-rl">' + it.rule.n + '</span><span class="al-dt">' + it.dt + '</span></div>';
      }).join('');
      return '<tr><td><span class="xl-ck on" onclick="alPick(\'' + key + '\',this)"></span></td>' +
        '<td class="nm">' + x.nick + ' · ' + x.no + '</td>' +
        '<td>' + x.ind + (x.track ? ' · ' + x.track : '') + '</td>' +
        '<td>' + cMet + '</td><td>' + cVal + '</td><td>' + cRule + '</td></tr>';
    }).join('') : '<tr><td colspan="6" class="al-none">当前筛选条件下没有命中的专员，试试放宽条件或重置筛选</td></tr>';
    var n = document.getElementById('alCardN');
    if(n) n.textContent = AL_VIEW.length === AL_DRILL.list.length
      ? AL_DRILL.list.length : (AL_VIEW.length + ' / ' + AL_DRILL.list.length);
    alPickSum();
  }
  function alPickSum(){
    var n = document.getElementById('alRmN');
    if(n) n.textContent = Object.keys(AL_PICK).length;
  }
  function alPick(key, el){
    el.classList.toggle('on');
    if(AL_PICK[key]) delete AL_PICK[key]; else AL_PICK[key] = 1;
    alPickSum();
  }
  function alRemind(){
    if(!AL_DRILL) return;
    var list = AL_VIEW.filter(function(x){ return AL_PICK[x.ind + '/' + x.nick]; });
    if(!list.length){ xlToast('请先勾选要提醒的专员'); return; }
    
    var act = AL_DRILL.act, hit = -1, i, mets = [];
    for(i = 0; i < TODOS[2].length; i++){
      if(TODOS[2][i].act === act){ hit = i; break; }
    }
    if(hit < 0){
      actGroup(act).ms.forEach(function(mi){ mets.push(ALL_METRICS[mi].k); });
      TODOS[2].unshift({tx:'复核「' + act + '」不达标指标：' + mets.join('、') + '，逐个过商家进度',
        src:'auto', act:act, done:false});
      hit = 0;
    }
    TODOS[2][hit].warn = ASSIGNER;
    TODOS[2][hit].done = false;
    renderTodos();
    xlText(xlPushAI(), '已提醒 <b>' + list.length + '</b> 位专员关注「' + act + '」的不达标指标：' +
      list.map(function(x){ return x.ind + ' ' + x.nick; }).join('、') +
      '。这些异常专员在自己的工作台本来就能看到，因此不额外新增待办，只在他们「今日待办」里对应的<b>' +
      TODOS[2][hit].tx + '</b>上打了<b>' + ASSIGNER + '提醒</b>标签，已完成的会重新置为待跟进。切换到<b>运营专员</b>视角即可看到标签。');
    xlToast('已提醒 ' + list.length + ' 位专员');
  }

  
  var ASSIGNER = '林舟';                              // mock：下发任务的人
  var ME = {ind:'女装', nick:'专员A'};                 // mock：当前登录的运营专员
  // 来源仍是三种；上级从告警清单点「去提醒」时不新增待办，只在专员已有待办上追加 warn 字段（预警人花名）
  var SRC = {auto:'告警自动生成', asg:ASSIGNER + '指派', self:'自己添加'};
  var TODOS = [
    [ // 超级管理员
      {tx:'定各行业前N攻坚目标，服配、手表眼镜重点跟进', src:'self', done:false},
      {tx:'服饰整体店铺红包完成率仅 79%，拉齐各行业口径', src:'auto', done:false},
      {tx:'对齐店铺红包、消费券的资源位分配方案', src:'self', done:true}
    ],
    [ // 行业 负责人
      {tx:'汇总女装前N报名缺口，输出攻坚商家清单', src:'asg', done:false},
      {tx:'女装 6 位专员店铺红包均未达标，逐个过进度', src:'auto', done:false},
      {tx:'准备周会材料：女装大促供给进展', src:'self', done:true}
    ],
    [ // 运营专员：act = 该待办对应的活动，用于和上级告警清单里的活动对齐
      {tx:'催报名：晴川鞋履研究所 等 22 家大促未报名', src:'auto', act:'好物节', done:false},
      {tx:'推动前N报名 · 高潜 18 家', src:'auto', act:'前N', done:false},
      {tx:'指导 栖木鞋履工坊 设置消费券 + 店铺红包', src:'auto', act:'消费券', done:true},
      {tx:'提醒 14 家补齐店铺红包', src:'asg', act:'店铺红包', done:false},
      {tx:'复核多素材不达标 11 家', src:'self', act:'多素材', done:true},
      {tx:'跟进竞价爆款缺失 7 家', src:'auto', done:false}
    ]
  ];
  function renderTodos(){
    var list = TODOS[ROLE], box = document.getElementById('tdList');
    box.innerHTML = list.map(function(t, i){
      var cls = t.src === 'asg' ? ' asg' : (t.src === 'self' ? ' self' : '');
      return '<div class="ti' + (t.done ? ' done' : '') + '" onclick="toggleTodo(' + i + ')">' +
        '<span class="ck' + (t.done ? ' done' : '') + '"></span>' +
        '<span class="tx">' + t.tx + '</span>' +
        (t.warn ? '<span class="tg warn">' + t.warn + '提醒</span>' : '') +
        '<span class="tg' + cls + '">' + SRC[t.src] + '</span></div>';
    }).join('');
    var d = list.filter(function(t){ return t.done; }).length;
    document.getElementById('tdCnt').textContent = '共 ' + list.length + ' 条 · ' + d + '/' + list.length + ' 已完成';
  }
  function toggleTodo(i){
    TODOS[ROLE][i].done = !TODOS[ROLE][i].done;
    renderTodos();
  }

  // ===== 新建待办弹层 =====
  var TK = {mode:'', inds:{}, staff:{}};
  function tkModeList(){
    if(ROLE === 0) return [
      {k:'all',   t:'整个服饰（全部行业 + 全部专员）'},
      {k:'ind',   t:'指定行业（可多选）'},
      {k:'staff', t:'指定专员（可多选）'},
      {k:'self',  t:'仅自己'}
    ];
    if(ROLE === 1){
      var trkLbl = LEADER_TRACK === 'all' ? '' : ' · ' + LEADER_TRACK + ' 赛道';
      return [
        {k:'ind',   t:'本行业全员（' + LEADER_IND + trkLbl + '）'},
        {k:'staff', t:'指定专员（本行业' + trkLbl + ' · 可多选）'},
        {k:'self',  t:'仅自己'}
      ];
    }
    return [{k:'self', t:'仅自己（专员只能给自己加待办）'}];
  }
  function openTask(){
    TK = {mode:'', inds:{}, staff:{}};
    document.getElementById('tkName').value = '';
    document.getElementById('tkRole').textContent = ['超级管理员','行业 负责人','运营专员'][ROLE];
    document.getElementById('tkModes').innerHTML = tkModeList().map(function(m){
      return '<span class="tk-mode" data-k="' + m.k + '" onclick="tkMode(\'' + m.k + '\')">' + m.t + '</span>';
    }).join('');
    document.getElementById('tkNote').innerHTML = ROLE === 0
      ? '超级管理员可向<b>行业 负责人</b>与<b>运营专员</b>下发待办；下发后对方今日待办里会出现该任务，来源标记为「' + ASSIGNER + '指派」。'
      : (ROLE === 1
        ? '行业 负责人 只能向<b>本行业（' + LEADER_IND + '）专员</b>下发待办，来源标记为「' + ASSIGNER + '指派」；看不到也管不到其他行业。'
        : '运营专员只能<b>给自己</b>添加待办，来源标记为「自己添加」；上级下发的任务会自动出现在列表里。');
    tkMode(ROLE === 2 ? 'self' : (ROLE === 1 ? 'ind' : 'all'));
    document.getElementById('tkMask').classList.add('open');
  }
  function tkClose(){ document.getElementById('tkMask').classList.remove('open'); }
  function tkMode(k){
    TK.mode = k; TK.inds = {}; TK.staff = {};
    document.querySelectorAll('#tkModes .tk-mode').forEach(function(el){
      el.classList.toggle('on', el.getAttribute('data-k') === k);
    });
    var pick = document.getElementById('tkPick'), html = '';
    if(k === 'ind' && ROLE === 0){
      html = IND.map(function(d){
        return '<span class="tk-chip" onclick="tkPickInd(this,\'' + d.n + '\')">' + d.n + '</span>';
      }).join('');
    } else if(k === 'staff'){
      var rows = ROLE === 0 ? STAFF : STAFF.filter(function(r){ return r.ind === LEADER_IND; });
      if(ROLE === 1 && LEADER_TRACK !== 'all') rows = rows.filter(function(r){ return r.track === LEADER_TRACK; });
      var last = '';
      rows.forEach(function(r){
        if(r.ind !== last){ html += '<div class="tk-gh">' + r.ind + '</div>'; last = r.ind; }
        html += '<span class="tk-chip" onclick="tkPickStaff(this,\'' + r.ind + '\',\'' + r.nick + '\')">' + r.nick + ' · ' + r.no + '</span>';
      });
    }
    pick.innerHTML = html;
    pick.classList.toggle('on', !!html);
    tkSum();
  }
  function tkPickInd(el, n){ el.classList.toggle('on'); if(TK.inds[n]) delete TK.inds[n]; else TK.inds[n] = 1; tkSum(); }
  function tkPickStaff(el, ind, nick){
    el.classList.toggle('on');
    var key = ind + '/' + nick;
    if(TK.staff[key]) delete TK.staff[key]; else TK.staff[key] = 1;
    tkSum();
  }
  function tkSum(){
    var e = document.getElementById('tkSum'), n;
    if(TK.mode === 'all') e.innerHTML = '下发范围：<b>整个服饰</b>（8 个行业 · ' + STAFF.length + ' 位专员）';
    else if(TK.mode === 'self') e.innerHTML = '下发范围：<b>仅自己</b>';
    else if(TK.mode === 'ind' && ROLE === 1) e.innerHTML = '下发范围：<b>' + LEADER_IND + '</b> 全员专员';
    else if(TK.mode === 'ind'){ n = Object.keys(TK.inds).length; e.innerHTML = n ? '已选 <b>' + n + '</b> 个行业' : '未选择行业'; }
    else { n = Object.keys(TK.staff).length; e.innerHTML = n ? '已选 <b>' + n + '</b> 位专员' : '未选择专员'; }
  }
  function tkConfirm(){
    var nm = document.getElementById('tkName').value.trim();
    if(!nm){ alert('请先填写任务名称'); return; }
    var toLeader = false, toMe = false, toSelf = false, desc = '';
    if(TK.mode === 'self'){ toSelf = true; desc = '自己'; }
    else if(TK.mode === 'all'){ toLeader = true; toMe = true; desc = '整个服饰（8 个行业 · ' + STAFF.length + ' 位专员）'; }
    else if(TK.mode === 'ind' && ROLE === 1){ toMe = true; desc = LEADER_IND + ' 全员专员（' + STAFF.filter(function(r){ return r.ind === LEADER_IND; }).length + ' 位）'; }
    else if(TK.mode === 'ind'){
      var ins = Object.keys(TK.inds);
      if(!ins.length){ alert('请至少选择一个行业'); return; }
      toLeader = ins.indexOf(LEADER_IND) >= 0;      // 该行业的 负责人 收到
      toMe = ins.indexOf(ME.ind) >= 0;              // 该行业下的专员收到
      desc = ins.join('、') + '（共 ' + ins.length + ' 个行业）';
    } else {
      var sts = Object.keys(TK.staff);
      if(!sts.length){ alert('请至少选择一位专员'); return; }
      toMe = sts.indexOf(ME.ind + '/' + ME.nick) >= 0;
      desc = sts.map(function(s){ return s.replace('/', ' '); }).join('、');
    }
    if(toSelf) TODOS[ROLE].unshift({tx:nm, src:'self', done:false});
    if(toLeader) TODOS[1].unshift({tx:nm, src:'asg', done:false});
    if(toMe) TODOS[2].unshift({tx:nm, src:'asg', done:false});
    renderTodos();
    tkClose();
    alert(toSelf
      ? '已添加到我的今日待办：' + nm
      : '已下发「' + nm + '」\n下发对象：' + desc + '\n对方今日待办中来源显示为「' + ASSIGNER + '指派」，切换身份即可查看');
  }

  // ===== ① 常用后台汇总：数据模型 =====
  // sc 生效范围：ALL=服饰整体 / IND=单个行业（inds 可多选）/ SELF=仅自己
  // ow 创建人身份：admin | 负责人 | staff —— 只有创建人本人能改、能删；其他人只能调顺序
  var BKS = [
    {id:'b1', ic:'', nm:'商家档案后台', ds:'查看商家基础信息 · 分层 · 联系人', url:'demo://workspace',  bd:'',        sc:'ALL',  inds:[],                 ow:'admin'},
    {id:'b2', ic:'', nm:'认领商家后台', ds:'认领 / 交接归属 · 维护我的商家池',  url:'demo://workspace',           bd:'待认领 6', sc:'ALL',  inds:[],                 ow:'admin'},
    {id:'b3', ic:'', nm:'营销工具后台', ds:'消费券 · 店铺红包 · 聚单配置核查',  url:'demo://workspace',       bd:'',        sc:'ALL',  inds:[],                 ow:'admin'},
    {id:'b4', ic:'', nm:'大促报名后台', ds:'大促 / 前N 报名进度与审核',         url:'demo://workspace',    bd:'进行中',   sc:'ALL',  inds:[],                 ow:'admin'},
    {id:'b5', ic:'', nm:'素材审核后台', ds:'多素材覆盖 · 橱窗 SAB · 合规校验',  url:'demo://workspace',  bd:'',        sc:'IND',  inds:[LEADER_IND],       ow:'负责人'},
    {id:'b6', ic:'', nm:'商家分层后台', ds:'T 层级 · 供给分类 · 策略打标',      url:'demo://workspace',            bd:'',        sc:'IND',  inds:[LEADER_IND,'女装'], ow:'admin'},
    {id:'b7', ic:'', nm:'大盘监控后台', ds:'服饰全量水位 · 异常巡检',           url:'demo://workspace',            bd:'',        sc:'SELF', inds:[],                 ow:'admin'},
    {id:'b8', ic:'', nm:'价格力审核后台', ds:'价格复核与价格力管理',              url:'demo://workspace',    bd:'',        sc:'SELF', inds:[],                 ow:'staff'}
  ];
  // 展示优先级：每个身份一份，互不影响（调整只对自己生效）
  var FBS = [
    {id:'f1', ic:'', nm:'商家过程指标日报', ds:'日更', url:'demo://workspace', bd:'', sc:'ALL',  inds:[],                  ow:'admin'},
    {id:'f2', ic:'', nm:'大促作战看板',     ds:'实时', url:'demo://workspace',     bd:'', sc:'ALL',  inds:[],                  ow:'admin'},
    {id:'f3', ic:'', nm:'营销工具渗透率报表', ds:'日更', url:'demo://workspace', bd:'', sc:'ALL', inds:[],               ow:'admin'},
    {id:'f4', ic:'', nm:'前 N 报名进度报表', ds:'实时', url:'demo://workspace',   bd:'', sc:'IND',  inds:[LEADER_IND],        ow:'负责人'},
    {id:'f5', ic:'', nm:'类目成交趋势',     ds:'周更', url:'demo://workspace',    bd:'', sc:'IND',  inds:[LEADER_IND,'女装'], ow:'admin'},
    {id:'f6', ic:'', nm:'商家健康度监控',   ds:'日更', url:'demo://workspace',        bd:'', sc:'SELF', inds:[],                  ow:'admin'},
    {id:'f7', ic:'', nm:'我的商家跟进表',   ds:'日更', url:'demo://workspace',   bd:'', sc:'SELF', inds:[],                  ow:'staff'}
  ];
  // ③ 入口横向找人：联系人同样按范围下发，字段是 身份 / 花名 / 工号 / 工作范围
  var PPS = [
    {id:'p1', ic:'促', rl:'大促 PM',    nm:'临溪', no:'SC08241', ds:'节奏 / 玩法 / 资源位对接',   sc:'ALL',  inds:[],                  ow:'admin'},
    {id:'p2', ic:'品', rl:'产品对接人', nm:'青禾', no:'SC08372', ds:'工作台 / 工具需求 · Bug 反馈', sc:'ALL',  inds:[],                  ow:'admin'},
    {id:'p3', ic:'规', rl:'规则对接人', nm:'明谨', no:'SC08505', ds:'招商门槛 / 处罚 / 规则解读',   sc:'ALL',  inds:[],                  ow:'admin'},
    {id:'p4', ic:'类', rl:'类目专员',   nm:'白露', no:'SC08638', ds:'女鞋类目策略 · 结构调优',      sc:'IND',  inds:[LEADER_IND,'女鞋'], ow:'admin'},
    {id:'p5', ic:'招', rl:'招商对接',   nm:'南乔', no:'SC08769', ds:'新商引入 · 站外拉新审核',      sc:'IND',  inds:[LEADER_IND],        ow:'负责人'},
    {id:'p6', ic:'客', rl:'客服对接',   nm:'如许', no:'SC08109', ds:'商家工单 · 体验投诉升级',      sc:'SELF', inds:[],                  ow:'staff'}
  ];
  // 三块入口共用同一套「可配置 + 按范围下发」的模型与管理弹层，只是字段规格与渲染样式不同
  var SEC = {
    bk:{items:BKS, ord:{admin:[],负责人:[],staff:[]}, seq:8, grid:'bkGrid', sub:'bkSub',
        ttl:'常用后台', unit:'后台板块', tico:'', defIc:'', entry:'管理常用 ', dupK:'nm',
        subTxt:'高频进入的业务后台 · 一键直达',
        flds:[
          {k:'nm',  lb:'后台板块名称', req:1, max:12, ph:'不超过 12 个字，例如：商家资质核验后台'},
          {k:'url', lb:'后台板块链接', req:1, url:1, ph:'以 http:// 或 https:// 开头'},
          {k:'ds',  lb:'一句话说明（选填）', max:24, ph:'卡片副标题，例如：资质材料审核 · 到期提醒', def:'自定义后台入口'}
        ]},
    fb:{items:FBS, ord:{admin:[],负责人:[],staff:[]}, seq:7, grid:'fbGrid', sub:'fbSub',
        ttl:'常用 经营报表', unit:'经营报表 报表', tico:'', defIc:'', entry:'管理常用 ', dupK:'nm',
        subTxt:'收藏的报表链接 · 每日看数',
        flds:[
          {k:'nm',  lb:'经营报表 报表名称', req:1, max:12, ph:'不超过 12 个字，例如：商家过程指标日报'},
          {k:'url', lb:'经营报表 报表链接', req:1, url:1, ph:'以 http:// 或 https:// 开头'},
          {k:'ds',  lb:'更新频率标签（选填）', max:6, ph:'例如：日更 / 实时 / 周更'}
        ]},
    pp:{items:PPS, ord:{admin:[],负责人:[],staff:[]}, seq:6, grid:'ppGrid', sub:'ppSub',
        ttl:'通讯录', unit:'联系人', tico:'', defIc:'', entry:'通讯录 ', dupK:'no',
        subTxt:'跨域协同联系人 · 快速对接',
        flds:[
          {k:'rl', lb:'联系人身份', req:1, max:10, ph:'例如：大促 PM / 规则对接人'},
          {k:'nm', lb:'联系人花名', req:1, max:8,  ph:'例如：临溪'},
          {k:'no', lb:'联系人工号', req:1, max:12, ph:'例如：SC08788'},
          {k:'ds', lb:'工作范围（选填）', max:24, ph:'例如：节奏 / 玩法 / 资源位对接'}
        ]}
  };
  var CUR = 'bk';   // 管理弹层当前操作的板块

  function bkKey(){ return ['admin','负责人','staff'][ROLE]; }
  function bkMyInd(){ return ROLE === 0 ? '' : (ROLE === 1 ? LEADER_IND : ME.ind); }
  function bkFind(sec, id){
    var arr = SEC[sec].items;
    for(var i=0;i<arr.length;i++){ if(arr[i].id === id) return arr[i]; }
    return null;
  }
  function bkOwnerTxt(o){ return o === 'admin' ? '超级管理员' : (o === '负责人' ? LEADER_IND + ' 负责人' : ME.ind + ' ' + ME.nick); }
  function bkScopeTxt(b){ return b.sc === 'ALL' ? '服饰整体' : (b.sc === 'IND' ? b.inds.join('、') : '仅自己'); }
  function bkScopeCls(b){ return b.sc === 'ALL' ? 'all' : (b.sc === 'IND' ? 'ind' : 'self'); }

  // 可见性：服饰整体人人可见；单行业对该运营专员可见；仅自己只对创建人可见
  function bkVisible(b){
    if(b.ow === bkKey()) return true;
    if(b.sc === 'ALL') return true;
    if(b.sc === 'IND'){ var mi = bkMyInd(); return !!mi && b.inds.indexOf(mi) >= 0; }
    return false;
  }
  // 当前身份主页上的条目，按本人的优先级排序，未排过的按添加先后排在后面
  function bkList(sec){
    var arr = SEC[sec].items, ord = SEC[sec].ord[bkKey()] || [];
    return arr.filter(bkVisible).sort(function(a, b){
      var ia = ord.indexOf(a.id), ib = ord.indexOf(b.id);
      if(ia < 0 && ib < 0) return arr.indexOf(a) - arr.indexOf(b);
      if(ia < 0) return 1;
      if(ib < 0) return -1;
      return ia - ib;
    });
  }
  function bkAffect(sc, inds){
    if(sc === 'ALL') return '服饰全部运营专员（' + STAFF.length + ' 位）';
    if(sc === 'IND'){
      var ns = Object.keys(inds), n = 0;
      IND.forEach(function(d){ if(ns.indexOf(d.n) >= 0) n += d.staff; });
      return ns.length ? ns.join('、') + ' 全部专员（' + n + ' 位）' : '未选择行业';
    }
    return '仅自己';
  }
  // 卡片 / 行上的创建人短标识
  function bkOwnerShort(o){
    return o === bkKey() ? '我添加的'
      : (o === 'admin' ? '超级管理员添加' : (o === '负责人' ? '行业 负责人 添加' : '运营专员添加'));
  }

  function renderSec(sec){
    var S = SEC[sec], list = bkList(sec), g = document.getElementById(S.grid);
    if(!g) return;
    g.innerHTML = list.length ? list.map(function(b){
      if(sec === 'bk'){
        return '<div class="appcard" onclick="bkGo(\'bk\',\'' + b.id + '\')">' +
          '<div class="ac-go">›</div>' +
          '<div class="ac-n">' + b.nm + (b.bd ? ' <span class="ac-badge">' + b.bd + '</span>' : '') + '</div>' +
          '<div class="ac-d">' + b.ds + '</div>' +
          '<div class="ac-sc"><i class="' + bkScopeCls(b) + '">' + bkScopeTxt(b) + '</i>' +
            '<span>· ' + bkOwnerShort(b.ow) + '</span></div>' +
        '</div>';
      }
      if(sec === 'fb'){
        return '<div class="rptrow" onclick="bkGo(\'fb\',\'' + b.id + '\')" title="' + bkOwnerShort(b.ow) + '">' +
          '<span class="rp-ic">' + b.ic + '</span>' +
          '<span class="rp-n">' + b.nm + '</span>' +
          (b.ds ? '<span class="rp-tag">' + b.ds + '</span>' : '') +
          '<span class="rp-sc ' + bkScopeCls(b) + '">' + bkScopeTxt(b) + '</span>' +
          '<span class="rp-go">›</span>' +
        '</div>';
      }
      return '<div class="pcard">' +
        '<div class="pav">' + (b.ic || b.nm.charAt(0)) + '</div>' +
        '<div class="pinfo">' +
          '<span class="prole">' + b.rl + '</span>' +
          '<div class="pname">' + b.nm + ' <span style="font-weight:400;color:#eb965e;font-size:9.5px">' + b.no + '</span></div>' +
          (b.ds ? '<div class="pmeta">' + b.ds + '</div>' : '') +
          '<div class="psc"><i class="' + bkScopeCls(b) + '">' + bkScopeTxt(b) + '</i><span>· ' + bkOwnerShort(b.ow) + '</span></div>' +
        '</div>' +
        '<div class="pacts"><span class="pbtn dt" onclick="bkGo(\'pp\',\'' + b.id + '\')">协作消息</span></div>' +
      '</div>';
    }).join('') : '<div class="bkempty">还没有' + S.unit + '，点右上角「' + S.entry + '」添加</div>';
    var sub = document.getElementById(S.sub);
    if(sub) sub.textContent = '';
  }
  function renderEntries(){ renderSec('bk'); renderSec('fb'); renderSec('pp'); }
  function bkGo(sec, id){
    var b = bkFind(sec, id);
    if(!b) return;
    if(sec === 'pp'){ dtOpen(b); return; }
    alert('› 打开「' + b.nm + '」\n' + b.url);
  }
  var DT_WHO = null;
  function dtOpen(b){
    DT_WHO = b;
    document.getElementById('dtWho').textContent = b.rl + ' · ' + b.nm + '（工号 ' + b.no + '）' + (b.ds ? ' · ' + b.ds : '');
    document.getElementById('dtSum').textContent = '';
    document.getElementById('dtMask').classList.add('open');
  }
  function dtClose(){ document.getElementById('dtMask').classList.remove('open'); DT_WHO = null; }
  function dtGo(){
    var nm = DT_WHO ? DT_WHO.nm : '';
    document.getElementById('dtSum').innerHTML = '正在打开协作消息会话 · <b>' + nm + '</b>';
    setTimeout(dtClose, 900);
  }

  // ===== 管理常用后台弹层 =====
  var BK_EDIT = null;                 // 正在修改的板块 id，null = 新增
  var BK_FORM = {sc:'', inds:{}};

  function bkOpen(sec){
    CUR = sec || 'bk';
    document.getElementById('bkRole').textContent = ['超级管理员','行业 负责人','运营专员'][ROLE];
    document.getElementById('bkLbList').innerHTML = '我的主页' + SEC[CUR].unit + ' <b id="bkCnt"></b> · 按住 拖动调整展示优先级';
    bkBackToList();
    document.getElementById('bkMask').classList.add('open');
  }
  // 表单字段按板块的字段规格生成：后台 / 经营报表 是 名称+链接+说明，通讯录是 身份+花名+工号+工作范围
  function renderBkFields(v){
    v = v || {};
    document.getElementById('bkFields').innerHTML = SEC[CUR].flds.map(function(f){
      return '<div>' +
        '<div class="tk-lb">' + f.lb + (f.req ? ' <b>*</b>' : '') + '</div>' +
        '<input class="tk-in" id="bkF_' + f.k + '"' + (f.max ? ' maxlength="' + f.max + '"' : '') +
          ' oninput="bkChk()" placeholder="' + f.ph + '" value="' + (v[f.k] || '').replace(/"/g, '&quot;') + '">' +
      '</div>';
    }).join('');
  }
  function bkVal(k){ var e = document.getElementById('bkF_' + k); return e ? e.value.trim() : ''; }
  function bkClose(){ document.getElementById('bkMask').classList.remove('open'); }
  function bkBack(){ bkBackToList(); }
  function bkSetView(v){
    var S = SEC[CUR];
    document.getElementById('bkListView').style.display = v === 'list' ? '' : 'none';
    document.getElementById('bkFormView').style.display = v === 'list' ? 'none' : '';
    var b1 = document.getElementById('bkBtn1'), b2 = document.getElementById('bkBtn2');
    if(v === 'list'){
      b1.textContent = '关闭';                 b1.setAttribute('onclick', 'bkClose()');
      b2.textContent = '＋ 新增' + S.unit;     b2.setAttribute('onclick', 'bkAdd()');
      b2.classList.remove('dis');
    }else{
      b1.textContent = '返回';                 b1.setAttribute('onclick', 'bkBackToList()');
      b2.textContent = '保存';                 b2.setAttribute('onclick', 'bkTrySubmit()');
    }
  }
  function bkTrySubmit(){
    if(document.getElementById('bkBtn2').classList.contains('dis')) return;   // 必填没齐，按钮不可点
    bkSubmit();
  }
  function bkBackToList(){
    BK_EDIT = null;
    bkSetView('list');
    document.getElementById('bkTtlTx').textContent = SEC[CUR].tico + ' 管理' + SEC[CUR].ttl;
    renderBkRows();
  }
  function bkRuleTxt(){
    var u = SEC[CUR].unit;
    if(ROLE === 2) return '运营专员只能添加<b>仅自己</b>可见的' + u + '；上级下发到<b>本行业</b>或<b>服饰整体</b>的' + u + '会自动出现在这里，只能调顺序，不能改、不能删。';
    if(ROLE === 1) return '行业 负责人 可添加生效范围为<b>仅自己</b>或<b>本行业（' + LEADER_IND + '）</b>的' + u + '；只能改 / 删自己添加的，修改、删除会同步到该范围内所有专员。';
    return '超级管理员可添加生效范围为<b>仅自己</b>、<b>单个行业（可多选）</b>或<b>服饰整体</b>的' + u + '；只能改 / 删自己添加的，修改、删除会同步到该范围内所有专员。';
  }
  function renderBkRows(){
    var list = bkList(CUR), me = bkKey(), isPP = CUR === 'pp';
    document.getElementById('bkRows').innerHTML = list.map(function(b, i){
      var mine = b.ow === me;
      var sub = isPP ? (b.no + (b.ds ? ' · ' + b.ds : '')) : b.url;
      return '<div class="bk-row" data-id="' + b.id + '">' +
        '<span class="bk-h" title="按住拖动调整顺序" onmousedown="bkDragStart(event,\'' + b.id + '\')"></span>' +
        '<span class="bk-ic">' + (b.ic || b.nm.charAt(0)) + '</span>' +
        '<div class="bk-mn">' +
          '<div class="bk-nm">' + b.nm +
            (isPP ? '<span class="bk-tag">' + b.rl + '</span>' : '') +
            '<span class="bk-tag ' + bkScopeCls(b) + '">' + bkScopeTxt(b) + '</span>' +
            (mine ? '<span class="bk-tag mine">我添加的</span>' : '<span class="bk-tag">' + bkOwnerTxt(b.ow) + '添加</span>') +
          '</div>' +
          '<div class="bk-u">' + sub + '</div>' +
        '</div>' +
        (mine
          ? '<div class="bk-acts"><span class="bk-op" onclick="bkEdit(\'' + b.id + '\')">修改</span>' +
            '<span class="bk-op del" onclick="bkDel(\'' + b.id + '\')">删除</span></div>'
          : '<span class="bk-lock">非本人添加 · 仅可调顺序</span>') +
      '</div>';
    }).join('');
    document.getElementById('bkCnt').textContent = '共 ' + list.length + ' 个';
    document.getElementById('bkRule').innerHTML = bkRuleTxt();
    document.getElementById('bkSum').innerHTML = '优先级调整<b>仅对自己生效</b>，不影响其他人的主页';
  }
  // 优先级：按住 拖动排序，对主页上所有可见板块都能调、不分创建人；只写入当前身份的顺序
  var BK_DRAG = null;
  function bkDragStart(e, id){
    e.preventDefault();
    var row = document.querySelector('#bkRows .bk-row[data-id="' + id + '"]');
    if(!row) return;
    BK_DRAG = row;
    row.classList.add('dragging');
    document.addEventListener('mousemove', bkDragMove);
    document.addEventListener('mouseup', bkDragEnd);
  }
  function bkDragMove(e){
    if(!BK_DRAG) return;
    var box = document.getElementById('bkRows'), rows = box.querySelectorAll('.bk-row'), y = e.clientY;
    for(var i=0;i<rows.length;i++){
      var r = rows[i];
      if(r === BK_DRAG) continue;
      var bx = r.getBoundingClientRect();
      if(y < bx.top + bx.height / 2){
        if(r.previousElementSibling !== BK_DRAG) box.insertBefore(BK_DRAG, r);
        return;
      }
    }
    if(box.lastElementChild !== BK_DRAG) box.appendChild(BK_DRAG);
  }
  function bkDragEnd(){
    document.removeEventListener('mousemove', bkDragMove);
    document.removeEventListener('mouseup', bkDragEnd);
    if(!BK_DRAG) return;
    BK_DRAG.classList.remove('dragging');
    BK_DRAG = null;
    bkCommitOrder();
  }
  function bkCommitOrder(){
    SEC[CUR].ord[bkKey()] = Array.prototype.map.call(document.querySelectorAll('#bkRows .bk-row'), function(r){
      return r.getAttribute('data-id');
    });
    renderBkRows();
    renderSec(CUR);
  }

  // 生效范围可选项：按角色开放，无权限的置灰但保留并说明原因
  function bkScopeOpts(){
    if(ROLE === 2) return [
      {k:'SELF', t:'仅自己', ok:true},
      {k:'IND',  t:'单个行业', ok:false, why:'运营专员只能添加仅自己可见的' + SEC[CUR].unit},
      {k:'ALL',  t:'服饰整体', ok:false, why:'仅超级管理员可下发到服饰整体'}
    ];
    if(ROLE === 1) return [
      {k:'SELF', t:'仅自己', ok:true},
      {k:'IND',  t:'本行业（' + LEADER_IND + '）', ok:true},
      {k:'ALL',  t:'服饰整体', ok:false, why:'仅超级管理员可下发到服饰整体'}
    ];
    return [
      {k:'SELF', t:'仅自己', ok:true},
      {k:'IND',  t:'单个行业（可多选）', ok:true},
      {k:'ALL',  t:'服饰整体', ok:true}
    ];
  }
  function bkScopeWhy(){
    if(BK_FORM.sc === 'SELF') return '「仅自己」：只出现在你自己的主页，后续修改 / 删除也只影响你自己。';
    if(BK_FORM.sc === 'IND')  return '「单个行业」：出现在所选行业下<b>全部运营专员</b>的主页，后续修改 / 删除对这些人同步生效。';
    if(BK_FORM.sc === 'ALL')  return '「服饰整体」：出现在服饰<b>全部运营专员</b>的主页，后续修改 / 删除对所有人同步生效。';
    return '请选择生效范围。';
  }
  function renderBkScopes(){
    var lock = !!BK_EDIT && ROLE === 2;   // 运营专员不能调整生效范围
    document.getElementById('bkScopes').innerHTML = bkScopeOpts().map(function(o){
      var can = o.ok && !lock;
      return '<span class="tk-mode' + (BK_FORM.sc === o.k ? ' on' : '') + (can ? '' : ' dis') + '" data-k="' + o.k + '"' +
        ' onclick="' + (can ? 'bkPickScope(\'' + o.k + '\')' : 'bkDeny(\'' + o.k + '\')') + '">' + o.t + '</span>';
    }).join('');
    var pick = document.getElementById('bkIndPick');
    pick.innerHTML = ROLE === 0
      ? IND.map(function(d){
          return '<span class="tk-chip' + (BK_FORM.inds[d.n] ? ' on' : '') + '" onclick="bkPickInd(this,\'' + d.n + '\')">' + d.n + '</span>';
        }).join('')
      : '<span class="tk-chip on">' + LEADER_IND + '</span>' +
        '<span class="tk-note" style="width:100%">行业 负责人 只能下发到本行业，行业不可更换。</span>';
    pick.classList.toggle('on', BK_FORM.sc === 'IND');
    document.getElementById('bkWhy').innerHTML = lock
      ? '运营专员不能调整生效范围；如需让同行业其他人也看到该' + SEC[CUR].unit + '，请找 负责人 或超级管理员添加。'
      : bkScopeWhy();
  }
  function bkDeny(k){
    var o = bkScopeOpts().filter(function(x){ return x.k === k; })[0];
    alert('当前身份不可选择该生效范围\n' + (!!BK_EDIT && ROLE === 2 ? '运营专员不能调整生效范围' : ((o && o.why) || '')));
  }
  function bkPickScope(k){
    BK_FORM.sc = k;
    if(k === 'IND' && ROLE === 1){ BK_FORM.inds = {}; BK_FORM.inds[LEADER_IND] = 1; }
    renderBkScopes();
    bkFormSum();
  }
  function bkPickInd(el, n){
    el.classList.toggle('on');
    if(BK_FORM.inds[n]) delete BK_FORM.inds[n]; else BK_FORM.inds[n] = 1;
    document.getElementById('bkWhy').innerHTML = bkScopeWhy();
    bkFormSum();
  }
  function bkMiss(){
    var S = SEC[CUR], i;
    for(i = 0; i < S.flds.length; i++){
      var f = S.flds[i];
      if(f.req && !bkVal(f.k)) return f.lb;
    }
    if(!BK_FORM.sc) return '生效范围';
    if(BK_FORM.sc === 'IND' && !Object.keys(BK_FORM.inds).length) return '生效行业';
    return '';
  }
  function bkChk(){
    var b2 = document.getElementById('bkBtn2');
    if(document.getElementById('bkFormView').style.display === 'none'){ b2.classList.remove('dis'); return; }
    var miss = bkMiss();
    b2.classList.toggle('dis', !!miss);
    var sum = document.getElementById('bkSum');
    if(miss) sum.innerHTML = '还差<b>' + miss + '</b>，填完才能保存';
    else if(BK_FORM.sc) sum.innerHTML = '生效对象：<b>' + bkAffect(BK_FORM.sc, BK_FORM.inds) + '</b>';
  }
  function bkFormSum(){
    document.getElementById('bkSum').innerHTML = BK_FORM.sc
      ? '生效对象：<b>' + bkAffect(BK_FORM.sc, BK_FORM.inds) + '</b>'
      : '请选择生效范围';
    bkChk();
  }
  function bkAdd(){
    var S = SEC[CUR];
    BK_EDIT = null;
    renderBkFields({});
    BK_FORM = {sc:(ROLE === 2 ? 'SELF' : ''), inds:{}};   // 专员只有一个可选范围，默认选中
    bkSetView('form');
    document.getElementById('bkTtlTx').textContent = '＋ 新增' + S.unit;
    renderBkScopes();
    bkFormSum();
  }
  function bkEdit(id){
    var S = SEC[CUR], b = bkFind(CUR, id);
    if(!b) return;
    if(b.ow !== bkKey()){ alert('只能修改自己添加的' + S.unit); return; }
    BK_EDIT = id;
    renderBkFields(b);
    BK_FORM = {sc:b.sc, inds:{}};
    b.inds.forEach(function(n){ BK_FORM.inds[n] = 1; });
    bkSetView('form');
    document.getElementById('bkTtlTx').textContent = '修改' + S.unit;
    renderBkScopes();
    bkFormSum();
  }
  function bkSubmit(){
    var S = SEC[CUR], v = {}, i;
    for(i = 0; i < S.flds.length; i++){
      var f = S.flds[i];
      v[f.k] = bkVal(f.k);
      if(f.req && !v[f.k]){ alert('请填写' + f.lb); return; }
      if(f.url && v[f.k] && !/^https?:\/\//i.test(v[f.k])){ alert('链接需以 http:// 或 https:// 开头'); return; }
      if(!v[f.k] && f.def) v[f.k] = f.def;
    }
    if(!BK_FORM.sc){ alert('请选择生效范围'); return; }
    var inds = Object.keys(BK_FORM.inds);
    if(BK_FORM.sc === 'IND' && !inds.length){ alert('请至少选择一个行业'); return; }
    var dk = S.dupK;
    var dup = S.items.filter(function(b){ return b.id !== BK_EDIT && b[dk] === v[dk] && bkVisible(b); }).length;
    if(dup){
      alert(dk === 'no' ? '主页上已有工号「' + v.no + '」的联系人，不用重复添加'
                        : '主页上已有同名' + S.unit + '「' + v.nm + '」，换个名字吧');
      return;
    }

    var scope = BK_FORM.sc, who = bkAffect(scope, BK_FORM.inds);
    if(BK_EDIT){
      var b = bkFind(CUR, BK_EDIT);
      var moved = b.sc !== scope || b.inds.join(',') !== inds.join(',');
      S.flds.forEach(function(f){ b[f.k] = v[f.k]; });
      b.sc = scope; b.inds = scope === 'IND' ? inds : [];
      renderSec(CUR);
      bkBackToList();
      alert('已保存「' + v.nm + '」\n生效对象：' + who +
        (moved ? '\n生效范围已调整，切换身份可看到可见性变化'
               : (scope === 'SELF' ? '\n该' + S.unit + '只在你自己的主页，修改不影响其他人'
                                   : '\n修改对该范围内所有人同步生效')));
    }else{
      S.seq++;
      var rec = {id:(CUR === 'bk' ? 'b' : (CUR === 'fb' ? 'f' : 'p')) + S.seq,
        ic:(S.defIc || v.nm.charAt(0)), bd:'', sc:scope, inds:(scope === 'IND' ? inds : []), ow:bkKey()};
      S.flds.forEach(function(f){ rec[f.k] = v[f.k]; });
      S.items.push(rec);
      renderSec(CUR);
      bkBackToList();
      alert('已添加「' + v.nm + '」\n生效对象：' + who + (scope === 'SELF' ? '' : '\n切换身份即可看到该' + S.unit + '已出现在对方主页'));
    }
  }
  function bkDel(id){
    var S = SEC[CUR], b = bkFind(CUR, id);
    if(!b) return;
    if(b.ow !== bkKey()){ alert('只能删除自己添加的' + S.unit); return; }
    var o = {};
    b.inds.forEach(function(n){ o[n] = 1; });
    var who = b.sc === 'SELF' ? '仅从你自己的主页移除' : '将从' + bkAffect(b.sc, o) + '的主页同步移除';
    if(!confirm('确认删除「' + b.nm + '」？\n' + who)) return;
    S.items.splice(S.items.indexOf(b), 1);
    ['admin','负责人','staff'].forEach(function(k){
      var i = S.ord[k].indexOf(id);
      if(i >= 0) S.ord[k].splice(i, 1);
    });
    renderSec(CUR);
    renderBkRows();
  }

  
  var RC_ACTS = ['2026秋日好物节', '秋季消费券专项', '店铺红包冲刺', '前N报名冲刺', '初冬上新周'];
  var RC_TALKS = {
    '2026秋日好物节': ['大促报名截止提醒', '大促玩法解读 · 满减档位', '大促资源位申报提醒'],
    '秋季消费券专项':   ['消费券未设置提醒', '消费券面额优化建议', '消费券核销率偏低预警'],
    '店铺红包冲刺':     ['店铺红包未设置提醒', '红包档位配置建议'],
    '前N报名冲刺':      ['前N 未报名催办', '前N 货品结构建议'],
    '初冬上新周':      ['初冬上新周招商邀约', '新品上新节奏提醒']
  };
  var RC_CHNS = ['协作消息', '短信', '在线会话', '电话', '站内信'];
  var RC_STS  = ['发送成功', '发送失败', '待发送'];
  var RC_RES  = ['已回复', '已读未回', '未读'];
  var RC_ACS  = ['已行动', '部分完成', '未行动'];
  var RC_BRAND = {
    '女装':    ['澄禾衣舍', '暮原衣舍', '知序衣舍', '云汀衣舍', '松果衣舍', '拾岸衣舍', '若谷衣舍', '暖原衣舍', '月屿衣舍', '望野衣舍', '朴集衣舍', '柚晴衣舍'],
    '男装':    ['云汀男装', '松果男装', '拾岸男装', '若谷男装', '暖原男装', '月屿男装', '望野男装', '朴集男装', '柚晴男装', '澄禾男装', '暮原男装', '知序男装'],
    '女鞋':    ['橙屿原创鞋履', '山岚制鞋', '栖木鞋履工坊', '拾步日常鞋店', '晴川鞋履研究所', '鹿橙手作鞋铺', '半夏轻履', '归途轻履', '知序轻履', '云汀轻履', '松果轻履', '拾岸轻履'],
    '男鞋':    ['望野步履', '朴集步履', '柚晴步履', '澄禾步履', '暮原步履', '知序步履', '云汀步履', '松果步履', '拾岸步履', '若谷步履'],
    '箱包':    ['澄禾箱包', '暮原箱包', '知序箱包', '云汀箱包', '松果箱包', '拾岸箱包', '若谷箱包', '暖原箱包', '月屿箱包', '望野箱包'],
    '内衣':    ['云汀棉品', '松果棉品', '拾岸棉品', '若谷棉品', '暖原棉品', '月屿棉品', '望野棉品', '朴集棉品', '柚晴棉品', '澄禾棉品'],
    '服配':    ['若谷饰集', '暖原饰集', '月屿饰集', '望野饰集', '朴集饰集', '柚晴饰集', '澄禾饰集', '暮原饰集', '知序饰集'],
    '手表眼镜':['望野镜坊', '朴集镜坊', '柚晴镜坊', '澄禾镜坊', '暮原镜坊', '知序镜坊', '云汀镜坊', '松果镜坊', '拾岸镜坊']
  };
  var RC_SUF = ['旗舰店', '官方店', '专营店', 'C店', '工厂店', '直营店'];

  function rcRnd(s){ var x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); }
  function rcPick(arr, s){ return arr[Math.floor(rcRnd(s) * arr.length) % arr.length]; }
  function rcFmt(dt){
    var m = dt.getMonth() + 1, d = dt.getDate();
    return dt.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (d < 10 ? '0' : '') + d;
  }
  function rcShift(n){ return new Date(new Date().getTime() - n * 86400000); }

  // 下发商家池：一个商家只归属一个专员、只绑定一个活动 —— 保证漏斗/汇总/记录三处口径可加总
  var RC_MER = (function(){
    var byInd = {}, byStaff = {}, i, b, f, n;
    for(i = 0; i < STAFF.length; i++){
      if(!byInd[STAFF[i].ind]) byInd[STAFF[i].ind] = [];
      byInd[STAFF[i].ind].push(STAFF[i].nick);
    }
    for(var ind in byInd){
      var pool = RC_BRAND[ind] || ['商家'], combos = [], nicks = byInd[ind];
      for(b = 0; b < pool.length; b++){
        for(f = 0; f < RC_SUF.length; f++) combos.push(pool[b] + RC_SUF[f]);
      }
      // 确定性洗牌：避免「品牌×后缀」的排列规律让某位专员拿到清一色同类型店铺
      for(i = combos.length - 1; i > 0; i--){
        var jj = Math.floor(rcRnd(i * 13 + ind.length * 29 + 7) * (i + 1)) % (i + 1);
        var sw = combos[i]; combos[i] = combos[jj]; combos[jj] = sw;
      }
      for(n = 0; n < nicks.length; n++) byStaff[ind + '|' + nicks[n]] = [];
      for(i = 0; i < combos.length; i++){
        var n2 = i % nicks.length, arr = byStaff[ind + '|' + nicks[n2]], idx = arr.length;
        var q = (idx * 7 + 3 + n2 * 3) % 20, u = (idx * 11 + 5 + n2 * 7) % 20;
        var rt = q < 9 ? 'R' : (q < 15 ? 'S' : 'M');   // 商家回应习惯：响应 45% / 已读 30% / 沉默 25%
        var at = rt === 'R' ? (u < 11 ? '已行动' : (u < 16 ? '部分完成' : '未行动'))
               : rt === 'S' ? (u < 4  ? '已行动' : (u < 9  ? '部分完成' : '未行动'))
               : (u < 1 ? '已行动' : '未行动');
        arr.push({ mer: combos[i], act: RC_ACTS[(i * 3 + 1) % RC_ACTS.length], rt: rt, at: at });
      }
    }
    return byStaff;
  })();
  function rcPool(ind, nick){ return RC_MER[ind + '|' + nick] || []; }
  // 下发商家数：当前身份可见 + 命中筛选的商家池总量（与统计周期无关）
  function rcAssignedBy(fact, find, fnick){
    var n = 0;
    for(var k in RC_MER){
      var p = k.split('|');
      var vis = ROLE === 0 || (ROLE === 1 && p[0] === LEADER_IND) || (ROLE === 2 && p[0] === ME.ind && p[1] === ME.nick);
      if(!vis) continue;
      if(find && find !== '全部' && p[0] !== find) continue;
      if(fnick && fnick !== '全部' && p[1] !== fnick) continue;
      if(!fact || fact === '全部'){ n += RC_MER[k].length; continue; }
      RC_MER[k].forEach(function(it){ if(it.act === fact) n++; });
    }
    return n;
  }
  function rcAssigned(){ return rcAssignedBy('全部', '全部', '全部'); }
  // 单个分组（活动 × 行业 × 专员）的下发商家数
  function rcPoolCnt(act, ind, nick){
    var n = 0;
    rcPool(ind, nick).forEach(function(it){ if(it.act === act) n++; });
    return n;
  }

  // 近 30 天触达流水：每位专员每天 2~7 条
  var RC_LOG = (function(){
    var out = [], seed = 0, back, si, j;
    for(back = 29; back >= 0; back--){
      var ds = rcFmt(rcShift(back));
      for(si = 0; si < STAFF.length; si++){
        var s = STAFF[si], pool = rcPool(s.ind, s.nick);
        if(!pool.length) continue;
        // 每位专员只会触达自己商家池中的一部分，其余为「尚未触达」的商家
        var lim = Math.max(1, Math.round(pool.length * (0.55 + 0.30 * rcRnd(si * 91 + 7))));
        var k = 6 + Math.floor(rcRnd(++seed) * 9);
        for(j = 0; j < k; j++){
          seed++;
          var it = pool[Math.floor(rcRnd(seed * 7 + 2) * lim) % lim];
          var act = it.act, mer = it.mer;
          var talks = RC_TALKS[act];
          var p = rcRnd(seed * 13 + 5);
          var st = p < 0.85 ? '发送成功' : (p < 0.93 ? '发送失败' : '待发送');
          var re = '—', ac = '—';
          if(st === '发送成功'){
            var w = rcRnd(seed * 17 + 7);
            // 回应/行动取决于商家自身习惯（rt / at），只留少量行内波动
            if(it.rt === 'R')      re = w < 0.75 ? '已回复' : '已读未回';
            else if(it.rt === 'S') re = w < 0.80 ? '已读未回' : '未读';
            else                   re = w < 0.85 ? '未读' : '已读未回';
            ac = re === '未读' ? '未行动' : it.at;
          }
          var hh = 9 + Math.floor(rcRnd(seed * 23 + 13) * 11), mm = Math.floor(rcRnd(seed * 29 + 17) * 60);
          out.push({
            d: ds, t: ds + ' ' + (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm,
            act: act, ind: s.ind, nick: s.nick, mer: mer,
            chn: rcPick(RC_CHNS, seed * 31 + 19),
            talk: talks[Math.floor(rcRnd(seed * 37 + 23) * talks.length) % talks.length],
            st: st, re: re, ac: ac
          });
        }
      }
    }
    return out;
  })();

  var RC_PG = 1, RC_PS = 10;
  var RC_PAGE = [];   // 触达记录当前页数据（触达H5预览按下标取记录）

  // 身份可见范围
  function rcScope(r){
    if(ROLE === 0) return true;
    if(ROLE === 1){
      if(r.ind !== LEADER_IND) return false;
      if(LEADER_TRACK !== 'all'){
        var s = STAFF.filter(function(x){ return x.ind === r.ind && x.nick === r.nick; })[0];
        if(s && s.track !== LEADER_TRACK) return false;
      }
      return true;
    }
    return r.ind === ME.ind && r.nick === ME.nick;
  }
  function rcScopeTxt(){
    var trk = (ROLE === 1 && LEADER_TRACK !== 'all') ? ' · ' + LEADER_TRACK + ' 赛道' : '';
    return ROLE === 0 ? '数据范围：服饰全行业 · 全体专员'
         : (ROLE === 1 ? '数据范围：' + LEADER_IND + trk + ' · ' + (LEADER_TRACK === 'all' ? '全部' : LEADER_TRACK + ' 赛道') + '专员' : '数据范围：仅我自己（' + ME.ind + ' ' + ME.nick + '）');
  }
  function rcInds(){
    if(ROLE === 0) return IND.map(function(d){ return d.n; });
    return [ROLE === 1 ? LEADER_IND : ME.ind];
  }
  function rcNicks(ind){
    if(ROLE === 2) return [ME.nick];
    var lim = ROLE === 1 ? LEADER_IND : ind;
    var out = [];
    STAFF.forEach(function(s){
      if(lim && lim !== '全部' && s.ind !== lim) return;
      if(ROLE === 1 && LEADER_TRACK !== 'all' && s.track !== LEADER_TRACK) return;
      if(out.indexOf(s.nick) < 0) out.push(s.nick);
    });
    return out.sort();
  }
  function rcVal(id){ var e = document.getElementById(id); return e ? e.value : '全部'; }
  function rcSel(id, lb, opts, cur, fn, lock){
    var o = ['<option value="全部">全部</option>'].concat(opts.map(function(v){
      return '<option value="' + v + '"' + (v === cur ? ' selected' : '') + '>' + v + '</option>';
    }));
    if(lock) o = opts.map(function(v){ return '<option value="' + v + '">' + v + '</option>'; });
    return '<span class="fw">' + lb + '<select id="' + id + '" onchange="' + fn + '">' + o.join('') + '</select></span>';
  }
  // 统计周期内 + 身份可见的全部流水（不受两个板块各自的筛选影响）
  function rcBase(){
    var d1 = rcVal('rcD1'), d2 = rcVal('rcD2');
    if(d1 > d2){ var t = d1; d1 = d2; d2 = t; }
    return RC_LOG.filter(function(r){ return rcScope(r) && r.d >= d1 && r.d <= d2; });
  }
  function rcUniq(list, test){
    var seen = {}, n = 0;
    list.forEach(function(r){ if(test(r) && !seen[r.mer]){ seen[r.mer] = 1; n++; } });
    return n;
  }
  function rcPct(a, b){ return b ? Math.round(a / b * 1000) / 10 : 0; }
  function rcQm(tip){ return '<span class="qm">?<span class="tip">' + tip + '</span></span>'; }

  function rcToggle(id){ document.getElementById(id).classList.toggle('open'); }
  function rcQuick(n){
    document.getElementById('rcD1').value = rcFmt(rcShift(n));
    document.getElementById('rcD2').value = rcFmt(rcShift(0));
    rcRender();
  }
  function rcIndChg(which){
    // 行业变了，运营专员的候选项跟着变
    var ind = rcVal(which === 1 ? 'rcF1ind' : 'rcF2ind');
    var id = which === 1 ? 'rcF1nick' : 'rcF2nick';
    var sel = document.getElementById(id);
    if(sel){
      var opts = rcNicks(ind);
      sel.innerHTML = ['<option value="全部">全部</option>'].concat(opts.map(function(v){
        return '<option value="' + v + '">' + v + '</option>';
      })).join('');
    }
    if(which === 1) rcSumRender(); else { RC_PG = 1; rcLogRender(); }
  }

  function rcFunnelRender(){
    var b = rcBase();
    var sent  = rcAssigned();
    var reach = rcUniq(b, function(r){ return r.st === '发送成功'; });
    var resp  = rcUniq(b, function(r){ return r.re === '已回复'; });
    var act   = rcUniq(b, function(r){ return r.ac === '已行动'; });
    function box(k, v, rl, rate, tip, cls){
      var footer = rl ? '<div class="fr ' + cls + '"><span class="rl">' + rl + '</span><b>' + rate + '%</b>' + rcQm(tip) + '</div>' : '';
      return '<div class="fn"><div class="fk">' + k + '</div><div class="fv">' + v + '</div>' + footer + '</div>';
    }
    document.getElementById('rcFunnel').innerHTML =
      box('下发商家数', sent, '', '', '', '') +
      '<div class="fn-arrow">›</div>' +
      box('触达商家数', reach, '触达覆盖率 ', rcPct(reach, sent), '触达商家数/下发商家数', rcPct(reach, sent) >= 80 ? 'g' : 'm') +
      '<div class="fn-arrow">›</div>' +
      box('回应商家数', resp, '回应商家率 ', rcPct(resp, reach), '回应商家数/触达商家数', rcPct(resp, reach) >= 40 ? 'g' : 'm') +
      '<div class="fn-arrow">›</div>' +
      box('行动商家数', act, '商家行动率 ', rcPct(act, reach), '行动商家数/触达商家数', rcPct(act, reach) >= 30 ? 'g' : 'm');
    document.getElementById('rcWho').textContent = '';
  }

  function rcSumRender(){
    var f = {act: rcVal('rcF1act'), ind: rcVal('rcF1ind'), nick: rcVal('rcF1nick')};
    var rows = rcBase().filter(function(r){
      return (f.act === '全部' || r.act === f.act) && (f.ind === '全部' || r.ind === f.ind) &&
             (f.nick === '全部' || r.nick === f.nick);
    });
    var map = {}, keys = [];
    rows.forEach(function(r){
      var k = r.act + '|' + r.ind + '|' + r.nick;
      if(!map[k]){ map[k] = {act:r.act, ind:r.ind, nick:r.nick, reach:{}, resp:{}, done:{}}; keys.push(k); }
      if(r.st === '发送成功') map[k].reach[r.mer] = 1;
      if(r.re === '已回复')   map[k].resp[r.mer] = 1;
      if(r.ac === '已行动')   map[k].done[r.mer] = 1;
    });
    var list = keys.map(function(k){
      var g = map[k];
      return {act:g.act, ind:g.ind, nick:g.nick, sent:rcPoolCnt(g.act, g.ind, g.nick),
              reach:Object.keys(g.reach).length, resp:Object.keys(g.resp).length, done:Object.keys(g.done).length};
    }).sort(function(a, b){ return b.reach - a.reach; });

    // 三个率沿用漏斗阈值配色
    function rk(a, b, lim){ var v = rcPct(a, b); return '<td class="rk ' + (v >= lim ? 'g' : 'm') + '">' + v + '%</td>'; }

    var tb = document.getElementById('rcSumTb'), em = document.getElementById('rcSumEmpty');
    if(!list.length){
      tb.innerHTML = ''; em.innerHTML = '<div class="rc-empty">当前统计周期与筛选条件下没有触达数据</div>';
    }else{
      em.innerHTML = '';
      var tr = 0, tp = 0, td = 0, ts = rcAssignedBy(f.act, f.ind, f.nick);
      tb.innerHTML = '<thead><tr><th class="lead">关联活动</th><th class="lead">行业</th><th class="lead">运营专员</th>' +
        '<th>下发商家数</th>' +
        '<th>触达商家数</th><th>触达覆盖率' + rcQm('触达商家数/下发商家数') + '</th>' +
        '<th>回应商家数</th><th>回应商家率' + rcQm('回应商家数/触达商家数') + '</th>' +
        '<th>行动商家数</th><th>行动商家率' + rcQm('行动商家数/触达商家数') + '</th></tr></thead><tbody>' +
        list.map(function(g){
          tr += g.reach; tp += g.resp; td += g.done;
          return '<tr><td class="lead">' + g.act + '</td><td class="lead">' + g.ind + '</td>' +
            '<td class="lead">' + g.nick + '</td>' +
            '<td>' + g.sent + '</td>' +
            '<td>' + g.reach + '</td>' + rk(g.reach, g.sent, 80) +
            '<td>' + g.resp + '</td>' + rk(g.resp, g.reach, 40) +
            '<td>' + g.done + '</td>' + rk(g.done, g.reach, 30) + '</tr>';
        }).join('') +
        '<tr class="sumall"><td class="lead">合计</td><td class="lead">—</td><td class="lead">' + list.length + ' 组</td>' +
        '<td>' + ts + '</td>' +
        '<td>' + tr + '</td>' + rk(tr, ts, 80) + '<td>' + tp + '</td>' + rk(tp, tr, 40) +
        '<td>' + td + '</td>' + rk(td, tr, 30) + '</tr></tbody>';
    }
    document.getElementById('rcSumCnt').textContent = '';
  }

  function rcLogRender(){
    var f = {
      act: rcVal('rcF2act'), ind: rcVal('rcF2ind'), nick: rcVal('rcF2nick'),
      chn: rcVal('rcF2chn'), st: rcVal('rcF2st'), re: rcVal('rcF2re'), ac: rcVal('rcF2ac')
    };
    var mer = (document.getElementById('rcF2mer') ? document.getElementById('rcF2mer').value : '').trim();
    var rows = rcBase().filter(function(r){
      return (f.act === '全部' || r.act === f.act) && (f.ind === '全部' || r.ind === f.ind) &&
             (f.nick === '全部' || r.nick === f.nick) && (f.chn === '全部' || r.chn === f.chn) &&
             (f.st === '全部' || r.st === f.st) && (f.re === '全部' || r.re === f.re) &&
             (f.ac === '全部' || r.ac === f.ac) && (!mer || r.mer.indexOf(mer) >= 0);
    }).sort(function(a, b){ return a.t < b.t ? 1 : -1; });

    var pages = Math.max(1, Math.ceil(rows.length / RC_PS));
    if(RC_PG > pages) RC_PG = pages;
    var page = rows.slice((RC_PG - 1) * RC_PS, RC_PG * RC_PS);
    var tb = document.getElementById('rcLogTb'), em = document.getElementById('rcLogEmpty');

    function tag(v){
      var c = 'mut';
      if(v === '发送成功' || v === '已回复' || v === '已行动') c = 'ok';
      else if(v === '待发送' || v === '已读未回' || v === '部分完成') c = 'warn';
      else if(v === '发送失败') c = 'bad';
      return '<span class="rc-tag ' + c + '">' + v + '</span>';
    }
    if(!rows.length){
      tb.innerHTML = ''; em.innerHTML = '<div class="rc-empty">当前统计周期与筛选条件下没有触达记录</div>';
      document.getElementById('rcLogPg').innerHTML = '';
    }else{
      em.innerHTML = '';
      RC_PAGE = page;   // 当前页记录，供「触达H5预览」弹窗按下标取用
      tb.innerHTML = '<thead><tr><th class="lead">关联活动</th><th class="lead">行业</th><th class="lead">运营专员</th>' +
        '<th class="lead">商家名称</th><th class="lead">触达时间</th><th class="lead">触达渠道</th><th class="lead">触达话术</th>' +
        '<th class="lead">触达H5预览</th>' +
        '<th class="lead">发送状态</th><th class="lead">商家回应</th><th class="lead">商家行动</th></tr></thead><tbody>' +
        page.map(function(r, i){
          return '<tr><td class="lead">' + r.act + '</td><td class="lead">' + r.ind + '</td><td class="lead">' + r.nick + '</td>' +
            '<td class="lead">' + r.mer + '</td><td class="lead">' + r.t + '</td><td class="lead">' + r.chn + '</td>' +
            '<td class="lead">' + r.talk + '</td>' +
            '<td class="lead"><span class="rc-h5" onclick="rcH5Open(' + i + ')">预览</span></td>' +
            '<td class="lead">' + tag(r.st) + '</td>' +
            '<td class="lead">' + tag(r.re) + '</td><td class="lead">' + tag(r.ac) + '</td></tr>';
        }).join('') + '</tbody>';
      var nums = '';
      for(var p = 1; p <= pages; p++){
        if(pages > 7 && p > 3 && p < pages - 2 && Math.abs(p - RC_PG) > 1){
          if(nums.indexOf('…') < 0 || p === RC_PG + 2) nums += (nums.slice(-12).indexOf('…') >= 0 ? '' : '<span class="mp-info">…</span>');
          continue;
        }
        nums += '<span class="mp-num' + (p === RC_PG ? ' on' : '') + '" onclick="rcGo(' + p + ')">' + p + '</span>';
      }
      document.getElementById('rcLogPg').innerHTML =
        '<span class="mp-info">按触达时间倒序 · 共 <b>' + rows.length + '</b> 条 · 第 ' + RC_PG + '/' + pages + ' 页</span>' +
        '<span class="mp-sp"></span><span class="mp-btn" onclick="rcGo(' + (RC_PG - 1) + ')">‹ 上一页</span>' +
        nums + '<span class="mp-btn" onclick="rcGo(' + (RC_PG + 1) + ')">下一页 ›</span>';
    }
    document.getElementById('rcLogCnt').textContent = '';
  }
  function rcGo(p){
    var e = document.getElementById('rcLogPg');
    RC_PG = p < 1 ? 1 : p;
    rcLogRender();
    if(e) e.scrollIntoView({block:'nearest'});
  }

  // 身份切换后重建筛选项（行业 / 运营专员的候选范围随身份收窄）
  function rcFilters(){
    var inds = rcInds(), lock = ROLE !== 0;
    document.getElementById('rcSumFil').innerHTML =
      rcSel('rcF1act', '关联活动', RC_ACTS, '全部', 'rcSumRender()') +
      rcSel('rcF1ind', '行业', inds, '全部', 'rcIndChg(1)', lock) +
      rcSel('rcF1nick', '运营专员', rcNicks(lock ? inds[0] : '全部'), '全部', 'rcSumRender()', ROLE === 2);
    document.getElementById('rcLogFil').innerHTML =
      rcSel('rcF2act', '关联活动', RC_ACTS, '全部', 'rcLogGo()') +
      rcSel('rcF2ind', '行业', inds, '全部', 'rcIndChg(2)', lock) +
      rcSel('rcF2nick', '运营专员', rcNicks(lock ? inds[0] : '全部'), '全部', 'rcLogGo()', ROLE === 2) +
      '<span class="fw"><input id="rcF2mer" placeholder="搜索商家名称" oninput="rcLogGo()"></span>' +
      rcSel('rcF2chn', '触达渠道', RC_CHNS, '全部', 'rcLogGo()') +
      rcSel('rcF2st', '发送状态', RC_STS, '全部', 'rcLogGo()') +
      rcSel('rcF2re', '商家回应', RC_RES, '全部', 'rcLogGo()') +
      rcSel('rcF2ac', '商家行动', RC_ACS, '全部', 'rcLogGo()');
  }
  function rcLogGo(){ RC_PG = 1; rcLogRender(); }
  function rcRender(){ rcFunnelRender(); rcSumRender(); rcLogRender(); }
  function rcInit(){
    document.getElementById('rcD1').value = rcFmt(rcShift(0));   // 默认统计周期：今日 — 今日
    document.getElementById('rcD2').value = rcFmt(rcShift(0));
    rcFilters();
    rcRender();
  }

  function setRoleUI(v){
    // v = '0' / '1a' / '1i' / '1c' / '2'
    if(v === '0'){ LEADER_TRACK = 'all'; setRole(0); }
    else if(v === '1a'){ LEADER_TRACK = 'all'; setRole(1); }
    else if(v === '1i'){ LEADER_TRACK = '原创设计'; setRole(1); }
    else if(v === '1c'){ LEADER_TRACK = '产业带'; setRole(1); }
    else { LEADER_TRACK = 'all'; setRole(2); }
  }
  function setRole(n){
    ROLE = n;
    var r = ROLES[n];
    // 负责人：用动态 role 代替静态 ROLES[1]（随负责行业 / 赛道变化）
    if(n === 1) r = 负责人Role();
    // 「负责行业」下拉仅 负责人 可见
    var iw = document.getElementById('idIndWrap');
    if(iw) iw.style.display = (n === 1) ? '' : 'none';
    renderIndSelect();
    for(var i=0;i<3;i++){
      var b = document.getElementById('ib'+i);
      if(b) b.classList.toggle('on', i===n);
    }
    document.getElementById('appTtl').innerHTML = r.ttl;
    document.getElementById('appWho').textContent = r.who;
    document.getElementById('ibScope').textContent = r.scope;
    var h = document.getElementById('roleHint');
    h.innerHTML = r.hint;
    h.classList.toggle('on', !!r.hint);
    renderKpiPicker();
    renderKpis();
    // 表单一仅超管可见；表单二超管看全行业、负责人 看本行业、专员不可见；默认收起
    var ti = document.getElementById('tblInd'), ts = document.getElementById('tblStaff');
    ti.classList.toggle('on', n === 0);
    ts.classList.toggle('on', n === 0 || n === 1);
    ti.classList.add('collapsed');
    ts.classList.add('collapsed');
    if(n === 0) renderIndTable();
    if(n === 0 || n === 1){ stPage = 1; renderStaffTable(); }
    renderAlerts();
    renderTodos();
    renderEntries();
    // 触达回执日报：按身份重新收敛可见范围（rcInit 之前不渲染）
    var rd = document.getElementById('rcD1');
    if(rd && rd.value){ rcFilters(); rcRender(); }
  }

  function openDiag(el){
    var name = el.getAttribute('data-m') || '商家';
    var tag = el.getAttribute('data-tag') || '';
    document.getElementById('diagName').textContent = name;
    document.getElementById('diagTag').textContent = tag;
    var tn = document.querySelector('#l1diag .task-note b');
    if(tn){ tn.textContent = name; }
    var m = document.getElementById('l1diag');
    m.classList.add('open');
    m.scrollIntoView({behavior:'smooth', block:'center'});
  }
  // L1 顶部 Tab：运营工作台(A) / 认领明细(B) / 触达中心(C)
  function l1tab(el, which){
    el.parentNode.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('on'); });
    el.classList.add('on');
    var a = document.getElementById('l1paneA');
    var b = document.getElementById('l1paneB');
    var c = document.getElementById('l1paneC');
    if(a) a.classList.toggle('on', which==='A');
    if(b) b.classList.toggle('on', which==='B');
    if(c) c.classList.toggle('on', which==='C');
  }
  function stPick(el, which){
    document.querySelectorAll('.subtab .st-pill').forEach(function(t){ t.classList.remove('on'); });
    if(el) el.classList.add('on');
    var a = document.getElementById('l1paneA');
    var b = document.getElementById('l1paneB');
    var c = document.getElementById('l1paneC');
    if(a) a.classList.toggle('on', which==='A');
    if(b) b.classList.toggle('on', which==='B');
    if(c) c.classList.toggle('on', which==='C');
    var cn = document.getElementById('crumbNow');
    if(cn) cn.textContent = which==='B' ? '认领明细' : (which==='C' ? '触达中心' : '运营工作台');
  }
  // 选择指标：勾选/取消透出维度
  document.querySelectorAll('.picker .opt').forEach(function(o){
    o.addEventListener('click', function(){ o.classList.toggle('on'); });
  });

  // ===== 商家多选 / 全选 / 批量触达 =====
  function updateSel(){
    var rows = document.querySelectorAll('.mrow:not(.mhide)');
    var n = 0;
    rows.forEach(function(tr){ if(tr.classList.contains('sel')) n++; });
    ['selCount','bmCount','bmCount2'].forEach(function(id){
      var e = document.getElementById(id); if(e) e.textContent = n;
    });
    var all = document.querySelector('.allck');
    if(all){ all.classList.toggle('on', n>0 && n===rows.length); }
    return n;
  }
  function toggleRow(ck){
    var tr = ck.closest('tr');
    ck.classList.toggle('on');
    tr.classList.toggle('sel', ck.classList.contains('on'));
    updateSel();
  }
  function toggleAll(all){
    var on = !all.classList.contains('on');
    all.classList.toggle('on', on);
    document.querySelectorAll('.mrow:not(.mhide)').forEach(function(tr){
      tr.classList.toggle('sel', on);
      var ck = tr.querySelector('.rowck'); if(ck) ck.classList.toggle('on', on);
    });
    updateSel();
  }
  function clearSel(){
    document.querySelectorAll('.mrow').forEach(function(tr){
      tr.classList.remove('sel');
      var ck = tr.querySelector('.rowck'); if(ck) ck.classList.remove('on');
    });
    updateSel();
  }
  
  // 商家池不再写死：实时从「商家明细」表解析，附带 Seller ID 与缺口项
  var BT_MERCHANTS = [];
  function xlSid(name){
    var h = 7;
    for(var i = 0; i < name.length; i++) h = (h * 131 + name.charCodeAt(i)) % 900000000;
    return String(7301001001 + h);
  }
  function xlPct(td){ var m = td.textContent.match(/(\d+)%/); return m ? +m[1] : 100; }
  // 扫描商家明细表：BT_MERCHANTS=全量商家池; list=按待办类型(MF_TD)+行勾选的子集; 或直接勾选商家(byRow)
  function xlScan(){
    var rows = [].slice.call(document.querySelectorAll('.mrow'));
    var tds = Object.keys(MF_TD);
    var byUser = tds.length > 0;
    // 先扫全量商家（不管选没选），建 BT_MERCHANTS 全池
    var all = [], allRows = [];
    rows.forEach(function(tr, i){
      var td = tr.children, gaps = [];
      var name = tr.querySelector('.mn b') ? tr.querySelector('.mn b').textContent : ('商家' + (i + 1));
      var yoy = (td[4] ? td[4].textContent : '').trim();
      if(/未设置|未报名/.test(td[6].textContent) || xlPct(td[7]) < 60) gaps.push('coupon');
      if(/未设置|待设置/.test(td[8].textContent) || xlPct(td[9]) < 60) gaps.push('redbag');
      if(/未设置|未报名/.test(td[10].textContent) || xlPct(td[11]) < 60) gaps.push('preN');
      if(xlPct(td[5]) < 60) gaps.push('material');
      if(yoy.charAt(0) === '-') gaps.push('recall');
      var obj = {id:'m' + (i + 1), name:name, sid:xlSid(name), gaps:gaps,
                 tag:(td[2].textContent.indexOf('风险') > -1 ? '风险' : (td[2].textContent.indexOf('预警') > -1 ? '预警' : '安全')) + ' · ' + yoy.replace(/[^v\s]/g, '')};
      allRows.push(obj);
      if(gaps.length) all.push(obj);
    });
    BT_MERCHANTS = all;
    var picked = rows.filter(function(tr){ return tr.classList.contains('sel'); });
    var hasPick = picked.length > 0;
    // 再按筛选条件构建本次触达的初始列表
    var out, byRow = false;
    if(byUser){
      out = all.filter(function(m){
        if(hasPick){
          // 有行勾选：只保留被勾选的且命中所选待办类型的商家
          var idx = +m.id.replace('m','') - 1;
          if(!rows[idx] || !rows[idx].classList.contains('sel')) return false;
        }
        return m.gaps.some(function(g){ return MF_TD[g]; });
      });
    } else if(hasPick){
      // 未选待办类型、直接勾选商家：找这批商家的缺口（含无缺口的也计入 X 家）
      byRow = true;
      out = allRows.filter(function(m){
        var idx = +m.id.replace('m','') - 1;
        return rows[idx] && rows[idx].classList.contains('sel');
      });
    } else {
      out = all; // 无筛选：全量有缺口的商家
    }
    return {list:out, byUser:byUser, byRow:byRow, tds:tds};
  }
  var BT_METRICS=[
    {id:'signup',ic:'',name:'大促报名',gap:'尚未报名好物节大促',entry:'大促报名后台',def:[],
     script:'您好 {商家名}～好物节大促报名 {截止日} 截止，检测到贵店{缺口项}，建议今日在 {入口} 完成报名，核对活动资格和准备要求 '},
    {id:'hot',ic:'',name:'竞价爆款',gap:'缺少竞价爆款商品',entry:'营销中心·竞价爆款',def:[],
     script:'您好 {商家名}～贵店{缺口项}，竞价爆款可放大主推款曝光与成交，建议 {截止日} 前在 {入口} 报名，抢占大促竞价流量 '},
    {id:'preN',ic:'',name:'前N报名',gap:'前N 未报名/渗透偏低',entry:'大促报名后台',def:['m5','m7','m8'],
     script:'您好 {商家名}～大促「前N」坑位报名 {截止日} 截止，检测到贵店{缺口项}，建议今日在 {入口} 完成报名，抢占大促曝光资源 '},
    {id:'redbag',ic:'',name:'店铺红包',gap:'店铺红包待设置',entry:'营销中心·店铺红包',def:['m3','m5','m7','m8'],
     script:'您好 {商家名}～检测到贵店{缺口项}，店铺红包可提升进店转化与客单，建议在 {入口} 于 {截止日} 前完成设置 '},
    {id:'coupon',ic:'',name:'消费券',gap:'消费券未设置',entry:'营销中心·消费券',def:['m5','m8'],
     script:'您好 {商家名}～贵店{缺口项}，消费券能拉动加购与复购，建议尽快在 {入口} 报名设置，{截止日} 前生效最佳 '},
    {id:'material',ic:'',name:'多素材覆盖',gap:'多素材覆盖不足',entry:'商品·素材中心',def:['m5','m7','m8'],
     script:'您好 {商家名}～贵店{缺口项}，主图/短视频/买家秀覆盖不足会影响流量分发，建议在 {入口} 补齐，{截止日} 前达标 '},
    {id:'newprod',ic:'',name:'月均上新',gap:'上新节奏预警',entry:'商品·上新管理',def:['m3','m5','m7'],
     script:'您好 {商家名}～贵店{缺口项}，稳定上新有助于人群拉新与搜索权重，建议 {截止日} 前于 {入口} 补齐新品节奏 '},
    {id:'live',ic:'',name:'直播开播',gap:'开播频次不足/未开播',entry:'直播中控台',def:['m5','m8'],
     script:'您好 {商家名}～贵店{缺口项}，开播可承接大促实时流量并提升转化，建议 {截止日} 前在 {入口} 排期开播 '},
    {id:'recall',ic:'',name:'成交下滑召回',gap:'成交同比下滑',entry:'经营·扶持中心',def:['m3','m5','m7','m8'],
     script:'您好 {商家名}～监测到贵店近期{缺口项}，已为您梳理专属提升方案，建议在 {入口} 查看并认领扶持资源，一起把成交拉回增长 '}
  ];
  var BT_DEADLINE='11/08';
  var BT_TASK=[];      // 已加入任务的指标 id（有序）
  var BT_SEL={};       // metricId -> [merchantId]
  var BT_SCRIPT={};    // metricId -> 当前话术文本
  var BT_OPEN={};      // metricId -> 是否展开
  var BT_TPL=[         // 话术模板库（可保存追加）
    {name:'大促催办·标准',text:'您好 {商家名}～大促临近，检测到贵店{缺口项}，建议尽快在 {入口} 于 {截止日} 前完成设置，承接大促流量～'},
    {name:'温和提醒·亲切',text:'亲爱的 {商家名}，专员发现贵店{缺口项}啦～在 {入口} 花两分钟补齐就能承接更多流量哦，记得 {截止日} 前完成 '}
  ];
  function btMetric(id){ for(var i=0;i<BT_METRICS.length;i++) if(BT_METRICS[i].id===id) return BT_METRICS[i]; return null; }
  function btMerchant(id){ for(var i=0;i<BT_MERCHANTS.length;i++) if(BT_MERCHANTS[i].id===id) return BT_MERCHANTS[i]; return null; }
  function btFill(text,mr,mt){ return String(text).replace(/\{商家名\}/g,mr.name).replace(/\{缺口项\}/g,mt.gap).replace(/\{入口\}/g,mt.entry).replace(/\{截止日\}/g,BT_DEADLINE); }
  
  var XL_GUESS = [
    [{q:'查找出我认领的商家中没有报名好物节的商家名单', k:'batch'},
     {q:'混资加码的商家怎么出费用？', k:'qa'},
     {q:'店铺红包1%费率是怎么计算的？', k:'qa'},
     {q:'店铺红包能不能屏蔽一下，已购买的商家？', k:'qa'}],
    [{q:'帮我找到消费券上个月已提报但本月未提报的商家', k:'batch'},
     {q:'我的商家里哪些多素材覆盖不达标？', k:'batch'},
     {q:'前N报名还差多少家才能达标？', k:'qa'},
     {q:'帮我生成一版大促催办话术', k:'qa'}]
  ];
  var XL_GI = 0, XL_BUSY = false;
  function xlRenderGuess(){
    var box = document.getElementById('xlQs'); if(!box) return;
    box.innerHTML = XL_GUESS[XL_GI].map(function(g){
      return '<div class="xl-q" onclick="xlAsk(\'' + g.q.replace(/'/g, "\\'") + '\')">' + g.q + '</div>';
    }).join('');
  }
  function xlNextGuess(){ XL_GI = (XL_GI + 1) % XL_GUESS.length; xlRenderGuess(); }
  function xlChat(){ return document.getElementById('xlChat'); }
  function xlScroll(){ var c = xlChat(); if(c) c.scrollTop = c.scrollHeight; }
  function xlOpen(){
    var f = document.getElementById('xlFull'); if(!f) return;
    f.classList.add('open');
    if(!xlChat().children.length) xlHello();
    xlScroll();
  }
  function xlClose(){ var f = document.getElementById('xlFull'); if(f) f.classList.remove('open'); }
  function xlReset(){
    var c = xlChat(); if(c) c.innerHTML = '';
    BT_TASK = []; BT_SEL = {}; BT_SCRIPT = {}; BT_OPEN = {};
    xlOpen(); xlHello();
  }
  function xlHello(){
    var w = xlPushAI();
    xlText(w, 'Hi 林舟 我是<b>小策</b>，你的运营助理。可以让我圈商家名单、拆解缺口、生成个性化话术并一键批量触达；也可以直接问我大促规则与费用口径。');
  }
  function xlEsc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function xlPushUser(t){
    var d = document.createElement('div'); d.className = 'xl-u'; d.innerHTML = xlEsc(t);
    xlChat().appendChild(d); xlScroll();
  }
  function xlPushAI(){
    var d = document.createElement('div'); d.className = 'xl-a';
    d.innerHTML = '<div class="xl-a-who"><span class="av"><img src="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2220%22 fill=%22%23EA6A2A%22/%3E%3Ctext x=%2232%22 y=%2243%22 font-size=%2232%22 text-anchor=%22middle%22 fill=%22white%22%3E策%3C/text%3E%3C/svg%3E" alt=""></span>小策</div>';
    xlChat().appendChild(d); xlScroll();
    return d;
  }
  function xlText(w, html){
    var d = document.createElement('div'); d.className = 'xl-txt'; d.innerHTML = html;
    w.appendChild(d); xlScroll(); return d;
  }
  function xlStepsBox(w, list){
    var d = document.createElement('div'); d.className = 'xl-steps open';
    d.innerHTML = '<div class="xl-steps-h" onclick="this.parentNode.classList.toggle(\'open\')">分析过程' +
      '<span style="font-weight:400;color:#e88543">共 ' + list.length + ' 步</span><span class="ar">v</span></div>' +
      '<div class="xl-steps-b">' + list.map(function(s){
        return '<div class="xl-st"><span class="dot">•</span><span class="tx">' + s + '</span></div>';
      }).join('') + '</div>';
    w.appendChild(d); xlScroll(); return d;
  }
  function xlStep(box, i, state){
    var el = box.querySelectorAll('.xl-st')[i]; if(!el) return;
    el.className = 'xl-st ' + state;
    el.querySelector('.dot').textContent = state === 'done' ? '√' : (state === 'run' ? '' : '•');
    xlScroll();
  }
  function xlToast(msg){
    var app = document.querySelector('.app'); if(!app) return;
    var t = document.createElement('div');
    t.style.cssText = 'position:absolute;left:50%;top:14px;transform:translateX(-50%);z-index:90;background:#54280a;' +
      'border:1px solid #9f4c14;color:#fbe8db;font-size:11.5px;padding:8px 16px;border-radius:20px;box-shadow:0 10px 26px rgba(31,36,48,.18)';
    t.textContent = msg; app.appendChild(t);
    setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, 2200);
  }

  
  var XL_HANDPICK = false;   // 是否为"直接勾选商家、找缺口"入口（定时重复必弹提醒）
  var XL_SCOPE = null;       // byRow入口下=用户直接勾选的商家对象集合；指标库/任务卡只在此范围内找缺口
  function xlBatch(){
    if(XL_BUSY) return;
    var s = xlScan();
    if(!s.list.length){ xlToast('请先勾选商家，或选择待办类型'); return; }
    XL_HANDPICK = !!s.byRow;
    xlOpen();
    xlPushUser(s.byRow ? ('帮我找到这 ' + s.list.length + ' 家商家的缺口并触达')
             : s.byUser ? ('帮我给有' + s.tds.map(function(id){ var mt = btMetric(id); return mt ? mt.name : id; }).join('/') + '任务的商家做一轮批量触达')
                        : '帮我圈出有缺口的商家，并做一轮批量触达');
    xlFlow(s);
  }
  function xlFlow(s){
    XL_BUSY = true;
    var w = xlPushAI();
    var box = xlStepsBox(w, s.byRow ? [
      '收到，正在分析你勾选的 ' + s.list.length + ' 家商家的过程指标缺口，深度诊断中请稍作等待……',
      '已识别出这批商家的缺口分布，请查看下方缺口清单。',
      '已按缺口项拆解触达任务并匹配话术模板，勾选要下发的缺口即可触达。'
    ] : [
      '目前用户需求触达指定活动的商家清单，正在调用商家数据信息，深度思考中请稍作等待……',
      '指定活动商家清单已生成完毕，请查看如下商家清单。',
      '已按缺口项拆解触达任务并匹配话术模板，可直接调整后下发。'
    ]);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 650);
    setTimeout(function(){
      xlStep(box, 1, 'done');
      xlListCard(w, s);
    }, 1350);
    setTimeout(function(){ xlStep(box, 2, 'run'); }, 1500);
    setTimeout(function(){
      xlStep(box, 2, 'done');
      xlTaskCard(w, s);
      XL_BUSY = false;
    }, 2200);
  }
  var XL_PICK = {};   // 名单卡片里被勾选的商家
  function xlListCard(w, s){
    XL_PICK = {};
    s.list.forEach(function(m){ XL_PICK[m.id] = 1; });
    var d = document.createElement('div'); d.className = 'xl-card'; d.id = 'xlList';
    d.innerHTML = '<div class="xl-card-h">' + (s.byRow ? '已分析 <b id="xlListN">' + s.list.length + '</b> 家商家的缺口' : '共产出 <b id="xlListN">' + s.list.length + '</b> 个商家名单') +
      '<span class="sp"></span><span class="lk" onclick="xlToast(\'已导出商家名单.xlsx\')">下载表格</span>' +
      '<span class="lk" onclick="xlFold(\'xlList\', this)">收起明细 ^</span></div>' +
      '<div class="xl-card-b">' +
        '<div class="xl-fil"><span class="fw">Seller ID / 店铺名<input id="xlKw" placeholder="请输入" oninput="xlFilter()"></span>' +
        '<span class="bt" onclick="xlFilter()">搜索</span><span class="rs" onclick="xlResetFil()">重制筛选</span></div>' +
        '<div class="xl-tblwrap"><table class="xl-tbl"><thead><tr><th style="width:34px"></th><th>店铺名</th><th>Seller ID</th><th>待补缺口</th></tr></thead><tbody id="xlListTb">' +
        s.list.map(function(m){
          var gs = m.gaps.length ? m.gaps.map(function(g){ var mt = btMetric(g); return '<span class="gp">' + (mt ? mt.name : g) + '</span>'; }).join('')
                                 : '<span class="gp ok">指标健康</span>';
          return '<tr data-id="' + m.id + '" data-kw="' + xlEsc(m.name + m.sid) + '">' +
            '<td><span class="xl-ck on" onclick="xlPickRow(\'' + m.id + '\',this)"></span></td>' +
            '<td class="nm">' + m.name + '</td><td>' + m.sid + '</td><td>' + gs + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
      '</div>';
    w.appendChild(d);
    xlText(w, s.byRow ? '以上是这 <b>' + s.list.length + '</b> 家商家的过程指标缺口。请在下方<b>触达任务编排</b>里勾选要下发的缺口任务，确认后点「批量触达」配置话术与发送。'
                       : s.byUser ? '当前已选择触达任务，可以继续选择更多触达任务。'
                        : '请选择需要触达的任务与商家。');
    xlScroll();
  }
  function xlFold(id, el){
    var c = document.getElementById(id); if(!c) return;
    c.classList.toggle('fold');
    el.innerHTML = c.classList.contains('fold') ? '展开明细 v' : '收起明细 ^';
  }
  function xlFilter(){
    var kw = (document.getElementById('xlKw') || {value:''}).value.trim();
    [].forEach.call(document.querySelectorAll('#xlListTb tr'), function(tr){
      tr.style.display = (!kw || tr.getAttribute('data-kw').indexOf(kw) > -1) ? '' : 'none';
    });
  }
  function xlResetFil(){ var e = document.getElementById('xlKw'); if(e) e.value = ''; xlFilter(); }
  function xlRefreshChecks(){
    [].forEach.call(document.querySelectorAll('#xlListTb tr'), function(tr){
      var id = tr.getAttribute('data-id');
      var ck = tr.querySelector('.xl-ck');
      if(ck) ck.classList.toggle('on', !!XL_PICK[id]);
    });
  }
  function xlPickRow(id, el){
    el.classList.toggle('on');
    if(el.classList.contains('on')) XL_PICK[id] = 1; else delete XL_PICK[id];
    var n = document.getElementById('xlListN'); if(n) n.textContent = Object.keys(XL_PICK).length;
    // 名单里去掉的商家，同步从各指标的触达人群里移除
    BT_TASK.forEach(function(mid){
      BT_SEL[mid] = (BT_SEL[mid] || []).filter(function(x){ return XL_PICK[x]; });
    });
    btRenderCards(); btUpdatePersons();
  }
  function xlTaskCard(w, s){
    // 直接勾选商家找缺口时，指标库/任务卡的商家范围收敛到这批商家；其余入口不限定
    XL_SCOPE = s.byRow ? s.list : null;
    // 按缺口项预填指标与触达人群
    BT_TASK = []; BT_SEL = {}; BT_SCRIPT = {}; BT_OPEN = {};
    var order = (s.byUser && s.tds && s.tds.length) ? s.tds : ['preN', 'redbag', 'coupon', 'material', 'recall'];
    if(s.byUser){
      order.forEach(function(id){
        var hit = s.list.filter(function(m){ return m.gaps.indexOf(id) > -1; }).map(function(m){ return m.id; });
        if(!hit.length) return;
        var mt = btMetric(id); if(!mt) return;
        BT_TASK.push(id); BT_SEL[id] = hit; BT_SCRIPT[id] = mt.script; BT_OPEN[id] = BT_TASK.length === 1;
      });
    }
    var d = document.createElement('div'); d.className = 'xl-card';
    d.innerHTML = '<div class="xl-card-h">触达任务编排<span style="font-weight:400;color:#e88543" id="btTaskCount"></span>' +
      '<span class="sp"></span><span class="lk">同一商家的多项任务会合并为一份专属清单</span></div>' +
      '<div class="xl-card-b">' +
        '<div class="bt-lib"><div class="bt-lib-h">指标库<small>点击 / 拖拽加入任务</small></div><div class="bt-lib-list" id="btLib"></div></div>' +
        '<div class="bt-canvas" id="btCanvas" ondragover="btDragOver(event)" ondragleave="document.getElementById(\'btCanvas\').classList.remove(\'drag\')" ondrop="btDrop(event)">' +
          '<div id="btCards"></div>' +
          '<div class="bt-empty" id="btEmpty">从指标库点击「+」加入指标，展开后逐个勾选商家并编辑话术</div>' +
        '</div>' +
        '<div class="xl-foot"><span class="btn-primary" onclick="xaBatchFromBt()">批量触达（<span id="btPersons">0</span> 家）</span>' +
        '<span class="note">点击后进入触达设置：话术、渠道、定时与发送预览</span></div>' +
      '</div>';
    w.appendChild(d);
    btRenderLib(); btRenderCards(); btUpdatePersons();
    xlScroll();
  }

  
  var XL_QA = []; // Query answers are provided by the evidence-based model in upgrade.js.
  function xlKey(e, id){ if(e.key === 'Enter' || e.keyCode === 13){ xlSend(id); } }
  function xlSend(id){
    var el = document.getElementById(id); if(!el) return;
    var v = (el.value || '').trim(); if(!v) return;
    el.value = ''; xlAsk(v);
  }
  function xlAsk(q){
    xlOpen();
    if(!xlChat().children.length) xlHello();
    xlPushUser(q);
    if(/名单|圈|触达|催|报名|未设置|不达标|覆盖/.test(q) && !/话术|模版|模板|费率|费用/.test(q)){
      var s = xlScan();
      if(!s.list.length){ xlText(xlPushAI(), '当前视图里没有命中的商家，换个条件再问我试试。'); return; }
      xlFlow(s);
      return;
    }
    var w = xlPushAI(), hit = null;
    for(var i = 0; i < XL_QA.length; i++){ if(XL_QA[i].k.test(q)){ hit = XL_QA[i]; break; } }
    var box = xlStepsBox(w, ['理解问题意图并检索规则库与你的商家数据……', '已找到相关口径，正在组织回答。']);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 500);
    setTimeout(function(){
      xlStep(box, 1, 'done');
      xlText(w, hit ? hit.a : '这个问题我先按现有数据回答：你可以在「认领明细」勾选目标商家后点<b>批量触达</b>，我会自动拆解缺口、匹配话术并生成个性化任务清单；需要我现在就圈一批商家吗？');
    }, 1050);
  }
  function btRenderLib(){
    var box=document.getElementById('btLib'); if(!box) return;
    var metrics=BT_METRICS;
    if(XL_SCOPE){
      var gapSet={};
      XL_SCOPE.forEach(function(m){ (m.gaps||[]).forEach(function(g){ gapSet[g]=1; }); });
      metrics=BT_METRICS.filter(function(mt){ return gapSet[mt.id]; });
      if(!metrics.length){
        box.innerHTML='<div class="bt-lib-empty">所选商家指标健康，暂无待补缺口，无需触达 </div>';
        return;
      }
    }
    box.innerHTML=metrics.map(function(mt){
      var added=BT_TASK.indexOf(mt.id)>-1;
      return '<div class="bt-chip'+(added?' added':'')+'" draggable="'+(added?'false':'true')+'" ondragstart="btDragStart(event,\''+mt.id+'\')" onclick="btAddMetric(\''+mt.id+'\')"><span class="bt-ic">'+mt.ic+'</span><span class="nm">'+mt.name+'</span><span class="add">'+(added?'√':'+')+'</span></div>';
    }).join('');
  }
  function btDragStart(e,id){ if(e.dataTransfer){ e.dataTransfer.setData('text/plain',id); e.dataTransfer.effectAllowed='copy'; } }
  function btDragOver(e){ e.preventDefault(); var c=document.getElementById('btCanvas'); if(c) c.classList.add('drag'); }
  function btDrop(e){ e.preventDefault(); var c=document.getElementById('btCanvas'); if(c) c.classList.remove('drag'); var id=e.dataTransfer?e.dataTransfer.getData('text/plain'):''; if(id) btAddMetric(id); }
  function btAddMetric(id){
    if(BT_TASK.indexOf(id)>-1){ btRemoveMetric(id); return; }
    var mt=btMetric(id); if(!mt) return;
    BT_TASK.push(id);
    // 默认全选所有有该任务缺口的商家（byRow入口限定在勾选的商家范围内）
    var pool=XL_SCOPE||BT_MERCHANTS;
    var hit=pool.filter(function(m){ return m.gaps.indexOf(id)>-1; });
    hit.forEach(function(m){ XL_PICK[m.id]=1; });
    BT_SEL[id]=hit.map(function(m){ return m.id; });
    BT_SCRIPT[id]=mt.script;
    BT_OPEN[id]=true;
    // 同步更新名单卡片里的勾选态
    var n=document.getElementById('xlListN'); if(n) n.textContent=Object.keys(XL_PICK).length;
    xlRefreshChecks();
    btRenderLib(); btRenderCards(); btUpdatePersons();
  }
  function btRemoveMetric(id,e){ if(e) e.stopPropagation(); var i=BT_TASK.indexOf(id); if(i>-1) BT_TASK.splice(i,1); delete BT_SEL[id]; delete BT_SCRIPT[id]; delete BT_OPEN[id]; btRenderLib(); btRenderCards(); btUpdatePersons(); }
  function btToggle(id){ BT_OPEN[id]=!BT_OPEN[id]; var c=document.querySelector('.bt-card[data-mid="'+id+'"]'); if(c) c.classList.toggle('open', BT_OPEN[id]); }
  function btToggleMerchant(mid,mrid,el){
    var arr=BT_SEL[mid]||(BT_SEL[mid]=[]); var i=arr.indexOf(mrid);
    if(i>-1){ arr.splice(i,1); el.classList.remove('on'); } else { arr.push(mrid); el.classList.add('on'); }
    var cnt=document.querySelector('.bt-card[data-mid="'+mid+'"] .bt-cnt b'); if(cnt) cnt.textContent=arr.length;
    btUpdatePersons();
  }
  function btScriptInput(id,val){ BT_SCRIPT[id]=val; }
  function btApplyTpl(id,ix){ if(ix===''||ix==null) return; var t=BT_TPL[+ix]; if(!t) return; BT_SCRIPT[id]=t.text; var ta=document.querySelector('.bt-card[data-mid="'+id+'"] textarea'); if(ta) ta.value=t.text; }
  function btSaveTpl(id){
    var txt=BT_SCRIPT[id]||''; if(!txt){ xlToast('话术为空，先写点内容再存'); return; }
    var mt=btMetric(id);
    var nm=(mt?mt.name:'我的话术')+' · 自定义'+(BT_TPL.length-1);
    BT_TPL.push({name:nm,text:txt});
    btRenderCards(); xlToast('已存为模板：'+nm);
  }
  function btRenderCards(){
    var box=document.getElementById('btCards'); var empty=document.getElementById('btEmpty'); if(!box) return;
    var tc=document.getElementById('btTaskCount');
    if(!BT_TASK.length){
      if(tc) tc.textContent=''; box.innerHTML='';
      if(empty){
        var healthy=false;
        if(XL_SCOPE){ healthy=!XL_SCOPE.some(function(m){ return (m.gaps||[]).length; }); }
        empty.textContent=healthy?'所选商家指标健康，暂无待补缺口，无需触达':'从指标库点击「+」加入指标，展开后逐个勾选商家并编辑话术';
        empty.style.display='block';
      }
      return;
    }
    if(empty) empty.style.display='none';
    if(tc) tc.textContent='· 共 '+BT_TASK.length+' 个指标';
    box.innerHTML=BT_TASK.map(function(id){
      var mt=btMetric(id); var sel=BT_SEL[id]||[];
      var pool=XL_SCOPE||BT_MERCHANTS;
      var merchants=pool.filter(function(mr){ return mr.gaps.indexOf(id)>-1; });
      var rows=merchants.map(function(mr){
        var on=sel.indexOf(mr.id)>-1;
        var rk=mfTdRule(mr.sid,id);
        return '<tr data-id="'+mr.id+'" data-mid="'+id+'" data-kw="'+(mr.name+mr.sid).toLowerCase()+'" data-rk="'+rk.rule.id+'"><td><span class="xl-ck'+(on?' on':'')+'" onclick="btToggleMerchant(\''+id+'\',\''+mr.id+'\',this)"></span></td><td class="nm">'+mr.name+'</td><td>'+mr.sid+'</td><td><span class="gp">'+mt.gap+'</span></td><td><span class="rk" title="'+rk.dt+'">'+rk.rule.n+'</span></td></tr>';
      }).join('');
      var rkOpts='<option value="">全部风险规则</option>'+MF_RULES.map(function(r){ return '<option value="'+r.id+'">'+r.n+'</option>'; }).join('');
      var open=BT_OPEN[id]?' open':'';
      return '<div class="bt-card'+open+'" data-mid="'+id+'">'+
        '<div class="bt-card-h" onclick="btToggle(\''+id+'\')"><span class="bt-ic">'+mt.ic+'</span><span class="bt-nm">'+mt.name+'</span><span class="bt-cnt"><b>'+sel.length+'</b> 家</span><span class="bt-x" title="移除指标" onclick="btRemoveMetric(\''+id+'\',event)">×</span><span class="bt-arw">›</span></div>'+
        '<div class="bt-card-b">'+
          '<div class="bt-tbl-h">共圈出 <b>'+merchants.length+'</b> 家「'+mt.name+'」商家<span class="sp"></span><span class="lk" onclick="xlToast(\'已导出名单.xlsx\')">下载表格</span><span class="lk" onclick="btToggle(\''+id+'\')">收起明细 ^</span></div>'+
          '<div class="bt-tbl-fil"><input class="bt-kw" data-mid="'+id+'" placeholder="Seller ID / 店铺名 请输入" oninput="btSearch(\''+id+'\')"><select class="bt-rk" data-mid="'+id+'" onchange="btSearch(\''+id+'\')">'+rkOpts+'</select><span class="bt" onclick="btSearch(\''+id+'\')">搜索</span><span class="rs" onclick="btResetSearch(\''+id+'\')">重制筛选</span></div>'+
          '<div class="bt-tbl-act"><span class="btn" onclick="btSelAll(\''+id+'\')">√ 全选</span><span class="btn" onclick="btClearSel(\''+id+'\')">清空勾选</span><span class="btn" onclick="btUpClick(\''+id+'\')">重新上传名单</span><input type="file" class="bt-up-file" accept=".xlsx,.xls,.csv" onchange="btUpFile(\''+id+'\',this)" style="display:none"></div>'+
          '<div class="bt-tbl-wrap"><table class="bt-tbl"><thead><tr><th style="width:34px"></th><th>店铺名</th><th>Seller ID</th><th>命中异常</th><th>命中风险规则</th></tr></thead><tbody>'+rows+'</tbody></table></div>'+
          '<div class="bt-tbl-ft">已选 <b class="bt-sel-n">'+sel.length+'</b> 家</div>'+
        '</div></div>';
    }).join('');
  }
  function btToggle(id){ BT_OPEN[id]=!BT_OPEN[id]; var c=document.querySelector('.bt-card[data-mid="'+id+'"]'); if(c) c.classList.toggle('open',BT_OPEN[id]); }
  function btToggleMerchant(mid,mrid,el){
    var arr=BT_SEL[mid]||(BT_SEL[mid]=[]); var i=arr.indexOf(mrid);
    if(i>-1){ arr.splice(i,1); el.classList.remove('on'); } else { arr.push(mrid); el.classList.add('on'); }
    var cnt=document.querySelector('.bt-card[data-mid="'+mid+'"] .bt-cnt b'); if(cnt) cnt.textContent=arr.length;
    var ft=document.querySelector('.bt-card[data-mid="'+mid+'"] .bt-sel-n'); if(ft) ft.textContent=arr.length;
    btUpdatePersons();
  }
  function btSelAll(mid){
    var card=document.querySelector('.bt-card[data-mid="'+mid+'"]'); if(!card) return;
    var arr=[]; card.querySelectorAll('tbody tr').forEach(function(tr){ if(tr.style.display!=='none'){ var id=tr.getAttribute('data-id'); arr.push(id); tr.querySelector('.xl-ck').classList.add('on'); }});
    BT_SEL[mid]=arr;
    var cnt=card.querySelector('.bt-cnt b'); if(cnt) cnt.textContent=arr.length;
    var ft=card.querySelector('.bt-sel-n'); if(ft) ft.textContent=arr.length;
    btUpdatePersons();
  }
  function btClearSel(mid){
    var card=document.querySelector('.bt-card[data-mid="'+mid+'"]'); if(!card) return;
    BT_SEL[mid]=[];
    card.querySelectorAll('.xl-ck').forEach(function(el){ el.classList.remove('on'); });
    var cnt=card.querySelector('.bt-cnt b'); if(cnt) cnt.textContent='0';
    var ft=card.querySelector('.bt-sel-n'); if(ft) ft.textContent='0';
    btUpdatePersons();
  }
  function btSearch(mid){
    var card=document.querySelector('.bt-card[data-mid="'+mid+'"]'); if(!card) return;
    var kw=(card.querySelector('.bt-kw')||{value:''}).value.trim().toLowerCase();
    var rk=(card.querySelector('.bt-rk')||{value:''}).value;
    card.querySelectorAll('tbody tr').forEach(function(tr){
      var okKw=!kw||tr.getAttribute('data-kw').indexOf(kw)>-1;
      var okRk=!rk||tr.getAttribute('data-rk')===rk;
      tr.style.display=(okKw&&okRk)?'':'none';
    });
  }
  function btResetSearch(mid){ var card=document.querySelector('.bt-card[data-mid="'+mid+'"]'); if(!card) return; var inp=card.querySelector('.bt-kw'); if(inp) inp.value=''; var sel=card.querySelector('.bt-rk'); if(sel) sel.value=''; btSearch(mid); }
  function btUpClick(id){ var f=document.querySelector('.bt-card[data-mid="'+id+'"] .bt-up-file'); if(f) f.click(); }
  function btUpFile(id,input){ if(!input.files||!input.files.length) return; xlToast('已解析名单：'+input.files[0].name+'，新增 0 家（示例）'); input.value=''; }
  function btUpdatePersons(){ var s={}; BT_TASK.forEach(function(id){ (BT_SEL[id]||[]).forEach(function(x){ s[x]=1; }); }); var e=document.getElementById('btPersons'); if(e) e.textContent=Object.keys(s).length; }

  
  function xaBatchFromBt(){
    if(XL_BUSY) return;
    var s = {}, arr = [];
    BT_TASK.forEach(function(id){ (BT_SEL[id]||[]).forEach(function(x){ s[x] = 1; }); });
    var ids = Object.keys(s);
    if(!ids.length){ xlToast('请先加入指标并勾选商家'); return; }
    var list = BT_MERCHANTS.filter(function(m){ return s[m.id]; });
    // 进入 xa 触达设置流程
    XA.key = BT_TASK[0] || 'signup';
    XA.label = BT_TASK.map(function(id){ var mt = btMetric(id); return mt ? mt.name : id; }).join('、');
    XA.list = list.map(function(m){ return {id: m.id, name: m.name, sid: m.sid}; });
    XA.pick = {}; XA.list.forEach(function(m){ XA.pick[m.id] = 1; });
    // 原始圈出名单 = 所有命中已加入指标缺口的商家全量池（用于判断是否减少了勾选）
    var full = {};
    BT_TASK.forEach(function(tid){ BT_MERCHANTS.forEach(function(m){ if(m.gaps.indexOf(tid) > -1) full[m.id] = 1; }); });
    XA.orig = Object.keys(full);
    // 逐指标判断是否减少了勾选：某商家在指标A被取消，但在指标B仍勾选时，扁平并集不变会漏判，因此按指标各自比对
    XA.taskReduced = false;
    BT_TASK.forEach(function(tid){
      var pool = BT_MERCHANTS.filter(function(m){ return m.gaps.indexOf(tid) > -1; });
      var sel = BT_SEL[tid] || [];
      if(sel.length < pool.length){ XA.taskReduced = true; return; }
      var ss = {}; sel.forEach(function(x){ ss[x] = 1; });
      for(var pi = 0; pi < pool.length; pi++){ if(!ss[pool[pi].id]){ XA.taskReduced = true; break; } }
    });
    // 直接勾选商家找缺口的入口：人群本身即为自定义名单，定时重复必须二次确认
    if(XL_HANDPICK) XA.taskReduced = true;
    XA.tone = 'pro'; XA.custom = false; XA.text = xaTone('pro').t;
    XA.chn = {'企业消息':1, '协作消息':1}; XA.when = 'now';
    XA.date = rcFmt(new Date()); XA.time = '09:30'; XA.rep = {}; XA.up = '';
    XA.prevMr = '';
    XA.tasks = BT_TASK.slice();
    XA.taskSel = {}; BT_TASK.forEach(function(id){ XA.taskSel[id] = (BT_SEL[id]||[]).slice(); });
    XL_BUSY = true;
    xlPushUser('就按有' + XA.label + '任务的 ' + list.length + ' 家商家做批量触达');
    var w = xlPushAI();
    var box = xlStepsBox(w, [
      '正在按「' + XA.label + '」缺口生成 AI 话术模版（可切换语气、也可自定义）……',
      '正在准备触达渠道、定时任务与发送预览。'
    ]);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 600);
    setTimeout(function(){
      xlStep(box, 1, 'done');
      xaSetCard(w);
      XL_BUSY = false;
    }, 1250);
  }

  
  var XA_MET = {
    signup:  {ic:'', name:'大促报名',   gap:'尚未报名好物节大促',  entry:'大促报名后台',     ded:'11/08'},
    coupon:  {ic:'', name:'消费券',     gap:'消费券尚未设置',    entry:'营销中心·消费券',   ded:'11/08'},
    redbag:  {ic:'', name:'店铺红包',   gap:'店铺红包尚未设置',  entry:'营销中心·店铺红包', ded:'11/08'},
    preN:    {ic:'', name:'前N报名',    gap:'前N 坑位尚未报名',  entry:'大促报名后台',     ded:'11/08'},
    material:{ic:'', name:'多素材覆盖', gap:'多素材覆盖不达标',  entry:'商品·素材中心',     ded:'11/10'},
    hot:     {ic:'', name:'竞价爆款',   gap:'缺少竞价爆款商品',  entry:'营销中心·竞价爆款', ded:'11/12'}
  };
  var XA_TONE = [
    {k:'pro',  n:'专业严谨', t:'您好 {商家名}，经系统核查，今日你有 {任务数量} 件任务未完成，请点击下方链接查看并尽快完成，以免影响店铺经营权益。'},
    {k:'warm', n:'亲切温和', t:'亲爱的 {商家名} 今日你还有 {任务数量} 件任务没完成哦～点击下方链接花几分钟就能搞定，有任何问题随时找我～'},
    {k:'urge', n:'紧迫催办', t:'{商家名}，今日你有 {任务数量} 件任务未完成，请立即点击下方链接查看并处理，避免错过关键节点！'}
  ];
  var XA_MY = [];        // 我的模版：用户自定义后可存为模版，支持多个
  var XA_MY_UID = 1;     // 递增 id
  function xaMyFind(id){ for(var i=0;i<XA_MY.length;i++) if(XA_MY[i].id===id) return XA_MY[i]; return null; }
  var XA_CHN = ['企业消息', '协作消息', '商家站内信'];
  var XA_REP = ['每日', '每个周一', '每个周二', '每个周三', '每个周四', '每个周五', '每个周六', '每个周日'];
  var XA = {key:'', label:'', list:[], pick:{}, content:'text', tone:'pro', text:'', custom:false, myId:'',
            chn:{'企业消息':1, '协作消息':1}, when:'now', date:'', time:'09:30', rep:{}, up:'', prevMr:''};
  function xaMet(){ return XA_MET[XA.key] || XA_MET.signup; }
  function xaTone(k){ for(var i=0;i<XA_TONE.length;i++) if(XA_TONE[i].k===k) return XA_TONE[i]; return XA_TONE[0]; }
  function xaTc(mr){ var nm = (mr && mr.name) || ''; return (nm.length * 3 + 2) % 5 + 1; }
  function xaMrTc(mr){
    if(!XA.tasks || !XA.tasks.length) return xaTc(mr);
    var c = 0;
    XA.tasks.forEach(function(id){ if(!XA.taskSel || !XA.taskSel[id] || XA.taskSel[id].indexOf(mr.id) >= 0) c++; });
    return c || 1;
  }
  function xaFill(txt, mr){
    var m = xaMet();
    var tc = xaMrTc(mr);
    return String(txt).replace(/\{商家名\}/g, mr.name).replace(/\{任务数量\}/g, tc)
      .replace(/\{缺口项\}/g, m.gap)
      .replace(/\{入口\}/g, m.entry).replace(/\{截止日\}/g, m.ded);
  }
  // 候选商家名：先取明细表里真实命中该缺口的商家，再用确定性店铺名补足到告警条数
  function xaNames(key, n, used){
    var pool = RC_BRAND['女鞋'] || ['商家'], combos = [], out = [], i, f, seed = key.length * 13 + 7;
    for(i = 0; i < key.length; i++) seed += key.charCodeAt(i);
    for(i = 0; i < pool.length; i++){ for(f = 0; f < RC_SUF.length; f++) combos.push(pool[i] + RC_SUF[f]); }
    for(i = combos.length - 1; i > 0; i--){
      var j = Math.floor(rcRnd(i * 17 + seed * 3 + 5) * (i + 1)) % (i + 1);
      var s = combos[i]; combos[i] = combos[j]; combos[j] = s;
    }
    for(i = 0; i < combos.length && out.length < n; i++){ if(!used[combos[i]]) out.push(combos[i]); }
    return out;
  }
  function xaBuild(key, n){
    var used = {}, list = [], st = ['预警', '风险', '预警', '安全'];
    [].slice.call(document.querySelectorAll('.mrow')).forEach(function(tr){
      if(list.length >= n) return;
      var td = tr.children, b = tr.querySelector('.mn b'), hit = false;
      if(!b) return;
      if(key === 'coupon')        hit = /未设置|未报名/.test(td[6].textContent) || xlPct(td[7]) < 60;
      else if(key === 'redbag')   hit = /未设置|待设置/.test(td[8].textContent) || xlPct(td[9]) < 60;
      else if(key === 'preN')     hit = /未设置|未报名/.test(td[10].textContent) || xlPct(td[11]) < 60;
      else if(key === 'material') hit = xlPct(td[5]) < 60;
      if(!hit) return;
      var nm = b.textContent;
      used[nm] = 1;
      list.push({id:'a' + (list.length + 1), name:nm, sid:xlSid(nm), real:1,
        st:td[2].textContent.indexOf('风险') > -1 ? '风险' : (td[2].textContent.indexOf('预警') > -1 ? '预警' : '安全')});
    });
    xaNames(key, n - list.length, used).forEach(function(nm, i){
      list.push({id:'a' + (list.length + 1), name:nm, sid:xlSid(nm), st:st[i % st.length]});
    });
    return list;
  }
  function xaPicked(){ return XA.list.filter(function(m){ return XA.pick[m.id]; }); }
  function xaFromAlert(key, el){
    if(XL_BUSY) return;
    if(!XA_MET[key]) return;
    var label = el ? (el.getAttribute('data-al') || XA_MET[key].name) : XA_MET[key].name;
    var b = el ? el.querySelector('.num') : null;
    var n = b ? (parseInt(b.textContent, 10) || 0) : 0;
    if(!n) n = 12;
    XA = {key:key, label:label, list:[], pick:{}, content:'text', tone:'pro', text:xaTone('pro').t, custom:false, myId:'',
          chn:{'企业消息':1, '协作消息':1}, when:'now', date:rcFmt(new Date()), time:'09:30', rep:{}, up:''};
    XA.list = xaBuild(key, n);
    XA.list.forEach(function(m){ XA.pick[m.id] = 1; });
    XA.orig = XA.list.map(function(m){ return m.id; });   // 初次圈出的原始名单
    XA.tasks = [key];
    XA.taskSel = {}; XA.taskSel[key] = XA.list.map(function(m){ return m.id; });
    xlOpen();
    if(!xlChat().children.length) xlHello();
    xlPushUser('帮我圈出' + label + '的商家');
    xaFlow();
  }
  function xaFlow(){
    XL_BUSY = true;
    var w = xlPushAI();
    var box = xlStepsBox(w, [
      '收到，正在解析「' + XA.label + '」告警口径，并按你认领的商家范围检索命中记录……',
      '已筛出 ' + XA.list.length + ' 家命中「' + XA.label + '」的商家，已作为首个待办指标加入任务编排。',
      '你可以继续从「指标库」增加其它待办指标，逐个勾选商家、编辑话术；确认后点「批量触达」统一发送。'
    ]);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 620);
    setTimeout(function(){ xlStep(box, 1, 'done'); xaTaskCard(w); }, 1300);
    setTimeout(function(){
      xlStep(box, 2, 'done');
      xlText(w, '已按「' + XA.label + '」圈出 <b>' + XA.list.length + '</b> 家商家，并加入任务编排（默认全选）。可在「指标库」<b>增加更多待办指标</b>，再点下方 <b>批量触达</b>统一配置话术、渠道与定时。');
      XL_BUSY = false;
    }, 1900);
  }
  
  function xaAlertPool(key){
    var others = BT_METRICS.map(function(m){ return m.id; }).filter(function(id){ return id !== key; });
    return XA.list.map(function(m){
      var gaps = [key], h = 0, i;
      for(i = 0; i < m.sid.length; i++) h = (h * 131 + m.sid.charCodeAt(i)) % 9973;
      others.forEach(function(oid, ix){ if((h + ix * 7) % 3 === 0) gaps.push(oid); });
      return {id:m.id, name:m.name, sid:m.sid, gaps:gaps,
        tag:(m.st || '预警') + ' · 命中' + XA.label};
    });
  }
  function xaTaskCard(w){
    XL_HANDPICK = false;                 // 告警入口＝全量告警商家，非手工勾选，定时重复仅在缩减人群时二次确认
    BT_MERCHANTS = xaAlertPool(XA.key);  // 商家池收敛为本次告警圈出的商家（携带缺口项，供再加指标时过滤）
    var s = {byUser:true, byRow:false, tds:[XA.key], list:BT_MERCHANTS};
    xlListCard(w, s);                    // 先出「共产出 N 个商家名单」明细卡（含待补缺口）
    xlTaskCard(w, s);                    // 再出「触达任务编排」，预置告警指标为首张任务卡
  }
  function xaRows(){
    return XA.list.map(function(m){
      return '<tr data-id="' + m.id + '" data-kw="' + xlEsc(m.name + m.sid) + '">' +
        '<td><span class="xl-ck' + (XA.pick[m.id] ? ' on' : '') + '" onclick="xaPick(\'' + m.id + '\',this)"></span></td>' +
        '<td class="nm">' + m.name + '</td><td>' + m.sid + '</td>' +
        '<td><span class="gp">' + XA.label + '</span></td></tr>';
    }).join('');
  }
  function xaListCard(w){
    var d = document.createElement('div'); d.className = 'xl-card'; d.id = 'xaList';
    d.innerHTML = '<div class="xl-card-h">共圈出 <b id="xaN">' + XA.list.length + '</b> 家「' + XA.label + '」商家' +
      '<span class="sp"></span><span class="lk" onclick="xlToast(\'已导出 ' + XA.label + '商家名单.xlsx\')">下载表格</span>' +
      '<span class="lk" onclick="xlFold(\'xaList\', this)">收起明细 ^</span></div>' +
      '<div class="xl-card-b">' +
        '<div class="xl-fil"><span class="fw">Seller ID / 店铺名<input id="xaKw" placeholder="请输入" oninput="xaFilter()"></span>' +
        '<span class="bt" onclick="xaFilter()">搜索</span><span class="rs" onclick="xaResetFil()">重制筛选</span></div>' +
        '<div class="xa-tools"><span class="xa-tb" onclick="xaAll(1)">√ 全选</span>' +
        '<span class="xa-tb" onclick="xaAll(0)">清空勾选</span>' +
        '<span class="xa-tb" onclick="xaUpZone()">重新上传名单</span></div>' +
        '<div class="xa-up" id="xaUp"><div class="tip">支持 <b>.xlsx / .csv</b>，需包含<b>店铺名</b>或<b>Seller ID</b> 列；上传后会与你认领的商家做匹配，范围外的自动过滤。</div>' +
          '<div class="xa-tools" style="margin:0"><span class="xa-tb" onclick="document.getElementById(\'xaFile\').click()">选择文件</span>' +
          '<span class="xa-tb" onclick="xaApplyUpload(\'我的触达名单.xlsx\')">使用示例名单</span></div>' +
          '<input type="file" id="xaFile" style="display:none" onchange="xaFileChg(this)"></div>' +
        '<div class="xl-tblwrap"><table class="xl-tbl"><thead><tr><th style="width:34px"></th><th>店铺名</th>' +
        '<th>Seller ID</th><th>命中异常</th></tr></thead><tbody id="xaTb">' + xaRows() + '</tbody></table></div>' +
        '<div class="xa-bar"><span class="n">已选 <b id="xaSel">' + XA.list.length + '</b> 家' +
        '<span id="xaUpTip"></span></span><span class="sp"></span>' +
        '<span class="btn-primary" onclick="xaBatch()">批量触达</span></div>' +
      '</div>';
    w.appendChild(d); xlScroll();
  }
  function xaSync(){
    var n = document.getElementById('xaN'), s = document.getElementById('xaSel');
    if(n) n.textContent = XA.list.length;
    if(s) s.textContent = xaPicked().length;
    var t = document.getElementById('xaUpTip');
    if(t) t.innerHTML = XA.up ? ' · 名单来源：<b style="color:#e47125">' + xlEsc(XA.up) + '</b>' : '';
    xaPrevRender();
    var btn = document.getElementById('xaSendBtn');
    if(btn) btn.innerHTML = '确认发送（' + xaPicked().length + ' 家）';
  }
  function xaPick(id, el){
    el.classList.toggle('on');
    if(el.classList.contains('on')) XA.pick[id] = 1; else delete XA.pick[id];
    xaSync();
  }
  function xaAll(on){
    XA.list.forEach(function(m){ if(on) XA.pick[m.id] = 1; else delete XA.pick[m.id]; });
    [].forEach.call(document.querySelectorAll('#xaTb .xl-ck'), function(ck){ ck.classList.toggle('on', !!on); });
    xaSync();
    xlToast(on ? ('已全选 ' + XA.list.length + ' 家商家') : '已清空勾选');
  }
  function xaFilter(){
    var kw = (document.getElementById('xaKw') || {value:''}).value.trim();
    [].forEach.call(document.querySelectorAll('#xaTb tr'), function(tr){
      tr.style.display = (!kw || tr.getAttribute('data-kw').indexOf(kw) > -1) ? '' : 'none';
    });
  }
  function xaResetFil(){ var e = document.getElementById('xaKw'); if(e) e.value = ''; xaFilter(); }
  function xaUpZone(){ var e = document.getElementById('xaUp'); if(e) e.classList.toggle('on'); }
  function xaFileChg(el){ var f = el.files && el.files[0]; if(f) xaApplyUpload(f.name); }
  function xaApplyUpload(fname){
    var raw = XA.list.length;
    var keep = Math.max(1, Math.round(raw * 0.6));
    XA.list = XA.list.slice(0, keep);
    XA.pick = {}; XA.list.forEach(function(m){ XA.pick[m.id] = 1; });
    XA.up = fname;
    var tb = document.getElementById('xaTb'); if(tb) tb.innerHTML = xaRows();
    var up = document.getElementById('xaUp'); if(up) up.classList.remove('on');
    xaResetFil(); xaSync();
    var w = xlPushAI();
    xlText(w, '已解析上传名单「<b>' + xlEsc(fname) + '</b>」：成功匹配 <b>' + keep + '</b> 家，' +
      (raw - keep) + ' 家不在你的认领范围内已过滤。名单已按上传结果更新，可继续勾选后批量触达。');
    xlToast('名单已更新 · ' + keep + ' 家');
  }
  function xaBatch(){
    var ids = xaPicked();
    if(!ids.length){ xlToast('请先勾选需要触达的商家'); return; }
    if(document.getElementById('xaSet')){ xaSync(); xlToast('已更新触达人群 · ' + ids.length + ' 家'); xlScroll(); return; }
    if(XL_BUSY) return;
    XL_BUSY = true;
    xlPushUser('就按这 ' + ids.length + ' 家商家做批量触达');
    var w = xlPushAI();
    var box = xlStepsBox(w, [
      '正在按「' + XA.label + '」缺口生成 AI 话术模版（可切换语气、也可自定义）……',
      '正在准备触达渠道、定时任务与发送预览。'
    ]);
    xlStep(box, 0, 'run');
    setTimeout(function(){ xlStep(box, 0, 'done'); xlStep(box, 1, 'run'); }, 600);
    setTimeout(function(){
      xlStep(box, 1, 'done');
      xaSetCard(w);
      XL_BUSY = false;
    }, 1250);
  }
  function xaSetCard(w){
    var old = document.getElementById('xaSet'); if(old) old.parentNode.removeChild(old);
    XA.text = XA.custom ? XA.text : (XA.content === 'text' ? xaTextTpl() : xaTone(XA.tone).t);
    var d = document.createElement('div'); d.className = 'xl-card'; d.id = 'xaSet';
    d.innerHTML = '<div class="xl-card-h">' + xaMet().ic + ' 触达设置 · ' + XA.label +
      '<span class="sp"></span><span class="lk" onclick="xlFold(\'xaSet\', this)">收起明细 ^</span></div>' +
      '<div class="xl-card-b">' +
        '<div class="xa-sec first"><div class="xa-sec-h">触达内容<small>选择商家收到的触达形态</small></div>' +
          '<div class="xa-chips" id="xaContentBox"></div></div>' +
        '<div class="xa-sec"><div class="xa-sec-h">话术<small id="xaTxtHint">AI 模版 · 选语气自动改写，也可直接编辑自定义</small>' +
          '<span class="lk" id="xaRegenLk" onclick="xaRegen()">换一版</span></div>' +
          '<div class="xa-chips" id="xaToneBox"></div>' +
          '<textarea id="xaTxt" oninput="xaTxtIn(this.value)">' + xlEsc(XA.text) + '</textarea>' +
          '<div class="xa-vars">可用变量：<b>{商家名}</b> <b>{任务数量}</b>（发送时按商家自动填充）' +
            '<span class="save" onclick="xaSaveAsMy()">存为「我的模版」</span></div></div>' +
        '<div class="xa-sec"><div class="xa-sec-h">触达渠道<small>可多选，按渠道优先级依次触达</small></div>' +
          '<div class="xa-chips" id="xaChnBox"></div></div>' +
        '<div class="xa-sec"><div class="xa-sec-h">定时任务<small>立即发送或指定时间下发</small></div>' +
          '<div class="xa-chips" id="xaWhenBox"></div>' +
          '<div class="xa-when off" id="xaPlan">' +
            '<div class="xa-wrow">发送时间' +
              '<input type="date" id="xaDate" value="' + XA.date + '" onchange="XA.date=this.value;xaSync()">' +
              '<input type="time" id="xaTime" value="' + XA.time + '" onchange="XA.time=this.value;xaSync()">' +
            '</div>' +
            '<div class="xa-wrow">重复<small>可多选，不选＝仅发一次</small></div>' +
            '<div class="xa-chips inline" id="xaRepBox"></div>' +
          '</div></div>' +
        '<div class="xa-sec" id="xaPrevSec"><div class="xa-sec-h">商家任务预览<small>商家侧打开的任务链接页面预览</small></div>' +
          '<div class="xa-prev" id="xaPrev"></div></div>' +
        '<div class="xl-foot"><span class="btn-primary" id="xaSendBtn" onclick="xaSend()">确认发送（' + xaPicked().length + ' 家）</span>' +
          '<span class="btn-ghost" onclick="xlToast(\'已保存为草稿，可稍后继续编辑\')">存为草稿</span>' +
          '<span class="note">发送后可在「触达回执日报」跟踪送达、回应与行动</span></div>' +
      '</div>';
    w.appendChild(d);
    xaRenderContent(); xaRenderTone(); xaRenderChn(); xaRenderWhen(); xaApplyContent(); xaSync(); xlScroll();
  }
  var XA_CONTENT = [
    {k:'text', n:'文字', d:'纯文字消息，罗列待办任务与报名方式'},
    {k:'diag', n:'文字+商家诊断日报', d:'文字附带经营诊断日报链接页'}
  ];
  function xaRenderContent(){
    var box = document.getElementById('xaContentBox'); if(!box) return;
    box.innerHTML = XA_CONTENT.map(function(c){
      return '<span class="xa-cp' + (XA.content === c.k ? ' on' : '') + '" title="' + c.d + '" onclick="xaSetContent(\'' + c.k + '\')">' + c.n + '</span>';
    }).join('');
  }
  // 报名/操作路径：统一跳商家端工作台，按任务带 target 区分入口
  var XA_QN_BASE = 'demo://workspace';
  function xaTaskUrl(id){ return XA_QN_BASE + '&target=' + id; }
  // 文字模式话术：问候（随语气改写）+ 逐条罗列待办任务（是什么、怎么报名、报名网址）
  function xaTextTasks(){
    var ids = (XA.tasks && XA.tasks.length) ? XA.tasks : [XA.key];
    var lines = [], seen = {}, i = 0;
    ids.forEach(function(id){
      var t = XA_TP_MAP[id]; if(!t || seen[id]) return; seen[id] = 1;
      var desc = String(t.d).replace(/<[^>]+>/g, '');
      i++;
      lines.push(i + '. 【' + t.lv + '】' + t.t + '：' + desc + '（' + t.mt + '）。' + t.go + '：' + xaTaskUrl(id));
    });
    return lines.join('\n');
  }
  function xaTextTpl(){
    // 问候语沿用当前语气模版，其后附待办任务清单与报名链接
    return xaTone(XA.tone).t + '\n\n请尽快处理以下待办：\n' + xaTextTasks();
  }
  function xaContentTxt(){ for(var i=0;i<XA_CONTENT.length;i++) if(XA_CONTENT[i].k===XA.content) return XA_CONTENT[i].n; return '文字'; }
  // 切换触达内容形态
  function xaSetContent(k){
    if(XA.content === k){ xaApplyContent(); return; }
    XA.content = k;
    // 切形态时，未自定义则按新形态重置话术模版
    if(!XA.custom){
      XA.text = (k === 'text') ? xaTextTpl() : xaTone(XA.tone).t;
      var ta = document.getElementById('xaTxt'); if(ta) ta.value = XA.text;
    }
    xaRenderContent(); xaRenderTone(); xaApplyContent(); xaSync();
  }
  // 根据当前形态调整界面：文字模式仅隐藏商家任务预览（语气仍可选）
  function xaApplyContent(){
    var isText = XA.content === 'text';
    var prev = document.getElementById('xaPrevSec'); if(prev) prev.style.display = isText ? 'none' : '';
    var hint = document.getElementById('xaTxtHint');
    if(hint) hint.textContent = isText
      ? 'AI 模版 · 选语气改写问候语，自动罗列待办任务与商家端报名链接'
      : 'AI 模版 · 选语气自动改写，也可直接编辑自定义';
  }
  function xaRenderTone(){
    var box = document.getElementById('xaToneBox'); if(!box) return;
    var tones = XA_TONE.map(function(t){
      return '<span class="xa-cp' + (!XA.custom && !XA.myId && XA.tone === t.k ? ' on' : '') + '" onclick="xaSetTone(\'' + t.k + '\')">' + t.n + '</span>';
    }).join('');
    var myItems = XA_MY.length
      ? XA_MY.map(function(m){
          return '<div class="xa-my-it' + (XA.myId===m.id?' on':'') + '" onclick="xaUseMy(\''+m.id+'\')">'
            +'<span class="nm" title="'+xlEsc(m.t)+'">'+xlEsc(m.name)+'</span>'
            +'<span class="x" title="删除该模版" onclick="xaDelMy(\''+m.id+'\',event)">×</span></div>';
        }).join('')
      : '<div class="xa-my-empty">还没有保存过模版。<br>点<b>自定义</b>写好话术后点<b>存为模版</b>即可保存，多份模版可复用。</div>';
    var my = '<span class="xa-my-wrap">'
      +'<span class="xa-cp my' + (XA.myId?' on':'') + '" onclick="xaMyToggle(this)">我的模版<span class="ct">('+XA_MY.length+')</span></span>'
      +'<span class="xa-my-pop" id="xaMyPop">'+myItems+'</span>'
      +'</span>';
    var custom = '<span class="xa-cp' + (XA.custom ? ' on' : '') + '" onclick="xaCustom()">自定义</span>';
    box.innerHTML = tones + my + custom;
  }
  function xaCustom(){
    // 点击「自定义」：清空话术框，进入自定义模式；同时收起「我的模版」高亮
    XA.custom = true; XA.myId = ''; XA.text = '';
    var ta = document.getElementById('xaTxt'); if(ta){ ta.value = ''; ta.focus(); }
    xaRenderTone(); xaSync();
  }
  function xaMyToggle(el){
    var pop = document.getElementById('xaMyPop'); if(!pop) return;
    var on = pop.classList.toggle('on');
    if(on){
      // 点外部关闭
      setTimeout(function(){
        var handler = function(e){
          if(!pop.contains(e.target) && e.target !== el){
            pop.classList.remove('on');
            document.removeEventListener('click', handler, true);
          }
        };
        document.addEventListener('click', handler, true);
      }, 0);
    }
  }
  function xaUseMy(id){
    var m = xaMyFind(id); if(!m) return;
    XA.custom = false; XA.myId = id; XA.text = m.t;
    var ta = document.getElementById('xaTxt'); if(ta) ta.value = m.t;
    var pop = document.getElementById('xaMyPop'); if(pop) pop.classList.remove('on');
    xaRenderTone(); xaSync();
    xlToast('已套用模版 · ' + m.name);
  }
  function xaDelMy(id, ev){
    if(ev){ ev.stopPropagation(); ev.preventDefault(); }
    var m = xaMyFind(id); if(!m) return;
    XA_MY = XA_MY.filter(function(x){ return x.id !== id; });
    if(XA.myId === id){ XA.myId = ''; XA.custom = true; }
    xaRenderTone();
    // 保持面板打开以便继续管理
    var pop = document.getElementById('xaMyPop'); if(pop) pop.classList.add('on');
    xlToast('已删除模版 · ' + m.name);
  }
  function xaSaveAsMy(){
    var v = (XA.text || '').trim();
    if(!v){ xlToast('话术为空，先写点内容再存'); return; }
    var def = '我的模版 ' + (XA_MY.length + 1);
    var name = window.prompt('给这个模版起个名字，方便复用：', def);
    if(name === null) return;
    name = (name || '').trim() || def;
    var id = 'my' + (XA_MY_UID++);
    XA_MY.push({id:id, name:name, t:v});
    // 存完只更新计数，不自动高亮 chip；用户主动点下拉挑到某条时才亮
    xaRenderTone(); xaSync();
    xlToast('已存为「' + name + '」·「我的模版」共 ' + XA_MY.length + ' 条可复用');
  }
  function xaTxtIn(v){
    XA.text = v;
    // 用户手改内容 => 进入自定义态，取消任何激活的「我的模版」
    XA.custom = true; XA.myId = '';
    xaRenderTone(); xaSync();
  }
  function xaRenderChn(){
    var box = document.getElementById('xaChnBox'); if(!box) return;
    box.innerHTML = XA_CHN.map(function(c){
      return '<span class="xa-cp' + (XA.chn[c] ? ' on' : '') + '" onclick="xaChn(\'' + c + '\')">' + c + '</span>';
    }).join('');
  }
  function xaRenderWhen(){
    var box = document.getElementById('xaWhenBox'); if(!box) return;
    box.innerHTML = ['now', 'plan'].map(function(k){
      return '<span class="xa-cp' + (XA.when === k ? ' on' : '') + '" onclick="xaWhen(\'' + k + '\')">' +
        (k === 'now' ? '立即发送' : '定时发送') + '</span>';
    }).join('');
    var p = document.getElementById('xaPlan'); if(p) p.classList.toggle('off', XA.when !== 'plan');
    xaRenderRep();
  }
  function xaRenderRep(){
    var box = document.getElementById('xaRepBox'); if(!box) return;
    box.innerHTML = XA_REP.map(function(r){
      return '<span class="xa-cp sm' + (XA.rep[r] ? ' on' : '') + '" onclick="xaRep(\'' + r + '\')">' + r + '</span>';
    }).join('');
  }
  function xaRep(k){
    if(XA.rep[k]) delete XA.rep[k];
    else {
      if(k === '每日') XA.rep = {};
      else delete XA.rep['每日'];
      XA.rep[k] = 1;
    }
    xaRenderRep(); xaSync();
  }
  function xaRepTxt(){
    return XA_REP.filter(function(r){ return XA.rep[r]; }).join('、');
  }
  function xaSetTone(k){
    XA.tone = k; XA.custom = false; XA.myId = '';
    XA.text = (XA.content === 'text') ? xaTextTpl() : xaTone(k).t;
    var ta = document.getElementById('xaTxt'); if(ta) ta.value = XA.text;
    xaRenderTone(); xaSync();
  }
  function xaRegen(){
    var i = 0;
    for(var j = 0; j < XA_TONE.length; j++) if(XA_TONE[j].k === XA.tone) i = j;
    xaSetTone(XA_TONE[(i + 1) % XA_TONE.length].k);
    xlToast('已换一版话术 · ' + xaTone(XA.tone).n);
  }
  function xaChn(c){
    if(XA.chn[c]){
      var on = XA_CHN.filter(function(x){ return XA.chn[x]; });
      if(on.length <= 1){ xlToast('至少保留一个触达渠道'); return; }
      delete XA.chn[c];
    } else XA.chn[c] = 1;
    xaRenderChn(); xaSync();
  }
  function xaWhen(k){ XA.when = k; xaRenderWhen(); xaSync(); }
  function xaChnTxt(){ return XA_CHN.filter(function(c){ return XA.chn[c]; }).join('、'); }
  function xaWhenTxt(){
    if(XA.when === 'now') return '立即发送';
    var r = xaRepTxt();
    return XA.date + ' ' + XA.time + (r ? ' · ' + r : '');
  }
  function xaPickPrevMr(ids){
    // 默认选「待办任务最多」的商家；保持已选（若仍在名单内）
    var cur = null, i;
    for(i = 0; i < ids.length; i++){ if(ids[i].id === XA.prevMr){ cur = ids[i]; break; } }
    if(cur) return cur;
    var best = ids[0];
    for(i = 1; i < ids.length; i++){ if(xaMrTc(ids[i]) > xaMrTc(best)) best = ids[i]; }
    XA.prevMr = best.id;
    return best;
  }
  function xaSetPrevMr(id){ XA.prevMr = id; xaPrevRender(); }
  function xaPrevSearch(kw){
    var sel = document.getElementById('tvSel'); if(!sel) return;
    var ids = xaPicked(), kl = kw.toLowerCase();
    var filtered = ids.filter(function(x){ return !kw || x.name.toLowerCase().indexOf(kl) > -1 || String(x.sid).indexOf(kl) > -1; });
    filtered.sort(function(a,b){ return xaMrTc(b) - xaMrTc(a); });
    sel.innerHTML = filtered.map(function(x){
      return '<option value="' + x.id + '"' + (x.id === XA.prevMr ? ' selected' : '') + '>' +
        xlEsc(x.name) + '（' + xaMrTc(x) + ' 项待办）</option>';
    }).join('');
    if(filtered.length && !filtered.some(function(x){ return x.id === XA.prevMr; })){
      XA.prevMr = filtered[0].id; xaPrevRender();
    }
  }
  var XA_TP_TASKS = [
    {lv:'必做', lvc:'must', t:'搜推素材优化',   d:'优化后建议完成后继续观察经营指标', mt:'距离截止 2 天', mtw:1, go:'去优化'},
    {lv:'必做', lvc:'must', t:'大促前N报名',    d:'抢占大促前 N 曝光坑位，建议完成后继续观察经营指标', mt:'距离截止 3 天', mtw:1, go:'去报名'},
    {lv:'建议', lvc:'sug',  t:'消费券报名',     d:'核对消费券适用条件，建议完成后继续观察经营指标', mt:'10月29日 – 11月15日', go:'去报名'},
    {lv:'建议', lvc:'sug',  t:'店铺红包设置',   d:'设置店铺红包提升进店转化与客单价', mt:'11月8日 截止', go:'去设置'},
    {lv:'可选', lvc:'opt',  t:'超值优选签约',   d:'平台重点扶持项目，可使用新品试销能力', mt:'10月29日 – 11月15日', go:'去签约'}
  ];
  var XA_TP_MAP = {
    signup:{lv:'必做',lvc:'must',t:'好物节大促报名',d:'报名参与大促核对活动要求与资源申请条件',mt:'距离截止 4 天',mtw:1,go:'去报名'},
    preN:{lv:'必做',lvc:'must',t:'大促前N报名',d:'抢占大促前 N 曝光坑位，建议完成后继续观察经营指标',mt:'距离截止 3 天',mtw:1,go:'去报名'},
    redbag:{lv:'建议',lvc:'sug',t:'店铺红包设置',d:'设置店铺红包提升进店转化与客单价',mt:'11月8日 截止',go:'去设置'},
    coupon:{lv:'建议',lvc:'sug',t:'消费券报名',d:'核对消费券适用条件，建议完成后继续观察经营指标',mt:'10月29日 – 11月15日',go:'去报名'},
    material:{lv:'必做',lvc:'must',t:'搜推素材优化',d:'优化后建议完成后继续观察经营指标',mt:'距离截止 2 天',mtw:1,go:'去优化'},
    hot:{lv:'建议',lvc:'sug',t:'竞价爆款设置',d:'设置竞价爆款商品获得流量扶持与坑位加权',mt:'8月12日 截止',go:'去设置'},
    newprod:{lv:'可选',lvc:'opt',t:'月均上新',d:'稳定上新有助人群拉新与搜索权重',mt:'11月15日 截止',go:'去上新'},
    live:{lv:'可选',lvc:'opt',t:'直播开播',d:'开播承接大促实时流量并提升转化',mt:'11月1日 前排期',go:'去开播'},
    recall:{lv:'必做',lvc:'must',t:'成交下滑召回',d:'已为您梳理专属提升方案，认领扶持资源',mt:'距离截止 5 天',mtw:1,go:'去认领'}
  };
  function xaTaskPage(m, mode){
    var tasks = '', tc = 0;
    if(XA.tasks && XA.tasks.length){
      XA.tasks.forEach(function(id){
        if(XA.taskSel && XA.taskSel[id] && XA.taskSel[id].indexOf(m.id) < 0) return;
        var t = XA_TP_MAP[id]; if(!t) return;
        tc++;
        tasks += '<div class="tp-task"><div class="h"><span class="lv ' + t.lvc + '">' + t.lv + '</span>' +
          '<span class="nm">' + t.t + '</span></div>' +
          '<div class="ds">' + t.d + '</div>' +
          '<div class="ft"><span class="mt' + (t.mtw ? ' warn' : '') + '">' + t.mt + '</span>' +
          '<span class="go">' + t.go + '</span></div></div>';
      });
    } else {
      tc = xaTc(m);
      for(var i = 0; i < tc; i++){
        var t = XA_TP_TASKS[i % XA_TP_TASKS.length];
        tasks += '<div class="tp-task"><div class="h"><span class="lv ' + t.lvc + '">' + t.lv + '</span>' +
          '<span class="nm">' + t.t + '</span></div>' +
          '<div class="ds">' + t.d + '</div>' +
          '<div class="ft"><span class="mt' + (t.mtw ? ' warn' : '') + '">' + t.mt + '</span>' +
          '<span class="go">' + t.go + '</span></div></div>';
      }
    }
    if(!tc) tc = 1;
    var kpis = '<div class="tp-kpis">' +
      '<div class="tp-kpi"><div class="k">新品橱窗打爆率</div><div class="v">50%</div><div class="p">近 7 日</div></div>' +
      '<div class="tp-kpi"><div class="k">优质多素材覆盖率</div><div class="v">55%</div><div class="p">本月</div></div>' +
      (mode === 'pc' ?
        '<div class="tp-kpi"><div class="k">搜索渠道转化率</div><div class="v">5%</div><div class="p">同比 +1%</div></div>' +
        '<div class="tp-kpi"><div class="k">真实体验分</div><div class="v">4.4</div><div class="p">本月</div></div>' : '') +
      '</div>';
    var overview = '<div class="tp-ov">' +
      '<div class="r rd">近 7 天新品橱窗打爆率 50%，低于行业均值 20pp…</div>' +
      '<div class="r am">本月真实体验分 4.4，持续降低将影响流量获取</div>' +
      '<div class="r gn">本月搜索渠道流量转化率 5%，同比上月上升 1%…</div>' +
      '<div class="r tip">今日有 <b>' + tc + '</b> 项待办可改善以上问题，详情见任务列表</div></div>';
    var tabs = '<div class="tp-tabs"><span class="tb on">全部</span><span class="tb">营销活动</span>' +
      '<span class="tb">直播运营</span><span class="tb">新品上市</span><span class="tb">素材管理</span></div>';
    var head = '<div class="tp-hd"><span class="tt">林舟给你的经营诊断</span>' +
      '<span class="mr"><span class="a"></span><span>' + xlEsc(m.name) + '</span>v</span></div>';
    var focus = '<div class="tp-sub">重点关注 · 4 大指标</div>' + kpis +
      (mode === 'pc' ? '' : '<div class="tp-more">展开全部 v</div>');
    var ovBlk = '<div class="tp-sub">概览</div>' + overview;
    var taskBlk = '<div class="tp-sub">林舟给你的待办任务（' + tc + '）</div>' + tabs + tasks;
    return head + focus + ovBlk + taskBlk;
  }
  function xaPrevRender(){
    var box = document.getElementById('xaPrev'); if(!box) return;
    var ids = xaPicked();
    if(!ids.length){ box.innerHTML = '<div class="xa-prev-h">请先在上方名单里勾选商家</div>'; return; }
    var m = xaPickPrevMr(ids);
    var opts = ids.slice().sort(function(a, b){ return xaMrTc(b) - xaMrTc(a); }).map(function(x){
      return '<option value="' + x.id + '"' + (x.id === m.id ? ' selected' : '') + '>' +
        xlEsc(x.name) + '（' + xaMrTc(x) + ' 项待办）</option>';
    }).join('');
    box.innerHTML = '<div class="xa-prev-h"><span>覆盖商家 <b>' + ids.length + '</b> 家</span>' +
      '<span>渠道 <b>' + xaChnTxt() + '</b></span><span>发送时间 <b>' + xaWhenTxt() + '</b></span>' +
      '<span>话术 <b>' + (XA.custom ? '自定义' : xaTone(XA.tone).n) + '</b></span></div>' +
      '<div class="tv-pick">查看商家：<input id="tvSch" placeholder="商家ID / 店铺名称" oninput="xaPrevSearch(this.value)" style="font-size:10px;border:1px solid #f8d8c3;border-radius:6px;padding:4px 8px;width:130px">' +
        '<select id="tvSel" onchange="xaSetPrevMr(this.value)">' + opts + '</select>' +
        '<span>默认展示待办最多的商家</span></div>' +
      '<div class="tv-devs">' +
        '<div><div class="tv-lbl">PC 端样式</div><div class="tv-pc">' +
          '<div class="tv-scr">' + xaTaskPage(m, 'pc') + '</div></div></div>' +
        '<div><div class="tv-lbl">移动端样式</div><div class="tv-mb">' +
          '<div class="tv-scr">' + xaTaskPage(m, 'mb') + '</div></div></div>' +
      '</div>';
  }
  
  var RC_H5_ACT = {
    '2026秋日好物节': 'signup',
    '秋季消费券专项':   'coupon',
    '店铺红包冲刺':     'redbag',
    '前N报名冲刺':      'preN',
    '初冬上新周':      'newprod'
  };
  // 该商家在 H5 里看到的待办：本次触达对应的任务置顶，其余按店铺名确定性派生
  function rcH5Tasks(r){
    var first = RC_H5_ACT[r.act] || 'signup';
    var pool = ['signup', 'preN', 'coupon', 'redbag', 'material', 'hot', 'newprod', 'live', 'recall'];
    var h = 0, i;
    for(i = 0; i < r.mer.length; i++) h = (h * 131 + r.mer.charCodeAt(i)) % 9973;
    var out = [first];
    for(i = 0; i < pool.length && out.length < 4; i++){
      if(pool[i] === first) continue;
      if((h + i * 17) % 3 === 0) out.push(pool[i]);
    }
    if(out.length < 2) out.push(pool[(h + 1) % pool.length] === first ? 'material' : pool[(h + 1) % pool.length]);
    return out;
  }
  function rcH5Page(r, mode){
    var ids = rcH5Tasks(r), tasks = '';
    ids.forEach(function(id){
      var t = XA_TP_MAP[id]; if(!t) return;
      tasks += '<div class="tp-task"><div class="h"><span class="lv ' + t.lvc + '">' + t.lv + '</span>' +
        '<span class="nm">' + t.t + '</span></div>' +
        '<div class="ds">' + t.d + '</div>' +
        '<div class="ft"><span class="mt' + (t.mtw ? ' warn' : '') + '">' + t.mt + '</span>' +
        '<span class="go">' + t.go + '</span></div></div>';
    });
    var tc = ids.length;
    var kpis = '<div class="tp-kpis">' +
      '<div class="tp-kpi"><div class="k">新品橱窗打爆率</div><div class="v">50%</div><div class="p">近 7 日</div></div>' +
      '<div class="tp-kpi"><div class="k">优质多素材覆盖率</div><div class="v">55%</div><div class="p">本月</div></div>' +
      (mode === 'pc' ?
        '<div class="tp-kpi"><div class="k">搜索渠道转化率</div><div class="v">5%</div><div class="p">同比 +1%</div></div>' +
        '<div class="tp-kpi"><div class="k">真实体验分</div><div class="v">4.4</div><div class="p">本月</div></div>' : '') +
      '</div>';
    var overview = '<div class="tp-ov">' +
      '<div class="r rd">近 7 天新品橱窗打爆率 50%，低于行业均值 20pp…</div>' +
      '<div class="r am">本月真实体验分 4.4，持续降低将影响流量获取</div>' +
      '<div class="r gn">本月搜索渠道流量转化率 5%，同比上月上升 1%…</div>' +
      '<div class="r tip">今日有 <b>' + tc + '</b> 项待办可改善以上问题，详情见任务列表</div></div>';
    var tabs = '<div class="tp-tabs"><span class="tb on">全部</span><span class="tb">营销活动</span>' +
      '<span class="tb">直播运营</span><span class="tb">新品上市</span><span class="tb">素材管理</span></div>';
    var head = '<div class="tp-hd"><span class="tt">林舟给你的经营诊断</span>' +
      '<span class="mr"><span class="a"></span><span>' + xlEsc(r.mer) + '</span>v</span></div>';
    var focus = '<div class="tp-sub">重点关注 · 4 大指标</div>' + kpis +
      (mode === 'pc' ? '' : '<div class="tp-more">展开全部 v</div>');
    var ovBlk = '<div class="tp-sub">概览</div>' + overview;
    var taskBlk = '<div class="tp-sub">林舟给你的待办任务（' + tc + '）</div>' + tabs + tasks;
    return head + focus + ovBlk + taskBlk;
  }
  function rcH5Open(i){
    var r = RC_PAGE[i]; if(!r) return;
    var box = document.getElementById('rcH5Body'); if(!box) return;
    box.innerHTML = '<div class="rch5-meta"><span>商家 <b>' + xlEsc(r.mer) + '</b></span>' +
        '<span>关联活动 <b>' + r.act + '</b></span><span>触达渠道 <b>' + r.chn + '</b></span>' +
        '<span>触达话术 <b>' + r.talk + '</b></span><span>触达时间 <b>' + r.t + '</b></span>' +
        '<span>发送状态 <b>' + r.st + '</b></span></div>' +
      '<div class="tv-devs rch5-devs">' +
        '<div><div class="tv-lbl">PC 端样式</div><div class="tv-pc">' +
          '<div class="tv-scr">' + rcH5Page(r, 'pc') + '</div></div></div>' +
        '<div><div class="tv-lbl">移动端样式</div><div class="tv-mb">' +
          '<div class="tv-scr">' + rcH5Page(r, 'mb') + '</div></div></div>' +
      '</div>';
    var m = document.getElementById('rcH5Mask'); if(m) m.classList.add('open');
  }
  function rcH5Close(){ var m = document.getElementById('rcH5Mask'); if(m) m.classList.remove('open'); }

  // 名单是否较初次圈出结果发生更改：重新上传名单，或减少/改变了勾选
  function xaModified(){
    if(XA.up) return true;
    if(XA.taskReduced) return true;
    if(!XA.orig) return false;
    var picked = xaPicked();
    if(picked.length !== XA.orig.length) return true;
    var set = {}; picked.forEach(function(m){ set[m.id] = 1; });
    for(var i = 0; i < XA.orig.length; i++){ if(!set[XA.orig[i]]) return true; }
    return false;
  }
  function xaSend(){
    var ids = xaPicked();
    if(!ids.length){ xlToast('请先勾选需要触达的商家'); return; }
    if(!(XA.text || '').trim()){ xlToast('话术不能为空'); return; }
    // 定时发送 + 名单已更改：二次确认，避免对更改后的人群反复定时触达
    if(XA.when === 'plan' && xaModified()){ xaWarnOpen(ids.length); return; }
    xaDoSend();
  }
  function xaWarnOpen(n){
    var d = document.getElementById('xaWarnDetail');
    if(d) d.innerHTML = '定时规则：<b style="color:#e47125">' + xaWhenTxt() + '</b>' +
      (XA.up ? '，名单来源已切换为上传名单「<b>' + xlEsc(XA.up) + '</b>」' : '，您已调整过勾选范围') +
      '，系统将在每个触发时点，对当前这 <b>' + n + '</b> 家商家重复下发同一触达。';
    var m = document.getElementById('xaWarnMask'); if(m) m.classList.add('open');
  }
  function xaWarnClose(){ var m = document.getElementById('xaWarnMask'); if(m) m.classList.remove('open'); }
  function xaWarnGo(){ xaWarnClose(); xaDoSend(); }
  function xaDoSend(){
    var ids = xaPicked();
    var w = xlPushAI();
    xlText(w, '本次触达商家 <b>' + ids.length + '</b> 家，稍后可在<b>触达回执</b>中查看触达情况。');
    xlText(w, '<span style="font-size:10px;color:#e88543">异常项：' + XA.label + ' · 内容形态：' + xaContentTxt() +
      ' · 渠道：' + xaChnTxt() +
      ' · 发送时间：' + xaWhenTxt() + ' · 话术：' + (XA.custom ? '自定义' : xaTone(XA.tone).n) + '</span>');
    xlToast(XA.when === 'now' ? ('已提交触达 · ' + ids.length + ' 家') : ('已加入定时队列 · ' + xaWhenTxt()));
  }

  // ===== 商家明细筛选：商家ID / 店铺名称 / 健康度 / 规模分层 / T层级 / 待办类型（多选）/ 异常原因（多选）/ 是否建联 / 是否认领 =====
  var MF_TD = {};   // 选中的待办类型 metricId
  var MF_RK = {};   // 选中的异常原因 ruleId（策略中心风险规则）
  var MF_LNK = {};  // 选中的建联状态
  var MF_CLM = {};  // 选中的认领状态
  var MF_LNK_OPTS = ['是', '否'];
  var MF_CLM_OPTS = ['自己认领', '他人认领', '未认领'];
  // 商家明细命中待办的原因 = 策略中心配置的风险规则（此处采用其中 3 条）
  var MF_RULES = [RISK_RULES[0], RISK_RULES[1], RISK_RULES[2]]; // 目标进度偏离异常 / 环比波动异常 / 低于绝对阈值
  function mfRuleName(id){ var i; for(i = 0; i < MF_RULES.length; i++) if(MF_RULES[i].id === id) return MF_RULES[i].n; return id; }
  // 某商家 × 某待办类型命中的风险规则（mock：确定性哈希，保证每次刷新一致）
  function mfTdRule(sid, tdKey){
    var h = alHash(sid + '#' + tdKey), r = MF_RULES[h % MF_RULES.length], dt;
    if(r.id === 'devi'){
      var plan = 60 + h % 20, pace = 28 + h % 24;
      dt = '时间进度 ' + plan + '%，实际完成 ' + pace + '%，偏离 ' + (plan - pace) + 'pt';
    } else if(r.id === 'mom'){
      dt = '较上周环比 -' + (8 + h % 14) + '.' + (h % 10) + '%，连续 ' + (2 + h % 3) + ' 周下滑';
    } else {
      dt = '当前值低于策略中心设定的绝对阈值线';
    }
    return {rule:r, dt:dt};
  }
  // 展开某商家行时，列出其命中待办的原因（受待办类型 / 异常原因筛选联动）
  function mfExpHtml(tr){
    var sid = tr.dataset.sid;
    var tds = (tr.dataset.td || '').split(',').filter(function(x){ return x; });
    var selTd = Object.keys(MF_TD);
    if(selTd.length) tds = tds.filter(function(t){ return selTd.indexOf(t) > -1; });
    var selRk = Object.keys(MF_RK);
    var lines = tds.map(function(t){
      var r = mfTdRule(sid, t);
      if(selRk.length && selRk.indexOf(r.rule.id) < 0) return '';
      var mt = btMetric(t), nm = mt ? mt.name : t;
      return '<div class="mx-ln"><span class="mx-td">' + nm + '</span>' +
        '<span class="mx-rk">' + r.rule.n + '</span>' +
        '<span class="mx-dt">' + r.dt + '</span></div>';
    }).filter(function(x){ return x; }).join('');
    var cap = '<div class="mx-cap">命中待办的原因 · 风险规则来自<b>策略中心</b>' +
      (selTd.length ? ' · 已按所选待办类型过滤' : '') +
      (selRk.length ? ' · 已按所选异常原因过滤' : '') + '</div>';
    return cap + (lines || '<div class="mx-none">当前筛选条件下该商家无命中原因</div>');
  }
  function mfExp(btn){
    var tr = btn.parentNode; while(tr && tr.className.indexOf('mrow') < 0) tr = tr.parentNode;
    if(!tr) return;
    var exp = tr.nextSibling;
    while(exp && exp.nodeType !== 1) exp = exp.nextSibling;
    if(!exp || exp.className.indexOf('mexp') < 0) return;
    var open = tr.classList.toggle('exp');
    if(open){
      exp.getElementsByClassName('mx')[0].innerHTML = mfExpHtml(tr);
      exp.style.display = ''; btn.innerHTML = '原因 &#9662;';
    } else {
      exp.style.display = 'none'; btn.innerHTML = '原因 &#9656;';
    }
  }
  function mfScaleOf(gmv){ return gmv >= 300 ? '头部' : (gmv >= 100 ? '腰部' : '长尾'); }
  function mfInit(){
    [].slice.call(document.querySelectorAll('.mrow')).forEach(function(tr, i){
      var td = tr.children;
      var nb = tr.querySelector('.mn b');
      var name = nb ? nb.textContent : ('商家' + (i + 1));
      var sid = xlSid(name);
      var hp = td[2].textContent.indexOf('风险') > -1 ? '风险'
             : (td[2].textContent.indexOf('预警') > -1 ? '预警' : '安全');
      var gmv = parseFloat((td[3].textContent || '').replace('万', '')) || 0;
      var tier = (tr.querySelector('.ttag') || {}).textContent || '';
      var yoy = (td[4] ? td[4].textContent : '').trim();
      var tds = [];
      if(/未设置|未报名/.test(td[6].textContent) || xlPct(td[7]) < 60) tds.push('coupon');
      if(/未设置|待设置/.test(td[8].textContent) || xlPct(td[9]) < 60) tds.push('redbag');
      if(/未设置|未报名/.test(td[10].textContent) || xlPct(td[11]) < 60) tds.push('preN');
      if(xlPct(td[5]) < 60) tds.push('material');
      if(yoy.charAt(0) === '-') tds.push('recall');
      if(i % 3 === 0) tds.push('newprod');   // 上新/开播暂无透出列，按行序确定性派生
      if(i % 4 === 1) tds.push('live');
      tr.dataset.sid = sid; tr.dataset.nm = name; tr.dataset.hp = hp;
      tr.dataset.scale = mfScaleOf(gmv); tr.dataset.tier = tier;
      tr.dataset.td = tds.join(',');
      // 是否建联 & 认领状态（确定性 mock）
      var lnkH = alHash(sid + '#lnk');
      tr.dataset.linked = lnkH % 3 === 0 ? '否' : '是';
      var clmH = alHash(sid + '#clm');
      tr.dataset.claim = MF_CLM_OPTS[clmH % MF_CLM_OPTS.length];
      var it = tr.querySelector('.mn i');
      if(it && !tr.querySelector('.sidtag')){
        var s = document.createElement('span'); s.className = 'sidtag'; s.textContent = 'ID ' + sid;
        it.appendChild(s);
      }
    });
    mfRenderTd();
    mfRkRender();
    mfLnkRender();
    mfClmRender();
  }
  function mfRenderTd(){
    var box = document.getElementById('todoOpts');
    if(box) box.innerHTML = BT_METRICS.map(function(m){
      return '<span class="opt' + (MF_TD[m.id] ? ' on' : '') + '" onclick="mfTd(\'' + m.id + '\')">' +
        m.ic + ' ' + m.name + '</span>';
    }).join('');
    var ks = Object.keys(MF_TD), n = ks.length;
    var btn = document.getElementById('mfTdBtn');
    if(btn){
      btn.innerHTML = '待办类型：' + (n ? (n === 1 ? btMetric(ks[0]).name : '已选') : '全部') +
        (n > 1 ? '<span class="nbadge">' + n + '</span>' : '') + ' <span class="pk-caret">&#9662;</span>';
      btn.classList.toggle('act', n > 0);
    }
  }
  function mfTd(id){
    if(MF_TD[id]) delete MF_TD[id]; else MF_TD[id] = 1;
    mfRenderTd(); mfGo(); mfAutoSel();
  }
  function mfTdAll(on){
    MF_TD = {};
    if(on) BT_METRICS.forEach(function(m){ MF_TD[m.id] = 1; });
    mfRenderTd(); mfGo(); mfAutoSel();
  }
  function mfRkRender(){
    var box = document.getElementById('riskOpts');
    if(box) box.innerHTML = MF_RULES.map(function(r){
      return '<span class="opt' + (MF_RK[r.id] ? ' on' : '') + '" onclick="mfRk(\'' + r.id + '\')">' +
        r.n + '</span>';
    }).join('');
    var ks = Object.keys(MF_RK), n = ks.length;
    var btn = document.getElementById('mfRkBtn');
    if(btn){
      btn.innerHTML = '异常原因：' + (n ? (n === 1 ? mfRuleName(ks[0]) : '已选') : '全部') +
        (n > 1 ? '<span class="nbadge">' + n + '</span>' : '') + ' <span class="pk-caret">&#9662;</span>';
      btn.classList.toggle('act', n > 0);
    }
  }
  function mfRk(id){
    if(MF_RK[id]) delete MF_RK[id]; else MF_RK[id] = 1;
    mfRkRender(); mfGo();
  }
  function mfRkAll(on){
    MF_RK = {};
    if(on) MF_RULES.forEach(function(r){ MF_RK[r.id] = 1; });
    mfRkRender(); mfGo();
  }
  // ===== 是否建联 多选筛选 =====
  function mfLnkRender(){
    var box = document.getElementById('lnkOpts');
    if(box) box.innerHTML = MF_LNK_OPTS.map(function(o){
      return '<span class="opt' + (MF_LNK[o] ? ' on' : '') + '" onclick="mfLnk(\'' + o + '\')">' + o + '</span>';
    }).join('');
    var ks = Object.keys(MF_LNK), n = ks.length;
    var btn = document.getElementById('mfLnkBtn');
    if(btn){
      btn.innerHTML = '是否建联：' + (n ? (n === 1 ? ks[0] : '已选') : '全部') +
        (n > 1 ? '<span class="nbadge">' + n + '</span>' : '') + ' <span class="pk-caret">&#9662;</span>';
      btn.classList.toggle('act', n > 0);
    }
  }
  function mfLnk(v){
    if(MF_LNK[v]) delete MF_LNK[v]; else MF_LNK[v] = 1;
    mfLnkRender(); mfGo();
  }
  function mfLnkAll(on){
    MF_LNK = {};
    if(on) MF_LNK_OPTS.forEach(function(o){ MF_LNK[o] = 1; });
    mfLnkRender(); mfGo();
  }
  // ===== 是否认领 多选筛选 =====
  function mfClmRender(){
    var box = document.getElementById('clmOpts');
    if(box) box.innerHTML = MF_CLM_OPTS.map(function(o){
      return '<span class="opt' + (MF_CLM[o] ? ' on' : '') + '" onclick="mfClm(\'' + o + '\')">' + o + '</span>';
    }).join('');
    var ks = Object.keys(MF_CLM), n = ks.length;
    var btn = document.getElementById('mfClmBtn');
    if(btn){
      btn.innerHTML = '是否认领：' + (n ? (n === 1 ? ks[0] : '已选') : '全部') +
        (n > 1 ? '<span class="nbadge">' + n + '</span>' : '') + ' <span class="pk-caret">&#9662;</span>';
      btn.classList.toggle('act', n > 0);
    }
  }
  function mfClm(v){
    if(MF_CLM[v]) delete MF_CLM[v]; else MF_CLM[v] = 1;
    mfClmRender(); mfGo();
  }
  function mfClmAll(on){
    MF_CLM = {};
    if(on) MF_CLM_OPTS.forEach(function(o){ MF_CLM[o] = 1; });
    mfClmRender(); mfGo();
  }
  // 点击待办类型后自动勾选所有筛选出的商家
  function mfAutoSel(){
    var hasTd = Object.keys(MF_TD).length > 0;
    document.querySelectorAll('.mrow').forEach(function(tr){
      var vis = hasTd && !tr.classList.contains('mhide');
      tr.classList.toggle('sel', vis);
      var ck = tr.querySelector('.rowck'); if(ck) ck.classList.toggle('on', vis);
    });
    updateSel();
  }
  function mfVal(id){ var e = document.getElementById(id); return e ? (e.value || '').trim() : ''; }
  function mfGo(){
    var sid = mfVal('mfSid'), nm = mfVal('mfName').toLowerCase();
    var hp = mfVal('mfHp'), sc = mfVal('mfScale'), ti = mfVal('mfTier');
    var tds = Object.keys(MF_TD), rks = Object.keys(MF_RK);
    var lnks = Object.keys(MF_LNK), clms = Object.keys(MF_CLM);
    [].slice.call(document.querySelectorAll('.mrow')).forEach(function(tr){
      var ok = true, mine = (tr.dataset.td || '').split(',').filter(function(x){ return x; });
      if(sid && tr.dataset.sid.indexOf(sid) < 0) ok = false;
      if(ok && nm && tr.dataset.nm.toLowerCase().indexOf(nm) < 0) ok = false;
      if(ok && hp && tr.dataset.hp !== hp) ok = false;
      if(ok && sc && tr.dataset.scale !== sc) ok = false;
      if(ok && ti && tr.dataset.tier !== ti) ok = false;
      if(ok && tds.length){
        ok = tds.some(function(t){ return mine.indexOf(t) > -1; });
      }
      if(ok && rks.length){
        // 异常原因筛选：在（可选的）待办类型范围内，命中所选风险规则任一即入选
        var scope = tds.length ? mine.filter(function(t){ return tds.indexOf(t) > -1; }) : mine;
        ok = scope.some(function(t){ return rks.indexOf(mfTdRule(tr.dataset.sid, t).rule.id) > -1; });
      }
      if(ok && lnks.length){
        ok = lnks.indexOf(tr.dataset.linked) > -1;
      }
      if(ok && clms.length){
        ok = clms.indexOf(tr.dataset.claim) > -1;
      }
      tr.classList.toggle('mhide', !ok);
      if(!ok){ tr.classList.remove('sel'); var ck0=tr.querySelector('.rowck'); if(ck0) ck0.classList.remove('on'); }
    });
    updateSel();
    ['mfHpWrap:mfHp', 'mfScaleWrap:mfScale', 'mfTierWrap:mfTier'].forEach(function(pair){
      var p = pair.split(':'), w = document.getElementById(p[0]);
      if(w) w.classList.toggle('act', !!mfVal(p[1]));
    });
    // 筛选变化后，刷新已展开行的原因明细（与待办类型 / 异常原因联动）
    [].slice.call(document.querySelectorAll('.mrow.exp')).forEach(function(tr){
      var exp = tr.nextSibling; while(exp && exp.nodeType !== 1) exp = exp.nextSibling;
      if(exp && exp.className.indexOf('mexp') > -1) exp.getElementsByClassName('mx')[0].innerHTML = mfExpHtml(tr);
    });
    mPage(1);
  }

  // ===== 明细分页：每页 5 家（只对筛选命中的商家分页） =====
  var mpCurPage = 1;
  var mpSize = 5;
  function mfRows(){
    return [].slice.call(document.querySelectorAll('.mrow')).filter(function(tr){
      return !tr.classList.contains('mhide');
    });
  }
  function mfExpOf(tr){
    var e = tr.nextSibling; while(e && e.nodeType !== 1) e = e.nextSibling;
    return (e && e.className && e.className.indexOf('mexp') > -1) ? e : null;
  }
  function mPage(p){
    [].slice.call(document.querySelectorAll('.mrow.mhide')).forEach(function(tr){
      tr.style.display = 'none';
      var e = mfExpOf(tr); if(e) e.style.display = 'none';
    });
    var rows = mfRows();
    var total = Math.ceil(rows.length / mpSize) || 1;
    if(p < 1) p = 1; if(p > total) p = total;
    mpCurPage = p;
    rows.forEach(function(tr, i){
      var page = Math.floor(i / mpSize) + 1, show = (page === p);
      tr.style.display = show ? '' : 'none';
      var e = mfExpOf(tr);
      if(e) e.style.display = (show && tr.classList.contains('exp')) ? '' : 'none';
    });
    var cur = document.getElementById('mpCur'); if(cur) cur.textContent = p;
    var tp = document.getElementById('mpTotal'); if(tp) tp.textContent = total;
    var cnt = document.getElementById('mpCnt'); if(cnt) cnt.textContent = rows.length;
    var fil = document.getElementById('mpFil');
    if(fil) fil.textContent = (rows.length === document.querySelectorAll('.mrow').length) ? '' : ' · 已筛选';
    var nums = document.getElementById('mpNums');
    if(nums){
      var h = '';
      for(var k = 1; k <= total; k++)
        h += '<span class="mp-num' + (k === p ? ' on' : '') + '" onclick="mPage(' + k + ')">' + k + '</span>';
      nums.innerHTML = h;
    }
  }
  mfInit();     // 商家明细：打标 商家ID/规模分层/T层级/待办类型，并渲染待办类型多选项
  mPage(1);
  setRole(2);   // 默认进入运营专员视角
  mtInit();     // 指标统计周期：默认近 30 天（截至底表更新日 8.10）
  rcInit();     // 触达回执日报：默认统计周期 今日 — 今日
  xlRenderGuess();  // 小策窄栏：猜你想问
