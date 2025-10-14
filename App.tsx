
import React, { useMemo, useState, useEffect } from 'react';

const LOGO_URL = 'https://i.ibb.co/hxyP3N4X/LOGO-COM-FUNDO-aprovado.png';
const LS_KEY = 'bizlink_admin_data_v1';

const DEFAULT_DATA: Record<string, any> = {
  'Restaurante / Café / Pastelaria': { rev:{min:0.8,med:1.0,max:1.2}, op:{min:3,med:4,max:5}, gw:{localizacao:.2,antiguidade:.1,imobilizado:.15,reputacao:.2,dependenciaGestao:.2,concentracaoClientes:.15} },
  'Loja de retalho ( Moda, calçado, minimercado, etc.)': { rev:{min:.7,med:.9,max:1.1}, op:{min:3,med:4,max:5}, gw:{localizacao:.25,antiguidade:.1,imobilizado:.1,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.25} },
  'Cabeleireiro / Estética': { rev:{min:.6,med:.75,max:.9}, op:{min:2.5,med:3.2,max:4}, gw:{localizacao:.25,antiguidade:.1,imobilizado:.1,reputacao:.2,dependenciaGestao:.15,concentracaoClientes:.2} },
  'Ginásio / Fitness': { rev:{min:.6,med:.8,max:1.0}, op:{min:3,med:4,max:5}, gw:{localizacao:.2,antiguidade:.1,imobilizado:.2,reputacao:.2,dependenciaGestao:.15,concentracaoClientes:.15} },
  'Alojamento local / Hostel': { rev:{min:.8,med:1.05,max:1.3}, op:{min:4,med:5,max:6}, gw:{localizacao:.3,antiguidade:.1,imobilizado:.15,reputacao:.25,dependenciaGestao:.1,concentracaoClientes:.1} },
  'Lavandaria / Self-service': { rev:{min:.7,med:.85,max:1.0}, op:{min:3,med:3.5,max:4}, gw:{localizacao:.2,antiguidade:.15,imobilizado:.2,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.15} },
  'Oficina / Manutenção automóvel': { rev:{min:.6,med:.8,max:1.0}, op:{min:3,med:4,max:5}, gw:{localizacao:.15,antiguidade:.1,imobilizado:.25,reputacao:.15,dependenciaGestao:.2,concentracaoClientes:.15} },
  'Consultórios médicos / dentários': { rev:{min:.7,med:.95,max:1.2}, op:{min:4,med:5,max:6}, gw:{localizacao:.25,antiguidade:.1,imobilizado:.15,reputacao:.25,dependenciaGestao:.1,concentracaoClientes:.15} },
  'Farmácia / Parafarmácia': { rev:{min:.8,med:1.0,max:1.2}, op:{min:4,med:5,max:6}, gw:{localizacao:.25,antiguidade:.1,imobilizado:.15,reputacao:.25,dependenciaGestao:.1,concentracaoClientes:.15} },
  'Serviços especializados B2B (TI, design, contabilidade, etc.)': { rev:{min:.5,med:.7,max:.9}, op:{min:4,med:5,max:6}, gw:{localizacao:.15,antiguidade:.1,imobilizado:.1,reputacao:.25,dependenciaGestao:.25,concentracaoClientes:.15} },
  'Transportes / Logística local': { rev:{min:.6,med:.8,max:1.0}, op:{min:3,med:4,max:5}, gw:{localizacao:.2,antiguidade:.1,imobilizado:.2,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.2} },
  'Indústria transformadora (mais de 10 colaboradores)': { rev:{min:.6,med:.8,max:1.0}, op:{min:4,med:5,max:6}, gw:{localizacao:.15,antiguidade:.15,imobilizado:.25,reputacao:.15,dependenciaGestao:.2,concentracaoClientes:.1} },
  'Pequena indústria transformadora': { rev:{min:.5,med:.65,max:.8}, op:{min:3,med:4,max:5}, gw:{localizacao:.15,antiguidade:.15,imobilizado:.25,reputacao:.15,dependenciaGestao:.2,concentracaoClientes:.1} },
  'Comércio retalho': { rev:{min:.6,med:.8,max:1.0}, op:{min:3,med:4,max:5}, gw:{localizacao:.25,antiguidade:.1,imobilizado:.1,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.25} },
  'Comércio B2B': { rev:{min:.5,med:.7,max:.9}, op:{min:3,med:4,max:5}, gw:{localizacao:.15,antiguidade:.1,imobilizado:.1,reputacao:.25,dependenciaGestao:.2,concentracaoClientes:.2} },
  'Produção agrícola': { rev:{min:.4,med:.6,max:.8}, op:{min:2,med:3,max:4}, gw:{localizacao:.15,antiguidade:.2,imobilizado:.25,reputacao:.15,dependenciaGestao:.1,concentracaoClientes:.15} },
  'Construção / Remodelações / Manutenção': { rev:{min:.5,med:.7,max:.9}, op:{min:3,med:4,max:5}, gw:{localizacao:.2,antiguidade:.15,imobilizado:.2,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.15} },
  'Construção / Remodelações / Manutenção (mais de 10 colaboradores)': { rev:{min:.5,med:.65,max:.8}, op:{min:3,med:3.5,max:4}, gw:{localizacao:.2,antiguidade:.15,imobilizado:.2,reputacao:.15,dependenciaGestao:.15,concentracaoClientes:.15} },
  'Outros serviços a retalho': { rev:{min:.5,med:.7,max:.9}, op:{min:3,med:4,max:5}, gw:{localizacao:.2,antiguidade:.1,imobilizado:.1,reputacao:.2,dependenciaGestao:.2,concentracaoClientes:.2} },
  'Outros serviços B2B': { rev:{min:.5,med:.7,max:.9}, op:{min:3,med:4,max:5}, gw:{localizacao:.15,antiguidade:.1,imobilizado:.1,reputacao:.25,dependenciaGestao:.2,concentracaoClientes:.2} },
};

