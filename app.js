/* フロンティアAI（ミュトス）脅威対策 対応ダッシュボード */
const SCOLORS={1:'#ef4444',2:'#f59e0b',3:'#eab308',4:'#84cc16',5:'#22c55e'};
const STEP_LABEL={1:'未着手',2:'着手',3:'一部対応',4:'概ね対応',5:'完了/最適化'};
const TODAY=new Date('2026-06-11');

// 進捗ステータス（完了/対応中/未着手）
const ST={done:{label:'完了',color:'#22c55e'},prog:{label:'対応中',color:'#f59e0b'},todo:{label:'未着手',color:'#6b7595'}};
function progStatus(score){ return score===5?ST.done : (score>=2?ST.prog:ST.todo); }

// 5ステップ（旧：弊社の主なご支援領域）
const STEPS=[
 {key:'C',num:'STEP 1',name:'Consult',full:'戦略・ガバナンス',color:'#3da9fc',desc:'リスク評価、優先順位付け、ロードマップ策定'},
 {key:'M',num:'STEP 2',name:'Modernize',full:'技術負債解消',color:'#7c5cff',desc:'レガシー刷新、クラウド移行、自動化対策'},
 {key:'P',num:'STEP 3',name:'Protect',full:'防御強化',color:'#22c55e',desc:'SOC、MDR、脆弱性管理、ゼロトラスト対策'},
 {key:'R',num:'STEP 4',name:'Recover',full:'レジリエンス強化',color:'#f59e0b',desc:'BCP/DR、サイバー復旧、演習、対策'},
 {key:'O',num:'STEP 5',name:'Operate',full:'継続運用',color:'#ec4899',desc:'24x365運用(CDOC)、パッチ適用、ベンダー連携'}
];
const DOMAINS={}; STEPS.forEach(s=>DOMAINS[s.key]={name:s.name,full:s.full,color:s.color,desc:s.desc});

const ITEMS=[
 {id:1,title:'フロンティアAIへの対応を経営課題として扱う',short:'①経営課題化',dom:'C',
  deadline:'2026-06-30',owner:'樋口',
  measures:['経営会議・定例会で定期的にリスク報告','AI起因のサイバーリスクを経営リスクに追加','全社横断の対応タスクフォース・責任者を任命'],
  support:['経営向けAIサイバーリスクアセスメント','全社対応ロードマップ策定','ガバナンス体制設計支援']},
 {id:2,title:'優先的に対応すべきサービス／ITシステムを特定する',short:'②優先資産特定',dom:'C',
  deadline:'2026-06-30',owner:'担当A',
  measures:['重要業務システムを棚卸し','顧客影響・業務影響で優先順位付け','重要資産の管理台帳を整備'],
  support:['アプリケーション／インフラ棚卸し','ビジネス影響分析（BIA）実施','優先順位付けワークショップ実施']},
 {id:3,title:'特定した資産の技術負債を解消しておく',short:'③技術負債解消',dom:'M',
  deadline:'2026-09-30',owner:'担当B',
  measures:['サポート切れOS・ミドルウェアを刷新','老朽化システムの更改を前倒し','不要なシステムや機能を廃止'],
  support:['技術負債診断','モダナイゼーション計画策定','クラウド移行や更改プロジェクト推進']},
 {id:4,title:'パッチ適用にかかる人的リソースを追加する',short:'④人的リソース',dom:'O',
  deadline:'2026-09-30',owner:'担当C',
  measures:['運用要員を増強','外部ベンダーを活用'],
  support:['マネージド運用サービス提供','24時間365日運用体制構築','運用自動化による負荷軽減対策']},
 {id:5,title:'ベンダーとの維持保守契約の内容を確認する',short:'⑤保守契約確認',dom:'O',
  deadline:'2026-06-30',owner:'担当B',
  measures:['休日・夜間対応体制の整備','緊急パッチ対応範囲を確認','SLAを見直し、脆弱性通知・支援体制を確認'],
  support:['契約内容レビュー支援','ベンダー管理支援','複数ベンダー横断のサポート体制設計']},
 {id:6,title:'パッチ適用プロセスをリスクベースにする',short:'⑥リスクベース化',dom:'P',
  deadline:'2026-09-30',owner:'担当A',
  measures:['CVSSや業務影響で優先順位付け','重要システムを最優先で対応','例外管理ルールを整備'],
  support:['リスクベース運用プロセス設計','脆弱性管理高度化支援','優先順位判定ルール策定']},
 {id:7,title:'パッチ適用以外の対策も強化する',short:'⑦多層防御強化',dom:'P',
  deadline:'2026-09-30',owner:'担当B',
  measures:['EDR/XDRを強化','多要素認証（MFA）を徹底'],
  support:['SOC/MDRサービス提供','ゼロトラストアーキテクチャ設計','サイバーレジリエンス強化支援']},
 {id:8,title:'優先サービス／ITシステムの停止に備える',short:'⑧停止への備え',dom:'R',
  deadline:'2026-09-30',owner:'担当A',
  measures:['BCP・DR計画を見直し','代替運用手順を整備','復旧訓練を定期実施'],
  support:['BCP/DR戦略策定','サイバーレジリエンス演習実施','復旧オーケストレーション支援']},
 {id:9,title:'外部との連携を維持・強化する',short:'⑨外部連携強化',dom:'C',
  deadline:'2026-09-30',owner:'担当C',
  measures:['金融ISAC等で脅威情報を共有','監督当局との連携強化','委託先・ベンダーとの連携体制を整備'],
  support:['金融ISAC等との連携支援','規制対応・監査対応支援','エコシステム全体を含む危機対応体制構築支援']}
];

