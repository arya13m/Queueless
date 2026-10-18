/* QueueLess admin analytics: live values only; never add synthetic baseline data. */
async function qlAdminStats(){
  if(!window.qlBackend) throw new Error('Supabase backend is not ready.');
  return await window.qlBackend.adminDashboardSummary();
}
function qlAdminPriorityQueue(){
  return qlGetOrders().flatMap(o=>(o.itemTracks||[]).filter(t=>t.status!=='collected').map(t=>({order:o,track:t})))
    .sort((a,b)=>qlPriorityMs(a.order)-qlPriorityMs(b.order)||a.order.createdAt-b.order.createdAt);
}