function loadAdminData(){ try{const raw=localStorage.getItem(LS_KEY); if(!raw) return {categories:DEFAULT_DATA}; const p=JSON.parse(raw); return (p&&p.categories)?p:{categories:DEFAULT_DATA}; }catch{ return {categories:DEFAULT_DATA}; } }
function saveAdminData(d){ try{localStorage.setItem(LS_KEY, JSON.stringify(d));}catch{} }

function useCatalog(){ const [data,setData]=useState(loadAdminData()); useEffect(()=>{const onS=()=>setData(loadAdminData()); window.addEventListener('storage',onS); return()=>window.removeEventListener('storage',onS);},[]); return {data,setData,categories:Object.keys(data.categories)}; }
const num=(v:any)=> (v===''||isNaN(Number(v)))?0:Number(v);
function computeEstimate(adminData:any,businessType:string,revenue:any,op:any){ const cat=adminData.categories[businessType]; if(!cat) return null; const r=num(revenue), g=num(op); return { min:(r*cat.rev.min+g*cat.op.min)/2, med:(r*cat.rev.med+g*cat.op.med)/2, max:(r*cat.rev.max+g*cat.op.max)/2, m:cat }; }

const Field=({label,children,hint}:{label:string,children:any,hint?:string})=>(<div><label className="block text-sm font-medium text-gray-700">{label}</label>{children}{hint&&<p className="text-xs text-gray-500 mt-1">{hint}</p>}</div>);
const Header=({title}:{title:string})=>(<div className="w-full bg-gradient-to-r from-white to-gray-100 border-b border-gray-300 py-3 px-6 mb-8"><div className="flex items-center justify-between"><img src={LOGO_URL} alt="BizLink Brokers" className="h-10 w-auto"/><h1 className="text-xl font-bold text-[#1e3a8a] text-center flex-1">{title}</h1><a href="https://www.bizlinkbrokers.com" target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-700 underline">www.bizlinkbrokers.com</a></div></div>);
function ResultNumbers({min,med,max}:{min:number;med:number;max:number;}){ const fmt=new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'}); return (<div className="text-center"><p className="text-gray-600 mb-1">Amplitude de valor de mercado:</p><p className="text-lg font-bold text-gray-800">{fmt.format(min)} — {fmt.format(max)}</p><p className="text-sm text-gray-500 mt-2">Valor médio estimado: <b>{fmt.format(med)}</b></p></div>); }

function PlanoGratuito({voltar,goElementar}:{voltar:()=>void;goElementar:()=>void;}){
  const {data,categories}=useCatalog();
  const [businessType,setBusinessType]=useState(''); const [revenue,setRevenue]=useState(''); const [operationalGain,setOperationalGain]=useState('');
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState(''); const [purpose,setPurpose]=useState(''); const [accepted,setAccepted]=useState(false); const [submitted,setSubmitted]=useState(false);
  const estimate=useMemo(()=>computeEstimate(data,businessType,revenue,operationalGain),[data,businessType,revenue,operationalGain]);
  return (<div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
    <Header title="BizLink Brokers — Simulador de Avaliação (Plano Gratuito)"/>
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 w-full max-w-3xl">
      <button onClick={voltar} className="text-sm text-indigo-600 underline mb-4">← Voltar à página inicial</button>
      <h2 className="text-2xl font-bold text-indigo-800 mb-2">Plano Gratuito</h2>
      {!submitted ? (<form onSubmit={(e)=>{e.preventDefault(); if(!businessType||!revenue||!operationalGain)return alert('Preencha: Tipo de negócio, Faturação e Ganho Operacional.'); if(!name||!email||!phone||!purpose||!accepted)return alert('Preencha Nome, Email, Telefone, Finalidade e aceite a recolha de dados.'); if(!data.categories[businessType])return alert('O tipo de negócio selecionado não tem múltiplos definidos.'); setSubmitted(True); }} className="space-y-6">
        <Field label="Tipo de negócio"><select value={businessType} onChange={e=>setBusinessType(e.target.value)} className="w-full p-2 border rounded-lg" required><option value="">Selecione...</option>{categories.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Faturação anual (€)"><input type="number" value={revenue} onChange={e=>setRevenue(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Ganho Operacional (antes de impostos e custos financeiros) (€)"><input type="number" value={operationalGain} onChange={e=>setOperationalGain(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome"><input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Telefone"><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Finalidade da avaliação"><select value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full p-2 border rounded-lg" required><option value="">Selecione...</option>{['Penso vender a minha empresa/negócio','Penso comprar empresa/negócio','Partilhas/Divisão','Entrada/Saída de investidor','Curiosidade em saber'].map(opt=><option key={opt}>{opt}</option>)}</select></Field>
        </div>
        <div className="flex items-start space-x-2"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} required/><p className="text-xs text-gray-500">Aceito a recolha dos meus dados para os fins da subscrição de newsletter e contacto. A BizLink Brokers não partilhará os seus dados com terceiros.</p></div>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">Ver resultado</button>
      </form>) : (<div className="mt-6 p-4 bg-gray-50 border rounded-md">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Resultado estimado</h3>
        <p className="text-sm text-gray-700 mb-1"><b>Tipo de negócio:</b> {businessType}</p>
        {estimate && (<p className="text-sm text-gray-700 mb-4"><b>Múltiplos:</b> Faturação {estimate.m.rev.min}–{estimate.m.rev.max}× | Ganho {estimate.m.op.min}–{estimate.m.op.max}×</p>)}
        <ResultNumbers min={estimate?.min||0} med={estimate?.med||0} max={estimate?.max||0}/>
        <div className="mt-4"><button onClick={goElementar} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded-lg">Ver Plano Elementar</button></div>
      </div>)}
    </div>
  </div>);
}

function PlanoElementar({voltar}:{voltar:()=>void;}){
  const {data,categories}=useCatalog();
  const [businessType,setBusinessType]=useState(''); const [revenue,setRevenue]=useState(''); const [operationalGain,setOperationalGain]=useState('');
  const [stockValue,setStockValue]=useState(''); const [equipmentValue,setEquipmentValue]=useState('');
  const [goodwill,setGoodwill]=useState({ localizacao:3, antiguidade:3, imobilizado:3, reputacao:3, dependenciaGestao:3, concentracaoClientes:3 });
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [phone,setPhone]=useState(''); const [purpose,setPurpose]=useState(''); const [accepted,setAccepted]=useState(false); const [submitted,setSubmitted]=useState(False); const [paid,setPaid]=useState(False); const [showToast,setShowToast]=useState(False);

  const baseEstimate=useMemo(()=>computeEstimate(data,businessType,revenue,operationalGain),[data,businessType,revenue,operationalGain]);
  const fmt=new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR'});
  const catGw=businessType?data.categories[businessType]?.gw:null;
  const gwWeights=catGw||{ localizacao:1/6, antiguidade:1/6, imobilizado:1/6, reputacao:1/6, dependenciaGestao:1/6, concentracaoClientes:1/6 };
  const sum=Object.values(gwWeights).reduce((a:any,b:any)=>a+(b as number),0)||1;
  const normW=Object.fromEntries(Object.entries(gwWeights).map(([k,v])=>[k,(v as number)/sum]));
  const score=(goodwill.localizacao/5)*normW.localizacao+(goodwill.antiguidade/5)*normW.antiguidade+(goodwill.imobilizado/5)*normW.imobilizado+(goodwill.reputacao/5)*normW.reputacao+(goodwill.dependenciaGestao/5)*normW.dependenciaGestao+(goodwill.concentracaoClientes/5)*normW.concentracaoClientes;
  const GW_MAX=0.25;
  const baseVal=(baseEstimate?baseEstimate.med:0)+Number(stockValue||0)+Number(equipmentValue||0);
  const adjustedVal=baseVal*(1+GW_MAX*score); const minVal=adjustedVal*0.85; const maxVal=adjustedVal*1.15; const varPct=baseVal?((adjustedVal-baseVal)/baseVal)*100:0;

  const handleSubmit=(e:any)=>{ e.preventDefault(); if(!businessType||!revenue||!operationalGain)return alert('Preencha: Tipo de negócio, Faturação e Ganho Operacional.'); if(!name||!email||!phone||!purpose||!accepted)return alert('Preencha Nome, Email, Telefone, Finalidade e aceite a recolha de dados.'); if(!data.categories[businessType])return alert('O tipo de negócio selecionado não tem múltiplos definidos.'); setSubmitted(True); setTimeout(()=>setPaid(True),800); };

  const gerarRelatorio=()=>{ try{ const linhas=[ 'BizLink Brokers — Relatório de Avaliação — Plano Elementar','Website: www.bizlinkbrokers.com','',`Tipo de Negócio: ${businessType}`, baseEstimate?`Múltiplos: Faturação ${baseEstimate.m.rev.min}–${baseEstimate.m.rev.max}× | Ganho ${baseEstimate.m.op.min}–${baseEstimate.m.op.max}×`:'', `Faturação: ${fmt.format(Number(revenue||0))}`, `Ganho Operacional: ${fmt.format(Number(operationalGain||0))}`, `Stock: ${fmt.format(Number(stockValue||0))}`, `Imobilizado/Equipamentos: ${fmt.format(Number(equipmentValue||0))}`, `Finalidade: ${purpose}`,'', `Amplitude: ${fmt.format(minVal)} — ${fmt.format(maxVal)}`, `Valor médio ajustado: ${fmt.format(adjustedVal)} (${varPct>=0?'+':''}${varPct.toFixed(1)}% vs. base)`, '', '© BizLink Brokers — Relatório confidencial. www.bizlinkbrokers.com' ]; const blob=new Blob([linhas.join('\n')],{type:'text/plain;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='Relatorio_Avaliacao_Elementar.txt'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); setShowToast(True); setTimeout(()=>setShowToast(False),3000);}catch(e){ alert('Não foi possível gerar o relatório neste ambiente.'); } };

  return (<div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
    {showToast&&(<div className="fixed bottom-4 right-4 bg-[#1e3a8a] text-white text-sm px-4 py-2 rounded-md shadow-lg">Relatório gerado com sucesso</div>)}
    <Header title="Relatório de Avaliação — Plano Elementar"/>
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-yellow-200 w-full max-w-3xl">
      <button onClick={voltar} className="text-sm text-indigo-600 underline mb-4">← Voltar à página inicial</button>
      <h2 className="text-2xl font-bold text-yellow-700 mb-2">Plano Elementar</h2>
      {!submitted ? (<form onSubmit={handleSubmit} className="space-y-6">
        <Field label="Tipo de negócio"><select value={businessType} onChange={e=>setBusinessType(e.target.value)} className="w-full p-2 border rounded-lg" required><option value="">Selecione...</option>{categories.map(opt=><option key={opt} value={opt}>{opt}</option>)}</select></Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Faturação anual (€)"><input type="number" value={revenue} onChange={e=>setRevenue(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Ganho Operacional (€)" hint="💡 Valor aproximado após custos diretos e despesas de funcionamento."><input type="number" value={operationalGain} onChange={e=>setOperationalGain(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Valor do Stock (€)"><input type="number" value={stockValue} onChange={e=>setStockValue(e.target.value)} className="w-full p-2 border rounded-lg"/></Field>
          <Field label="Valor do Imobilizado/Equipamentos (€)"><input type="number" value={equipmentValue} onChange={e=>setEquipmentValue(e.target.value)} className="w-full p-2 border rounded-lg"/></Field>
        </div>
        <div><h3 className="text-lg font-semibold text-indigo-700 mb-3">Goodwill</h3>{[ ['localizacao','Localização'], ['antiguidade','Antiguidade'], ['imobilizado','Estado do Imobilizado'], ['reputacao','Reputação'], ['dependenciaGestao','Dependência da gestão'], ['concentracaoClientes','Concentração de clientes'] ].map(([k,label])=> (<div key={k} className="mb-3"><div className="flex items-center justify-between"><label className="block text-sm font-medium">{label}</label><span className="text-sm text-gray-600">{(goodwill as any)[k]}</span></div><input type="range" min="0" max="5" value={(goodwill as any)[k]} onChange={e=>setGoodwill({...goodwill, **{[k]: parseInt((e.target as HTMLInputElement).value)}} as any)} className="w-full"/></div>))}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome"><input value={name} onChange={e=>setName(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Email"><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Telefone"><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-2 border rounded-lg" required/></Field>
          <Field label="Finalidade da avaliação"><select value={purpose} onChange={e=>setPurpose(e.target.value)} className="w-full p-2 border rounded-lg" required><option value="">Selecione...</option>{['Penso vender a minha empresa/negócio','Penso comprar empresa/negócio','Partilhas/Divisão','Entrada/Saída de investidor','Curiosidade em saber'].map(opt=><option key={opt}>{opt}</option>)}</select></Field>
        </div>
        <div className="flex items-start space-x-2"><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} required/><p className="text-xs text-gray-500">Aceito a recolha dos meus dados para os fins da subscrição de newsletter e contacto.</p></div>
        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg">Ver resultado da avaliação ajustada</button>
      </form>) : !paid ? (<div className="text-center text-gray-700"><h3 className="text-lg font-semibold mb-2">A aguardar confirmação de pagamento…</h3><p className="text-sm">Após confirmação, o resultado ficará disponível.</p></div>) : (<div className="text-left"><div className="mb-4 p-4 bg-gray-50 border rounded-md"><h3 className="text-lg font-semibold text-indigo-800 mb-2">Resumo dos Inputs</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm"><p><b>Tipo de negócio:</b> {businessType||'—'}</p>{baseEstimate&&(<p className="md:col-span-2"><b>Múltiplos:</b> Faturação {baseEstimate.m.rev.min}–{baseEstimate.m.rev.max}× | Ganho {baseEstimate.m.op.min}–{baseEstimate.m.op.max}×</p>)}<p><b>Faturação:</b> {fmt.format(Number(revenue||0))}</p><p><b>Ganho Operacional:</b> {fmt.format(Number(operationalGain||0))}</p><p><b>Stock:</b> {fmt.format(Number(stockValue||0))}</p><p><b>Imobilizado/Equip.:</b> {fmt.format(Number(equipmentValue||0))}</p></div></div><div className="text-center"><h2 className="text-xl font-semibold text-indigo-800 mb-4">Resultado estimado ajustado</h2><ResultNumbers min={minVal} med={adjustedVal} max={maxVal}/><p className="text-xs text-gray-500 mt-2">Variação face à base: {varPct>=0?'+':''}{varPct.toFixed(1)}%</p><div className="mt-4 no-print"><button onClick={gerarRelatorio} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg">📄 Descarregar Relatório</button></div></div></div>)}
    </div>
  </div>);
}

function AdminBackoffice({voltar}:{voltar:()=>void;}){
  const [authorized,setAuthorized]=useState(false); const [code,setCode]=useState(''); const [toast,setToast]=useState(''); const [data,setData]=useState(loadAdminData()); useEffect(()=>{saveAdminData(data)},[data]);
  const categories=Object.keys(data.categories);
  const handleAuth=(e:any)=>{ e.preventDefault(); if(code.trim()==='admin2025'){ setAuthorized(true); setToast('Acesso concedido'); setTimeout(()=>setToast(''),3000);} else { setToast('Código inválido'); setTimeout(()=>setToast(''),3000);} };
  const clamp=(v:any,min:number,max:number)=>{ if(v===''||isNaN(Number(v))) return 0; const n=Number(v); return Math.max(min,Math.min(max,n)); };
  const updateCell=(name:string,path:string,value:any)=>{ setData((prev:any)=>{ const next={...prev,categories:{...prev.categories}}; const cat={...next.categories[name]}; const [group,key]=path.split('.'); const maxMap=group==='rev'?10:20; const val=clamp(value,0,maxMap); cat[group]={...cat[group],[key]:val}; next.categories[name]=cat; return next; }); };
  const updateGW=(name:string,key:string,value:any)=>{ setData((prev:any)=>{ const next={...prev,categories:{...prev.categories}}; const cat={...next.categories[name],gw:{...(next.categories[name].gw||{})}}; const val=clamp(value,0,1); cat.gw[key]=val; next.categories[name]=cat; return next; }); };
  const addCategory=()=>{ const name=prompt('Nome da nova categoria de negócio:'); if(!name) return; setData((prev:any)=>{ if(prev.categories[name]) return prev; const next={...prev,categories:{...prev.categories}}; next.categories[name]={rev:{min:0,med:0,max:0},op:{min:0,med:0,max:0},gw:{localizacao:1/6,antiguidade:1/6,imobilizado:1/6,reputacao:1/6,dependenciaGestao:1/6,concentracaoClientes:1/6}}; return next; }); };
  const removeCategory=(name:string)=>{ if(!confirm(`Remover categoria "${name}"?`)) return; setData((prev:any)=>{ const next={...prev,categories:{...prev.categories}}; delete next.categories[name]; return next; }); };
  const exportJSON=()=>{ try{ const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='bizlink_multiplicadores_e_pesos.json'; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); setToast('Ficheiro exportado'); setTimeout(()=>setToast(''),3000);}catch{ setToast('Não foi possível exportar'); setTimeout(()=>setToast(''),3000);} };
  const importJSON=async(file:File)=>{ try{ const text=await file.text(); const incoming=JSON.parse(text); if(!incoming||typeof incoming!=='object'||!incoming.categories) throw new Error('Estrutura inválida'); setData(incoming); setToast('Ficheiro importado'); setTimeout(()=>setToast(''),3000);}catch{ setToast('JSON inválido'); setTimeout(()=>setToast(''),3000);} };
  const sumGW=(cat:any)=>{ const gw=cat.gw||{}; return (gw.localizacao||0)+(gw.antiguidade||0)+(gw.imobilizado||0)+(gw.reputacao||0)+(gw.dependenciaGestao||0)+(gw.concentracaoClientes||0); };
  const sumClass=(s:number)=>{ if(Math.abs(s-1)<0.001) return 'text-green-700 bg-green-50 border border-green-200'; if(s>1) return 'text-yellow-700 bg-yellow-50 border border-yellow-200'; return 'text-red-700 bg-red-50 border border-red-200'; };
  const cellWarn=(group:string,val:number)=>{ if(val<0) return 'border-red-400 bg-red-50'; if(group==='rev'&&val>10) return 'border-yellow-400 bg-yellow-50'; if(group==='op'&&val>20) return 'border-yellow-400 bg-yellow-50'; return ''; };

  return (<div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
    {toast&&(<div className="fixed bottom-4 right-4 bg-[#1e3a8a] text-white text-sm px-4 py-2 rounded-md shadow-lg">{toast}</div>)}
    <Header title="Back Office — Gestão de Múltiplos e Ponderações"/>
    {!authorized ? (<div className="bg-white p-6 rounded-2xl shadow-md border w-full max-w-md">
      <button onClick={voltar} className="text-sm text-indigo-600 underline mb-4">← Voltar</button>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Autenticação</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <input type="password" value={code} onChange={e=>setCode((e.target as HTMLInputElement).value)} className="w-full p-2 border rounded-lg" placeholder="Código de acesso" required/>
        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg">Entrar</button>
      </form>
    </div>) : (<div className="bg-white p-6 rounded-2xl shadow-lg border w-full max-w-7xl">
      <div className="flex items-center justify-between mb-4">
        <button onClick={voltar} className="text-sm text-indigo-600 underline">← Voltar</button>
        <div className="flex items-center gap-2">
          <button onClick={addCategory} className="px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm">Adicionar categoria</button>
          <label className="px-3 py-2 border rounded-lg cursor-pointer text-sm bg-gray-50 hover:bg-gray-100">Importar JSON
            <input type="file" accept="application/json" className="hidden" onChange={e=> e.target.files && e.target.files[0] and importJSON(e.target.files[0])}/>
          </label>
          <button onClick={exportJSON} className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm">Exportar JSON</button>
          <button onClick={()=>{ if(confirm('Repor valores padrão?')){ const d={categories:DEFAULT_DATA}; setData(d); saveAdminData(d);} }} className="px-3 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm">Repor Defaults</button>
        </div>
      </div>
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full text-sm"><thead className="bg-gray-100"><tr>
          <th className="p-3 text-left font-semibold">Tipo de negócio</th>
          {['Rev min','Rev med','Rev max','Ganho min','Ganho med','Ganho max','GW Loc','GW Antig','GW Imob','GW Reput','GW Gestão','GW Concent','Σ GW','Ações'].map(h=><th key={h} className="p-3 text-center font-semibold">{h}</th>)}
        </tr></thead><tbody>
          {categories.map((name,idx)=>{ const cat=data.categories[name]; const gwSum=sumGW(cat);
            return (<tr key={name} className={idx%2?'bg-white':'bg-gray-50'}>
              <td className="p-2 min-w-[240px]"><input className="w-full p-1 border rounded" value={name} onChange={e=>{const newName=(e.target as HTMLInputElement).value; setData((prev:any)=>{ const next={...prev,categories:{...prev.categories}}; if(newName && newName!==name){ next.categories[newName]=next.categories[name]; delete next.categories[name]; } return next; });}}/></td>
              {['min','med','max'].map(k=>(<td key={'rev-'+name+k} className="p-2 text-center"><input type="number" min={0} max={10} step="0.01" value={cat.rev[k]} onChange={e=>updateCell(name,'rev.'+k,(e.target as HTMLInputElement).value)} className={"w-24 p-1 border rounded "+cellWarn('rev',cat.rev[k])}/></td>))}
              {['min','med','max'].map(k=>(<td key={'op-'+name+k} className="p-2 text-center"><input type="number" min={0} max={20} step="0.1" value={cat.op[k]} onChange={e=>updateCell(name,'op.'+k,(e.target as HTMLInputElement).value)} className={"w-24 p-1 border rounded "+cellWarn('op',cat.op[k])}/></td>))}
              {['localizacao','antiguidade','imobilizado','reputacao','dependenciaGestao','concentracaoClientes'].map(k=>(<td key={'gw-'+name+k} className="p-2 text-center"><input type="number" min={0} max={1} step="0.01" value={cat.gw?.[k]??0} onChange={e=>updateGW(name,k,(e.target as HTMLInputElement).value)} className="w-20 p-1 border rounded"/></td>))}
              <td className="p-2 text-center"><span className={"px-2 py-1 rounded text-xs "+sumClass(gwSum)}>{(gwSum*100).toFixed(0)}%</span></td>
              <td className="p-2 text-center"><button onClick={()=>removeCategory(name)} className="px-2 py-1 text-white bg-red-500 hover:bg-red-600 rounded">Remover</button></td>
            </tr>);
          })}
        </tbody></table>
      </div>
      <p className="text-xs text-gray-500 mt-3">Validações: Rev ≤ 10, Ganho ≤ 20, Pesos 0–1. Soma ideal dos pesos = 100% (normaliza-se no simulador).</p>
    </div>)}
  </div>);
}

function useAdminOverlay(){ const [showButton,setShowButton]=useState(false); const [showToast,setShowToast]=useState(false);
  useEffect(()=>{ const onKey=(e:KeyboardEvent)=>{ if(e.ctrlKey&&e.shiftKey&&(e.key==='B'||e.key==='b')){ setShowButton(true); setShowToast(true); setTimeout(()=>setShowToast(false),3000); setTimeout(()=>setShowButton(False),10000);} }; window.addEventListener('keydown',onKey); return ()=>window.removeEventListener('keydown',onKey); },[]);
  const Overlay=()=> (<>{showToast&&(<div className="fixed bottom-6 right-6 bg-[#1e3a8a] text-white text-sm px-4 py-2 rounded-md shadow-lg">🔓 Modo de acesso ativado</div>)}{showButton&&(<button onClick={()=>{window.location.hash='/admin'}} className="fixed bottom-6 right-6 bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2 rounded-full shadow-lg">🔑 Back Office</button>)}</>);
  return Overlay;
}

export default function App(){
  const [page,setPage]=useState('home'); const Overlay=useAdminOverlay();
  useEffect(()=>{ const applyHash=()=>{ const hash=window.location.hash.replace('#','').trim(); if(hash==='/admin') setPage('admin'); else if(hash==='/gratuito') setPage('gratuito'); else if(hash==='/elementar') setPage('elementar'); else setPage('home'); }; applyHash(); window.addEventListener('hashchange',applyHash); return ()=>window.removeEventListener('hashchange',applyHash); },[]);
  if(page==='gratuito') return <PlanoGratuito voltar={()=>{setPage('home'); window.location.hash='';}} goElementar={()=>{setPage('elementar'); window.location.hash='/elementar';}}/>;
  if(page==='elementar') return <PlanoElementar voltar={()=>{setPage('home'); window.location.hash='';}}/>;
  if(page==='admin') return <AdminBackoffice voltar={()=>{setPage('home'); window.location.hash='';}}/>;
  return (<div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 relative">
    <Overlay/>
    <Header title="BizLink Brokers — Simulador de Avaliação"/>
    <div className="text-center max-w-2xl mb-10"><h2 className="text-2xl font-bold text-gray-800 mb-2">Escolha o plano ideal para avaliar o seu negócio</h2><p className="text-gray-600 text-sm">Selecione o nível de detalhe e personalização que melhor se adapta às suas necessidades.</p></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
      <div className="bg-white border border-indigo-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition relative">
        <h3 className="text-xl font-semibold text-indigo-800 mb-2">Plano Gratuito</h3>
        <p className="text-3xl font-bold text-indigo-600 mb-4">0€</p>
        <ul className="text-sm text-gray-600 space-y-2 mb-6"><li>✔ Seleção do tipo de negócio</li><li>✔ Avaliação por múltiplos</li><li>✔ Amplitude e valor médio</li><li>✔ Resultados indicativos</li></ul>
        <button onClick={()=>{setPage('gratuito'); window.location.hash='/gratuito';}} className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition">Experimentar Gratuitamente</button>
      </div>
      <div className="bg-gradient-to-b from-yellow-100 to-white border border-yellow-300 rounded-2xl shadow-lg p-6 hover:shadow-xl transition relative">
        <div className="absolute top-2 right-3 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">⭐ Mais escolhido</div>
        <h3 className="text-xl font-semibold text-yellow-700 mb-2">Plano Elementar</h3>
        <p className="text-3xl font-bold text-yellow-600 mb-4">49,99€</p>
        <ul className="text-sm text-gray-700 space-y-2 mb-6"><li>✔ Todos os recursos do plano gratuito</li><li>✔ Ajustamentos (goodwill)</li><li>✔ Relatório detalhado</li><li>✔ Estimativa ajustada</li></ul>
        <button onClick={()=>{setPage('elementar'); window.location.hash='/elementar';}} className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition">Selecionar Plano Elementar</button>
      </div>
    </div>
    <footer className="mt-16 text-center text-xs text-gray-500"><p>© {new Date().getFullYear()} BizLink Brokers — Todos os direitos reservados.</p></footer>
  </div>);
}
