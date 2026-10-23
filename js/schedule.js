document.addEventListener('DOMContentLoaded',()=>{
  /* 교육일정 표: 헤더 체크박스로 전체 선택 (비활성 행은 제외) */
  const all=document.querySelector('[data-check-all]');
  if(!all)return;
  const rows=()=>[...document.querySelectorAll('.table--detail tbody input[type=checkbox]:not(:disabled)')];
  all.addEventListener('change',()=>rows().forEach(box=>{box.checked=all.checked}));
  document.querySelector('.table--detail tbody').addEventListener('change',()=>{
    const list=rows();
    all.checked=list.length>0&&list.every(box=>box.checked);
  });
});
