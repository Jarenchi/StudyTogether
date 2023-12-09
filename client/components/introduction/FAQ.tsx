import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Questions = () => {
  return (
    <div className="my-10 mx-auto">
      <p className="text-4xl text-center mb-4">FAQ</p>
      <Accordion type="single" collapsible className="max-w-3xl mx-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger>如何查看我的個人學習進度？</AccordionTrigger>
          <AccordionContent>
            登入您的帳戶，前往DashBoard，您將能夠查看詳細的學習分析報告，包括使用時間等統計資料。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>我遇到技術問題該怎麼辦？</AccordionTrigger>
          <AccordionContent>請聯繫我們的客服團隊，您可以透過郵件提交您的問題，我們將儘快提供協助</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Questions;
