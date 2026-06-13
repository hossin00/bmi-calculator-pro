import { useState } from 'react';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';
const AC='#ec4899';
interface Entry { date:string; bmi:number; weight:number; }
const SAVE='bmi_v1';
const load=():Entry[]=>{try{return JSON.parse(localStorage.getItem(SAVE)||'[]')}catch{return[]}};
export default function App() {
  const [height,setH]=useState(''); const [weight,setW]=useState(''); const [unit,setUnit]=useState<'metric'|'imperial'>('metric');
  const [log,setLog]=useState<Entry[]>(load);
  const h=parseFloat(height)||0; const w=parseFloat(weight)||0;
  let bmi=0;
  if(h>0&&w>0){
    if(unit==='metric') bmi=w/((h/100)**2);
    else bmi=(703*w)/(h**2);
  }
  bmi=Math.round(bmi*10)/10;
  const cat=bmi===0?'':[['Underweight',18.5,'#3b82f6'],['Normal',25,'#10b981'],['Overweight',30,'#f59e0b'],['Obese',Infinity,'#ef4444']].find(([_,max])=>bmi<(max as number))![0] as string;
  const catColor=bmi===0?'#555':[['#3b82f6',18.5],['#10b981',25],['#f59e0b',30],['#ef4444',Infinity]].find(([_,max])=>bmi<(max as number))![0] as string;
  const save=()=>{
    if(!bmi)return;
    const entry={date:format(new Date(),'yyyy-MM-dd'),bmi,weight:w};
    const updated=[entry,...log.filter(e=>e.date!==entry.date)].slice(0,30);
    setLog(updated); localStorage.setItem(SAVE,JSON.stringify(updated));
    alert('BMI logged!');
  };
  const inp={width:'100%',background:'#0d080f',border:'1px solid #2d1040',borderRadius:'12px',padding:'13px 16px',color:'white',fontSize:'20px',fontWeight:'700',outline:'none',fontFamily:'Inter',textAlign:'center' as const};
  return (
    <div style={{minHeight:'100vh',background:'#08080f',display:'flex',flexDirection:'column'}}>
      <header style={{padding:'16px 20px',borderBottom:'1px solid #1e0a2e',display:'flex',alignItems:'center',gap:'10px'}}>
        <div style={{width:'36px',height:'36px',borderRadius:'10px',background:`linear-gradient(135deg,${AC},#be185d)`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 4px 14px ${AC}30`}}><Activity size={16} color="white"/></div>
        <div style={{fontWeight:'700',fontSize:'16px',color:'white'}}>BMI Calculator Pro</div>
      </header>
      <div style={{flex:1,overflow:'auto',padding:'20px'}}>
        <div style={{maxWidth:'400px',margin:'0 auto',display:'flex',flexDirection:'column',gap:'14px'}}>
          <div style={{display:'flex',gap:'6px'}}>
            {(['metric','imperial'] as const).map(u=><button key={u} onClick={()=>setUnit(u)} style={{flex:1,padding:'10px',borderRadius:'10px',border:`1px solid ${unit===u?AC:'#2d1040'}`,background:unit===u?AC+'15':'transparent',color:unit===u?'#f9a8d4':'#7c3aed',fontSize:'13px',fontWeight:'600',cursor:'pointer',fontFamily:'Inter',textTransform:'capitalize'}}>{u}</button>)}
          </div>
          <div>
            <div style={{fontSize:'12px',color:'#7c3aed',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Height {unit==='metric'?'(cm)':'(inches)'}</div>
            <input type="number" value={height} onChange={e=>setH(e.target.value)} placeholder={unit==='metric'?'175':'69'} style={inp} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#2d1040'}/>
          </div>
          <div>
            <div style={{fontSize:'12px',color:'#7c3aed',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'8px'}}>Weight {unit==='metric'?'(kg)':'(lbs)'}</div>
            <input type="number" value={weight} onChange={e=>setW(e.target.value)} placeholder={unit==='metric'?'70':'154'} style={inp} onFocus={e=>e.target.style.borderColor=AC} onBlur={e=>e.target.style.borderColor='#2d1040'}/>
          </div>
          {bmi>0&&<>
            <div style={{background:'#0d080f',border:`1px solid ${catColor}30`,borderRadius:'16px',padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'56px',fontWeight:'700',color:catColor,marginBottom:'4px'}}>{bmi}</div>
              <div style={{fontSize:'18px',fontWeight:'600',color:catColor,marginBottom:'12px'}}>{cat}</div>
              <div style={{height:'8px',background:'#1e0a2e',borderRadius:'4px',overflow:'hidden',marginBottom:'8px'}}>
                {(['Underweight','Normal','Overweight','Obese'] as const).map((c,i)=>{
                  const w=[18.5/40,6.5/40,5/40,10/40];
                  const clrs=['#3b82f6','#10b981','#f59e0b','#ef4444'];
                  return <div key={c} style={{display:'inline-block',width:`${w[i]*100}%`,height:'100%',background:clrs[i]}}/>;
                })}
              </div>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'10px',color:'#7c3aed'}}>
                <span>16</span><span>18.5</span><span>25</span><span>30</span><span>40</span>
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px'}}>
              {[['Healthy BMI','18.5 – 24.9'],['Your Category',cat],['Healthy Weight ('+unit+')',unit==='metric'?`${(18.5*(h/100)**2).toFixed(0)}-${(24.9*(h/100)**2).toFixed(0)}kg`:`${(18.5*h*h/703).toFixed(0)}-${(24.9*h*h/703).toFixed(0)}lbs`]].map(([l,v])=>(
                <div key={l} style={{background:'#0d080f',border:'1px solid #2d1040',borderRadius:'10px',padding:'12px'}}>
                  <div style={{fontSize:'10px',color:'#7c3aed',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'4px'}}>{l}</div>
                  <div style={{fontSize:'13px',fontWeight:'600',color:'white'}}>{v}</div>
                </div>
              ))}
            </div>
            <button onClick={save} style={{padding:'14px',borderRadius:'12px',background:AC,border:'none',color:'white',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'Inter',boxShadow:`0 4px 16px ${AC}40`}}>Log BMI Today</button>
          </>}
          {log.length>0&&<div style={{background:'#0d080f',border:'1px solid #2d1040',borderRadius:'12px',padding:'14px'}}>
            <div style={{fontSize:'12px',color:'#7c3aed',fontWeight:'600',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'10px'}}>BMI History</div>
            {log.slice(0,5).map(e=>(
              <div key={e.date} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #1e0a2e'}}>
                <span style={{fontSize:'12px',color:'#a78bfa'}}>{e.date}</span>
                <span style={{fontSize:'13px',fontWeight:'700',color:AC}}>{e.bmi}</span>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}