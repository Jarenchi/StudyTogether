import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "@/components/ui/use-toast";

export function handleApiError(error: any, router: AppRouterInstance) {
  const status = error?.response?.status;
  if (status === 403) {
    toast({ title: "登入已過期，請重新登入", variant: "destructive" });
    router.push("/login");
  } else if (status >= 500 && status < 600) {
    toast({ title: "伺服器錯誤，請稍後再試", variant: "destructive" });
  } else {
    toast({ title: "操作失敗，請稍後再試", variant: "destructive" });
  }
}