// デモ用サンプル3社（社名はA/B/Cで差し替えやすく）
const COMPANIES=[
 {key:'a',name:'A社',color:'#3da9fc',scores:[5,5,4,4,4,4,4,3,5]},
 {key:'b',name:'B社',color:'#7c5cff',scores:[4,4,3,2,3,2,2,2,3]}, // ← 添付Excelの評価値
 {key:'c',name:'C社',color:'#22c55e',scores:[3,3,5,3,2,3,4,2,2]}
];
const BASE='b';

let current=BASE, compare=false, selectedItem=null;
const $=s=>document.querySelector(s);
const co=k=>COMPANIES.find(c=>c.key===k);
const fmtDate=s=>s.slice(0,4)+'/'+s.slice(5,7)+'/'+s.slice(8,10);

function dueStatus(it,score){
  if(score===5) return {label:'達成済み',color:'#22c55e',rank:99};
  const days=Math.round((new Date(it.deadline)-TODAY)/86400000);
  if(days<0)  return {label:'超過 '+(-days)+'日',color:'#ef4444',rank:0};
  if(days<=14)return {label:'あと'+days+'日',color:'#f59e0b',rank:1};
  return {label:'あと'+days+'日',color:'#3da9fc',rank:2};
}
// タスク別ステータス（具体策の各項目, スコアから決定的に算出した表示例）
function bulletStatus(score,idx,total){
  const completed=Math.floor(score/5*total);
  if(idx<completed) return ST.done;
  if(idx===completed && score>1) return ST.prog;
  return ST.todo;
}

function renderSteps(){
  const w=$('#steps');w.innerHTML='';
  STEPS.forEach(s=>{
    const el=document.createElement('div');el.className='scard';el.style.borderTopColor=s.color;
    el.innerHTML='<div class="num">'+s.num+'</div>'
      +'<div class="dt" style="color:'+s.color+'">'+s.name+'</div>'
      +'<div class="df">'+s.full+'</div>'
      +'<div class="dd">'+s.desc+'</div>';
    w.appendChild(el);
  });
}

function renderTabs(){
  const t=$('#tabs');t.innerHTML='';
  COMPANIES.forEach(c=>{
    const d=document.createElement('div');
    d.className='tab'+(c.key===current&&!compare?' active':'');
    d.textContent=c.name;
    d.onclick=()=>{current=c.key;compare=false;render();};
    t.appendChild(d);
  });
  const cmp=document.createElement('div');
  cmp.className='tab compare'+(compare?' active':'');
  cmp.textContent='⊕ 全社比較';
  cmp.onclick=()=>{compare=!compare;render();};
  t.appendChild(cmp);
}

function renderKpis(){
  const c=co(current), s=c.scores;
  const avg=s.reduce((a,b)=>a+b,0)/s.length;
  const pct=Math.round((s.reduce((a,b)=>a+b,0)/(s.length*5))*1000)/10;
  const risk=s.filter(x=>x<=2).length;
  const soon=ITEMS.filter((it,i)=>s[i]<5 && Math.round((new Date(it.deadline)-TODAY)/86400000)<=30).length;
  $('#kpis').innerHTML=
   '<div class="kpi"><div class="label">総合達成度</div><div class="val">'+pct+'<span>%</span></div><div class="note">'+c.name+'</div></div>'
  +'<div class="kpi k2"><div class="label">平均対応段階</div><div class="val">'+avg.toFixed(1)+'<span>/5</span></div><div class="note">9項目の平均成熟度</div></div>'
  +'<div class="kpi k3"><div class="label">重点対応項目（Lv.2以下）</div><div class="val">'+risk+'<span>件</span></div><div class="note">短期で優先着手すべき領域</div></div>'
  +'<div class="kpi k4"><div class="label">期限間近（30日以内・未完了）</div><div class="val">'+soon+'<span>件</span></div><div class="note">期限管理が必要な項目</div></div>';
}

