/* ============================================================
   VetSense AI — Chart.js Helper Module
   ============================================================ */
window.Charts = (function(){
  const activeCharts = {};

  const defaults = {
    plugins: {
      legend:{ labels:{ color:'#8aadc8', font:{family:"'Inter',sans-serif",size:11}, boxWidth:10, padding:14 } },
      tooltip:{ backgroundColor:'#0d1b33', borderColor:'#243f6a', borderWidth:1, titleColor:'#f0f7ff', bodyColor:'#c4d8f0', cornerRadius:8, padding:10 }
    },
    scales:{
      x:{ grid:{ color:'rgba(28,51,86,0.5)' }, ticks:{ color:'#5a7898', font:{size:10} } },
      y:{ grid:{ color:'rgba(28,51,86,0.5)' }, ticks:{ color:'#5a7898', font:{size:10} } }
    }
  };

  function destroy(id){ if(activeCharts[id]){ activeCharts[id].destroy(); delete activeCharts[id]; } }

  function line(canvasId, labels, datasets, opts={}){
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    activeCharts[canvasId] = new Chart(ctx,{
      type:'line',
      data:{ labels, datasets: datasets.map(d=>({
        ...d, tension:0.4, fill:d.fill!==undefined?d.fill:true,
        pointRadius:3, pointHoverRadius:6,
        backgroundColor: d.fill===false ? 'transparent' : d.color ? d.color.replace(')',',0.1)').replace('rgb','rgba') : 'rgba(14,165,233,0.08)',
        borderColor: d.color || '#0ea5e9', borderWidth:2, pointBackgroundColor: d.color||'#0ea5e9'
      }))},
      options:{ responsive:true, maintainAspectRatio:false, animation:{duration:500},
        plugins:{ ...defaults.plugins, ...opts.plugins },
        scales:{ x:{ ...defaults.scales.x, ...(opts.xScale||{}) }, y:{ ...defaults.scales.y, ...(opts.yScale||{}) } }
      }
    });
    return activeCharts[canvasId];
  }

  function bar(canvasId, labels, datasets, opts={}){
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    activeCharts[canvasId] = new Chart(ctx,{
      type:'bar',
      data:{ labels, datasets },
      options:{ responsive:true, maintainAspectRatio:false, animation:{duration:500},
        plugins:{ ...defaults.plugins, ...opts.plugins },
        scales:{ x:{ ...defaults.scales.x, ...(opts.xScale||{}) }, y:{ ...defaults.scales.y, beginAtZero:true, ...(opts.yScale||{}) } },
        borderRadius: 5, ...opts
      }
    });
    return activeCharts[canvasId];
  }

  function doughnut(canvasId, labels, data, colors, opts={}){
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    activeCharts[canvasId] = new Chart(ctx,{
      type:'doughnut',
      data:{ labels, datasets:[{ data, backgroundColor:colors, borderColor:'#0d1b33', borderWidth:3, hoverOffset:6 }] },
      options:{ responsive:true, maintainAspectRatio:false, cutout:'70%', animation:{duration:500},
        plugins:{ ...defaults.plugins, legend:{ ...defaults.plugins.legend, position:'bottom' }, ...opts.plugins }
      }
    });
    return activeCharts[canvasId];
  }

  function radar(canvasId, labels, datasets, opts={}){
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    activeCharts[canvasId] = new Chart(ctx,{
      type:'radar',
      data:{ labels, datasets },
      options:{ responsive:true, maintainAspectRatio:false, animation:{duration:500},
        scales:{ r:{ grid:{color:'rgba(28,51,86,0.7)'}, angleLines:{color:'rgba(28,51,86,0.7)'}, ticks:{backdropColor:'transparent',color:'#5a7898',font:{size:9}}, pointLabels:{color:'#8aadc8',font:{size:10}} } },
        plugins:{ ...defaults.plugins, ...opts.plugins }
      }
    });
    return activeCharts[canvasId];
  }

  function riskGauge(canvasId, score, color){
    destroy(canvasId);
    const ctx = document.getElementById(canvasId);
    if(!ctx) return;
    activeCharts[canvasId] = new Chart(ctx,{
      type:'doughnut',
      data:{ datasets:[{
        data:[score,100-score],
        backgroundColor:[color,'rgba(28,51,86,0.4)'],
        borderColor:'transparent', borderWidth:0
      }]},
      options:{
        responsive:true, maintainAspectRatio:false, cutout:'78%', rotation:-90, circumference:180,
        plugins:{ legend:{display:false}, tooltip:{enabled:false} }, animation:{duration:800}
      }
    });
    return activeCharts[canvasId];
  }

  function riskTrend(canvasId, labels, data){
    const colors = data.map(v=>v>=70?'rgba(239,68,68,0.8)':v>=40?'rgba(234,179,8,0.8)':'rgba(34,197,94,0.8)');
    return bar(canvasId, labels, [{
      label:'Risk Score', data, backgroundColor:colors, borderColor:colors, borderWidth:0
    }], { yScale:{ max:100 } });
  }

  return { line, bar, doughnut, radar, riskGauge, riskTrend, destroy };
})();
