import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
export const Route=createFileRoute("/_authenticated")({ssr:false,beforeLoad:async()=>{const {data}=await supabase.auth.getUser();if(!data.user)throw redirect({to:"/auth"});await supabase.rpc("claim_portfolio_admin");const {data:isAdmin}=await supabase.rpc("has_role",{_user_id:data.user.id,_role:"admin"});if(!isAdmin)throw redirect({to:"/"});return{user:data.user}},component:()=> <Outlet/>});