let radarChart,barChart;
function renderRadar(){
  const labels=ITEMS.map(i=>i.short);
  let ds;
  if(compare){
    ds=COMPANIES.map(c=>({label:c.name,data:c.scores,borderColor:c.color,
      backgroundColor:c.color+'22',borderWidth:2,pointBackgroundColor:c.color,pointRadius:3}));
  }else{
    const c=co(current);
    ds=[{label:c.name,data:c.scores,borderColor:c.color,backgroundColor:c.color+'33',
      borderWidth:2.5,pointBackgroundColor:c.color,pointRadius:4},
      {label:'目標水準',data:Array(9).fill(5),borderColor:'#ffffff55',borderDash:[5,4],
       backgroundColor:'transparent',borderWidth:1,pointRadius:0}];
  }
  if(radarChart)radarChart.destroy();
  radarChart=new Chart($('#radar'),{type:'radar',data:{labels,datasets:ds},options:{responsive:true,maintainAspectRatio:false,
    plugins:{legend:{labels:{color:'#cdd5ea',font:{size:12}}}},
    scales:{r:{min:0,max:5,ticks:{stepSize:1,color:'#6b7595',backdropColor:'transparent'},
      grid:{color:'#2a3354'},angleLines:{color:'#2a3354'},
      pointLabels:{color:'#cdd5ea',font:{size:12,weight:'600'}}}}}});
}
function renderBar(){
  const labels=ITEMS.map(i=>i.short);
  let ds;
  if(compare){
    ds=COMPANIES.map(c=>({label:c.name,data:c.scores,backgroundColor:c.color+'cc',borderRadius:4}));
  }else{
    const c=co(current);
    ds=[{label:c.name,data:c.scores,borderRadius:5,backgroundColor:c.scores.map(v=>SCOLORS[v])},
      {label:'目標(5)',data:c.scores.map(v=>5-v),backgroundColor:'#ffffff14',borderRadius:5}];
  }
  if(barChart)barChart.destroy();
  barChart=new Chart($('#bar'),{type:'bar',data:{labels,datasets:ds},options:{indexAxis:'y',responsive:true,maintainAspectRatio:false,
    plugins:{legend:{display:compare,labels:{color:'#cdd5ea'}},
      tooltip:{callbacks:{label:ctx=>compare?(ctx.dataset.label+': Lv.'+ctx.raw):
        (ctx.datasetIndex===0?'現状: Lv.'+ctx.raw+' ('+STEP_LABEL[ctx.raw]+')':'目標まで: あと'+ctx.raw)}}},
    scales:{x:{stacked:!compare,min:0,max:5,ticks:{stepSize:1,color:'#6b7595'},grid:{color:'#2a3354'}},
      y:{stacked:!compare,ticks:{color:'#cdd5ea',font:{size:11}},grid:{display:false}}}}});
}

function renderTable(){
  const c=co(current), tb=$('#tbody'); tb.innerHTML='';
  ITEMS.forEach((it,i)=>{
    const v=compare?co(BASE).scores[i]:c.scores[i];
    const ps=progStatus(v);
    const scoreCell=compare? COMPANIES.map(cc=>'<span class="score-pill" title="'+cc.name+'" style="background:'+SCOLORS[cc.scores[i]]+';width:24px;height:24px;font-size:12px">'+cc.scores[i]+'</span>').join(' ')
      : '<span class="score-pill" style="background:'+SCOLORS[v]+'">'+v+'</span>';
    const tr=document.createElement('tr');tr.className='item-row';
    tr.innerHTML='<td><span class="idx">'+it.id+'</span></td>'
      +'<td class="item-name">'+it.title+'</td>'
      +'<td>'+scoreCell+'</td>'
      +'<td><span class="tag" style="background:'+ps.color+'22;color:'+ps.color+';border:1px solid '+ps.color+'55">'+ps.label+'</span></td>'
      +'<td style="white-space:nowrap;font-size:12px;color:var(--muted)">'+fmtDate(it.deadline)+'</td>'
      +'<td><span class="owner">'+it.owner+'</span></td>'
      +'<td class="click-hint">詳細 ›</td>';
    tr.onclick=()=>showDetail(it.id);
    tb.appendChild(tr);
  });
}

