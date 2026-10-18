require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const PORT = Number(process.env.PORT || 3000);
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || '';
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use((req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');next();});
app.get('/api/health', (_req,res)=>res.json({ok:true,service:'QueueLess Express API',supabaseConfigured:Boolean(SUPABASE_URL&&SUPABASE_PUBLISHABLE_KEY)}));
function authenticatedClient(req,res,next){
  const header=req.get('authorization')||'';
  const match=header.match(/^Bearer\s+(.+)$/i);
  if(!match)return res.status(401).json({error:'Sign in first.'});
  if(!SUPABASE_URL||!SUPABASE_PUBLISHABLE_KEY)return res.status(503).json({error:'Supabase environment is not configured.'});
  req.sb=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:`Bearer ${match[1]}`}}});
  next();
}
app.get('/api/admin/summary',authenticatedClient,async(req,res)=>{
  try { const {data,error}=await req.sb.rpc('ql_admin_dashboard_summary'); if(error) return res.status(error.code==='42501'?403:400).json({error:error.message,code:error.code}); return res.json(data); }
  catch(e){return res.status(500).json({error:'Could not load admin summary.'});}
});
app.post('/api/orders',authenticatedClient,async(req,res)=>{
  const {items,pickupSlot,paymentMethod='demo-no-charge',instructions=null}=req.body||{};
  if(!Array.isArray(items)||!items.length||!pickupSlot)return res.status(400).json({error:'Items and pickup slot are required.'});
  try { const {data,error}=await req.sb.rpc('ql_create_order',{p_items:items,p_pickup_slot:pickupSlot,p_payment_method:paymentMethod,p_instructions:instructions}); if(error)return res.status(error.code==='42501'?403:400).json({error:error.message,code:error.code}); return res.status(201).json(data); }
  catch(e){return res.status(500).json({error:'Could not create order.'});}
});
app.patch('/api/order-items/:id/status',authenticatedClient,async(req,res)=>{
  const {status}=req.body||{};
  if(!['accepted','preparing','ready','collected'].includes(status))return res.status(400).json({error:'Invalid item status.'});
  try { const {data,error}=await req.sb.rpc('ql_update_item_status',{p_order_item_id:req.params.id,p_new_status:status}); if(error)return res.status(error.code==='42501'?403:400).json({error:error.message,code:error.code}); return res.json(data); }
  catch(e){return res.status(500).json({error:'Could not update item status.'});}
});
app.use(express.static(path.join(__dirname),{extensions:['html']}));
app.use((req,res)=>res.status(404).json({error:'Route not found.'}));
app.listen(PORT,()=>console.log(`QueueLess running at http://localhost:${PORT}`));