function showDetail(id){
  selectedItem=id;
  const it=ITEMS.find(x=>x.id===id), d=DOMAINS[it.dom], det=$('#detail');
  const who=compare?co(BASE):co(current);
  const refScore=who.scores[id-1];
  const ps=progStatus(refScore);
  const scores=COMPANIES.map(c=>'<span class="score-pill" title="'+c.name+'" style="background:'+SCOLORS[c.scores[id-1]]+';width:26px;height:26px;font-size:12px;margin-left:4px">'+c.scores[id-1]+'</span>').join('');
  const total=it.measures.length;
  const measuresHtml=it.measures.map((m,idx)=>{
    const bs=bulletStatus(refScore,idx,total);
    return '<li class="mli"><span class="st-chip" style="background:'+bs.color+'22;color:'+bs.color+';border:1px solid '+bs.color+'55">'+bs.label+'</span><span>'+m+'</span></li>';
  }).join('');
  const supportHtml=it.support.map(m=>'<li class="sli">'+m+'</li>').join('');
  det.innerHTML='<h3><span class="idx">'+it.id+'</span>'+it.title
     +'<span class="tag" style="background:'+ps.color+'22;color:'+ps.color+';border:1px solid '+ps.color+'55">ステータス：'+ps.label+'</span>'
     +'<span class="tag" style="background:'+d.color+'22;color:'+d.color+';border:1px solid '+d.color+'55;margin-left:auto">'+d.name+'・'+d.full+'</span></h3>'
   +'<div class="meta">'
     +'<span>🏢 表示中：<b>'+who.name+'</b>（段階 '+refScore+'/5・'+STEP_LABEL[refScore]+'）</span>'
     +'<span>🗓 対応期限：<b>'+fmtDate(it.deadline)+'</b></span>'
     +'<span>👤 主担当：<b>'+it.owner+'</b></span>'
     +'<span>3社：'+scores+'</span></div>'
   +'<div class="cols">'
     +'<div><h4>■ 具体策（C列）／タスク別ステータス</h4><ul>'+measuresHtml+'</ul></div>'
     +'<div><h4>■ 弊社の対策支援可能領域（D列）</h4><ul>'+supportHtml+'</ul></div>'
   +'</div>';
  det.classList.add('show');
  det.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function renderTracker(){
  const c=compare?co(BASE):co(current);
  const w=$('#tracker');w.innerHTML='';
  const rows=ITEMS.map((it,i)=>({it,score:c.scores[i],st:dueStatus(it,c.scores[i])}))
    .sort((a,b)=> a.st.rank-b.st.rank || (new Date(a.it.deadline)-new Date(b.it.deadline)) || a.it.id-b.it.id);
  let lastGroup=null;
  rows.forEach(({it,score,st})=>{
    const grp=score===5?'✔ 達成済み':'期限 '+fmtDate(it.deadline);
    if(grp!==lastGroup){
      const h=document.createElement('div');h.className='tgroup-h';h.textContent=grp;
      w.appendChild(h);lastGroup=grp;
    }
    const ps=progStatus(score);
    const pct=Math.round(score/5*100);
    const r=document.createElement('div');r.className='trow';
    r.innerHTML='<span class="idx">'+it.id+'</span>'
      +'<div><div class="tname">'+it.title+'</div>'
        +'<div class="tmeta"><span>👤 '+it.owner+'</span><span>'+DOMAINS[it.dom].name+'</span><span style="color:'+ps.color+'">●'+ps.label+'</span><span>段階 '+score+'/5</span></div>'
        +'<div class="prog"><i style="width:'+pct+'%;background:'+SCOLORS[score]+'"></i></div></div>'
      +'<div style="text-align:right"><span class="tag" style="background:'+st.color+'22;color:'+st.color+';border:1px solid '+st.color+'55">'+st.label+'</span></div>';
    r.onclick=()=>showDetail(it.id);
    w.appendChild(r);
  });
  if(compare){
    const note=document.createElement('div');note.className='cap';note.style.marginTop='10px';
    note.textContent='※ 比較モードでは B社 の進捗・期限を表示しています。';
    w.appendChild(note);
  }
}

function render(){renderSteps();renderTabs();renderKpis();renderRadar();renderBar();renderTable();renderTracker();
  if(selectedItem)showDetail(selectedItem);}
render();
